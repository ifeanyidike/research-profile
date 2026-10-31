import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createStore, learningState, parseBackup, mergeRecords } from "../../cyber-studio/model.js";
const modules = JSON.parse(fs.readFileSync(new URL("../../cyber-studio/curriculum.json", import.meta.url))).modules;
const lessons = JSON.parse(fs.readFileSync(new URL("../../cyber-studio/lessons.json", import.meta.url)));
const ids = new Set(modules.map((m) => m.id));
const memory = () => {
  const m = new Map();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) };
};
test("93 lessons have full teaching, valid source URLs and a topological prerequisite map", () => {
  assert.equal(ids.size, 93);
  const seen = new Set();
  for (const m of modules) {
    assert.ok(
      m.prerequisites.every((p) => seen.has(p)),
      m.id
    );
    seen.add(m.id);
    const l = lessons[m.id];
    for (const f of ["concept", "mechanism", "example", "pitfall"]) assert.ok(l[f].length > (f === "pitfall" ? 50 : 80), `${m.id} ${f}`);
    for (const field of ["bridge", "teaching", "example", "explanation", "exercise", "solution", "challenge", "challenge_solution"]) {
      assert.equal(typeof l.guide[field], "string", `${m.id} ${field}`);
      assert.ok(l.guide[field].trim().length > 40, `${m.id} ${field} needs authored content`);
      assert.ok(!l.guide[field].includes("\u0000"), `${m.id} literal contains a null byte`);
    }
    assert.equal(m.practice, l.guide.exercise);
    assert.equal(m.assessment, l.guide.challenge);
    assert.ok(l.check.choices[l.check.answer]);
    assert.equal(new Set(l.check.choices).size, 3);
    for (const r of [...m.videos, ...m.readings, ...m.practice_links]) assert.equal(new URL(r.url).protocol, "https:");
    assert.ok(m.videos.length && m.readings.length && m.practice && m.assessment && m.pass_criteria);
  }
});
test("profiles and signed-in accounts never share progress, including on reload", () => {
  const db = memory();
  const a = createStore(
      db,
      ids,
      () => 100,
      () => {},
      "account:a"
    ),
    b = createStore(
      db,
      ids,
      () => 100,
      () => {},
      "account:b"
    );
  a.update("ifeanyi", "O01", { notes: "Private A" });
  a.update("partner", "O01", { notes: "Separate guest" });
  assert.equal(b.record("ifeanyi", "O01").values.notes, undefined);
  assert.equal(a.record("partner", "O01").values.notes, "Separate guest");
  assert.equal(
    createStore(
      db,
      ids,
      () => 100,
      () => {},
      "account:a"
    ).record("ifeanyi", "O01").values.notes,
    "Private A"
  );
});
test("partial updates preserve other tab edits and old imports cannot overwrite newer fields", () => {
  const db = memory();
  const a = createStore(db, ids, () => 100),
    b = createStore(db, ids, () => 200);
  a.update("ifeanyi", "O01", { notes: "original" });
  const old = a.exportBackup("ifeanyi", "A");
  b.update("ifeanyi", "O01", { notes: "new" });
  a.update("ifeanyi", "O01", { practice: true });
  a.importBackup("ifeanyi", old);
  assert.deepEqual(a.record("ifeanyi", "O01").values, { notes: "new", practice: true });
});
test("invalid imports fail before any record is written", () => {
  const s = createStore(memory(), ids, () => 100);
  const data = s.exportBackup("ifeanyi", "A");
  data.lessons.O01 = { values: { notes: "would be imported" }, changed: { notes: 100 } };
  data.lessons.O02 = { values: { passedAt: "not a number" }, changed: { passedAt: 100 } };
  assert.throws(() => s.importBackup("ifeanyi", data));
  assert.deepEqual(s.record("ifeanyi", "O01").values, {});
  for (const value of ["null", "[]", '{"kind":"other"}']) assert.throws(() => parseBackup(value, ids));
  const proto = JSON.parse('{"values":{"__proto__":"bad"},"changed":{"__proto__":100}}');
  assert.throws(() => s.importBackup("ifeanyi", { ...data, lessons: { O01: proto } }));
});
test("quota failure retains subsequent edits and makes them exportable", () => {
  const db = memory();
  const statuses = [];
  const s = createStore(
    db,
    ids,
    () => 100,
    (ok) => statuses.push(ok)
  );
  s.update("ifeanyi", "O01", { notes: "disk" });
  db.setItem = () => {
    throw Error("quota");
  };
  s.update("ifeanyi", "O01", { notes: "memory" });
  s.update("ifeanyi", "O01", { evidence: "also memory" });
  assert.equal(s.exportBackup("ifeanyi", "A").lessons.O01.values.notes, "memory");
  assert.equal(s.record("ifeanyi", "O01").values.evidence, "also memory");
  assert.equal(statuses.at(-1), false);
});
test("review schedule cannot advance early and stops after three reviews", () => {
  let now = 1000;
  const s = createStore(memory(), ids, () => now);
  s.pass("ifeanyi", "O01");
  assert.throws(() => s.review("ifeanyi", "O01"));
  for (const stage of [1, 2, 3]) {
    now = s.record("ifeanyi", "O01").values.reviewAt;
    s.review("ifeanyi", "O01");
    assert.equal(s.record("ifeanyi", "O01").values.reviewStage, stage);
  }
  assert.equal(s.record("ifeanyi", "O01").values.reviewAt, 0);
  assert.throws(() => s.review("ifeanyi", "O01"));
});
test("next recommendation honours prerequisites rather than merely choosing the next ID", () => {
  const s = learningState(modules, {});
  assert.equal(s.next.id, "O01");
  const records = { O01: { passedAt: 10 } };
  assert.equal(learningState(modules, records).ready(modules.find((m) => m.id === "R03")), false);
});
test("field merge preserves independently edited notes and practice", () => {
  assert.deepEqual(
    mergeRecords(
      { values: { notes: "new" }, changed: { notes: 200 } },
      { values: { notes: "old", practice: true }, changed: { notes: 100, practice: 150 } }
    ).values,
    { notes: "new", practice: true }
  );
});
test("equal-time conflicting edits converge in both directions, including Unicode", () => {
  for (const [a, b] of [
    ["alpha", "zeta"],
    ["\ue000", "😀"],
    [true, false],
    [10, 20],
  ]) {
    const field = typeof a === "boolean" ? "practice" : typeof a === "number" ? "passedAt" : "notes";
    const x = { values: { [field]: a }, changed: { [field]: 100 } },
      y = { values: { [field]: b }, changed: { [field]: 100 } };
    assert.deepEqual(mergeRecords(x, y), mergeRecords(y, x));
  }
});
test("a successful small setting write cannot hide an unsaved lesson", () => {
  const db = memory(),
    statuses = [];
  const original = db.setItem;
  const s = createStore(
    db,
    ids,
    () => 100,
    (ok) => statuses.push(ok)
  );
  db.setItem = (k, v) => {
    if (!k.includes(":settings:")) throw Error("full");
    original(k, v);
  };
  s.update("ifeanyi", "O01", { notes: "unsaved" });
  s.setSetting("theme", "dark");
  assert.equal(statuses.at(-1), false);
  assert.equal(s.exportBackup("ifeanyi", "A").lessons.O01.values.notes, "unsaved");
});
test("malformed imported resource checklists cannot crash a lesson view", () => {
  const s = createStore(memory(), ids, () => 100);
  for (const resources of ["{}", "null", "[1]", '["bad"]']) assert.throws(() => s.update("ifeanyi", "O01", { resources }));
  s.update("ifeanyi", "O01", { resources: '["video:0","reading:1"]' });
  assert.equal(s.record("ifeanyi", "O01").values.resources, '["video:0","reading:1"]');
});

test("M04 retrieval answer agrees with the worked alert counts rather than recall", () => {
  const lesson = lessons.M04;
  const match = lesson.guide.example.match(/incident\s+(\d+)\s+(\d+)\nbenign\s+(\d+)\s+(\d+)/);
  assert.ok(match, "Worked confusion table is present");
  const [, tp, fn, fp, tn] = match.map(Number);
  const nativeIncidents = Number(lesson.example.match(/suppose (\d+) are malicious/)[1]);
  const nativeCaught = Number(lesson.example.match(/catches (\d+)/)[1]);
  const [, rateText, benignText] = lesson.example.match(/flags (\d+)% of ([\d,]+) benign events/);
  const nativeBenign = Number(benignText.replaceAll(",", ""));
  const nativeFalseAlerts = (Number(rateText) * nativeBenign) / 100;
  assert.deepEqual(
    [nativeCaught, nativeIncidents - nativeCaught, nativeFalseAlerts, nativeBenign - nativeFalseAlerts],
    [tp, fn, fp, tn],
    "Native example and displayed guide describe the same population and detector"
  );
  const precisionPercent = Math.round((tp / (tp + fp)) * 1000) / 10;
  const recallPercent = (tp / (tp + fn)) * 100;
  assert.notEqual(precisionPercent, recallPercent, "The example distinguishes precision from recall");
  assert.ok(lesson.check.choices[lesson.check.answer].includes(String(precisionPercent)));
  assert.ok(lesson.check.explanation.includes("90") && lesson.check.explanation.includes("99"));
});
