import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { lessons, route } from "../../algo-studio/curriculum.js";
import { checkpoints, transferTasks } from "../../algo-studio/practice-bank.js";
import {
  initialState,
  upgradeState,
  canOpen,
  nextActivity,
  lessonContinuation,
  checkpointDestination,
  recordCheckpoint,
  validBackup,
} from "../../algo-studio/learning-state.js";
import { growthCases, growthProfiles } from "../../algo-studio/teaching.js";
const attempt = () => ({
  code: "valid code",
  passedCode: "valid code",
  results: [{ passed: true }],
  hint: 0,
  notes: "I maintain the processed-prefix invariant.",
});

test("Lesson completion opens the next lesson directly; checkpoint credit remains separate", () => {
  const s = initialState();
  s.done[36] = { at: 1, assisted: true };
  assert.deepEqual(lessonContinuation(s, 36), { id: 0, kind: "lesson" });
  assert.deepEqual(nextActivity(s), { id: 0, kind: "lesson" });
  assert.ok(canOpen(s, 0));
  assert.equal(s.ready[36], undefined);
  assert.deepEqual(checkpointDestination(s, 36), { id: 0, kind: "lesson" });
  assert.equal(s.ready[36], undefined);
  const helped = attempt();
  helped.assisted = true;
  recordCheckpoint(s, 36, helped, 1);
  assert.deepEqual(lessonContinuation(s, 36), { id: 0, kind: "lesson" });
  assert.equal(s.ready[36].status, "supported");
  recordCheckpoint(s, 36, attempt(), 2);
  assert.deepEqual(lessonContinuation(s, 36), { id: 0, kind: "lesson" });
  s.done[0] = { at: 3, assisted: false };
  assert.deepEqual(lessonContinuation(s, 36), { id: 0, kind: "lesson" });
  for (const id of route) recordCheckpoint(s, id, attempt(), 4);
  assert.deepEqual(lessonContinuation(s, 36), { id: 0, kind: "lesson" });
  assert.equal(lessonContinuation(s, route.at(-1)).kind, "review");
  const sparse = initialState();
  sparse.ready[27] = { at: 1, status: "without-help" };
  const fallback = lessonContinuation(sparse, 27);
  assert.equal(fallback.id, 36);
  assert.ok(canOpen(sparse, fallback.id));
  sparse.ready[58] = { at: 1, status: "without-help" };
  assert.equal(lessonContinuation(sparse, 58).id, 36);
});

test("Every learner can advance through the entire route; unrelated topics do not gate BFS path reconstruction", () => {
  const s = initialState();
  assert.equal(nextActivity(s).id, 36);
  for (const id of route) {
    assert.ok(canOpen(s, id), `blocked at ${id}`);
    assert.equal(nextActivity(s).id, id);
    assert.ok(recordCheckpoint(s, id, attempt(), 100));
  }
  assert.equal(nextActivity(s).kind, "review");
  const routes = initialState();
  for (const id of [36, 0, 1, 2, 12, 37, 10, 40, 18]) routes.ready[id] = { at: 1, status: "without-help" };
  assert.ok(canOpen(routes, 23));
  assert.equal(routes.ready[22], undefined);
});

test("All guided lessons advance without optional checkpoints, while missing foundations still block", () => {
  const s = initialState();
  assert.equal(canOpen(s, 0), false);
  for (const id of route) {
    assert.ok(canOpen(s, id), `blocked at ${id}`);
    assert.equal(nextActivity(s).id, id);
    s.done[id] = { at: 100, assisted: true };
    const next = lessonContinuation(s, id);
    if (next.kind !== "review") assert.notEqual(next.id, id);
    assert.equal(s.ready[id], undefined);
  }
  assert.equal(nextActivity(s).kind, "review");
  assert.equal(lessonContinuation(s, route.at(-1)).kind, "review");
  assert.deepEqual(s.ready, {});
  const old = upgradeState({ version: 1, done: { 36: { at: 1, assisted: true } } });
  assert.ok(canOpen(old, 0));
  assert.deepEqual(nextActivity(old), { id: 0, kind: "lesson" });
});

test("Passing with help allows continuation with an honest label; changed code cannot pass", () => {
  const s = initialState(),
    a = attempt();
  a.assisted = true;
  a.notes = "";
  assert.equal(recordCheckpoint(s, 36, a, 100), true);
  assert.equal(s.ready[36].status, "supported");
  assert.equal(canOpen(s, 0), true);
  assert.ok(s.done[36].assisted);
  a.assisted = false;
  a.hint = 1;
  assert.equal(recordCheckpoint(s, 36, a, 100), true);
  assert.equal(s.ready[36].status, "supported");
  a.hint = 0;
  a.code = "changed";
  assert.equal(recordCheckpoint(s, 36, a, 100), false);
  a.code = a.passedCode;
  a.exposed = true;
  assert.equal(recordCheckpoint(s, 36, a, 100), true);
  assert.equal(s.ready[36].status, "reattempt");
  assert.ok(canOpen(s, 0));
  a.assisted = true;
  recordCheckpoint(s, 36, a, 200);
  assert.equal(s.ready[36].status, "reattempt");
  const missing = initialState();
  assert.equal(recordCheckpoint(missing, 0, attempt(), 100), false);
  assert.equal(missing.ready[0], undefined);
});

test("Optional notes and supported completion survive backups without creating independent recall credit", () => {
  const s = initialState(),
    a = { ...attempt(), notes: "", assisted: true };
  assert.ok(recordCheckpoint(s, 36, a, 0));
  s.practice["36:check"] = a;
  assert.ok(validBackup(s));
  assert.equal(upgradeState(JSON.parse(JSON.stringify(s))).ready[36].status, "supported");
  const due = s.reviews[36].codeDue;
  assert.ok(recordCheckpoint(s, 36, a, due, "recall"));
  assert.equal(s.reviews[36].codeStage, undefined);
  assert.equal(s.reviews[36].codeDue, due + 600000);
  const bad = { ...attempt(), notes: 5 };
  assert.equal(recordCheckpoint(initialState(), 36, bad), false);
});

test("Old backups retain IDs, code, notes and completion; new fields round-trip and invalid fields are rejected", () => {
  const old = {
    version: 1,
    done: { 0: { at: 123, assisted: true } },
    drafts: { 0: { code: "def solve(items, target):\n    return -1", step: 2, notes: "My existing note", walkIndex: 2 } },
    reviews: { 0: { stage: 0, due: 456 } },
    activity: ["2026-10-15"],
  };
  assert.ok(validBackup(old));
  const migrated = upgradeState(old);
  assert.equal(migrated.drafts[0].notes, "My existing note");
  assert.equal(migrated.done[0].at, 123);
  assert.equal(migrated.ready[0], undefined);
  assert.ok(canOpen(migrated, 0));
  recordCheckpoint(migrated, 36, attempt(), 100);
  migrated.practice["36:transfer"] = attempt();
  assert.ok(validBackup(migrated));
  const invalid = structuredClone(migrated);
  invalid.ready[36].status = "mastered";
  assert.equal(validBackup(invalid), false);
  invalid.ready = {};
  invalid.practice["999:check"] = attempt();
  assert.equal(validBackup(invalid), false);
});

test("Early code recall does not advance a scheduled interval", () => {
  const s = initialState(),
    day = 86400000;
  recordCheckpoint(s, 36, attempt(), 0);
  assert.equal(s.reviews[36].codeDue, 2 * day);
  recordCheckpoint(s, 36, attempt(), day, "recall");
  assert.equal(s.reviews[36].codeDue, 2 * day);
  recordCheckpoint(s, 36, attempt(), 2 * day, "recall");
  assert.equal(s.reviews[36].codeDue, 9 * day);
});

test("Student growth profiles supply correct outputs for all supported reference solutions and distributions", () => {
  const tasks = [];
  for (const id of Object.keys(growthProfiles).map(Number))
    for (const distribution of ["reverse", "sorted", "duplicates"])
      tasks.push({ id, solution: lessons[id].solution, tests: [8, 16, 32, 64, 128].map((n) => growthCases(id, n, distribution)) });
  const p = spawnSync(
    "python3",
    [
      "-c",
      `import json,sys,copy
for task in json.load(sys.stdin):
 ns={};exec(task['solution'],ns)
 for case in task['tests']:
  assert ns['solve'](*copy.deepcopy(case['args']))==case['expected'],(task['id'],case)
print('ok')`,
    ],
    { input: JSON.stringify(tasks), encoding: "utf8", timeout: 20000 }
  );
  assert.equal(p.status, 0, p.stderr);
});

test("Independent brute-force oracles verify windows, searches, sorting, DP and mixed-problem edge cases", () => {
  const payload = {
    lessons: Object.fromEntries(lessons.map((l) => [l.id, l.solution])),
    checks: Object.fromEntries(Object.entries(checkpoints).map(([i, t]) => [i, t.solution])),
    transfer: Object.fromEntries(Object.entries(transferTasks).map(([i, t]) => [i, t.solution])),
  };
  const p = spawnSync(
    "python3",
    [
      "-c",
      `import json,sys,random,itertools,bisect,copy,math
p=json.load(sys.stdin);random.seed(1701);count=0
def run(group,i,*args):
 ns={};exec(p[group][str(i)],ns);return ns['solve'](*copy.deepcopy(args))
for _ in range(100):
 a=[random.randint(-5,5) for _ in range(random.randrange(8))];target=random.randint(-5,5)
 assert run('checks',0,a,target)==a.count(target)
 assert run('lessons',37,a)==len(set(a))
 assert run('lessons',45,sorted(a),target)==bisect.bisect_left(sorted(a),target)
 assert run('checks',45,sorted(a),target)==a.count(target)
 for i in (7,24,25):assert run('lessons',i,a)==sorted(a)
 assert run('checks',24,a)==sum(a[i]>a[j] for i in range(len(a)) for j in range(i+1,len(a)))
 assert run('transfer',13,a,target)==sum(a[i]+a[j]==target for i in range(len(a)) for j in range(i+1,len(a)))
 k=random.randrange(1,5)
 expected=max((sum(a[i:i+k]) for i in range(len(a)-k+1)),default=None)
 assert run('lessons',4,a,k)==expected
 nexts=[next((y for y in a[i+1:] if y>x),None) for i,x in enumerate(a)]
 assert run('lessons',51,a)==nexts
 positive=[abs(x)+1 for x in a];goal=random.randrange(1,15)
 lengths=[j-i for i in range(len(a)) for j in range(i+1,len(a)+1) if sum(positive[i:j])>=goal]
 assert run('lessons',42,positive,goal)==min(lengths,default=0)
 text=''.join(random.choice('abc') for _ in range(random.randrange(9)))
 best=max((j-i for i in range(len(text)+1) for j in range(i,len(text)+1) if len(set(text[i:j]))==j-i),default=0)
 assert run('lessons',43,text)==best
 pattern=''.join(random.choice('ab') for _ in range(random.randrange(1,5)))
 assert run('lessons',58,text,pattern)==text.find(pattern)
 assert run('checks',58,text,pattern)==[i for i in range(len(text)) if text.startswith(pattern,i)]
 weights=[random.randrange(1,5) for _ in range(random.randrange(6))];values=[random.randrange(8) for _ in weights];cap=random.randrange(9)
 valid=[(sum(values[i] for i in range(len(weights)) if mask>>i&1),mask) for mask in range(1<<len(weights)) if sum(weights[i] for i in range(len(weights)) if mask>>i&1)<=cap]
 best_value=max(v for v,m in valid)
 assert run('lessons',50,weights,values,cap)==best_value
 assert run('lessons',35,weights,values,cap)==best_value
 chosen=run('checks',50,weights,values,cap)
 assert len(chosen)==len(set(chosen)) and sum(weights[i] for i in chosen)<=cap and sum(values[i] for i in chosen)==best_value
 exact=sum(sum(weights[i] for i in range(len(weights)) if mask>>i&1)==cap for mask in range(1<<len(weights)))
 assert run('transfer',50,weights,cap)==exact
 x,y=random.randrange(-40,41),random.randrange(-40,41)
 assert run('lessons',59,x,y)==math.gcd(x,y)
 count+=1
print(count)`,
    ],
    { input: JSON.stringify(payload), encoding: "utf8", timeout: 20000 }
  );
  assert.equal(p.status, 0, p.stderr);
  assert.equal(p.stdout.trim(), "100");
});

test("Every mixed problem declares foundations already on the course route", () => {
  for (const [id, problem] of Object.entries(transferTasks)) {
    assert.ok(problem.requires.includes(Number(id)));
    for (const dependency of problem.requires) assert.ok(route.includes(dependency));
  }
  assert.deepEqual(transferTasks[17].requires, [17, 8]);
});
