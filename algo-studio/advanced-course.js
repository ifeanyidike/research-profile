import { reasoningUnits } from "./advanced-units/reasoning.js?v=20261027-course2";
import { sortingUnits } from "./advanced-units/sorting.js?v=20261027-course2";
import { treeUnits } from "./advanced-units/trees.js?v=20261027-course2";
import { graphUnits } from "./advanced-units/graphs.js?v=20261027-course2";
import { networkUnits } from "./advanced-units/networks.js?v=20261027-course2";
import { dynamicUnits } from "./advanced-units/dynamic.js?v=20261027-course2";
import { patternUnits } from "./advanced-units/patterns.js?v=20261027-course2";
import { mathematicsUnits } from "./advanced-units/mathematics.js?v=20261027-course2";
import { limitUnits } from "./advanced-units/limits.js?v=20261027-course2";
export const advancedUnits = [
  ...reasoningUnits,
  ...sortingUnits,
  ...treeUnits,
  ...graphUnits,
  ...networkUnits,
  ...dynamicUnits,
  ...patternUnits,
  ...mathematicsUnits,
  ...limitUnits,
];
export const advancedLessons = advancedUnits.map((u) => u.lesson).sort((a, b) => a.id - b.id);
export const advancedCheckpoints = Object.fromEntries(advancedUnits.map((u) => [u.lesson.id, u.checkpoint]));
export const advancedTransfers = Object.fromEntries(advancedUnits.map((u) => [u.lesson.id, u.transfer]));
export const advancedStages = [
  ["Make a correctness argument", "Prove the rule, the stopping condition, and the work bound.", "Reasoning and analysis", "◎", [66, 67, 68, 69, 70]],
  [
    "Use the structure of the keys",
    "Stability, integer universes, ranks, and randomized choices.",
    "Sorting and selection",
    "↗",
    [74, 71, 72, 73, 99],
  ],
  ["Make trees answer richer questions", "Deletion, balance, cached summaries, ancestors, and ranges.", "Advanced trees", "♧", [75, 76, 77, 78, 79]],
  [
    "Understand the shape of a network",
    "Directed cycles, strongly connected groups, fragile roads, and DAG states.",
    "Graph structure",
    "⌁",
    [80, 81, 82, 83, 84],
  ],
  [
    "Optimize routes, connections, and assignments",
    "Special costs, all-pairs answers, spanning trees, flow, and matching.",
    "Network optimization",
    "◇",
    [104, 85, 86, 87, 88],
  ],
  [
    "Design and recover the state",
    "Witnesses, rolling rows, weighted choices, intervals, trees, and subsets.",
    "Advanced dynamic programming",
    "◈",
    [92, 103, 102, 89, 90, 91],
  ],
  ["Keep only useful possibilities", "Deque dominance, event sweeps, and justified backtracking.", "Windows and search", "▦", [93, 94, 95]],
  ["Use arithmetic deliberately", "Powers, primes, combinatorial counts, and legal modular division.", "Number theory", "∑", [96, 97, 98, 105]],
  [
    "Know the guarantees and the limits",
    "Verification, reductions, approximation, geometric predicates, and hash collisions.",
    "Limits and applications",
    "✧",
    [100, 101, 106, 107],
  ],
];
