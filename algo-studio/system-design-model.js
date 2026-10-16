import { systemLessons, systemLessonById } from "./system-design-course.js?v=20261016-system1";
export const systemDefaults = {
  step: 0,
  walkIndex: 0,
  answer: -1,
  checked: false,
  attempts: 0,
  revealed: false,
  plan: "",
  notes: "",
  checks: [false, false, false],
  completedAt: 0,
  supported: false,
  notebookIndex: 0,
  scope: "",
  workload: "",
  contract: "",
  architecture: "",
  failure: "",
  tradeoff: "",
  reviewDue: 0,
  reviewCount: 0,
  reviewAnswer: -1,
  reviewChecked: false,
  reviewNote: "",
  labUsers: 8640,
  labActions: 10,
  labPeak: 10,
  labServers: 1,
  labReads: 1000,
  labHit: 90,
  labSource: 200,
  labArrival: 10,
  labWorkers: 2,
  labRate: 3,
  labSeconds: 30,
  labBacklog: 0,
};
export const notebookPrompts = [
  ["scope", "1. Who is this for?", "Name the user, two core actions, one correctness rule, and what is out of scope."],
  ["workload", "2. How much work?", "State requests per second, record sizes, or retention. Show units and label assumptions."],
  ["contract", "3. What goes in and out?", "Describe one read API, one write API, record IDs, and a useful error response."],
  ["architecture", "4. Follow the data", "Name your components and trace a read and a write. Identify the durable source of truth."],
  ["failure", "5. What breaks?", "Choose a crash, timeout, or overload. Explain retries, duplicate effects, recovery, and privacy."],
  ["tradeoff", "6. Defend a choice", "Compare one alternative. State what you gain, what it costs, and what evidence would change your mind."],
];
export const systemProgress = (state, id) => ({ ...systemDefaults, checks: [...systemDefaults.checks], ...state.systemDesign?.[id] });
export const systemCanOpen = (state, id) =>
  !!systemLessonById[id] && systemLessonById[id].requires.every((p) => !!state.systemDesign?.[p]?.completedAt);
export const systemNext = (state) => systemLessons.find((l) => !state.systemDesign?.[l.id]?.completedAt && systemCanOpen(state, l.id));
export function systemCanComplete(state, id) {
  const l = systemLessonById[id],
    d = systemProgress(state, id);
  return (
    !!l &&
    systemCanOpen(state, id) &&
    d.checked &&
    d.answer === l.check.answer &&
    d.plan.trim().length >= 30 &&
    d.checks.every(Boolean) &&
    (l.stage !== 4 || notebookPrompts.every(([field]) => d[field].trim().length >= 20))
  );
}
export function completeSystemLesson(state, id, now = Date.now()) {
  if (!systemCanComplete(state, id)) return false;
  const d = (state.systemDesign[id] ??= {});
  d.completedAt ||= now;
  d.supported = !!d.revealed || d.attempts > 1;
  d.reviewDue ||= now + 86400000;
  return true;
}
export function completeSystemReview(state, id, now = Date.now()) {
  const l = systemLessonById[id],
    d = state.systemDesign?.[id];
  if (!l || !d?.completedAt || !d.reviewChecked || d.reviewAnswer !== l.check.answer || (d.reviewNote || "").trim().length < 20) return false;
  d.reviewCount = (d.reviewCount || 0) + 1;
  d.reviewDue = now + [3, 7, 14, 30][Math.min(d.reviewCount - 1, 3)] * 86400000;
  return true;
}
export function validSystemProgress(value) {
  const record = (x) => x && typeof x === "object" && !Array.isArray(x);
  if (!record(value)) return false;
  return Object.entries(value).every(([id, d]) => {
    const l = systemLessonById[id];
    if (!l || !record(d)) return false;
    return Object.entries(d).every(([key, v]) => {
      if (!Object.hasOwn(systemDefaults, key)) return false;
      const expected = systemDefaults[key];
      if (typeof expected === "string") return typeof v === "string" && v.length <= 20000;
      if (typeof expected === "boolean") return typeof v === "boolean";
      if (key === "checks") return Array.isArray(v) && v.length === 3 && v.every((x) => typeof x === "boolean");
      if (!Number.isSafeInteger(v)) return false;
      if (["answer", "reviewAnswer"].includes(key)) return v >= -1 && v < l.check.options.length;
      if (key === "step") return v >= 0 && v <= 3;
      if (key === "walkIndex") return v >= 0 && v < l.walk.length;
      if (key === "notebookIndex") return v >= 0 && v < notebookPrompts.length;
      if (key === "labHit") return v >= 0 && v <= 100;
      return v >= 0 && v <= (key === "completedAt" || key === "reviewDue" ? Number.MAX_SAFE_INTEGER : 1000000);
    });
  });
}
export function capacityModel({ labUsers, labActions, labPeak, labServers }) {
  const daily = labUsers * labActions,
    average = daily / 86400,
    peak = average * labPeak;
  // 100 requests/second per app server is a made-up measured capacity for this exercise only.
  const capacity = labServers * 100;
  return { daily, average, peak, capacity, utilization: capacity ? peak / capacity : Infinity, minimumServers: Math.ceil(peak / 100) };
}
export function cacheModel({ labReads, labHit, labSource }) {
  const hits = (labReads * labHit) / 100,
    misses = labReads - hits;
  return { hits, misses, overloaded: misses > labSource, sourceUtilization: labSource ? misses / labSource : Infinity };
}
export function queueModel({ labArrival, labWorkers, labRate, labSeconds, labBacklog }) {
  const capacity = labWorkers * labRate,
    change = labArrival - capacity;
  const backlog = Math.max(0, labBacklog + change * labSeconds);
  return { capacity, change, backlog, drainSeconds: capacity > labArrival ? backlog / (capacity - labArrival) : backlog ? Infinity : 0 };
}
