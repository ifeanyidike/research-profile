import { createLearningStore, exportBackup, IDS, parseBackup } from "./model.js?v=20261106-1";

const $ = (selector) => document.querySelector(selector);
const esc = (text) => String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const paras = (items) => items.map((p) => `<p>${esc(p)}</p>`).join("");
const names = { ifeanyi: "Ifeanyi", fav: "Fav" };
let storage;
try {
  storage = window.localStorage;
} catch {
  storage = {
    getItem() {
      throw Error();
    },
    setItem() {
      throw Error();
    },
  };
}
const store = createLearningStore(storage);
let data,
  pendingBackup = null,
  importToken = 0;

function status() {
  $("#learner").value = store.state.active;
  $("#save-status").textContent = store.error || `${names[store.state.active]}’s learning · saved on this browser.`;
  $("#save-status").classList.toggle("error", Boolean(store.error));
}
function lessonLink(id, label) {
  return `<a href="#lesson/${id}">${esc(label || data.lessons.find((l) => l.id === id).title)}</a>`;
}
function home() {
  const record = store.state.learners[store.state.active];
  const next = !record.done.includes(record.last)
    ? data.lessons.find((l) => l.id === record.last)
    : data.lessons.find((l) => !record.done.includes(l.id)) || data.lessons.find((l) => l.id === record.last);
  return `<span class="eyebrow">For parents · preschool communication</span><h1>Help your child communicate.</h1>
  <p class="lead">Learn how to help a child who uses few words. Start with clear examples, then use an ordinary moment of play or daily life.</p>
  <section class="today"><span class="eyebrow">${record.done.length ? "Continue your learning" : "Your first lesson"}</span><h2>${esc(next.title)}</h2><p>${esc(next.goal)}</p><p class="small">Read at your pace. Try a brief activity only while it is comfortable.</p><a class="button" href="#lesson/${next.id}">${record.done.length ? "Open lesson" : "Begin here"} →</a></section>
  <h2>You do not have to make your child perform.</h2><p>Join an interest. Offer useful words. Leave room for a reply. Respond to gestures, sounds and words, and respect a clear “no” or “finished”.</p>
  <p>You will find examples of what to say, what to do next and how to make an activity easier. Use the same lesson again when it helps. There is no deadline for a new word.</p>
  <p class="notice">This is parent education and everyday communication support. It cannot determine the cause of a delay or replace an individual assessment or treatment plan. <a href="#help">Read the guidance</a>.</p>
  <h2>Your learning</h2><p>${record.done.length} of 20 lessons reviewed by ${names[store.state.active]}. Choose the learner at the top to keep your checkmarks separate.</p><progress value="${record.done.length}" max="20" aria-label="Adult lessons reviewed"></progress>
  <p><a href="#learn">Browse the 20 lessons →</a></p><p class="small">Free readings and optional short videos. Activities use familiar safe items; no special equipment or subscription is required. <a href="print.html">Printable starter guide</a>.</p>`;
}
function curriculum() {
  const record = store.state.learners[store.state.active];
  const groups = [...new Set(data.lessons.map((l) => l.group))];
  return `<span class="eyebrow">One idea at a time</span><h1>Your lessons</h1><p class="lead">Begin with S01–S06. Later lessons reuse those skills in everyday activities. Repeat a comfortable activity; you do not need a new task every day.</p>
  ${groups
    .map(
      (group) =>
        `<section><h2>${esc(group)}</h2><ol class="lesson-list">${data.lessons
          .filter((l) => l.group === group)
          .map(
            (l) =>
              `<li><a href="#lesson/${l.id}"><span class="lesson-number">${l.id.slice(1)}</span><span><strong>${esc(l.title)}</strong><small>${esc(l.goal)}</small></span><span class="lesson-status">${record.done.includes(l.id) ? "Reviewed ✓" : "Open →"}</span></a></li>`
          )
          .join("")}</ol></section>`
    )
    .join("")}`;
}
function sourceItem(id) {
  const source = data.sources[id];
  return `<li><a class="source-title" href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)} ↗</a><p>${esc(source.scope)}</p></li>`;
}
function videoCard(id) {
  const video = data.videos[id];
  return `<h3>Optional short video</h3><a class="video-link" href="${esc(video.url)}" target="_blank" rel="noopener noreferrer">${esc(video.title)} ↗</a><p><strong>${esc(video.time)}</strong></p><p>${esc(video.purpose)}</p><p class="small"><a href="${esc(video.transcript)}" target="_blank" rel="noopener noreferrer">Publisher guide or named transcript ↗</a>. ${esc(video.evidence)}</p>`;
}
function lesson(id) {
  const l = data.lessons.find((item) => item.id === id);
  if (!l) return `<h1>Lesson not found</h1><p><a href="#learn">Choose a lesson from the list</a>.</p>`;
  const index = data.lessons.indexOf(l),
    record = store.state.learners[store.state.active];
  return `<a class="back" href="#learn">← All lessons</a><p class="eyebrow">Lesson ${index + 1} of 20 · ${esc(l.group)}</p><h1>${esc(l.title)}</h1><p class="goal">${esc(l.goal)}</p>
  ${l.prerequisites.length ? `<details><summary>Ideas this lesson builds on</summary><ul>${l.prerequisites.map((p) => `<li>${lessonLink(p)}</li>`).join("")}</ul><p class="small">Revisit these if needed. You can explore without passing a test.</p></details>` : ""}
  <section aria-labelledby="understand"><h2 id="understand">Understand the idea</h2>${paras(l.explain)}</section>
  <section class="example" aria-labelledby="example"><h2 id="example">See it in a conversation</h2><p class="small">An invented example. Your child may respond differently.</p><dl class="dialogue">${l.example.map(([speaker, text]) => `<dt>${esc(speaker)}</dt><dd>${esc(text)}</dd>`).join("")}</dl></section>
  <section aria-labelledby="try"><h2 id="try">Try it step by step</h2><p class="materials"><strong>What you need:</strong> ${esc(l.materials)}</p><ol class="activity">${l.steps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol></section>
  <section class="adaptation"><h3>If your child does not speak</h3><p>${esc(l.quiet)}</p><h3>If the activity is difficult</h3><p>${esc(l.difficult)}</p></section>
  <p class="avoid"><strong>Keep the pressure off</strong>${esc(l.avoid)}</p>
  <details><summary>Practise with your partner first</summary><p>${esc(l.rehearsal)}</p><h3>One possible answer</h3><p>${esc(l.rehearsalCheck)}</p></details>
  <details class="question"><summary>Check your understanding</summary><form id="question"><fieldset><legend>${esc(l.check.question)}</legend>${l.check.choices.map((choice, i) => `<label><input type="radio" name="answer" value="${i}" required /><span>${esc(choice)}</span></label>`).join("")}</fieldset><button class="button secondary" type="submit">Check my answer</button><p id="feedback" class="feedback" role="status"></p></form></details>
  <details><summary>Read more${l.video ? " or watch a short video" : ""}</summary><p class="small">The lesson stands on its own. These sources let you check the guidance and see more examples. Links open the original publisher; no institution endorses this studio.</p><ul class="sources">${l.sources.map(sourceItem).join("")}</ul>${l.video ? videoCard(l.video) : "<p class='small'>No video is assigned for this lesson. Use the worked example and the linked reading.</p>"}</details>
  <section class="completion"><label><input id="reviewed" type="checkbox" ${record.done.includes(id) ? "checked" : ""} /><span>I have reviewed this lesson and understand the parent activity.</span></label><p class="small">This checkmark belongs to ${names[store.state.active]}. It does not mean your child must say a word, complete an activity or meet a milestone.</p></section>
  <div class="pagination">${index ? lessonLink(data.lessons[index - 1].id, "← Previous lesson") : "<span></span>"}${index < 19 ? `<a class="button" href="#lesson/${data.lessons[index + 1].id}">Next lesson →</a>` : '<a class="button" href="#home">Back to start →</a>'}</div>`;
}
function help() {
  return `<span class="eyebrow">Keep the purpose clear</span><h1>Guidance &amp; resources</h1>
  <p class="lead">Use this studio to learn parent strategies and make everyday communication easier. The examples are not a diagnosis or an individual treatment prescription.</p>
  <h2>When to ask for individual advice</h2><p>If a preschool child uses few words, rarely combines words, has difficulty understanding or is often hard to understand, seek a review of their communication. A speech-language therapist can assess the pattern and demonstrate support suited to that child. Do not wait to finish the lessons first.</p>
  <p>A response to familiar phrases is useful information, but it does not rule out a partial or changing hearing difficulty. Ask about an age-appropriate hearing assessment if one has not been done. Hearing and language are related questions, not the same test.</p>
  <p>If a child loses words or other skills they previously used, contact a health professional promptly. Do not treat loss of skills as a reason to increase home drills. For an immediate medical emergency, use local emergency care.</p>
  <p class="small">Sources: <a href="${data.sources.early.url}" target="_blank" rel="noopener noreferrer">ASHA early identification</a>, <a href="${data.sources.hearing.url}" target="_blank" rel="noopener noreferrer">NIDCD assessment guidance</a>, <a href="${data.sources.glue.url}" target="_blank" rel="noopener noreferrer">NHS hearing information</a> and <a href="${data.sources.changes.url}" target="_blank" rel="noopener noreferrer">CDC advice about changes or concerns</a>.</p>
  <h2>Questions worth taking to an appointment</h2><ul><li>What does the assessment show about understanding, spoken language and speech sounds?</li><li>Has hearing been assessed, and is any follow-up needed?</li><li>Can you show us one suitable home strategy and how to make it easier?</li><li>What communication methods can help our child ask, refuse and share interests now?</li><li>What changes should prompt another review, and how do we get it?</li></ul>
  <h2>Print a simple guide</h2><p><a href="print.html">Open the printable starter and appointment guide →</a></p><p>It includes a manageable example week. This is an organisation aid, not a prescribed therapy schedule or a promise of words within a set time.</p>
  <h2>Your learning and saved checkmarks</h2><p>Ifeanyi and Fav have separate adult learning records on this browser. There is no sign-in or cross-device sync in this studio yet. Your other studios’ accounts and saved work are separate. The studio does not ask for child names, recordings, observations or health notes.</p>
  <p>Use a learning backup to carry these checkmarks to another browser. Download before clearing browser data. The backup contains only adult checkmarks and the last opened lesson.</p>
  <div class="actions"><button id="export" class="button secondary">Download learning backup</button></div>
  <label for="import"><strong>Restore a learning backup</strong></label><p class="small" id="import-help">Choose a Speech Therapy Studio JSON backup, up to 32 KB. You will see a preview before merging. Existing checkmarks are kept.</p><input id="import" type="file" accept="application/json,.json" aria-describedby="import-help" /><div id="import-preview" aria-live="polite"></div>
  <h2>Sources and optional videos</h2><p>Guidance checked ${esc(data.reviewed)}. All lessons use original explanations and invented conversations. Publisher materials remain theirs. Free linked readings are sufficient; no paid book or course is required.</p><ul class="sources">${Object.keys(data.sources).map(sourceItem).join("")}</ul>
  <details><summary>How the video assignments were checked</summary><p>The three optional videos reuse exact assignments from the Child Development Studio’s scoped transcript audit. The NHS named transcripts and source guidance were checked again for this course. Each video card states the viewing range and limits. For the choice-board clip, stop at 6:29; its later accidental-selection instruction is not assigned. External players can continue beyond that point. A publisher may change a page or recording.</p><p>These checks establish source fit for general parent education. They are not a clinician’s review of an individual child or a trial proving outcomes from this studio.</p></details>`;
}
function render({ focus = false, visit = true } = {}) {
  importToken += 1;
  pendingBackup = null;
  const [route, id] = location.hash.slice(1).split("/");
  const view = !route || route === "main" ? "home" : route;
  if (view === "lesson" && IDS.includes(id) && visit) store.visit(id);
  $("#main").innerHTML =
    view === "home"
      ? home()
      : view === "learn"
        ? curriculum()
        : view === "lesson"
          ? lesson(id)
          : view === "help"
            ? help()
            : `<h1>Page not found</h1><p><a href="#home">Return to start</a>.</p>`;
  document.title = `${view === "lesson" ? data.lessons.find((l) => l.id === id)?.title || "Lesson" : view === "learn" ? "Lessons" : view === "help" ? "Guidance" : "Start here"} · Speech Therapy Studio`;
  document.querySelectorAll("[data-nav]").forEach((a) => {
    if (a.dataset.nav === (view === "lesson" ? "learn" : view)) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  status();
  if (focus) {
    $("#main").focus();
    window.scrollTo(0, 0);
  }
  $("#reviewed")?.addEventListener("change", (event) => {
    store.mark(id, event.target.checked);
    status();
  });
  $("#question")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = new FormData(event.target).get("answer");
    if (selected === null) return;
    const check = data.lessons.find((l) => l.id === id).check;
    $("#feedback").textContent = (Number(selected) === check.answer ? "Yes. " : "Try that again. ") + check.reason;
  });
  $("#export")?.addEventListener("click", () => {
    const url = URL.createObjectURL(new Blob([exportBackup(store.state)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "speech-therapy-parent-learning.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  $("#import")?.addEventListener("change", async (event) => {
    const requestToken = ++importToken;
    pendingBackup = null;
    const file = event.target.files[0];
    if (!file) return;
    try {
      if (file.size > 32000) throw Error("Choose a learning backup smaller than 32 KB.");
      const parsed = parseBackup(await file.text());
      if (requestToken !== importToken || !$("#import-preview")) return;
      pendingBackup = parsed;
      $("#import-preview").innerHTML =
        `<p>Ifeanyi: ${parsed.learners.ifeanyi.done.length} reviewed lesson${parsed.learners.ifeanyi.done.length === 1 ? "" : "s"}. Fav: ${parsed.learners.fav.done.length} reviewed lesson${parsed.learners.fav.done.length === 1 ? "" : "s"}. Merge into those named adult records on this browser? Existing checkmarks stay; your active learner stays ${names[store.state.active]}.</p><button class="button secondary" id="confirm-import">Merge these learning checkmarks</button>`;
      $("#confirm-import").addEventListener("click", () => {
        if (!pendingBackup) return;
        store.merge(pendingBackup);
        pendingBackup = null;
        $("#import-preview").textContent = "Learning checkmarks merged. Your active learner is unchanged.";
        status();
      });
    } catch (error) {
      if (requestToken === importToken && $("#import-preview")) $("#import-preview").textContent = `Backup not imported: ${error.message}`;
    }
  });
}
$(".skip").addEventListener("click", (event) => {
  event.preventDefault();
  $("#main").focus();
  $("#main").scrollIntoView();
});
$("#learner").addEventListener("change", (event) => {
  store.select(event.target.value);
  render({ visit: false });
});
window.addEventListener("hashchange", () => {
  pendingBackup = null;
  if (data) render({ focus: true });
});
async function start() {
  try {
    const response = await fetch("lessons.json?v=20261106-1");
    if (!response.ok) throw Error("Lessons could not be downloaded.");
    const loaded = await response.json();
    if (loaded.version !== 1 || loaded.lessons?.length !== 20 || loaded.lessons.some((l, i) => l.id !== IDS[i]))
      throw Error("The lesson file could not be read.");
    data = loaded;
    render();
  } catch {
    $("#main").innerHTML =
      '<section class="error-panel"><h1>Your lessons could not open.</h1><p>Check your connection and try again. Saved learning checkmarks have not been changed.</p><button class="button" id="retry">Try opening again</button><p><a href="print.html">Open the printable starter guide</a></p></section>';
    $("#retry").addEventListener("click", start);
    status();
  }
}
start();
