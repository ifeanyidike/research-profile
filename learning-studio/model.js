export function createModel(slug) {
  if (!["cyber-studio", "voice-ai-studio", "child-development-studio"].includes(slug)) throw Error("Unknown studio.");
  const PREFIX = `${slug}:v1:`;
  const PROFILES = ["ifeanyi", "partner"];
  const DEFAULT_NAMES = { ifeanyi: "Ifeanyi", partner: "Fav" };
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
  const REVIEW_DAYS = [2, 7, 30];
  const MAX_FILE_DATE = Date.UTC(9999, 11, 31, 23, 59, 59, 999);
  // Recall transitions must remain one local write; unrelated edits stay separate.
  const fieldGroup = (field) => (["passedAt", "reviewAt", "reviewStage"].includes(field) ? "recall" : field);
  const groups = [...new Set(Object.keys(FIELDS).map(fieldGroup))];
  const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  const plain = (o) => o !== null && typeof o === "object" && !Array.isArray(o) && Object.getPrototypeOf(o) === Object.prototype;

  function validateRecord(record) {
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

  function syncableText(text) {
    for (const char of text) {
      const point = char.codePointAt(0);
      if (point === 0 || (point >= 0xd800 && point <= 0xdfff)) return false;
    }
    return true;
  }
  // Keep legacy text readable/exportable. Omission from an upload deletes nothing.
  function syncableRecord(source) {
    validateRecord(source);
    const record = { values: {}, changed: {} },
      held = [];
    for (const [field, value] of Object.entries(source.values)) {
      if (typeof value === "string" && !syncableText(value)) held.push(field);
      else {
        record.values[field] = value;
        record.changed[field] = source.changed[field];
      }
    }
    return { record, held };
  }

  // UTF-8 byte ordering gives every device and PostgreSQL the same tie-break.
  const tieKey = (value) => Array.from(new TextEncoder().encode(JSON.stringify(value)), (b) => b.toString(16).padStart(2, "0")).join("");
  function mergeRecords(current, incoming) {
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

  // Compare record meaning, independent of PostgreSQL JSONB object-key order.
  function sameRecord(a, b) {
    if (!a || !b) return a === b;
    const fields = Object.keys(a.values);
    return (
      fields.length === Object.keys(b.values).length &&
      fields.every((f) => own(b.values, f) && a.values[f] === b.values[f] && a.changed[f] === b.changed[f])
    );
  }
  function sameLessons(a, b) {
    const ids = Object.keys(a);
    return ids.length === Object.keys(b).length && ids.every((id) => sameRecord(a[id], b[id]));
  }
  // Keep memory-only recovery buffers alive across authentication changes.
  function workspaceStores(storage, ids, clock = Date.now, onStatus = () => {}) {
    const stores = new Map();
    return (scope) => {
      if (!stores.has(scope)) stores.set(scope, createStore(storage, ids, clock, onStatus, scope));
      return stores.get(scope);
    };
  }

  function parseBackup(input, ids, { fromFile = false } = {}) {
    if (typeof input !== "string" || input.length > 32000000) throw new Error("Choose a matching studio JSON backup smaller than 32 MB.");
    const data = JSON.parse(input);
    if (
      !plain(data) ||
      data.kind !== `${slug}-progress` ||
      data.version !== 1 ||
      !plain(data.profile) ||
      !PROFILES.includes(data.profile.id) ||
      typeof data.profile.name !== "string" ||
      data.profile.name.length > 60 ||
      !plain(data.lessons)
    )
      throw new Error("This is not a supported studio backup.");
    for (const [id, record] of Object.entries(data.lessons)) {
      if (!ids.has(id)) throw new Error(`Unknown lesson: ${id}`);
      validateRecord(record);
      if (fromFile)
        for (const [field, stamp] of Object.entries(record.changed))
          if (stamp >= MAX_FILE_DATE || (["passedAt", "reviewAt"].includes(field) && record.values[field] >= MAX_FILE_DATE))
            throw Error(`${id}/${field}: this backup contains an unsupported far-future date. Check the source file before importing.`);
    }
    return data;
  }

  function createStore(storage, ids, clock = Date.now, onStatus = () => {}, scope = "guest") {
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
      } catch {
        dirty.add(key);
        failed = true;
        onStatus(false);
        return;
      }
      try {
        // Retry memory-only work after space returns. Merge first so a newer
        // same-field value from another tab cannot be overwritten by a retry.
        for (const pending of [...dirty]) {
          let recovered = memory.get(pending);
          if (pending.includes(":field:")) recovered = JSON.stringify(mergeRecords(decode(storage.getItem(pending)), decode(recovered)));
          storage.setItem(pending, recovered);
          memory.set(pending, recovered);
          dirty.delete(pending);
        }
        failed = false;
      } catch {
        failed = true;
      }
      onStatus(!failed && dirty.size === 0);
    }
    function key(profile, id) {
      if (!PROFILES.includes(profile) || !ids.has(id)) throw new Error("Unknown learner or lesson.");
      return `${prefix}${profile}:${id}`;
    }
    function decode(raw) {
      if (!raw) return empty();
      try {
        return validateRecord(JSON.parse(raw));
      } catch {
        onStatus(false, "A saved lesson record could not be read. Export a backup before clearing browser data.");
        return empty();
      }
    }
    function record(profile, id) {
      const base = key(profile, id);
      // Read legacy aggregates, but never rewrite them. Independent field keys
      // prevent one tab's note write from erasing another tab's practice edit.
      let result = decode(read(base));
      for (const group of groups) result = mergeRecords(result, decode(read(`${base}:field:${group}`)));
      return result;
    }
    function saveFields(profile, id, current, next) {
      const base = key(profile, id);
      const changedGroups = new Set(
        Object.keys(next.values)
          .filter((field) => current.values[field] !== next.values[field] || current.changed[field] !== next.changed[field])
          .map(fieldGroup)
      );
      for (const group of changedGroups) {
        const entry = empty();
        for (const field of Object.keys(next.values).filter((field) => fieldGroup(field) === group)) {
          entry.values[field] = next.values[field];
          entry.changed[field] = next.changed[field];
        }
        write(`${base}:field:${group}`, JSON.stringify(entry));
      }
    }
    function prepareUpdate(profile, id, patch) {
      const current = record(profile, id);
      for (const [field, value] of Object.entries(patch)) {
        if (typeof value === "string" && !syncableText(value))
          throw Error(`${id}/${field}: remove null characters or incomplete Unicode characters before saving. Your draft is kept here.`);
        if (current.changed[field] === 8640000000000000)
          throw Error(`${id}/${field}: its saved change date is at the supported limit. Export a backup before repairing that field’s date.`);
      }
      const next = { values: { ...current.values, ...patch }, changed: { ...current.changed } };
      const tick = Math.max(clock(), ...Object.keys(patch).map((field) => (current.changed[field] ?? -1) + 1));
      for (const field of Object.keys(patch)) next.changed[field] = tick;
      validateRecord(next);
      return { current, next };
    }
    function update(profile, id, patch) {
      const { current, next } = prepareUpdate(profile, id, patch);
      saveFields(profile, id, current, next);
      return next.values;
    }
    function exportBackup(profile, name) {
      const lessons = {};
      for (const id of ids) {
        const r = record(profile, id);
        if (Object.keys(r.values).length) lessons[id] = r;
      }
      return { kind: `${slug}-progress`, version: 1, profile: { id: profile, name }, exportedAt: new Date(clock()).toISOString(), lessons };
    }
    function backupPlan(profile, data) {
      const checked = parseBackup(JSON.stringify(data), ids);
      let applied = 0;
      const older = [];
      for (const [id, incoming] of Object.entries(checked.lessons)) {
        const current = record(profile, id),
          merged = mergeRecords(current, incoming);
        for (const field of Object.keys(incoming.values)) {
          if (!own(current.values, field) || merged.values[field] !== current.values[field] || merged.changed[field] !== current.changed[field])
            applied++;
          else if (incoming.values[field] !== current.values[field])
            older.push({ id, field, value: incoming.values[field], current: current.values[field], changed: current.changed[field] });
        }
      }
      return { checked, applied, older };
    }
    function importBackup(profile, data) {
      // Validate the whole file before writing, including programmatic callers.
      const { checked, applied, older } = backupPlan(profile, data);
      for (const [id, incoming] of Object.entries(checked.lessons)) {
        const current = record(profile, id),
          merged = mergeRecords(current, incoming);
        if (!sameRecord(current, merged)) saveFields(profile, id, current, merged);
      }
      const held = Object.keys(checked.lessons).flatMap((id) => syncableRecord(record(profile, id)).held.map((field) => ({ id, field })));
      return { saved: !failed && dirty.size === 0, applied, older, held };
    }
    function restoreFields(profile, selections) {
      const patches = new Map();
      // Refuse the whole selection if any preview is stale or invalid.
      for (const item of selections) {
        const current = record(profile, item.id);
        if (current.values[item.field] !== item.current || current.changed[item.field] !== item.changed)
          throw Error("Progress changed since this preview. Choose the backup again before restoring.");
        const patch = { [item.field]: item.value };
        validateRecord({ values: patch, changed: { [item.field]: 1 } });
        patches.set(item.id, { ...patches.get(item.id), ...patch });
      }
      const prepared = [...patches].map(([id, patch]) => ({ id, ...prepareUpdate(profile, id, patch) }));
      for (const { id, current, next } of prepared) saveFields(profile, id, current, next);
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
      backupPlan,
      restoreFields,
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

  function learningState(modules, records, now = Date.now()) {
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

  return {
    PREFIX,
    PROFILES,
    DEFAULT_NAMES,
    REVIEW_DAYS,
    validateRecord,
    syncableText,
    syncableRecord,
    mergeRecords,
    sameRecord,
    sameLessons,
    workspaceStores,
    parseBackup,
    createStore,
    learningState,
  };
}
