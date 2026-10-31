import { renderProse } from "./prose.js?v=20261031-4";
const esc = (text) => String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
export function passCriteria(module) {
  const body = module.outcomes?.length
    ? `<ul>${module.outcomes.map((outcome) => `<li>${esc(outcome)}</li>`).join("")}</ul>`
    : renderProse(module.pass_criteria);
  return `<div class="callout"><strong>Pass criteria</strong>${body}</div>`;
}
export function additionalExample(text) {
  return `<details class="lesson-extra"><summary>Optional: another practice idea</summary>${renderProse(text)}</details>`;
}
