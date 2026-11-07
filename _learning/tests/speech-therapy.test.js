// Offline local storage, backup and authored-data checks. No provider or medical I/O.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createLearningStore, emptyState, exportBackup, IDS, KEY, parseBackup } from "../../speech-therapy-studio/model.js";
const data = JSON.parse(fs.readFileSync(new URL("../../speech-therapy-studio/lessons.json", import.meta.url)));
function memory() {
  const rows = new Map();
  return { getItem: (k) => rows.get(k) ?? null, setItem: (k, v) => rows.set(k, v), rows };
}

test("two parents keep independent learning after refresh and changes from another open tab", () => {
  const storage = memory();
  const a = createLearningStore(storage),
    b = createLearningStore(storage);
  a.mark("S01", true);
  b.select("fav");
  b.mark("S03", true);
  a.mark("S02", true);
  const refreshed = createLearningStore(storage);
  assert.deepEqual(refreshed.state.learners.ifeanyi.done, ["S01", "S02"]);
  assert.deepEqual(refreshed.state.learners.fav.done, ["S03"]);
  assert.equal(refreshed.state.active, "ifeanyi");
  a.mark("S01", false);
  assert.deepEqual(createLearningStore(storage).state.learners.fav.done, ["S03"]);
  assert.deepEqual(createLearningStore(storage).state.learners.ifeanyi.done, ["S02"]);
});
test("backup merge preserves both parents, the active learner and existing checkmarks", () => {
  const store = createLearningStore(memory());
  store.select("fav");
  store.mark("S05", true);
  const incoming = emptyState();
  incoming.learners.ifeanyi.done = ["S01"];
  incoming.learners.fav.done = ["S04"];
  store.merge(parseBackup(exportBackup(incoming)));
  assert.equal(store.state.active, "fav");
  assert.deepEqual(store.state.learners.fav.done, ["S05", "S04"]);
  assert.deepEqual(store.state.learners.ifeanyi.done, ["S01"]);
});
test("foreign, oversized or invalid backup is rejected before learning changes", () => {
  const store = createLearningStore(memory());
  store.mark("S01", true);
  const before = store.state;
  for (const value of [
    "{",
    "x".repeat(32001),
    JSON.stringify({ kind: "child-development-studio", state: emptyState() }),
    JSON.stringify({
      kind: "speech-therapy-studio:parent-learning",
      state: { ...emptyState(), learners: { ifeanyi: { done: ["<script>"], last: "S01" }, fav: { done: [], last: "S01" } } },
    }),
  ])
    assert.throws(() => parseBackup(value));
  assert.deepEqual(store.state, before);
});
test("unreadable or unwritable storage preserves raw data and keeps exportable tab learning", () => {
  const storage = memory();
  storage.setItem(KEY, "bad json");
  const store = createLearningStore(storage);
  store.mark("S01", true);
  assert.equal(storage.getItem(KEY), "bad json");
  assert.ok(store.error);
  assert.deepEqual(parseBackup(exportBackup(store.state)).learners.ifeanyi.done, ["S01"]);
  const full = createLearningStore({
    getItem: () => null,
    setItem() {
      throw Error("quota");
    },
  });
  full.mark("S02", true);
  full.select("fav");
  full.mark("S03", true);
  assert.deepEqual(full.state.learners.ifeanyi.done, ["S02"]);
  assert.deepEqual(full.state.learners.fav.done, ["S03"]);
  assert.ok(full.error);
});
test("every parent lesson has a closed prerequisite path, complete activity and resolvable free source", () => {
  const seen = new Set();
  assert.deepEqual(
    data.lessons.map((l) => l.id),
    IDS
  );
  for (const l of data.lessons) {
    assert.ok(
      l.prerequisites.every((id) => seen.has(id)),
      l.id
    );
    assert.ok(l.explain.length >= 3 && l.steps.length >= 4 && l.example.length >= 3, l.id);
    for (const field of ["goal", "materials", "quiet", "difficult", "avoid", "rehearsal", "rehearsalCheck"])
      assert.ok(l[field]?.length > 30, `${l.id}/${field}`);
    assert.ok(l.sources.length && l.sources.every((id) => data.sources[id]?.url.startsWith("https://")), l.id);
    assert.ok(!l.video || data.videos[l.video]?.time, l.id);
    assert.ok(l.check.answer >= 0 && l.check.answer < l.check.choices.length, l.id);
    seen.add(l.id);
  }
});
test("the app is a parent-learning workspace with no recording, child-notes form or cloud posting", () => {
  const source = fs.readFileSync(new URL("../../speech-therapy-studio/app.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /getUserMedia|MediaRecorder|<textarea|method:\s*["']POST|supabase/);
  assert.match(source, /no sign-in or cross-device sync/);
  const exportFields = JSON.parse(exportBackup(emptyState()));
  assert.deepEqual(Object.keys(exportFields.state.learners.ifeanyi).sort(), ["done", "last"]);
});

test("every activity is complete and all lesson, activity and source links resolve", () => {
  const ids = new Set(data.activities.map((a) => a.id));
  assert.equal(ids.size, 12);
  for (const a of data.activities) {
    assert.ok(a.lessons.length && a.lessons.every((id) => IDS.includes(id)), a.id);
    assert.ok(a.sources.length && a.sources.every((id) => data.sources[id]?.url.startsWith("https://")), a.id);
    assert.ok(a.words.length && a.steps.length >= 4 && a.example.length >= 4, a.id);
    assert.deepEqual(
      a.responses.map(([label]) => label),
      ["A point or gesture", "An unclear word or sound", "No reply", "No or turning away", "Frustration"]
    );
    for (const [, text] of a.responses) assert.ok(text.length > 30, a.id);
    for (const key of ["goal", "materials", "setup", "easier", "ending", "vary"]) assert.ok(a[key]?.length > 20, `${a.id}/${key}`);
    assert.ok(
      data.lessons.some((l) => l.activities.includes(a.id)),
      `${a.id} is discoverable from a lesson`
    );
  }
  for (const l of data.lessons) assert.ok(l.activities.length && l.activities.every((id) => ids.has(id)), l.id);
});

test("an idle tab exports fresh checkmarks without changing its selected learner", () => {
  const storage = memory();
  const a = createLearningStore(storage),
    b = createLearningStore(storage);
  a.select("fav");
  b.mark("S01", true);
  const backup = parseBackup(exportBackup(a.state));
  assert.deepEqual(backup.learners.ifeanyi.done, ["S01"]);
  assert.equal(a.state.active, "fav");
});
test("confirmed recovery keeps unreadable raw records and saves combined learning across reload", () => {
  const storage = memory();
  storage.setItem(KEY, "bad json");
  storage.setItem(`${KEY}:unreadable`, "older unreadable record");
  const store = createLearningStore(storage);
  store.select("fav");
  store.mark("S02", true);
  const backup = emptyState();
  backup.learners.ifeanyi.done = ["S01"];
  assert.equal(store.recover(backup), true);
  assert.equal(storage.getItem(`${KEY}:unreadable`), "older unreadable record");
  assert.equal(storage.getItem(`${KEY}:unreadable:1`), "bad json");
  const refreshed = createLearningStore(storage);
  assert.equal(refreshed.error, "");
  assert.equal(refreshed.state.active, "fav");
  assert.deepEqual(refreshed.state.learners.fav.done, ["S02"]);
  assert.deepEqual(refreshed.state.learners.ifeanyi.done, ["S01"]);
});
test("failed recovery reports unsaved learning, keeps the raw record and can be retried", () => {
  const base = memory();
  base.setItem(KEY, "bad json");
  let deny = true;
  const storage = {
    getItem: base.getItem,
    setItem(key, value) {
      if (key === KEY && deny) throw Error("quota");
      base.setItem(key, value);
    },
  };
  const store = createLearningStore(storage),
    backup = emptyState();
  backup.learners.ifeanyi.done = ["S03"];
  assert.equal(store.recover(backup), false);
  assert.match(store.error, /could not save/);
  assert.equal(storage.getItem(KEY), "bad json");
  assert.equal(storage.getItem(`${KEY}:unreadable`), "bad json");
  assert.deepEqual(parseBackup(exportBackup(store.state)).learners.ifeanyi.done, ["S03"]);
  deny = false;
  assert.equal(store.recover(backup), true);
  assert.equal(storage.getItem(`${KEY}:unreadable:1`), null);
  assert.deepEqual(createLearningStore(storage).state.learners.ifeanyi.done, ["S03"]);
});
test("each tab retains its learner through interleaved writes and reload", () => {
  const storage = memory(),
    tabA = memory(),
    tabB = memory();
  const a = createLearningStore(storage, tabA),
    b = createLearningStore(storage, tabB);
  b.select("fav");
  a.mark("S01", true);
  const reloadedB = createLearningStore(storage, tabB);
  assert.equal(reloadedB.state.active, "fav");
  reloadedB.mark("S02", true);
  const reloadedA = createLearningStore(storage, tabA);
  assert.equal(reloadedA.state.active, "ifeanyi");
  assert.deepEqual(reloadedA.state.learners.ifeanyi.done, ["S01"]);
  assert.deepEqual(reloadedA.state.learners.fav.done, ["S02"]);
});
test("blocked tab storage warns about selection without blocking saved learning", () => {
  const storage = memory();
  const tab = {
    getItem() {
      throw Error("blocked");
    },
    setItem() {
      throw Error("blocked");
    },
  };
  const store = createLearningStore(storage, tab);
  store.select("fav");
  assert.equal(store.mark("S04", true), true);
  assert.equal(store.error, "");
  assert.match(store.profileWarning, /Check the name/);
  assert.deepEqual(createLearningStore(storage).state.learners.fav.done, ["S04"]);
});
test("unreadable and foreign backups produce plain user messages", () => {
  assert.throws(() => parseBackup("{"), /could not be read as a learning backup/);
  assert.throws(() => parseBackup("null"), /not a Speech Therapy Studio learning backup/);
});
