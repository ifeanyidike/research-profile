// Original, lesson-specific reasoning. Read before the exercise, without opening code.
export const discovery = {
  0: [
    "You could check positions in any order, but the task asks for the first match.",
    "Read left to right. Keep checking until a value matches, then stop.",
    "Every earlier position has already failed. If the loop ends, every position has failed, so -1 is justified.",
  ],
  1: [
    "Try adding the numbers by hand and notice what you carry between additions: just the total.",
    "Begin at 0 and add each new number to the saved total.",
    "Before reading anything, 0 is the sum of what you have read. Each addition preserves that rule; at the end it covers the whole input.",
  ],
  2: [
    "Sorting would put the largest value at an end, but it solves more than we need.",
    "Keep only the largest value seen so far. A smaller arrival cannot change that answer.",
    "After each comparison, the saved value beats every value already read. Read all values because the last one could still be largest. Start with an actual value so negative inputs work.",
  ],
  3: [
    "Making a reversed copy would let us compare two strings, but it uses another string.",
    "Compare the two ends directly, then move inward. Matched outer letters need no more attention.",
    "After each move, all pairs outside the two positions match. Meeting or crossing means no unchecked pair remains. A mismatch is enough to reject the whole word.",
  ],
  4: [
    "Add every group of k neighboring values separately. It works, but overlapping groups repeat almost all their additions.",
    "Keep the old sum. Remove the value that leaves on the left and add the one entering on the right.",
    "Those are the only two membership changes, so the saved sum remains exactly the current window sum. Compare every window with the best seen. Start best at the first sum, not 0: all sums may be negative.",
  ],
  5: [
    "For one range, adding its values is fine. Repeating that for many overlapping ranges repeats work.",
    "Save the total before every boundary. A range is the difference between its ending and starting totals.",
    "The unwanted beginning occurs in both totals and cancels. A leading 0 handles a range starting at position 0 without a special case. This saved table suits data that stays unchanged between questions.",
  ],
  6: [
    "A left-to-right scan works even without order. Can sorted order tell us more after one comparison?",
    "If the middle is too small, every value at or left of it is too small too. Discard that whole part.",
    "If the target exists, it stays inside the remaining bounds after every discard. Exclude the checked middle so a miss always shrinks the range. Empty bounds mean no possible position remains.",
  ],
  7: [
    "Rather than arranging all values at once, suppose a small beginning is already sorted.",
    "Hold the next value aside. Shift larger values right until there is a safe gap for it.",
    "Only larger values pass the held value, so the enlarged beginning is sorted again. Keep the held value in a variable so shifting does not lose it.",
  ],
  8: [
    "Combining the lists and sorting again works, but ignores the order each list already provides.",
    "The smallest unused value of each list is at its front. Compare just those two candidates.",
    "The smaller front is no larger than anything behind either front. Taking it preserves sorted output. Once one list is empty, the other remainder is already in order.",
  ],
  9: [
    "Counting openings and closings gives the final balance, but misses a closing that arrives too early.",
    "Remember unmatched openings in a stack. A closing must use the most recent waiting opening.",
    "The stack contains exactly the openings still waiting. Never remove from an empty stack. The text is valid only if no opening remains at the end.",
  ],
  10: [
    "A list can model a waiting line, but removing its front shifts all later entries.",
    "A deque supports adding at the back and taking at the front without that shifting.",
    "The waiting order always matches arrival order after completed removals. Handle an empty take explicitly: there is no item to remove.",
  ],
  11: [
    "An array lets you ask for a position. A linked chain gives you only the current node and its next link.",
    "Read the current value and follow next. Repeat until the link is None.",
    "Each move follows the input order exactly. This traversal assumes the chain ends; a cycle needs the later cycle-detection method.",
  ],
  12: [
    "For each word, recounting the entire list would repeatedly inspect the same words.",
    "Give every distinct word one dictionary entry and update its count as words arrive.",
    "Each saved count equals the occurrences of that key in the part already read. Missing means 0 before the first arrival. Keys preserve distinctions such as uppercase and lowercase.",
  ],
  13: [
    "Trying every pair works, but asks the same question repeatedly: have I already seen the missing amount?",
    "At value x, look for target - x among earlier values, then save x and its position.",
    "A match uses two distinct positions because the lookup happens before insertion. Every pair becomes eligible when its later position arrives. This task keeps the most recent earlier index when values repeat.",
  ],
  14: [
    "Multiplication in a loop works. To understand recursion, instead ask what answer one smaller input would give you.",
    "If you already knew factorial(n - 1), multiplying it by n would finish factorial(n). The call keeps that unfinished multiplication waiting.",
    "The call for 0 supplies 1. Every other call reduces a nonnegative integer by 1, so it reaches that stop and returns through all waiting multiplications.",
  ],
  15: [
    "A tree has no single next link. We must choose when to visit the current node relative to its branches.",
    "For inorder, completely process the left branch, record the node, then process the right branch.",
    "An empty branch contributes nothing. If the same rule visits every node in each child branch once, adding the parent visits the whole tree once. Sorted output additionally requires search-tree ordering.",
  ],
  16: [
    "Searching every node works in any tree. A search tree gives a stronger promise about entire branches.",
    "Compare the target with the current value and keep only the branch whose values could contain it.",
    "The other branch is ruled out by the ordering promise for every descendant. This is fast only when the tree is reasonably short; a one-sided tree can still need n checks.",
  ],
  17: [
    "Sorting all values finds the k smallest, but fixes the order of values we might never need.",
    "Arrange a copy as a heap and remove its root k times. Repairing after each removal prepares the next smallest.",
    "The parent-child rule puts a minimum at the root each time. It does not promise the rest of the array is sorted. Count heap construction as well as the removals.",
  ],
  18: [
    "Trying all routes could find the shortest, but cycles and repeated routes waste work.",
    "Use a queue so distance-1 places are handled before distance-2 places, and so on.",
    "When a place is first discovered, every shorter layer has already had its chance to reach it. Mark it then, not later. This argument requires every edge to have the same cost.",
  ],
  19: [
    "To find everything reachable, you need to keep track of branches you have not explored yet.",
    "A stack stores those waiting branches. Taking the newest entry follows one trail before returning to older choices.",
    "Record seen nodes so cycles cannot keep adding work forever. DFS finds reachability; its first route need not be shortest. Sorting the returned names is a separate output requirement.",
  ],
  20: [
    "You could enumerate all compatible sets of talks. A shortcut needs a reason it will not exclude a better set.",
    "Among talks that fit, choose the one finishing earliest. It leaves the largest remaining time interval.",
    "Take an optimal schedule and replace its first talk with the earliest-finishing one. Every later talk still fits, so the number attended cannot fall. Repeat on the remaining time. This proof does not cover talks with different rewards.",
  ],
  21: [
    "To count ways to climb n steps, imagine listing every sequence of 1-step and 2-step moves.",
    "Separate the sequences by their last move. They come from n - 1 or n - 2, so add those smaller counts.",
    "The two groups do not overlap, and every valid sequence belongs to one. There is one way to climb 0 steps: choose no moves. Build smaller counts before reading them.",
  ],
  22: [
    "Choosing the largest coin first feels natural, but for [1, 3, 4] and amount 6 it uses three coins instead of two 3s.",
    "Let best[a] mean the fewest coins for exactly a. Try each possible final coin and read the answer for a minus that coin.",
    "Every solution has a final coin, so checking all choices covers the optimum. Ignore unreachable smaller amounts. Unlimited reuse is allowed here; the once-only packing problem needs a different update rule.",
  ],
  23: [
    "A distance alone loses the actual route. Keeping a full route in every queue entry would copy shared beginnings.",
    "During BFS, save just the predecessor that first discovers each place.",
    "First discovery gives a shortest distance, so these predecessor links form a shortest route back to the start. Reverse that chain for forward order. Keep the first predecessor to preserve the specified neighbor-order tie rule.",
  ],
  24: [
    "Insertion sort can repeatedly shift long prefixes. Can we sort short pieces and combine their answers?",
    "Split until each piece is already sorted, then use the merge method on pairs of sorted pieces.",
    "A merge includes every input value exactly once and preserves order. Applying that fact at every return proves the final result is sorted. There are logarithmically many split levels, each with linear combining work.",
  ],
  25: [
    "A pivot lets you organize values without fully sorting them yet.",
    "Separate smaller, equal, and larger values. Recursively sort only the smaller and larger groups.",
    "Every smaller value belongs before every equal value, which belongs before every larger one. Removing the nonempty equal group makes recursion shrink even with duplicates. A middle-position pivot does not guarantee balanced groups.",
  ],
  26: [
    "Every item can be included or excluded. Listing all subsets means exploring both choices, not choosing whichever looks better now.",
    "Keep one partial selection, explore a choice, then undo it before exploring its sibling.",
    "Each leaf corresponds to one distinct inclusion/exclusion sequence. Copy the selection when saving a leaf; otherwise later undo operations would change earlier answers.",
  ],
  27: [
    "Checking a prefix against every word rereads the same beginning many times.",
    "Share a path of letters for words with the same beginning, then follow the requested prefix once.",
    "Every stored word contributes its complete path. A missing link rules out the prefix; an existing path confirms it. Whole-word membership additionally needs an end marker.",
  ],
  28: [
    "Repeatedly finding a whole connected component is expensive when connections arrive one at a time.",
    "Keep a parent forest. Two items belong together exactly when following their parents reaches the same leader.",
    "Joining different leaders merges exactly two groups, so the count drops by one. Joining an existing group changes nothing. Size-based linking and path compression shorten later searches without changing group membership.",
  ],
  29: [
    "Before adding an undirected edge, ask whether its ends are already connected by another path.",
    "Union-find answers that question through the two leaders. Equal leaders mean the new edge closes a loop.",
    "A prior path plus the new edge makes a cycle; without a prior path, joining two separate components cannot. The argument relies on undirected edges and on the exercise's treatment of repeated edges and self-loops.",
  ],
  30: [
    "BFS counts roads, but two cheap roads can beat one expensive road. We need total cost instead of edge count.",
    "Keep the cheapest discovered cost for each place, and always expand the smallest waiting cost.",
    "With nonnegative roads, a later route through a more expensive waiting place cannot improve the cheapest current one. Negative roads break that argument. Skip stale heap entries whose cost no longer matches the saved best.",
  ],
  31: [
    "Trying permutations would eventually find a legal job order, but most choices may violate prerequisites.",
    "Only take a job with no unfinished incoming dependencies. Finishing it removes one dependency from its successors.",
    "Each selected job is ready at the moment it runs. If unfinished jobs remain with no ready job, following their waiting dependencies eventually repeats a job: a cycle. A min-heap supplies the requested smallest-ready tie rule.",
  ],
  32: [
    "A cheapest edge is tempting, but we must avoid loops and still connect the graph.",
    "Consider edges by cost. Add an edge only when its ends are in different components.",
    "For such an edge, the cut between its current components has no cheaper unprocessed crossing edge. It can replace a crossing edge in an optimal forest without increasing cost. For a disconnected input, this task returns -1 because no spanning tree connects every node.",
  ],
  33: [
    "Trying all subsequences is expensive. Ask a smaller question about the beginnings of both strings.",
    "For matching final characters, extend the answer for both shorter beginnings. Otherwise skip the last character of either beginning and take the better result.",
    "A common subsequence either uses a matching final pair or avoids at least one mismatching final character. Those cases cover the optimum. Empty beginnings have answer 0; characters may be skipped but their order is preserved.",
  ],
  34: [
    "The best increasing sequence so far does not tell us whether the next value can extend it. Its ending value matters.",
    "Save the best length ending at each position. Extend only earlier endings with a strictly smaller value.",
    "Every non-singleton increasing sequence has a previous position of that kind. Taking the best such extension covers all possibilities. The global answer is the best ending anywhere, not necessarily at the final position.",
  ],
  35: [
    "The two-dimensional packing table works, but each new item reads only the previous item row.",
    "Reuse one capacity row. Move capacities downward so smaller source capacities still belong to the previous item stage.",
    "That reading order prevents the current item from supplying its own source answer. Moving upward could take it repeatedly. Reducing memory preserves the recurrence; it does not make greedy value-per-weight selection correct.",
  ],
  36: [
    "We need a changed result while leaving the input untouched. Giving the input another name does not create another list.",
    "Create a separate outer list, then append to that new list.",
    "The input and output now have different list identities. Integer elements need no deeper copying. Nested mutable elements would still be shared by a shallow copy.",
  ],
  37: [
    "Comparing each new value with every earlier value repeatedly checks duplicates.",
    "A set keeps one entry per distinct value. Add every arrival and return its size.",
    "After reading any prefix, the set contains exactly its distinct values. Adding a duplicate leaves that set unchanged. Use a dictionary instead if you need frequencies or positions.",
  ],
  38: [
    "Count the actual halvings on a few starting values instead of guessing from the number of digits.",
    "Each round replaces n with n // 2. Keep a counter and stop at 1.",
    "A starting value at least 2 strictly decreases each round. Doubling a positive starting value adds one halving. This explains logarithmic growth and why a starting value of 1 needs zero rounds.",
  ],
  39: [
    "A fixed number of nested loops cannot handle lists nested to an unknown depth.",
    "An integer already supplies its answer. A list asks the same question of its elements and adds their answers.",
    "Each recursive request handles a smaller piece of the input. Combining the child totals counts every integer once. This assumes finite nested lists without self-references.",
  ],
  40: [
    "An edge list is easy to read, but finding a node's outgoing moves would scan every edge again.",
    "Make a neighbor list for each node once, then append each edge's destination under its source.",
    "Each row contains exactly the allowed outgoing moves, including the task's repeated edges. Keep empty rows for isolated nodes. Add the reverse direction only when the contract says connections are undirected.",
  ],
  41: [
    "After appending to a heap, every old parent-child relation is still valid. Only the new value's relation with its parent may be wrong.",
    "Swap that value upward while it is smaller than its parent.",
    "Each swap repairs the lower relation and moves the possible violation one level up. Stop at a valid parent or the root. This repairs one path; it does not sort every array position.",
  ],
  42: [
    "Enumerating every start and end finds the shortest qualifying range, but repeats overlapping sums.",
    "Grow the right end until the sum is large enough, then remove left values while it remains large enough.",
    "With positive values, removing a left value strictly lowers the sum. Once a start is too small, further shrinking cannot fix it; growing is necessary. Negative values break this reasoning. Each boundary only moves forward.",
  ],
  43: [
    "Checking every substring for repeats repeatedly reads the same characters.",
    "Keep a set for the current substring. Before adding a repeated character, remove left characters until its previous copy is gone.",
    "The set then matches a substring with no repeats. Shrinking only as far as needed keeps the longest valid substring ending here. Use a while loop: removing just one character may leave the duplicate inside.",
  ],
  44: [
    "Copying values into new nodes gives reversed values but would violate this task's requirement to reuse the nodes.",
    "Save the forward link before replacing it with the backward link, then advance to the saved node.",
    "The previous chain is always the reversed part already processed; current begins the untouched part. No node is lost because its next link is saved before it changes. At the end previous is the new head.",
  ],
  45: [
    "Finding any equal value is not enough when duplicates exist. We need the first position meeting a condition.",
    "Keep a half-open search interval. A value below target rules out its position and everything before it; otherwise keep its position as a candidate.",
    "All ruled-out positions on the left are below target, and the boundary stays between left and right. Equality must move right toward the left, not end the search. The boundary may be len(items), including for an empty list.",
  ],
  46: [
    "Adding a node anywhere could break ordering for an ancestor farther up the tree.",
    "Follow the same comparisons used by search, then place the new node at the first empty chosen child.",
    "Every comparison adds an ancestor bound that the new value satisfies. Thus the chosen empty location respects the entire path, not just its parent. Leave an existing equal value unchanged.",
  ],
  47: [
    "Counting all nodes measures size, not the length of the longest branch.",
    "Ask each child for its height, keep the larger height, and add the current node.",
    "A downward path chooses one child, so the longer child gives the best possible continuation. Empty children have height 0. Adding both heights would describe no single downward path.",
  ],
  48: [
    "Plain recursion can ask for the same stair count in several branches, repeating whole subtrees of work.",
    "Save each completed answer under its input. Before expanding a call, return a saved answer if one exists.",
    "The recurrence stays unchanged; only repeated calculation disappears. Cache keys must contain everything affecting an answer. Keep the cache within this solve call so another input cannot inherit unrelated state.",
  ],
  49: [
    "Listing routes separately grows quickly. Count how routes could make their final move into each cell.",
    "A cell can be entered from above or from the left. Add those two saved counts.",
    "Those final-move groups are disjoint and cover all allowed routes. Fill top to bottom and left to right so both answers are ready. The starting cell has one empty route to itself.",
  ],
  50: [
    "Choosing the most valuable item first can waste space needed for a better combination.",
    "For each item and capacity, compare skipping it with taking it plus the best previous-item answer for the remaining capacity.",
    "Every valid kit either contains this item or does not. Both alternatives read only previous items, so no item is reused. Define the state as value within the capacity, not value at an exactly filled weight.",
  ],
  51: [
    "Scanning rightward separately for every next-greater answer can revisit the same suffix many times.",
    "Keep unresolved positions on a stack. A larger arrival settles the smaller waiting values at its top.",
    "A popped position has seen no earlier greater arrival, or it would already have been removed. So this arrival is its first greater value. Each position is pushed and popped at most once, giving linear total work despite the inner while loop.",
  ],
  52: [
    "Comparing every pair of ranges works, but sorting their starts makes only the latest combined range relevant.",
    "If the next start is within the current end, extend that end with max. Otherwise begin a separate range.",
    "After a gap, no later start can reach backward across it. A contained range must never shrink the current end. These ranges merge when endpoints touch; scheduling talks uses a different endpoint rule.",
  ],
  53: [
    "A frequency dictionary finds the unpaired value, but stores an entry for every distinct integer.",
    "XOR has three useful rules: x XOR x = 0, x XOR 0 = x, and reordering the XOR operations does not change the result.",
    "XOR all the values. Every equal pair cancels even when its members are far apart, leaving only the unpaired integer. This relies on the exact contract: every other integer occurs twice, not three times.",
  ],
  54: [
    "A bucket number cannot uniquely identify a key: several keys can have the same remainder.",
    "Use the bucket rule to narrow the search, then compare the actual keys within that bucket.",
    "Equal keys share one entry; different colliding keys remain separate. More keys in one bucket mean more comparisons, so this simple table does not guarantee constant-time lookup.",
  ],
  55: [
    "A set of visited positions detects a repeated node but needs memory proportional to the trail.",
    "Move one pointer once per round and another twice. If the fast pointer reaches the end, no cycle exists on this trail.",
    "Inside a cycle, the fast pointer gains one position per round relative to the slow one, so it must catch up within a full lap. Compare after moving; their initial shared position proves nothing.",
  ],
  56: [
    "Negative roads mean a route discovered later can improve even a place that looked cheapest earlier.",
    "Repeatedly allow each edge to improve its destination. Up to n - 1 full passes cover every simple route.",
    "Without a negative cycle, removing repeated-node loops leaves an equally good or better simple route. An improvement after those passes proves a reachable negative cycle. Ignore edges whose source is still unreachable.",
  ],
  57: [
    "A prefix table answers sums quickly, but one changed value could require updating every later total.",
    "Store sums for selected blocks. A prefix query joins disjoint blocks; an update changes just the blocks containing its position.",
    "The lowest set bit identifies each block's length. Clearing that bit moves a query to the preceding block; adding it moves an update to its next containing block. Internal positions start at 1 so these moves make progress.",
  ],
  58: [
    "After a partial string match fails, restarting from the next text position rereads characters we already know.",
    "Save how much of each pattern beginning is also its ending. On mismatch, fall back to that shorter reusable match.",
    "Only a beginning matching the already-read ending can still work. The prefix table lists those candidates without moving the text backward. Fallback may repeat several times; it is not always just one step.",
  ],
  59: [
    "Trying every candidate divisor works, but does not use the relationship between the two numbers.",
    "If a = q × b + r, replace (a, b) with (b, r). The remainder is smaller than a positive b.",
    "A number divides both a and b exactly when it divides both b and r, by subtraction in that equation. The common divisors stay the same until the remainder is 0; the other number is then the greatest one.",
  ],
};
