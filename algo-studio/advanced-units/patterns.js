import { unit, problem as p, t, q } from "./unit.js?v=20261027-course2";
const dequeCode = `
from collections import deque
def solve(items,k):
    if k<=0 or k>len(items):return []
    waiting=deque();answer=[]
    for i,x in enumerate(items):
        while waiting and waiting[0]<=i-k:waiting.popleft()
        while waiting and items[waiting[-1]]<=x:waiting.pop()
        waiting.append(i)
        if i>=k-1:answer.append(items[waiting[0]])
    return answer`;
const maxima = p(
  "The largest value in every moving group",
  "items, k",
  "Integer readings and a fixed integer group length k.",
  "Return each consecutive length-k group maximum in starting-position order. Return [] for invalid k. Use a monotonic deque.",
  dequeCode,
  [t([[1, 3, -1, -3, 5], 3], [3, 3, 5]), t([[], 1], []), t([[2, 2], 1], [2, 2])],
  "The maximum 3 remains valid through two groups until 5 arrives and dominates it.",
  [
    "Store indices so you can expire a value when it leaves the window.",
    "A newer value at least as large makes an older candidate useless for every future window containing both.",
  ]
);
const union = p(
  "Measure the length covered by ranges",
  "intervals",
  "Integer half-open intervals [start,end) with start <= end; empty intervals are allowed.",
  "Return the total length covered by at least one interval, using a sweep of endpoint events.",
  `
def solve(intervals):
    events=[]
    for start,end in intervals:events.extend([(start,1),(end,-1)])
    active=total=0;previous=0
    for position,change in sorted(events):
        if active>0:total+=position-previous
        active+=change;previous=position
    return total`,
  [
    t(
      [
        [
          [1, 4],
          [2, 6],
          [8, 9],
        ],
      ],
      6
    ),
    t([[]], 0),
    t(
      [
        [
          [1, 1],
          [1, 2],
          [2, 3],
        ],
      ],
      2
    ),
  ],
  "The overlap of [1,4) and [2,6) is counted once, giving length 5 there and one more at [8,9).",
  ["Coverage is constant between consecutive endpoints.", "Measure the gap using the old active count, then apply the current endpoint change."]
);
const queensCode = `
def solve(n):
    columns=set();down=set();up=set()
    def place(row):
        if row==n:return 1
        ways=0
        for col in range(n):
            if col in columns or row-col in down or row+col in up:continue
            columns.add(col);down.add(row-col);up.add(row+col)
            ways+=place(row+1)
            columns.remove(col);down.remove(row-col);up.remove(row+col)
        return ways
    return place(0)`;
const queens = p(
  "Prune impossible partial placements",
  "n",
  "An integer n from 0 through 8. Put n queens on an n-by-n board.",
  "Return the number of placements with no shared row, column, or diagonal. Count different column-per-row placements separately. The empty board has one empty placement.",
  queensCode,
  [t([4], 2), t([0], 1), t([2], 0)],
  "The two 4-queen placements use columns [1,3,0,2] and [2,0,3,1].",
  [
    "One queen per row is built into recursion. Track columns and both diagonal identifiers.",
    "A conflict with an earlier queen can never be fixed by adding later queens, so prune immediately.",
  ]
);
export const patternUnits = [
  unit(
    93,
    "Monotonic deques: keep only candidates that can still win",
    [51, 10, 69],
    "An older value can be discarded when a newer value is at least as good and will expire later.",
    [
      "A running sum is easy to update by subtracting the outgoing value. A maximum is different: when the largest value leaves, subtraction does not reveal the next largest. Recomputing every window maximum repeats work.",
      "Keep candidate indices in a deque with decreasing values. The front is the largest candidate. Expire indices that have left the window. When a new value arrives, remove smaller or equal candidates from the back before adding it.",
      "Why may those back candidates disappear? The new value is at least as large, and because it arrived later it remains in every future window in which the old one might still appear. The older candidate cannot win before it expires.",
      "Each index enters once and leaves at most once from either end, giving linear total work despite two inner while loops. Use indices rather than only values so duplicate arrivals and expiry are distinguishable. Other problems may need both a maximum deque and a minimum deque.",
    ],
    [
      [
        "Read the first three values of [1,3,-1,-3,5], k=3.",
        [
          ["Candidate indices", "[1,2]"],
          ["Candidate values", "[3,-1]"],
          ["First maximum", "3"],
        ],
      ],
      [
        "Read -3; keep older larger candidates.",
        [
          ["Deque values", "[3,-1,-3]"],
          ["Second maximum", "3"],
        ],
      ],
      ["Read 5; expire old index 1 and dominate smaller values.", [["Deque", "index 4, value 5"]]],
      ["The third group maximum is 5.", [["Output", "[3,3,5]"]]],
    ],
    "A value can be dominated before it expires. Conversely, a large value must still be expired once its index leaves the window.",
    q(
      "Why can a new value 5 discard an older candidate 3 from the back?",
      [
        "It is larger and will remain eligible at least as long as the older candidate",
        "Every earlier value is always irrelevant",
        "The input must be sorted",
      ],
      0,
      "For every future window containing the older value, the newer larger one is also present until the older value expires."
    ),
    q(
      "Why do nested removal loops still give linear total work?",
      ["Each index is added once and removed at most once", "The deque can never contain more than one index", "All removals are free"],
      0,
      "Amortized accounting charges each removal to a distinct earlier insertion, so total removals are bounded by n."
    ),
    [
      "Each index is pushed and removed a bounded number of times.",
      "The deque holds at most k candidate indices; returned maxima need one entry per valid window.",
      "O(n) time, O(k) working space, plus O(n-k+1) output.",
    ],
    [
      ["Dominated candidate", "An option that cannot beat a newer eligible option before it expires."],
      ["Monotonic deque", "A deque whose candidate values remain ordered."],
    ],
    maxima,
    p(
      "The smallest value in every moving group",
      "items, k",
      "Integer readings and an integer group length.",
      "Return the minimum of each consecutive length-k group, or [] for invalid k. Use a monotonic deque.",
      dequeCode.replace("items[waiting[-1]]<=x", "items[waiting[-1]]>=x"),
      [t([[3, 1, 2, 0], 2], [1, 1, 0]), t([[], 1], []), t([[2, 2], 2], [2])],
      "Reversing the dominance comparison preserves small candidates instead of large ones.",
      ["Change the deque’s value order, not its expiry logic.", "Equal candidates can keep the newer index because it expires later."]
    ),
    p(
      "The longest stable stretch",
      "items, limit",
      "An integer list and a nonnegative allowed difference limit.",
      "Return the longest consecutive stretch whose maximum minus minimum is at most limit. An empty input returns 0.",
      `
from collections import deque
def solve(items,limit):
    high=deque();low=deque();left=best=0
    for right,x in enumerate(items):
        while high and items[high[-1]]<=x:high.pop()
        while low and items[low[-1]]>=x:low.pop()
        high.append(right);low.append(right)
        while items[high[0]]-items[low[0]]>limit:
            left+=1
            while high[0]<left:high.popleft()
            while low[0]<left:low.popleft()
        best=max(best,right-left+1)
    return best`,
      [t([[8, 2, 4, 7], 4], 2), t([[], 0], 0), t([[2, 2, 2], 0], 3)],
      "The stretches [2,4] and [4,7] qualify, but any length-3 stretch exceeds difference 4.",
      [
        "A window needs both its maximum and minimum to test validity.",
        "Keep one decreasing deque and one increasing deque, then shrink until the difference is legal.",
      ]
    )
  ),
  unit(
    94,
    "Sweep lines: reason between events",
    [52, 20, 66],
    "Sort the positions where something changes, and summarize the unchanged gap between them.",
    [
      "Checking every coordinate of a huge timeline is wasteful when only a few interval endpoints change coverage. A sweep line visits those event positions in sorted order and keeps an active count between them.",
      "For a half-open range [start,end), add one active interval at start and remove one at end. Between consecutive positions, no interval begins or ends, so coverage is constant. Add the gap length exactly when the old active count qualifies.",
      "At the same coordinate, a gap has zero length. For questions about peak occupancy or which events overlap, however, group equal-coordinate changes before evaluating the new active state. Half-open intervals that touch share no occupied time.",
      "The method is broader than intervals: identify event positions, decide which state changes there, and prove the state correctly summarizes the following region. Closed integer point counts and continuous geometric length use different endpoint rules; copying one convention into the other creates subtle off-by-one errors.",
    ],
    [
      ["Sweep ranges [1,4), [2,6), [8,9).", [["Events", "1:+1, 2:+1, 4:-1, 6:-1, 8:+1, 9:-1"]]],
      ["Coverage is positive from 1 through 6.", [["Gap lengths", "1 + 2 + 2 = 5"]]],
      ["The gap from 6 to 8 has no active range.", [["Added length", "0"]]],
      ["Range [8,9) contributes one more.", [["Union length", "6"]]],
    ],
    "Touching half-open ranges do not overlap in positive length. Group tied events when measuring the new occupancy state.",
    q(
      "Why is coverage constant between two consecutive event coordinates?",
      ["No interval starts or ends inside that gap", "All intervals have equal length", "The coordinates must be consecutive integers"],
      0,
      "Only endpoints can change active membership, so the same state applies over the entire gap regardless of its numeric size."
    ),
    q(
      "For half-open meetings [1,2) and [2,3), what is peak simultaneous occupancy?",
      ["1", "2", "0"],
      0,
      "The first meeting ends exactly where the second begins; grouping equal-coordinate changes preserves the half-open convention."
    ),
    [
      "Sort two endpoints per interval, then sweep them once.",
      "The event list stores two entries per interval.",
      "O(n log n) time and O(n) extra space.",
    ],
    [
      ["Event", "A position where the active state changes."],
      ["Half-open", "Includes the start and excludes the end."],
    ],
    union,
    p(
      "Peak simultaneous occupancy",
      "intervals",
      "Integer half-open intervals [start,end) with start <= end. Empty intervals occupy no time.",
      "Return the maximum number of simultaneously active intervals.",
      `
def solve(intervals):
    events={}
    for start,end in intervals:
        if start==end:continue
        events[start]=events.get(start,0)+1
        events[end]=events.get(end,0)-1
    active=best=0
    for position in sorted(events):
        active+=events[position];best=max(best,active)
    return best`,
      [
        t(
          [
            [
              [1, 2],
              [2, 3],
            ],
          ],
          1
        ),
        t(
          [
            [
              [0, 4],
              [1, 3],
              [2, 2],
            ],
          ],
          2
        ),
        t([[]], 0),
      ],
      "The first interval ends exactly when the second starts at 2. Half-open intervals do not overlap at that boundary, so the peak is 1.",
      ["Aggregate all changes at a coordinate before reading occupancy.", "An end and start at the same coordinate cancel under half-open timing."]
    ),
    p(
      "Measure heavily shared time",
      "intervals, threshold",
      "Integer half-open intervals and a positive integer threshold.",
      "Return the total length covered by at least threshold intervals.",
      `
def solve(intervals,threshold):
    events=[]
    for start,end in intervals:events.extend([(start,1),(end,-1)])
    active=total=0;previous=0
    for position,change in sorted(events):
        if active>=threshold:total+=position-previous
        active+=change;previous=position
    return total`,
      [
        t(
          [
            [
              [1, 4],
              [2, 6],
            ],
            2,
          ],
          2
        ),
        t([[], 1], 0),
        t(
          [
            [
              [1, 2],
              [2, 3],
            ],
            2,
          ],
          0
        ),
      ],
      "The two ranges overlap over [2,4), whose length is 2.",
      [
        "The event model is unchanged, but the predicate deciding whether to count a gap is different.",
        "Avoid counting endpoints as unit-length intervals.",
      ]
    )
  ),
  unit(
    95,
    "Backtracking: prune only what cannot become valid",
    [26, 37, 66],
    "Reject an unfinished branch only when no completion of that branch can repair its conflict.",
    [
      "For n queens, putting one queen in each row removes one dimension of choice. A partial placement still needs to avoid shared columns and both diagonal directions. Blindly enumerating all nⁿ row choices ignores conflicts that are already permanent.",
      "A queen at row r, column c occupies column c, a descending diagonal identified by r-c, and an ascending diagonal identified by r+c. Track these three sets while exploring rows in order. If a candidate conflicts, no later queen can remove that existing conflict.",
      "For a legal choice, add its three markers, recursively handle the next row, then remove all three before trying another column. The undo step must restore exactly the state the caller had. At row n, one complete legal placement has been found.",
      "Pruning must be justified by impossibility, not by a guess that a branch looks unpromising. The worst-case search remains exponential. An empty board has one empty completion, a base case also useful when counting subsets or building recursive combinations.",
    ],
    [
      [
        "Place queens one row at a time.",
        [
          ["n", "4"],
          ["Initial occupied sets", "empty"],
        ],
      ],
      [
        "One solution begins with column 1, then column 3.",
        [
          ["Columns by row", "[1,3]"],
          ["No conflict", "in columns or diagonals"],
        ],
      ],
      ["Continue with columns 0 and 2.", [["Completed placement", "[1,3,0,2]"]]],
      [
        "Explore other restored branches.",
        [
          ["Other placement", "[2,0,3,1]"],
          ["Total count", "2"],
        ],
      ],
    ],
    "Forget one undo operation and sibling branches inherit false conflicts. A heuristic is not a valid pruning rule without a proof.",
    q(
      "Why is a diagonal conflict with an earlier queen safe to prune immediately?",
      [
        "Adding later queens cannot remove the conflicting pair already present",
        "All partially filled boards are impossible",
        "The next row is guaranteed to fix it",
      ],
      0,
      "A completion only adds queens, so an existing attacking pair remains invalid under every extension."
    ),
    q(
      "Why does the empty board contribute one completion instead of zero?",
      [
        "There is one way to place no queens while satisfying every constraint",
        "Zero queens always count as an error",
        "Every board must contain at least one conflict",
      ],
      0,
      "The empty choice is a valid base object; counting it once lets recursive counting compose consistently."
    ),
    [
      "Explore only conflict-free partial placements, still with exponential worst-case search.",
      "The recursion depth and three occupied sets each grow with n.",
      "O(n·n!) safe search bound with O(n) working state, excluding any explicit witness list.",
    ],
    [
      ["Pruning", "Skipping a branch proved unable to lead to a valid completion."],
      ["Undo", "Restoring the exact prior choice state before a sibling branch."],
    ],
    queens,
    p(
      "Return the first legal placement",
      "n",
      "An integer n from 0 through 8. Column IDs start at 0.",
      "Return the lexicographically smallest valid column-per-row placement. Return [] when impossible or when n=0.",
      `
def solve(n):
    def search(path,columns,down,up):
        row=len(path)
        if row==n:return list(path)
        for col in range(n):
            if col not in columns and row-col not in down and row+col not in up:
                answer=search(path+[col],columns|{col},down|{row-col},up|{row+col})
                if answer is not None:return answer
        return None
    answer=search([],set(),set(),set())
    return [] if answer is None else answer`,
      [t([4], [1, 3, 0, 2]), t([2], []), t([1], [0])],
      "Trying columns in ascending order and stopping at the first complete solution fixes the lexicographic witness.",
      ["Return a witness rather than only a count.", "Use None internally for failure so an empty valid placement is not confused with failure."]
    ),
    p(
      "Count placements with forbidden squares",
      "n, blocked",
      "An integer n from 0 through 8 and valid blocked [row,column] coordinates; repeats are harmless.",
      "Return the number of legal n-queen placements using no blocked square.",
      `
def solve(n,blocked):
    forbidden=set(map(tuple,blocked));columns=set();down=set();up=set()
    def visit(row):
        if row==n:return 1
        total=0
        for col in range(n):
            if (row,col) in forbidden or col in columns or row-col in down or row+col in up:continue
            columns.add(col);down.add(row-col);up.add(row+col)
            total+=visit(row+1)
            columns.remove(col);down.remove(row-col);up.remove(row+col)
        return total
    return visit(0)`,
      [t([4, [[0, 1]]], 1), t([1, [[0, 0]]], 0), t([0, []], 1)],
      "Blocking row 0 column 1 removes the first of the two 4-queen solutions but leaves the other.",
      [
        "A forbidden square is an additional local impossibility condition.",
        "The diagonal and undo rules remain necessary even after blocked-square filtering.",
      ]
    )
  ),
];
