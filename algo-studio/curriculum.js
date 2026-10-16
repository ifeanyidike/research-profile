import { additions, stages, requirements, futureTracks } from "./course-extension.js";
import { applyPlainLanguage } from "./lesson-language.js?v=20261016-clarity1";
export { futureTracks };
export const modules = [
  ["Think like a problem solver", "Start with a plan. Make it correct. Understand its cost.", "Foundations", "◎"],
  ["Make arrays work for you", "Find useful patterns hiding in everyday lists.", "Arrays & patterns", "▦"],
  ["Find it. Then put it in order.", "Search less and sort with a clear strategy.", "Search & sort", "↗"],
  ["Choose the right container", "Give your data a structure that fits the job.", "Data structures", "▤"],
  ["Remember work. Break it down.", "Use fast lookups and solve smaller problems.", "Hashing & recursion", "⌘"],
  ["Think in branches", "Explore hierarchies and keep important items close.", "Trees & heaps", "♧"],
  ["Connect the dots", "Explore networks and make careful local choices.", "Graphs & greedy", "⌁"],
  ["Build up to the big answer", "Reuse smaller answers. Put your skills together.", "Dynamic programming", "◈"],
];
const q = (prompt, options, answer, why) => ({ prompt, options, answer, why });
const t = (args, expected) => ({ args, expected });
function lesson(id, title, analogy, idea, walk, trap, predict, task, starter, solution, tests, hints, cost, reflect) {
  return {
    id,
    title,
    analogy,
    idea,
    walk,
    trap,
    predict,
    task,
    starter,
    solution,
    tests,
    hints,
    cost,
    reflect,
    module: Math.floor(id / 3),
    minutes: 12 + (id % 3) * 3,
  };
}
export const lessons = [
  lesson(
    0,
    "An algorithm is a plan",
    "You are checking a shopping list for milk. Start at the top, read one item, and stop when you find it. That small, repeatable plan is an algorithm.",
    "An algorithm takes an input and follows clear steps to produce an output. First decide exactly what the answer should look like. Here, return the first matching index. Python starts counting at 0. If nothing matches, return -1.",
    [
      'Input: ["bread", "milk", "eggs"], target: "milk".',
      "Check index 0: bread is not milk. Keep going.",
      "Check index 1: milk matches. Return 1. Stop.",
    ],
    "Returning -1 inside the loop stops after the first mismatch. Only return -1 after you have checked every item.",
    q(
      'Where is "tea" in ["rice", "tea", "tea"]?',
      ["Index 1", "Index 2", "Index 0"],
      0,
      "The first match is at index 1. A clear output rule removes ambiguity."
    ),
    "Write solve(items, target). Return the first index containing target, or -1 if it is absent. Use a loop so you can see each step.",
    "def solve(items, target):\n    # Check items one at a time.\n    pass",
    "def solve(items, target):\n    for i, item in enumerate(items):\n        if item == target:\n            return i\n    return -1",
    [t([["bread", "milk", "eggs"], "milk"], 1), t([[], "tea"], -1), t([["tea", "tea"], "tea"], 0), t([["rice"], "tea"], -1)],
    ["Use enumerate(items) to get an index and a value.", "Return i when item == target. Put return -1 after the loop."],
    "Worst case: O(n) time, O(1) extra space. With n items, you may check all n. Finding the first item takes one check.",
    q(
      "If the target is missing from 100 items, how many items must this plan check?",
      ["1", "100", "50"],
      1,
      "Without extra information, any unchecked item could be the target."
    )
  ),
  lesson(
    1,
    "Correctness before cleverness",
    "A recipe is not reliable just because it worked once. Try it with one portion, no portions, and unusual ingredients. Code needs the same care.",
    "A test is one example of a rule your solution must obey. Tests can reveal bugs, but a few passing tests do not prove every input works. An invariant is a fact that stays true as your loop runs. For a running total, the total must equal the sum of all values seen so far.",
    ["Input: [4, -2, 3]. Start total = 0.", "After 4, total = 4. After -2, total = 2.", "After 3, total = 5. An empty list keeps total = 0."],
    "Starting with items[0] crashes on empty input. Start with the identity value for addition: 0.",
    q(
      "What should the total of an empty list be?",
      ["None", "0", "An error"],
      1,
      "Starting at 0 handles empty input and gives the expected additive result."
    ),
    "Write solve(items) to add every integer without using sum(). Include negative values and empty lists.",
    "def solve(items):\n    total = 0\n    # Keep total equal to the sum seen so far.\n    return total",
    "def solve(items):\n    total = 0\n    for value in items:\n        total += value\n    return total",
    [t([[4, -2, 3]], 5), t([[]], 0), t([[-3, -7]], -10), t([[0, 8, 0]], 8)],
    ["Update total once for every value.", "The invariant is: total equals the sum of the processed prefix."],
    "O(n) time and O(1) extra space. One accumulator is enough, regardless of list length.",
    q(
      "What does passing four tests establish?",
      ["Correctness for every possible input", "Correctness for those four inputs", "The fastest possible algorithm"],
      1,
      "Use tests together with reasoning about the invariant and input contract."
    )
  ),
  lesson(
    2,
    "Big O without the big words",
    "Looking for your seat number on a ticket takes one glance. Looking for a friend in a row of seats may mean checking every seat.",
    "Big O describes how work grows as the input grows. O(1) stays bounded, O(n) grows in proportion to n, and O(n²) can grow like all pairs of n items. Ignore fixed multipliers when naming the growth class. Time is work; extra space is additional memory.",
    [
      "To find the largest value in [3, 9, 4], remember 3.",
      "Compare 9 with 3. Remember 9. Compare 4 with 9. Keep 9.",
      "For n nonempty items, this takes n - 1 comparisons. Doubling n roughly doubles the work.",
    ],
    "Two separate loops over n items are O(n), not O(n²). Nested loops can be quadratic when each visits roughly n items.",
    q(
      "An algorithm checks every item twice. What is its growth class?",
      ["O(n)", "O(n²)", "O(1)"],
      0,
      "2n grows linearly. Big O ignores the fixed factor 2."
    ),
    "Write solve(items) to find the maximum using comparisons. Return None for an empty list. Do not use max() or sorting.",
    "def solve(items):\n    if not items:\n        return None\n    best = items[0]\n    # Compare the remaining values.\n    return best",
    "def solve(items):\n    if not items:\n        return None\n    best = items[0]\n    for i in range(1, len(items)):\n        if items[i] > best:\n            best = items[i]\n    return best",
    [t([[3, 9, 4]], 9), t([[]], null), t([[-8, -2, -10]], -2), t([[7]], 7)],
    ["A maximum can be negative. Start with a real item, not 0.", "Compare each remaining value with best, then replace best if needed."],
    "O(n) time, O(1) extra space. Using items[1:] would create an extra O(n) slice in Python; an index loop avoids it.",
    q("What extra space does one best variable use?", ["O(n)", "O(1)", "O(n²)"], 1, "It stores one reference regardless of the number of items.")
  ),
  lesson(
    3,
    "Two pointers, one clear job",
    "To see whether a word reads the same backward, compare its first and last letters. Then move inward, like closing a pair of curtains.",
    "A pointer here is simply an index. Keep left at the start and right at the end. If the values differ, the sequence is not a palindrome. If they match, move both inward. Stop when they meet or cross.",
    ['For "level", compare l with l. Move inward.', "Compare e with e. Move inward.", "The pointers meet at v. Every pair matched, so return True."],
    "Do not keep going after a mismatch. For this exercise, compare exact characters: spaces and capital letters matter.",
    q('How many pairs must be compared in "noon"?', ["4", "2", "1"], 1, "Compare n/n and o/o. Each step handles two positions."),
    "Write solve(text) to return whether the string is a palindrome. Use two indices rather than reversing the string.",
    "def solve(text):\n    left, right = 0, len(text) - 1\n    # Move inward while left < right.\n    pass",
    "def solve(text):\n    left, right = 0, len(text) - 1\n    while left < right:\n        if text[left] != text[right]:\n            return False\n        left += 1\n        right -= 1\n    return True",
    [t(["level"], true), t(["hello"], false), t([""], true), t(["Aa"], false), t(["noon"], true)],
    ["Use while left < right.", "Return False on a mismatch. Return True after the loop."],
    "O(n) time, O(1) extra space with the index approach. A reversed copy would use O(n) extra space.",
    q(
      "Why is an empty string a palindrome here?",
      ["It has no mismatching pair", "It has one character", "It should raise an error"],
      0,
      "The loop has nothing to compare, so all required pairs match."
    )
  ),
  lesson(
    4,
    "Sliding windows save work",
    "You want the busiest three consecutive days in a shop. When your three-day window moves forward, one old day leaves and one new day enters.",
    "Start by adding the first k values. Move the window one place at a time: subtract the value leaving and add the value entering. You avoid adding the same values repeatedly. This exercise uses a fixed window size.",
    ["For [2, 1, 5, 1, 3] and k = 3, the first sum is 8.", "Slide: 8 - 2 + 1 = 7. Slide again: 7 - 1 + 3 = 9.", "The largest window sum is 9."],
    "Starting best at 0 fails if all window sums are negative. Start with the first valid window sum.",
    q("The sum is 10. A 4 leaves and a 7 enters. What is the new sum?", ["13", "21", "7"], 0, "10 - 4 + 7 = 13. Only the edges changed."),
    "Write solve(items, k) to return the maximum sum of k consecutive integers. Return None if k <= 0 or k > len(items).",
    "def solve(items, k):\n    if k <= 0 or k > len(items):\n        return None\n    # Build and then slide your window.\n    pass",
    "def solve(items, k):\n    if k <= 0 or k > len(items):\n        return None\n    window = 0\n    for i in range(k):\n        window += items[i]\n    best = window\n    for i in range(k, len(items)):\n        window += items[i] - items[i-k]\n        best = max(best, window)\n    return best",
    [t([[2, 1, 5, 1, 3], 3], 9), t([[-4, -2, -5], 2], -6), t([[1], 0], null), t([[1, 2], 3], null), t([[5], 1], 5)],
    ["Compute the first k-item sum and save it as best.", "For each new index i, add items[i] and remove items[i-k]."],
    "O(n) time, O(1) extra space without slices. Recomputing every k-item window costs O(nk).",
    q(
      "Why is sliding faster than adding each window from scratch?",
      ["It sorts the data", "It reuses the previous sum", "It skips negative values"],
      1,
      "The neighboring windows overlap; reuse their shared work."
    )
  ),
  lesson(
    5,
    "Prefix sums: pay once, ask often",
    "A running odometer tells you the total distance traveled. Subtract two readings to find the distance between them.",
    "Build a prefix list starting with 0. prefix[i] is the sum of the first i items. The sum from index left through right, inclusive, is prefix[right + 1] - prefix[left]. Build once, then answer many range questions cheaply.",
    ["Items [3, 2, 7] produce prefix [0, 3, 5, 12].", "To sum indices 1 through 2, take prefix[3] - prefix[1].", "12 - 3 = 9, which is 2 + 7."],
    "The extra leading 0 prevents a special case for ranges starting at index 0. Right is inclusive in this exercise.",
    q("For prefix [0, 3, 5, 12], what is the sum of items 0 through 1?", ["5", "3", "12"], 0, "prefix[2] - prefix[0] = 5 - 0."),
    "Write solve(items, queries). Each query is [left, right], inclusive and valid. Return a list of range sums using a prefix list.",
    "def solve(items, queries):\n    prefix = [0]\n    # Build prefix, then answer each query.\n    pass",
    "def solve(items, queries):\n    prefix = [0]\n    for value in items:\n        prefix.append(prefix[-1] + value)\n    return [prefix[r+1] - prefix[l] for l, r in queries]",
    [
      t(
        [
          [3, 2, 7],
          [
            [1, 2],
            [0, 1],
            [0, 2],
          ],
        ],
        [9, 5, 12]
      ),
      t([[], []], []),
      t(
        [
          [-2, 5],
          [
            [0, 0],
            [0, 1],
          ],
        ],
        [-2, 3]
      ),
    ],
    ["Append prefix[-1] + value for each value.", "A query [l, r] becomes prefix[r+1] - prefix[l]."],
    "O(n + q) total time for q queries, O(n) extra space excluding the returned answers. Each query takes O(1) time.",
    q(
      "When is preprocessing with prefix sums especially useful?",
      ["Many range-sum queries on unchanged data", "Every value changes after every query", "Finding a maximum only once"],
      0,
      "The initial O(n) work is shared across many queries."
    )
  ),
  lesson(
    6,
    "Binary search: rule out half",
    "In a sorted dictionary, you open near the middle. If your word comes later, the entire first half can be ignored.",
    "Binary search needs sorted data. Keep an inclusive search range [left, right]. Check the middle. If it is too small, move left past it. If it is too large, move right before it. Each step removes about half of the remaining candidates.",
    [
      "Find 11 in [2, 5, 8, 11, 14, 17, 20]. Middle is 11 at index 3. Done.",
      "Find 17 instead: 11 is too small, so search indices 4 through 6.",
      "Middle is 17 at index 5. Return 5.",
    ],
    "Use mid + 1 or mid - 1. Keeping mid in the next range can leave a one-item range stuck forever.",
    q(
      "The middle value is 12, but you want 19. Which half can you discard?",
      ["The smaller half, including 12", "The larger half", "Neither"],
      0,
      "Sorted order guarantees the values at or below that middle cannot be 19."
    ),
    "Write solve(items, target) for a sorted list of distinct integers. Return its index, or -1 if absent. Use binary search.",
    "def solve(items, target):\n    left, right = 0, len(items) - 1\n    # Halve the inclusive search range.\n    return -1",
    "def solve(items, target):\n    left, right = 0, len(items) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if items[mid] == target:\n            return mid\n        if items[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1",
    [t([[2, 5, 8, 11, 14, 17, 20], 17], 5), t([[], 3], -1), t([[4], 4], 0), t([[1, 3, 7], 6], -1), t([[1, 3, 7], 1], 0)],
    ["The loop condition is left <= right.", "When items[mid] < target, set left = mid + 1."],
    "O(log n) time, O(1) extra space. Sorting first costs additional time; binary search is not a free improvement for one unsorted query.",
    q(
      "Can this algorithm safely search an unsorted list?",
      ["Yes, always", "Only if all values are positive", "No, its elimination rule needs sorted order"],
      2,
      "Discarding a half is only justified by the ordering guarantee."
    )
  ),
  lesson(
    7,
    "Insertion sort: one card at a time",
    "When sorting playing cards in your hand, take the next card and slide it into the correct place among the cards already sorted.",
    "Keep the left part sorted. Save the next value as key. Shift larger values one step right until there is room for key. Then insert it. Each pass extends the sorted part by one.",
    [
      "Start [4, 2, 3]. The first card, 4, is already sorted.",
      "Take 2. Shift 4 right. Insert 2: [2, 4, 3].",
      "Take 3. Shift 4 right. Insert 3: [2, 3, 4].",
    ],
    "Save key before shifting; otherwise you overwrite the very value you are trying to insert.",
    q("In [2, 5, 4], which value shifts when you insert 4?", ["2", "5", "Both"], 1, "Only values larger than key need to move right."),
    "Write solve(items) using insertion sort. Return the sorted list. You may modify the provided list. Do not use sorted() or list.sort().",
    "def solve(items):\n    for i in range(1, len(items)):\n        key = items[i]\n        # Shift larger values and insert key.\n    return items",
    "def solve(items):\n    for i in range(1, len(items)):\n        key = items[i]\n        j = i - 1\n        while j >= 0 and items[j] > key:\n            items[j+1] = items[j]\n            j -= 1\n        items[j+1] = key\n    return items",
    [t([[4, 2, 3]], [2, 3, 4]), t([[]], []), t([[3, 3, -1]], [-1, 3, 3]), t([[1, 2, 3]], [1, 2, 3]), t([[5, 4, 3, 2, 1]], [1, 2, 3, 4, 5])],
    ["Start j at i - 1 and shift items[j] into items[j+1].", "After shifting, key belongs at j + 1."],
    "Worst-case O(n²) time; best-case O(n) for already sorted input. O(1) extra space when modifying the list.",
    q(
      "Which input is easiest for insertion sort?",
      ["Reverse-sorted", "Already sorted", "All inputs require the same shifts"],
      1,
      "Already sorted values do not need to shift."
    )
  ),
  lesson(
    8,
    "Merge sorted streams",
    "Two checkout lines are each ordered by arrival time. To combine them fairly, repeatedly take whichever front person arrived earlier.",
    "If two lists are already sorted, compare only their next unused values. Take the smaller and advance that list. When one is empty, append the other list’s remaining values. This merge operation is the key building block of merge sort.",
    [
      "Merge [1, 4] with [2, 3]. Take 1, then 2, then 3.",
      "The second list is exhausted. Append 4.",
      "Result: [1, 2, 3, 4]. Each value is copied once.",
    ],
    "After the comparison loop, one list can still have values. Forgetting the tail silently loses data.",
    q("Merge [2, 8] and [3, 5]. After taking 2, what comes next?", ["8", "3", "5"], 1, "Compare the remaining fronts: 8 and 3."),
    "Write solve(a, b) to merge two sorted integer lists into a new sorted list, without calling a sorting function.",
    "def solve(a, b):\n    result = []\n    i = j = 0\n    # Compare fronts, then include both tails.\n    return result",
    "def solve(a, b):\n    result = []\n    i = j = 0\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            result.append(a[i])\n            i += 1\n        else:\n            result.append(b[j])\n            j += 1\n    result.extend(a[i:])\n    result.extend(b[j:])\n    return result",
    [
      t(
        [
          [1, 4],
          [2, 3],
        ],
        [1, 2, 3, 4]
      ),
      t([[], [2]], [2]),
      t([[1, 1], [1]], [1, 1, 1]),
      t([[], []], []),
    ],
    ["Use two indices; advance only the list you took a value from.", "After the loop, extend with a[i:] and b[j:]."],
    "Merging takes O(a + b) time and O(a + b) output space. Full merge sort repeats this across O(log n) levels for O(n log n) time.",
    q(
      "Does this merge operation sort arbitrary unsorted inputs correctly?",
      ["Yes", "No, both inputs must already be sorted", "Only when lengths match"],
      1,
      "The smallest remaining value must always be at one of the two fronts."
    )
  ),
  lesson(
    9,
    "Stacks: the last thing comes first",
    "Undo in a text editor removes your most recent action first. A stack follows that same last-in, first-out rule.",
    "Push adds to the top; pop removes from the top. Python lists support this with append() and pop(). For parentheses, push every opening bracket. Each closing bracket must match an opening one. In the end, none should remain.",
    [
      'Read "(())". Push the first (, then push the second (.',
      "Each ) pops one (. The stack ends empty. Valid.",
      'For ")(", the first ) has nothing to match. Invalid immediately.',
    ],
    "An empty stack at the end is not enough by itself: a closing bracket must never arrive before its opening bracket.",
    q('What does pop() remove from stack ["a", "b", "c"]?', ["a", "b", "c"], 2, "c was added last, so it comes off first."),
    "Write solve(text) to validate a string containing only ( and ). Return True when all parentheses are balanced.",
    "def solve(text):\n    stack = []\n    # Push openings. Match each closing.\n    pass",
    'def solve(text):\n    stack = []\n    for char in text:\n        if char == "(":\n            stack.append(char)\n        elif not stack:\n            return False\n        else:\n            stack.pop()\n    return not stack',
    [t(["(())"], true), t([")("], false), t(["(()"], false), t([""], true), t(["()()"], true)],
    ["Before a pop, check whether the stack is empty.", "At the end, return not stack."],
    "O(n) time, O(n) worst-case extra space. A counter can solve this one bracket-type version in O(1) extra space; a stack generalizes to multiple types.",
    q(
      'Why is "(()" invalid?',
      ["A closing bracket arrived first", "One opening bracket remains unmatched", "It has too many closing brackets"],
      1,
      "The stack still contains one opening bracket."
    )
  ),
  lesson(
    10,
    "Queues: take your turn",
    "A printer handles documents in arrival order. The first document in should be the first document out.",
    "A queue is first-in, first-out. Python’s collections.deque supports append() at the back and popleft() at the front efficiently. Removing index 0 from a list shifts its remaining elements, so it is a poor choice for a busy queue.",
    ["Enqueue A, then B. The queue is [A, B].", "Dequeue returns A. Enqueue C gives [B, C].", "The next dequeue returns B."],
    "pop() removes the newest item, creating stack behavior. A queue needs popleft().",
    q("A, B, C arrive in order. Which leaves first?", ["C", "B", "A"], 2, "The first arrival is served first."),
    'Write solve(operations). Each operation is ["add", value] or ["take"]. Return all taken values in order. Taking from an empty queue returns None in the result list.',
    "from collections import deque\n\ndef solve(operations):\n    queue = deque()\n    result = []\n    # Process each operation.\n    return result",
    'from collections import deque\n\ndef solve(operations):\n    queue = deque()\n    result = []\n    for op in operations:\n        if op[0] == "add":\n            queue.append(op[1])\n        else:\n            result.append(queue.popleft() if queue else None)\n    return result',
    [t([[["add", 1], ["add", 2], ["take"], ["add", 3], ["take"], ["take"]]], [1, 2, 3]), t([[["take"]]], [null]), t([[]], [])],
    ["Read op[0] to determine the operation.", "Append the dequeued value, or None when empty, to result."],
    "O(m) total time for m operations with deque. O(m) worst-case queue storage. Each endpoint operation takes O(1).",
    q(
      "Why use deque instead of list.pop(0)?",
      ["deque sorts items", "Removing a list’s first item shifts the rest", "Lists cannot store strings"],
      1,
      "Shifting all remaining references makes each front removal O(n)."
    )
  ),
  lesson(
    11,
    "Linked lists: follow the next link",
    "A treasure hunt has clues pointing to the next clue. You cannot jump to clue 10; you follow the links from the beginning.",
    "Each node holds a value and a reference to the next node. The final link is None. Unlike an array index, a link only tells you where to go next. We will represent nodes as dictionaries with value and next keys. These tests use acyclic lists.",
    ["Head: {value: 4, next: {value: 7, next: None}}.", "Read 4, follow next, read 7, follow next to None.", "The output is [4, 7]."],
    'Remember to advance current = current["next"]. Otherwise you visit the same node forever.',
    q(
      "To read the last node of a singly linked list, you generally need to…",
      ["Jump directly by index", "Follow links from the head", "Sort the nodes first"],
      1,
      "There is no direct index-to-node lookup in a plain linked list."
    ),
    'Write solve(head) to return node values in order. head is None for an empty list. Each node has "value" and "next".',
    "def solve(head):\n    result = []\n    current = head\n    # Follow next links until None.\n    return result",
    'def solve(head):\n    result = []\n    current = head\n    while current is not None:\n        result.append(current["value"])\n        current = current["next"]\n    return result',
    [t([{ value: 4, next: { value: 7, next: null } }], [4, 7]), t([null], []), t([{ value: 0, next: null }], [0])],
    ["Check current is not None rather than checking its value.", 'Append current["value"], then follow current["next"].'],
    "O(n) time, O(1) traversal space excluding the returned O(n) output. Direct lookup of the kth node also takes O(k) time.",
    q(
      "What would happen if you never update current?",
      ["The list is sorted", "The loop keeps visiting the same node", "The next node is selected automatically"],
      1,
      "A loop needs an explicit step that moves it toward termination."
    )
  ),
  lesson(
    12,
    "Hash maps: give every value a label",
    "A contact book lets you look up a phone number by name. A hash map similarly connects keys to values.",
    "In Python, a dict stores key-value pairs. To count words, use each word as a key and its count as the value. A missing word starts at 0. Hash maps offer expected constant-time lookup, but collisions and other details mean that is not a worst-case guarantee.",
    ['Read ["tea", "rice", "tea"]. Start {}.', "After tea: {tea: 1}. After rice: {tea: 1, rice: 1}.", "After tea again: {tea: 2, rice: 1}."],
    "Do not reset the count to 1 every time. Use the previous count plus one.",
    q(
      'After seeing "a" three times, what should counts["a"] be?',
      ["1", "3", "0"],
      1,
      "A frequency map remembers how many occurrences were processed."
    ),
    "Write solve(words) to return a dictionary of exact word frequencies. The inputs are strings; capitalization matters.",
    "def solve(words):\n    counts = {}\n    # Update each word’s running count.\n    return counts",
    "def solve(words):\n    counts = {}\n    for word in words:\n        counts[word] = counts.get(word, 0) + 1\n    return counts",
    [t([["tea", "rice", "tea"]], { tea: 2, rice: 1 }), t([[]], {}), t([["A", "a"]], { A: 1, a: 1 })],
    ["counts.get(word, 0) handles a missing key.", "Set counts[word] to its old value plus 1."],
    "Expected O(n) time for n fixed-size keys, O(u) storage for u unique words. Hashing long strings also depends on their length.",
    q(
      "What does a dictionary store for this problem?",
      ["A word and its count", "Only the original order", "Every possible word"],
      0,
      "Choosing a useful key-value meaning makes the problem straightforward."
    )
  ),
  lesson(
    13,
    "Two sum: remember what you need",
    "If a meal costs 10 and one item costs 3, you need an item costing 7. Remember prices you have already seen instead of retrying every pair.",
    "For each value x, look for target - x in a map of earlier values. If found, you have your pair. Otherwise remember x and its index. Check before inserting so you cannot use the same position twice.",
    [
      "For [3, 2, 7] and target 9, remember 3 at index 0.",
      "At 2, need 7. It has not appeared. Remember 2 at index 1.",
      "At 7, need 2. It is at index 1. Return [1, 2].",
    ],
    "A single 4 cannot make 8 by pairing with itself. But two distinct 4s can.",
    q(
      "Can [4] produce a pair summing to 8?",
      ["Yes, use index 0 twice", "No, two distinct positions are required", "Only if sorted"],
      1,
      "The input contract requires distinct indices."
    ),
    "Write solve(items, target). Scan left to right and return [earlier_index, current_index] at the first pair found, or [] if no pair exists. Remember the most recent index of each prior value.",
    "def solve(items, target):\n    seen = {}\n    # Check complement before remembering current value.\n    return []",
    "def solve(items, target):\n    seen = {}\n    for i, value in enumerate(items):\n        need = target - value\n        if need in seen:\n            return [seen[need], i]\n        seen[value] = i\n    return []",
    [t([[3, 2, 7], 9], [1, 2]), t([[4], 8], []), t([[4, 4], 8], [0, 1]), t([[1, 2, 3], 10], []), t([[1, 1, 2], 3], [1, 2])],
    ["Compute need = target - value.", "If need is in seen, return its saved index and i."],
    "Expected O(n) time and O(n) extra space. Checking all pairs takes O(n²) time but can use O(1) extra space.",
    q(
      "What tradeoff buys faster expected lookup here?",
      ["Extra memory for seen", "Sorting first", "Ignoring duplicates"],
      0,
      "The map stores prior work so you avoid scanning it again."
    )
  ),
  lesson(
    14,
    "Recursion: solve a smaller version",
    "A stack of boxes contains a smaller stack after you remove one box. Solve that smaller task, then add back the work for the removed box.",
    "A recursive function calls itself with a smaller problem. It needs a base case that returns without another call, and every call must move toward it. For factorial, n! = n × (n - 1)!, with 0! = 1.",
    [
      "factorial(3) waits for 3 × factorial(2).",
      "factorial(2) waits for 2 × factorial(1); then 1 × factorial(0).",
      "factorial(0) returns 1. Unwind: 1, then 2, then 6.",
    ],
    "Recursion uses call-stack space. Short code does not mean constant memory, and very deep recursion can hit Python’s recursion limit.",
    q(
      "What happens without a reachable base case?",
      ["The function automatically stops at 0", "Calls keep growing until an error", "The result is always 1"],
      1,
      "Termination must be part of the algorithm."
    ),
    "Write solve(n) recursively to compute n factorial for integer n from 0 through 15. Do not use math.factorial().",
    "def solve(n):\n    # Base case, then a smaller recursive call.\n    pass",
    "def solve(n):\n    if n == 0:\n        return 1\n    return n * solve(n - 1)",
    [t([0], 1), t([1], 1), t([5], 120), t([8], 40320)],
    ["The base case is n == 0, returning 1.", "Return n * solve(n - 1)."],
    "O(n) calls and O(n) stack space under the usual unit-cost arithmetic model. Large-integer arithmetic adds its own cost beyond this small input range.",
    q(
      "What extra memory does this recursive factorial need?",
      ["O(1)", "O(n) call-stack frames", "O(n²) arrays"],
      1,
      "Each unfinished call waits for the next smaller call."
    )
  ),
  lesson(
    15,
    "Binary trees: a hierarchy of choices",
    "A family tree branches into smaller trees. Each branch follows the same structure as the whole.",
    "A binary-tree node has a value and at most two children: left and right. Inorder traversal visits the left subtree, then the node, then the right subtree. An empty tree contributes no values. This works for any binary tree; sorted output requires a binary search tree.",
    [
      "Root 2 has left child 1 and right child 3.",
      "Visit the left child: output 1. Visit the root: output 2.",
      "Visit the right child: output 3. Result [1, 2, 3].",
    ],
    "A binary tree is not automatically a binary search tree. Inorder output is not always sorted.",
    q(
      "In inorder traversal, when is the root visited?",
      ["Before both subtrees", "Between left and right subtrees", "After both subtrees"],
      1,
      "The name means left, node, right."
    ),
    'Write solve(root) to return inorder values. A node is {"value": ..., "left": ..., "right": ...}; empty children are None.',
    "def solve(root):\n    result = []\n    def visit(node):\n        # Visit left, node, right.\n        pass\n    visit(root)\n    return result",
    'def solve(root):\n    result = []\n    def visit(node):\n        if node is None:\n            return\n        visit(node["left"])\n        result.append(node["value"])\n        visit(node["right"])\n    visit(root)\n    return result',
    [
      t([{ value: 2, left: { value: 1, left: null, right: null }, right: { value: 3, left: null, right: null } }], [1, 2, 3]),
      t([null], []),
      t([{ value: 1, left: { value: 8, left: null, right: null }, right: null }], [8, 1]),
    ],
    ["Return immediately when node is None.", "The append belongs between the two recursive visits."],
    "O(n) time and O(h) traversal stack space, excluding output, where h is tree height. A skewed tree can have h = n.",
    q(
      "Inorder traversal is guaranteed sorted for…",
      ["Any binary tree", "A binary search tree", "Any graph"],
      1,
      "The search-tree ordering rule makes left values smaller and right values larger."
    )
  ),
  lesson(
    16,
    "Search trees: keep a useful promise",
    "At each junction, a sign tells you whether smaller or larger house numbers are ahead. You only follow the relevant route.",
    "In a binary search tree with distinct keys, every value in the left subtree is smaller than its root; every value in the right is larger. Compare with the current node and follow one child. A missing child means the target is absent.",
    ["Search for 7 in a tree rooted at 5. 7 > 5, so go right.", "The right child is 8. 7 < 8, so go left.", "That child is 7. Return True."],
    "Search is O(h), not always O(log n). A badly skewed tree can behave like a linked list.",
    q(
      "Target 4, current value 9. Which child should you inspect?",
      ["Left", "Right", "Both"],
      0,
      "The BST promise puts all smaller keys in the left subtree."
    ),
    "Write solve(root, target) to return True if a distinct-key binary search tree contains target. Use a loop. Nodes use value, left, right.",
    "def solve(root, target):\n    # Follow a single branch at each node.\n    return False",
    'def solve(root, target):\n    node = root\n    while node is not None:\n        if node["value"] == target:\n            return True\n        node = node["left"] if target < node["value"] else node["right"]\n    return False',
    [
      t([{ value: 5, left: { value: 2, left: null, right: null }, right: { value: 8, left: null, right: null } }, 8], true),
      t([null, 4], false),
      t([{ value: 3, left: null, right: null }, 2], false),
    ],
    ["Stop and return True on equality.", "Otherwise choose exactly one child based on the comparison."],
    "O(h) time and O(1) extra space with iteration. Balanced: O(log n) height. Worst-case skewed: O(n) height.",
    q(
      "What makes a plain BST slow in the worst case?",
      ["It has too many equal-size branches", "It becomes a long one-sided chain", "Its values are integers"],
      1,
      "Then a search may visit every node."
    )
  ),
  lesson(
    17,
    "Heaps: keep the next priority ready",
    "In an emergency room, the next patient is chosen by priority rather than arrival time. A heap keeps the next priority easy to access.",
    "A min-heap keeps its smallest value at the root. It does not fully sort every value. Python heapq uses a list: heapify builds the heap, and heappop removes the smallest value while repairing the heap property.",
    [
      "Heapify [7, 2, 5]. The smallest value, 2, becomes the root.",
      "Pop 2. The heap is repaired; 5 is now smallest.",
      "Pop 5 next. The two smallest values are [2, 5].",
    ],
    "The internal heap list is not guaranteed to be fully sorted. Use repeated heappop to retrieve priorities in order.",
    q(
      "What does a min-heap guarantee?",
      ["All array positions are sorted", "The root is the smallest value", "The last value is the largest"],
      1,
      "Each parent is no larger than its children; that puts a minimum at the root."
    ),
    "Write solve(items, k) to return the k smallest values in ascending order using heapq. Inputs have 0 <= k <= len(items).",
    "import heapq\n\ndef solve(items, k):\n    # Build a heap and pop k times.\n    pass",
    "import heapq\n\ndef solve(items, k):\n    heap = list(items)\n    heapq.heapify(heap)\n    result = []\n    for _ in range(k):\n        result.append(heapq.heappop(heap))\n    return result",
    [t([[7, 2, 5], 2], [2, 5]), t([[], 0], []), t([[3, 1, 1], 3], [1, 1, 3]), t([[9], 0], [])],
    ["heapq.heapify(heap) modifies the list and returns None.", "Call heapq.heappop(heap) k times."],
    "O(n + k log n) time and O(n) extra space for the copied heap, excluding output. A bounded size-k heap is another useful strategy.",
    q(
      "Does heapify return a new sorted list?",
      ["Yes", "No, it modifies the input list into a heap", "It returns only the maximum"],
      1,
      "Keep the list itself; heapify returns None."
    )
  ),
  lesson(
    18,
    "Breadth-first search: explore in waves",
    "To find how many friendship links connect two people, first check direct friends, then friends of friends, and keep expanding in waves.",
    "Model connections as a graph: nodes are things, edges are links. Breadth-first search uses a queue to visit nodes by increasing number of edges from the start. Mark a node seen when enqueuing it so cycles do not add it again.",
    [
      "Graph A → B, C; B → D; C → D. Start with (A, 0).",
      "Visit B and C at distance 1. Add D from B at distance 2.",
      "D is already seen when C considers it. The shortest distance A to D is 2.",
    ],
    "BFS gives shortest paths by edge count for unweighted graphs. Weighted travel costs need a different algorithm such as Dijkstra for nonnegative weights.",
    q(
      "Which structure makes BFS explore in waves?",
      ["A stack", "A queue", "A sorted output list"],
      1,
      "Earlier discoveries are processed before the next wave."
    ),
    "Write solve(graph, start, goal) to return the shortest edge distance in a directed, unweighted adjacency-list graph, or -1 if unreachable. Missing keys have no outgoing edges.",
    "from collections import deque\n\ndef solve(graph, start, goal):\n    queue = deque([(start, 0)])\n    seen = {start}\n    # Process nodes in discovery order.\n    return -1",
    "from collections import deque\n\ndef solve(graph, start, goal):\n    queue = deque([(start, 0)])\n    seen = {start}\n    while queue:\n        node, distance = queue.popleft()\n        if node == goal:\n            return distance\n        for neighbor in graph.get(node, []):\n            if neighbor not in seen:\n                seen.add(neighbor)\n                queue.append((neighbor, distance + 1))\n    return -1",
    [t([{ A: ["B", "C"], B: ["D"], C: ["D"] }, "A", "D"], 2), t([{}, "A", "A"], 0), t([{ A: ["B"], B: ["A"] }, "A", "C"], -1)],
    ["Pop a (node, distance) pair with popleft().", "Enqueue unseen neighbors with distance + 1 and immediately mark them seen."],
    "O(V + E) time and O(V) extra space over reachable nodes and edges, with expected constant-time set operations.",
    q(
      "Why record seen nodes?",
      ["To sort node names", "To avoid repeated visits and cycles", "To change all edge weights to 1"],
      1,
      "A cycle could otherwise make the search continue forever."
    )
  ),
  lesson(
    19,
    "Depth-first search: follow a trail",
    "Exploring a maze, you follow one trail until you cannot go farther. Then you return to an earlier junction and try another.",
    "Depth-first search uses a stack, either explicitly or through recursive calls. It is useful for reachability and exploring components. Unlike BFS, it does not generally find the path with the fewest edges.",
    [
      "Start at A with stack [A]. Pop A and add its neighbors.",
      "The last neighbor added is explored next, before older branches.",
      "Keep a seen set. Stop when the stack is empty.",
    ],
    "Neighbor order can change the traversal order. Here, return sorted reachable names so the output contract does not depend on that order.",
    q(
      "Does DFS always find the shortest unweighted path first?",
      ["Yes", "No", "Only when names are sorted"],
      1,
      "It can follow a long trail before trying a much shorter branch."
    ),
    "Write solve(graph, start) using an explicit stack. Return all reachable node names, including start, sorted alphabetically.",
    "def solve(graph, start):\n    stack = [start]\n    seen = set()\n    # Explore without recursion.\n    return sorted(seen)",
    "def solve(graph, start):\n    stack = [start]\n    seen = {start}\n    while stack:\n        node = stack.pop()\n        for neighbor in graph.get(node, []):\n            if neighbor not in seen:\n                seen.add(neighbor)\n                stack.append(neighbor)\n    return sorted(seen)",
    [t([{ A: ["C", "B"], B: ["D"], C: ["A"] }, "A"], ["A", "B", "C", "D"]), t([{}, "Z"], ["Z"]), t([{ A: ["A"] }, "A"], ["A"])],
    ["Use pop() to follow the most recently discovered trail.", "Mark neighbors as seen when pushing to avoid duplicate stack entries."],
    "Traversal is O(V + E); sorting the returned names adds O(V log V). The explicit stack and seen set use O(V) extra space.",
    q(
      "What extra cost comes from the requested sorted output?",
      ["O(V log V) sorting time", "No cost", "O(E²) time"],
      0,
      "Include output formatting in the total cost, not just graph exploration."
    )
  ),
  lesson(
    20,
    "Greedy: make a choice you can justify",
    "You want to attend as many talks as possible, with no overlaps. Choosing the talk that finishes soonest leaves the most room for later talks.",
    "A greedy algorithm commits to a local choice. It needs a reason that choice preserves an optimal solution. For interval scheduling, the earliest-finishing compatible talk can replace the first talk in an optimal schedule without leaving less room.",
    [
      "Talks [1,3], [2,5], [3,4]. Sort by finish time.",
      "Take [1,3]. Then [3,4] fits because starting at 3 is allowed.",
      "Skip [2,5]. Total: 2 talks.",
    ],
    "The shortest talk or earliest starting talk is not always the best greedy rule. This problem allows touching endpoints and has start < end.",
    q(
      "Which choice maximizes room for future compatible talks?",
      ["Earliest finish", "Earliest start", "Longest duration"],
      0,
      "An earlier finish leaves at least as much remaining time as a later finish."
    ),
    "Write solve(intervals) to return the maximum number of non-overlapping intervals. Endpoints may touch. Each [start, end] has start < end.",
    "def solve(intervals):\n    # Sort by end time, then accept compatible intervals.\n    pass",
    'def solve(intervals):\n    count = 0\n    end = float("-inf")\n    for start, finish in sorted(intervals, key=lambda pair: pair[1]):\n        if start >= end:\n            count += 1\n            end = finish\n    return count',
    [
      t(
        [
          [
            [1, 3],
            [2, 5],
            [3, 4],
          ],
        ],
        2
      ),
      t([[]], 0),
      t(
        [
          [
            [-5, -3],
            [-3, -1],
          ],
        ],
        2
      ),
      t(
        [
          [
            [1, 10],
            [2, 3],
            [3, 4],
            [4, 5],
          ],
        ],
        3
      ),
    ],
    ["Use sorted(intervals, key=lambda pair: pair[1]).", "Accept an interval if start >= the end of your last accepted interval."],
    "O(n log n) time due to sorting; O(n) extra space for Python’s sorted copy and sorting storage.",
    q(
      "Can any locally attractive choice be assumed optimal?",
      ["Yes", "No, the greedy rule needs justification", "Only if implemented recursively"],
      1,
      "Greedy solutions require a proof, often an exchange argument like the one here."
    )
  ),
  lesson(
    21,
    "Dynamic programming: stop repeating work",
    "If you already calculated the cost of a journey to the previous two stops, reuse those answers rather than planning the whole journey again.",
    "Dynamic programming stores answers to overlapping smaller problems. For stairs where you may climb 1 or 2 steps, ways(n) = ways(n - 1) + ways(n - 2). The final move must come from one of those two steps. Define ways(0) = 1 for the one empty sequence of moves.",
    ["ways(0) = 1 and ways(1) = 1.", "ways(2) = 2: [1,1] or [2]. ways(3) = 3.", "ways(4) = ways(3) + ways(2) = 3 + 2 = 5."],
    "Naive recursion recomputes the same values many times. Bottom-up calculation only needs the previous two answers here.",
    q("If ways(4) = 5 and ways(5) = 8, what is ways(6)?", ["40", "13", "8"], 1, "Every route to step 6 ends with a move from step 5 or step 4."),
    "Write solve(n) to count ways to climb n steps taking 1 or 2 at a time. Inputs are integers 0 through 40. Use bottom-up DP.",
    "def solve(n):\n    # Start from ways(0) and ways(1).\n    pass",
    "def solve(n):\n    if n == 0:\n        return 1\n    previous, current = 1, 1\n    for _ in range(2, n + 1):\n        previous, current = current, previous + current\n    return current",
    [t([0], 1), t([1], 1), t([4], 5), t([10], 89)],
    ["Keep only the previous two answers, initially 1 and 1.", "Update both together: previous, current = current, previous + current."],
    "O(n) time, O(1) extra space under unit-cost arithmetic. Large integer sizes matter beyond these small inputs.",
    q(
      "Why can we discard older answers?",
      ["They are always 0", "The recurrence only needs the last two", "DP always uses constant space"],
      1,
      "Space optimization depends on which previous states the recurrence uses."
    )
  ),
  lesson(
    22,
    "Coin change: when greedy fails",
    "For coins [1, 3, 4] and an amount of 6, grabbing the largest coin gives 4 + 1 + 1. But 3 + 3 uses fewer coins.",
    "Let dp[a] be the fewest coins needed for amount a. Set dp[0] = 0. For each amount, try every usable coin c and consider dp[a - c] + 1. Keep the smallest possible answer. Coins may be reused and all denominations are positive integers.",
    [
      "For coins [1,3,4], dp[1] = 1, dp[2] = 2, dp[3] = 1.",
      "dp[4] = 1. For amount 6, using coin 3 gives dp[3] + 1 = 2.",
      "That beats using coin 4: dp[2] + 1 = 3.",
    ],
    "Some amounts are unreachable. Keep them at infinity and return -1 if the final amount is still unreachable.",
    q("Fewest coins for amount 6 using [1,3,4]?", ["3", "2", "1"], 1, "3 + 3 uses two coins. This is a counterexample to largest-first greedy."),
    "Write solve(coins, amount) to return the minimum number of reusable positive-integer coins, or -1 if impossible. amount is a nonnegative integer up to 100.",
    'def solve(coins, amount):\n    dp = [float("inf")] * (amount + 1)\n    dp[0] = 0\n    # Build answers for amounts 1 through amount.\n    pass',
    'def solve(coins, amount):\n    dp = [float("inf")] * (amount + 1)\n    dp[0] = 0\n    for a in range(1, amount + 1):\n        for coin in coins:\n            if coin <= a:\n                dp[a] = min(dp[a], dp[a-coin] + 1)\n    return -1 if dp[amount] == float("inf") else dp[amount]',
    [t([[1, 3, 4], 6], 2), t([[2], 3], -1), t([[], 0], 0), t([[], 5], -1), t([[2, 5], 10], 2)],
    ["Loop over amounts in increasing order so smaller answers are ready.", "For each usable coin, compare the existing answer with dp[a-coin] + 1."],
    "O(A × C) time and O(A) space for amount A and C coin types. This is pseudo-polynomial in the numeric amount.",
    q(
      "Why do we not simply choose the largest coin each time?",
      ["Greedy fails for some denominations", "Smaller coins are always better", "Sorting is impossible"],
      0,
      "A single counterexample is enough to disprove that greedy rule."
    )
  ),
  lesson(
    23,
    "Capstone: build a route finder",
    "A courier needs the fewest road segments from a warehouse to a customer. A useful answer includes the actual route, not only its length.",
    "Use BFS for an unweighted graph, but also remember who first discovered each node. These parent links form a trail back to the start. When you find the goal, follow parents backward and reverse that sequence. This combines queues, maps, correctness, and graph reasoning.",
    [
      "A connects to B and C. B connects to D.",
      "BFS first discovers D from B: parent[D] = B; parent[B] = A.",
      "Walk D → B → A, then reverse: [A, B, D].",
    ],
    "Only assign a parent at first discovery. Reassigning it later can lose the shortest-path property or create a parent cycle.",
    q(
      "What extra information reconstructs the route?",
      ["A parent for each first-discovered node", "Only the queue length", "Alphabetically sorted node names"],
      0,
      "Each parent tells you the preceding node on a shortest discovered path."
    ),
    "Write solve(graph, start, goal) to return a shortest route including both endpoints, or [] if unreachable. Use adjacency order to break ties. This graph is directed and unweighted, with string node labels.",
    "from collections import deque\n\ndef solve(graph, start, goal):\n    queue = deque([start])\n    parent = {start: None}\n    # Search, then reconstruct the route.\n    return []",
    "from collections import deque\n\ndef solve(graph, start, goal):\n    queue = deque([start])\n    parent = {start: None}\n    while queue:\n        node = queue.popleft()\n        if node == goal:\n            route = []\n            while node is not None:\n                route.append(node)\n                node = parent[node]\n            return route[::-1]\n        for neighbor in graph.get(node, []):\n            if neighbor not in parent:\n                parent[neighbor] = node\n                queue.append(neighbor)\n    return []",
    [
      t([{ A: ["B", "C"], B: ["D"], C: ["D"] }, "A", "D"], ["A", "B", "D"]),
      t([{}, "A", "A"], ["A"]),
      t([{ A: ["B"], B: ["A"] }, "A", "Z"], []),
      t([{ A: ["C", "B"], C: ["D"], B: ["D"] }, "A", "D"], ["A", "C", "D"]),
    ],
    ["Use the parent dictionary as your seen set too.", "At the goal, append each node while following parent[node], then reverse the route."],
    "Expected O(V + E) search time plus O(V) worst-case reconstruction. O(V) extra space for the queue, parents, and route.",
    q(
      "Which change makes plain BFS unsuitable for minimum-cost routing?",
      ["Adding cycles", "Giving roads different costs", "Adding more nodes"],
      1,
      "BFS minimizes edge count. Unequal costs require a weighted shortest-path algorithm."
    )
  ),
];
modules.push(
  ["Split problems. Explore possibilities.", "Turn recursion into sorting and systematic exploration.", "Divide & conquer", "⋈"],
  ["Build structures that answer faster", "Organize prefixes and keep track of connected groups.", "Tries & disjoint sets", "⋔"],
  ["Give networks costs and direction", "Find cheap routes, safe orders, and economical connections.", "Advanced graphs", "⌁"],
  ["Choose the best of many possibilities", "Define states carefully and build an optimal answer.", "Advanced DP", "◈"]
);
lessons.push(
  lesson(
    24,
    "Merge sort: smaller, then together",
    "To organize a large pile of papers, split it into smaller piles, sort those piles, then merge them in order. Keep splitting until each pile is trivial.",
    "A list with zero or one value is already sorted. Split a longer list in half, recursively sort both halves, then merge them using the two-front technique you already learned. Every recursion level copies O(n) values, and halving gives O(log n) levels.",
    [
      "Split [4,1,3,2] into [4,1] and [3,2].",
      "Split again into single values. Merge into [1,4] and [2,3].",
      "Merge those sorted halves into [1,2,3,4].",
    ],
    "Splitting alone does not sort. The merge must compare the next unused value in each sorted half. Include both remaining tails.",
    q(
      "Why does recursion stop at lists of length 0 or 1?",
      ["They are already sorted", "They have no memory cost", "They contain only zeros"],
      0,
      "No ordering decision remains for fewer than two values."
    ),
    "Write solve(items) using recursive merge sort. Return a sorted list without sorted() or list.sort().",
    "def solve(items):\n    if len(items) <= 1:\n        return items[:]\n    # Recursively sort halves, then merge.\n    pass",
    "def solve(items):\n    if len(items) <= 1:\n        return items[:]\n    mid = len(items) // 2\n    left, right = solve(items[:mid]), solve(items[mid:])\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    return result + left[i:] + right[j:]",
    [t([[4, 1, 3, 2]], [1, 2, 3, 4]), t([[]], []), t([[3, -1, 3]], [-1, 3, 3]), t([[1]], [1])],
    ["Call solve on items[:mid] and items[mid:].", "Merge using two indices. The earlier merge lesson has the same combining step."],
    "O(n log n) worst-case time and O(n) peak auxiliary storage for this allocating version, plus O(log n) call depth. Total allocations over the whole run can exceed peak live memory.",
    q(
      "How many split levels does repeatedly halving n items create?",
      ["O(n²)", "O(log n)", "O(n)"],
      1,
      "Each level divides the remaining size by roughly 2."
    )
  ),
  lesson(
    25,
    "Quicksort: choose a dividing value",
    "Choose one book’s height as a reference. Put shorter books on one side and taller books on the other. Repeat inside each group.",
    "A pivot divides values into smaller, equal, and larger groups. Recursively sort the smaller and larger groups, then join them around the equal group. Three groups handle duplicates cleanly. This allocating version favors clarity over in-place memory efficiency.",
    ["For [3,1,3,2], choose pivot 3.", "Smaller: [1,2], equal: [3,3], larger: [].", "Sort the smaller group and join: [1,2,3,3]."],
    "Recursing on values equal to the pivot can fail to shrink the problem. Keep them in a separate group. A fixed pivot strategy can still produce badly unbalanced splits.",
    q(
      "Where should values equal to the pivot go in this version?",
      ["Into another recursive call with the same values", "Into the equal group, without further recursion", "They should be discarded"],
      1,
      "They are already correctly positioned relative to the other two groups."
    ),
    "Write solve(items) as a three-way recursive quicksort. Use the middle-position value as the pivot. Do not call sorting functions.",
    "def solve(items):\n    if len(items) <= 1:\n        return items[:]\n    pivot = items[len(items) // 2]\n    # Partition into three groups.\n    pass",
    "def solve(items):\n    if len(items) <= 1:\n        return items[:]\n    pivot = items[len(items) // 2]\n    smaller, equal, larger = [], [], []\n    for value in items:\n        if value < pivot:\n            smaller.append(value)\n        elif value > pivot:\n            larger.append(value)\n        else:\n            equal.append(value)\n    return solve(smaller) + equal + solve(larger)",
    [t([[3, 1, 3, 2]], [1, 2, 3, 3]), t([[5, 5, 5]], [5, 5, 5]), t([[]], []), t([[-1, 4, 0]], [-1, 0, 4])],
    ["Each value belongs to exactly one of smaller, equal, or larger.", "Return solve(smaller) + equal + solve(larger)."],
    "Balanced splits give O(n log n) time; worst-case O(n²). This fixed pivot does not guarantee balance. This allocating version can use O(n²) peak storage in a pathological recursion chain; in-place quicksort has different space behavior.",
    q(
      "Does choosing the middle-position value guarantee a median-valued pivot?",
      ["Yes", "No", "Only with duplicate values"],
      1,
      "Position and value rank are different; unbalanced partitions remain possible."
    )
  ),
  lesson(
    26,
    "Backtracking: try, explore, undo",
    "When planning an outfit, you can include a jacket or leave it out. Explore one choice, then undo it and explore the other.",
    "Backtracking builds a partial answer, explores a choice, and restores the earlier state. To generate all subsets, decide whether to include each item. At the end of the input, save a copy of the current choice. There are 2ⁿ include-or-exclude combinations.",
    [
      "For [1,2], first exclude 1 and exclude 2: save [].",
      "Include 2: save [2]. Undo it. Include 1: explore again.",
      "The subsets are [], [2], [1], [1,2]. We sort them before returning for a consistent output.",
    ],
    "Append path.copy(), not path itself. Otherwise saved results all refer to the same changing list. Undo each append after its recursive branch.",
    q(
      "Why must you copy the current path when saving a subset?",
      ["To sort the input", "To preserve that answer when path changes", "To reduce the number of subsets"],
      1,
      "A reference to a mutable path would reflect later modifications."
    ),
    "Write solve(items) to return every subset of distinct integers. Use backtracking and return sorted(result) so Python list order gives a fixed output. Input length is at most 10.",
    "def solve(items):\n    result, path = [], []\n    def choose(index):\n        # Explore exclusion and inclusion; undo inclusion.\n        pass\n    choose(0)\n    return sorted(result)",
    "def solve(items):\n    result, path = [], []\n    def choose(index):\n        if index == len(items):\n            result.append(path.copy())\n            return\n        choose(index + 1)\n        path.append(items[index])\n        choose(index + 1)\n        path.pop()\n    choose(0)\n    return sorted(result)",
    [t([[1, 2]], [[], [1], [1, 2], [2]]), t([[]], [[]]), t([[3]], [[], [3]])],
    ["At index == len(items), append a copy and return.", "Explore without the item, append it, explore with it, then pop it."],
    "Generation takes O(n × 2ⁿ) time and output storage because subsets copy up to n values. Recursion uses O(n) space beyond output. Sorting the subset lists adds comparison work; a loose worst-case upper bound is O(n² × 2ⁿ).",
    q(
      "Can every subset be listed in time polynomial in n?",
      ["Yes, with a hash map", "No, there are already 2ⁿ output subsets", "Yes, with BFS"],
      1,
      "An algorithm cannot list exponentially many distinct outputs in polynomial total time."
    )
  ),
  lesson(
    27,
    "Tries: share the beginning",
    "Words like car, cart, and cat share their first letters. A trie stores each shared beginning once, like a branching word map.",
    "Each edge represents a character. Follow characters from the root to spell a prefix. Mark complete words explicitly, because car can be a word and also the beginning of cart. A nested dictionary is enough to build a simple trie.",
    [
      "Insert car: create c → a → r and mark the end.",
      "Insert cart: reuse c → a → r, then add t and mark its end.",
      "To check ca, follow c then a. That prefix exists even though ca is not a complete word.",
    ],
    "Finding a prefix and finding an exact word are different questions. An end marker is needed for exact word membership.",
    q(
      'If only "cart" was inserted, does the prefix "car" exist?',
      ["Yes", "No", 'Only if "car" was also inserted'],
      0,
      "Its character path exists even without an end-of-word marker there."
    ),
    "Write solve(words, prefixes). Build a trie for lowercase a–z words, then return a boolean for whether each prefix occurs. The empty prefix always exists, even for no words.",
    "def solve(words, prefixes):\n    root = {}\n    # Insert words, then follow each queried prefix.\n    pass",
    'def solve(words, prefixes):\n    root = {}\n    for word in words:\n        node = root\n        for char in word:\n            node = node.setdefault(char, {})\n        node["$"] = True\n    result = []\n    for prefix in prefixes:\n        node = root\n        found = True\n        for char in prefix:\n            if char not in node:\n                found = False\n                break\n            node = node[char]\n        result.append(found)\n    return result',
    [
      t(
        [
          ["car", "cart", "cat"],
          ["ca", "car", "dog", ""],
        ],
        [true, true, false, true]
      ),
      t([[], ["a", ""]], [false, true]),
      t([["abc"], ["ab", "abcd"]], [true, false]),
    ],
    ["For each character, reuse or create the child dictionary.", "For a query, follow each character; the first missing edge means False."],
    "Expected O(S + P) time for S inserted characters and P queried characters using dictionaries with expected constant-time operations. O(S) worst-case trie space, excluding returned answers.",
    q(
      "What extra feature distinguishes exact words from mere prefixes?",
      ["A complete-word end marker", "A sorted word list", "The root’s length"],
      0,
      "For exact membership, reaching the path is not sufficient."
    )
  ),
  lesson(
    28,
    "Disjoint sets: keep track of groups",
    "At a meetup, two groups join when their members connect. You want to quickly ask whether two people are now part of the same group.",
    "A disjoint-set union structure stores a parent for every element. A root represents a group. Find follows parents to the root; union joins two roots. Path compression shortens future searches, and union by size attaches a smaller tree under a larger one.",
    [
      "Start with 0, 1, 2 as three separate groups.",
      "Union 0 and 1: now {0,1} and {2}.",
      "Union 1 and 2: all share a representative. There is one group.",
    ],
    "Union must connect roots, not arbitrary nodes. If two elements already have the same root, the group count must stay unchanged.",
    q(
      "If two nodes already share a root, does union reduce the number of groups?",
      ["Yes", "No", "Only if their values differ"],
      1,
      "They were already in the same connected component."
    ),
    "Write solve(n, edges) to return the number of connected components in an undirected graph with vertices 0 through n-1. Implement union-find. Edges may repeat or connect a node to itself.",
    "def solve(n, edges):\n    parent = list(range(n))\n    size = [1] * n\n    # Find roots and join different components.\n    pass",
    "def solve(n, edges):\n    parent = list(range(n))\n    size = [1] * n\n    def find(x):\n        while x != parent[x]:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    groups = n\n    for a, b in edges:\n        ra, rb = find(a), find(b)\n        if ra == rb:\n            continue\n        if size[ra] < size[rb]:\n            ra, rb = rb, ra\n        parent[rb] = ra\n        size[ra] += size[rb]\n        groups -= 1\n    return groups",
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
      t([0, []], 0),
      t(
        [
          3,
          [
            [0, 0],
            [0, 1],
            [0, 1],
          ],
        ],
        2
      ),
      t([3, []], 3),
    ],
    ["Start groups = n. Decrement only when roots differ.", "Use path compression in find, and compare sizes before attaching roots."],
    "O(n + E α(n)) amortized time with path compression and union by size, and O(n) space. α is the inverse Ackermann function, which grows extremely slowly; it is not literally a constant.",
    q(
      "Why attach a smaller tree under a larger root?",
      ["To keep parent chains shallow", "To sort the node labels", "To eliminate the need for find"],
      0,
      "Shallower chains reduce the work of later root searches."
    )
  ),
  lesson(
    29,
    "Detect cycles by tracking connections",
    "When building roads between towns, a new road creates a loop if its endpoints were already connected by other roads.",
    "Process undirected edges one at a time. Before adding an edge, use union-find to ask whether its endpoints share a root. If they do, a path already exists and the new edge closes a cycle. Otherwise join the components.",
    [
      "Add 0–1: different groups, so join them.",
      "Add 1–2: different groups, so join them.",
      "Consider 2–0: they already share a root. A cycle would form.",
    ],
    "This rule is for undirected graphs. Directed cycle detection needs different reasoning. In this exercise, repeated edges count as a two-edge cycle and self-loops count as cycles.",
    q(
      "If an edge joins different components, can it create a cycle immediately?",
      ["Yes", "No", "Only if the labels are consecutive"],
      1,
      "No previous path exists between those components."
    ),
    "Write solve(n, edges) to return whether an undirected multigraph has any cycle. Vertices are 0 through n-1. Reuse union-find.",
    "def solve(n, edges):\n    parent = list(range(n))\n    # Return True at the first edge joining an already connected pair.\n    pass",
    "def solve(n, edges):\n    parent = list(range(n))\n    size = [1] * n\n    def find(x):\n        while x != parent[x]:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    for a, b in edges:\n        ra, rb = find(a), find(b)\n        if ra == rb:\n            return True\n        if size[ra] < size[rb]:\n            ra, rb = rb, ra\n        parent[rb] = ra\n        size[ra] += size[rb]\n    return False",
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
        true
      ),
      t(
        [
          3,
          [
            [0, 1],
            [1, 2],
          ],
        ],
        false
      ),
      t([1, [[0, 0]]], true),
      t(
        [
          2,
          [
            [0, 1],
            [0, 1],
          ],
        ],
        true
      ),
      t([0, []], false),
    ],
    ["Check root equality before union.", "A self-loop has equal roots immediately. Repeated edges also connect an existing component."],
    "O(n + E α(n)) amortized time and O(n) space with the same union-find optimizations.",
    q(
      "Can this union-find rule detect directed cycles correctly in general?",
      ["Yes", "No", "Only when every edge has weight 1"],
      1,
      "Undirected connectivity does not encode directed reachability."
    )
  ),
  lesson(
    30,
    "Dijkstra: follow the cheapest known route",
    "A delivery trip with one long road can cost more than a trip with three short roads. Count total cost rather than road count.",
    "Dijkstra repeatedly takes the smallest tentative distance from a min-heap. Relaxing an edge means checking whether going through the current node offers a cheaper route. Nonnegative edge costs ensure the smallest current distance cannot later be improved by an undiscovered detour.",
    [
      "A → B costs 5. A → C costs 1. C → B costs 1.",
      "From A, tentative B = 5 and C = 1. Visit C next.",
      "C improves B to 2. The cheapest cost A to B is 2, not 5.",
    ],
    "A node can have an old, more expensive entry left in the heap. Ignore entries whose distance no longer equals the best known value. Negative edge weights violate Dijkstra’s precondition.",
    q(
      "Which pending node should Dijkstra take next?",
      ["The first discovered", "The one with smallest tentative cost", "The one with most outgoing edges"],
      1,
      "The heap makes that choice efficient."
    ),
    "Write solve(graph, start, goal) for a directed graph of nonnegative weights. Each adjacency entry is [neighbor, weight]. Return the minimum cost, or -1 if unreachable. Node labels are strings.",
    "import heapq\n\ndef solve(graph, start, goal):\n    distances = {start: 0}\n    heap = [(0, start)]\n    # Relax outgoing edges from the cheapest pending node.\n    return -1",
    'import heapq\n\ndef solve(graph, start, goal):\n    distances = {start: 0}\n    heap = [(0, start)]\n    while heap:\n        cost, node = heapq.heappop(heap)\n        if cost != distances[node]:\n            continue\n        if node == goal:\n            return cost\n        for neighbor, weight in graph.get(node, []):\n            candidate = cost + weight\n            if candidate < distances.get(neighbor, float("inf")):\n                distances[neighbor] = candidate\n                heapq.heappush(heap, (candidate, neighbor))\n    return -1',
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
          "B",
        ],
        2
      ),
      t([{}, "A", "A"], 0),
      t([{ A: [["B", 0]], B: [["A", 0]] }, "A", "B"], 0),
      t([{}, "A", "Z"], -1),
    ],
    ["Skip stale heap entries before processing a node.", "Push a new (candidate, neighbor) only when candidate improves its distance."],
    "For this lazy-heap version: O((V + E) log(V + E)) time and O(V + E) space in the reachable graph, since heap entries can accumulate per improvement. Common simple-graph bounds are often written O((V + E) log V).",
    q(
      "Why can plain BFS choose a more expensive route here?",
      ["It minimizes edge count, not total weight", "It cannot handle cycles", "It requires alphabetical labels"],
      0,
      "One edge can cost more than several edges combined."
    )
  ),
  lesson(
    31,
    "Topological order: prerequisites first",
    "You must bake a cake before decorating it. A dependency graph tells you which jobs must happen before other jobs.",
    "A topological order places every prerequisite before the job that depends on it. Count each node’s incoming edges. Start with nodes whose incoming count is zero. Remove one, reduce its dependents’ counts, and add any newly ready nodes. If not every node can be removed, a directed cycle exists.",
    ["For 0 → 2 and 1 → 2, jobs 0 and 1 are initially ready.", "Choose 0, then 1. Now job 2 has no unmet prerequisites.", "The order is [0,1,2]."],
    "An incomplete result signals a cycle. Do not return that partial order as a valid schedule.",
    q(
      "If A depends on B and B depends on A, what happens?",
      ["Both become ready immediately", "No complete topological order exists", "Alphabetical sorting fixes the cycle"],
      1,
      "Each waits for the other, so there is no valid starting point for those jobs."
    ),
    "Write solve(n, edges). Edge [a,b] means a must come before b. Return a topological order of vertices 0 through n-1, always taking the smallest ready vertex. Return [] if a cycle prevents a complete order.",
    "import heapq\n\ndef solve(n, edges):\n    # Build outgoing lists and incoming counts.\n    pass",
    "import heapq\n\ndef solve(n, edges):\n    graph = [[] for _ in range(n)]\n    incoming = [0] * n\n    for a, b in edges:\n        graph[a].append(b)\n        incoming[b] += 1\n    ready = [i for i in range(n) if incoming[i] == 0]\n    heapq.heapify(ready)\n    order = []\n    while ready:\n        node = heapq.heappop(ready)\n        order.append(node)\n        for neighbor in graph[node]:\n            incoming[neighbor] -= 1\n            if incoming[neighbor] == 0:\n                heapq.heappush(ready, neighbor)\n    return order if len(order) == n else []",
    [
      t(
        [
          3,
          [
            [0, 2],
            [1, 2],
          ],
        ],
        [0, 1, 2]
      ),
      t(
        [
          2,
          [
            [0, 1],
            [1, 0],
          ],
        ],
        []
      ),
      t([3, [[2, 0]]], [1, 2, 0]),
      t([0, []], []),
    ],
    ["Use a min-heap to break ties by smallest node label.", "After processing, require len(order) == n."],
    "O(E + V log V) time and O(V + E) space with the min-heap tie rule. A plain queue can achieve O(V + E) time if the tie order is unconstrained.",
    q(
      "Why does this version use a heap instead of a plain queue?",
      ["To satisfy the smallest-ready-node rule", "To detect undirected cycles", "To store edge weights"],
      0,
      "Output requirements can add cost to an otherwise linear algorithm."
    )
  ),
  lesson(
    32,
    "Minimum spanning trees: connect for less",
    "You need to connect all offices with cables. Choose enough cables to connect every office while keeping the total bill as low as possible.",
    "A spanning tree connects all vertices without cycles. Kruskal’s algorithm sorts undirected edges by cost and accepts an edge if it connects different components. Union-find detects whether adding it would create a cycle. The cut property justifies choosing a cheapest crossing edge.",
    [
      "Edges: 0–1 costs 1, 1–2 costs 2, 0–2 costs 8.",
      "Accept cost 1, then cost 2. All three offices are connected.",
      "Skip cost 8, which would create a cycle. Minimum total = 3.",
    ],
    "A disconnected graph has no spanning tree covering every vertex. Return -1 in that case. Unlike Dijkstra, MST algorithms can handle negative weights.",
    q(
      "When should Kruskal skip a candidate edge?",
      ["When its endpoints are already connected", "Whenever its weight is negative", "When it is the first edge"],
      0,
      "That edge would close a cycle instead of connecting new components."
    ),
    "Write solve(n, edges) to return minimum spanning tree cost, or -1 if disconnected. Edges are [a,b,weight] in an undirected graph with vertices 0 through n-1. For n <= 1, return 0.",
    "def solve(n, edges):\n    # Sort edges by weight and join different components.\n    pass",
    "def solve(n, edges):\n    parent = list(range(n))\n    size = [1] * n\n    def find(x):\n        while x != parent[x]:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    total = used = 0\n    for a, b, weight in sorted(edges, key=lambda e: e[2]):\n        ra, rb = find(a), find(b)\n        if ra == rb:\n            continue\n        if size[ra] < size[rb]:\n            ra, rb = rb, ra\n        parent[rb] = ra\n        size[ra] += size[rb]\n        total += weight\n        used += 1\n    return total if used == max(0, n-1) else -1",
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
      t([1, []], 0),
      t([0, []], 0),
      t([2, [[0, 1, -3]]], -3),
    ],
    ["Use the same root and size operations as the disjoint-set lesson.", "A spanning tree on n >= 1 vertices must accept n - 1 edges."],
    "O(n + E log E + E α(n)) time and O(n + E) extra space with the sorted copy and union-find. Sorting is the dominant edge-processing cost.",
    q(
      "Is a minimum spanning tree the same as a shortest-path tree from a start node?",
      ["Yes", "No, they optimize different objectives", "Only when there are cycles"],
      1,
      "MST minimizes total connection cost; shortest paths minimize distances from a chosen source."
    )
  ),
  lesson(
    33,
    "Longest common subsequence: align two stories",
    "Two drafts share many words in the same relative order, even when extra words appear between them. Find the longest sequence they still have in common.",
    "A subsequence may skip characters but cannot reorder them. Let dp[i][j] be the best common-subsequence length for the first i characters of a and first j of b. Matching last characters add 1 to the smaller-prefix answer. Otherwise drop one last character and take the better answer.",
    [
      'For "abc" and "ac", a matches a. The length becomes 1.',
      "b does not match c, so consider skipping b or skipping c.",
      'c matches c. The best common subsequence is "ac", length 2.',
    ],
    "Subsequence does not mean substring. Matching characters need not be adjacent. The first empty-prefix row and column are all zero.",
    q(
      'Is "ac" a subsequence of "abc"?',
      ["Yes", "No, they are not adjacent", "Only after sorting"],
      0,
      "You may skip b while preserving a before c."
    ),
    "Write solve(a, b) to return the length of the longest common subsequence of two strings. Use a DP table.",
    "def solve(a, b):\n    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]\n    # Fill nonempty-prefix states.\n    pass",
    "def solve(a, b):\n    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]\n    for i in range(1, len(a) + 1):\n        for j in range(1, len(b) + 1):\n            if a[i-1] == b[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[len(a)][len(b)]",
    [t(["abc", "ac"], 2), t(["", "abc"], 0), t(["abc", "xyz"], 0), t(["aaaa", "aa"], 2), t(["AGGTAB", "GXTXAYB"], 4)],
    ["If the final prefix characters match, use the diagonal plus 1.", "If they differ, use max of the state above and the state to the left."],
    "O(mn) time and O(mn) extra space for lengths m and n. Two rolling rows can reduce space if only the length is needed.",
    q(
      "Why does the empty-prefix row contain zeros?",
      ["An empty sequence has no common characters", "All strings begin with zero", "It prevents sorting"],
      0,
      "These base states anchor all larger-prefix answers."
    )
  ),
  lesson(
    34,
    "Increasing subsequences: choose a useful state",
    "You want a sequence of daily records that keeps improving. You may skip disappointing days, but you must keep the original order.",
    "Let dp[i] be the longest strictly increasing subsequence ending exactly at i. Start each at 1. For every earlier j with items[j] < items[i], you may extend its sequence: dp[i] = max(dp[i], dp[j] + 1). The overall answer is the largest dp value.",
    [
      "For [3,1,2], each position starts with length 1.",
      "At 2, the earlier 1 can be extended, giving length 2.",
      "The best subsequence is [1,2]. It need not end at the largest value.",
    ],
    "The condition is strictly smaller. Equal values do not extend a strictly increasing sequence. Do not confuse a best answer ending here with the best answer anywhere so far.",
    q(
      "What is the strictly increasing subsequence length of [2,2,2]?",
      ["3", "2", "1"],
      2,
      "Equal values cannot follow each other in a strictly increasing sequence."
    ),
    "Write solve(items) to return the longest strictly increasing subsequence length with O(n²) DP. Return 0 for empty input.",
    "def solve(items):\n    if not items:\n        return 0\n    dp = [1] * len(items)\n    # Extend valid subsequences ending at earlier indices.\n    pass",
    "def solve(items):\n    if not items:\n        return 0\n    dp = [1] * len(items)\n    for i in range(len(items)):\n        for j in range(i):\n            if items[j] < items[i]:\n                dp[i] = max(dp[i], dp[j] + 1)\n    return max(dp)",
    [t([[3, 1, 2]], 2), t([[2, 2, 2]], 1), t([[]], 0), t([[10, 9, 2, 5, 3, 7, 101, 18]], 4), t([[-3, -2, -1]], 3)],
    ["Loop i over endpoints, then j over positions before i.", "Only extend dp[j] when items[j] < items[i]."],
    "O(n²) time and O(n) space. An O(n log n) length-only method exists using binary search over best tail values; the simpler DP makes the state easier to inspect first.",
    q(
      "What exactly does dp[i] mean?",
      ["Best length ending at index i", "Best length after sorting the list", "Number of values greater than items[i]"],
      0,
      "A precise state meaning is the foundation of a reliable recurrence."
    )
  ),
  lesson(
    35,
    "Capstone: pack the most useful kit",
    "A field team has limited carrying capacity. Each piece of equipment has a weight and a usefulness score. Choose the most useful kit that fits.",
    "This is 0/1 knapsack: each item may be taken once or not at all. Let dp[c] be the maximum value achievable within capacity c using processed items. For each item, update capacities downward. That keeps the source answer from the previous item stage, so the same item cannot be reused.",
    [
      "Items (weight,value): (2,3), (3,4), (4,5). Capacity 5.",
      "Taking the weight-4 item gives 5 value. Taking weights 2 and 3 gives 7.",
      "The best total is 7. A ratio or largest-value-first shortcut is not guaranteed to find it.",
    ],
    "Updating capacities upward turns the recurrence into a reusable-item problem. For 0/1 choices, go downward. This exercise uses positive integer weights and nonnegative values.",
    q(
      "Why update capacities from high to low?",
      ["To prevent using the current item multiple times", "To sort the items by weight", "To make the answer smaller"],
      0,
      "Lower-capacity states must still represent the previous item stage when you read them."
    ),
    "Write solve(weights, values, capacity) for 0/1 knapsack. Return the maximum total value within capacity. Each item is usable once. Weights are positive integers; values are nonnegative integers. Lists have equal length; capacity is an integer from 0 to 100.",
    "def solve(weights, values, capacity):\n    dp = [0] * (capacity + 1)\n    # Process each item, updating capacities downward.\n    pass",
    "def solve(weights, values, capacity):\n    dp = [0] * (capacity + 1)\n    for weight, value in zip(weights, values):\n        for c in range(capacity, weight - 1, -1):\n            dp[c] = max(dp[c], dp[c-weight] + value)\n    return dp[capacity]",
    [t([[2, 3, 4], [3, 4, 5], 5], 7), t([[], [], 10], 0), t([[2], [3], 4], 3), t([[1, 2], [5, 8], 0], 0), t([[6], [20], 5], 0)],
    ["Loop c using range(capacity, weight - 1, -1).", "At c, compare the existing value with dp[c-weight] + value."],
    "O(nC) time and O(C) space for n items and numeric capacity C. This is pseudo-polynomial in capacity. For a project extension, reconstruct the selected items and verify their weight and value totals.",
    q(
      "Which test catches accidental reuse of a single item?",
      ["Weight [2], value [3], capacity 4 should return 3", "An empty list with capacity 0", "A single item heavier than capacity"],
      0,
      "An upward update would incorrectly take that item twice and return 6."
    )
  )
);

// IDs remain stable for saved work; the teaching route is a separate ordered list.
lessons.push(...additions);
applyPlainLanguage(lessons);
lessons[36].unchangedArgs = [0];
lessons[36].freshResultArg = 0;
lessons[41].unchangedArgs = [0];
lessons[41].freshResultArg = 0;
lessons[44].reverseLinkedArg = 0;
export const courseStages = stages;
export const route = stages.flatMap((stage) => stage[4]);
modules.splice(0, modules.length, ...stages.map((stage) => stage.slice(0, 4)));
for (const [module, stage] of stages.entries())
  for (const id of stage[4]) {
    const item = lessons[id];
    item.module = module;
    item.position = route.indexOf(id) + 1;
    item.requires = requirements[id];
    item.minutes = null;
    item.objective = item.task.replace(/^Write solve\([^)]*\) (to |for )?/, "");
    item.useWhen = item.id < 36 ? item.simpleIdea : item.idea;
    item.boundary = item.trap;
  }
