import { unit, problem as p, t, q, using } from "./unit.js?v=20261027-course2";
const partition = p(
  "Keep the promise at a boundary",
  "items, pivot",
  "An integer list and an integer pivot; preserve order inside both groups.",
  "Return [below, rest], splitting values strictly below pivot from all other values. Preserve order in each group.",
  `
def solve(items, pivot):
    below, rest = [], []
    for value in items:
        if value < pivot:
            below.append(value)
        else:
            rest.append(value)
    return [below, rest]`,
  [
    t(
      [[3, 1, 3, 2], 3],
      [
        [1, 2],
        [3, 3],
      ]
    ),
    t([[], 0], [[], []]),
    t([[0, -1], 0], [[-1], [0]]),
  ],
  "Values 1 and 2 go below 3. Both 3s stay in the other group; no value is lost.",
  [
    "State a rule about exactly which already-read values are in each output.",
    "Each new value belongs to exactly one group; append once and preserve the rule.",
  ]
);
const series = p(
  "Build a sum by induction",
  "n",
  "A nonnegative integer n, at most 100.",
  "Return 1 + 2 + ... + n using a loop. Return 0 for n = 0.",
  `
def solve(n):
    total = 0
    for k in range(1,n+1):
        total += k
    return total`,
  [t([4], 10), t([0], 0), t([1], 1)],
  "The successive totals 0, 1, 3, 6, 10 match k(k+1)/2 for k = 0 through 4.",
  ["Show that the rule is true at k = 0.", "Assume total = k(k+1)/2, then add k+1 and simplify to (k+1)(k+2)/2."]
);
const recurrence = p(
  "Count work across a recursion tree",
  "n",
  "A positive power of two n, at most 1024. A leaf costs 1 and each internal call on size s adds s units.",
  "Return T(n) where T(1)=1 and T(n)=2T(n/2)+n. Implement the recurrence directly.",
  `
def solve(n):
    if n == 1:
        return 1
    return 2*solve(n//2)+n`,
  [t([4], 12), t([1], 1), t([8], 32)],
  "At size 4, the leaf level costs 4, the size-2 level costs 4, and the root costs 4: total 12.",
  [
    "At each depth, the number of subproblems grows while their sizes shrink.",
    "For powers of two, each level costs n and there are log2(n)+1 levels including leaves.",
  ]
);
const dynamic = p(
  "Pay for occasional array growth",
  "n",
  "A nonnegative append count n, at most 1000. Start with size 0 and capacity 1.",
  "Return [total_cost, final_capacity]. Each append costs 1; when full, double capacity and additionally pay 1 per existing item copied.",
  `
def solve(n):
    size, capacity, cost = 0, 1, 0
    for _ in range(n):
        if size == capacity:
            cost += size
            capacity *= 2
        size += 1
        cost += 1
    return [cost,capacity]`,
  [t([5], [12, 8]), t([0], [0, 1]), t([4], [7, 4])],
  "Five writes cost 5; copying sizes 1, 2, and 4 costs 7 more. Total 12, capacity 8.",
  ["Count writes and copies separately.", "The copied sizes form 1 + 2 + 4 + ...; the sum is below twice the final size."]
);
const bound = p(
  "Count the leaves a comparison tree needs",
  "n",
  "An integer n from 0 through 12; keys are distinct and sorting uses only binary comparisons.",
  "Return the smallest integer h with 2**h >= n!. This is an information lower bound, not a sorting implementation or a claim that the bound is always attained.",
  `
def solve(n):
    possibilities = 1
    for k in range(2,n+1):
        possibilities *= k
    h, leaves = 0, 1
    while leaves < possibilities:
        leaves *= 2
        h += 1
    return h`,
  [t([3], 3), t([0], 0), t([4], 5)],
  "Three distinct keys have 6 orders. Two yes/no questions distinguish at most 4 possibilities; three can distinguish up to 8.",
  ["Count n! possible input orders.", "h binary questions produce at most 2**h leaves. Find the first h large enough."]
);
export const reasoningUnits = [
  unit(
    66,
    "Prove a loop: start, preserve, finish",
    [1, 3],
    "A loop rule connects each local update to the final result.",
    [
      "It is easy to trust a loop after three examples. A proof asks a stronger question: what stays true after every possible number of iterations? That statement is a loop invariant. It describes the part already processed, including the empty beginning.",
      "For splitting [3,1,3,2] around 3, the rule is: below contains exactly the processed values smaller than 3; rest contains exactly the other processed values. Both keep the original order. First check initialization: before reading anything, both outputs are empty, so the statement holds.",
      "Next check preservation. The new value is either below 3 or it is not; append it to that one group. The rule still holds for one more processed item. Finally check termination: the unread count drops by one each time, so the loop ends.",
      "When no unread values remain, the processed part is the whole input. The invariant now says exactly what the output must contain. Initialization, preservation, termination, and the final implication are separate obligations; a useful-looking invariant that never implies the requested output is insufficient.",
    ],
    [
      [
        "Before reading, the rule holds for an empty prefix.",
        [
          ["Read", "[]"],
          ["Below / rest", "[] / []"],
        ],
      ],
      [
        "Read 3: it is not strictly below the pivot.",
        [
          ["Read", "[3]"],
          ["Below / rest", "[] / [3]"],
        ],
      ],
      [
        "Read 1, then 3: classify each once.",
        [
          ["Read", "[3,1,3]"],
          ["Below / rest", "[1] / [3,3]"],
        ],
      ],
      [
        "Read 2: the invariant now covers the whole input.",
        [
          ["Below / rest", "[1,2] / [3,3]"],
          ["Unread count", "0"],
        ],
      ],
    ],
    "A rule can be true throughout a loop yet too weak to prove its output. Also prove progress toward stopping.",
    q(
      "Which invariant is strong enough to prove a partition preserves every value?",
      [
        "The outputs contain exactly the processed values in their appropriate groups",
        "Every value is an integer",
        "The output lists are sometimes empty",
      ],
      0,
      "The exact relationship to the processed prefix proves both correct grouping and no loss or duplication."
    ),
    q(
      "Why does proving initialization and preservation alone not prove the loop stops?",
      [
        "The loop might preserve its rule forever without reducing unfinished work",
        "All invariants imply termination",
        "The input must always be sorted",
      ],
      0,
      "A decreasing nonnegative amount of unfinished work supplies a separate termination argument."
    ),
    [
      "Each input value is classified once, so work grows linearly with list length.",
      "Both output lists together hold all input values; a few counters are additional.",
      "O(n) time and O(n) output space; O(1) working space apart from outputs.",
    ],
    [
      ["Invariant", "A statement true before and after every iteration."],
      ["Variant", "A nonnegative measure that strictly decreases until stopping."],
    ],
    partition,
    p(
      "Partition three ways",
      "items, pivot",
      "Integers and a pivot; preserve input order in each returned group.",
      "Return [below, equal, above] with every input value classified exactly once.",
      `
def solve(items,pivot):
    groups=[[],[],[]]
    for x in items:
        groups[0 if x < pivot else 1 if x == pivot else 2].append(x)
    return groups`,
      [t([[3, 1, 3, 4], 3], [[1], [3, 3], [4]]), t([[], 0], [[], [], []]), t([[0, -1], 0], [[-1], [0], []])],
      "Equal values need their own group rather than being bundled with larger ones.",
      ["Strengthen the invariant to cover three exhaustive groups.", "Use exactly one branch per input value."]
    ),
    p(
      "Keep the first copy of each record",
      "items",
      "A list of integers in arrival order.",
      "Return each distinct value once in the order of its first appearance, leaving the input unchanged.",
      `
def solve(items):
    seen=set()
    result=[]
    for x in items:
        if x not in seen:
            seen.add(x)
            result.append(x)
    return result`,
      [t([[3, 1, 3, 2, 1]], [3, 1, 2]), t([[]], []), t([[0, 0]], [0])],
      "The second 3 and second 1 add nothing; the retained order is 3, 1, 2.",
      ["Use one structure for membership and another for arrival order.", "Your rule should say exactly which first occurrences have been retained."]
    )
  ),
  unit(
    67,
    "Induction: make the smaller case do the work",
    [66, 14],
    "A base case and a valid next step can cover an unbounded family of inputs.",
    [
      "Checking totals for n = 1, 2, and 3 suggests a pattern, but a pattern is not a proof for n = 1000. Induction proves a starting case and then shows that any established case forces the next one.",
      "To show 1 + ... + n = n(n+1)/2, start at n = 0: both sides are 0. Assume the formula is true at some arbitrary nonnegative k. This assumption is the induction hypothesis; it is temporarily available only for that smaller case.",
      "For k+1, add the new value to the assumed total: k(k+1)/2 + (k+1) = (k+1)(k+2)/2. That is exactly the formula for the next case. We have not assumed the conclusion for k+1.",
      "The base case starts a chain and the step carries it forward. Recursive correctness uses the same idea: prove smaller calls correct, show the caller combines them correctly, and show inputs really shrink toward a base. Strong induction permits using all smaller cases, which is useful when a call splits rather than subtracts one.",
    ],
    [
      [
        "Base case n=0.",
        [
          ["Loop total", "0"],
          ["Formula", "0×1/2 = 0"],
        ],
      ],
      [
        "Assume the rule at k=3.",
        [
          ["Known total", "1+2+3 = 6"],
          ["Formula", "3×4/2 = 6"],
        ],
      ],
      [
        "Add k+1=4.",
        [
          ["New total", "6+4 = 10"],
          ["Algebra", "3×4/2 + 4 = 4×5/2"],
        ],
      ],
      [
        "The arbitrary step extends the rule to every nonnegative integer.",
        [
          ["Obligations", "base + arbitrary step + domain"],
          ["No finite tests", "can replace the arbitrary step"],
        ],
      ],
    ],
    "The induction hypothesis is for smaller cases. Assuming the very case being proved is circular reasoning.",
    q(
      "When proving a recursive function correct at n, which result may the induction hypothesis supply?",
      [
        "Correct answers for the smaller inputs the function calls",
        "Correctness at n without further work",
        "Correctness for negative inputs outside the contract",
      ],
      0,
      "Use smaller-case correctness to justify the combination; still prove the current result and termination."
    ),
    q(
      "Why is verifying the first ten cases not an induction proof?",
      ["It does not prove the step for an arbitrary case", "Induction never uses examples", "The base case must be larger than ten"],
      0,
      "A finite list of examples cannot establish that the same implication holds for every later input."
    ),
    [
      "The loop computes n additions; the proof applies to every allowed n.",
      "The code keeps one total and a loop position. Python integer bit costs grow for large inputs; the task uses small n.",
      "O(n) arithmetic operations and O(1) integer variables.",
    ],
    [
      ["Induction hypothesis", "The smaller-case fact you may use in proving the next case."],
      ["Strong induction", "Assume all smaller cases, not only the immediately preceding one."],
    ],
    series,
    p(
      "Add the first n odd numbers",
      "n",
      "A nonnegative integer n, at most 100.",
      "Return the sum of the first n positive odd integers using a loop.",
      `
def solve(n):
    total=0
    for k in range(n):
        total+=2*k+1
    return total`,
      [t([4], 16), t([0], 0), t([1], 1)],
      "1 + 3 + 5 + 7 = 16. The induction step adds 2k+1 to k² to produce (k+1)².",
      ["Try stating the result as a square.", "Use k² + 2k + 1 = (k+1)² for the step."]
    ),
    p(
      "The total in a triangular display",
      "rows",
      "A list of nonnegative row lengths; return the total number of occupied cells.",
      "Return the total cells using recursive divide-and-conquer over the row list, without sum().",
      `
def solve(rows):
    def count(left,right):
        if left==right:return 0
        if right-left==1:return rows[left]
        mid=(left+right)//2
        return count(left,mid)+count(mid,right)
    return count(0,len(rows))`,
      [t([[1, 2, 3, 4]], 10), t([[]], 0), t([[0, 5]], 5)],
      "The two disjoint halves contribute 3 and 7, giving 10.",
      ["Prove each disjoint half is counted correctly.", "The combined interval must contain every row once, without overlap."]
    )
  ),
  unit(
    68,
    "Recurrences: count a whole recursion tree",
    [67, 24, 38],
    "Count both the work inside a call and the work delegated to smaller calls.",
    [
      "A function with one visible loop can still do much more work through its recursive calls. A recurrence states how total work depends on the smaller totals plus the caller’s own work.",
      "For a balanced split, imagine two children of half the size and n units of combining work. Write T(n)=2T(n/2)+n, with T(1)=1. We restrict this counting exercise to powers of two so the arithmetic is easy to inspect; real odd sizes need floor and ceiling bounds.",
      "At depth 0, the root costs n. At depth 1, two size-n/2 calls together cost n. At every later internal depth the same cancellation happens. There are log₂(n) internal levels, followed by n leaves each costing 1.",
      "The total is n log₂(n)+n. This counts the full tree, not only one path. A recurrence is a model: Python slicing, extra sorting, or a different number of recursive calls can change it. State which work your model includes before applying a familiar bound.",
    ],
    [
      [
        "For n=4, write the recurrence.",
        [
          ["Root combine cost", "4"],
          ["Children", "two size-2 calls"],
        ],
      ],
      ["Each size-2 call adds 2 units.", [["Level 1 total", "2+2 = 4"]]],
      ["Four leaves each cost 1.", [["Leaf total", "4"]]],
      [
        "Add levels, rather than multiplying one path by n again.",
        [
          ["Total", "4+4+4 = 12"],
          ["Formula", "4 log₂4 + 4 = 12"],
        ],
      ],
    ],
    "Following one branch counts depth, not the work of all branches. Also include the caller’s own work.",
    q(
      "In T(n)=2T(n/2)+n, how much combined nonrecursive work occurs at each internal level?",
      ["n", "n² at every level", "Only 1"],
      0,
      "Twice as many calls have half the size, so their local costs still add to n."
    ),
    q(
      "What changes if a routine calls the same half-sized problem twice instead of caching one result?",
      ["Its recurrence counts both calls even when the arguments match", "The second call is automatically free", "Its recursion depth doubles"],
      0,
      "Identical arguments do not share computation unless the implementation explicitly stores and reuses the answer."
    ),
    [
      "The returned number models n(log₂n+1) units; the reference computes that count using one recursive half-count.",
      "The counting code has logarithmic call depth; the algorithm being modeled has an entire branching tree.",
      "Counting program: O(log n) time/stack. Modeled recurrence: Θ(n log n) work.",
    ],
    [
      ["Recurrence", "An equation relating total work to work on smaller inputs."],
      ["Level", "Calls at the same depth in a recursion tree."],
    ],
    recurrence,
    p(
      "A split with constant local work",
      "n",
      "A positive power of two n at most 1024.",
      "Return T(n) for T(1)=1 and T(n)=2T(n/2)+1.",
      `
def solve(n):
    if n==1:return 1
    return 2*solve(n//2)+1`,
      [t([4], 7), t([1], 1), t([8], 15)],
      "The full binary tree with four leaves has three internal nodes, giving seven unit-cost calls.",
      ["Count nodes rather than assigning n work to each level.", "The closed form 2n-1 is a useful independent check."]
    ),
    p(
      "Work in every ordered comparison",
      "n",
      "A nonnegative integer n, at most 100.",
      "Return how many pairs (i,j) satisfy 0 <= i < j < n, using a loop that accumulates each row length.",
      `
def solve(n):
    total=0
    for i in range(n):total+=n-i-1
    return total`,
      [t([4], 6), t([0], 0), t([1], 0)],
      "Rows have 3, 2, 1, and 0 pairs, totaling 6.",
      [
        "A shrinking inner loop still contributes a sum of row lengths.",
        "Use n(n-1)/2 as a check, not a claim of constant work for the loop implementation.",
      ]
    )
  ),
  unit(
    69,
    "Amortized analysis: account for a whole sequence",
    [66, 36],
    "An occasional expensive operation can coexist with a cheap bound across many operations.",
    [
      "Appending to a growing array sometimes needs a new, larger allocation and a copy of all existing entries. That one append is expensive. To judge a long sequence, count all writes and all copies together.",
      "Start with capacity 1. When full, double it. Across successive growths we copy 1, 2, 4, 8, and so on. To reach size n, their sum stays below 2n. The n ordinary writes contribute another n.",
      "Therefore n appends cost less than 3n units in this model. Divide by n to get an amortized constant cost per append. This bound applies to every append-only sequence; it is not an average over random inputs.",
      "The accounting depends on geometric growth. Increasing capacity by only one copies 1+2+...+(n-1), which is quadratic. Alternating growth and aggressive shrink operations also needs a separate policy and proof. This simulation is an explicit model, not a measurement of Python’s actual allocation strategy.",
    ],
    [
      [
        "Start empty at capacity 1.",
        [
          ["Size / capacity", "0 / 1"],
          ["Cost", "0"],
        ],
      ],
      [
        "First append fits; second grows.",
        [
          ["Size / capacity", "2 / 2"],
          ["Writes + copies", "2 + 1 = 3"],
        ],
      ],
      [
        "Fifth append triggers growth from 4 to 8.",
        [
          ["Copied sizes so far", "1, 2, 4"],
          ["Size / capacity", "5 / 8"],
        ],
      ],
      [
        "Total costs at size 5.",
        [
          ["Writes", "5"],
          ["Copies", "7"],
          ["Total", "12 < 3×5"],
        ],
      ],
    ],
    "Amortized constant cost does not promise that each individual operation takes constant time.",
    q(
      "Does amortized O(1) appending mean every individual append has constant cost?",
      ["No; a resize can cost linear work, paid for across the sequence", "Yes; no append ever copies values", "Only if inputs are random"],
      0,
      "Amortization bounds total cost across a sequence, allowing occasional expensive operations."
    ),
    q(
      "Why does increasing capacity by only one lose the constant amortized bound?",
      [
        "It repeatedly copies nearly the entire array, giving a quadratic total",
        "It eliminates all copies",
        "The final capacity becomes logarithmic",
      ],
      0,
      "Copied sizes 1+2+...+(n-1) form a quadratic sum rather than a geometric sum."
    ),
    [
      "The simulation performs n append steps. Its returned count separates writes from resize copies.",
      "Only size, capacity, and cost are stored by the model; a real dynamic array stores its elements too.",
      "Simulation O(n) time/O(1) variables. Modeled n appends have O(n) total writes/copies and O(n) storage.",
    ],
    [
      ["Amortized", "Cost per operation obtained by bounding an entire sequence."],
      ["Geometric growth", "Multiplying capacity by a fixed factor greater than 1."],
    ],
    dynamic,
    p(
      "Inspect every resize bill",
      "n",
      "A nonnegative append count at most 1000, with initial capacity 1 and doubling when full.",
      "Return the list of copy costs at each resize, excluding ordinary writes.",
      `
def solve(n):
    capacity=1
    copies=[]
    while capacity < n:
        copies.append(capacity)
        capacity*=2
    return copies`,
      [t([5], [1, 2, 4]), t([0], []), t([4], [1, 2])],
      "Reaching five values copies existing sizes 1, 2, and 4.",
      ["Only growth events belong in the result.", "A final capacity equal to n does not require another resize."]
    ),
    p(
      "A stack with many removals",
      "values",
      "An integer list in arrival order. Maintain a nondecreasing stack by popping larger top values before pushing each arrival.",
      "Return [final_stack, total_pushes_and_pops]. Count every push and every pop as one operation.",
      `
def solve(values):
    stack=[]
    operations=0
    for x in values:
        while stack and stack[-1]>x:
            stack.pop()
            operations+=1
        stack.append(x)
        operations+=1
    return [stack,operations]`,
      [t([[3, 2, 1]], [[1], 5]), t([[]], [[], 0]), t([[1, 1]], [[1, 1], 2])],
      "There are three pushes and two pops; no entry is popped more than once.",
      ["A nested while loop is not automatically quadratic.", "Charge each pop to the earlier push of the same entry."]
    )
  ),
  unit(
    70,
    "Lower bounds: what any comparison method must learn",
    [68, 38],
    "Count how many possibilities an algorithm must distinguish before claiming it is optimal.",
    [
      "Finding a faster sort is a constructive question: what can this program do? A lower bound asks a different question: what must every program in a stated model do? Specify that model carefully.",
      "For n distinct keys, their relative order can be any of n! permutations. In a comparison-only model where each comparison has two outcomes, h comparisons distinguish at most 2ʰ leaves in a decision tree. Every possible order needs a distinguishable leaf.",
      "So a worst-case path must have at least ceil(log₂(n!)) comparisons. For n=3 there are six orders, which cannot fit into a binary tree of depth two. The first possible depth is three. This is a necessary information bound, not a construction attaining it for every n.",
      "The bound grows as Ω(n log n), matching efficient comparison sorts up to constants. Counting and radix sorting use information about key representation, so they operate outside this restricted model. A lower bound that ignores such assumptions can be false.",
    ],
    [
      ["Three distinct keys can arrive in six orders.", [["Possibilities", "3! = 6"]]],
      ["Two binary comparisons allow at most four answer paths.", [["Depth 2 leaves", "2² = 4 < 6"]]],
      ["Three comparisons allow up to eight leaves.", [["Depth 3 leaves", "2³ = 8 ≥ 6"]]],
      [
        "The information lower bound is three comparisons.",
        [
          ["Necessary depth", "3"],
          ["Not promised", "attainability for every n"],
        ],
      ],
    ],
    "An information lower bound is neither an implementation nor a bound for algorithms outside the stated comparison model.",
    q(
      "Why can counting sort beat the comparison-sorting lower bound for a small integer range?",
      [
        "It uses key values as bucket addresses rather than only comparing pairs",
        "The lower bound is wrong for all sorting",
        "It secretly performs more than n! comparisons",
      ],
      0,
      "Counting sort uses additional representation information and pays for the key range; the comparison-only model does not describe it."
    ),
    q(
      "What follows from 2ʰ >= n! when analyzing a sorting decision tree?",
      [
        "h must be large enough, but existence of such a sort still needs proof",
        "Every sorting algorithm takes exactly h comparisons",
        "All inputs have the same path length",
      ],
      0,
      "The leaf count gives a necessary worst-case information bound. It does not make every path equally long or construct an optimal algorithm."
    ),
    [
      "The exercise computes n! and then doubles a leaf count until it covers that many orders.",
      "Two growing integers hold the permutation and leaf counts. Their bit lengths matter beyond the small contract.",
      "O(n + log(n!)) arithmetic steps; integer sizes O(log(n!)) bits.",
    ],
    [
      ["Lower bound", "Work every algorithm in a specified model must sometimes do."],
      ["Decision tree", "Branching possibilities produced by the outcomes of comparisons."],
    ],
    bound,
    p(
      "Enough binary answers for a secret",
      "possibilities",
      "A positive integer number of equally distinguishable possibilities, at most one million.",
      "Return the smallest h with 2**h >= possibilities.",
      `
def solve(possibilities):
    answers=1
    h=0
    while answers<possibilities:
        answers*=2
        h+=1
    return h`,
      [t([6], 3), t([1], 0), t([8], 3)],
      "Six possible secrets require at least three binary answers.",
      ["One possibility needs no question.", "Stop as soon as the number of leaves is sufficient."]
    ),
    p(
      "Find the unavoidable maximum checks",
      "n",
      "A nonnegative integer count n.",
      "Return the minimum worst-case comparisons needed to find the maximum of n arbitrary distinct numbers: 0 when n <= 1.",
      `
def solve(n):
    return max(0,n-1)`,
      [t([5], 4), t([0], 0), t([1], 0)],
      "Every value except the maximum must lose at least one comparison; each comparison supplies one loser.",
      [
        "Reason about eliminating candidates, not sorting them all.",
        "For n nonempty candidates, n-1 eliminations are necessary and a scan achieves them.",
      ]
    )
  ),
];
