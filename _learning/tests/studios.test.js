// Offline only: local JSON, in-memory stores and mocked Supabase I/O.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createModel } from "../../learning-studio/model.js";
import { Account } from "../../learning-studio/account.js";
const read = (slug, file) => JSON.parse(fs.readFileSync(new URL(`../../${slug}/${file}`, import.meta.url)));
const memory = () => {
  const rows = new Map();
  return { getItem: (key) => rows.get(key) ?? null, setItem: (key, value) => rows.set(key, value) };
};
for (const [slug, count, table] of [
  ["voice-ai-studio", 44, "voice_ai_progress"],
  ["child-development-studio", 40, "child_development_progress"],
]) {
  const modules = read(slug, "curriculum.json").modules,
    lessons = read(slug, "lessons.json"),
    ids = new Set(modules.map((m) => m.id));
  const config = (await import("../../" + slug + "/config.js")).default;
  const model = createModel(slug);
  test(`${slug}: full original lessons, source assignments and prerequisite closure`, () => {
    assert.equal(config.slug, slug);
    assert.equal(config.table, table);
    assert.equal(config.stageDescriptions.length, new Set(modules.map((m) => m.stage)).size);
    const sql = fs.readFileSync(new URL("../supabase/setup.sql", import.meta.url), "utf8");
    const tableBlock = sql.split("create table if not exists public." + table + " (")[1]?.split("record jsonb")[0];
    assert.ok(tableBlock, "Missing dedicated progress table");
    const allowed = [...tableBlock.matchAll(/\x27([A-Z][0-9]{2})\x27/g)].map((match) => match[1]);
    assert.deepEqual(new Set(allowed), ids, "SQL and curriculum IDs differ");
    assert.equal(ids.size, count);
    assert.equal(new Set(modules.map((m) => m.pass_criteria)).size, count, "Assessment rubrics must be topic-specific");
    assert.equal(Object.keys(lessons).length, count);
    const seen = new Set();
    for (const m of modules) {
      assert.ok(
        m.prerequisites.every((p) => seen.has(p)),
        m.id
      );
      seen.add(m.id);
      assert.equal(m.outcomes.length, 3, `${m.id}: three observable criteria`);
      assert.ok(m.outcomes.every((outcome) => typeof outcome === "string" && outcome.trim()));
      assert.equal(m.pass_criteria, m.outcomes.map((item, i) => `${i + 1}. ${item}`).join(" "));
      assert.ok(m.study_focus.length > 80, `${m.id}: explicit source assignment`);
      assert.ok(m.videoNote.length > 80, `${m.id}: coverage/access must be stated even with videos`);
      const l = lessons[m.id];
      for (const field of ["concept", "mechanism", "pitfall"]) assert.ok(l[field].length > 70, `${m.id} ${field}`);
      for (const field of ["bridge", "teaching", "example", "explanation", "exercise", "solution", "challenge", "challenge_solution"])
        assert.ok(l.guide[field].length > 80, `${m.id} ${field}`);
      assert.ok(l.guide.teaching.length > 450, m.id);
      assert.equal(m.practice, l.guide.exercise);
      assert.equal(m.assessment, l.guide.challenge);
      assert.equal(l.check.choices.length, 3);
      assert.equal(new Set(l.check.choices).size, 3);
      assert.ok(l.check.choices[l.check.answer]);
      assert.ok(m.videos.length || m.videoNote.length > 80, m.id);
      assert.ok(m.readings.length, m.id);
      for (const source of [...m.videos, ...m.readings, ...m.practice_links]) {
        assert.equal(new URL(source.url).protocol, "https:");
        assert.ok(source.label.length > 8);
        const u = new URL(source.url);
        if (u.hostname === "ifeanyidike.com") assert.ok(fs.existsSync(new URL(`../../${u.pathname.slice(1)}`, import.meta.url)), source.url);
      }
      assert.ok(m.pass_criteria.length > 80);
    }
    if (slug === "child-development-studio") {
      const byId = Object.fromEntries(modules.map((m) => [m.id, m]));
      for (const [track, size] of [
        ["caregiver", 24],
        ["professional", 28],
      ]) {
        const selected = modules.filter((m) => m.tracks.includes(track));
        assert.equal(selected.length, size);
        for (const m of selected)
          assert.ok(
            m.prerequisites.every((p) => byId[p].tracks.includes(track)),
            `${track} ${m.id}`
          );
      }
    }
  });
  test(`${slug}: accounts, guests, backups and quota recovery retain boundaries`, () => {
    const db = memory(),
      get = model.workspaceStores(db, ids, () => 100),
      first = modules[0].id;
    get("account:a").update("ifeanyi", first, { notes: "Private A" });
    get("guest").update("partner", first, { notes: "Fav guest" });
    assert.equal(get("account:b").record("ifeanyi", first).values.notes, undefined);
    assert.equal(get("account:a").record("partner", first).values.notes, undefined);
    const backup = get("account:a").exportBackup("ifeanyi", "A");
    assert.equal(backup.kind, `${slug}-progress`);
    db.setItem = () => {
      throw Error("quota");
    };
    get("account:a").update("ifeanyi", first, { notes: "Recover A" });
    get("account:b");
    assert.equal(get("account:a").exportBackup("ifeanyi", "A").lessons[first].values.notes, "Recover A");
    assert.equal(get("guest").record("partner", first).values.notes, "Fav guest");
    const invalid = { ...backup, lessons: { ...backup.lessons, unexpected: { values: { notes: "bad" }, changed: { notes: 200 } } } };
    assert.throws(() => get("account:b").importBackup("ifeanyi", invalid));
    assert.deepEqual(get("account:b").record("ifeanyi", first).values, {});
  });
  test(`${slug}: two mocked devices merge independent fields and JSONB reorder is a no-op`, async () => {
    const server = new Map();
    let writes = 0;
    function device(uid) {
      const get = model.workspaceStores(
        memory(),
        ids,
        (() => {
          let n = 100;
          return () => ++n;
        })()
      );
      let store;
      const client = {
        auth: { signOut: async () => ({ error: null }) },
        from(name) {
          assert.equal(name, table);
          return {
            select() {
              return {
                async eq(_, user) {
                  return {
                    data: [...(server.get(user) || new Map())].map(([lesson_id, record]) => ({
                      lesson_id,
                      record: JSON.parse(JSON.stringify({ changed: record.changed, values: record.values })),
                    })),
                    error: null,
                  };
                },
              };
            },
            upsert(rows) {
              return {
                async select() {
                  writes++;
                  const records = server.get(uid) || new Map();
                  server.set(uid, records);
                  const data = rows.map((row) => {
                    assert.equal(row.user_id, uid);
                    const record = model.mergeRecords(records.get(row.lesson_id) || { values: {}, changed: {} }, row.record);
                    records.set(row.lesson_id, record);
                    return { lesson_id: row.lesson_id, record };
                  });
                  return { data, error: null };
                },
              };
            },
          };
        },
      };
      const a = new Account({
        client,
        ids,
        table,
        kind: `${slug}-progress`,
        model,
        switchUser: (user) => {
          store = get(user ? `account:${user.id}` : "guest");
        },
        store: () => store,
        status() {},
        changed() {},
      });
      return { a, store: () => store };
    }
    const a = device("a"),
      b = device("a"),
      other = device("b"),
      id = modules[0].id;
    await a.a.select({ id: "a" });
    await b.a.select({ id: "a" });
    a.store().update("ifeanyi", id, { notes: "A note" });
    await a.a.sync();
    b.store().update("ifeanyi", id, { practice: true });
    await b.a.sync();
    await a.a.sync();
    assert.deepEqual(a.store().record("ifeanyi", id).values, { notes: "A note", practice: true });
    const before = writes;
    await a.a.sync();
    assert.equal(writes, before);
    await other.a.select({ id: "b" });
    assert.deepEqual(other.store().record("ifeanyi", id).values, {});
  });
}
test("two studios never share local records or accept each other's backups", () => {
  const db = memory(),
    a = createModel("voice-ai-studio"),
    b = createModel("child-development-studio"),
    ids = new Set(["same"]);
  const x = a.createStore(
      db,
      ids,
      () => 100,
      () => {},
      "account:a"
    ),
    y = b.createStore(
      db,
      ids,
      () => 100,
      () => {},
      "account:a"
    );
  x.update("ifeanyi", "same", { notes: "Voice only" });
  assert.equal(y.record("ifeanyi", "same").values.notes, undefined);
  assert.throws(() => b.parseBackup(JSON.stringify(x.exportBackup("ifeanyi", "A")), ids));
});
test("shared merge converges on equal timestamps, including Unicode and key-order changes", () => {
  const model = createModel("voice-ai-studio");
  const a = { values: { notes: "😀", practice: true }, changed: { notes: 100, practice: 200 } },
    b = { changed: { practice: 200, notes: 100 }, values: { practice: true, notes: "😀" } };
  assert.ok(model.sameRecord(a, b));
  const c = { values: { notes: "\ue000" }, changed: { notes: 100 } };
  assert.deepEqual(model.mergeRecords(a, c), model.mergeRecords(c, a));
});

test("renderer, entry points and data consumers use one release version", async () => {
  const root = new URL("../../", import.meta.url);
  const shared = fs.readFileSync(new URL("learning-studio/app.js", root), "utf8");
  for (const slug of ["voice-ai-studio", "child-development-studio"]) {
    const config = (await import(`../../${slug}/config.js`)).default;
    const html = fs.readFileSync(new URL(`${slug}/index.html`, root), "utf8");
    const entry = fs.readFileSync(new URL(`${slug}/app.js`, root), "utf8");
    const versions = [...(html + entry + shared).matchAll(/(?:\?v=|version: ")([0-9]{8}-[0-9]+)/g)].map((match) => match[1]);
    assert.ok(versions.length >= 7, "Entry/styles/config/shared imports are covered");
    assert.ok(
      versions.every((version) => version === config.version),
      `${slug}: mixed cached schema/runtime`
    );
  }
});

test("revised source order preserves old completion identities without marking new material watched", () => {
  const modules = read("voice-ai-studio", "curriculum.json").modules;
  const topic = (id) => modules.find((m) => m.id === id);
  assert.equal(topic("V08").videos.find((v) => v.url.includes("lYYkEx1Qx8s")).progressKey, "video:0");
  assert.equal(topic("V17").videos.find((v) => v.url.endsWith("decision-tree/")).progressKey, "video:0");
  assert.equal(topic("V17").videos[0].progressKey, "video:100");
  assert.equal(topic("V30").videos[0].progressKey, "video:100", "Old impulse-response checkbox cannot count a new codec talk");
  assert.equal(topic("V15").readings.find((r) => r.url.includes("chapter1/preprocessing")).progressKey, "reading:0");
  for (const slug of ["voice-ai-studio", "child-development-studio"])
    for (const m of read(slug, "curriculum.json").modules) {
      const resources = [...m.videos, ...m.readings];
      assert.equal(new Set(resources.map((r) => r.progressKey)).size, resources.length, m.id);
      for (const r of resources) assert.match(r.progressKey, /^(video|reading):[0-9]{1,3}$/);
    }
});
