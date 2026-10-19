import test from "node:test";
import assert from "node:assert/strict";
import { initialState } from "../../algo-studio/learning-state.js";
import { ProgressReplica, validDocument } from "../../algo-studio/progress-sync.js";
const draft = (code, notes = "") => ({ code, notes, step: 0, hint: 0 });
test("a new empty device downloads progress without deleting cloud progress", () => {
  const a = new ProgressReplica("a"),
    s = initialState();
  s.done[0] = { at: 10, assisted: false };
  s.drafts[0] = draft("return 1", "my note");
  a.observe(s, 10);
  const b = new ProgressReplica("b");
  assert.equal(b.observe(initialState()), false);
  b.merge(a.document);
  assert.deepEqual(b.state().done, s.done);
  assert.equal(b.state().drafts[0].code, "return 1");
});
test("offline edits to different lessons and different fields both survive", () => {
  const a = new ProgressReplica("a"),
    s = initialState();
  s.drafts[0] = draft("old", "old note");
  a.observe(s, 10);
  const b = new ProgressReplica("b");
  b.merge(a.document);
  const bs = b.state();
  b.accept(bs);
  s.drafts[0].code = "new code";
  a.observe(s, 20);
  bs.drafts[0].notes = "new note";
  bs.drafts[1] = draft("lesson two");
  b.observe(bs, 30);
  a.merge(b.document);
  b.merge(a.document);
  assert.deepEqual(a.state(), b.state());
  assert.equal(a.state().drafts[0].code, "new code");
  assert.equal(a.state().drafts[0].notes, "new note");
});
test("an older device cannot overwrite newer progress just by reconnecting", () => {
  const a = new ProgressReplica("a"),
    s = initialState();
  s.drafts[0] = draft("first");
  a.observe(s, 10);
  const b = new ProgressReplica("b", s, a.document);
  s.drafts[0].code = "newest";
  a.observe(s, 20);
  assert.equal(b.observe(b.state()), false);
  a.merge(b.document);
  assert.equal(a.state().drafts[0].code, "newest");
});
test("replacement imports synchronize deletions and do not revive old entries", () => {
  const a = new ProgressReplica("a"),
    s = initialState();
  s.done[0] = { at: 1, assisted: false };
  a.observe(s, 10);
  const old = structuredClone(a.document);
  a.observe(initialState(), 20);
  a.merge(old);
  assert.deepEqual(a.state().done, {});
});
test("test run results are never uploaded or credited from another device", () => {
  const a = new ProgressReplica("a"),
    s = initialState();
  s.drafts[0] = { ...draft("answer"), passedCode: "answer", results: [{ passed: true }], testSuiteVersion: "local-suite" };
  a.observe(s, 10);
  assert.equal(
    Object.keys(a.document.records).some((k) => k.endsWith("/results") || k.endsWith("/passedCode") || k.endsWith("/testSuiteVersion")),
    false
  );
  assert.equal(a.state().drafts[0].passedCode, null);
  assert.equal(a.state().drafts[0].testSuiteVersion, undefined);
  assert.equal(a.state(s).drafts[0].passedCode, "answer");
  assert.equal(a.state(s).drafts[0].testSuiteVersion, "local-suite");
});
test("bad cloud data and unsafe paths are rejected", () => {
  assert.equal(validDocument({ version: 1, records: { "drafts/0/__proto__": { at: 1, device: "a", value: {} } } }), false);
  const a = new ProgressReplica("a");
  assert.throws(() => a.merge({ version: 2 }));
  a.merge({ version: 1, records: { "drafts/999/code": { at: 1, device: "a", value: "bad" } } });
  assert.throws(() => a.state());
});
test("edits immediately after loading a cache are detected, including review objects", () => {
  const s = initialState();
  s.reviews[0] = { stage: 0, due: 10 };
  const a = new ProgressReplica("a", s);
  s.reviews[0].stage = 1;
  assert.equal(a.observe(s, 20), true);
  assert.equal(a.document.records["reviews/0"].value.stage, 1);
});
