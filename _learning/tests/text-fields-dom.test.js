// Minimal offline DOM boundary; exercises the production binding, event and notice lifecycle.
import test from "node:test";
import assert from "node:assert/strict";
import { createTextFields } from "../../learning-studio/text-fields.js";
import { updateLessonDetails } from "../../learning-studio/lesson-details.js";
class Element {
  constructor(tag, doc) {
    this.tagName = tag.toUpperCase();
    this.ownerDocument = doc;
    this.children = [];
    this.listeners = {};
    this.attributes = {};
    this.dataset = {};
    this.isConnected = true;
    this.value = "";
    this.textContent = "";
    this.open = false;
    this.selectionStart = this.selectionEnd = 0;
  }
  setAttribute(k, v) {
    this.attributes[k] = v;
  }
  removeAttribute(k) {
    delete this.attributes[k];
  }
  append(...items) {
    for (const item of items) {
      item.parent = this;
      this.children.push(item);
    }
  }
  addEventListener(event, fn) {
    (this.listeners[event] ||= []).push(fn);
  }
  emit(event) {
    for (const fn of this.listeners[event] || []) fn({ target: this });
  }
  insertAdjacentElement(_, el) {
    this.parent.append(el);
  }
  remove() {
    this.parent.children = this.parent.children.filter((el) => el !== this);
    this.isConnected = false;
  }
  focus() {
    this.ownerDocument.activeElement = this;
  }
  setSelectionRange(a, b) {
    this.selectionStart = a;
    this.selectionEnd = b;
  }
}
function fixture() {
  const created = [],
    doc = {
      createElement: (tag) => {
        const el = new Element(tag, doc);
        created.push(el);
        return el;
      },
    };
  const root = new Element("main", doc),
    el = new Element("textarea", doc);
  root.append(el);
  el.dataset.field = "notes";
  root.querySelectorAll = () => [el];
  let saved = { value: "A", changed: 100 },
    writes = 0;
  const fields = createTextFields();
  fields.bind(root, {
    scope: "a:ifeanyi",
    topic: "V01",
    read: () => saved,
    write: (_field, value) => {
      saved = { value, changed: saved.changed + 1 };
      writes++;
    },
  });
  return { fields, root, el, created, remote: (value) => (saved = { value, changed: 200 }), writes: () => writes, saved: () => saved };
}
test("saved-text disclosure stays open and retains its alert node across typing and background refresh", () => {
  const x = fixture();
  x.remote("AB");
  x.el.value = "AC";
  x.el.emit("input");
  const notice = x.root.children[1],
    [message, details] = notice.children;
  details.open = true;
  assert.equal(message.attributes.role, "alert");
  for (const value of ["ACD", "ACDE"]) {
    x.el.value = value;
    x.el.emit("input");
    x.fields.refresh();
  }
  assert.equal(x.root.children[1], notice);
  assert.equal(notice.children[0], message);
  assert.equal(details.open, true);
  assert.equal(x.created.filter((el) => el.attributes.role === "alert").length, 1);
  assert.equal(x.saved().value, "AB");
  assert.equal(x.writes(), 0);
  assert.equal(x.fields.hasDraftsFor("a:ifeanyi"), true);
  assert.equal(x.fields.hasDraftsFor("b:ifeanyi"), false);
  notice.children[3].emit("click");
  assert.equal(x.saved().value, "ACDE");
  assert.equal(x.fields.hasDrafts, false);
});
test("an externally signed-out account's draft stays scoped in memory and can be recovered after returning", () => {
  const x = fixture();
  x.remote("AB");
  x.el.value = "AC";
  x.el.emit("input");
  const guest = new Element("textarea", x.el.ownerDocument);
  guest.dataset.field = "notes";
  const root = { querySelectorAll: () => [guest] };
  x.fields.bind(root, {
    scope: "guest:ifeanyi",
    topic: "V01",
    read: () => ({ value: "Guest", changed: 1 }),
    write: () => {
      throw Error("No guest writes expected");
    },
  });
  assert.equal(guest.value, "Guest");
  assert.deepEqual(x.fields.locationsFor("a:ifeanyi"), [{ topic: "V01", field: "notes" }]);
  x.fields.bind(x.root, {
    scope: "a:ifeanyi",
    topic: "V01",
    read: () => x.saved(),
    write: () => {
      throw Error("Must choose before writing");
    },
  });
  assert.equal(x.el.value, "AC");
  assert.equal(x.fields.hasDraftsFor("a:ifeanyi"), true);
});
test("lesson progress updates preserve existing disclosure and focused prerequisite nodes", () => {
  const nodes = new Map(),
    panel = { open: true, querySelector: (key) => nodes.get(key) };
  for (const key of [
    "[data-detail-caption]",
    '[data-detail-progress="read"]',
    '[data-detail-progress="practice"]',
    '[data-detail-progress="passedAt"]',
    "[data-detail-due]",
  ])
    nodes.set(key, { textContent: "" });
  const prereq = { focused: true };
  panel.prerequisite = prereq;
  updateLessonDetails(panel, { read: true, practice: false, passedAt: 100 }, ["V01"]);
  assert.equal(panel.open, true);
  assert.equal(panel.prerequisite, prereq);
  assert.equal(prereq.focused, true);
  assert.equal(nodes.get('[data-detail-progress="read"]').textContent, "✓ Introduction understood");
  assert.equal(nodes.get("[data-detail-caption]").textContent, "1 prerequisite to review");
  assert.equal(nodes.get("[data-detail-due]").textContent, "Recall sequence complete. Revisit whenever useful.");
});
