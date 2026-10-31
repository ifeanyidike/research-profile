// Actual stores/account controller; external database I/O is mocked and never run.
import test from "node:test";
import assert from "node:assert/strict";
import { createModel } from "../../learning-studio/model.js";
import { Account } from "../../learning-studio/account.js";
import { storageListener } from "../../learning-studio/storage-events.js";
import { progressActions } from "../../learning-studio/progress-actions.js";
import { createTextEditor } from "../../learning-studio/text-fields.js";
const memory = () => {
  const data = new Map();
  return { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
};
for (const slug of ["cyber-studio", "voice-ai-studio", "child-development-studio"]) {
  const model = createModel(slug),
    ids = new Set(["A01", "A02"]);
  const backup = (lessons) => ({ kind: slug + "-progress", version: 1, profile: { id: "ifeanyi", name: "Test" }, lessons });
  test(`${slug}: invalid new Unicode drafts are rejected while legacy text remains recoverable`, () => {
    for (const text of ["normal 😀 العربية", "\\u0000", "line one\nline two"]) assert.equal(model.syncableText(text), true);
    for (const bad of ["a\u0000b", "\ud800", "\udc00"]) {
      const store = model.createStore(memory(), ids, () => 100);
      assert.throws(() => store.update("ifeanyi", "A01", { notes: bad }), /A01\/notes.*null characters/);
      const result = store.importBackup("ifeanyi", backup({ A01: { values: { notes: bad }, changed: { notes: 200 } } }));
      assert.deepEqual(result.held, [{ id: "A01", field: "notes" }]);
      assert.equal(store.exportBackup("ifeanyi", "Test").lessons.A01.values.notes, bad);
      store.update("ifeanyi", "A01", { practice: true });
      assert.equal(store.record("ifeanyi", "A01").values.notes, bad);
      store.update("ifeanyi", "A01", { notes: "Repaired explicitly" });
    }
  });
  test(`${slug}: backup file dates are bounded without making a legacy timestamp block unrelated fields`, () => {
    const ceiling = Date.UTC(9999, 11, 31, 23, 59, 59, 999),
      max = 8640000000000000;
    const data = backup({ A01: { values: { notes: "Legacy" }, changed: { notes: max } } });
    assert.throws(() => model.parseBackup(JSON.stringify(data), ids, { fromFile: true }), /A01\/notes.*far-future/);
    assert.doesNotThrow(() => model.parseBackup(JSON.stringify(data), ids), "sync/read compatibility is preserved");
    data.lessons.A01.changed.notes = ceiling;
    assert.throws(() => model.parseBackup(JSON.stringify(data), ids, { fromFile: true }), /far-future/);
    const store = model.createStore(memory(), ids, () => 100);
    data.lessons.A01.changed.notes = max;
    store.importBackup("ifeanyi", data);
    store.update("ifeanyi", "A01", { practice: true });
    assert.equal(store.record("ifeanyi", "A01").values.practice, true);
    assert.throws(() => store.update("ifeanyi", "A01", { notes: "Cannot outrank max" }), /A01\/notes.*supported limit/);
  });
  test(`${slug}: restore validates every selected update before changing the first lesson`, () => {
    const store = model.createStore(memory(), ids, () => 100);
    store.importBackup(
      "ifeanyi",
      backup({
        A01: { values: { notes: "First unchanged" }, changed: { notes: 100 } },
        A02: { values: { notes: "Terminal date" }, changed: { notes: 8640000000000000 } },
      })
    );
    const selections = ["A01", "A02"].map((id) => ({
      id,
      field: "notes",
      current: store.record("ifeanyi", id).values.notes,
      changed: store.record("ifeanyi", id).changed.notes,
      value: "Restore",
    }));
    assert.throws(() => store.restoreFields("ifeanyi", selections), /A02\/notes.*supported limit/);
    assert.equal(store.record("ifeanyi", "A01").values.notes, "First unchanged");
    assert.equal(store.record("ifeanyi", "A01").changed.notes, 100);
  });
  test(`${slug}: freeing storage retries memory-only notes and never overwrites a newer tab value`, () => {
    for (const otherTab of [false, true]) {
      const db = memory(),
        original = db.setItem;
      let full = true;
      db.setItem = (key, value) => {
        if (full) throw Error("quota");
        original(key, value);
      };
      const a = model.createStore(db, ids, () => 100);
      a.update("ifeanyi", "A01", { notes: "Memory note" });
      full = false;
      if (otherTab) model.createStore(db, ids, () => 200).update("ifeanyi", "A01", { notes: "Newer tab note" });
      a.update("ifeanyi", "A01", { practice: true });
      const persisted = model.createStore(db, ids).record("ifeanyi", "A01").values;
      assert.equal(persisted.notes, otherTab ? "Newer tab note" : "Memory note");
      assert.equal(persisted.practice, true);
    }
  });
  test(`${slug}: one unsyncable field cannot block another lesson or replace the server's good text`, async () => {
    const db = memory(),
      get = model.workspaceStores(db, ids, () => 300),
      server = new Map();
    let store,
      writes = 0;
    const statuses = [];
    server.set("A01", { values: { notes: "Server text" }, changed: { notes: 100 } });
    const local = get("account:a");
    local.importBackup(
      "ifeanyi",
      backup({
        A01: { values: { notes: "Bad\u0000text" }, changed: { notes: 200 } },
        A02: { values: { practice: true }, changed: { practice: 200 } },
      })
    );
    const account = new Account({
      client: {
        from: () => ({
          select: () => ({ eq: async () => ({ data: [...server].map(([lesson_id, record]) => ({ lesson_id, record })), error: null }) }),
          upsert: (rows) => ({
            select: async () => {
              writes++;
              // Model the actual bulk JSONB boundary: any bad row rejects the batch.
              if (rows.some((r) => Object.values(r.record.values).some((v) => typeof v === "string" && !model.syncableText(v))))
                return { data: [], error: Error("JSONB rejected entire statement") };
              for (const row of rows)
                server.set(row.lesson_id, model.mergeRecords(server.get(row.lesson_id) || { values: {}, changed: {} }, row.record));
              return { data: rows.map((r) => ({ lesson_id: r.lesson_id, record: server.get(r.lesson_id) })), error: null };
            },
          }),
        }),
      },
      ids,
      model,
      table: "offline_test",
      kind: slug + "-progress",
      switchUser: (user) => {
        store = get(user ? "account:" + user.id : "guest");
      },
      store: () => store,
      status: (s) => statuses.push(s),
      changed: () => {},
    });
    await account.select({ id: "a" });
    assert.equal(server.get("A02").values.practice, true);
    assert.equal(server.get("A01").values.notes, "Server text");
    assert.equal(local.record("ifeanyi", "A01").values.notes, "Bad\u0000text");
    assert.match(statuses.at(-1), /A01\/notes/);
    assert.equal(account.syncError, true);
    await account.sync();
    assert.equal(writes, 1, "held text must not cause repeated empty uploads");
    local.update("ifeanyi", "A01", { notes: "Repaired explicitly" });
    await account.sync();
    assert.equal(server.get("A01").values.notes, "Repaired explicitly");
    assert.equal(account.syncError, false);
  });
}
test("500 matching storage events coalesce once and unrelated workspaces trigger nothing", () => {
  const scheduled = [];
  let refreshes = 0,
    scope = "studio:v1:guest:";
  const listener = storageListener(
    () => scope,
    () => refreshes++,
    (callback) => scheduled.push(callback)
  );
  for (let i = 0; i < 500; i++) listener({ key: scope + "ifeanyi:A01:field:notes" });
  listener({ key: "other-studio:v1:guest:ifeanyi:A01" });
  assert.equal(scheduled.length, 1);
  scheduled.shift()();
  assert.equal(refreshes, 1);
  scope = "studio:v1:account:b:";
  listener({ key: "studio:v1:account:a:ifeanyi:A01:field:notes" });
  assert.equal(scheduled.length, 0);
});
test("progress actions revert failed controls and report errors without swallowing the editor's save contract", () => {
  const reports = [];
  let checked = true;
  const action = progressActions((message) => reports.push(message));
  assert.equal(
    action(
      () => {
        throw Error("Cannot save A01/read");
      },
      () => {
        checked = false;
      }
    ),
    false
  );
  assert.equal(checked, false);
  assert.deepEqual(reports, ["Cannot save A01/read"]);
  assert.equal(
    action(() => {
      checked = true;
    }),
    true
  );
  assert.equal(checked, true);
});
test("a validation-error draft keeps its error through background reconciliation until explicit repair", () => {
  let saved = { value: "Original", changed: 100 };
  const editor = createTextEditor({
    read: () => saved,
    write: () => {
      throw Error("Invalid text");
    },
  });
  assert.throws(() => editor.input("Bad\u0000text"), /Invalid text/);
  editor.refresh("Bad\u0000text");
  assert.equal(editor.value, "Bad\u0000text");
  assert.equal(editor.error, "Invalid text");
  const restored = createTextEditor({ read: () => saved, write: () => {}, draft: editor.value, base: editor.base, error: editor.error });
  assert.equal(restored.error, "Invalid text");
  restored.useSaved();
  assert.equal(restored.value, "Original");
  assert.equal(restored.error, "");
});
