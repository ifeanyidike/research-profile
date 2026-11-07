// Adult learning checkmarks only. No child observations, recordings or diagnosis.
export const KEY = "speech-therapy-studio:parent-learning:v1";
export const ACTIVE_KEY = `${KEY}:active`;
export const RECOVERY_KEY = `${KEY}:unreadable`;
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
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw Error("This file could not be read as a learning backup. Choose the JSON backup downloaded from this studio.");
  }
  if (data?.kind !== "speech-therapy-studio:parent-learning") throw Error("This file is not a Speech Therapy Studio learning backup.");
  return parseState(data.state);
}
export function exportBackup(state) {
  return JSON.stringify({ kind: "speech-therapy-studio:parent-learning", state: parseState(state) }, null, 2);
}
function combine(into, incoming) {
  for (const p of PROFILES) into.learners[p].done = [...new Set([...into.learners[p].done, ...incoming.learners[p].done])];
  return into;
}
export function createLearningStore(storage, tabStorage = null) {
  let state = emptyState(),
    error = "",
    profileWarning = "";
  const readError =
    "Saved learning could not be read. New checkmarks will stay in this tab; download a backup before closing it. Use Guidance for recovery options.";
  const writeError =
    "This browser could not save your learning. Keep this tab open and download a backup before closing it. Use Guidance for recovery options.";
  function load() {
    const raw = storage.getItem(KEY);
    return raw === null ? emptyState() : parseState(JSON.parse(raw));
  }
  function saveProfile() {
    if (!tabStorage) return;
    try {
      tabStorage.setItem(ACTIVE_KEY, state.active);
      profileWarning = "";
    } catch {
      profileWarning = "Your learner choice may reset on reload. Check the name at the top before marking a lesson.";
    }
  }
  try {
    state = load();
  } catch {
    error = readError;
  }
  if (tabStorage) {
    try {
      const active = tabStorage.getItem(ACTIVE_KEY);
      if (PROFILES.includes(active)) state.active = active;
      saveProfile();
    } catch {
      profileWarning = "Your learner choice may reset on reload. Check the name at the top before marking a lesson.";
    }
  }
  function refresh() {
    if (error) return;
    try {
      const next = load();
      next.active = state.active;
      state = next;
    } catch {
      error = readError;
    }
  }
  function update(change) {
    refresh();
    const next = structuredClone(state);
    change(next);
    state = parseState(next);
    if (!error) {
      try {
        storage.setItem(KEY, JSON.stringify(state));
      } catch {
        error = writeError;
      }
    }
    return !error;
  }
  return {
    get state() {
      refresh();
      return structuredClone(state);
    },
    get error() {
      return error;
    },
    get profileWarning() {
      return profileWarning;
    },
    select(profile) {
      if (!PROFILES.includes(profile)) throw Error("Unknown learner.");
      const saved = update((next) => {
        next.active = profile;
      });
      saveProfile();
      return saved;
    },
    visit(id) {
      if (!IDS.includes(id)) throw Error("Unknown lesson.");
      return update((next) => {
        next.learners[next.active].last = id;
      });
    },
    mark(id, done) {
      if (!IDS.includes(id) || typeof done !== "boolean") throw Error("Invalid learning update.");
      return update((next) => {
        const record = next.learners[next.active];
        record.done = done ? [...new Set([...record.done, id])] : record.done.filter((item) => item !== id);
      });
    },
    merge(backup) {
      const clean = parseState(backup);
      return update((next) => combine(next, clean));
    },
    recover(backup) {
      // Called only after the recovery preview's explicit confirmation.
      let next = combine(structuredClone(state), parseState(backup));
      try {
        const raw = storage.getItem(KEY);
        let saved;
        try {
          saved = raw === null ? emptyState() : parseState(JSON.parse(raw));
        } catch {
          saved = emptyState();
          // Keep every distinct unreadable value; retries reuse its archive.
          let key = RECOVERY_KEY,
            copy = 0,
            previous = storage.getItem(key);
          while (previous !== null && previous !== raw) {
            key = `${RECOVERY_KEY}:${++copy}`;
            previous = storage.getItem(key);
          }
          if (previous === null) storage.setItem(key, raw);
        }
        next = combine(next, saved);
        storage.setItem(KEY, JSON.stringify(next));
        state = next;
        error = "";
        return true;
      } catch {
        state = next;
        error = writeError;
        return false;
      }
    },
  };
}
