import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { lessons } from "../../algo-studio/curriculum.js";
import { checkpoints, transferTasks } from "../../algo-studio/practice-bank.js";
import { lessonDiagram } from "../../algo-studio/teaching.js";

test("Independent specifications verify every expected answer and 100 new inputs for each of 282 worked solutions", () => {
  const tasks = [
    ...lessons.map((t) => ({ ...t, group: "lesson" })),
    ...Object.entries(checkpoints).map(([id, t]) => ({ ...t, id: Number(id), group: "check" })),
    ...Object.entries(transferTasks).map(([id, t]) => ({ ...t, id: Number(id), group: "transfer" })),
  ];
  const result = spawnSync("python3", ["tests/oracles.py"], { input: JSON.stringify(tasks), encoding: "utf8", timeout: 20000 });
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.tasks, 282);
  assert.equal(
    report.supplied,
    tasks.reduce((n, t) => n + t.tests.length, 0)
  );
  assert.equal(report.generated, 28200);
  assert.equal(new Set(report.covered).size, 282);
});

test("Graph lesson diagrams contain only edges present in their actual worked examples", () => {
  for (const id of [18, 19, 23]) {
    const graph = lessons[id].tests[0].args[0],
      markup = lessonDiagram(lessons[id], 0);
    const paths = [...markup.matchAll(/<span>([^<]+)<\/span>/g)].map((match) => match[1].split(" → "));
    assert.ok(paths.length > 0);
    for (const path of paths)
      for (let i = 1; i < path.length; i++) assert.ok(graph[path[i - 1]]?.includes(path[i]), `${id}: missing edge ${path[i - 1]} → ${path[i]}`);
  }
});

test("The actual Python runner rejects wrong result types and broken identity contracts, and traces every solved example", () => {
  const source = readFileSync(new URL("../../algo-studio/python-worker.js", import.meta.url), "utf8").match(/pyodide\.runPython\(`([\s\S]*?)`\)/)[1];
  const tasks = [...lessons, ...Object.values(checkpoints), ...Object.values(transferTasks)];
  const cases = [
    { code: "def solve():\n    return 1", tests: [{ args: [], expected: true }], pass: false },
    { code: "def solve():\n    return True", tests: [{ args: [], expected: 1 }], pass: false },
    { code: "def solve():\n    return [True]", tests: [{ args: [], expected: [1] }], pass: false },
    { code: 'def solve():\n    return {"a": 1}', tests: [{ args: [], expected: { a: true } }], pass: false },
    { code: "def solve(items):\n    return items", tests: [{ args: [[]], expected: [] }], freshResultArg: 0, pass: false },
    { code: "def solve(items):\n    items.append(2)\n    return items", tests: [{ args: [[1]], expected: [1, 2] }], unchangedArgs: [0], pass: false },
    {
      code: 'def solve(head):\n    return {"value": 2, "next": {"value": 1, "next": None}}',
      tests: [{ args: [{ value: 1, next: { value: 2, next: null } }], expected: { value: 2, next: { value: 1, next: null } } }],
      reverseLinkedArg: 0,
      pass: false,
    },
    { code: "def solve():\n    return False", tests: [{ args: [], expected: false }], pass: true },
  ];
  const result = spawnSync(
    "python3",
    [
      "-c",
      `import json,sys
data=json.load(sys.stdin)
def execute(payload):
 ns={'_studio_payload':json.dumps(payload)}
 exec(data['source'],ns)
 return ns['_results']
for case in data['cases']:
 result=execute(case)[0]
 assert result['passed'] is case['pass'],(case,result)
frames=0;truncated=0
for task in data['tasks']:
 contract={k:task[k] for k in ('unchangedArgs','freshResultArg','reverseLinkedArg') if k in task}
 payload={'code':task['solution'],'tests':task['tests'],**contract}
 assert all(r['passed'] for r in execute(payload)),task['title']
 result=execute({**payload,'tests':task['tests'][:1],'walkthrough':True})[0]
 assert result['passed'] and result['frames'],(task['title'],result)
 assert all(1 <= f['line'] <= len(task['solution'].splitlines()) for f in result['frames']),task['title']
 assert len(result['frames']) <= 500 and result['frameCount'] >= len(result['frames'])
 if result['frameCount'] <= 500:
  last=result['frames'][-1]
  assert last['event']=='return' and last['function']=='solve' and last['value']==result['actual'],(task['title'],last,result['actual'])
 else: truncated+=1
 frames+=len(result['frames'])
loop=execute({'code':'def solve():\\n    while True:\\n        pass','tests':[{'args':[],'expected':0}]})[0]
assert not loop['passed'] and 'Step limit' in loop['error']
assert execute({'code':'def solve():\\n    return 7','tests':[{'args':[],'expected':7}]})[0]['passed']
long=execute({'code':'def solve(n):\\n    total=0\\n    for i in range(n):\\n        total+=i\\n    return total','tests':[{'args':[400],'expected':79800}],'walkthrough':True})[0]
assert long['passed'] and len(long['frames'])==500 and long['frameCount']>500 and long['actual']=='79800'
print(json.dumps({'tasks':len(data['tasks']),'negativeCases':len(data['cases']),'frames':frames,'truncated':truncated}))`,
    ],
    { input: JSON.stringify({ source, cases, tasks }), encoding: "utf8", timeout: 20000 }
  );
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.tasks, 282);
  assert.equal(report.negativeCases, 8);
  assert.ok(report.frames > 1000);
});
