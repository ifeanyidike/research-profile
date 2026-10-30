import test from "node:test";
import assert from "node:assert/strict";
import { workspaceStores } from "../../cyber-studio/model.js";
import { videoEmbed } from "../../cyber-studio/video.js";
test("memory-only guest and account work survives scope changes without mixing", () => {
  const get = workspaceStores(
    {
      getItem: () => null,
      setItem() {
        throw Error("quota");
      },
    },
    new Set(["O01"]),
    () => 100
  );
  get("guest").update("ifeanyi", "O01", { notes: "guest pending" });
  get("account:a").update("ifeanyi", "O01", { notes: "A pending" });
  assert.equal(get("account:b").record("ifeanyi", "O01").values.notes, undefined);
  assert.equal(get("guest").exportBackup("ifeanyi", "Guest").lessons.O01.values.notes, "guest pending");
  assert.equal(get("account:a").exportBackup("ifeanyi", "A").lessons.O01.values.notes, "A pending");
});
test("inline sources preserve excerpt boundaries without enrolling a single video in a playlist", () => {
  assert.equal(new URL(videoEmbed("https://www.youtube.com/watch?v=-FJqb60wPSY&t=1629")).searchParams.get("start"), "1629");
  assert.equal(new URL(videoEmbed("https://youtu.be/-FJqb60wPSY?t=1h22m32s")).searchParams.get("start"), "4952");
  assert.equal(
    new URL(videoEmbed("https://www.youtube.com/watch?v=THOGnEqoStQ&list=PLLGRmm150VfC6p5RMJDMe1ZgliqDfXhvd")).searchParams.get("list"),
    null
  );
  assert.equal(
    new URL(videoEmbed("https://www.youtube.com/playlist?list=PLLGRmm150VfC6p5RMJDMe1ZgliqDfXhvd")).searchParams.get("list"),
    "PLLGRmm150VfC6p5RMJDMe1ZgliqDfXhvd"
  );
  assert.ok(videoEmbed("https://video.cs50.io/JP7ITIXGpHk").endsWith("JP7ITIXGpHk"));
  assert.equal(videoEmbed("https://youtube.com.evil.example/watch?v=THOGnEqoStQ"), null);
  assert.equal(videoEmbed("not a URL"), null);
});
