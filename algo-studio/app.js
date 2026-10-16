import { AccountSync } from "./account-sync.js?v=20261016-saving1";
import { syncConfig } from "./sync-config.js";
import { lessons, modules, route, courseStages, futureTracks } from "./curriculum.js";
import { indentEdit, backspaceIndentEdit, newlineEdit } from "./editor.js";
import { highlightPython } from "./python-highlight.js";
import { checkpoints, transferTasks } from "./practice-bank.js";
import {
  initialState,
  upgradeState,
  ready,
  lessonComplete,
  canOpen,
  missingPrerequisites,
  nextActivity,
  lessonContinuation,
  checkpointDestination,
  recordCheckpoint,
  validRun,
  validBackup,
} from "./learning-state.js";
import { lessonDiagram, growthCases, growthProfiles, projects } from "./teaching.js";
import { searchTrace, insertionTrace, bfsTrace, measure, reviewDate } from "./algorithms.js";
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const py = (v) =>
  v === null
    ? "None"
    : v === true
      ? "True"
      : v === false
        ? "False"
        : Array.isArray(v)
          ? `[${v.map(py).join(", ")}]`
          : typeof v === "object"
            ? `{${Object.entries(v)
                .map(([k, x]) => `${JSON.stringify(k)}: ${py(x)}`)
                .join(", ")}}`
            : JSON.stringify(v);
const blank = initialState;
let state = blank();
let storageAvailable = true;
let accountSync = null;
let accountEpoch = 0;
let signInEmailSent = "";
let signInCooldown = null;
try {
  const raw = JSON.parse(localStorage.getItem("algo-studio-v1"));
  if (validBackup(raw)) state = upgradeState(raw);
} catch {
  storageAvailable = false;
}
function save() {
  try {
    if (!accountSync?.changed()) localStorage.setItem("algo-studio-v1", JSON.stringify(state));
    storageAvailable = true;
  } catch {
    storageAvailable = false;
    toast("Storage is unavailable. Export your progress before leaving.");
  }
  updateSaveStatus();
}
function updateSaveStatus() {
  const panel = $("#progress-save-panel");
  if (!panel) return;
  const user = accountSync?.user;
  const message = !storageAvailable
    ? "Couldn’t save. Keep this tab open and export a backup."
    : user
      ? accountSync.message
      : "Saved on this device only. Sign in to continue on another device.";
  const status = $("#progress-save-status");
  if (status.textContent !== message) status.textContent = message;
  panel.classList.toggle("save-error", !storageAvailable || (!!user && /couldn’t finish|could not be saved/.test(accountSync.message)));
  const button = $("#progress-save-account");
  button.textContent = !storageAvailable ? "Export a backup" : user ? "Account & sync" : "Sign in to sync";
  button.onclick = openWorkspace;
}
function activeDay() {
  const d = new Date().toLocaleDateString("en-CA");
  if (!state.activity.includes(d)) state.activity.push(d);
  save();
}
function completed() {
  return lessons.filter((l) => state.done[l.id]);
}
function nextLesson() {
  return lessons[nextActivity(state).id];
}
function unlocked(id) {
  return canOpen(state, id);
}
function draft(id) {
  return (state.drafts[id] ??= { code: lessons[id].starter, step: 0, hint: 0, notes: "" });
}
function due() {
  return completed().filter(
    (l) =>
      !state.reviews[l.id] ||
      state.reviews[l.id].due <= Date.now() ||
      (state.reviews[l.id].codeDue !== undefined && state.reviews[l.id].codeDue <= Date.now())
  );
}
function toast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => $("#toast").classList.remove("show"), 3500);
}
const go = (id, label = "Start lesson") => `<a class="button primary" href="#lesson/${id}">${label}<span aria-hidden="true">→</span></a>`;
function pageIntro(kicker, title, desc, extra = "") {
  return `<div class="page-intro"><div><div class="eyebrow green">${kicker}</div><h1>${title}</h1><p>${desc}</p></div>${extra}</div>`;
}
function activityHref(activity) {
  return activity.kind === "checkpoint" ? `#check/${activity.id}` : activity.kind === "review" ? "#review" : `#lesson/${activity.id}`;
}
function activityLink(activity, label = "Continue learning") {
  return `<a class="button primary" href="${activityHref(activity)}">${label}<span aria-hidden="true">→</span></a>`;
}
function continuationPanel(id) {
  const activity = lessonContinuation(state, id),
    review = activity.kind === "review";
  return `<section class="lesson-continuation" tabindex="-1" aria-label="Continue learning"><div><span class="eyebrow green">${ready(state, id) ? "CHECKPOINT COMPLETE" : "LESSON COMPLETE"}</span><h2>${review ? "Keep your skills fresh." : `Next lesson: ${esc(lessons[activity.id].title)}`}</h2><p>${review ? "You have completed the lesson path. Keep practising with review, mixed problems, and projects." : "Your progress is saved. You can go straight to the next lesson."}</p>${!ready(state, id) ? `<a class="subtle-link" href="#check/${id}">Try an extra checkpoint (optional) →</a>` : ""}</div>${activityLink(activity, review ? "Open review" : "Open next lesson")}</section>`;
}
function home() {
  const activity = nextActivity(state),
    next = lessons[activity.id],
    count = route.filter((id) => lessonComplete(state, id)).length;
  return `<div class="focused-home">${pageIntro("ONE STEP AT A TIME", "Let’s make one idea clear.", "One useful step. Your place is saved as you go.")}<section class="next-lesson-card"><div class="next-lesson-meta"><span class="eyebrow green">${activity.kind === "review" ? "KEEP IT FRESH" : `STEP ${next.position} OF ${lessons.length}`}</span><span>At your pace · Python</span></div><h2>${activity.kind === "review" ? "Keep connecting the ideas." : next.title}</h2><p>${activity.kind === "review" ? "You have completed the lesson path. Return to practice, review, and projects to build further fluency." : next.simpleIdea}</p>${activityLink(activity, activity.kind === "review" ? "Open review" : count ? "Continue to next lesson" : "Start lesson")}<small>Finish a lesson, then open the next. Extra checkpoints are optional practice.</small></section><div class="quiet-progress"><span>${count} of ${lessons.length} lessons completed</span><a href="#path">See the course outline →</a></div>${due().length ? `<a class="subtle-link quiet-review" href="#review">${due().length} ideas are ready for a short review →</a>` : ""}</div>`;
}
function toolsView() {
  return `${pageIntro("WHEN YOU NEED A LITTLE EXTRA HELP", "Your learning tools.", "You can complete your lessons without choosing a tool. Use these when you have a specific question.")}<div class="tools-list">${[
    ["practice", "Practice an earlier lesson", "Use this when you want another attempt at something you have learned.", "Open practice"],
    ["visual", "Watch the steps happen", "Use this when you want to slow down an algorithm and see what changes.", "Open visual examples"],
    [
      "lab",
      "Compare how much work it takes",
      "Run your own saved solution across controlled input sizes, or compare reference algorithms.",
      "Open efficiency comparison",
    ],
    ["projects", "Build something in stages", "Connect several skills in a route planner or packing planner.", "Open projects"],
    [
      "review",
      "Remember an earlier idea",
      `${due().length} ${due().length === 1 ? "review is" : "reviews are"} due. Try recalling an answer before reading it again.`,
      "Open review",
    ],
  ]
    .map(
      ([route, title, description, label]) =>
        `<article class="learning-tool"><div><h2>${title}</h2><p>${description}</p></div><a class="button secondary" href="#${route}">${label} →</a></article>`
    )
    .join("")}</div><div class="tools-method"><a class="subtle-link" href="#method">How the teaching works and where the ideas came from ↗</a></div>`;
}
function skillLabel(id) {
  return ready(state, id)
    ? state.ready[id].status === "supported"
      ? "Passed with help"
      : "Checkpoint passed"
    : state.done[id]
      ? "Lesson complete · extra practice available"
      : unlocked(id)
        ? "Ready to learn"
        : "Build the foundation";
}
function pathView(open) {
  const passed = route.filter((id) => lessonComplete(state, id)).length;
  return `${pageIntro("YOUR GUIDED JOURNEY", "A path with a reason for every step.", `${lessons.length} lessons, ${Object.keys(checkpoints).length + Object.keys(transferTasks).length} additional problems, and a clear next activity.`)}<div class="path-summary"><span class="tag">FOUNDATIONS → APPLICATION</span><strong>${passed} lessons completed</strong><div class="progress-track"><i style="width:${(passed / lessons.length) * 100}%"></i></div><span>${Math.round((passed / lessons.length) * 100)}%</span></div><p class="path-explanation">Finish each lesson to open the next. Prerequisite lessons still come first. Extra checkpoints let you try a different problem whenever you want more practice. Your code, notes, and help-use labels are kept.</p><div class="curriculum">${courseStages
    .map((m, i) => {
      const ids = m[4],
        count = ids.filter((id) => lessonComplete(state, id)).length;
      return `<details class="module" ${(open !== undefined ? Number(open) === i : nextLesson().module === i) ? "open" : ""}><summary><span class="module-number">${count === ids.length ? "✓" : String(i + 1).padStart(2, "0")}</span><div><span class="eyebrow">${m[2]}</span><h2>${m[0]}</h2><p>${m[1]}</p></div><span class="module-count">${count}/${ids.length} <span>⌄</span></span></summary><div class="module-lessons">${ids
        .map((id) => {
          const l = lessons[id];
          return `<a href="#lesson/${id}" class="path-lesson"><span class="lesson-indicator ${lessonComplete(state, id) ? "complete" : unlocked(id) ? "ready" : ""}">${lessonComplete(state, id) ? "✓" : unlocked(id) ? "▷" : "·"}</span><div><strong>${l.title}</strong><small>${skillLabel(id)}</small></div><span>${lessonComplete(state, id) ? "Revisit" : unlocked(id) ? "Open →" : "Preview ↗"}</span></a>`;
        })
        .join("")}</div></details>`;
    })
    .join(
      ""
    )}</div><div class="callout"><strong>Beyond this course</strong><p>The core and selected extensions are available now. These deeper tracks are a roadmap for further study, not completed lessons:</p>${futureTracks.map(([h, p]) => `<details class="more-detail"><summary>${h}</summary><p>${p}</p></details>`).join("")}<a class="subtle-link" href="https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/" target="_blank" rel="noopener">Explore deeper algorithm study at MIT ↗</a></div>`;
}
function quizMarkup(q, key, value) {
  return `<h3>${q.prompt}</h3><div class="answers">${q.options.map((a, i) => `<button class="answer ${value === i ? (i === q.answer ? "correct" : "incorrect") : ""}" data-answer="${key}" data-index="${i}" ${key === "review" && value !== undefined ? "disabled" : ""}><span>${String.fromCharCode(65 + i)}</span>${esc(a)}${value === i ? `<b>${i === q.answer ? "✓" : "×"}</b>` : ""}</button>`).join("")}</div>${value !== undefined ? `<div class="feedback ${value === q.answer ? "success" : "retry"}" role="status"><strong>${value === q.answer ? "That’s the idea." : "A useful chance to rethink."}</strong><p>${value === q.answer ? q.why : `You chose “${esc(q.options[value])}”. ${q.why} Trace the example, then choose again.`}</p></div>` : ""}`;
}
function lessonWords(l) {
  return `<details class="more-detail lesson-words"><summary>Words in this lesson, explained</summary><dl>${l.words.map(([term, meaning]) => `<div><dt>${esc(term)}</dt><dd>${esc(meaning)}</dd></div>`).join("")}</dl></details>`;
}
function costExplanation(l) {
  return `<section class="cost-explanation" aria-label="Work and memory explained"><div class="cost-box"><p>${esc(l.simpleCost)}</p></div>${l.costRows ? `<div class="table-scroll"><table class="cost-examples"><caption>Compare a few small examples</caption><thead><tr>${l.costRows.headers.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${l.costRows.rows.map((row) => `<tr>${row.map((v) => `<td>${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : ""}<h3>What does the code need to remember?</h3><p class="memory-explanation">${esc(l.costMemory)}</p><details class="more-detail notation-detail"><summary>The short mathematical label (optional)</summary><p>${esc(l.cost)}</p></details>${l.costExtra ? `<details class="more-detail"><summary>${esc(l.costExtra.title)}</summary>${l.costExtra.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}</details>` : ""}</section>`;
}
function lessonView(id) {
  const l = lessons[id];
  if (!l) return pageIntro("NOT FOUND", "This lesson is not on the path.", "Open the learning path to choose a lesson.");
  if (!unlocked(id)) {
    const missing = missingPrerequisites(state, id);
    return `${pageIntro("A LOOK AHEAD", l.title, "This idea uses skills you will practice first.")}<article class="lesson-panel focused-lesson"><h2>${l.simpleIdea}</h2><p class="familiar-example">${l.analogy}</p><div class="readiness"><h3>First, check these foundations</h3>${missing.map((p) => `<a href="#lesson/${p}">${lessons[p].title} →</a>`).join("")}</div>${activityLink(nextActivity(state), "Go to my next activity")}</article>`;
  }
  const d = draft(id);
  if (d.step > 1 && d.predict !== l.predict.answer) d.step = 1;
  const step = d.step || 0,
    walk = Math.min(d.walkIndex || 0, l.walk.length - 1);
  const afterFinish = checkpointDestination(state, id);
  const stepNames = ["Learn the idea", "Try one question", "Write Python", "Finish"];
  return `<div class="lesson-heading"><a href="#home" class="subtle-link">← Back to learning</a><span class="muted">Step ${l.position} of ${lessons.length}</span></div><h1 class="lesson-title">${l.title}</h1>${state.done[id] ? continuationPanel(id) : ""}<ol class="step-tabs lesson-progress" aria-label="Lesson progress">${stepNames.map((name, i) => `<li class="${step === i ? "active" : i < step ? "past" : ""}" ${step === i ? 'aria-current="step"' : ""}><span>${i < step ? "✓" : i + 1}</span>${name}</li>`).join("")}</ol>
 ${step > 0 ? `<button class="text-button lesson-back" data-step="${step - 1}">← Previous step</button>` : ""}
 ${step === 0 ? `<article class="lesson-panel focused-lesson"><span class="eyebrow green">THE IDEA IN PLAIN WORDS</span><h2>${l.simpleIdea}</h2><p class="familiar-example">${l.idea}</p><section class="walkthrough" aria-label="Worked example"><div class="walkthrough-heading"><strong>Let’s try a small example.</strong><span>Step ${walk + 1} of ${l.walk.length}</span></div>${lessonDiagram(l, walk)}<p class="walkthrough-step" tabindex="-1" aria-live="polite">${esc(l.walk[walk])}</p><div class="walkthrough-actions">${walk > 0 ? `<button class="text-button" data-walk="${walk - 1}">← Previous example step</button>` : "<span></span>"}${walk < l.walk.length - 1 ? `<button class="button primary" data-walk="${walk + 1}">Show the next step →</button>` : '<span class="example-done">✓ Example complete</span>'}</div></section><details class="more-detail"><summary>What this builds on</summary><p>${l.requires.length ? l.requires.map((p) => `<a href="#lesson/${p}">${lessons[p].title}</a>`).join(" · ") : "Python functions, loops, and integer lists. Start with the example; use hints if you need a reminder."}</p></details><details class="more-detail"><summary>An everyday example</summary><p>${l.analogy}</p></details>${lessonWords(l)}<details class="more-detail"><summary>A mistake to watch for</summary><p>${l.trap}</p></details>${walk === l.walk.length - 1 ? '<div class="lesson-continue"><button class="button primary" data-step="1">Next: try one question →</button></div>' : ""}<a class="subtle-link placement-link" href="#check/${id}">Already know this? Try a different problem →</a></article>` : ""}
 ${step === 1 ? `<article class="lesson-panel focused-lesson"><span class="eyebrow green">ONE QUICK QUESTION</span><p class="step-guidance">Choose an answer. If you miss it, you can try again.</p>${quizMarkup(l.predict, "predict", d.predict)}<button class="button primary" data-step="2" ${d.predict !== l.predict.answer ? "disabled" : ""}>Next: write Python →</button></article>` : ""}
 ${step === 2 ? practicePanel(l, d) : ""}
 ${step === 3 ? `<article class="lesson-panel focused-lesson"><span class="eyebrow green">THE LAST STEP</span><h2>What changes when the input gets bigger?</h2>${costExplanation(l)}${quizMarkup(l.reflect, "reflect", d.reflect)}<details class="more-detail notes-details"><summary>Keep a note (optional)</summary><label class="notes-label" for="lesson-notes">Explain the idea in your own words</label><textarea id="lesson-notes" class="notes" placeholder="What helped this idea click for you?">${esc(d.notes || "")}</textarea></details>${d.passedCode !== d.code ? '<p class="checkpoint-needed">Your code needs a test run before you can finish.</p><button class="button secondary" data-step="2">Go back to the Python exercise →</button>' : ""}<button class="button primary" id="complete-lesson" ${d.predict !== l.predict.answer || d.reflect !== l.reflect.answer || d.passedCode !== d.code ? "disabled" : ""}>${afterFinish.kind === "review" ? "Finish & open review" : "Finish & open next lesson"} <span>→</span></button>${d.assisted ? '<p class="fine-print">You used the worked solution. This counts as guided practice. You can reset the editor and try it yourself later.</p>' : ""}<p class="fine-print">${afterFinish.kind === "lesson" ? `Up next: ${esc(lessons[afterFinish.id].title)}.` : "Next: review and more practice."} Extra checkpoints are optional.</p><button class="text-button" id="complete-with-checkpoint" ${d.predict !== l.predict.answer || d.reflect !== l.reflect.answer || d.passedCode !== d.code ? "disabled" : ""}>Finish & try an extra checkpoint instead →</button><div id="completion-message" role="status"></div></article>` : ""}`;
}
function practiceDraft(id, kind = "check") {
  const key = `${id}:${kind}`;
  return (state.practice[key] ??= { code: (kind === "transfer" ? transferTasks[id] : checkpoints[id]).starter, hint: 0, notes: "", assisted: false });
}
let worked = { token: null, caseIndex: 0, index: 0, result: null, loading: false, error: "" };
function workedState() {
  if (worked.token !== location.hash) worked = { token: location.hash, caseIndex: 0, index: 0, result: null, loading: false, error: "" };
  return worked;
}
function pythonContract(l) {
  return {
    ...(l.unchangedArgs ? { unchangedArgs: l.unchangedArgs } : {}),
    ...(Number.isInteger(l.freshResultArg) ? { freshResultArg: l.freshResultArg } : {}),
    ...(Number.isInteger(l.reverseLinkedArg) ? { reverseLinkedArg: l.reverseLinkedArg } : {}),
  };
}
function lineExplanation(source, frame) {
  if (frame.event === "return") return `This call to ${frame.function} returns ${frame.value}. The waiting caller can now continue.`;
  const line = source.trim();
  if (line.startsWith("def ")) return "Define this function. Its body will run when the function is called.";
  if (line.startsWith("import ") || line.startsWith("from ")) return "Make the requested Python tool available.";
  if (line.startsWith("if ") || line.startsWith("elif ")) return "Check this condition using the values below, then choose the next branch.";
  if (line.startsWith("while ")) return "Check whether another loop round is needed. Watch the values that move toward stopping.";
  if (line.startsWith("for ")) return "Take the next item, if there is one. Otherwise continue after this loop.";
  if (line.startsWith("return ")) return "Evaluate the highlighted expression and return its value. The next return frame shows the result.";
  if (line === "break") return "Leave this loop and continue with the code after it.";
  if (line === "continue") return "Skip the rest of this round and move to the next loop check.";
  if (line.includes(".append(") || line.includes(".extend(")) return "Add the highlighted value or values to the growing collection.";
  if (line.includes(".pop(") || line.includes(".popleft(")) return "Remove an item from the indicated end of the collection.";
  if (line.includes("=") && !line.includes("=="))
    return "Update the highlighted name or position using this expression. Check the updated value in a later frame.";
  return "Run the highlighted line. The values below show the state just before it executes.";
}
function solvedExamplePanel(l, d) {
  return `<details class="solution-details solved-example" id="solved-example" ${d.solutionOpen ? "open" : ""}><summary>Walk through a solved example</summary><div id="solution-content">${d.solutionOpen ? solvedExampleContent(l) : "<p>Try the exercise first, or open this when you want support. Your own code stays in the editor.</p>"}</div></details>`;
}
function solvedExampleContent(l) {
  const w = workedState(),
    test = l.tests[w.caseIndex],
    frames = w.result?.frames || [],
    frame = frames[w.index],
    finished = w.result && w.index === frames.length;
  return `<p class="solution-guidance">Study this when useful. Viewing the solution counts as supported practice. Your code is kept separately.</p><label for="solution-case">Example to follow</label><select id="solution-case" ${w.loading ? "disabled" : ""}>${l.tests.map((t, i) => `<option value="${i}" ${w.caseIndex === i ? "selected" : ""}>Example ${i + 1}</option>`).join("")}</select><div class="example-box"><span class="eyebrow">INPUT</span><code>solve(${test.args.map(py).map(esc).join(", ")})</code><span class="eyebrow">EXPECTED RETURN</span><code>${esc(py(test.expected))}</code></div><h3>A clean Python solution</h3><pre class="solved-code" aria-label="Read-only worked solution">${highlightPython(
    l.solution
  )
    .split("\n")
    .map(
      (line, i) =>
        `<span class="solution-line ${frame?.line === i + 1 ? "current" : ""}" ${frame?.line === i + 1 ? 'aria-current="step"' : ""}><small>${i + 1}</small><code>${line || " "}</code></span>`
    )
    .join("")}</pre><div id="solution-trace" class="solution-trace" aria-live="polite">${
    w.loading
      ? "<p>Running this reference example in Python…</p>"
      : w.error
        ? `<p class="feedback retry">${esc(w.error)}</p>`
        : w.result
          ? finished
            ? `<span class="eyebrow green">${w.result.frameCount > frames.length ? "END OF THE SHOWN STEPS" : "EXAMPLE COMPLETE"}</span><h3>The function returned <code>${esc(w.result.actual)}</code>.</h3><p>${w.result.passed ? "This matches the expected answer. Explain the rule that made each step work, then try your own code again." : "This reference did not match its expected answer. Check the error before using this example."}</p>${w.result.frameCount > frames.length ? `<p class="fine-print">The first ${frames.length} of ${w.result.frameCount} execution frames are shown; the remaining execution was omitted. The final result above is from the complete run.</p>` : ""}`
            : `<div class="walkthrough-heading"><strong>${frame.event === "return" ? "A call finishes" : "Before this line runs"}</strong><span>${w.index + 1} / ${frames.length}</span></div><p class="trace-explanation">${esc(lineExplanation(l.solution.split("\n")[frame.line - 1] || "", frame))}</p><p class="fine-print">Inside ${esc(frame.function === "<" + "module>" ? "the program" : frame.function)} · line ${frame.line}. These values were captured by Python.${frame.event === "line" ? " Changes from this line appear in later frames." : ""}</p><dl class="trace-values">${
                Object.entries(frame.locals)
                  .map(([name, value]) => `<div><dt>${esc(name)}</dt><dd><code>${esc(value)}</code></dd></div>`)
                  .join("") || "<p>No local values have been assigned in this call yet.</p>"
              }</dl>`
          : "<p>Follow the code one executed line at a time, with the actual values beside it. Long values are shortened for readability.</p>"
  }</div><div class="solution-controls">${w.result ? `<button class="button secondary" id="solution-back" ${w.index === 0 ? "disabled" : ""}>← Previous</button><button class="button primary" id="solution-next">${finished ? "Restart example ↺" : "Next step →"}</button>${!finished ? '<button class="text-button" id="solution-finish">See final result</button>' : ""}` : `<button class="button primary" id="start-solution" ${w.loading ? "disabled" : ""}>${w.loading ? "Loading…" : "Start the walkthrough →"}</button>`}</div><details class="more-detail"><summary>Use this code in my editor</summary><p>This replaces the editor contents and keeps your previous code available to restore. It does not mark the exercise as passed.</p><button class="button secondary" id="solution-button">Use solution in my editor</button></details>`;
}
function bindSolvedExample(l, d, token) {
  const details = $("#solved-example");
  if (!details) return;
  details.ontoggle = () => {
    if (details.open === !!d.solutionOpen) return;
    d.solutionOpen = details.open;
    if (details.open) {
      d.assisted = true;
      d.exposed = true;
    }
    save();
    render();
  };
  function repaint() {
    if (location.hash === token && $("#solution-content")) {
      $("#solution-content").innerHTML = solvedExampleContent(l);
      bindControls();
      const pre = $(".solved-code"),
        line = pre?.querySelector("[aria-current]");
      if (line) pre.scrollTop = Math.max(0, line.offsetTop - pre.clientHeight / 2);
    }
  }
  function bindControls() {
    if ($("#solution-case"))
      $("#solution-case").onchange = (e) => {
        const w = workedState();
        w.caseIndex = Number(e.target.value);
        w.index = 0;
        w.result = null;
        w.error = "";
        repaint();
      };
    if ($("#start-solution"))
      $("#start-solution").onclick = async () => {
        if (runningJob) return;
        const w = workedState();
        w.loading = true;
        w.error = "";
        runningJob = true;
        repaint();
        try {
          const [result] = await executePython(l.solution, [l.tests[w.caseIndex]], { walkthrough: true, ...pythonContract(l) });
          if (!result.passed) throw Error(result.error || "The worked solution did not match its expected answer.");
          w.result = result;
          w.index = 0;
        } catch (e) {
          w.error = e.message;
        } finally {
          runningJob = false;
          w.loading = false;
          if (worked === w) repaint();
        }
      };
    if ($("#solution-next"))
      $("#solution-next").onclick = () => {
        const w = workedState();
        w.index = w.index === w.result.frames.length ? 0 : w.index + 1;
        repaint();
      };
    if ($("#solution-finish"))
      $("#solution-finish").onclick = () => {
        const w = workedState();
        w.index = w.result.frames.length;
        repaint();
      };
    if ($("#solution-back"))
      $("#solution-back").onclick = () => {
        workedState().index = Math.max(0, workedState().index - 1);
        repaint();
      };
    if ($("#solution-button"))
      $("#solution-button").onclick = () => {
        if (d.code !== l.solution) d.previousCode = d.code;
        d.code = l.solution;
        d.assisted = true;
        d.exposed = true;
        d.passedCode = null;
        d.results = null;
        save();
        render();
        toast("Worked solution loaded. Your previous code can be restored.");
      };
  }
  bindControls();
}
function activeExercise() {
  const [page, value, variant] = location.hash.slice(1).split("/"),
    id = Number(value);
  if (!lessons[id] || !["lesson", "check"].includes(page)) return null;
  const kind = page === "lesson" ? "lesson" : ["recall", "transfer"].includes(variant) ? variant : "check";
  if (kind === "transfer" && !transferTasks[id]) return null;
  const exercise =
    kind === "lesson"
      ? lessons[id]
      : {
          ...lessons[id],
          unchangedArgs: [],
          freshResultArg: undefined,
          reverseLinkedArg: undefined,
          ...(kind === "transfer" ? transferTasks[id] : checkpoints[id]),
        };
  return { id, kind, exercise, d: kind === "lesson" ? draft(id) : practiceDraft(id, kind), token: location.hash };
}
function challengeView(id, kind) {
  if (!lessons[id]) return pageIntro("NOT FOUND", "This exercise is not on the path.", "Choose a lesson from the course outline.");
  if (kind === "transfer" && !transferTasks[id]) return pageIntro("NOT FOUND", "This practice problem is unavailable.", "Open the practice studio.");
  if (!unlocked(id)) return lessonView(id);
  if (kind === "transfer" && !transferTasks[id].requires.every((p) => ready(state, p)))
    return `${pageIntro("BUILD THE FOUNDATION", "One more skill before this problem.", "Pass these checkpoints first so the problem builds on ideas you have practised.")}<div class="prerequisite-links">${transferTasks[
      id
    ].requires
      .filter((p) => !ready(state, p))
      .map((p) => `<p><a class="subtle-link" href="#lesson/${p}">${esc(lessons[p].title)} →</a></p>`)
      .join("")}</div>`;
  const context = activeExercise(),
    { exercise: l, d } = context;
  return `<div class="lesson-heading"><a class="subtle-link" href="${kind === "transfer" ? "#practice/mixed" : `#lesson/${id}`}">← ${kind === "transfer" ? "Back to mixed practice" : "Back to the lesson"}</a><span class="muted">${kind === "recall" ? "Recall after a gap" : kind === "transfer" ? "Choose your approach" : "A different problem"}</span></div><h1 class="lesson-title">${l.title}</h1><p class="checkpoint-intro">${kind === "recall" ? "Try from memory before reopening an example. This repeats a familiar problem; mixed practice offers different situations." : kind === "transfer" ? "Choose an approach yourself. Explain what makes it a good fit." : `${state.done[id] && !ready(state, id) ? "Lesson complete. This is optional extra practice. " : ""}Try this variation from a fresh editor. Pass the tests, then use “Save & open next lesson” below the results. Notes are optional. Using help is recorded as supported practice.`}</p>${kind !== "transfer" && kind !== "recall" && lessonComplete(state, id) ? continuationPanel(id) : ""}${practicePanel(l, d, true)}`;
}
function practicePanel(l, d, checkpoint = false) {
  return `<div class="practice-layout"><section class="task-panel"><span class="eyebrow green">${checkpoint ? "PUT THE IDEA TO WORK" : "YOUR TURN"}</span><h2>${checkpoint ? "Solve one small problem." : "Write a small Python function."}</h2><p>${l.task}</p><div class="example-box"><span class="eyebrow">WHEN YOU CALL</span><code>solve(${l.tests[0].args.map(py).map(esc).join(", ")})</code><span class="eyebrow">IT SHOULD RETURN</span><code>${esc(py(l.tests[0].expected))}</code></div><details class="practice-help" ${(d.hint || 0) > 0 ? "open" : ""}><summary>Need a hint?</summary><div class="hint-block">${l.hints
    .slice(0, d.hint || 0)
    .map((h, i) => `<p><b>${i + 1}.</b> ${h}</p>`)
    .join(
      ""
    )}<button class="button secondary" id="hint-button" ${(d.hint || 0) >= l.hints.length ? "disabled" : ""}>${d.hint ? "Show another hint" : "Show a hint"}</button></div></details><button class="button secondary mobile-editor-jump" id="jump-to-editor">Write Python ↓</button>${solvedExamplePanel(l, d)}${checkpoint && d.exposed ? '<p class="fine-print">You previously opened help for this problem. An attempt without current hints is labelled a reattempt, not an unseen assessment.</p>' : ""}</section><section class="editor-panel" aria-label="Python editor"><div class="editor-toolbar"><span><span class="file-dot"></span> solution.py</span><div><span class="language-label">Python</span>${typeof d.previousCode === "string" ? '<button class="text-button" id="restore-code">Restore previous code</button>' : ""}<button class="text-button" id="reset-code">${checkpoint ? "Start a new attempt" : "Reset"}</button></div></div><div class="indent-toolbar" role="group" aria-label="Python indentation"><div><button type="button" id="indent-code" title="Indent selected lines (Tab)">→ Indent</button><button type="button" id="outdent-code" title="Outdent selected lines (Shift + Tab)">← Outdent</button></div><span>4 spaces per level</span></div><label class="sr-only" for="code-editor">Python solution code</label><div class="editor-body"><div class="line-numbers" id="line-numbers" aria-hidden="true">${d.code
    .split("\n")
    .map((_, i) => i + 1)
    .join(
      "\n"
    )}</div><div class="code-surface"><pre id="code-highlight" class="code-highlight" aria-hidden="true">${highlightPython(d.code)}</pre><textarea id="code-editor" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-describedby="editor-help">${esc(d.code)}</textarea></div></div><div class="editor-actions"><span id="python-status">${pythonStatus === "ready" ? "● Python ready" : pythonStatus === "loading" ? "◌ Loading Python…" : "Your code runs in this browser"}</span><button class="button run-button" id="run-code">▷ Run tests</button></div><div class="results-panel" id="test-results" aria-live="polite">${d.results ? resultsMarkup(l, d.results) : '<div class="empty-results"><strong>Write your code, then press Run tests.</strong><p>Check an ordinary case, an empty input when allowed, and a tricky boundary.</p></div>'}</div>${checkpoint ? `<div id="checkpoint-action">${checkpointActionMarkup(activeExercise())}</div>` : ""}<details class="custom-case"><summary>Try your own test case</summary><p>Enter JSON arguments as a list and predict the returned value. This is for exploring and debugging; it does not replace the checkpoint tests.</p><label for="custom-args">Arguments (JSON list)</label><textarea id="custom-args" spellcheck="false">${esc(JSON.stringify(l.tests[0].args))}</textarea><label for="custom-expected">Your expected answer (JSON)</label><textarea id="custom-expected" spellcheck="false">${esc(JSON.stringify(l.tests[0].expected))}</textarea><button class="button secondary" id="run-custom">Run my test case</button><div id="custom-output" role="status"></div></details><div class="editor-help" id="editor-help">Tab / Shift+Tab: indent / outdent · Enter: auto-indent · Ctrl/⌘+Enter: run · Esc: leave editor · Saved as you type</div><div class="practice-next">${checkpoint ? `<details class="optional-reflection"><summary>Add a note (optional)</summary><label class="notes-label" for="checkpoint-notes">What did you keep track of, and why does it work?</label><textarea class="notes" id="checkpoint-notes" placeholder="Explain the key rule in your own words…">${esc(d.notes || "")}</textarea><p class="fine-print">Notes are saved for reflection and are not automatically graded. Passing these examples does not prove general correctness or efficiency.</p></details><div id="checkpoint-status" role="status">${d.completedAt ? `Previous attempt: ${esc(d.status)}.` : ""}</div>` : `<button class="button primary" id="practice-continue" data-step="3" ${d.passedCode !== d.code ? "disabled" : ""}>${d.passedCode === d.code ? "Next: understand the cost →" : "Pass the tests to continue"}</button>`}</div></section></div>`;
}

function resultsMarkup(l, results) {
  const pass = results.filter((r) => r.passed).length;
  return `<div class="results-heading"><strong class="${pass === results.length ? "green" : ""}">${pass === results.length ? "✓ All tests passed" : `${pass}/${results.length} tests passed`}</strong></div>${results.map((r, i) => `<details class="test-result ${r.passed ? "passed" : "failed"}" ${!r.passed ? "open" : ""}><summary><span>${r.passed ? "✓" : "×"} Example ${i + 1}</span><small>${r.passed ? "Passed" : "Take a look"}</small></summary><div><code>solve(${l.tests[i].args.map(py).map(esc).join(", ")})</code><p>Expected: <code>${esc(py(l.tests[i].expected))}</code></p><p>${r.error ? "Error" : "Returned"}: <code>${esc(r.error || r.actual)}</code></p>${r.output ? `<pre>${esc(r.output)}</pre>` : ""}</div></details>`).join("")}<details class="more-detail efficiency-details"><summary>See efficiency details</summary><p>${results.reduce((n, r) => n + r.steps, 0)} Python line steps across these tests.</p><p>${results.map((r, i) => `Example ${i + 1}: ${r.steps} executed lines, ${r.ms.toFixed(2)} ms.`).join("<br>")}</p><p>These are executed source lines, not CPU operations. Library internals are excluded, and tracing affects the timings. Use them to explore your code; use the lesson’s reasoning to understand its growth.</p></details>`;
}

let practiceMode = "topics";
function practiceView(mode) {
  practiceMode = mode === "mixed" ? "mixed" : "topics";
  return `${pageIntro("TURN IDEAS INTO SKILLS", practiceMode === "mixed" ? "Choose the approach yourself." : "Practice one useful skill.", "Supported work, fresh attempts, and delayed recall have different jobs.")}<div class="practice-modes"><a class="button ${practiceMode === "topics" ? "primary" : "secondary"}" href="#practice">By topic</a><a class="button ${practiceMode === "mixed" ? "primary" : "secondary"}" href="#practice/mixed">Mixed problems</a></div>${practiceMode === "topics" ? '<div class="practice-filter"><label for="practice-search">Find an exercise</label><input id="practice-search" type="search" placeholder="Search by topic or lesson…"></div>' : '<p class="checkpoint-intro">These are additional problems. Pattern labels are hidden. Problems appear once their foundation checkpoint is ready, and can be revisited.</p>'}<div class="exercise-grid" id="exercise-grid">${exerciseCards("")}</div>`;
}
function exerciseCards(term) {
  if (practiceMode === "mixed") {
    const tasks = Object.entries(transferTasks).filter(([, problem]) => problem.requires.every((id) => ready(state, id)));
    return tasks.length
      ? tasks
          .map(
            ([id, l], i) =>
              `<article class="exercise-card"><span class="tag">MIXED PRACTICE ${i + 1}</span><h3>${l.title}</h3><p>${l.task}</p><a class="subtle-link" href="#check/${id}/transfer">${state.practice[`${id}:transfer`]?.completedAt ? "Try again" : "Choose an approach"} →</a></article>`
          )
          .join("")
      : '<p class="empty-text">Pass some foundation checkpoints first. Mixed problems will appear here as you build those skills.</p>';
  }
  return (
    route
      .map((id) => lessons[id])
      .filter((l) => (l.title + " " + modules[l.module][2]).toLowerCase().includes(term.toLowerCase()))
      .map(
        (l) =>
          `<article class="exercise-card"><div><span class="tag">${modules[l.module][2]}</span><span class="${ready(state, l.id) ? "green" : "muted"}">${skillLabel(l.id)}</span></div><h3>${l.title}</h3><p>${checkpoints[l.id].task}</p><div class="card-bottom"><a class="subtle-link" href="#lesson/${l.id}">Study the idea</a><a class="subtle-link" href="#check/${l.id}">${unlocked(l.id) ? "Try the checkpoint" : "See prerequisites"} →</a></div></article>`
      )
      .join("") || '<p class="empty-text">No exercises match. Try a broader topic.</p>'
  );
}
let visual = { type: "binary", index: 0, target: 17, values: [2, 5, 8, 11, 14, 17, 20], frames: [], timer: null };
function setFrames() {
  visual.frames =
    visual.type === "bfs"
      ? bfsTrace()
      : visual.type === "insertion"
        ? insertionTrace(visual.values)
        : searchTrace(visual.values, visual.target, visual.type === "binary");
  visual.index = 0;
}
function visualView() {
  setFrames();
  return `${pageIntro("SLOW IT DOWN. SEE THE IDEA.", "A playground for your intuition.", "Control every step. Notice what changes, and ask yourself what happens next.")}<div class="visual-controls"><label>Algorithm<select id="visual-type"><option value="binary" ${visual.type === "binary" ? "selected" : ""}>Binary search</option><option value="linear" ${visual.type === "linear" ? "selected" : ""}>Linear search</option><option value="insertion" ${visual.type === "insertion" ? "selected" : ""}>Insertion sort</option><option value="bfs" ${visual.type === "bfs" ? "selected" : ""}>Breadth-first search</option></select></label><label>Values (up to 16 integers)<input id="visual-values" value="${visual.values.join(", ")}" ${visual.type === "bfs" ? "disabled" : ""}></label><label class="target-label">Target<input id="visual-target" type="number" value="${visual.target}" ${["insertion", "bfs"].includes(visual.type) ? "disabled" : ""}></label><button class="button secondary" id="visual-apply">Apply & restart</button></div><p class="fine-print">Binary search sorts your entered values first. Indices refer to that sorted list. Inputs may contain duplicates; the first match encountered is shown.</p><section class="visual-stage"><div class="visual-stage-top"><span class="eyebrow">${visual.type === "bfs" ? "A SMALL NETWORK" : "FOLLOW THE HIGHLIGHTED VALUE"}</span><span class="tag" id="frame-count"></span></div><div id="visual-canvas"></div><div class="visual-narration" id="visual-narration" aria-live="polite"></div><div class="playback"><button class="icon-button" id="visual-reset" aria-label="Restart visualization">↺</button><button class="button secondary" id="visual-back">← Back</button><button class="button primary" id="visual-play">▷ Play</button><button class="button secondary" id="visual-next">Step →</button><label>Speed<select id="visual-speed"><option value="1400">Slow</option><option value="800" selected>Normal</option><option value="350">Fast</option></select></label></div></section><div class="visual-bottom"><div class="callout"><span class="eyebrow green">BEFORE YOU PRESS STEP</span><h3>Make a tiny prediction.</h3><p>Which value will the algorithm inspect next? Which values can it ignore? Say why, then check what happens.</p></div><div class="callout"><span class="eyebrow green">CONNECT IT TO THE CODE</span><h3>The picture is only the beginning.</h3><p>Try writing the same steps in Python. Then change an input and see whether your reasoning still holds.</p><a href="#practice" class="subtle-link">Open the practice studio →</a></div></div>`;
}
function updateVisual() {
  const f = visual.frames[visual.index];
  if (!f || !$("#visual-canvas")) return;
  $("#frame-count").textContent = `STEP ${visual.index} / ${visual.frames.length - 1}`;
  if (visual.type === "bfs") {
    const pos = { A: [60, 140], B: [210, 65], C: [210, 215], D: [370, 65], E: [370, 215], F: [525, 140] };
    $("#visual-canvas").innerHTML =
      `<svg class="graph" viewBox="0 0 590 280" role="img" aria-label="Directed graph with nodes A to F"><defs><marker id="arr" markerWidth="7" markerHeight="7" refX="21" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="#96aba1"/></marker></defs>${[
        ["A", "B"],
        ["A", "C"],
        ["B", "D"],
        ["C", "D"],
        ["C", "E"],
        ["D", "F"],
        ["E", "F"],
      ]
        .map(([a, b]) => `<path d="M${pos[a]}L${pos[b]}" stroke="#b6c6bf" stroke-width="2" marker-end="url(#arr)"/>`)
        .join("")}${Object.entries(pos)
        .map(
          ([n, [x, y]]) =>
            `<circle cx="${x}" cy="${y}" r="23" fill="${f.active === n ? "#235b46" : f.seen.includes(n) ? "#dceacc" : "#fff"}" stroke="#6e927d"/><text x="${x}" y="${y + 6}" text-anchor="middle" fill="${f.active === n ? "white" : "#2c4b3b"}" font-size="17" font-family="monospace">${n}</text>`
        )
        .join("")}</svg><div class="queue-display">QUEUE <strong>${f.queue.length ? f.queue.join(" → ") : "empty"}</strong></div>`;
  } else {
    const max = Math.max(...f.values.map(Math.abs), 1);
    $("#visual-canvas").innerHTML =
      `<div class="bars">${f.values.map((v, i) => `<div class="bar-slot ${f.excluded?.includes(i) ? "excluded" : ""}"><span class="bar ${f.active.includes(i) ? "active" : f.sorted?.includes(i) ? "sorted" : ""}" style="height:${55 + (Math.abs(v) / max) * 130}px"><b>${v}</b></span><small>${i}</small></div>`).join("")}</div><div class="visual-legend"><span><i class="legend-dot active"></i>Current</span><span><i class="legend-dot sorted"></i>${visual.type === "insertion" ? "Sorted prefix" : "Candidate"}</span><strong>${f.checks} value comparisons</strong></div>`;
  }
  $("#visual-narration").textContent = f.text;
  $("#visual-back").disabled = visual.index === 0;
  $("#visual-next").disabled = visual.index === visual.frames.length - 1;
}
function stopPlay() {
  clearInterval(visual.timer);
  visual.timer = null;
  if ($("#visual-play")) $("#visual-play").textContent = "▷ Play";
}
let labKind = "search",
  labN = 64;
function referenceLabView() {
  return `${pageIntro("LESS GUESSING. MORE EVIDENCE.", "How does your algorithm grow?", "Compare actual value comparisons as the input grows. Big O becomes much easier to see.")}<div class="lab-controls"><div class="segmented"><button data-lab-kind="search" class="${labKind === "search" ? "active" : ""}">Finding a value</button><button data-lab-kind="sort" class="${labKind === "sort" ? "active" : ""}">Sorting a list</button></div><label>Input size <strong id="lab-size-label">${labN}</strong><input type="range" min="2" max="256" step="1" id="lab-size" value="${labN}"></label></div><div id="lab-content"></div><div class="callout"><strong>Count the work, then name the growth.</strong><p>These counters come from executing reference implementations on the stated inputs. They count value comparisons, not all operations. One input cannot establish a complexity class. In Python practice, you can also inspect executed line steps and traced timings for your own solution. Memory costs below are analytical, not measured byte usage.</p></div>`;
}

let growthSelected = 0,
  growthDistribution = "reverse",
  growthResult = null;
function growthMarkup() {
  return `<section class="growth-workspace"><div class="section-heading"><div><h2>Try your own code as the input grows.</h2><p>Use a saved lesson solution. Correctness is checked at every size.</p></div></div><div class="growth-controls"><label for="growth-lesson">Your lesson code<select id="growth-lesson">${Object.keys(
    growthProfiles
  )
    .map((id) => `<option value="${id}" ${Number(id) === growthSelected ? "selected" : ""}>${lessons[id].title}</option>`)
    .join(
      ""
    )}</select></label><label for="growth-distribution">Input order<select id="growth-distribution"><option value="reverse" ${growthDistribution === "reverse" ? "selected" : ""}>Reverse order</option><option value="sorted" ${growthDistribution === "sorted" ? "selected" : ""}>Sorted order</option><option value="duplicates" ${growthDistribution === "duplicates" ? "selected" : ""}>Repeated values</option></select></label><button class="button primary" id="run-growth">Run my code across sizes →</button></div><p class="fine-print">Sizes: 8, 16, 32, 64, 128. ${growthProfiles[growthSelected]}. Search/merge/string profiles retain their required shape, regardless of input-order selection.</p><div id="growth-results" aria-live="polite">${growthResult && growthResult.id === growthSelected && growthResult.distribution === growthDistribution ? growthResultsMarkup(growthResult.results) : "<p>Write and test the lesson exercise first. This experiment uses its saved code, not the separate checkpoint solution.</p>"}</div><details class="more-detail"><summary>What these measurements mean</summary><p>Source-line steps count executed student lines, including calls, not CPU operations or library internals. Timing is separate: one untraced warm-up and the median of three untraced function calls per size, with fresh arguments and namespaces. Compilation, input copying, and module-level setup are excluded from those timings.</p><p>These small samples illustrate behavior on this browser. They do not prove a complexity class, compare different machines fairly, or measure memory. Vary the input and explain the growth using the algorithm.</p></details></section>`;
}
function labView() {
  return referenceLabView() + growthMarkup();
}
function growthResultsMarkup(results) {
  return `<div class="table-scroll"><table class="growth-table"><thead><tr><th>Size parameter n</th><th>Correct?</th><th>Source-line steps</th><th>Median untraced ms</th></tr></thead><tbody>${results.map((r, i) => `<tr><td>${[8, 16, 32, 64, 128][i]}</td><td>${r.passed ? "✓" : "Failed"}</td><td>${r.steps}</td><td>${r.untracedMs === null || r.untracedMs === undefined ? "—" : r.untracedMs.toFixed(4)}</td></tr>${!r.passed ? `<tr><td colspan="4">${esc(r.error || `Returned ${r.actual}; check your contract and loop bounds.`)}</td></tr>` : ""}`).join("")}</tbody></table></div><p>${results.every((r) => r.passed) ? "All five outputs match. Now compare how the step counts change when n doubles." : "Fix correctness or stopping-rule errors before drawing conclusions about growth."}</p>`;
}
function bindGrowth() {
  if (!$("#run-growth")) return;
  $("#growth-lesson").onchange = (e) => {
    growthSelected = Number(e.target.value);
    render();
  };
  $("#growth-distribution").onchange = (e) => {
    growthDistribution = e.target.value;
    render();
  };
  $("#run-growth").onclick = async () => {
    if (runningJob) return;
    const id = growthSelected,
      distribution = growthDistribution,
      code = state.drafts[id]?.code,
      token = location.hash;
    if (!code) {
      $("#growth-results").innerHTML =
        `<p>Start by writing the lesson exercise for “${lessons[id].title}”. <a href="#lesson/${id}">Open the lesson →</a></p>`;
      return;
    }
    runningJob = true;
    $("#run-growth").disabled = true;
    $("#growth-lesson").disabled = true;
    $("#growth-distribution").disabled = true;
    $("#growth-results").innerHTML = "<p>Running correctness checks, one warm-up, and three untraced measurements per size…</p>";
    try {
      const results = await executePython(
        code,
        [8, 16, 32, 64, 128].map((n) => growthCases(id, n, distribution)),
        { experiment: true, ...pythonContract(lessons[id]) }
      );
      growthResult = { id, distribution, results };
      if (location.hash === token && growthSelected === id && $("#growth-results")) $("#growth-results").innerHTML = growthResultsMarkup(results);
    } catch (e) {
      if (location.hash === token && $("#growth-results")) $("#growth-results").innerHTML = `<p>${esc(e.message)} Your code is saved.</p>`;
    } finally {
      runningJob = false;
      if (location.hash === token && $("#run-growth")) {
        $("#run-growth").disabled = false;
        $("#growth-lesson").disabled = false;
        $("#growth-distribution").disabled = false;
      }
    }
  };
}
function projectsView() {
  return `${pageIntro("CONNECT THE PIECES", "Build something in stages.", "Each mission has working code, checks, and a change in requirements. Use the same lesson progress along the way.")}<div class="tools-list">${projects
    .map((project) => {
      const mission = project.missions.find(([id, , , kind]) =>
        kind === "lesson" ? !state.done[id] : kind === "transfer" ? !state.practice[`${id}:transfer`]?.completedAt : !ready(state, id)
      );
      return `<article class="learning-tool project-card"><div><h2>${project.title}</h2><p>${project.description}</p><ol class="project-missions">${project.missions
        .map(([id, h, p, kind]) => {
          const done =
            kind === "lesson" ? !!state.done[id] : kind === "transfer" ? !!state.practice[`${id}:transfer`]?.completedAt : ready(state, id);
          return `<li><strong>${done ? "✓ " : ""}${h}</strong><p>${p}</p><a href="#${kind === "lesson" ? "lesson" : "check"}/${id}${kind === "transfer" ? "/transfer" : ""}">${done ? "Revisit" : unlocked(id) ? "Open this mission" : "See the foundations"} →</a></li>`;
        })
        .join(
          ""
        )}</ol></div>${mission ? `<a class="button primary" href="#${mission[3] === "lesson" ? "lesson" : "check"}/${mission[0]}${mission[3] === "transfer" ? "/transfer" : ""}">Continue this project →</a>` : '<span class="tag">All missions attempted · test your own changes next</span>'}</article>`;
    })
    .join("")}</div>`;
}

function updateLab() {
  const r = measure(labKind, labN),
    sort = labKind === "sort",
    names = sort ? ["Insertion sort", "Merge sort"] : ["Linear search", "Binary search"];
  const points = [4, 8, 16, 32, 64, 128, 256].map((n) => measure(labKind, n)),
    max = Math.max(...points.map((p) => p.slow));
  const plot = (key) => points.map((p, i) => `${55 + i * 81},${240 - (p[key] / max) * 180}`).join(" ");
  $("#lab-content").innerHTML =
    `<div class="lab-comparison">${[r.slow, r.fast].map((n, i) => `<article class="benchmark-card ${i === 1 ? "efficient" : ""}"><span class="eyebrow">${i === 0 ? "THE STRAIGHTFORWARD APPROACH" : "A DIFFERENT STRATEGY"}</span><h2>${names[i]}</h2><strong class="big-number">${n.toLocaleString()}</strong><span>value comparisons · n = ${labN}</span><div class="comparison-bar"><i style="width:${Math.max(1, (n / r.slow) * 100)}%"></i></div><div class="benchmark-cost"><span>Time growth <b>${sort ? (i === 0 ? "O(n²) worst case" : "O(n log n)") : i === 0 ? "O(n) worst case" : "O(log n) worst case"}</b></span><span>Extra space <b>${sort ? (i === 0 ? "O(1) in place" : "O(n) peak auxiliary") : "O(1)"}</b></span></div></article>`).join("")}</div><div class="chart-panel"><div class="section-heading"><div><h2>A bigger input tells the story.</h2><p>${sort ? "Both algorithms sort the same reverse-sorted integers." : "Both algorithms search the same sorted integers for the last value (n)."}</p></div><span class="tag">COUNTED, NOT ESTIMATED</span></div><svg class="growth-chart" viewBox="0 0 600 290" role="img" aria-label="Value comparison growth for input sizes 4 through 256"><path d="M55 35V240H565" stroke="#c4cfc7" fill="none"/>${[0, 0.5, 1].map((x) => `<g><path d="M55 ${240 - x * 180}H565" stroke="#e5e9e2"/><text x="45" y="${244 - x * 180}" text-anchor="end" fill="#748178" font-size="11">${Math.round(max * x).toLocaleString()}</text></g>`).join("")}<polyline points="${plot("slow")}" fill="none" stroke="#c39771" stroke-width="3"/><polyline points="${plot("fast")}" fill="none" stroke="#276348" stroke-width="3"/>${points.map((p, i) => `<g><circle cx="${55 + i * 81}" cy="${240 - (p.slow / max) * 180}" r="4" fill="#c39771"/><circle cx="${55 + i * 81}" cy="${240 - (p.fast / max) * 180}" r="4" fill="#276348"/><text x="${55 + i * 81}" y="260" text-anchor="middle" fill="#748178" font-size="11">${p.n}</text></g>`).join("")}<text x="300" y="284" text-anchor="middle" fill="#748178" font-size="11">INPUT SIZE (n)</text></svg><div class="chart-legend"><span><i style="background:#c39771"></i>${names[0]}</span><span><i style="background:#276348"></i>${names[1]}</span></div><details><summary>See the exact counts</summary><table><thead><tr><th>n</th><th>${names[0]}</th><th>${names[1]}</th></tr></thead><tbody>${points.map((p) => `<tr><td>${p.n}</td><td>${p.slow}</td><td>${p.fast}</td></tr>`).join("")}</tbody></table></details></div><div class="watch-out"><span>◎</span><div><strong>${sort ? "Input order matters." : "Remember the precondition."}</strong><p>${sort ? "Reverse order is a worst-case input for insertion sort. Already-sorted input behaves very differently. Merge sort still has O(n log n) worst-case growth." : "Binary search needs sorted data. The cost of sorting an unsorted list is not included here; include it when choosing a strategy for a real problem."}</p></div></div>`;
}
let reviewSession = null;
function reviewView() {
  return `${pageIntro("RETRIEVE BEFORE REREADING", "Bring a useful idea back.", "Try a small question or write a familiar solution from memory. Mixed practice offers different problems.")}<div class="review-overview"><span class="review-symbol">↻</span><div><strong>${due().length} ideas are ready for a revisit.</strong><p>Concept reviews use 1, 3, 7, 14, then 30 days. Code recall starts after 2 days, then 7, 14, and 30. These are practical schedules, not proven optimal intervals.</p></div></div>${
    reviewSession
      ? reviewSessionMarkup()
      : `<div class="review-list">${
          completed().length
            ? completed()
                .map((l) => {
                  const r = state.reviews[l.id],
                    now = Date.now(),
                    isDue = !r || r.due <= now,
                    codeDue = r?.codeDue !== undefined && r.codeDue <= now;
                  return `<article class="review-row"><span class="stat-icon sage">${modules[l.module][3]}</span><div><h3>${l.title}</h3><p>${isDue ? "Concept review is ready" : `Concept review: ${new Date(r.due).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`}${r?.codeDue ? ` · Code recall ${codeDue ? "is ready" : new Date(r.codeDue).toLocaleDateString(undefined, { month: "short", day: "numeric" })}` : ""}</p></div><div class="review-actions"><button class="button ${isDue ? "primary" : "secondary"}" data-review="${l.id}">${isDue ? "Review the idea" : "Practice the idea"} →</button>${ready(state, l.id) ? `<button class="button secondary" data-code-review="${l.id}">Write from memory →</button>` : `<a class="subtle-link" href="#check/${l.id}">Try the checkpoint →</a>`}</div></article>`;
                })
                .join("")
            : `<div class="empty-state"><h2>Your first idea is waiting.</h2><p>Complete lesson practice to start concept review; pass a checkpoint to add coding recall.</p>${activityLink(nextActivity(state), "Start learning")}</div>`
        }</div>`
  }<div class="callout"><strong>Recall and transfer do different jobs.</strong><p>Rewriting a familiar solution checks retrieval. A different, unlabelled problem checks whether you can choose and adapt a strategy. Use both, and revisit mistakes with an explanation.</p><a class="subtle-link" href="#practice/mixed">Try mixed practice →</a></div>`;
}
function reviewSessionMarkup() {
  const l = lessons[reviewSession.id],
    r = state.reviews[l.id],
    question = (r?.stage || 0) % 2 ? l.predict : l.reflect;
  return `<article class="lesson-panel narrow"><button class="text-button" id="review-close">← Back to queue</button><span class="eyebrow green">${l.title}</span>${quizMarkup(question, "review", reviewSession.answer)}${reviewSession.answer !== undefined ? `<div class="cost-box">${question.why}</div><button class="button primary" id="review-finish">Save review →</button>` : ""}</article>`;
}
function methodView() {
  return `${pageIntro("A THOUGHTFUL WAY TO LEARN", "Designed to make ideas click.", "A practical synthesis of teaching patterns and learning research, with sources you can inspect.")}<div class="method-grid">${[
    ["01", "Understand", "Start with a familiar situation, define the input and output, then trace a small worked example."],
    ["02", "Predict", "Commit to an answer before seeing what happens. Feedback points you toward the reasoning."],
    ["03", "Build", "Write real Python, run edge cases, and use hints when needed. Study the worked solution, then try from a blank editor."],
    ["04", "Explain", "Reason about correctness, time, and space. Add a plain-language note in your own words."],
    ["05", "Retrieve", "Return after a gap. Answer a concept question or rewrite code from memory before reopening help."],
    ["06", "Transfer", "Choose approaches for unlabelled mixed problems, then connect skills in the multi-mission route and packing projects."],
  ]
    .map(([n, h, p]) => `<article class="method-card"><span>${n}</span><h2>${h}</h2><p>${p}</p></article>`)
    .join(
      ""
    )}</div><section class="sources-panel"><h2>The ideas behind the experience</h2><p>These are design influences, not endorsements. All lesson explanations and exercises in this app are original. The curriculum order and review schedule are our design choices, not claims that a single best method works for everyone.</p>${[
    [
      "DesignGurus · course structure",
      "Worked examples, constraint variations, independent challenges, and unlabelled assessments.",
      "https://www.designgurus.io/course-play/grokking-the-coding-interview/doc/course-overview",
    ],
    [
      "DesignGurus · dynamic programming",
      "Recursive solutions developed into memoization and tabulation.",
      "https://www.designgurus.io/course/grokking-dynamic-programming",
    ],
    [
      "CMU · learning principles",
      "Prior knowledge, goal-directed practice, feedback, and integrating skills.",
      "https://www.cmu.edu/teaching/principles/learning.html",
    ],
    [
      "IES · learning practice guide",
      "Spacing, worked examples with problem solving, retrieval, and explanation.",
      "https://ies.ed.gov/ncee/wwc/PracticeGuide/1",
    ],
    [
      "LeetCode · study plans",
      "Curated practice sets that reduce the work of choosing what to solve next.",
      "https://leetcode.com/studyplan/leetcode-75/",
    ],
    [
      "LeetCode · testing workflow",
      "Custom test cases for debugging, followed by a separate checkpoint. Our checks run locally and are formative.",
      "https://support.leetcode.com/hc/en-us/articles/360012016874-Start-your-Coding-Practice",
    ],
    ["Programiz", "Practical examples, structured DSA lessons, exercises, and projects.", "https://www.programiz.com/dsa"],
    ["Brilliant", "Interactive problem solving, guided paths, and immediate feedback.", "https://brilliant.org/faq/"],
    ["VisuAlgo", "Algorithm animations paired with opportunities to test understanding.", "https://visualgo.net/training"],
    [
      "The Learning Scientists",
      "Retrieval practice, spacing, interleaving, concrete examples, elaboration, and dual coding.",
      "https://www.learningscientists.org/faq",
    ],
    [
      "MIT OpenCourseWare · 6.006",
      "A reference for broader algorithm coverage and continued study beyond this core path.",
      "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/",
    ],
    [
      "Python documentation",
      "List, dictionary, stack, and queue behavior; deque for efficient front removals.",
      "https://docs.python.org/3/tutorial/datastructures.html",
    ],
    [
      "Pyodide documentation",
      "Python execution in the browser, isolated from the interface in a Web Worker.",
      "https://pyodide.org/en/stable/usage/webworker.html",
    ],
  ]
    .map(([h, p, u]) => `<a href="${u}" target="_blank" rel="noopener"><div><h3>${h}</h3><p>${p}</p></div><span>↗</span></a>`)
    .join(
      ""
    )}<p class="fine-print">Sources consulted October 15, 2026. We have not independently tested the effectiveness of this platform. Prerequisite checks and practice are formative, not secure exams or proof of mastery. Reattempts after help are labelled. Completing this core path builds foundations; deeper study and varied independent work remain important.</p></section>`;
}
let pythonWorker = null,
  pythonStatus = "idle",
  pythonReady = null,
  pendingRun = null,
  initTimer = null;
function initPython() {
  if (pythonReady) return pythonReady;
  pythonStatus = "loading";
  updatePythonStatus();
  pythonReady = new Promise((resolve, reject) => {
    try {
      pythonWorker = new Worker(new URL("./python-worker.js", import.meta.url), { type: "module" });
    } catch (e) {
      pythonStatus = "error";
      pythonReady = null;
      reject(e);
      return;
    }
    initTimer = setTimeout(() => {
      pythonWorker.terminate();
      pythonReady = null;
      pythonStatus = "error";
      reject(new Error("Python could not load in time. Check your connection and try again."));
    }, 90000);
    pythonWorker.onmessage = ({ data }) => {
      if (data.type === "ready") {
        clearTimeout(initTimer);
        pythonStatus = "ready";
        updatePythonStatus();
        resolve();
      }
      if (data.type === "result" && pendingRun?.id === data.id) {
        clearTimeout(pendingRun.timer);
        pendingRun.resolve(data.results);
        pendingRun = null;
      }
      if (data.type === "error") {
        if (pendingRun) {
          clearTimeout(pendingRun.timer);
          pendingRun.reject(new Error(data.message));
          pendingRun = null;
        } else {
          clearTimeout(initTimer);
          pythonReady = null;
          pythonStatus = "error";
          reject(new Error("Python could not start. Check that the runtime assets loaded. " + data.message));
        }
      }
    };
    pythonWorker.onerror = () => {
      clearTimeout(initTimer);
      pythonStatus = "error";
      pythonReady = null;
      reject(new Error("Python could not load. Check your connection or content blocker."));
      if (pendingRun) {
        clearTimeout(pendingRun.timer);
        pendingRun.reject(new Error("The Python worker stopped. Try running again."));
        pendingRun = null;
      }
    };
    pythonWorker.postMessage({ type: "init" });
  });
  return pythonReady;
}
function updatePythonStatus() {
  if ($("#python-status"))
    $("#python-status").textContent =
      pythonStatus === "ready"
        ? "● Python ready"
        : pythonStatus === "loading"
          ? "◌ Loading Python (first run may take a minute)…"
          : "● Python unavailable; run to retry";
}
let runningJob = false;
async function executePython(code, tests, extra = {}) {
  await initPython();
  return new Promise((resolve, reject) => {
    const runId = crypto.randomUUID();
    pendingRun = {
      id: runId,
      resolve,
      reject,
      timer: setTimeout(() => {
        pythonWorker.terminate();
        pythonWorker = null;
        pythonReady = null;
        pythonStatus = "idle";
        pendingRun = null;
        reject(new Error("Execution stopped after 5 seconds. Check for a loop or recursion that never finishes."));
      }, 5000),
    };
    pythonWorker.postMessage({ type: "run", id: runId, code, tests, ...extra });
  });
}
async function runCode() {
  const context = activeExercise();
  if (!context || runningJob) return;
  const { d, exercise: l, token } = context,
    button = $("#run-code"),
    code = d.code,
    epoch = accountEpoch;
  runningJob = true;
  d.passedCode = null;
  d.results = null;
  save();
  updateCheckpointButton();
  if ($("#practice-continue")) $("#practice-continue").disabled = true;
  button.disabled = true;
  button.textContent = "◌ Running…";
  $("#code-editor").readOnly = true;
  $("#test-results").innerHTML =
    '<div class="empty-results"><strong>Preparing your Python workspace…</strong><p>The first run loads the bundled runtime. Your code executes in this browser.</p></div>';
  try {
    const results = await executePython(code, l.tests, pythonContract(l));
    if (d.code !== code || epoch !== accountEpoch) return;
    d.results = results;
    d.passedCode = results.every((r) => r.passed) ? code : null;
    activeDay();
    save();
    if (location.hash === token && $("#test-results")) {
      $("#test-results").innerHTML =
        resultsMarkup(l, results) +
        (results.some((r) => !r.passed)
          ? '<div class="retry-help"><p>Try a hint, or compare your reasoning with a solved example.</p><button class="button secondary" data-open-solution>Walk through the solution →</button></div>'
          : "");
      if ($("#practice-continue")) {
        $("#practice-continue").disabled = d.passedCode !== d.code;
        $("#practice-continue").textContent = d.passedCode === d.code ? "Next: understand the cost →" : "Pass the tests to continue";
      }
      updateCheckpointButton();
    }
  } catch (e) {
    if (location.hash === token && $("#test-results"))
      $("#test-results").innerHTML =
        `<div class="feedback retry"><strong>A useful chance to debug.</strong><pre>${esc(e.message)}</pre><p>Your code is saved. Check the stopping rule or connection, then try again.</p><button class="button secondary" data-open-solution>Walk through the solution →</button></div>`;
  } finally {
    runningJob = false;
    if (location.hash === token && $("#run-code")) {
      $("#run-code").disabled = false;
      $("#run-code").textContent = "▷ Run tests";
      $("#code-editor").readOnly = false;
      updatePythonStatus();
    }
  }
}
function checkpointActionMarkup(context) {
  const { id, kind, d } = context,
    passed = validRun(d),
    supported = d.assisted || d.hint > 0;
  const next = kind === "transfer" ? { kind: "transfer" } : kind === "recall" ? { kind: "review" } : checkpointDestination(state, id);
  const label = !passed
    ? "Pass tests to continue"
    : kind === "transfer"
      ? "Save & return to practice"
      : kind === "recall"
        ? "Save & return to review"
        : next.kind === "lesson"
          ? "Save & open next lesson"
          : next.kind === "review"
            ? "Save & open review"
            : "Save & continue";
  const target = next.kind === "lesson" || next.kind === "checkpoint" ? `Up next: ${lessons[next.id].title}. ` : "";
  return `<section class="checkpoint-action" aria-label="Continue after tests"><p>${passed ? `${esc(target)}${supported ? "This attempt will be saved as supported practice." : d.exposed ? "This attempt will be saved as a reattempt after earlier help." : "Your passing attempt will be saved."}` : "Run the provided tests to enable this button."}</p><button class="button primary" id="save-checkpoint" ${!passed ? "disabled" : ""}>${label}<span aria-hidden="true">→</span></button><small>Notes are optional.</small></section>`;
}
function updateCheckpointButton() {
  const c = activeExercise();
  if (c && $("#checkpoint-action")) $("#checkpoint-action").innerHTML = checkpointActionMarkup(c);
}
function saveCheckpointAndContinue() {
  const context = activeExercise();
  if (!context || context.kind === "lesson" || runningJob || !validRun(context.d)) return;
  const { id, kind, d } = context;
  if (kind === "transfer") {
    d.status = d.assisted || d.hint ? "supported" : d.exposed ? "reattempt" : "without-help";
    d.completedAt = Date.now();
  } else if (!recordCheckpoint(state, id, d, Date.now(), kind)) return;
  activeDay();
  save();
  toast(
    d.status === "supported"
      ? "Saved as supported practice. You can revisit it later."
      : d.status === "reattempt"
        ? "Reattempt saved. Your progress is kept."
        : "Checkpoint saved."
  );
  location.hash = kind === "transfer" ? "#practice/mixed" : kind === "recall" ? "#review" : activityHref(lessonContinuation(state, id));
}

function currentLesson() {
  const [route, id] = location.hash.slice(1).split("/");
  return ["lesson", "check"].includes(route) ? Number(id) : -1;
}
function render() {
  stopPlay();
  const [route = "home", param, variant] = location.hash.slice(1).split("/");
  const names = {
    home: "Learn",
    path: "Course outline",
    lesson: "Learn",
    check: "Practice checkpoint",
    tools: "Tools",
    practice: "Practice studio",
    visual: "Visual playground",
    lab: "Efficiency lab",
    review: "Review queue",
    projects: "Projects",
    method: "How learning works",
  };
  $("#page-name").textContent = names[route] || "Learn";
  document.title = `${names[route] || "Learn"} · Algo Studio`;
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const selected =
      a.dataset.nav ===
      (["practice", "visual", "lab", "review", "projects", "method"].includes(route)
        ? "tools"
        : ["lesson", "check"].includes(route)
          ? "home"
          : route || "home");
    a.classList.toggle("active", selected);
    if (selected) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  if ($("#due-count")) $("#due-count").textContent = due().length;
  $("#main").innerHTML =
    route === "tools"
      ? toolsView()
      : route === "path"
        ? pathView(param)
        : route === "lesson"
          ? lessonView(Number(param))
          : route === "check"
            ? challengeView(Number(param), variant)
            : route === "practice"
              ? practiceView(param)
              : route === "visual"
                ? visualView()
                : route === "lab"
                  ? labView()
                  : route === "review"
                    ? reviewView()
                    : route === "projects"
                      ? projectsView()
                      : route === "method"
                        ? methodView()
                        : home();
  if (route === "visual") updateVisual();
  if (route === "lab") updateLab();
  if (["home", "lesson", "check", "practice"].includes(route || "home")) {
    $("#main").insertAdjacentHTML(
      "afterbegin",
      '<div class="progress-save-panel" id="progress-save-panel"><p id="progress-save-status" role="status"></p><button class="text-button" id="progress-save-account"></button></div>'
    );
    updateSaveStatus();
  }
  $("#sidebar").classList.remove("mobile-open");
  $("#menu-button").setAttribute("aria-expanded", "false");
  bindPage();
}
function bindPage() {
  const id = currentLesson();
  bindGrowth();
  document.querySelectorAll("[data-code-review]").forEach(
    (b) =>
      (b.onclick = () => {
        const i = Number(b.dataset.codeReview),
          old = state.practice[`${i}:recall`];
        state.practice[`${i}:recall`] = {
          code: checkpoints[i].starter,
          hint: 0,
          notes: "",
          assisted: false,
          exposed: !!old?.exposed,
          previousCode: old?.code || "",
        };
        save();
        location.hash = `check/${i}/recall`;
      })
  );
  document.querySelectorAll("[data-walk]").forEach(
    (b) =>
      (b.onclick = () => {
        draft(id).walkIndex = Number(b.dataset.walk);
        save();
        render();
        $(".walkthrough-step").focus({ preventScroll: true });
      })
  );
  document.querySelectorAll("[data-step]").forEach(
    (b) =>
      (b.onclick = () => {
        draft(id).step = Number(b.dataset.step);
        save();
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
  );
  document.querySelectorAll("[data-answer]").forEach(
    (b) =>
      (b.onclick = () => {
        const key = b.dataset.answer,
          value = Number(b.dataset.index);
        if (key === "review") {
          if (reviewSession.answer !== undefined) return;
          reviewSession.answer = value;
          render();
          return;
        }
        draft(id)[key] = value;
        save();
        render();
        document.querySelector(`[data-answer="${key}"][data-index="${value}"]`)?.focus({ preventScroll: true });
      })
  );
  const context = activeExercise();
  if ($("#code-editor") && context) {
    const { d, exercise: l, kind } = context,
      e = $("#code-editor");
    const paintCode = () => {
      const pre = $("#code-highlight");
      pre.innerHTML = highlightPython(e.value) + (e.value.endsWith("\n") ? " " : "");
      pre.scrollTop = e.scrollTop;
      pre.scrollLeft = e.scrollLeft;
    };
    paintCode();
    if ($("#jump-to-editor"))
      $("#jump-to-editor").onclick = () =>
        $(".editor-panel").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    e.oninput = () => {
      paintCode();
      d.code = e.value;
      d.passedCode = null;
      d.results = null;
      if ($("#practice-continue")) {
        $("#practice-continue").disabled = true;
        $("#practice-continue").textContent = "Pass the tests to continue";
      }
      $("#line-numbers").textContent = e.value
        .split("\n")
        .map((_, i) => i + 1)
        .join("\n");
      save();
      $("#test-results").innerHTML = '<p class="editor-changed">Code changed. Run tests to check this version.</p>';
      updateCheckpointButton();
    };
    e.onscroll = () => {
      $("#line-numbers").scrollTop = e.scrollTop;
      $("#code-highlight").scrollTop = e.scrollTop;
      $("#code-highlight").scrollLeft = e.scrollLeft;
    };
    const applyEdit = (edit) => {
      if (!edit || e.readOnly) return;
      const direction = e.selectionDirection,
        top = e.scrollTop,
        left = e.scrollLeft;
      e.setRangeText(edit.text, edit.from, edit.to, "preserve");
      e.setSelectionRange(edit.start, edit.end, direction);
      e.focus({ preventScroll: true });
      e.scrollTop = top;
      e.scrollLeft = left;
      e.dispatchEvent(new Event("input"));
    };
    for (const [selector, outdent] of [
      ["#indent-code", false],
      ["#outdent-code", true],
    ]) {
      const button = $(selector);
      button.onmousedown = (ev) => ev.preventDefault();
      button.onclick = () => applyEdit(indentEdit(e.value, e.selectionStart, e.selectionEnd, outdent));
    }
    e.onkeydown = (ev) => {
      if (ev.isComposing) return;
      if (ev.key === "Escape") {
        ev.preventDefault();
        $("#run-code").focus();
        return;
      }
      if (e.readOnly) return;
      if (ev.key === "Tab") {
        ev.preventDefault();
        applyEdit(indentEdit(e.value, e.selectionStart, e.selectionEnd, ev.shiftKey));
      } else if (ev.key === "Backspace" && !ev.ctrlKey && !ev.metaKey && !ev.altKey) {
        const edit = backspaceIndentEdit(e.value, e.selectionStart, e.selectionEnd);
        if (edit) {
          ev.preventDefault();
          applyEdit(edit);
        }
      } else if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)) {
        ev.preventDefault();
        if (!$("#run-code").disabled) runCode();
      } else if (ev.key === "Enter") {
        ev.preventDefault();
        applyEdit(newlineEdit(e.value, e.selectionStart, e.selectionEnd));
      }
    };
    $("#run-code").onclick = () => runCode();
    $("#run-custom").onclick = async () => {
      if (runningJob) return;
      let args, expected;
      try {
        if ($("#custom-args").value.length + $("#custom-expected").value.length > 20000) throw Error("Keep this test small enough to inspect.");
        args = JSON.parse($("#custom-args").value);
        expected = JSON.parse($("#custom-expected").value);
        if (!Array.isArray(args)) throw Error("Arguments must be a JSON list, such as [[1,2,3],2].");
      } catch (e) {
        $("#custom-output").textContent = "Check the JSON: " + e.message;
        return;
      }
      const token = location.hash,
        code = d.code,
        epoch = accountEpoch;
      runningJob = true;
      $("#run-custom").disabled = true;
      $("#custom-output").textContent = "Running your example…";
      try {
        const results = await executePython(code, [{ args, expected }], pythonContract(l));
        if (d.code !== code || epoch !== accountEpoch) return;
        if (!results[0].passed) {
          d.passedCode = null;
          d.results = null;
          save();
          if (location.hash === token && $("#test-results"))
            $("#test-results").innerHTML = "<p>Your example and prediction differ. Check both, then rerun the provided tests before continuing.</p>";
        }
        if (location.hash === token && $("#custom-output")) {
          $("#custom-output").innerHTML = `<p>Compared with your predicted answer:</p>${resultsMarkup({ tests: [{ args, expected }] }, results)}`;
          if ($("#practice-continue")) {
            $("#practice-continue").disabled = d.passedCode !== d.code;
            $("#practice-continue").textContent = d.passedCode === d.code ? "Next: understand the cost →" : "Pass the tests to continue";
          }
          updateCheckpointButton();
        }
      } catch (e) {
        if (location.hash === token && $("#custom-output")) $("#custom-output").textContent = e.message;
      } finally {
        runningJob = false;
        if (location.hash === token && $("#run-custom")) $("#run-custom").disabled = false;
      }
    };

    $("#hint-button").onclick = () => {
      d.hint = Math.min((d.hint || 0) + 1, l.hints.length);
      d.assisted = true;
      d.exposed = true;
      save();
      render();
    };
    bindSolvedExample(l, d, context.token);
    $("#test-results").onclick = (event) => {
      if (event.target.closest("[data-open-solution]")) {
        $("#solved-example").open = true;
        $("#solved-example").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    if ($("#restore-code"))
      $("#restore-code").onclick = () => {
        const previous = d.code;
        d.code = d.previousCode;
        d.previousCode = previous;
        d.passedCode = null;
        d.results = null;
        save();
        render();
        toast("Previous code restored. Run its tests before continuing.");
      };
    $("#reset-code").onclick = () => {
      d.previousCode = d.code;
      d.code = l.starter;
      d.assisted = false;
      d.hint = 0;
      d.solutionOpen = false;
      d.passedCode = null;
      d.results = null;
      save();
      render();
      toast(d.exposed ? "Fresh editor ready. This is a reattempt after studying help." : "Fresh editor ready. Your explanation is saved.");
    };
    if ($("#checkpoint-action"))
      $("#checkpoint-action").onclick = (event) => {
        if (event.target.closest("#save-checkpoint")) saveCheckpointAndContinue();
      };
    if ($("#checkpoint-notes"))
      $("#checkpoint-notes").oninput = (e) => {
        d.notes = e.target.value;
        save();
      };
  }
  if ($("#lesson-notes"))
    $("#lesson-notes").oninput = (e) => {
      draft(id).notes = e.target.value;
      save();
    };
  document.querySelectorAll("#complete-lesson, #complete-with-checkpoint").forEach(
    (button) =>
      (button.onclick = () => {
        const d = draft(id),
          l = lessons[id];
        if (d.predict !== l.predict.answer || d.reflect !== l.reflect.answer || d.passedCode !== d.code) return;
        state.done[id] = { at: Date.now(), assisted: !!d.assisted };
        state.reviews[id] ??= { stage: 0, due: reviewDate(0) };
        activeDay();
        save();
        location.hash = button.id === "complete-with-checkpoint" ? `#check/${id}` : activityHref(lessonContinuation(state, id));
      })
  );
  document.querySelectorAll("[data-practice]").forEach(
    (b) =>
      (b.onclick = () => {
        const i = Number(b.dataset.practice);
        if (unlocked(i)) {
          draft(i).step = 2;
          save();
        }
        location.hash = `lesson/${i}`;
      })
  );
  if ($("#practice-search"))
    $("#practice-search").oninput = (e) => {
      $("#exercise-grid").innerHTML = exerciseCards(e.target.value);
      document.querySelectorAll("[data-practice]").forEach(
        (b) =>
          (b.onclick = () => {
            const i = Number(b.dataset.practice);
            if (unlocked(i)) draft(i).step = 2;
            save();
            location.hash = `lesson/${i}`;
          })
      );
    };
  if ($("#visual-type")) {
    $("#visual-type").onchange = (e) => {
      visual.type = e.target.value;
      visual.values = visual.type === "insertion" ? [9, 4, 7, 2, 8, 3] : [2, 5, 8, 11, 14, 17, 20];
      render();
    };
    $("#visual-apply").onclick = () => {
      const vals = $("#visual-values")
        .value.split(",")
        .map((s) => s.trim());
      const values = vals.map(Number),
        target = Number($("#visual-target").value);
      if (
        visual.type !== "bfs" &&
        (vals.some((s) => !s) || values.length > 16 || values.some((x) => !Number.isInteger(x) || Math.abs(x) > 999) || !Number.isInteger(target))
      ) {
        toast("Enter 1–16 integers between -999 and 999, separated by commas.");
        return;
      }
      visual.values = visual.type === "binary" ? values.sort((a, b) => a - b) : values;
      visual.target = target;
      stopPlay();
      setFrames();
      $("#visual-values").value = visual.values.join(", ");
      updateVisual();
    };
    $("#visual-next").onclick = () => {
      stopPlay();
      visual.index = Math.min(visual.index + 1, visual.frames.length - 1);
      updateVisual();
    };
    $("#visual-back").onclick = () => {
      stopPlay();
      visual.index = Math.max(0, visual.index - 1);
      updateVisual();
    };
    $("#visual-reset").onclick = () => {
      stopPlay();
      visual.index = 0;
      updateVisual();
    };
    $("#visual-play").onclick = () => {
      if (visual.timer) {
        stopPlay();
        return;
      }
      if (visual.index === visual.frames.length - 1) visual.index = 0;
      $("#visual-play").textContent = "Ⅱ Pause";
      visual.timer = setInterval(
        () => {
          visual.index++;
          updateVisual();
          if (visual.index >= visual.frames.length - 1) stopPlay();
        },
        Number($("#visual-speed").value)
      );
    };
    $("#visual-speed").onchange = () => {
      if (visual.timer) {
        stopPlay();
        $("#visual-play").click();
      }
    };
  }
  document.querySelectorAll("[data-lab-kind]").forEach(
    (b) =>
      (b.onclick = () => {
        labKind = b.dataset.labKind;
        render();
      })
  );
  if ($("#lab-size"))
    $("#lab-size").oninput = (e) => {
      labN = Number(e.target.value);
      $("#lab-size-label").textContent = labN;
      updateLab();
    };
  document.querySelectorAll("[data-review]").forEach(
    (b) =>
      (b.onclick = () => {
        reviewSession = { id: Number(b.dataset.review) };
        render();
      })
  );
  if ($("#review-close"))
    $("#review-close").onclick = () => {
      reviewSession = null;
      render();
    };
  if ($("#review-finish"))
    $("#review-finish").onclick = () => {
      const i = reviewSession.id,
        r = state.reviews[i] || { stage: 0, due: 0 },
        q = r.stage % 2 ? lessons[i].predict : lessons[i].reflect,
        correct = reviewSession.answer === q.answer;
      if (r.due <= Date.now()) {
        if (correct) {
          r.stage++;
          r.due = reviewDate(r.stage);
        } else {
          r.stage = 0;
          r.due = Date.now() + 600000;
        }
        state.reviews[i] = r;
      }
      activeDay();
      save();
      reviewSession = null;
      render();
      toast(correct ? "Recall saved. Keep connecting the ideas." : "Review saved. Revisit the explanation and try recall again later.");
    };
}
$("#menu-button").onclick = () => {
  const open = $("#sidebar").classList.toggle("mobile-open");
  $("#menu-button").setAttribute("aria-expanded", String(open));
};
$("#search-button").onclick = () => {
  $("#search-dialog").showModal();
  $("#search-input").value = "";
  searchLessons("");
  $("#search-input").focus();
};
function searchLessons(term) {
  $("#search-results").innerHTML =
    lessons
      .filter((l) => (l.title + " " + modules[l.module][2]).toLowerCase().includes(term.toLowerCase()))
      .map((l) => `<a href="#lesson/${l.id}"><span><strong>${l.title}</strong><small>${modules[l.module][2]}</small></span><span>↗</span></a>`)
      .join("") || "<p>No lessons found. Try “search” or “trees”.</p>";
  $("#search-results")
    .querySelectorAll("a")
    .forEach((a) => (a.onclick = () => $("#search-dialog").close()));
}
$("#search-input").oninput = (e) => searchLessons(e.target.value);
document.querySelectorAll("[data-close]").forEach((b) => (b.onclick = () => document.getElementById(b.dataset.close).close()));
$("#profile-button").onclick = openWorkspace;
$("#account-button").onclick = openWorkspace;
$("#mobile-settings").onclick = openWorkspace;
const phoneLayout = matchMedia("(max-width:720px)");
function syncNavigation() {
  $("#sidebar").inert = phoneLayout.matches;
}
phoneLayout.addEventListener("change", syncNavigation);
syncNavigation();
$("#export-button").onclick = () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }),
    url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = `algo-studio-progress-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $("#settings-feedback").textContent = "Backup exported. Keep it somewhere safe.";
};

$("#import-input").onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    if (file.size > 2000000) throw Error("Too large");
    const s = JSON.parse(await file.text());
    if (!validBackup(s)) throw Error("Invalid");
    for (const d of [...Object.values(s.drafts), ...Object.values(s.practice || {})]) {
      delete d.results;
      d.passedCode = null;
    }
    state = upgradeState(s);
    save();
    render();
    $("#settings-feedback").textContent = "Backup restored. Your previous workspace progress has been replaced.";
  } catch {
    $("#settings-feedback").textContent = "This is not a valid Algo Studio backup. Your existing progress is unchanged.";
  }
  e.target.value = "";
};
window.addEventListener("hashchange", () => {
  reviewSession = null;
  render();
  window.scrollTo(0, 0);
  $("#main").focus({ preventScroll: true });
});
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    $("#search-button").click();
  }
  if (e.key === "Escape") {
    $("#sidebar").classList.remove("mobile-open");
    $("#menu-button").setAttribute("aria-expanded", "false");
  }
});
render();
if (!storageAvailable) toast("Browser storage is unavailable. Export progress to keep your work.");

function openWorkspace() {
  updateAccountUI();
  $("#settings-dialog").showModal();
}
function updateAccountUI() {
  const user = accountSync?.user;
  if (user) signInEmailSent = "";
  $("#account-heading").textContent = user ? "Your learning account" : signInEmailSent ? "Check your email" : "Save your progress";
  $("#account-status").textContent = user
    ? accountSync.message
    : signInEmailSent
      ? "Open the sign-in link in this browser."
      : accountSync?.message.includes("could not start")
        ? accountSync.message
        : "Sign in to continue on another device.";
  $("#import-input").disabled = !!user && !accountSync.loaded;
  $("#add-guest-progress").disabled = !!user && !accountSync.loaded;
  $("#account-email").hidden = !user && !signInEmailSent;
  $("#account-email").textContent = user ? user.email : signInEmailSent;
  $("#signin-form").hidden = !!user || !accountSync || !!signInEmailSent;
  $("#signin-sent").hidden = !!user || !signInEmailSent;
  $("#signedin-actions").hidden = !user;
  $("#guest-progress").hidden = !user || !accountSync.hasGuest();
  $("#account-button").textContent = user ? "Account & sync" : "Save across devices";
  $("#account-button").classList.toggle("connected", !!user);
  updateSaveStatus();
}

function replaceWorkspace(next, accountChanged) {
  if (accountChanged) accountEpoch++;
  state = next;
  reviewSession = null;
  render();
}
async function setupAccount() {
  if (!syncConfig.url || !syncConfig.publishableKey) {
    updateAccountUI();
    return;
  }
  try {
    const client = window.supabase.createClient(syncConfig.url, syncConfig.publishableKey, { auth: { flowType: "pkce", detectSessionInUrl: true } });
    accountSync = new AccountSync({
      client,
      storage: localStorage,
      getState: () => state,
      setState: replaceWorkspace,
      canApply: () => !runningJob && !["TEXTAREA", "INPUT"].includes(document.activeElement?.tagName),
      onStatus: updateAccountUI,
    });
    $("#signin-form").onsubmit = async (event) => {
      event.preventDefault();
      const button = event.submitter;
      button.disabled = true;
      let sent = false;
      const email = $("#signin-email").value.trim();
      $("#account-feedback").textContent = "Sending your sign-in link…";
      try {
        const { error } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: new URL("./", import.meta.url).href } });
        if (error) throw error;
        sent = true;
        signInEmailSent = email;
        $("#account-feedback").textContent = "";
        updateAccountUI();
      } catch (error) {
        $("#account-feedback").textContent = error.message;
      } finally {
        if (sent)
          signInCooldown = setTimeout(() => {
            button.disabled = false;
          }, 60000);
        else button.disabled = false;
      }
    };
    $("#change-signin-email").onclick = () => {
      signInEmailSent = "";
      clearTimeout(signInCooldown);
      $("#signin-form button").disabled = false;
      $("#account-feedback").textContent = "";
      updateAccountUI();
      $("#signin-email").focus();
    };
    $("#sync-now").onclick = () => accountSync.sync();
    $("#signout-button").onclick = async () => {
      try {
        if (runningJob) throw Error("Wait for the Python run to finish before signing out.");
        await accountSync.signOut();
        $("#account-feedback").textContent = "Signed out on this device.";
      } catch (error) {
        $("#account-feedback").textContent = error.message;
      }
    };
    $("#add-guest-progress").onclick = () => {
      if (runningJob) {
        $("#account-feedback").textContent = "Wait for the Python run to finish first.";
        return;
      }
      try {
        accountSync.importGuest();
        $("#account-feedback").textContent = "Earlier browser progress added to your account.";
      } catch (error) {
        $("#account-feedback").textContent = error.message;
      }
    };
    await accountSync.start();
    updateAccountUI();
    if (accountSync.user) {
      $("#account-feedback").textContent = "";
    }
    const authError =
      new URLSearchParams(location.hash.slice(1)).get("error_description") || new URLSearchParams(location.search).get("error_description");
    if (authError) {
      $("#account-feedback").textContent = authError;
      openWorkspace();
    }
  } catch (error) {
    const message = `Progress sync could not start: ${error.message}. Your local progress is kept.`;
    if (accountSync) accountSync.status(message);
    else $("#account-status").textContent = message;
  }
}
setupAccount();
