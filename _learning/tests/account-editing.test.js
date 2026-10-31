// Real stores/controllers/editors; auth, time and database boundaries are local mocks.
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
const user = (id, name = id) => ({ id, email: `${id}@example.test`, user_metadata: { studio_display_name: name } });
const session = (u) => JSON.stringify({ access_token: "fixture", refresh_token: "fixture", expires_at: 1, user: u });
const deferred = () => {
  let resolve;
  const promise = new Promise((r) => (resolve = r));
  return { promise, resolve };
};
const settle = () => new Promise((r) => setImmediate(r));
function setup(slug, db = memory()) {
  const model = createModel(slug),
    ids = new Set(["A01"]),
    get = model.workspaceStores(db, ids, () => 300),
    notices = [],
    switches = [],
    identities = [],
    clients = [];
  let store = get("guest"),
    remote = [],
    reads = 0,
    uploads = [],
    read = async () => ({ data: remote, error: null });
  const connection = () => {
    const authStorage = createAuthStorage(db, slug),
      callbacks = [];
    const client = {
      auth: {
        onAuthStateChange: (fn) => callbacks.push(fn),
        getSession: async () => ({ data: { session: authStorage.cachedUser() ? { user: authStorage.cachedUser() } : null }, error: null }),
        dispose: async () => {},
        signOut: async () => {
          authStorage.removeItem(authStorage.key);
          return { error: null };
        },
      },
      from: () => ({
        select: () => ({
          eq: () => {
            reads++;
            return read();
          },
        }),
        upsert: (rows) => ({
          select: async () => {
            uploads.push(rows);
            remote = rows.map(({ lesson_id, record }) => ({ lesson_id, record }));
            return { data: remote, error: null };
          },
        }),
      }),
    };
    clients.push({ client, authStorage, callbacks });
    return { client, authStorage };
  };
  const a = new Account({
    ...connection(),
    restartClient: connection,
    ids,
    model,
    table: "fixture",
    kind: slug + "-progress",
    switchUser: (u) => {
      switches.push(u);
      store = get(u ? "account:" + u.id : "guest");
    },
    store: () => store,
    status: (s) => notices.push(s),
    changed: () => {},
    identity: (u) => identities.push(u),
  });
  return {
    a,
    db,
    model,
    clients,
    notices,
    switches,
    identities,
    store: () => store,
    read: (fn) => (read = fn),
    remote: (rows) => (remote = rows),
    reads: () => reads,
    uploads: () => uploads,
  };
}
for (const slug of ["cyber-studio", "voice-ai-studio", "child-development-studio"]) {
  test(`${slug}: an edit before the account read cannot outrank another device's saved note`, async () => {
    const x = setup(slug);
    await x.a.select(user("a"));
    x.store().importBackup("ifeanyi", {
      kind: slug + "-progress",
      version: 1,
      profile: { id: "ifeanyi", name: "A" },
      lessons: { A01: { values: { notes: "A" }, changed: { notes: 100 } } },
    });
    const held = deferred();
    x.read(() => held.promise);
    const read = () => {
      const r = x.store().record("ifeanyi", "A01");
      return { value: r.values.notes, changed: r.changed.notes };
    };
    const editor = createTextEditor({
      read,
      write: (notes) => {
        x.store().update("ifeanyi", "A01", { notes });
      },
      canSave: () => x.a.textConfirmed,
    });
    x.a.confirmed = () => editor.refresh();
    const sync = x.a.sync({ reconfirm: true });
    assert.equal(editor.input("AC"), false);
    assert.equal(read().value, "A");
    held.resolve({ data: [{ lesson_id: "A01", record: { values: { notes: "AB" }, changed: { notes: 200 } } }], error: null });
    await sync;
    assert.equal(editor.value, "AC");
    assert.equal(read().value, "AB");
    assert.equal(x.uploads().length, 0);
    assert.equal(editor.keepDraft(), true);
    await x.a.sync();
    assert.equal(x.uploads().at(-1)[0].record.values.notes, "AC");
  });
  test(`${slug}: unchanged remote text releases a waiting draft; failed reads never stamp it`, async () => {
    for (const failed of [false, true]) {
      const x = setup(slug);
      await x.a.select(user("a"));
      const held = deferred();
      x.read(() => held.promise);
      const read = () => {
        const r = x.store().record("ifeanyi", "A01");
        return { value: r.values.notes || "", changed: r.changed.notes };
      };
      const editor = createTextEditor({ read, canSave: () => x.a.textConfirmed, write: (notes) => x.store().update("ifeanyi", "A01", { notes }) });
      x.a.confirmed = () => editor.refresh();
      const sync = x.a.sync({ reconfirm: true });
      assert.equal(editor.input("A pending draft"), false);
      assert.match(editor.error, /account check/);
      held.resolve({ data: [], error: failed ? Error("offline") : null });
      await sync;
      assert.equal(editor.value, "A pending draft");
      assert.equal(read().value, failed ? "" : "A pending draft");
      assert.equal(x.uploads().length, failed ? 0 : 1);
      assert.equal(editor.waiting, failed);
    }
  });
}
test("offline startup selects the SDK session before refresh settles; recovery sends full identity without a workspace redraw", async (t) => {
  t.mock.method(globalThis, "setInterval", () => ({}));
  const x = setup("voice-ai-studio"),
    held = deferred();
  x.db.setItem(x.a.authStorage.accountKey, JSON.stringify(user("wrong")));
  x.db.setItem(x.a.authStorage.key, session(user("a", "Cached name")));
  x.a.client.auth.getSession = () => held.promise;
  const start = x.a.start();
  await settle();
  assert.equal(x.a.user.id, "a");
  assert.equal(x.switches.length, 1);
  assert.equal(x.a.offline, true);
  held.resolve({ data: { session: { user: user("a", "Full name") } }, error: null });
  await start;
  assert.equal(x.switches.length, 1);
  assert.equal(x.identities.at(-1).user_metadata.studio_display_name, "Full name");
});
test("device logout clears two tabs without reload, network revocation or a stale refresh restoring either account", async (t) => {
  t.mock.method(globalThis, "setInterval", () => ({}));
  const db = memory(),
    x = setup("voice-ai-studio", db),
    y = setup("voice-ai-studio", db);
  db.setItem(x.a.authStorage.key, session(user("a")));
  await x.a.start();
  await y.a.start();
  const oldX = x.clients[0],
    oldY = y.clients[0],
    oldValue = db.getItem(x.a.authStorage.key);
  oldX.client.auth.signOut = oldY.client.auth.signOut = async () => {
    throw Error("network revocation must not run");
  };
  await x.a.signOut({ force: true });
  await y.a.sessionRemoved({ oldValue });
  assert.equal(x.a.user, null);
  assert.equal(y.a.user, null);
  assert.equal(x.clients.length, 2);
  assert.equal(y.clients.length, 2);
  oldX.authStorage.setItem(oldX.authStorage.key, session(user("a")));
  oldY.callbacks[0]("TOKEN_REFRESHED", { user: user("a") });
  await settle();
  assert.equal(db.getItem(x.a.authStorage.key), null);
  assert.equal(y.a.user, null);
  db.setItem(x.a.authStorage.key, session(user("b")));
  await x.a.select(user("b"));
  oldY.authStorage.removeItem(oldY.authStorage.key);
  assert.equal(JSON.parse(db.getItem(x.a.authStorage.key)).user.id, "b");
  // A delayed removal event for A must not delete B's newer session in the other tab.
  await y.a.sessionRemoved({ oldValue });
  assert.equal(y.a.user.id, "b");
  assert.equal(JSON.parse(db.getItem(x.a.authStorage.key)).user.id, "b");
});
test("forced local logout refuses an unresolved draft, while an external logout hides the account and permits a fresh sign-in", async (t) => {
  t.mock.method(globalThis, "setInterval", () => ({}));
  const x = setup("voice-ai-studio");
  x.db.setItem(x.a.authStorage.key, session(user("a")));
  await x.a.start();
  x.a.canSignOut = () => false;
  await assert.rejects(x.a.signOut({ force: true }), /unsaved drafts/);
  assert.equal(x.a.user.id, "a");
  await x.a.signOut({ force: true, external: true });
  assert.equal(x.a.user, null);
  assert.equal(x.a.deviceSignedOut, false);
  await x.a.select(user("b"));
  assert.equal(x.a.user.id, "b");
});
test("focus during a pending read discards its result and starts a fresh read before enabling text saves", async () => {
  const x = setup("voice-ai-studio");
  await x.a.select(user("a"));
  const first = deferred(),
    next = deferred();
  let n = 0;
  x.read(() => (++n === 1 ? first.promise : next.promise));
  const sync = x.a.sync();
  await x.a.sync({ reconfirm: true });
  first.resolve({ data: [], error: null });
  await sync;
  await settle();
  assert.equal(n, 2);
  assert.equal(x.a.textConfirmed, false);
  next.resolve({ data: [], error: null });
  await settle();
  assert.equal(x.a.textConfirmed, true);
});
test("a queued no-op finishes with a synced status; later idle checks remain quiet", async (t) => {
  t.mock.method(globalThis, "setTimeout", () => ({}));
  const x = setup("voice-ai-studio");
  await x.a.select(user("a"));
  x.a.queue();
  assert.match(x.notices.at(-1), /waiting/);
  await x.a.sync();
  assert.match(x.notices.at(-1), /Progress synced/);
  const count = x.notices.length;
  await x.a.sync();
  assert.equal(x.notices.length, count);
});
