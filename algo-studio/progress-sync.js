import { initialState, validBackup, upgradeState } from "./learning-state.js?v=20261016-system1";
import { systemLessonById } from "./system-design-course.js?v=20261016-system1";
const groups = ["done", "drafts", "reviews", "ready", "practice", "systemDesign"];
const transient = new Set(["results", "passedCode"]);
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const clone = (x) => JSON.parse(JSON.stringify(x));
export function flattenProgress(state) {
  const out = {};
  for (const group of groups)
    for (const [id, value] of Object.entries(state[group] || {})) {
      if (["drafts", "practice", "systemDesign"].includes(group))
        for (const [field, v] of Object.entries(value)) {
          if (!transient.has(field) && v !== undefined) out[`${group}/${id}/${field}`] = v;
        }
      else out[`${group}/${id}`] = value;
    }
  for (const day of state.activity) out[`activity/${day}`] = true;
  return out;
}
function validKey(key) {
  const [group, id, field, ...rest] = key.split("/");
  if (rest.length || ["__proto__", "constructor", "prototype", "results", "passedCode"].includes(field)) return false;
  if (group === "activity") return !field && /^\d{4}-\d{2}-\d{2}$/.test(id);
  if (group === "systemDesign") return Object.hasOwn(systemLessonById, id) && !!field && /^[a-zA-Z][a-zA-Z0-9]*$/.test(field);
  if (!groups.includes(group) || !/^\d+(?::(?:check|recall|transfer))?$/.test(id)) return false;
  return group === "drafts" || group === "practice" ? !!field && /^[a-zA-Z][a-zA-Z0-9]*$/.test(field) : !field;
}
export function validDocument(doc) {
  return (
    doc?.version === 1 &&
    doc.records &&
    typeof doc.records === "object" &&
    !Array.isArray(doc.records) &&
    Object.entries(doc.records).every(
      ([key, r]) =>
        validKey(key) &&
        r &&
        Number.isSafeInteger(r.at) &&
        r.at >= 0 &&
        typeof r.device === "string" &&
        r.device.length < 100 &&
        Object.hasOwn(r, "value")
    )
  );
}
export class ProgressReplica {
  constructor(device, state = initialState(), document = { version: 1, records: {} }) {
    this.device = device;
    this.document = validDocument(document) ? clone(document) : { version: 1, records: {} };
    this.observed = clone(flattenProgress(state));
    this.clock = Math.max(0, ...Object.values(this.document.records).map((r) => r.at));
  }
  observe(state, now = Date.now()) {
    const next = flattenProgress(state),
      keys = new Set([...Object.keys(this.observed), ...Object.keys(next)]);
    let changed = false;
    for (const key of keys)
      if (!equal(this.observed[key], next[key])) {
        this.clock = Math.max(now, this.clock + 1);
        this.document.records[key] = { at: this.clock, device: this.device, value: next[key] ?? null };
        changed = true;
      }
    this.observed = clone(next);
    return changed;
  }
  merge(document) {
    if (!validDocument(document)) throw Error("The saved progress has an unsupported format.");
    let changed = false;
    for (const [key, incoming] of Object.entries(document.records)) {
      const local = this.document.records[key];
      this.clock = Math.max(this.clock, incoming.at);
      if (!local || incoming.at > local.at || (incoming.at === local.at && incoming.device > local.device)) {
        this.document.records[key] = clone(incoming);
        changed = true;
      }
    }
    return changed;
  }
  state(current = initialState()) {
    const state = initialState();
    for (const [key, { value }] of Object.entries(this.document.records)) {
      if (value === null) continue;
      const [group, id, field] = key.split("/");
      if (group === "activity") state.activity.push(id);
      else if (field) (state[group][id] ??= {})[field] = clone(value);
      else state[group][id] = clone(value);
    }
    state.activity.sort();
    if (!validBackup(state)) throw Error("The saved progress could not be read. Your local copy is kept.");
    for (const group of ["drafts", "practice"])
      for (const [id, d] of Object.entries(state[group])) {
        const previous = current[group]?.[id];
        d.passedCode = previous?.code === d.code ? previous.passedCode : null;
        if (previous?.code === d.code && previous.results) d.results = previous.results;
      }
    return upgradeState(state);
  }
  accept(state) {
    this.observed = clone(flattenProgress(state));
  }
}
