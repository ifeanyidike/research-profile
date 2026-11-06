// Adult learning checkmarks only. No child observations, recordings or diagnosis.
export const KEY = "speech-therapy-studio:parent-learning:v1";
export const IDS = Array.from({ length: 20 }, (_, i) => `S${String(i + 1).padStart(2, "0")}`);
export const PROFILES = ["ifeanyi", "fav"];
export function emptyState() {
  return { version: 1, active: "ifeanyi", learners: { ifeanyi: { done: [], last: "S01" }, fav: { done: [], last: "S01" } } };
}
function learner(value) {
  if (!value || !Array.isArray(value.done) || value.done.length > 20 || !IDS.includes(value.last) || value.done.some((id) => !IDS.includes(id)))
    throw Error("This learning record has an invalid lesson list.");
  return { done: [...new Set(value.done)], last: value.last };
}
export function parseState(value) {
  if (!value || value.version !== 1 || !PROFILES.includes(value.active)) throw Error("This is not a supported learning record.");
  return { version: 1, active: value.active, learners: { ifeanyi: learner(value.learners?.ifeanyi), fav: learner(value.learners?.fav) } };
}
export function parseBackup(text) {
  if (typeof text !== "string" || text.length > 32000) throw Error("Choose a Speech Therapy Studio learning backup smaller than 32 KB.");
  const data = JSON.parse(text);
  if (data.kind !== "speech-therapy-studio:parent-learning") throw Error("This file is not a Speech Therapy Studio learning backup.");
  return parseState(data.state);
}
export function exportBackup(state) {
  return JSON.stringify({ kind: "speech-therapy-studio:parent-learning", state: parseState(state) }, null, 2);
}
export function createLearningStore(storage) {
  let state = emptyState(),
    error = "";
  function load() {
    const raw = storage.getItem(KEY);
    if (raw === null) return emptyState();
    return parseState(JSON.parse(raw));
  }
  try {
    state = load();
  } catch {
    error = "Saved learning could not be read. New checkmarks will stay in this tab; download a backup before closing it.";
  }
  function update(change) {
    let next = structuredClone(state);
    if (!error) {
      try {
        next = load();
        next.active = state.active;
      } catch {
        error = "Saved learning could not be read. New checkmarks will stay in this tab; download a backup before closing it.";
      }
    }
    change(next);
    state = parseState(next);
    if (!error) {
      try {
        storage.setItem(KEY, JSON.stringify(state));
      } catch {
        error = "This browser could not save your learning. Keep this tab open and download a backup before closing it.";
      }
    }
  }
  return {
    get state() {
      return structuredClone(state);
    },
    get error() {
      return error;
    },
    select(profile) {
      if (!PROFILES.includes(profile)) throw Error("Unknown learner.");
      update((next) => {
        next.active = profile;
      });
    },
    visit(id) {
      if (!IDS.includes(id)) throw Error("Unknown lesson.");
      update((next) => {
        next.learners[next.active].last = id;
      });
    },
    mark(id, done) {
      if (!IDS.includes(id) || typeof done !== "boolean") throw Error("Invalid learning update.");
      update((next) => {
        const record = next.learners[next.active];
        record.done = done ? [...new Set([...record.done, id])] : record.done.filter((item) => item !== id);
      });
    },
    merge(backup) {
      const clean = parseState(backup);
      update((next) => {
        for (const p of PROFILES) next.learners[p].done = [...new Set([...next.learners[p].done, ...clean.learners[p].done])];
      });
    },
  };
}
