// Offline DOM events only; no browser, accounts or external I/O.
import test from "node:test";
import assert from "node:assert/strict";
import { createViewRefresh } from "../../learning-studio/view-refresh.js";
test("many background updates wait for one focus exit without multiplying listeners or renders", () => {
  const rootEvents = {},
    docEvents = {},
    queue = [];
  let inside = true,
    renders = 0,
    blocked = false;
  const root = {
    ownerDocument: {
      activeElement: {},
      addEventListener: (name, fn) => {
        assert.ok(!docEvents[name]);
        docEvents[name] = fn;
      },
    },
    contains: () => inside,
    addEventListener: (name, fn) => {
      assert.ok(!rootEvents[name]);
      rootEvents[name] = fn;
    },
  };
  const gate = createViewRefresh(
    root,
    () => renders++,
    () => blocked,
    (fn) => queue.push(fn)
  );
  for (let n = 0; n < 100; n++) gate.request();
  assert.equal(renders, 0);
  assert.equal(queue.length, 0);
  // Moving within main must retain the pending refresh for the later exit.
  rootEvents.focusout();
  queue.shift()();
  assert.equal(renders, 0);
  inside = false;
  for (let n = 0; n < 100; n++) rootEvents.focusout();
  assert.equal(queue.length, 1);
  queue.shift()();
  assert.equal(renders, 1);
  // Modal dismissal flushes a blocked update once.
  blocked = true;
  gate.request();
  assert.equal(renders, 1);
  blocked = false;
  docEvents.close();
  queue.shift()();
  assert.equal(renders, 2);
  gate.request();
  assert.equal(renders, 3);
  gate.reset();
  docEvents.close();
  queue.shift()();
  assert.equal(renders, 3);
});
