// Static curriculum/renderer checks only; no network, provider or model execution.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { resourceCards, formatTime } from "../../learning-studio/resources.js";
const modules = JSON.parse(fs.readFileSync(new URL("../../voice-ai-studio/curriculum.json", import.meta.url))).modules;
const lessons = JSON.parse(fs.readFileSync(new URL("../../voice-ai-studio/lessons.json", import.meta.url)));
const byId = Object.fromEntries(modules.map((m) => [m.id, m]));
test("Voice resource guides address learners rather than carrying author instructions or foreign lesson claims", () => {
  for (const m of modules)
    for (const r of [...m.videos, ...m.readings]) {
      const text = [r.assignment, r.note, r.accessNote, r.contentReview?.note].filter(Boolean).join(" ");
      assert.doesNotMatch(text, /\bnative\b|Keep (?:full|complete)|Assign \d|must define|Fix the old|narrows the previous|\b[LM]0\d\b/i, m.id);
      if (m.id !== "V42") assert.doesNotMatch(text, /\bCyber\b/, m.id);
    }
  const libraries = byId.V04.videos.find((r) => r.progressKey === "video:100");
  assert.doesNotMatch(libraries.assignment, /supplies.*timezone/i);
  const tests = byId.V04.videos.find((r) => r.progressKey === "video:1");
  assert.match(tests.assignment, /checks\.py uses ordinary Python assertions/);
  assert.match(lessons.V13.guide.teaching, /An affricate begins with a stop-like closure/);
  assert.match(lessons.V13.guide.teaching, /A tap uses one very brief contact/);
  assert.match(lessons.V14.guide.bridge, /Resonance means.*frequencies/);
  assert.match(lessons.V14.guide.bridge, /changing acoustic tube/);
});
test("optional tree examples and course indexes cannot silently become core viewing or reading", () => {
  for (const key of ["video:0", "video:1"]) assert.equal(byId.V17.videos.find((r) => r.progressKey === key).optional, true);
  for (const m of modules) {
    const requiredCmu = m.videos.some(
      (r) => !r.optional && (r.url.includes("deeplearning.cs.cmu.edu/S22/") || /^(?:CMU\b|Carnegie Mellon)/.test(r.label))
    );
    if (!requiredCmu) for (const r of m.readings.filter((r) => r.url.includes("deeplearning.cs.cmu.edu/S22/"))) assert.equal(r.optional, true, m.id);
  }
  assert.match(byId.V14.study_focus, /optional source–filter derivation comes after V16/);
  assert.match(byId.V24.study_focus, /multilingual lecture slides/);
  assert.match(byId.V28.study_focus, /Pronunciation reading/);
  for (const fixture of ["mid-sentence pause", "backchannel", "genuine interruption", "background speaker", "assistant echo"])
    assert.ok(byId.V36.study_focus.includes(fixture));
});
test("V31 transcript reading preserves the video excerpt boundary and V29 labels its historical claims", () => {
  const video = byId.V31.videos.find((r) => r.progressKey === "video:0"),
    reading = byId.V31.readings.find((r) => r.progressKey === "reading:1");
  for (const segment of video.segments) assert.ok(reading.assignment.includes(`${formatTime(segment.start)}–${formatTime(segment.end)}`));
  assert.match(reading.assignment, /rest of the 28:03 transcript is optional/);
  const history = byId.V29.videos.find((r) => r.progressKey === "video:1");
  assert.match(history.assignment, /descriptions of 2019, not current performance claims/);
  assert.doesNotMatch(byId.V21.videos.find((r) => r.progressKey === "video:0").assignment, /20:26/);
});
test("retired duplicate reading keys remain reserved while source transcripts stay accessible", () => {
  const amendments = JSON.parse(fs.readFileSync(new URL("../resource-amendments-20261031.json", import.meta.url)));
  for (const retired of amendments.retirements.filter((r) => r.studio === "voice-ai-studio")) {
    const m = byId[retired.topic];
    assert.ok(!m.readings.some((r) => r.progressKey === retired.progressKey));
    assert.ok(m.videos.some((r) => r.url.includes("speech.zone")));
    assert.ok(!resourceCards(m.readings, "reading", [retired.progressKey]).includes(`data-resource="${retired.progressKey}"`));
  }
  assert.equal(byId.V11.readings[0].optional, true);
  assert.match(byId.V11.readings[0].assignment, /same material.*second pass is optional/);
});
