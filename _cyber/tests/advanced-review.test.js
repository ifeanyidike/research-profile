// Static curriculum and pure-renderer regressions; no exercise/model/provider execution.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { passCriteria, additionalExample } from "../../learning-studio/lesson-sections.js";
const modules = JSON.parse(fs.readFileSync(new URL("../../cyber-studio/curriculum.json", import.meta.url))).modules;
const lessons = JSON.parse(fs.readFileSync(new URL("../../cyber-studio/lessons.json", import.meta.url)));
const byId = Object.fromEntries(modules.map((m) => [m.id, m]));
test("advanced completion notes match the actual workshop and required resources", () => {
  assert.doesNotMatch(byId.D07.note, /eight/);
  assert.match(byId.D07.note, /MITRE Lessons 1–7/);
  assert.match(byId.D10.note, /required work uses the supplied synthetic process snapshot/);
  assert.match(byId.D10.note, /optional extension/);
  assert.match(byId.R02.note, /sum\/mean script/);
  assert.doesNotMatch(lessons.W01.guide.teaching, /local B01 page/);
  const w01 = byId.W01.videos.find((r) => r.progressKey === "video:100");
  assert.match(w01.assignment, /public page or the paper fixture/);
});
test("advanced prose separates words and counts while preserving code and domain identifiers", () => {
  const allowed = new Set([
    "note1",
    "note2",
    "sqlite3",
    "RS256",
    "IPv4",
    "IPv6",
    "ControlSet001",
    "python3",
    "sha256",
    "SHA256",
    "private1",
    "privateA1",
    "publicD1",
  ]);
  for (const module of modules.slice(modules.findIndex((m) => m.id === "W01")))
    for (const [field, value] of Object.entries(lessons[module.id].guide)) {
      const prose = value.replace(/```[\s\S]*?```|`[^`\n]+`|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|https?:\/\/[^\s]+/g, "");
      for (const match of prose.matchAll(/\b[A-Za-z]{2,}\d+\b/g)) assert.ok(allowed.has(match[0]), `${module.id}/${field}: ${match[0]}`);
    }
  assert.match(lessons.A02.guide.teaching, /give 0/);
  assert.match(lessons.D05.guide.challenge_solution, /remains 6/);
  assert.match(lessons.A06.guide.teaching, /native code auditing/);
  assert.match(lessons.F02.guide.teaching, /unsafe native libraries/);
  assert.match(lessons.I02.guide.example, /note_id=private1/);
  assert.match(lessons.I08.guide.example, /send\(privateA1,X\)/);
});
test("W15 requires the CSRF foundation and the framework is searchable by its proper name", () => {
  assert.ok(byId.W15.prerequisites.includes("W04"));
  const matches = modules.filter((m) => [m.id, m.title, ...m.skills].join(" ").toLowerCase().includes("att&ck"));
  assert.ok(matches.some((m) => m.id === "D06"));
});
test("Assess renders actual AI scope criteria and optional examples remain accessible and escaped", () => {
  assert.ok(passCriteria(byId.I01).includes("Do not claim mock data demonstrate live model behaviour"));
  const html = additionalExample(lessons.I01.example);
  assert.match(html, /^<details class="lesson-extra"><summary>Optional:/);
  assert.doesNotMatch(html, /<details[^>]*\bopen/);
  assert.ok(html.includes("in Learn"));
  assert.ok(additionalExample("<img src=x>").includes("&lt;img"));
  assert.ok(passCriteria({ outcomes: ["<script>"], pass_criteria: "unused" }).includes("&lt;script&gt;"));
});
test("practice instructions name the tab containing their data", () => {
  assert.match(lessons.W11.guide.exercise, /test matrix in Learn/);
  assert.match(lessons.D06.guide.exercise, /case taught in Learn/);
  assert.match(lessons.D07.guide.teaching, /exercise in Practise/);
  assert.match(lessons.A01.guide.teaching, /idempotency exercise in Practise/);
  for (const module of modules.slice(modules.findIndex((m) => m.id === "W01")))
    assert.doesNotMatch(
      [module.note, ...Object.values(lessons[module.id].guide)].join(" "),
      /native (exercise|lesson|bridge|workshop|packet|fixture|proof|tasks)/i
    );
});
