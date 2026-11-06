import { renderProse } from "./prose.js?v=20261106-4";
import { renderCode } from "./code-editor.js?v=20261106-4";
const esc = (text) => String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
export function lessonReading(lesson, { extra = "" } = {}) {
  const g = lesson.guide;
  const example =
    g.example_format === "math"
      ? `<div class="math-example" aria-label="Worked mathematical example">${renderProse(g.example)}</div>`
      : g.example_format === "prose"
        ? `<div class="case-example" aria-label="Worked case or scenario">${renderProse(g.example)}</div>`
        : renderCode(g.example, g.example_format);
  return `<p class="lesson-intro">${esc(lesson.concept)}</p><div class="lesson-preparation">${renderProse(g.bridge)}</div>${readingDiagram(g.diagram)}${renderProse(g.teaching, { headingLevel: 2 })}<section class="worked-example"><h2>Follow a worked example</h2>${renderProse(g.example_intro || "")}${example}${renderProse(g.explanation)}</section><div class="lesson-recap"><strong>What to remember</strong><p>${esc(lesson.mechanism)}</p></div><div class="misconception"><strong>A common mistake to avoid</strong><p>${esc(lesson.pitfall)}</p></div>${extra}`;
}
function readingDiagram(kind) {
  if (kind === "sampling") {
    const point = (x, y) => [40 + x * 500, y - Math.sin(x * Math.PI * 4) * 28];
    const row = (y, count) => {
      const line = Array.from({ length: 101 }, (_, i) => point(i / 100, y).join(",")).join(" ");
      const dots = Array.from({ length: count }, (_, i) => {
        const [x, cy] = point(i / (count - 1), y);
        return `<circle cx="${x}" cy="${cy}" r="4" />`;
      }).join("");
      return `<line x1="40" y1="${y}" x2="540" y2="${y}" class="sampling-axis"/><polyline points="${line}"/>${dots}`;
    };
    return `<figure class="lesson-diagram"><svg viewBox="0 0 590 250" role="img" aria-labelledby="sampling-picture-title sampling-picture-description"><title id="sampling-picture-title">The same signal, measured at two rates</title><desc id="sampling-picture-description">Two copies of the same wave over the same time interval. The first has nine measurement dots and the second has seventeen. A higher sampling rate stores more measurements in the same time.</desc><text x="40" y="25">Fewer samples in this interval</text>${row(70, 9)}<text x="40" y="130">More samples in the same interval</text>${row(175, 17)}<text x="40" y="235">Time →</text><text x="270" y="235">Each dot is one sample.</text></svg><figcaption>The line shows a changing signal; the dots show stored measurements. This is a small illustration, not a 16 kHz recording.</figcaption></figure>`;
  }
  if (kind === "ownership")
    return `<figure class="lesson-diagram"><table><caption>A valid sign-in still needs a note-access check</caption><thead><tr><th scope="col">Request</th><th scope="col">Signed in?</th><th scope="col">Owns the note?</th><th scope="col">Owner-only decision</th></tr></thead><tbody><tr><th scope="row">A reads A's note</th><td>Yes</td><td>Yes</td><td>Allow</td></tr><tr><th scope="row">A reads B's note</th><td>Yes</td><td>No</td><td>Deny</td></tr></tbody></table><figcaption>Authentication answers who is signed in. Authorisation decides whether this action on this note is allowed.</figcaption></figure>`;
  return "";
}
export function passCriteria(module) {
  const body = module.outcomes?.length
    ? `<ul>${module.outcomes.map((outcome) => `<li>${esc(outcome)}</li>`).join("")}</ul>`
    : renderProse(module.pass_criteria);
  return `<div class="callout"><strong>What your answer needs to show</strong>${body}</div>`;
}
export function additionalExample(text) {
  return `<details class="lesson-extra"><summary>Optional: another practice idea</summary>${renderProse(text)}</details>`;
}
