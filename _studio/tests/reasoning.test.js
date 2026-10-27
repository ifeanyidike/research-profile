import test from "node:test";
import assert from "node:assert/strict";
import { initialState, upgradeState, validBackup } from "../../algo-studio/learning-state.js";
import { courseStages, lessons } from "../../algo-studio/curriculum.js";
import { reasoningSets, reasoningFields } from "../../algo-studio/reasoning-course.js";
import {
  reasoningDefaults,
  reasoningDraft,
  checkReasoning,
  canFinishReasoning,
  finishReasoning,
  freshReasoning,
  validReasoningProgress,
} from "../../algo-studio/reasoning-model.js";
import { ProgressReplica, validDocument } from "../../algo-studio/progress-sync.js";
const prepared = (stage = 0) => {
  const d = structuredClone(reasoningDefaults),
    set = reasoningSets[stage];
  set.questions.forEach((q, i) => (d["answer" + i] = q.answer));
  for (const [field] of reasoningFields) d[field] = "My concrete explanation and independently traced boundary example.";
  d.selfReviewed = true;
  return d;
};
test("all twenty course stages have four complete decisions and varied answer positions", () => {
  assert.equal(reasoningSets.length, courseStages.length);
  assert.equal(reasoningSets.length, 20);
  const positions = new Set();
  for (const [index, set] of reasoningSets.entries()) {
    assert.equal(set.stage, index);
    assert.equal(set.questions.length, 4);
    assert.ok(set.scenario.length > 60);
    for (const q of set.questions) {
      assert.ok(q.prompt.length > 30);
      assert.equal(new Set(q.options).size, 3);
      assert.ok(q.why.length > 60);
      positions.add(q.answer);
    }
  }
  assert.deepEqual([...positions].sort(), [0, 1, 2]);
  assert.match(reasoningSets[6].scenario, /all cost one move/);
  assert.ok(courseStages[6][4].includes(18));
});
test("decisions alone, writing alone, and unchecked self-review cannot complete reasoning practice", () => {
  const set = reasoningSets[0],
    d = prepared();
  assert.equal(canFinishReasoning(set, d), false);
  assert.ok(checkReasoning(set, d));
  assert.ok(canFinishReasoning(set, d));
  d.selfReviewed = false;
  assert.equal(finishReasoning(set, d, 100), false);
  d.selfReviewed = true;
  d.proof = "short";
  assert.equal(finishReasoning(set, d, 100), false);
  d.proof = "A claim is written here but must still be reviewed by a person.";
  d.answer0 = (set.questions[0].answer + 1) % 3;
  assert.equal(finishReasoning(set, d, 100), false);
});
test("wrong decisions record support, changed answers need checking again, and completion does not award lesson credit", () => {
  const state = initialState(),
    set = reasoningSets[0],
    d = reasoningDraft(state, 0);
  Object.assign(d, prepared());
  d.answer0 = (set.questions[0].answer + 1) % 3;
  checkReasoning(set, d);
  assert.equal(d.assisted, true);
  assert.equal(canFinishReasoning(set, d), false);
  d.answer0 = set.questions[0].answer;
  d.checked = false;
  assert.equal(canFinishReasoning(set, d), false);
  checkReasoning(set, d);
  assert.ok(finishReasoning(set, d, 100));
  assert.equal(d.status, "supported");
  assert.deepEqual(state.done, {});
  assert.deepEqual(state.ready, {});
  assert.ok(validBackup(state));
});
test("first checked decisions keep an honest label and early repetition cannot advance a delayed schedule", () => {
  const set = reasoningSets[12],
    d = prepared(12);
  checkReasoning(set, d);
  finishReasoning(set, d, 100);
  assert.equal(d.status, "without-guidance");
  const due = d.reviewDue;
  const fresh = freshReasoning(d);
  assert.match(fresh.previous, /concrete explanation/);
  assert.equal(fresh.exposed, true);
  Object.assign(fresh, prepared(12), { exposed: true, notBefore: due });
  checkReasoning(set, fresh);
  finishReasoning(set, fresh, 200);
  assert.equal(fresh.status, "reattempt");
  assert.equal(fresh.reviewDue, due);
  assert.equal(fresh.reviewCount, 0);
  const later = freshReasoning(fresh);
  Object.assign(later, prepared(12), { exposed: true, notBefore: due });
  checkReasoning(set, later);
  finishReasoning(set, later, due);
  assert.equal(later.reviewCount, 1);
  assert.equal(later.reviewDue, due + 7 * 86400000);
});
test("reasoning backups validate bounded fields and retain legacy work unchanged", () => {
  const old = { version: 1, done: { 0: { at: 10, assisted: false } }, drafts: {}, reviews: {}, activity: [] };
  assert.ok(validBackup(old));
  assert.deepEqual(upgradeState(old).done, old.done);
  const s = upgradeState(old);
  s.reasoning[19] = prepared(19);
  assert.ok(validBackup(s));
  for (const bad of [
    { 20: prepared() },
    { 0: { answer0: 3 } },
    { 0: { proof: "x".repeat(10001) } },
    { 0: { status: "mastered" } },
    { 0: { completedAt: -1 } },
    { 0: { unknown: true } },
  ])
    assert.equal(validReasoningProgress(bad), false);
});
test("unfinished reasoning from two devices merges per field alongside new lessons and familiar saved code", () => {
  const state = initialState();
  state.reasoning[15] = prepared(15);
  state.drafts[107] = { code: lessons[107].starter, notes: "Keep my exact-match argument", step: 0 };
  const a = new ProgressReplica("a");
  a.observe(state, 10);
  assert.ok(validDocument(a.document));
  const b = new ProgressReplica("b");
  b.merge(a.document);
  const bs = b.state();
  b.accept(bs);
  state.reasoning[15].proof = "Device A: a feasible flow equals a cut upper bound, establishing optimality.";
  a.observe(state, 20);
  bs.reasoning[15].boundary = "Device B: a zero-capacity edge must not create residual reachability.";
  b.observe(bs, 30);
  a.merge(b.document);
  b.merge(a.document);
  assert.deepEqual(a.state(), b.state());
  assert.match(a.state().reasoning[15].proof, /Device A/);
  assert.match(a.state().reasoning[15].boundary, /Device B/);
  assert.equal(a.state().drafts[107].code, lessons[107].starter);
  assert.ok(validBackup(a.state()));
});

test("recorded reasoning is a read-only attempt until a fresh review starts", async () => {
  const { createReasoning } = await import("../../algo-studio/reasoning-ui.js");
  const state = initialState(),
    set = reasoningSets[0],
    d = prepared();
  checkReasoning(set, d);
  finishReasoning(set, d, 100);
  state.reasoning[0] = d;
  const original = structuredClone(d);
  assert.equal(finishReasoning(set, d, 200), false);
  assert.deepEqual(d, original);
  const ui = createReasoning({ getState: () => state, save: () => {}, render: () => {}, stages: courseStages });
  const html = ui.view("0");
  assert.match(html, /id="reasoning-fresh"/);
  assert.equal((html.match(/rows="4" readonly/g) || []).length, 4);
  assert.match(html, /id="reasoning-finish" disabled/);
  const fresh = freshReasoning(d);
  assert.equal(fresh.completedAt, 0);
  assert.match(fresh.previous, /concrete explanation/);
});
