import { unit, problem as p, t, q, using } from "./unit.js?v=20261027-course2";
const cover = p(
  "Find a minimum vertex cover on a small graph",
  "n, edges",
  "An undirected graph with 0 <= n <= 12; parallel edges and self-loops are allowed.",
  "Return a smallest vertex subset covering every edge. Return sorted IDs; among minimum covers choose the lexicographically smallest. Exhaustive search is allowed.",
  `
from itertools import combinations
def solve(n,edges):
    for size in range(n+1):
        for choice in combinations(range(n),size):
            selected=set(choice)
            if all(a in selected or b in selected for a,b in edges):return list(choice)`,
  [
    t(
      [
        3,
        [
          [0, 1],
          [1, 2],
        ],
      ],
      [1]
    ),
    t([0, []], []),
    t(
      [
        2,
        [
          [0, 0],
          [0, 1],
        ],
      ],
      [0]
    ),
  ],
  "Node 1 covers both edges of the three-node path, while no empty selection covers them.",
  [
    "A witness is easy to check even when finding an optimum requires many candidates.",
    "Enumerate subset sizes in increasing order and candidates lexicographically for the requested tie rule.",
  ]
);
const approximate = p(
  "Cover every edge within a proved factor",
  "n, edges",
  "An undirected graph without self-loops; endpoints use 0 through n-1. Repeated edges are harmless.",
  "Scan edges in input order. Whenever neither endpoint is already selected, select both endpoints. Return sorted selected IDs.",
  `
def solve(n,edges):
    selected=set()
    for a,b in edges:
        if a not in selected and b not in selected:selected.update((a,b))
    return sorted(selected)`,
  [
    t(
      [
        3,
        [
          [0, 1],
          [1, 2],
        ],
      ],
      [0, 1]
    ),
    t([0, []], []),
    t(
      [
        4,
        [
          [0, 1],
          [2, 3],
        ],
      ],
      [0, 1, 2, 3]
    ),
  ],
  "The first edge selects both endpoints; the second is already covered. The result can be larger than the optimum but is at most twice its size.",
  [
    "The triggering edges have disjoint endpoints, forming a matching.",
    "Any cover must choose at least one endpoint of each triggering edge; this algorithm chooses two.",
  ]
);
const hullCode = `
def solve(points):
    points=sorted(set(map(tuple,points)))
    if len(points)<=1:return [list(p) for p in points]
    def cross(a,b,c):return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
    lower=[]
    for point in points:
        while len(lower)>=2 and cross(lower[-2],lower[-1],point)<=0:lower.pop()
        lower.append(point)
    upper=[]
    for point in reversed(points):
        while len(upper)>=2 and cross(upper[-2],upper[-1],point)<=0:upper.pop()
        upper.append(point)
    return [list(p) for p in lower[:-1]+upper[:-1]]`;
const hull = p(
  "Wrap a boundary around the points",
  "points",
  "Integer coordinate pairs, possibly duplicated or empty.",
  "Return the convex hull counterclockwise from the lexicographically smallest point, excluding collinear interior points. A collinear set returns just its two endpoints.",
  hullCode,
  [
    t(
      [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
      ],
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ]
    ),
    t(
      [
        [
          [0, 0],
          [1, 0],
          [2, 0],
        ],
      ],
      [
        [0, 0],
        [2, 0],
      ]
    ),
    t([[]], []),
  ],
  "The square corners are the boundary; repeated coordinates do not create new vertices.",
  [
    "The sign of the cross product classifies left, right, and collinear turns.",
    "A non-left turn on a lower chain makes its middle point unnecessary for the convex boundary.",
  ]
);
const hashPrelude = `
def find_all(text,pattern):
    n,m=len(text),len(pattern)
    if m==0:return list(range(n+1))
    if m>n:return []
    base,modulus=256,101
    high=pow(base,m-1,modulus)
    target=current=0
    for i in range(m):target=(target*base+ord(pattern[i]))%modulus;current=(current*base+ord(text[i]))%modulus
    result=[]
    for start in range(n-m+1):
        if current==target and text[start:start+m]==pattern:result.append(start)
        if start+m<n:current=((current-ord(text[start])*high)*base+ord(text[start+m]))%modulus
    return result
`;
const hash = p(
  "Rolling hashes: filter, then confirm",
  "text, pattern",
  "Two strings compared exactly. The intentionally small teaching modulus allows collisions.",
  "Return the first exact match position using a rolling hash and character verification on hash matches, or -1. An empty pattern returns 0.",
  hashPrelude +
    `
def solve(text,pattern):
    if not pattern:return 0
    result=find_all(text,pattern)
    return result[0] if result else -1`,
  [t(["aaab", "aab"], 1), t(["abc", ""], 0), t(["ab", "z"], -1)],
  "Equal fingerprints are only candidates. Comparing the actual characters keeps the answer correct even if two different strings collide.",
  [
    "Subtract the outgoing character’s high-place contribution, multiply by the base, and add the incoming character.",
    "A hash collision must trigger verification, not an automatic reported match.",
  ]
);
export const limitUnits = [
  unit(
    100,
    "Reductions and limits: checking is not finding",
    [26, 70, 67],
    "An efficiently checked witness does not imply an efficiently found optimum.",
    [
      "For a vertex cover, each edge must touch at least one selected vertex. Given a proposed set, checking every edge is straightforward. Finding the smallest such set is a different task: searching all subsets may take exponential work.",
      "The decision version asks whether a cover of size at most k exists. A proposed cover is a short certificate whose validity and size can be checked in polynomial time. That is the kind of verification used in the definition of NP; NP does not mean a problem is known to require exponential time.",
      "A reduction transforms instances of one problem into another while preserving the answer. For undirected graphs, a set is independent exactly when its complement is a vertex cover: an edge uncovered by the complement would have both endpoints in the independent set.",
      "This links optimum sizes: maximum independent-set size plus minimum vertex-cover size equals n. General vertex cover is NP-complete as a decision problem; whether every NP problem has a polynomial-time algorithm is the open P-versus-NP question. Small exact search remains useful, but its input limits must be honest.",
    ],
    [
      [
        "For path 0–1–2, inspect a certificate.",
        [
          ["Selected", "{1}"],
          ["Edges covered", "0–1 and 1–2"],
        ],
      ],
      ["The empty certificate fails.", [["Uncovered edge", "0–1"]]],
      [
        "Take the complement of {1}.",
        [
          ["Independent set", "{0,2}"],
          ["No internal edge", "between 0 and 2"],
        ],
      ],
      [
        "Relate the optimal sizes.",
        [
          ["Cover size", "1"],
          ["Independent size", "2"],
          ["Sum", "3 vertices"],
        ],
      ],
    ],
    "NP does not mean “not polynomial,” and NP-completeness does not prove that polynomial-time algorithms are impossible.",
    q(
      "What does a polynomial-time certificate verifier establish about a decision problem?",
      [
        "A proposed positive witness can be checked efficiently",
        "An optimal witness can always be found efficiently",
        "The problem is definitely outside P",
      ],
      0,
      "Verification and search are different capabilities; the definition of NP concerns efficiently checkable positive certificates."
    ),
    q(
      "Why is the complement of a vertex cover an independent set?",
      ["An edge entirely in the complement would be uncovered", "Every vertex cover contains all nodes", "Only bipartite graphs have complements"],
      0,
      "Covering every edge means no edge can have both endpoints outside the cover."
    ),
    [
      "The exact solver may examine every subset and test all edges.",
      "The current subset and its membership set use at most n entries.",
      "O(2ⁿ(V+E+1)) safe time bound and O(V) working space.",
    ],
    [
      ["Reduction", "An answer-preserving transformation between problem instances."],
      ["Certificate", "A proposed witness whose validity can be checked."],
    ],
    cover,
    p(
      "Validate a proposed cover",
      "n, edges, selected",
      "An undirected graph and a proposed list of node IDs; duplicates and invalid IDs make the proposal invalid.",
      "Return True exactly when selected contains unique valid IDs and covers every edge.",
      `
def solve(n,edges,selected):
    chosen=set(selected)
    return len(chosen)==len(selected) and all(0<=v<n for v in chosen) and all(a in chosen or b in chosen for a,b in edges)`,
      [
        t(
          [
            3,
            [
              [0, 1],
              [1, 2],
            ],
            [1],
          ],
          true
        ),
        t([2, [[0, 1]], [0, 0]], false),
        t([0, [], []], true),
      ],
      "The proposal [1] has one valid ID, no duplicates, and covers both 0–1 and 1–2. It is a valid cover, so return True; a repeated ID would invalidate a proposal.",
      ["Checking membership is different from discovering a minimum.", "Validate the certificate’s format and domain before edge coverage."]
    ),
    p(
      "How large can a conflict-free set be?",
      "n, edges",
      "An undirected graph with n <= 12, including possible self-loops.",
      "Return the maximum size of an independent vertex set, where no edge has both endpoints selected.",
      using(
        cover,
        `def solve(n,edges):
    return n-len(base(n,edges))`
      ),
      [
        t(
          [
            3,
            [
              [0, 1],
              [1, 2],
            ],
          ],
          2
        ),
        t([0, []], 0),
        t([2, [[0, 0]]], 1),
      ],
      "Complementing the minimum cover {1} yields independent set {0,2}.",
      [
        "Use the cover/independent-set complement relationship.",
        "A self-loop forbids its endpoint from an independent set and forces it into every cover.",
      ]
    )
  ),
  unit(
    101,
    "Approximation: prove the quality you can guarantee",
    [100, 29],
    "A fast feasible answer becomes an approximation algorithm only when its distance from optimum is bounded.",
    [
      "When an exact optimization problem is expensive, returning any feasible answer may still be useful. An approximation guarantee says how its quality compares with the unknown optimum. That guarantee needs a proof under explicit assumptions.",
      "For unweighted vertex cover without self-loops, scan edges and select both endpoints of every currently uncovered edge. The triggering edges share no endpoints, because an endpoint selected earlier would already cover a later incident edge. They form a matching.",
      "Every valid cover must choose at least one endpoint from each of those disjoint edges. If there are r triggering edges, optimum is at least r; the algorithm selects 2r vertices. Therefore the returned cover has size at most twice optimum.",
      "The result need not be minimum, and changing to arbitrary vertex weights invalidates this size-based proof. Removing redundant selected vertices can improve the result while retaining feasibility, but a cover with no redundant vertex is merely minimal, not necessarily globally minimum.",
    ],
    [
      ["Scan path edges 0–1, then 1–2.", [["Initially selected", "{}"]]],
      [
        "The first uncovered edge triggers both endpoints.",
        [
          ["Selected", "{0,1}"],
          ["Triggering matching size", "1"],
        ],
      ],
      ["The second edge is already covered by 1.", [["Returned cover", "[0,1]"]]],
      [
        "Compare certificate lower and achieved upper bounds.",
        [
          ["Optimum at least", "1"],
          ["Returned size", "2 ≤ 2×optimum"],
        ],
      ],
    ],
    "Maximal, minimal, and minimum describe different claims. A factor-two size proof does not automatically apply to weighted costs.",
    q(
      "What supplies the lower bound used in the factor-two cover proof?",
      [
        "The disjoint triggering edges each require an endpoint in every cover",
        "The algorithm happened to pass several examples",
        "Every selected node must belong to the unique optimum",
      ],
      0,
      "No single selected vertex can cover two disjoint matching edges, so r such edges force at least r cover vertices."
    ),
    q(
      "Does removing every redundant vertex from a cover prove it has minimum size?",
      [
        "No; it proves inclusion-minimality, not global optimality",
        "Yes; local removal always solves vertex cover exactly",
        "Only if the graph is connected",
      ],
      0,
      "A different simultaneous replacement can yield a smaller cover even when no one currently selected vertex can simply be removed."
    ),
    [
      "Scan edges once for the basic cover; sorting selected IDs adds normalization work.",
      "A selected membership set contains at most V nodes.",
      "O(E+V log V) time including sorting and O(V) extra space.",
    ],
    [
      ["Approximation ratio", "A proved factor comparing returned cost with optimum."],
      ["Minimal", "No chosen element can be removed while retaining feasibility."],
    ],
    approximate,
    p(
      "Remove redundant selections deterministically",
      "n, edges",
      "An unweighted undirected graph with no self-loops.",
      "Start with the lesson’s input-order cover. Then try deleting selected vertices in descending ID order, keeping a deletion only if every edge remains covered. Return sorted survivors.",
      using(
        approximate,
        `def solve(n,edges):
    selected=set(base(n,edges))
    for v in sorted(selected,reverse=True):
        candidate=selected-{v}
        if all(a in candidate or b in candidate for a,b in edges):selected=candidate
    return sorted(selected)`
      ),
      [
        t(
          [
            3,
            [
              [0, 1],
              [1, 2],
            ],
          ],
          [1]
        ),
        t([2, [[0, 1]]], [0]),
        t([0, []], []),
      ],
      "On the path, deleting 1 first fails because 1–2 would be uncovered; deleting 0 then succeeds.",
      ["Feasibility must hold after each deletion.", "Do not claim this local improvement finds an optimum on every graph."]
    ),
    p(
      "Choose a minimum-cost cover with weighted participants",
      "weights, edges",
      "Nonnegative integer vertex weights for at most 12 nodes and undirected edges. Self-loops are allowed.",
      "Return the minimum total selected weight covering all edges. Use exact subset search at these small limits.",
      `
def solve(weights,edges):
    n=len(weights);best=sum(weights)
    for mask in range(1<<n):
        if all(mask>>a&1 or mask>>b&1 for a,b in edges):
            best=min(best,sum(weights[v] for v in range(n) if mask>>v&1))
    return best`,
      [t([[100, 1], [[0, 1]]], 1), t([[], []], 0), t([[0, 5], [[0, 1]]], 0)],
      "Choosing both endpoints by the unweighted rule costs 101, while choosing the weight-1 endpoint costs 1.",
      [
        "The objective changed from cardinality to total weight.",
        "Use the small exact solver to test whether an unweighted approximation claim survives the changed assumption.",
      ]
    )
  ),
  unit(
    106,
    "Convex hulls: maintain a boundary with orientation",
    [7, 3, 66],
    "The sign of a cross product tells whether the newest point keeps a convex turn or makes the middle point unnecessary.",
    [
      "A convex hull is the smallest convex boundary enclosing a point set, like a taut band around pins. Interior points do not become boundary corners. Sorting by coordinates gives an order in which lower and upper boundary chains can be maintained.",
      "For points a,b,c, compute (b.x-a.x)(c.y-a.y) - (b.y-a.y)(c.x-a.x). A positive value is a left turn, negative a right turn, and zero collinear. Integer coordinates let this sign be computed exactly with Python integers.",
      "Build a lower chain from left to right. If the last two chain points and the new point fail to make a strict left turn, remove the middle point. It lies on or inside the boundary that the new outer segment can replace. Continue until the chain is convex, then append the new point.",
      "Build the upper chain in reverse order and join them without duplicated endpoints. Deduplicate coordinates first. The <= comparison here excludes collinear interior points; a task retaining every boundary point needs a different policy. Numerical tolerance for floating coordinates is another separate design choice.",
    ],
    [
      ["Sort and deduplicate square corners.", [["Points", "(0,0),(0,1),(1,0),(1,1)"]]],
      ["Build the lower chain.", [["Lower", "(0,0) → (1,0) → (1,1)"]]],
      ["Build the upper chain in reverse.", [["Upper", "(1,1) → (0,1) → (0,0)"]]],
      ["Join without repeated endpoints.", [["Hull CCW", "[(0,0),(1,0),(1,1),(0,1)]"]]],
    ],
    "Coordinate duplicates and collinear boundary points need explicit policies. Do not introduce floating rounding into an exact integer orientation test.",
    q(
      "What does a zero cross product mean for three points?",
      ["They are collinear", "They always have identical coordinates", "They make a strict left turn"],
      0,
      "Zero signed area means the three points lie on one line, though their coordinates can differ."
    ),
    q(
      "Why does the hull code remove on cross <= 0 rather than only cross < 0?",
      [
        "This contract excludes collinear interior boundary points",
        "Every collinear point must be kept twice",
        "The input points are sorted by angle already",
      ],
      0,
      "The equality case removes a middle point lying on a straight boundary segment, retaining just its extreme endpoints."
    ),
    [
      "Sort points, then push and pop each point at most once on each chain.",
      "Both hull chains and the deduplicated sorted points use linear storage.",
      "O(n log n) time and O(n) extra space.",
    ],
    [
      ["Orientation", "The left/right/collinear relation of three ordered points."],
      ["Convex", "Every segment joining points of the region lies inside it."],
    ],
    hull,
    p(
      "Is a point inside the convex boundary?",
      "polygon, point",
      "A convex polygon given counterclockwise without a repeated final vertex; degenerate 0-,1-,2-point polygons are allowed. Integer coordinates.",
      "Return whether point lies inside or on the polygon boundary.",
      `
def solve(polygon,point):
    def cross(a,b,c):return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
    if not polygon:return False
    if len(polygon)==1:return polygon[0]==point
    if len(polygon)==2:
        a,b=polygon
        return cross(a,b,point)==0 and min(a[0],b[0])<=point[0]<=max(a[0],b[0]) and min(a[1],b[1])<=point[1]<=max(a[1],b[1])
    return all(cross(polygon[i],polygon[(i+1)%len(polygon)],point)>=0 for i in range(len(polygon)))`,
      [
        t(
          [
            [
              [0, 0],
              [2, 0],
              [2, 2],
              [0, 2],
            ],
            [1, 1],
          ],
          true
        ),
        t(
          [
            [
              [0, 0],
              [2, 0],
            ],
            [3, 0],
          ],
          false
        ),
        t([[], [0, 0]], false),
      ],
      "A point is inside a counterclockwise convex polygon when it is never strictly right of an oriented boundary edge.",
      [
        "The all-left-side test depends on convexity and consistent orientation.",
        "A two-point hull is a segment, so collinearity alone is not sufficient without bounds.",
      ]
    ),
    p(
      "Find the farthest pair without square roots",
      "points",
      "Integer coordinate points, possibly duplicated or empty.",
      "Return the maximum squared Euclidean distance between any two points, or 0 for fewer than two distinct points. You may compute the hull before checking all hull pairs.",
      using(
        hull,
        `def solve(points):
    boundary=base(points)
    return max(((a[0]-b[0])**2+(a[1]-b[1])**2 for a in boundary for b in boundary),default=0)`
      ),
      [
        t(
          [
            [
              [0, 0],
              [3, 4],
              [1, 1],
            ],
          ],
          25
        ),
        t([[]], 0),
        t(
          [
            [
              [2, 2],
              [2, 2],
            ],
          ],
          0
        ),
      ],
      "The distance between (0,0) and (3,4) has square 9+16=25.",
      [
        "An extreme farthest pair lies on the hull, but this simple implementation still checks all hull pairs.",
        "Squared distances preserve ordering and avoid floating square roots.",
      ]
    )
  ),
  unit(
    107,
    "Rabin–Karp: a fingerprint is not equality",
    [58, 96, 54],
    "Reuse a moving substring fingerprint, but verify characters whenever fingerprints match.",
    [
      "Comparing a length-m pattern with every text window can reread m characters at each position. A rolling hash maps each window to a small number and updates that fingerprint as the window moves.",
      "Treat characters as digits in a polynomial base. To move right, subtract the outgoing character times the highest base power, multiply the remainder by the base, and add the new character. Reduce modulo a positive number throughout.",
      "Equal strings have equal fingerprints, but different strings can collide. A fingerprint mismatch rules out equality; a match only identifies a candidate. Comparing the actual characters on every matching fingerprint makes the reported matches correct under every collision pattern.",
      "The intentionally tiny modulus here makes collisions possible and the limitation visible. Verification can make worst-case work O(nm); the filter is not a guaranteed linear-time replacement for KMP, nor a cryptographic identity check. State the cost of constructing slices and verifying candidates as well as rolling arithmetic.",
    ],
    [
      [
        "Search aab inside aaab.",
        [
          ["Window length", "3"],
          ["Initial window", "aaa"],
        ],
      ],
      [
        "A fingerprint mismatch can reject a candidate.",
        [
          ["Required pattern", "aab"],
          ["Actual window", "aaa"],
        ],
      ],
      [
        "Roll one position right.",
        [
          ["Remove high-place a", "then multiply and add b"],
          ["New window", "aab"],
        ],
      ],
      [
        "A matching fingerprint still needs exact verification.",
        [
          ["Confirmed start", "1"],
          ["Without verification", "collisions could produce false matches"],
        ],
      ],
    ],
    "Hash equality is not string equality. Keep exact verification even when examples show no collision.",
    q(
      "What conclusion is valid when two fingerprints differ under the same hash function?",
      ["The strings are different", "The strings must be equal", "The modulus must be prime"],
      0,
      "Equal strings necessarily compute the same fingerprint, so a mismatch safely rejects equality; the converse does not hold."
    ),
    q(
      "Why does verified rolling-hash matching still have an O(nm) worst case?",
      [
        "Many candidate collisions or actual matches can each require m character checks",
        "Each rolling update requires sorting the text",
        "Hash verification is always free",
      ],
      0,
      "Rolling arithmetic is cheap, but repeated exact comparisons can dominate, especially with a small fixed modulus."
    ),
    [
      "Rolling updates are constant arithmetic work, but every fingerprint match triggers a substring comparison.",
      "The shown helper collects all confirmed starts even though this lesson returns only the first.",
      "O(nm) worst-case time and O(n+m) space including candidate output and compared slices.",
    ],
    [
      ["Fingerprint", "A compact summary that can collide for different inputs."],
      ["Verification", "Checking the actual values after a summary suggests a match."],
    ],
    hash,
    p(
      "Report every overlapping exact match",
      "text, pattern",
      "Two strings compared exactly. Empty patterns match every boundary, including after the final character.",
      "Return all exact starting indices using rolling hashes plus character verification.",
      hashPrelude +
        `
def solve(text,pattern):
    return find_all(text,pattern)`,
      [t(["aaaa", "aa"], [0, 1, 2]), t(["ab", ""], [0, 1, 2]), t(["abc", "z"], [])],
      "Overlapping aa starts at 0,1,2; an empty pattern has one match at each boundary.",
      ["Continuing after a match must not skip overlapping candidates.", "Return every confirmed position, not only the first hash collision."]
    ),
    p(
      "Repeated fixed-length records",
      "text, k",
      "A string and an integer length k. Invalid nonpositive or overlong lengths return an empty list.",
      "Return sorted distinct length-k substrings occurring at least twice. Use rolling fingerprints to group candidates, but verify and count their complete strings.",
      `
def solve(text,k):
    if k<=0 or k>len(text):return []
    base,modulus=256,101;high=pow(base,k-1,modulus);fingerprint=0
    for c in text[:k]:fingerprint=(fingerprint*base+ord(c))%modulus
    buckets={};repeated=set()
    for start in range(len(text)-k+1):
        word=text[start:start+k]
        bucket=buckets.setdefault(fingerprint,{})
        bucket[word]=bucket.get(word,0)+1
        if bucket[word]>=2:repeated.add(word)
        if start+k<len(text):fingerprint=((fingerprint-ord(text[start])*high)*base+ord(text[start+k]))%modulus
    return sorted(repeated)`,
      [t(["ababa", 2], ["ab", "ba"]), t(["aaaa", 2], ["aa"]), t(["abc", 0], [])],
      "ab and ba each occur twice in ababa; overlapping occurrences count.",
      [
        "A bucket can contain several different strings with the same fingerprint.",
        "Distinct output strings are separate from counting repeated starting positions.",
      ]
    )
  ),
];
