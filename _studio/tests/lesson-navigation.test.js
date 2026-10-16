import test from "node:test";
import assert from "node:assert/strict";
import { canVisitLessonStep } from "../../algo-studio/lesson-navigation.js";

const lesson = { walk: ["first", "second", "last"], predict: { answer: 1 } };
test("lesson navigation opens each part after its prerequisite and never changes the draft", () => {
  const draft = { step: 0, walkIndex: 0, code: "my code" };
  const allowed = () => [0, 1, 2, 3].map((step) => canVisitLessonStep(lesson, draft, step));
  assert.deepEqual(allowed(), [true, false, false, false]);
  draft.walkIndex = 2;
  assert.deepEqual(allowed(), [true, true, false, false]);
  draft.predict = 0;
  assert.equal(canVisitLessonStep(lesson, draft, 2), false);
  draft.predict = 1;
  assert.deepEqual(allowed(), [true, true, true, false]);
  draft.passedCode = draft.code;
  draft.results = [{ passed: true }];
  const before = JSON.stringify(draft);
  assert.deepEqual(allowed(), [true, true, true, true]);
  assert.equal(JSON.stringify(draft), before);
  draft.code = "edited code";
  assert.equal(canVisitLessonStep(lesson, draft, 3), false);
  draft.passedCode = draft.code;
  draft.results = [{ passed: false }];
  assert.equal(canVisitLessonStep(lesson, draft, 3), false);
});
test("saved lesson positions can be revisited without treating restored code as a fresh passing run", () => {
  assert.equal(canVisitLessonStep(lesson, { step: 2, predict: 1 }, 1), true);
  assert.equal(canVisitLessonStep(lesson, { step: 3, predict: 1 }, 3), true);
  assert.equal(canVisitLessonStep(lesson, { step: 3, predict: 0 }, 3), false);
  assert.equal(canVisitLessonStep(lesson, { step: 0, predict: 0 }, 1), true);
  assert.equal(canVisitLessonStep(lesson, { step: 0, predict: 1, reflect: 0 }, 3), true);
  for (const step of [-1, 4, 1.5, "2", NaN]) assert.equal(canVisitLessonStep(lesson, {}, step), false);
});
