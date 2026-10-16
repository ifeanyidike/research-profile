// Offline tests only: static curriculum, pure models, and in-memory replica data.
import test from "node:test";
import assert from "node:assert/strict";
import { systemLessons, systemLessonById, systemStages, systemSources } from "../../algo-studio/system-design-course.js";
import {
  systemProgress,
  systemNext,
  systemCanOpen,
  systemCanComplete,
  completeSystemLesson,
  completeSystemReview,
  validSystemProgress,
  capacityModel,
  cacheModel,
  queueModel,
  notebookPrompts,
} from "../../algo-studio/system-design-model.js";
import { initialState, validBackup, upgradeState } from "../../algo-studio/learning-state.js";
import { ProgressReplica, validDocument } from "../../algo-studio/progress-sync.js";
const attempt = (l) => ({
  answer: l.check.answer,
  checked: true,
  attempts: 1,
  plan: "I chose this design because it preserves the stated correctness rule.",
  checks: [true, true, true],
  ...Object.fromEntries(notebookPrompts.map(([f]) => [f, "An explicit assumption and a justified design choice."])),
});
test("system design course has an ordered dependency path and complete examples", () => {
  assert.equal(systemLessons.length, 30);
  assert.equal(new Set(systemLessons.map((l) => l.id)).size, 30);
  const seen = new Set();
  for (const l of systemLessons) {
    assert.ok(
      l.requires.every((id) => seen.has(id)),
      l.id
    );
    assert.equal(l.position, seen.size + 1);
    assert.ok(l.explain.length >= 2 && l.walk.length >= 4 && l.diagram.length >= 3);
    assert.equal(l.check.options.length, 3);
    assert.equal(l.check.why.length, 3);
    assert.ok(l.check.answer >= 0 && l.check.answer < 3);
    assert.equal(l.rubric.length, 3);
    assert.ok(l.task.length > 50 && l.solution.length > 120);
    assert.ok(l.sources.every((key) => !!systemSources[key]));
    seen.add(l.id);
  }
  for (let i = 0; i < systemStages.length; i++) assert.equal(systemLessons.filter((l) => l.stage === i).length, 6);
  assert.ok(systemLessonById.retry.position < systemLessonById.queues.position);
  assert.ok(systemLessonById.replication.position < systemLessonById.consistency.position);
  assert.ok(systemLessonById.transactions.position < systemLessonById.booking.position);
});
test("completion needs a checked decision, own explanation, and self-review; previews cannot skip prerequisites", () => {
  const state = initialState(),
    first = systemLessons[0];
  assert.equal(systemNext(state).id, first.id);
  assert.equal(systemCanOpen(state, systemLessons[1].id), false);
  state.systemDesign[first.id] = attempt(first);
  state.systemDesign[first.id].checked = false;
  assert.equal(completeSystemLesson(state, first.id, 100), false);
  state.systemDesign[first.id].checked = true;
  state.systemDesign[first.id].checks[1] = false;
  assert.equal(systemCanComplete(state, first.id), false);
  state.systemDesign[first.id].checks[1] = true;
  assert.equal(completeSystemLesson(state, first.id, 100), true);
  assert.equal(systemNext(state).id, systemLessons[1].id);
  state.systemDesign.booking = attempt(systemLessonById.booking);
  assert.equal(completeSystemLesson(state, "booking", 100), false);
});
test("the full path is finishable and case studies require all six notebook drafts", () => {
  const state = initialState();
  for (const l of systemLessons) {
    assert.equal(systemNext(state).id, l.id);
    state.systemDesign[l.id] = attempt(l);
    if (l.stage === 4) {
      state.systemDesign[l.id].failure = "";
      assert.equal(completeSystemLesson(state, l.id, 100), false);
      state.systemDesign[l.id].failure = "A timeout leaves the write outcome unknown; reuse its operation key.";
    }
    assert.equal(completeSystemLesson(state, l.id, 100), true, l.id);
    assert.ok(validBackup(state));
  }
  assert.equal(systemNext(state), undefined);
});
test("review requires a new checked attempt and written recall, then moves the due date", () => {
  const state = initialState(),
    l = systemLessons[0];
  state.systemDesign[l.id] = attempt(l);
  completeSystemLesson(state, l.id, 100);
  assert.equal(completeSystemReview(state, l.id, 200), false);
  Object.assign(state.systemDesign[l.id], {
    reviewAnswer: l.check.answer,
    reviewChecked: true,
    reviewNote: "A different example with an explicit trade-off.",
  });
  assert.equal(completeSystemReview(state, l.id, 200), true);
  assert.equal(state.systemDesign[l.id].reviewDue, 200 + 3 * 86400000);
});
test("old algorithm backups upgrade without changing prior work; invalid system data is rejected", () => {
  const old = initialState();
  delete old.systemDesign;
  old.done[36] = { at: 10, assisted: false };
  old.drafts[36] = { code: "my unfinished Python", step: 1, notes: "my note" };
  assert.ok(validBackup(old));
  const upgraded = upgradeState(old);
  assert.deepEqual(upgraded.done, old.done);
  assert.deepEqual(upgraded.drafts, old.drafts);
  assert.deepEqual(upgraded.systemDesign, {});
  for (const value of [
    { fake: {} },
    { requirements: { step: 9 } },
    { requirements: { answer: 100 } },
    { requirements: { checks: [true] } },
    { requirements: { notes: 1 } },
    { requirements: { completedAt: -1 } },
    { requirements: { evil: true } },
  ]) {
    assert.equal(validSystemProgress(value), false);
    assert.equal(validBackup({ ...old, systemDesign: value }), false);
  }
  assert.deepEqual(systemProgress(upgraded, "requirements").checks, [false, false, false]);
});
test("unfinished system work and algorithm work survive replica merge across devices", () => {
  const s = initialState(),
    phone = new ProgressReplica("phone");
  s.done[36] = { at: 1, assisted: false };
  s.drafts[36] = { code: "unfinished Python", notes: "algorithm note", step: 1 };
  s.systemDesign.requirements = { step: 3, walkIndex: 2, plan: "A partial design that is not finished.", notes: "Ask about concurrency" };
  phone.observe(s, 10);
  const laptop = new ProgressReplica("laptop");
  laptop.merge(phone.document);
  const second = laptop.state();
  laptop.accept(second);
  assert.equal(second.systemDesign.requirements.plan, s.systemDesign.requirements.plan);
  assert.equal(second.drafts[36].code, "unfinished Python");
  second.systemDesign.requirements.notes = "Laptop note";
  laptop.observe(second, 20);
  s.systemDesign.requirements.plan = "A newer phone explanation with an explicit invariant.";
  phone.observe(s, 30);
  phone.merge(laptop.document);
  laptop.merge(phone.document);
  assert.deepEqual(phone.state(), laptop.state());
  assert.equal(phone.state().systemDesign.requirements.notes, "Laptop note");
  assert.equal(phone.state().systemDesign.requirements.plan, s.systemDesign.requirements.plan);
  assert.ok(validDocument(phone.document));
  assert.equal(validDocument({ version: 1, records: { "systemDesign/requirements/__proto__": { at: 1, device: "x", value: {} } } }), false);
});
test("capacity, cache and queue models respect units and saturation boundaries", () => {
  const defaults = systemProgress(initialState(), "estimates");
  const capacity = capacityModel(defaults);
  assert.equal(capacity.daily, 86400);
  assert.equal(capacity.average, 1);
  assert.equal(capacity.peak, 10);
  assert.equal(capacity.capacity, 100);
  assert.equal(cacheModel(defaults).misses, 100);
  assert.equal(cacheModel({ ...defaults, labHit: 0 }).overloaded, true);
  assert.equal(cacheModel({ ...defaults, labHit: 100 }).misses, 0);
  assert.equal(queueModel(defaults).backlog, 120);
  assert.equal(queueModel(defaults).drainSeconds, Infinity);
  assert.equal(queueModel({ ...defaults, labWorkers: 4, labBacklog: 100 }).backlog, 40);
  assert.equal(queueModel({ ...defaults, labWorkers: 4, labBacklog: 100 }).drainSeconds, 20);
  assert.equal(queueModel({ ...defaults, labWorkers: 4, labBacklog: 0 }).backlog, 0);
  assert.equal(queueModel({ ...defaults, labArrival: 6, labBacklog: 100 }).backlog, 100);
});

test("untrusted system lesson names cannot access inherited objects", () => {
  assert.equal(systemLessonById.constructor, undefined);
  assert.equal(validSystemProgress({ constructor: {} }), false);
  assert.equal(validDocument({ version: 1, records: { "systemDesign/constructor/notes": { at: 1, device: "x", value: "unsafe" } } }), false);
});
