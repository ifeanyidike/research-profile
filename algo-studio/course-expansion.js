// Stable IDs extend the original course. Examples and wording are original.
const t = (args, expected) => ({ args, expected });
const q = (prompt, options, answer, why) => ({ prompt, options, answer, why });
function exercise(title, task, params, solution, tests, hints, input, output, example) {
  return {
    title,
    task,
    starter: `def solve(${params}):\n    # Build one small step at a time.\n    pass`,
    solution,
    tests,
    hints,
    exerciseBrief: { input, output, example },
  };
}
function lesson(id, data) {
  return {
    id,
    ...data,
    idea: data.explanation.join("\n\n"),
    analogy: data.explanation[0],
    simpleIdea: data.summary,
    simpleCost: data.work,
    costMemory: data.memory,
    words: data.terms,
    minutes: null,
    walk: data.frames.map(([action]) => action),
    diagramFrames: data.frames.map(([, values]) => values),
  };
}
export const newLessons = [
  lesson(60, {
    ...exercise(
      "The best stretch: keep going or start again",
      "Write solve(items) to return the largest sum of a nonempty consecutive stretch of integers. Return None for an empty list. Use one pass without slicing every stretch.",
      "items",
      "def solve(items):\n    if not items:\n        return None\n    ending = best = items[0]\n    for i in range(1, len(items)):\n        value = items[i]\n        ending = max(value, ending + value)\n        best = max(best, ending)\n    return best",
      [t([[-2, 3, -1, 4, -6]], 6), t([[-5, -2, -8]], -2), t([[]], null), t([[0]], 0)],
      [
        "Separate the best sum ending here from the best sum anywhere so far.",
        "At a new value, compare starting here with extending the old ending. Initialize with the first value.",
      ],
      "A possibly empty list of integers, including negative values.",
      "The largest sum of a nonempty consecutive stretch; None for empty input.",
      "The stretch [3, -1, 4] totals 6. The -2 before it and -6 after it make it worse, so return 6."
    ),
    summary: "At each new value, decide whether to extend the previous stretch or begin a fresh one.",
    explanation: [
      "Imagine daily gains and losses [-2, 3, -1, 4, -6]. We want the most profitable uninterrupted stretch. We may choose where it starts and ends, but cannot skip a day inside it.",
      "Try all stretches first and you will get the answer, but many repeat the same additions. Instead ask: what is the best stretch ending exactly today? It either starts today, or extends the best stretch that ended yesterday. Those are the only two possibilities.",
      "At 3, starting fresh gives 3 instead of carrying -2 forward. At -1, extending gives 2. At 4, extending gives 6. Keep that 6 even when the final -6 makes the best ending fall to 0. This is often called Kadane’s algorithm.",
    ],
    discovery: [
      "Enumerate each starting and ending position to get a correct small-input baseline.",
      "Only the best previous ending can produce the best extension; a worse ending stays worse after adding the same new value.",
      "Every nonempty stretch ending here either contains only this value or has an earlier ending. Comparing those cases is exhaustive. Keep a separate global best. An all-negative list must return its least negative value, not an invented empty stretch worth 0.",
    ],
    frames: [
      [
        "Start at -2. The best ending is -2 and the best overall is -2.",
        [
          ["New value", "-2"],
          ["Best ending here", "-2"],
          ["Best anywhere", "-2"],
        ],
      ],
      [
        "Read 3. Starting at 3 beats extending to -2 + 3 = 1.",
        [
          ["New value", "3"],
          ["Start / extend", "3 / 1"],
          ["Ending / best", "3 / 3"],
        ],
      ],
      [
        "Read -1, then 4. Extend to 2, then to 6; the best stretch is [3, -1, 4].",
        [
          ["New value", "4"],
          ["Start / extend", "4 / 6"],
          ["Ending / best", "6 / 6"],
        ],
      ],
      [
        "Read -6. The ending drops to 0, but the best sum seen remains 6.",
        [
          ["New value", "-6"],
          ["Start / extend", "-6 / 0"],
          ["Ending / best", "0 / 6"],
        ],
      ],
    ],
    trap: "Do not initialize best to 0: a nonempty all-negative input must still choose a value. A best ending is different from a best anywhere.",
    predict: q(
      "What is the best nonempty stretch sum in [-4, -1, -7]?",
      ["0", "-1", "-12"],
      1,
      "We must choose a nonempty stretch. The single value -1 is better than any larger selection here."
    ),
    reflect: q(
      "Why is just one previous ending enough to form the next best ending?",
      [
        "Adding the same new value preserves which ending was best",
        "Negative values can always be skipped inside a stretch",
        "The whole input must be sorted",
      ],
      0,
      "Any worse old ending stays worse after the same addition, so it cannot produce the best extension."
    ),
    work: "Read each value once and compare two possible endings. Doubling the input roughly doubles the updates.",
    memory: "Remember the best sum ending at the current position and the best sum anywhere. The index loop does not copy the input.",
    cost: "O(n) time and O(1) extra space with the shown index loop.",
    terms: [
      ["Consecutive", "Neighbors with no skipped positions."],
      ["State", "A precisely defined smaller answer, such as the best sum ending here."],
    ],
    requires: [1, 21],
  }),
  lesson(61, {
    ...exercise(
      "Count stretches with a target total",
      "Write solve(items, target) to count nonempty consecutive stretches summing to target. Integers may be negative or zero. Use running totals and a dictionary of earlier total frequencies.",
      "items, target",
      "def solve(items, target):\n    counts = {0: 1}\n    total = answer = 0\n    for value in items:\n        total += value\n        answer += counts.get(total - target, 0)\n        counts[total] = counts.get(total, 0) + 1\n    return answer",
      [t([[1, -1, 1], 1], 3), t([[0, 0], 0], 3), t([[], 0], 0), t([[2, -2], 5], 0)],
      [
        "A range sum equals the later running total minus an earlier one.",
        "For running total p, add the frequency of p - target before recording p. Start with {0: 1}.",
      ],
      "An integer list and an integer target; negative values and zeros are allowed.",
      "The number of nonempty consecutive stretches with that total, counting different positions separately.",
      "In [1, -1, 1], the two single 1s and the whole list total 1. Return 3."
    ),
    summary: "Turn a range-sum question into a lookup for an earlier running total.",
    explanation: [
      "A shrinking window for positive values relied on the sum moving in a predictable direction. Negative values break that rule. We need another way to count ranges without guessing how to move a boundary.",
      "Suppose the current running total is p. A stretch ending here totals target exactly when the running total before its start was p - target. This is the same subtraction used by prefix sums, rearranged to ask what earlier total we need.",
      "Store how many times each earlier total occurred. Every matching earlier boundary gives a different stretch. Before reading anything, total 0 has occurred once: the boundary before position 0. Look up matches before recording the current total so you do not count an empty stretch.",
    ],
    discovery: [
      "Try every start and end on a tiny list. This handles negatives correctly but uses quadratic work.",
      "From p - earlier = target, derive earlier = p - target. A dictionary counts how many such earlier boundaries exist.",
      "Each stretch is counted exactly once at its ending boundary. Repeated totals need frequencies, not just a set. Looking up before insertion excludes an empty range when target is 0.",
    ],
    frames: [
      [
        "Before [1, -1, 1], record running total 0 once. No stretch has been counted.",
        [
          ["Earlier totals", "{0: 1}"],
          ["Answer", "0"],
        ],
      ],
      [
        "Read 1: total 1 needs earlier total 0. One match; record total 1.",
        [
          ["Running / needed", "1 / 0"],
          ["Earlier totals after recording", "{0: 1, 1: 1}"],
          ["Answer", "1"],
        ],
      ],
      [
        "Read -1: total 0 needs -1. No match; total 0 has now occurred twice.",
        [
          ["Running / needed", "0 / -1"],
          ["Earlier totals after recording", "{0: 2, 1: 1}"],
          ["Answer", "1"],
        ],
      ],
      [
        "Read the last 1: total 1 needs 0. Its two earlier occurrences add two stretches, giving 3.",
        [
          ["Running / needed", "1 / 0"],
          ["Matches now", "2"],
          ["Answer", "3"],
        ],
      ],
    ],
    trap: "A set loses multiplicity. Recording the current total before querying counts an empty stretch for target 0.",
    predict: q(
      "How many nonempty stretches of [0, 0] have total 0?",
      ["1", "2", "3"],
      2,
      "Choose the first zero, the second zero, or both. Different start and end positions count separately."
    ),
    reflect: q(
      "Why do we record running total 0 once before reading the list?",
      ["To count stretches beginning at position 0", "To count an empty stretch in every answer", "To remove negative values"],
      0,
      "The boundary before the first element has total 0, so ranges starting there need that entry."
    ),
    work: "For each value, update one running total and perform a few dictionary operations. Expected work grows with input length.",
    memory: "Store a count for each distinct earlier total. There can be up to n + 1 of them.",
    cost: "Expected O(n) time and O(n) extra space with standard hash-map assumptions.",
    terms: [
      ["Boundary", "A position between elements; a stretch lies between two boundaries."],
      ["Frequency", "How many earlier boundaries had a particular running total."],
    ],
    requires: [5, 12, 42],
  }),
  lesson(62, {
    ...exercise(
      "Search the answer: how fast must we work?",
      "Write solve(piles, hours). Each hour processes up to speed units from one pile; unused time cannot move to another pile. Return the smallest positive integer speed finishing within hours. Piles contain positive integers. hours >= len(piles). Return 0 for no piles. Use binary search over speeds.",
      "piles, hours",
      "def solve(piles, hours):\n    if not piles:\n        return 0\n    left, right = 1, max(piles)\n    while left < right:\n        middle = (left + right) // 2\n        needed = sum((p + middle - 1) // middle for p in piles)\n        if needed <= hours:\n            right = middle\n        else:\n            left = middle + 1\n    return left",
      [t([[3, 6, 7], 6], 3), t([[9], 2], 5), t([[], 0], 0), t([[2, 5], 2], 5)],
      [
        "At speed s, a pile p needs (p + s - 1) // s hours. Sum across piles.",
        "If a speed works, every faster speed works. Search for the first working speed between 1 and max(piles).",
      ],
      "Positive integer piles and an integer hours at least the number of piles; an empty pile list is allowed.",
      "The smallest positive integer processing speed meeting the deadline, or 0 for no work.",
      "At speed 3, piles [3, 6, 7] need 1 + 2 + 3 = 6 hours. Speed 2 needs 2 + 3 + 4 = 9. Return 3."
    ),
    summary: "When a proposed answer is easy to check and faster answers always work, search for the boundary.",
    explanation: [
      "We do not have a sorted list of answers. We have possible speeds: 1, 2, 3, and so on. Testing a speed is easier than finding the best speed directly.",
      "At speed 3, a pile of 7 needs three hours, because two hours only handle 6 units. Round each pile's time up separately. A faster speed never needs more hours, so the possible speeds form a failing beginning followed by a working ending.",
      "This is a boundary search over answers. A failing middle speed rules out itself and all slower speeds. A working middle speed remains a candidate, but we still search for an earlier working speed. The maximum pile is a safe working upper bound under the given deadline rule.",
    ],
    discovery: [
      "Test speeds in increasing order until one works. That is correct, but a huge maximum pile makes it slow.",
      "Notice the yes/no check is monotone: after the first working speed, every later speed works too.",
      "Keep the first working speed inside [left, right]. A failure moves left past middle; a success keeps middle as right. The interval shrinks until both ends agree. This technique needs a proven monotone check and a valid upper bound.",
    ],
    frames: [
      [
        "Piles [3, 6, 7], deadline 6. Speeds 1 through 7 are candidates.",
        [
          ["Bounds", "[1, 7]"],
          ["Known working upper bound", "7"],
        ],
      ],
      [
        "Try speed 4: 1 + 2 + 2 = 5 hours. It works; keep speeds 1 through 4.",
        [
          ["Test", "4 → 5 hours"],
          ["Bounds", "[1, 4]"],
        ],
      ],
      [
        "Try speed 2: 2 + 3 + 4 = 9 hours. Too slow; keep speeds 3 through 4.",
        [
          ["Test", "2 → 9 hours"],
          ["Bounds", "[3, 4]"],
        ],
      ],
      [
        "Try speed 3: 1 + 2 + 3 = 6 hours. Keep [3, 3]; return 3.",
        [
          ["Test", "3 → 6 hours"],
          ["Bounds / answer", "[3, 3] / 3"],
        ],
      ],
    ],
    trap: "Round each pile up before adding. Rounding the combined volume assumes unused time transfers between piles, which this task forbids.",
    predict: q(
      "One pile has 9 units and the deadline is 2 hours. Which speed is smallest?",
      ["4", "5", "9"],
      1,
      "Speed 4 needs three hours. Speed 5 finishes in two, so the smallest working speed is 5."
    ),
    reflect: q(
      "Which property lets us discard all slower speeds after a failed check?",
      ["Faster speeds never require more hours", "Every pile has the same size", "The speed is an input array position"],
      0,
      "Monotonicity gives a single failing-to-working boundary even though there is no stored sorted array."
    ),
    work: "Each proposed speed checks every pile. Halving the speed range means only about log₂(maximum pile) proposals.",
    memory: "Store the bounds, proposed speed, and total hours. The sum uses a generator rather than a list of all times.",
    cost: "O(n log M) time and O(1) extra space for n piles and maximum pile M.",
    terms: [
      ["Monotone", "Here, once a speed works, increasing it keeps it working."],
      ["Feasible", "Meets the deadline under the stated rules."],
    ],
    requires: [45, 38],
  }),
  lesson(63, {
    ...exercise(
      "Can every connection cross between two groups?",
      "Write solve(n, edges) for an undirected graph with nodes 0 through n - 1. Return True if nodes can be split into two groups so every edge crosses groups, otherwise False. Include disconnected components. Self-loops make it impossible. Use graph traversal.",
      "n, edges",
      "from collections import deque\ndef solve(n, edges):\n    graph = [[] for _ in range(n)]\n    for a, b in edges:\n        graph[a].append(b)\n        graph[b].append(a)\n    color = [-1] * n\n    for start in range(n):\n        if color[start] != -1:\n            continue\n        color[start] = 0\n        queue = deque([start])\n        while queue:\n            node = queue.popleft()\n            for other in graph[node]:\n                if color[other] == -1:\n                    color[other] = 1 - color[node]\n                    queue.append(other)\n                elif color[other] == color[node]:\n                    return False\n    return True",
      [
        t(
          [
            3,
            [
              [0, 1],
              [1, 2],
              [2, 0],
            ],
          ],
          false
        ),
        t(
          [
            4,
            [
              [0, 1],
              [2, 3],
            ],
          ],
          true
        ),
        t([1, [[0, 0]]], false),
        t([0, []], true),
      ],
      [
        "Assign each unseen component a starting group, then give every neighbor the opposite group.",
        "If an already assigned neighbor has the same group, return False. Restart traversal at every still-unassigned node.",
      ],
      "A nonnegative node count n and undirected edges whose endpoints are valid node numbers.",
      "Whether there is a two-group assignment putting every edge's endpoints in different groups.",
      "In the triangle, 0 in group A forces 1 into B and 2 into A along 0–1–2. Edge 2–0 then connects two A nodes, so return False."
    ),
    summary: "A neighbor must have the opposite group. Propagate that rule and look for contradictions.",
    explanation: [
      "Suppose some pairs of people must be on different teams. With just two teams, assigning one person forces every neighbor onto the other team. Following connections keeps forcing assignments.",
      "On a triangle, start with 0 on A. Its neighbors 1 and 2 must both be on B, but the edge between 1 and 2 demands opposite teams. That contradiction makes the task impossible. A graph allowing this assignment is called bipartite.",
      "Use BFS or DFS to spread the assignments. A disconnected part needs its own starting person. Choosing A or B first there makes no difference: swapping the names of all teams in a component preserves every opposite-team relationship.",
    ],
    discovery: [
      "Try all 2ⁿ assignments as a small-input baseline. Most choices are not independent once an edge is considered.",
      "Choose one starting color, then let each edge force the other endpoint's color.",
      "Every valid assignment must obey those forced relationships, up to swapping both colors in a component. A conflict therefore rules out every assignment there. If traversal ends without conflict, the colors themselves give a valid assignment.",
    ],
    frames: [
      [
        "Triangle edges: 0–1, 1–2, 2–0. Begin with all nodes unassigned.",
        [
          ["0", "unassigned"],
          ["1", "unassigned"],
          ["2", "unassigned"],
        ],
      ],
      [
        "Start at 0 and assign group A.",
        [
          ["0", "A"],
          ["1", "unassigned"],
          ["2", "unassigned"],
        ],
      ],
      [
        "Both neighbors of 0 must be in B. Put them in the queue.",
        [
          ["0", "A"],
          ["1", "B"],
          ["2", "B"],
        ],
      ],
      [
        "Inspect edge 1–2: both ends are B. No valid two-group assignment exists.",
        [
          ["Conflicting edge", "1(B) — 2(B)"],
          ["Answer", "False"],
        ],
      ],
    ],
    trap: "Checking only the component containing node 0 can miss a conflicting component elsewhere. A self-loop always conflicts with its own node.",
    predict: q(
      "Does a four-node cycle 0–1–2–3–0 admit two groups?",
      ["Yes: A, B, A, B", "No: every cycle is impossible", "Only if one edge is removed"],
      0,
      "An even cycle alternates groups and returns consistently. Odd cycles produce a conflict."
    ),
    reflect: q(
      "Why can each unseen disconnected component start with either group?",
      [
        "No edge constrains its colors relative to earlier components",
        "Disconnected nodes have no edges inside their component",
        "Only the first component needs checking",
      ],
      0,
      "Swapping both colors throughout a component leaves all of its crossing relationships unchanged."
    ),
    work: "Build neighbor lists, assign every node once, and inspect each undirected edge in both directions.",
    memory: "Neighbor lists, colors, and the queue grow with the graph.",
    cost: "O(V + E) time and O(V + E) extra space including the adjacency lists.",
    terms: [
      ["Bipartite", "Nodes can be divided into two groups with every edge crossing between them."],
      ["Component", "A connected part of the graph."],
    ],
    requires: [18, 40],
  }),
  lesson(64, {
    ...exercise(
      "Start a search from many places at once",
      "Write solve(grid). In a rectangular grid, 0 is a source and 1 is an ordinary cell. Return a grid of fewest up/down/left/right moves to any source. There are no blocked cells. Use -1 where no source is reachable. Return [] for an empty grid. Use one multi-source BFS.",
      "grid",
      "from collections import deque\ndef solve(grid):\n    if not grid:\n        return []\n    rows, cols = len(grid), len(grid[0])\n    distance = [[-1] * cols for _ in range(rows)]\n    queue = deque()\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == 0:\n                distance[r][c] = 0\n                queue.append((r, c))\n    while queue:\n        r, c = queue.popleft()\n        for nr, nc in ((r-1,c), (r+1,c), (r,c-1), (r,c+1)):\n            if 0 <= nr < rows and 0 <= nc < cols and distance[nr][nc] == -1:\n                distance[nr][nc] = distance[r][c] + 1\n                queue.append((nr, nc))\n    return distance",
      [
        t(
          [
            [
              [0, 1, 1],
              [1, 1, 0],
            ],
          ],
          [
            [0, 1, 1],
            [1, 1, 0],
          ]
        ),
        t([[[1, 1]]], [[-1, -1]]),
        t([[]], []),
        t([[[]]], [[]]),
      ],
      [
        "Put every source in the queue at distance 0 before processing anything.",
        "Give an unvisited neighbor current distance + 1 when enqueuing it. This makes first discovery its nearest-source distance.",
      ],
      "A rectangular grid of 0s (sources) and 1s (ordinary cells), possibly empty. All cells can be crossed.",
      "A same-shaped grid of shortest distances to any source; -1 for every cell if no source exists.",
      "Each 1 in [[0,1,1],[1,1,0]] is next to a source, so every such distance is 1."
    ),
    summary: "Put every source into the first BFS wave, then let the closest wave reach each cell first.",
    explanation: [
      "Imagine several help stations on a map. For each location, you want the distance to its closest station. Running BFS separately from every station repeats much of the same exploration.",
      "Instead put every station in one queue with distance 0. Their neighbors form distance 1, then the next wave forms distance 2. The waves expand together, and whichever source reaches a cell first gives its nearest distance.",
      "Mark a cell when you put it in the queue. Another source may reach it later, but cannot offer a shorter distance because BFS handles all smaller distances first. Here every move costs 1 and all cells are passable.",
    ],
    discovery: [
      "Run BFS from each source and take the minimum distance at each cell. That gives a correct baseline.",
      "All those searches share the same distance layers. Seed one queue with all distance-0 cells instead of repeating the layers.",
      "Every newly assigned distance d + 1 comes from distance d. No source can offer a smaller distance later because every smaller layer is processed first. With no sources, the queue stays empty and distances remain -1.",
    ],
    frames: [
      [
        "The grid has sources at the two opposite corners. Queue both before taking any move.",
        [
          ["Input row 0", "0  1  1"],
          ["Input row 1", "1  1  0"],
          ["Queue", "(0,0), (1,2)"],
        ],
      ],
      [
        "The first source gives distance 1 to (0,1) and (1,0). The other source is still waiting at distance 0.",
        [
          ["Distance row 0", "0  1  -1"],
          ["Distance row 1", "1  -1  0"],
        ],
      ],
      [
        "The second source gives distance 1 to (0,2) and (1,1). All sources were handled before distance-1 cells.",
        [
          ["Distance row 0", "0  1  1"],
          ["Distance row 1", "1  1  0"],
        ],
      ],
      [
        "Process the remaining queue. Every neighbor is already assigned, so the distances stay unchanged.",
        [
          ["Final row 0", "0  1  1"],
          ["Final row 1", "1  1  0"],
        ],
      ],
    ],
    trap: "Do not finish one source's BFS before adding the other sources. They must all begin at distance 0 in the same queue.",
    predict: q(
      "What distances should a one-row grid [0, 1, 1, 1, 0] return?",
      ["[0, 1, 2, 1, 0]", "[0, 1, 2, 3, 4]", "[0, 0, 0, 0, 0]"],
      0,
      "Each cell uses whichever end source is closer; the middle cell is two moves from either."
    ),
    reflect: q(
      "What lets one queue replace a separate search from each source?",
      ["All sources begin in distance layer 0", "Every cell must be next to a source", "The queue sorts cells by row number"],
      0,
      "A single BFS visits increasing distance layers for all sources together, so first discovery gives the minimum."
    ),
    work: "Scan for sources once, then visit each cell and its at most four neighbors once.",
    memory: "Keep a distance grid and a queue that can contain many cells.",
    cost: "O(rows × cols) time and O(rows × cols) space.",
    terms: [
      ["Source", "A starting cell assigned distance 0."],
      ["Multi-source BFS", "One breadth-first search seeded with every starting place."],
    ],
    requires: [18, 49],
  }),
  lesson(65, {
    ...exercise(
      "Edit distance: how many small changes?",
      "Write solve(a, b) to return the fewest single-character insertions, deletions, and replacements turning string a into string b. Each edit costs 1; a match costs 0. Use dynamic programming.",
      "a, b",
      "def solve(a, b):\n    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]\n    for i in range(len(a) + 1):\n        dp[i][0] = i\n    for j in range(len(b) + 1):\n        dp[0][j] = j\n    for i in range(1, len(a) + 1):\n        for j in range(1, len(b) + 1):\n            if a[i-1] == b[j-1]:\n                dp[i][j] = dp[i-1][j-1]\n            else:\n                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\n    return dp[-1][-1]",
      [t(["cat", "cut"], 1), t(["", "abc"], 3), t(["abc", ""], 3), t(["same", "same"], 0), t(["kitten", "sitting"], 3)],
      [
        "Define dp[i][j] as the cost to turn the first i characters of a into the first j of b.",
        "Empty prefixes need i deletions or j insertions. Otherwise compare delete, insert, and replace; matching characters use the diagonal unchanged.",
      ],
      "Two strings, either of which may be empty. Characters are compared exactly, including case.",
      "The minimum number of unit-cost insertions, deletions, or replacements needed.",
      "Replace a with u to turn cat into cut. One change is necessary and sufficient, so return 1."
    ),
    summary: "Define a cost for two string beginnings, then compare the possible final edits.",
    explanation: [
      "Turning cat into cut needs one replacement. Turning an empty string into cat needs three insertions. We want the cheapest sequence of edits, not just a count of mismatching positions, because insertions shift those positions.",
      "Let dp[i][j] be the fewest edits turning the first i characters of a into the first j characters of b. If their final characters match, reuse the answer for both shorter beginnings. No edit is needed for that matching pair.",
      "If they differ, compare three ways to finish: delete the final source character, insert the final target character, or replace one with the other. Each costs 1 plus a smaller answer. The empty first row and column count the required insertions and deletions; they are not all zeros as in the common-subsequence table.",
    ],
    discovery: [
      "Try possible edits recursively to get a baseline, noticing that many branches ask about the same pair of prefixes.",
      "Name each smaller question with two prefix lengths. Save its minimum cost in a table before solving bigger pairs.",
      "An alignment ends with a matching pair, a replacement, an insertion, or a deletion. The recurrence considers these possibilities, so it cannot miss a cheaper alignment. Build the table in an order where every referenced cell is ready.",
    ],
    frames: [
      [
        "Compare cat with cut. First prepare empty-prefix costs: inserting c, then u, then t costs 1, 2, then 3.",
        [
          ["Target prefixes", "empty | c | cu | cut"],
          ["Empty source costs", "0 | 1 | 2 | 3"],
        ],
      ],
      [
        "The first c matches c, so dp[1][1] = dp[0][0] = 0.",
        [
          ["Source / target", "c / c"],
          ["Cost", "0"],
        ],
      ],
      [
        "For ca → cu, replace a with u. Deleting or inserting costs 2; replacing costs 1.",
        [
          ["Delete / insert / replace", "2 / 2 / 1"],
          ["dp[2][2]", "1"],
        ],
      ],
      [
        "The final t matches t. Reuse dp[2][2], giving dp[3][3] = 1.",
        [
          ["Source / target", "cat / cut"],
          ["Minimum edits", "1"],
        ],
      ],
    ],
    trap: "A row or column representing an empty string needs its prefix length, not 0. Longest common subsequence and edit distance have different states and base cases.",
    predict: q(
      "With insertion, deletion, and replacement costing 1 each, how many edits turn abc into axc?",
      ["0", "1", "2"],
      1,
      "One replacement changes b to x. Treating a replacement as deletion plus insertion would overcount here."
    ),
    reflect: q(
      "Why must dp[0][j] contain j rather than 0 in this problem?",
      ["Building a length-j string from nothing requires j insertions", "The first row is never used", "Every matching character costs 1"],
      0,
      "The state measures edits. With no source characters, every target character must be inserted."
    ),
    work: "Fill one cell for each pair of prefix lengths and compare at most three smaller costs per cell.",
    memory: "The full table has (len(a) + 1) × (len(b) + 1) cells. A rolling-row version can reduce memory when only the cost is required.",
    cost: "O((m + 1)(n + 1)) time and space, usually written O(mn) for nonempty lengths m and n.",
    terms: [
      ["Edit", "One character insertion, deletion, or replacement here."],
      ["Prefix pair", "A beginning of the source string and a beginning of the target string."],
    ],
    requires: [33, 49],
  }),
];
export const expansionStage = [
  "Recognize the problem behind the story",
  "Combine earlier ideas and discover six more ways to solve unfamiliar problems.",
  "Further foundations",
  "◇",
  newLessons.map((l) => l.id),
];
export const newCheckpoints = {
  60: exercise(
    "The strongest circular stretch",
    "Return the maximum sum of a nonempty consecutive stretch in a circular integer list; a stretch may wrap from the end to the beginning but uses each position at most once. Return None for empty input. Aim for one pass.",
    "items",
    "def solve(items):\n    if not items:\n        return None\n    hi = lo = best = worst = total = items[0]\n    for i in range(1, len(items)):\n        x = items[i]\n        hi = max(x, hi + x)\n        lo = min(x, lo + x)\n        best = max(best, hi)\n        worst = min(worst, lo)\n        total += x\n    return best if best < 0 else max(best, total - worst)",
    [t([[5, -3, 5]], 10), t([[-3, -2]], -2), t([[]], null), t([[0]], 0)],
    [
      "A wrapping stretch is the whole sum minus a non-wrapping middle stretch.",
      "Compare the ordinary maximum with total minus the minimum stretch. For an all-negative list, use the ordinary maximum to avoid choosing nothing.",
    ],
    "An integer list regarded as circular, possibly empty.",
    "The best nonempty circular stretch sum, or None when empty.",
    "In [5, -3, 5], wrap from the last 5 to the first 5 for 10, leaving out -3."
  ),
  61: exercise(
    "The longest balanced record",
    "Return the length of the longest consecutive stretch containing equally many 0s and 1s in a binary list. Return 0 if none exists. Use a running balance and earliest positions.",
    "items",
    "def solve(items):\n    earliest = {0: -1}\n    balance = best = 0\n    for i, x in enumerate(items):\n        balance += 1 if x == 1 else -1\n        if balance in earliest:\n            best = max(best, i - earliest[balance])\n        else:\n            earliest[balance] = i\n    return best",
    [t([[0, 1, 0]], 2), t([[0, 0, 1, 1]], 4), t([[]], 0), t([[1, 1]], 0)],
    [
      "Treat 0 as -1 and 1 as +1. A balanced stretch then has sum 0.",
      "Equal running balances mark balanced boundaries. Keep the first occurrence of each balance to maximize distance.",
    ],
    "A list containing only 0s and 1s, possibly empty.",
    "The longest consecutive stretch length with equal counts of the two values, or 0.",
    "The first two entries of [0,1,0] balance one 0 and one 1. No length-3 stretch balances, so return 2."
  ),
  62: exercise(
    "Ship everything before the deadline",
    "Packages have positive integer weights in a fixed order. Each day ships one consecutive group with total weight at most capacity; no package is split. Return the smallest capacity shipping all packages in at most days days. days is positive. Return 0 for no packages. Use binary search.",
    "weights, days",
    "def solve(weights, days):\n    if not weights:\n        return 0\n    left, right = max(weights), sum(weights)\n    while left < right:\n        capacity = (left + right) // 2\n        used, load = 1, 0\n        for weight in weights:\n            if load + weight > capacity:\n                used += 1\n                load = 0\n            load += weight\n        if used <= days:\n            right = capacity\n        else:\n            left = capacity + 1\n    return left",
    [t([[1, 2, 3, 4], 2], 6), t([[5], 3], 5), t([[], 1], 0), t([[2, 2], 1], 4)],
    [
      "Capacity is at least the heaviest package and at most the whole sum.",
      "Check a capacity by filling each day as far as order allows. Larger capacities never need more days.",
    ],
    "Positive package weights in shipping order and a positive day limit.",
    "The smallest daily weight capacity meeting the limit, preserving order, or 0 for empty input.",
    "Capacity 6 ships [1,2,3] then [4]. Capacity 5 needs three days, so return 6."
  ),
  63: exercise(
    "Return the two-team assignment",
    "For an undirected graph with nodes 0 through n - 1, return a list of 0/1 team labels with opposite labels across every edge. In each connected component, its smallest node must have label 0. Return [] if impossible. Inspect neighbors in the given edge order.",
    "n, edges",
    "from collections import deque\ndef solve(n, edges):\n    graph = [[] for _ in range(n)]\n    for a, b in edges:\n        graph[a].append(b)\n        graph[b].append(a)\n    color = [-1] * n\n    for start in range(n):\n        if color[start] != -1:\n            continue\n        color[start] = 0\n        queue = deque([start])\n        while queue:\n            node = queue.popleft()\n            for other in graph[node]:\n                if color[other] == -1:\n                    color[other] = 1 - color[node]\n                    queue.append(other)\n                elif color[other] == color[node]:\n                    return []\n    return color",
    [
      t(
        [
          4,
          [
            [0, 1],
            [2, 3],
          ],
        ],
        [0, 1, 0, 1]
      ),
      t(
        [
          3,
          [
            [0, 1],
            [1, 2],
            [2, 0],
          ],
        ],
        []
      ),
      t([2, []], [0, 0]),
      t([0, []], []),
    ],
    [
      "Propagate opposite labels as in the lesson, but keep and return the assignments.",
      "Start unassigned nodes in increasing numeric order with label 0. Each starts the smallest node in its component.",
    ],
    "An undirected graph on nodes 0 through n - 1, including isolated nodes.",
    "One canonical 0/1 label per node, with the smallest node of each component labelled 0; [] if impossible.",
    "Components {0,1} and {2,3} each start at their smaller node with 0. Return [0,1,0,1]."
  ),
  64: exercise(
    "How long until everything is reached?",
    "In a rectangular grid, 0 is empty, 1 is fresh, and 2 is an initial spreading source. Every minute, every source spreads to fresh up/down/left/right neighbors; reached cells spread from the next minute. Empty cells block spreading. Return minutes to reach all fresh cells, -1 if impossible, and 0 if none are fresh.",
    "grid",
    "from collections import deque\ndef solve(grid):\n    rows = len(grid)\n    cols = len(grid[0]) if rows else 0\n    queue, seen = deque(), set()\n    fresh = 0\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == 2:\n                queue.append((r,c,0))\n                seen.add((r,c))\n            elif grid[r][c] == 1:\n                fresh += 1\n    minutes = 0\n    while queue:\n        r,c,time = queue.popleft()\n        for nr,nc in ((r-1,c),(r+1,c),(r,c-1),(r,c+1)):\n            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1 and (nr,nc) not in seen:\n                seen.add((nr,nc))\n                fresh -= 1\n                minutes = time + 1\n                queue.append((nr,nc,time+1))\n    return minutes if fresh == 0 else -1",
    [
      t(
        [
          [
            [2, 1, 1],
            [0, 1, 1],
          ],
        ],
        3
      ),
      t([[[2, 0, 1]]], -1),
      t([[[0, 2]]], 0),
      t([[]], 0),
    ],
    [
      "Seed the queue with all sources at minute 0 and count fresh cells.",
      "Mark fresh cells when enqueuing, decrement their count, and carry a minute with each visit. Any fresh cells left after the queue empties are unreachable.",
    ],
    "A rectangular grid of empty cells (0), fresh cells (1), and sources (2), possibly empty.",
    "The last fresh cell's arrival minute, -1 if some remain unreachable, or 0 if no fresh cells exist.",
    "In [[2,1,1],[0,1,1]], the farthest fresh cell is three moves from the source, so return 3."
  ),
  65: exercise(
    "Only inserts and deletes are allowed",
    "Return the fewest insertions and deletions turning string a into b. Replacement is not allowed; replacing a character therefore needs a deletion and an insertion. Use dynamic programming or the longest common subsequence relationship.",
    "a, b",
    "def solve(a, b):\n    dp = list(range(len(b) + 1))\n    for i, x in enumerate(a, 1):\n        previous = dp[0]\n        dp[0] = i\n        for j, y in enumerate(b, 1):\n            above = dp[j]\n            dp[j] = previous if x == y else 1 + min(above, dp[j-1])\n            previous = above\n    return dp[-1]",
    [t(["cat", "cut"], 2), t(["", "abc"], 3), t(["abc", "abc"], 0), t(["ab", "ba"], 2)],
    [
      "A mismatch can use only insertion or deletion, not a cost-1 diagonal replacement.",
      "Alternatively keep a longest common subsequence, delete other source characters, and insert missing target characters.",
    ],
    "Two strings compared exactly, including case.",
    "The minimum number of unit-cost insertions and deletions; replacements are forbidden.",
    "For cat → cut, delete a and insert u. That costs 2, rather than the cost-1 replacement allowed in the lesson."
  ),
};
const mixed = (requires, data) => ({ ...data, requires });
export const newTransfers = {
  1: mixed(
    [1],
    exercise(
      "Balances after each reading",
      "Return one running total after each integer reading. An empty input returns []. Leave the input unchanged.",
      "items",
      "def solve(items):\n    result = []\n    total = 0\n    for x in items:\n        total += x\n        result.append(total)\n    return result",
      [t([[4, -2, 3]], [4, 2, 5]), t([[]], []), t([[-1, -2]], [-1, -3])],
      [
        "Which quantity changes when one new reading arrives?",
        "Keep the previous total, add the next reading, and save that total in a new result list.",
      ],
      "A possibly empty integer list in reading order.",
      "One cumulative total per input position, in order; leave the input unchanged.",
      "After 4, -2, and 3, the successive totals are 4, 2, and 5."
    )
  ),
  3: mixed(
    [3],
    exercise(
      "A message in either direction",
      "Return whether a string reads the same in both directions after ignoring everything except ASCII letters and digits and treating uppercase letters as lowercase. A message with no such characters returns True.",
      "text",
      "def solve(text):\n    clean = ''.join(c.lower() for c in text if c.isascii() and c.isalnum())\n    left, right = 0, len(clean)-1\n    while left < right:\n        if clean[left] != clean[right]:\n            return False\n        left += 1\n        right -= 1\n    return True",
      [t(["A man, a plan, a canal: Panama!"], true), t(["ab!c"], false), t(["..."], true), t(["éA"], true)],
      [
        "Separate the rule deciding which characters count from the rule comparing their order.",
        "Normalize allowed characters, then compare corresponding ends. Do not count accented characters under this ASCII contract.",
      ],
      "Any string; only ASCII letters A–Z/a–z and digits 0–9 count.",
      "True if the retained, lowercase characters read identically forward and backward, otherwise False.",
      "The retained characters in the Panama message are amanaplanacanalpanama, which read the same both ways."
    )
  ),
  4: mixed(
    [4],
    exercise(
      "Enough activity in a stretch",
      "Count length-k consecutive stretches whose average is at least threshold. items contains integers; k and threshold are integers. Return 0 when k <= 0 or k exceeds the input length. Avoid floating-point division.",
      "items, k, threshold",
      "def solve(items, k, threshold):\n    if k <= 0 or k > len(items):\n        return 0\n    total = sum(items[:k])\n    answer = int(total >= k * threshold)\n    for i in range(k, len(items)):\n        total += items[i] - items[i-k]\n        answer += total >= k * threshold\n    return answer",
      [t([[2, 4, 1, 5], 2, 3], 2), t([[], 1, 0], 0), t([[-3, -1], 1, -2], 1)],
      [
        "For positive k, average >= threshold is equivalent to sum >= k × threshold.",
        "Update a length-k total as the group moves. Count qualifying starting positions, including the first and last groups.",
      ],
      "Integer readings, an integer group length k, and an integer threshold.",
      "The number of valid starting positions whose length-k average meets the threshold, or 0 for invalid k.",
      "In [2,4,1,5], length-2 averages are 3, 2.5, and 3. Two meet threshold 3."
    )
  ),
  5: mixed(
    [5],
    exercise(
      "Find a balance point",
      "Return the first index where the sum strictly before it equals the sum strictly after it. The value at that index belongs to neither side. Return -1 if absent. Use one whole-input total and a moving left total.",
      "items",
      "def solve(items):\n    whole = sum(items)\n    left = 0\n    for i, x in enumerate(items):\n        if left == whole - left - x:\n            return i\n        left += x\n    return -1",
      [t([[1, 7, 3, 6, 5, 6]], 3), t([[0]], 0), t([[]], -1), t([[1, 2]], -1)],
      [
        "Subtract the left total and current value from the whole total to get the right total.",
        "Check equality before adding the current value to the left. Scan in increasing index order for the first answer.",
      ],
      "A possibly empty list of integers.",
      "The first balancing index, counting from 0, or -1 if no position balances.",
      "At index 3 in [1,7,3,6,5,6], the left sum is 11 and the right sum is 11. The current 6 is excluded."
    )
  ),
  6: mixed(
    [6, 45],
    exercise(
      "The missing ticket number",
      "A sorted list contains distinct integers from 0 through n, with exactly one missing, where n is the list length. Return the missing number in logarithmic time without making a set.",
      "items",
      "def solve(items):\n    left, right = 0, len(items)\n    while left < right:\n        middle = (left + right) // 2\n        if items[middle] == middle:\n            left = middle + 1\n        else:\n            right = middle\n    return left",
      [t([[0, 1, 3]], 2), t([[]], 0), t([[1, 2]], 0), t([[0, 1]], 2)],
      [
        "Before the missing number, each value equals its index. After it, each is larger.",
        "Find the first index whose value differs from its index; the boundary can be just beyond the array.",
      ],
      "Sorted distinct integers from 0 through n with exactly one absent, for n = len(items).",
      "The absent integer, which may be 0 or n.",
      "[0,1,3] has length 3, so its full range is 0 through 3. The missing ticket is 2."
    )
  ),
  9: mixed(
    [9],
    exercise(
      "Cancel neighboring pairs",
      "Repeatedly remove adjacent equal character pairs until no such pair remains. Process characters left to right, canceling a pair as soon as it forms. Return the remaining string. Comparison is case-sensitive.",
      "text",
      "def solve(text):\n    waiting = []\n    for c in text:\n        if waiting and waiting[-1] == c:\n            waiting.pop()\n        else:\n            waiting.append(c)\n    return ''.join(waiting)",
      [t(["abbaca"], "ca"), t(["aaaa"], ""), t(["aA"], "aA"), t([""], "")],
      [
        "After cancelling a pair, the newest remaining character can meet the next arrival.",
        "Keep the reduced beginning in a stack. If the next character equals the top, pop; otherwise append.",
      ],
      "A string, possibly empty; uppercase and lowercase characters are different.",
      "The string left after the specified left-to-right adjacent-pair cancellation.",
      "abbaca loses bb, making aaca; aa then cancels, leaving ca."
    )
  ),
  14: mixed(
    [14, 38],
    exercise(
      "A power with fewer multiplications",
      "Return base raised to a nonnegative integer exponent. Use recursive halving with one recursive call per level. Define exponent 0 as returning 1, including base 0.",
      "base, exponent",
      "def solve(base, exponent):\n    if exponent == 0:\n        return 1\n    half = solve(base, exponent // 2)\n    square = half * half\n    return square * base if exponent % 2 else square",
      [t([3, 5], 243), t([0, 0], 1), t([-2, 3], -8), t([2, 0], 1)],
      [
        "An even power is the square of the half-power. An odd power needs one extra base factor.",
        "Compute the half-power once and reuse it. Two recursive calls for the same half would repeat work.",
      ],
      "An integer base and a nonnegative integer exponent.",
      "The exact integer power; exponent 0 returns 1 by this task's convention.",
      "3⁵ = (3²)² × 3 = 9 × 9 × 3 = 243."
    )
  ),
  20: mixed(
    [20, 17],
    exercise(
      "How many rooms are needed?",
      "Return the minimum number of rooms needed for all meetings [start, end], with integer start < end. A room is free at its meeting's end, so touching meetings can share it. Meetings may arrive unsorted. Return 0 for no meetings.",
      "meetings",
      "import heapq\ndef solve(meetings):\n    busy = []\n    best = 0\n    for start, end in sorted(meetings):\n        while busy and busy[0] <= start:\n            heapq.heappop(busy)\n        heapq.heappush(busy, end)\n        best = max(best, len(busy))\n    return best",
      [
        t(
          [
            [
              [0, 10],
              [5, 7],
              [7, 9],
            ],
          ],
          2
        ),
        t(
          [
            [
              [1, 2],
              [2, 3],
            ],
          ],
          1
        ),
        t([[]], 0),
      ],
      [
        "All overlapping meetings need different rooms. Handle meetings in start order.",
        "Keep the finish times of active meetings in a min-heap. Free every room ending at or before the next start and track peak occupancy.",
      ],
      "Integer meeting ranges with start strictly before end; the input need not be sorted.",
      "The minimum simultaneous room count. Endpoints that touch do not overlap.",
      "[0,10] overlaps each shorter meeting, but [5,7] and [7,9] share a room. Two rooms suffice."
    )
  ),
  22: mixed(
    [22],
    exercise(
      "Build a number from squares",
      "Return the fewest positive perfect-square numbers whose sum is n. Reuse is allowed. n is a nonnegative integer at most 200. Return 0 for n = 0.",
      "n",
      "def solve(n):\n    squares = [x*x for x in range(1, n+1) if x*x <= n]\n    best = [0] + [n+1] * n\n    for total in range(1, n+1):\n        for square in squares:\n            if square <= total:\n                best[total] = min(best[total], best[total-square] + 1)\n    return best[n]",
      [t([12], 3), t([13], 2), t([0], 0), t([1], 1)],
      [
        "The allowed reusable pieces are 1, 4, 9, 16, and so on up to n.",
        "For every total, try each possible final square and reuse the best answer for the remaining total.",
      ],
      "A nonnegative integer n at most 200.",
      "The minimum count of reusable positive squares adding exactly to n.",
      "12 = 4 + 4 + 4 needs three squares. Taking 9 first would require three extra 1s."
    )
  ),
  28: mixed(
    [28],
    exercise(
      "The largest connected team",
      "Return the size of the largest connected component in an undirected graph with n nodes numbered 0 through n - 1. Repeated edges and self-loops do not add members. Return 0 for n = 0.",
      "n, edges",
      "def solve(n, edges):\n    parent = list(range(n))\n    size = [1] * n\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    for a, b in edges:\n        a, b = find(a), find(b)\n        if a != b:\n            if size[a] < size[b]:\n                a, b = b, a\n            parent[b] = a\n            size[a] += size[b]\n    return max(size, default=0)",
      [
        t(
          [
            5,
            [
              [0, 1],
              [1, 2],
              [3, 4],
            ],
          ],
          3
        ),
        t([3, []], 1),
        t([0, []], 0),
        t(
          [
            2,
            [
              [0, 0],
              [0, 1],
              [0, 1],
            ],
          ],
          2
        ),
      ],
      [
        "You already need a group representative; what extra fact can each leader store?",
        "Add sizes only when two different leaders merge. Repeated connections must not increase the count.",
      ],
      "A nonnegative node count and undirected edges with valid endpoints.",
      "The largest number of distinct members in any connected component, or 0 for no nodes.",
      "Nodes 0,1,2 form a team of size 3, while 3,4 form size 2; return 3."
    )
  ),
  30: mixed(
    [30],
    exercise(
      "Cross the cheapest terrain",
      "Each cell in a rectangular grid has a nonnegative integer entry cost. Return the minimum total cost from top-left to bottom-right moving up, down, left, or right. Include the start cell's cost. Return 0 for an empty grid or empty rows.",
      "grid",
      "import heapq\ndef solve(grid):\n    if not grid or not grid[0]:\n        return 0\n    rows, cols = len(grid), len(grid[0])\n    best = {(0,0): grid[0][0]}\n    heap = [(grid[0][0],0,0)]\n    while heap:\n        cost,r,c = heapq.heappop(heap)\n        if cost != best[(r,c)]:\n            continue\n        if (r,c) == (rows-1,cols-1):\n            return cost\n        for nr,nc in ((r-1,c),(r+1,c),(r,c-1),(r,c+1)):\n            if 0 <= nr < rows and 0 <= nc < cols:\n                candidate = cost + grid[nr][nc]\n                if candidate < best.get((nr,nc), float('inf')):\n                    best[(nr,nc)] = candidate\n                    heapq.heappush(heap,(candidate,nr,nc))",
      [
        t(
          [
            [
              [1, 9, 1],
              [1, 1, 1],
            ],
          ],
          4
        ),
        t([[[7]]], 7),
        t([[]], 0),
        t([[[0, 0]]], 0),
      ],
      [
        "Treat a move as an edge whose cost is the destination cell's entry cost.",
        "Expand the smallest known total cost next. The first current-cost removal of the destination has the optimum; initialize with the start cost.",
      ],
      "A possibly empty rectangular grid of nonnegative integer cell costs. Every cell is passable.",
      "The minimum sum of entry costs along a four-direction route, including the start; 0 for empty input.",
      "In [[1,9,1],[1,1,1]], go down, right, right for total 1 + 1 + 1 + 1 = 4."
    )
  ),
  33: mixed(
    [33],
    exercise(
      "One sequence containing both records",
      "Return the shortest possible length of a string that contains both a and b as subsequences. Characters may be skipped when matching a subsequence, but their order must stay unchanged. Return only the length.",
      "a, b",
      "def solve(a, b):\n    dp = [[0] * (len(b)+1) for _ in range(len(a)+1)]\n    for i in range(1,len(a)+1):\n        for j in range(1,len(b)+1):\n            dp[i][j] = dp[i-1][j-1]+1 if a[i-1] == b[j-1] else max(dp[i-1][j],dp[i][j-1])\n    return len(a) + len(b) - dp[-1][-1]",
      [t(["ab", "ac"], 3), t(["abc", "abc"], 3), t(["", "xy"], 2), t(["ab", "ba"], 3)],
      [
        "Joining both strings always works, but shared characters in a compatible order can do double duty.",
        "A longest common subsequence is the most that can be shared. Subtract its length from len(a) + len(b).",
      ],
      "Two strings, possibly empty, compared exactly including case.",
      "The minimum length of a string containing both inputs as subsequences.",
      "abc contains ab and ac as subsequences. Their shared a is used once, so length 3 suffices."
    )
  ),
};
