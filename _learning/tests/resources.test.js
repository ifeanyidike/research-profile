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
    contentReview: {
      method: "description-only",
      note: "Check <script>alert(1)</script> & scope.",
      sources: [{ label: "Evidence <img src=x>", url: "https://example.com/evidence?x=1&y=2" }],
    },
  };
  const html = resourceCards([resource], "video", []);
  assert.match(html, /16:06–44:57/);
  assert.match(html, /start=966&amp;end=2697/);
  assert.match(html, /t=966s/);
  assert.ok(html.includes("&lt;img"));
  assert.ok(!html.includes("<img"));
  assert.ok(html.includes("Compare &lt;b&gt;binary&lt;/b&gt;"));
  assert.match(assignmentSummary(resource), /16:06–44:57/);
  assert.match(html, /Content check: Spoken content unverified/);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /https:\/\/example.com\/evidence\?x=1&amp;y=2/);
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
  assert.ok(v.V23.videos.find((r) => r.url.includes("q3CmsZFlrnc")).optional);
  assert.ok(d.P15.videos.find((r) => r.url.includes("BwCVJCymmt8")).optional);
});

test("formerly reading-led topics have timed, scoped core videos without losing existing source identities", () => {
  const review = JSON.parse(fs.readFileSync(new URL("../video-gap-review-20261030.json", import.meta.url)));
  const topics = Object.fromEntries(studios.flatMap((slug) => read(slug).map((m) => [`${slug}/${m.id}`, m])));
  assert.equal(review.topics.length, 33);
  for (const [slug, ids] of Object.entries(review.topicGroups))
    for (const id of ids) {
      const key = `${slug}/${id}`;
      const topic = topics[key];
      assert.ok(
        topic.videos.some((r) => !r.optional),
        `${id}: missing core video`
      );
      assert.doesNotMatch(topic.videoNote, /no closely matched public teaching video|Reading-led topic/i);
      for (const old of review.previousVideos[key]) {
        const current = topic.videos.find((r) => r.progressKey === old.progressKey);
        assert.equal(current?.url, old.url, `${id}: completion identity reassigned`);
        if (old.optional && id !== "V35") assert.equal(current.optional, true, `${id}: an old refresher became required`);
      }
    }
  for (const assignment of review.assignments) {
    const r = topics[`${assignment.studio}/${assignment.topic}`].videos.find((r) => r.progressKey === assignment.progressKey);
    assert.equal(r?.url, assignment.url);
    assert.equal(r.label, assignment.label);
    assert.equal(r.durationSeconds, assignment.durationSeconds);
    assert.equal(Boolean(r.optional), assignment.optional);
    const assigned = r.segments ? r.segments.reduce((n, s) => n + s.end - s.start, 0) : r.durationSeconds;
    assert.equal(assigned, assignment.assignedSeconds);
    const html = resourceCards([r], "video", []);
    assert.ok(html.includes(r.segments ? "stop at" : "0:00–"), `${assignment.topic}: no visible viewing range`);
    if (!assignment.reused) assert.ok(Number(r.progressKey.split(":")[1]) >= 100);
  }
});

test("content evidence stays attached to the reviewed assignment and exposes unresolved speech checks", () => {
  const review = JSON.parse(fs.readFileSync(new URL("../video-content-review-20261030.json", import.meta.url)));
  const topics = Object.fromEntries(studios.flatMap((slug) => read(slug).map((m) => [`${slug}/${m.id}`, m])));
  const counts = {};
  const seen = new Set();
  const labels = {
    "transcript-reviewed": "Content check: Transcript reviewed",
    "teaching-material-reviewed": "Content check: Teaching material reviewed · speech unverified",
    "description-only": "Content check: Spoken content unverified",
  };
  for (const a of review.assignments) {
    const key = `${a.studio}/${a.topic}/${a.progressKey}`;
    assert.ok(!seen.has(key), "Duplicate content review: " + key);
    seen.add(key);
    const r = topics[`${a.studio}/${a.topic}`].videos.find((r) => r.progressKey === a.progressKey);
    assert.deepEqual(
      {
        label: r.label,
        url: r.url,
        playbackUrl: r.playbackUrl || r.url,
        watchMode: r.watchMode,
        timingSource: r.timingSource,
        assignment: r.assignment,
        durationSeconds: r.durationSeconds,
        segments: r.segments || [],
      },
      a.reviewedAssignment,
      key + ": assignment changed after content review"
    );
    assert.deepEqual(r.contentReview, { method: a.method, note: a.note, sources: a.sources }, key + ": evidence changed after review");
    assert.ok(labels[a.method]);
    assert.ok(a.sources.length && a.findings.length && a.limits.length, key + ": evidence scope missing");
    for (const source of a.sources) assert.equal(new URL(source.url).protocol, "https:");
    const html = resourceCards([r], "video", []);
    assert.ok(html.includes(labels[a.method]), key + ": evidence level not visible");
    assert.ok(assignmentSummary(r).includes(labels[a.method]), key + ": source-map evidence level missing");
    assert.ok(html.includes(r.contentReview.note));
    assert.ok(html.includes(a.sources[0].url));
    counts[a.method] = (counts[a.method] || 0) + 1;
  }
  assert.equal(seen.size, 44);
  assert.deepEqual(counts, review.statusCounts);
  for (const [key, m] of Object.entries(topics))
    for (const r of m.videos) if (r.contentReview) assert.ok(seen.has(`${key}/${r.progressKey}`), "Untracked content claim");
  const defence = topics["cyber-studio/R03"].videos.find((r) => r.progressKey === "video:100");
  assert.equal(defence.segments[0].start, 2490);
  assert.equal(defence.segments[0].end, 2893);
  assert.match(topics["cyber-studio/R03"].videoNote, /6:43/, "R03: obsolete core-viewing duration");
  assert.doesNotMatch(topics["cyber-studio/R03"].videoNote, /11:36/);
});
