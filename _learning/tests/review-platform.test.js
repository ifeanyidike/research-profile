// Offline integration: actual stores/controllers; auth and database are mocked only at I/O.
import test from "node:test";
import assert from "node:assert/strict";
import { createModel } from "../../learning-studio/model.js";
import { Account } from "../../learning-studio/account.js";
import { createAuthStorage } from "../../learning-studio/auth-storage.js";
import { createTextEditor } from "../../learning-studio/text-fields.js";
const memory = () => {
  const data = new Map();
  return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v), removeItem: (k) => data.delete(k) };
};
for (const slug of ["cyber-studio", "voice-ai-studio", "child-development-studio"]) {
  const id = slug === "cyber-studio" ? "O01" : slug === "voice-ai-studio" ? "V01" : "C01";
  const model = createModel(slug),
    ids = new Set([id]);
  test(`${slug}: remote notes are reconciled in place and stale typing cannot overwrite them`, () => {
    const store = model.createStore(memory(), ids, () => 100);
    store.update("ifeanyi", id, { notes: "A" });
    const read = () => {
      const r = store.record("ifeanyi", id);
      return { value: r.values.notes, changed: r.changed.notes };
    };
    const editor = createTextEditor({ read, write: (value) => store.update("ifeanyi", id, { notes: value }) });
    store.importBackup("ifeanyi", {
      kind: slug + "-progress",
      version: 1,
      profile: { id: "ifeanyi", name: "A" },
      lessons: { [id]: { values: { notes: "AB" }, changed: { notes: 200 } } },
    });
    assert.equal(editor.input("AC"), false);
    assert.equal(store.record("ifeanyi", id).values.notes, "AB");
    assert.equal(editor.value, "AC");
    editor.useSaved();
    assert.equal(editor.value, "AB");
    assert.equal(editor.input("ABC"), true);
    assert.equal(store.record("ifeanyi", id).values.notes, "ABC");
    store.update("ifeanyi", id, { notes: "Other device" });
    editor.refresh("ABC");
    assert.equal(editor.value, "Other device");
  });
  test(`${slug}: backup merge reports older differences and selected restoration creates a new winning edit`, () => {
    const store = model.createStore(memory(), ids, () => 100);
    store.update("ifeanyi", id, { notes: "Keep me", practice: true });
    const backup = store.exportBackup("ifeanyi", "A");
    store.update("ifeanyi", id, { notes: "" });
    const merged = store.importBackup("ifeanyi", backup);
    assert.equal(merged.applied, 0);
    assert.equal(merged.older.length, 1);
    assert.equal(merged.older[0].field, "notes");
    store.restoreFields("ifeanyi", merged.older);
    const restored = store.record("ifeanyi", id);
    assert.equal(restored.values.notes, "Keep me");
    assert.equal(restored.values.practice, true);
    assert.equal(model.mergeRecords({ values: { notes: "" }, changed: { notes: 102 } }, restored).values.notes, "Keep me");
    assert.throws(() => store.restoreFields("ifeanyi", merged.older), /changed since this preview/);
  });
}
function setup(slug = "voice-ai-studio") {
  const db = memory(),
    model = createModel(slug),
    ids = new Set(["V01"]),
    get = model.workspaceStores(db, ids, () => 100),
    authStorage = createAuthStorage(db, slug),
    notices = [];
  let store = get("guest"),
    changes = 0;
  const client = {
    auth: {
      onAuthStateChange() {},
      getSession: async () => ({ data: { session: null }, error: null }),
      signOut: async () => ({ error: null }),
      dispose: async () => {},
    },
    from: () => ({
      select: () => ({ eq: async () => ({ data: [], error: null }) }),
      upsert: (rows) => ({ select: async () => ({ data: rows, error: null }) }),
    }),
  };
  const a = new Account({
    client,
    ids,
    model,
    table: "voice_ai_progress",
    kind: slug + "-progress",
    authStorage,
    switchUser: (u) => {
      store = get(u ? "account:" + u.id : "guest");
    },
    store: () => store,
    status: (s) => notices.push(s),
    changed: () => changes++,
  });
  return { a, db, model, authStorage, notices, store: () => store, changes: () => changes };
}
test("expired-session refresh outage keeps account cache, starts timer, and device logout clears auth without a network request", async (t) => {
  const x = setup();
  let ticks = 0,
    reloads = 0;
  t.mock.method(globalThis, "setInterval", () => {
    ticks++;
    return {};
  });
  x.db.setItem(
    x.authStorage.key,
    JSON.stringify({ access_token: "fixture", refresh_token: "fixture", expires_at: 1, user: { id: "a", email: "a@example.test" } })
  );
  x.a.client.auth.getSession = async () => ({ data: { session: null }, error: { name: "AuthRetryableFetchError", message: "offline" } });
  x.a.client.auth.signOut = async () => {
    throw Error("device-only logout must not wait on network");
  };
  x.a.reload = () => reloads++;
  await x.a.start();
  assert.equal(x.a.user.id, "a");
  assert.equal(x.a.offline, true);
  assert.equal(ticks, 1);
  x.store().update("ifeanyi", "V01", { notes: "Offline account note" });
  await x.a.signOut({ force: true });
  assert.equal(x.a.user, null);
  assert.equal(x.db.getItem(x.authStorage.key), null);
  assert.equal(x.authStorage.cachedUser(), null);
  assert.equal(reloads, 1);
  assert.equal(
    x.model
      .createStore(
        x.db,
        new Set(["V01"]),
        () => 100,
        () => {},
        "account:a"
      )
      .record("ifeanyi", "V01").values.notes,
    "Offline account note"
  );
  await x.a.select({ id: "a" });
  assert.equal(x.a.user, null, "late refresh must not restore a signed-out account");
});
test("an edit made while a read is pending is not announced as a remote change; idle syncs stay quiet", async () => {
  const x = setup();
  await x.a.select({ id: "a" });
  let release;
  x.a.client.from = () => ({
    select: () => ({ eq: () => new Promise((r) => (release = r)) }),
    upsert: (rows) => ({ select: async () => ({ data: rows, error: null }) }),
  });
  const pending = x.a.sync();
  x.store().update("ifeanyi", "V01", { notes: "Typed while fetching" });
  release({ data: [], error: null });
  await pending;
  assert.equal(x.changes(), 0);
  x.a.client.from = () => ({
    select: () => ({ eq: async () => ({ data: [{ lesson_id: "V01", record: x.store().record("ifeanyi", "V01") }], error: null }) }),
  });
  const count = x.notices.length;
  await x.a.sync();
  await x.a.sync();
  assert.equal(x.notices.length, count);
});
test("SDK may return a logout error after already removing the local session", async () => {
  const x = setup();
  await x.a.select({ id: "a" });
  x.db.setItem(x.authStorage.key, "session");
  x.a.client.auth.signOut = async () => {
    x.db.removeItem(x.authStorage.key);
    return { error: Error("server revocation unavailable") };
  };
  await x.a.signOut();
  assert.equal(x.a.user, null);
  assert.equal(x.authStorage.cachedUser(), null);
});
