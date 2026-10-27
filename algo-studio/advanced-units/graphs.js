import { unit, problem as p, t, q, using } from "./unit.js?v=20261027-course2";
const cycle = p(
  "Detect a directed dependency loop",
  "n, edges",
  "Nodes 0 through n-1 and directed edges [from,to]; self-loops and repeated edges are allowed.",
  "Return whether any directed cycle exists, checking every component with unvisited/active/finished states.",
  `
def solve(n,edges):
    graph=[[] for _ in range(n)]
    for a,b in edges:graph[a].append(b)
    color=[0]*n
    def visit(v):
        color[v]=1
        for other in graph[v]:
            if color[other]==1:return True
            if color[other]==0 and visit(other):return True
        color[v]=2
        return False
    return any(color[v]==0 and visit(v) for v in range(n))`,
  [
    t(
      [
        3,
        [
          [0, 1],
          [1, 2],
          [2, 1],
        ],
      ],
      true
    ),
    t(
      [
        3,
        [
          [0, 1],
          [0, 2],
          [1, 2],
        ],
      ],
      false
    ),
    t([0, []], false),
  ],
  "An edge back to active node 1 closes a directed loop; an edge to a finished node alone does not.",
  [
    "A single seen flag cannot distinguish a back edge from a harmless shared destination.",
    "Only an edge into the current active DFS path proves a directed cycle.",
  ]
);
const scc = p(
  "Group mutually reachable nodes",
  "n, edges",
  "A directed graph on nodes 0 through n-1.",
  "Return strongly connected components, with each component sorted and the component lists sorted lexicographically. Include isolated nodes.",
  `
def solve(n,edges):
    graph=[[] for _ in range(n)]
    reverse=[[] for _ in range(n)]
    for a,b in edges:graph[a].append(b);reverse[b].append(a)
    seen=set();order=[]
    def finish(v):
        seen.add(v)
        for w in graph[v]:
            if w not in seen:finish(w)
        order.append(v)
    for v in range(n):
        if v not in seen:finish(v)
    seen.clear();groups=[]
    def collect(v,group):
        seen.add(v);group.append(v)
        for w in reverse[v]:
            if w not in seen:collect(w,group)
    for v in reversed(order):
        if v not in seen:
            group=[];collect(v,group);groups.append(sorted(group))
    return sorted(groups)`,
  [
    t(
      [
        4,
        [
          [0, 1],
          [1, 0],
          [1, 2],
          [2, 3],
          [3, 2],
        ],
      ],
      [
        [0, 1],
        [2, 3],
      ]
    ),
    t([2, []], [[0], [1]]),
    t([0, []], []),
  ],
  "0 and 1 can reach each other; 2 and 3 can too. The one-way connection between pairs does not merge them.",
  ["Record finishing order on the original graph.", "Process reverse edges in decreasing finish order to collect one SCC at a time."]
);
const bridges = p(
  "Find edges whose loss splits a component",
  "n, edges",
  "An undirected multigraph on 0 through n-1; edge positions are unique IDs, including parallel edges and self-loops.",
  "Return sorted edge IDs whose individual removal increases the number of connected components. Use discovery times and low links.",
  `
def solve(n,edges):
    graph=[[] for _ in range(n)]
    for i,(a,b) in enumerate(edges):graph[a].append((b,i));graph[b].append((a,i))
    entered=[-1]*n;low=[0]*n;clock=0;answer=[]
    def visit(v,parent_edge):
        nonlocal clock
        entered[v]=low[v]=clock;clock+=1
        for w,e in graph[v]:
            if e==parent_edge:continue
            if entered[w]<0:
                visit(w,e);low[v]=min(low[v],low[w])
                if low[w]>entered[v]:answer.append(e)
            else:low[v]=min(low[v],entered[w])
    for v in range(n):
        if entered[v]<0:visit(v,-1)
    return sorted(answer)`,
  [
    t(
      [
        4,
        [
          [0, 1],
          [1, 2],
          [2, 0],
          [2, 3],
        ],
      ],
      [3]
    ),
    t(
      [
        2,
        [
          [0, 1],
          [0, 1],
        ],
      ],
      []
    ),
    t([0, []], []),
  ],
  "The triangle has alternate routes; only edge ID 3 to node 3 has no bypass.",
  [
    "low[child] is the earliest discovery reachable from that DFS subtree using tree edges and at most one back edge.",
    "Ignore only the exact parent edge ID; another parallel edge is a real bypass.",
  ]
);
const articulation = p(
  "Find single points of failure",
  "n, edges",
  "An undirected multigraph on nodes 0 through n-1.",
  "Return sorted node IDs whose removal, along with incident edges, increases the component count among the remaining nodes.",
  `
def solve(n,edges):
    graph=[[] for _ in range(n)]
    for e,(a,b) in enumerate(edges):graph[a].append((b,e));graph[b].append((a,e))
    entered=[-1]*n;low=[0]*n;clock=0;answer=set()
    def visit(v,parent_edge):
        nonlocal clock
        entered[v]=low[v]=clock;clock+=1;children=0
        for w,e in graph[v]:
            if e==parent_edge:continue
            if entered[w]<0:
                children+=1;visit(w,e);low[v]=min(low[v],low[w])
                if parent_edge!=-1 and low[w]>=entered[v]:answer.add(v)
            else:low[v]=min(low[v],entered[w])
        if parent_edge==-1 and children>1:answer.add(v)
    for v in range(n):
        if entered[v]<0:visit(v,-1)
    return sorted(answer)`,
  [
    t(
      [
        4,
        [
          [0, 1],
          [1, 2],
          [1, 3],
        ],
      ],
      [1]
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
    t([1, []], []),
  ],
  "Removing node 1 disconnects its three neighbors; removing a leaf does not create additional components.",
  [
    "The DFS root has no parent side, so it needs its own rule.",
    "A non-root separates a child if that child cannot bypass it to an earlier ancestor; equality still separates vertices.",
  ]
);
const dag = p(
  "Longest routes in an acyclic network",
  "n, edges, start",
  "n >= 1, weighted directed edges [from,to,weight] with integer weights, and a valid start node.",
  "Return longest path totals from start, using None for unreachable nodes. Return [] if any directed cycle exists. Empty paths give start distance 0.",
  `
from collections import deque
def solve(n,edges,start):
    graph=[[] for _ in range(n)];degree=[0]*n
    for a,b,w in edges:graph[a].append((b,w));degree[b]+=1
    queue=deque(v for v in range(n) if degree[v]==0)
    distance=[None]*n;distance[start]=0;processed=0
    while queue:
        v=queue.popleft();processed+=1
        for other,weight in graph[v]:
            if distance[v] is not None:
                candidate=distance[v]+weight
                if distance[other] is None or candidate>distance[other]:distance[other]=candidate
            degree[other]-=1
            if degree[other]==0:queue.append(other)
    return distance if processed==n else []`,
  [
    t(
      [
        4,
        [
          [0, 1, 2],
          [0, 2, 1],
          [1, 2, 3],
        ],
        0,
      ],
      [0, 2, 5, null]
    ),
    t([1, [], 0], [0]),
    t(
      [
        2,
        [
          [0, 1, 1],
          [1, 0, 1],
        ],
        0,
      ],
      []
    ),
  ],
  "The two-edge route to 2 scores 5, exceeding the direct score 1; node 3 is unreachable.",
  [
    "A DAG permits negative edges because every dependency is processed before its consumers.",
    "Initialize unreachable distances as None, not 0, so negative reachable answers remain meaningful.",
  ]
);
const removalCounts = `
def solve(n,edges):
    graph=[[] for _ in range(n)]
    for a,b in edges:graph[a].append(b);graph[b].append(a)
    result=[]
    for removed in range(n):
        seen={removed};count=0
        for start in range(n):
            if start in seen:continue
            count+=1;stack=[start];seen.add(start)
            while stack:
                for other in graph[stack.pop()]:
                    if other not in seen:seen.add(other);stack.append(other)
        result.append(count)
    return result`;
export const graphUnits = [
  unit(
    80,
    "Directed cycles: distinguish active from finished",
    [19, 31, 66],
    "A route back into the current unfinished path proves a directed cycle; an old visit alone does not.",
    [
      "Union-find cycle detection used undirected connectivity. Directed edges carry different information: a node reached before may be a harmless shared destination rather than an ancestor on the current route.",
      "During DFS, label a node active when entering its call and finished when all outgoing edges have been handled. Active nodes form the current call path. An edge to an active node closes a directed route back to that path.",
      "An edge to a finished node does not establish a cycle, because the edge may merely join two branches into the same destination. When an unvisited node is reached, explore it recursively with the same rule. Restart from every unvisited component.",
      "If a directed cycle exists, DFS eventually follows its still-unfinished edges until one reaches an active ancestor. If no such edge is found, every call can finish. This distinguishes a proof of cycle existence from a vague claim that something was seen twice.",
    ],
    [
      [
        "Enter path 0→1→2.",
        [
          ["Active", "[0,1,2]"],
          ["Finished", "[]"],
        ],
      ],
      [
        "Inspect edge 2→1.",
        [
          ["Destination state", "active"],
          ["Cycle", "1→2→1"],
        ],
      ],
      ["Compare a different acyclic graph.", [["Edges", "0→1, 0→2, 1→2"]]],
      ["A later edge to finished node 2 is harmless.", [["Meaning", "shared destination, not a back edge"]]],
    ],
    "A single visited flag reports false cycles on shared descendants. Undirected union-find does not solve this directed task.",
    q(
      "DFS sees an edge to a finished node. What can be concluded from that edge alone?",
      ["It need not be a cycle", "It always proves a cycle", "The destination must be the current parent"],
      0,
      "Finished nodes are outside the current active path and may simply be shared descendants."
    ),
    q(
      "Why does an edge to an active node prove a directed cycle?",
      [
        "The active call path already supplies a directed route from that node to the current node",
        "Active means a node was visited on any old branch",
        "All repeated edges are cycles",
      ],
      0,
      "The current path plus the new back edge gives a closed directed route."
    ),
    [
      "Every vertex enters once and each directed edge is inspected once.",
      "Adjacency lists, state colors, and the DFS call path grow with graph size.",
      "O(V+E) time and O(V+E) extra space including graph storage.",
    ],
    [
      ["Active", "Entered but not yet finished in the current DFS path."],
      ["Back edge", "A directed edge to an active ancestor."],
    ],
    cycle,
    p(
      "Remove the fewest dependencies",
      "n, edges",
      "A directed graph with n <= 6 and at most 8 edge occurrences.",
      "Return the minimum number of edge occurrences to remove so the graph becomes acyclic. Exhaustive subset search is allowed under these small limits.",
      using(
        cycle,
        `
from itertools import combinations
def solve(n,edges):
    for count in range(len(edges)+1):
        for removed in combinations(range(len(edges)),count):
            skip=set(removed)
            if not base(n,[e for i,e in enumerate(edges) if i not in skip]):return count`
      ),
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
          1
        ),
        t([2, [[0, 1]]], 0),
        t(
          [
            1,
            [
              [0, 0],
              [0, 0],
            ],
          ],
          2
        ),
      ],
      "One edge breaks a triangle; two parallel self-loops must both be removed.",
      [
        "Detection is easy; minimizing the edits is a different optimization problem.",
        "Enumerate removals in increasing count and use the cycle detector as a feasibility check.",
      ]
    ),
    p(
      "Can this starting job reach a loop?",
      "n, edges, start",
      "A directed graph on n >= 1 nodes and a valid start.",
      "Return whether some directed cycle is reachable from start. Ignore cycles in unrelated components.",
      `
def solve(n,edges,start):
    graph=[[] for _ in range(n)]
    for a,b in edges:graph[a].append(b)
    color=[0]*n
    def visit(v):
        color[v]=1
        for other in graph[v]:
            if color[other]==1:return True
            if color[other]==0 and visit(other):return True
        color[v]=2
        return False
    return visit(start)`,
      [
        t(
          [
            4,
            [
              [0, 1],
              [2, 3],
              [3, 2],
            ],
            0,
          ],
          false
        ),
        t(
          [
            3,
            [
              [0, 1],
              [1, 2],
              [2, 1],
            ],
            0,
          ],
          true
        ),
        t([1, [], 0], false),
      ],
      "The loop 2↔3 does not affect a start at 0 when there is no path to it.",
      ["The query is about reachability from one start rather than the whole graph.", "Start only that DFS, keeping active and finished states."]
    )
  ),
  unit(
    81,
    "Strongly connected components: shrink mutual reachability",
    [80, 19],
    "Collapse exactly the nodes that can reach one another, and the remaining component graph is acyclic.",
    [
      "In a one-way road network, ordinary connected groups ignore direction. A strongly connected component, or SCC, is a maximal group in which every member can reach every other member using directed paths.",
      "Consider 0↔1, an edge 1→2, and 2↔3. There are two SCCs: {0,1} and {2,3}. The edge between groups does not provide a return route, so it cannot merge them. Replacing each SCC by one node gives a directed acyclic graph.",
      "Kosaraju’s method first records DFS finishing order. It then reverses every edge and processes nodes in decreasing finishing order. A next unassigned node lies in a source component of the relevant original remainder; reversed exploration cannot escape to another unassigned component.",
      "Collecting that reverse traversal finds exactly one mutual-reachability group. Repeat until all nodes are assigned, including isolated nodes. Sorting groups is only this exercise’s output normalization; it adds cost beyond the two linear graph passes.",
    ],
    [
      ["Two-way pairs have internal return routes.", [["Edges", "0↔1, 1→2, 2↔3"]]],
      ["Forward DFS records finishing order.", [["One possible order", "3,2,1,0"]]],
      ["Reverse edges and start with last finished 0.", [["Collected group", "[0,1]"]]],
      [
        "The next remaining traversal collects the other pair.",
        [
          ["Components", "[[0,1],[2,3]]"],
          ["Condensation", "first group → second group"],
        ],
      ],
    ],
    "A one-way path between groups does not make them one SCC. Include nodes without incident edges.",
    q(
      "Why can the graph of SCCs not contain a directed cycle of different components?",
      [
        "Such a cycle would make all those groups mutually reachable and therefore one SCC",
        "Every original graph is acyclic",
        "Reversing edges deletes every cycle",
      ],
      0,
      "A cycle among components would supply return paths joining their members, contradicting maximal separation."
    ),
    q(
      "What extra work is introduced by returning sorted SCC member lists?",
      [
        "Output normalization beyond the linear traversal passes",
        "A change to which nodes are strongly connected",
        "A need to rerun DFS for every pair",
      ],
      0,
      "Sorting fixes a deterministic representation of the same partition but can add O(V log V) work."
    ),
    [
      "Two DFS passes and one reversal inspect each node and edge, then output groups are sorted.",
      "Both edge directions, visited state, finishing order, and components need graph-sized storage.",
      "O(V+E+V log V) time including normalization, O(V+E) extra space.",
    ],
    [
      ["SCC", "A maximal set of mutually reachable directed nodes."],
      ["Condensation", "The DAG obtained by replacing every SCC with one node."],
    ],
    scc,
    p(
      "How many groups have no incoming dependency?",
      "n, edges",
      "A directed graph on n >= 0 nodes.",
      "Return the number of SCCs with no incoming edge from another SCC.",
      using(
        scc,
        `def solve(n,edges):
    groups=base(n,edges)
    owner={v:i for i,g in enumerate(groups) for v in g}
    incoming=set()
    for a,b in edges:
        if owner[a]!=owner[b]:incoming.add(owner[b])
    return len(groups)-len(incoming)`
      ),
      [
        t(
          [
            4,
            [
              [0, 1],
              [1, 0],
              [1, 2],
              [2, 3],
              [3, 2],
            ],
          ],
          1
        ),
        t([2, []], 2),
        t([0, []], 0),
      ],
      "Only the first two-way pair has no incoming connection from another group.",
      ["Count components, not individual vertices.", "Ignore edges staying within one component."]
    ),
    p(
      "Connect all one-way groups",
      "n, edges",
      "A directed graph, possibly empty. New directed edges may be added between any nodes.",
      "Return the minimum number of added edges needed to make the graph strongly connected. Return 0 when it already has at most one SCC.",
      using(
        scc,
        `def solve(n,edges):
    groups=base(n,edges)
    if len(groups)<=1:return 0
    owner={v:i for i,g in enumerate(groups) for v in g}
    incoming=set();outgoing=set()
    for a,b in edges:
        if owner[a]!=owner[b]:outgoing.add(owner[a]);incoming.add(owner[b])
    return max(len(groups)-len(incoming),len(groups)-len(outgoing))`
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
          1
        ),
        t([3, []], 3),
        t([0, []], 0),
      ],
      "A directed chain needs one edge from its final node back to its first. Three isolated nodes need a directed cycle of three added edges.",
      [
        "Every source SCC needs a new incoming edge; every sink needs a new outgoing edge.",
        "For a condensation DAG with more than one node, the minimum is max(source_count,sink_count); constructing actual added edges needs further pairing logic.",
      ]
    )
  ),
  unit(
    82,
    "Bridges: find connections with no bypass",
    [80, 28, 66],
    "A child branch disconnects only when it cannot reach the parent or an earlier ancestor another way.",
    [
      "To find fragile roads, you could remove each road and rerun connectivity. That is a correct baseline, but repeats graph exploration for every edge. DFS can summarize whether an alternate route exists while exploring once.",
      "Give each node an entry time. For a DFS subtree, low is the earliest entry time reachable by descending tree edges and then using at most one non-parent back edge. A child can pass its low value up to its parent.",
      "The tree edge parent→child is a bridge exactly when low[child] > entry[parent]. If the child can reach the parent or an earlier ancestor without that edge, the connection has a bypass. The strict inequality matters: reaching the parent itself is already sufficient to save an edge.",
      "In a multigraph, two parallel roads can bypass each other. Track edge IDs and ignore only the exact road used to enter a node, rather than ignoring every edge to its parent vertex. Self-loops do not become bridges. Restart DFS in every component so isolated regions are included.",
    ],
    [
      ["A triangle has one tail road.", [["Edges by ID", "0:0–1, 1:1–2, 2:2–0, 3:2–3"]]],
      [
        "Back edge 2–0 lowers the triangle subtree summary.",
        [
          ["entry[0]", "0"],
          ["low[2]", "0"],
        ],
      ],
      [
        "The tail at 3 has no back route.",
        [
          ["entry[2]", "2"],
          ["low[3]", "3 > 2"],
        ],
      ],
      ["Only the tail road is a bridge.", [["Returned IDs", "[3]"]]],
    ],
    "Skip a parent edge by its ID, not by endpoint. Parallel edges invalidate the endpoint-only shortcut.",
    q(
      "Two nodes have two parallel undirected edges. Is either edge individually a bridge?",
      ["No; the other edge still connects the nodes", "Yes; both endpoints are the same", "Only the first input edge is a bridge"],
      0,
      "Removing one leaves the other as a bypass, so the component count does not rise."
    ),
    q(
      "Why does low[child] equal to entry[parent] mean the edge is not a bridge?",
      [
        "A different route reaches the parent without using that tree edge",
        "Equality proves the child is isolated",
        "Entry times must never be equal to low values",
      ],
      0,
      "An alternate path back to the parent already preserves connectivity after removing the parent-child tree edge."
    ),
    [
      "One DFS inspects each edge occurrence twice; sorting returned IDs adds normalization work.",
      "Store adjacency entries with edge IDs plus entry/low arrays and recursion state.",
      "O(V+E+E log E) time including sorted output, O(V+E) storage.",
    ],
    [
      ["Low link", "The earliest ancestor discovery a DFS subtree can reach using a back edge."],
      ["Bridge", "An edge whose deletion increases component count."],
    ],
    bridges,
    p(
      "Groups after removing all fragile roads",
      "n, edges",
      "An undirected multigraph, including isolated nodes.",
      "Remove every bridge, then return the remaining connected components with sorted members and sorted component lists.",
      using(
        bridges,
        `def solve(n,edges):
    removed=set(base(n,edges))
    graph=[[] for _ in range(n)]
    for i,(a,b) in enumerate(edges):
        if i not in removed:graph[a].append(b);graph[b].append(a)
    seen=set();result=[]
    for start in range(n):
        if start in seen:continue
        group=[];stack=[start];seen.add(start)
        while stack:
            v=stack.pop();group.append(v)
            for w in graph[v]:
                if w not in seen:seen.add(w);stack.append(w)
        result.append(sorted(group))
    return sorted(result)`
      ),
      [
        t(
          [
            4,
            [
              [0, 1],
              [1, 2],
              [2, 0],
              [2, 3],
            ],
          ],
          [[0, 1, 2], [3]]
        ),
        t([2, []], [[0], [1]]),
        t([0, []], []),
      ],
      "The triangle remains one group; the tail node becomes its own group.",
      ["Compute bridge IDs once, then traverse while skipping them.", "A bridge-free isolated node still contributes a component."]
    ),
    p(
      "Plan for individual road failures",
      "n, edges, failures",
      "An undirected multigraph and a list of valid edge IDs to remove one at a time from the original graph.",
      "Return the component count after each individual removal. Each query starts from the original graph, not the previous query.",
      using(
        bridges,
        `def solve(n,edges,failures):
    fragile=set(base(n,edges))
    parent=list(range(n))
    def find(v):
        while parent[v]!=v:v=parent[v]
        return v
    components=n
    for a,b in edges:
        a,b=find(a),find(b)
        if a!=b:parent[a]=b;components-=1
    return [components+int(edge in fragile) for edge in failures]`
      ),
      [
        t(
          [
            4,
            [
              [0, 1],
              [1, 2],
              [2, 0],
              [2, 3],
            ],
            [0, 3],
          ],
          [1, 2]
        ),
        t([2, [], []], []),
        t(
          [
            2,
            [
              [0, 1],
              [0, 1],
            ],
            [0, 1],
          ],
          [1, 1]
        ),
      ],
      "Failing a triangle edge keeps one component; failing the tail bridge creates two.",
      [
        "A single edge removal can increase the count by only one.",
        "Combine the original component count with bridge membership; do not accumulate failures.",
      ]
    )
  ),
  unit(
    83,
    "Articulation points: when a place is the bottleneck",
    [82],
    "Removing a vertex removes all its incident connections, so its rule differs from removing one edge.",
    [
      "A road may have a bypass while a town remains the only meeting point between regions. An articulation point is a vertex whose removal increases the number of components among the remaining vertices. This is a different failure model from deleting one road.",
      "Reuse entry times and low links. For a non-root node v, a child subtree is separated by removing v when low[child] >= entry[v]. Equality only reaches v, which is now being removed, so it no longer provides a bypass.",
      "The DFS root has no parent-side component. It is an articulation point only when it has more than one DFS child. One DFS child already contains all reachable nodes in that component, regardless of how many ordinary graph neighbors the root has.",
      "Apply that root test separately in every connected component. Deleting an isolated node decreases the component count; it does not make that node an articulation point. Keeping edge IDs also preserves the low-link logic for parallel roads.",
    ],
    [
      ["A star uses town 1 as its hub.", [["Edges", "0–1, 1–2, 1–3"]]],
      ["Removing leaf 0 leaves one connected group.", [["Remaining", "{1,2,3}"]]],
      ["Removing hub 1 removes every incident road.", [["Remaining groups", "{0}, {2}, {3}"]]],
      ["The original count was one, so only 1 is a bottleneck.", [["Answer", "[1]"]]],
    ],
    "The vertex condition uses >=, while bridges use >. A DFS root also needs its separate child-count rule.",
    q(
      "Why does equality low[child] == entry[v] still make a non-root v a separating vertex?",
      [
        "The alternate route reaches v itself, which the failure removes",
        "Equality always means a bridge as well",
        "The child subtree contains no vertices",
      ],
      0,
      "The route that saved an edge does not save a removed endpoint; a bypass must reach a strict ancestor to survive deleting v."
    ),
    q(
      "Which count identifies an articulation point at a DFS root?",
      ["More than one DFS child", "More than one adjacency-list entry", "Any one child at all"],
      0,
      "Different DFS child subtrees cannot connect without the root; ordinary neighbors can lie inside the same child subtree."
    ),
    [
      "The low-link traversal is linear, followed by sorting the answer.",
      "The graph, discovery arrays, and recursion path use graph-sized storage.",
      "O(V+E+V log V) time including normalization; O(V+E) space.",
    ],
    [
      ["Articulation point", "A vertex whose removal increases component count."],
      ["DFS child", "A node first discovered directly by a particular DFS call."],
    ],
    articulation,
    p(
      "Count the pieces after every vertex failure",
      "n, edges",
      "An undirected multigraph. A removed vertex is excluded from all remaining components.",
      "Return n component counts, one for removing each vertex individually. Repeated traversal is allowed for this diagnostic version.",
      removalCounts,
      [
        t(
          [
            4,
            [
              [0, 1],
              [1, 2],
              [1, 3],
            ],
          ],
          [1, 3, 1, 1]
        ),
        t([1, []], [0]),
        t([0, []], []),
      ],
      "Removing the hub yields three components; removing any leaf leaves one.",
      [
        "A skipped vertex must not be counted as an isolated component.",
        "Use this slower diagnostic as a small-input check on a low-link implementation.",
      ]
    ),
    p(
      "Choose the least disruptive shutdown",
      "n, edges",
      "An undirected multigraph with n >= 1.",
      "Return the smallest node ID whose individual removal leaves the fewest connected components.",
      using(
        { solution: removalCounts },
        `def solve(n,edges):
    counts=base(n,edges)
    return min(range(n),key=lambda v:(counts[v],v))`
      ),
      [
        t(
          [
            4,
            [
              [0, 1],
              [1, 2],
              [1, 3],
            ],
          ],
          0
        ),
        t([1, []], 0),
        t([2, []], 0),
      ],
      "A leaf shutdown leaves the star connected. Leaves tie, so choose ID 0.",
      [
        "The goal minimizes the damage rather than finding the worst bottleneck.",
        "Define the tie rule explicitly when several choices have the same result.",
      ]
    )
  ),
  unit(
    84,
    "DAG dynamic programming: dependencies define the order",
    [80, 31, 21],
    "When the dependency graph is acyclic, process every prerequisite before using its answer.",
    [
      "Longest paths are difficult in arbitrary graphs when routes may not repeat vertices. A DAG removes the possibility of returning to a previous vertex, so each path is built from already completed predecessor paths.",
      "Take a topological order. For each reachable vertex, extend its best known score along every outgoing edge, keeping the maximum at each destination. All incoming predecessors of a node appear before it, so its answer is complete when it is processed.",
      "Negative edges are safe here: a negative candidate can still be the only route to a node. Use an explicit unreachable marker rather than initializing every distance to 0. Otherwise you would invent zero-cost paths that do not exist.",
      "If topological processing cannot finish all vertices, the input violates the DAG contract and this exercise returns an explicit failure. The broader lesson is to choose a state and a valid dependency order together; a correct recurrence read in the wrong order can still produce wrong answers.",
    ],
    [
      [
        "From 0, compare a direct and an indirect route.",
        [
          ["Edges", "0→1:2, 0→2:1, 1→2:3"],
          ["Initial", "[0,None,None,None]"],
        ],
      ],
      ["Process 0 before its successors.", [["Known scores", "[0,2,1,None]"]]],
      [
        "Process 1 and improve 2.",
        [
          ["Candidate", "2+3 = 5"],
          ["Scores", "[0,2,5,None]"],
        ],
      ],
      ["Node 3 stays unreachable.", [["Answer", "[0,2,5,None]"]]],
    ],
    "Do not use 0 as the unreachable sentinel when edge weights can be negative. Reject cycles instead of pretending a partial order is complete.",
    q(
      "Why can DAG longest-path updates handle negative edge weights?",
      [
        "Topological order finalizes all predecessors before their successors",
        "Negative weights become positive after sorting",
        "All DAG paths have equal length",
      ],
      0,
      "There are no cyclic dependencies, so predecessor completion supplies the needed invariant without Dijkstra’s nonnegative-edge argument."
    ),
    q(
      "What does a topological pass processing fewer than n nodes establish?",
      [
        "A directed cycle prevents a complete dependency order",
        "Every remaining node is unreachable from the chosen start",
        "The longest path must have value zero",
      ],
      0,
      "A cycle can block topological processing even in a component unrelated to the chosen start, which this contract still rejects."
    ),
    [
      "Build indegrees, process every node once, and relax every edge once.",
      "The adjacency lists, queue, indegrees, and distances grow with the graph.",
      "O(V+E) time and O(V+E) space.",
    ],
    [
      ["Dependency order", "An order in which every state is ready before consumers read it."],
      ["Relaxation", "Updating a candidate answer through one edge."],
    ],
    dag,
    p(
      "Count directed routes in a DAG",
      "n, edges, start, goal",
      "A directed graph on n >= 1 nodes; parallel edges count as distinct route choices.",
      "Return the number of directed edge-paths from start to goal, including one empty path when they match. Return -1 if any directed cycle exists.",
      `
from collections import deque
def solve(n,edges,start,goal):
    graph=[[] for _ in range(n)];degree=[0]*n
    for a,b in edges:graph[a].append(b);degree[b]+=1
    queue=deque(v for v in range(n) if degree[v]==0)
    ways=[0]*n;ways[start]=1;count=0
    while queue:
        v=queue.popleft();count+=1
        for w in graph[v]:
            ways[w]+=ways[v];degree[w]-=1
            if degree[w]==0:queue.append(w)
    return ways[goal] if count==n else -1`,
      [
        t(
          [
            3,
            [
              [0, 1],
              [0, 2],
              [1, 2],
            ],
            0,
            2,
          ],
          2
        ),
        t([1, [], 0, 0], 1),
        t([1, [[0, 0]], 0, 0], -1),
      ],
      "Routes 0→2 and 0→1→2 are distinct; no cyclic repetition is allowed.",
      ["Replace max with addition and define what counts as a distinct route.", "The initial state gives one empty route at the start."]
    ),
    p(
      "When can all the work finish?",
      "durations, edges",
      "Nonnegative task durations and prerequisite edges [before,after] over their indices. Unlimited parallel workers are available.",
      "Return the earliest completion time of all tasks, or -1 for a dependency cycle. An empty task list returns 0.",
      `
from collections import deque
def solve(durations,edges):
    n=len(durations);graph=[[] for _ in range(n)];degree=[0]*n
    for a,b in edges:graph[a].append(b);degree[b]+=1
    queue=deque(v for v in range(n) if degree[v]==0)
    finish=list(durations);count=0
    while queue:
        v=queue.popleft();count+=1
        for w in graph[v]:
            finish[w]=max(finish[w],finish[v]+durations[w]);degree[w]-=1
            if degree[w]==0:queue.append(w)
    return max(finish,default=0) if count==n else -1`,
      [
        t(
          [
            [3, 2, 4],
            [
              [0, 2],
              [1, 2],
            ],
          ],
          7
        ),
        t([[], []], 0),
        t([[1], [[0, 0]]], -1),
      ],
      "Tasks 0 and 1 finish at times 3 and 2 in parallel; task 2 then takes 4 more, finishing at 7.",
      ["A task waits for its latest prerequisite, not the sum of parallel prerequisites.", "Include each task’s own duration exactly once."]
    )
  ),
];
