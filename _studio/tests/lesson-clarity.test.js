import test from "node:test";
import assert from "node:assert/strict";
import { lessons, route } from "../../algo-studio/curriculum.js";
import { checkpoints, transferTasks } from "../../algo-studio/practice-bank.js";
import { lessonDiagram } from "../../algo-studio/teaching.js";
import { initialState, upgradeState, validBackup } from "../../algo-studio/learning-state.js";

test("every exercise has its own input, returned result, and explanation of its example", () => {
  const exercises = [...lessons, ...Object.values(checkpoints), ...Object.values(transferTasks)];
  assert.equal(exercises.length, 132);
  for (const exercise of exercises) {
    for (const field of ["input", "output", "example"]) {
      assert.equal(typeof exercise.exerciseBrief[field], "string", `${exercise.title}: ${field}`);
      assert.ok(exercise.exerciseBrief[field].length > 10, `${exercise.title}: ${field}`);
    }
  }
  // A checkpoint or mixed problem must not inherit the main lesson's different contract.
  for (const [id, exercise] of Object.entries(checkpoints)) assert.notDeepEqual(exercise.exerciseBrief, lessons[id].exerciseBrief, id);
  for (const [id, exercise] of Object.entries(transferTasks)) assert.notDeepEqual(exercise.exerciseBrief, lessons[id].exerciseBrief, id);
  assert.match(checkpoints[55].exerciseBrief.output, /position where a loop begins/);
  assert.match(transferTasks[13].exerciseBrief.example, /\(0, 1\), \(0, 2\), and \(1, 2\)/);
  assert.doesNotMatch(checkpoints[1].task, /starter uses the wrong/);
});

test("all lessons have separate explanation paragraphs and complete three-choice questions", () => {
  assert.equal(lessons.length, 60);
  assert.equal(new Set(route).size, 60);
  for (const lesson of lessons) {
    assert.ok(lesson.explanation.length >= 3, lesson.title);
    assert.equal(lesson.explanation.join("\n\n"), lesson.idea);
    for (const paragraph of lesson.explanation) assert.ok(paragraph.trim().length > 40, lesson.title);
    for (const kind of ["predict", "reflect"]) {
      const question = lesson[kind];
      assert.ok(question.prompt.length > 35, `${lesson.id}: ${kind}`);
      assert.equal(question.options.length, 3);
      assert.equal(new Set(question.options).size, 3);
      assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 3);
      assert.ok(question.why.length > 30);
    }
  }
});

test("collision walkthrough shows different keys sharing a bucket without duplicating a repeated key", () => {
  const lesson = lessons[54];
  assert.equal(lesson.walk.length, 5);
  const contents = [
    ["[]", "[]", "[]"],
    ["[]", "[1]", "[]"],
    ["[]", "[1, 4]", "[]"],
    ["[]", "[1, 4]", "[]"],
    ["[]", "[1, 4]", "[2]"],
  ];
  contents.forEach((expected, step) => {
    const diagram = lessonDiagram(lesson, step);
    assert.deepEqual(
      [...diagram.matchAll(/<strong>(.*?)<\/strong>/g)].map((match) => match[1]),
      expected
    );
  });
  assert.deepEqual(lesson.tests[0], { args: [[1, 4, 1, 2], 3], expected: [[], [1, 4], [2]] });
  assert.match(lesson.exerciseBrief.output, /empty buckets/);
});

test("older saved progress remains valid with the expanded explanation and walkthrough", () => {
  const old = initialState();
  old.done[36] = { at: 100, assisted: false };
  old.drafts[54] = { code: "def solve(keys, bucket_count):\n    pass", notes: "Keep these notes", step: 2, walkIndex: 2, predict: 0 };
  old.practice["36:check"] = { code: "def solve(items):\n    return [x * 2 for x in items]", notes: "My existing attempt" };
  const saved = structuredClone(old);
  assert.equal(validBackup(old), true);
  assert.deepEqual(upgradeState(old), saved);
  assert.deepEqual(old, saved);
  old.drafts[54].walkIndex = 4;
  assert.equal(validBackup(old), true);
});
