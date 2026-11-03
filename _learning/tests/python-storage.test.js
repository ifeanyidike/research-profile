// Isolated local stores and mocked Supabase account I/O only.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createModel } from "../../learning-studio/model.js";
import { Account } from "../../learning-studio/account.js";
import { renderProse } from "../../learning-studio/prose.js";
import { createCodeWorkspace } from "../../learning-studio/code-workspace.js";
const definitions = JSON.parse(fs.readFileSync(new URL("../../voice-ai-studio/python-workspaces.json", import.meta.url)));
const ids = new Set(Object.keys(definitions.editors));
const model = createModel("voice-ai-studio", { codeOnly: true });
const memory = () => {
  const rows = new Map();
  return { getItem: (k) => rows.get(k) ?? null, setItem: (k, v) => rows.set(k, v) };
};
test("a new learner can restore a Python backup before saving any code", () => {
  const workspace = createCodeWorkspace({ storage: memory(), definitions, parentAccount: () => ({}), runner: { stop() {} } });
  workspace.select(null, "ifeanyi");
  const html = workspace.notebook();
  assert.ok(html.includes("No saved code yet"));
  assert.ok(html.includes('id="import-python"'));
});
test("saved code is separate by account, guest learner, editor and progress backup", () => {
  const db = memory();
  const get = model.workspaceStores(db, ids, () => 100);
  get("account:A").update("ifeanyi", "V02:example", { code: 'print("A")' });
  get("guest").update("partner", "V02:example", { code: 'print("Fav")' });
  get("guest").update("ifeanyi", "V02:milliseconds", { code: "" });
  assert.equal(get("account:B").record("ifeanyi", "V02:example").values.code, undefined);
  assert.equal(get("guest").record("ifeanyi", "V02:example").values.code, undefined);
  assert.equal(get("guest").record("ifeanyi", "V02:milliseconds").values.code, "");
  const restored = model.workspaceStores(db, ids, () => 200)("account:A");
  assert.equal(restored.record("ifeanyi", "V02:example").values.code, 'print("A")');
  const backup = restored.exportBackup("ifeanyi", "A");
  assert.equal(backup.kind, "voice-ai-studio-python-code");
  assert.throws(() => createModel("voice-ai-studio").parseBackup(JSON.stringify(backup), new Set(["V02"])));
  assert.throws(() => model.validateRecord({ values: { notes: "x" }, changed: { notes: 1 } }));
  assert.throws(() => model.validateRecord({ values: { code: "x".repeat(20001) }, changed: { code: 1 } }));
});
test("separate editor rows round-trip through the existing account sync without touching progress", async () => {
  const remote = new Map();
  const client = {
    from: (table) => {
      assert.equal(table, "voice_ai_code");
      return {
        select: () => ({ eq: async () => ({ data: [...remote].map(([lesson_id, record]) => ({ lesson_id, record })), error: null }) }),
        upsert: (rows) => ({
          select: async () => {
            for (const r of rows) remote.set(r.lesson_id, model.mergeRecords(remote.get(r.lesson_id) || { values: {}, changed: {} }, r.record));
            return { data: rows.map((r) => ({ ...r, record: remote.get(r.lesson_id) })), error: null };
          },
        }),
      };
    },
  };
  const make = (stamp) => {
    const store = model.workspaceStores(memory(), ids, () => stamp)("account:A");
    const a = new Account({
      client,
      ids,
      table: "voice_ai_code",
      kind: "voice-ai-studio-python-code",
      model,
      store: () => store,
      switchUser: () => {},
      status: () => {},
      changed: () => {},
    });
    return { a, store };
  };
  const first = make(100),
    second = make(200);
  first.store.update("ifeanyi", "V02:example", { code: "a=1" });
  await first.a.select({ id: "A" });
  await second.a.select({ id: "A" });
  assert.equal(second.store.record("ifeanyi", "V02:example").values.code, "a=1");
  first.store.update("ifeanyi", "V02:milliseconds", { code: "print(500)" });
  second.store.update("ifeanyi", "V02:example", { code: "a=2" });
  await second.a.sync();
  await first.a.sync();
  assert.equal(first.store.record("ifeanyi", "V02:example").values.code, "a=2");
  assert.equal(remote.get("V02:milliseconds").values.code, "print(500)");
});
test("worked cells and lesson practice workspaces have stable unique IDs and fenced code uses the matching identity", () => {
  assert.equal(ids.size, 53);
  assert.equal(Object.values(definitions.editors).filter((d) => d.editor !== "practice").length, 9);
  for (const [key, d] of Object.entries(definitions.editors)) {
    assert.equal(key, d.lesson + ":" + d.editor);
    assert.ok(d.code);
  }
  const html = renderProse("```python id=milliseconds\nprint(500)\n```");
  assert.ok(html.includes('data-code-id="milliseconds"'));
  assert.ok(html.includes('data-code-action="run"'));
});
