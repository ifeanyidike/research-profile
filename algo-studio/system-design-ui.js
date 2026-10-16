import { systemLessons, systemStages, systemLessonById, systemSources } from "./system-design-course.js?v=20261016-system-audit1";
import {
  systemProgress,
  systemCanOpen,
  systemMissingPrerequisites,
  systemNext,
  systemCanComplete,
  completeSystemLesson,
  completeSystemReview,
  notebookPrompts,
  capacityModel,
  cacheModel,
  queueModel,
} from "./system-design-model.js?v=20261016-system-audit1";
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const steps = ["Understand", "Example", "Decide", "Explain"];
const number = (n) => (Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "not draining");
const link = (id, text, style = "primary") => `<a class="button ${style}" href="#system/${id}">${esc(text)} <span aria-hidden="true">→</span></a>`;
export function createSystemDesign({ getState, save, render, activeDay }) {
  const $ = (s) => document.querySelector(s);
  const update = (id, fields) => {
    const state = getState();
    state.systemDesign ??= {};
    Object.assign((state.systemDesign[id] ??= {}), fields);
    save();
  };
  function overview() {
    const state = getState(),
      next = systemNext(state),
      count = systemLessons.filter((l) => state.systemDesign?.[l.id]?.completedAt).length;
    const reviews = systemLessons.filter((l) => state.systemDesign?.[l.id]?.completedAt && state.systemDesign[l.id].reviewDue <= Date.now());
    const resume = next && !!state.systemDesign?.[next.id];
    return `<div class="system-track sd-dashboard"><div class="sd-track-switch"><a href="#home">Algorithms</a><span aria-current="page">System design</span></div>
      <header class="sd-dashboard-heading"><span class="eyebrow green">PRACTICAL ENGINEERING + INTERVIEWS</span><h1>System design, one clear step at a time.</h1><p>Learn how real systems work. Make a choice, see what happens, and explain why.</p><div class="sd-course-meta"><span>30 guided lessons</span><span>5 stages</span><span>6 design studios</span></div></header>
      <div class="sd-start-grid"><section class="sd-next-card" aria-labelledby="sd-next-title"><div class="sd-next-meta"><span>${next ? `${resume ? "PICK UP WHERE YOU LEFT OFF" : "YOUR NEXT LESSON"} · ${String(next.position).padStart(2, "0")}` : "GUIDED PATH COMPLETE"}</span><span>${next ? `Stage ${next.stage + 1} of 5` : "30 of 30"}</span></div><h2 id="sd-next-title">${next ? esc(next.title) : "Keep putting the ideas to work."}</h2><p>${next ? esc(next.idea) : "Revisit your designs and practise explaining your choices."}</p>${next ? link(next.id, resume ? "Continue lesson" : "Start lesson") : '<a class="button primary" href="#system/review">Open your reviews →</a>'}<div class="sd-course-progress"><div><span>${count} of ${systemLessons.length} lessons complete</span><span>${Math.round((count / systemLessons.length) * 100)}%</span></div><progress max="30" value="${count}" aria-label="Completed system design lessons">${count} of 30</progress></div></section>
      <section class="sd-method-card" aria-labelledby="sd-method-title"><span class="eyebrow green">LEARN BY DOING</span><h2 id="sd-method-title">A small loop. A clearer idea.</h2><ol><li><span>1</span><div><strong>Understand the idea</strong><small>A short, plain explanation.</small></div></li><li><span>2</span><div><strong>See it happen</strong><small>Follow a real example, step by step.</small></div></li><li><span>3</span><div><strong>Make a decision</strong><small>Try first. Get useful feedback.</small></div></li><li><span>4</span><div><strong>Explain your choice</strong><small>Build confidence in your own words.</small></div></li></ol></section></div>
      <div class="sd-outline-heading"><div><span class="eyebrow green">YOUR LEARNING PATH</span><h2>From one request to a complete system.</h2></div><a class="subtle-link" href="#system/review">${reviews.length ? `${reviews.length} reviews ready` : "Review & notebooks"} →</a></div>
      <div class="sd-stages">${systemStages
        .map(
          (stage, i) =>
            `<details class="sd-stage" ${next?.stage === i || (!next && i === 4) ? "open" : ""}><summary><span class="sd-stage-number">0${i + 1}</span><span><strong>${stage.title}</strong><small>${stage.summary}</small></span><span class="sd-stage-count">${systemLessons.filter((l) => l.stage === i && state.systemDesign?.[l.id]?.completedAt).length} / 6 complete</span></summary><ol>${systemLessons
              .filter((l) => l.stage === i)
              .map((l) => {
                const done = state.systemDesign?.[l.id]?.completedAt,
                  available = systemCanOpen(state, l.id);
                return `<li><a href="#system/${l.id}" ${next?.id === l.id ? 'aria-current="step"' : ""}><span class="sd-lesson-status ${done ? "done" : ""}" aria-label="${done ? "Complete" : available ? "Ready" : "Preview; earlier lesson recommended"}">${done ? "✓" : String(l.position).padStart(2, "0")}</span><span><strong>${esc(l.title)}</strong><small>${esc(l.idea)}</small></span><span class="sd-row-tag">${done ? "Revisit" : next?.id === l.id ? "Up next →" : available ? "Start →" : "Preview"}</span></a></li>`;
              })
              .join("")}</ol></details>`
        )
        .join("")}</div>
      <details class="sd-sources"><summary>How this path was designed · sources & scope</summary><p>Original examples, informed by public curricula and primary engineering references. Foundations come before complete designs. Retrieval practice and self-explanation help you revisit ideas. The review intervals are a product choice, not a research-proven schedule for every learner.</p><p>This path covers core high-level system design. It is not an exhaustive distributed systems degree. Consensus algorithms, storage-engine internals, advanced networking, and low-level object-oriented design need further study. Completing a checklist is practice, not proof of mastery.</p>${Object.values(
        systemSources
      )
        .map(([title, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${esc(title)} ↗</a>`)
        .join("")}</details></div>`;
  }
  function diagram(l, focus) {
    return `<div class="sd-flow" aria-label="Sketch of the roles in this example">${l.diagram.map((node, i) => `${i ? '<span class="sd-flow-arrow" aria-hidden="true">↔</span>' : ""}<span class="sd-flow-node ${focus === i ? "sd-flow-active" : ""}">${esc(node)}</span>`).join("")}</div><p class="sd-caption">A small sketch of the roles. Follow the example steps for the actual reads, writes, and decisions.</p>`;
  }
  function terms(l) {
    return `<details class="sd-terms"><summary>New words, explained simply</summary><dl>${l.terms.map(([word, meaning]) => `<div><dt>${esc(word)}</dt><dd>${esc(meaning)}</dd></div>`).join("")}</dl></details>`;
  }
  function solved(l) {
    return `<ol class="sd-solution-steps">${l.solutionSteps.map((text) => `<li>${esc(text)}</li>`).join("")}</ol>`;
  }
  function walk(l, d) {
    const f = l.frames[d.walkIndex];
    return `<section class="sd-paper sd-example-paper"><span class="eyebrow green">A WORKED EXAMPLE</span><h2>Follow what changes.</h2><div class="sd-example-progress" aria-label="Example step ${d.walkIndex + 1} of ${l.frames.length}"><span>Step ${d.walkIndex + 1} of ${l.frames.length}</span><div aria-hidden="true">${l.frames.map((_, i) => `<span class="${i <= d.walkIndex ? "reached" : ""}"></span>`).join("")}</div></div><div class="sd-scenario"><strong>The situation</strong><p>${esc(l.scenario)}</p></div><details class="sd-example-sketch"><summary>See the parts in this example</summary>${diagram(l, f.focus)}</details><section class="sd-current-step" aria-labelledby="sd-frame-title"><span class="eyebrow green">WHAT HAPPENS NOW</span><h3 id="sd-frame-title" tabindex="-1">${esc(f.action)}</h3><dl class="sd-frame-facts" aria-label="What we know at this step">${f.facts.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl><div class="sd-frame-why"><strong>Why this step matters</strong><p>${esc(f.why)}</p></div></section><div class="sd-walk-controls"><button class="button secondary" id="sd-walk-back" ${d.walkIndex === 0 ? "disabled" : ""}>← Back a step</button>${d.walkIndex === l.frames.length - 1 ? '<button class="button primary" data-sd-step="2">Try a decision →</button>' : '<button class="button primary" id="sd-walk-next">Next example step →</button>'}</div><details class="sd-walk-history"><summary>Steps so far</summary><ol>${l.frames
      .slice(0, d.walkIndex + 1)
      .map((frame) => `<li>${esc(frame.action)}</li>`)
      .join("")}</ol></details></section>`;
  }
  function question(l, d, review = false) {
    const selected = review ? d.reviewAnswer : d.answer,
      checked = review ? d.reviewChecked : d.checked;
    return `<fieldset class="sd-question"><legend>${esc(l.check.prompt)}</legend>${l.check.options.map((option, i) => `<label class="sd-choice ${checked && selected === i ? (i === l.check.answer ? "correct" : "incorrect") : ""}"><input type="radio" name="sd-answer" value="${i}" ${selected === i ? "checked" : ""}/><span>${esc(option)}</span></label>`).join("")}</fieldset><button class="button primary" id="sd-check" ${selected < 0 || checked ? "disabled" : ""}>Check my decision</button><div id="sd-feedback" class="sd-feedback" role="status" tabindex="-1">${checked ? `<strong>${selected === l.check.answer ? "That fits this situation." : "Try the reasoning again."}</strong><p>${esc(l.check.why[selected])}</p>` : "Choose an answer, then check it. A wrong attempt is useful practice."}</div>`;
  }
  function range(field, label, value, min, max, step = 1, suffix = "") {
    return `<label class="sd-range" for="${field}"><span>${label}<output id="${field}-value" for="${field}">${number(value)}${suffix}</output></span><input type="range" data-sd-lab="${field}" id="${field}" value="${value}" min="${min}" max="${max}" step="${step}"/></label>`;
  }
  function lab(l, d) {
    if (!l.lab) return "";
    let controls = "",
      title = "",
      desc = [];
    if (l.lab === "capacity") {
      title = "How much work reaches the app?";
      desc = [
        "Change one assumption and watch the estimate.",
        "For this exercise, pretend each application server can handle 100 requests per second. This is an assumed number, not a promise about real hardware.",
        "The model splits work evenly between servers and assumes the database has enough capacity.",
      ];
      controls =
        range("labUsers", "Daily active users", d.labUsers, 100, 100000, 10) +
        range("labActions", "Requests per user per day", d.labActions, 1, 100) +
        range("labPeak", "Peak / average", d.labPeak, 1, 20, 1, "×") +
        range("labServers", "App servers", d.labServers, 1, 10);
    } else if (l.lab === "cache") {
      title = "Watch the database misses";
      desc = [
        "Assume each cache miss needs one database read. A hit avoids that read.",
        "The model holds traffic steady. It leaves out write work, cache delays, and many readers missing the same key at once.",
        "Choose ‘cache unavailable’ to send every read to the source.",
      ];
      controls =
        range("labReads", "Reads each second", d.labReads, 100, 5000, 100) +
        range("labHit", "Cache hit rate", d.labHit, 0, 100, 1, "%") +
        range("labSource", "Source read capacity / second", d.labSource, 50, 1000, 50) +
        '<button class="button secondary" id="sd-cache-fail">Try cache unavailable</button>';
    } else {
      title = "Can the workers catch up?";
      desc = [
        "Jobs arrive at a steady pace. Each worker finishes a fixed number each second.",
        "For this model, jobs take equal work and workers never fail.",
        "Real queues also need plans for bursts, slow jobs, retries, and storage limits.",
      ];
      controls =
        range("labArrival", "Jobs arriving / second", d.labArrival, 0, 50) +
        range("labWorkers", "Workers", d.labWorkers, 1, 10) +
        range("labRate", "Jobs per worker / second", d.labRate, 1, 10) +
        range("labSeconds", "Seconds elapsed", d.labSeconds, 1, 120) +
        range("labBacklog", "Starting queued jobs", d.labBacklog, 0, 500, 10);
    }
    return `<section class="sd-lab" aria-labelledby="sd-lab-title"><span class="eyebrow green">CHANGE IT. SEE WHAT HAPPENS.</span><h3 id="sd-lab-title">${title}</h3><div class="sd-lab-explain">${desc.map((text) => `<p>${esc(text)}</p>`).join("")}</div><div class="sd-lab-grid"><div>${controls}</div><div class="sd-lab-results" id="sd-lab-results" aria-live="polite">${labResults(l, d)}</div></div></section>`;
  }
  function labResults(l, d) {
    if (l.lab === "capacity") {
      const m = capacityModel(d);
      return `<span class="sd-big-number">${number(m.peak)}<small>peak requests / second</small></span><dl><div><dt>Daily work</dt><dd>${number(m.daily)} requests</dd></div><div><dt>Daily average</dt><dd>${number(m.average)} / second</dd></div><div><dt>App capacity in this model</dt><dd>${number(m.capacity)} / second</dd></div><div><dt>Peak / app capacity</dt><dd>${number(m.utilization * 100)}%</dd></div></dl><p class="sd-lab-verdict">${m.peak >= m.capacity ? "No spare app capacity. At or above capacity, small bursts or slower work can create waiting." : "The simplified app capacity exceeds the estimated peak. Leave headroom and measure the real bottleneck."}</p>`;
    }
    if (l.lab === "cache") {
      const m = cacheModel(d);
      return `<span class="sd-big-number">${number(m.misses)}<small>source reads / second</small></span><dl><div><dt>Cache hits</dt><dd>${number(m.hits)} / second</dd></div><div><dt>Miss calculation</dt><dd>${number(d.labReads)} × ${100 - d.labHit}%</dd></div><div><dt>Source capacity</dt><dd>${number(d.labSource)} / second</dd></div></dl><p class="sd-lab-verdict">${m.overloaded ? "The source is overloaded in this model. Plan for misses, not only happy-path hits." : m.misses === d.labSource ? "The source is at its limit, with no headroom." : "The source can cover these misses in the model. Try losing the cache."}</p>`;
    }
    const m = queueModel(d);
    return `<span class="sd-big-number">${number(m.backlog)}<small>queued jobs after ${d.labSeconds} seconds</small></span><dl><div><dt>Worker capacity</dt><dd>${d.labWorkers} × ${d.labRate} = ${m.capacity} / second</dd></div><div><dt>Arrivals − capacity</dt><dd>${m.change} / second</dd></div><div><dt>Time to drain this backlog</dt><dd>${Number.isFinite(m.drainSeconds) ? `${number(m.drainSeconds)} seconds` : "Will not drain at this rate"}</dd></div></dl><p class="sd-lab-verdict">${m.change > 0 ? "The backlog keeps growing. A queue buys time; it does not fix too little processing capacity." : m.change === 0 ? "Workers just match arrivals. Any existing backlog stays; there is no spare capacity to clear it." : "Workers have spare capacity in this model and can clear a backlog while new jobs arrive."}</p>`;
  }
  function notebook(l, d) {
    if (l.stage !== 4) return "";
    const [field, title, prompt] = notebookPrompts[d.notebookIndex];
    return `<section class="sd-notebook"><span class="eyebrow green">YOUR DESIGN NOTEBOOK · ${d.notebookIndex + 1} OF 6</span><h3>${title}</h3><label for="sd-notebook-input">${prompt}</label><textarea id="sd-notebook-input" data-sd-field="${field}" rows="7" maxlength="20000" placeholder="Use your own words. State assumptions rather than guessing silently.">${esc(d[field])}</textarea><div class="sd-walk-controls"><button class="button secondary" data-sd-notebook="${d.notebookIndex - 1}" ${d.notebookIndex === 0 ? "disabled" : ""}>Previous prompt</button><span id="sd-notebook-count">${notebookPrompts.filter(([f]) => d[f].trim().length >= 20).length}/6 drafted</span><button class="button secondary" data-sd-notebook="${d.notebookIndex + 1}" ${d.notebookIndex === 5 ? "disabled" : ""}>Next prompt →</button></div><p class="sd-caption">Each prompt needs a short draft before completion. Length only checks that you wrote something; it does not judge design quality.</p><details><summary>Read all six answers together</summary>${notebookPrompts.map(([f, t]) => `<h4>${t}</h4><p class="sd-user-text" data-sd-notebook-answer="${f}">${esc(d[f] || "Not drafted yet.")}</p>`).join("")}</details></section>`;
  }
  function completionHint(l, d, state) {
    if (!systemCanOpen(state, l.id)) return "Complete the missing foundation before recording this lesson’s completion.";
    if (!d.checked || d.answer !== l.check.answer) return "First, check a correct decision in step 3.";
    if (d.plan.trim().length < 30) return "Write a short explanation of your own (at least 30 characters).";
    if (l.stage === 4 && !notebookPrompts.every(([f]) => d[f].trim().length >= 20))
      return "Draft all six notebook prompts (at least 20 characters each).";
    if (!d.checks.every(Boolean)) return "Compare your explanation with all three self-review points.";
    return "Ready to record this practice and open the next lesson.";
  }
  function lessonRail(l, state) {
    return `<aside class="sd-course-rail" aria-label="Current stage"><span class="eyebrow green">STAGE ${l.stage + 1} OF 5</span><h2>${esc(systemStages[l.stage].title)}</h2><nav aria-label="Lessons in this stage">${systemLessons
      .filter((item) => item.stage === l.stage)
      .map(
        (item) =>
          `<a href="#system/${item.id}" ${item.id === l.id ? 'aria-current="page"' : ""}><span class="sd-rail-number">${state.systemDesign?.[item.id]?.completedAt ? "✓" : String(item.position).padStart(2, "0")}</span><span>${esc(item.title)}${item.id === l.id ? "<small>Current lesson</small>" : ""}</span></a>`
      )
      .join("")}</nav><a class="subtle-link" href="#system">View the full path →</a></aside>`;
  }
  function lessonView(id, variant) {
    const state = getState(),
      l = systemLessonById[id];
    if (!l) return overview();
    const d = systemProgress(state, id),
      review = variant === "review" && !!d.completedAt;
    const previous = systemLessons[l.position - 2],
      next = systemLessons[l.position];
    let content;
    if (review) {
      content = `<section class="sd-paper"><span class="eyebrow green">RECALL BEFORE REREADING</span><h2>Can you explain it again?</h2><p>Answer without opening the lesson. Then describe what would break in a different example.</p>${question(l, d, true)}<label class="sd-writing-label" for="sd-review-note">Give a fresh example and explain the trade-off.</label><textarea id="sd-review-note" data-sd-field="reviewNote" maxlength="20000" rows="5">${esc(d.reviewNote)}</textarea><button class="button primary" id="sd-review-complete" ${d.reviewChecked && d.reviewAnswer === l.check.answer && d.reviewNote.trim().length >= 20 ? "" : "disabled"}>Save this review</button><p class="sd-caption">The decision has a checked answer. Your written reasoning is self-reviewed.</p></section>`;
    } else {
      if (d.step === 0)
        content = `<section class="sd-paper"><span class="eyebrow green">THE IDEA IN PLAIN WORDS</span><h2>${esc(l.idea)}</h2>${l.explain.map((p) => `<p>${esc(p)}</p>`).join("")}${terms(l)}${diagram(l)}<aside class="sd-pitfall"><strong>Watch for this</strong><p>${esc(l.pitfall)}</p></aside></section>`;
      else if (d.step === 1) content = walk(l, d);
      else if (d.step === 2)
        content = `<section class="sd-paper"><span class="eyebrow green">MAKE A SMALL DECISION</span><h2>Try before looking.</h2>${question(l, d)}${d.attempts ? `<button class="text-button" id="sd-show-reference">${d.revealed ? "Reference reasoning opened below" : "I need help · show reference reasoning"}</button>` : ""}${d.revealed ? `<div class="sd-reference"><strong>A reasoned answer</strong><p>${esc(l.check.options[l.check.answer])}</p><p>${esc(l.check.why[l.check.answer])}</p>${solved(l)}</div>` : ""}${lab(l, d)}</section>`;
      else
        content = `<section class="sd-paper"><span class="eyebrow green">PUT THE IDEA TO WORK</span><h2>Make the reasoning yours.</h2><p>${esc(l.task)}</p>${notebook(l, d)}<label class="sd-writing-label" for="sd-plan">${l.stage === 4 ? "Summarize the choice you would defend in an interview." : "Write your approach and explain why it fits."}</label><textarea id="sd-plan" data-sd-field="plan" maxlength="20000" rows="7" placeholder="My approach is… It helps because… The trade-off is…">${esc(d.plan)}</textarea><details class="sd-reference" id="sd-solved"><summary>Compare with a clean solved example</summary>${solved(l)}<p>Other designs can be valid. Compare assumptions and guarantees, not just product names.</p></details><fieldset class="sd-self-review"><legend>Self-review your reasoning</legend>${l.rubric.map((point, i) => `<label><input type="checkbox" data-sd-rubric="${i}" ${d.checks[i] ? "checked" : ""}/><span>${esc(point)}</span></label>`).join("")}</fieldset><p class="sd-caption">These checks are your own assessment. No AI or keyword matcher grades your written design.</p><p id="sd-complete-hint" role="status">${completionHint(l, d, state)}</p><button class="button primary" id="sd-complete" ${systemCanComplete(state, id) ? "" : "disabled"}>Save lesson completion ✓</button></section>`;
    }
    return `<div class="system-track sd-lesson"><a class="subtle-link" href="#system">← System design path</a><header class="sd-lesson-header"><span class="eyebrow green">LESSON ${l.position} OF ${systemLessons.length} · ${esc(systemStages[l.stage].title)}</span><h1>${esc(l.title)}</h1></header><div class="sd-lesson-layout"><div class="sd-lesson-main">${!systemCanOpen(state, id) ? `<div class="sd-preview"><strong>You’re previewing a later idea.</strong><p>For the guided path, complete ${esc(systemLessonById[systemMissingPrerequisites(state, id)[0]].title)} first.</p>${link(systemMissingPrerequisites(state, id)[0], "Open the needed foundation", "secondary")}</div>` : ""}
      ${!review ? `<nav class="sd-steps" aria-label="Lesson steps">${steps.map((title, i) => `<button data-sd-step="${i}" ${i === d.step ? 'aria-current="step"' : ""}><span>${i + 1}</span>${title}</button>`).join("")}</nav>` : ""}${content}
      ${!review && (d.step === 0 || d.step === 2) ? `<div class="sd-step-footer">${d.step === 2 ? '<button class="text-button" data-sd-step="1">← Back to example</button>' : "<span>Ready to see it in action?</span>"}<button class="button primary" data-sd-step="${d.step + 1}">${d.step === 0 ? "See a worked example" : "Explain your approach"} →</button></div>` : ""}
      ${d.completedAt && !review ? `<section class="sd-finished" aria-label="Next lesson"><span class="eyebrow green">LESSON SAVED · ${d.supported ? "PRACTISED WITH SUPPORT" : "PRACTICE RECORDED"}</span><h2>${next ? `Next: ${esc(next.title)}` : "You’ve completed the guided path."}</h2><p>Keep applying and reviewing these ideas. Completion records practice; real fluency comes from explaining choices in new situations.</p>${next ? link(next.id, "Open next lesson") : '<a class="button primary" href="#system/review">Open review & notebooks →</a>'}</section>` : ""}
      <details class="sd-notes"><summary>Personal notes · saved as you type</summary><label for="sd-notes">What do you want to remember or ask about?</label><textarea id="sd-notes" data-sd-field="notes" maxlength="20000" rows="4">${esc(d.notes)}</textarea></details><details class="sd-sources"><summary>References for this lesson</summary>${l.sources
        .map((key) => {
          const [title, url] = systemSources[key];
          return `<a href="${url}" target="_blank" rel="noopener noreferrer">${esc(title)} ↗</a>`;
        })
        .join(
          ""
        )}</details><div class="sd-bottom-nav">${previous ? `<a href="#system/${previous.id}">← Previous lesson</a>` : '<a href="#system">Course outline</a>'}<a href="#system/review">Review & notebooks →</a></div></div>${lessonRail(l, state)}</div></div>`;
  }
  function reviewView() {
    const state = getState(),
      complete = systemLessons.filter((l) => state.systemDesign?.[l.id]?.completedAt);
    const due = complete.filter((l) => state.systemDesign[l.id].reviewDue <= Date.now());
    return `<div class="system-track"><a class="subtle-link" href="#system">← System design path</a><div class="sd-lesson-header"><span class="eyebrow green">REMEMBER IT. USE IT AGAIN.</span><h1>Your review & design notebook.</h1><p>Try recalling the reasoning before rereading the lesson. Repeated questions are practice, not an independent mastery test.</p></div><section class="sd-paper"><h2>${due.length ? `${due.length} ${due.length === 1 ? "idea is" : "ideas are"} ready for review.` : "Nothing due right now."}</h2><p>${complete.length ? "You can also revisit any completed lesson early." : "Complete your first lesson to start a review schedule."}</p>${complete.map((l) => `<article class="sd-review-row"><div><strong>${esc(l.title)}</strong><small>${state.systemDesign[l.id].reviewDue <= Date.now() ? "Ready now" : `Next review: ${new Date(state.systemDesign[l.id].reviewDue).toLocaleDateString()}`}</small></div><button class="button secondary" data-sd-review="${l.id}">Recall it →</button></article>`).join("")}${!complete.length ? link(systemLessons[0].id, "Start the first lesson") : ""}</section><section class="sd-paper"><h2>Your design studios</h2><p>Six practical briefs. Each notebook stays with your account. Previews are available now; the guided path reaches them after the foundations.</p>${systemLessons
      .filter((l) => l.stage === 4)
      .map(
        (l) =>
          `<article class="sd-review-row"><div><strong>${esc(l.title)}</strong><small>${notebookPrompts.filter(([f]) => systemProgress(state, l.id)[f].trim().length >= 20).length}/6 notebook prompts drafted</small></div>${link(l.id, "Open studio", "secondary")}</article>`
      )
      .join("")}</section></div>`;
  }
  function view(id, variant) {
    return id === "review" ? reviewView() : id ? lessonView(id, variant) : overview();
  }
  function bind(id, variant) {
    const l = systemLessonById[id],
      review = variant === "review";
    document.querySelectorAll("[data-sd-review]").forEach(
      (b) =>
        (b.onclick = () => {
          update(b.dataset.sdReview, { reviewAnswer: -1, reviewChecked: false, reviewNote: "" });
          location.hash = `system/${b.dataset.sdReview}/review`;
        })
    );
    if (!l) return;
    $(".sd-paper h2")?.setAttribute("tabindex", "-1");
    const refresh = (selector = ".sd-paper h2", scroll = false, anchor = selector) => {
      render();
      const target = $(selector);
      target?.setAttribute("tabindex", "-1");
      target?.focus({ preventScroll: true });
      if (scroll) $(anchor)?.scrollIntoView({ block: "start", behavior: "auto" });
    };
    const fields = () => systemProgress(getState(), id);
    const updateCompletion = () => {
      const d = fields();
      if ($("#sd-complete")) $("#sd-complete").disabled = !systemCanComplete(getState(), id);
      if ($("#sd-complete-hint")) $("#sd-complete-hint").textContent = completionHint(l, d, getState());
      if ($("#sd-review-complete"))
        $("#sd-review-complete").disabled = !(d.reviewChecked && d.reviewAnswer === l.check.answer && d.reviewNote.trim().length >= 20);
    };
    document.querySelectorAll("[data-sd-step]").forEach(
      (b) =>
        (b.onclick = () => {
          update(id, { step: Number(b.dataset.sdStep) });
          refresh(".sd-paper h2", true, ".sd-steps");
        })
    );
    document.querySelectorAll("[data-sd-notebook]").forEach(
      (b) =>
        (b.onclick = () => {
          update(id, { notebookIndex: Number(b.dataset.sdNotebook) });
          refresh(".sd-notebook h3", true);
        })
    );
    document.querySelectorAll('[name="sd-answer"]').forEach(
      (input) =>
        (input.onchange = () => {
          update(id, review ? { reviewAnswer: Number(input.value), reviewChecked: false } : { answer: Number(input.value), checked: false });
          refresh();
          document.querySelector(`[name="sd-answer"][value="${input.value}"]`)?.focus({ preventScroll: true });
        })
    );
    if ($("#sd-check"))
      $("#sd-check").onclick = () => {
        const d = fields();
        update(id, review ? { reviewChecked: true } : { checked: true, attempts: d.attempts + 1 });
        refresh();
        $("#sd-feedback").focus({ preventScroll: true });
      };
    if ($("#sd-show-reference"))
      $("#sd-show-reference").onclick = () => {
        update(id, { revealed: true });
        refresh();
      };
    if ($("#sd-solved"))
      $("#sd-solved").ontoggle = (e) => {
        if (e.target.open && !fields().revealed) update(id, { revealed: true });
      };
    for (const [selector, delta] of [
      ["#sd-walk-back", -1],
      ["#sd-walk-next", 1],
    ])
      if ($(selector))
        $(selector).onclick = () => {
          update(id, { walkIndex: Math.max(0, Math.min(l.walk.length - 1, fields().walkIndex + delta)) });
          refresh("#sd-frame-title", true, ".sd-current-step");
        };
    document.querySelectorAll("[data-sd-field]").forEach(
      (input) =>
        (input.oninput = () => {
          update(id, { [input.dataset.sdField]: input.value });
          updateCompletion();
          if (input.id === "sd-notebook-input") {
            const progress = fields();
            $("#sd-notebook-count").textContent = `${notebookPrompts.filter(([field]) => progress[field].trim().length >= 20).length}/6 drafted`;
            document
              .querySelectorAll("[data-sd-notebook-answer]")
              .forEach((p) => (p.textContent = progress[p.dataset.sdNotebookAnswer] || "Not drafted yet."));
          }
        })
    );
    document.querySelectorAll("[data-sd-rubric]").forEach(
      (input) =>
        (input.onchange = () => {
          const checks = [...fields().checks];
          checks[Number(input.dataset.sdRubric)] = input.checked;
          update(id, { checks });
          updateCompletion();
        })
    );
    document.querySelectorAll("[data-sd-lab]").forEach(
      (input) =>
        (input.oninput = () => {
          update(id, { [input.dataset.sdLab]: Number(input.value) });
          $(`#${input.id}-value`).textContent = number(Number(input.value)) + (input.id === "labHit" ? "%" : input.id === "labPeak" ? "×" : "");
          $("#sd-lab-results").innerHTML = labResults(l, fields());
        })
    );
    if ($("#sd-cache-fail"))
      $("#sd-cache-fail").onclick = () => {
        update(id, { labHit: 0 });
        refresh();
      };
    if ($("#sd-complete"))
      $("#sd-complete").onclick = () => {
        if (!completeSystemLesson(getState(), id)) return;
        activeDay();
        save();
        refresh();
        $(".sd-finished")?.scrollIntoView({ behavior: "smooth", block: "center" });
      };
    if ($("#sd-review-complete"))
      $("#sd-review-complete").onclick = () => {
        if (!completeSystemReview(getState(), id)) return;
        activeDay();
        save();
        location.hash = "system/review";
      };
  }
  return { view, bind };
}
