// Real application startup and handlers; only DOM, files and browser storage are local stubs.
// fetch returns authored JSON in memory. No network, provider or evaluation entrypoint runs.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createLearningStore, exportBackup, IDS, KEY, parseBackup, emptyState } from "../../speech-therapy-studio/model.js";
const fixture = JSON.parse(fs.readFileSync(new URL("../../speech-therapy-studio/lessons.json", import.meta.url)));
const source = fs.readFileSync(new URL("../../speech-therapy-studio/app.js", import.meta.url), "utf8");
function memory(initial = {}) {
  const rows = new Map(Object.entries(initial));
  return { getItem: (k) => rows.get(k) ?? null, setItem: (k, v) => rows.set(k, v) };
}
async function app({
  hash = "#home",
  storage = memory(),
  session = memory(),
  response = () => Promise.resolve({ ok: true, json: async () => fixture }),
} = {}) {
  let printCalls = 0;
  const nodes = new Map(),
    windowEvents = {},
    downloads = [],
    details = [
      { open: false, isConnected: true },
      { open: true, isConnected: true },
    ];
  function element(id) {
    if (!nodes.has(id))
      nodes.set(id, {
        id,
        innerHTML: "",
        textContent: "",
        value: "",
        checked: false,
        files: [],
        events: {},
        classList: { toggle() {} },
        focus() {},
        scrollIntoView() {},
        addEventListener(n, fn) {
          this.events[n] = fn;
        },
        fire(n, event = {}) {
          return this.events[n]?.({ target: this, preventDefault() {}, ...event });
        },
      });
    return nodes.get(id);
  }
  const main = element("main");
  main.innerHTML = "Opening your lessons…";
  const always = new Set(["main", "learner", "save-status", "storage-help", "skip"]);
  const document = {
    title: "",
    querySelector(selector) {
      const id = selector === ".skip" ? "skip" : selector.slice(1);
      return always.has(id) || [main, element("import-preview")].some((n) => n.innerHTML.includes(`id="${id}"`)) ? element(id) : null;
    },
    querySelectorAll(selector) {
      return selector === "details" ? details : [];
    },
    createElement() {
      return {
        click() {
          downloads.push(this);
        },
      };
    },
  };
  const location = { hash };
  const context = {
    createLearningStore,
    exportBackup,
    IDS,
    parseBackup,
    document,
    location,
    Blob,
    setTimeout() {},
    URL: {
      createObjectURL(blob) {
        downloads.push({ blob });
        return "blob:local-test";
      },
      revokeObjectURL() {},
    },
    FormData: class {
      constructor(form) {
        this.form = form;
      }
      get() {
        return this.form.answer ?? null;
      }
    },
    fetch: () => response(),
    window: {
      localStorage: storage,
      sessionStorage: session,
      print() {
        printCalls += 1;
      },
      scrollTo() {},
      addEventListener(n, fn) {
        windowEvents[n] = fn;
      },
    },
  };
  vm.runInNewContext(source.replace(/^import .*\n/, "") + "\n globalThis.api={store,render};", context);
  await new Promise(setImmediate);
  return {
    context,
    get printCalls() {
      return printCalls;
    },
    main,
    element,
    details,
    windowEvents,
    downloads,
    route(next) {
      location.hash = next;
      windowEvents.hashchange();
    },
    async choose(text) {
      const input = element("import");
      input.files = text === null ? [] : [{ size: text.length, text: async () => text }];
      await input.fire("change");
    },
    confirm() {
      element("confirm-import").fire("click");
    },
  };
}
test("actual startup opens lessons, guidance and the curriculum list", async () => {
  const a = await app();
  assert.match(a.main.innerHTML, /Help your child communicate/);
  a.route("#learn");
  assert.match(a.main.innerHTML, /Your lessons/);
  assert.equal((a.main.innerHTML.match(/href="#lesson\//g) || []).length, 20);
  a.route("#help");
  assert.match(a.main.innerHTML, /Guidance &amp; resources/);
  assert.match(a.main.innerHTML, /Restore a learning backup/);
  assert.ok(a.main.innerHTML.includes(fixture.sources.changes.url));
});
test("all S02 answer submissions explain the factual pointing note without endorsing a label", async () => {
  const a = await app({ hash: "#lesson/S02" });
  for (let i = 0; i < 3; i++) {
    a.element("question").answer = String(i);
    a.element("question").fire("submit");
    const text = a.element("feedback").textContent;
    assert.match(text, /Pointed at the car/);
    assert.doesNotMatch(text, /The first describes/);
    assert.equal(text.startsWith("Yes."), i === 2);
  }
  a.element("reviewed").checked = true;
  a.element("reviewed").fire("change");
  assert.deepEqual(a.context.api.store.state.learners.ifeanyi.done, ["S02"]);
});
test("failed fetch retains retry controls while learners change, then retry opens the chosen learner", async () => {
  let ok = false;
  const a = await app({ response: async () => ({ ok, json: async () => fixture }) });
  assert.match(a.main.innerHTML, /Your lessons could not open/);
  a.element("learner").value = "fav";
  a.element("learner").fire("change");
  assert.match(a.main.innerHTML, /Try opening again/);
  assert.match(a.element("save-status").textContent, /Fav/);
  ok = true;
  await a.element("retry").fire("click");
  assert.match(a.main.innerHTML, /Help your child communicate/);
  assert.equal(a.element("learner").value, "fav");
});
test("backup confirmation archives unreadable data and reports a persisted recovery", async () => {
  const storage = memory({ [KEY]: "bad json" });
  const a = await app({ hash: "#help", storage });
  const incoming = emptyState();
  incoming.learners.fav.done = ["S05"];
  await a.choose(exportBackup(incoming));
  assert.match(a.element("import-preview").innerHTML, /Recover and save/);
  assert.equal(storage.getItem(KEY), "bad json");
  assert.equal(a.element("storage-help").hidden, false);
  a.confirm();
  assert.equal(a.element("storage-help").hidden, true);
  assert.match(a.element("import-preview").textContent, /combined and saved/);
  assert.equal(storage.getItem(`${KEY}:unreadable`), "bad json");
  assert.deepEqual(createLearningStore(storage).state.learners.fav.done, ["S05"]);
});
test("a failed merge says it is unsaved, and a cancelled file selection removes the preview", async () => {
  const storage = {
    getItem: () => null,
    setItem() {
      throw Error("quota");
    },
  };
  const a = await app({ hash: "#help", storage });
  await a.choose(exportBackup(emptyState()));
  a.element("import").value = "fakepath/backup.json";
  a.confirm();
  assert.equal(a.element("import").value, "");
  assert.match(a.element("import-preview").textContent, /could not be saved/);
  assert.doesNotMatch(a.element("import-preview").textContent, /combined and saved/);
  await a.choose(exportBackup(emptyState()));
  assert.match(a.element("import-preview").innerHTML, /Recover and save/);
  await a.choose(null);
  assert.equal(a.element("import-preview").textContent, "");
});
test("beforeprint opens disclosure content and afterprint restores the original state", async () => {
  const a = await app({ hash: "#activity/A01" });
  a.windowEvents.beforeprint();
  assert.deepEqual(
    a.details.map((d) => d.open),
    [true, true]
  );
  a.windowEvents.beforeprint();
  a.windowEvents.afterprint();
  assert.deepEqual(
    a.details.map((d) => d.open),
    [false, true]
  );
});
test("download handler takes a fresh shared-storage snapshot", async () => {
  const storage = memory();
  const a = await app({ hash: "#help", storage });
  createLearningStore(storage).mark("S07", true);
  a.element("export").fire("click");
  const raw = await a.downloads.find((d) => d.blob).blob.text();
  assert.deepEqual(parseBackup(raw).learners.ifeanyi.done, ["S07"]);
});

test("loaded learner changes rerender without marking a visit and survive another tab’s choice", async () => {
  const storage = memory(),
    session = memory();
  const a = await app({ hash: "#lesson/S02", storage, session });
  a.element("learner").value = "fav";
  a.element("learner").fire("change");
  assert.match(a.main.innerHTML, /This checkmark belongs to Fav/);
  assert.equal(a.context.api.store.state.learners.fav.last, "S01");
  createLearningStore(storage).select("ifeanyi");
  const reloaded = await app({ hash: "#home", storage, session });
  assert.equal(reloaded.element("learner").value, "fav");
});
test("recovery status has a real header link and the print button invokes printing", async () => {
  const html = fs.readFileSync(new URL("../../speech-therapy-studio/index.html", import.meta.url), "utf8");
  assert.match(html, /id="storage-help"/);
  const a = await app({ hash: "#activity/A01" });
  assert.equal(a.element("storage-help").hidden, true);
  a.element("print-activity").fire("click");
  assert.equal(a.printCalls, 1);
});
test("a disconnected old print view cannot suppress expansion on a later card", async () => {
  const a = await app({ hash: "#activity/A01" });
  a.windowEvents.beforeprint();
  for (const detail of a.details) detail.isConnected = false;
  a.details.splice(0, a.details.length, { open: false, isConnected: true }, { open: false, isConnected: true });
  a.windowEvents.beforeprint();
  assert.deepEqual(
    a.details.map((d) => d.open),
    [true, true]
  );
  a.windowEvents.afterprint();
  assert.deepEqual(
    a.details.map((d) => d.open),
    [false, false]
  );
});
