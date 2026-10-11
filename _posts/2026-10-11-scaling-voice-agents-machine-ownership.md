---
layout: post
title: "Handling More Calls at Once with a Pool of Fly Machines"
date: 2026-10-11 00:00:00-0000
description: How I used a pool of Fly machines to handle more voice calls at once, keep room for incoming callers, and reuse machines safely after calls ended.
tags: voice-ai engineering distributed-systems
categories: engineering
related_posts: false
---

## TL;DR

- I configured a pool of ten machines, with one live call per machine. Some stayed running for incoming calls. Others stayed suspended until needed.
- Suspended machines had the same idle storage cost as stopped machines, with no CPU or RAM charges while suspended. That let us keep spare machines without paying to run them all day.
- The system reserved a machine before sending a call to it. If the call connected somewhere else, it tracked that machine instead.
- A machine could take another call while finishing cleanup from the last one. It could suspend only after all work had finished and new calls were blocked.
- A suspend request could still take effect after it timed out. I kept those machines out of the pool until the controller resolved what had happened.
- A sustained load test was still planned to check how many simultaneous calls the whole service could handle through setup, conversation, and cleanup.

---

## Making room for more calls

Our voice service used Pipecat on Fly.io to handle live audio. A separate application on Heroku set up and scheduled the calls. I wanted the service to handle more calls at once while keeping room for people calling in.

We had two types of calls: inbound calls from people calling us, and outbound calls that the service dialed. Outbound jobs could wait before dialing. An inbound caller was already on the phone.

Adding machines was part of the work. We also needed to know which machines could take a call. A machine might be reserved for a call that hadn't connected yet. It might have a live call, or still be cleaning up after one. Counting only live calls would miss some of that work.

We had already seen that problem in production. Some outbound calls never connected, but their reservations stayed in place until they expired. Other calls were then refused, even though the machine had no live audio calls. The error was `active_call_limit`. The log counted active calls but left out the reserved slots.

The archived logs contained six capacity-rejection entries in that hour. Several entries could belong to the same attempt, so I couldn't count them as six callers. A database search alone could miss these failures. Prewarm, the step that prepared the machine for an outbound call, could fail before the application saved a record of the attempt.

I fixed the reservation release first. Once a call that never connected reached a final outcome, its slot could be released. The machine pool came afterward. It gave us a way to assign calls across more machines, keep some ready for inbound calls, and suspend machines when they weren't needed.

In my [Pipecat migration post]({% post_url 2026-07-05-pipecat-migration-voice-ai %}), I wrote about keeping automatic stopping disabled. I kept that setting. A new controller, running as a background worker, checked the machines and decided when each one could safely suspend.

I chose one live call per machine to keep calls separate. Pipecat didn't require that limit; it was our choice. I configured ten machines, giving the pool ten potential call slots. Each machine had to be running and pass its admission checks before taking a call.

Those slots served both inbound and outbound calls. The outbound limit kept some capacity free for inbound callers, so an outbound batch couldn't use all ten slots by itself.

I created the virtual machines ahead of time. Some stayed running. Others stayed suspended, with their application state saved so they could resume later.

That saved state is called a snapshot. Resuming it could avoid loading the application from scratch. But [Fly's documentation](https://docs.fly.io/reference/suspend-resume) warns that a deployment or machine migration can invalidate or lose the snapshot. The next start would then be a cold start: the application would have to load again.

---

## Why I chose suspension

I first tested starting a stopped machine when we needed another call slot. In four early tests on isolated machines, the time from the start command to a passing health check ranged from 16.2 to 18.9 seconds. One startup log showed about 11.4 seconds spent importing Python modules, before the audio components finished initializing.

Creating a machine could take longer still. Earlier measurements showed roughly 28–30 seconds when the host had to download the application image first. Creating the machines ahead of time avoided that download, but starting a stopped machine still meant loading the application again.

That was too long to rely on when an inbound caller was already waiting. An outbound job could prepare a machine before dialing, but the same pool also had to serve incoming calls.

I then tested suspension. It saved the loaded application's state in a snapshot. Across four resume tests, the machine passed its health check in 1.59–1.77 seconds. That gave us a quicker way to bring another call slot online when the ready machines were busy.

Cost helped make the decision too. [Fly bills suspended and stopped machines the same way while idle](https://docs.fly.io/reference/suspend-resume/#billing): storage only, with no CPU or RAM charges. Keeping the application loaded in a snapshot didn't mean paying to keep the machine running.

The [published root filesystem rate](https://docs.fly.io/about/pricing#stopped-fly-machines) was $0.15 per GB for 30 days. For example, a machine with 1 GB of root filesystem would cost 15 cents if it stayed stopped or suspended for that whole period. Once either machine started running, normal compute billing applied by the second. This was a pricing check, not a measured saving from our production bill.

I chose to suspend idle machines and keep some running for inbound calls. These early probes used a test build. I later checked startup again from Heroku with the production application image.

---

## Checking startup from Heroku

A suspended machine still had to resume before taking a call. Heroku would send that request in production, so I needed to measure the wait from there.

During review, we tested two isolated Fly machines from Heroku. They used the production application image and feature settings. We ran 30 suspend/resume attempts and eight cold boots. For the cold boots, configuration updates discarded the snapshots.

We measured from the start request until the application's health endpoint reported that it could accept a call:

| Test path                           |  Median |     p95 | Maximum |
| ----------------------------------- | ------: | ------: | ------: |
| Suspend/resume attempts, 30 samples |  0.53 s |  1.11 s |  4.67 s |
| Cold boots, 8 samples               | 11.76 s | 12.41 s | 12.57 s |

The p95 column is the estimated 95th percentile: about 95% of the measured attempts finished within that time. With only eight cold boots, that estimate is rough.

No calls were running during these tests. They measured how quickly another machine became ready. We still needed to test it under call traffic. We also hadn't confirmed that every resume attempt actually restored a snapshot.

The slowest resume attempt took 4.67 seconds. I increased the maximum resume wait for an inbound call from three seconds to five. Setup continued as soon as the machine was ready.

The application built the call configuration first. It then waited up to five seconds for the machine, provided that much time remained in the overall setup timeout.

I kept the full timeout for building the configuration because the call needed it to start. If the machine took too long to resume, setup could use the existing direct route to the media service as a fallback.

Stopped machines needed a cold start. I left them out of the quick resume choices for inbound calls and let the controller start them in the background.

---

## Reserve a machine before sending the call

The pool kept a minimum number of machines free and running for inbound calls. An outbound job could use one only if enough stayed free. Otherwise, it could reserve a suspended machine and prepare it. I also set a limit on simultaneous outbound calls.

This stopped outbound jobs from taking every ready slot. Inbound calls could still fill the reserve, so the pool still had a limit.

If an outbound job couldn't get a slot, the scheduler deferred it until a later attempt. Nobody had been dialed yet. I wanted to count those delays separately from calls that were dialed and then failed.

Health checks alone weren't enough. In an early experiment, routing took up to 37 seconds to reflect a change in health. Even an instant check would leave a race: two requests could see the same free machine and both try to use it.

I stored reservations in Redis using [WATCH and transactions](https://redis.io/docs/latest/develop/using-commands/transactions/). The code read the pool record and chose a machine. Redis saved the reservation only if the record hadn't changed since that read. If another request changed it first, the code read it again and retried.

Each reservation, also called a claim, had a request ID and a generation number. The generation increased each time the machine was assigned again. The code checked both values before releasing it. That stopped a late notification from an old call from releasing a newer call's machine.

Here is the release check in simplified pseudocode:

```python
def release_claim(state, request_id, generation):
    # Run inside the conditional Redis state update.
    machine = find_claim(state, request_id)
    if machine is None or machine.generation != generation:
        return False

    machine.state = "cooldown"
    return True
```

A successful release put the machine into `cooldown`. It stayed running while the controller checked the media server. Only then could it become available again.

I couldn't release an active claim just because it was old. Setup might have been abandoned. But the call might also still be running, with a missing notification. The controller needed to check.

---

## Get the call to its reserved machine

A reserved machine could report itself unavailable to ordinary traffic. That kept other calls away. But the call that reserved it still needed a way to reach it.

Routing code on the media server couldn't help until the request reached that server. If Fly saw no available servers, the request could stall before our code ran.

I added a small router. It stayed healthy even when the media servers were full. It received the connection request and asked Fly Proxy to send it to the reserved machine. Fly calls this a replay:

```text
application reserves a machine in Redis
                 |
                 v
telephony connection request
                 |
                 v
router asks Fly Proxy to target that machine
                 |
                 v
media server checks capacity, then accepts WebSocket
```

Fly's [dynamic request routing](https://docs.fly.io/networking/dynamic-request-routing) can target a specific application and machine. The replay happened before the WebSocket connection was accepted. The media server then accepted the connection and handled the audio directly. The Python router handled only the initial request. It couldn't move an already connected call.

Sometimes a fallback sent the call to a different machine. That machine reported back when it accepted the call, so the pool knew where the call was running.

The outbound count had to follow the call too. The original machine could be idle while the call ran elsewhere. I kept counting that call until it finished on the machine handling it. Otherwise, the scheduler could dial too many calls.

---

## Reuse a machine before cleanup finishes

A call could end while the process was still doing cleanup. I wanted the machine to take another call during that work. Suspending it was a different matter: it had to stay awake until cleanup finished.

The local admission code, which decided whether to accept a call, tracked four kinds of work:

| Local state                  | Blocks another call slot | Blocks suspension |
| ---------------------------- | ------------------------ | ----------------- |
| Connection setup in progress | Yes                      | Yes               |
| Reserved call slot           | Yes                      | Yes               |
| Active media call            | Yes                      | Yes               |
| Remaining post-call work     | Not by itself            | Yes               |

The machine still checked that it had enough memory before accepting another call.

Before suspending it, the controller had to close another race. A machine might have no active calls when checked, then receive a new connection just before the suspend request.

I added a drain operation to block new calls. Draining and starting a connection used the same lock. If setup started first, the drain failed. If the drain succeeded first, the new connection was refused.

The machine accepted a drain only when all four counts in the table were zero. It then stayed closed to new calls while the controller prepared to suspend it.

---

## A suspend request can finish after its timeout

Updating Redis and sending a request to Fly were separate operations. A Redis transaction couldn't make them succeed or fail together.

A timeout made that difficult:

1. The media process confirms it is idle and blocks new calls.
2. The controller sends a suspend request.
3. The request times out without a clear answer.
4. The machine still appears to be running.

The machine still looked available at step four. But the suspend request might take effect later, in the middle of its next call.

Before sending the suspend request, the controller marked the machine in Redis so no new call could be assigned to it. That record stayed in place if the controller crashed or lost the response.

If the controller confirmed that the machine had suspended, it updated the record. Otherwise, the machine stayed quarantined: kept out of the available pool.

To recover, the controller acquired a fresh Fly machine lease. A lease gives temporary permission to manage the machine. The controller then checked its state again.

If the machine was running, the controller asked it to drain again. If a call was active, it waited. It needed a fresh idle check even with the new lease.

Once the machine was safe to retire, the controller replaced it. The old machine never returned to the pool. A delayed suspend request for that old machine couldn't affect a call on its replacement.

---

## Keep taking calls when management requests fail

A failed request to manage a machine didn't always mean we had no capacity. Running media servers could still have room.

The controller sent a regular heartbeat to show it was alive. If the heartbeat stopped, an inbound call could still use a known free, running machine. If there wasn't one, setup could try the existing direct route.

If the Fly Machines API failed, the controller stopped starting and suspending machines. It could still check known running servers directly. Those checks could confirm that a call had finished even when Fly couldn't return an updated machine list.

Call setup needed Redis for both configuration and reservations. When Redis was unavailable in the test, the caller heard a short apology. No media stream opened.

A confirmed full pool also returned an apology, so the caller wasn't left waiting for a machine the system couldn't provide.

After rollout, some slow or failed management requests triggered alerts even though calls had connected. We checked those calls and found that the alerts didn't tell us whether callers had been affected.

I gave background controller operations more time. Call setup kept its existing timeouts. Repeated failures counted toward an alert, at most once per minute. A successful controller run reset the count.

Some errors still triggered an immediate alert. A call might reach the wrong pinned machine, meaning the machine specifically chosen for it. Or a drained machine might no longer pass the checks that made it safe to suspend. Those errors could affect calls directly.

---

## What was running in production

I checked production on October 11, 2026. The outbound pool was released on October 5, and the inbound pool on October 6. Both were enabled. The controller heartbeat was recent, and the running and suspended machine states in Redis matched Fly's machine list.

The live settings confirmed ten machines and a pool ceiling of ten. With one live call per machine, the allocator had ten potential slots. How many of them were usable at a given moment depended on machine readiness, reservations, and admission checks.

The deployed system could assign calls across that pool, resume extra machines when needed, and keep room for inbound callers. It also tracked reservations and finished calls so slots could be reused safely.

To measure sustained capacity, we needed to send enough inbound and outbound calls to exercise the ten-slot pool. Calls had to keep arriving as earlier ones ended and cleanup ran. That test would show how much concurrent work the whole service could handle, including the speech providers and report workers.

At the time of writing, that full load test was still planned. Ten was the configured pool ceiling. We hadn't yet established a sustained capacity benchmark for the complete service.

In three outbound-start failures we examined after rollout, the reserved machine wasn't ready before setup timed out. Each call connected on another machine, and its media stream ended normally. That confirmed the fallback had preserved those connections. It didn't tell us how every conversation sounded.

I searched the retained media-server logs for October 7–9 too. They contained stream-start records but no matching prewarm or local capacity-rejection entries. I checked all results from that search. It still left out some admission decisions made by the application, so I couldn't claim that no caller had been refused.

Some refusals could happen before the application saved an attempt record. Until those were recorded, I couldn't calculate a complete capacity-refusal rate from the call tables.

---

## What the tests covered

The automated tests checked what happened when two requests wanted the same machine. They also covered late notifications, new connections during a drain, fallback routing, and suspend requests whose outcome was unknown.

On temporary machines, we tested real phone connections with the router down, the management API unavailable, and the pool full. Live calls went through the call and cleanup code too.

A separate investigation sent 6,000 successful requests containing synthetic call events. That checked event ingestion: whether the service could receive and store those events. It didn't run 6,000 phone calls through speech recognition, the language model, speech synthesis, or post-call processing.

The full load test was still planned at the time of writing. It would cover simultaneous inbound calls, outbound calls, and a mix of both. Until then, I couldn't give a tested concurrency limit for the whole service.

---

## What I would improve next

There were a few things I wanted to test next.

### Measure occupied slots and waiting calls

I'd start by saving each call attempt before deciding whether to accept it. The record would then show what happened: admitted, deferred, refused, failed during setup, or connected. Retries would link back to the original attempt so they weren't counted as new callers.

I'd track active calls, reserved slots, and ready machines over time. I'd also measure how long outbound jobs waited for capacity, and how long a finished slot took to become available again.

Inbound refusals and outbound deferrals would have separate counts. With an inbound refusal, someone calling in couldn't be served. With an outbound deferral, the job waited before dialing anyone.

That would help explain why work was waiting. The pool might be full, a machine might be slow to resume, or a finished call might still be holding its slot.

### Test more simultaneous calls

I'd start test calls on a schedule, even when earlier calls were still running. If the test waited for each call to finish, a slow service would receive fewer new calls. That could hide overload. Grafana explains this in its [open and closed load-model documentation](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/).

The test would use a telephony harness to send real audio through the full pipeline. I'd raise the number of simultaneous calls in stages toward the configured pool ceiling, using both inbound and outbound calls. Each stage would run long enough for calls to end, cleanup to finish, and new calls to take their places. I'd keep call durations and the inbound/outbound mix similar between runs.

I'd include unanswered calls and inbound calls arriving during a busy outbound batch. I'd also test a lost snapshot and one unavailable machine.

I'd measure sustained concurrency, admission failures, outbound waiting time, and completed calls per minute. I'd check audio quality, response delays, interruptions, and report completion as the load grew. Before running it, we'd agree on a traffic limit and conditions for stopping the test.

### Prepare machines before a scheduled batch

We know when scheduled outbound batches are due. I'd test resuming extra machines shortly before a batch, then keeping them warm between calls that were close together. That might reduce repeated suspend/resume cycles.

Fly supports [scaling from metrics such as pending work or queue depth](https://docs.fly.io/launch/autoscale-by-metric). Our existing controller could use those signals to decide when to prepare more machines. It would still perform the drain checks and respect provider limits.

I'd compare waiting time, how often calls used the fallback, and how long machines stayed running. Those results would help choose how long to keep them warm.

### Share outbound capacity and spread out retries

The outbound limit keeps room for inbound calls. We still need to decide which waiting batch goes next. I'd consider per-account waiting limits and a maximum waiting time. That would help keep one large batch from taking every newly available slot. Google's [overload guidance](https://sre.google/sre-book/handling-overload/) discusses per-customer limits for this problem.

I'd also spread retry times out a little, within the allowed calling window. If every deferred job retried on the same scheduler tick, we'd get another burst. AWS's [guidance on backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/) explains why adding some variation helps. Retries would still have to preserve call identity and prevent duplicate dials.

The attempt records and full-call load test would come first. I'd want to see where calls started failing or waiting as the load grew. Extra machines might help, but speech providers, Redis, or report workers could become the next bottleneck.
