// Offline execution of authored route rendering with minimal DOM/storage stubs.
// No browser, network, inference, replay or evaluation runner is imported.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createLearningStore, exportBackup, IDS, parseBackup } from "../../speech-therapy-studio/model.js";
const fixture = JSON.parse(fs.readFileSync(new URL("../../speech-therapy-studio/lessons.json", import.meta.url)));
const source = fs.readFileSync(new URL("../../speech-therapy-studio/app.js", import.meta.url), "utf8");
function app() {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const node = () => ({ innerHTML: "", textContent: "", value: "", dataset: {}, classList: { toggle() {} }, addEventListener() {}, focus() {} });
  const main = node(),
    learner = node(),
    status = node(),
    skip = node();
  const nav = ["home", "learn", "help"].map((name) => ({
    ...node(),
    dataset: { nav: name },
    setAttribute(key, value) {
      this[key] = value;
    },
    removeAttribute(key) {
      delete this[key];
    },
  }));
  const document = {
    title: "",
    querySelector: (s) => ({ "#main": main, "#learner": learner, "#save-status": status, ".skip": skip })[s] || null,
    querySelectorAll: () => nav,
  };
  const location = { hash: "#home" };
  const context = {
    createLearningStore,
    exportBackup,
    IDS,
    parseBackup,
    fixture,
    document,
    location,
    window: { localStorage: storage, addEventListener() {}, scrollTo() {} },
  };
  vm.runInNewContext(source.replace(/^import .*\n/, "").replace(/start\(\);\s*$/, "data = fixture; globalThis.studio = {render, store};"), context);
  return {
    context,
    main,
    nav,
    document,
    route(hash) {
      location.hash = hash;
      context.studio.render();
      return main.innerHTML;
    },
  };
}
test("all lesson and activity routes render their content and retain the simple navigation", () => {
  const a = app();
  for (const lesson of fixture.lessons) {
    const html = a.route(`#lesson/${lesson.id}`);
    assert.ok(html.includes(lesson.title.replace(/&/g, "&amp;")), lesson.id);
    for (const id of lesson.activities) assert.ok(html.includes(`#activity/${id}`), lesson.id);
    assert.equal(a.nav.find((n) => n["aria-current"] === "page").dataset.nav, "learn");
  }
  for (const card of fixture.activities) {
    const html = a.route(`#activity/${card.id}`);
    assert.ok(html.includes("Respond to your child"), card.id);
    assert.ok(html.includes("Make it easier") && html.includes("Finish comfortably"), card.id);
    assert.ok(html.includes("Print this activity"), card.id);
    assert.equal(a.document.title, `${card.title} · Speech Therapy Studio`);
    assert.equal(a.nav.find((n) => n["aria-current"] === "page").dataset.nav, "learn");
  }
  assert.ok(a.route("#activities").includes("Choose one activity"));
  assert.ok(a.route("#next").includes("observations.html"));
  assert.ok(a.route("#activity/unknown").includes("Activity not found"));
  assert.ok(a.route("#unknown").includes("Page not found"));
});
test("opening activities never marks a child task or changes the last adult lesson", () => {
  const a = app();
  a.route("#lesson/S08");
  a.context.studio.store.mark("S02", true);
  const before = JSON.stringify(a.context.studio.store.state);
  for (const card of fixture.activities) a.route(`#activity/${card.id}`);
  a.route("#activities");
  a.route("#next");
  assert.equal(JSON.stringify(a.context.studio.store.state), before);
  assert.ok(a.route("#home").includes("Continue your learning"));
});
test("an opened later lesson is labelled continue even before the first checkmark", () => {
  const a = app();
  a.route("#lesson/S08");
  const html = a.route("#home");
  assert.ok(html.includes("Continue your learning"));
  assert.ok(!html.includes("Your first lesson"));
});
