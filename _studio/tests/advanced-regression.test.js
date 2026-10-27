import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { lessons } from "../../algo-studio/curriculum.js";

test("advanced boundary cases reject seven plausible but incorrect algorithms", () => {
  const mutations = [
    [80, "color[other]==1", "color[other]!=0"],
    [82, "low[w]>entered[v]", "low[w]>=entered[v]"],
    [83, "low[w]>=entered[v]", "low[w]>entered[v]"],
    [84, "distance=[None]*n", "distance=[0]*n"],
    [87, "residual[v][previous]+=amount", "residual[v][previous]+=0"],
    [88, "owner[b]<0 or augment(owner[b],seen)", "owner[b]<0"],
    [107, "current==target and text[start:start+m]==pattern", "current==target"],
  ];
  const tasks = mutations.map(([id, before, after]) => {
    const lesson = lessons[id];
    assert.ok(lesson.solution.includes(before), String(id));
    return { id, code: lesson.solution.replace(before, after), tests: lesson.tests };
  });
  const result = spawnSync(
    "python3",
    [
      "-c",
      `import copy,json,sys
for task in json.load(sys.stdin):
 namespace={};exec(task['code'],namespace)
 rejected=False
 for case in task['tests']:
  if namespace['solve'](*copy.deepcopy(case['args']))!=case['expected']:
   rejected=True;break
 assert rejected,('Boundary cases failed to reject an incorrect algorithm',task['id'])
print('Seven incorrect variants rejected')`,
    ],
    { input: JSON.stringify(tasks), encoding: "utf8", timeout: 5000 }
  );
  assert.equal(result.status, 0, result.stderr);
});

test("advanced pictures preserve tree order, flow conservation, eligibility, and hull orientation", async () => {
  const { illustratedStates, advancedDiagram } = await import("../../algo-studio/advanced-diagrams.js");
  const inorder = (state) => {
    const walk = (v) => {
      const children = state.edges.filter(([p]) => p === v).map(([, c]) => c);
      return [...children.filter((c) => c < v).flatMap(walk), v, ...children.filter((c) => c > v).flatMap(walk)];
    };
    const root = state.nodes.find(([v]) => !state.edges.some(([, c]) => c === v))[0];
    return walk(root);
  };
  assert.deepEqual(inorder(illustratedStates[76][1]), [1, 2, 3]);
  assert.deepEqual(inorder(illustratedStates[76][2]), [1, 2, 3]);
  const [n, edges, source, sink] = lessons[87].tests[0].args;
  for (const state of illustratedStates[87]) {
    const balance = Array(n).fill(0);
    edges.forEach(([a, b, c], i) => {
      assert.ok(state.flow[i] >= 0 && state.flow[i] <= c);
      balance[a] -= state.flow[i];
      balance[b] += state.flow[i];
    });
    assert.equal(balance[1], 0);
    assert.equal(balance[2], 0);
    assert.equal(balance[source] + balance[sink], 0);
  }
  assert.equal(illustratedStates[87][3].flow[0] + illustratedStates[87][3].flow[1], lessons[87].tests[0].expected);
  const allowed = lessons[88].tests[0].args[2];
  for (const state of illustratedStates[88]) {
    for (const pair of state.pairs) assert.ok(allowed.some((e) => JSON.stringify(e) === JSON.stringify(pair)));
    assert.equal(new Set(state.pairs.map((p) => p[0])).size, state.pairs.length);
    assert.equal(new Set(state.pairs.map((p) => p[1])).size, state.pairs.length);
  }
  const hull = illustratedStates[106][3].chain;
  for (let i = 0; i < 3; i++) {
    const [a, b, c] = hull.slice(i, i + 3);
    assert.ok((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) > 0);
  }
  for (const [id, states] of Object.entries(illustratedStates))
    for (let step = 0; step < states.length; step++) {
      assert.match(advancedDiagram(Number(id), step), /role="img" aria-label=/);
      assert.doesNotMatch(advancedDiagram(Number(id), step), /undefined|NaN/);
    }
});
