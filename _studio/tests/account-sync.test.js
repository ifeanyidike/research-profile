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

test("render-created lesson drafts save and resume on another device", async () => {
  const f = fixture();
  const makeDevice = (storage) => {
    let state = initialState();
    const controller = f.make(storage);
    // Opening a lesson creates its starter draft, just as lessonView does.
    controller.getState = () => state;
    controller.setState = (next) => {
      state = next;
      state.drafts[36] ??= { code: "def solve(items):\n    pass", notes: "", step: 0, hint: 0 };
    };
    return {
      controller,
      get state() {
        return state;
      },
    };
  };
  const phone = makeDevice(f.storage);
  await phone.controller.switchUser({ id: "alice" });
  phone.state.drafts[36].walkIndex = 1;
  assert.doesNotThrow(() => phone.controller.changed());
  assert.equal(JSON.parse(f.storage.getItem("algo-studio-account:alice")).state.drafts[36].walkIndex, 1);
  await phone.controller.sync();
  clearTimeout(phone.controller.timer);
  assert.equal(phone.controller.dirty, false);

  const data = new Map();
  const laptop = makeDevice({ getItem: (k) => data.get(k) || null, setItem: (k, v) => data.set(k, v) });
  await laptop.controller.switchUser({ id: "alice" });
  assert.equal(laptop.state.drafts[36].walkIndex, 1);
  assert.equal(laptop.state.drafts[36].code, phone.state.drafts[36].code);
  phone.state.drafts[36].step = 2;
  phone.state.drafts[36].predict = 0;
  phone.state.drafts[36].code = "def solve(items):\n    return items.copy()";
  phone.state.drafts[36].notes = "An unfinished attempt";
  phone.controller.changed();
  await phone.controller.sync();
  await laptop.controller.sync();
  assert.equal(laptop.state.drafts[36].step, 2);
  assert.equal(laptop.state.drafts[36].predict, 0);
  assert.equal(laptop.state.drafts[36].notes, "An unfinished attempt");
  assert.equal(laptop.state.drafts[36].code, phone.state.drafts[36].code);
  assert.deepEqual(laptop.state.done, {});
  clearTimeout(phone.controller.timer);
});

test("backgrounding a phone sends pending edits without waiting for the debounce", async (t) => {
  const previousWindow = globalThis.window,
    previousDocument = globalThis.document;
  globalThis.window = new EventTarget();
  globalThis.document = new EventTarget();
  document.hidden = true;
  const f = fixture(),
    a = f.make();
  a.client.auth.onAuthStateChange = () => {};
  a.client.auth.getSession = async () => ({ data: { session: { user: { id: "alice" } } } });
  t.after(() => {
    clearTimeout(a.timer);
    clearInterval(a.interval);
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  });
  await a.start();
  f.state.drafts[36] = { code: "unfinished code", step: 2, notes: "phone note" };
  a.changed();
  assert.equal(f.rows.size, 0);
  document.dispatchEvent(new Event("visibilitychange"));
  await new Promise((resolve) => setTimeout(resolve, 5));
  assert.equal(f.rows.get("alice").get(a.device).records["drafts/36/code"].value, "unfinished code");
  assert.equal(a.dirty, false);
});

test("a failed local write does not claim that the work was kept on the device", async () => {
  const f = fixture(),
    a = f.make();
  await a.switchUser({ id: "alice" });
  f.offline(true);
  a.storage = {
    getItem: () => null,
    setItem: () => {
      throw Error("quota exceeded");
    },
  };
  await a.sync();
  assert.match(a.message, /Keep this tab open and export a backup/);
  assert.doesNotMatch(a.message, /work is kept/);
});

test("connecting Google links the existing account after uploading unfinished progress", async () => {
  const f = fixture(),
    a = f.make(),
    calls = [];
  await a.switchUser({ id: "existing-account", email: "learner@zoho.example" });
  f.state.done[36] = { at: 1, assisted: false };
  f.state.drafts[0] = { code: "unfinished", step: 2, notes: "My note", predict: 0 };
  a.changed();
  a.client.auth.getUser = async () => ({ data: { user: { id: "existing-account" } } });
  a.client.auth.linkIdentity = async (input) => {
    assert.equal(f.rows.get("existing-account").get(a.device).records["drafts/0/code"].value, "unfinished");
    calls.push(input);
    return {};
  };
  a.client.auth.signInWithOAuth = async () => {
    throw Error("Must not switch accounts when linking");
  };
  await a.continueWithGoogle("https://example.com/algo-studio/");
  assert.deepEqual(calls, [
    { provider: "google", options: { redirectTo: "https://example.com/algo-studio/", queryParams: { prompt: "select_account" } } },
  ]);
  assert.equal(a.user.id, "existing-account");
  assert.equal(f.state.drafts[0].notes, "My note");
  assert.ok(f.state.done[36]);
  clearTimeout(a.timer);
});

test("Google linking refuses unsynced progress and a changed identity", async () => {
  const f = fixture(),
    a = f.make();
  await a.switchUser({ id: "alice" });
  let called = false;
  a.client.auth.linkIdentity = async () => {
    called = true;
    return {};
  };
  f.state.done[36] = { at: 1, assisted: false };
  a.changed();
  f.offline(true);
  await assert.rejects(a.continueWithGoogle("https://example.com/"), /finish syncing/);
  assert.equal(called, false);
  f.offline(false);
  a.client.auth.getUser = async () => ({ data: { user: { id: "bob" } } });
  await assert.rejects(a.continueWithGoogle("https://example.com/"), /Sign in to your learning account/);
  assert.equal(called, false);
  assert.ok(f.state.done[36]);
  clearTimeout(a.timer);
});

test("Google sign-in leaves browser-only progress intact and reports provider errors", async () => {
  const f = fixture(),
    a = f.make();
  const guest = initialState();
  guest.done[36] = { at: 1, assisted: false };
  f.storage.setItem("algo-studio-v1", JSON.stringify(guest));
  await a.switchUser(null);
  a.client.auth.signInWithOAuth = async () => ({ error: Error("Provider unavailable") });
  await assert.rejects(a.continueWithGoogle("https://example.com/"), /Provider unavailable/);
  assert.deepEqual(JSON.parse(f.storage.getItem("algo-studio-v1")), guest);
  let input;
  a.client.auth.signInWithOAuth = async (options) => {
    input = options;
    return {};
  };
  await a.continueWithGoogle("https://example.com/algo-studio/");
  assert.equal(input.provider, "google");
  assert.equal(input.options.redirectTo, "https://example.com/algo-studio/");
  assert.equal(a.user, null);
});

test("identity refresh keeps progress and updates connected sign-in methods", async () => {
  const f = fixture(),
    a = f.make();
  await a.switchUser({ id: "alice", identities: [{ provider: "email" }] });
  f.state.done[36] = { at: 1, assisted: false };
  await a.switchUser({ id: "alice", identities: [{ provider: "email" }, { provider: "google" }] });
  assert.ok(f.state.done[36]);
  assert.ok(a.user.identities.some((i) => i.provider === "google"));
});
