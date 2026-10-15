import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { lessons, route } from "../../algo-studio/curriculum.js";

test("Every lesson introduces work and memory in words before optional mathematical notation", () => {
  for (const l of lessons) {
    assert.ok(l.simpleCost !== l.cost, `technical fallback in lesson ${l.id}`);
    assert.ok(l.costMemory && l.words.length, `missing explanation in lesson ${l.id}`);
    assert.doesNotMatch(
      l.simpleIdea + " " + l.simpleCost,
      /O\(|T\(n\)|pseudo-polynomial|unit-cost|inverse Ackermann/,
      `formula-first explanation in lesson ${l.id}`
    );
  }
  assert.ok(route.indexOf(38) < route.indexOf(39));
  assert.ok(route.indexOf(39) < route.indexOf(24));
  assert.doesNotMatch(JSON.stringify(lessons[38]), /T\(n\)|recurrence/i);
  assert.match(lessons[24].costExtra.paragraphs.join(" "), /Let T\(n\) mean/);
  assert.equal(lessons[38].reflect.answer, 0);
  assert.match(lessons[38].reflect.options[0], /^5:/);
});

test("New numerical teaching examples agree with the actual Python solutions", () => {
  const cases = [
    ...lessons[38].costRows.rows.map(([n, rounds]) => ({ id: 38, args: [n], expected: rounds })),
    ...lessons[26].costRows.rows.map(([n, count]) => ({ id: 26, args: [Array.from({ length: n }, (_, i) => i)], count })),
    {
      id: 57,
      args: [
        [2, 1, 3, 4],
        [
          ["prefix", 3],
          ["add", 0, 5],
          ["prefix", 3],
        ],
      ],
      expected: [6, 11],
    },
    { id: 58, args: ["aaab", "aab"], expected: 1 },
  ];
  const tasks = cases.map((c) => ({ ...c, solution: lessons[c.id].solution }));
  const run = spawnSync(
    "python3",
    [
      "-c",
      `import json,sys
for t in json.load(sys.stdin):
 ns={};exec(t['solution'],ns);actual=ns['solve'](*t['args'])
 if 'count' in t: actual=len(actual);expected=t['count']
 else: expected=t['expected']
 assert actual==expected,(t['id'],actual,expected)
print('all teaching examples match')`,
    ],
    { input: JSON.stringify(tasks), encoding: "utf8", timeout: 10000 }
  );
  assert.equal(run.status, 0, run.stderr);
  for (const [n, rounds, placements] of lessons[24].costRows.rows) {
    assert.equal(rounds, Math.log2(n));
    assert.equal(placements, n * rounds);
  }
});
