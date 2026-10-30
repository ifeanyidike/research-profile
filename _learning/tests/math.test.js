// Pure offline scheduling tests; the rendering engine is the only mocked boundary.
import test from "node:test";
import assert from "node:assert/strict";
import { createTypesetter } from "../../learning-studio/math.js";
const node = (textContent = "\\(x^2\\)") => ({ isConnected: true, textContent, querySelectorAll: () => [] });
const deferred = () => {
  let resolve;
  const promise = new Promise((done) => (resolve = done));
  return { promise, resolve };
};
const turn = () => new Promise((done) => setImmediate(done));

test("math stays lazy for ordinary text and code without delimiters", async () => {
  let loads = 0;
  const math = createTypesetter(() => {
    loads++;
    throw Error("Must not load");
  });
  await math.typeset([node("No equation here: Python sample_count / rate.")]);
  assert.equal(loads, 0);
});

test("navigation while the engine loads never typesets the removed view", async () => {
  const loaded = deferred(),
    calls = [];
  const engine = {
    typesetClear() {},
    async typesetPromise(roots) {
      calls.push(roots);
    },
  };
  const math = createTypesetter(() => loaded.promise),
    old = node(),
    current = node("\\[y=2\\]");
  const first = math.typeset([old]);
  await turn();
  old.isConnected = false;
  const second = math.typeset([current]);
  loaded.resolve(engine);
  await Promise.all([first, second]);
  assert.deepEqual(calls, [[current]]);
});

test("asynchronous typesetting is serialized and removed in-flight math is cleared", async () => {
  const gate = deferred(),
    calls = [],
    cleared = [];
  let active = 0,
    maximum = 0;
  const old = node(),
    current = node();
  const engine = {
    typesetClear(roots) {
      cleared.push(roots);
    },
    async typesetPromise(roots) {
      active++;
      maximum = Math.max(maximum, active);
      calls.push(roots);
      if (roots[0] === old) await gate.promise;
      active--;
    },
  };
  const math = createTypesetter(async () => engine);
  const first = math.typeset([old]);
  await turn();
  old.isConnected = false;
  math.clear(old);
  const second = math.typeset([current]);
  await turn();
  assert.equal(calls.length, 1);
  gate.resolve();
  await Promise.all([first, second]);
  assert.equal(maximum, 1);
  assert.deepEqual(calls, [[old], [current]]);
  assert.ok(cleared.some((roots) => roots.includes(old)));
});

test("a load failure does not poison plain pages or a later retry", async () => {
  let attempts = 0,
    rendered = 0;
  const math = createTypesetter(async () => {
    if (++attempts === 1) throw Error("Offline asset");
    return {
      typesetClear() {},
      async typesetPromise() {
        rendered++;
      },
    };
  });
  await assert.rejects(math.typeset([node()]), /Offline asset/);
  await math.typeset([node("Plain page")]);
  assert.equal(attempts, 1);
  await math.typeset([node()]);
  assert.equal(rendered, 1);
});
