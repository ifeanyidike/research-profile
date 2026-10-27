import { advancedDiagram } from "./advanced-diagrams.js?v=20261027-course2";
import { additionalFrames } from "./walkthrough-frames.js?v=20261027-course2";
import { searchTrace, insertionTrace } from "./algorithms.js?v=20261027-course2";
const esc = (x) => String(x).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const strip = (values, active = []) =>
  `<div class="trace-cells">${values.map((v, i) => `<span class="trace-cell ${active.includes(i) ? "current" : ""}"><b>${esc(v)}</b><small>${i}</small></span>`).join("")}</div>`;
export function lessonDiagram(l, step) {
  let content = "",
    label = "";
  const authored = l.diagramFrames || walkthroughFrames[l.id];
  if (authored) {
    label = "State at this step";
    content = `${advancedDiagram(l.id, step)}<dl class="reasoning-frame">${authored[step].map(([name, value]) => `<div><dt>${esc(name)}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl>`;
  } else if (l.id === 0) {
    label = "Checking the shopping list";
    content = strip(["bread", "milk", "eggs"], step === 0 ? [] : [step - 1]);
  } else if (l.id === 38) {
    const values = step === 0 ? [8, 4] : step === 1 ? [8, 4, 2, 1] : [16, 8, 4, 2, 1];
    label = "Halve at each move. Small labels count the rounds so far.";
    content = strip(values, [values.length - 1]);
  } else if (l.id === 3) {
    label = "Compare the ends, then move inward";
    content = strip([..."level"], step === 0 ? [0, 4] : step === 1 ? [1, 3] : [2]);
  } else if (l.id === 4) {
    label = "The active three-day window";
    content = strip([2, 1, 5, 1, 3], step === 0 ? [0, 1, 2] : step === 1 ? [1, 2, 3] : [2, 3, 4]);
  } else if (l.id === 5) {
    label = "Prefix totals include a leading zero";
    content = strip([0, 3, 5, 12], step === 0 ? [] : step === 1 ? [1, 3] : [1, 3]);
  } else if (l.id === 6) {
    label = "Sorted candidates";
    const frames = searchTrace([2, 5, 8, 11, 14, 17, 20], 17, true);
    content = strip(frames[0].values, step === 0 ? [3] : step === 1 ? [4, 5, 6] : [5]);
  } else if (l.id === 7) {
    label = "The sorted prefix grows";
    const frame = insertionTrace([4, 2, 3])[[0, 2, 4][step]];
    content = strip(frame.values, frame.sorted);
  } else if (l.id === 9) {
    label = step === 2 ? "A closing bracket has no matching opening" : "Each closing bracket removes the newest opening";
    content = `<div class="trace-chain"><span>${step === 0 ? "stack: [ ( · ( ] ← top" : step === 1 ? "stack: [ ] after both closing brackets" : "stack: [ ] · next character: ) → invalid"}</span></div>`;
  } else if (l.id === 10) {
    label = "Earliest arrival leaves first";
    content = `<div class="trace-chain"><span>${["take here [ A · B ] ← add here", "take here [ B · C ] ← add here", "take here [ C ] after taking B"][step]}</span></div>`;
  } else if (l.id === 14) {
    label = step < 2 ? "Calls wait for smaller answers" : "Answers return to waiting calls";
    content = `<div class="trace-chain">${(step < 2 ? ["solve(3)", "solve(2)", "solve(1)", "solve(0)"] : ["1", "1", "2", "6"]).map((v) => `<span>${v}</span>`).join("<b>→</b>")}</div>`;
  } else if ([15, 16, 47].includes(l.id)) {
    label = "A parent and two children";
    content =
      '<svg viewBox="0 0 240 95" role="img" aria-label="Root with left and right children"><path d="M120 22L60 75M120 22L180 75" stroke="#94aa91" stroke-width="2"/><g fill="#e1ecd9" stroke="#769674"><circle cx="120" cy="20" r="18"/><circle cx="60" cy="75" r="18"/><circle cx="180" cy="75" r="18"/></g><g fill="#294c35" text-anchor="middle" font-size="12"><text x="120" y="24">root</text><text x="60" y="79">left</text><text x="180" y="79">right</text></g></svg>';
  } else if (l.id === 36) {
    label = step === 0 ? "Two names share one list" : "A separate outer list";
    content = `<div class="trace-chain"><span>items → [2,4]</span><span>${step === 0 ? "alias ↗ same list" : `copy → [2,4${step === 2 ? ",6" : ""}]`}</span></div>`;
  } else if (l.id === 39) {
    label = "An outer call combines child results";
    content = '<div class="trace-chain"><span>[2, [3,4]]</span><b>→</b><span>2 + (3 + 4)</span><b>→</b><span>9</span></div>';
  } else if (l.id === 40) {
    label = "Outgoing neighbors match the directed edges";
    content = '<div class="trace-chain"><span>0 → 1</span><span>0 → 2</span><span>[[1,2], [], []]</span></div>';
  } else if ([18, 19, 23].includes(l.id)) {
    label = "Connection map: these allowed moves stay unchanged during the example";
    content = `<div class="trace-chain"><span>A → B → D</span><span>${l.id === 23 ? "A → C" : l.id === 19 ? "A → C → A" : "A → C → D"}</span></div>`;
  } else if (l.id === 48) {
    label = "Two calls need the same smaller answer";
    content =
      '<div class="trace-chain"><span>ways(4) → ways(3) + ways(2)</span><span>ways(3) → ways(2) + ways(1)</span><span>cache[2] = 2</span></div>';
  } else if (l.id === 49) {
    label = "A cell adds the route counts above and left";
    content =
      '<table class="tiny-dp" aria-label="Route counts for a two by three grid"><tbody><tr><td>1</td><td>1</td><td>1</td></tr><tr><td>1</td><td>2</td><td class="current">3</td></tr></tbody></table>';
  } else if (l.id === 50) {
    label = "Read a smaller capacity from the previous item row";
    content = '<div class="trace-chain"><span>skip → previous[5] = 3</span><span>take → 4 + previous[2] = 7</span><span>best = 7</span></div>';
  } else if (l.id === 54) {
    const buckets = [[], step === 0 ? [] : step === 1 ? [1] : [1, 4], step === 4 ? [2] : []];
    label = "Bucket labels stay the same. Different numbers can share a bucket.";
    content = `<div class="hash-buckets">${buckets.map((values, i) => `<div class="hash-bucket"><span>Bucket ${i}</span><strong>[${values.join(", ")}]</strong></div>`).join("")}</div>`;
  }
  if (!content) return "";
  return `<figure class="lesson-diagram"><figcaption>${label}</figcaption>${content}</figure>`;
}
export const growthProfiles = {
  0: "n distinct readings; target is absent",
  1: "n integer values",
  2: "n integer values",
  3: "n repeated letters forming a palindrome",
  4: "n values; fixed window k = min(4,n)",
  6: "n sorted distinct integers; target is above the maximum",
  7: "n integers in the chosen order",
  8: "two sorted lists, n values per list",
  12: "n distinct short word labels",
  13: "n positive integers; no matching pair",
  24: "n integers in the chosen order",
  25: "n integers in the chosen order",
  36: "n integers copied, then one appended",
  45: "n sorted integers; boundary is at the end",
};
export function growthCases(id, n, distribution = "reverse") {
  let values = Array.from({ length: n }, (_, i) => i + 1);
  if (distribution === "reverse") values.reverse();
  if (distribution === "duplicates") values = Array(n).fill(2);
  const ascending = Array.from({ length: n }, (_, i) => i + 1);
  if (id === 0) return { args: [values, -1], expected: -1 };
  if (id === 1) return { args: [values], expected: values.reduce((a, b) => a + b, 0) };
  if (id === 2) return { args: [values], expected: Math.max(...values) };
  if (id === 3) return { args: ["a".repeat(n)], expected: true };
  if (id === 4) {
    const k = Math.min(4, n);
    let best = -Infinity;
    for (let i = 0; i <= n - k; i++)
      best = Math.max(
        best,
        values.slice(i, i + k).reduce((a, b) => a + b, 0)
      );
    return { args: [values, k], expected: best };
  }
  if (id === 6) return { args: [ascending, n + 1], expected: -1 };
  if ([7, 24, 25].includes(id)) return { args: [values], expected: [...values].sort((a, b) => a - b) };
  if (id === 8)
    return { args: [ascending.map((x) => 2 * x - 2), ascending.map((x) => 2 * x - 1)], expected: Array.from({ length: 2 * n }, (_, i) => i) };
  if (id === 12) {
    const words = ascending.map((x) => "word" + x);
    return { args: [words], expected: Object.fromEntries(words.map((w) => [w, 1])) };
  }
  if (id === 13) return { args: [ascending, -1], expected: [] };
  if (id === 36) return { args: [values, n + 1], expected: [...values, n + 1] };
  if (id === 45) return { args: [ascending, n + 1], expected: n };
  throw new Error("Choose a supported lesson for this experiment.");
}
export const projects = [
  {
    key: "routes",
    title: "A route planner that handles change",
    description: "Build a network, find a route, cope with closures, then compare travel costs.",
    missions: [
      [40, "Represent the network", "Build a directed neighbor list. Check isolated stops and repeated connections.", "lesson"],
      [18, "Find the nearest reachable stops", "Compute shortest edge distances. Explain why each first discovery is shortest.", "check"],
      [23, "Return an actual route", "Store parent links and reconstruct the path, not just its length.", "lesson"],
      [23, "Handle a closed stop", "Adapt the planner so blocked stops are never visited.", "check"],
      [30, "Give roads different prices", "Use minimum travel cost instead of minimum edge count. Explain why BFS is no longer enough.", "lesson"],
      [56, "Allow rebates carefully", "Handle negative edges and identify a reachable negative-cost cycle.", "lesson"],
    ],
  },
  {
    key: "kit",
    title: "A packing planner you can explain",
    description: "Model choices, compare strategies, reconstruct the chosen items, then reduce memory.",
    missions: [
      [26, "List the tiny possibilities", "Generate subsets on a small kit. Count how quickly possibilities grow.", "lesson"],
      [50, "Make the choice table", "Record the best value at each item stage and carrying limit.", "lesson"],
      [50, "Return the selected items", "Reconstruct indices, then manually check their total weight and value.", "check"],
      [35, "Use less working memory", "Move through capacities downward and explain why each item remains once-only.", "lesson"],
      [50, "Count the possible kits", "Change the output to a count of exact-weight kits. Explain why the state update changes.", "transfer"],
    ],
  },
];

const walkthroughFrames = {
  ...additionalFrames,
  14: [
    [
      ["Waiting call", "solve(3) = 3 × solve(2)"],
      ["Next call", "solve(2)"],
    ],
    [
      ["Waiting calls", "solve(3), solve(2), solve(1)"],
      ["Base answer", "solve(0) = 1"],
    ],
    [
      ["Return to solve(1)", "1 × 1 = 1"],
      ["Return to solve(2)", "2 × 1 = 2"],
      ["Return to solve(3)", "3 × 2 = 6"],
    ],
  ],
  15: [
    [
      ["Root", "2"],
      ["Left / right child", "1 / 3"],
      ["Output", "[]"],
    ],
    [
      ["Visit left, then root", "1, then 2"],
      ["Output", "[1, 2]"],
    ],
    [
      ["Visit right", "3"],
      ["Output", "[1, 2, 3]"],
    ],
  ],
  16: [
    [
      ["Target / current", "7 / 5"],
      ["Choice", "7 > 5 → right child 8"],
    ],
    [
      ["Target / current", "7 / 8"],
      ["Choice", "7 < 8 → left child 7"],
    ],
    [
      ["Target / current", "7 / 7"],
      ["Answer", "True"],
    ],
  ],
  36: [
    [
      ["items", "→ list A [2, 4]"],
      ["alias", "→ the same list A"],
    ],
    [
      ["items and alias", "→ list A [2, 4]"],
      ["copy", "→ a separate list B [2, 4]"],
    ],
    [
      ["items and alias", "→ list A [2, 4]"],
      ["copy after append", "→ list B [2, 4, 6]"],
    ],
  ],
  39: [
    [
      ["Outer input", "[2, [3, 4]]"],
      ["Outer total so far", "2"],
      ["Still to handle", "[3, 4]"],
    ],
    [
      ["Inner input", "[3, 4]"],
      ["Inner returned total", "7"],
      ["Outer total still waiting", "2"],
    ],
    [
      ["Outer combination", "2 + 7"],
      ["Returned answer", "9"],
    ],
  ],
  47: [
    [
      ["Empty child heights", "0 and 0"],
      ["Leaf height", "1 + max(0, 0) = 1"],
    ],
    [
      ["Root with one leaf", "root → leaf"],
      ["Root height", "1 + max(1, 0) = 2"],
    ],
    [
      ["One-sided path", "root → child → leaf"],
      ["Path height", "3 nodes"],
    ],
  ],
  48: [
    [
      ["Question", "ways(4)"],
      ["Smaller questions", "ways(3) + ways(2)"],
    ],
    [
      ["Repeated question", "ways(2)"],
      ["Saved answer", "cache[2] = 2"],
    ],
    [
      ["Reuse", "ways(2) = 2 from cache"],
      ["Combination", "ways(4) = 3 + 2 = 5"],
    ],
  ],
  49: [
    [
      ["Top row", "1  1  1"],
      ["Bottom row", "1  ?  ?"],
    ],
    [
      ["Top row", "1  1  1"],
      ["Bottom row", "1  2  ?"],
      ["Current calculation", "1 above + 1 left = 2"],
    ],
    [
      ["Top row", "1  1  1"],
      ["Bottom row", "1  2  3"],
      ["Current calculation", "1 above + 2 left = 3"],
    ],
  ],
  50: [
    [
      ["Capacity", "5"],
      ["A: weight / value", "2 / 3"],
      ["B: weight / value", "3 / 4"],
    ],
    [
      ["Only A allowed", "capacity 2 → value 3"],
      ["Only A allowed", "capacity 5 → value 3"],
    ],
    [
      ["Skip B", "previous[5] = 3"],
      ["Take B", "4 + previous[2] = 7"],
      ["Best", "7"],
    ],
  ],
  57: [
    [
      ["Input", "[2, 1, 3, 4]"],
      ["Block 1: input position 0", "2"],
      ["Block 2: input positions 0–1", "3"],
    ],
    [
      ["Block 1 / 2 / 3 / 4", "2 / 3 / 3 / 10"],
      ["Block 3 covers", "input position 2"],
      ["Block 4 covers", "input positions 0–3"],
    ],
    [
      ["First 3 items", "block 3 + block 2"],
      ["Sum", "3 + 3 = 6"],
    ],
    [
      ["Helper jumps", "3 → 2 → 0"],
      ["Jump sizes", "1, then 2"],
    ],
    [
      ["Add 5 at input position 0", "update helper positions 1, 2, 4"],
      ["New block values", "7 / 8 / 3 / 15"],
    ],
  ],
  58: [
    [
      ["Pattern", "aab"],
      ["Pattern prefix lengths", "[0, 1, 0]"],
      ["Text", "aaab"],
    ],
    [
      ["Matched text positions", "0, 1: aa"],
      ["Next expected pattern letter", "b"],
    ],
    [
      ["Text position 2", "a ≠ expected b"],
      ["Retained matched ending", "a"],
      ["Matched length after fallback", "1"],
    ],
    [
      ["Text position 2", "a matches pattern position 1"],
      ["Text position 3", "b matches pattern position 2"],
    ],
    [
      ["Matched text positions", "1–3: aab"],
      ["Returned start position", "1"],
    ],
  ],
};

projects.push(
  {
    key: "reliability",
    title: "A road-failure planning service",
    description: "Combine connectivity and bridge analysis to answer independent road-failure queries.",
    contract:
      "Implement solve(n, edges, failures). Return the number of connected components after each listed edge fails individually. Each query starts from the original undirected multigraph.",
    acceptance: [
      "Parallel roads must protect one another from being classified as bridges.",
      "Start from the original component count, including isolated places.",
      "Repeated failure queries are independent; they must not accumulate deletions.",
      "Compare small examples with a fresh connectivity search after each removal, then explain the faster preprocessing bound.",
    ],
    extension:
      "Independent extension: support cumulative failures and later repairs. Explain why the single-bridge lookup no longer suffices; do not reuse its guarantee unchanged.",
    missions: [
      [28, "Establish the baseline groups", "Count components and retain isolated sites.", "lesson"],
      [82, "Find structurally fragile roads", "Use edge IDs so parallel links remain distinct.", "lesson"],
      [82, "Analyze stable regions", "Remove all bridges and inspect the remaining components.", "check"],
      [82, "Answer independent failures", "Combine the original count with bridge membership.", "transfer"],
    ],
  },
  {
    key: "capacity",
    title: "A changing capacity register",
    description: "Maintain nonnegative capacities and locate the first prefix meeting a request after assignments.",
    contract:
      "Implement solve(items, operations) for set/index/value changes and first/positive-target requests. Return the first prefix boundary index, or -1 if the total is insufficient.",
    acceptance: [
      "Zero capacities must not invent an earlier qualifying boundary.",
      "An assignment replaces its old value rather than adding another copy.",
      "An exact total match must qualify; an over-total request must return -1.",
      "Justify both the segment summary and the left/right descent decision, then test against a direct scan.",
    ],
    extension:
      "Independent extension: allow negative capacities. Construct a counterexample to sum-only descent and design the stronger summary that would be needed.",
    missions: [
      [5, "Understand static prefix boundaries", "Specify inclusive positions and the leading empty total.", "lesson"],
      [77, "Use a subtree summary for rank", "Account for positions discarded by a rightward move.", "lesson"],
      [79, "Maintain changing range summaries", "Repair only the ancestors of a replaced leaf.", "lesson"],
      [79, "Answer the actual capacity requests", "Descend to a first qualifying boundary without repeated full scans.", "transfer"],
    ],
  },
  {
    key: "quotas",
    title: "A quota-aware assignment planner",
    description: "Model eligibility and worker capacity, then certify the best achievable assignment count.",
    contract:
      "Implement solve(quotas, job_count, allowed). Workers may take up to their quota; every unit job has at most one owner. Return the largest feasible assignment count.",
    acceptance: [
      "Zero-quota workers and jobs with no eligible worker must be handled.",
      "Duplicate eligibility rows do not create extra jobs or extra meaning.",
      "An earlier assignment must be reroutable when that enables a larger feasible total.",
      "Produce a small manual flow and a matching cut-capacity certificate, and explain which constraints each network edge encodes.",
    ],
    extension:
      "Independent extension: add assignment costs. A maximum count alone does not minimize cost; specify the new objective and why ordinary max-flow output is insufficient.",
    missions: [
      [63, "Check the two-sided model", "Separate worker and job roles rather than merging their IDs.", "lesson"],
      [87, "Understand residual routing", "Trace a cancellation and a reroute.", "lesson"],
      [87, "Find a cut certificate", "Check the achieved value against a bottleneck cut.", "check"],
      [88, "Inspect the unit-quota special case", "Compare matching with the general capacity model.", "lesson"],
      [87, "Build the quota service", "Translate quotas and eligibility into a flow network.", "transfer"],
    ],
  },
  {
    key: "records",
    title: "An exact repeated-record detector",
    description: "Use fingerprints as a filter while preserving exact string identity and overlapping occurrences.",
    contract:
      "Implement solve(text, k). Return sorted distinct length-k strings occurring at least twice, counting overlapping starting positions. Invalid k returns an empty list.",
    acceptance: [
      "aaaa with k=2 returns one distinct string aa, though it has three starting positions.",
      "Different strings sharing a fingerprint must remain separate records.",
      "A zero or overlong k must follow the explicit empty-output rule.",
      "Account for substring copies, exact verification, dictionary storage, and final sorting rather than claiming unconditional linear work.",
    ],
    extension:
      "Independent extension: process a stream split into chunks. Retain the final k-1 characters across boundaries and explain how repeated-record storage can grow.",
    missions: [
      [43, "Define continuous text groups", "Distinguish substrings from subsequences.", "lesson"],
      [107, "Derive the rolling update", "Remove, shift, and add without confusing a fingerprint with identity.", "lesson"],
      [107, "Verify all overlapping matches", "Continue after a match without skipping candidate starts.", "check"],
      [107, "Build the exact repetition report", "Separate occurrence count from distinct output strings.", "transfer"],
    ],
  }
);
