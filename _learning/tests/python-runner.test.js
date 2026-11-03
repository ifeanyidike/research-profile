// Pure worker protocol/timeouts; no Python, networking, models or provider I/O.
import test from "node:test";
import assert from "node:assert/strict";
import { createPythonRunner } from "../../learning-studio/python-runner.js";
function setup() {
  const workers = [],
    timers = new Map();
  let tick = 0;
  const runner = createPythonRunner({
    makeWorker: () => {
      const w = {
        sent: [],
        postMessage(m) {
          this.sent.push(m);
        },
        terminate() {
          this.stopped = true;
        },
      };
      workers.push(w);
      return w;
    },
    schedule: (fn, ms) => {
      const id = ++tick;
      timers.set(id, { fn, ms });
      return id;
    },
    unschedule: (id) => timers.delete(id),
  });
  const message = (w, data) => w.onmessage({ data });
  return { runner, workers, timers, message };
}
test("worker loads only for Run and runs once after readiness with the intended setup", async () => {
  const x = setup();
  assert.equal(x.workers.length, 0);
  const promise = x.runner.run({ code: "print(1)", setup: "a=2", files: { "events.json": "[]" } });
  const w = x.workers[0];
  assert.deepEqual(w.sent, [{ type: "init" }]);
  x.message(w, { type: "ready" });
  x.message(w, { type: "ready" });
  assert.equal(w.sent.length, 2);
  assert.equal(w.sent[1].code, "print(1)");
  assert.equal(w.sent[1].setup, "a=2");
  x.message(w, { type: "result", id: 999, result: { output: "wrong" } });
  assert.equal(w.stopped, undefined);
  x.message(w, { type: "result", id: w.sent[1].id, result: { output: "1\n", setupOutput: "", error: "" } });
  assert.equal((await promise).output, "1\n");
  assert.equal(w.stopped, true);
  assert.equal(x.timers.size, 0);
});
test("Stop and a replacement run reject the old run and ignore its late result", async () => {
  const x = setup();
  const first = x.runner.run({ code: "first" });
  const rejected = assert.rejects(first, /another run/);
  const old = x.workers[0];
  const next = x.runner.run({ code: "second" });
  await rejected;
  assert.equal(old.stopped, true);
  x.message(old, { type: "ready" });
  const w = x.workers[1];
  x.message(w, { type: "ready" });
  x.message(old, { type: "result", id: 1, result: { output: "stale" } });
  const stopped = assert.rejects(next, /Execution stopped/);
  x.runner.stop();
  await stopped;
  assert.equal(w.stopped, true);
});
test("load/run timeouts and worker errors terminate the worker and allow a retry", async () => {
  const x = setup();
  const loading = x.runner.run({ code: "x" });
  const loadFail = assert.rejects(loading, /could not load in time/);
  assert.equal([...x.timers.values()][0].ms, 60000);
  [...x.timers.values()][0].fn();
  await loadFail;
  const running = x.runner.run({ code: "while True: pass" });
  const runFail = assert.rejects(running, /after 5 seconds/);
  x.message(x.workers[1], { type: "ready" });
  assert.equal([...x.timers.values()][0].ms, 5000);
  [...x.timers.values()][0].fn();
  await runFail;
  const error = x.runner.run({ code: "x" });
  const errorFail = assert.rejects(error, /worker stopped/);
  x.workers[2].onerror();
  await errorFail;
  assert.ok(x.workers.every((w) => w.stopped));
});

test("Unicode output stays within the Python-character cap and malformed output cannot break the UI", async () => {
  const x = setup();
  const first = x.runner.run({ code: 'print("unicode")' });
  const a = x.workers[0];
  x.message(a, { type: "ready" });
  x.message(a, { type: "result", id: a.sent[1].id, result: { output: "😀".repeat(15000), setupOutput: "", error: "" } });
  assert.equal((await first).output.length, 30000);
  const second = x.runner.run({ code: "x" });
  const rejected = assert.rejects(second, /unsupported result/);
  const b = x.workers[1];
  x.message(b, { type: "ready" });
  x.message(b, { type: "result", id: b.sent[1].id, result: { output: "x".repeat(40001), setupOutput: "", error: "" } });
  await rejected;
});
