import { reasoningSets, reasoningFields } from "./reasoning-course.js?v=20261027-course2";
export const reasoningDefaults = {
  answer0: -1,
  answer1: -1,
  answer2: -1,
  answer3: -1,
  checked: false,
  assisted: false,
  exposed: false,
  selfReviewed: false,
  approach: "",
  proof: "",
  boundary: "",
  cost: "",
  attempts: 0,
  completedAt: 0,
  reviewDue: 0,
  reviewCount: 0,
  notBefore: 0,
  status: "draft",
  previous: "",
};
export function validReasoningProgress(map) {
  if (!map || typeof map !== "object" || Array.isArray(map)) return false;
  return Object.entries(map).every(
    ([id, d]) =>
      /^\d+$/.test(id) &&
      Object.hasOwn(reasoningSets, id) &&
      d &&
      typeof d === "object" &&
      !Array.isArray(d) &&
      Object.entries(d).every(([key, value]) => {
        if (!Object.hasOwn(reasoningDefaults, key)) return false;
        if (/^answer[0-3]$/.test(key)) return Number.isInteger(value) && value >= -1 && value <= 2;
        if (["checked", "assisted", "exposed", "selfReviewed"].includes(key)) return typeof value === "boolean";
        if (["approach", "proof", "boundary", "cost", "previous"].includes(key))
          return typeof value === "string" && value.length <= (key === "previous" ? 50000 : 10000);
        if (["attempts", "reviewCount"].includes(key)) return Number.isInteger(value) && value >= 0 && value <= 100000;
        if (key === "status") return ["draft", "without-guidance", "supported", "reattempt"].includes(value);
        return Number.isFinite(value) && value >= 0;
      })
  );
}
export function reasoningDraft(state, stage) {
  return (state.reasoning[stage] ??= structuredClone(reasoningDefaults));
}
export function correctReasoning(set, d) {
  return set.questions.every((q, i) => d["answer" + i] === q.answer);
}
export function checkReasoning(set, d) {
  if (!set.questions.every((q, i) => Number.isInteger(d["answer" + i]) && d["answer" + i] >= 0)) return false;
  d.attempts = (d.attempts || 0) + 1;
  d.checked = true;
  if (!correctReasoning(set, d)) {
    d.assisted = true;
    d.exposed = true;
  }
  return true;
}
export function canFinishReasoning(set, d) {
  return (
    !!d.checked &&
    correctReasoning(set, d) &&
    !!d.selfReviewed &&
    reasoningFields.every(([key]) => typeof d[key] === "string" && d[key].trim().length >= 20)
  );
}
export function finishReasoning(set, d, now = Date.now()) {
  if (d.completedAt || !canFinishReasoning(set, d)) return false;
  d.status = d.assisted ? "supported" : d.exposed ? "reattempt" : "without-guidance";
  d.completedAt = now;
  if (d.notBefore && now < d.notBefore) d.reviewDue = d.notBefore;
  else {
    if (d.notBefore) d.reviewCount = (d.reviewCount || 0) + 1;
    d.reviewDue = now + [2, 7, 14, 30][Math.min(d.reviewCount || 0, 3)] * 86400000;
  }
  d.exposed = true;
  return true;
}
export function freshReasoning(d) {
  return {
    ...structuredClone(reasoningDefaults),
    previous: reasoningFields.map(([key, title]) => title + "\n" + (d[key] || "")).join("\n\n"),
    notBefore: d.reviewDue || d.notBefore || 0,
    reviewCount: d.reviewCount || 0,
    exposed: !!d.exposed,
  };
}
