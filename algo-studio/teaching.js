import { searchTrace, insertionTrace } from "./algorithms.js";
const esc = (x) => String(x).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const strip = (values, active = []) =>
  `<div class="trace-cells">${values.map((v, i) => `<span class="trace-cell ${active.includes(i) ? "current" : ""}"><b>${esc(v)}</b><small>${i}</small></span>`).join("")}</div>`;
export function lessonDiagram(l, step) {
  let content = "",
    label = "";
  if (l.id === 0) {
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
    content = strip([2, 1, 5, 1, 3], step === 0 ? [0, 1, 2] : step === 1 ? [2, 3, 4] : [2, 3, 4]);
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
    label = "Directions describe which moves are allowed";
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
