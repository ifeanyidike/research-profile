import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { lessons } from "../../algo-studio/curriculum.js";
import { checkpoints, transferTasks } from "../../algo-studio/practice-bank.js";
import { extraTestCases } from "../../algo-studio/extra-test-cases.js";

const tasks = [
  ...lessons.map((t) => ({ ...t, group: "lesson" })),
  ...Object.entries(checkpoints).map(([id, t]) => ({ ...t, id: Number(id), group: "check" })),
  ...Object.entries(transferTasks).map(([id, t]) => ({ ...t, id: Number(id), group: "transfer" })),
];
const baseTasks = tasks.map((t) => ({ ...t, tests: t.tests.slice(0, -extraTestCases[t.group][t.id].length) }));

test("all 282 learner exercises receive varied additional cases without changing their teaching examples", () => {
  assert.equal(tasks.length, 282);
  for (const task of tasks) {
    const extra = extraTestCases[task.group][task.id];
    const finite = { "lesson:68": 11, "check:68": 11, "lesson:70": 13, "lesson:95": 9, "check:95": 9 };
    const domain = finite[`${task.group}:${task.id}`];
    assert.ok(domain ? task.tests.length === domain : extra.length >= 12, `${task.group}:${task.id}`);
    assert.equal(new Set(task.tests.map((t) => JSON.stringify(t.args))).size, task.tests.length, `${task.group}:${task.id}`);
    assert.ok(domain ? task.tests.length === domain : task.tests.length >= 15);
  }
  assert.deepEqual(checkpoints[4].tests[0], { args: [[1, 2, 5, 1], 2, 6], expected: 1 });
  const windows = checkpoints[4].tests;
  assert.ok(windows.some((t) => t.args[1] === 1 && t.expected >= 0));
  assert.ok(windows.some((t) => t.args[1] === 3 && t.expected >= 0));
  assert.ok(windows.some((t) => t.args[1] === t.args[0].length && t.expected >= 0));
  assert.ok(windows.some((t) => t.expected > 0 && t.expected === t.args[0].length - t.args[1]));
});

test("additional cases can be regenerated from independent specifications with no worked code execution", () => {
  const result = spawnSync("python3", ["tests/generate-extra-cases.py"], {
    input: JSON.stringify(baseTasks),
    encoding: "utf8",
    timeout: 20000,
  });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), extraTestCases);
});

test("the learner's real Python runner rejects hardcoded answers and realistic incorrect implementations", () => {
  const source = readFileSync(new URL("../../algo-studio/python-worker.js", import.meta.url), "utf8").match(/pyodide\.runPython\(`([\s\S]*?)`\)/)[1];
  const changed = (group, id, before, after) => {
    const code = tasks.find((t) => t.group === group && t.id === id).solution;
    assert.ok(code.includes(before), `${group}:${id}: mutation target is missing`);
    return code.replaceAll(before, after);
  };
  const mutants = [
    {
      group: "check",
      id: 4,
      name: "Always checks adjacent pairs instead of k elements",
      code: `def solve(items, k, target):
    if k <= 0 or k > len(items): return -1
    for i in range(len(items)-1):
        if items[i] + items[i+1] >= target: return i
    return -1`,
    },
    { group: "check", id: 4, name: "Skips the final window", code: changed("check", 4, "range(k,len(items))", "range(k,len(items)-1)") },
    { group: "check", id: 4, name: "Rejects equality with the target", code: changed("check", 4, ">=", ">") },
    {
      group: "check",
      id: 4,
      name: "Never subtracts the outgoing value",
      code: changed("check", 4, "total += items[i] - items[i-k]", "total += items[i]"),
    },
    { group: "check", id: 3, name: "Returns duplicate shared values", code: changed("check", 3, "if not result or result[-1] != a[i]:", "if True:") },
    { group: "lesson", id: 8, name: "Drops duplicates while merging", code: "def solve(a, b):\n    return sorted(set(a+b))" },
    {
      group: "check",
      id: 13,
      name: "Reuses the same item in a pair",
      code: "def solve(items, target):\n    return any(x+x == target for x in items)",
    },
    {
      group: "lesson",
      id: 13,
      name: "Keeps the first prior index instead of the most recent",
      code: `def solve(items, target):
    seen = {}
    for j, value in enumerate(items):
        if target-value in seen: return [seen[target-value], j]
        seen.setdefault(value, j)
    return []`,
    },
    {
      group: "lesson",
      id: 12,
      name: "Collapses differently capitalized words",
      code: `def solve(words):
    counts = {}
    for word in words:
        word = word.lower()
        counts[word] = counts.get(word, 0)+1
    return counts`,
    },
    {
      group: "lesson",
      id: 22,
      name: "Uses greedy coin choice where it is not valid",
      code: `def solve(coins, amount):
    count = 0
    for coin in sorted(coins, reverse=True):
        count += amount // coin
        amount %= coin
    return -1 if amount else count`,
    },
    {
      group: "check",
      id: 27,
      name: "Treats a word prefix as an exact word",
      code: "def solve(words, queries):\n    return [any(w.startswith(q) for w in words) for q in queries]",
    },
    { group: "check", id: 41, name: "Requires a heap to be fully sorted", code: "def solve(items):\n    return items == sorted(items)" },
    {
      group: "lesson",
      id: 45,
      name: "Returns the right boundary instead of the left",
      code: "import bisect\ndef solve(items, target):\n    return bisect.bisect_right(items, target)",
    },
    {
      group: "check",
      id: 46,
      name: "Checks only children rather than all ancestor bounds",
      code: `def solve(root):
    if root is None: return True
    left, right = root['left'], root['right']
    return (left is None or left['value'] < root['value']) and (right is None or right['value'] > root['value']) and solve(left) and solve(right)`,
    },
    {
      group: "check",
      id: 58,
      name: "Misses overlapping text matches",
      code: "def solve(text, pattern):\n    return [i for i in range(0, len(text), len(pattern)) if text.startswith(pattern, i)]",
    },
  ];
  const result = spawnSync(
    "python3",
    [
      "-c",
      `
import json, sys
data = json.load(sys.stdin)
def run(task, code, tests=None):
    payload = {key: task[key] for key in ('unchangedArgs', 'freshResultArg', 'reverseLinkedArg') if key in task}
    payload.update(code=code, tests=task['tests'] if tests is None else tests)
    ns = {'_studio_payload': json.dumps(payload)}
    exec(data['source'], ns)
    return ns['_results']
by_key = {(t['group'], t['id']): t for t in data['tasks']}
for task in data['tasks']:
    constant = json.dumps(task['tests'][0]['expected'])
    code = 'import json\\ndef solve(*args):\\n    return json.loads('+repr(constant)+')'
    results = run(task, code)
    assert not all(r['passed'] for r in results), ('Constant answer accepted', task['group'], task['id'])
for mutant in data['mutants']:
    task = by_key[mutant['group'], mutant['id']]
    results = run(task, mutant['code'])
    assert not all(r['passed'] for r in results), ('Wrong implementation accepted', mutant['name'])
    assert any(not r['passed'] and 'error' not in r for r in results), ('Only failed for a harness error', mutant['name'])
    if mutant['name'].startswith('Always checks'):
        assert all(r['passed'] for r in run(task, mutant['code'], task['tests'][:4])), 'Baseline counterexample must pass the original tests'
print(json.dumps({'constantsRejected': len(data['tasks']), 'mutantsRejected': len(data['mutants'])}))
`,
    ],
    { input: JSON.stringify({ source, tasks, mutants }), encoding: "utf8", timeout: 20000 }
  );
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), { constantsRejected: 282, mutantsRejected: mutants.length });
});
