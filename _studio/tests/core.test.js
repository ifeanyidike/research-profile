import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { lessons, modules, route, courseStages } from "../../algo-studio/curriculum.js";
import { checkpoints, transferTasks } from "../../algo-studio/practice-bank.js";
import { searchTrace, insertionTrace, bfsTrace, measure, reviewDate } from "../../algo-studio/algorithms.js";

test("All lessons have stable IDs, complete content, and a prerequisite-safe route", () => {
  assert.equal(lessons.length, 60);
  assert.equal(modules.length, 10);
  assert.equal(route.length, lessons.length);
  assert.equal(new Set(route).size, lessons.length);
  const positions = new Map(route.map((id, i) => [id, i]));
  for (const [i, l] of lessons.entries()) {
    assert.equal(l.id, i);
    assert.ok(courseStages[l.module][4].includes(l.id));
    assert.ok(checkpoints[i]);
    assert.equal(l.minutes, null);
    for (const dependency of l.requires) assert.ok(positions.get(dependency) < positions.get(i), `${i} must follow ${dependency}`);
    assert.ok(typeof l.simpleIdea === "string" && l.simpleIdea.length > 30);
    assert.ok(typeof l.simpleCost === "string" && l.simpleCost.length > 30);
    assert.ok(!l.solution.includes("tick()"));
    assert.ok(l.walk.length >= 3);
    assert.ok(l.tests.length >= 3);
    assert.ok(l.hints.length >= 2);
    for (const q of [l.predict, l.reflect]) assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length);
  }
});

test("All 132 lesson, checkpoint, and transfer solutions satisfy every provided case", () => {
  const run = spawnSync(
    "python3",
    [
      "-c",
      `
import json, sys, copy
lessons = json.load(sys.stdin)
count = 0
for lesson in lessons:
    for case in lesson['tests']:
        ns = {'tick': lambda: None}
        exec(compile(lesson['solution'], '<student>', 'exec'), ns)
        args = copy.deepcopy(case['args'])
        actual = ns['solve'](*args)
        assert actual == case['expected'], (lesson['id'], case, actual)
        for i in lesson.get('unchangedArgs', []):
            assert args[i] == case['args'][i], (lesson['id'], 'changed input')
        count += 1
print(count)
`,
    ],
    {
      input: JSON.stringify([
        ...lessons,
        ...Object.entries(checkpoints).map(([id, t]) => ({ ...t, id: `checkpoint:${id}` })),
        ...Object.entries(transferTasks).map(([id, t]) => ({ ...t, id: `transfer:${id}` })),
      ]),
      encoding: "utf8",
      timeout: 20000,
    }
  );
  assert.equal(run.status, 0, run.stderr);
  assert.equal(Number(run.stdout.trim()), 480);
});

test("Search traces terminate with correct answers, including empty and missing input", () => {
  for (const binary of [false, true]) {
    for (const [a, target, expected] of [
      [[1, 3, 7, 9], 7, 2],
      [[1, 3, 7], 4, -1],
      [[], 1, -1],
      [[4], 4, 0],
    ]) {
      const trace = searchTrace(a, target, binary),
        last = trace.at(-1);
      if (expected < 0) assert.match(last.text, /absent/);
      else assert.equal(last.active[0], expected);
    }
  }
});

test("Insertion visualization handles duplicates, negative values and empty lists", () => {
  for (const values of [[9, 4, 7, 2, 8, 3], [-4, 2, -4, 0], [], [1]])
    assert.deepEqual(
      insertionTrace(values).at(-1).values,
      [...values].sort((a, b) => a - b)
    );
});

test("Lab counts actual comparisons and preserves logarithmic versus linear differences", () => {
  assert.deepEqual(measure("search", 64), { n: 64, slow: 64, fast: 7 });
  assert.deepEqual(measure("sort", 4), { n: 4, slow: 6, fast: 4 });
  assert.equal(measure("sort", 256).slow, (256 * 255) / 2);
  assert.ok(measure("sort", 256).fast < measure("sort", 256).slow);
  assert.equal(bfsTrace().at(-1).queue.length, 0);
});

test("Review scheduling increases the interval and caps at 30 days", () => {
  const day = 86400000;
  assert.equal(reviewDate(0, 0), day);
  assert.equal(reviewDate(1, 0), 3 * day);
  assert.equal(reviewDate(2, 0), 7 * day);
  assert.equal(reviewDate(20, 0), 30 * day);
});
