// Offline curriculum checks: local content and hand-sized arithmetic only.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const read = (path) => JSON.parse(fs.readFileSync(new URL("../../" + path, import.meta.url)));
const voice = read("voice-ai-studio/lessons.json");
const child = read("child-development-studio/lessons.json");
const cyber = read("cyber-studio/lessons.json");
test("new numeric assessments require inputs distinct from their worked examples and have correct reference answers", () => {
  const v8 = voice.V08.guide;
  assert.match(v8.challenge, /3,−1/);
  const a = 3,
    b = -1,
    eta = 0.1;
  const next = [a - eta * 2 * (a - 1), b - eta * 4 * (b + 2)];
  const loss = (x, y) => (x - 1) ** 2 + 2 * (y + 2) ** 2;
  assert.ok(Math.abs(loss(...next) - 3.28) < 1e-10);
  assert.match(v8.challenge_solution, /3\.28/);
  assert.doesNotMatch(v8.teaching, /3\.28/);
  const x = [1, 1, -1, -1];
  const dft = x.map((_, k) =>
    x.reduce(([re, im], v, n) => [re + v * Math.cos((2 * Math.PI * k * n) / 4), im - v * Math.sin((2 * Math.PI * k * n) / 4)], [0, 0])
  );
  for (const [k, [re, im]] of [
    [0, [0, 0]],
    [1, [2, -2]],
    [2, [0, 0]],
    [3, [2, 2]],
  ]) {
    assert.ok(Math.abs(dft[k][0] - re) < 1e-10);
    assert.ok(Math.abs(dft[k][1] - im) < 1e-10);
  }
  assert.match(voice.V15.guide.challenge, /1,1,-1,-1/);
  assert.match(voice.V15.guide.challenge_solution, /2-2i/);
  const first = [0.3 * 0.5, 0.7 * 0.4],
    transitions = [
      [0.7, 0.3],
      [0.4, 0.6],
    ],
    emission = [0.6, 0.3];
  const second = emission.map((e, s) => Math.max(...first.map((score, r) => score * transitions[r][s] * e)));
  assert.ok(Math.abs(second[0] - 0.0672) < 1e-12);
  assert.ok(Math.abs(second[1] - 0.0504) < 1e-12);
  assert.match(voice.V21.guide.challenge_solution, /0\.0672/);
  assert.doesNotMatch(voice.V21.guide.teaching, /0\.0672/);
});
test("source guidance resolves current lesson content and assigned reading identities", () => {
  for (const slug of ["voice-ai-studio", "child-development-studio"]) {
    const lessons = read(slug + "/lessons.json");
    const answers = Object.values(lessons).map((l) => l.check.answer);
    for (let period = 1; period <= 6; period++)
      assert.ok(
        answers.some((a, i) => i >= period && a !== answers[i - period]),
        "quiz position must not cycle"
      );
  }
  for (const slug of ["cyber-studio", "voice-ai-studio", "child-development-studio"])
    for (const m of read(slug + "/curriculum.json").modules)
      for (const r of m.readings)
        assert.doesNotMatch(r.assignment, /Read the named article or specified sections/, `${slug}/${m.id}/${r.progressKey}`);
  const modules = read("child-development-studio/curriculum.json").modules;
  const byId = Object.fromEntries(modules.map((m) => [m.id, m]));
  assert.match(child.G03.guide.teaching, /Aided-language modelling/);
  assert.match(child.G03.guide.exercise, /partner-modelling/);
  assert.match(child.C07.guide.teaching, /informed, voluntary/);
  assert.match(child.G06.guide.teaching, /last-resort emergency/);
  assert.doesNotMatch(child.G06.guide.teaching, /programmes, restraint and other/);
  assert.match(child.G10.guide.teaching, /stay with the young person/);
  assert.match(child.P04.guide.exercise, /two-year-old/);
  assert.match(child.P03.guide.teaching, /test–teach–retest/);
  assert.ok(byId.P09.readings.some((r) => r.url.includes("dmcn.14132")));
  assert.match(voice.V19.guide.teaching, /A token is one discrete unit/);
  assert.match(voice.V37.guide.exercise, /120,180,240,360,480,6000/);
  assert.match(voice.V37.guide.solution, /75 ms/);
});
test("corrected code exercises explain observable failure and full traces", () => {
  assert.match(cyber.P05.guide.solution, /abcdefghi and abc!/);
  assert.match(cyber.P05.guide.solution, /stops that test method/);
  assert.doesNotMatch(cyber.C04.guide.example, /\/\/[^\n]*\\\n/);
  assert.ok(cyber.L02.guide.example.startsWith("#!/bin/sh\n"));
  assert.match(cyber.N04.guide.example, /SO_REUSEADDR/);
  assert.match(cyber.C03.guide.solution, /\[0,1\).*\[0,0\)/);
  assert.match(cyber.P06.guide.solution, /b\.add\("second"\)[\s\S]*b\.entries == \["second"\]/);
  assert.match(cyber.S03.guide.teaching, /key-derivation function/);
  assert.match(cyber.M04.guide.teaching, /birthday scale/);
});
test("every copied Child safety boundary retains its emergency limits and safeguarding actions", () => {
  for (const id of ["C10", "G06", "G07", "P11"]) {
    const text = child[id].guide.teaching;
    for (const clause of [/last-resort emergency/, /imminent serious harm/, /never serve punishment/, /prompt recording/, /safeguarding review/])
      assert.match(text, clause, `${id}: ${clause}`);
  }
  for (const id of ["G10", "P13"])
    for (const clause of [/Ask clearly/, /stay with the young person/, /reduce access/])
      assert.match(child[id].guide.teaching, clause, `${id}: ${clause}`);
  assert.match(child.C09.guide.teaching, /boundary in C10/);
  assert.match(child.P11.guide.teaching, /do not implement it[\s\S]*safeguarding lead or supervisor/);
  assert.doesNotMatch(child.P11.guide.teaching, /trying it at home/);
});
test("Child terminology is defined before the learner must use it, and assessment questions are explicit", () => {
  assert.match(child.C08.guide.teaching, /Receptive language means understanding language; expressive language means using language/);
  assert.match(child.C10.guide.teaching, /result that has been keeping a behaviour going/);
  assert.doesNotMatch(child.C10.guide.teaching, /reinforcing consequence previously maintaining/);
  assert.match(child.P12.guide.teaching, /A means the baseline phase/);
  assert.match(child.P12.guide.teaching, /Level means the typical height/);
  assert.match(
    child.P03.guide.example,
    /true positive \(TP\)[\s\S]*false negative \(FN\)[\s\S]*false positive \(FP\)[\s\S]*true negative \(TN\)[\s\S]*\\mathrm\{TP\}/
  );
  assert.match(child.P04.guide.exercise, /Add a dynamic-assessment question/);
  for (const [id, lesson] of Object.entries(child)) assert.doesNotMatch(Object.values(lesson.guide).join("\n"), /\bnative\b/i, id);
});
test("Voice criteria match supplied tasks and foundational terms are explained without later prerequisites", () => {
  const byId = Object.fromEntries(read("voice-ai-studio/curriculum.json").modules.map((m) => [m.id, m]));
  assert.match(byId.V20.outcomes[0], /speaker's sessions.*one partition.*unseen-speaker/);
  assert.doesNotMatch(byId.V20.pass_criteria, /pretraining\/adaptation\/test/);
  assert.match(byId.V41.outcomes[1], /reported timing setup and endpoints/);
  assert.doesNotMatch(byId.V41.pass_criteria, /Trace frame timing|cascaded translation/);
  assert.match(voice.V04.guide.challenge_solution, /assert total_ms\(\[\{"duration_ms": 20\}, \{"duration_ms": 35\}\]\) == 55/);
  assert.doesNotMatch(voice.V05.guide.explanation, /only that file/);
  assert.match(voice.V05.guide.explanation, /together with its fictional JSON fixture/);
  assert.doesNotMatch(voice.V14.mechanism, /convolution|spectra/);
  assert.match(voice.V14.mechanism, /strengthens some source harmonics and weakens others/);
  assert.match(voice.V24.guide.teaching, /A quantizer maps.*finite set[\s\S]*A codebook is a learned table/);
  assert.match(byId.V04.study_focus, /Weeks 3, 4, 6 and 5 in card order/);
  assert.match(byId.V22.study_focus, /part 1 and read.*Graves paper; part 2 is optional/);
  for (const id of ["V01", "V18", "V19", "V34"]) assert.doesNotMatch(byId[id].videoNote, /\b(former|now (has|have|only)|replace[sd]?)\b/);
  assert.doesNotMatch(voice.V12.example, /TeX arithmetic/);
  assert.doesNotMatch(voice.V41.guide.teaching, /is now only/);
  assert.match(voice.V30.guide.teaching, /paper on Watch & read/);
  assert.doesNotMatch(byId.V06.videos[1].assignment, /This lesson connects this to phase/);
});
