import { math } from "./math.js?v=20261031-1";
import { createModel } from "./model.js?v=20261031-1";
import { Account } from "./account.js?v=20261031-1";
import { resourceCards, assignmentSummary } from "./resources.js?v=20261031-1";
import { syncConfig } from "../algo-studio/sync-config.js";
export function startStudio(config) {
  document.documentElement.dataset.studio = config.slug;
  const model = createModel(config.slug);
  const { learningState, parseBackup, DEFAULT_NAMES, PROFILES, PREFIX, workspaceStores } = model;
  const $ = (s) => document.querySelector(s);
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const link = (r) => `<a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.label)} ↗</a>`;
  const lessonLink = (id, label = id, tab = "learn") => `<a href="#lesson/${id}/${tab}">${esc(label)}</a>`;
  const date = (n) => new Date(n).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  let storage;
  try {
    storage = window.localStorage;
  } catch {
    storage = {
      getItem() {
        throw Error("Storage unavailable");
      },
      setItem() {
        throw Error("Storage unavailable");
      },
    };
  }
  let getWorkspace,
    store,
    account,
    user = null,
    active = "ifeanyi",
    names = { ...DEFAULT_NAMES },
    modules = [],
    lessons = {},
    pages,
    track = config.defaultTrack || "all",
    ids,
    stages = [],
    byId = {},
    quizPassed = null,
    storageOk = true,
    importData = null;
  let pathQuery = "",
    pathStage = "",
    pathState = "";
  function saveStatus(ok, message) {
    storageOk = ok;
    $("#save-status").classList.toggle("warning", !ok);
    $("#save-status").textContent =
      message ||
      (ok
        ? user
          ? "Saved on this device."
          : "Guest workspace · sign in to sync across devices."
        : "Browser storage is unavailable or full. Keep this tab open and export your work before refreshing.");
  }
  function records() {
    return Object.fromEntries(modules.map((m) => [m.id, store.record(active, m.id).values]));
  }
  function patch(id, values) {
    store.update(active, id, values);
    account?.queue();
  }
  function currentName() {
    const name = user
      ? user.user_metadata?.studio_display_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Learner"
      : names[active];
    return typeof name === "string" ? name.slice(0, 60) : "Learner";
  }
  function state() {
    return learningState(selectedModules(), records());
  }
  function selectUser(next) {
    user = next;
    store = getWorkspace(user ? `account:${user.id}` : "guest");
    document.documentElement.dataset.theme = store.setting("theme", window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    names = store.setting("names", DEFAULT_NAMES);
    track = store.setting("track", config.defaultTrack || "all");
    if (config.tracks && !config.tracks.some((t) => t.id === track)) track = config.defaultTrack;
    if (!names || PROFILES.some((p) => typeof names[p] !== "string")) names = { ...DEFAULT_NAMES };
    active = user ? "ifeanyi" : store.setting("active", "ifeanyi");
    if (!PROFILES.includes(active)) active = "ifeanyi";
    $("#learner").innerHTML = user
      ? `<option>${esc(currentName())}</option>`
      : PROFILES.map((p) => `<option value="${p}">${esc(names[p])} · guest</option>`).join("");
    $("#learner").disabled = !!user;
    if (!user) $("#learner").value = active;
    importData = null;
    $("#import-preview").hidden = true;
    $("#account-open").textContent = user ? "My account" : "Sign in";
    settingsContent();
    render();
  }
  const stageDescriptions = config.stageDescriptions;
  function status(m, s = state(), r = records()) {
    return r[m.id]?.passedAt
      ? "Self-assessed"
      : !s.ready(m)
        ? "Prerequisites to review"
        : r[m.id]?.practice
          ? "Practised"
          : r[m.id]?.read
            ? "In progress"
            : "Ready to start";
  }
  function row(m, s = state(), r = records()) {
    return `<a class="lesson-row" href="#lesson/${m.id}/learn"><span class="lesson-id">${m.id}</span><span><strong>${esc(m.title)}</strong><small>${esc(m.skills.slice(0, 3).join(" · "))}</small></span><span class="pill ${r[m.id]?.passedAt ? "done" : ""}">${status(m, s, r)}</span><span aria-hidden="true">↗</span></a>`;
  }
  function stageCards() {
    const r = records();
    return stages
      .map((stage, i) => {
        const items = selectedModules().filter((m) => m.stage === stage),
          done = items.filter((m) => r[m.id]?.passedAt).length;
        if (!items.length) return "";
        return `<a class="stage-card" href="#path/${i}"><div class="card-top"><span class="stage-number">${String(selectedStages().indexOf(stage) + 1).padStart(2, "0")}</span><span>${items.length} topics</span></div><h3>${esc(stage)}</h3><p>${stageDescriptions[i]}</p><div class="card-bottom"><span>${done} / ${items.length} assessed</span><span aria-hidden="true">↗</span></div><div class="meter"><span style="width:${(done / items.length) * 100}%"></span></div></a>`;
      })
      .join("");
  }
  function home() {
    const s = state(),
      next = s.next;
    return `${trackPicker()}<section class="hero"><div><span class="eyebrow">${esc(config.name.toUpperCase())} · YOUR LEARNING SPACE</span><h1>${esc(config.heroTitle)}<br /><em>${esc(config.heroEmphasis)}</em></h1><p class="hero-copy">${esc(config.heroCopy)}</p><div class="button-row"><a class="button" href="#lesson/${next?.id || selectedModules().at(-1).id}/learn">${s.passed ? "Continue learning" : "Start your first lesson"} <span aria-hidden="true">↗</span></a><a class="button secondary" href="#path">Explore the curriculum</a></div><p class="hero-intro-link"><a href="#overview">Discover the field, learning paths & qualifications ↗</a></p></div><div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="art-core">${esc(config.mark)}<span>↗</span></div><span class="art-label label-one">UNDERSTAND</span><span class="art-label label-two">BUILD</span><span class="art-label label-three">EXPLAIN</span><span class="art-dot dot-one"></span><span class="art-dot dot-two"></span></div></section>
 <div class="welcome-line"><h2>Make yourself at home, ${esc(currentName())}.</h2><span>${user ? "Your own learning account" : "Try the lessons as a guest, or sign in to keep your own workspace."}</span></div>
 <div class="stat-row"><div><strong>${s.passed}<span> / ${selectedModules().length}</span></strong><span>Topics self-assessed</span></div><div><strong>${s.practised}</strong><span>Topics practised</span></div><a href="#review"><strong>${s.due.length}</strong><span>Reviews ready for you ↗</span></a><div><strong>${new Set(selectedModules().map((m) => m.stage)).size}</strong><span>Connected learning stages</span></div></div>
 ${next ? `<section class="continue-card"><div><span class="eyebrow">YOUR NEXT STEP · ${esc(next.id)}</span><h3>${esc(next.title)}</h3><p>${esc(next.skills.join(" · "))}</p></div><a class="button" href="#lesson/${next.id}/learn">Open lesson ↗</a></section>` : `<section class="continue-card"><div><h3>Your selected learning path is complete.</h3><p>Return to review, discuss your portfolio, and follow the further-study guidance for your goals.</p></div><a class="button" href="#review">Review learning ↗</a></section>`}
 <div class="section-heading"><div><span class="eyebrow">THE PATH AHEAD</span><h2>Build understanding, layer by layer.</h2></div><a href="#method">How this works ↗</a></div><div class="stage-grid">${stageCards()}</div><p class="fine-print">${esc(config.scopeNote)} Readiness follows the source map's prerequisites. You can explore any topic; assess its prerequisites before claiming competence. This is an independent learning curriculum, not an accredited degree.</p>`;
  }
  function path() {
    const s = state(),
      r = records();
    const filtered = selectedModules().filter(
      (m) =>
        (!pathStage || m.stage === pathStage) &&
        (!pathQuery || `${m.id} ${m.title} ${m.skills.join(" ")}`.toLowerCase().includes(pathQuery.toLowerCase())) &&
        (!pathState ||
          (pathState === "passed" ? r[m.id]?.passedAt : pathState === "ready" ? !r[m.id]?.passedAt && s.ready(m) : !r[m.id]?.passedAt && !s.ready(m)))
    );
    return `${trackPicker()}<div class="page-heading"><span class="eyebrow">${selectedModules().length} TOPICS · YOUR SELECTED PATH</span><h1>Your curriculum</h1><p>Start at the beginning or revisit a foundation. Each topic connects explanations, exact source material, practice, and evidence of understanding.</p><p><a href="#sources">Open the full topic-by-topic source map ↗</a></p></div><div class="filters"><label><span class="sr-only">Search curriculum</span><input id="path-search" type="search" placeholder="Search topics or skills…" value="${esc(pathQuery)}" /></label><label><span class="sr-only">Learning stage</span><select id="path-stage"><option value="">All stages</option>${stages
      .filter((st) => selectedModules().some((m) => m.stage === st))
      .map((st) => `<option ${st === pathStage ? "selected" : ""}>${esc(st)}</option>`)
      .join(
        ""
      )}</select></label><label><span class="sr-only">Learning status</span><select id="path-state"><option value="">Every topic</option><option value="ready" ${pathState === "ready" ? "selected" : ""}>Ready to start</option><option value="passed" ${pathState === "passed" ? "selected" : ""}>Self-assessed</option><option value="prerequisites" ${pathState === "prerequisites" ? "selected" : ""}>Prerequisites to review</option></select></label></div><p class="fine-print" role="status">${filtered.length} topics shown</p><div id="path-list">${
      stages
        .map((stage, i) => {
          const items = filtered.filter((m) => m.stage === stage);
          return items.length
            ? `<section class="stage-section"><div class="stage-heading"><span class="stage-number">${String(selectedStages().indexOf(stage) + 1).padStart(2, "0")}</span><div><h2>${esc(stage)}</h2><p>${stageDescriptions[i]}</p></div></div>${items.map((m) => row(m, s, r)).join("")}</section>`
            : "";
        })
        .join("") || '<div class="empty">No topics match. Try a broader search or another filter.</div>'
    }</div>`;
  }
  function outcomes(m) {
    return `<ul class="topic-outcomes">${m.outcomes.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
  }
  function quiz(check) {
    return `<form id="quiz" class="quiz"><fieldset><legend>${esc(check.question)}</legend>${check.choices.map((c, i) => `<label><input type="radio" name="answer" value="${i}" required /> ${esc(c)}</label>`).join("")}</fieldset><button class="button secondary" type="submit">Check my reasoning</button><p id="quiz-feedback" class="feedback" role="status"></p></form>`;
  }
  function resources(m) {
    const r = store.record(active, m.id).values;
    let checked = [];
    try {
      checked = JSON.parse(r.resources || "[]");
    } catch {}
    const cards = (items, type) => resourceCards(items, type, checked);
    return `<h2>Go deeper with the sources</h2><p>Follow the viewing and reading guides. Required excerpts are listed with start and stop times; optional further study is labelled separately. Pause to reproduce examples. Completion checks record your own study, not verified viewing.</p><div class="callout"><strong>Your study assignment</strong>${paragraphs(m.study_focus)}</div><h3>Videos</h3><p class="scope-note">${esc(m.videoNote)}</p>${m.videos.length ? cards(m.videos, "video") : ""}<h3>Readings</h3>${cards(m.readings, "reading")}<div class="callout"><strong>Source and setup notes</strong><p>${esc(m.note)}</p><p>Source map researched on 30 October 2026. Providers control availability, sign-in, fees, captions, and embedding. If a video cannot play here, open its original source.</p></div>`;
  }
  function paragraphs(text) {
    return text
      .split("\n\n")
      .map((p) => `<p>${esc(p)}</p>`)
      .join("");
  }
  function workshop(l) {
    const g = l.guide;
    return `<div class="callout"><strong>Before this lesson</strong>${paragraphs(g.bridge)}</div><h2>Step by step</h2>${paragraphs(g.teaching)}<div class="worked-example"><span class="eyebrow">FOLLOW THE WHOLE EXAMPLE</span><h3>Worked example and supplied data</h3>${g.example_format === "math" ? `<div class="math-example" aria-label="Worked mathematical example">${paragraphs(g.example)}</div>` : `<pre class="lesson-code" tabindex="0" aria-label="Worked example"><code>${esc(g.example)}</code></pre>`}${paragraphs(g.explanation)}</div>`;
  }
  function practiceWorkshop(l) {
    return `<h3>Your complete workshop</h3>${paragraphs(l.guide.exercise)}<details class="solution"><summary>Reveal the worked solution after your attempt</summary>${paragraphs(l.guide.solution)}</details>`;
  }
  function lesson(id, tab) {
    const m = byId[id],
      l = lessons[id];
    if (!ids.has(id) || !l) return '<div class="empty"><h1>Lesson not found</h1><a href="#path">Return to the curriculum</a></div>';
    const tabs = { learn: "Learn", resources: "Watch & read", practice: "Practise", assess: "Assess", notes: "My notes" };
    if (!tabs[tab]) tab = "learn";
    const r = store.record(active, id).values,
      missing = m.prerequisites.filter((p) => !store.record(active, p).values.passedAt);
    const selected = selectedModules();
    const sequence = selected.includes(m) ? selected : modules.filter((item) => item.tracks?.includes(m.tracks?.[0]));
    const otherTrack = config.tracks?.find((t) => !selected.includes(m) && m.tracks.includes(t.id));
    const index = sequence.indexOf(m);
    let body = "";
    if (tab === "learn")
      body = `<span class="eyebrow">A GUIDED EXPLANATION</span><div class="callout"><strong>What you should be able to demonstrate</strong>${outcomes(m)}</div><h2>The idea, in plain language</h2><p>${esc(l.concept)}</p><h2>How it works</h2><p>${esc(l.mechanism)}</p>${workshop(l)}<p class="fine-print"><strong>Assigned references:</strong> ${m.readings.map(link).join(" · ")}. Read source scope and access notes in Watch & read.</p><div class="scope-note">${esc(config.scopeNote)}</div><div class="misconception"><strong>Keep this distinction clear</strong><p>${esc(l.pitfall)}</p></div><h2>Check your understanding</h2><p>Answer from memory before checking the explanation. This question is a starting check; the independent task in Assess tests the topic more fully.</p>${quiz(l.check)}<div class="lesson-bottom"><label><input type="checkbox" id="mark-read" ${r.read ? "checked" : ""} /> I can explain this introduction in my own words</label><a class="button" href="#lesson/${id}/resources">Watch & read ↗</a></div>`;
    if (tab === "resources")
      body = resources(m) + `<div class="lesson-bottom"><a class="button" href="#lesson/${id}/practice">Put it into practice ↗</a></div>`;
    if (tab === "practice")
      body = `<span class="eyebrow">MOVE FROM RECOGNITION TO SKILL</span><h2>Your practical exercise</h2><p>Work through the supplied example in Learn, then use the complete workshop below. Linked provider labs offer additional practice.</p>${practiceWorkshop(l)}${m.practice_links.length ? `<h3>Open the exercise material</h3><ol>${m.practice_links.map((r) => `<li>${link(r)}<p class="fine-print">${esc(assignmentSummary(r))}</p></li>`).join("")}</ol>` : ""}<div class="callout"><strong>Before you begin</strong><p>${esc(config.practiceNote)}</p></div><label class="evidence"><strong>Your practice evidence</strong><span>Describe your method and results. Use fictional or synthetic material. Do not save personal recordings, child information, clinical records, passwords or confidential data.</span><textarea data-field="evidence" maxlength="20000" placeholder="Setup → prediction → observation → explanation…">${esc(r.evidence || "")}</textarea></label><p class="save-hint" role="status"></p><label><input type="checkbox" id="mark-practice" ${r.practice ? "checked" : ""}/> I completed the exercise and can explain the result</label><div class="lesson-bottom"><a class="button" href="#lesson/${id}/assess">Try the independent assessment ↗</a></div>`;
    if (tab === "assess")
      body = `<span class="eyebrow">SHOW WHAT YOU CAN DO WITHOUT A WALKTHROUGH</span><h2>Independent assessment</h2><div class="callout"><strong>Independent task</strong>${paragraphs(l.guide.challenge)}</div><details class="solution"><summary>Review the expected reasoning after your attempt</summary>${paragraphs(l.guide.challenge_solution)}</details>${m.assessment_link ? `<p>${link(m.assessment_link)}</p>` : ""}<div class="callout"><strong>Topic-specific pass criteria</strong>${outcomes(m)}</div><h3>A quick retrieval check</h3>${quiz(l.check)}<label class="evidence"><strong>Your assessment evidence and explanation</strong><span>Record the independent result, how you checked it, and what remains uncertain. Aim for evidence another learner could review.</span><textarea data-field="assessment" maxlength="20000" placeholder="What did you build, solve, or demonstrate independently? How did you verify it?">${esc(r.assessment || "")}</textarea></label><p class="save-hint" role="status"></p><label class="criteria"><input type="checkbox" id="criteria"/> I reviewed every pass criterion and can defend my evidence</label><p class="fine-print">To record a pass: complete practice, assess the prerequisites, answer the retrieval check correctly in this session, review the criteria, and add at least 40 characters of assessment evidence. The hub records your judgement; it does not execute or grade external labs.</p><button class="button" id="pass">${r.passedAt ? "Reassess this topic" : "Record a self-assessed pass"}</button><p id="pass-feedback" class="feedback" role="status">${r.passedAt ? `Self-assessed on ${date(r.passedAt)}. You can reassess when needed.` : ""}</p>`;
    if (tab === "notes")
      body = `<h2>Make the lesson yours</h2><p>Explain the concept as if teaching another learner. Keep questions, diagrams in words, connections to earlier topics, and mistakes you corrected.</p><label class="evidence"><strong>Your lesson notebook</strong><textarea data-field="notes" maxlength="20000" placeholder="In my own words…\nA question I still have…\nA connection to another topic…">${esc(r.notes || "")}</textarea></label><p class="save-hint" role="status"></p>`;
    return `${otherTrack ? `<div class="scope-note"><strong>This topic belongs to ${esc(otherTrack.label)}.</strong><p>You are exploring outside your selected path. The links below follow this topic's own path.</p><button class="button secondary" data-switch-track="${esc(otherTrack.id)}">Switch to this learning path</button></div>` : ""}<div class="lesson-top"><a href="#path/${stages.indexOf(m.stage)}">← ${esc(m.stage)}</a><span class="pill">Topic ${index + 1} of ${sequence.length} · ${id}</span></div><div class="page-heading"><span class="pathway-label">${esc(m.audienceLabel || "All learners")} · ${esc(m.age || "Self-paced")}</span><h1>${esc(m.title)}</h1><div class="lesson-meta">${m.skills.map((s) => `<span>${esc(s)}</span>`).join("")}</div></div><div class="prerequisites"><strong>Builds on</strong> ${m.prerequisites.length ? m.prerequisites.map((p) => lessonLink(p, `${p} · ${byId[p].title}`)).join(' <span aria-hidden="true">/</span> ') : "No earlier topic required."}${missing.length ? `<p>Review first: ${missing.map((p) => lessonLink(p)).join(", ")}. Exploration is open; assess these before recording this topic as passed.</p>` : ""}</div><nav class="tabs" aria-label="Lesson sections">${Object.entries(
      tabs
    )
      .map(
        ([key, label]) =>
          `<a class="${tab === key ? "active" : ""}" ${tab === key ? 'aria-current="page"' : ""} href="#lesson/${id}/${key}">${label}</a>`
      )
      .join(
        ""
      )}</nav><p id="remote-progress-note" class="fine-print" role="status" hidden></p><div class="lesson-layout"><article class="lesson-body">${body}</article><aside class="lesson-aside"><span class="eyebrow">YOUR PROGRESS</span><h3>Understand. Apply. Explain.</h3><ul><li>${r.read ? "✓" : "○"} Introduction understood</li><li>${r.practice ? "✓" : "○"} Practice completed</li><li>${r.passedAt ? "✓" : "○"} Self-assessed pass</li></ul><p>${r.reviewAt ? `Next review: ${date(r.reviewAt)}` : r.passedAt ? "Review sequence complete. Revisit whenever useful." : "A pass schedules recall reviews after 2, then 7, then 30 days."}</p><a href="#lesson/${id}/notes">Open your notes ↗</a><hr/><p><strong>Learning loop</strong><br/>Read → watch → practise → explain → assess → revisit.</p></aside></div><div class="lesson-pagination">${index ? lessonLink(sequence[index - 1].id, "← Previous topic") : ""}${index < sequence.length - 1 ? lessonLink(sequence[index + 1].id, "Next topic →") : ""}</div>`;
  }
  function review() {
    const s = state(),
      r = records();
    return `<div class="page-heading"><span class="eyebrow">MAKE LEARNING LAST</span><h1>Recall & review</h1><p>After a self-assessed pass, revisit the topic after 2 days, then 7 days after that review, then 30 days after the next. First recall the idea; then check the source and retry a changed example.</p></div>${s.due.length ? s.due.map((m) => `<section class="review-card"><span class="eyebrow">DUE ${date(r[m.id].reviewAt)} · REVIEW ${(r[m.id].reviewStage || 0) + 1}/3</span><h2>${lessonLink(m.id, m.title)}</h2><p>${esc(lessons[m.id].check.question)}</p><details><summary>Check the explanation after answering aloud</summary><p>${esc(lessons[m.id].check.explanation)}</p><p>${esc(lessons[m.id].pitfall)}</p></details><p>Reproduce a small example, then explain the result without the walkthrough.</p><button class="button secondary" data-review="${m.id}">I recalled, checked, and practised this</button></section>`).join("") : '<section class="empty"><h2>No reviews due today.</h2><p>Keep learning. Reviews appear here after your first self-assessed pass.</p><a class="button" href="#path">Explore your next topic ↗</a></section>'}<h2>Coming up</h2>${
      selectedModules()
        .filter((m) => r[m.id].reviewAt > Date.now())
        .sort((a, b) => r[a.id].reviewAt - r[b.id].reviewAt)
        .slice(0, 8)
        .map((m) => `<p>${lessonLink(m.id, m.title)} <span class="muted">· ${date(r[m.id].reviewAt)}</span></p>`)
        .join("") || '<p class="muted">Your future reviews will appear here.</p>'
    }`;
  }
  function notebook() {
    const r = records(),
      items = modules.filter((m) => r[m.id].notes || r[m.id].evidence || r[m.id].assessment);
    return `<div class="page-heading"><span class="eyebrow">YOUR THINKING, ALL TOGETHER</span><h1>${esc(currentName())}'s notebook</h1><p>Lesson notes, practice records, and assessment evidence belong to the active workspace. Use Account & backups to export a copy.</p></div>${
      items
        .map(
          (m) =>
            `<section class="notebook-entry"><span class="eyebrow">${m.id} · ${esc(m.stage)}</span><h2>${lessonLink(m.id, m.title, "notes")}</h2>${[
              ["notes", "Notes"],
              ["evidence", "Practice evidence"],
              ["assessment", "Assessment evidence"],
            ]
              .filter(([f]) => r[m.id][f])
              .map(([f, t]) => `<details><summary>${t}</summary><p class="preserve">${esc(r[m.id][f])}</p></details>`)
              .join("")}</section>`
        )
        .join("") ||
      `<div class="empty"><h2>A place to think on paper.</h2><p>Open any lesson and add your first note, question, or practice result.</p><a href="#lesson/${modules[0].id}/notes">Write your first note ↗</a></div>`
    }`;
  }
  function prosePage(page) {
    return `<article class="method"><span class="eyebrow">${esc(page.eyebrow)}</span><h1>${esc(page.title)}</h1><p class="lead">${esc(page.lead)}</p>${page.sections.map((s) => `<section><h2>${esc(s.title)}</h2>${paragraphs(s.text)}${s.links?.length ? `<ul>${s.links.map((r) => `<li>${link(r)}<p class="fine-print">${esc(assignmentSummary(r))}</p></li>`).join("")}</ul>` : ""}</section>`).join("")}</article>`;
  }
  function method() {
    return prosePage(pages.method);
  }
  function introduction() {
    return prosePage(pages.overview);
  }
  function certifications() {
    return prosePage(pages.qualifications);
  }
  function selectedStages() {
    return stages.filter((stage) => selectedModules().some((m) => m.stage === stage));
  }
  function selectedModules() {
    return modules.filter((m) => !config.tracks || m.tracks.includes(track));
  }
  function trackPicker() {
    return config.tracks
      ? `<div class="track-picker"><label for="learning-track"><strong>Your learning path</strong></label><select id="learning-track">${config.tracks.map((t) => `<option value="${esc(t.id)}" ${t.id === track ? "selected" : ""}>${esc(t.label)}</option>`).join("")}</select><span>Progress is kept when you switch paths.</span></div>`
      : "";
  }
  function sourceMap() {
    return `${trackPicker()}<article class="method source-map"><span class="eyebrow">RESEARCHED 30 OCTOBER 2026</span><h1>Your topic-by-topic source map</h1><p>${esc(config.sourcesNote)}</p><p><a href="curriculum.json" download>Download JSON ↓</a> · <a href="source-map.txt" download>Download readable source map ↓</a></p>${selectedModules()
      .map(
        (m) =>
          `<details><summary>${esc(m.id)} · ${esc(m.title)}</summary><p>${esc(m.audienceLabel || "All learners")} · ${esc(m.age || "All stages")}</p><p><strong>Prerequisites:</strong> ${m.prerequisites.length ? m.prerequisites.map((id) => lessonLink(id, byId[id].title)).join(" · ") : "None — start here"}</p><h3>Study assignment</h3>${paragraphs(m.study_focus)}<h3>Watch in order</h3><p>${esc(m.videoNote)}</p>${m.videos.length ? `<ol>${m.videos.map((r) => `<li>${link(r)}<p class="fine-print">${esc(assignmentSummary(r))}</p>${r.contentReview?.sources?.length ? `<p class="fine-print">${r.contentReview.sources.map(link).join(" · ")}</p>` : ""}</li>`).join("")}</ol>` : ""}<h3>Read in order</h3><ol>${m.readings.map((r) => `<li>${link(r)}<p class="fine-print">${esc(assignmentSummary(r))}</p></li>`).join("")}</ol><h3>Practical exercise</h3>${paragraphs(m.practice)}${m.practice_links.length ? "<h3>Additional practical materials</h3><ul>" + m.practice_links.map((r) => "<li>" + link(r) + `<p class="fine-print">${esc(assignmentSummary(r))}</p></li>`).join("") + "</ul>" : ""}<h3>Independent assessment</h3>${paragraphs(m.assessment)}<h3>Pass criteria</h3>${outcomes(m)}<p class="fine-print">${esc(m.note)}</p><p>${lessonLink(m.id, "Open full lesson ↗")}</p></details>`
      )
      .join("")}</article>`;
  }
  function render(focus = false) {
    if (!store || !modules.length) return;
    quizPassed = null;
    const route = location.hash.slice(1).split("/"),
      view = route[0] || "home";
    if (view === "path" && route[1] !== undefined) {
      const requested = stages[Number(route[1])];
      pathStage = selectedStages().includes(requested) ? requested : "";
    }
    if (pathStage && !selectedStages().includes(pathStage)) pathStage = "";
    const titles = {
      home: "My learning",
      path: "Curriculum",
      review: "Recall & review",
      notebook: "My notebook",
      method: "How to learn",
      certifications: "Qualifications & next steps",
      sources: "Source map",
      overview: "About this field",
      lesson: byId[route[1]]?.id || "Lesson",
    };
    $("#page-name").textContent = titles[view] || "My learning";
    document.title = `${titles[view] || "My learning"} — ${config.name}`;
    math.clear($("#main"));
    $("#main").innerHTML =
      view === "sources"
        ? sourceMap()
        : view === "path"
          ? path()
          : view === "lesson"
            ? lesson(route[1], route[2])
            : view === "review"
              ? review()
              : view === "notebook"
                ? notebook()
                : view === "method"
                  ? method()
                  : view === "certifications"
                    ? certifications()
                    : view === "overview"
                      ? introduction()
                      : home();
    document.querySelectorAll("[data-nav]").forEach((a) => {
      a.classList.toggle("active", a.dataset.nav === view);
      if (a.dataset.nav === view) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    $("#sidebar").classList.remove("open");
    $("#menu").setAttribute("aria-expanded", "false");
    syncSidebar();
    bindView(route);
    const mathRoots = [...$("#main").querySelectorAll(".lesson-body, .source-map, .review-card")];
    math.typeset(mathRoots).catch((error) => {
      for (const root of mathRoots.filter((node) => node.isConnected)) {
        const notice = document.createElement("p");
        notice.className = "fine-print";
        notice.setAttribute("role", "status");
        notice.textContent = "Equation formatting is unavailable. The TeX is still readable; reload to try again.";
        root.prepend(notice);
      }
      console.warn("Equation formatting unavailable:", error.message);
    });
    if (focus) {
      $("#main").focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  }
  function bindView(route) {
    $("#learning-track")?.addEventListener("change", (e) => {
      track = e.target.value;
      store.setSetting("track", track);
      pathStage = "";
      if (route[0] === "path") history.replaceState(null, "", "#path");
      render();
    });
    document.querySelectorAll("[data-switch-track]").forEach((el) =>
      el.addEventListener("click", () => {
        track = el.dataset.switchTrack;
        store.setSetting("track", track);
        pathStage = "";
        render(true);
      })
    );
    const id = route[1];
    $("#path-search")?.addEventListener("input", (e) => {
      const pos = e.target.selectionStart;
      pathQuery = e.target.value;
      render();
      $("#path-search").focus();
      $("#path-search").setSelectionRange(pos, pos);
    });
    $("#path-stage")?.addEventListener("change", (e) => {
      pathStage = e.target.value;
      history.replaceState(null, "", "#path");
      render();
    });
    $("#path-state")?.addEventListener("change", (e) => {
      pathState = e.target.value;
      render();
    });
    document.querySelectorAll("[data-field]").forEach((el) =>
      el.addEventListener("input", () => {
        patch(id, { [el.dataset.field]: el.value });
        const hint = $(".save-hint");
        if (hint) hint.textContent = storageOk ? "Saved on this device." : "Not saved to this browser. Export a backup before leaving.";
      })
    );
    $("#mark-read")?.addEventListener("change", (e) => {
      patch(id, { read: e.target.checked });
    });
    $("#mark-practice")?.addEventListener("change", (e) => patch(id, { practice: e.target.checked }));
    $("#quiz")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const check = lessons[id].check,
        correct = Number(new FormData(e.target).get("answer")) === check.answer;
      quizPassed = correct ? id : null;
      $("#quiz-feedback").textContent = `${correct ? "Correct." : "Try again after reviewing the idea."} ${check.explanation}`;
    });
    $("#quiz")?.addEventListener("change", () => {
      quizPassed = null;
      $("#quiz-feedback").textContent = "";
    });
    $("#pass")?.addEventListener("click", () => {
      const r = store.record(active, id).values,
        m = byId[id];
      const errors = [];
      if (!r.practice) errors.push("Complete the practical exercise.");
      if (m.prerequisites.some((p) => !store.record(active, p).values.passedAt)) errors.push("Assess the prerequisite topics first.");
      if (quizPassed !== id) errors.push("Answer the retrieval check correctly.");
      if (!$("#criteria").checked) errors.push("Review and confirm the pass criteria.");
      if ((r.assessment || "").trim().length < 40) errors.push("Add your assessment evidence (at least 40 characters).");
      if (errors.length) {
        $("#pass-feedback").textContent = errors.join(" ");
        return;
      }
      store.pass(active, id);
      account?.queue();
      render();
      $("#pass-feedback").textContent = "Self-assessed pass recorded. Your first recall review is scheduled in 2 days.";
    });
    document.querySelectorAll("[data-resource]").forEach((el) =>
      el.addEventListener("change", () => {
        let list = [];
        try {
          list = JSON.parse(store.record(active, id).values.resources || "[]");
        } catch {}
        const set = new Set(list);
        el.checked ? set.add(el.dataset.resource) : set.delete(el.dataset.resource);
        patch(id, { resources: JSON.stringify([...set]) });
      })
    );
    document.querySelectorAll("[data-video]").forEach((el) =>
      el.addEventListener("click", () => {
        const iframe = document.createElement("iframe");
        iframe.className = "video-frame";
        iframe.src = el.dataset.video;
        iframe.title = el.dataset.title;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        el.replaceWith(iframe);
        iframe.focus();
      })
    );
    document.querySelectorAll("[data-review]").forEach((el) =>
      el.addEventListener("click", () => {
        store.review(active, el.dataset.review);
        account?.queue();
        render();
      })
    );
  }
  function settingsContent() {
    $("#settings-heading").textContent = "Account & backups";
    $("#account-area").innerHTML = user
      ? `<p>Signed in as <strong>${esc(user.email || "your account")}</strong>. Your notes and progress belong to this account.</p><div class="button-row"><button class="button secondary" id="sync-now">Sync now</button><button class="text-button" id="sign-out">Sign out</button><button class="text-button" id="force-sign-out" hidden>Sign out on this device</button></div>`
      : `<p>Sign in to your own workspace. Each account keeps separate progress and notes, available across devices. You can use your existing Algo Studio account.</p><button class="button secondary" id="google">Continue with Google</button><details class="email-signin"><summary>Use email instead</summary><form id="auth-form"><label>Email<input id="auth-email" type="email" autocomplete="email" required /></label><label>Password<input id="auth-password" type="password" autocomplete="current-password" minlength="6" required /></label><div class="button-row"><button class="button" type="submit">Sign in</button><button class="button secondary" type="submit" name="signup" value="yes">Create account</button></div></form><button class="text-button" id="reset-password">Email a password reset link</button></details><p class="fine-print">Guest work stays separate when you sign in. To bring it into your account, export the guest backup first, then import it while signed in.</p>`;
    $("#name-fields").innerHTML = user
      ? `<label>Display name<input name="display" maxlength="60" value="${esc(currentName())}" required /></label>`
      : PROFILES.map(
          (p) =>
            `<label>${p === "ifeanyi" ? "First" : "Second"} guest profile<input name="${p}" value="${esc(names[p])}" maxlength="60" required /></label>`
        ).join("");
    $("#google")?.addEventListener("click", async () => {
      try {
        const { error } = await account.client.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: location.origin + location.pathname, queryParams: { prompt: "select_account" } },
        });
        if (error) throw error;
      } catch (e) {
        $("#settings-status").textContent = e.message;
      }
    });
    $("#auth-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const button = e.submitter;
      button.disabled = true;
      try {
        const email = $("#auth-email").value.trim(),
          password = $("#auth-password").value;
        const result =
          button.name === "signup"
            ? await account.client.auth.signUp({ email, password, options: { emailRedirectTo: location.origin + location.pathname } })
            : await account.client.auth.signInWithPassword({ email, password });
        if (result.error) throw result.error;
        $("#auth-password").value = "";
        $("#settings-status").textContent = result.data.session
          ? "Signed in. Opening your workspace…"
          : "Check your email to confirm the account, then sign in here.";
      } catch (error) {
        $("#settings-status").textContent = error.message;
      } finally {
        button.disabled = false;
      }
    });
    $("#reset-password")?.addEventListener("click", async () => {
      const email = $("#auth-email").value.trim();
      if (!$("#auth-email").checkValidity() || !email) {
        $("#settings-status").textContent = "Enter your email address first.";
        return;
      }
      const { error } = await account.client.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
      $("#settings-status").textContent = error ? error.message : "If the account can receive a reset, check its email for the recovery link.";
    });
    $("#sign-out")?.addEventListener("click", async () => {
      try {
        await account.signOut();
        $("#settings-status").textContent = "Signed out. The guest workspace is open.";
      } catch (e) {
        $("#settings-status").textContent = e.message;
        $("#force-sign-out").hidden = false;
      }
    });
    $("#force-sign-out")?.addEventListener("click", async () => {
      try {
        await account.signOut({ force: true });
        $("#settings-status").textContent =
          "Signed out on this device. Cached progress is kept for your next sign-in; keep an exported backup before clearing browser data.";
      } catch (e) {
        $("#settings-status").textContent = e.message;
      }
    });
    $("#sync-now")?.addEventListener("click", () => account.sync());
  }
  function refreshIfIdle() {
    syncSidebar();
    // Keep media nodes, retrieval answers and draft evidence intact during sync.
    if (location.hash.startsWith("#lesson/")) {
      const hint = $("#remote-progress-note");
      if (hint) {
        hint.hidden = false;
        hint.textContent =
          "Remote progress updated. Reopen this section when ready to view the merged progress and notes; your current activity is kept intact.";
      }
      return;
    }
    if (!["TEXTAREA", "INPUT", "SELECT"].includes(document.activeElement?.tagName) && !$("dialog[open]")) render();
  }
  async function init() {
    try {
      const responses = await Promise.all([
        fetch(`curriculum.json?v=${config.version}`),
        fetch(`lessons.json?v=${config.version}`),
        fetch(`pages.json?v=${config.version}`),
      ]);
      if (responses.some((r) => !r.ok)) throw Error("The curriculum files could not be loaded.");
      const [curriculum, content, certificateData] = await Promise.all(responses.map((r) => r.json()));
      modules = curriculum.modules;
      lessons = content;
      pages = certificateData;
      ids = new Set(modules.map((m) => m.id));
      byId = Object.fromEntries(modules.map((m) => [m.id, m]));
      stages = [...new Set(modules.map((m) => m.stage))];
      getWorkspace = workspaceStores(storage, ids, Date.now, saveStatus);
      selectUser(null);
      const theme = store.setting("theme", window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.dataset.theme = theme;
      if (!window.supabase) throw Error("The sign-in library could not load. Refresh to retry.");
      const client = window.supabase.createClient(syncConfig.url, syncConfig.publishableKey, {
        auth: { storageKey: `${config.slug}-auth`, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      });
      account = new Account({
        client,
        table: config.table,
        kind: `${config.slug}-progress`,
        model,
        ids,
        switchUser: selectUser,
        store: () => store,
        status: (s) => {
          if (storageOk) $("#save-status").textContent = s;
          $("#account-status").textContent = s;
        },
        changed: refreshIfIdle,
      });
      client.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY")
          setTimeout(() => {
            openSettings();
            $("#account-area").innerHTML =
              '<h3>Choose a new password</h3><form id="recovery-form"><label>New password<input type="password" id="new-password" minlength="6" autocomplete="new-password" required /></label><button class="button" type="submit">Save new password</button></form>';
            $("#recovery-form").addEventListener("submit", async (e) => {
              e.preventDefault();
              const { error } = await client.auth.updateUser({ password: $("#new-password").value });
              $("#settings-status").textContent = error ? error.message : "Password updated. You can continue learning.";
              if (!error) settingsContent();
            });
          }, 100);
      });
      await account.start();
    } catch (error) {
      if (!modules.length)
        $("#main").innerHTML =
          `<div class="empty"><h1>Your learning space could not open.</h1><p>${esc(error.message)}</p><button class="button" id="retry">Try again</button></div>`;
      else saveStatus(false, `Account connection unavailable: ${error.message}. You can continue locally and export a backup.`);
      $("#retry")?.addEventListener("click", () => location.reload());
    }
  }
  function openSettings() {
    if (!store) return;
    settingsContent();
    $("#settings-status").textContent = "";
    $("#settings-dialog").showModal();
  }
  $(".skip").addEventListener("click", (e) => {
    e.preventDefault();
    $("#main").focus();
  });
  $("#settings-open").textContent = "Account & backups";
  $("#settings-open").addEventListener("click", openSettings);
  $("#account-open").addEventListener("click", openSettings);
  $("#learner").addEventListener("change", (e) => {
    if (user) return;
    active = e.target.value;
    store.setSetting("active", active);
    importData = null;
    $("#import-preview").hidden = true;
    render(true);
  });
  $("#names-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    if (user) {
      const name = String(data.get("display")).trim();
      if (!name) return;
      const { data: result, error } = await account.client.auth.updateUser({ data: { studio_display_name: name } });
      if (error) {
        $("#settings-status").textContent = error.message;
        return;
      }
      user = result.user;
      account.user = user;
    } else {
      names = Object.fromEntries(PROFILES.map((p) => [p, String(data.get(p)).trim() || DEFAULT_NAMES[p]]));
      store.setSetting("names", names);
    }
    $("#settings-status").textContent = "Name saved.";
    $("#learner").innerHTML = user
      ? `<option>${esc(currentName())}</option>`
      : PROFILES.map((p) => `<option value="${p}">${esc(names[p])} · guest</option>`).join("");
    if (!user) $("#learner").value = active;
    render();
  });
  $("#export").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(store.exportBackup(active, currentName()), null, 2)], { type: "application/json" }),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = `${config.slug}-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $("#settings-status").textContent = "Backup exported for this workspace. Keep it somewhere you can recover.";
  });
  $("#import-open")?.addEventListener("click", () => $("#import-file").click());
  $("#import-file").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    importData = null;
    $("#import-preview").hidden = true;
    if (!file) return;
    try {
      if (file.size > 32000000) throw Error("Choose a backup smaller than 32 MB.");
      importData = parseBackup(await file.text(), ids);
      const target = { user: user?.id || null, active };
      $("#import-preview").innerHTML =
        `<p>Merge ${Object.keys(importData.lessons).length} topic records from <strong>${esc(importData.profile.name)}</strong> into <strong>${esc(currentName())}</strong>? Newer field edits are kept. Other workspaces are unchanged.</p><button class="button" id="confirm-import">Merge into this workspace</button>`;
      $("#import-preview").hidden = false;
      $("#confirm-import").addEventListener("click", () => {
        if (target.user !== (user?.id || null) || target.active !== active) {
          $("#settings-status").textContent = "The workspace changed. Choose the backup again.";
          return;
        }
        const saved = store.importBackup(active, importData);
        account?.queue();
        $("#settings-status").textContent = saved
          ? "Backup merged."
          : "Backup loaded in memory. Browser storage is unavailable: export before refreshing.";
        importData = null;
        $("#import-preview").hidden = true;
        render();
      });
    } catch (error) {
      $("#settings-status").textContent = `Import stopped: ${error.message}`;
    }
  });
  $("#menu").addEventListener("click", () => {
    const open = $("#sidebar").classList.toggle("open");
    $("#menu").setAttribute("aria-expanded", String(open));
    syncSidebar();
  });
  $("#theme").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    store?.setSetting("theme", next);
  });
  function searchResults() {
    const q = $("#search").value.trim().toLowerCase();
    const found = selectedModules()
      .filter((m) => `${m.id} ${m.title} ${m.skills.join(" ")}`.toLowerCase().includes(q))
      .slice(0, 20);
    $("#search-results").innerHTML =
      (config.tracks
        ? `<p class="fine-print">Searching ${esc(config.tracks.find((t) => t.id === track).label)}. Change paths in Curriculum to search the other path.</p>`
        : "") +
      (found
        .map(
          (m) => `<a class="search-result" href="#lesson/${m.id}/learn"><span>${m.id} · ${esc(m.stage)}</span><strong>${esc(m.title)}</strong></a>`
        )
        .join("") || "<p>No topics found. Try a broader term.</p>");
  }
  function syncSidebar() {
    $("#sidebar").inert = window.matchMedia("(max-width:760px)").matches && !$("#sidebar").classList.contains("open");
  }
  window.matchMedia("(max-width:760px)").addEventListener("change", syncSidebar);
  syncSidebar();
  function openSearch() {
    searchResults();
    $("#search-dialog").showModal();
    $("#search").focus();
  }
  $("#search-open").addEventListener("click", openSearch);
  $("#search").addEventListener("input", searchResults);
  $("#search-results").addEventListener("click", (e) => {
    if (e.target.closest("a")) $("#search-dialog").close();
  });
  document.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => document.getElementById(b.dataset.close).close()));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && $("#sidebar").classList.contains("open")) {
      $("#sidebar").classList.remove("open");
      $("#menu").setAttribute("aria-expanded", "false");
      syncSidebar();
      $("#menu").focus();
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (!$("#search-dialog").open) openSearch();
    }
  });
  window.addEventListener("hashchange", () => render(true));
  window.addEventListener("online", () => account?.sync());
  window.addEventListener("focus", () => account?.sync());
  window.addEventListener("storage", (e) => {
    if (e.key?.startsWith(PREFIX)) {
      refreshIfIdle();
      account?.queue();
    }
  });
  init();
}
