// Offline content contracts and pure packaging only; no network, labs or model I/O.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
const root = new URL("../../", import.meta.url);
const read = (p) => JSON.parse(fs.readFileSync(new URL(p, root), "utf8"));
const lessons = read("cyber-studio/lessons.json"),
  modules = Object.fromEntries(read("cyber-studio/curriculum.json").modules.map((m) => [m.id, m]));
test("foundations coverage labels agree with the actual assigned scope and primer", () => {
  assert.ok(modules.C04.skills.includes("linked lists"));
  assert.doesNotMatch(modules.C04.skills.join(" "), /hash table|trees/);
  assert.match(lessons.C04.guide.challenge, /two linked nodes/i);
  assert.match(modules.O03.skills.join(" "), /device locking/);
  assert.match(lessons.O03.guide.teaching, /screen lock/);
  assert.doesNotMatch(modules.B01.skills.join(" "), /CSS|storage/);
  assert.match(modules.B01.study_focus, /HTML form.*JavaScript event handler.*DOM/);
  assert.doesNotMatch(modules.M02.readings[0].label, /\b8\b/);
  assert.match(modules.M02.readings[0].assignment, /Chapter 8 is unavailable/);
  assert.match(modules.S05.videoNote, /simplified map.*RFC 8446 supplies exact ordering/);
  assert.match(lessons.M01.guide.teaching, /numerator.*denominator[\s\S]*percentage means[\s\S]*ratio compares/);
  assert.match(lessons.M01.guide.exercise, /convert 1\/4.*20% of 100.*selected:total ratio/);
  assert.ok(lessons.M03.concept.includes("\\gcd(a,n)=1"));
});
test("the port reference bounds decimal syntax before conversion and documents padding and oversized input", () => {
  const text = lessons.P05.guide.challenge_solution;
  assert.ok(text.includes('return re.fullmatch(r"[0-9]{1,5}", text) is not None and 1 <= int(text) <= 65535'));
  assert.match(text, /00080.*more than five digits/);
  assert.match(text, /"0"\*5000.*return False without raising/);
});
test("foundation prose separates words from numbers while preserving code, TeX and real identifiers", () => {
  const ids =
    "O01 O02 O03 M01 P01 P02 P03 P04 P05 L01 L02 P06 L03 M02 M03 M04 M05 C01 C02 C03 C04 C05 C06 C07 N01 N02 N03 N04 N05 N06 B01 B02 B03 B04 S01 S02 S03 S04 S05 S06".split(
      " "
    );
  const protectedPart = /```[\s\S]*?```|`[^`\n]+`|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|https?:\/\/[^\s]+/g;
  const joined =
    /\b(?:and|or|in|needs|seeing|ends|replaced|computes|one|mod|TLS|TTL|about|random|chosen|chooses|accept|reject|precision|recall|destinations|remains|preference)\d/;
  for (const id of ids)
    for (const [field, text] of Object.entries(lessons[id].guide)) assert.doesNotMatch(text.replace(protectedPart, ""), joined, `${id}/${field}`);
});
test("Cyber packaging check detects stale canonical teaching and stale derived curriculum without rewriting files", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "studios-packager-"));
  try {
    for (const dir of ["_cyber/content", "_cyber/guides", "cyber-studio"]) fs.mkdirSync(path.join(temp, dir), { recursive: true });
    for (const dir of ["_cyber/content", "_cyber/guides"]) fs.cpSync(new URL(dir, root), path.join(temp, dir), { recursive: true });
    for (const file of ["_cyber/build-lessons.py", "cyber-studio/curriculum.json", "cyber-studio/lessons.json"])
      fs.copyFileSync(new URL(file, root), path.join(temp, file));
    const run = () => spawnSync("python3", [path.join(temp, "_cyber/build-lessons.py"), "--check"], { encoding: "utf8" });
    assert.equal(run().status, 0);
    const guide = path.join(temp, "_cyber/guides/O01.json"),
      original = fs.readFileSync(guide, "utf8"),
      changed = JSON.parse(original);
    changed.teaching += "\n\nUnpackaged teaching change: Ω.";
    fs.writeFileSync(guide, JSON.stringify(changed));
    const stale = run();
    assert.notEqual(stale.status, 0);
    assert.match(stale.stderr, /Stale cyber-studio\/lessons.json/);
    assert.equal(fs.readFileSync(guide, "utf8"), JSON.stringify(changed));
    fs.writeFileSync(guide, original);
    const curriculum = path.join(temp, "cyber-studio/curriculum.json"),
      data = JSON.parse(fs.readFileSync(curriculum, "utf8"));
    data.modules[0].practice = "Stale derived brief";
    fs.writeFileSync(curriculum, JSON.stringify(data));
    const derived = run();
    assert.notEqual(derived.status, 0);
    assert.match(derived.stderr, /Stale derived curriculum fields/);
    assert.equal(JSON.parse(fs.readFileSync(curriculum, "utf8")).modules[0].practice, "Stale derived brief");
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
