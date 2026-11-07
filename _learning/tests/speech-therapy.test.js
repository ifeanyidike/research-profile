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
