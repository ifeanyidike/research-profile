import { unit, problem as p, t, q, using } from "./unit.js?v=20261027-course2";
const node = (value, left = null, right = null) => ({ value, left, right });
const reconstructCode = `
def solve(items):
    if not items:return []
    length=[1]*len(items);previous=[-1]*len(items)
    for i in range(len(items)):
        for j in range(i):
            if items[j]<items[i] and length[j]+1>length[i]:
                length[i]=length[j]+1;previous[i]=j
    end=max(range(len(items)),key=lambda i:length[i])
    path=[]
    while end!=-1:path.append(end);end=previous[end]
    return path[::-1]`;
const reconstruct = p(
  "Return the subsequence, not just its length",
  "items",
  "An integer list, possibly empty.",
  "Return indices of one longest strictly increasing subsequence. Use O(n²) DP; on ties keep the first best endpoint and first improving predecessor encountered in increasing index order.",
  reconstructCode,
  [t([[3, 1, 2]], [1, 2]), t([[]], []), t([[2, 1]], [0])],
  "The optimum ends at index 2 and points back to index 1, reconstructing values [1,2].",
  [
    "Save a predecessor whenever a state strictly improves.",
    "The endpoint stores a local answer; following predecessors reconstructs its actual choices.",
  ]
);
const rolling = p(
  "Keep only the rows still needed",
  "a, b",
  "Two strings, possibly empty.",
  "Return their longest common subsequence length with rolling-row DP using O(min(len(a),len(b))) row space.",
  `
def solve(a,b):
    if len(a)<len(b):a,b=b,a
    previous=[0]*(len(b)+1)
    for x in a:
        current=[0]
        for j,y in enumerate(b,1):
            current.append(previous[j-1]+1 if x==y else max(previous[j],current[-1]))
        previous=current
    return previous[-1]`,
  [t(["abc", "ac"], 2), t(["", "abc"], 0), t(["aaaa", "aa"], 2)],
  "Both strings contain a then c in that order, so ac is a common subsequence of length 2. No longer answer fits the two-character second string; rolling rows preserve this length while discarding older rows.",
  [
    "Write down which cells the recurrence reads before discarding storage.",
    "Keep the old row separate from the row being built; swap strings so the shorter one supplies columns.",
  ]
);
const weighted = p(
  "Schedule rewards, not just the number of talks",
  "jobs",
  "Intervals [start,end,reward] with start < end and integer rewards. Jobs may be skipped; empty selection is allowed.",
  "Return the maximum total reward from non-overlapping jobs. Endpoints may touch. Use finish-time ordering and DP.",
  `
from bisect import bisect_right
def solve(jobs):
    jobs=sorted(jobs,key=lambda row:row[1])
    ends=[row[1] for row in jobs];best=[0]
    for i,(start,end,reward) in enumerate(jobs):
        before=bisect_right(ends,start,0,i)
        best.append(max(best[-1],reward+best[before]))
    return best[-1]`,
  [
    t(
      [
        [
          [1, 3, 4],
          [3, 5, 4],
          [1, 5, 10],
        ],
      ],
      10
    ),
    t([[]], 0),
    t([[[0, 1, -2]]], 0),
  ],
  "Two short jobs give 8, but the single long job gives 10; maximizing count would make the wrong choice.",
  [
    "The earlier compatible jobs form a prefix in finish-time order.",
    "For each job, compare skipping it with its reward plus the best compatible prefix.",
  ]
);
const chain = p(
  "Choose where to split a matrix chain",
  "dimensions",
  "Positive integer matrix dimensions; matrices i have dimensions dimensions[i] by dimensions[i+1]. Zero or one dimension means no matrix.",
  "Return the minimum number of scalar multiplications needed to multiply the full chain. Multiplication order cannot change.",
  `
def solve(dimensions):
    n=len(dimensions)-1
    if n<=1:return 0
    best=[[0]*n for _ in range(n)]
    for length in range(2,n+1):
        for left in range(n-length+1):
            right=left+length-1
            best[left][right]=min(best[left][k]+best[k+1][right]+dimensions[left]*dimensions[k+1]*dimensions[right+1] for k in range(left,right))
    return best[0][-1]`,
  [t([[10, 30, 5, 60]], 4500), t([[]], 0), t([[3, 4]], 0)],
  "Multiplying the 10×30 and 30×5 matrices first costs 1500, then the 10×5 result by 5×60 costs 3000: total 4500.",
  ["A parenthesization has one final split into two consecutive chains.", "Try every split and fill shorter intervals before longer ones."]
);
const independent = p(
  "Choose valuable nodes without parent-child conflicts",
  "root",
  "A binary tree with integer weights stored as value; children use left/right and empty nodes are None.",
  "Return the maximum sum of selected node weights when no selected node is adjacent to another selected node. The empty selection is allowed.",
  `
def solve(root):
    def visit(node):
        if node is None:return (0,0)
        left=visit(node['left']);right=visit(node['right'])
        skip=max(left)+max(right)
        take=node['value']+left[0]+right[0]
        return skip,take
    return max(visit(root))`,
  [t([node(5, node(4), node(4))], 8), t([node(-3)], 0), t([null], 0)],
  "Taking both children gives 8, while taking their parent gives only 5.",
  [
    "Keep separate best answers for excluding and including the current node.",
    "Including a parent forces both child states to exclude their own roots.",
  ]
);
const tour = p(
  "A subset can be the state",
  "costs",
  "A square matrix for at most 10 nodes. costs[a][b] is a nonnegative integer or None for no edge.",
  "Return the cheapest cycle starting at 0, visiting each node exactly once, then returning to 0. Return -1 if impossible and 0 for zero or one node. Use subset DP.",
  `
def solve(costs):
    n=len(costs)
    if n<=1:return 0
    best={(1,0):0}
    for mask in range(1,1<<n):
        for last in range(n):
            if (mask,last) not in best:continue
            for other in range(n):
                if mask>>other&1 or costs[last][other] is None:continue
                key=(mask|1<<other,other)
                best[key]=min(best.get(key,float('inf')),best[(mask,last)]+costs[last][other])
    answers=[best[((1<<n)-1,last)]+costs[last][0] for last in range(1,n) if ((1<<n)-1,last) in best and costs[last][0] is not None]
    return min(answers,default=-1)`,
  [
    t(
      [
        [
          [0, 2, 9],
          [1, 0, 3],
          [4, 8, 0],
        ],
      ],
      9
    ),
    t(
      [
        [
          [0, null],
          [null, 0],
        ],
      ],
      -1
    ),
    t([[]], 0),
  ],
  "The route 0→1→2→0 costs 2+3+4=9; the other order costs 18.",
  [
    "An integer mask stores which nodes have been visited: bit v is 1 exactly when v is included.",
    "The state must also store the last node, because it affects the next edge cost.",
  ]
);
export const dynamicUnits = [
  unit(
    92,
    "Reconstruct choices from saved predecessors",
    [34, 23, 66],
    "The best score is not a plan; save enough information to walk back through the choices that achieved it.",
    [
      "A longest-increasing-subsequence length tells us how good a result can be, but does not identify which input positions form it. If the caller needs an actual sequence, a length-only table has thrown away useful evidence.",
      "Keep the familiar state length[i]: best increasing subsequence ending exactly at i. Whenever an earlier j strictly improves that answer, also save previous[i]=j. The saved link witnesses the transition that established the score.",
      "Choose an endpoint with maximum length, follow its predecessor links backward, and reverse the collected indices. Every link goes to an earlier position with a smaller value, so the reconstructed chain respects both input order and strict increase.",
      "Tie policy affects the returned witness. This exercise keeps the first best endpoint and the first predecessor producing a strict improvement. That is deterministic, but it does not promise the lexicographically smallest value sequence among all optima. Separate optimum score from witness tie rules.",
    ],
    [
      [
        "Start with [3,1,2].",
        [
          ["Lengths", "[1,1,1]"],
          ["Predecessors", "[-1,-1,-1]"],
        ],
      ],
      [
        "At index 2, value 1 can precede value 2.",
        [
          ["length[2]", "2"],
          ["previous[2]", "1"],
        ],
      ],
      ["Follow the best endpoint backward.", [["Backward indices", "2 → 1"]]],
      [
        "Reverse the path for input order.",
        [
          ["Returned indices", "[1,2]"],
          ["Values", "[1,2]"],
        ],
      ],
    ],
    "A deterministic witness is not automatically the lexicographically smallest one. Returning values instead of indices can hide duplicate-position mistakes.",
    q(
      "What must be saved when a DP transition improves an answer and a witness is required later?",
      ["Which predecessor or decision produced that improvement", "Only the global final score", "A sorted copy of every candidate"],
      0,
      "A predecessor records the successful transition, allowing the optimum to be reconstructed after scoring ends."
    ),
    q(
      "Why must the predecessor index be smaller than the current endpoint in this subsequence DP?",
      [
        "It preserves original input order and guarantees the link chain terminates",
        "It guarantees values are contiguous",
        "It sorts duplicate values automatically",
      ],
      0,
      "Subsequences can skip positions but cannot reorder them; strictly decreasing indices also prevent predecessor cycles."
    ),
    [
      "Try all earlier endpoints for each position, then follow at most n predecessor links.",
      "Lengths, predecessors, and the returned path each grow with input length.",
      "O(n²) time and O(n) extra space.",
    ],
    [
      ["Witness", "A concrete set of choices achieving the claimed score."],
      ["Predecessor", "The earlier state used in a successful transition."],
    ],
    reconstruct,
    p(
      "Return the chosen values",
      "items",
      "An integer list in original order.",
      "Return the values at the reconstructed strictly increasing subsequence indices, using the same first-improvement tie policy as the lesson.",
      using(
        reconstruct,
        `def solve(items):
    return [items[i] for i in base(items)]`
      ),
      [t([[3, 1, 2]], [1, 2]), t([[]], []), t([[2, 1]], [2])],
      "The same witness can be projected to values, while indices remain necessary to distinguish repeated positions.",
      [
        "Reconstruct indices first so the subsequence’s order is explicit.",
        "Follow the stated tie policy rather than choosing a different optimal witness.",
      ]
    ),
    p(
      "Allow equal readings in the sequence",
      "items",
      "An integer list, possibly containing duplicates.",
      "Return indices of a longest nondecreasing subsequence. Keep the first best endpoint and first strictly improving predecessor in increasing index order.",
      reconstructCode.replace("items[j]<items[i]", "items[j]<=items[i]"),
      [t([[2, 2, 1]], [0, 1]), t([[]], []), t([[3, 1, 2]], [1, 2])],
      "Equal values may now extend one another, changing the valid predecessor condition.",
      ["Only the value relation changes; index order still must be strict.", "Do not confuse nondecreasing with strictly increasing."]
    )
  ),
  unit(
    103,
    "Space optimization: preserve the old information until it is read",
    [33, 65, 66],
    "Discard a DP row only after proving no future update still needs it.",
    [
      "A full table makes state dependencies visible, but an algorithm returning only one score may not need to retain the whole history. Space optimization begins by listing exactly which older cells a new cell reads.",
      "For LCS, a cell reads the old diagonal, the old cell above, and the new cell to its left. Keeping a previous row and a current row preserves all three. Earlier rows are no longer referenced and may be discarded.",
      "Swap the strings so the shorter string defines the columns. The row storage is then proportional to the shorter length. Each completed row becomes the next previous row only after every column has been computed.",
      "The final length remains correct because the recurrence reads the same values as the full table. Ordinary backtracking through all table decisions is no longer available after discarding rows. If a witness is required, use stored decisions or a reconstruction technique that explicitly recovers the lost information.",
    ],
    [
      ["Compare abc with ac; columns use the shorter string.", [["Initial previous row", "[0,0,0]"]]],
      ["Read a.", [["Current row", "[0,1,1]"]]],
      ["Read b; no new matching character extends the score.", [["Current row", "[0,1,1]"]]],
      [
        "Read c and retain the completed row.",
        [
          ["Final row", "[0,1,2]"],
          ["Length", "2"],
        ],
      ],
    ],
    "Updating a row in place without saving the old diagonal can read a current-row value where the recurrence requires an older one.",
    q(
      "Which information must remain available while computing an LCS cell?",
      ["Old diagonal, old above, and current left", "Only the global maximum found so far", "Only the current characters"],
      0,
      "Those are precisely the predecessor cells in the full-table recurrence, so retaining them preserves the result."
    ),
    q(
      "What capability does an ordinary rolling-row length computation discard?",
      ["Direct backtracking through every old table decision", "The final optimum length", "The ability to handle empty strings"],
      0,
      "The discarded rows no longer contain the historical decisions needed for the usual witness reconstruction."
    ),
    [
      "Every pair of characters still participates in one DP update.",
      "Two rows use one entry per character of the shorter string, plus the empty-prefix entry.",
      "O(mn) time for nonempty lengths; O(min(m,n)+1) row space.",
    ],
    [
      ["Rolling row", "A reused row buffer retaining only the dependency frontier."],
      ["Dependency frontier", "The earlier answers future updates still need."],
    ],
    rolling,
    p(
      "A common stretch cannot skip characters",
      "a, b",
      "Two strings compared exactly, possibly empty.",
      "Return the longest common substring length. Characters must be consecutive in both strings. Use rolling rows.",
      `
def solve(a,b):
    previous=[0]*(len(b)+1);answer=0
    for x in a:
        current=[0]
        for j,y in enumerate(b,1):
            value=previous[j-1]+1 if x==y else 0
            current.append(value);answer=max(answer,value)
        previous=current
    return answer`,
      [t(["abc", "ac"], 1), t(["ababc", "babca"], 4), t(["", "a"], 0)],
      "abc and ac share subsequence ac, but their longest shared consecutive stretch has length 1.",
      ["A mismatch resets an ending-here substring length to zero.", "Track the best cell anywhere, not only the bottom-right cell."]
    ),
    p(
      "Choose the closest ordered record",
      "query, candidates",
      "A query string and a list of candidate strings. Similarity is longest-common-subsequence length.",
      "Return [best_score, first_candidate_index] for the highest similarity. Return [] when no candidates exist.",
      using(
        rolling,
        `def solve(query,candidates):
    if not candidates:return []
    scores=[base(query,candidate) for candidate in candidates]
    index=max(range(len(scores)),key=lambda i:scores[i])
    return [scores[index],index]`
      ),
      [t(["abc", ["ax", "ac", "bc"]], [2, 1]), t(["", []], []), t(["a", ["z", "a"]], [1, 1])],
      "ac and bc both score 2 against abc; the first candidate among those ties is index 1.",
      ["The similarity state preserves order but permits skipped characters.", "Resolve equal scores by original candidate position."]
    )
  ),
  unit(
    102,
    "Weighted intervals: a greedy count no longer solves the goal",
    [20, 45, 21],
    "When choices have different rewards, compare compatible-prefix optima instead of trusting earliest finish alone.",
    [
      "Earliest-finishing interval selection maximized the number of talks. If one long talk earns reward 10 while two short talks earn 4 each, maximizing the count gives the wrong reward. The objective changed, so the proof must be reconsidered.",
      "Sort jobs by finish time. For a job starting at s, use a binary-search boundary to find the prefix of earlier jobs finishing at or before s. That prefix contains every job compatible before taking the current one.",
      "Let best[i] be the maximum reward among the first i jobs in finish order. Either skip the next job, keeping best[i], or take it and add its reward to the best compatible prefix. These exhaustive alternatives establish the recurrence.",
      "Initialize the empty prefix to 0 so negative-reward jobs may all be skipped. Endpoint equality is allowed here, so use the right boundary of end <= start. Returning the chosen jobs requires decision reconstruction and a stated tie policy in addition to computing the score.",
    ],
    [
      [
        "Two short jobs compete with one long job.",
        [
          ["Short rewards", "[1,3]:4 and [3,5]:4"],
          ["Long reward", "[1,5]:10"],
        ],
      ],
      [
        "The first short job establishes reward 4.",
        [
          ["Compatible empty prefix", "0"],
          ["Best", "4"],
        ],
      ],
      ["The second short job can combine with the first.", [["Combined reward", "8"]]],
      [
        "The long job beats that pair.",
        [
          ["Best reward", "10"],
          ["Maximum job count", "is a different objective"],
        ],
      ],
    ],
    "Do not reuse the unweighted greedy proof after changing the objective to reward. Endpoint equality needs the correct binary-search boundary.",
    q(
      "Why can earliest-finish selection fail when jobs have rewards?",
      [
        "A longer single job can be worth more than several short jobs",
        "Sorting by finish time is impossible",
        "Negative rewards must always be selected",
      ],
      0,
      "The exchange argument for maximizing count does not preserve total reward when replacing one job with another."
    ),
    q(
      "What does best[i] represent in weighted interval DP?",
      [
        "The best reward using only the first i finish-ordered jobs",
        "The reward of the ith job alone",
        "The sum of all earlier rewards regardless of overlap",
      ],
      0,
      "The prefix state lets a taken job combine with an already optimized compatible prefix, not with incompatible predecessors."
    ),
    [
      "Sort once, then use one binary-search boundary and one recurrence update per job.",
      "Finish times and prefix answers each store one entry per job.",
      "O(n log n) time and O(n) space.",
    ],
    [
      ["Compatible prefix", "Earlier finish-ordered jobs ending no later than this job starts."],
      ["Objective", "The quantity being optimized, such as count or total reward."],
    ],
    weighted,
    p(
      "Return the reward-optimal job IDs",
      "jobs",
      "At most 12 [start,end,reward] jobs with start < end. IDs are original input indices.",
      "Return sorted selected IDs maximizing total reward without overlap. Among optimal ID lists choose the lexicographically smallest, including [] when appropriate. Exhaustive search is allowed.",
      `
from itertools import combinations
def solve(jobs):
    best_score=0;best=[]
    for length in range(len(jobs)+1):
        for choice in combinations(range(len(jobs)),length):
            selected=sorted((jobs[i] for i in choice),key=lambda row:row[0])
            if any(a[1]>b[0] for a,b in zip(selected,selected[1:])):continue
            score=sum(jobs[i][2] for i in choice)
            ids=list(choice)
            if score>best_score or score==best_score and ids<best:best_score,best=score,ids
    return best`,
      [
        t(
          [
            [
              [1, 3, 4],
              [3, 5, 4],
              [1, 5, 10],
            ],
          ],
          [2]
        ),
        t([[]], []),
        t([[[0, 1, 0]]], []),
      ],
      "The long job at original index 2 gives reward 10. A zero-reward job need not be included.",
      ["Score first; canonical ID order only breaks score ties.", "A brute-force witness solver is useful as an oracle for small instances."]
    ),
    p(
      "A schedule with a meeting limit",
      "jobs, limit",
      "Integer-reward intervals and a nonnegative limit on how many jobs may be selected.",
      "Return the maximum compatible reward using at most limit jobs.",
      `
from bisect import bisect_right
def solve(jobs,limit):
    jobs=sorted(jobs,key=lambda row:row[1]);ends=[row[1] for row in jobs]
    best=[[0]*(limit+1) for _ in range(len(jobs)+1)]
    for i,(start,end,reward) in enumerate(jobs):
        before=bisect_right(ends,start,0,i)
        for allowed in range(1,limit+1):best[i+1][allowed]=max(best[i][allowed],reward+best[before][allowed-1])
    return best[-1][-1]`,
      [
        t(
          [
            [
              [0, 1, 5],
              [1, 2, 6],
              [0, 2, 8],
            ],
            1,
          ],
          8
        ),
        t(
          [
            [
              [0, 1, 5],
              [1, 2, 6],
            ],
            2,
          ],
          11
        ),
        t([[], 0], 0),
      ],
      "With room for one job, choose reward 8; allowing two can favor a pair.",
      ["The new constraint belongs in the state.", "Taking a job consumes one unit of the remaining count allowance."]
    )
  ),
  unit(
    89,
    "Interval DP: choose the last split",
    [49, 68, 67],
    "For a consecutive interval, enumerate the final split and reuse optimal answers for the two shorter intervals.",
    [
      "Matrix multiplication is associative: parenthesization changes work but not the mathematical product. The dimensions determine the cost of combining two partial products. We may change grouping, but not reorder matrices.",
      "If the last multiplication splits matrices left..right after k, its two inputs are the products of left..k and k+1..right. Their output dimensions are fixed by the interval endpoints, regardless of their internal grouping.",
      "Try every k. Add the optimal left cost, the optimal right cost, and the final scalar cost dimensions[left]×dimensions[k+1]×dimensions[right+1]. Fill intervals by increasing length so both smaller answers are ready.",
      "The final multiplication of every parenthesization has some split k, so considering all splits cannot miss an optimum. This is interval DP: endpoints describe the subproblem, and split positions describe transitions. Choosing the cheapest-looking immediate multiplication can miss a better global grouping.",
    ],
    [
      ["Three matrices have dimensions 10×30, 30×5, and 5×60.", [["Dimension list", "[10,30,5,60]"]]],
      [
        "Group the first two matrices first.",
        [
          ["First cost", "10×30×5 = 1500"],
          ["Final cost", "10×5×60 = 3000"],
        ],
      ],
      ["Compare grouping the final two first.", [["Alternative total", "30×5×60 + 10×30×60 = 27000"]]],
      [
        "Choose the smaller complete cost.",
        [
          ["Optimal total", "4500"],
          ["Grouping", "((A0*A1)*A2)"],
        ],
      ],
    ],
    "The split index describes a matrix boundary, so its dimension index is k+1. Matrix reordering is not allowed.",
    q(
      "Why must interval DP fill shorter intervals before longer ones?",
      [
        "Every split reads two strictly shorter interval answers",
        "The input matrices must be sorted by size",
        "Longer intervals never have more than one split",
      ],
      0,
      "The recurrence is valid only when both dependent subinterval results are already established."
    ),
    q(
      "What fact proves that trying every final split covers all parenthesizations?",
      [
        "Every nontrivial full product has exactly one final multiplication separating two consecutive groups",
        "The smallest matrix always goes first",
        "All groupings have identical costs",
      ],
      0,
      "Classifying a complete solution by its final split yields exhaustive alternatives with optimal smaller subproblems."
    ),
    [
      "There are quadratically many intervals and linearly many split candidates for each.",
      "Keep one cost for each pair of interval endpoints.",
      "O(n³) time and O(n²) space for n matrices.",
    ],
    [
      ["Interval state", "A subproblem identified by its consecutive endpoints."],
      ["Final split", "The boundary separating the two inputs of the last combination."],
    ],
    chain,
    p(
      "Show the best parenthesization",
      "dimensions",
      "Positive matrix dimensions; zero or one dimension means an empty chain.",
      "Return the optimal parenthesization using names A0,A1,... and form (left*right). Among equal-cost strings choose the lexicographically smallest. Return an empty string for no matrix.",
      `
def solve(dimensions):
    n=len(dimensions)-1
    if n<=0:return ''
    best={(i,i):(0,'A'+str(i)) for i in range(n)}
    for length in range(2,n+1):
        for left in range(n-length+1):
            right=left+length-1;choices=[]
            for k in range(left,right):
                a,x=best[left,k];b,y=best[k+1,right]
                choices.append((a+b+dimensions[left]*dimensions[k+1]*dimensions[right+1],'('+x+'*'+y+')'))
            best[left,right]=min(choices)
    return best[0,n-1][1]`,
      [t([[10, 30, 5, 60]], "((A0*A1)*A2)"), t([[]], ""), t([[3, 4]], "A0")],
      "The cost-optimal split also records a readable witness of how to group the product.",
      ["Save both cost and representation so ties are explicit.", "The empty chain and one-matrix chain need no multiplication parentheses."]
    ),
    p(
      "Make a message symmetric by insertion",
      "text",
      "A string compared exactly, possibly empty.",
      "Return the fewest character insertions needed to turn text into a palindrome. Existing characters may not be deleted or reordered.",
      `
def solve(text):
    n=len(text)
    if n==0:return 0
    best=[[0]*n for _ in range(n)]
    for length in range(2,n+1):
        for left in range(n-length+1):
            right=left+length-1
            if text[left]==text[right]:best[left][right]=best[left+1][right-1] if length>2 else 0
            else:best[left][right]=1+min(best[left+1][right],best[left][right-1])
    return best[0][-1]`,
      [t(["abc"], 2), t(["racecar"], 0), t([""], 0)],
      "abc can become abcba by inserting b and a.",
      ["The subproblem is an interval of the original text.", "Equal ends reuse the interior; unequal ends need a matching insertion at one side."]
    )
  ),
  unit(
    90,
    "Tree DP: state the parent constraint",
    [47, 21, 66],
    "A subtree answer may depend on whether its root is chosen, so keep both possibilities.",
    [
      "Suppose connected parent-child nodes cannot both receive a reward selection. Taking a large parent may block two children whose combined reward is larger. A locally largest-weight choice is not a safe general rule.",
      "For every subtree, return two answers: skip, the best weight when its root is not selected, and take, the best when it is selected. If selected, each child must use its skip state. If skipped, each child may use whichever state is better.",
      "Combine children only after their answers are ready. Empty children supply (0,0), and the final answer is max(skip,take) at the root. Negative node weights are harmless because choosing nothing remains allowed.",
      "The tree structure makes the child subproblems independent once the parent decision is fixed: there are no cross-edges between the branches. The same recurrence on a general graph could count incompatible choices or revisit states cyclically. Model that structural assumption explicitly.",
    ],
    [
      ["A parent has weight 5 and two children have weight 4.", [["Tree", "5 with children 4,4"]]],
      ["Each leaf returns its two states.", [["Leaf skip / take", "0 / 4"]]],
      [
        "Taking the parent forces both children to skip.",
        [
          ["Parent take", "5+0+0 = 5"],
          ["Parent skip", "4+4 = 8"],
        ],
      ],
      ["The root may use either state.", [["Best", "8: select both children"]]],
    ],
    "A single best subtree value loses whether that best choice included the child root, which matters to the parent.",
    q(
      "When a parent is selected, which child state may be combined with it?",
      ["Only the state excluding that child root", "Always the larger of the two child states", "Only the state including the child root"],
      0,
      "Selecting both endpoints of a parent-child edge is forbidden, so the child root must be excluded."
    ),
    q(
      "Why can two child-subtree answers be added after fixing the parent choice?",
      ["A tree has no cross-edge between the two child branches", "Every graph has independent branches", "The rewards must all be positive"],
      0,
      "Conditioning on the shared parent removes the only interaction between the disjoint child subtrees."
    ),
    [
      "One postorder visit computes two constant-size states at each node.",
      "The recursion stack follows height; no full table beyond the return states is required.",
      "O(n) time and O(h) stack space.",
    ],
    [
      ["Conditional state", "An answer whose meaning includes a boundary decision such as taking the root."],
      ["Postorder", "Compute child answers before combining the parent."],
    ],
    independent,
    p(
      "Cover every tree connection cheaply",
      "root",
      "A binary tree with nonnegative node weights stored as value.",
      "Return the minimum weight of a vertex cover: choose nodes so every parent-child edge has at least one chosen endpoint.",
      `
def solve(root):
    def visit(node):
        if node is None:return (0,0)
        left=visit(node['left']);right=visit(node['right'])
        skip=left[1]+right[1]
        take=node['value']+min(left)+min(right)
        return skip,take
    return min(visit(root))`,
      [t([node(5, node(4), node(4))], 5), t([node(7)], 0), t([null], 0)],
      "Choosing the parent covers both edges for cost 5; choosing both children would cost 8.",
      [
        "If a node is excluded, every child must be included to cover their connecting edge.",
        "A leaf has no edges to cover, so excluding it costs zero.",
      ]
    ),
    p(
      "Monitor every node with nearby stations",
      "root",
      "A binary tree; each station placed at a node monitors that node, its parent, and its children. Node values are irrelevant.",
      "Return the minimum number of stations that monitor the entire tree.",
      `
def solve(root):
    stations=0
    def visit(node):
        nonlocal stations
        if node is None:return 2
        left,right=visit(node['left']),visit(node['right'])
        if left==0 or right==0:stations+=1;return 1
        if left==1 or right==1:return 2
        return 0
    if visit(root)==0:stations+=1
    return stations`,
      [t([node(5, node(4), node(4))], 1), t([node(1)], 1), t([null], 0)],
      "One station at the parent monitors all three nodes.",
      [
        "Use states needing coverage, having a station, and already covered.",
        "A child needing coverage forces a station at its parent; handle a still-uncovered root after postorder.",
      ]
    )
  ),
  unit(
    91,
    "Bitmask DP: remember which choices are already used",
    [26, 53, 21, 66],
    "When the used subset affects future options, keep that subset together with the current endpoint.",
    [
      "A route visiting every city exactly once cannot be described by its last city alone. Two arrivals at that city may have visited different sets and therefore have different legal next moves. The set of used cities belongs in the state.",
      "An integer mask can store a small set: bit v is 1 exactly when city v has been visited. Test membership with mask >> v & 1, and add a city with mask | (1 << v). Parentheses help distinguish bit operations from ordinary addition.",
      "Let best[mask,last] be the cheapest route from 0 using exactly mask and ending at last. Extend only to an unvisited city with an existing edge. Each transition adds a bit, so the dependency order progresses toward larger visited sets.",
      "After all cities are visited, pay the edge back to 0. Missing return edges still make a tour impossible. Subset DP reduces factorial enumeration to exponentially many states, but does not make the problem polynomial: the state count still doubles when one city is added.",
    ],
    [
      [
        "A three-city tour starts at 0.",
        [
          ["Mask", "001"],
          ["State", "last 0, cost 0"],
        ],
      ],
      [
        "Visit city 1.",
        [
          ["Mask", "011"],
          ["State", "last 1, cost 2"],
        ],
      ],
      [
        "Then visit city 2.",
        [
          ["Mask", "111"],
          ["State", "last 2, cost 5"],
        ],
      ],
      [
        "Close the route to 0.",
        [
          ["Return cost", "4"],
          ["Tour total", "9"],
        ],
      ],
    ],
    "The endpoint alone is insufficient. Visiting all nodes is also not enough when the required closing edge is missing.",
    q(
      "Why does subset-tour DP need both mask and last city?",
      [
        "The mask controls which moves remain and the last city controls their edge costs",
        "The mask already determines the last city uniquely",
        "A last city alone prevents repeated visits",
      ],
      0,
      "Two paths ending at the same city can have different unused cities; two paths using the same subset can end at different cities."
    ),
    q(
      "Does O(n²2ⁿ) become polynomial because it is better than enumerating n! tours?",
      ["No; the 2ⁿ factor remains exponential", "Yes; every DP algorithm is polynomial", "Only when all edge costs are equal"],
      0,
      "Dynamic programming removes repeated subproblems, but its state count can still be exponential in input size."
    ),
    [
      "There are up to n2ⁿ states, each trying up to n outgoing destinations.",
      "Store the best value for each visited-set/endpoint pair.",
      "O(n²2ⁿ) time and O(n2ⁿ) space; intended for small n.",
    ],
    [
      ["Bitmask", "An integer whose bit positions encode set membership."],
      ["Subset state", "A state that distinguishes which elements have been used, not only how many."],
    ],
    tour,
    p(
      "Return an optimal round trip",
      "costs",
      "A square nonnegative/None cost matrix for at most 10 cities.",
      "Return the lexicographically smallest node route among minimum-cost tours, including 0 at both ends. Return [] if impossible or no cities; return [0,0] for one city.",
      `
from functools import lru_cache
def solve(costs):
    n=len(costs)
    if n==0:return []
    if n==1:return [0,0]
    @lru_cache(None)
    def best(mask,last):
        if mask==(1<<n)-1:
            return (float('inf'),()) if costs[last][0] is None else (costs[last][0],(0,))
        choices=[]
        for other in range(n):
            if not mask>>other&1 and costs[last][other] is not None:
                cost,path=best(mask|1<<other,other)
                if cost!=float('inf'):choices.append((costs[last][other]+cost,(other,)+path))
        return min(choices,default=(float('inf'),()))
    cost,path=best(1,0)
    return [] if cost==float('inf') else [0]+list(path)`,
      [
        t(
          [
            [
              [0, 2, 9],
              [1, 0, 3],
              [4, 8, 0],
            ],
          ],
          [0, 1, 2, 0]
        ),
        t(
          [
            [
              [0, null],
              [null, 0],
            ],
          ],
          []
        ),
        t([[[0]]], [0, 0]),
      ],
      "The minimum tour costs 9 and visits 0,1,2,0.",
      [
        "Memoize the best remaining cost and witness for a used-set/endpoint state.",
        "Compare costs first and route tuples second for deterministic ties.",
      ]
    ),
    p(
      "Assign one distinct job to each worker",
      "costs",
      "An n-by-n integer cost matrix for n <= 10; costs may be negative.",
      "Return the minimum total cost assigning worker i one unique job, using every job once. Return 0 when n=0.",
      `
def solve(costs):
    n=len(costs);best=[float('inf')]*(1<<n);best[0]=0
    for mask in range(1<<n):
        worker=mask.bit_count()
        if worker==n:continue
        for job in range(n):
            if not mask>>job&1:
                nxt=mask|1<<job
                best[nxt]=min(best[nxt],best[mask]+costs[worker][job])
    return best[-1]`,
      [
        t(
          [
            [
              [9, 1],
              [2, 8],
            ],
          ],
          3
        ),
        t([[]], 0),
        t([[[-3]]], -3),
      ],
      "Worker 0 takes job 1 for 1 and worker 1 takes job 0 for 2, totaling 3.",
      [
        "The number of used jobs determines the next worker, so the subset alone suffices here.",
        "Do not add an endpoint dimension when the next cost does not depend on the previously assigned job.",
      ]
    )
  ),
];
