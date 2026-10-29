export const PREFIX = "cyber-studio:v1:";
export const PROFILES = ["ifeanyi", "partner"];
export const DEFAULT_NAMES = { ifeanyi: "Ifeanyi", partner: "Fav" };
const FIELDS = {
  read: "boolean",
  practice: "boolean",
  passedAt: "number",
  reviewAt: "number",
  reviewStage: "number",
  notes: "string",
  evidence: "string",
  assessment: "string",
  resources: "string",
};
const DAY = 86400000;
export const REVIEW_DAYS = [2, 7, 30];
const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const plain = (o) => o !== null && typeof o === "object" && !Array.isArray(o) && Object.getPrototypeOf(o) === Object.prototype;

export function validateRecord(record) {
  if (!plain(record) || !plain(record.values) || !plain(record.changed) || Object.keys(record).some((k) => !["values", "changed"].includes(k)))
    throw new Error("Invalid lesson record.");
  if (Object.keys(record.changed).some((k) => !own(record.values, k))) throw new Error("Invalid field dates.");
  for (const [field, value] of Object.entries(record.values)) {
    if (!own(FIELDS, field) || typeof value !== FIELDS[field]) throw new Error("Unrecognised progress field.");
    if (typeof value === "number" && (!Number.isSafeInteger(value) || value < 0 || value > 8640000000000000))
      throw new Error("Invalid progress number.");
    if (field === "reviewStage" && (!Number.isInteger(value) || value > REVIEW_DAYS.length)) throw new Error("Invalid review stage.");
    if (typeof value === "string" && value.length > 20000) throw new Error("A note is too long (20,000 character limit).");
    if (field === "resources") {
      let checks;
      try {
        checks = JSON.parse(value);
      } catch {
        throw new Error("Invalid resource checklist.");
      }
      if (!Array.isArray(checks) || checks.length > 200 || checks.some((k) => typeof k !== "string" || !/^(video|reading):[0-9]{1,3}$/.test(k)))
        throw new Error("Invalid resource checklist.");
    }
    if (!Number.isSafeInteger(record.changed[field]) || record.changed[field] < 0 || record.changed[field] > 8640000000000000)
      throw new Error("Invalid field date.");
  }
  return record;
}

// UTF-8 byte ordering gives every device and PostgreSQL the same tie-break.
const tieKey = (value) => Array.from(new TextEncoder().encode(JSON.stringify(value)), (b) => b.toString(16).padStart(2, "0")).join("");
export function mergeRecords(current, incoming) {
  const out = { values: { ...current.values }, changed: { ...current.changed } };
  for (const field of Object.keys(incoming.values)) {
    if (
      !own(out.changed, field) ||
      incoming.changed[field] > out.changed[field] ||
      (incoming.changed[field] === out.changed[field] && tieKey(incoming.values[field]) > tieKey(out.values[field]))
    ) {
      out.values[field] = incoming.values[field];
      out.changed[field] = incoming.changed[field];
    }
  }
  return out;
}

export function parseBackup(input, ids) {
  if (typeof input !== "string" || input.length > 32000000) throw new Error("Choose a Cyber Studio JSON backup smaller than 32 MB.");
  const data = JSON.parse(input);
  if (
    !plain(data) ||
    data.kind !== "cyber-studio-progress" ||
    data.version !== 1 ||
    !plain(data.profile) ||
    !PROFILES.includes(data.profile.id) ||
    typeof data.profile.name !== "string" ||
    data.profile.name.length > 60 ||
    !plain(data.lessons)
  )
    throw new Error("This is not a supported Cyber Studio backup.");
  for (const [id, record] of Object.entries(data.lessons)) {
    if (!ids.has(id)) throw new Error(`Unknown lesson: ${id}`);
    validateRecord(record);
  }
  return data;
}

export function createStore(storage, ids, clock = Date.now, onStatus = () => {}, scope = "guest") {
  const memory = new Map();
  const dirty = new Set();
  const prefix = `${PREFIX}${scope}:`;
  let failed = false;
  const empty = () => ({ values: {}, changed: {} });
  function read(key) {
    if (dirty.has(key)) return memory.get(key) ?? null;
    try {
      const raw = storage.getItem(key);
      if (raw !== null) {
        memory.set(key, raw);
        return raw;
      }
    } catch {
      failed = true;
      onStatus(false);
    }
    return memory.get(key) ?? null;
  }
  function write(key, value) {
    memory.set(key, value);
    try {
      storage.setItem(key, value);
      dirty.delete(key);
      failed = false;
      onStatus(dirty.size === 0);
    } catch {
      dirty.add(key);
      failed = true;
      onStatus(false);
    }
  }
  function key(profile, id) {
    if (!PROFILES.includes(profile) || !ids.has(id)) throw new Error("Unknown learner or lesson.");
    return `${prefix}${profile}:${id}`;
  }
  function record(profile, id) {
    const raw = read(key(profile, id));
    if (!raw) return empty();
    try {
      return validateRecord(JSON.parse(raw));
    } catch {
      onStatus(false, "A saved lesson record could not be read. Export a backup before clearing browser data.");
      return empty();
    }
  }
  function update(profile, id, patch) {
    const current = record(profile, id);
    const next = { values: { ...current.values, ...patch }, changed: { ...current.changed } };
    const tick = Math.max(clock(), ...Object.values(current.changed).map((n) => n + 1));
    for (const field of Object.keys(patch)) next.changed[field] = tick;
    validateRecord(next);
    write(key(profile, id), JSON.stringify(next));
    return next.values;
  }
  function exportBackup(profile, name) {
    const lessons = {};
    for (const id of ids) {
      const r = record(profile, id);
      if (Object.keys(r.values).length) lessons[id] = r;
    }
    return { kind: "cyber-studio-progress", version: 1, profile: { id: profile, name }, exportedAt: new Date(clock()).toISOString(), lessons };
  }
  function importBackup(profile, data) {
    // Validate the entire file before writing any record, including programmatic callers.
    const checked = parseBackup(JSON.stringify(data), ids);
    for (const [id, incoming] of Object.entries(checked.lessons))
      write(key(profile, id), JSON.stringify(mergeRecords(record(profile, id), incoming)));
    return !failed && dirty.size === 0;
  }
  function review(profile, id) {
    const r = record(profile, id).values;
    const stage = r.reviewStage || 0;
    if (!r.passedAt || stage >= REVIEW_DAYS.length || clock() < r.reviewAt) throw new Error("This review is not due yet.");
    const next = stage + 1;
    return update(profile, id, { reviewStage: next, reviewAt: next < REVIEW_DAYS.length ? clock() + REVIEW_DAYS[next] * DAY : 0 });
  }
  return {
    record,
    update,
    exportBackup,
    importBackup,
    review,
    pass(profile, id) {
      return update(profile, id, { passedAt: clock(), reviewAt: clock() + REVIEW_DAYS[0] * DAY, reviewStage: 0 });
    },
    setting(name, fallback) {
      try {
        return JSON.parse(read(`${prefix}settings:${name}`)) ?? fallback;
      } catch {
        return fallback;
      }
    },
    setSetting(name, value) {
      write(`${prefix}settings:${name}`, JSON.stringify(value));
    },
  };
}

export function learningState(modules, records, now = Date.now()) {
  const passed = (id) => !!records[id]?.passedAt;
  const ready = (m) => m.prerequisites.every(passed);
  return {
    passed: modules.filter((m) => passed(m.id)).length,
    practised: modules.filter((m) => records[m.id]?.practice).length,
    due: modules.filter((m) => passed(m.id) && records[m.id].reviewAt > 0 && records[m.id].reviewAt <= now),
    next: modules.find((m) => !passed(m.id) && ready(m)),
    ready,
  };
}
