import { unit, problem as p, t, q, using } from "./unit.js?v=20261027-course2";
const floyd = p(
  "Shortest costs for every pair",
  "n, edges",
  "A directed graph on n >= 0 nodes with integer edge weights, including negatives. Parallel edges are allowed.",
  "Return an n-by-n matrix of shortest costs, None for unreachable pairs, and [] if any negative cycle exists. The diagonal is 0 when no improving cycle exists.",
  `
def solve(n,edges):
    distance=[[0 if a==b else float('inf') for b in range(n)] for a in range(n)]
    for a,b,w in edges:distance[a][b]=min(distance[a][b],w)
    for k in range(n):
        for a in range(n):
            for b in range(n):distance[a][b]=min(distance[a][b],distance[a][k]+distance[k][b])
    if any(distance[v][v]<0 for v in range(n)):return []
    return [[None if x==float('inf') else x for x in row] for row in distance]`,
  [
    t(
      [
        3,
        [
          [0, 1, 4],
          [1, 2, -1],
          [0, 2, 9],
        ],
      ],
      [
        [0, 4, 3],
        [null, 0, -1],
        [null, null, 0],
      ]
    ),
    t([1, [[0, 0, -1]]], []),
    t([0, []], []),
  ],
  "Allowing node 1 as an intermediate improves cost 0→2 from 9 to 3.",
  [
    "The stage variable is which intermediate vertices are allowed.",
    "Keep k outside the endpoint loops; detect any negative diagonal after relaxation.",
  ]
);
const prim = p(
  "Grow a minimum spanning tree from the frontier",
  "n, edges",
  "An undirected graph on 0 through n-1 with integer weighted edges [a,b,weight]; weights may be negative.",
  "Return the minimum spanning-tree cost with Prim’s algorithm, or -1 when disconnected. For n <= 1 return 0.",
  `
import heapq
def solve(n,edges):
    if n<=1:return 0
    graph=[[] for _ in range(n)]
    for a,b,w in edges:graph[a].append((w,b));graph[b].append((w,a))
    seen=set();heap=[(0,0)];total=0
    while heap:
        cost,v=heapq.heappop(heap)
        if v in seen:continue
        seen.add(v);total+=cost
        for weight,other in graph[v]:
            if other not in seen:heapq.heappush(heap,(weight,other))
    return total if len(seen)==n else -1`,
  [
    t(
      [
        3,
        [
          [0, 1, 1],
          [1, 2, 2],
          [0, 2, 8],
        ],
      ],
      3
    ),
    t([3, [[0, 1, 1]]], -1),
    t([0, []], 0),
  ],
  "Choose the cheapest crossing edge, first 0–1 then 1–2, for total 3.",
  ["Keep the cheapest edge crossing from selected nodes to unselected nodes.", "Skip heap entries whose destination has already joined the tree."]
);
const flowPrelude = `
from collections import deque
def flow(n,edges,source,sink):
    residual=[[0]*n for _ in range(n)]
    for a,b,capacity in edges:residual[a][b]+=capacity
    total=0
    while True:
        parent=[-1]*n;parent[source]=source;queue=deque([source])
        while queue and parent[sink]<0:
            v=queue.popleft()
            for other in range(n):
                if residual[v][other]>0 and parent[other]<0:
                    parent[other]=v;queue.append(other)
        if parent[sink]<0:return total,residual
        amount=float('inf');v=sink
        while v!=source:
            amount=min(amount,residual[parent[v]][v]);v=parent[v]
        v=sink
        while v!=source:
            previous=parent[v]
            residual[previous][v]-=amount
            residual[v][previous]+=amount
            v=previous
        total+=amount
`;
const maxflow = p(
  "Send as much as the capacities allow",
  "n, edges, source, sink",
  "A directed graph with n >= 2, nonnegative integer capacities, and distinct valid source/sink. Parallel capacities add.",
  "Return the maximum source-to-sink flow using shortest augmenting paths in a residual network.",
  flowPrelude +
    `
def solve(n,edges,source,sink):
    return flow(n,edges,source,sink)[0]`,
  [
    t(
      [
        4,
        [
          [0, 1, 3],
          [0, 2, 2],
          [1, 3, 2],
          [2, 3, 3],
          [1, 2, 1],
        ],
        0,
        3,
      ],
      5
    ),
    t([2, [], 0, 1], 0),
    t(
      [
        2,
        [
          [0, 1, 2],
          [0, 1, 3],
        ],
        0,
        1,
      ],
      5
    ),
  ],
  "Source capacity totals 5, and routing 2 directly through node 1, 2 through node 2, and 1 across 1→2 reaches all 5.",
  [
    "A reverse residual edge means earlier flow can be undone and rerouted.",
    "Use BFS to find a shortest residual path, augment by its bottleneck, and update both directions.",
  ]
);
const matchingCode = `
def solve(left_count,right_count,edges):
    graph=[[] for _ in range(left_count)]
    for a,b in edges:graph[a].append(b)
    owner=[-1]*right_count
    def augment(a,seen):
        for b in graph[a]:
            if b in seen:continue
            seen.add(b)
            if owner[b]<0 or augment(owner[b],seen):owner[b]=a;return True
        return False
    return sum(augment(a,set()) for a in range(left_count))`;
const matching = p(
  "Reroute a pairing to make room",
  "left_count, right_count, edges",
  "A bipartite graph with left IDs and right IDs each starting at 0. Edges [left,right] specify allowed pairings.",
  "Return the maximum number of disjoint left-right pairs using augmenting paths.",
  matchingCode,
  [
    t(
      [
        2,
        2,
        [
          [0, 0],
          [0, 1],
          [1, 0],
        ],
      ],
      2
    ),
    t([0, 3, []], 0),
    t(
      [
        2,
        1,
        [
          [0, 0],
          [1, 0],
        ],
      ],
      1
    ),
  ],
  "Pairing 0→0 initially blocks left 1. Reroute left 0 to right 1 so left 1 can use right 0; both are matched.",
  ["An occupied right endpoint may be freed by moving its current left owner.", "Reset the visited-right set for each new augmentation attempt."]
);
const zeroOne = p(
  "Zero-cost moves and one-cost moves",
  "n, edges, start",
  "A directed graph on n >= 1 nodes with edges [a,b,weight] where weight is 0 or 1, plus a valid start.",
  "Return shortest costs from start, using None for unreachable nodes. Use a deque rather than a heap.",
  `
from collections import deque
def solve(n,edges,start):
    graph=[[] for _ in range(n)]
    for a,b,w in edges:graph[a].append((b,w))
    distance=[float('inf')]*n;distance[start]=0;queue=deque([start])
    while queue:
        v=queue.popleft()
        for other,weight in graph[v]:
            candidate=distance[v]+weight
            if candidate<distance[other]:
                distance[other]=candidate
                if weight==0:queue.appendleft(other)
                else:queue.append(other)
    return [None if x==float('inf') else x for x in distance]`,
  [
    t(
      [
        3,
        [
          [0, 1, 1],
          [0, 2, 0],
          [2, 1, 0],
        ],
        0,
      ],
      [0, 0, 0]
    ),
    t([1, [], 0], [0]),
    t([2, [], 0], [0, null]),
  ],
  "A direct cost-1 edge to 1 loses to the two cost-0 edges through 2.",
  [
    "A zero-cost extension belongs at the front of the same cost wave.",
    "A cost-1 extension belongs behind the current wave; update on improvement rather than marking permanently on first discovery.",
  ]
);
export const networkUnits = [
  unit(
    104,
    "0–1 BFS: a deque can maintain cost order",
    [30, 18, 10],
    "When edge costs are only zero or one, put free extensions in front and paid extensions behind.",
    [
      "Ordinary BFS assumes every move has the same cost. A free shortcut breaks its first-discovery distance argument. Dijkstra still works for nonnegative edges, but the special costs 0 and 1 allow a simpler frontier.",
      "Use a deque. When traversing a cost-0 edge improves a distance, put the destination at the front. When a cost-1 edge improves it, put the destination at the back. Free moves stay in the current distance wave; paid moves wait for the next wave.",
      "For edges 0→1 costing 1, 0→2 costing 0, and 2→1 costing 0, node 1 is first discovered at cost 1 and then improved to 0. Therefore a plain seen-on-enqueue rule would be wrong here. Keep best distances and relax improvements.",
      "The deque ordering exploits the gap of at most one between successive cost layers. It does not generalize unchanged to arbitrary weights or negative edges. Model a real problem carefully: if reversing a road costs one while using its given direction costs zero, both moves can be represented directly.",
    ],
    [
      ["Initialize the source only.", [["Distances", "[0,∞,∞]"]]],
      [
        "Explore from 0.",
        [
          ["Paid 0→1", "distance 1, back"],
          ["Free 0→2", "distance 0, front"],
        ],
      ],
      ["Process free node 2 first.", [["Free 2→1", "improve 1 to 0"]]],
      ["All three nodes have cost zero.", [["Answer", "[0,0,0]"]]],
    ],
    "Discovery does not finalize distance in this weighted setting. This deque policy requires exactly 0/1 weights.",
    q(
      "Why is marking a node permanently on its first enqueue unsafe for 0–1 BFS?",
      ["A later zero-cost route can improve its discovered cost", "Deque operations reverse every edge", "Every node must be visited exactly twice"],
      0,
      "First discovery can come through a paid edge before a free path is expanded, so distances must remain improvable."
    ),
    q(
      "What happens to a successful zero-cost relaxation?",
      ["Its destination is added at the front of the deque", "Its cost is changed to 1", "It is ignored if the destination was ever seen"],
      0,
      "The free extension belongs to the current distance layer and should be processed before cost-one extensions."
    ),
    [
      "Use edge relaxations and deque operations to process the two adjacent cost layers.",
      "Store neighbor lists, distances, and the deque frontier.",
      "O(V+E) time and O(V+E) space for a 0/1 graph.",
    ],
    [
      ["Relax", "Replace a saved distance when a smaller candidate is found."],
      ["Cost wave", "Nodes waiting at the same minimum accumulated cost."],
    ],
    zeroOne,
    p(
      "Reverse the fewest roads",
      "n, edges, start, goal",
      "A directed unweighted graph on n >= 1 nodes and two valid endpoints. You may traverse an edge backward by paying one reversal.",
      "Return the fewest reversed traversals needed to reach goal, or -1 if impossible.",
      using(
        zeroOne,
        `def solve(n,edges,start,goal):
    choices=[]
    for a,b in edges:choices.extend([[a,b,0],[b,a,1]])
    answer=base(n,choices,start)[goal]
    return -1 if answer is None else answer`
      ),
      [
        t(
          [
            3,
            [
              [1, 0],
              [1, 2],
            ],
            0,
            2,
          ],
          1
        ),
        t([2, [], 0, 1], -1),
        t([1, [], 0, 0], 0),
      ],
      "Reverse 1→0 once to move from 0 to 1, then follow 1→2 freely.",
      [
        "Represent each original direction with cost 0 and its reverse with cost 1.",
        "Count reversals along the chosen route, not every edge in the graph.",
      ]
    ),
    p(
      "Cross a map with toll cells",
      "grid",
      "A rectangular grid of 0/1 entry tolls. Empty input is allowed; all cells are passable.",
      "Return minimum toll paid from top-left to bottom-right with four-direction moves. Entering a cell pays its value; the starting cell is free.",
      using(
        zeroOne,
        `def solve(grid):
    if not grid or not grid[0]:return 0
    rows,cols=len(grid),len(grid[0]);edges=[]
    for r in range(rows):
        for c in range(cols):
            for nr,nc in ((r-1,c),(r+1,c),(r,c-1),(r,c+1)):
                if 0<=nr<rows and 0<=nc<cols:edges.append([r*cols+c,nr*cols+nc,grid[nr][nc]])
    return base(rows*cols,edges,0)[-1]`
      ),
      [
        t(
          [
            [
              [1, 1],
              [0, 1],
            ],
          ],
          1
        ),
        t([[]], 0),
        t([[[1]]], 0),
      ],
      "Move down into a free cell, then right into a toll-1 cell; do not charge the starting 1.",
      ["The move cost belongs to the destination cell.", "The starting-cell convention differs from paying for every visited cell."]
    )
  ),
  unit(
    85,
    "Floyd–Warshall: add one allowed intermediate",
    [56, 49, 67],
    "Define a stage by which intermediate nodes a path may use, then compare using or avoiding the next one.",
    [
      "Running a single-source search from each node is one way to answer many shortest-path questions. Floyd–Warshall instead defines a table for every pair and grows the set of permitted intermediate nodes.",
      "Before any intermediate node is allowed, a route is either an empty diagonal route or a direct edge. Keep the cheapest parallel edge. At stage k, a best route either avoids k or goes from a to k and then k to b.",
      "Update distance[a][b] with the smaller of its old value and distance[a][k]+distance[k][b]. The k loop must be outside the endpoint loops to preserve the meaning of the stage. With no negative cycle, repeated intermediate visits are unnecessary for an optimum.",
      "Negative edges are allowed, but a negative diagonal after relaxation proves a negative cycle exists somewhere. This task rejects the whole matrix in that case. Other applications may mark only pairs affected by such cycles; that is a different output contract.",
    ],
    [
      [
        "Initialize direct costs.",
        [
          ["0→1 / 1→2 / 0→2", "4 / -1 / 9"],
          ["Diagonal", "0"],
        ],
      ],
      ["Allow node 1 as an intermediate.", [["Candidate 0→1→2", "4 + (-1) = 3"]]],
      ["Keep the better 0→2 route.", [["Updated 0→2", "3"]]],
      [
        "Unreachable reverse routes stay unreachable.",
        [
          ["Row 0", "[0,4,3]"],
          ["Row 2", "[None,None,0]"],
        ],
      ],
    ],
    "Changing loop order can break the staged invariant. A negative cycle is different from an ordinary negative edge.",
    q(
      "What does the outer k loop mean in Floyd–Warshall?",
      ["Paths may use only the intermediate vertices admitted so far", "Only paths starting at k are processed", "k is the desired path length"],
      0,
      "The recurrence splits routes into those avoiding the newly admitted intermediate and those passing through it."
    ),
    q(
      "Why is a negative final diagonal an important failure signal?",
      [
        "A route returns to its own start with negative cost and can repeat indefinitely",
        "All negative edges make shortest paths undefined",
        "The graph must be undirected",
      ],
      0,
      "A negative-cost closed route permits unbounded improvement for paths that can use it."
    ),
    [
      "Every one of V intermediate stages considers V² ordered endpoint pairs.",
      "The distance matrix contains V² entries even for a sparse graph.",
      "O(V³+E) time and O(V²) space.",
    ],
    [
      ["Intermediate", "A node between the route endpoints."],
      ["Negative cycle", "A closed route whose total cost is negative."],
    ],
    floyd,
    p(
      "How far apart is the network?",
      "n, edges",
      "A directed graph with nonnegative integer weights.",
      "Return its diameter: the largest shortest-path cost over every ordered pair. Return -1 if any pair is unreachable, and 0 for no nodes.",
      using(
        floyd,
        `def solve(n,edges):
    matrix=base(n,edges)
    if any(x is None for row in matrix for x in row):return -1
    return max((x for row in matrix for x in row),default=0)`
      ),
      [
        t(
          [
            2,
            [
              [0, 1, 3],
              [1, 0, 2],
            ],
          ],
          3
        ),
        t([2, [[0, 1, 1]]], -1),
        t([0, []], 0),
      ],
      "The two directional shortest costs are 3 and 2, so the diameter is 3.",
      ["Diameter uses shortest distances first, then takes their maximum.", "A missing pair violates this task’s fully reachable diameter contract."]
    ),
    p(
      "Answer travel-budget requests",
      "n, edges, requests",
      "A directed graph with nonnegative weights and requests [from,to,budget] using valid node IDs.",
      "Return a boolean per request indicating whether a route costs at most budget.",
      using(
        floyd,
        `def solve(n,edges,requests):
    distance=base(n,edges)
    return [distance[a][b] is not None and distance[a][b]<=budget for a,b,budget in requests]`
      ),
      [
        t(
          [
            3,
            [
              [0, 1, 2],
              [1, 2, 3],
            ],
            [
              [0, 2, 5],
              [0, 2, 4],
              [2, 0, 9],
            ],
          ],
          [true, false, false]
        ),
        t([0, [], []], []),
        t([1, [], [[0, 0, 0]]], [true]),
      ],
      "A route of cost 5 meets budget 5 but not budget 4; an unreachable pair never qualifies.",
      ["Preprocess once for many requests.", "Include the empty zero-cost route from a node to itself."]
    )
  ),
  unit(
    86,
    "Prim: grow a tree across a safe cut",
    [32, 17, 66],
    "Choose the cheapest edge leaving the connected set you have already built.",
    [
      "Kruskal sorts all edges and grows several components. Prim grows one connected selected set. Both rely on the same cut principle: a lightest edge crossing a suitable cut can be included in some minimum spanning tree.",
      "Begin at any node with zero entry cost. Put outgoing crossing edges in a min-heap. Repeatedly take the cheapest edge whose destination is not yet selected, add that node and edge cost, and offer its outgoing edges.",
      "Why is that safe? If an optimal tree omits the chosen crossing edge, adding it creates a cycle. That cycle contains another crossing edge no cheaper than the chosen one. Replacing that edge preserves connectivity and cannot increase total cost.",
      "Heap entries become stale as nodes join, so skip already selected destinations. If the heap empties before every node is selected, no spanning tree exists. Negative edge costs are harmless for this tree problem: there is no need to forbid them as Dijkstra does.",
    ],
    [
      [
        "Begin at node 0.",
        [
          ["Selected", "{0}"],
          ["Crossing costs", "0–1:1, 0–2:8"],
        ],
      ],
      [
        "Choose the lightest crossing edge.",
        [
          ["Selected", "{0,1}"],
          ["Total", "1"],
        ],
      ],
      ["New edge 1–2 costs 2.", [["Cheapest remaining crossing", "1–2:2"]]],
      [
        "All nodes are connected with two edges.",
        [
          ["Tree cost", "3"],
          ["Unused edge", "0–2:8"],
        ],
      ],
    ],
    "A priority queue alone does not make this Dijkstra. Prim prioritizes one crossing edge, not accumulated route distance.",
    q(
      "What quantity does Prim prioritize at its frontier?",
      ["The cost of a single edge crossing to an unselected node", "The total route cost from the start", "The degree of the destination"],
      0,
      "A spanning tree minimizes total selected edges globally through the cut argument, not the source-to-node distances."
    ),
    q(
      "Are negative edge costs allowed in a minimum spanning-tree problem?",
      ["Yes; the cut argument still applies", "No; every heap algorithm forbids them", "Only when every edge is negative"],
      0,
      "The restriction on Dijkstra’s finalized distances does not transfer to an acyclic spanning-tree edge selection."
    ),
    [
      "Each edge can add a heap entry; stale entries are popped and skipped.",
      "The lazy heap and adjacency lists may each hold O(E) entries.",
      "O((V+E) log(E+1)) time and O(V+E) space in this lazy-heap version.",
    ],
    [
      ["Cut", "A split of vertices into two sets."],
      ["Crossing edge", "An edge with one endpoint on each side of a cut."],
    ],
    prim,
    p(
      "Build a minimum spanning forest",
      "n, edges",
      "An undirected integer-weighted graph, possibly disconnected.",
      "Return the sum of minimum tree costs across all connected components, counting isolated nodes as cost 0.",
      `
import heapq
def solve(n,edges):
    graph=[[] for _ in range(n)]
    for a,b,w in edges:graph[a].append((w,b));graph[b].append((w,a))
    seen=set();total=0
    for start in range(n):
        if start in seen:continue
        heap=[(0,start)]
        while heap:
            cost,v=heapq.heappop(heap)
            if v in seen:continue
            seen.add(v);total+=cost
            for weight,w in graph[v]:
                if w not in seen:heapq.heappush(heap,(weight,w))
    return total`,
      [
        t(
          [
            4,
            [
              [0, 1, 2],
              [2, 3, -1],
            ],
          ],
          1
        ),
        t([3, []], 0),
        t([0, []], 0),
      ],
      "The two components contribute tree costs 2 and -1, totaling 1.",
      ["Disconnected input is a valid forest here, not a failure.", "Restart Prim at each still-unselected component."]
    ),
    p(
      "Connect sites with some free existing links",
      "n, edges, free_links",
      "Undirected nonnegative construction costs and pairs of nodes already linked at no additional cost.",
      "Return the minimum additional cost connecting all nodes, or -1 if impossible. Existing free links may connect previously separate regions.",
      using(
        prim,
        `def solve(n,edges,free_links):
    return base(n,edges+[[a,b,0] for a,b in free_links])`
      ),
      [
        t(
          [
            3,
            [
              [0, 1, 8],
              [1, 2, 3],
            ],
            [[0, 1]],
          ],
          3
        ),
        t([2, [], []], -1),
        t([0, [], []], 0),
      ],
      "The expensive 0–1 link is already available for free, so only cost 3 remains.",
      [
        "Existing links change connectivity and marginal cost, not just the final bill.",
        "Represent usable existing connections as zero-cost edges before choosing a spanning tree.",
      ]
    )
  ),
  unit(
    87,
    "Maximum flow: improve a feasible routing",
    [18, 66],
    "Residual edges describe both unused capacity and permission to undo earlier routing choices.",
    [
      "Shortest-path algorithms choose one route. A flow problem sends many units through a network, with capacities limiting each directed connection. Intermediate nodes must conserve flow: what enters must leave.",
      "A greedy route can block a later, better combination. The residual network fixes this by storing unused forward capacity and a reverse capacity equal to flow that can be undone. A reverse step is an accounting operation that reroutes earlier flow, not a new physical pipe.",
      "Find a residual source-to-sink path using BFS. Its smallest residual capacity is the amount you may add. Decrease each forward residual entry and increase its reverse entry, preserving capacity limits and conservation. Repeat until no residual path exists.",
      "At that point, nodes reachable from the source form a cut whose outgoing capacity equals the achieved flow. No flow can exceed any cut capacity, so the equality certifies optimality. BFS shortest augmenting paths give Edmonds–Karp a polynomial bound; arbitrary path choices have different runtime guarantees.",
    ],
    [
      [
        "Inspect the network capacities.",
        [
          ["Source outgoing", "0→1:3, 0→2:2"],
          ["Sink incoming", "1→3:2, 2→3:3"],
          ["Cross edge", "1→2:1"],
        ],
      ],
      [
        "Send two units along 0→1→3.",
        [
          ["Sent flow", "2"],
          ["Reverse permissions", "1→0 and 3→1 each gain 2"],
        ],
      ],
      ["Send two along 0→2→3 and one along 0→1→2→3.", [["Total flow", "5"]]],
      [
        "The source cut has capacity 3+2.",
        [
          ["Upper bound", "5"],
          ["Achieved", "5 → optimal"],
        ],
      ],
    ],
    "Ignoring reverse residual edges can trap the algorithm in an early routing choice. Source and sink must be distinct in this contract.",
    q(
      "What does a reverse residual edge allow an augmenting path to do?",
      ["Undo and reroute some previously assigned flow", "Create extra original pipe capacity for free", "Ignore conservation at intermediate nodes"],
      0,
      "The reverse capacity records flow already sent that may be cancelled as part of a different feasible routing."
    ),
    q(
      "Why does a cut whose capacity equals achieved flow certify optimality?",
      [
        "Every feasible flow is bounded by every cut capacity",
        "The cut lists the shortest individual path",
        "Equal capacity means every graph edge is full",
      ],
      0,
      "The feasible flow is a lower bound on the optimum and the cut capacity is an upper bound; equality closes the gap."
    ),
    [
      "BFS finds shortest augmenting paths. This teaching implementation scans a dense residual matrix during BFS.",
      "The residual matrix uses V² cells, including reverse capacities.",
      "O(V² + V³E) safe Edmonds–Karp bound for this matrix-scanning implementation; O(V²) space, plus input edges.",
    ],
    [
      ["Residual capacity", "Additional flow allowed in a direction, including cancellations."],
      ["Cut certificate", "A source/sink separation whose capacity bounds every feasible flow."],
    ],
    maxflow,
    p(
      "Return the source side of a minimum cut",
      "n, edges, source, sink",
      "A capacitated directed graph with n >= 2 and distinct valid endpoints.",
      "After Edmonds–Karp finishes, return the sorted nodes reachable from source through positive residual capacity. This is the inclusion-minimal source side among minimum cuts.",
      flowPrelude +
        `
def solve(n,edges,source,sink):
    total,residual=flow(n,edges,source,sink)
    seen={source};stack=[source]
    while stack:
        v=stack.pop()
        for other in range(n):
            if residual[v][other]>0 and other not in seen:seen.add(other);stack.append(other)
    return sorted(seen)`,
      [
        t([2, [[0, 1, 3]], 0, 1], [0]),
        t(
          [
            3,
            [
              [0, 1, 5],
              [1, 2, 2],
            ],
            0,
            2,
          ],
          [0, 1]
        ),
        t([2, [], 0, 1], [0]),
      ],
      "All 3 units fill the only pipe from source 0 to sink 1. Its forward residual capacity becomes 0, so only source 0 remains reachable; return [0].",
      ["Traverse the final residual graph, not the original graph.", "A reachable sink would mean augmentation was not finished."]
    ),
    p(
      "Assign jobs under worker quotas",
      "quotas, job_count, allowed",
      "Nonnegative worker capacities, a nonnegative number of unit jobs, and allowed [worker,job] pairs. Each job may be assigned at most once.",
      "Return the maximum number of jobs assignable while respecting every worker quota.",
      flowPrelude +
        `
def solve(quotas,job_count,allowed):
    workers=len(quotas);source=workers+job_count;sink=source+1
    edges=[[source,w,quota] for w,quota in enumerate(quotas)]
    edges += [[w,workers+j,1] for w,j in set(map(tuple,allowed))]
    edges += [[workers+j,sink,1] for j in range(job_count)]
    return flow(sink+1,edges,source,sink)[0]`,
      [
        t(
          [
            [2, 1],
            3,
            [
              [0, 0],
              [0, 1],
              [1, 1],
              [1, 2],
            ],
          ],
          3
        ),
        t([[], 2, []], 0),
        t([[0], 1, [[0, 0]]], 0),
      ],
      "Worker 0 can take jobs 0 and 1; worker 1 can take job 2, filling all three jobs.",
      [
        "Create a source-to-worker quota edge and a job-to-sink unit-capacity edge.",
        "Deduplicate allowed pairs so repeated eligibility rows do not create extra meaning.",
      ]
    )
  ),
  unit(
    88,
    "Bipartite matching: move an old choice to free a new one",
    [63, 87],
    "A blocked pair may become possible after an alternating path reroutes several earlier pairs.",
    [
      "A bipartite assignment links one left item to one right item, with each used at most once. Choosing any available neighbor can get stuck even when a larger assignment exists. Earlier choices must be allowed to move.",
      "When a right node is occupied, ask whether its current left owner can move to another right node. This creates an alternating sequence of unused and used pairing edges. If it reaches a free right node, flipping the sequence adds one pair overall.",
      "For allowed pairs 0→0, 0→1, and 1→0, an initial 0→0 choice looks blocking. Move 0 to right 1, then use right 0 for left 1. A fresh visited-right set per search prevents cycling through the same attempted reroutes.",
      "The augmenting-path theorem says a matching is maximum exactly when no augmenting path exists. This specialized search is also a unit-capacity flow method. A maximum size does not determine one unique pair list; if an application needs a canonical witness, that tie rule requires extra work.",
    ],
    [
      [
        "Initial choice uses the first available pair.",
        [
          ["Pairs", "0→0"],
          ["Unmatched left", "1"],
        ],
      ],
      ["Left 1 wants occupied right 0.", [["Current owner", "left 0"]]],
      ["Move that owner to its alternative right 1.", [["Rerouted pair", "0→1"]]],
      [
        "Right 0 is now available for left 1.",
        [
          ["Final pairs", "0→1, 1→0"],
          ["Size", "2"],
        ],
      ],
    ],
    "Never reuse one right endpoint for two left owners. Reset search-local visited state between augmentation attempts.",
    q(
      "Why can a greedy first-available pairing miss the maximum number of pairs?",
      [
        "An earlier pair may need rerouting along an alternating path",
        "Every left node has the same neighbors",
        "Any maximal matching is automatically maximum",
      ],
      0,
      "A matching with no immediately free direct choice may still admit a longer augmenting reroute."
    ),
    q(
      "What changes when an augmenting path is flipped?",
      ["The number of matched pairs rises by one", "Every existing pair is discarded", "One right node gains two owners"],
      0,
      "An augmenting path starts and ends free and alternates edges, so replacing used edges with unused ones adds exactly one pair."
    ),
    [
      "For each left node, search through eligible edges to find one augmentation.",
      "Store eligibility lists, one owner per right endpoint, and a search-local visited set.",
      "O(L(E+1)) time and O(L+R+E) storage in this basic augmenting-path implementation.",
    ],
    [
      ["Alternating path", "A path alternating unmatched and currently matched edges."],
      ["Maximum versus maximal", "Largest possible size versus merely no direct edge that can be added."],
    ],
    matching,
    p(
      "A canonical pairing witness",
      "left_count, right_count, edges",
      "A bipartite graph with at most 6 nodes on each side.",
      "Return a maximum pairing as sorted [left,right] pairs. Among maximum pair lists, choose the lexicographically smallest. Exhaustive search is allowed at these limits.",
      `
def solve(left_count,right_count,edges):
    graph=[set() for _ in range(left_count)]
    for a,b in edges:graph[a].add(b)
    best=[]
    def visit(a,used,pairs):
        nonlocal best
        if a==left_count:
            if len(pairs)>len(best) or len(pairs)==len(best) and pairs<best:best=list(pairs)
            return
        visit(a+1,used,pairs)
        for b in sorted(graph[a]):
            if b not in used:
                used.add(b);pairs.append([a,b]);visit(a+1,used,pairs);pairs.pop();used.remove(b)
    visit(0,set(),[])
    return best`,
      [
        t(
          [
            2,
            2,
            [
              [0, 0],
              [0, 1],
              [1, 0],
            ],
          ],
          [
            [0, 1],
            [1, 0],
          ]
        ),
        t(
          [
            2,
            1,
            [
              [0, 0],
              [1, 0],
            ],
          ],
          [[0, 0]]
        ),
        t([0, 0, []], []),
      ],
      "Maximum size is primary; lexicographic comparison only resolves ties between equally large witnesses.",
      [
        "A normal augmenting-path result need not be lexicographically minimal.",
        "Enumerate small witnesses and compare by size first, then pair-list order.",
      ]
    ),
    p(
      "Which participants can be absent without reducing capacity?",
      "left_count, right_count, edges",
      "A bipartite graph; removing a left participant deletes all its eligibility edges.",
      "Return sorted left IDs whose individual removal leaves the maximum matching size unchanged.",
      using(
        matching,
        `def solve(left_count,right_count,edges):
    maximum=base(left_count,right_count,edges)
    return [a for a in range(left_count) if base(left_count,right_count,[[x,y] for x,y in edges if x!=a])==maximum]`
      ),
      [
        t(
          [
            2,
            1,
            [
              [0, 0],
              [1, 0],
            ],
          ],
          [0, 1]
        ),
        t(
          [
            2,
            2,
            [
              [0, 0],
              [1, 1],
            ],
          ],
          []
        ),
        t([0, 0, []], []),
      ],
      "Either of two interchangeable participants can cover the single slot, so either may be absent without lowering the best size.",
      [
        "Recompute each hypothetical failure independently from the original eligibility graph.",
        "This asks about preserving optimal size, not preserving the same exact pair list.",
      ]
    )
  ),
];
