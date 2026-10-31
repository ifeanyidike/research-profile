// Offline only: the real pure model, fixed clocks and in-memory Web Storage.
import test from "node:test";
import assert from "node:assert/strict";
import { createModel } from "../../learning-studio/model.js";

for (const slug of ["cyber-studio", "voice-ai-studio", "child-development-studio"]) {
  const model = createModel(slug),
    id = slug === "cyber-studio" ? "O01" : slug === "voice-ai-studio" ? "V01" : "C01",
    ids = new Set([id]);
  const backup = (record) => ({ kind: slug + "-progress", version: 1, profile: { id: "ifeanyi", name: "Test" }, lessons: { [id]: record } });
  test(`${slug}: a partial storage failure cannot save a pass without its recall schedule`, () => {
    const rows = new Map();
    let writes = 0;
    const db = {
      getItem: (key) => rows.get(key) ?? null,
      setItem(key, value) {
        if (++writes > 1) throw Error("quota reached");
        rows.set(key, value);
      },
    };
    model.createStore(db, ids, () => 100).pass("ifeanyi", id);
    const persisted = model.createStore(db, ids, () => 100).record("ifeanyi", id).values;
    assert.equal(persisted.passedAt, 100);
    assert.equal(persisted.reviewStage, 0);
    assert.equal(persisted.reviewAt, 100 + 2 * 86400000);
  });
  for (const operation of ["update", "import"]) {
    test(`${slug}: interleaved ${operation} preserves an independent tab edit after reload/export`, () => {
      const rows = new Map();
      let interleave;
      const db = {
        getItem: (k) => rows.get(k) ?? null,
        setItem: (k, v) => {
          if (interleave) {
            const action = interleave;
            interleave = null;
            action();
          }
          rows.set(k, v);
        },
      };
      const a = model.createStore(db, ids, () => 100),
        b = model.createStore(db, ids, () => 101);
      // B commits after A has computed its write, before A's setItem commits.
      interleave = () => b.update("ifeanyi", id, { practice: true });
      if (operation === "update") a.update("ifeanyi", id, { notes: "Tab A note" });
      else a.importBackup("ifeanyi", backup({ values: { notes: "Tab A note" }, changed: { notes: 100 } }));
      const fresh = model.createStore(db, ids, () => 102);
      for (const store of [a, b, fresh]) {
        const record = store.exportBackup("ifeanyi", "Test").lessons[id];
        assert.deepEqual(record.values, { practice: true, notes: "Tab A note" });
        assert.equal(record.changed.practice, 101);
        assert.equal(record.changed.notes, 100);
      }
    });
  }
  test(`${slug}: legacy aggregate and field edits merge without rewriting legacy data or losing quota drafts`, () => {
    const rows = new Map(),
      legacyKey = model.PREFIX + "guest:ifeanyi:" + id;
    const legacy = JSON.stringify({ values: { read: true, notes: "Legacy" }, changed: { read: 10, notes: 10 } });
    rows.set(legacyKey, legacy);
    let full = false;
    const statuses = [];
    const db = {
      getItem: (k) => rows.get(k) ?? null,
      setItem: (k, v) => {
        if (full) throw Error("quota");
        rows.set(k, v);
      },
    };
    const store = model.createStore(
      db,
      ids,
      () => 20,
      (ok) => statuses.push(ok)
    );
    store.update("ifeanyi", id, { notes: "New note" });
    assert.equal(rows.get(legacyKey), legacy);
    // A still-open old version can update its aggregate; untouched fields survive.
    rows.set(
      legacyKey,
      JSON.stringify({ values: { read: true, notes: "Legacy", evidence: "Old tab evidence" }, changed: { read: 10, notes: 10, evidence: 21 } })
    );
    assert.deepEqual(store.record("ifeanyi", id).values, { read: true, notes: "New note", evidence: "Old tab evidence" });
    full = true;
    store.update("ifeanyi", id, { notes: "Memory draft", practice: true });
    assert.equal(statuses.at(-1), false);
    const recovered = store.exportBackup("ifeanyi", "Test");
    assert.equal(recovered.lessons[id].values.notes, "Memory draft");
    assert.equal(recovered.lessons[id].values.practice, true);
    assert.equal(recovered.lessons[id].values.evidence, "Old tab evidence");
    assert.equal(model.createStore(db, ids).record("partner", id).values.notes, undefined);
  });
}
