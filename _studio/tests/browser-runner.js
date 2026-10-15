(async () => {
  const checks = [];
  const assert = (x, m) => {
    if (!x) throw Error(m);
    checks.push(m);
  };
  const wait = async (fn) => {
    const start = Date.now();
    while (!fn()) {
      if (Date.now() - start > 20000) throw Error("UI timeout");
      await new Promise((r) => setTimeout(r, 80));
    }
  };
  location.hash = "lesson/0";
  await new Promise((r) => setTimeout(r, 150));
  document.querySelector('[data-step="2"]').click();
  const run = async (code) => {
    const e = document.querySelector("#code-editor");
    e.value = code;
    e.dispatchEvent(new Event("input"));
    document.querySelector("#run-code").click();
    await wait(() => !document.querySelector("#run-code").disabled);
    return document.querySelector("#test-results").textContent;
  };
  const bad = await run("def solve(items, target)\n    return -1");
  assert(bad.includes("SyntaxError"), "Invalid Python reports a syntax error");
  assert(!document.querySelector("#run-code").disabled, "Editor recovers after syntax errors");
  const infinite = await run(
    "def solve(items, target):\n    while True:\n        try:\n            while True:\n                pass\n        except BaseException:\n            pass"
  );
  assert(infinite.includes("stopped after 5 seconds"), "Uninterruptible Python is stopped by terminating its worker");
  const good = await run(
    "def solve(items, target):\n    for i, value in enumerate(items):\n        if value == target:\n            return i\n    return -1"
  );
  assert(good.includes("All tests passed"), "A new Python worker runs correct code after timeout");
  const e = document.querySelector("#code-editor");
  e.value += "\n# changed";
  e.dispatchEvent(new Event("input"));
  assert(document.querySelector("#practice-continue").disabled, "Editing code invalidates its previous test pass");
  location.hash = "lesson/35";
  await new Promise((r) => setTimeout(r, 100));
  assert(document.querySelector("#main").textContent.includes("pack the most useful kit"), "Advanced curriculum is reachable as a preview");
  return { passed: checks.length, checks };
})();
