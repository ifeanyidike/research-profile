// Concrete states for the existing three-step examples. These accompany, rather
// than replace, the narration; no future result is shown before its step.
export const additionalFrames = {
  1: [
    [
      ["Input", "[4, -2, 3]"],
      ["Total before reading", "0"],
    ],
    [
      ["After 4", "4"],
      ["After -2", "2"],
    ],
    [
      ["After 3", "5"],
      ["Empty input would keep", "0"],
    ],
  ],
  2: [
    [
      ["Input", "[3, 9, 4]"],
      ["Best so far", "3"],
    ],
    [
      ["Compare 9, then 4", "9 beats 3; 4 does not beat 9"],
      ["Best so far", "9"],
    ],
    [
      ["Values read", "3"],
      ["Comparisons", "2 = 3 - 1"],
    ],
  ],
  8: [
    [
      ["First list / second list", "[1, 4] / [2, 3]"],
      ["After three choices", "[1, 2, 3]"],
      ["Remaining", "[4] / []"],
    ],
    [["Copy remaining 4", "[1, 2, 3, 4]"]],
    [
      ["Result", "[1, 2, 3, 4]"],
      ["Values copied", "4"],
    ],
  ],
  9: [
    [
      ["Characters read", "(("],
      ["Waiting openings", "(  ( ← top"],
    ],
    [
      ["Characters read", "(())"],
      ["Waiting openings", "empty"],
      ["Answer", "True"],
    ],
    [
      ["New input", ")("],
      ["First closing", "nothing waiting → False"],
    ],
  ],
  11: [
    [
      ["Chain", "4 → 7 → None"],
      ["Head value", "4"],
    ],
    [
      ["Visited values", "4, then 7"],
      ["Current link", "None"],
    ],
    [["Returned list", "[4, 7]"]],
  ],
  12: [
    [
      ["Input", "tea, rice, tea"],
      ["Counts", "{}"],
    ],
    [
      ["After tea", "{tea: 1}"],
      ["After rice", "{tea: 1, rice: 1}"],
    ],
    [["After tea again", "{tea: 2, rice: 1}"]],
  ],
  13: [
    [
      ["Target", "9"],
      ["Earlier values → positions", "3 → 0"],
    ],
    [
      ["Current value / needed", "2 / 7"],
      ["Earlier values after saving", "3 → 0, 2 → 1"],
    ],
    [
      ["Current value / needed", "7 / 2"],
      ["Earlier match", "2 at index 1"],
      ["Returned pair", "[1, 2]"],
    ],
  ],
  17: [
    [
      ["Heap after construction", "[2, 7, 5]"],
      ["Smallest root", "2"],
    ],
    [
      ["Removed", "2"],
      ["Repaired heap", "[5, 7]"],
    ],
    [
      ["Removed next", "5"],
      ["Returned values", "[2, 5]"],
    ],
  ],
  20: [
    [["Finish-time order", "[1,3], [3,4], [2,5]"]],
    [
      ["Chosen talks", "[1,3], [3,4]"],
      ["Latest finish", "4"],
    ],
    [
      ["Next start / latest finish", "2 / 4 → cannot fit"],
      ["Chosen count", "2"],
    ],
  ],
  21: [
    [
      ["Ways at step 0", "1: no moves"],
      ["Ways at step 1", "1: [1]"],
    ],
    [
      ["Ways at step 2", "2"],
      ["Ways at step 3", "3"],
    ],
    [
      ["Final move of 1", "3 ways from step 3"],
      ["Final move of 2", "2 ways from step 2"],
      ["Ways at step 4", "3 + 2 = 5"],
    ],
  ],
  22: [
    [
      ["Amount", "0 | 1 | 2 | 3"],
      ["Fewest coins", "0 | 1 | 2 | 1"],
    ],
    [["Make 6 ending with 3", "best[3] + 1 = 2"]],
    [
      ["Make 6 ending with 4", "best[2] + 1 = 3"],
      ["Better answer", "2 coins: 3 + 3"],
    ],
  ],
  24: [
    [["Split", "[4,1,3,2] → [4,1] and [3,2]"]],
    [
      ["Singletons", "[4], [1], [3], [2]"],
      ["Merge pairs", "[1,4] and [2,3]"],
    ],
    [["Final merge", "[1,2,3,4]"]],
  ],
  25: [
    [
      ["Input", "[3,1,3,2]"],
      ["Middle-position pivot", "3"],
    ],
    [
      ["Smaller", "[1,2]"],
      ["Equal", "[3,3]"],
      ["Larger", "[]"],
    ],
    [["Sorted smaller + equal + sorted larger", "[1,2,3,3]"]],
  ],
  26: [
    [
      ["Choices", "exclude 1, exclude 2"],
      ["Saved selections", "[[]]"],
    ],
    [
      ["Save [2], undo, then include 1", "partial selection [1]"],
      ["Saved selections so far", "[[], [2]]"],
    ],
    [
      ["All selections before sorting", "[[], [2], [1], [1,2]]"],
      ["Returned sorted list", "[[], [1], [1,2], [2]]"],
    ],
  ],
  27: [
    [["Word path", "c → a → r → end"]],
    [
      ["Shared letters", "c → a → r"],
      ["Two endings", "r → end; r → t → end"],
    ],
    [
      ["Prefix query", "c → a exists"],
      ["Answer", "True; an end marker at a is unnecessary"],
    ],
  ],
  28: [
    [
      ["Groups", "{0}  {1}  {2}"],
      ["Count", "3"],
    ],
    [
      ["Join 0 and 1", "{0,1}  {2}"],
      ["Count", "2"],
    ],
    [
      ["Join 1's group and 2", "{0,1,2}"],
      ["Count", "1"],
    ],
  ],
  29: [
    [
      ["New edge", "0–1"],
      ["Groups after joining", "{0,1}  {2}"],
    ],
    [
      ["New edge", "1–2"],
      ["Groups after joining", "{0,1,2}"],
    ],
    [
      ["Proposed edge", "2–0"],
      ["Existing path", "2–1–0"],
      ["Cycle", "True"],
    ],
  ],
  30: [
    [["Road costs", "A→B: 5; A→C: 1; C→B: 1"]],
    [
      ["Known costs from A", "B: 5; C: 1"],
      ["Next cheapest visit", "C"],
    ],
    [
      ["Alternative cost to B", "1 + 1 = 2"],
      ["Best cost to B", "2"],
    ],
  ],
  31: [
    [
      ["Dependencies", "0→2; 1→2"],
      ["Ready jobs", "[0,1]"],
      ["Unfinished prerequisites of 2", "2"],
    ],
    [
      ["Finished jobs", "[0,1]"],
      ["Ready jobs", "[2]"],
      ["Unfinished prerequisites of 2", "0"],
    ],
    [["Returned order", "[0,1,2]"]],
  ],
  32: [
    [["Increasing edge costs", "0–1: 1; 1–2: 2; 0–2: 8"]],
    [
      ["Accepted edges", "0–1 and 1–2"],
      ["Total", "3"],
    ],
    [
      ["Rejected edge", "0–2 would close a cycle"],
      ["Connected tree cost", "3"],
    ],
  ],
  33: [
    [
      ["String prefixes", "a / a"],
      ["Common length", "1"],
    ],
    [
      ["Prefixes", "ab / ac"],
      ["Skip b or skip c", "best length remains 1"],
    ],
    [
      ["Whole strings", "abc / ac"],
      ["Shared subsequence", "ac"],
      ["Length", "2"],
    ],
  ],
  34: [
    [
      ["Input", "[3,1,2]"],
      ["Best lengths ending here", "[1,1,1]"],
    ],
    [
      ["Earlier 1 can precede 2", "extend length 1 to 2"],
      ["Best lengths ending here", "[1,1,2]"],
    ],
    [
      ["Best subsequence", "[1,2]"],
      ["Best length anywhere", "2"],
    ],
  ],
  35: [
    [
      ["Items: weight / value", "2/3, 3/4, 4/5"],
      ["Capacity", "5"],
    ],
    [
      ["Take weight 4", "value 5"],
      ["Take weights 2 and 3", "value 7"],
    ],
    [
      ["Best feasible value", "7"],
      ["Each item used", "at most once"],
    ],
  ],
  37: [
    [
      ["Input", "[4,2,4]"],
      ["Seen", "{}"],
    ],
    [["After first 4, then 2", "{4,2}"]],
    [
      ["After repeated 4", "{4,2}"],
      ["Distinct count", "2"],
    ],
  ],
  41: [
    [
      ["Append to a copy", "[2,5,4,1]"],
      ["New value position", "3"],
    ],
    [["Swap positions 3 and 1", "[2,1,4,5]"]],
    [
      ["Swap positions 1 and 0", "[1,2,4,5]"],
      ["Root has no parent", "stop"],
    ],
  ],
  42: [
    [
      ["Target", "4"],
      ["Current window / sum", "[2,3] / 5"],
      ["Shortest so far", "2"],
    ],
    [
      ["Remove 2", "[3] / sum 3: too small"],
      ["Then add 1", "[3,1] / sum 4"],
    ],
    [
      ["Current length / best", "2 / 2"],
      ["After trying to shrink", "[1] has sum 1: too small"],
    ],
  ],
  43: [
    [
      ["Current substring", "ab"],
      ["Seen", "{a,b}"],
      ["Longest length", "2"],
    ],
    [
      ["Incoming a repeats", "remove old a, leaving b"],
      ["Add new a", "ba"],
    ],
    [
      ["Current substring", "ba"],
      ["Seen", "{b,a}"],
      ["Longest length", "2"],
    ],
  ],
  44: [
    [
      ["Untouched chain", "A → B → C → None"],
      ["Reversed beginning", "None"],
    ],
    [
      ["Saved next", "B"],
      ["Reversed beginning", "A → None"],
      ["Untouched chain", "B → C → None"],
    ],
    [
      ["New head", "C"],
      ["Reversed chain", "C → B → A → None"],
    ],
  ],
  45: [
    [
      ["Input / target", "[2,4,4,8] / 4"],
      ["Desired boundary", "first value at least 4: index 1"],
    ],
    [
      ["First middle index / value", "2 / 4"],
      ["Keep half-open bounds", "[0,2): index 2 remains the boundary candidate"],
    ],
    [
      ["After checking indices 1 then 0", "left = right = 1"],
      ["Returned boundary", "1"],
    ],
  ],
  46: [
    [
      ["Existing tree", "root 5, left child 2"],
      ["Insert", "4"],
    ],
    [["Search path", "5 → left 2 → right empty"]],
    [
      ["Resulting left branch", "2 → right child 4"],
      ["Returned root", "5"],
    ],
  ],
  51: [
    [
      ["Values", "[2,1,3]"],
      ["Waiting indices bottom → top", "[0,1]"],
    ],
    [
      ["Incoming 3 beats 1", "answer[1] = 3"],
      ["Waiting indices", "[0]"],
    ],
    [
      ["3 also beats 2", "answer[0] = 3"],
      ["Final answers", "[3,3,None]"],
    ],
  ],
  52: [
    [["Ranges", "[1,3], [2,5], [8,9]"]],
    [["Combine first two", "[1,5]"]],
    [
      ["Gap before 8", "begin separate range"],
      ["Returned ranges", "[[1,5],[8,9]]"],
    ],
  ],
  53: [
    [
      ["Input", "[5,2,5]"],
      ["Running XOR", "0"],
    ],
    [
      ["After first 5", "5"],
      ["After 2", "7"],
      ["After second 5", "2"],
    ],
    [
      ["Equal pair cancels", "5 XOR 5 = 0"],
      ["Unpaired answer", "2"],
    ],
  ],
  55: [
    [
      ["Links", "0 → 1 → 2 → 1 → …"],
      ["Slow / fast initially", "0 / 0 (not yet a cycle test)"],
    ],
    [
      ["After one round", "slow 1 / fast 2"],
      ["Cycle trail", "1 → 2 → 1"],
    ],
    [
      ["After two rounds", "slow 2 / fast 2"],
      ["Met after moving", "cycle exists"],
    ],
  ],
  56: [
    [["Directed edges", "0→1: 4; 0→2: 5; 2→1: -3"]],
    [
      ["Direct cost to 1", "4"],
      ["Cost through 2", "5 - 3 = 2"],
      ["Best distance list", "[0,2,5]"],
    ],
    [
      ["This graph has no cycle", "distances stay [0,2,5]"],
      ["General extra-pass check", "further improvement would flag a reachable negative cycle"],
    ],
  ],
  59: [
    [
      ["Current pair", "(18,12)"],
      ["Remainder", "18 % 12 = 6"],
      ["Next pair", "(12,6)"],
    ],
    [
      ["Remainder", "12 % 6 = 0"],
      ["Next pair", "(6,0)"],
    ],
    [
      ["Second number is zero", "stop"],
      ["Greatest common divisor", "6"],
    ],
  ],
};
