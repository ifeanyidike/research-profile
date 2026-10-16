const t = (args, expected) => ({ args, expected });
const n = (value, left = null, right = null) => ({ value, left, right });
const link = (...values) => values.reduceRight((next, value) => ({ value, next }), null);
function task(title, prompt, params, solution, tests, hint1, hint2) {
  return {
    title,
    task: prompt,
    starter: `def solve(${params}):\n    # Try this from a fresh editor.\n    pass`,
    solution,
    tests,
    hints: [hint1, hint2],
  };
}
// A different contract for each lesson, not another input for the same exercise.
export const checkpoints = {
  0: task(
    "Count matching readings",
    "Return how many readings equal target. Unlike the first search exercise, count every match.",
    "items, target",
    "def solve(items, target):\n    count = 0\n    for value in items:\n        if value == target:\n            count += 1\n    return count",
    [t([[3, 1, 3], 3], 2), t([[], 2], 0), t([[1, 2], 4], 0), t([[0, 0], 0], 2)],
    "Keep a running count.",
    "Do not stop after the first match."
  ),
  1: task(
    "Build a running product",
    "Return the product of all integers without using math.prod. An empty list has product 1. Choose a starting product that also handles an empty list.",
    "items",
    "def solve(items):\n    product = 1\n    for value in items:\n        product *= value\n    return product",
    [t([[2, -3, 4]], -24), t([[]], 1), t([[4, 0, 9]], 0), t([[-2, -2]], 4)],
    "What starting value leaves multiplication unchanged?",
    "Use 1 rather than 0; after each item the product covers the processed prefix."
  ),
  2: task(
    "Track both extremes",
    "Return [minimum, maximum] using one scan, or [] for no values. Do not sort or call min/max.",
    "items",
    "def solve(items):\n    if not items:\n        return []\n    low = high = items[0]\n    for value in items:\n        if value < low:\n            low = value\n        if value > high:\n            high = value\n    return [low,high]",
    [t([[-4, 8, 2]], [-4, 8]), t([[]], []), t([[-8, -2]], [-8, -2]), t([[3]], [3, 3])],
    "Maintain two remembered values.",
    "Initialize both from a real item, not 0."
  ),
  3: task(
    "Two sorted shelves",
    "Return the sorted values common to two sorted lists, including each value once. Use two forward indices; no sets.",
    "a, b",
    "def solve(a, b):\n    i = j = 0\n    result = []\n    while i < len(a) and j < len(b):\n        if a[i] < b[j]:\n            i += 1\n        elif a[i] > b[j]:\n            j += 1\n        else:\n            if not result or result[-1] != a[i]:\n                result.append(a[i])\n            i += 1\n            j += 1\n    return result",
    [
      t(
        [
          [1, 2, 2, 4],
          [2, 2, 3, 4],
        ],
        [2, 4]
      ),
      t([[], [1]], []),
      t(
        [
          [-2, 0],
          [-2, 5],
        ],
        [-2]
      ),
    ],
    "Move the pointer on the smaller value.",
    "When equal, record a value only if it differs from the last result."
  ),
  4: task(
    "First busy stretch",
    "Return the first start index of a k-item window whose sum is at least target, or -1. Values may be negative. Invalid k returns -1.",
    "items, k, target",
    "def solve(items, k, target):\n    if k <= 0 or k > len(items):\n        return -1\n    total = sum(items[:k])\n    if total >= target:\n        return 0\n    for i in range(k,len(items)):\n        total += items[i] - items[i-k]\n        if total >= target:\n            return i-k+1\n    return -1",
    [t([[1, 2, 5, 1], 2, 6], 1), t([[-5, -2, -1], 2, -3], 1), t([[1], 0, 0], -1), t([[1, 1], 2, 3], -1)],
    "Build the first valid window.",
    "After each slide, its start is i-k+1."
  ),
  5: task(
    "Ranges meeting a threshold",
    "For valid inclusive queries [left,right], count how many range sums are >= target. Build prefix totals once.",
    "items, queries, target",
    "def solve(items, queries, target):\n    prefix = [0]\n    for value in items:\n        prefix.append(prefix[-1]+value)\n    count = 0\n    for left,right in queries:\n        if prefix[right+1]-prefix[left] >= target:\n            count += 1\n    return count",
    [
      t(
        [
          [2, -1, 5],
          [
            [0, 0],
            [1, 2],
            [0, 2],
          ],
          4,
        ],
        2
      ),
      t([[], [], 0], 0),
      t([[-2], [[0, 0]], -1], 0),
    ],
    "Subtract prefix totals for each range.",
    "Each qualifying query adds one to the result."
  ),
  6: task(
    "Exact lookup with repeated values",
    "For sorted integers with duplicates, return True if target occurs, else False. Use binary search, not a scan.",
    "items, target",
    "def solve(items, target):\n    left,right = 0,len(items)-1\n    while left <= right:\n        mid = (left+right)//2\n        if items[mid] == target:\n            return True\n        if items[mid] < target:\n            left = mid+1\n        else:\n            right = mid-1\n    return False",
    [t([[1, 2, 2, 5], 2], true), t([[], 1], false), t([[1, 2], 3], false), t([[-3, -1], -3], true)],
    "Any matching position is enough.",
    "Preserve the sorted search range and exclude a failed middle position."
  ),
  7: task(
    "Sort cards from high to low",
    "Return the integer list in descending order using insertion sort. You may change the list. Do not call a sorting function.",
    "items",
    "def solve(items):\n    for i in range(1,len(items)):\n        key = items[i]\n        j = i-1\n        while j >= 0 and items[j] < key:\n            items[j+1] = items[j]\n            j -= 1\n        items[j+1] = key\n    return items",
    [t([[2, 5, 1, 5]], [5, 5, 2, 1]), t([[]], []), t([[-2, 0, -5]], [0, -2, -5])],
    "The processed prefix must now be descending.",
    "Shift smaller values right to make room for the key."
  ),
  8: task(
    "Merge without repeated entries",
    "Merge two sorted integer lists into a sorted list containing each distinct value once. Do not use a set or sort again.",
    "a, b",
    "def solve(a, b):\n    i = j = 0\n    result = []\n    while i < len(a) or j < len(b):\n        if j == len(b) or (i < len(a) and a[i] <= b[j]):\n            value = a[i]\n            i += 1\n        else:\n            value = b[j]\n            j += 1\n        if not result or result[-1] != value:\n            result.append(value)\n    return result",
    [
      t(
        [
          [1, 1, 4],
          [1, 2, 4],
        ],
        [1, 2, 4]
      ),
      t([[], [2, 2]], [2]),
      t(
        [
          [-3, 0],
          [-2, 0],
        ],
        [-3, -2, 0]
      ),
    ],
    "Pick the smaller next unused value.",
    "Append only when the new value differs from the last output."
  ),
  9: task(
    "Check three bracket types",
    "Return whether text containing only ()[]{} has correctly nested matching brackets.",
    "text",
    'def solve(text):\n    stack = []\n    pairs = {"(": ")", "[": "]", "{": "}"}\n    for char in text:\n        if char in pairs:\n            stack.append(pairs[char])\n        elif not stack or stack.pop() != char:\n            return False\n    return not stack',
    [t(["{[()]}"], true), t(["([)]"], false), t([""], true), t(["(("], false)],
    "The newest unclosed bracket must close first.",
    "Push the expected closing character and compare each closer with the top."
  ),
  10: task(
    "A queue with a capacity",
    'Process ["add",value] and ["take"] operations with capacity >= 0. Ignore adds when full; taking empty returns None. Return taken values. Use deque.',
    "operations, capacity",
    'from collections import deque\n\ndef solve(operations, capacity):\n    queue = deque()\n    result = []\n    for op in operations:\n        if op[0] == "add":\n            if len(queue) < capacity:\n                queue.append(op[1])\n        else:\n            result.append(queue.popleft() if queue else None)\n    return result',
    [t([[["add", 1], ["add", 2], ["take"], ["take"]], 1], [1, null]), t([[["add", 3], ["take"]], 0], [null]), t([[], 2], [])],
    "Check capacity before adding.",
    "The queue still removes from the oldest end."
  ),
  11: task(
    "Read the kth linked item",
    "Return the value at zero-based index k in a linked list, or None if missing. Nodes have value/next. k >= 0. Do not convert to an array.",
    "head, k",
    'def solve(head, k):\n    node = head\n    while node is not None and k > 0:\n        node = node["next"]\n        k -= 1\n    return None if node is None else node["value"]',
    [t([link(4, 7, 9), 1], 7), t([null, 0], null), t([link(5), 2], null)],
    "Move through exactly k links if they exist.",
    "A linked list has no constant-time indexed lookup."
  ),
  12: task(
    "First word seen only once",
    "Return the first word occurring exactly once, or None. Capitalization matters. Use a frequency map and preserve input order.",
    "words",
    "def solve(words):\n    counts = {}\n    for word in words:\n        counts[word] = counts.get(word,0)+1\n    for word in words:\n        if counts[word] == 1:\n            return word\n    return None",
    [t([["tea", "milk", "tea", "rice"]], "milk"), t([[]], null), t([["a", "a"]], null), t([["A", "a"]], "A")],
    "First count all words.",
    "Scan the original list again to find the first count of one."
  ),
  13: task(
    "Can two readings make the target?",
    "Return whether two different positions sum to target. Scan once with a set; do not reuse the current item.",
    "items, target",
    "def solve(items, target):\n    seen = set()\n    for value in items:\n        if target-value in seen:\n            return True\n        seen.add(value)\n    return False",
    [t([[3, 3], 6], true), t([[3], 6], false), t([[], 0], false), t([[-2, 5], 3], true)],
    "Look for the complement before adding the current value.",
    "A duplicate value is valid only when it occurs at two positions."
  ),
  14: task(
    "Raise a number recursively",
    "Return base raised to integer exponent n >= 0 using recursion, without ** or pow. Inputs are small integers; define 0^0 as 1.",
    "base, n",
    "def solve(base, n):\n    if n == 0:\n        return 1\n    return base * solve(base,n-1)",
    [t([3, 4], 81), t([0, 0], 1), t([-2, 3], -8)],
    "The zero-exponent answer is the base case.",
    "Reduce n by one in each call."
  ),
  15: task(
    "Visit the parent first",
    "Return preorder values of a binary tree: node, then left subtree, then right subtree. Nodes have value/left/right; empty is None.",
    "root",
    'def solve(root):\n    result = []\n    def visit(node):\n        if node is None:\n            return\n        result.append(node["value"])\n        visit(node["left"])\n        visit(node["right"])\n    visit(root)\n    return result',
    [t([n(2, n(1), n(3))], [2, 1, 3]), t([null], []), t([n(1, null, n(2))], [1, 2])],
    "The current value must be recorded before either child.",
    "Use the same visiting rule recursively."
  ),
  16: task(
    "Sum a useful section of a search tree",
    "For a distinct-key BST, return the sum of values in inclusive range [low,high]. Use ordering to skip branches.",
    "root, low, high",
    'def solve(root, low, high):\n    if root is None:\n        return 0\n    value = root["value"]\n    if value < low:\n        return solve(root["right"],low,high)\n    if value > high:\n        return solve(root["left"],low,high)\n    return value + solve(root["left"],low,high) + solve(root["right"],low,high)',
    [t([n(5, n(2), n(8)), 3, 8], 13), t([null, 0, 9], 0), t([n(4), 5, 8], 0)],
    "If the root is too small, its entire left subtree is too small.",
    "Only sum both branches when the root is inside the range."
  ),
  17: task(
    "Keep the largest readings",
    "Return the k largest integers in descending order using heapq and a heap of at most k values. 0 <= k <= len(items).",
    "items, k",
    "import heapq\n\ndef solve(items, k):\n    if k == 0:\n        return []\n    heap = []\n    for value in items:\n        if len(heap) < k:\n            heapq.heappush(heap,value)\n        elif value > heap[0]:\n            heapq.heapreplace(heap,value)\n    return sorted(heap,reverse=True)",
    [t([[3, 8, 1, 8], 2], [8, 8]), t([[1], 0], []), t([[-5, -1, -3], 2], [-1, -3])],
    "Keep a min-heap of the best k values seen.",
    "Replace its minimum only when a better value arrives."
  ),
  18: task(
    "Distances to every reachable stop",
    "For a directed adjacency-map graph, return a map of all reachable node names to their shortest edge distances from start. Missing keys have no outgoing edges.",
    "graph, start",
    "from collections import deque\n\ndef solve(graph, start):\n    distances = {start:0}\n    queue = deque([start])\n    while queue:\n        node = queue.popleft()\n        for neighbor in graph.get(node,[]):\n            if neighbor not in distances:\n                distances[neighbor] = distances[node]+1\n                queue.append(neighbor)\n    return distances",
    [t([{ A: ["B", "C"], B: ["D"], C: ["D"] }, "A"], { A: 0, B: 1, C: 1, D: 2 }), t([{}, "X"], { X: 0 }), t([{ A: ["A"] }, "A"], { A: 0 })],
    "Use the distance map as the seen set too.",
    "Assign distance when enqueuing a new node."
  ),
  19: task(
    "Count separate communities",
    "Vertices 0..n-1 and undirected edges describe communities. Return the number of connected components using graph traversal, including isolated vertices.",
    "n, edges",
    "def solve(n, edges):\n    graph = [[] for _ in range(n)]\n    for a,b in edges:\n        graph[a].append(b)\n        graph[b].append(a)\n    seen = set()\n    count = 0\n    for start in range(n):\n        if start in seen:\n            continue\n        count += 1\n        seen.add(start)\n        stack = [start]\n        while stack:\n            for neighbor in graph[stack.pop()]:\n                if neighbor not in seen:\n                    seen.add(neighbor)\n                    stack.append(neighbor)\n    return count",
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
        2
      ),
      t([3, []], 3),
      t([0, []], 0),
    ],
    "Start one new traversal for every unseen vertex.",
    "One full traversal discovers one connected component."
  ),
  20: task(
    "Remove the fewest conflicting talks",
    "Return the minimum number of intervals to remove so the rest do not overlap. Endpoints may touch; each start < end.",
    "intervals",
    'def solve(intervals):\n    kept = 0\n    finish = float("-inf")\n    for start,end in sorted(intervals,key=lambda x:x[1]):\n        if start >= finish:\n            kept += 1\n            finish = end\n    return len(intervals)-kept',
    [
      t(
        [
          [
            [1, 3],
            [2, 4],
            [3, 5],
          ],
        ],
        1
      ),
      t([[]], 0),
      t(
        [
          [
            [0, 5],
            [1, 2],
            [2, 3],
          ],
        ],
        1
      ),
    ],
    "Maximize how many talks can stay.",
    "Minimum removals equals total minus maximum compatible count."
  ),
  21: task(
    "Three possible step sizes",
    "Count ways to climb n steps using moves of 1, 2, or 3. n is 0–25 and there is one empty way to climb zero. Use bottom-up DP.",
    "n",
    "def solve(n):\n    dp = [0] * (n+1)\n    dp[0] = 1\n    for i in range(1,n+1):\n        for step in (1,2,3):\n            if i >= step:\n                dp[i] += dp[i-step]\n    return dp[n]",
    [t([4], 7), t([0], 1), t([1], 1), t([3], 4)],
    "The last move now has three possibilities.",
    "Only read a smaller state when its index is nonnegative."
  ),
  22: task(
    "How many coin combinations?",
    "Return the number of unordered combinations making amount from distinct positive coin types, each reusable. amount is 0–50. Different orders of the same coins count once.",
    "coins, amount",
    "def solve(coins, amount):\n    dp = [0] * (amount+1)\n    dp[0] = 1\n    for coin in coins:\n        for total in range(coin,amount+1):\n            dp[total] += dp[total-coin]\n    return dp[amount]",
    [t([[1, 2], 4], 3), t([[], 0], 1), t([[3], 2], 0), t([[2, 3], 6], 2)],
    "Process one coin type at a time.",
    "An outer coin loop avoids counting different orders as separate combinations."
  ),
  23: task(
    "Find a route with closed stops",
    "Return a shortest unweighted directed route from start to goal while avoiding blocked node names. Return [] if start/goal is blocked or no route exists. Preserve adjacency-order ties.",
    "graph, start, goal, blocked",
    "from collections import deque\n\ndef solve(graph, start, goal, blocked):\n    blocked = set(blocked)\n    if start in blocked or goal in blocked:\n        return []\n    parents = {start:None}\n    queue = deque([start])\n    while queue:\n        node = queue.popleft()\n        if node == goal:\n            route = []\n            while node is not None:\n                route.append(node)\n                node = parents[node]\n            return route[::-1]\n        for neighbor in graph.get(node,[]):\n            if neighbor not in parents and neighbor not in blocked:\n                parents[neighbor] = node\n                queue.append(neighbor)\n    return []",
    [
      t([{ A: ["B", "C"], B: ["D"], C: ["D"] }, "A", "D", ["B"]], ["A", "C", "D"]),
      t([{}, "A", "A", []], ["A"]),
      t([{ A: ["B"] }, "A", "B", ["B"]], []),
    ],
    "Ignore blocked nodes when discovering neighbors.",
    "Keep parent links to reconstruct the route."
  ),
  24: task(
    "Count out-of-order pairs",
    "Return the number of index pairs i<j with items[i]>items[j], using merge-sort counting. Equal values do not form a pair.",
    "items",
    "def solve(items):\n    def count(values):\n        if len(values) < 2:\n            return values,0\n        mid = len(values)//2\n        left,a = count(values[:mid])\n        right,b = count(values[mid:])\n        result = []\n        i = j = 0\n        total = a+b\n        while i < len(left) and j < len(right):\n            if left[i] <= right[j]:\n                result.append(left[i])\n                i += 1\n            else:\n                result.append(right[j])\n                j += 1\n                total += len(left)-i\n        return result+left[i:]+right[j:],total\n    return count(items)[1]",
    [t([[3, 1, 2]], 2), t([[]], 0), t([[2, 2, 1]], 2), t([[4, 3, 2, 1]], 6)],
    "When a right value is smaller, it is smaller than all remaining left values.",
    "Add len(left)-i for that cross-half event."
  ),
  25: task(
    "Select without fully sorting",
    "Return the zero-based kth smallest value by recursive three-way partitioning. Input is nonempty and 0 <= k < len(items). Do not call sorting functions.",
    "items, k",
    "def solve(items, k):\n    pivot = items[len(items)//2]\n    small = [v for v in items if v < pivot]\n    equal = [v for v in items if v == pivot]\n    large = [v for v in items if v > pivot]\n    if k < len(small):\n        return solve(small,k)\n    if k < len(small)+len(equal):\n        return pivot\n    return solve(large,k-len(small)-len(equal))",
    [t([[5, 1, 3, 3], 2], 3), t([[7], 0], 7), t([[-2, 0, -5], 0], -5)],
    "Only recurse into the group containing rank k.",
    "Adjust k by the sizes of groups skipped on the left."
  ),
  26: task(
    "Choose exactly k items",
    "Return all size-k combinations of distinct items as sorted lists in sorted outer order. Sort each combination before returning. Input length <= 10; k >= 0.",
    "items, k",
    "def solve(items, k):\n    result = []\n    path = []\n    def choose(start):\n        if len(path) == k:\n            result.append(sorted(path))\n            return\n        if len(items)-start < k-len(path):\n            return\n        for i in range(start,len(items)):\n            path.append(items[i])\n            choose(i+1)\n            path.pop()\n    choose(0)\n    return sorted(result)",
    [
      t(
        [[3, 1, 2], 2],
        [
          [1, 2],
          [1, 3],
          [2, 3],
        ]
      ),
      t([[], 0], [[]]),
      t([[1], 2], []),
    ],
    "Track the next usable index to avoid duplicate choices.",
    "Prune when too few items remain to reach size k."
  ),
  27: task(
    "Whole words, not just beginnings",
    "Build a trie for lowercase a–z words. Return whether each query is an exact complete word, not merely a prefix. Empty words are allowed.",
    "words, queries",
    'def solve(words, queries):\n    root = {}\n    for word in words:\n        node = root\n        for char in word:\n            node = node.setdefault(char,{})\n        node["$"] = True\n    result = []\n    for word in queries:\n        node = root\n        for char in word:\n            if char not in node:\n                node = {}\n                break\n            node = node[char]\n        result.append("$" in node)\n    return result',
    [
      t(
        [
          ["car", "cart"],
          ["ca", "car", "cart", "cat"],
        ],
        [false, true, true, false]
      ),
      t([[], [""]], [false]),
      t([[""], ["", "a"]], [true, false]),
    ],
    "Following all characters proves only that a path exists.",
    "Check the end-of-word marker after the last character."
  ),
  28: task(
    "Are these nodes connected?",
    "Build union-find for vertices 0..n-1 and undirected edges. For each query [a,b], return whether the nodes are connected. Queries use valid indices.",
    "n, edges, queries",
    "def solve(n, edges, queries):\n    parent = list(range(n))\n    size = [1]*n\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    for a,b in edges:\n        a,b = find(a),find(b)\n        if a != b:\n            if size[a] < size[b]:\n                a,b = b,a\n            parent[b] = a\n            size[a] += size[b]\n    return [find(a)==find(b) for a,b in queries]",
    [
      t(
        [
          4,
          [
            [0, 1],
            [1, 2],
          ],
          [
            [0, 2],
            [0, 3],
            [3, 3],
          ],
        ],
        [true, false, true]
      ),
      t([0, [], []], []),
      t([2, [], [[0, 1]]], [false]),
    ],
    "Two nodes are connected when their roots match.",
    "Compress paths and join smaller trees under larger ones."
  ),
  29: task(
    "Which road first closes a loop?",
    "For undirected multigraph edges in input order, return the zero-based index of the first edge that creates a cycle, or -1. Self-loops and parallel edges count.",
    "n, edges",
    "def solve(n, edges):\n    parent = list(range(n))\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    for i,(a,b) in enumerate(edges):\n        a,b = find(a),find(b)\n        if a == b:\n            return i\n        parent[b] = a\n    return -1",
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
        2
      ),
      t(
        [
          2,
          [
            [0, 1],
            [0, 1],
          ],
        ],
        1
      ),
      t([1, [[0, 0]]], 0),
      t([0, []], -1),
    ],
    "Check roots before joining.",
    "Keep the input edge index when a repeated connection is detected."
  ),
  30: task(
    "Prices to every reachable stop",
    "For a directed graph with nonnegative weights [neighbor,weight], return minimum costs from start to every reachable node name. Missing keys have no outgoing edges.",
    "graph, start",
    'import heapq\n\ndef solve(graph, start):\n    distances = {start:0}\n    heap = [(0,start)]\n    while heap:\n        cost,node = heapq.heappop(heap)\n        if cost != distances[node]:\n            continue\n        for neighbor,weight in graph.get(node,[]):\n            candidate = cost+weight\n            if candidate < distances.get(neighbor,float("inf")):\n                distances[neighbor] = candidate\n                heapq.heappush(heap,(candidate,neighbor))\n    return distances',
    [
      t(
        [
          {
            A: [
              ["B", 5],
              ["C", 1],
            ],
            C: [["B", 1]],
          },
          "A",
        ],
        { A: 0, B: 2, C: 1 }
      ),
      t([{}, "X"], { X: 0 }),
      t([{ A: [["A", 0]] }, "A"], { A: 0 }),
    ],
    "Do not stop at one destination now.",
    "Skip stale heap entries and relax outgoing edges."
  ),
  31: task(
    "How many rounds of jobs?",
    "Jobs 0..n-1 take one round each; edge [a,b] means a must finish before b starts. Unlimited parallel jobs are allowed. Return the minimum rounds, or -1 for a cycle.",
    "n, edges",
    "from collections import deque\n\ndef solve(n, edges):\n    graph = [[] for _ in range(n)]\n    incoming = [0]*n\n    for a,b in edges:\n        graph[a].append(b)\n        incoming[b] += 1\n    queue = deque(i for i in range(n) if incoming[i] == 0)\n    rounds = done = 0\n    while queue:\n        rounds += 1\n        for _ in range(len(queue)):\n            node = queue.popleft()\n            done += 1\n            for neighbor in graph[node]:\n                incoming[neighbor] -= 1\n                if incoming[neighbor] == 0:\n                    queue.append(neighbor)\n    return rounds if done == n else -1",
    [
      t(
        [
          3,
          [
            [0, 2],
            [1, 2],
          ],
        ],
        2
      ),
      t([0, []], 0),
      t(
        [
          2,
          [
            [0, 1],
            [1, 0],
          ],
        ],
        -1
      ),
      t([3, []], 1),
    ],
    "Process ready jobs in batches.",
    "Jobs made ready during a batch belong to the next round."
  ),
  32: task(
    "Cheapest forest for separate regions",
    "For n vertices and undirected weighted edges [a,b,w], return the minimum spanning forest cost. Disconnected regions are allowed; connect each region as cheaply as possible.",
    "n, edges",
    "def solve(n, edges):\n    parent = list(range(n))\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    total = 0\n    for a,b,w in sorted(edges,key=lambda e:e[2]):\n        a,b = find(a),find(b)\n        if a != b:\n            parent[b] = a\n            total += w\n    return total",
    [
      t(
        [
          4,
          [
            [0, 1, 3],
            [2, 3, 2],
          ],
        ],
        5
      ),
      t([3, []], 0),
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
    ],
    "Keep Kruskal’s edge acceptance rule.",
    "Do not reject the result just because several components remain."
  ),
  33: task(
    "How many edits?",
    "Return the minimum insertions, deletions, and substitutions to change string a into b. Each edit costs 1. Use a DP table.",
    "a, b",
    "def solve(a, b):\n    dp = [[0]*(len(b)+1) for _ in range(len(a)+1)]\n    for i in range(len(a)+1):\n        dp[i][0] = i\n    for j in range(len(b)+1):\n        dp[0][j] = j\n    for i in range(1,len(a)+1):\n        for j in range(1,len(b)+1):\n            if a[i-1] == b[j-1]:\n                dp[i][j] = dp[i-1][j-1]\n            else:\n                dp[i][j] = 1+min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1])\n    return dp[-1][-1]",
    [t(["cat", "cut"], 1), t(["", "abc"], 3), t(["same", "same"], 0), t(["ab", "ba"], 2)],
    "Define the state for two prefixes.",
    "On a mismatch, choose the cheapest of deleting, inserting, or substituting."
  ),
  34: task(
    "Find a decreasing subsequence length",
    "Return the longest strictly decreasing subsequence length, or 0 for an empty list. Use quadratic DP.",
    "items",
    "def solve(items):\n    if not items:\n        return 0\n    dp = [1]*len(items)\n    for i in range(len(items)):\n        for j in range(i):\n            if items[j] > items[i]:\n                dp[i] = max(dp[i],dp[j]+1)\n    return max(dp)",
    [t([[5, 2, 4, 1]], 3), t([[]], 0), t([[3, 3]], 1), t([[1, 2, 3]], 1)],
    "The state still means a sequence ending at i.",
    "Reverse the extension comparison, not the order of the input."
  ),
  35: task(
    "Can a kit weigh exactly this much?",
    "Return whether a subset of positive integer weights sums exactly to target >= 0. Each item may be used once. Use 1D DP.",
    "weights, target",
    "def solve(weights, target):\n    possible = [False]*(target+1)\n    possible[0] = True\n    for weight in weights:\n        for total in range(target,weight-1,-1):\n            possible[total] = possible[total] or possible[total-weight]\n    return possible[target]",
    [t([[2, 3, 7], 5], true), t([[2], 4], false), t([[], 0], true), t([[3, 6], 4], false)],
    "Track feasibility rather than maximum value.",
    "Update totals downward so each weight is used at most once."
  ),
  36: task(
    "A separate doubled list",
    "Return a new list containing twice each integer. Leave the input unchanged. Do not append results to the list you are traversing.",
    "items",
    "def solve(items):\n    result = []\n    for value in items:\n        result.append(value*2)\n    return result",
    [t([[2, -1]], [4, -2]), t([[]], []), t([[0, 3]], [0, 6])],
    "Create a separate output list.",
    "Append one doubled value per original item."
  ),
  37: task(
    "Distinct shared badges",
    "Return the number of distinct integers occurring in both lists. Repeated values should count once.",
    "a, b",
    "def solve(a, b):\n    return len(set(a) & set(b))",
    [
      t(
        [
          [1, 1, 2],
          [1, 3],
        ],
        1
      ),
      t([[], [1]], 0),
      t(
        [
          [-1, 0],
          [-1, 0, 0],
        ],
        2
      ),
    ],
    "Form a set for each list.",
    "Intersection keeps members present in both."
  ),
  38: task(
    "Count the copying during growth",
    "A dynamic array starts with capacity 1 and size 0. On each append, if full, double capacity and count copying all existing values. Return total copied values for n appends, n >= 0.",
    "n",
    "def solve(n):\n    size = copied = 0\n    capacity = 1\n    for _ in range(n):\n        if size == capacity:\n            copied += size\n            capacity *= 2\n        size += 1\n    return copied",
    [t([5], 7), t([0], 0), t([1], 0), t([8], 7)],
    "Only a full array triggers copying.",
    "The copied sizes form 1+2+4+..., rather than n copies on every append."
  ),
  39: task(
    "Flatten the boxes",
    "Return all integers from a nested integer/list value in left-to-right order as one flat list. Nesting <= 20.",
    "value",
    "def solve(value):\n    if isinstance(value,int):\n        return [value]\n    result = []\n    for child in value:\n        result.extend(solve(child))\n    return result",
    [t([[2, [3, [], 4]]], [2, 3, 4]), t([[]], []), t([5], [5])],
    "An integer returns a one-item list.",
    "Extend the result with each child’s flattened output."
  ),
  40: task(
    "Draw two-way connections",
    "Build undirected adjacency lists for vertices 0..n-1. For each input edge [a,b], append b to a and a to b in that order. A self-loop is appended twice.",
    "n, edges",
    "def solve(n, edges):\n    graph = [[] for _ in range(n)]\n    for a,b in edges:\n        graph[a].append(b)\n        graph[b].append(a)\n    return graph",
    [
      t(
        [
          3,
          [
            [0, 1],
            [1, 2],
          ],
        ],
        [[1], [0, 2], [1]]
      ),
      t([0, []], []),
      t([1, [[0, 0]]], [[0, 0]]),
    ],
    "Store both travel directions.",
    "Keep distinct neighbor lists for each vertex."
  ),
  41: task(
    "Is the priority order valid?",
    "Return whether a list is a valid min-heap. Check parent-child ordering, not whether the entire list is sorted. Empty is valid.",
    "items",
    "def solve(items):\n    for i in range(1,len(items)):\n        if items[(i-1)//2] > items[i]:\n            return False\n    return True",
    [t([[1, 3, 2]], true), t([[2, 1, 3]], false), t([[]], true), t([[2, 2]], true)],
    "Every non-root entry has one parent.",
    "Compare each value with index (i-1)//2."
  ),
  42: task(
    "Longest affordable run",
    "Return the longest consecutive run with sum <= budget. Values are nonnegative integers, budget >= 0; an empty run is allowed.",
    "items, budget",
    "def solve(items, budget):\n    left = total = best = 0\n    for right,value in enumerate(items):\n        total += value\n        while total > budget:\n            total -= items[left]\n            left += 1\n        best = max(best,right-left+1)\n    return best",
    [t([[2, 1, 3, 1], 4], 2), t([[], 0], 0), t([[0, 0, 2], 0], 2), t([[5], 1], 0)],
    "Grow the right edge, then restore affordability.",
    "Nonnegative values make shrinking a safe way to reduce the sum."
  ),
  43: task(
    "At most k badge types",
    "Return the longest substring length with at most k distinct characters. k >= 0.",
    "text, k",
    "def solve(text, k):\n    counts = {}\n    left = best = 0\n    for right,char in enumerate(text):\n        counts[char] = counts.get(char,0)+1\n        while len(counts) > k:\n            old = text[left]\n            counts[old] -= 1\n            if counts[old] == 0:\n                del counts[old]\n            left += 1\n        best = max(best,right-left+1)\n    return best",
    [t(["eceba", 2], 3), t(["aaa", 1], 3), t(["abc", 0], 0), t(["", 2], 0)],
    "Count characters inside the current window.",
    "Remove zero-count keys so len(counts) means distinct active characters."
  ),
  44: task(
    "Remove matching linked nodes",
    "Remove every linked node whose value equals target and return the new head. Nodes have value/next. You may change links.",
    "head, target",
    'def solve(head, target):\n    dummy = {"value":None,"next":head}\n    previous = dummy\n    while previous["next"] is not None:\n        node = previous["next"]\n        if node["value"] == target:\n            previous["next"] = node["next"]\n        else:\n            previous = node\n    return dummy["next"]',
    [t([link(2, 1, 2, 3), 2], link(1, 3)), t([link(2, 2), 2], null), t([null, 1], null)],
    "A dummy node handles removal of the original head.",
    "After a removal, keep previous still to inspect its new next node."
  ),
  45: task(
    "Count copies on a sorted shelf",
    "For sorted integers, return the number of occurrences of target using two boundary searches. Do not scan or use count().",
    "items, target",
    "def solve(items, target):\n    def boundary(strict):\n        left,right = 0,len(items)\n        while left < right:\n            mid = (left+right)//2\n            if items[mid] < target or (strict and items[mid] == target):\n                left = mid+1\n            else:\n                right = mid\n        return left\n    return boundary(True)-boundary(False)",
    [t([[1, 2, 2, 2, 5], 2], 3), t([[], 2], 0), t([[1, 3], 2], 0), t([[4, 4], 4], 2)],
    "Find the first >= target and first > target.",
    "Subtract their indices to count the equal region."
  ),
  46: task(
    "Does the whole search tree keep its promise?",
    "Return whether a binary tree is a valid distinct-key BST. Every descendant must obey its ancestor bounds. Nodes have value/left/right.",
    "root",
    'def solve(root):\n    def valid(node,low,high):\n        if node is None:\n            return True\n        value = node["value"]\n        return low < value < high and valid(node["left"],low,value) and valid(node["right"],value,high)\n    return valid(root,float("-inf"),float("inf"))',
    [t([n(5, n(2), n(8))], true), t([n(5, n(2), n(8, n(4)))], false), t([null], true), t([n(2, n(2))], false)],
    "Comparing only a node with its direct children is insufficient.",
    "Carry lower and upper bounds from all ancestors."
  ),
  47: task(
    "Totals at each tree level",
    "Return a list of sums at each tree level from root downward. Empty tree returns []. Use a queue.",
    "root",
    'from collections import deque\n\ndef solve(root):\n    if root is None:\n        return []\n    queue = deque([root])\n    result = []\n    while queue:\n        total = 0\n        for _ in range(len(queue)):\n            node = queue.popleft()\n            total += node["value"]\n            for child in (node["left"],node["right"]):\n                if child is not None:\n                    queue.append(child)\n        result.append(total)\n    return result',
    [t([n(5, n(2), n(8))], [5, 10]), t([null], []), t([n(-2, null, n(3))], [-2, 3])],
    "Record the current queue length before processing a level.",
    "Newly added children wait for the next level."
  ),
  48: task(
    "Minimum cost to climb",
    "cost[i] is paid when standing on step i. Start on step 0 or 1 and move 1 or 2 steps to reach beyond the list. Return the minimum cost using memoized recursion. Costs are nonnegative.",
    "cost",
    "def solve(cost):\n    cache = {}\n    def best(i):\n        if i >= len(cost):\n            return 0\n        if i not in cache:\n            cache[i] = cost[i]+min(best(i+1),best(i+2))\n        return cache[i]\n    return min(best(0),best(1))",
    [t([[10, 15, 20]], 15), t([[]], 0), t([[5]], 0), t([[1, 100, 1, 1]], 2)],
    "Define the minimum remaining cost from one step.",
    "The cache key is the current step index."
  ),
  49: task(
    "Grid routes around blocked cells",
    "Return the number of right/down routes through a rectangular grid. 0 is open, 1 is blocked. Empty grid returns 0. Start and finish must be open.",
    "grid",
    "def solve(grid):\n    if not grid or not grid[0]:\n        return 0\n    rows,cols = len(grid),len(grid[0])\n    dp = [[0]*cols for _ in range(rows)]\n    dp[0][0] = 1 if grid[0][0] == 0 else 0\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c]:\n                dp[r][c] = 0\n            elif r or c:\n                dp[r][c] = (dp[r-1][c] if r else 0)+(dp[r][c-1] if c else 0)\n    return dp[-1][-1]",
    [
      t(
        [
          [
            [0, 0],
            [1, 0],
          ],
        ],
        1
      ),
      t([[]], 0),
      t([[[1]]], 0),
      t(
        [
          [
            [0, 0],
            [0, 0],
          ],
        ],
        2
      ),
    ],
    "A blocked cell contributes zero routes.",
    "Only add answers from valid above/left neighbors."
  ),
  50: task(
    "Return the selected kit items",
    "For 0/1 knapsack, return selected zero-based indices in ascending order. Positive weights, nonnegative values, capacity >= 0. Maximize value; when taking and skipping tie during reconstruction, skip the current (highest-index) item.",
    "weights, values, capacity",
    "def solve(weights, values, capacity):\n    n = len(weights)\n    dp = [[0]*(capacity+1) for _ in range(n+1)]\n    for i in range(1,n+1):\n        w,v = weights[i-1],values[i-1]\n        for c in range(capacity+1):\n            dp[i][c] = dp[i-1][c]\n            if w <= c:\n                dp[i][c] = max(dp[i][c],v+dp[i-1][c-w])\n    chosen = []\n    c = capacity\n    for i in range(n,0,-1):\n        if dp[i][c] != dp[i-1][c]:\n            chosen.append(i-1)\n            c -= weights[i-1]\n    return chosen[::-1]",
    [t([[2, 3, 4], [3, 4, 5], 5], [0, 1]), t([[], [], 5], []), t([[2, 2], [3, 3], 2], [0]), t([[3], [4], 1], [])],
    "Keep the 2D table so you can walk backward through item stages.",
    "A changed value between adjacent item rows means that item was taken."
  ),
  51: task(
    "How long has this price been unbeaten?",
    "For each price, return the number of consecutive days ending here whose prices are <= today’s price. Include today. Use a monotonic stack of indices.",
    "prices",
    "def solve(prices):\n    stack = []\n    result = []\n    for i,price in enumerate(prices):\n        while stack and prices[stack[-1]] <= price:\n            stack.pop()\n        result.append(i-stack[-1] if stack else i+1)\n        stack.append(i)\n    return result",
    [t([[100, 80, 60, 70, 60, 75, 85]], [1, 1, 1, 2, 1, 4, 6]), t([[]], []), t([[2, 2, 2]], [1, 2, 3])],
    "Discard earlier prices no greater than today.",
    "The nearest remaining greater price marks the left boundary."
  ),
  52: task(
    "Insert one booking",
    "Given sorted disjoint closed intervals, add new_interval and return the merged sorted intervals. Touching endpoints merge.",
    "intervals, new_interval",
    "def solve(intervals, new_interval):\n    result = []\n    start,end = new_interval\n    i = 0\n    while i < len(intervals) and intervals[i][1] < start:\n        result.append(intervals[i][:])\n        i += 1\n    while i < len(intervals) and intervals[i][0] <= end:\n        start = min(start,intervals[i][0])\n        end = max(end,intervals[i][1])\n        i += 1\n    result.append([start,end])\n    return result+[pair[:] for pair in intervals[i:]]",
    [
      t(
        [
          [
            [1, 2],
            [5, 7],
          ],
          [2, 6],
        ],
        [[1, 7]]
      ),
      t([[], [3, 4]], [[3, 4]]),
      t(
        [[[1, 2]], [4, 5]],
        [
          [1, 2],
          [4, 5],
        ]
      ),
    ],
    "Separate intervals before, overlapping, and after the new booking.",
    "Extend the active end as overlaps are absorbed."
  ),
  53: task(
    "Count the lit bits",
    "For nonnegative integer n, return the number of 1 bits without bin() or bit_count(). Use n & (n-1).",
    "n",
    "def solve(n):\n    count = 0\n    while n:\n        n &= n-1\n        count += 1\n    return count",
    [t([13], 3), t([0], 0), t([16], 1), t([7], 3)],
    "n & (n-1) clears the lowest set bit.",
    "Count how many clearing steps reach zero."
  ),
  54: task(
    "A tiny chained map",
    'Use bucket key % bucket_count and lists of [key,value] pairs. Process ["put",key,value] or ["get",key]; return get answers, None when absent. Integer keys/values; bucket_count > 0. Do not use a dictionary.',
    "operations, bucket_count",
    'def solve(operations, bucket_count):\n    buckets = [[] for _ in range(bucket_count)]\n    result = []\n    for op in operations:\n        bucket = buckets[op[1] % bucket_count]\n        found = None\n        for i,pair in enumerate(bucket):\n            if pair[0] == op[1]:\n                found = i\n                break\n        if op[0] == "put":\n            if found is None:\n                bucket.append([op[1],op[2]])\n            else:\n                bucket[found][1] = op[2]\n        else:\n            result.append(None if found is None else bucket[found][1])\n    return result',
    [
      t(
        [
          [
            ["put", 1, 5],
            ["put", 4, 8],
            ["get", 1],
            ["put", 1, 9],
            ["get", 1],
            ["get", 4],
          ],
          3,
        ],
        [5, 9, 8]
      ),
      t([[["get", 2]], 1], [null]),
      t([[], 2], []),
    ],
    "Compare actual keys inside a shared bucket.",
    "Update an existing pair rather than appending a duplicate key."
  ),
  55: task(
    "Where does the circular trail begin?",
    "For next_index links and start, return the first cycle node reached, or None if no cycle. Use fast/slow pointers and O(1) extra space.",
    "next_index, start",
    "def solve(next_index, start):\n    slow = fast = start\n    while fast is not None and next_index[fast] is not None:\n        slow = next_index[slow]\n        fast = next_index[next_index[fast]]\n        if slow == fast:\n            entry = start\n            while entry != slow:\n                entry = next_index[entry]\n                slow = next_index[slow]\n            return entry\n    return None",
    [t([[1, 2, 1], 0], 1), t([[1, null], 0], null), t([[0], 0], 0), t([[], null], null)],
    "First detect a meeting inside the cycle.",
    "Then move a pointer from start and one from the meeting, one link each, until equal."
  ),
  56: task(
    "Does a reachable rebate loop exist?",
    "Return whether a negative-cost cycle is reachable from start in a directed graph of n >= 1 vertices. Edges are [a,b,weight].",
    "n, edges, start",
    'def solve(n, edges, start):\n    distance = [float("inf")]*n\n    distance[start] = 0\n    for round_index in range(n):\n        changed = False\n        for a,b,w in edges:\n            if distance[a] != float("inf") and distance[a]+w < distance[b]:\n                distance[b] = distance[a]+w\n                changed = True\n        if not changed:\n            return False\n    return True',
    [
      t(
        [
          2,
          [
            [0, 1, 1],
            [1, 0, -2],
          ],
          0,
        ],
        true
      ),
      t(
        [
          3,
          [
            [1, 2, -2],
            [2, 1, 1],
          ],
          0,
        ],
        false
      ),
      t([1, [], 0], false),
    ],
    "Check for improvement on an nth pass.",
    "Unreachable distances must never relax an edge."
  ),
  57: task(
    "Changing range sums",
    'Process ["add",i,delta] and ["range",left,right] on items. Ranges are inclusive and valid. Implement a Fenwick tree; return range-query results.',
    "items, operations",
    'def solve(items, operations):\n    tree = [0]*(len(items)+1)\n    def add(i,v):\n        i += 1\n        while i < len(tree):\n            tree[i] += v\n            i += i & -i\n    def prefix(k):\n        total = 0\n        while k:\n            total += tree[k]\n            k -= k & -k\n        return total\n    for i,v in enumerate(items):\n        add(i,v)\n    result = []\n    for op in operations:\n        if op[0] == "add":\n            add(op[1],op[2])\n        else:\n            result.append(prefix(op[2]+1)-prefix(op[1]))\n    return result',
    [
      t(
        [
          [1, 2, 3],
          [
            ["range", 1, 2],
            ["add", 1, 4],
            ["range", 0, 2],
          ],
        ],
        [5, 10]
      ),
      t([[], []], []),
      t([[-2], [["range", 0, 0]]], [-2]),
    ],
    "An inclusive range is the difference of two prefix queries.",
    "Convert the right endpoint to a count using right+1."
  ),
  58: task(
    "All overlapping text matches",
    "Return all start indices where nonempty pattern occurs in text, including overlaps. Use KMP; do not use find/index.",
    "text, pattern",
    "def solve(text, pattern):\n    pi = [0]*len(pattern)\n    j = 0\n    for i in range(1,len(pattern)):\n        while j and pattern[i] != pattern[j]:\n            j = pi[j-1]\n        if pattern[i] == pattern[j]:\n            j += 1\n        pi[i] = j\n    result = []\n    j = 0\n    for i,char in enumerate(text):\n        while j and char != pattern[j]:\n            j = pi[j-1]\n        if char == pattern[j]:\n            j += 1\n        if j == len(pattern):\n            result.append(i-j+1)\n            j = pi[j-1]\n    return result",
    [t(["aaaa", "aa"], [0, 1, 2]), t(["abc", "d"], []), t(["ababab", "abab"], [0, 2])],
    "After a match, keep the longest reusable proper prefix.",
    "Reset j to pi[j-1] rather than zero so overlaps remain possible."
  ),
  59: task(
    "First shared multiple",
    "Return the nonnegative least common multiple of integers a and b. Return 0 if either is 0. Compute their GCD with Euclid instead of math.gcd/lcm.",
    "a, b",
    "def solve(a, b):\n    if not a or not b:\n        return 0\n    x,y = abs(a),abs(b)\n    while y:\n        x,y = y,x % y\n    return abs((a//x)*b)",
    [t([6, 8], 24), t([0, 5], 0), t([-3, 4], 12), t([7, 7], 7)],
    "LCM × GCD equals the absolute product for nonzero inputs.",
    "Divide before multiplying to avoid an unnecessarily large intermediate value."
  ),
};
checkpoints[1].starter =
  "def solve(items):\n    product = 0  # Is this the right starting value?\n    for value in items:\n        product *= value\n    return product";
checkpoints[36].unchangedArgs = [0];
checkpoints[36].freshResultArg = 0;
export const transferTasks = {
  0: task(
    "The last failed reading",
    "Return the last index whose integer reading is below limit, or -1 if none.",
    "readings, limit",
    "def solve(readings, limit):\n    answer = -1\n    for i,value in enumerate(readings):\n        if value < limit:\n            answer = i\n    return answer",
    [t([[5, 2, 8, 1], 3], 3), t([[], 4], -1), t([[4, 5], 2], -1)],
    "Remember an index whenever a failure appears.",
    "Keep going because a later failure replaces an earlier one."
  ),
  12: task(
    "The most frequent alert",
    "Return the most frequent string, breaking ties alphabetically. Return None for no alerts.",
    "alerts",
    "def solve(alerts):\n    counts = {}\n    for alert in alerts:\n        counts[alert] = counts.get(alert,0)+1\n    if not counts:\n        return None\n    return min(counts,key=lambda word:(-counts[word],word))",
    [t([["z", "a", "z", "a"]], "a"), t([[]], null), t([["x", "x", "a"]], "x")],
    "Count occurrences before choosing.",
    "Compare frequency first and alphabetical order second."
  ),
  13: task(
    "Pairs of sales reaching a goal",
    "Count all index pairs i<j whose sales sum to target. Duplicate values at different positions are separate choices.",
    "sales, target",
    "def solve(sales, target):\n    counts = {}\n    pairs = 0\n    for value in sales:\n        pairs += counts.get(target-value,0)\n        counts[value] = counts.get(value,0)+1\n    return pairs",
    [t([[3, 3, 3], 6], 3), t([[], 0], 0), t([[-2, 5, 1, 2], 3], 2)],
    "Each current sale pairs with every prior complement.",
    "Store counts rather than only membership."
  ),
  43: task(
    "Distinct badge blocks",
    "Count length-k substrings containing k different characters. Return 0 for k<=0 or k>len(text).",
    "text, k",
    "def solve(text, k):\n    if k <= 0 or k > len(text):\n        return 0\n    counts = {}\n    answer = 0\n    for i,char in enumerate(text):\n        counts[char] = counts.get(char,0)+1\n        if i >= k:\n            old = text[i-k]\n            counts[old] -= 1\n            if counts[old] == 0:\n                del counts[old]\n        if i >= k-1 and len(counts) == k:\n            answer += 1\n    return answer",
    [t(["abac", 3], 1), t(["aaaa", 2], 0), t(["abc", 0], 0), t(["abc", 1], 3)],
    "Track character counts in only the current block.",
    "A length-k block has all distinct characters exactly when the map has k keys."
  ),
  45: task(
    "Count readings inside bands",
    "For each inclusive [low,high] band, count readings in that band in an already sorted integer list. Each band has low <= high. Return the counts. Use boundary searches.",
    "readings, bands",
    "def solve(readings, bands):\n    def bound(value,strict):\n        left,right = 0,len(readings)\n        while left < right:\n            mid = (left+right)//2\n            if readings[mid] < value or (strict and readings[mid] == value):\n                left = mid+1\n            else:\n                right = mid\n        return left\n    return [bound(high,True)-bound(low,False) for low,high in bands]",
    [
      t(
        [
          [1, 2, 2, 5],
          [
            [2, 2],
            [0, 4],
            [8, 9],
          ],
        ],
        [2, 3, 0]
      ),
      t([[], [[0, 1]]], [0]),
      t([[3], []], []),
    ],
    "Each band is bounded by first >= low and first > high.",
    "Subtract the two boundary positions."
  ),
  18: task(
    "Escape the blocked floor",
    "For a rectangular grid of 0=open and 1=blocked, return the fewest up/down/left/right moves from top-left to bottom-right, or -1 if impossible. Empty or blocked endpoints are impossible.",
    "grid",
    "from collections import deque\n\ndef solve(grid):\n    if not grid or not grid[0] or grid[0][0] or grid[-1][-1]:\n        return -1\n    rows,cols = len(grid),len(grid[0])\n    queue = deque([(0,0,0)])\n    seen = {(0,0)}\n    while queue:\n        r,c,d = queue.popleft()\n        if (r,c) == (rows-1,cols-1):\n            return d\n        for dr,dc in ((1,0),(-1,0),(0,1),(0,-1)):\n            nr,nc = r+dr,c+dc\n            if 0 <= nr < rows and 0 <= nc < cols and not grid[nr][nc] and (nr,nc) not in seen:\n                seen.add((nr,nc))\n                queue.append((nr,nc,d+1))\n    return -1",
    [
      t(
        [
          [
            [0, 0],
            [1, 0],
          ],
        ],
        2
      ),
      t([[[0]]], 0),
      t(
        [
          [
            [0, 1],
            [1, 0],
          ],
        ],
        -1
      ),
      t([[]], -1),
    ],
    "Treat each open cell as a place and each allowed move as one edge.",
    "Mark a cell when it enters the waiting queue."
  ),
  17: task(
    "Combine sorted delivery feeds",
    "Merge any number of individually sorted integer lists into one sorted list, including duplicates. Use a priority queue of current feed heads.",
    "feeds",
    "import heapq\n\ndef solve(feeds):\n    heap = []\n    for i,feed in enumerate(feeds):\n        if feed:\n            heapq.heappush(heap,(feed[0],i,0))\n    result = []\n    while heap:\n        value,i,j = heapq.heappop(heap)\n        result.append(value)\n        if j+1 < len(feeds[i]):\n            heapq.heappush(heap,(feeds[i][j+1],i,j+1))\n    return result",
    [t([[[1, 4], [2, 2], [], [3]]], [1, 2, 2, 3, 4]), t([[]], []), t([[[], [-3, 0]]], [-3, 0])],
    "Only the current head of each feed can be the next output.",
    "After taking a head, add the following value from that same feed."
  ),
  51: task(
    "Wait for a warmer day",
    "For each temperature, return how many days until a strictly warmer reading. Return 0 when none follows.",
    "temperatures",
    "def solve(temperatures):\n    waiting = []\n    result = [0]*len(temperatures)\n    for i,value in enumerate(temperatures):\n        while waiting and temperatures[waiting[-1]] < value:\n            previous = waiting.pop()\n            result[previous] = i-previous\n        waiting.append(i)\n    return result",
    [t([[70, 69, 72, 72, 75]], [2, 1, 2, 1, 0]), t([[]], []), t([[3, 2, 1]], [0, 0, 0])],
    "Store unresolved day positions.",
    "Subtract the earlier position from the position that settles it."
  ),
  50: task(
    "Count possible kits",
    "Return how many index subsets of positive weights total exactly target >= 0. Equal weights at different indices are distinct items. Each item is usable once.",
    "weights, target",
    "def solve(weights, target):\n    counts = [0]*(target+1)\n    counts[0] = 1\n    for weight in weights:\n        for total in range(target,weight-1,-1):\n            counts[total] += counts[total-weight]\n    return counts[target]",
    [t([[1, 1, 2], 2], 2), t([[], 0], 1), t([[2], 4], 0), t([[3, 4], 2], 0)],
    "Count ways for each exact total.",
    "Visit totals downward to prevent using the current item again."
  ),
  47: task(
    "Is the tree evenly shaped?",
    "Return whether every node has left/right subtree heights differing by at most 1. Nodes have value/left/right; empty is balanced. Visit each node once.",
    "root",
    'def solve(root):\n    def height(node):\n        if node is None:\n            return 0\n        left = height(node["left"])\n        right = height(node["right"])\n        if left < 0 or right < 0 or abs(left-right) > 1:\n            return -1\n        return 1+max(left,right)\n    return height(root) >= 0',
    [t([n(3, n(1), n(4))], true), t([n(1, null, n(2, null, n(3)))], false), t([null], true)],
    "Return height and encode failure using -1.",
    "Do not recompute full child heights separately for every ancestor."
  ),
  27: task(
    "Suggest matching words",
    "Return sorted distinct lowercase words beginning with prefix. Build a trie, follow the prefix, and traverse its descendants. Empty prefix matches every word.",
    "words, prefix",
    'def solve(words, prefix):\n    root = {}\n    for word in words:\n        node = root\n        for char in word:\n            node = node.setdefault(char,{})\n        node["$"] = True\n    node = root\n    for char in prefix:\n        if char not in node:\n            return []\n        node = node[char]\n    result = []\n    def visit(current,word):\n        if "$" in current:\n            result.append(word)\n        for char in sorted(k for k in current if k != "$"):\n            visit(current[char],word+char)\n    visit(node,prefix)\n    return result',
    [t([["car", "cat", "car", "dog"], "ca"], ["car", "cat"]), t([["a"], "z"], []), t([["", "a"], ""], ["", "a"])],
    "A complete-word marker tells you when to output the current path.",
    "Traverse child letters in sorted order for ordered suggestions."
  ),
  59: task(
    "Pairs sharing no factor",
    "Count index pairs i<j whose positive integers have GCD 1. Use Euclid for each pair. n <= 50.",
    "items",
    "def solve(items):\n    count = 0\n    for i in range(len(items)):\n        for j in range(i+1,len(items)):\n            a,b = items[i],items[j]\n            while b:\n                a,b = b,a % b\n            if a == 1:\n                count += 1\n    return count",
    [t([[2, 3, 4]], 2), t([[]], 0), t([[1, 1, 2]], 3), t([[6, 9]], 0)],
    "Each pair is a separate GCD calculation.",
    "Visit only j>i so each pair is counted once."
  ),
};

for (const [id, problem] of Object.entries(transferTasks)) problem.requires = Number(id) === 17 ? [17, 8] : [Number(id)];

// Plain instructions for these problems, independent of the main lesson exercise.
const checkpointBriefs = {
  0: {
    input: "A list of readings called items, and a target reading.",
    output: "The number of positions whose reading equals target. Return 0 if none match.",
    example: "The reading 3 appears at positions 0 and 2 in [3, 1, 3]. Count both matches: 2.",
  },
  1: {
    input: "A list of integers. It can contain negative numbers or zero.",
    output: "Multiply all the integers and return the product. For an empty list, return 1. Do not use math.prod.",
    example: "2 × -3 × 4 = -24. A negative number changes the sign of the product.",
  },
  2: {
    input: "A list of integers, possibly empty.",
    output: "A list [smallest, largest], or [] if the input is empty. Make one pass without sorting or calling min or max.",
    example: "In [-4, 8, 2], the smallest value is -4 and the largest is 8. Return [-4, 8].",
  },
  3: {
    input: "Two lists a and b, already sorted from smallest to largest.",
    output: "A sorted list of values that appear in both inputs. Include each shared value only once. Move two indices forward; do not use sets.",
    example: "Both lists contain 2 and 4. Repeated copies of 2 still produce just one 2: [2, 4].",
  },
  4: {
    input: "A list of integers, a group length k, and a target total. Groups must use consecutive positions.",
    output:
      "The starting position of the first length-k group whose sum is at least target. Positions start at 0. Return -1 if no group qualifies or k is invalid.",
    example: "The pairs are [1, 2], [2, 5], and [5, 1]. The first qualifying pair is [2, 5], starting at position 1.",
  },
  5: {
    input: "A list of integers, queries [left, right], and a target total. Each query includes both endpoints; positions start at 0.",
    output: "How many queried ranges have a sum at least target. Build the running totals once and reuse them.",
    example: "The three range sums are 2, 4, and 6. Two of them are at least 4, so return 2.",
  },
  6: {
    input: "A sorted list of integers and a target value. Repeated values are allowed.",
    output: "True if target occurs anywhere, otherwise False. Use binary search rather than checking every position.",
    example: "2 appears in [1, 2, 2, 5]. It does not matter which matching position you find: return True.",
  },
  7: {
    input: "A list of integers, possibly empty.",
    output: "The values sorted from largest to smallest, keeping repeated values. Use insertion sort.",
    example: "Both 5s come first, followed by 2 and 1: [5, 5, 2, 1].",
  },
  8: {
    input: "Two lists a and b, already sorted from smallest to largest.",
    output: "One sorted list containing every distinct value from either input. Use two indices; do not use set or sorted.",
    example: "The inputs together contain 1, 2, and 4. Extra copies are removed: [1, 2, 4].",
  },
  9: {
    input: "Text containing only (, ), [, ], {, and }.",
    output: "True if every closing bracket matches the most recent opening bracket and no openings are left. Otherwise False.",
    example: "In {[()]}, the innermost parentheses close first, then the square brackets, then the braces. Return True.",
  },
  10: {
    input: "A list of add/take operations and a maximum queue size called capacity.",
    output: "The result of each take operation, in order. Take the oldest item, or return None for that take if empty. Ignore an add when full.",
    example: "Capacity is 1. Add 1 succeeds, add 2 is ignored, and the two takes return 1 and None: [1, None].",
  },
  11: {
    input: "The head of a linked list and an index k. Each node has value and next; counting starts at 0.",
    output: "The value at position k, or None if that position does not exist. Follow next links rather than converting the chain to an array.",
    example: "The chain is 4 → 7 → 9. Position 0 holds 4, so position 1 holds 7.",
  },
  12: {
    input: "A list of words. Compare the words exactly as written.",
    output: "The first word in input order that occurs exactly once. Return None if no word qualifies.",
    example: "tea occurs twice. milk is the first word that occurs once, so return milk.",
  },
  13: {
    input: "A list of integers and a target total.",
    output: "True if two different positions add to target, otherwise False. Look up previously seen values during one pass.",
    example: "The two 3s occupy different positions. They make 6 together, so return True.",
  },
  14: {
    input: "A base number and a nonnegative integer exponent n.",
    output: "base multiplied by itself n times. Use recursion, without ** or pow. For exponent 0, return 1, including when base is 0.",
    example: "3 to the fourth power is 3 × 3 × 3 × 3 = 81.",
  },
  15: {
    input: "The root of a binary tree, or None. Each node has value, left, and right.",
    output: "A list of values in preorder: read the node, then its left branch, then its right branch. For an empty tree, return [].",
    example: "Read root 2 first, then its left child 1, then its right child 3: [2, 1, 3].",
  },
  16: {
    input: "A binary search tree and two bounds low and high. Smaller values are on the left and larger values on the right.",
    output: "The sum of node values between low and high, including both bounds. Skip branches that cannot contain qualifying values.",
    example: "The values are 2, 5, and 8. Between 3 and 8, only 5 and 8 qualify: 5 + 8 = 13.",
  },
  17: {
    input: "A list of integers and a nonnegative count k.",
    output:
      "The k largest values, from largest to smallest. Keep duplicates; if k exceeds the list length, return all values. Use a heap holding at most k values.",
    example: "The largest two values in [3, 8, 1, 8] are the two 8s. Return [8, 8].",
  },
  18: {
    input: "A graph mapping each place to its allowed next places, plus a starting place.",
    output:
      "A dictionary mapping every reachable place to its shortest number of edges from start. Include start with distance 0; leave out unreachable places.",
    example: "A is 0 edges away. B and C need 1 edge. D needs 2: {A: 0, B: 1, C: 1, D: 2}.",
  },
  19: {
    input: "The number of nodes n and undirected edges [a, b]. Nodes are numbered 0 through n - 1.",
    output: "How many separate connected groups exist. Include isolated nodes as groups of one. Use graph traversal.",
    example: "Nodes 0, 1, and 2 form one group. Nodes 3 and 4 form another. Return 2.",
  },
  20: {
    input: "Intervals [start, end]. Two intervals may touch at an endpoint without overlapping.",
    output: "The fewest intervals to remove so those kept do not overlap. Use an earliest-finish choice.",
    example: "Keep [1, 3] and [3, 5]. Remove [2, 4]. Only 1 removal is needed.",
  },
  21: {
    input: "A stair height n from 0 to 25. Each move climbs 1, 2, or 3 steps.",
    output: "The number of ordered move sequences reaching exactly n. Staying at height 0 counts as one empty sequence.",
    example: "Height 4 has 7 sequences: 1111, 112, 121, 211, 22, 13, and 31.",
  },
  22: {
    input: "Distinct positive coin values and a nonnegative amount. You may reuse a coin value.",
    output:
      "How many combinations make the amount. Changing coin order does not create a new combination. Amount 0 has one combination: choose no coins.",
    example: "With coins 1 and 2, amount 4 has three combinations: four 1s; two 1s and one 2; or two 2s. Return 3.",
  },
  23: {
    input: "A graph, a starting place, a goal, and a list of blocked places that must not be visited.",
    output:
      "A shortest route as a list of places, including start and goal. Follow the given neighbor order to break ties. Return [] if no route exists or an endpoint is blocked.",
    example: "B is blocked, so A → B → D is unavailable. A → C → D is allowed. Return [A, C, D].",
  },
  24: {
    input: "A list of integers. Count positions from 0.",
    output: "The number of pairs of positions i before j where items[i] is greater than items[j]. Count while merging sorted halves.",
    example: "In [3, 1, 2], 3 comes before the smaller 1 and the smaller 2. Those are the only two qualifying pairs.",
  },
  25: {
    input: "A list of integers and a valid position k in its sorted order. Positions start at 0.",
    output:
      "The value that would appear at position k after sorting. Use quickselect with the middle value as pivot and three groups; do not fully sort.",
    example: "The sorted order would be [1, 3, 3, 5]. Position 2 holds 3, so return 3.",
  },
  26: {
    input: "A list of distinct integers and a chosen size k. The input has at most 10 items.",
    output:
      "All groups of exactly k items. Sort values inside each group and sort the outer list. Choosing the same items in another order is not a new group.",
    example: "Choosing 2 from [3, 1, 2] gives [1, 2], [1, 3], and [2, 3]. Return those three groups in that order.",
  },
  27: {
    input: "A list of lowercase words and a list of word queries. Empty words are allowed.",
    output:
      "One True/False result per query, telling whether the whole queried word was inserted. Use a trie; a matching beginning alone does not qualify.",
    example: "car and cart were inserted. ca is only a beginning, and cat was not inserted. Return [False, True, True, False].",
  },
  28: {
    input: "Nodes numbered 0 through n - 1, undirected connections, and queries asking about pairs of nodes.",
    output: "One boolean per query: True if the pair belongs to the same connected group, otherwise False. Use union-find.",
    example: "0 and 2 connect through 1. 0 and 3 are separate. 3 connects to itself. Return [True, False, True].",
  },
  29: {
    input: "Undirected edges in arrival order, connecting nodes numbered 0 through n - 1.",
    output:
      "The position of the first edge that closes a loop, counting from 0. A self-edge or a repeated edge also counts. Return -1 if no edge closes a loop.",
    example: "Edges 0–1 and 1–2 connect all three nodes. The next edge, 2–0, closes a loop. It is at position 2.",
  },
  30: {
    input: "A directed graph whose entries give [neighbor, cost], plus a starting place. All costs are zero or positive.",
    output:
      "A dictionary of the cheapest total cost from start to every reachable place. Include start with cost 0; omit unreachable places. Use Dijkstra’s algorithm.",
    example: "A → C costs 1. A → C → B costs 2, cheaper than going directly for 5. Return costs A: 0, B: 2, C: 1.",
  },
  31: {
    input: "n jobs and dependencies [before, after]. Every job takes one round; any number of ready jobs can run together.",
    output: "The fewest rounds to finish every job, or -1 if the dependencies contain a loop. With no jobs, return 0.",
    example: "Jobs 0 and 1 run in round 1. Job 2 needs both finished, so it runs in round 2. Return 2.",
  },
  32: {
    input: "n places and undirected edges [a, b, cost]. The network may have separate connected groups.",
    output:
      "The minimum total cost to connect each group internally, without requiring separate groups to connect to one another. Use Kruskal’s algorithm.",
    example: "The available groups use edge 0–1 costing 3 and edge 2–3 costing 2. Total cost is 5.",
  },
  33: {
    input: "Two strings called a and b.",
    output: "The fewest single-character edits to turn a into b. Inserting, deleting, or replacing one character each costs 1.",
    example: "Change the a in cat to u. That one replacement makes cut, so return 1.",
  },
  34: {
    input: "A list of integers.",
    output:
      "The length of the longest strictly decreasing subsequence. You may skip positions, but cannot reorder them. Use a table comparing earlier positions; return 0 for an empty list.",
    example: "From [5, 2, 4, 1], choose 5, 4, 1 or 5, 2, 1. Either has length 3.",
  },
  35: {
    input: "Positive integer weights and a nonnegative target. Each input position may be chosen at most once.",
    output: "True if some selection adds exactly to target, otherwise False. The empty selection makes 0. Use a one-dimensional table.",
    example: "Choose 2 and 3 to make 5. The weight 7 is not needed. Return True.",
  },
  36: {
    input: "A list of integers, possibly empty.",
    output: "A separate list with every value doubled. Keep the original list unchanged.",
    example: "2 becomes 4 and -1 becomes -2. Return [4, -2] while leaving the input [2, -1] unchanged.",
  },
  37: {
    input: "Two lists of values.",
    output: "How many different values appear in both lists. Repeated copies count only once.",
    example: "Only 1 appears in both lists. Its repeated appearance in the first list does not increase the count. Return 1.",
  },
  38: {
    input: "A nonnegative count n of items to append to a simulated growing array. Start empty with room for 1 item.",
    output:
      "The total number of existing items copied during resizing. When full, double the capacity before appending. Do not count the new append itself as a copy.",
    example: "For 5 appends, resize at sizes 1, 2, and 4. Copy 1 + 2 + 4 = 7 existing items in total.",
  },
  39: {
    input: "An integer or a nested list of integers and lists, nested at most 20 levels.",
    output: "A flat list of all integers, read from left to right. Empty inner lists contribute nothing. Use recursion.",
    example: "Read 2, then enter the inner list and read 3 and 4. Ignore its empty list. Return [2, 3, 4].",
  },
  40: {
    input: "n nodes numbered 0 through n - 1, plus undirected edges [a, b] in arrival order.",
    output:
      "One neighbor list per node. Each edge adds b to a’s list and a to b’s list. Keep arrival order and repeated edges; a self-edge is added twice.",
    example: "Edge 0–1 adds both directions. Edge 1–2 does too. Return [[1], [0, 2], [1]].",
  },
  41: {
    input: "A list representing a possible min-heap. Children of position i are at 2*i + 1 and 2*i + 2, when present.",
    output:
      "True if every parent is no greater than either child, otherwise False. An empty list is valid. Do not require the whole list to be sorted.",
    example: "In [1, 3, 2], parent 1 is no greater than children 3 and 2. Return True even though 3 comes before 2.",
  },
  42: {
    input: "Nonnegative item costs and a nonnegative budget.",
    output: "The greatest number of consecutive items whose total cost is at most budget. Return 0 if none fit.",
    example: "In [2, 1, 3, 1] with budget 4, [2, 1], [1, 3], and [3, 1] each fit. No group of 3 fits, so return 2.",
  },
  43: {
    input: "A string s and a limit k on different characters.",
    output: "The length of the longest consecutive piece containing at most k different characters. Return 0 for empty text or k at most 0.",
    example: "ece contains only e and c and has length 3. Extending it to eceb adds a third character, so the best length is 3.",
  },
  44: {
    input: "The head of a linked list and a target value. Nodes have value and next.",
    output: "The head of the chain after removing every node whose value equals target. You may change next links. Return None if no nodes remain.",
    example: "Remove both nodes holding 2 from 2 → 1 → 2 → 3. The remaining chain is 1 → 3.",
  },
  45: {
    input: "A sorted list of integers and a target.",
    output: "How many times target occurs. Find its left and right boundaries with binary search; do not scan the list or call count.",
    example: "2 fills positions 1, 2, and 3. The boundary after those positions is 4. The count is 4 - 1 = 3.",
  },
  46: {
    input: "A binary tree whose node values are distinct. Nodes have value, left, and right.",
    output: "True if every value follows the search-tree ordering rule for all its ancestors, otherwise False. An empty tree is valid.",
    example: "Root 5 has 2 on its left and 8 on its right. Both values are on the correct side, so return True.",
  },
  47: {
    input: "The root of a binary tree, or None.",
    output: "A list with the sum of each level, starting at the root level. Use a queue. An empty tree returns [].",
    example: "The root level contains 5. The next level contains 2 and 8, which add to 10. Return [5, 10].",
  },
  48: {
    input: "A list of nonnegative stair costs. You may start at position 0 or 1, then climb 1 or 2 steps per move.",
    output:
      "The smallest cost to move beyond the last stair. Pay a stair’s cost when standing on it. An empty or one-stair list costs 0 because you may start beyond it. Use recursion with saved answers.",
    example: "Start on stair 1 and pay 15. Jump two steps to leave the list. This costs less than paying 10 + 20, so return 15.",
  },
  49: {
    input: "A rectangular grid: 0 is open and 1 is blocked. Start at its top-left cell and aim for its bottom-right cell.",
    output: "How many routes use only right and down moves and never enter a blocked cell. Return 0 for an empty grid or blocked endpoint.",
    example: "The lower-left cell is blocked. The only route goes right, then down. Return 1.",
  },
  50: {
    input: "Positive item weights, matching nonnegative values, and a nonnegative carrying limit. Each item may be selected once.",
    output:
      "The selected item positions, in increasing order, for a highest-value selection that fits. Positions start at 0. When reconstructing a tie, skip the current highest-index item.",
    example: "Items 0 and 1 weigh 2 + 3 = 5 and are worth 3 + 4 = 7. This beats item 2 alone, worth 5. Return [0, 1].",
  },
  51: {
    input: "Daily prices in time order.",
    output:
      "One span per day: count today and the consecutive preceding days whose prices are at most today’s. Stop at the first higher price. Use a monotonic stack.",
    example: "On the final day, 85 covers itself and the five preceding prices through 80, but stops at 100. Its span is 6.",
  },
  52: {
    input: "Sorted, nonoverlapping intervals and one new interval [start, end].",
    output: "The sorted intervals after insertion and merging. Intervals that touch at an endpoint must merge.",
    example: "[2, 6] touches [1, 2] and overlaps [5, 7]. Together they cover [1, 7], so return [[1, 7]].",
  },
  53: {
    input: "A nonnegative integer n.",
    output: "How many digits are 1 in n’s binary form. Repeatedly clear the lowest 1 using n & (n - 1); do not use bin or bit_count.",
    example: "13 is 1101 in binary. Three digits are 1, so return 3.",
  },
  54: {
    input: "A positive bucket_count and put/get operations. Keys and stored values are integers. Put is [put, key, value]; get is [get, key].",
    output:
      "The results of get operations, in order. A missing key gives None. Put updates an existing key, or adds a new [key, value] pair. Use key % bucket_count and lists, without a Python dictionary.",
    example: "Keys 1 and 4 share bucket 1 but keep different values. The gets read 5, then updated value 9 for key 1, then 8 for key 4: [5, 9, 8].",
  },
  55: {
    input: "A list next_index, where each entry is the next position to visit or None, and a starting position.",
    output:
      "The position where a loop begins on the route from start, or None if that route ends. Positions start at 0. Use fast/slow pointers and constant extra memory.",
    example: "Follow 0 → 1 → 2 → 1. The repeated section starts at position 1. Return 1, not the value of a node or a boolean.",
  },
  56: {
    input: "n nodes, directed edges [from, to, cost], and a starting node.",
    output: "True if a negative-total-cost loop can be reached from start, otherwise False. A disconnected negative loop does not count.",
    example: "0 → 1 costs 1 and 1 → 0 costs -2. Their total is -1, and start 0 can reach this loop. Return True.",
  },
  57: {
    input:
      "Initial integers and add/range operations. Positions start at 0. An add changes one value by the supplied difference; a range includes both endpoints.",
    output: "A list with the sum for each range operation, in order. Updates affect all later queries. Use a Fenwick tree.",
    example: "First, positions 1 through 2 sum to 2 + 3 = 5. Add 4 at position 1, making [1, 6, 3]. The next range sums to 10. Return [5, 10].",
  },
  58: {
    input: "A text string and a nonempty pattern string.",
    output: "A list of every starting position where the whole pattern matches. Count from 0 and include overlapping matches. Use KMP.",
    example: "aa begins at positions 0, 1, and 2 in aaaa. These matches overlap, and all count: [0, 1, 2].",
  },
  59: {
    input: "Two nonnegative integers a and b.",
    output:
      "Their least common multiple: the smallest positive number divisible by both when both are positive. If either input is 0, return 0. Use Euclid, without math.gcd or math.lcm.",
    example: "24 is the first positive multiple shared by 6 and 8. Return 24.",
  },
};
const transferBriefs = {
  0: {
    input: "Readings in time order and a limit value.",
    output: "The last position whose reading is strictly below the limit, counting from 0. Return -1 if none qualify.",
    example: "Positions 1 and 3 contain readings below 3. The last is position 3, so return 3.",
  },
  12: {
    input: "A list of strings, possibly empty.",
    output: "The most frequent string. If several tie, return the alphabetically first. For an empty list, return None.",
    example: "a and z each occur twice. a comes first alphabetically, so return a.",
  },
  13: {
    input: "A list of integers and a target total.",
    output:
      "How many pairs of different positions add to target. Count each pair once, with the earlier position first. Equal values at different positions can form different pairs.",
    example: "For [3, 3, 3], the qualifying position pairs are (0, 1), (0, 2), and (1, 2). Return 3.",
  },
  17: {
    input: "Several lists, each already sorted from smallest to largest.",
    output: "One sorted list containing all their values, including duplicates. Keep only the next available item from each feed in the heap.",
    example: "Combining [1, 4], [2, 2], [], and [3] gives [1, 2, 2, 3, 4]. The empty feed adds nothing.",
  },
  18: {
    input: "A grid with 0 for open cells and 1 for blocked cells. Start at the top-left and aim for the bottom-right.",
    output:
      "The fewest moves needed, moving up, down, left, or right. Each move costs 1. Return -1 for no route, an empty grid, or a blocked endpoint.",
    example: "The lower-left cell is blocked. Go right, then down: 2 moves. Count moves, rather than the 3 cells visited.",
  },
  27: {
    input: "Lowercase words and a prefix to complete.",
    output: "The sorted distinct words starting with that prefix. Use a trie. An empty prefix matches every word.",
    example: "car and cat start with ca; dog does not. Repeated car is returned only once: [car, cat].",
  },
  43: {
    input: "Text s and a group length k.",
    output:
      "How many length-k consecutive pieces have no repeated character. Count starting positions separately. Return 0 when k is not positive or exceeds the text length.",
    example: "The length-3 pieces of abac are aba and bac. Only bac has 3 different characters, so return 1.",
  },
  45: {
    input: "Sorted readings and inclusive bands [low, high].",
    output:
      "One count per band, telling how many readings lie between its two bounds. Include repeated readings. Use binary-search boundaries for each band.",
    example: "Band [2, 2] contains both 2s; [0, 4] contains 1 and both 2s; [8, 9] contains nothing. Return [2, 3, 0].",
  },
  47: {
    input: "A binary tree, or None. Nodes have value, left, and right.",
    output:
      "True if, at every node, its left and right branch heights differ by at most 1. Otherwise False. An empty tree is balanced. Visit each node once.",
    example: "Root 3 has leaf children 1 and 4. Their heights match, and both leaves are balanced. Return True.",
  },
  50: {
    input: "Positive integer weights and a nonnegative target. Treat input positions as separate items, even when weights match.",
    output:
      "How many selections of positions add exactly to target. Each item can be used once, and changing selection order does not count again. The empty selection makes 0 once.",
    example: "For weights [1, 1, 2], make 2 by selecting both 1s or by selecting the single 2. These are 2 selections.",
  },
  51: {
    input: "Temperatures in day order.",
    output: "One waiting time per day: how many days until a strictly warmer temperature. Return 0 for a day with no warmer day ahead.",
    example: "For [70, 69, 72, 72, 75], the waits are [2, 1, 2, 1, 0]. Equal temperatures are not warmer.",
  },
  59: {
    input: "At most 50 positive integers.",
    output:
      "How many pairs of positions have greatest common divisor 1. Count each pair once, with the earlier position first. Compute each divisor using Euclid.",
    example: "2 and 3 share only factor 1, as do 3 and 4. But 2 and 4 share factor 2. Return 2.",
  },
};
for (const [id, problem] of Object.entries(checkpoints)) problem.exerciseBrief = checkpointBriefs[id];
for (const [id, problem] of Object.entries(transferTasks)) problem.exerciseBrief = transferBriefs[id];
