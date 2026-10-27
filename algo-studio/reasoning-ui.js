import { reasoningSets, reasoningFields } from "./reasoning-course.js?v=20261027-course2";
import { reasoningDraft, checkReasoning, canFinishReasoning, finishReasoning, freshReasoning } from "./reasoning-model.js?v=20261027-course2";
const esc = (x) => String(x).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const labels = {
  "without-guidance": "Decisions checked without guidance",
  supported: "Supported reasoning practice",
  reattempt: "Reattempt of a familiar scenario",
};
export function createReasoning({ getState, save, render, stages }) {
  const $ = (selector) => document.querySelector(selector);
  function view(param) {
    const state = getState();
    if (param === undefined) {
      const completed = Object.values(state.reasoning).filter((d) => d.completedAt).length;
      return `<header class="page-intro"><div><span class="eyebrow green">CHOOSE. DEFEND. CHALLENGE.</span><h1>Make the reasoning yours.</h1><p>Twenty scenarios connect method choice, correctness, counterexamples, and cost. Four decisions per scenario are checked. Your four written explanations are saved for your own review; they are not automatically graded.</p><p class="fine-print">${completed} of ${reasoningSets.length} scenarios recorded. Repeat after a gap with a fresh example; repeated questions remain familiar practice, not unseen assessments.</p></div></header><div class="exercise-grid">${reasoningSets
        .map((set) => {
          const d = state.reasoning[set.stage];
          return `<article class="exercise-card"><span class="tag">STAGE ${set.stage + 1} · ${esc(stages[set.stage][2])}</span><h2>${esc(set.title)}</h2><p>${esc(set.scenario)}</p><p class="fine-print">${d?.completedAt ? `${esc(labels[d.status])}. ${d.reviewDue <= Date.now() ? "Ready for a delayed revisit." : "A later revisit is scheduled."}` : "Four checked decisions and a written defense."}</p><a class="subtle-link" href="#reasoning/${set.stage}">${d?.completedAt ? "Revisit this scenario" : "Open the reasoning review"} →</a></article>`;
        })
        .join("")}</div>`;
    }
    if (!/^\d+$/.test(param) || !Object.hasOwn(reasoningSets, param))
      return '<h1>Choose a reasoning scenario</h1><a href="#reasoning">Open all scenarios →</a>';
    const set = reasoningSets[param],
      d = reasoningDraft(state, set.stage);
    return `<div class="lesson-heading"><a class="subtle-link" href="#reasoning">← All reasoning scenarios</a><a class="subtle-link" href="#path/${set.stage}">Study this stage →</a></div><h1 class="lesson-title">${esc(set.title)}</h1><article class="lesson-panel focused-lesson reasoning-review"><span class="eyebrow green">A DECISION YOU CAN EXPLAIN</span><p class="reasoning-scenario">${esc(set.scenario)}</p>${d.completedAt ? `<div class="feedback success" role="status"><strong>${esc(labels[d.status])}</strong><p>Your decisions passed the checks and you self-reviewed your writing. This records practice, not verified mastery. Revisit after ${new Date(d.reviewDue).toLocaleDateString()} with a fresh example.</p><button class="button secondary" id="reasoning-fresh">Start a fresh written review</button></div>` : ""}<section aria-label="Four checked decisions">${set.questions.map((q, i) => `<fieldset class="reasoning-question"><legend>${i + 1}. ${esc(q.prompt)}</legend><div class="answers">${q.options.map((option, j) => `<button class="answer ${d["answer" + i] === j ? "selected" : ""}" data-reason-question="${i}" data-index="${j}" aria-pressed="${d["answer" + i] === j}" ${d.completedAt ? "disabled" : ""}><span>${String.fromCharCode(65 + j)}</span>${esc(option)}</button>`).join("")}</div>${d.checked ? `<div class="feedback ${d["answer" + i] === q.answer ? "success" : "retry"}"><strong>${d["answer" + i] === q.answer ? "That decision fits." : "Reconsider the assumption."}</strong><p>${esc(q.why)}</p></div>` : ""}</fieldset>`).join("")}<button class="button primary" id="reasoning-check" ${d.completedAt || set.questions.some((q, i) => !(d["answer" + i] >= 0)) ? "disabled" : ""}>Check these decisions</button></section><section class="reasoning-writing" aria-labelledby="reasoning-writing-title"><h2 id="reasoning-writing-title">Now defend it in your own words.</h2><p>Use this scenario or a fresh concrete example. Text length only checks that a draft exists; it cannot establish correctness.</p>${reasoningFields.map(([key, title, prompt]) => `<label class="notes-label" for="reasoning-${key}">${esc(title)}</label><p class="fine-print">${esc(prompt)}</p><textarea id="reasoning-${key}" data-reason-field="${key}" class="notes" maxlength="10000" rows="4" ${d.completedAt ? "readonly" : ""}>${esc(d[key] || "")}</textarea>`).join("")}<details class="more-detail" id="reasoning-guide"><summary>Compare with the reasoning guide</summary><p>Opening this records supported practice. Compare the claims, not just the answer letters.</p>${set.questions.map((q) => `<h3>${esc(q.options[q.answer])}</h3><p>${esc(q.why)}</p>`).join("")}<p>For your own example, trace each update, check an empty or boundary input where allowed, and count preprocessing, output, and stored state. If a claim is uncertain, keep it as a question for human review.</p></details><label class="reasoning-self-review"><input type="checkbox" id="reasoning-self-review" ${d.completedAt ? "disabled" : ""} ${d.selfReviewed ? "checked" : ""}> I checked my choice, safety argument, expected boundary result, and cost accounting. I understand this is my self-review.</label><p class="fine-print" id="reasoning-completion-hint">Correct decisions, four drafts of at least 20 characters, and your explicit self-review are required.</p><button class="button primary" id="reasoning-finish" ${!d.completedAt && canFinishReasoning(set, d) ? "" : "disabled"}>Record this reasoning practice</button></section>${d.previous ? `<details class="more-detail"><summary>Read my previous written attempt</summary><pre class="reasoning-previous">${esc(d.previous)}</pre></details>` : ""}</article>`;
  }
  function bind(param) {
    if (param === undefined || !/^\d+$/.test(param) || !Object.hasOwn(reasoningSets, param)) return;
    const set = reasoningSets[param],
      state = getState(),
      d = reasoningDraft(state, set.stage);
    const refreshButton = () => {
      $("#reasoning-finish").disabled = !canFinishReasoning(set, d);
    };
    document.querySelectorAll("[data-reason-question]").forEach(
      (button) =>
        (button.onclick = () => {
          d["answer" + button.dataset.reasonQuestion] = Number(button.dataset.index);
          d.checked = false;
          d.selfReviewed = false;
          save();
          render();
        })
    );
    $("#reasoning-check").onclick = () => {
      checkReasoning(set, d);
      save();
      render();
    };
    document.querySelectorAll("[data-reason-field]").forEach(
      (input) =>
        (input.oninput = () => {
          d[input.dataset.reasonField] = input.value;
          d.selfReviewed = false;
          $("#reasoning-self-review").checked = false;
          save();
          refreshButton();
        })
    );
    $("#reasoning-self-review").onchange = (e) => {
      d.selfReviewed = e.target.checked;
      save();
      refreshButton();
    };
    $("#reasoning-guide").ontoggle = (e) => {
      if (e.target.open && !d.assisted && !d.completedAt) {
        d.assisted = true;
        d.exposed = true;
        save();
      }
    };
    $("#reasoning-finish").onclick = () => {
      if (finishReasoning(set, d)) {
        save();
        render();
      }
    };
    if ($("#reasoning-fresh"))
      $("#reasoning-fresh").onclick = () => {
        state.reasoning[set.stage] = freshReasoning(d);
        save();
        render();
      };
  }
  return { view, bind };
}
