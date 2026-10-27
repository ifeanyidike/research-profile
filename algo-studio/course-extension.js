const q = (prompt, options, answer, why) => ({ prompt, options, answer, why });
const t = (args, expected) => ({ args, expected });
function unit(id, title, idea, analogy, walk, trap, predict, task, params, solution, tests, cost, reflect) {
  return {
    id,
    title,
    idea,
    simpleIdea: idea,
    analogy,
    walk,
    trap,
    predict,
    task,
    starter: `def solve(${params}):\n    # Build one small step at a time.\n    pass`,
    solution,
    tests,
    hints: [walk[1], walk[2]],
    cost,
    simpleCost: cost,
    reflect,
  };
}
const node = (value, left = null, right = null) => ({ value, left, right });
export const additions = [
  unit(
    36,
    "Lists: positions, copies, and changes",
    "A list keeps values in numbered positions. Assigning a list to another name shares it; making a copy creates a separate list.",
    "Two people can point at the same shopping list. Copying the paper lets one person add milk without changing the other copy.",
    [
      "items = [2, 4]. alias = items shares the same list.",
      "copy = list(items) makes a separate outer list.",
      "Append 6 to copy. items is still [2, 4]; copy is [2, 4, 6].",
    ],
    "list(items) is a shallow copy. Nested lists are still shared; this exercise uses integers only.",
    q("a = [1]; b = a; b.append(2). What is a?", ["[1, 2]", "[1]", "[2]"], 0, "Both names refer to the same list, so both see its change."),
    "Write solve(items, value). Return a new integer list with value appended. Leave the original list unchanged.",
    "items, value",
    "def solve(items, value):\n    result = list(items)\n    result.append(value)\n    return result",
    [t([[2, 4], 6], [2, 4, 6]), t([[], 3], [3]), t([[-1], 0], [-1, 0])],
    "Copying n items takes O(n) time and space. Reading one known index takes O(1). Appending is amortized O(1): occasional resizing costs more, spread over many appends.",
    q(
      "Why does a full copy use more space than an alias?",
      ["It stores a new list of references", "An alias copies every element", "It sorts the values"],
      0,
      "An alias adds a name; a copy allocates a separate list."
    )
  ),
  unit(
    37,
    "Sets: remember what you have seen",
    "A set keeps each value once. Use it to ask whether something has appeared, without counting all earlier items again.",
    "At an event, stamp a ticket when it is used. The stamp answers “seen before?”; it does not record how many times.",
    [
      "Read [4, 2, 4]. Start with an empty seen set.",
      "4 is new: add it. 2 is new: add it.",
      "The next 4 is already there. There are two different values.",
    ],
    "Set iteration is not a sorted-order promise. Return a count here. Mutable lists cannot be set members; our keys are integers.",
    q("How many values are in set([2, 2, 3])?", ["2", "3", "1"], 0, "A set keeps only 2 and 3."),
    "Write solve(items) to count distinct integers using a set.",
    "items",
    "def solve(items):\n    seen = set()\n    for value in items:\n        seen.add(value)\n    return len(seen)",
    [t([[4, 2, 4]], 2), t([[]], 0), t([[-2, -2]], 1)],
    "Expected O(n) time and O(u) storage for u unique integer keys. Hash-based lookup is expected constant time, not an unconditional worst-case guarantee.",
    q(
      "What if you need a count for each word?",
      ["Use a map from word to count", "A set alone stores every count", "Sort the set backwards"],
      0,
      "A set answers membership. A dictionary can attach a count to each key."
    )
  ),
  unit(
    38,
    "Halving, doubling, and shared costs",
    "Repeatedly halving a problem needs only a few rounds. Doubling storage occasionally is expensive, but its cost is shared across many appends.",
    "Fold a strip in half repeatedly. A strip twice as long needs only one extra fold to reach the same small size.",
    [
      "Start with 8 candidates. Halve to 4.",
      "Halve to 2, then to 1: three rounds.",
      "Start with 16 instead: just one extra round. This is logarithmic growth.",
    ],
    "Amortized cost averages over a sequence of operations, not over random inputs. It is different from expected cost.",
    q("How many halving rounds turn 16 into 1?", ["4", "8", "16"], 0, "16 → 8 → 4 → 2 → 1 has four changes."),
    "Write solve(n) to count integer-halving rounds until n <= 1. n is a positive integer. Use n // 2 each round.",
    "n",
    "def solve(n):\n    rounds = 0\n    while n > 1:\n        n //= 2\n        rounds += 1\n    return rounds",
    [t([16], 4), t([1], 0), t([9], 3), t([2], 1)],
    "Starting at 8 takes 3 halving rounds. Starting at 16 takes 4. Doubling the start adds just one round. The function keeps only the current number and the round count.",
    q(
      "Can an occasional O(n) resize still allow amortized O(1) append?",
      ["Yes, when total work over n appends is O(n)", "No, every single append must be O(1)", "Only if inputs are random"],
      0,
      "Amortized analysis accounts for the whole sequence, including expensive resizes."
    )
  ),
  unit(
    39,
    "Recursion can branch",
    "A recursive call has its own waiting work. When a problem contains several smaller parts, call the same function for each part and combine their answers.",
    "A box can contain numbers and smaller boxes. Open each smaller box, count its contents, then return to the box you were working on.",
    ["For [2, [3, 4]], count 2 first.", "The inner list calls the same plan: 3 + 4 = 7.", "The outer call resumes and returns 2 + 7 = 9."],
    "Each call must reach a simpler case. Returning inside the loop would skip the remaining children.",
    q(
      "What is the base case for a nested list of integers?",
      ["An integer contributes its own value", "Every list contributes 1", "Call again with the same object"],
      0,
      "An integer needs no smaller recursive call."
    ),
    "Write solve(value) to sum all integers in a nested list, or return value itself if it is an integer. Nesting depth is at most 20.",
    "value",
    "def solve(value):\n    if isinstance(value, int):\n        return value\n    total = 0\n    for child in value:\n        total += solve(child)\n    return total",
    [t([[2, [3, 4]]], 9), t([[]], 0), t([[[[-2]], 5]], 3), t([7], 7)],
    "O(N) visits for N list entries and containers. O(h) waiting calls for nesting depth h. The call stack is real auxiliary space.",
    q(
      "Why can one call continue after its child returns?",
      ["Its stack frame remembers where it paused", "Every call starts the whole program again", "The child deletes its parent"],
      0,
      "A frame remembers local variables and the return position."
    )
  ),
  unit(
    40,
    "Draw a graph before exploring it",
    "A graph stores things and their connections. An adjacency list gives each thing a list of neighbors you can visit next.",
    "List each bus stop, then list the stops reachable by one direct ride. A one-way route needs only one arrow.",
    [
      "Vertices 0, 1, 2. Directed edges: [0,1] and [0,2].",
      "Make [[], [], []], one neighbor list per vertex.",
      "Append each destination to its source: [[1,2], [], []].",
    ],
    "For undirected edges, store both directions. A directed edge a → b does not automatically allow b → a.",
    q(
      "For a directed edge [1,2], which list receives 2?",
      ["The neighbor list for 1", "The neighbor list for 2", "Both automatically"],
      0,
      "A destination belongs to the outgoing-neighbor list of its source."
    ),
    "Write solve(n, edges) to build directed adjacency lists for vertices 0 through n-1. Preserve edge input order, including duplicate edges.",
    "n, edges",
    "def solve(n, edges):\n    graph = [[] for _ in range(n)]\n    for source, target in edges:\n        graph[source].append(target)\n    return graph",
    [
      t(
        [
          3,
          [
            [0, 1],
            [0, 2],
          ],
        ],
        [[1, 2], [], []]
      ),
      t([0, []], []),
      t(
        [
          2,
          [
            [1, 0],
            [1, 0],
          ],
        ],
        [[], [0, 0]]
      ),
    ],
    "O(V + E) time and storage to allocate V neighbor lists and store E directed edges. An adjacency matrix instead reserves V² entries.",
    q(
      "Why avoid graph = [[]] * n when adding edges?",
      ["The inner lists would be shared", "It creates a sorted graph", "It makes all edges undirected"],
      0,
      "Use a comprehension so each vertex owns a different neighbor list."
    )
  ),
  unit(
    41,
    "Build a heap: repair one path",
    "A min-heap puts every parent at or below its children. Add a value at the end, then move it up while it is smaller than its parent.",
    "A new urgent task joins the bottom of a priority tree. It trades places with a less urgent parent until the order is restored.",
    [
      "Heap [2,5,4]. Append 1: [2,5,4,1].",
      "At index 3, parent index is (3-1)//2 = 1. Swap 1 and 5.",
      "Now swap 1 and 2: [1,2,4,5]. Other branches stay valid.",
    ],
    "A heap is not a sorted list. Parent index is (i-1)//2; children are 2i+1 and 2i+2. Removing the root needs a downward repair.",
    q(
      "Which condition must a min-heap satisfy?",
      ["Each parent <= its children", "The entire list is sorted", "Every left child is smaller than every right child"],
      0,
      "The parent/child condition is enough to keep the minimum at the root."
    ),
    "Write solve(heap, value). Copy a valid min-heap of integers, insert value with upward swaps, and return the resulting list. Do not use heapq.",
    "heap, value",
    "def solve(heap, value):\n    result = list(heap)\n    result.append(value)\n    i = len(result) - 1\n    while i > 0:\n        parent = (i - 1) // 2\n        if result[parent] <= result[i]:\n            break\n        result[parent], result[i] = result[i], result[parent]\n        i = parent\n    return result",
    [t([[2, 5, 4], 1], [1, 2, 4, 5]), t([[], 7], [7]), t([[1, 2], 9], [1, 2, 9])],
    "The upward repair takes O(log n) comparisons. This exercise copies the input, so total time and extra space are O(n). An in-place push avoids that full copy.",
    q(
      "Why repair only one path?",
      ["Only ancestors of the new leaf can now violate the rule", "Every value must be sorted again", "All edges changed"],
      0,
      "Existing parent/child relationships outside that path have not changed."
    )
  ),
  unit(
    42,
    "A window that grows and shrinks",
    "When all values are positive, adding a value increases a sum and removing one decreases it. That lets a window grow until it reaches a target, then shrink to find a shorter answer.",
    "Collect consecutive daily sales until they cover a bill. Remove old days while the remaining total still covers it.",
    [
      "Values [2,3,1], target 4. Grow to [2,3]: sum 5, length 2.",
      "Remove 2: sum 3, too small. Grow by adding 1: sum 4.",
      "[3,1] also has length 2. No length-1 window works.",
    ],
    "This sum-based shrinking rule assumes positive values. Negatives can break the reasoning. Fixed-size windows do not require positivity.",
    q(
      "If a positive value is removed, what happens to the sum?",
      ["It decreases", "It increases", "It stays the same"],
      0,
      "That predictable change is the reason shrinking is safe here."
    ),
    "Write solve(items, target) to find the shortest nonempty consecutive run whose sum is at least target. Values and target are positive integers. Return 0 if no run works.",
    "items, target",
    "def solve(items, target):\n    start = total = 0\n    best = len(items) + 1\n    for end, value in enumerate(items):\n        total += value\n        while total >= target:\n            best = min(best, end - start + 1)\n            total -= items[start]\n            start += 1\n    return 0 if best > len(items) else best",
    [t([[2, 3, 1], 4], 2), t([[], 4], 0), t([[1, 1], 3], 0), t([[5, 1], 4], 1)],
    "O(n) time and O(1) space. Although one loop is inside another, each index enters once and leaves once, so total pointer movement is linear.",
    q(
      "Why is this not automatically O(n²)?",
      ["The left index moves at most n times in total", "Nested loops never cost O(n²)", "Positive numbers are always constant time"],
      0,
      "Count total movement across the run rather than multiplying loop syntax."
    )
  ),
  unit(
    43,
    "A window with a memory",
    "To keep a text segment free of repeated characters, remember the characters inside it. Remove old characters until a new character can safely enter.",
    "Keep a row of name badges with no repeated name. When a name repeats, remove badges from the front until that earlier name has gone.",
    [
      'Read a, then b: window is "ab", length 2.',
      "The next a repeats. Remove the old a, then add the new one.",
      'Window is now "ba", still length 2. No repeated character remains.',
    ],
    "A substring is consecutive. A subsequence may skip characters. Removing the wrong occurrence can leave the window invalid.",
    q(
      'In "aba", is "aa" a substring?',
      ["No; its letters are not consecutive", "Yes, because both letters appear", "Only if sorted first"],
      0,
      "The two a characters have a b between them."
    ),
    "Write solve(text) to return the longest substring length with no repeated character. Capitalization matters.",
    "text",
    "def solve(text):\n    seen = set()\n    start = best = 0\n    for end, char in enumerate(text):\n        while char in seen:\n            seen.remove(text[start])\n            start += 1\n        seen.add(char)\n        best = max(best, end - start + 1)\n    return best",
    [t(["aba"], 2), t([""], 0), t(["aaaa"], 1), t(["Aa!"], 3)],
    "Expected O(n) time: each character enters and leaves at most once. The set stores at most the number of distinct characters in the active window.",
    q(
      "Why does shrinking use while rather than if?",
      ["More than one old character may need to leave", "It must inspect every pair", "It sorts the window"],
      0,
      "Keep removing until the repeated character is no longer inside."
    )
  ),
  unit(
    44,
    "Reverse the links, not the values",
    "Remember the next node before changing its link. Point the current node backward, then move forward using the link you saved.",
    "Turn each arrow on a one-way trail around, carrying a note of where the original next stop was.",
    [
      "A → B → C. previous is None and current is A.",
      "Save B. Set A.next to None. Move previous to A and current to B.",
      "Repeat for B and C. The new head is C, followed by B then A.",
    ],
    "Changing current.next before saving it loses the remaining trail. This task changes links in the supplied nodes.",
    q(
      "What must be saved before reversing current.next?",
      ["The original next node", "Only the current value", "The list length"],
      0,
      "That saved reference is how you reach the rest of the original list."
    ),
    "Write solve(head) to reverse a singly linked list in place and return its new head. Nodes have value and next; an empty head is None.",
    "head",
    'def solve(head):\n    previous = None\n    current = head\n    while current is not None:\n        following = current["next"]\n        current["next"] = previous\n        previous, current = current, following\n    return previous',
    [
      t([{ value: 1, next: { value: 2, next: null } }], { value: 2, next: { value: 1, next: null } }),
      t([null], null),
      t([{ value: 4, next: null }], { value: 4, next: null }),
    ],
    "O(n) time and O(1) auxiliary traversal space. The nodes are reused; they are not copied into another list.",
    q(
      "Which node becomes the new head?",
      ["The original last node", "The original first node always", "A newly allocated node"],
      0,
      "At the end, previous points to the last node visited."
    )
  ),
  unit(
    45,
    "Binary search for a boundary",
    "Sometimes you need the first position that could hold a value, rather than an exact match. Keep a half-open range and move toward the first value at least as large as the target.",
    "Find where a new book belongs on a sorted shelf, including before existing copies of that book.",
    [
      "For [2,4,4,8], target 4, the answer is index 1.",
      "If middle value >= 4, keep searching to its left, including that position.",
      "When left == right, that position is the insertion boundary. It may equal the list length.",
    ],
    "right starts at len(items), not len(items)-1. Never read items[right] when right equals the length.",
    q("What is the first insertion position for 9 in [2,4]?", ["2", "1", "-1"], 0, "Both existing values are smaller; insert after them."),
    "Write solve(items, target) for sorted integers with possible duplicates. Return the first index whose value is >= target, or len(items) if none exists. Do not use bisect.",
    "items, target",
    "def solve(items, target):\n    left, right = 0, len(items)\n    while left < right:\n        mid = (left + right) // 2\n        if items[mid] < target:\n            left = mid + 1\n        else:\n            right = mid\n    return left",
    [t([[2, 4, 4, 8], 4], 1), t([[], 4], 0), t([[2, 4], 9], 2), t([[2, 4], 1], 0)],
    "O(log n) time and O(1) space. The loop preserves: values before left are too small; values at or beyond right meet the boundary rule.",
    q(
      "Why keep mid when its value equals the target?",
      ["An earlier equal value might exist", "The list must be unsorted", "We need the last occurrence"],
      0,
      "Exact equality does not establish the first qualifying position."
    )
  ),
  unit(
    46,
    "Insert into a search tree",
    "Use the ordering promise to find an empty child position. Attach a new node there; ignore a key that already exists.",
    "Follow smaller/larger signs until there is an empty shelf slot. Put the new book there without moving every other book.",
    [
      "Root 5, left child 2. Insert 4.",
      "4 is smaller than 5, so go left. It is larger than 2, so go right.",
      "That child is empty. Attach node 4 there.",
    ],
    "A plain BST is not automatically balanced. Sorted insertions can build a chain.",
    q(
      "Where does a new 6 go when root is 5 and the right child is empty?",
      ["As the right child", "As the left child", "Above the root"],
      0,
      "6 is larger than 5, so the ordering rule sends it right."
    ),
    "Write solve(root, value) to insert an integer into a BST and return the root. Nodes have value, left, right. Ignore duplicates. You may change the tree.",
    "root, value",
    'def solve(root, value):\n    if root is None:\n        return {"value": value, "left": None, "right": None}\n    if value < root["value"]:\n        root["left"] = solve(root["left"], value)\n    elif value > root["value"]:\n        root["right"] = solve(root["right"], value)\n    return root',
    [t([node(5, node(2)), 4], node(5, node(2, null, node(4)))), t([null, 3], node(3)), t([node(3), 3], node(3))],
    "O(h) time and recursive stack space for height h. Balancing can keep h logarithmic; this ordinary insertion does not perform rotations.",
    q(
      "What happens if you insert 1,2,3,4 into an empty plain BST?",
      ["It can become a right-sided chain", "It must be perfectly balanced", "The keys become invalid"],
      0,
      "Without balancing, every new key follows the same rightward path."
    )
  ),
  unit(
    47,
    "Tree height: combine child answers",
    "An empty tree has height 0. Any other tree has one level plus the taller of its two children.",
    "To measure a family tree, ask each child how many generations are below them, then add the current generation.",
    [
      "A leaf has two empty children: max(0,0) + 1 = 1.",
      "A root above that leaf has height 2.",
      "A long one-sided branch still counts one level per node.",
    ],
    "Height conventions differ. Here we count nodes on the longest root-to-leaf path, so empty is 0.",
    q("What height does one node have in this lesson?", ["1", "0", "2"], 0, "Count that one node, with no lower levels."),
    "Write solve(root) to return tree height measured in nodes. Empty root is None; nodes have value, left, right.",
    "root",
    'def solve(root):\n    if root is None:\n        return 0\n    return 1 + max(solve(root["left"]), solve(root["right"]))',
    [t([node(2, node(1), node(3))], 2), t([null], 0), t([node(1, null, node(2, null, node(3)))], 3)],
    "O(n) visits and O(h) call-stack space. Each subtree returns one answer; no node needs to be visited repeatedly.",
    q(
      "Why use max rather than adding the child heights?",
      ["Height follows the longer single path", "Height counts every node", "The shorter branch is always empty"],
      0,
      "A root-to-leaf path follows one child at each step."
    )
  ),
  unit(
    48,
    "Memoization: keep a small answer",
    "First write the smaller-problem rule. If the same input appears again, reuse its saved answer instead of solving it again.",
    "When several callers ask for the same fare, write it down after calculating it once.",
    [
      "For stairs, ways(4) asks for ways(3) and ways(2).",
      "ways(3) also asks for ways(2). That work repeats.",
      "Cache each n. The second ways(2) reads the saved answer. ways(4) is 5.",
    ],
    "The cache key must describe the whole subproblem. A cache from a different input problem may hold unrelated answers.",
    q(
      "What should the cache store for stairs with 1- or 2-step moves?",
      ["n → number of ways for n", "Only the final answer for 40", "A different random key each time"],
      0,
      "Repeated calls with the same n share the same answer."
    ),
    "Write solve(n) using a memoized recursive helper to count ways to climb n steps with moves of 1 or 2. n is 0–35; ways(0)=1.",
    "n",
    "def solve(n):\n    cache = {0: 1, 1: 1}\n    def ways(k):\n        if k not in cache:\n            cache[k] = ways(k-1) + ways(k-2)\n        return cache[k]\n    return ways(n)",
    [t([4], 5), t([0], 1), t([1], 1), t([8], 34)],
    "O(n) computed states, O(1) transitions per state, and O(n) cache plus stack space. Plain uncached recursion repeats overlapping work exponentially.",
    q(
      "Why is memoization faster here?",
      ["Each distinct n is calculated once", "Recursion itself is always constant time", "It avoids all function calls"],
      0,
      "Calls may repeat, but cached calls return without another expansion."
    )
  ),
  unit(
    49,
    "DP tables: fill dependencies first",
    "A table is another way to save small answers. Fill each cell only after the cells it needs are ready.",
    "On a city grid, count routes to each corner. Every arrival came from the corner above or from the left.",
    [
      "In a 2×3 grid, the first row and first column each have one route.",
      "The next inner cell has 1 + 1 = 2 routes.",
      "The final cell has 1 + 2 = 3. Its dependencies were already filled.",
    ],
    "Use separate rows. [[0]*cols]*rows shares the same row, so updating one cell can change several rows.",
    q(
      "Which cells does a right/down route count depend on?",
      ["Above and left", "Below and right", "Every cell in the grid"],
      0,
      "The last move must enter from one of those two places."
    ),
    "Write solve(rows, cols) to count routes from top-left to bottom-right using only right/down moves. Dimensions are 0–15. Return 0 for an empty grid. Use a 2D table.",
    "rows, cols",
    "def solve(rows, cols):\n    if rows == 0 or cols == 0:\n        return 0\n    dp = [[0] * cols for _ in range(rows)]\n    dp[0][0] = 1\n    for r in range(rows):\n        for c in range(cols):\n            if r > 0:\n                dp[r][c] += dp[r-1][c]\n            if c > 0:\n                dp[r][c] += dp[r][c-1]\n    return dp[-1][-1]",
    [t([2, 3], 3), t([0, 3], 0), t([1, 1], 1), t([3, 3], 6)],
    "O(rows × cols) work and table space. A table makes the dependencies visible. Reduce it to one row only after understanding which older values remain needed.",
    q(
      "Why does top-to-bottom, left-to-right filling work?",
      ["Above and left answers are already ready", "The table is sorted alphabetically", "The final cell has no dependencies"],
      0,
      "The loop order follows the direction of the recurrence."
    )
  ),
  unit(
    50,
    "Knapsack: see the item stages",
    "For each item and carrying limit, compare leaving the item with taking it once. Read the smaller-limit answer from the previous item row.",
    "Pack a hiking bag one item at a time. Each row records what you can achieve with the items considered so far.",
    [
      "Weight 2/value 3, weight 3/value 4. Capacity 5.",
      "After the first item, capacity 5 can hold value 3.",
      "In the second row, taking item 2 adds 4 to the previous-row answer at capacity 2: 4 + 3 = 7.",
    ],
    "Reading from the current row can allow reuse. A 0/1 item may be used at most once.",
    q(
      "When taking an item, which row supplies the remaining-capacity answer?",
      ["The previous item row", "The final row before it is computed", "The same cell"],
      0,
      "The previous row excludes the current item, preventing a second use."
    ),
    "Write solve(weights, values, capacity) for 0/1 knapsack using a 2D table. Positive weights, nonnegative values, equal list lengths, capacity 0–50. Return maximum value.",
    "weights, values, capacity",
    "def solve(weights, values, capacity):\n    dp = [[0] * (capacity+1) for _ in range(len(weights)+1)]\n    for i, (weight, value) in enumerate(zip(weights, values), 1):\n        for c in range(capacity+1):\n            dp[i][c] = dp[i-1][c]\n            if weight <= c:\n                dp[i][c] = max(dp[i][c], value + dp[i-1][c-weight])\n    return dp[-1][capacity]",
    [t([[2, 3], [3, 4], 5], 7), t([[], [], 4], 0), t([[2], [3], 4], 3), t([[5], [9], 0], 0)],
    "O(nC) time and O(nC) table space for n items and capacity C. This depends on the numeric capacity, so it is pseudo-polynomial rather than polynomial in its bit length.",
    q(
      "Why is descending capacity needed in a later 1D version?",
      ["It preserves the previous-item values until read", "It sorts the weights", "It allows unlimited reuse"],
      0,
      "Ascending updates can read a value that already includes the current item."
    )
  ),
  unit(
    51,
    "Monotonic stacks: settle waiting answers",
    "Keep unresolved positions in a stack. When a larger value arrives, it answers every smaller value waiting at the top.",
    "Each cool day waits for its next warmer day. A warm day can settle several waiting days at once.",
    [
      "Values [2,1,3]. Push indices 0 then 1.",
      "3 is greater than 1: settle index 1 with answer 3.",
      "3 is also greater than 2: settle index 0. No greater value follows 3.",
    ],
    "Store positions if you need to update earlier answers. For strictly greater answers, equal values must keep waiting.",
    q(
      "In [2,2,3], does the second 2 settle the first 2?",
      ["No; equal is not greater", "Yes, always", "Only after sorting"],
      0,
      "The contract asks for a strictly greater later value."
    ),
    "Write solve(items) to return the next strictly greater value to the right of each integer. Use None when none exists. Use a stack.",
    "items",
    "def solve(items):\n    result = [None] * len(items)\n    waiting = []\n    for i, value in enumerate(items):\n        while waiting and items[waiting[-1]] < value:\n            result[waiting.pop()] = value\n        waiting.append(i)\n    return result",
    [t([[2, 1, 3]], [3, 3, null]), t([[]], []), t([[2, 2, 1]], [null, null, null]), t([[-2, -1]], [-1, null])],
    "O(n) time and O(n) space. Every position is pushed once and popped at most once, even though some iterations pop several entries.",
    q(
      "What makes the total pop count linear?",
      ["No position can be popped twice", "Every loop runs exactly once", "The values must be positive"],
      0,
      "Each popped position is finished and never re-enters the waiting stack."
    )
  ),
  unit(
    52,
    "Merge overlapping ranges",
    "Sort ranges by their start. Extend the last result if the next range overlaps; otherwise start a separate result.",
    "Combine overlapping appointment blocks into the time you are busy, without counting the same minute twice.",
    ["Ranges [1,3], [2,5], [8,9].", "[2,5] overlaps [1,3], so extend the end to 5.", "[8,9] starts after 5. Result: [[1,5],[8,9]]."],
    "Merging intervals is different from selecting non-overlapping intervals. Here touching closed endpoints count as overlap.",
    q("How should [1,3] and [3,4] merge here?", ["[1,4]", "Keep both separate", "[3,3]"], 0, "These closed ranges share endpoint 3."),
    "Write solve(intervals) to merge closed integer ranges [start,end], start <= end. Return ranges sorted by start, treating touching endpoints as overlap.",
    "intervals",
    "def solve(intervals):\n    result = []\n    for start, end in sorted(intervals):\n        if result and start <= result[-1][1]:\n            result[-1][1] = max(result[-1][1], end)\n        else:\n            result.append([start,end])\n    return result",
    [
      t(
        [
          [
            [1, 3],
            [2, 5],
            [8, 9],
          ],
        ],
        [
          [1, 5],
          [8, 9],
        ]
      ),
      t([[]], []),
      t(
        [
          [
            [3, 4],
            [1, 3],
          ],
        ],
        [[1, 4]]
      ),
      t(
        [
          [
            [1, 9],
            [2, 3],
          ],
        ],
        [[1, 9]]
      ),
    ],
    "O(n log n) time due to sorting and O(n) auxiliary/output space in this allocating Python version. The scan after sorting is linear.",
    q(
      "Why sort by start first?",
      [
        "Any overlapping next range can be compared with the last merged range",
        "It makes every interval the same length",
        "It removes the need to inspect endpoints",
      ],
      0,
      "Earlier separated ranges can no longer overlap a later start."
    )
  ),
  unit(
    53,
    "Bits: cancel matching pairs",
    "XOR compares binary digits. Equal digits cancel to 0. Because x XOR x is 0, pairs cancel and an unpaired value remains.",
    "Imagine matching identical cards into pairs. Remove every pair and see which card is left.",
    ["For [5,2,5], start answer = 0.", "XOR 5, then 2, then 5. The two 5 values cancel.", "The remaining answer is 2. Pair order does not matter."],
    "This works only under the stated pairing rule. It does not find a generally most frequent value. Python uses arbitrary-size integers.",
    q("What is 7 XOR 7?", ["0", "7", "14"], 0, "Matching bits cancel at every position."),
    "Write solve(items) for a nonempty list where every integer appears twice except one appearing once. Return the unpaired value using XOR.",
    "items",
    "def solve(items):\n    answer = 0\n    for value in items:\n        answer ^= value\n    return answer",
    [t([[5, 2, 5]], 2), t([[7]], 7), t([[0, -3, 0]], -3)],
    "O(n) fixed-width XOR operations and O(1) extra machine words. For unbounded integers, bit lengths also affect work and storage.",
    q(
      "Can the same cancellation rule solve [4,4,4,7]?",
      ["No; 4 appears three times", "Yes, every frequency is allowed", "Only if sorted first"],
      0,
      "The proof relied on pairs. A third copy does not cancel."
    )
  ),
  unit(
    54,
    "Hash collisions: different keys, same bucket",
    "A hash table chooses a bucket for each key. Different keys may choose the same bucket, so the bucket must still compare the actual keys.",
    "Two people can share a locker number. Their name tags still tell you which parcel belongs to whom.",
    [
      "With 3 buckets, key 1 goes to bucket 1 because 1 % 3 = 1.",
      "Key 4 also goes to bucket 1. That is a collision, not the same key.",
      "Keep both in that bucket. Adding key 1 again should not create another distinct key.",
    ],
    "A hash value is not a unique identity. A poor distribution can put every key in one bucket.",
    q(
      "If keys 1 and 4 use bucket 1, must they be equal?",
      ["No; a bucket can hold distinct keys", "Yes, always", "Only in Python"],
      0,
      "Hash collisions are allowed, so a lookup must check the key itself."
    ),
    "Write solve(keys, bucket_count). bucket_count > 0. Using integer key % bucket_count, return distinct keys in each bucket in first-seen order. Compare keys within their bucket.",
    "keys, bucket_count",
    "def solve(keys, bucket_count):\n    buckets = [[] for _ in range(bucket_count)]\n    for key in keys:\n        bucket = buckets[key % bucket_count]\n        if key not in bucket:\n            bucket.append(key)\n    return buckets",
    [t([[1, 4, 1, 2], 3], [[], [1, 4], [2]]), t([[], 2], [[], []]), t([[-1, 2], 3], [[], [], [-1, 2]])],
    "With well-distributed keys and controlled load, short buckets permit expected fast lookups. This fixed-size teaching table can degrade to O(n²) total insertion comparisons when all distinct keys collide.",
    q(
      "Why resize or improve distribution as a hash table grows?",
      ["To keep lookup chains short", "To guarantee no two keys ever collide", "To sort the keys"],
      0,
      "Expected fast operations rely on controlling average bucket occupancy."
    )
  ),
  unit(
    55,
    "Fast and slow pointers: find a cycle",
    "Move one pointer by one link and another by two. If they meet on a circular trail, there is a cycle. If the faster one reaches the end, there is no cycle.",
    "Two runners move around a circular track at different speeds. The faster one eventually catches the slower one.",
    [
      "Represent links as next_index = [1,2,1]; start at index 0.",
      "Slow moves one link and fast two each round. The trail loops 1 → 2 → 1.",
      "They eventually meet. A None link instead marks the end of a non-circular trail.",
    ],
    "Check that the fast pointer and its next link exist before moving twice. The starting equality does not itself prove a cycle.",
    q(
      "Can you report a cycle just because both pointers start at the head?",
      ["No; move them before checking for a meeting", "Yes, every list has a cycle", "Only for a one-node list"],
      0,
      "Initial equality is part of initialization, not evidence of revisiting a node."
    ),
    "Write solve(next_index, start). Each array position is a node; its value is the next index or None. Return whether the path from start has a cycle using O(1) extra space. start may be None.",
    "next_index, start",
    "def solve(next_index, start):\n    slow = fast = start\n    while fast is not None and next_index[fast] is not None:\n        slow = next_index[slow]\n        fast = next_index[next_index[fast]]\n        if slow == fast:\n            return True\n    return False",
    [t([[1, 2, 1], 0], true), t([[1, null], 0], false), t([[], null], false), t([[0], 0], true)],
    "O(n) link visits before ending or detecting a meeting, and O(1) pointer storage. A visited set also detects cycles but uses O(n) space.",
    q(
      "What is the main memory tradeoff against a visited set?",
      ["Pointers avoid storing every visited node", "Pointers store two full copies", "The set uses no extra space"],
      0,
      "Only the two current positions are needed by this meeting method."
    )
  ),
  unit(
    56,
    "Negative edges: relax more than once",
    "When an edge can have negative cost, a later detour can improve a distance you thought was finished. Bellman–Ford revisits every edge to spread improvements.",
    "A travel rebate can make a longer route cheaper. You cannot finalize a city just because its current price is the lowest.",
    [
      "Edges 0→1 cost 4, 0→2 cost 5, 2→1 cost -3.",
      "The route through 2 costs 2, improving the direct cost 4.",
      "After V-1 edge passes, a further improvement signals a reachable negative-cost cycle.",
    ],
    "Only relax from reachable nodes. A negative cycle reachable from start means finite shortest distances cannot be reported for every reachable vertex.",
    q(
      "Why is ordinary Dijkstra unsafe with negative edges?",
      ["A later route may improve a finalized distance", "All routes become cycles", "A heap cannot store negatives"],
      0,
      "The issue is the finalization proof, not the heap representation."
    ),
    "Write solve(n, edges, start). n >= 1; directed edges are [a,b,weight]. Return shortest distances from start, with None for unreachable vertices. Return [] if a negative cycle is reachable from start.",
    "n, edges, start",
    'def solve(n, edges, start):\n    distance = [float("inf")] * n\n    distance[start] = 0\n    for _ in range(n-1):\n        changed = False\n        for a,b,w in edges:\n            if distance[a] != float("inf") and distance[a]+w < distance[b]:\n                distance[b] = distance[a]+w\n                changed = True\n        if not changed:\n            break\n    for a,b,w in edges:\n        if distance[a] != float("inf") and distance[a]+w < distance[b]:\n            return []\n    return [None if d == float("inf") else d for d in distance]',
    [
      t(
        [
          3,
          [
            [0, 1, 4],
            [0, 2, 5],
            [2, 1, -3],
          ],
          0,
        ],
        [0, 2, 5]
      ),
      t([2, [], 0], [0, null]),
      t(
        [
          2,
          [
            [0, 1, 1],
            [1, 0, -2],
          ],
          0,
        ],
        []
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
        [0, null, null]
      ),
    ],
    "O(VE + V) worst-case time and O(V) extra distance storage, excluding input. The extra edge pass tests for reachable negative cycles.",
    q(
      "Should an unreachable negative cycle make this task return []?",
      ["No; only cycles reachable from start matter", "Yes, any cycle anywhere", "Only if its labels are sorted"],
      0,
      "Distances from start cannot use a completely disconnected cycle."
    )
  ),
  unit(
    57,
    "Fenwick trees: sums that can change",
    "Prefix sums are fast until values change. A Fenwick tree stores overlapping blocks so an update and a prefix query each touch only logarithmically many blocks.",
    "Keep subtotal boxes of sizes 1, 2, 4, and so on. To change one sale, adjust just the boxes that include it.",
    [
      "Use 1-based internal indices. lowbit(i) = i & -i selects a block size.",
      "To add at i, update i and keep moving to i + lowbit(i).",
      "To query the first k items, add block k and move to k - lowbit(k) until zero.",
    ],
    "Internal index zero would not advance during updates. Convert a zero-based item index to i+1.",
    q(
      "What index should represent input position 0 inside the tree?",
      ["1", "0", "-1"],
      0,
      "The tree uses a 1-based representation to make lowbit movement work."
    ),
    'Write solve(items, operations). Implement a Fenwick tree. ["add",i,delta] changes item i. ["prefix",k] asks for the sum of the first k items. Indices/counts are valid. Return query answers.',
    "items, operations",
    'def solve(items, operations):\n    tree = [0] * (len(items)+1)\n    def add(i, delta):\n        i += 1\n        while i < len(tree):\n            tree[i] += delta\n            i += i & -i\n    def prefix(k):\n        total = 0\n        while k > 0:\n            total += tree[k]\n            k -= k & -k\n        return total\n    for i,v in enumerate(items):\n        add(i,v)\n    result = []\n    for op in operations:\n        if op[0] == "add":\n            add(op[1],op[2])\n        else:\n            result.append(prefix(op[1]))\n    return result',
    [
      t(
        [
          [2, 3],
          [
            ["prefix", 2],
            ["add", 0, 4],
            ["prefix", 1],
          ],
        ],
        [5, 6]
      ),
      t([[], [["prefix", 0]]], [0]),
      t(
        [
          [-2, 5],
          [
            ["add", 1, -3],
            ["prefix", 2],
            ["prefix", 0],
          ],
        ],
        [0, 0]
      ),
    ],
    "This repeated-update build takes O(n log n), followed by O(log n) per operation. Tree storage is O(n), excluding query output. A more advanced linear build is possible.",
    q(
      "When are static prefix sums simpler?",
      ["Many queries with no value changes", "Every operation changes all values", "They are never useful"],
      0,
      "Without updates, static prefix queries take O(1) after an O(n) build."
    )
  ),
  unit(
    58,
    "KMP: reuse a matched beginning",
    "When text matching fails partway through, do not forget everything. A prefix table tells you how much of the matched ending is also a valid new beginning.",
    "While finding a repeated rhythm, a wrong beat may still leave the beginning of the rhythm already heard.",
    [
      'Pattern "abab" has prefix lengths [0,0,1,2].',
      'After matching "aba", a mismatch can fall back to the shorter reusable beginning.',
      "Every fallback shortens the current match; the text pointer does not move backward.",
    ],
    "A prefix-table entry is a length, not a text index. Reuse pi[j-1] on mismatch; do not restart the entire text scan.",
    q(
      'For pattern "abab", how long is the proper prefix that is also a suffix?',
      ['2 ("ab")', "4 (the entire pattern)", '3 ("aba")'],
      0,
      'A proper prefix excludes the whole pattern; "ab" matches both ends.'
    ),
    "Write solve(text, pattern) using KMP to return the first match index, or -1. An empty pattern matches at index 0. Do not use find() or index().",
    "text, pattern",
    "def solve(text, pattern):\n    if not pattern:\n        return 0\n    pi = [0] * len(pattern)\n    j = 0\n    for i in range(1,len(pattern)):\n        while j and pattern[i] != pattern[j]:\n            j = pi[j-1]\n        if pattern[i] == pattern[j]:\n            j += 1\n        pi[i] = j\n    j = 0\n    for i,char in enumerate(text):\n        while j and char != pattern[j]:\n            j = pi[j-1]\n        if char == pattern[j]:\n            j += 1\n        if j == len(pattern):\n            return i-j+1\n    return -1",
    [t(["zzababx", "abab"], 2), t(["aaaab", "aab"], 2), t(["abc", ""], 0), t(["abc", "d"], -1)],
    "O(n+m) time for text length n and pattern length m, with O(m) prefix-table space. Fallback movement is amortized linear, not a full rescan per position.",
    q(
      "Why can the text pointer keep moving forward?",
      ["The prefix table preserves possible partial matches", "Every character is unique", "The pattern must already be sorted"],
      0,
      "Reuse matching structure instead of rechecking the same text prefix."
    )
  ),
  unit(
    59,
    "Euclid: keep the common divisors",
    "The greatest common divisor of a and b is unchanged when you replace a with b and b with the remainder a % b. Repeat until the remainder is zero.",
    "To cut two ribbon lengths into equal pieces without leftovers, keep removing whole copies of the shorter length.",
    ["For 18 and 12: 18 % 12 = 6. Now compare 12 and 6.", "12 % 6 = 0. No remainder remains.", "The greatest common divisor is 6."],
    "Use absolute values for negative inputs. This lesson defines gcd(0,0)=0, matching Python’s convention.",
    q(
      "What replaces the pair (18,12) after one Euclid step?",
      ["(12,6)", "(6,18)", "(18,0)"],
      0,
      "The new pair is the old second value and the remainder."
    ),
    "Write solve(a, b) to return the nonnegative greatest common divisor using Euclid’s loop, without math.gcd().",
    "a, b",
    "def solve(a, b):\n    a,b = abs(a),abs(b)\n    while b:\n        a,b = b,a % b\n    return a",
    [t([18, 12], 6), t([0, 0], 0), t([-15, 10], 5), t([7, 0], 7)],
    "O(log(min(|a|,|b|))) remainder steps for positive inputs, with boundary cases for zero; O(1) integer variables. Large-integer remainder operations have additional bit complexity.",
    q(
      "What makes the loop terminate?",
      ["The nonnegative remainder is smaller than the positive divisor", "The values always increase", "It uses recursion"],
      0,
      "The second value decreases until it becomes zero."
    )
  ),
];

export const stages = [
  ["Make the rules clear", "Positions, correctness, and the cost of a plan.", "Foundations", "◎", [36, 0, 1, 2, 38]],
  ["Remember and compare", "Lists, strings, sets, maps, and useful repeated work.", "Arrays & hashing", "▦", [12, 37, 54, 13, 3, 4, 42, 43, 5]],
  ["Search and put things in order", "Sorted input, boundaries, insertion, and merging.", "Search & sort", "↗", [6, 45, 7, 8, 52]],
  ["Follow links and waiting work", "Stacks, queues, linked nodes, and pointer movement.", "Linear structures", "▤", [9, 10, 11, 44, 55, 51]],
  ["Solve smaller problems", "Waiting calls, branching choices, and combining results.", "Recursion & choices", "⌘", [14, 39, 24, 25, 26, 59]],
  ["Think in branches", "Trees, search trees, heap operations, and word prefixes.", "Trees & heaps", "♧", [15, 47, 16, 46, 41, 17, 27]],
  ["Explore a network", "Represent connections, explore them, and rebuild a route.", "Graph foundations", "⌁", [40, 18, 19, 23]],
  ["Make careful choices", "Justify greedy choices and extend graph reasoning.", "Graphs & greedy", "◇", [20, 28, 29, 31, 30, 56, 32]],
  [
    "Save smaller answers",
    "Move from recursive calls to caches, tables, and reconstruction.",
    "Dynamic programming",
    "◈",
    [48, 49, 21, 22, 34, 33, 50, 35],
  ],
  ["Useful next techniques", "Bits, changing range sums, and fast text search.", "Extensions", "✧", [53, 57, 58]],
];
export const requirements = {
  36: [],
  0: [36],
  1: [0],
  2: [1],
  38: [2],
  12: [36, 2],
  37: [12],
  54: [12, 37, 38],
  13: [12, 37],
  3: [36, 2],
  4: [1, 36],
  42: [4, 3],
  43: [37, 12, 4],
  5: [1, 36],
  6: [0, 38],
  45: [6],
  7: [1, 2],
  8: [3, 7],
  52: [7, 3],
  9: [2],
  10: [2],
  11: [36, 12],
  44: [11],
  55: [11],
  51: [9, 38],
  14: [9, 1],
  39: [14],
  24: [8, 39],
  25: [24],
  26: [39, 9],
  59: [38, 14],
  15: [11, 39],
  47: [15, 10],
  16: [15, 6],
  46: [16, 39],
  41: [15, 36, 38],
  17: [41],
  27: [12, 15],
  40: [12, 37, 10],
  18: [40, 10],
  19: [40, 9],
  23: [18, 12],
  20: [7, 38],
  28: [15, 40, 38],
  29: [28],
  31: [40, 10, 17],
  30: [17, 18, 12],
  56: [30, 40],
  32: [28, 29, 20, 7],
  48: [39],
  49: [48, 36],
  21: [48, 49],
  22: [21, 20],
  34: [21],
  33: [49, 22],
  50: [49, 22, 26],
  35: [50],
  53: [37, 38],
  57: [5, 53],
  58: [3, 38],
};
export const futureTracks = [
  ["Storage and scale", "B-trees, external-memory analysis, cache-aware layouts, persistent data structures, and parallel algorithms."],
  [
    "Further graph and tree methods",
    "Blossom matching, min-cost flow, heavy-light decomposition, Euler-tour range methods, and dynamic graph algorithms.",
  ],
  [
    "Specialist string and numeric methods",
    "Suffix arrays and automata, FFT, polynomial algorithms, segmented sieves, and probabilistic streaming sketches.",
  ],
  [
    "Deeper theory",
    "Probabilistic proofs, concentration bounds, advanced reductions, approximation hardness, and complexity classes beyond the introductory P/NP discussion.",
  ],
];
