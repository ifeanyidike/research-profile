import test from "node:test";
import assert from "node:assert/strict";
import { Account } from "../../cyber-studio/account.js";
import { createStore, mergeRecords } from "../../cyber-studio/model.js";
const ids = new Set(["O01"]);
function setup(server, uid) {
  const cache = new Map(),
    db = { getItem: (k) => cache.get(k) ?? null, setItem: (k, v) => cache.set(k, v) };
  let current,
    clock = 100;
  const status = [];
  const client = {
    from(table) {
      assert.equal(table, "cyber_progress");
      return {
        select() {
          return {
            async eq(_, user) {
              return { data: [...(server.get(user) || new Map())].map(([lesson_id, record]) => ({ lesson_id, record })), error: null };
            },
          };
        },
        upsert(rows) {
          return {
            async select() {
              const data = [];
              for (const row of rows) {
                assert.equal(row.user_id, uid);
                const account = server.get(uid) || new Map();
                server.set(uid, account);
                const record = mergeRecords(account.get(row.lesson_id) || { values: {}, changed: {} }, row.record);
                account.set(row.lesson_id, record);
                data.push({ lesson_id: row.lesson_id, record });
              }
              return { data, error: null };
            },
          };
        },
      };
    },
    auth: {
      async signOut() {
        return { error: null };
      },
    },
  };
  const a = new Account({
    client,
    ids,
    switchUser(user) {
      current = createStore(
        db,
        ids,
        () => ++clock,
        () => {},
        user ? `account:${user.id}` : "guest"
      );
    },
    store: () => current,
    status: (s) => status.push(s),
    changed() {},
  });
  return { a, status, store: () => current, setClock: (n) => (clock = n) };
}
test("two devices converge independent fields without exposing another account", async () => {
  const server = new Map();
  const a = setup(server, "a"),
    b = setup(server, "a"),
    other = setup(server, "b");
  await a.a.select({ id: "a" });
  await b.a.select({ id: "a" });
  a.store().update("ifeanyi", "O01", { notes: "A private note" });
  await a.a.sync();
  b.store().update("ifeanyi", "O01", { practice: true });
  await b.a.sync();
  await a.a.sync();
  assert.deepEqual(a.store().record("ifeanyi", "O01").values, { notes: "A private note", practice: true });
  await other.a.select({ id: "b" });
  assert.deepEqual(other.store().record("ifeanyi", "O01").values, {});
  assert.equal(other.status.at(-1), "Progress synced · your workspace is ready on other devices.");
});
test("stale async responses cannot write into a newly selected account", async () => {
  const server = new Map(),
    x = setup(server, "a");
  await x.a.select({ id: "a" });
  let release;
  const wait = new Promise((r) => (release = r));
  x.a.client.from = () => ({
    select: () => ({
      eq: async () => {
        await wait;
        return { data: [{ lesson_id: "O01", record: { values: { notes: "A" }, changed: { notes: 200 } } }], error: null };
      },
    }),
  });
  const request = x.a.sync();
  await x.a.select(null);
  release();
  await request;
  assert.deepEqual(x.store().record("ifeanyi", "O01").values, {});
});
test("failed network retains the account workspace and prevents misleading sign out", async () => {
  const x = setup(new Map(), "a");
  await x.a.select({ id: "a" });
  x.store().update("ifeanyi", "O01", { notes: "Keep this" });
  x.a.client.from = () => ({ select: () => ({ eq: async () => ({ error: Error("offline") }) }) });
  await x.a.sync();
  assert.ok(x.a.pending);
  assert.match(x.status.at(-1), /Sync paused/);
  assert.equal(x.store().record("ifeanyi", "O01").values.notes, "Keep this");
  await assert.rejects(() => x.a.signOut(), /Sync has not finished/);
});
