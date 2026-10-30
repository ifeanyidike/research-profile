// Offline only: authored JSON, pure URL/card rendering, and the real in-memory store.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { videoEmbed, videoLink } from "../../learning-studio/video.js";
import { resourceCards, assignmentSummary, formatTime } from "../../learning-studio/resources.js";
import { workspaceStores } from "../../cyber-studio/model.js";
const read = (slug) => JSON.parse(fs.readFileSync(new URL(`../../${slug}/curriculum.json`, import.meta.url))).modules;
const studios = ["cyber-studio", "voice-ai-studio", "child-development-studio"];

test("bounded excerpts keep absolute start and end in both URL and explicit-range forms", () => {
  const original = "https://video.cs50.io/UuIEbpQms8o?start=966&end=2697";
  let u = new URL(videoEmbed(original));
  assert.equal(u.pathname, "/embed/UuIEbpQms8o");
  assert.equal(u.searchParams.get("start"), "966");
  assert.equal(u.searchParams.get("end"), "2697");
  u = new URL(videoEmbed("https://youtu.be/UuIEbpQms8o?t=3h", { start: 966, end: 2697 }));
  assert.equal(u.searchParams.get("start"), "966");
  assert.equal(u.searchParams.get("end"), "2697");
  assert.equal(new URL(videoLink(original)).searchParams.get("t"), "966s");
  assert.equal(formatTime(4952), "1:22:32");
  assert.equal(formatTime(0), "0:00");
  for (const segment of [
    { start: -1, end: 30 },
    { start: 30, end: 30 },
    { start: 31, end: 30 },
    { start: 0.5, end: 30 },
    { start: 0, end: Infinity },
  ]) {
    assert.equal(videoEmbed("https://youtu.be/UuIEbpQms8o", segment), null);
  }
  assert.equal(videoEmbed("https://youtube.com.attacker.example/watch?v=UuIEbpQms8o"), null);
});

test("all three authored curricula have explicit scope, stable keys, valid source links and bounded segments", () => {
  for (const slug of studios)
    for (const m of read(slug)) {
      const keys = new Set();
      assert.ok(m.study_focus?.trim(), `${slug}/${m.id}: study assignment`);
      assert.ok(m.videoNote?.trim(), `${slug}/${m.id}: video coverage`);
      for (const type of ["video", "reading"])
        for (const r of m[type + "s"]) {
          assert.ok(r.assignment?.length > 40, `${slug}/${m.id}/${r.label}: bounded purpose`);
          assert.match(r.progressKey, new RegExp(`^${type}:[0-9]{1,3}$`));
          assert.ok(!keys.has(r.progressKey), `${slug}/${m.id}: reused key`);
          keys.add(r.progressKey);
          assert.equal(new URL(r.url).protocol, "https:");
          if (type === "video") assert.ok(["segments", "sections", "full"].includes(r.watchMode), r.label);
          if (r.segments) {
            assert.ok(r.segments.length > 0, "An excerpt assignment cannot silently become a full recording");
            assert.equal(r.watchMode, "segments");
            assert.equal(new URL(r.timingSource).protocol, "https:");
            assert.ok(r.durationSeconds > 0, r.label + ": full duration checked");
            let end = 0;
            for (const s of r.segments) {
              assert.ok(Number.isSafeInteger(s.start) && Number.isSafeInteger(s.end));
              assert.ok(s.start >= end && s.end > s.start && s.end <= r.durationSeconds, `${m.id}: range outside recording/order`);
              assert.ok(s.label?.trim());
              end = s.end;
              const url = new URL(videoEmbed(r.playbackUrl || r.url, s));
              assert.equal(url.searchParams.get("end"), String(s.end));
              assert.equal(Number(url.searchParams.get("start") || 0), s.start);
            }
          }
        }
    }
});

test("Cyber replacement cannot inherit completion from Scratch and original source keys survive reordering", () => {
  const rows = new Map(),
    db = { getItem: (k) => rows.get(k) ?? null, setItem: (k, v) => rows.set(k, v) };
  const store = workspaceStores(db, new Set(["O01", "O03"]), () => 100)("guest");
  store.update("ifeanyi", "O01", { resources: JSON.stringify(["video:0", "reading:0"]) });
  const o01 = read("cyber-studio").find((m) => m.id === "O01");
  assert.equal(o01.videos[0].progressKey, "video:100");
  const checked = JSON.parse(store.record("ifeanyi", "O01").values.resources);
  const replaced = resourceCards(o01.videos, "video", checked);
  assert.match(replaced, /data-resource="video:100"/);
  assert.doesNotMatch(replaced, /data-resource="video:100" checked/);
  assert.doesNotMatch(replaced, /data-resource="video:0" checked/);
  assert.doesNotMatch(resourceCards(o01.readings, "reading", checked), /data-resource="reading:100" checked/);
  const o03 = read("cyber-studio").find((m) => m.id === "O03");
  const reordered = [...o03.videos].reverse();
  const html = resourceCards(reordered, "video", ["video:0"]);
  const cards = html.split('<article class="resource">').slice(1);
  const accounts = cards.find((card) => card.includes("kUovJpWqEMk"));
  const privacy = cards.find((card) => card.includes("6IeqJtudKnk"));
  assert.match(accounts, /data-resource="video:0" checked/);
  assert.doesNotMatch(privacy, / checked/);
  assert.doesNotMatch(html, /data-resource="video:2" checked/);
});

test("actual card renderer displays ranges and escapes source/assignment markup", () => {
  const resource = {
    label: "<img src=x onerror=alert(1)>",
    url: "https://youtu.be/UuIEbpQms8o",
    progressKey: "video:100",
    durationSeconds: 7000,
    watchMode: "segments",
    assignment: "Compare <b>binary</b> with text.",
    segments: [{ start: 966, end: 2697, label: "Binary & encodings" }],
  };
  const html = resourceCards([resource], "video", []);
  assert.match(html, /16:06–44:57/);
  assert.match(html, /start=966&amp;end=2697/);
  assert.match(html, /t=966s/);
  assert.ok(html.includes("&lt;img"));
  assert.ok(!html.includes("<img"));
  assert.ok(html.includes("Compare &lt;b&gt;binary&lt;/b&gt;"));
  assert.match(assignmentSummary(resource), /16:06–44:57/);
});

test("reported high-impact source mismatches and unintended full replays stay corrected", () => {
  const c = Object.fromEntries(read("cyber-studio").map((m) => [m.id, m]));
  const v = Object.fromEntries(read("voice-ai-studio").map((m) => [m.id, m]));
  const d = Object.fromEntries(read("child-development-studio").map((m) => [m.id, m]));
  assert.ok(!JSON.stringify(c.O01).includes("UuIEbpQms8o"));
  assert.ok(!JSON.stringify(v.V01.videos).includes("module-7-speech-recognition"));
  assert.ok(!JSON.stringify(c.N03.videos).includes("ywKVVlEwk1w"));
  assert.ok(!JSON.stringify(c.D07.videos).includes("OiWJ6VLJRz8"));
  assert.ok(d.C04.readings[0].url.includes("schoolage-6-to-12"));
  assert.ok(d.C12.readings[1].url.includes("leedscommunityhealthcare"));
  assert.equal(c.D05.videos[1].segments[0].end, 5097);
  assert.ok(v.V08.videos.find((r) => r.url.includes("lYYkEx1Qx8s")).optional);
  assert.ok(v.V19.videos.find((r) => r.url.includes("thwZ-G8Gk6I")).optional);
  assert.ok(v.V23.videos[0].optional);
  assert.ok(d.P15.videos[0].optional);
});
