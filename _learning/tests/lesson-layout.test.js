// Pure rendering checks: no browser, network, provider or evaluation calls.
import test from "node:test";
import assert from "node:assert/strict";
import { lessonDetails } from "../../learning-studio/lesson-details.js";
import { resourceCards } from "../../learning-studio/resources.js";
const topic = { id: "V02", skills: ["Python"], outcomes: ["Explain a function"], prerequisites: ["V01"] };
test("lesson context starts collapsed but retains goals, linked prerequisites and self-assessed progress", () => {
  const html = lessonDetails(topic, { read: true, practice: true, passedAt: 100 }, ["V01"], { V01: { title: "First topic" } });
  assert.match(html, /^<details class="lesson-details">/);
  assert.doesNotMatch(html, /<details[^>]*\bopen\b/);
  assert.match(html, /1 prerequisite to review/);
  assert.match(html, /#lesson\/V01\/learn/);
  assert.match(html, /Explain a function/);
  assert.match(html, /✓ Introduction understood/);
  assert.match(html, /✓ Self-assessed pass/);
  assert.doesNotMatch(html, /Self-assessed on/);
});
test("collapsed context escapes lesson text and keeps Cyber topics without outcomes usable", () => {
  const html = lessonDetails({ id: "C01", skills: ["<script>bad</script>"], prerequisites: [] }, {}, [], {});
  assert.ok(html.includes("Topics covered"));
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(!html.includes("<script>"));
  assert.ok(html.includes("No earlier topic required."));
});
test("resource cards open the first required guide and keep all times and completion identities outside the guides", () => {
  const item = (key, optional) => ({
    label: "Video " + key,
    url: "https://www.youtube.com/watch?v=UuIEbpQms8o",
    progressKey: key,
    optional,
    watchMode: "segments",
    durationSeconds: 300,
    segments: [{ start: 30, end: 90, label: "Assigned part" }],
    assignment: "Watch the assigned part and explain the mechanism in your own words.",
  });
  const html = resourceCards([item("video:0", true), item("video:100", false), item("video:101", false)], "video", ["video:101"]);
  const cards = html.split('<article class="resource">').slice(1);
  assert.equal(cards.length, 3);
  for (let i = 0; i < 3; i++) {
    const cut = cards[i].indexOf('<details class="resource-study"');
    assert.ok(cards[i].slice(0, cut).includes("0:30–1:30"));
    assert.ok(cards[i].slice(0, cut).includes("1:00 total"));
    assert.equal(/<details class="resource-study" open>/.test(cards[i]), i === 1);
    assert.ok(cards[i].lastIndexOf('class="resource-check"') > cards[i].lastIndexOf("</details>"));
  }
  assert.match(cards[2], /data-resource="video:101" checked/);
  assert.doesNotMatch(cards[0], /<input\b[^>]*\bchecked(?:\s|>|=)/);
  assert.ok(!html.includes("<iframe"));
});
