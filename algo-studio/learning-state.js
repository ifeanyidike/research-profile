import { lessons, route } from "./curriculum.js";
import { validSystemProgress } from "./system-design-model.js?v=20261016-system1";
export const initialState = () => ({ version: 1, done: {}, drafts: {}, reviews: {}, activity: [], ready: {}, practice: {}, systemDesign: {} });
export function upgradeState(saved) {
  const state = { ...initialState(), ...saved };
  state.ready ??= {};
  state.practice ??= {};
  state.systemDesign ??= {};
  return state;
}
export const ready = (state, id) => !!state.ready?.[id];
export const lessonComplete = (state, id) => !!state.done?.[id] || ready(state, id);
export const missingPrerequisites = (state, id) => lessons[id].requires.filter((p) => !lessonComplete(state, p));
export const canOpen = (state, id) => !!lessons[id] && (!!state.done[id] || missingPrerequisites(state, id).length === 0);
export function nextActivity(state) {
  const id = route.find((id) => !lessonComplete(state, id) && canOpen(state, id));
  return id === undefined ? { id: route.at(-1), kind: "review" } : { id, kind: "lesson" };
}
export function lessonContinuation(state, id) {
  if (!lessonComplete(state, id)) return { id, kind: "lesson" };
  const next = route[route.indexOf(id) + 1];
  if (next !== undefined && canOpen(state, next)) return { id: next, kind: "lesson" };
  return nextActivity(state);
}
export function checkpointDestination(state, id) {
  return lessonContinuation({ ...state, ready: { ...state.ready, [id]: state.ready[id] || { at: 0, status: "supported" } } }, id);
}
export const validRun = (d) =>
  typeof d.code === "string" && d.passedCode === d.code && Array.isArray(d.results) && d.results.length > 0 && d.results.every((r) => r.passed);
export function recordCheckpoint(state, id, d, now = Date.now(), kind = "check") {
  if (!validRun(d) || !canOpen(state, id) || (d.notes !== undefined && typeof d.notes !== "string")) return false;
  d.completedAt = now;
  d.status = d.assisted || d.hint > 0 ? "supported" : d.exposed ? "reattempt" : "without-help";
  if (!state.ready[id] || d.status !== "supported") state.ready[id] = { at: now, status: d.status };
  state.done[id] ??= { at: now, assisted: d.status === "supported", placement: true };
  const review = (state.reviews[id] ??= { stage: 0, due: now + 86400000 });
  if (kind === "recall") {
    if ((review.codeDue || 0) <= now) {
      if (d.status === "supported") review.codeDue = now + 600000;
      else {
        review.codeStage = (review.codeStage || 0) + 1;
        review.codeDue = now + [2, 7, 14, 30][Math.min(review.codeStage, 3)] * 86400000;
      }
    }
  } else if (!review.codeDue) review.codeDue = now + 2 * 86400000;
  return true;
}
export function validBackup(s) {
  const record = (x) => x && typeof x === "object" && !Array.isArray(x);
  const validId = (id) => /^\d+$/.test(id) && !!lessons[Number(id)];
  const draft = (d) =>
    record(d) &&
    typeof d.code === "string" &&
    d.code.length < 100000 &&
    (d.notes === undefined || typeof d.notes === "string") &&
    (d.hint === undefined || (Number.isInteger(d.hint) && d.hint >= 0 && d.hint <= 2)) &&
    (d.assisted === undefined || typeof d.assisted === "boolean") &&
    (d.exposed === undefined || typeof d.exposed === "boolean");
  return (
    s?.version === 1 &&
    record(s.done) &&
    record(s.drafts) &&
    record(s.reviews) &&
    (s.systemDesign === undefined || validSystemProgress(s.systemDesign)) &&
    Array.isArray(s.activity) &&
    s.activity.every((x) => typeof x === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x)) &&
    Object.entries(s.drafts).every(
      ([id, d]) =>
        validId(id) &&
        draft(d) &&
        Number.isInteger(d.step) &&
        d.step >= 0 &&
        d.step <= 3 &&
        typeof d.notes === "string" &&
        (d.walkIndex === undefined || (Number.isInteger(d.walkIndex) && d.walkIndex >= 0 && d.walkIndex < lessons[Number(id)].walk.length)) &&
        ["predict", "reflect"].every((k) => d[k] === undefined || (Number.isInteger(d[k]) && d[k] >= 0 && d[k] < 3))
    ) &&
    Object.entries(s.done).every(([id, d]) => validId(id) && record(d) && Number.isFinite(d.at) && typeof d.assisted === "boolean") &&
    Object.entries(s.reviews).every(
      ([id, r]) =>
        validId(id) &&
        record(r) &&
        Number.isInteger(r.stage) &&
        r.stage >= 0 &&
        Number.isFinite(r.due) &&
        (r.codeDue === undefined || Number.isFinite(r.codeDue)) &&
        (r.codeStage === undefined || (Number.isInteger(r.codeStage) && r.codeStage >= 0))
    ) &&
    (s.ready === undefined ||
      (record(s.ready) &&
        Object.entries(s.ready).every(
          ([id, r]) => validId(id) && record(r) && Number.isFinite(r.at) && ["without-help", "reattempt", "supported"].includes(r.status)
        ))) &&
    (s.practice === undefined ||
      (record(s.practice) &&
        Object.entries(s.practice).every(([key, d]) => /^(\d+):(check|recall|transfer)$/.test(key) && validId(key.split(":")[0]) && draft(d))))
  );
}
