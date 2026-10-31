// Offline resource-scope checks: fixed data and pure renderer, never external playback.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { resourceCards, formatTime } from "../../learning-studio/resources.js";
const modules = Object.fromEntries(
  JSON.parse(fs.readFileSync(new URL("../../cyber-studio/curriculum.json", import.meta.url))).modules.map((m) => [m.id, m])
);
test("separated cache recordings have direct links, bounded players and fresh completion keys", () => {
  const cards = modules.A04.videos.slice(0, 3);
  assert.deepEqual(
    cards.map((r) => r.progressKey),
    ["video:400", "video:401", "video:402"]
  );
  assert.deepEqual(
    cards.map((r) => r.durationSeconds),
    [432, 354, 429]
  );
  for (const r of cards) {
    assert.match(r.url, /c14s2v[567]\/$/);
    assert.match(r.playbackUrl, /youtube.com\/watch/);
    assert.equal(r.watchMode, "segments");
  }
  const html = resourceCards(cards, "video", ["video:0"]);
  assert.equal((html.match(/data-video=/g) || []).length, 4);
  assert.doesNotMatch(html, /<input\b[^>]*\bchecked(?:\s|>|=)/);
  assert.equal(
    cards.flatMap((r) => r.segments).reduce((sum, s) => sum + s.end - s.start, 0),
    773
  );
});
test("cloud responsibility covers the previously skipped PaaS material and network defense finishes its framing", () => {
  const cloud = modules.D03.videos[0];
  assert.equal(cloud.progressKey, "video:400");
  assert.deepEqual(
    cloud.segments.map((s) => [s.start, s.end]),
    [
      [154, 290],
      [291, 455],
    ]
  );
  assert.match(cloud.assignment, /PaaS.*SaaS.*correction/);
  const defence = modules.F04.videos.find((r) => r.progressKey === "video:1");
  assert.equal(defence.segments[0].end, 1564);
});
test("source labels distinguish written corroboration and remove unrelated evidence", () => {
  const source = modules.W15.videos[0].contentReview.sources.find((s) => s.url.includes("portswigger.net"));
  assert.match(source.label, /lab description and written solution/);
  assert.doesNotMatch(source.label, /^Publisher transcript/);
  assert.ok(modules.C06.videos[0].contentReview.sources.every((s) => !s.url.includes("docker.com")));
  assert.equal(modules.D07.videos.find((r) => r.progressKey === "video:6").contentReview.sources.length, 1);
  const sysmon = modules.D07.readings.find((r) => r.progressKey === "reading:100");
  assert.match(sysmon.assignment, /event 13.*value-set.*Procmon RegQueryValue.*not a Sysmon query event/);
  for (let n = 1; n <= 8; n++) assert.doesNotMatch(modules["I0" + n].note, /course trailer|paid access/);
  assert.ok(modules.N01.readings.every((r) => r.label !== "PDF"));
  assert.match(modules.N04.readings.find((r) => r.progressKey === "reading:2").assignment, /section 2.7/);
});
test("Cyber guide times come from metadata and do not carry other studios or authoring history", () => {
  const range = /\b\d+:\d{2}(?::\d{2})?\s*[–-]\s*\d+:\d{2}(?::\d{2})?\b/;
  for (const m of Object.values(modules))
    for (const r of m.videos) {
      assert.doesNotMatch(r.assignment, range, `${m.id}/${r.progressKey}`);
      assert.doesNotMatch(r.assignment, /\bV\d{2}\b|Voice uses|\b(?:Replace|Narrow|Assign) the\b|old cutoff/, `${m.id}/${r.progressKey}`);
      const html = resourceCards([r], "video", []);
      for (const segment of r.segments || []) {
        assert.ok(html.includes(`${formatTime(segment.start)}–${formatTime(segment.end)}`), `${m.id}: excerpt range absent`);
        assert.match(html, /stop at|stopping at each/, `${m.id}: excerpt stop absent`);
      }
    }
});
test("a repeated evidence note is shown once and a full recording gets a generated viewing range", () => {
  const item = {
    label: "Fixture",
    url: "https://www.youtube.com/watch?v=UuIEbpQms8o",
    progressKey: "video:0",
    watchMode: "full",
    durationSeconds: 304,
    assignment: "One complete guidance sentence.",
    contentReview: {
      method: "transcript-reviewed",
      note: "One complete guidance sentence.",
      sources: [{ label: "Captions", url: "https://www.youtube.com/watch?v=UuIEbpQms8o" }],
    },
  };
  const html = resourceCards([item], "video", []);
  assert.equal(html.split(item.assignment).length - 1, 1);
  assert.ok(html.includes("Watch full recording · 0:00–5:04"));
  assert.ok(html.includes("How this source was checked"));
});
test("required source guidance distinguishes current protocols, precise sections and optional catalogues", () => {
  const reading = (id, key) => modules[id].readings.find((r) => r.progressKey === key);
  assert.match(modules.P04.readings.find((r) => r.url.includes("datetime")).assignment, /[Aa]ware.*naive/);
  assert.match(reading("P06", "reading:0").assignment, /lock files belong to the separate Metaprogramming reading/);
  assert.match(reading("S03", "reading:1").assignment, /block size.*output size/);
  assert.equal(reading("S05", "reading:0").optional, true);
  assert.doesNotMatch(modules.S05.note, /Berkeley reading.*current TLS/);
  assert.match(reading("S05", "reading:2").assignment, /CertificateVerify.*Finished/);
  assert.match(reading("D05", "reading:2").assignment, /Aggregation and joins.*separately linked/);
  for (const m of Object.values(modules))
    for (const r of m.readings)
      if (/cybok\.org|gaia\.cs\.umass\.edu.*wireshark\.php|seedsecuritylabs\.org\/Labs_20\.04\/$/.test(r.url))
        assert.equal(r.optional, true, `${m.id}/${r.progressKey}: catalogue is optional navigation`);
});
