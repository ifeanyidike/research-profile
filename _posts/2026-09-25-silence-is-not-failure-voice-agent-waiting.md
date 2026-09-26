---
layout: post
title: "Silence Is Not Failure: Teaching a Voice Agent to Wait"
date: 2026-09-25 00:00:00-0000
description: A caller asked for time, but the voice agent kept asking them to repeat themselves. I added a waiting state so the recovery timer could tell a deliberate pause from a missing reply.
tags: voice-ai engineering debugging real-time-systems
categories: engineering
related_posts: false
---

## TL;DR

- The model decided to wait, but a separate recovery timer treated the silence as a
  failure. In one incident, it issued six unnecessary recovery prompts across seven wait
  decisions.
- I added a waiting state that schedules one acknowledgement per pause and stops those
  turns from triggering the missing-response alarm. Check-ins and eventual hangup still
  work.
- While waiting, the model gets an extra instruction: recognize when the caller is ready
  again, even if they haven't answered the pending question yet.
- Tests cover event ordering and cleanup. A live development call also handled three
  separate pauses correctly. It wasn't a broad test of how people ask for time.

---

## The caller asked for time

A caller asked the voice agent to wait. The agent went quiet, then asked the caller to
repeat themselves. The caller asked for more time, and another recovery prompt followed.

Speech recognition had captured the words correctly. The model had also recognized the
pause request and returned a decision to keep waiting. Yet the caller kept hearing prompts
intended for a failed response.

This happened across seven consecutive long-wait decisions, with six recovery prompts
before the conversation resumed. Even when the caller indicated they were ready, the model
sometimes kept waiting. I needed to stop the unnecessary prompts and get the conversation
moving again when the caller returned.

In [my earlier turn-detection post]({% post_url
2026-07-15-llm-turn-detection-voice-agents %}), I described how the model decides whether a
caller has finished speaking. This problem came after that decision. The model could ask
the pipeline to wait, but the recovery code did not know why there was no reply.

---

## The timer did not know we were waiting

The model already returned markers to tell the pipeline whether the caller had finished
speaking. One marker, `◐`, meant a longer wait. It let the model hold off on a normal
response when the caller needed time.

A separate watchdog checked whether the assistant owed the caller an answer. In this case,
the watchdog starts a timer. If the expected response doesn't arrive, it prompts the caller
so they aren't left waiting indefinitely.

That helps when a provider stalls or a response never makes it to speech. But
a caller turn can also end because the person has finished asking for a pause. Our turn-stop
handler treated that closed turn as another unanswered request.

The watchdog was waiting for an answer that the model had deliberately withheld. When its
timer expired, it supplied a recovery prompt.

Increasing the timeout would have postponed the same mistake. It would also have delayed
recovery from genuine failures. We needed to tell the watchdog that this particular turn
was not waiting for an ordinary answer.

Google's older
[conversation-design guidance](https://developers.google.com/assistant/conversation-design/errors)
separates missing input, misunderstood input, and system errors. It notes that a person may
be silent because they are thinking. Asking someone to repeat themselves makes little sense
when they deliberately stopped talking.

---

## Remember the pause across turns

I added a small coordinator with two states: normal conversation and waiting.

It uses the model's existing long-wait marker. It does not inspect caller text or try
to recognize pause phrases with regular expressions. The model still interprets the
conversation. The coordinator remembers its decision so the recovery code can use it.

The main transitions are:

| Current state | Model decision               | What happens                                            |
| ------------- | ---------------------------- | ------------------------------------------------------- |
| Normal        | Caller needs more time       | Enter waiting and schedule one acknowledgement          |
| Waiting       | Caller still needs more time | Stay waiting without another acknowledgement            |
| Waiting       | Caller is ready or answers   | Leave waiting and use the normal response path          |
| Waiting       | Ordinary unfinished sentence | Leave this wait state and use short-incomplete handling |

The acknowledgement is a short scripted line: “Sure, take your time.”

I didn't want the agent to repeat that line every time the caller asked for more time.
The waiting state stays active across those requests. Once the caller resumes, it clears,
so a later pause can get a new acknowledgement.

This excerpt records which turn can trigger the acknowledgement. It runs after the code
has checked the turn identity and told the watchdog to stop expecting an answer:

```python
first_marker = not self._is_waiting
self._is_waiting = True
self._claimed_turns[identity] = None
if first_marker:
    self._acknowledgement_claims.add(identity)
```

Every wait turn is remembered, but only the first gets permission to acknowledge. No audio
plays here. The turn-stop handling uses that permission later. I've left the timing checks
and cleanup out of this excerpt.

The coordinator also tells the response watchdog to stop expecting a normal answer for
the wait turn. That is what prevents the false recovery prompt.

## Being ready is different from answering

The model still needed help recognizing when the caller had returned.

Someone can say they're ready without answering the pending question. They may want the
assistant to continue or remind them what it asked. The model should respond, rather than
keep waiting for an answer to that question.

While waiting is active, I add a temporary instruction to the model request. Being ready
counts as a completed turn. Asking for more time means keep waiting. If the caller answers
the question, the assistant responds normally. A mid-sentence cutoff still uses the existing
short-incomplete behavior.

When the caller is ready, the assistant can briefly restate the pending question, unless
another active instruction forbids repeating it. Asking the agent to resume shouldn't undo
the rules of its current task.

Once the wait ends, the temporary instruction is removed. Caller messages still go through
the normal model path. There is no separate phrase matcher deciding that a particular
sentence must mean readiness.

---

## Keep the check-ins

Waiting cannot mean disabling every timer. A caller can ask for time and then leave the
phone unattended.

The missing-response watchdog and the inactivity timer serve different purposes. The first
asks whether the assistant failed to answer. The second checks whether the conversation
has gone quiet for too long.

I disabled the missing-response alarm for intentional wait turns and kept the inactivity
handling. Repeated pause requests don't get another immediate acknowledgement. If the call
stays quiet, though, the usual reminders and eventual hangup still apply.

[LiveKit's session documentation](https://docs.livekit.io/agents/logic/sessions/)
also treats inactivity checks separately from missing-transcript timeouts. Its inactivity
example cancels pending check-ins when the person becomes active again and ends the session
after limited retries. Pipecat's
[idle-handling example](https://github.com/pipecat-ai/pipecat/blob/main/examples/turn-management/turn-management-detect-user-idle.py)
also limits the number of check-ins. Neither example replaces the application's decision
about what to do when someone explicitly asks for time.

The acknowledgement itself can fail. It might be rejected or cancelled before it plays.
Those paths restore inactivity handling, so a failed acknowledgement doesn't leave the
call with no timer running.

---

## The decision can arrive after the turn closes

The model request and the turn-stop callback do not always finish in the same order.

If the wait decision arrives first, the coordinator remembers which turn it belongs to.
When that turn's stop handler runs, it finds the wait record and skips arming the response
watchdog.

If the stop handler runs first, it may already have armed the watchdog. The later wait
decision cancels that pending alarm and handles the acknowledgement without
waiting for another stop event.

```text
Decision first:
  wait decision → remember turn → turn closes → skip response alarm

Turn closes first:
  turn closes → arm response alarm → wait decision → cancel response alarm
```

Both paths use the turn's identity and sequence number. A single waiting flag would not
be enough to tell a delayed event from an earlier turn apart from the current one.

A stop callback from an older wait turn can arrive after the caller has resumed. I keep
enough information to recognize that old turn, but remove its permission to trigger an
acknowledgement. Otherwise, the assistant could offer to wait after the conversation has
already moved on.

There is a different case when the caller resumes within the same still-open turn. That
turn now needs an ordinary answer, so its wait record must be removed. Otherwise the code
would suppress recovery for a real answer that later failed.

The coordinator keeps a limited number of pending records. It clears them when the assistant
becomes inactive or its worker is cleaned up. If the turn identity is missing, or the
watchdog cannot safely defer, the new path leaves the existing incomplete-turn timeout
in place.

---

## What the tests showed

One regression test replays seven consecutive wait decisions and checks that only the
first gets permission to acknowledge. Separate tests check that a new pause can get an
acknowledgement after the caller resumes.

Here is a shortened version of that test, with generic turn IDs. The setup is omitted:
`coordinator` starts in the normal state, its watchdog callback accepts the wait, and each
turn is marked as waiting before its stop event is handled.

```python
acknowledgements = []
for sequence in range(1, 8):
    turn_id = f"turn:{sequence}"
    assert coordinator.claim_long_wait({
        "user_turn_id": turn_id,
        "user_turn_sequence": sequence,
    })
    claim = coordinator.consume_claim(turn_id, sequence)
    assert claim is not None
    acknowledgements.append(claim.should_acknowledge)

assert acknowledgements == [True, False, False, False, False, False, False]
```

`consume_claim` is what the turn-stop handler calls to collect the saved decision. These
booleans represent permission to acknowledge, not proof that audio was played.

Other tests cover both event orders, delayed stop callbacks, failed acknowledgements,
and the case where a resumed answer still needs watchdog protection. The model-request
tests check that the temporary readiness instruction is present only while waiting and
doesn't override instructions against repeating the question.

These tests supply the wait marker themselves or check the instructions sent to the model.
They don't tell us whether the model will recognize all the ways someone might ask for time.

I also tested this on a live development call with three separate pauses. The assistant
acknowledged each one. When asked for more time during the same pause, it didn't acknowledge
again. The conversation resumed normally.
No speech-recognition, model, speech-generation, watchdog, or fallback recovery fired
during that test call.

The code was merged with the feature disabled by default. The test call showed that those
cases worked. It didn't establish how the model would handle other ways of asking for time
or resuming. We still lacked a formal evaluation suite to test that wider range of language.
