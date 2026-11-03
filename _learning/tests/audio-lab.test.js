// Inspected standard-library-only unit checks. No model/provider/evaluation I/O.
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

test("local WAV lab verifies known samples, DFT phase, headers and output preservation", () => {
  const result = spawnSync("python3", ["-B", fileURLToPath(new URL("./audio_lab_check.py", import.meta.url))], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stderr, /Ran 4 tests/);
});
