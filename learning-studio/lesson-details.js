// Shared presentation only. Progress and prerequisite enforcement stay in the models/apps.
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
export function lessonDetails(m, record, missing, byId, scopeNote = "") {
  const goals = m.outcomes || m.skills;
  const link = (id) => `<a href="#lesson/${encodeURIComponent(id)}/learn">${esc(id)} · ${esc(byId[id]?.title || id)}</a>`;
  const due = record.reviewAt
    ? `Next recall review: ${new Date(record.reviewAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}.`
    : record.passedAt
      ? "Recall sequence complete. Revisit whenever useful."
      : "A self-assessed pass schedules recall reviews.";
  return `<details class="lesson-details"><summary><span>Lesson details</span><span class="details-caption" data-detail-caption>${missing.length ? `${missing.length} prerequisite${missing.length === 1 ? "" : "s"} to review` : "Goals, prerequisites & progress"}</span></summary><div class="lesson-details-body"><section class="lesson-details-goals"><h2>${m.outcomes ? "Learning goals" : "Topics covered"}</h2><ul>${goals.map((goal) => `<li>${esc(goal)}</li>`).join("")}</ul>${m.outcomes ? `<p class="fine-print">Skills: ${esc(m.skills.join(" · "))}</p>` : ""}</section><section><h2>Builds on</h2>${m.prerequisites.length ? `<ul>${m.prerequisites.map((id) => `<li>${link(id)}</li>`).join("")}</ul>` : "<p>No earlier topic required.</p>"}</section><section><h2>Your progress</h2><ul><li data-detail-progress="read">${record.read ? "✓" : "○"} Introduction understood</li><li data-detail-progress="practice">${record.practice ? "✓" : "○"} Practice completed</li><li data-detail-progress="passedAt">${record.passedAt ? "✓" : "○"} Self-assessed pass</li></ul><p class="fine-print"><span data-detail-due>${esc(due)}</span> <a href="#review">Recall & review</a></p></section>${scopeNote ? `<p class="fine-print lesson-scope">${esc(scopeNote)}</p>` : ""}</div></details>`;
}

// Update only changing text; keep disclosures, prerequisite links, focus and equations.
export function updateLessonDetails(panel, record, missing) {
  const set = (selector, text) => {
    const el = panel.querySelector(selector);
    if (el && el.textContent !== text) el.textContent = text;
  };
  set(
    "[data-detail-caption]",
    missing.length ? `${missing.length} prerequisite${missing.length === 1 ? "" : "s"} to review` : "Goals, prerequisites & progress"
  );
  for (const [field, label] of [
    ["read", "Introduction understood"],
    ["practice", "Practice completed"],
    ["passedAt", "Self-assessed pass"],
  ])
    set(`[data-detail-progress="${field}"]`, `${record[field] ? "✓" : "○"} ${label}`);
  set(
    "[data-detail-due]",
    record.reviewAt
      ? `Next recall review: ${new Date(record.reviewAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}.`
      : record.passedAt
        ? "Recall sequence complete. Revisit whenever useful."
        : "A self-assessed pass schedules recall reviews."
  );
}
