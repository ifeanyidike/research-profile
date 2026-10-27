import test from "node:test";
import assert from "node:assert/strict";
import { lessons } from "../../algo-studio/curriculum.js";
import { checkpoints } from "../../algo-studio/practice-bank.js";
import { discovery } from "../../algo-studio/discovery.js";
import { additionalFrames } from "../../algo-studio/walkthrough-frames.js";
import { lessonDiagram } from "../../algo-studio/teaching.js";
import { captureDisclosures, restoreDisclosures } from "../../algo-studio/disclosures.js";
import { initialState, nextActivity, validBackup } from "../../algo-studio/learning-state.js";
import { ProgressReplica, validDocument } from "../../algo-studio/progress-sync.js";

test("every lesson explains its approach and renders every illustrated example state", () => {
  for (const lesson of lessons) {
    const reasoning = lesson.discovery || discovery[lesson.id];
    assert.equal(reasoning.length, 3, lesson.title);
    for (const paragraph of reasoning) assert.ok(paragraph.length > 50, lesson.title);
    const authored = lesson.diagramFrames || additionalFrames[lesson.id];
    if (authored) assert.equal(authored.length, lesson.walk.length, lesson.title);
    for (let step = 0; step < lesson.walk.length; step++) {
      const picture = lessonDiagram(lesson, step);
      assert.match(picture, /<figure/, `${lesson.id}:${step}`);
      assert.doesNotMatch(picture, /undefined|NaN/, `${lesson.id}:${step}`);
    }
  }
  assert.match(discovery[53].join(" "), /XOR/);
  assert.match(discovery[32].join(" "), /returns -1/);
});
test("the sliding-window picture shows the intermediate sum of 7 before the final sum of 9", () => {
  const active = (step) =>
    [...lessonDiagram(lessons[4], step).matchAll(/trace-cell current"><b>(.*?)<\/b><small>(\d+)<\/small>/g)].map((m) => [Number(m[1]), Number(m[2])]);
  assert.deepEqual(active(0), [
    [2, 0],
    [1, 1],
    [5, 2],
  ]);
  assert.deepEqual(active(1), [
    [1, 1],
    [5, 2],
    [1, 3],
  ]);
  assert.deepEqual(active(2), [
    [5, 2],
    [1, 3],
    [3, 4],
  ]);
  assert.equal(
    active(1).reduce((sum, [value]) => sum + value, 0),
    7
  );
});
test("recursion and table examples do not reveal a final state before its narration", () => {
  assert.doesNotMatch(lessonDiagram(lessons[14], 0), /solve\(0\)|3 × 2 = 6/);
  assert.match(lessonDiagram(lessons[14], 2), /3 × 2 = 6/);
  assert.doesNotMatch(lessonDiagram(lessons[39], 0), /Returned answer|>9</);
  assert.match(lessonDiagram(lessons[39], 2), />9</);
  assert.match(lessonDiagram(lessons[49], 0), /1  \?  \?/);
  assert.doesNotMatch(lessonDiagram(lessons[50], 0), /previous\[/);
});
// Minimal DOM doubles verify identity across replacement, insertion, nesting,
// user-closed defaults, and controlled solution panels without browser I/O.
function rootWith(specs) {
  const root = { querySelectorAll: () => details };
  const details = specs.map(([label, open]) => ({
    tagName: "DETAILS",
    id: "",
    open,
    parentElement: root,
    querySelector: () => ({ textContent: label }),
  }));
  return { root, details };
}
test("open and closed choices survive rebuilt content and an inserted disclosure", () => {
  const before = rootWith([
    ["Vocabulary", true],
    ["Costs", false],
  ]);
  const saved = captureDisclosures(before.root);
  const after = rootWith([
    ["New material", false],
    ["Vocabulary", false],
    ["Costs", true],
  ]);
  restoreDisclosures(after.root, saved);
  assert.deepEqual(
    after.details.map((d) => d.open),
    [false, true, false]
  );
});
test("nested repeated labels are separate and controlled solved examples are not restored", () => {
  const before = rootWith([
    ["A", true],
    ["B", false],
    ["More", true],
    ["More", false],
    ["Solution", true],
  ]);
  const after = rootWith([
    ["A", false],
    ["B", true],
    ["More", false],
    ["More", true],
    ["Solution", false],
  ]);
  for (const tree of [before, after]) {
    tree.details[2].parentElement = tree.details[0];
    tree.details[3].parentElement = tree.details[1];
    tree.details[4].id = "solved-example";
  }
  restoreDisclosures(after.root, captureDisclosures(before.root));
  assert.deepEqual(
    after.details.map((d) => d.open),
    [true, false, true, false, false]
  );
});
test("completed older courses continue into new lessons and new drafts sync without a schema change", () => {
  const old = initialState();
  for (let id = 0; id < 60; id++) old.done[id] = { at: 100, assisted: false };
  assert.deepEqual(nextActivity(old), { id: 60, kind: "lesson" });
  old.drafts[65] = { code: "def solve(a,b):\n    pass", notes: "Empty-prefix costs", step: 0, walkIndex: 3 };
  old.practice["33:transfer"] = { code: "my attempt", notes: "Shared characters keep their order" };
  assert.ok(validBackup(old));
  const a = new ProgressReplica("a");
  a.observe(old, 200);
  assert.ok(validDocument(a.document));
  const b = new ProgressReplica("b");
  b.merge(a.document);
  assert.deepEqual(b.state().drafts[65], { ...old.drafts[65], passedCode: null });
  assert.deepEqual(b.state().practice["33:transfer"], { ...old.practice["33:transfer"], passedCode: null });
  assert.deepEqual(b.state().done, old.done);
});

test("course stage progress counts do not change the identity of an open stage", () => {
  const before = rootWith([["01 Foundations 0 / 5 complete", true]]);
  const after = rootWith([["✓ Foundations 5 / 5 complete", false]]);
  for (const tree of [before, after]) {
    const original = tree.details[0].querySelector;
    tree.details[0].querySelector = (selector) => (selector.endsWith("strong") ? { textContent: "Foundations" } : original(selector));
  }
  restoreDisclosures(after.root, captureDisclosures(before.root));
  assert.equal(after.details[0].open, true);
});

test("the older edit-distance checkpoint now points to its missing guided introduction", () => {
  assert.equal(checkpoints[33].readingLesson, 65);
  assert.match(lessons[checkpoints[33].readingLesson].title, /Edit distance/);
});
