// Original decision scenarios. Answer checks are deterministic; written reasoning
// is deliberately self-reviewed, never claimed to be automatically graded.
const Q = (prompt, correct, wrong1, wrong2, why) => ({ prompt, correct, wrong1, wrong2, why });
const sets = [
  [
    "A sensor report you can defend",
    "A device receives integer readings. It must preserve the input and return the first position equal to a requested value, including repeated readings.",
    [
      Q(
        "Which plan respects the first-position requirement?",
        "Scan from left to right and stop at the first match",
        "Sort the values and return their new position",
        "Return the last matching position",
        "A left-to-right scan rules out every earlier position before it returns; sorting changes the required positions."
      ),
      Q(
        "What fact should hold before checking position i?",
        "Every earlier position has been checked and does not match",
        "Every later position has already failed",
        "The target must occur somewhere",
        "The processed-prefix rule justifies why a match at i is the first one and why exhaustion permits -1."
      ),
      Q(
        "Which example catches returning -1 after only one mismatch?",
        "[4,7] with target 7",
        "[7] with target 7",
        "An empty list only",
        "The first value fails while a later value succeeds, exposing a premature absent result."
      ),
      Q(
        "What is the worst-case growth for a missing target?",
        "Linear visits and constant extra variables",
        "Logarithmic visits without an ordering promise",
        "Constant visits regardless of list length",
        "Any unchecked value might still be the target, so a missing target requires checking the whole list."
      ),
    ],
  ],
  [
    "Repeated badges and missing partners",
    "A badge list may contain duplicates. A report needs both distinct badge counts and the first pair of positions summing to a target.",
    [
      Q(
        "What information is needed for a two-sum answer of positions?",
        "A map from earlier values to their remembered indices",
        "Only a set of distinct values with no positions",
        "A count of all input entries only",
        "Membership alone cannot return the earlier index; the map must preserve the task’s index tie policy."
      ),
      Q(
        "When should the current value enter that map?",
        "After looking for its missing partner",
        "Before looking for a partner",
        "Only after the whole list is sorted",
        "Looking first prevents one input position from matching itself when twice its value equals the target."
      ),
      Q(
        "Which input exposes accidental reuse of one position?",
        "[4] with target 8",
        "[2,6] with target 8",
        "[1,2] with target 9",
        "One 4 cannot supply two distinct positions, even though its doubled value reaches the target."
      ),
      Q(
        "What assumption underlies expected constant dictionary lookup?",
        "Ordinary hashing behavior, not a worst-case promise for every collision pattern",
        "Keys never share a bucket",
        "A dictionary sorts every key on lookup",
        "Collisions can make a bucket expensive; expected hash-table bounds do not eliminate every worst case."
      ),
    ],
  ],
  [
    "Totals across changing stretches",
    "You need totals of neighboring readings. Some reports fix the group size; others seek the shortest group reaching a threshold.",
    [
      Q(
        "How should a fixed-size group sum move one position right?",
        "Subtract the outgoing reading and add the incoming one",
        "Add the entire new group to the old total",
        "Drop every negative reading from the input",
        "Only two members change, so subtract/add preserves exactly the new consecutive group sum."
      ),
      Q(
        "Why can the positive-only shortest-window method shrink safely?",
        "Removing a positive value lowers the sum predictably",
        "Every array is sorted by default",
        "A negative reading can always be ignored",
        "The shrink/grow argument depends on monotone sum changes, which negative readings can violate."
      ),
      Q(
        "Which input shows why initializing the best fixed-window sum to zero is wrong?",
        "[-5,-2] with group size 1",
        "[0,0] with group size 1",
        "[1,2] with group size 2",
        "The valid nonempty answers are negative; an invented empty answer of zero would incorrectly beat them."
      ),
      Q(
        "For many static inclusive range totals, what preprocessing tradeoff fits?",
        "Linear prefix storage and constant work per range",
        "No preprocessing and constant work for every arbitrary range",
        "Re-sort the list before each question",
        "A prefix difference cancels the unwanted beginning after a one-time linear construction."
      ),
    ],
  ],
  [
    "Boundaries, ties, and sorted streams",
    "A sorted archive contains repeated keys. New records need an insertion boundary, and two sorted batches must be combined without losing duplicates.",
    [
      Q(
        "Which boundary is needed for inserting before all equal targets?",
        "The first index whose value is at least target",
        "Any equal index encountered first",
        "The last index strictly below the final array value",
        "A lower-bound search continues left on equality because an earlier valid boundary may exist."
      ),
      Q(
        "Why can merging compare only the two unused front values?",
        "Every later value in either list is at least its own front",
        "Both input lists contain distinct values",
        "The shorter list always contains the next smallest value",
        "The smaller front is a safe next output because neither sorted suffix hides a smaller value behind it."
      ),
      Q(
        "Which result should merging [1,1] and [1] produce?",
        "[1,1,1]",
        "[1]",
        "[1,1]",
        "Merging preserves every occurrence; deduplicating would solve a different contract."
      ),
      Q(
        "What extra cost must be counted before binary search on unsorted input?",
        "Obtaining and preserving an appropriate sorted representation",
        "Nothing; binary search works on arbitrary order",
        "Only one additional comparison",
        "The logarithmic search bound assumes order already exists, and sorting can also change original positions."
      ),
    ],
  ],
  [
    "Waiting work and broken links",
    "A service handles arrival-order requests, nested parentheses, and a linked chain that may loop.",
    [
      Q(
        "Which container respects arrival order efficiently at both relevant ends?",
        "A deque with append and popleft",
        "A stack with append and pop",
        "A list repeatedly sorted by value",
        "The queue’s oldest item leaves first; deque avoids the repeated shifting of removing a Python list’s front."
      ),
      Q(
        "What does a stack for parentheses represent?",
        "Exactly the openings still waiting for closings",
        "Every character ever read, including removed ones",
        "Only the total input length",
        "Each closing consumes the newest unmatched opening, and an empty stack cannot supply one."
      ),
      Q(
        "Why is the shared initial fast/slow pointer position not cycle evidence?",
        "Both were deliberately initialized there before moving",
        "Every linked chain has a cycle",
        "Pointers can never meet in a cycle",
        "Cycle detection compares after motion; the initial equality occurs in acyclic inputs too."
      ),
      Q(
        "Why can a monotonic-stack while loop still use linear total work?",
        "Every position is pushed once and popped at most once",
        "A nested loop is always constant time",
        "The stack never contains duplicates",
        "Amortized counting charges each removal to a distinct prior insertion rather than multiplying loop bounds."
      ),
    ],
  ],
  [
    "Recursive work that really gets smaller",
    "An exporter handles nested lists and enumerates subsets. Its author also wants to justify recursive running time.",
    [
      Q(
        "What stops a recursive nested-list total?",
        "An integer returns itself, and an empty list contributes zero",
        "A recursive call must always see the original whole list",
        "Sorting every nested list is required",
        "The structure supplies smaller children and explicit base values; self-referential lists are outside the finite-tree contract."
      ),
      Q(
        "What must be copied when saving a backtracking subset?",
        "The current selection list",
        "The entire Python interpreter",
        "Only the final numeric total",
        "Saved answers must survive later undo operations, so storing the same mutable list reference would corrupt them."
      ),
      Q(
        "Which quicksort choice handles many equal values without recursing forever?",
        "Remove a nonempty equal-to-pivot group from recursive work",
        "Recurse on the entire unchanged input twice",
        "Discard duplicate values from the output",
        "Three-way partitioning preserves multiplicities while guaranteeing that the equal group leaves future recursion."
      ),
      Q(
        "Why is following one recursion branch not enough to count total work?",
        "Other branches also execute and must be included",
        "Only the deepest call uses time",
        "Recursion always halves total work",
        "Depth describes stack or levels, whereas total work includes all calls and local work across those levels."
      ),
    ],
  ],
  [
    "Hierarchy and priority are different promises",
    "A directory tree supports ordered membership, height, and smallest-priority extraction.",
    [
      Q(
        "Which promise makes choosing one BST branch safe?",
        "Every descendant in each branch obeys the ancestor ordering bounds",
        "Only the root has a left child",
        "The tree is automatically balanced",
        "The entire ignored branch must be impossible for the target, not merely its immediate child."
      ),
      Q(
        "How is height in nodes combined at a parent?",
        "One plus the larger child height",
        "The sum of both child heights without the parent",
        "Always the number of all descendant nodes",
        "A downward path takes one child branch, so the maximum rather than sum gives its length."
      ),
      Q(
        "Which claim about values in a min-heap is false?",
        "The whole heap array is sorted",
        "A minimum is at the root of a min-heap",
        "Parent-child order need not sort siblings",
        "Heap order supports repeated root extraction, not reading subsequent array positions as a sorted stream."
      ),
      Q(
        "What runtime can a plain one-sided BST have for search?",
        "Linear in the node count",
        "Always logarithmic because it is a tree",
        "Constant because comparisons choose one branch",
        "The branch count is controlled by height; an unbalanced height can be n."
      ),
    ],
  ],
  [
    "Pick a network method for the actual costs",
    "A route service mixes equal-cost roads, nonnegative tolls, negative credits, and job prerequisites.",
    [
      Q(
        "Which method justifies first-discovery shortest distance when every road costs one?",
        "Breadth-first search",
        "Depth-first search in arbitrary neighbor order",
        "Choosing the largest node label",
        "BFS explores all smaller distance layers before later ones, making first discovery shortest under equal edge costs."
      ),
      Q(
        "Why does Dijkstra need nonnegative costs?",
        "A later route through a more expensive frontier cannot then improve the cheapest finalized distance",
        "A heap cannot store negative numbers",
        "Negative numbers cannot be added",
        "The proof uses nonnegative extension costs; the heap’s storage capabilities are unrelated."
      ),
      Q(
        "Which case invalidates the undirected union-find cycle rule for a directed graph?",
        "Edges 0→1, 0→2, 1→2 form a DAG despite undirected connectivity",
        "A single undirected triangle",
        "An empty graph",
        "Undirected connectivity ignores direction and can report a cycle on a directed shared destination."
      ),
      Q(
        "What does earliest-finish interval selection optimize under its proved assumptions?",
        "The number of non-overlapping intervals",
        "Any arbitrary sum of interval rewards",
        "The fewest vertices in a graph cover",
        "The exchange argument preserves the number of selected intervals; changing reward weights needs a new argument."
      ),
    ],
  ],
  [
    "Name the smaller question before filling a table",
    "A planner counts routes, minimizes reusable coins, and packs once-only items.",
    [
      Q(
        "What must a useful DP state specify first?",
        "Exactly what smaller answer each entry represents",
        "Only the chosen variable name",
        "A loop direction copied from another problem",
        "The recurrence and initialization can only be checked against a precise state meaning."
      ),
      Q(
        "Why does once-only knapsack update capacities downward?",
        "Smaller source capacities must still belong to the previous item stage",
        "Descending values are always greedily best",
        "It permits taking each item forever",
        "Reading a just-updated lower capacity can reuse the current item and silently change the problem."
      ),
      Q(
        "Which coin example disproves largest-coin-first as a general minimum-count rule?",
        "Coins [1,3,4], amount 6",
        "Coins [1], amount 2",
        "Coins [], amount 0",
        "Greedy uses 4+1+1, while 3+3 uses fewer coins, so a local largest choice is not always optimal."
      ),
      Q(
        "What input parameter makes O(nC) knapsack pseudo-polynomial?",
        "The numeric capacity C, not only its encoded bit length",
        "The number of characters in the function name",
        "The count of sorting comparisons",
        "A numeric capacity may be exponentially larger than the bits needed to encode it, so polynomial in C is not polynomial in input bits."
      ),
    ],
  ],
  [
    "Fast summaries still have contracts",
    "A query toolkit uses XOR to compare flags, a Fenwick tree for changing totals, and KMP to find repeated text patterns.",
    [
      Q(
        "When does XOR of all values identify the unpaired value?",
        "Every other integer appears exactly twice and one appears once",
        "Any arbitrary frequency distribution",
        "Every value appears three times",
        "Equal pairs cancel and zero leaves the remaining value; other multiplicity assumptions need different reasoning."
      ),
      Q(
        "Why do Fenwick helper indices start at one?",
        "Lowest-set-bit jumps must progress rather than remain at zero",
        "Python lists cannot use index zero",
        "Input indices must all be changed permanently",
        "At helper zero, i & -i is zero, so an update using that jump would never advance."
      ),
      Q(
        "After a partial KMP mismatch, what can safely be retained?",
        "A pattern prefix matching the already-read ending",
        "Any number of previously matched characters",
        "The entire failed match without checking compatibility",
        "The prefix table identifies compatible endings, preserving only information that can still form a valid match."
      ),
      Q(
        "What does a KMP fallback avoid?",
        "Moving the text scan backward and rereading every matched character",
        "Comparing any pattern characters at all",
        "The need for a nonempty return value",
        "The text pointer keeps advancing while the pattern pointer reuses justified overlap information."
      ),
    ],
  ],
  [
    "Combine the idea behind the story",
    "Readings can be negative, work speed has a deadline, and graph moves can begin at several sources.",
    [
      Q(
        "Which observation counts target-sum stretches even when values are negative?",
        "Current prefix minus an earlier prefix equals the target",
        "Removing a left value always lowers the sum",
        "Every qualifying stretch has the same length",
        "The prefix identity remains valid without monotone sums; a frequency map counts all eligible earlier boundaries."
      ),
      Q(
        "Why do all sources enter a multi-source BFS queue before expansion?",
        "They all belong to distance layer zero",
        "The first source must visit every cell alone",
        "Sources must be sorted by value first",
        "Seeding one common zero layer makes the first wave reaching a cell its nearest-source distance."
      ),
      Q(
        "Which edit-distance boundary differs from an LCS table?",
        "An empty-to-length-j conversion costs j insertions",
        "Every first-row value is always zero",
        "Matching characters always cost one edit",
        "The state counts edits, so creating a nonempty target from an empty source incurs one insertion per character."
      ),
      Q(
        "What justifies binary search over possible work speeds?",
        "The deadline check changes monotonically from failing to working",
        "The input piles happen to be sorted",
        "Every integer speed takes equal time",
        "Faster speeds never require more hours under the contract, giving one searchable feasibility boundary."
      ),
    ],
  ],
  [
    "Defend a program rather than its examples",
    "A teammate says a loop is correct, recursive work is logarithmic, and every append is constant-time.",
    [
      Q(
        "Which set of obligations establishes a useful loop proof?",
        "Initialization, preservation, termination, and implication of the final contract",
        "A few ordinary examples and a fast benchmark",
        "Only the presence of a loop counter",
        "The rule must begin true, survive every step, reach a stop, and imply the required result when all work is processed."
      ),
      Q(
        "In a split recurrence, what must be counted besides call depth?",
        "All child calls and each call’s own work",
        "Only the root’s final return statement",
        "Only the largest input element",
        "A logarithmic-depth recursion can still have many calls per level and substantial total combining work."
      ),
      Q(
        "Which capacity policy produces quadratic copied work for n appends?",
        "Increase capacity by one whenever full",
        "Double capacity whenever full",
        "Never copy any existing values",
        "Copy sizes 1+2+...+(n-1) sum quadratically, unlike the geometric sum from doubling."
      ),
      Q(
        "What limits the comparison-sorting lower bound?",
        "It assumes distinct-key ordering learned through binary comparisons",
        "It forbids any algorithm from using buckets",
        "It proves all sorting paths have identical length",
        "Representation-aware integer methods can operate outside that comparison model, paying for other parameters such as key range."
      ),
    ],
  ],
  [
    "Use key structure and randomness deliberately",
    "A batch has small-range integer keys, stable identity-bearing records, and a requested rank rather than a full order.",
    [
      Q(
        "Which requirement makes stable digit passes necessary in LSD radix sorting?",
        "A later pass must preserve lower-digit order within equal current digits",
        "Every key must be unique",
        "Every bucket must contain one item",
        "Without stable ties, a later pass can destroy the partial order established by earlier digits."
      ),
      Q(
        "What does quickselect preserve when it discards partitions?",
        "The same desired value under a correctly adjusted local rank",
        "The original rank number even after discarding smaller keys",
        "A fully sorted output on both discarded sides",
        "When going right, subtract smaller and equal group sizes so the local rank still names the same order statistic."
      ),
      Q(
        "Which test catches destabilizing an insertion sort with >=?",
        "Two equal keys with labels arriving as z then a",
        "An empty input alone",
        "One record with a unique key",
        "A stable result must keep z before a despite label order; shifting equals can reverse the identities."
      ),
      Q(
        "What does expected linear randomized selection promise?",
        "Linear average work over independent pivot choices for a fixed input",
        "Linear work for every seed",
        "A probability that an incorrect rank is acceptable",
        "Correctness holds for all pivot choices; the expectation concerns work and allows expensive individual runs."
      ),
    ],
  ],
  [
    "Richer tree operations need maintained metadata",
    "A service edits BST keys, balances updates, selects ranks, and answers changing range minima.",
    [
      Q(
        "Which structure handles point assignments and arbitrary range minima directly?",
        "A segment tree with an associative min summary",
        "Prefix subtraction of minimum values",
        "A hash set with no positional summaries",
        "Minimum has no subtraction inverse, but a segment tree combines a disjoint cover of associative summaries."
      ),
      Q(
        "Why must rotations update subtree sizes as well as heights in an augmented AVL tree?",
        "Rank queries depend on summaries matching the rewired children",
        "Rotations sort the entire input array",
        "Heights and sizes are always equal",
        "Correct key order alone does not prevent a stale size from sending selection into the wrong subtree."
      ),
      Q(
        "Which case catches deletion code that ignores its returned root?",
        "Deleting a root with one surviving child",
        "Searching for an absent key",
        "Reading an unchanged leaf value",
        "The surviving child must become the caller’s root pointer; mutating only below the old root loses that replacement."
      ),
      Q(
        "What is the whole-call cost of building size metadata before one height-h rank query?",
        "O(n+h), including the O(n) preparation",
        "Always O(log n) even without preprocessing",
        "O(1) regardless of tree size",
        "The useful query metadata must first be constructed or maintained; its preparation is part of this call’s cost."
      ),
    ],
  ],
  [
    "Separate regions from bottlenecks",
    "A network audit asks about one-way loops, mutually reachable groups, fragile roads, and fragile towns.",
    [
      Q(
        "Which directed-DFS edge proves a cycle?",
        "An edge to an active ancestor",
        "Any edge to a previously finished node",
        "Any edge connecting two known undirected vertices",
        "The active path already supplies a directed route from the ancestor to the current node, closing a cycle with the new edge."
      ),
      Q(
        "Why must a bridge search distinguish parallel edge IDs?",
        "A second edge to the parent can be a real bypass",
        "Parallel edges always create more components",
        "Parent vertex IDs are never known",
        "Skipping every edge to the parent vertex would erase a parallel alternative and falsely mark the tree edge as fragile."
      ),
      Q(
        "Which comparison distinguishes a non-root articulation point from a bridge?",
        "Vertex separation uses >= while edge separation uses >",
        "Both always use equality only",
        "Vertices never need low-link information",
        "A route reaching the parent saves an edge but not that parent if the vertex itself is removed."
      ),
      Q(
        "Why can DAG DP finalize a node after all its topological predecessors?",
        "No later predecessor can still supply an unprocessed improvement",
        "All weights must be positive",
        "The node has no incoming edges at all",
        "Topological order is a dependency order, so every incoming contribution is established before the node’s result is consumed."
      ),
    ],
  ],
  [
    "Prove an optimum with the right certificate",
    "A planner compares zero-cost shortcuts, pairwise routes, infrastructure trees, and capacity-limited assignments.",
    [
      Q(
        "What certificate can establish a maximum flow is optimal?",
        "A cut capacity equal to the feasible flow value",
        "The shortest individual source-to-sink path",
        "A statement that every edge is saturated",
        "Every flow is bounded above by every cut, so equality between a feasible flow and a cut closes the optimality gap."
      ),
      Q(
        "Why do residual reverse edges matter?",
        "They permit cancelling earlier flow to reroute it",
        "They double the original network’s physical capacity",
        "They ignore intermediate conservation",
        "A feasible earlier choice can block a better combination; residual cancellations allow augmenting paths to rearrange it."
      ),
      Q(
        "Which example defeats seen-on-first-discovery weighted search?",
        "A cost-1 direct edge beaten by a two-edge cost-0 route",
        "A graph with no edges",
        "One source node with zero distance",
        "First discovery is a shortest-distance certificate only under the right frontier/cost assumptions; a free later route can improve it."
      ),
      Q(
        "Why do Prim and Dijkstra use different heap priorities?",
        "Prim chooses one crossing-edge cost; Dijkstra chooses accumulated route cost",
        "Both always optimize the same source distances",
        "Prim cannot use negative weights because heaps reject them",
        "Their greedy proofs concern different objects: a safe spanning-tree cut versus a finalized source distance."
      ),
    ],
  ],
  [
    "Recover the choices and choose the state",
    "A planner wants reward schedules, concrete subsequences, space-efficient tables, and a visit-every-city tour.",
    [
      Q(
        "Which state information is necessary for a subset tour?",
        "Visited-city mask and last city",
        "Only the number of visited cities",
        "Only the last city",
        "The used set controls legal destinations, and the endpoint controls the next edge cost; neither summary alone is sufficient."
      ),
      Q(
        "What makes weighted scheduling’s take-or-skip recurrence exhaustive?",
        "Every feasible optimum either includes the current job or excludes it",
        "Every earliest-finishing job must be selected",
        "Every reward is equal",
        "The two cases cover all choices, and taking a job restricts earlier work to its compatible finish-ordered prefix."
      ),
      Q(
        "Which input catches confusing strict with nondecreasing subsequences?",
        "[2,2,2]",
        "[1,2,3]",
        "An empty list alone",
        "Repeated equal values can extend a nondecreasing sequence but never a strictly increasing one."
      ),
      Q(
        "What claim is false about O(n²2ⁿ) subset DP?",
        "It is polynomial because it uses a table",
        "It can beat factorial tour enumeration",
        "It still needs small-n input limits",
        "Dynamic programming avoids repeated states, but the number of subsets remains exponential."
      ),
    ],
  ],
  [
    "Discard only what cannot matter later",
    "A telemetry tool maintains rolling extremes, shared occupancy, and constrained board placements.",
    [
      Q(
        "Why may a newer larger value remove an older maximum candidate?",
        "It is at least as good and expires later",
        "Its numeric value always equals its index",
        "Every window is sorted",
        "The older candidate cannot win in a later window that still contains it while the newer dominating value is also eligible."
      ),
      Q(
        "What justifies pruning a partial queen placement with a conflict?",
        "No addition of later queens can remove the existing attacking pair",
        "The branch merely looks unlikely to work",
        "Every recursive branch should keep equal length",
        "Safe pruning proves impossibility under all completions, rather than estimating which branch seems promising."
      ),
      Q(
        "Which intervals expose a half-open endpoint tie bug?",
        "[1,2) and [2,3)",
        "[1,4) and [2,3)",
        "No intervals at all",
        "The touching intervals have no positive-time overlap; tied endpoint processing must reflect that convention."
      ),
      Q(
        "Why is the monotonic deque’s total work linear despite repeated popping?",
        "Every index enters once and leaves at most once",
        "Every while loop is linear per index",
        "Deque removal operations do not count as work",
        "Charging removals to distinct prior insertions bounds the sum over the entire sequence."
      ),
    ],
  ],
  [
    "Arithmetic identities have preconditions",
    "A report needs huge powers, prime flags, modular combination counts, and inverse-based remainder calculations.",
    [
      Q(
        "When is cancellation by a modulo-m denominator justified?",
        "When that denominator has an inverse modulo m",
        "Whenever the denominator is nonzero as an integer",
        "Whenever the numerator is larger",
        "An inverse exists exactly when the denominator and modulus are coprime; nonzero residues under composite moduli may fail this test."
      ),
      Q(
        "Why can sieve marking for a prime p start at p²?",
        "Smaller multiples already have a smaller prime factor",
        "All smaller multiples must be prime",
        "p does not divide its own square",
        "Earlier primes already handled those smaller composites; starting at p would incorrectly remove the prime itself."
      ),
      Q(
        "Which case exposes treating every nonzero residue as invertible?",
        "2 modulo 4",
        "3 modulo 7",
        "1 modulo 5",
        "Every multiple of 2 modulo 4 is even, so none is congruent to 1."
      ),
      Q(
        "What is logarithmic in binary exponentiation, separate from integer bit costs?",
        "The number of exponent-halving rounds",
        "The numeric value of the final power",
        "The number of primes below the modulus",
        "Repeatedly halving the exponent removes one binary digit per round; arithmetic on each residue has its own operand-size cost."
      ),
    ],
  ],
  [
    "Know what your guarantees actually establish",
    "A delivery tool uses a small exact optimizer, a fast approximate cover, an integer geometric boundary, and rolling text fingerprints.",
    [
      Q(
        "What does an efficiently checked optimization witness not establish?",
        "That an optimum can be found in polynomial time",
        "That the witness can be tested against constraints",
        "That some inputs may be easy",
        "Verification can be easy even when general exact optimization is hard; P versus NP remains unresolved."
      ),
      Q(
        "What proves the unweighted vertex-cover algorithm is within factor two?",
        "Its disjoint triggering edges force at least one optimum vertex each",
        "Every greedy answer is optimal",
        "Every selected vertex is forced in every optimum",
        "The algorithm chooses two endpoints per disjoint matching edge, while any cover needs at least one per such edge."
      ),
      Q(
        "Which pair can expose a hash-only equality mistake with the teaching hash?",
        "Different strings with the same fingerprint",
        "Two identical strings",
        "A pattern longer than the text only",
        "Collisions are permitted, so exact character verification is required after fingerprint equality."
      ),
      Q(
        "Why do exact integer coordinates help a convex-hull orientation test?",
        "The cross-product sign can be computed without floating tolerance",
        "Every three integer points are noncollinear",
        "Integer points are already sorted by angle",
        "Python integer arithmetic preserves the exact signed area, separating left/right/collinear under the stated coordinate contract."
      ),
    ],
  ],
];
const graphReview = [
  "Explore routes without inventing shortcuts",
  "An emergency map has directed roads that all cost one move. Return both shortest distances and actual routes, while avoiding repeated work on loops.",
  [
    Q(
      "Which frontier order finds the fewest moves under equal road costs?",
      "A queue that processes earlier distance layers first",
      "A stack following any one trail",
      "A heap ordered only by node names",
      "BFS handles all distance-d places before distance-(d+1) places, so first discovery is shortest."
    ),
    Q(
      "What extra record reconstructs the actual first-discovered shortest route?",
      "One predecessor for each node at its first discovery",
      "Only the total number of graph edges",
      "An alphabetically sorted list of node names",
      "Following saved predecessors backward reaches the source without copying a whole route into every queue entry."
    ),
    Q(
      "Which graph shows DFS may find a longer route before a direct one?",
      "A→B→C→D and A→D, when the B branch is explored first",
      "A graph with only one node",
      "An empty edge list between distinct nodes",
      "Following the first deep branch can discover a three-edge route before inspecting the one-edge route; DFS order is not a shortest-distance proof."
    ),
    Q(
      "How much traversal work does adjacency-list BFS need?",
      "O(V+E), including inspecting all reachable neighbor entries",
      "O(V²) for every graph representation",
      "O(log V) regardless of edges",
      "Each node is enqueued once when marked on discovery and each outgoing neighbor entry is inspected once."
    ),
  ],
];
const remembered = [
  "Reuse information across a batch",
  "A batch contains repeated integer readings. Reports need distinct-position pairs, shortest qualifying positive stretches, and many static range sums.",
  [sets[1][2][0], sets[2][2][1], sets[1][2][2], sets[2][2][3]],
];
sets[7][2][0] = Q(
  "When adding an undirected edge whose endpoints already share a union-find leader, what happens?",
  "It closes a cycle because an existing path already joins its endpoints",
  "It always joins two new components",
  "It proves the directed graph is acyclic",
  "For undirected edges, an old connecting path plus the new edge forms a cycle; this argument does not ignore edge direction safely in directed graphs."
);
const orderedSets = [sets[0], remembered, sets[3], sets[4], sets[5], sets[6], graphReview, sets[7], ...sets.slice(8)];
export const reasoningSets = orderedSets.map(([title, scenario, questions], stage) => ({
  stage,
  title,
  scenario,
  questions: questions.map((question, index) => {
    const answer = (stage + 2 * index) % 3;
    const options = [question.wrong1, question.wrong2];
    options.splice(answer, 0, question.correct);
    return { prompt: question.prompt, options, answer, why: question.why };
  }),
}));
export const reasoningFields = [
  ["approach", "Choose an approach", "Describe your plan and the input facts that make it appropriate."],
  ["proof", "Defend correctness", "State the rule or exhaustive cases, explain why updates preserve it, and why the process ends."],
  ["boundary", "Challenge the plan", "Give a fresh concrete boundary or counterexample, its expected result, and what assumption it checks."],
  ["cost", "Account for the work", "Define input-size variables. Include preprocessing, loops, output, stack, and stored state where relevant."],
];
