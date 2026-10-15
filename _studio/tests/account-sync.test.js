import test from "node:test";
import assert from "node:assert/strict";
import { AccountSync } from "../../algo-studio/account-sync.js";
import { initialState } from "../../algo-studio/learning-state.js";
function fixture() {
  const data = new Map(),
    rows = new Map();
  let state = initialState(),
    fail = false;
  const storage = { getItem: (k) => data.get(k) || null, setItem: (k, v) => data.set(k, v) };
  const client = {
    auth: { signOut: async () => ({}) },
    from: () => ({
      select: () => ({
        eq: async (_col, id) =>
          fail
            ? { error: Error("offline") }
            : { data: [...(rows.get(id) || new Map()).values()].map((document) => ({ document: structuredClone(document) })) },
      }),
      upsert: async (row) => {
        if (fail) return { error: Error("offline") };
        const r = rows.get(row.user_id) || new Map();
        r.set(row.device_id, structuredClone(row.document));
        rows.set(row.user_id, r);
        return {};
      },
    }),
  };
  const make = (store = storage) =>
    new AccountSync({
      client,
      storage: store,
      getState: () => state,
      setState: (s) => {
        state = s;
      },
      canApply: () => true,
      onStatus: () => {},
    });
  return {
    data,
    rows,
    storage,
    make,
    get state() {
      return state;
    },
    offline: (v) => {
      fail = v;
    },
  };
}
test("account change isolates state and signout restores the guest workspace", async () => {
  const f = fixture();
  const guest = initialState();
  guest.drafts[0] = { code: "guest", notes: "", step: 0 };
  f.storage.setItem("algo-studio-v1", JSON.stringify(guest));
  const a = f.make();
  await a.switchUser({ id: "alice" });
  assert.deepEqual(f.state.drafts, {});
  f.state.done[0] = { at: 1, assisted: false };
  a.changed();
  await a.sync();
  clearTimeout(a.timer);
  await a.switchUser({ id: "bob" });
  assert.deepEqual(f.state.done, {});
  await a.switchUser({ id: "alice" });
  assert.ok(f.state.done[0]);
  await a.signOut();
  assert.equal(f.state.drafts[0].code, "guest");
  assert.deepEqual(f.state.done, {});
});
test("a second device loads saved account progress and offline changes retry", async () => {
  const f = fixture(),
    a = f.make();
  await a.switchUser({ id: "alice" });
  f.state.done[0] = { at: 1, assisted: false };
  a.changed();
  f.offline(true);
  await a.sync();
  assert.equal(a.dirty, true);
  clearTimeout(a.timer);
  f.offline(false);
  await a.sync();
  assert.equal(a.dirty, false);
  const secondData = new Map(),
    storage = { getItem: (k) => secondData.get(k) || null, setItem: (k, v) => secondData.set(k, v) };
  const b = f.make(storage);
  await b.switchUser({ id: "alice" });
  assert.ok(f.state.done[0]);
  assert.notEqual(a.device, b.device);
  assert.deepEqual(f.state.drafts, {});
});
test("guest progress is uploaded only after the learner explicitly imports it", async () => {
  const f = fixture(),
    guest = initialState();
  guest.done[0] = { at: 1, assisted: false };
  f.storage.setItem("algo-studio-v1", JSON.stringify(guest));
  const a = f.make();
  await a.switchUser({ id: "alice" });
  assert.equal(f.rows.size, 0);
  assert.equal(a.hasGuest(), true);
  a.importGuest();
  assert.ok(f.state.done[0]);
  assert.equal(a.hasGuest(), false);
  await new Promise((resolve) => setTimeout(resolve, 5));
  assert.ok(f.rows.get("alice"));
});
test("signout refuses to abandon unsynced progress", async () => {
  const f = fixture(),
    a = f.make();
  await a.switchUser({ id: "alice" });
  f.state.done[0] = { at: 1, assisted: false };
  a.changed();
  f.offline(true);
  await assert.rejects(a.signOut(), /waiting to sync/);
  assert.equal(a.user.id, "alice");
  clearTimeout(a.timer);
});
test("offline changes from two tabs survive a shared browser-cache write", async () => {
  const f = fixture();
  const makeTab = () => {
    let state = initialState();
    const a = new AccountSync({
      client: { from: () => ({ select: () => ({ eq: async () => ({ error: Error("offline") }) }) }) },
      storage: f.storage,
      getState: () => state,
      setState: (s) => {
        state = s;
      },
      canApply: () => true,
      onStatus: () => {},
    });
    return {
      a,
      get state() {
        return state;
      },
    };
  };
  const one = makeTab(),
    two = makeTab();
  await one.a.switchUser({ id: "alice" });
  await two.a.switchUser({ id: "alice" });
  one.state.drafts[0] = { code: "first tab", step: 0, notes: "" };
  one.a.changed();
  two.state.drafts[1] = { code: "second tab", step: 0, notes: "" };
  two.a.changed();
  const cached = JSON.parse(f.storage.getItem("algo-studio-account:alice"));
  assert.equal(cached.state.drafts[0].code, "first tab");
  assert.equal(cached.state.drafts[1].code, "second tab");
  assert.notEqual(one.a.writer, two.a.writer);
  clearTimeout(one.a.timer);
  clearTimeout(two.a.timer);
});
