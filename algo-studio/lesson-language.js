// Plain explanations are separate from exercise contracts and answer data.
const entries = {};
function explain(id, idea, why, work, memory, notation, words) {
  entries[id] = { idea, why, work, memory, notation, words };
}

explain(
  0,
  "An algorithm is a clear set of steps for finding an answer.",
  'Suppose the list is ["bread", "milk", "eggs"] and you want to find "milk". You need to return its position. Python counts positions from 0, so milk is at position 1.\n\nStart at position 0. Bread is not milk, so move to position 1. Milk matches, so return 1 and stop.\n\nIf you reach the end without a match, return -1. Check from left to right so that repeated matches return the first position.',
  "If the item is missing, check every item. A list of 8 items needs 8 checks. A list of 16 items needs 16 checks. Twice as many items can mean twice as much work.",
  "The code remembers which position it is checking. It also reads the value at that position. It does not build another list, even when the input is long.",
  "Let n be the number of items in the list. When the target is missing, the code checks all n items. We call this O(n) time. The code keeps only a few variables as it searches. It does not need more variables for a longer list, so its extra space is O(1).",
  [
    ["Index", "A position number. Python calls the first position 0."],
    ["Input and output", "The input is what the function receives. The output is the answer it returns."],
  ]
);
explain(
  1,
  "Make sure the code gives the right answer. Then work on making it faster.",
  "Suppose you need to add [4, -2, 3]. Start with a total of 0. Adding 4 makes it 4; adding -2 makes it 2; adding 3 makes it 5.\n\nAfter every addition, ask: does total equal the sum of the numbers read so far? This gives you a clear rule for checking the loop.\n\nThe same rule handles an empty list. There are no additions, so the answer stays 0. A faster version is useful only if it still gives the correct answer.",
  "For [4, -2, 3], make 3 additions. With 6 values, make 6 additions. The amount of work grows with the number of values.",
  "The running total holds one number. The input list can become longer without the function needing a separate saved total for every item.",
  "Let n be the number of input values. The loop adds each value once, so the time is O(n). The function keeps one running total and a few loop variables. That is O(1) extra space. The memory for the input list is not counted as extra space.",
  [
    ["Invariant", "A rule that should stay true after every step. Here, the total equals the sum read so far."],
    ["Test case", "One input and the answer you expect for it."],
  ]
);
explain(
  2,
  "Big O is a short way to describe how the work grows when the input gets bigger.",
  "To find the largest number in [3, 9, 4], remember 3 first. Compare 9 with it and remember 9 instead. Compare 4 with 9 and keep 9.\n\nEvery value could be the largest, so this plan must read the whole list. A longer list needs more checks.\n\nBig O describes how that work grows as the list gets longer. It does not predict an exact number of seconds. A single read such as items[0] still reads only one position, regardless of the list length.",
  "For a list of 4 numbers, you compare the first number with the other 3. For a list of 8 numbers, you need 7 comparisons. A list twice as long therefore needs roughly twice as much checking. Reading items[0] is different: the code still reads just one position, however long the list is.",
  "Keep the largest value found so far and the current position. You do not need to save a copy of all the other values.",
  "We use n to mean the input size. O(1) means the work stays within a fixed limit as n grows. O(n) means the work grows roughly in proportion to n. O(n²) means doubling n can make the work about four times larger. These are growth labels, not exact counts. Finding the largest value takes O(n) time. Keeping only the best value takes O(1) extra space. These counts treat an operation on a small number as one step. Very large numbers can take more work to process.",
  [
    ["Time cost", "How much work the steps require."],
    ["Extra space", "Memory used in addition to the input."],
    ["Comparison", "Checking which of two values is larger, smaller, or equal."],
  ]
);
explain(
  3,
  "To check whether a word reads the same backward, compare its two ends and move inward.",
  'A palindrome reads the same forward and backward. For example, "level" does, but "hello" does not.\n\nCompare the first and last letters. In level they are both l. Move inward and compare e with e. The positions then meet at v, so every needed pair has matched.\n\nIf any pair differs, return False straight away. If the positions meet or cross without a difference, return True. The empty string also returns True because it has no mismatching pair.',
  "A word with 8 letters needs at most 4 pair checks. A word with 16 letters needs at most 8. Each check handles two letters, but the work still grows with word length.",
  "Remember the position near the left end and the position near the right end. Move those two positions inward. There is no need to make a reversed copy of the word.",
  "Let n be the number of letters. Each comparison handles a pair, so at most about half of n pairs need checking. That amount still grows in proportion to n, so we write O(n) time. Only two positions need to be remembered. We write O(1) extra space for that.",
  [
    ["Pointer", "Here, a variable holding a position in the word."],
    ["Palindrome", "Text that is the same forward and backward, such as level."],
  ]
);
explain(
  4,
  "When a group moves one place to the right, subtract what leaves and add what enters.",
  "You want the largest total from a fixed-size group of neighboring numbers. With [2, 1, 5, 1, 3] and a group size of 3, the first group is [2, 1, 5], with total 8.\n\nMove one position right. The 2 leaves and the next 1 enters. Reuse the old total: 8 - 2 + 1 = 7. Move again: 7 - 1 + 3 = 9.\n\nRemember the largest total, which is 9. This moving group is called a window. Reusing its total avoids adding the same overlapping values again.",
  "For [2, 1, 5, 1, 3] with groups of 3, start at 8. The next sum is 8 - 2 + 1 = 7. The next is 7 - 1 + 3 = 9. You avoid adding all 3 values again for every group.",
  "Remember the current group sum, the largest sum found, and the positions needed by the loop. Read values from the input list rather than copying each group.",
  "Let n be the list length and k be the group size. Adding the first group takes up to k additions. Each later move needs only one subtraction and one addition. Across the list, the total work is O(n). Only a few totals and positions are stored, so extra space is O(1). Adding all k numbers again for every group could instead take O(n × k) time.",
  [
    ["Window", "A consecutive group of values in the list."],
    ["Consecutive", "Next to one another, with no positions skipped."],
  ]
);
explain(
  5,
  "Save running totals once so that later range sums need only one subtraction.",
  "Suppose [3, 2, 7] will receive several questions about section totals. Save the totals as you read: [0, 3, 5, 12]. The starting 0 means no values have been included yet.\n\nTo add positions 1 through 2, you want 2 + 7. Take the total after position 2, which is 12. Subtract the total before position 1, which is 3. The result is 9.\n\nIn code, prefix[k] is the total of the first k values. For an inclusive section [left, right], calculate prefix[right + 1] - prefix[left]. The +1 includes the value at right.",
  "For [3, 2, 7], save [0, 3, 5, 12]. To add the last two values, calculate 12 - 3 = 9. Whether a requested section contains 2 values or 200, that answer still uses one subtraction.",
  "The list of running totals has one entry for each input value, plus a starting 0. A longer input therefore needs a longer list of totals. The answers returned for the questions need their own storage too.",
  "Let n be the number of input values and q be the number of range questions. Building the running totals takes O(n) time. Each question then needs one subtraction, which takes O(1) time here. All q questions together take O(q). The whole job therefore takes O(n + q) time. The saved totals use O(n) space. The returned answers also need their own space.",
  [
    ["Prefix", "A beginning part of a list."],
    ["Query", "A question about the saved data, such as the sum from one position to another."],
  ]
);
explain(
  6,
  "In a sorted list, the middle value tells you which half can still contain your target.",
  "Suppose you want 17 in [2, 5, 8, 11, 14, 17, 20]. The list is already in increasing order. Its middle value is 11.\n\nBecause 17 is larger than 11, neither 11 nor anything to its left can be the answer. Search only the remaining right side. Its middle value is 17, at position 5.\n\nIf the middle value is too large instead, keep only the left side. Leave out a middle position you have already ruled out. This repeated halving works because the input is sorted.",
  "Suppose 8 positions remain. After a miss, about 4 remain, then 2, then 1. Starting with 16 positions adds about one more round. You do not need to visit every position.",
  "Remember the left end, right end, and middle of the search. Change those positions as the search gets smaller. Do not copy half the list each time.",
  "Let n be the number of items. After each unsuccessful check, only about half of the possible positions remain. We call this O(log n) time. The code stores a few positions rather than copying the remaining values, so extra space is O(1). If the list is not already sorted, sorting it first is a separate cost.",
  [
    ["Sorted", "Already arranged from smallest to largest."],
    ["Binary search", "Searching by checking the middle and ruling out a half."],
  ]
);
explain(
  7,
  "Keep the left side sorted, then put each new value into its place.",
  "Imagine putting cards into order one at a time. For [4, 2, 3], begin by treating [4] as the ordered part.\n\nHold 2 aside. Move 4 one position right, then put 2 into the gap. The ordered part is now [2, 4]. Next hold 3 aside, move 4 right, and put 3 between 2 and 4.\n\nRepeat for each remaining value. The left part stays sorted after each insertion. This method is called insertion sort.",
  "For [4, 2, 3], inserting 2 moves 4 once. Inserting 3 moves 4 once more. A list already in order needs little moving. In reverse order, each new value may need to pass all earlier values.",
  "Hold one value aside while moving larger values in the original list. Only a few extra variables are needed. The code does not create a second list of all the values.",
  "Let n be the number of items. In reverse order, a new value may have to move past every earlier value. Those moves can add up to O(n²) time. An already sorted list needs no shifts and takes O(n) time. This version changes the input list directly. It needs only a few extra variables, so extra space is O(1).",
  [
    ["Insertion", "Putting a value into its correct position."],
    ["Sorted part", "The beginning of the list that is already in order."],
  ]
);
explain(
  8,
  "To combine two sorted lists, repeatedly take the smaller of their next unused values.",
  "Suppose two lists are already sorted: [1, 4] and [2, 3]. You want one sorted list containing all their values.\n\nCompare the first unused values, 1 and 2. Take 1. Now compare 4 and 2, and take 2. Compare 4 and 3, and take 3. Only 4 remains, so add it.\n\nMove forward only in the list you took a value from. If one list runs out, copy the rest of the other list. The result is [1, 2, 3, 4].",
  "Merging [1, 4] and [2, 3] puts 4 values into the result. If each input list has 4 values instead, the result gets 8 values. Each input value is put into the result once. There is no need to search for that value again.",
  "The result is a new list. It needs a place for every value from both input lists.",
  "Let a be the length of the first list and b be the length of the second. Every value goes into the result once, so time is O(a + b). The result holds all a + b values. Its space is therefore O(a + b). Both input lists must already be sorted.",
  [
    ["Merge", "Combine lists while keeping the result in order."],
    ["Unused value", "A value you have not yet copied into the result."],
  ]
);
explain(
  9,
  "A stack remembers the most recent opening bracket that still needs a closing bracket.",
  "A stack works like a pile of plates: the last plate added is the first one removed. In Python, append() adds at the end of a list and pop() removes that last item.\n\nUse a stack to check parentheses. Each ( adds an opening bracket. Each ) must remove one waiting opening bracket. A closing bracket with nothing waiting is an error.\n\nFor (()), two openings wait, then the two closings remove them. The text is valid because the stack ends empty. If any opening remains, its closing bracket is missing.",
  "The text (()) has 4 characters, so read 4 characters. A text twice as long needs twice as many character visits. Each bracket is added or removed at most once.",
  "An opening bracket must wait in the stack until its closing bracket arrives. If the text begins with many opening brackets, they all wait together. A single counter can handle this one-bracket-type task too, but a stack is useful when bracket types differ.",
  "Let n be the number of brackets. The code reads each bracket once, so time is O(n). In a text full of opening brackets, the stack may have to hold all n of them. That gives O(n) extra space in the worst case. Because this task has only one bracket type, a counter could also solve it using O(1) extra space.",
  [
    ["Stack", "A container where the last item added is the first one removed."],
    ["Push and pop", "Push adds to the top. Pop removes from the top."],
  ]
);
explain(
  10,
  "A queue serves the item that has been waiting longest.",
  "A queue works like a line at a shop. A joins, then B joins behind A. A must leave before B.\n\nIn Python, use deque. append(value) adds at the back, and popleft() removes the front item. After A leaves, adding C produces the queue [B, C].\n\nThis exercise gives you a sequence of add and take instructions. Follow them in order. Record each taken value; record None if a take instruction finds the queue empty.",
  "Add A, add B, take A, add C, then take B. Those are 5 queue actions. More actions mean more work, but taking the front item does not require moving the rest.",
  "The queue stores items that have arrived but have not yet left. If 100 items arrive before anything leaves, it must hold all 100. The returned answers take separate space.",
  "Let m be the number of queue actions. Each append or popleft takes O(1) time, so m actions take O(m) time altogether. If many items arrive before any leave, the queue must store all of them. It may therefore use O(m) space. Returned answers also need space.",
  [
    ["Queue", "First in, first out: the earliest arrival leaves first."],
    ["deque", "Python container with efficient additions and removals at either end."],
  ]
);
explain(
  11,
  "A linked list stores a link from each item to the next item.",
  "A linked list is a chain of records. Each record, called a node, stores a value and a next link. The link tells you which node comes after it.\n\nThe first node is called the head. If the chain is 4 → 7 → None, read 4, follow its next link, then read 7. The final None means the chain has ended.\n\nKeep moving to the next node until you reach None. Collect the values in that same order. Unlike a Python list, this chain does not let you jump straight to a distant position.",
  "To read 4 followed by 7, visit two nodes. To read 100 linked nodes, follow the chain through all 100. Reaching a distant position also requires following the earlier links.",
  "While walking the links, remember only the current node. This exercise also asks for a Python list of the values. That returned list needs one entry for every visited node.",
  "Let n be the number of nodes. The code follows the chain through all n nodes, so time is O(n). Following the links needs only a current-node variable and a few other values. That is O(1) extra working space. The returned Python list still needs room for n values, so output space is O(n).",
  [
    ["Node", "One stored item, including its value and link."],
    ["Head", "The first node."],
    ["None", "Here, a signal that there is no next node."],
  ]
);
explain(
  12,
  "A dictionary connects each word to its count.",
  'Suppose the words are ["tea", "rice", "tea"]. You want to count each word separately. A dictionary can store {"tea": 2, "rice": 1}.\n\nThe word is the key: the label you look up. Its count is the value stored under that label. When you first read tea, save 1 under tea. Reading rice creates a separate count of 1.\n\nWhen tea appears again, find its existing count and increase it to 2. You update the same entry rather than creating another tea entry or counting the whole list again.',
  "Read tea, then rice, then tea again. The code updates a count three times. It does not go back and recount the earlier words. Dictionary lookups are usually quick, but unusual inputs can make them slower.",
  "The dictionary stores one count for each different word. If tea appears 1000 times, it still needs only one dictionary entry. The count in that entry increases instead.",
  "Let n be the number of words read. Let u be the number of different words. Dictionary lookups and updates are usually quick, so reading n short words takes O(n) expected time. Expected means this is the estimate when the dictionary behaves normally. It is not a promise for every possible input. The dictionary keeps u entries, so space is O(u). Longer words also take more time to hash and compare.",
  [
    ["Dictionary or map", "A container connecting a key, such as tea, to a value, such as 2."],
    ["Expected cost", "An estimate of the work under the stated assumptions. It is not a promise for every possible input."],
  ]
);
explain(
  13,
  "For each number, ask whether you have already seen the number it needs to reach the target.",
  "You need two different positions whose numbers add to a target. For [3, 2, 7] and target 9, the answer is positions [1, 2], because 2 + 7 = 9.\n\nRead from left to right. When you reach 2, the missing amount is 9 - 2 = 7. It has not appeared yet, so remember 2 and its position. When you reach 7, look for 9 - 7 = 2. Your saved record says 2 was at position 1.\n\nLook for the missing amount before saving the current number. Otherwise a single 4 could wrongly match itself for target 8. This task needs two positions, even if their values are equal.",
  "The target is 9 and the values are [3, 2, 7]. Save 3 at position 0. When you read 2, look for 7, which is not saved yet. Save 2 at position 1. When you read 7, look for 2. The dictionary now tells you that 2 was at position 1, so return [1, 2].",
  "The dictionary remembers earlier numbers and their positions. It may need to remember nearly the whole input. Using that memory saves the repeated work of searching earlier values again.",
  "Let n be the number of input values. Each value makes a dictionary lookup instead of searching all earlier values. This gives O(n) expected time when dictionary lookups stay quick. The dictionary may store up to n earlier values, so extra space is O(n). Checking every possible pair instead can take O(n²) time.",
  [
    ["Complement", "The missing amount: target minus the current value."],
    ["Distinct positions", "Two different places in the input, even when their values are equal."],
  ]
);
explain(
  14,
  "Recursion means using the same function to solve a smaller version of the problem.",
  "Factorial means multiplying the whole numbers from 1 up to n. For example, factorial(3) is 3 × 2 × 1 = 6. By definition, factorial(0) is 1.\n\nNotice that factorial(3) is 3 × factorial(2). The function can call itself to ask for that smaller answer. The call for 3 waits while the call for 2 works.\n\nKeep asking about one smaller number until reaching 0. Return 1 there, then let each waiting call finish its multiplication. Calling the same function on a smaller problem is recursion. The stopping case prevents endless calls.",
  "To calculate factorial(3), the calls ask about 3, then 2, then 1, then 0. Starting at 4 would add one more call and one more multiplication. A larger starting number therefore needs more calls.",
  "A call may pause while another call works. Python keeps a record so the paused call can continue later. More calls waiting at once means more records to store.",
  "Let n be the input number. The calls count down from n to 0. There are O(n) calls and multiplications. Up to O(n) calls may be waiting at the same time. Python stores information for those waiting calls on its call stack, so extra space is O(n). These counts treat a small-number multiplication as one operation. Multiplying very large integers takes more work.",
  [
    ["Base case", "A small case that can answer without calling the function again."],
    ["Call stack", "The stored notes that let waiting function calls resume."],
  ]
);
explain(
  15,
  "A binary tree lets each node have a left child and a right child.",
  "A binary tree is a set of linked nodes. Each node stores a value and may link to a left child and a right child. The top node is called the root.\n\nThis task asks you to read each node in a particular order: its entire left branch first, then the node itself, then its entire right branch. This order is called inorder.\n\nFor a root holding 2 with children 1 and 3, the result is [1, 2, 3]. Use the same rule inside each branch. This example happens to be sorted; an arbitrary binary tree need not produce sorted values.\n\nA binary search tree adds the rule that all smaller values go in a node’s left branch and all larger values go in its right branch. That extra ordering rule makes the inorder result sorted.",
  "A tree with 7 nodes needs 7 node visits. A tree with 14 needs 14. Each visit contributes one value to the result.",
  "A call waits while a lower branch is read. A deeper branch can leave more calls waiting at once. The returned list also needs room for every visited value.",
  "Let n be the number of nodes. Every node is visited once, so time is O(n). Let h be the number of levels in the longest branch. Up to h calls may wait while that branch is read, so waiting calls use O(h) space. The returned list also uses O(n) space. A tree that looks like a single long chain can have h equal to n.",
  [
    ["Root", "The top node."],
    ["Child", "A node directly below another node."],
    ["Inorder", "The name for reading left branch, current node, then right branch. This is not automatically sorted."],
  ]
);
explain(
  16,
  "A search tree keeps smaller values on the left and larger values on the right.",
  "A binary search tree has an extra rule: every value in a node’s left branch is smaller than that node’s value, and every value in its right branch is larger.\n\nSuppose you want 7 and the current value is 5. Go right because 7 is larger. If that next value is 8, go left because 7 is smaller than 8.\n\nA matching value means the search succeeds. An empty chosen branch means the target is absent. You can ignore the other branch because its values are all on the wrong side of the target.",
  "To find 7, you might follow 5 → 8 → 7: three checks. A short, branching tree saves checks. A tree shaped like a long chain may require checking every node.",
  "The loop follows one current node at a time. It does not save a list of all the nodes it passed.",
  "Let h be the number of levels in the longest branch. Searching follows only one downward path, so it takes O(h) time. This loop remembers only its current node, giving O(1) extra space. A well-balanced tree with n nodes has O(log n) levels. A one-sided chain can have n levels, making search O(n) in the worst case.",
  [
    ["Binary search tree", "A tree that follows the smaller-left, larger-right rule."],
    ["Balanced", "The branches are kept short enough that the height grows slowly as nodes are added."],
  ]
);
explain(
  17,
  "A heap keeps the smallest remaining value easy to remove.",
  "Suppose the values are [7, 2, 5] and you need the two smallest. A min-heap keeps a smallest value at its top, ready to remove.\n\nUse Python’s heapq tools to arrange a copy of the values as a heap. Remove the top value to get 2. The heap repairs its order, so the next removal gives 5.\n\nReturn [2, 5]. The whole heap list is not sorted: only the parent-child ordering is guaranteed. Get the next smallest value by removing the top, not by reading the next list position.",
  "For [7, 2, 5], the first removal gives 2 and the next gives 5. Building the heap visits the input. Each removal may repair a path from the top toward the bottom, rather than sorting every value again.",
  "The heap is a copy of the input, so it needs room for the input values. The function also builds a separate list of the smallest values it returns.",
  "Let n be the input length and k be the number of values requested. Building the heap takes O(n) time. Each removal can take O(log n) to repair the heap. The total is O(n + k log n). The copied heap uses O(n) space. The list of returned values needs separate space.",
  [
    ["Min-heap", "A structure where no child is smaller than its parent, so a smallest value sits at the top."],
    ["Heapify", "Arrange existing values into a heap."],
  ]
);
explain(
  18,
  "Breadth-first search visits nearby places before more distant places.",
  "Imagine places joined by one-way roads. Every road counts as one move. You want the fewest moves from a starting place to a destination.\n\nUse a queue to explore in layers. From A, discover B and C at distance 1. If B leads to D, discover D at distance 2. Places found earlier are handled before the next layer.\n\nMark a place as seen as soon as you add it to the queue. Another road must not add it again. Because every road counts equally, the first discovery of a place uses the fewest moves.",
  "From A, visit B and C in one move. If B leads to D, D is reached in two moves. Read each reachable place and its outgoing roads, rather than trying every possible route.",
  "Remember the places already seen and the places still waiting in the queue. Both can grow as the search reaches more of the network. This memory prevents the search from repeatedly visiting the same places.",
  "Let V be the number of reachable places. Let E be the number of roads examined from those places. The search visits each place and reads its roads, giving O(V + E) expected time. This estimate assumes set lookups stay quick. The queue and seen records use O(V) extra space. BFS finds routes with the fewest roads when each road counts as one move.",
  [
    ["Graph", "Things together with the connections between them."],
    ["Breadth-first search or BFS", "Explore in layers: first one move away, then two, then three."],
  ]
);
explain(
  19,
  "Depth-first search follows one trail before returning to other waiting trails.",
  "Depth-first search explores down one trail before returning to other waiting trails. For example, it can follow A → B → D before coming back to try C.\n\nKeep a stack of places waiting to be explored. Take the newest waiting place, record it as seen, and add its unseen outgoing neighbors. A stack makes the newest branch the next one explored.\n\nRemember the seen places so a loop cannot keep the search running forever. This exercise asks for all reachable names in alphabetical order, so sort the discovered names before returning them.",
  "The search reads the places it can reach and the roads from them. The requested answer is not just those place names in any order. The code must sort the names too. Sorting takes extra work after the search, so include it when describing the total cost.",
  "The stack stores places still waiting to be explored. The seen records store places already discovered. A larger reachable part of the network can need more of both.",
  "Let V be the number of reachable places and E be the roads examined from them. Exploring takes O(V + E) time. This task also asks for the returned names in sorted order. Sorting them adds O(V log V) time, which must be included in the total. The stack and seen records use O(V) extra space.",
  [
    ["Depth-first search or DFS", "Explore down a trail before switching to another trail."],
    ["Reachable", "You can get there from the starting place by following allowed connections."],
  ]
);
explain(
  20,
  "To attend as many non-overlapping talks as possible, keep choosing the talk that finishes earliest.",
  "You want to attend as many talks as possible without being in two at once. A talk [1, 3] starts at time 1 and ends at time 3. Another talk may start exactly when it ends.\n\nSort by finish time. Choose the earliest-finishing talk that fits after your last choice. With [1, 3], [2, 5], and [3, 4], take [1, 3] and then [3, 4]. You attend two talks.\n\nFinishing earlier leaves at least as much time for later talks as finishing later would. That explains why this greedy choice works here. A different best-looking shortcut is not automatically safe.",
  "Consider talks [1,3], [2,5], and [3,4]. Choose the talk ending at 3. You can then take the talk from 3 to 4, making two talks. The code first sorts all the talks by finish time. After that, it checks them one at a time.",
  "Python sorted() creates a new list of the talks in order. Sorting may also use temporary memory. That is why this version needs more memory as the input grows.",
  "Let n be the number of talks. Sorting them takes O(n log n) time. Checking the sorted talks takes another O(n), so sorting sets the overall growth rate. We write the total time as O(n log n). Python makes a sorted copy and uses sorting memory, giving O(n) extra space here.",
  [
    ["Greedy choice", "Make the best-looking choice now, then continue. It works only when you can explain why that choice is safe."],
    ["Non-overlapping", "The talks do not occupy the same time. This task allows one to start exactly when another ends."],
  ]
);
explain(
  21,
  "Save the last two stair-count answers to calculate the next one.",
  "You may climb 1 or 2 stairs in each move. For 3 stairs, the possible move sequences are [1, 1, 1], [1, 2], and [2, 1]: three ways.\n\nAny final move to stair 4 must come from stair 3 or stair 2. Those groups do not overlap, so add their counts: 3 + 2 = 5 ways.\n\nBegin with one way to climb 0 stairs: make no moves. There is also one way to climb 1 stair. Build the later counts from the last two counts. You need counts, not a list of every possible route.",
  "There is 1 way to reach step 1, 2 ways to reach step 2, and 3 ways to reach step 3. Add the last two counts to get the next count. Step 4 therefore has 2 + 3 = 5 ways. Each new step needs one new calculation rather than a fresh list of every route.",
  "Keep the last two stair counts. Use them to calculate the next count, then replace the older pair. You do not need to keep a count for every earlier step.",
  "Let n be the number of steps. The loop calculates each new stair count once, so time is O(n). Only the previous two counts are needed to calculate the next count. Keeping a fixed number of counts gives O(1) extra space for these small inputs. Very large answers would take more memory and more time to add.",
  [
    ["Dynamic programming or DP", "Save smaller answers and reuse them to build larger answers."],
    ["Bottom-up", "Start with the smallest answers and work toward the requested one."],
  ]
);
explain(
  22,
  "Try every possible last coin, then keep the choice that uses the fewest coins.",
  "You can reuse the coin values [1, 3, 4] as often as you need. To make amount 6, 3 + 3 uses two coins. Taking 4 first would need 4 + 1 + 1, which uses three.\n\nSave the fewest coins needed for each smaller amount, starting with 0 coins for amount 0. For a new amount, try each coin as the last coin. If the last coin is 3, look up the answer for the amount still left and add one coin.\n\nKeep the smallest count that actually works. If no allowed last coin can finish the amount, mark it as impossible. This checks alternatives that the largest-coin-first shortcut can miss.",
  "With coins [1, 3, 4], amount 6 is best made with 3 + 3: two coins. Choosing 4 first would need 4 + 1 + 1: three coins. For each amount, try the available coin types.",
  "Save an answer for every amount from 0 to the target. A target of 1000 therefore needs more saved answers than a target of 10.",
  "Let A be the target amount and C be the number of coin types. For every amount up to A, the code tries up to C coins. This takes O(A × C) time. The saved answers use O(A) space. The work grows with the amount itself. For example, amount 1000 needs many more table entries than amount 10.",
  [
    ["Unreachable amount", "No allowed combination of coins makes that amount."],
    ["Reusable coin", "A coin value you may choose more than once."],
  ]
);
explain(
  23,
  "Save where the search came from. Use those records to build the route.",
  "Finding a distance is different from returning the actual route. For A → B → D, the distance is 2 roads, but the route is [A, B, D]. This task asks for the route.\n\nUse breadth-first search. When you first discover B from A, save A as B’s previous place. If you later discover D from B, save B as D’s previous place.\n\nStart at D and follow the saved links: D → B → A. Reverse that list to return [A, B, D]. If several shortest routes exist, keep the one first found by following the given neighbor order.",
  "Suppose the search reached D from B. It previously reached B from A. Begin at D and follow the saved records back through B to A. The collected list is [D, B, A]. Reverse that list to get the route [A, B, D]. Following these records adds work after the search, but visits at most one record per place.",
  "The queue remembers places still to visit. Another record remembers where each new place came from. The returned route also stores place names. All three can grow when the network has more places.",
  "Let V be the number of reachable places and E be the roads examined from them. The search takes O(V + E) expected time. Following the saved records to build the route adds at most O(V) work. The queue, saved records, and returned route use O(V) space. The dictionary operations are assumed to stay quick.",
  [
    ["Parent record", "Here, the place that first led the search to another place."],
    ["Reconstruct a route", "Build the route afterward from saved previous-place links."],
  ]
);
explain(
  24,
  "Split the list into small pieces, sort the pieces, then merge them back together.",
  "You want [4, 1, 3, 2] in increasing order. Split it into [4, 1] and [3, 2], then split those into single values.\n\nA list with one value is already sorted. Merge [4] and [1] by taking the smaller first to get [1, 4]. Do the same with [3] and [2] to get [2, 3].\n\nFinally merge [1, 4] and [2, 3] into [1, 2, 3, 4]. Recursion handles the smaller lists; merging combines their sorted answers. Stop splitting when a list has zero or one value.",
  "Start with 8 single values. The first merging round makes pairs. The second makes groups of 4. The third combines those groups into the sorted list of 8. Every round handles all 8 values. With 16 values, you need one more round, and each round handles 16 values.",
  "Merging creates new lists to hold the combined values. The input gets larger, so those lists get larger too. Some calls also wait while smaller lists are sorted. Count the lists and calls that are in use together, rather than adding up every list ever created.",
  "Let n be the number of values. At each merging level, the code handles all n values. There are about log₂(n) levels because each split halves a piece. Doing n-sized work on each of those levels gives O(n log n) time. The extra lists in use at the busiest moment take O(n) space. Waiting calls also take O(log n) space. These memory counts describe what is in use at one time, not all the lists ever created.",
  [
    ["Merge sort", "A sorting method that splits, sorts smaller pieces, and merges them."],
    ["Level", "One round of splitting or combining pieces of the same size."],
  ]
);
explain(
  25,
  "Choose one value, separate smaller and larger values, then sort those groups.",
  "Quicksort chooses a dividing value, called a pivot. In this exercise, choose the value at the middle position of the current list.\n\nFor [3, 1, 3, 2], that value is 3. Make three groups: smaller values [1, 2], equal values [3, 3], and larger values [].\n\nSort the smaller and larger groups using the same method. Join smaller, equal, and larger to get [1, 2, 3, 3]. Keep the equal values, but do not recursively sort that equal group again.",
  "For [3, 1, 3, 2], choose 3 as the pivot. The smaller group is [1, 2]. The equal group is [3, 3]. The larger group is empty. Smaller groups still need sorting. If the groups keep being very uneven, a large group gets sorted again and again, which can make this method slow.",
  "This version creates new lists for the smaller, equal, and larger groups. A call keeps its lists while it waits for another sorting call. If the groups are repeatedly very uneven, many large lists may be waiting at once.",
  "Let n be the number of values. If the groups stay fairly even, the time is O(n log n). If each split leaves one very large group, the same values are handled repeatedly and time can reach O(n²). This version also creates new group lists. If many large lists are waiting at once, memory use can reach O(n²). A version that rearranges one list directly has different memory use.",
  [
    ["Pivot", "The value used to divide the list into smaller, equal, and larger groups."],
    ["Partition", "Separate values into groups according to a rule."],
  ]
);
explain(
  26,
  "Try a choice, explore what follows, then undo it before trying the next choice.",
  "A subset is any selection of the input items, including choosing nothing. For [1, 2], the four subsets are [], [1], [2], and [1, 2].\n\nAt each item, explore two choices: leave it out or include it. If you add an item while exploring, remove it before trying a different choice. That undo step is why this method is called backtracking.\n\nAfter considering every item, save a copy of the current selection. A copy keeps the saved answer from changing when you undo later choices. Sort the final list of subsets as required by this exercise.",
  "With 2 items, there are 4 possible subsets. With 3 items, there are 8. Each added item doubles the possibilities. Saving each subset also requires copying its chosen items. This exercise then sorts the answers into a consistent order.",
  "Each returned subset is a separate list of chosen items. There can be many such lists. The function also keeps the current choices and the information for its waiting calls.",
  "Let n be the number of items. There are 2ⁿ possible subsets. Each saved subset may contain up to n values that must be copied. Generating the answers therefore takes O(n × 2ⁿ) time and output space. The current group and waiting calls use O(n) additional working space. This exercise also sorts the returned subsets. Including that sorting, O(n² × 2ⁿ) is a safe upper bound for the time, though it can overestimate the work.",
  [
    ["Backtracking", "Explore a choice, undo it, and explore another choice."],
    ["Subset", "Any choice of items from the input, including no items."],
  ]
);
explain(
  27,
  "Words with the same beginning can share the same path of letters.",
  "Suppose you store car and cart and want to ask whether any stored word starts with ca. Comparing the shared beginning only once can save repeated work.\n\nA trie stores letters along paths. Car uses c → a → r. Cart follows that same path, then adds t. To check ca, follow c and then a. That path exists, so the answer is True.\n\nA path can be only the beginning of a word. If you needed exact-word checks, an end marker would tell you where a whole word stops. This exercise asks only about beginnings, and treats the empty beginning as present.",
  "Adding car processes 3 letters. Adding cart processes 4 letters, reusing the shared path. Checking ca follows 2 letters. Work grows with the letters you insert and check, not by comparing every full word with every other word.",
  "Add a new letter node only when that part of the path is missing. Words with the same beginning share the existing nodes. The returned answers need separate storage.",
  "Let S be the total number of letters in all inserted words. Let P be the total number of letters in all prefix questions. The code follows those letters, giving O(S + P) expected time. This assumes dictionary lookups stay quick. The stored letter paths use at most O(S) space. Returned answers take separate space.",
  [
    ["Trie", "A tree of letter paths used to store words."],
    ["Prefix", "A beginning of a word: ca is a prefix of car."],
  ]
);
explain(
  28,
  "Keep track of which items belong to the same connected group.",
  "You want to keep track of connected groups. Start with items 0, 1, and 2 in three separate groups. Joining 0 with 1 leaves {0, 1} and {2}: two groups.\n\nGive each item a link leading toward its group’s representative, called its leader. Follow those parent links to find the leader. To join different groups, link one leader under the other.\n\nKeep chains short by attaching the smaller group under the larger one. You can also shorten links while following them. If two items already share a leader, joining them again does not change the group count.",
  "Start with the separate groups {0}, {1}, and {2}. Joining 0 and 1 leaves two groups. Joining 1 and 2 then leaves one group. Joining items already in that group does not remove another group. Parent links help the code find the group leader without searching every member.",
  "For each item, store its parent. Also store the sizes used when joining groups. More items require more of these records.",
  "Let n be the number of items and E be the number of connections. Creating the group records takes O(n) time. After that, finding and joining groups is very quick because the parent chains are kept short. The formal total is O(n + E α(n)). The symbol α(n) is a name for a very slowly growing function. It is close to a small constant in normal-sized problems, but it is not literally constant. The records use O(n) space.",
  [
    ["Disjoint sets", "Groups that do not share items."],
    ["Union-find", "The structure that finds group leaders and joins groups."],
    ["Path compression", "Make visited items point closer to their group leader."],
  ]
);
explain(
  29,
  "In an undirected network, a new connection creates a loop if its ends are already connected.",
  "A cycle is a route that follows connections and comes back to its starting place. In this task, connections work in both directions.\n\nAdd 0–1 and then 1–2. There is now a path from 0 to 2 through 1. Adding 2–0 creates another connection between places already linked, closing a loop.\n\nUse the group leaders from union-find. Different leaders mean a connection joins two groups. The same leader means a path already exists, so the new connection creates a cycle. This rule is for undirected connections.",
  "Add 0–1, then 1–2. Now 0 and 2 are connected through 1. Adding 2–0 closes the loop. Check each new connection using the group structure instead of searching the whole network each time.",
  "Keep a parent record for each place and a size record for each group leader. These records let the code check connections without remembering every possible route.",
  "Let n be the number of places and E be the number of roads. Check each road using the group structure from the previous lesson. With its parent-chain shortcuts, the total time is O(n + E α(n)). The slowly growing α(n) term measures the extra work in those group lookups. The parent and size records use O(n) space. This cycle rule applies to undirected roads.",
  [
    ["Cycle", "A loop of connections that brings you back to where you started."],
    ["Undirected", "A connection can be followed in either direction."],
  ]
);
explain(
  30,
  "Always explore the cheapest route found so far before a more expensive waiting route.",
  "Roads may have different costs. A direct road A → B costs 5, but A → C → B costs 1 + 1 = 2. The route with fewer roads is not necessarily cheaper.\n\nSave the cheapest cost found so far for each place. Use a min-heap to take the cheapest waiting visit next. From that place, check whether its roads give any neighbor a cheaper total.\n\nWhen a cost improves, save it and add a new heap entry. An older, more expensive entry may still be waiting; skip it when it no longer matches the saved best cost. Dijkstra’s method needs all road costs to be zero or positive.",
  "A direct road from A to B costs 5. A road from A to C costs 1, and C to B costs 1. Going through C therefore costs only 2. The heap lets the code try that cheaper possibility before the cost-5 visit. If the old cost-5 entry is taken out later, skip it because the saved cost for B is already 2.",
  "Save the cheapest known cost for each reached place. The heap also stores possible visits waiting to be checked. A place can have an old costly entry and a newer cheaper entry in the heap at the same time.",
  "Let V be the number of reachable places and E be the number of reachable roads. A cheaper route can add a new heap entry even when an older entry for that place is still waiting. The heap may therefore hold many entries for the same place. This version takes O((V + E) log(V + E)) time. The logarithm comes from keeping the heap in order. Saved costs and heap entries use O(V + E) space.",
  [
    ["Dijkstra", "The name of this shortest-cost method for roads with no negative costs."],
    ["Tentative cost", "The cheapest route cost found so far. A later route may turn out to be cheaper."],
  ]
);
explain(
  31,
  "Do a job only after all the jobs it depends on are finished.",
  "Some jobs must wait for others. If jobs 0 and 1 must both happen before job 2, the order [0, 1, 2] is valid. Starting with job 2 is not.\n\nCount each job’s unfinished prerequisites. A job with count 0 is ready. Finish a ready job, then reduce the counts of the jobs waiting for it. A count that reaches 0 makes another job ready.\n\nThis exercise chooses the smallest numbered ready job each time, so keep ready numbers in a min-heap. If unfinished jobs remain but none can become ready, the prerequisites contain a cycle and no complete order exists.",
  "Job 2 needs both job 0 and job 1 to finish first. Begin with 0 and 1 ready. Choose 0, then 1, because this task asks for the smallest ready number. Job 2 now has no unfinished prerequisite, so it can run. If some jobs can never become ready, a loop in the prerequisites is blocking them.",
  "Keep each job’s unfinished prerequisite count and the jobs that depend on it. The heap stores jobs ready to run. More jobs and dependency links require more storage.",
  "Let V be the number of jobs and E be the number of prerequisite links. The code reads each link once. It also adds and removes ready jobs from a heap. Together, these steps take O(E + V log V) time. The job records, links, and heap use O(V + E) space. If any ready job could be chosen, a queue could do the whole job in O(V + E) time instead.",
  [
    ["Prerequisite", "Something that must be completed first."],
    ["Topological order", "An order where every prerequisite comes before the job that needs it."],
  ]
);
explain(
  32,
  "Connect every place as cheaply as possible, without paying for unnecessary loops.",
  "Imagine paying to connect several offices. Every office must be connected to every other, possibly through intermediate offices. You want the lowest total cost of the connections you buy.\n\nConsider roads from cheapest to most expensive. Keep a road if it joins two groups that were not connected. Skip it if its ends already have a path between them, because it would add an unnecessary loop.\n\nFor costs 0–1: 1, 1–2: 2, and 0–2: 8, keep the first two and pay 3. This is a minimum spanning tree. It connects everyone cheaply; it does not promise the cheapest individual route from a chosen office.",
  "Roads 0–1 cost 1, 1–2 cost 2, and 0–2 cost 8. Take the first two for a total of 3. The cost-8 road adds a loop and is unnecessary. Sorting the roads is the main cost before the connection checks.",
  "Keep the sorted copy of the roads. Also keep the parent and size records used to track connected groups.",
  "Let n be the number of places and E be the number of roads. Setting up the groups takes O(n) time. Sorting the roads takes O(E log E). The group checks add O(E α(n)), using the very slow-growing function from the group lesson. The total is O(n + E log E + E α(n)). The sorted road copy and group records use O(n + E) space.",
  [
    ["Spanning tree", "Connections that reach all places without a loop."],
    [
      "Minimum spanning tree",
      "Such a connection plan with the lowest total road cost. It is not the same as shortest routes from one starting place.",
    ],
  ]
);
explain(
  33,
  "Find the longest sequence of letters that appears in the same order in both texts.",
  "A subsequence keeps letters in their original order but may skip letters. Both abc and ac contain the subsequence ac, so their longest shared subsequence has length 2.\n\nBuild a table for shorter beginnings of the two texts. Each cell stores the best shared length for those two beginnings. If their final letters match, use the answer without either final letter and add 1.\n\nIf the final letters differ, try leaving out the final letter of either text and keep the better length. An empty beginning contributes 0. Fill smaller answers before the cells that need them.",
  "For abc and ac, keep a, skip b, and keep c. The shared sequence is ac, with length 2. The table also includes answers for an empty beginning of either text. That is why these text lengths, 3 and 2, use 4 rows and 3 columns.",
  "Save the answer in every table cell. Longer texts make the table taller and wider, so the saved table needs more memory.",
  "Let m be the length of the first text and n be the length of the second. The table has about m times n cells. Each cell takes a small amount of work using earlier cells. Time is O(m × n), and saving the whole table uses O(m × n) space. A later version could save only two rows if the length is all that is needed.",
  [
    ["Subsequence", "Characters kept in their original order, with gaps allowed."],
    ["Prefix", "A beginning of a text, possibly empty."],
  ]
);
explain(
  34,
  "Look for numbers that keep getting larger as you move through the list.",
  "You may choose numbers while moving left to right, skipping some if needed. Every chosen number must be strictly larger than the previous choice. For [3, 1, 2], choose [1, 2], with length 2.\n\nSave one length at each position: the best increasing sequence that ends exactly at that position. A number alone has length 1. Check earlier, smaller numbers to see which saved sequence the current number can extend.\n\nFor the final 2, the earlier 1 can be extended, making length 2. The earlier 3 cannot, because 2 is not larger than 3. Return the largest saved length across all positions.",
  "In [3, 1, 2], the 2 can follow the earlier 1, making a sequence of length 2. For each new number, the code checks earlier numbers for a sequence it can extend. A list of 4 numbers makes 6 earlier-position checks. A list of 8 makes 28. Doubling the input can therefore more than double this work.",
  "Keep one length beside each input number. In [3, 1, 2], the last number is 2. You can reach it with the increasing sequence [1, 2], so the length saved beside it is 2. Each saved length describes a sequence ending at its own number.",
  "Let n be the number of input values. For each position, the code checks the positions before it. The number of checks can grow roughly like n times n, so time is O(n²). The code saves one length for each input position. That takes O(n) space. A faster method exists, but this version shows clearly what each saved answer means.",
  [
    ["Strictly increasing", "Every chosen value must be larger than the previous chosen value."],
    ["State", "What one saved answer means. Here, it means the longest increasing sequence that ends at a particular input position."],
  ]
);
explain(
  35,
  "For each item, compare taking it with leaving it, while staying within the carrying limit.",
  "You have a carrying limit and items with weights and values. An item may be taken once or left behind. Your goal is the greatest total value that fits, rather than filling the bag exactly.\n\nSave the best value for every weight limit. For each item, compare leaving it out with taking it. Taking it adds its value to an older answer for the room left over.\n\nUpdate weight limits from high to low. Otherwise you could read an answer already improved by this same item and accidentally take it again. For weights 2 and 3 with values 3 and 4, a limit of 5 allows both, worth 7.",
  "An item of weight 2 has value 3. An item of weight 3 has value 4. A weight limit of 5 lets you take both, for value 7. For each new item, the code checks which weight limits it can improve. More items mean more of these checks. A larger weight limit also means more checks.",
  "Keep one answer for each allowed weight limit, from 0 up to the full limit. Reuse that same row when considering the next item.",
  "Let n be the number of items and C be the weight limit. Each item may need to check every weight limit up to C, so time is O(n × C). One row stores an answer for each weight limit. That takes O(C) space. The work depends on how large C is, rather than just how many digits are used to write C.",
  [
    ["0/1 knapsack", "A packing problem where each item is either taken once or left out."],
    ["Capacity", "The largest total weight you are allowed to carry."],
  ]
);
explain(
  36,
  "Two names can refer to the same list. A copy gives you a separate list to change.",
  "Suppose items = [2, 4]. Writing alias = items gives the same list a second name. It does not make another list.\n\nIf you append 6 through alias, items also becomes [2, 4, 6], because both names refer to that one list.\n\nWriting copy = list(items) makes a separate outer list. Changing that copy leaves the original list alone. This exercise contains integers, so a shallow copy is enough; there are no nested lists to copy separately.",
  "Making a copy of [2, 4] copies two list entries. Making a copy of 100 items copies 100 entries. This function must finish that copy before appending the new value. The copy is why a longer input takes more work, even though only one new value is added.",
  "The copied list needs its own entries for the old values and the new value. Giving the old list another name would not create those separate entries.",
  "Let n be the number of items in the original list. Copying those items takes O(n) time and creates a new list using O(n) space. Adding one more value does not change those overall growth labels. Reading one known position, such as items[0], takes O(1) time. Appending without copying is usually quick, but an append can take longer when the list needs more storage.",
  [
    ["Reference", "A way for a name to point to an existing object."],
    ["Shallow copy", "A new outer list. If its items are themselves lists, those inner lists are still shared."],
    [
      "Amortized cost",
      "Count the work across many actions, including occasional expensive ones, then spread that total across the actions. This is not an average over random inputs.",
    ],
  ]
);
explain(
  37,
  "A set remembers which different values have appeared.",
  "Suppose the input is [4, 2, 4]. Three values were read, but there are only two different numbers: 4 and 2.\n\nA set keeps each different value once. Add the first 4, then 2. Adding the second 4 does not create another entry.\n\nThe set now has two entries, so return 2. A set answers whether a value is present; unlike the word-count dictionary, it does not keep a count for each value.",
  "For [4, 2, 4], make 3 visits but keep only 4 and 2. Set operations are usually quick, so twice as many input values usually means roughly twice the work. Unusual collision patterns can make them slower.",
  "Save one entry for each different value. Repeated copies of the same value do not need repeated set entries.",
  "Let n be the number of input values and u be the number of different values. Set lookups and additions are usually quick, giving O(n) expected time overall. The set keeps u entries, so it uses O(u) space. The time estimate is not a guarantee for every possible input. If many keys collide, set operations can take longer.",
  [
    ["Set", "A container that keeps each distinct value once."],
    ["Membership", "Whether a value is present in a container."],
  ]
);
explain(
  38,
  "If you keep cutting a number in half, doubling the starting number adds just one more round.",
  "Start with 8 and keep dividing by 2 until you reach 1: 8 → 4 → 2 → 1. That took three rounds.\n\nNow start with 16. The first round reaches 8. After that, you need the same three rounds as before, giving four rounds altogether. Doubling the starting number added only one round.\n\nUse Python’s // operator so the result stays a whole number: 9 // 2 is 4. Count a round only when you actually halve the number. If you start at 1, no round is needed.",
  "Starting with 8 means you need three halvings to reach 1. Starting with 16 means you need four. Starting with 32 means you need five. Each starting number is twice the previous one, but it needs only one extra halving. We call this logarithmic growth. Here, that means the number of rounds grows much more slowly than the starting number.",
  "The function remembers the number it is currently halving and how many halvings it has done. It replaces the old number with the new one. It does not save the whole sequence of numbers.",
  "Let n be the starting number. Count how many times it must be halved before it reaches 1. For a power of 2, this count is written log₂(n). The code does a small amount of work at each halving, so we call its growth O(log n). The function keeps only the current number and the round count. Keeping a fixed number of variables is called O(1) extra space here. These counts treat operations on small integers as single steps. Extremely large integers take more work and more storage.",
  [
    ["Round", "One repetition of the loop: halve the number and add 1 to the count."],
    ["Logarithm, base 2", "How many times you halve a power of 2 to reach 1. For 8, the answer is 3."],
  ]
);
explain(
  39,
  "A recursive function can ask for several smaller answers and add them together.",
  "Suppose the input is [2, [3, 4]]. You want the sum of all its integers, including those inside inner lists.\n\nIf the current input is an integer, return that number. If it is a list, ask the same function to handle each item inside it and add the answers.\n\nThe call for [3, 4] returns 7. The outer call resumes and adds 2 + 7 = 9. Each call keeps its own running total and place in its own list while a smaller call works.",
  "For [2, [3, 4]], the call handling [3, 4] adds 3 and 4 and returns 7. The outer call adds that 7 to its earlier 2 and returns 9. Every integer and list is visited once. More entries therefore mean more visits, rather than trying every possible pair of entries.",
  "A call waits while an item inside its list is handled. More lists nested inside one another can leave more calls waiting together. A wide list of integers does not create the same deep chain of waiting calls.",
  "Let N count all the integers and list containers visited. Each is visited once, so time is O(N). Let h be the deepest number of lists nested inside one another. A deeper input can leave more calls waiting at the same time. Those calls use O(h) space. Python stores their information on the call stack, even though the code does not create a stack variable.",
  [
    ["Recursive call", "One use of a function from inside that same function."],
    ["Stack frame", "Python keeps a record for each unfinished function call. The record holds that call’s variables and where it should continue."],
  ]
);
explain(
  40,
  "Represent a network by listing the places you can go from each place.",
  "A graph describes places and connections between them. Here, places are numbered 0, 1, 2, and so on. A directed connection [a, b] means you may move from a to b; it does not automatically allow the reverse move.\n\nMake one separate list for each place. In that list, store all the places you can go to next. For connections [0, 1] and [0, 2], the list for place 0 is [1, 2].\n\nWith three places, the full result is [[1, 2], [], []]. The empty lists mean places 1 and 2 have no outgoing connections. Keep repeated connections and their input order in this task.",
  "The places are 0, 1, and 2. There is a road from 0 to 1 and another from 0 to 2. The result is [[1,2], [], []]. Creating it needs three empty lists and two road entries. Adding another place needs another list. Adding another road needs another entry.",
  "Each place gets its own list of destinations. Each directed road adds one entry to one of those lists. Keeping only roads that exist can use less memory than recording every possible pair of places.",
  "Let V be the number of places and E be the number of directed roads. Creating the empty lists takes work for V places. Adding the road entries takes work for E roads. Together, the time and storage are O(V + E). A table with a cell for every possible pair of places would instead need V times V cells.",
  [
    ["Vertex or node", "One place or object in a graph."],
    ["Edge", "A connection between two places."],
    ["Adjacency list", "For each place, a list of its direct neighbors."],
  ]
);
explain(
  41,
  "A newly added heap value may need to move upward.",
  "A min-heap is a tree stored in a list. A parent value must be no larger than either child. This keeps a smallest value at the top; it does not sort the whole list.\n\nStart with [2, 5, 4] and add 1 at the end of a copy. Its parent is 5. Swap them because 1 is smaller. Its new parent is 2, so swap again to get [1, 2, 4, 5].\n\nKeep swapping upward until the parent is no larger or you reach the top. For a child at position i, its parent is at (i - 1) // 2. Other branches have not changed, so they need no repair.",
  "Begin with heap [2, 5, 4] and append 1. Swap 1 with its parent 5. Then swap 1 with its new parent 2. The result is [1, 2, 4, 5]. Only two swaps were needed. This exercise still copies the original heap first, so copying must also be counted in the total work.",
  "This function first makes a separate copy of the heap. That copy needs one entry for each original value and one more for the new value.",
  "Let n be the number of items already in the heap. Moving the new value upward takes at most O(log n) comparisons because the heap has only that many levels. This function also copies all n input values first. That copy makes the total time O(n) and extra space O(n). Adding directly to an existing heap would avoid the full copy.",
  [
    ["Parent", "The node directly above a node in the tree picture."],
    ["Heap order", "For a min-heap, every parent is no larger than its children. The whole list need not be sorted."],
  ]
);
explain(
  42,
  "Grow a group until its sum is large enough, then shrink it to look for a shorter answer.",
  "You want the shortest neighboring group whose sum reaches a target. For [2, 3, 1] and target 4, [2, 3] works because its total is 5.\n\nNow try making it shorter by removing the leftmost value, 2. The total drops to 3, which is too small. Add the next value on the right, 1, to make [3, 1] with total 4.\n\nBoth working groups have length 2. Continue growing and shrinking while keeping the shortest length. This plan depends on positive values: adding one increases the sum, and removing one decreases it.",
  "For [2, 3, 1] and target 4, [2, 3] works. Removing 2 makes the sum too small. Adding 1 gives [3, 1], which also works. Across the whole run, each value enters once and leaves at most once.",
  "Remember where the group starts and ends, its current sum, and the shortest length found. The values stay in the input list. There is no need to copy the group after each move.",
  "Let n be the number of values. Each value enters the group once and leaves at most once. Although one loop sits inside another, there are at most n additions and n removals in total. Time is therefore O(n). Only a few positions and totals are saved, so extra space is O(1). This reasoning would not hold if negative values were allowed.",
  [
    ["Variable-size window", "A consecutive group whose left or right end can move."],
    ["At least the target", "The sum may equal the target or be larger."],
  ]
);
explain(
  43,
  "Keep a stretch of text with no repeated characters inside it.",
  "A substring is a continuous stretch of text; you cannot skip characters. In aba, ab and ba are substrings, but aa is not because the b is between the two a letters.\n\nKeep a stretch with no repeats and a set of its characters. After reading ab, the next a would repeat a character already inside.\n\nRemove characters from the left until the old a has left, then add the new a. The stretch becomes ba. Keep the longest length seen. Sometimes several leftmost characters must leave before the repeated character is gone.",
  "Read the first two letters of aba. The current stretch is ab, with length 2. The final a repeats the a at the start. Remove that older a and add the new one, leaving ba. Each character is added once and removed at most once, even when several removals happen together.",
  "The set remembers the characters still inside the current stretch. A stretch with many different characters needs more entries. Characters removed from the stretch are removed from the set too.",
  "Let n be the number of characters. Each character enters the stretch once and leaves at most once. With usually quick set operations, the total is O(n) expected time. The set stores the characters still inside the stretch. It can need up to O(n) space when all the characters are different.",
  [
    ["Substring", "A consecutive stretch of text, with no gaps."],
    ["Active window", "The stretch between the current left and right positions."],
  ]
);
explain(
  44,
  "Reverse a linked list by making each next link point backward.",
  "You have nodes linked A → B → C → None. Reversing the list means changing those links to C → B → A → None, while keeping the same nodes.\n\nBefore changing A’s link, save B so you do not lose the rest of the chain. Point A backward to None. At B, save C, then point B backward to A.\n\nRepeat at C. The old last node is now the first node, or new head. Keep track of the previous node, current node, and saved next node as you move.",
  "Begin with A → B → C. Save B before changing A’s next link to None. At B, save C before changing B’s link to A. Finally, change C’s link to B. The reversed list starts at C and follows C → B → A. Each node is handled once.",
  "Reuse the same nodes. Remember the previous node, current node, and the node that originally came next. There is no second linked list to store.",
  "Let n be the number of nodes. Each node has its next link changed once, so time is O(n). The code reuses the same nodes instead of copying them. It keeps just a few links to track its progress. That gives O(1) extra working space.",
  [
    ["In place", "Change the existing structure instead of building a full copy."],
    ["New head", "The node that becomes first after reversing the links."],
  ]
);
explain(
  45,
  "Find the first position where a value is large enough, even if the target is missing.",
  "You want the first position where a sorted list reaches or passes a target. In [2, 4, 4, 8] with target 4, that position is 1, the first 4.\n\nCheck a middle value. If it is below the target, the answer must be farther right. If it equals or exceeds the target, it is a possible answer, but an earlier position might also work. Keep looking left.\n\nIf every value is below the target, return the position just after the list. For target 9 in this four-item list, return 4. This also tells you where to insert a new target while keeping the list sorted.",
  "For [2, 4, 4, 8] and target 4, return position 1, the first 4. For target 9, return 4, just after the list. Each round removes about half of the remaining possible positions.",
  "Remember the left, right, and middle positions. You do not need to copy the part of the list still being searched.",
  "Let n be the list length. Each comparison removes about half the remaining possible positions, giving O(log n) time. Only a few position variables are needed, giving O(1) extra space. The final answer can equal n, which means just after the last item. Do not try to read items[n].",
  [
    ["Lower bound", "The first position whose value is at least the target."],
    [
      "Half-open range",
      "Keep the left boundary inside the range and the right boundary just outside it. For example, [1,4) includes positions 1, 2, and 3, but not 4.",
    ],
  ]
);
explain(
  46,
  "Follow the search-tree rule until you find an empty place for the new value.",
  "You want to add a value to a binary search tree. Keep every smaller value in a node’s left branch and every larger value in its right branch.\n\nSuppose the root is 5 and its left child is 2. To insert 4, go left from 5, then right from 2. That child is empty, so put a new node holding 4 there.\n\nReturn the root of the resulting tree, not just the inserted node. If the tree is empty, the new node becomes its root. If the value already exists, leave the tree unchanged.",
  "The tree has root 5 and left child 2. To insert 4, first compare 4 with 5 and go left. Compare 4 with 2 and go right. The right child is empty, so put 4 there. Only the nodes on this path need to be checked. A longer path would need more checks.",
  "The recursive calls wait along the path to the new node. A longer path means more waiting calls. The newly inserted node also needs its own storage.",
  "Let h be the number of levels in the longest branch. Inserting a value follows one path, taking O(h) time. This recursive version also keeps waiting calls along that path, using O(h) space. A balanced tree with n nodes has O(log n) levels. This ordinary insertion does not balance the tree, so a chain can grow to n levels.",
  [
    ["Insert", "Add a new item while keeping the structure’s ordering rule."],
    ["Unbalanced tree", "A tree with a long branch, possibly shaped like a chain."],
  ]
);
explain(
  47,
  "A tree’s height is the number of nodes on its longest downward path.",
  "Here, a tree’s height counts nodes along its longest downward path. An empty tree has height 0. A single node has height 1.\n\nAsk each child branch for its height. If the left branch has height 2 and the right branch has height 1, the longer branch contributes 2. Add 1 for the current node, giving height 3.\n\nUse the same rule at every node: 1 plus the larger child height. Do not add both child heights, because one downward path cannot travel down both branches.",
  "A leaf has height 1. A root above that leaf has height 2. Count each node once while combining the branch answers, rather than separately walking every possible path from the root.",
  "A call waits for the heights of its child branches. The deepest branch can leave the most calls waiting at once. Those waiting calls are what use extra memory here.",
  "Let n be the number of nodes and h be the height of the tree. Every node is visited once, so time is O(n). Calls can wait along the deepest branch while a lower answer is calculated. Up to h calls wait together, giving O(h) space. This lesson counts nodes on the path. Other definitions sometimes count edges instead.",
  [
    ["Leaf", "A node with no children."],
    ["Subtree", "A node together with all the nodes below it."],
  ]
);
explain(
  48,
  "When a smaller problem appears again, reuse its saved answer.",
  "You may climb 1 or 2 stairs per move. Counting ways to climb 4 stairs asks for the counts for 3 stairs and 2 stairs. But calculating the count for 3 stairs asks about 2 stairs again.\n\nSave the answer the first time you calculate it. The saved count for 2 stairs is 2. The next call asking about 2 stairs can return that 2 immediately instead of repeating the smaller calls.\n\nA dictionary can connect each stair count to its answer. Check it before calculating, and save each new answer before returning. This is memoization: remembering a completed answer for the same question.",
  "Counting ways to reach step 4 asks for the count for step 2 more than once. The first request calculates that count and saves 2. The next request can read the saved 2 immediately. It does not need to calculate the smaller stair counts again.",
  "The cache stores answers already calculated. Python also stores information for calls still waiting to finish. Both can grow when the requested number of stairs grows.",
  "Let n be the number of stairs. The code may ask about the same step number many times, but it fully calculates each different step count only once. There are O(n) such counts, giving O(n) time for these small inputs. The saved answers and waiting calls can both grow with n, giving O(n) space.",
  [
    ["Memoization", "Saving a function’s answer so the same question can reuse it later."],
    ["Cache", "The place where those reusable answers are saved."],
  ]
);
explain(
  49,
  "Fill small answers first so each bigger answer can use them.",
  "You start at the top-left cell of a grid and may move only right or down. You want to count routes to the bottom-right cell, not find the shortest distance.\n\nA route into a cell must arrive from above or from the left. Add the route counts saved in those two cells. In a 2-row, 3-column grid, the bottom-middle cell gets 1 + 1 = 2 routes.\n\nThe final cell then gets 1 route from above and 2 from the left, totaling 3. Fill the grid from top to bottom and left to right so every needed earlier answer is ready.",
  "A 2-row, 3-column grid has 6 cells. The top row and left column each have one route. The next inner count is 1 + 1 = 2. The final count is 1 + 2 = 3.",
  "Save one route count in each grid cell. Adding rows or columns creates more cells, so this full-table version needs more memory.",
  "Let r be the number of rows and c be the number of columns. The table has r times c cells. Filling each cell once takes O(r × c) time. Saving all those cells uses O(r × c) space. A version that saves one row could use less memory, but the full table is easier to inspect while learning.",
  [
    ["DP table", "A table of saved answers to smaller questions."],
    ["Dependency", "An earlier answer that the current answer needs."],
  ]
);
explain(
  50,
  "Use one table row per item to compare taking that item with leaving it.",
  "You have items with weights and values, plus a carrying limit. Each item is available once. For example, weight 2 worth 3 and weight 3 worth 4 fit together under limit 5, giving value 7.\n\nUse a table with one row for each stage of allowing another item. A column is a weight limit. Each cell answers: what is the greatest value I can carry under this limit using these items?\n\nFor a new item, compare leaving it out with taking it once. If you take it, add its value to the previous row’s answer for the room left over. Reading the previous row prevents using the new item more than once.",
  "You can carry weight 5. Item A weighs 2 and is worth 3. Item B weighs 3 and is worth 4. After considering only A, the table says the best value at limit 5 is 3. When B becomes available, compare that old answer with taking B. Taking B leaves room for A, giving 4 + 3 = 7.",
  "Each row represents one stage of allowing items. Each column represents a weight limit. The full table stores an answer for each of those row-and-column choices.",
  "Let n be the number of items and C be the weight limit. The table has about n times C cells to fill. Time and table space are O(n × C). The cost grows with the weight limit itself. For example, limit 1000 needs many more columns than limit 10.",
  [
    ["Previous item row", "Answers that were calculated before the current item was allowed."],
    ["0/1 choice", "Each item may be taken once or not taken at all."],
  ]
);
explain(
  51,
  "For each number, find the next larger number to its right.",
  "For each number, you want the first larger number appearing later in the list. In [2, 1, 3], the answer for both 2 and 1 is 3. Nothing follows 3, so its answer is None.\n\nKeep a stack of positions still waiting for an answer. When 3 arrives, it is larger than the top waiting value, 1. Save 3 as that position’s answer and remove the waiting position.\n\nNow 2 is on top and 3 is larger than it too, so answer that position as well. Then put 3’s position on the stack. Equal values do not count as larger; they must keep waiting.",
  "For [2, 1, 3], both 2 and 1 wait. When 3 arrives, it answers 1 and then 2. One new value can remove several waiting positions, but every position is added once and removed at most once.",
  "The stack remembers positions still waiting for a larger value. In the worst case, every position may have to wait. The result list also needs one entry per input position.",
  "Let n be the number of input values. Each position is added to the stack once. Once removed, that position is never added again. There can therefore be at most n additions and n removals. This gives O(n) total time, even when one value removes many positions. The stack and returned answer list use O(n) space.",
  [
    ["Monotonic stack", "A stack whose values are kept in one order. Here, each new waiting value is no larger than the value below it."],
    ["Strictly greater", "Larger, not equal. Equal values must keep waiting."],
  ]
);
explain(
  52,
  "Sort time ranges by their start, then combine ranges that touch or overlap.",
  "A range [1, 3] includes 1, 2, and 3. A range [2, 5] overlaps it, so together they cover [1, 5]. This task combines ranges that overlap or touch.\n\nSort the ranges by their start. Compare the next range with the latest combined range. If its start is at or before the current end, extend the end when necessary.\n\nIf it starts after the current end, there is a gap, so begin a separate range. For [1, 3], [2, 5], and [8, 9], the result is [[1, 5], [8, 9]].",
  "For [1,3], [2,5], and [8,9], the first two combine into [1,5]. The last stays separate. Sorting puts possible overlaps next to each other; the scan then checks each range once.",
  "This version creates a sorted copy of the ranges and a list of the combined ranges. Those lists can both grow with the input.",
  "Let n be the number of ranges. Sorting takes O(n log n) time. After sorting, one pass checks all n ranges, taking O(n). The total growth is therefore O(n log n). This version creates a sorted copy and a result list, which together use O(n) extra and output space.",
  [
    ["Interval", "A range with a start and an end."],
    ["Closed endpoints", "The endpoints belong to the range, so [1,3] and [3,5] touch and are combined here."],
  ]
);
explain(
  53,
  "XOR makes matching pairs cancel, leaving the one unpaired value.",
  "Every integer in this exercise appears exactly twice, except one that appears once. In [5, 2, 5], you need to return 2.\n\nPython’s ^ operator is XOR. It compares binary digits: equal digits produce 0 and different digits produce 1. A number XOR itself is 0; a number XOR 0 stays unchanged.\n\nStart a running answer at 0 and XOR every value into it. The two 5s cancel, leaving 2. Pair order does not matter. The rule depends on the promised pairs; it is not a general way to count arbitrary repetitions.",
  "For [5, 2, 5], the two 5s cancel and the answer is 2. Process each input value once. Doubling the number of fixed-size values doubles the number of XOR operations.",
  "Keep one running XOR answer as you read the list. There is no need to save a set of all earlier values. Very large integer values still need more bits to store than small integers.",
  "Let n be the number of input values. There is one XOR operation per value. If the integers have a fixed size, this takes O(n) time. Only one running answer and a few loop values are stored, giving O(1) extra space. Python also supports very large integers. Larger bit lengths make XOR take more work and make the stored answer larger.",
  [
    ["Bit", "One binary digit: 0 or 1."],
    ["XOR", "Compare bits: equal bits give 0, different bits give 1. In Python, write ^."],
  ]
);
explain(
  54,
  "Different numbers can share a storage box. Keep each number separately.",
  "Imagine three labeled boxes: 0, 1, and 2. Each box holds a small list of numbers. In a hash table, these storage boxes are called buckets. The numbers we want to store are called keys.\n\nWe need a rule for choosing a box. In this exercise, divide the key by 3 and use the remainder. Python writes this as key % 3. Both 1 % 3 and 4 % 3 are 1, so keys 1 and 4 go into box 1.\n\nThe keys are still different numbers. Keep both: box 1 contains [1, 4]. Different keys choosing the same box is called a collision. It does not mean one key replaces the other.\n\nIf key 1 appears again, open box 1 and compare the stored numbers with 1. An equal 1 is already there, so do not add it again. The box number tells you where to look; comparing the keys tells you whether you found the same number.",
  "With 3 buckets, keys 1 and 4 both choose bucket 1. Dividing either key by 3 leaves remainder 1, but they are still different keys. If four different keys all choose one bucket, later insertions must check earlier keys there. They can make 0, then 1, then 2, then 3 comparisons: 6 altogether.",
  "Create the requested number of buckets. Inside them, save each different key. More buckets or more distinct keys require more memory.",
  "Let n be the number of input keys and b be the number of buckets. The buckets and saved keys can use O(b + n) space. If all distinct keys land in one bucket, the first key checks no earlier keys, the next checks one, and the next checks two. Those growing searches can add up to O(n²) comparisons. That is why a fixed bucket count does not guarantee fast lookups.",
  [
    ["Hash", "A calculation used to choose where to store a key."],
    ["Collision", "Different keys choose the same bucket."],
    ["Bucket", "One storage slot, holding a list of keys in this exercise."],
  ]
);
explain(
  55,
  "Move one pointer one link at a time and another two links at a time to detect a loop.",
  "A linked path may loop back instead of ending. For example, 0 → 1 → 2 → 1 keeps visiting nodes 1 and 2. This task asks whether the path from your chosen start contains such a cycle.\n\nFollow the path with two positions. The slow one moves one link each round, while the fast one moves two. On the example path, after one round they are at 1 and 2; after the next round they both reach 2.\n\nA meeting after moving proves there is a loop. Reaching None proves the path ends. Do not count their shared starting position as a meeting, and check links exist before moving the fast position twice.",
  "For links 0 → 1 → 2 → 1, the pointers eventually meet inside the 1 → 2 → 1 loop. They do not need to save every visited position. Longer trails may require more link-following steps.",
  "Keep only the current slow position and the current fast position. Unlike a visited set, these two positions do not keep a record of everywhere the search has been.",
  "Let n be the number of available nodes. Following the links takes O(n) time before the pointers meet or the trail ends. The code remembers only the two current positions, giving O(1) extra space. Before moving the fast pointer twice, check that the links it needs exist.",
  [
    ["Fast and slow pointers", "Two positions moving through the same links at different speeds."],
    ["Cycle", "A loop that keeps returning to previously visited nodes."],
  ]
);
explain(
  56,
  "When roads can have negative costs, try improving the route costs more than once.",
  "A negative road cost can represent a credit. A direct road 0 → 1 costs 4, but 0 → 2 costs 5 and 2 → 1 costs -3. Going through 2 therefore costs 2, which is cheaper.\n\nSave the best known cost to each place. Read every road: if you can reach its start, check whether taking it makes the destination cheaper. Repeat whole passes so improvements can reach places farther along. This is the Bellman–Ford method.\n\nWith n places, a route without a repeated place uses at most n - 1 roads. After up to n - 1 passes, check once more. A further improvement means a reachable negative-cost loop exists. Going around it again and again can keep reducing a cost, so this task returns [].",
  "A direct road from 0 to 1 costs 4. Going from 0 to 2 costs 5, and the road from 2 to 1 costs -3. That second route costs 5 - 3 = 2, which is cheaper than 4. Repeated road passes let improvements like this spread through the network.",
  "Keep one best-known distance for each place. The roads already belong to the input, so the distance list is the main extra storage used by this version.",
  "Let V be the number of places and E be the number of roads. Setting up the distance list takes O(V) time. The algorithm makes up to V - 1 full road passes and one more check. This gives O(V × E + V) worst-case time. The distance list uses O(V) extra space. If a negative-cost loop is reachable, going around it repeatedly keeps making some routes cheaper. Those routes have no smallest finite cost.",
  [
    ["Relax an edge", "Try using a road to lower the best known cost to its destination."],
    ["Negative cycle", "A loop whose total cost is below zero; repeating it keeps reducing the route cost."],
  ]
);
explain(
  57,
  "Changing one value should not mean calculating every sum again.",
  "Running totals make sum questions easy, but changing an early value would change many later totals. A Fenwick tree instead saves totals for selected blocks of values.\n\nFor [2, 1, 3, 4], its helper positions start at 1. Block 1 stores 2; block 2 stores 2 + 1; block 3 stores 3; block 4 stores the total 10. To add the first three values, use block 3 and block 2: 3 + 3 = 6.\n\nIf the first input value increases, update blocks 1, 2, and 4, which contain that value. Block 3 does not contain it and stays unchanged.\n\nThe expression i & -i gives the size of the block ending at helper position i. For a sum, subtract that size to reach the next block. For an update, add it to reach a larger block that also contains the changed item. The walkthrough shows the actual jumps.",
  "For [2, 1, 3, 4], you want the sum of the first three values. One stored block contains the third value, 3. Another stored block contains the first two values, 2 + 1 = 3. Add those block sums to get 6. If the first value later increases by 5, only stored blocks containing that first value need updating.",
  "The helper array has one main entry for each input value. It therefore grows with the input list. Any answers returned for prefix questions need separate space.",
  "Let n be the list length. This version builds its helper array by making an update for each of the n values. Each update takes O(log n) time, so the build takes O(n log n). After that, one update or prefix question takes O(log n) time. The helper array uses O(n) space. Returned query answers need separate space.",
  [
    ["Prefix sum", "The sum of the first few values."],
    ["Fenwick tree", "A helper array that supports both changing a value and asking for a prefix sum efficiently."],
    ["lowbit(i)", "The jump size for position i. Python computes it with i & -i: at 1 it is 1, at 2 it is 2, at 3 it is 1, and at 4 it is 4."],
  ]
);
explain(
  58,
  "A failed match does not always mean starting over. Some matched letters may still be useful.",
  "You want to find a smaller string, the pattern, inside a larger text. For pattern aab in text aaab, the match begins at position 1. The attempt at position 0 fails on its third letter.\n\nThat failed attempt already matched aa. Its final a could also be the beginning of the next attempt. Keep that useful a instead of starting the comparison from nothing.\n\nKMP saves these reusable lengths in a table for the pattern. For aab, the table is [0, 1, 0]: after matching aa, one a can be reused. After a mismatch, use the table to shorten the matched part and compare the current text letter again.\n\nThe text position never moves backward. The pattern position may move backward to a saved shorter match. Continue until the whole pattern matches, or until the text ends.",
  "Search for aab in aaab. The first two a letters match. The pattern then expects b, but the next text letter is another a. The second a already matched could be the start of a new attempt. Keep that useful a. Match the next a and then b to finish a match beginning at position 1.",
  "Save the reuse table for the pattern. A longer pattern needs a longer table. The text itself is read in place rather than copied after every mismatch.",
  "Let n be the text length and m be the pattern length. Building the table takes O(m) time. Searching the text takes O(n) time, including the repeated comparisons after mismatches. This is possible because a backward pattern jump gives up progress made by an earlier forward move. The combined time is O(n + m). The pattern table uses O(m) space.",
  [
    ["KMP", "The name of this text-search method: Knuth–Morris–Pratt."],
    ["Proper prefix", "A beginning shorter than the whole text. The whole text itself does not count."],
    ["Suffix", "An ending. In abab, ab is both a beginning and an ending."],
  ]
);
explain(
  59,
  "Find the largest number that divides both inputs with no remainder.",
  "A common divisor divides both numbers without leaving a remainder. For 18 and 12, the largest such number is 6, because 18 = 3 × 6 and 12 = 2 × 6.\n\nEuclid’s method replaces the pair with the second number and the remainder. Since 18 % 12 is 6, the pair becomes (12, 6). These numbers have the same common divisors as the old pair.\n\nRepeat: 12 % 6 is 0, so the pair becomes (6, 0). Stop when the second number reaches 0; the first number is the answer. Start with absolute values to handle negative inputs. This task defines the answer for (0, 0) as 0.",
  "18 and 12 become 12 and 6, then 6 and 0. The answer is 6. Remainders keep shrinking, so the method avoids trying every possible divisor one by one.",
  "Keep the current pair of numbers. Each division replaces that pair with a smaller pair. The function does not store all the earlier pairs.",
  "Let s be the smaller starting number when both inputs are positive. The number of remainder steps grows as O(log s). The code keeps only a fixed number of integer variables. When we count how many numbers are stored, that is O(1) extra space. Very large integers need more time for division and more storage. If one input is 0, handle that case directly. This exercise defines the answer for (0,0) as 0.",
  [
    ["Divisor", "A number that divides another number with no remainder."],
    ["Greatest common divisor or GCD", "The biggest positive divisor shared by both numbers, except the special (0,0) convention."],
    ["Remainder", "What is left after whole-number division; Python uses %."],
  ]
);

const walks = {
  54: [
    "Start with three empty buckets: [[], [], []]. Their labels are 0, 1, and 2. For each number, its remainder after division by 3 tells us which bucket to open.",
    "Read 1. The remainder is 1, so open bucket 1. It is empty. Put 1 there: [[], [1], []].",
    "Read 4. Its remainder is also 1. Open bucket 1 and find 1 already there. Since 4 is a different number, keep both: [[], [1, 4], []]. This is a collision.",
    "Read 1 again. Open bucket 1 and compare the actual numbers. The bucket already contains 1, so leave it unchanged. Do not add the same number twice.",
    "Read 2. Its remainder is 2, so put it in bucket 2. The final answer is [[], [1, 4], [2]]. Bucket 0 is still empty, but it keeps its place in the answer.",
  ],
  14: [
    "To calculate factorial(3), first ask for factorial(2). The call for 3 waits.",
    "The call for 2 asks for factorial(1). That call asks for factorial(0), which returns 1.",
    "Return through the waiting calls: 1 × 1 = 1, then 2 × 1 = 2, then 3 × 2 = 6.",
  ],
  21: [
    "There is 1 way to stay at step 0 without moving, and 1 way to reach step 1.",
    "Step 2 has 2 ways: [1,1] and [2]. Step 3 has 3 ways: [1,1,1], [1,2], and [2,1].",
    "To reach step 4, finish from step 3 with a move of 1, or from step 2 with a move of 2. Add their counts: 3 + 2 = 5.",
  ],
  22: [
    "Coins are [1,3,4]. Save 0 coins for amount 0, 1 coin for amount 1, 2 for amount 2, and 1 for amount 3.",
    "For amount 6, try finishing with coin 3. The remaining amount is 3, which already needs 1 coin. Total: 1 + 1 = 2 coins.",
    "Finishing with coin 4 leaves amount 2, which needs 2 coins. Total: 2 + 1 = 3. Keep the better answer: 2 coins.",
  ],
  28: [
    "Start with three groups: {0}, {1}, and {2}. Each item is its own group leader.",
    "Join 0 and 1. Now the groups are {0,1} and {2}: two groups.",
    "Join 1 and 2. Follow 1 to its group leader first, then join the groups. All three items now belong to one group.",
  ],
  38: [
    "Start at 8. After the first halving, the number is 4. Count: 1 round.",
    "Halve 4 to 2. Then halve 2 to 1. Stop. Total: 3 rounds.",
    "Now start at 16. First halve it to 8. After that, follow the same 3 rounds as before. Total: 4 rounds.",
  ],
  40: [
    "There are 3 places, named 0, 1, and 2. Allowed moves are 0 → 1 and 0 → 2.",
    "Create one empty list for each place: [[], [], []].",
    "Put destinations 1 and 2 in place 0’s list. The result is [[1,2], [], []]. Places 1 and 2 have no outgoing roads.",
  ],
  48: [
    "To count ways to reach step 4, ask for the counts for steps 3 and 2.",
    "Calculating step 3 also needs step 2. Save the answer for step 2 the first time: 2 ways.",
    "When step 2 is asked about again, read the saved 2. The answer for step 4 is 3 ways for step 3 plus 2 ways for step 2: 5.",
  ],
  49: [
    "Use a grid with 2 rows and 3 columns. There is only 1 route to each top-row cell: keep moving right. The left-column cells also have 1 route each.",
    "For the middle cell of the bottom row, add the count above, 1, and the count to its left, 1. That cell has 2 routes.",
    "For the final cell, add the count above, 1, and the count to its left, 2. The answer is 3 routes.",
  ],
  50: [
    "You can carry weight 5. Item A has weight 2 and value 3. Item B has weight 3 and value 4.",
    "With only A allowed, the best value at limit 5 is 3. Save that in the first item row.",
    "Now allow B. Leaving B keeps value 3. Taking B leaves weight room 2, which the previous row says can hold A worth 3. Taking both gives 4 + 3 = 7.",
  ],
  57: [
    "Items are [2,1,3,4]. Inside the helper array, number the positions 1, 2, 3, 4. Position 1 holds 2. Position 2 holds the sum 2 + 1 = 3.",
    "Position 3 holds 3. Position 4 holds the sum of all four values: 10. These are the stored blocks.",
    "To sum the first 3 items, read block 3, worth 3. Move to block 2, worth 3. Add them: 3 + 3 = 6.",
    "The jump size is i & -i. At position 3 it gives 1, so move from 3 to 2. At position 2 it gives 2, so move from 2 to 0 and stop.",
    "To add 5 to input position 0, begin at helper position 1. Update blocks 1, 2, and 4, because those blocks contain that item. Block 3 stays unchanged.",
  ],
  58: [
    "Search for pattern aab inside text aaab. The pattern’s first two letters are aa. Its beginning a also appears at the end of aa. Save that reusable length: 1.",
    "Begin the search. The first two text letters aa match the first two pattern letters. Next the pattern expects b.",
    "The next text letter is a, so that comparison fails. Do not throw away both matched letters: the second a could start a new match. Keep that one a.",
    "Compare the current text a with the pattern’s second a. They match. Then the final text b matches the pattern’s b.",
    "The whole pattern aab matches at text positions 1, 2, and 3. Return 1. No earlier text position needed to be visited again.",
  ],
};
const sentenceWarnings = {
  0: "Do not return -1 after just one mismatch. An item later in the list might still match. Return -1 only after the loop has checked every item.",
  1: "An empty list has no first item. Reading items[0] would fail for that input. Starting total at 0 lets the empty list return 0 safely.",
  2: "Two loops one after another do not compare every pair. They still do work proportional to the list length. A loop inside another loop may do far more work, but count what the loops actually do before naming their cost.",
  3: "Return False as soon as a pair differs. Do not keep checking and accidentally replace that result later. This task compares characters exactly, including spaces and capital letters.",
  4: "Do not start the best sum at 0. If all valid group sums are negative, 0 would be an answer no group actually has. Start with the sum of the first valid group.",
  5: "This task includes the right endpoint of each requested range. Use the running total just after that endpoint, then subtract the total before the left endpoint. The leading 0 also makes a range starting at position 0 work.",
  6: "After checking the middle, move past that position when the value does not match. Keeping the same middle position can leave the search stuck on a one-item range.",
  7: "Save the value you want to insert before shifting anything. Otherwise a shift can overwrite that value before it has been put in its new place.",
  8: "One list can still have unused values when the other list runs out. Copy those remaining values too. Ending immediately would silently lose part of the input.",
  9: "It is not enough for the stack to be empty at the end. Every closing bracket must also have an opening bracket waiting when it arrives. The text )( fails at its first character.",
  10: "pop() removes the most recently added item. That would make this act like a stack. Use popleft() to take the oldest item instead.",
  11: "After reading a node, move current to that node’s next link. If current never changes, the loop keeps reading the same node forever.",
  12: "Do not set a word’s count to 1 every time it appears. Read its old count and add 1. Only a word not seen before starts from a count of 0.",
  13: "One position cannot supply both numbers. A list containing one 4 cannot make a pair for target 8. A list containing two 4s can, because they occupy two positions.",
  14: "Every recursive call that has not finished uses memory. Short recursive code can therefore use a lot of memory. A chain that gets too deep can reach Python’s recursion limit.",
  15: "A binary tree does not have to keep smaller values on the left. Reading left, node, then right is sorted only if the tree also follows the binary search tree ordering rule.",
  16: "A search tree can become a long one-sided chain. Searching it may then visit every node. Do not assume every search tree automatically cuts the remaining work in half.",
  17: "A heap is not a fully sorted list. Only the parent-child ordering is guaranteed. To get the smallest values in order, remove them with heappop rather than reading successive array positions.",
  18: "This BFS counts how many roads a route uses. It does not add different road costs. If one road can cost more than another, the route with the fewest roads may not be the cheapest.",
  19: "Changing the order of a node’s neighbors can change the order of visits. This task asks you to sort the reached names before returning them, so those different visit orders still give the same required answer.",
  20: "Choosing the shortest talk or the earliest starting talk is not the same as choosing the earliest finishing talk. Those other rules can block a better answer. This task allows one talk to start exactly when another ends.",
  21: "A simple recursive version can calculate the same stair counts many times. This version calculates each new count from the last two instead. Keep those two counts rather than restarting the smaller calculations.",
  22: "Some amounts cannot be made with the allowed coins. Mark those amounts as unreachable while filling the table. If the requested amount is still unreachable at the end, return -1.",
  23: "Save a place’s previous-place record only when first discovering it. Changing that record later can spoil the shortest route. It can even make the backward links form a loop.",
  24: "Splitting a list does not sort it by itself. When merging, compare the next unused value from each sorted half. Also copy any values left after one half runs out.",
  25: "Do not send all values equal to the pivot into another recursive call. That group might not get smaller, so the calls could continue forever. Keep equal values together without sorting them again. Uneven smaller and larger groups can still make this version slow.",
  26: "Save path.copy(), not path. Saving path alone stores another reference to the same changing list. Later additions and removals would change earlier answers too. After exploring a choice with an item, remove that item before exploring another choice.",
  27: "Reaching the path for car does not mean car was inserted as a complete word. The path might exist only because cart was inserted. A complete-word check must also look for an end-of-word marker.",
  28: "Join the group leaders, rather than pointing arbitrary members at one another. If both items already have the same leader, they already belong to one group. Do not reduce the group count again.",
  29: "This rule checks loops in undirected graphs. It does not correctly check every directed graph. For this exercise, repeating an undirected edge counts as a cycle, and a road from a node to itself also counts.",
  30: "A cheaper route can leave an older, more expensive entry in the heap. Skip that entry if its saved cost is no longer current. This method also requires road costs to be zero or positive. A negative cost breaks the reasoning behind choosing the cheapest waiting visit.",
  31: "If some jobs never become ready, the returned order is incomplete. Do not return that partial list as if it were a valid order for all jobs. For this task, return [] when all jobs cannot be ordered.",
  32: "Some networks cannot connect every place. In that case, this task returns -1. Negative road costs are allowed here, unlike in ordinary Dijkstra. This problem is about total connection cost, not the cheapest route from one start.",
  33: "You may skip letters, but you may not change their order. The letters do not have to sit next to one another. The extra first row and column represent empty text, so their answers are all 0.",
  34: "Only an earlier, smaller number can come before the current number in a strictly increasing sequence. An equal number does not extend it. Remember what each saved answer means: the best length ending at that particular position.",
  35: "Check weight limits from high to low when updating one row. Moving upward can read an answer that already uses the current item. Adding the item again would incorrectly take it twice.",
  36: "list(items) copies the outer list, not every object inside it. If an item is itself a list, both outer lists still point to that same inner list. This task uses integers, so there are no inner lists to copy.",
  37: "A set does not promise sorted order. This exercise only asks for the number of distinct values, so their order is not needed. The keys here are integers; a mutable list cannot be added as a set member.",
  38: "Use n // 2 so the result stays a whole number. Count one round for each halving. If n starts at 1, the function should do no rounds and return 0.",
  39: "Make sure the recursive calls reach a case that can answer directly. Also keep adding answers for every item in the list. Returning from inside the loop would skip any items still left.",
  40: "A road from a to b allows a move in that direction only. Add the reverse entry as well only when the road is undirected. Also create separate inner lists, rather than sharing one inner list between all places.",
  41: "A heap only orders each parent against its children. It does not put the whole stored list in sorted order. To remove the root later, a different repair moves a replacement value downward.",
  42: "All values must be positive for this particular shrinking rule. Removing a negative value would increase the sum instead of decreasing it. A fixed-size window is a different method and does not need positive values.",
  43: "The current stretch must have no gaps. It is a substring, not a sequence where characters may be skipped. Keep removing from the left until the older repeated character is actually gone.",
  44: "Save the original next node before changing current.next. Without that saved link, the rest of the original list may no longer be reachable. This task changes the supplied nodes rather than making replacement nodes.",
  45: "The right boundary starts just after the last input position. It can equal len(items), so do not read items[right]. That boundary helps represent an answer that belongs after the whole list.",
  46: "This insertion does not rebalance the tree. Adding 1, then 2, then 3, then 4 can create a long rightward chain. Do not assume the tree will stay short after every insertion.",
  47: "This lesson counts nodes on the longest path. A single node therefore has height 1, and an empty tree has height 0. Some other resources count edges instead, which changes those two starting values.",
  48: "The saved answer for 2 stairs is 2 when moves of 1 or 2 are allowed. If only 1-step moves are allowed, the answer for those same 2 stairs is 1. Do not reuse a saved answer after changing the rules that determine it.",
  49: "Make a separate list for every row. Writing [[0]*cols]*rows repeats the same inner list. Changing a cell through one row name could then change what another row name shows.",
  50: "When taking an item, read the smaller-weight answer from the previous row. That row was calculated before the current item was allowed. Reading a changed value from the current row could use the item twice.",
  51: "Store positions so you know which earlier result to fill. The answer must be strictly larger, so an equal value cannot settle a waiting position. That position must keep waiting.",
  52: "This task combines overlapping ranges. It is not the earlier problem of choosing as many separate ranges as possible. Here, ranges that share an endpoint also overlap and must be combined.",
  53: "The input promise matters: every value except one appears exactly twice. If a value appears three times, two copies cancel but one copy remains. This method does not find the most frequent value in a general list.",
  54: "The bucket number tells you where to look, not which key you have found. Always check the key itself. If many keys choose one bucket, searching that bucket can become slow.",
  55: "Before moving the fast pointer twice, check that both needed links exist. Do not report a cycle just because both pointers start at the first node. A meeting after they have moved is the evidence you need.",
  56: "Only try roads from places reachable from the start. A negative-cost loop in a disconnected part of the graph cannot affect routes from the start. A reachable negative-cost loop does matter because using it repeatedly can keep lowering some route costs.",
  57: "Convert input position 0 to helper position 1. Beginning an update at helper position 0 would give a jump of 0, so the loop would never move forward.",
  58: "A reuse-table entry is a length, not a position in the text. After a mismatch, use the saved shorter match length. Do not restart the text search from its beginning.",
  59: "Begin with absolute values so negative signs do not affect the result. This task follows Python’s convention that gcd(0,0) returns 0.",
};

const questionClarity = {
  0: {
    predict: {
      prompt:
        'Search ["rice", "tea", "tea"] from left to right and return the first matching position. Which position should the search return for "tea"?',
      options: ["Index 1", "Index 2", "Index 0"],
      why: "The first tea is at position 1. Stop there, even though another tea appears later.",
    },
    reflect: {
      prompt: "A left-to-right search looks for a missing target in a list of 100 items. How many items must it check before returning -1?",
      options: ["1", "100", "50"],
      why: "Any unchecked item could still be the target, so a missing target requires checking all 100.",
    },
  },
  1: {
    predict: {
      prompt: "The function adds every integer in a list. What should it return for the empty list []?",
      options: ["None", "0", "An error"],
      why: "Start at 0. With no values to add, the answer stays 0.",
    },
    reflect: {
      prompt: "Your function returns the expected answers for four test inputs. What have those tests shown?",
      options: ["Correctness for every possible input", "Correctness for those four inputs", "The fastest possible algorithm"],
      why: "Those four inputs worked. Other inputs may still reveal a bug, so also explain why the steps should work.",
    },
  },
  2: {
    predict: {
      prompt: "A plan reads every list item twice. Going from 10 items to 20 items changes the number of visits in which way?",
      options: ["20 visits become 40: twice the list, twice the visits", "20 visits become 80: four times as many visits", "The visits stay at 20"],
      why: "For 10 items you make 20 visits; for 20 items you make 40. Work still grows with list length.",
    },
    reflect: {
      prompt:
        "The maximum-finding loop keeps one best value and one current position. What happens to the extra saved information when the list gets longer?",
      options: ["Save an extra value for every input item", "Keep the same few variables", "Save a separate answer for every pair of input values"],
      why: "You keep one best value whether the input has 10 items or 1000.",
    },
  },
  3: {
    predict: {
      prompt: 'Compare matching letters from both ends of "noon", moving inward. How many letter pairs need checking?',
      options: ["4", "2", "1"],
      why: "Compare n with n, then o with o: two pairs.",
    },
    reflect: {
      prompt: "We return True for an empty string when checking for a palindrome. Why does that fit the pair-comparison rule?",
      options: ["It has no mismatching pair", "It has one character", "It should raise an error"],
      why: "There are no pairs to disagree, so the empty text passes this rule.",
    },
  },
  4: {
    predict: {
      prompt: "A moving group currently totals 10. The value 4 leaves on the left and the value 7 enters on the right. What is the new total?",
      options: ["13", "21", "7"],
      why: "Subtract the leaving 4 and add the entering 7: 10 - 4 + 7 = 13.",
    },
    reflect: {
      prompt: "When a fixed-size group moves one position, why reuse its previous sum instead of adding every value again?",
      options: ["It sorts the data", "Only the leaving and entering values need to change the total", "It skips negative values"],
      why: "Most values stay in the group. Reusing their total avoids adding them again.",
    },
  },
  5: {
    predict: {
      prompt: "For items = [3, 2, 7], the saved totals are prefix = [0, 3, 5, 12]. What is the sum of input positions 0 through 1, including both?",
      options: ["5", "3", "12"],
      why: "Positions 0 and 1 contain 3 and 2. Their sum is prefix[2] - prefix[0] = 5 - 0 = 5.",
    },
    reflect: {
      prompt: "When is it especially useful to build running totals once and answer each later section-sum question with a subtraction?",
      options: ["Many range-sum queries on unchanged data", "Every value changes after every query", "Finding a maximum only once"],
      why: "Build the running totals once, then reuse them for many questions.",
    },
  },
  6: {
    predict: {
      prompt: "The list is sorted from smallest to largest. Its middle value is 12 and the target is 19. Which values can you rule out?",
      options: ["The smaller half, including 12", "The larger half", "Neither"],
      why: "Everything on that side is 12 or smaller. None of it can be 19.",
    },
    reflect: {
      prompt: "Why does this middle-and-halving search need the list to be sorted first?",
      options: ["Sorted order is unnecessary", "Positive values are enough", "Without sorted order, the half you discard could contain the target"],
      why: "Without sorted order, the discarded half might still contain the answer.",
    },
  },
  7: {
    predict: {
      prompt: "In insertion sort, [2, 5] is already ordered and the next value to insert is 4. Which earlier value must move one position right?",
      options: ["2", "5", "Both"],
      why: "Hold 4 aside. Only 5 is larger, so only 5 moves right.",
    },
    reflect: {
      prompt: "Which input lets insertion sort avoid moving earlier values out of the way?",
      options: ["Reverse-sorted", "Already sorted", "All inputs require the same shifts"],
      why: "Each value is already in the right place, so no earlier values need shifting.",
    },
  },
  8: {
    predict: {
      prompt: "You are merging the sorted lists [2, 8] and [3, 5]. After taking 2, which value should you take next?",
      options: ["8", "3", "5"],
      why: "The next choices are 8 and 3. Take 3 because it is smaller.",
    },
    reflect: {
      prompt: "Can comparing only the next unused value of each list reliably merge inputs that are not already sorted?",
      options: ["Yes", "No, both inputs must already be sorted", "Only when lengths match"],
      why: "An unsorted list can hide a small value behind a large one. The next-value comparison would miss it.",
    },
  },
  9: {
    predict: {
      prompt: 'The right end is the top of the stack ["a", "b", "c"]. Which value does pop() remove?',
      options: ["a", "b", "c"],
      why: "c was added last, so it is removed first.",
    },
    reflect: {
      prompt: 'Why should the parentheses checker return False for the text "(()"?',
      options: ["A closing bracket arrived first", "One opening bracket remains unmatched", "It has too many closing brackets"],
      why: "One opening bracket is still waiting for a closing bracket.",
    },
  },
  10: {
    predict: {
      prompt: "In a queue, A arrives, then B, then C. Which item should the first take operation remove?",
      options: ["C", "B", "A"],
      why: "A arrived first, so A leaves first.",
    },
    reflect: {
      prompt: "What extra work does list.pop(0) do that deque.popleft() avoids?",
      options: ["deque sorts items", "Removing a list’s first item shifts the rest", "Lists cannot store strings"],
      why: "Removing position 0 of a list moves the remaining items left. deque avoids that whole-list shift.",
    },
  },
  11: {
    predict: {
      prompt: "You have only the first node of a linked list. How do you reach its final node?",
      options: ["Jump directly by index", "Follow links from the head", "Sort the nodes first"],
      why: "Start at the head and follow each next link until the last node.",
    },
    reflect: {
      prompt: "In a loop that reads linked nodes, what happens if current is never changed to its next node?",
      options: ["The list is sorted", "The loop keeps visiting the same node", "The next node is selected automatically"],
      why: "Without moving current to the next node, the next loop repeats the same visit.",
    },
  },
  12: {
    predict: {
      prompt: 'Start with an empty word-count dictionary and read "a" three times. What should counts["a"] contain?',
      options: ["1", "3", "0"],
      why: "Each appearance adds 1, so three appearances give a count of 3.",
    },
    reflect: {
      prompt: "When counting words, what does one dictionary entry connect?",
      options: ["A word and its count", "Only the original order", "Every possible word"],
      why: "The word tells you which entry to update; the saved count tells you its total so far.",
    },
  },
  13: {
    predict: {
      prompt: "The list is [4] and the target is 8. Can you return a pair if the task requires two different input positions?",
      options: ["Yes, use index 0 twice", "No, two distinct positions are required", "Only if sorted"],
      why: "One item cannot be used as both members of the pair. You need two positions.",
    },
    reflect: {
      prompt: "Why save earlier numbers and their positions in a dictionary instead of searching all earlier values again for each new number?",
      options: [
        "Use extra memory to avoid searching earlier values repeatedly",
        "It sorts the input automatically",
        "It removes the need to handle repeated values",
      ],
      why: "Save earlier values in a dictionary so you do not have to search them from scratch.",
    },
  },
  14: {
    predict: {
      prompt: "A recursive function keeps calling itself and never reaches a stopping case. What happens?",
      options: ["The function automatically stops at 0", "Calls keep growing until an error", "The result is always 1"],
      why: "The calls keep asking for more calls until Python raises an error. You must provide a stopping case.",
    },
    reflect: {
      prompt: "As n grows, why can recursive factorial need more memory for its unfinished calls?",
      options: [
        "It always has the same number of unfinished calls",
        "A larger n can leave more calls waiting together",
        "It creates an array for every pair of values",
      ],
      why: "The call for 3 waits while the call for 2 works. That call also waits for a smaller call. Python keeps a record for every call still waiting.",
    },
  },
  15: {
    predict: {
      prompt: "In inorder traversal, when is a node’s own value added relative to its left and right branches?",
      options: ["Before both subtrees", "Between left and right subtrees", "After both subtrees"],
      why: "Read the left branch, then the current root, then the right branch.",
    },
    reflect: {
      prompt: "Which type of tree adds the smaller-left, larger-right rule that guarantees inorder values come out sorted?",
      options: ["Any binary tree", "A binary search tree", "Any graph"],
      why: "Only the search-tree rule puts all left values below the root and all right values above it.",
    },
  },
  16: {
    predict: {
      prompt: "In a binary search tree, the current value is 9 and the target is 4. Which child should you follow?",
      options: ["Left", "Right", "Both"],
      why: "4 is smaller than 9, so follow the left child.",
    },
    reflect: {
      prompt: "What tree shape can force an ordinary binary-search-tree search to check every node?",
      options: ["It has too many equal-size branches", "It becomes a long one-sided chain", "Its values are integers"],
      why: "A one-sided chain offers no large branch to skip, so a search may visit every node.",
    },
  },
  17: {
    predict: {
      prompt: "What is guaranteed about the value at the top of a min-heap?",
      options: ["All array positions are sorted", "The root is the smallest value", "The last value is the largest"],
      why: "No parent is larger than a child, so a smallest value must be at the root.",
    },
    reflect: {
      prompt: "After calling heapq.heapify(items), what should you expect it to have done?",
      options: ["Returns a new sorted list", "Rearranges items into a heap and returns None", "Returns only the largest value"],
      why: "heapify changes the list you give it and returns None. Keep using that changed list as the heap.",
    },
  },
  18: {
    predict: {
      prompt: "Breadth-first search must handle earlier discoveries before the next layer of places. Which waiting structure gives that order?",
      options: ["A stack", "A queue", "A sorted output list"],
      why: "A queue handles earlier discoveries first, before the next layer of places.",
    },
    reflect: {
      prompt: "Why does breadth-first search mark a place as seen as soon as it is added to the queue?",
      options: ["To sort node names", "To avoid repeated visits and cycles", "To change all edge weights to 1"],
      why: "Remembering seen places prevents another road from adding the same place again.",
    },
  },
  19: {
    predict: {
      prompt: "In a graph where every road counts as one move, does depth-first search always discover a shortest route first?",
      options: ["Yes", "No", "Only when names are sorted"],
      why: "A long trail might be explored before a shorter route is tried.",
    },
    reflect: {
      prompt: "This exercise asks for reachable place names in alphabetical order. What work remains after the places have been discovered?",
      options: ["Sort the discovered names alphabetically", "No work remains", "Compare every possible pair of roads"],
      why: "After exploring, this task still asks you to sort the returned names. Count that work too.",
    },
  },
  20: {
    predict: {
      prompt:
        "You want to leave as much time as possible for later talks. Among talks that fit after your last choice, which should this scheduling method choose?",
      options: ["Earliest finish", "Earliest start", "Longest duration"],
      why: "An earlier finish leaves at least as much time for later talks.",
    },
    reflect: {
      prompt: "Does a choice guarantee the best overall answer merely because it looks best at the current step?",
      options: ["Yes", "No, the greedy rule needs justification", "Only if implemented recursively"],
      why: "A choice can look helpful and still block a better complete answer. Explain why your particular choice is safe.",
    },
  },
  21: {
    predict: {
      prompt: "You may climb 1 or 2 stairs per move. There are 5 ways to climb 4 stairs and 8 ways to climb 5. How many ways reach stair 6?",
      options: ["40", "13", "8"],
      why: "Reach step 6 from step 5 or step 4. Add their counts: 8 + 5 = 13.",
    },
    reflect: {
      prompt: "In this stair-counting loop, why can the saved counts older than the most recent two be discarded?",
      options: ["They are always 0", "The next count needs only the last two counts", "Every DP problem needs the same number of saved values"],
      why: "The next answer uses only the last two counts. Older counts have no further job here.",
    },
  },
  22: {
    predict: {
      prompt: "You may reuse coin values 1, 3, and 4. What is the fewest coins that make exactly 6?",
      options: ["3", "2", "1"],
      why: "3 + 3 uses two coins. No single allowed coin makes 6.",
    },
    reflect: {
      prompt: "Why can choosing the largest coin first fail to give the fewest coins?",
      options: ["Taking the largest coin first can need more coins overall", "Smaller coins are always better", "Sorting is impossible"],
      why: "The example 6 with coins [1,3,4] shows the problem: largest-first uses three coins instead of two.",
    },
  },
  23: {
    predict: {
      prompt:
        "Breadth-first search has reached the destination. What saved information lets you return the actual route, rather than just its length?",
      options: ["A parent for each first-discovered node", "Only the queue length", "Alphabetically sorted node names"],
      why: "Save the previous place when first discovering each new place. Following those records backward rebuilds the route.",
    },
    reflect: {
      prompt: "Which change means counting the fewest roads with plain BFS may no longer find the cheapest route?",
      options: ["Adding cycles", "Giving roads different costs", "Adding more nodes"],
      why: "A one-road route may cost 10, while a two-road route costs 2. Counting roads alone cannot compare those costs.",
    },
  },
  24: {
    predict: {
      prompt: "In merge sort, why can a list with zero or one value be returned without another sorting call?",
      options: ["They are already sorted", "They have no memory cost", "They contain only zeros"],
      why: "Zero or one value cannot be out of order, so no more sorting is needed.",
    },
    reflect: {
      prompt: "Count only the halving steps needed to reach single values. Going from 8 values to 16 changes this splitting depth in which way?",
      options: ["The depth becomes four times larger", "It adds one level: 3 becomes 4", "It adds eight levels"],
      why: "For 8 values, splitting gives sizes 8 → 4 → 2 → 1. Doubling the size adds one more split level.",
    },
  },
  25: {
    predict: {
      prompt: "This quicksort builds smaller, equal, and larger groups around a pivot. What should happen to the values in the equal group?",
      options: [
        "Sort those same equal values in another recursive call",
        "Keep them together without sorting that group again",
        "They should be discarded",
      ],
      why: "Equal values need no further comparison with the pivot. Keep them and sort only the other groups.",
    },
    reflect: {
      prompt: "The pivot is the value at the middle list position. Does that guarantee roughly half the values will be smaller and half larger?",
      options: ["Yes", "No", "Only with duplicate values"],
      why: "The middle position can hold any value. It does not guarantee half the values are smaller and half larger.",
    },
  },
  26: {
    predict: {
      prompt:
        "A backtracking function will keep adding to and removing from its current selection. Why save a copy when recording a completed subset?",
      options: ["To sort the input", "To preserve that answer when path changes", "To reduce the number of subsets"],
      why: "Save a separate copy so later additions and removals do not change an earlier answer.",
    },
    reflect: {
      prompt: "Why does returning every subset become expensive as more input items are added?",
      options: [
        "A dictionary makes the number of answers stay fixed",
        "Each added item doubles the number of answers",
        "A queue removes most possible answers",
      ],
      why: "Each added item doubles the number of returned groups. Even writing those answers takes rapidly growing work.",
    },
  },
  27: {
    predict: {
      prompt: 'A trie contains only the word "cart". Does it contain a path for the prefix "car"?',
      options: ["Yes", "No", 'Only if "car" was also inserted'],
      why: "The c → a → r path exists as the beginning of cart.",
    },
    reflect: {
      prompt: 'The letter path c → a → r exists in a trie. What extra record would tell you whether "car" itself was stored as a complete word?',
      options: ["A complete-word end marker", "A sorted word list", "The root’s length"],
      why: "An end marker says that a whole word stops here, rather than merely continuing through this path.",
    },
  },
  28: {
    predict: {
      prompt: "Two items already have the same group leader. If you join those items again, should the number of groups decrease?",
      options: ["Yes", "No", "Only if their values differ"],
      why: "They were already in the same group, so joining them again changes no group count.",
    },
    reflect: {
      prompt: "Why link the smaller union-find group under the larger group when joining them?",
      options: ["To follow fewer links when finding a group leader", "To sort the node labels", "To eliminate the need for find"],
      why: "Shorter parent chains mean fewer links to follow when finding the leader later.",
    },
  },
  29: {
    predict: {
      prompt: "In a two-way network, no path yet connects two groups. Can the first road joining those groups close a loop?",
      options: ["Yes", "No", "Only if the labels are consecutive"],
      why: "Separate groups have no existing path between them. One new road joins them without closing a loop.",
    },
    reflect: {
      prompt: "The same-leader cycle rule works for two-way connections. Can it be used unchanged to detect cycles in arbitrary one-way graphs?",
      options: ["Yes", "No", "Only when every edge has weight 1"],
      why: "Knowing two places are connected in some direction does not tell you whether you can follow arrows around a loop.",
    },
  },
  30: {
    predict: {
      prompt: "Dijkstra’s waiting routes currently include costs 5, 1, and 7. Which waiting visit should it explore next?",
      options: ["Whichever was discovered first", "The visit with cost 1, the smallest waiting cost", "The place with the most outgoing roads"],
      why: "Take the smallest best-known waiting cost. The heap keeps that choice ready.",
    },
    reflect: {
      prompt: "Why can choosing the route with the fewest roads miss the cheapest route when road costs differ?",
      options: ["It counts roads rather than adding their costs", "It cannot handle loops", "It requires alphabetical labels"],
      why: "One expensive road can cost more than several cheap roads combined.",
    },
  },
  31: {
    predict: {
      prompt: "Job 0 must wait for job 1, and job 1 must wait for job 0. Can all the jobs be placed in a valid prerequisite order?",
      options: [
        "Yes, both jobs are ready immediately",
        "No, each job is waiting for the other",
        "Yes, sorting the job numbers removes the waiting rule",
      ],
      why: "Each job waits for the other. Neither can legally start first.",
    },
    reflect: {
      prompt: "Several jobs are ready. This exercise requires the smallest job number next. Why use a min-heap for the ready jobs?",
      options: ["To take the smallest numbered ready job next", "To detect undirected cycles", "To store edge weights"],
      why: "This task requires the smallest numbered ready job. Keeping ready jobs in a heap supports that extra rule.",
    },
  },
  32: {
    predict: {
      prompt: "When building a cheapest connection plan, why skip a candidate road whose ends are already connected by other chosen roads?",
      options: [
        "It would add a loop without connecting separate groups",
        "Every negative-cost road must be rejected",
        "The first road must always be skipped",
      ],
      why: "The ends already have a path between them, so the new edge adds a loop rather than connecting separate groups.",
    },
    reflect: {
      prompt: "Is minimizing the total cost of connecting everyone the same goal as minimizing each route from one chosen starting place?",
      options: ["Yes", "No, they are asking for different things", "Only when there are loops"],
      why: "One problem minimizes the total cost of connecting everyone. The other minimizes each route from a chosen start. Those are different goals.",
    },
  },
  33: {
    predict: {
      prompt: 'A subsequence may skip letters but must keep their order. Is "ac" a subsequence of "abc"?',
      options: ["Yes", "No, they are not adjacent", "Only after sorting"],
      why: "Skip b and keep a before c. Skipping letters is allowed.",
    },
    reflect: {
      prompt: "In the shared-subsequence table, why are answers involving an empty beginning of either text equal to 0?",
      options: ["An empty sequence has no common characters", "All strings begin with zero", "It prevents sorting"],
      why: "Empty text contains no letters to share, so its common-sequence count is 0.",
    },
  },
  34: {
    predict: {
      prompt: "Every selected value must be strictly larger than the previous selected value. What is the longest valid length in [2, 2, 2]?",
      options: ["3", "2", "1"],
      why: "Each 2 can stand alone, but another equal 2 cannot extend it. The best length is 1.",
    },
    reflect: {
      prompt: "In this increasing-subsequence solution, what does the length saved at position i describe?",
      options: [
        "The best increasing length ending exactly at position i",
        "The best length after sorting the input",
        "How many values are larger than items[i]",
      ],
      why: "The entry must mean the best length ending exactly here. That lets a later, larger value extend the right answer.",
    },
  },
  35: {
    predict: {
      prompt: "A packing-table update considers each item only once. Why visit weight limits from high to low when reusing one table row?",
      options: ["To prevent using the current item multiple times", "To sort the items by weight", "To make the answer smaller"],
      why: "Read older answers before they include this item, so the item is not taken twice.",
    },
    reflect: {
      prompt: "Which test would reveal an error that lets the same available item be taken twice?",
      options: ["Weight [2], value [3], capacity 4 should return 3", "An empty list with capacity 0", "A single item heavier than capacity"],
      why: "With only one available item worth 3, the answer must stay 3. A wrong update order could count the same item twice and return 6.",
    },
  },
  36: {
    predict: {
      prompt: "Run a = [1], then b = a, then b.append(2). What does a contain afterward?",
      options: ["[1, 2]", "[1]", "[2]"],
      why: "Both names point to the same list. Appending through b changes that shared list.",
    },
    reflect: {
      prompt: "Why does list(a) need extra list storage while b = a does not copy the entries?",
      options: ["The copy needs its own list entries", "A second name copies every item", "Copying sorts the values"],
      why: "A copy creates a separate outer list with its own entries. A second name for the same list does not.",
    },
  },
  37: {
    predict: {
      prompt: "Add the values 2, 2, and 3 to an empty set. How many different values does the set contain?",
      options: ["2", "3", "1"],
      why: "Repeated 2 is kept once, alongside 3: two different values.",
    },
    reflect: {
      prompt: "You need both the different words and a count for each word. Which container is suitable?",
      options: ["Use a map from word to count", "A set alone stores every count", "Sort the set backwards"],
      why: "A set remembers whether a word appeared. A dictionary can also save its count.",
    },
  },
  38: {
    predict: {
      prompt: "Starting with 16, replace the number with number // 2 each round and stop at 1. How many rounds occur?",
      options: ["4", "8", "16"],
      why: "16 → 8 → 4 → 2 → 1 contains four halvings.",
    },
    reflect: {
      prompt: "Starting at 16 takes 4 halving rounds. If you start at 32 instead, how many rounds reach 1?",
      options: ["5: one new round, then the same four", "8: twice as many rounds", "32: one round per starting unit"],
      why: "32 first becomes 16. From there it follows the same four rounds, so starting at 32 needs five rounds.",
    },
  },
  39: {
    predict: {
      prompt: "A nested-sum function receives an integer rather than a list. What should it do without another recursive call?",
      options: ["An integer contributes its own value", "Every list contributes 1", "Call again with the same object"],
      why: "An integer is already a complete small answer. Return it without another call.",
    },
    reflect: {
      prompt: "An outer call pauses while an inner-list call runs. What lets the outer call resume its own loop and total afterward?",
      options: [
        "Python keeps that call’s variables and its paused position",
        "Every call restarts the whole program",
        "The inner call deletes the outer call",
      ],
      why: "Each call keeps its own total and remembers where it should resume after its child answers.",
    },
  },
  40: {
    predict: {
      prompt: "The one-way edge [1, 2] means you can move from place 1 to place 2. Which place’s outgoing list should receive 2?",
      options: ["The neighbor list for 1", "The neighbor list for 2", "Both automatically"],
      why: "The connection starts at 1 and goes to 2, so 2 belongs in 1’s outgoing list.",
    },
    reflect: {
      prompt: "Why is graph = [[]] * n unsafe when each place must have its own independently changeable neighbor list?",
      options: ["The inner lists would be shared", "It creates a sorted graph", "It makes all edges undirected"],
      why: "Make a fresh inner list for each place. Repeating one inner list shares it between all places.",
    },
  },
  41: {
    predict: {
      prompt: "In a min-heap, what must be true of each parent value compared with its children?",
      options: ["Each parent <= its children", "The entire list is sorted", "Every left child is smaller than every right child"],
      why: "Keeping each parent no larger than its children puts a smallest value at the top.",
    },
    reflect: {
      prompt: "A new value was appended to the end of a valid min-heap. Why can upward swaps repair it without checking every other branch?",
      options: ["Only parents above the new value may now be out of order", "Every value must be sorted again", "Every tree connection changed"],
      why: "Only the new value and the parents above it can have lost their order. Other branches are unchanged.",
    },
  },
  42: {
    predict: {
      prompt: "A group’s sum includes a positive number. If that number leaves the group and nothing enters, what happens to the sum?",
      options: ["It decreases", "It increases", "It stays the same"],
      why: "Taking away a positive value reduces the total.",
    },
    reflect: {
      prompt:
        "The shrinking loop may run several times after one new value arrives. Why are its total left-position moves still limited by the input length?",
      options: [
        "The left position only moves right and passes each item at most once",
        "Putting one loop inside another never adds work",
        "Positive values make all operations equally fast",
      ],
      why: "The left position never moves backward. Across the whole run, it can move at most once past each input item.",
    },
  },
  43: {
    predict: {
      prompt: 'A substring cannot skip characters. Is "aa" a substring of "aba"?',
      options: ["No; its letters are not consecutive", "Yes, because both letters appear", "Only if sorted first"],
      why: "The two a letters have b between them, so aa is not a consecutive stretch of aba.",
    },
    reflect: {
      prompt:
        "A new character repeats one inside the current stretch. Why might several characters, rather than just one, need to leave from the left?",
      options: [
        "The older repeated character may be farther inside the stretch, not at its left edge",
        "Every possible pair of characters must be inspected",
        "The characters have to be sorted",
      ],
      why: "The old repeated character may not be the first character. Keep removing until that older copy has left.",
    },
  },
  44: {
    predict: {
      prompt: "Before changing the current node’s next link to point backward, what must you save so you can continue through the old chain?",
      options: ["The original next node", "Only the current value", "The list length"],
      why: "Save where the link originally led so you can still reach the remaining nodes after changing it.",
    },
    reflect: {
      prompt: "After reversing every next link in a nonempty linked list, which original node is returned as the new first node?",
      options: ["The original last node", "The original first node always", "A newly allocated node"],
      why: "The original last node ends up pointing backward along the whole list, making it the new first node.",
    },
  },
  45: {
    predict: {
      prompt:
        "In the sorted list [2, 4], where would you insert 9 to keep the list sorted? Count the first position as 0; the position after the last item is allowed.",
      options: ["2", "1", "-1"],
      why: "Both 2 and 4 are below 9. Insert after them, at position 2.",
    },
    reflect: {
      prompt: "You want the first position whose value is at least the target. If a middle value equals the target, why keep looking to its left?",
      options: ["An earlier equal value might exist", "The list must be unsorted", "We need the last occurrence"],
      why: "A matching middle value may have another equal value before it. Keep looking left.",
    },
  },
  46: {
    predict: {
      prompt: "In a binary search tree, the root holds 5 and its right child is empty. Where should a new value 6 be attached?",
      options: ["As the right child", "As the left child", "Above the root"],
      why: "6 is larger than 5, so attach it as the right child.",
    },
    reflect: {
      prompt: "Insert 1, then 2, then 3, then 4 into an empty ordinary search tree without balancing it. What shape can this produce?",
      options: ["It can become a right-sided chain", "It must be perfectly balanced", "The keys become invalid"],
      why: "Each larger value goes right again, forming 1 → 2 → 3 → 4 rather than a short branching tree.",
    },
  },
  47: {
    predict: {
      prompt: "This lesson measures height by counting nodes, not links. What is the height of a tree containing just one node?",
      options: ["1", "0", "2"],
      why: "The longest path contains that single node, so height is 1.",
    },
    reflect: {
      prompt: "Why is a node’s height 1 plus the larger child height, rather than 1 plus both child heights?",
      options: ["Height follows the longer single path", "Height counts every node", "The shorter branch is always empty"],
      why: "A single downward path chooses either the left branch or the right branch. It cannot follow both at once.",
    },
  },
  48: {
    predict: {
      prompt: "You save answers while counting stair routes using 1- or 2-step moves. What should each dictionary entry connect?",
      options: ["A stair count to the number of ways to climb that many stairs", "Only the answer for 40 stairs", "A new random key for every call"],
      why: "The same step number asks the same counting question, so save that number’s answer.",
    },
    reflect: {
      prompt: "Why does saving and reusing smaller stair-count answers avoid repeated work?",
      options: [
        "Repeated questions can read an answer that was already saved",
        "Any recursive function is automatically fast",
        "It removes every function call",
      ],
      why: "A repeated question reads its saved answer instead of calculating the smaller calls all over again.",
    },
  },
  49: {
    predict: {
      prompt: "You may move only right or down. For a cell away from the top and left edges, which two route counts are added to find its count?",
      options: ["Above and left", "Below and right", "Every cell in the grid"],
      why: "The final move into a cell comes from above or from the left.",
    },
    reflect: {
      prompt: "Why fill grid route counts from top to bottom and left to right?",
      options: ["Above and left answers are already ready", "The table is sorted alphabetically", "The final cell has no dependencies"],
      why: "This order calculates the above and left cells before a later cell needs them.",
    },
  },
  50: {
    predict: {
      prompt: "You are calculating the best value when taking a new item once. Which table row must supply the answer for the remaining weight room?",
      options: ["The previous item row", "The final row before it is computed", "The same cell"],
      why: "That row contains answers made before the current item was allowed, so taking it now cannot reuse it.",
    },
    reflect: {
      prompt:
        "There is only one available item of each kind in this task. Why must a saved answer used for taking the current item exclude that same item?",
      options: ["Otherwise the same available item could be counted twice", "It sorts the weights", "The task allows unlimited copies of each item"],
      why: "Each item is available only once. Taking it must use an older answer that does not already contain it.",
    },
  },
  51: {
    predict: {
      prompt: "You want a strictly larger next value. In [2, 2, 3], can the second 2 be the first 2’s answer?",
      options: ["No; equal is not greater", "Yes, always", "Only after sorting"],
      why: "The next value must be larger. An equal 2 cannot answer the first 2.",
    },
    reflect: {
      prompt:
        "Each position enters the waiting stack once and is removed when its answer is found. Why can total removals never exceed the number of positions?",
      options: ["No position can be popped twice", "Every loop runs exactly once", "The values must be positive"],
      why: "Once a position is removed, its answer is finished. It is never added or removed again.",
    },
  },
  52: {
    predict: {
      prompt: "These closed ranges include both endpoints, and touching ranges merge. What single range combines [1, 3] and [3, 4]?",
      options: ["[1,4]", "Keep both separate", "[3,3]"],
      why: "Both ranges include 3, so combine them into [1,4].",
    },
    reflect: {
      prompt: "After sorting ranges by start, why can you compare each new range with just the most recently combined range?",
      options: [
        "Sorting by start puts potentially overlapping ranges next to each other",
        "It makes every range the same length",
        "It removes the need to check endpoints",
      ],
      why: "With starts in order, only the most recent combined range can still overlap the next one.",
    },
  },
  53: {
    predict: {
      prompt: "Python writes XOR as ^. What is 7 ^ 7?",
      options: ["0", "7", "14"],
      why: "Every bit matches itself and becomes 0, so the whole answer is 0.",
    },
    reflect: {
      prompt:
        "The task promises pairs plus one unpaired value. Does [4, 4, 4, 7] satisfy that promise so the same method is guaranteed to return the singly occurring value?",
      options: ["No; 4 appears three times", "Yes, every frequency is allowed", "Only if sorted first"],
      why: "Two 4s cancel, but a third 4 remains. The promise of matching pairs is essential.",
    },
  },
  54: {
    predict: {
      prompt: "Keys 1 and 4 both go to bucket 1 under the remainder rule. Does sharing that bucket mean they are the same key?",
      options: [
        "No. Keep both numbers because 1 and 4 are different",
        "Yes. The bucket may keep only the first number that arrived",
        "Yes. The later 4 should replace the earlier 1",
      ],
      why: "The rule sends both numbers to the same place, but 1 is not equal to 4. A collision is a shared storage location, not a duplicate key.",
    },
    reflect: {
      prompt: "A bucket contains many different keys. Why can searching that crowded bucket take longer than searching a short one?",
      options: [
        "You may need to compare more stored keys before finding the one you want",
        "Sharing a bucket makes all its keys equal",
        "Every search must sort the entire table first",
      ],
      why: "The bucket narrows down where to look. You still compare keys inside it. A bucket with many keys can need more comparisons than a short bucket.",
    },
  },
  55: {
    predict: {
      prompt: "The fast and slow positions both start at the first node. Is that starting equality enough to report a cycle?",
      options: ["No; move them before checking for a meeting", "Yes, every list has a cycle", "Only for a one-node list"],
      why: "Both pointers start there by setup. A later meeting after movement is what shows a loop.",
    },
    reflect: {
      prompt: "Why does following just a slow and a fast position need less extra memory than saving every visited node?",
      options: ["Pointers avoid storing every visited node", "Pointers store two full copies", "The set uses no extra space"],
      why: "Only the current two positions need to be remembered. A visited set would retain earlier positions too.",
    },
  },
  56: {
    predict: {
      prompt: "Why can Dijkstra’s usual rule of accepting the cheapest waiting visit fail when a later road has a negative cost?",
      options: ["A later route may make a previously accepted cost cheaper", "Every route becomes a loop", "A heap cannot store negative numbers"],
      why: "A negative road discovered later can make a previously accepted cost cheaper. Ordinary Dijkstra relies on that not happening.",
    },
    reflect: {
      prompt:
        "A negative-cost cycle exists in a part of the graph that cannot be reached from start. Should that unreachable cycle alone make this task return []?",
      options: ["No; only cycles reachable from start matter", "Yes, any cycle anywhere", "Only if its labels are sorted"],
      why: "A route from the start cannot use a loop in a completely unreachable part of the graph.",
    },
  },
  57: {
    predict: {
      prompt: "The input uses positions starting at 0, but this Fenwick helper starts at 1. Which helper position represents input position 0?",
      options: ["1", "0", "-1"],
      why: "Internal positions start at 1. Position 0 would give a jump of 0 and leave the update stuck.",
    },
    reflect: {
      prompt: "When are ordinary running totals a simpler choice than a Fenwick tree?",
      options: ["Many queries with no value changes", "Every operation changes all values", "They are never useful"],
      why: "If values never change, build running totals once and answer each prefix question with a lookup.",
    },
  },
  58: {
    predict: {
      prompt: 'In "abab", what is the length of the longest part that appears at both the beginning and the end? Do not count the whole "abab".',
      options: ['2 ("ab")', "4 (the entire pattern)", '3 ("aba")'],
      why: "ab is both the beginning and the ending of abab. Its length is 2. The question excludes the whole pattern, so the longest shorter match is ab.",
    },
    reflect: {
      prompt: "After a failed text comparison, how does KMP keep useful work without moving back to an earlier text position?",
      options: [
        "The saved table tells which matched letters can still begin another match",
        "Every character in the text is different",
        "The pattern is sorted first",
      ],
      why: "The saved reuse lengths preserve useful matched letters, so the text position does not have to restart.",
    },
  },
  59: {
    predict: {
      prompt: "In Euclid’s method, replace (a, b) with (b, a % b). What does the pair (18, 12) become after one step?",
      options: ["(12,6)", "(6,18)", "(18,0)"],
      why: "Keep the old second number, 12, and the remainder of 18 divided by 12, which is 6.",
    },
    reflect: {
      prompt:
        "Euclid’s loop uses nonnegative numbers and stops when the second number is 0. Why does repeatedly replacing it with a remainder eventually reach that stop?",
      options: ["The nonnegative remainder is smaller than the positive divisor", "The values always increase", "It uses recursion"],
      why: "Each nonzero remainder is smaller than the divisor that produced it. The second number keeps shrinking until it reaches 0.",
    },
  },
};

const exerciseBriefs = {
  0: {
    input: "items is a list of values. target is the value to look for.",
    output: "The position of the first match, counting from 0. Return -1 when there is no match.",
    example: "Milk is the second item, which Python numbers as position 1.",
  },
  1: {
    input: "items is a list of integers. It may be empty and may include negative numbers.",
    output: "One integer: the sum of all the values. Return 0 for an empty list.",
    example: "4 + (-2) + 3 = 5. The negative value subtracts 2 from the total.",
  },
  2: {
    input: "items is a list of integers. The list may be empty.",
    output: "The largest value, or None if the list is empty.",
    example: "9 is greater than both 3 and 4, so the answer is 9.",
  },
  3: {
    input: "text is the string to check. Compare its characters exactly as given.",
    output: "True if it reads the same backward; otherwise False. Use two positions rather than making a reversed copy.",
    example: "The outer l letters match, then the e letters match. The middle v needs no partner.",
  },
  4: {
    input: "items is an integer list. k says how many neighboring values must be in each group.",
    output: "The largest sum of exactly k consecutive values. Return None if k is zero, negative, or larger than the list.",
    example: "The three groups total 8, 7, and 9. Return the largest total, 9, rather than the group itself.",
  },
  5: {
    input: "items is an integer list. queries contains valid [left, right] positions; both endpoints belong to the section.",
    output: "A list of sums, one for each query in the given order. Build the running totals once and reuse them.",
    example: "Positions 1–2 total 9; positions 0–1 total 5; positions 0–2 total 12. Return [9, 5, 12].",
  },
  6: {
    input: "items is an already sorted integer list. target is the value to find.",
    output: "A matching position, counting from 0, or -1 if target is absent. Use binary search.",
    example: "17 is at position 5. The first middle check rules out 11 and all smaller positions.",
  },
  7: {
    input: "items is an integer list that may be in any order.",
    output: "The values in ascending order using insertion sort. You may change the original list; do not call a sorting function.",
    example: "Insert 2 before 4, then insert 3 between them. Return [2, 3, 4].",
  },
  8: {
    input: "a and b are integer lists, each already sorted from smallest to largest.",
    output: "A new sorted list containing every value from both lists, including repeats. Do not call a sorting function.",
    example: "Take 1, then 2, then 3, then the remaining 4. Neither input needs to be sorted again.",
  },
  9: {
    input: "text contains only opening and closing parentheses: ( and ). It may be empty.",
    output: "True when every closing parenthesis has an earlier unmatched opening and none remain unmatched at the end; otherwise False.",
    example: "The two closing parentheses match the two openings, so (()) returns True.",
  },
  10: {
    input: 'operations is a list of instructions. ["add", value] adds at the back; ["take"] removes from the front.',
    output: "A list containing one result for each take instruction. Use None when there was nothing to take.",
    example: "The take instructions remove 1, then 2, then 3. Add instructions do not create entries in the returned list.",
  },
  11: {
    input: 'head is the first node, or None for an empty chain. Each node is a dictionary with "value" and "next" entries.',
    output: "An ordinary Python list of the node values, in the order reached by following next.",
    example: "The first node holds 4 and links to the node holding 7. Return [4, 7].",
  },
  12: {
    input: "words is a list of strings. Treat uppercase and lowercase letters as different.",
    output: "A dictionary mapping each distinct word to its number of appearances.",
    example: 'Tea appears twice and rice once, so return {"tea": 2, "rice": 1}.',
  },
  13: {
    input: "items is an integer list. target is the required sum of two values at different positions.",
    output:
      "[earlier_index, current_index] for the first pair found while scanning left to right, or [] if none exists. Save the most recent earlier position of each value.",
    example: "The 2 at position 1 and the 7 at position 2 make 9. Return their positions [1, 2], not their values.",
  },
  14: {
    input: "n is an integer from 0 through 15.",
    output: "n factorial as an integer. Use recursion and do not call math.factorial().",
    example: "The first example uses n = 0. Its answer is 1 by the factorial definition; it is not 0.",
  },
  15: {
    input: 'root is a tree node or None. A node has "value", "left", and "right" entries; an empty child is None.',
    output: "A Python list of values in left-branch, current-node, right-branch order.",
    example: "Read left child 1, then root 2, then right child 3. Return [1, 2, 3].",
  },
  16: {
    input: "root is a binary search tree with distinct integer values. target is the number to find. Nodes use value, left, and right.",
    output: "True if target is in the tree, or False otherwise. Follow one branch at a time using a loop.",
    example: "The first example searches for 8 in a tree rooted at 5. Its right child is 8, so return True.",
  },
  17: {
    input: "items is an integer list. k is how many smallest values to return, from 0 through len(items).",
    output: "A list of exactly k smallest values, in ascending order. Repeated values count separately. Use heapq.",
    example: "The smallest value is 2 and the next smallest is 5. Return [2, 5].",
  },
  18: {
    input:
      "graph maps each place name to the places reachable by one outgoing road. start and goal are names. A missing graph entry means no outgoing roads.",
    output: "The fewest roads needed to reach goal from start, or -1 when it cannot be reached. Return 0 if start already equals goal.",
    example: "A → B → D uses two roads. A → C → D also uses two, so the answer is 2, not the list of place names.",
  },
  19: {
    input: "graph maps names to outgoing neighbor lists. start is the place to begin. Follow the listed directions.",
    output: "All names reachable from start, including start itself, sorted alphabetically. Explore with an explicit stack.",
    example: 'A, B, C, and D are reachable. Return ["A", "B", "C", "D"] even if the search visited them in another order.',
  },
  20: {
    input: "intervals contains [start, end] times, with start less than end. Talks may touch at an endpoint.",
    output: "The largest number of talks you can attend without overlap. Return a count, not the chosen talks.",
    example: "Attend [1, 3] and [3, 4]. The talk [2, 5] overlaps them, so the maximum count is 2.",
  },
  21: {
    input: "n is the number of stairs, from 0 through 40. Every move climbs either 1 or 2 stairs.",
    output:
      "The number of different move sequences that reach exactly n stairs. Return 1 for n = 0, counting the empty sequence of moves. Build counts from smaller counts.",
    example: "The first example has no stairs. Doing nothing reaches the goal in one way, so return 1.",
  },
  22: {
    input:
      "coins gives the allowed positive integer coin values. amount is the exact total to make, from 0 through 100. Each coin value may be reused.",
    output: "The fewest coins needed to make amount, or -1 if it is impossible. Making amount 0 takes 0 coins.",
    example: "3 + 3 makes 6 using two coins. A single allowed coin cannot make 6, so return 2.",
  },
  23: {
    input: "graph maps string names to outgoing neighbor lists. Every road has equal cost. start and goal are names.",
    output:
      "A shortest route as a list of names, including start and goal. Return [] if no route exists. Use the input neighbor order to choose between equally short routes.",
    example: 'Both A → B → D and A → C → D use two roads. B is listed before C, so return ["A", "B", "D"].',
  },
  24: {
    input: "items is an integer list, possibly empty or containing repeats.",
    output: "The values in ascending order, using recursive merge sort. Do not call sorted() or list.sort().",
    example: "Sort the two halves into [1, 4] and [2, 3], then merge them into [1, 2, 3, 4].",
  },
  25: {
    input: "items is an integer list. Repeated values are allowed.",
    output:
      "The values in ascending order using three-way recursive quicksort. Choose the middle-position value as pivot; do not call sorting functions.",
    example: "The two 3s stay in the equal group. Sort [1, 2], then join the groups to return [1, 2, 3, 3].",
  },
  26: {
    input: "items contains distinct integers and has at most 10 values.",
    output: "Every subset as a separate Python list, including []. Use backtracking and return sorted(result) to give the required consistent order.",
    example: "For [1, 2], return [[], [1], [1, 2], [2]]. Each input item is either included once or left out.",
  },
  27: {
    input: "words contains lowercase a–z words. prefixes contains beginnings to check, in order.",
    output:
      "One True or False for each prefix: does a stored word begin with it? The empty prefix returns True even if words is empty. Build a trie.",
    example: "ca and car are beginnings of stored words; dog is not. The empty prefix is True, giving [True, True, False, True].",
  },
  28: {
    input:
      "n is the number of places, numbered 0 to n - 1. Each edge [a, b] joins two places in both directions. Repeated edges and self-links are allowed.",
    output: "The number of separate connected groups, counting isolated places too. Implement union-find.",
    example: "The connections make groups {0, 1, 2} and {3, 4}. Return 2, not the groups themselves.",
  },
  29: {
    input: "n places are numbered 0 to n - 1. edges lists two-way connections. This is a multigraph: self-links and repeated edges count too.",
    output:
      "True if there is any cycle; otherwise False. A self-link or a second edge between the same two places also counts as a cycle here. Use union-find.",
    example: "0–1, 1–2, and 2–0 close a triangle, so return True.",
  },
  30: {
    input: "graph maps each place name to [neighbor, cost] entries for outgoing roads. Costs are nonnegative. start and goal are names.",
    output: "The minimum total road cost from start to goal, or -1 if there is no route. Return 0 when start equals goal.",
    example: "A → C costs 1 and C → B costs 1. Their total 2 is cheaper than the direct cost 5, so return 2.",
  },
  31: {
    input: "n jobs are numbered 0 to n - 1. An edge [a, b] means job a must happen before job b.",
    output: "All job numbers in a valid order, choosing the smallest ready number at every step. Return [] if a cycle prevents finishing every job.",
    example: "0 and 1 are ready first. Choose 0 before 1; after both finish, choose 2. Return [0, 1, 2].",
  },
  32: {
    input: "n places are numbered 0 to n - 1. Each edge [a, b, weight] is an available two-way connection and its cost.",
    output: "The minimum total cost that connects all places. Return -1 if they cannot all be connected, and 0 for zero or one place.",
    example: "Connections costing 1 and 2 connect all three places for 3. The cost-8 connection is unnecessary.",
  },
  33: {
    input: "a and b are strings. Letters may be skipped, but their order must not change.",
    output: "The length of the longest subsequence shared by both strings. Return a number, not the letters. Use a DP table.",
    example: "Keep a and c from abc and ac. The shared subsequence ac has length 2.",
  },
  34: {
    input: "items is an integer list. You may skip positions but must keep their original order. Equal values do not count as an increase.",
    output:
      "The length of the longest strictly increasing subsequence, or 0 for an empty list. Use DP that compares each position with earlier positions.",
    example: "Choose 1 then 2, skipping the earlier 3. Return length 2, not [1, 2].",
  },
  35: {
    input:
      "weights[i] and values[i] describe the same item. Weights are positive integers, values are nonnegative, and capacity is a weight limit from 0 to 100.",
    output: "The largest total value within capacity, taking each item at most once. You do not have to use all the available weight.",
    example: "Take weight 2 worth 3 and weight 3 worth 4. Their weight is 5 and value is 7, better than the single weight-4 item worth 5.",
  },
  36: {
    input: "items is a list of integers. value is the extra integer to add.",
    output: "A new list containing the original values followed by value. The original items list must stay unchanged.",
    example: "Copy [2, 4] and append 6 to the copy. Return [2, 4, 6] while the input stays [2, 4].",
  },
  37: {
    input: "items is a list of integers. Repeated values are allowed.",
    output: "The number of different integers. Use a set. Return a count rather than the set itself.",
    example: "The different values in [4, 2, 4] are 4 and 2. Return 2.",
  },
  38: {
    input: "n is a positive integer.",
    output: "How many times n must be replaced by n // 2 before it is at most 1. Return the number of rounds.",
    example: "16 → 8 → 4 → 2 → 1 makes four halvings, so return 4.",
  },
  39: {
    input: "value is either an integer or a list containing integers and more lists. Nesting depth is at most 20.",
    output: "One integer: the sum of every contained integer. If value itself is an integer, return it unchanged.",
    example: "The inner [3, 4] totals 7. Add the outer 2 to return 9.",
  },
  40: {
    input: "n is the number of places, numbered 0 to n - 1. Each edge [a, b] is a one-way connection from a to b.",
    output: "n lists. Result list i contains the destinations directly reachable from place i, preserving input order and duplicate edges.",
    example: "Only place 0 has outgoing connections. Return [[1, 2], [], []], with separate empty lists for the other places.",
  },
  41: {
    input: "heap is an already valid min-heap stored as an integer list. value is the new integer to insert.",
    output: "A separate heap list after appending value and swapping it upward as needed. Keep the original heap unchanged and do not use heapq.",
    example: "Append 1 to [2, 5, 4], swap it past 5 and then 2, and return [1, 2, 4, 5].",
  },
  42: {
    input: "items contains positive integers. target is a positive total to reach or exceed.",
    output: "The length of the shortest nonempty consecutive group with sum at least target. Return 0 if no such group exists.",
    example: "[2, 3] and [3, 1] both work and have length 2. No single value reaches 4, so return 2.",
  },
  43: {
    input: "text is a string. Capitalization matters, so A and a are different characters.",
    output: "The length of the longest continuous stretch containing no repeated character. Return a length, not the text itself.",
    example: "ab and ba each have two different characters. The whole aba repeats a, so return 2.",
  },
  44: {
    input: 'head is a linked-list node or None. Each existing node has "value" and "next" entries.',
    output:
      "The new first node after reversing the existing next links. Reuse the original nodes; do not build replacements or merely reverse their values.",
    example: "The example chain is 1 → 2 → None. Return the original node holding 2, now linked to the original node holding 1.",
  },
  45: {
    input: "items is an already sorted integer list, possibly with repeats. target is the boundary value.",
    output: "The first position holding a value greater than or equal to target. If no position qualifies, return len(items). Do not use bisect.",
    example: "Both 4s qualify, but the first is at position 1. Return 1, not the later matching position 2.",
  },
  46: {
    input: "root is a binary search tree or None. value is the integer to insert. Nodes use value, left, and right.",
    output: "The root after inserting value while keeping the search-tree ordering. Ignore duplicate values. You may modify the existing tree.",
    example: "Insert 4 as the right child of 2, which is the left child of root 5. The returned root still holds 5.",
  },
  47: {
    input: "root is a binary tree or None. Each node has value, left, and right entries.",
    output: "The number of nodes on the longest path from the root down to a leaf. Return 0 for an empty tree.",
    example: "The first example has a root and two leaf children. A longest downward path has two nodes, so return 2.",
  },
  48: {
    input: "n is the number of stairs, from 0 through 35. Each move climbs 1 or 2 stairs.",
    output:
      "The number of move sequences reaching exactly n stairs. Use a recursive helper with saved answers. There is one way to climb 0 stairs: no moves.",
    example: "There are 3 ways to climb 3 stairs and 2 ways to climb 2 stairs. Add them to get 5 ways for 4 stairs.",
  },
  49: {
    input: "rows and cols are grid dimensions, each from 0 through 15. There are no blocked cells, and moves go only right or down.",
    output: "The number of routes from the top-left cell to the bottom-right cell. Return 0 if either dimension is 0. Use a two-dimensional table.",
    example: "In a 2-by-3 grid, the possible move orders are right-right-down, right-down-right, and down-right-right: 3 routes.",
  },
  50: {
    input:
      "weights and values describe matching items at the same positions. Weights are positive, values are nonnegative, and capacity is a weight limit from 0 through 50.",
    output:
      "The largest total value within the weight limit, taking each item at most once. Use a two-dimensional table. Unused carrying room is allowed.",
    example: "Take both example items. Their combined weight is 2 + 3 = 5 and combined value is 3 + 4 = 7.",
  },
  51: {
    input: "items is an integer list. For each position, look only to its right.",
    output: "A list of first strictly larger values to the right, one answer per input position. Use None if there is no such value. Use a stack.",
    example: "For [2, 1, 3], the next larger value after 2 is 3, after 1 is 3, and after 3 there is none. Return [3, 3, None].",
  },
  52: {
    input: "intervals contains closed integer ranges [start, end], with start less than or equal to end. Each endpoint is included.",
    output: "The combined ranges, sorted by start. Ranges sharing an endpoint must merge: [1, 3] and [3, 4] become [1, 4].",
    example: "[1, 3] overlaps [2, 5], so combine them into [1, 5]. There is a gap before [8, 9], which stays separate.",
  },
  53: {
    input: "items is nonempty. Exactly one integer appears once, and every other integer appears exactly twice.",
    output: "The unpaired integer. Use XOR rather than a set or a frequency dictionary.",
    example: "The two 5 values cancel under XOR, leaving 2.",
  },
  54: {
    input:
      "keys is a list of integers. bucket_count is a positive number of boxes, numbered from 0 to bucket_count - 1. Use key % bucket_count to choose a box.",
    output:
      "A list of bucket lists. Keep each different key once, in the order it first arrived in its bucket. Include empty buckets in the returned list.",
    example:
      "For [1, 4, 1, 2] and 3 buckets: bucket 0 stays []; bucket 1 becomes [1, 4] and ignores the repeated 1; bucket 2 becomes [2]. Return [[], [1, 4], [2]].",
  },
  55: {
    input: "next_index[i] tells you the next node after node i, or None if the path ends there. start is a node position or None.",
    output:
      "True if following links from start eventually repeats a node; otherwise False. Remember only a fixed number of positions, rather than a set of visited nodes.",
    example: "Starting at 0 follows 0 → 1 → 2 → 1. It repeats nodes, so return True.",
  },
  56: {
    input: "n is at least 1. Each directed edge [a, b, weight] is a road with possibly negative cost. start is the starting place number.",
    output: "A distance list in place-number order, using None for unreachable places. Return [] if a negative-cost cycle can be reached from start.",
    example: "Place 0 costs 0 to reach, place 2 costs 5, and place 1 is cheaper via 2 at cost 2. Return [0, 2, 5].",
  },
  57: {
    input:
      'items is the starting integer list. ["add", i, delta] adds delta to position i. ["prefix", k] asks for the sum of the first k values, excluding position k.',
    output:
      "One sum for each prefix instruction, in order. Add instructions change the working values but do not add an answer. Use a Fenwick tree; indices and counts are valid.",
    example: "Start [2, 3]: prefix 2 gives 5. Add 4 to position 0, making [6, 3]. Prefix 1 now gives 6. Return [5, 6].",
  },
  58: {
    input: "text is the string to search. pattern is the consecutive string to find, with capitalization respected.",
    output:
      "The first position where the whole pattern starts, or -1 if absent. An empty pattern matches at 0. Use KMP; do not use find() or index().",
    example: "In zzababx, the full pattern abab starts after the two z characters, at position 2. Return 2.",
  },
  59: {
    input: "a and b are integers, possibly negative or zero.",
    output:
      "Their greatest common divisor as a nonnegative integer. Use Euclid’s remainder loop rather than math.gcd(); return 0 for the pair (0, 0).",
    example: "(18, 12) becomes (12, 6), then (6, 0). Return the remaining nonzero number, 6.",
  },
};

export function applyPlainLanguage(lessons) {
  for (const lesson of lessons) {
    const e = entries[lesson.id];
    if (!e) throw Error("Missing plain explanation for lesson " + lesson.id);
    lesson.simpleIdea = e.idea;
    lesson.idea = e.why;
    lesson.explanation = e.why.split("\n\n");
    lesson.exerciseBrief = exerciseBriefs[lesson.id];
    lesson.simpleCost = e.work;
    lesson.costMemory = e.memory;
    lesson.cost = e.notation;
    lesson.words = e.words;
    if (walks[lesson.id]) lesson.walk = walks[lesson.id];
    for (const field of ["predict", "reflect"]) Object.assign(lesson[field], questionClarity[lesson.id][field]);
    lesson.hints = lesson.hints.map((hint) =>
      hint
        .replaceAll("processed prefix", "items already read")
        .replaceAll("invariant", "rule that stays true")
        .replaceAll("auxiliary", "extra")
        .replaceAll("accumulator", "running total")
    );
  }
  for (const [id, warning] of Object.entries(sentenceWarnings)) lessons[Number(id)].trap = warning;
  lessons[38].title = "Halving: one extra round when size doubles";
  lessons[38].hints = [
    "Start rounds at 0. Repeat while n is greater than 1.",
    "Inside the loop, set n to n // 2 and add 1 to rounds. Return rounds after the loop.",
  ];
  lessons[38].costRows = {
    headers: ["Starting number", "Halving rounds"],
    rows: [
      [8, 3],
      [16, 4],
      [32, 5],
    ],
  };
  lessons[24].costRows = {
    headers: ["Number of values", "Merging rounds", "Value placements across rounds"],
    rows: [
      [8, 3, 24],
      [16, 4, 64],
    ],
  };
  lessons[26].costRows = {
    headers: ["Number of items", "Number of subsets"],
    rows: [
      [2, 4],
      [3, 8],
      [4, 16],
    ],
  };
  lessons[36].costExtra = {
    title: "Why can adding one item sometimes take longer?",
    paragraphs: [
      "A growing list can run out of room. It then needs a larger storage area and may need to move the existing items. Most additions do not need that move.",
      "Imagine a simple design that doubles its room when full: 1 place, then 2, then 4, then 8. Across the first 8 additions, the resizing moves 1 + 2 + 4 = 7 existing items. Not every addition moves 8 items.",
      "Count all those additions together, including the expensive ones. The total work still grows roughly with the number of additions. Spreading that total across the additions is called amortized analysis. It does not mean every single addition is equally quick.",
      "Python lists use a different growth schedule from this doubling example. The example explains the shared-cost idea, not Python’s exact allocation sizes.",
    ],
  };
  lessons[24].costExtra = {
    title: "How to read the recursive cost formula (optional)",
    paragraphs: [
      "A recurrence describes a function’s work using the work of its smaller calls. You do not need this notation to follow the merge example.",
      "Let T(n) mean the work to sort n values. Sorting each half takes T(n/2). There are two halves. Merging those sorted halves handles all n values once.",
      "T(n) = 2 × T(n/2) + O(n) says: sort two half-size lists, then merge them with work that grows with n.",
      "The small-number table shows why the total is O(n log n): each round handles n values, and doubling n adds one more round. The formula describes the same steps; it does not add a new algorithm.",
    ],
  };
  lessons[57].hints = [
    "Use a helper array one entry longer than items. For input position i, start helper position j at i + 1. Add the change at j. Then move j to j + (j & -j) and repeat until past the end.",
    "To sum the first k items, start at helper position k. Add that block, then subtract k & -k from k. Stop at 0.",
  ];
  lessons[58].hints = [
    "The reuse table records lengths, not text positions. For aab it is [0,1,0]: aa can reuse its final a as a new beginning.",
    "After a mismatch, change the matched-pattern length to its saved shorter length. Recheck the current text letter; do not move the text position backward.",
  ];
  lessons[12].analogy = "An address book connects a name to a phone number. Here, connect a word to its count instead.";
  lessons[15].analogy = "Picture boxes joined by downward lines. Each box can lead to at most two more boxes: one on the left and one on the right.";
  lessons[21].analogy =
    "When counting ways to climb stairs, write down the count for each smaller staircase instead of listing the same routes again.";
  lessons[24].analogy =
    "Split a pile of papers into smaller piles until each pile has just one paper. Then combine neighboring piles by repeatedly taking the smaller next page number.";
  lessons[58].analogy =
    "In aaab, the failed first attempt to match aab still leaves an a that could begin the answer. Keep that useful part instead of forgetting everything.";
  lessons[28].hints = [
    "Start the group count at n. Subtract 1 only when joining two different group leaders.",
    "Follow parent links to find each leader. Shorten that path as you go, then attach the smaller group below the larger group.",
  ];
  lessons[30].hints = [
    "When a cost is taken from the heap, compare it with the best saved cost for that place. Skip it if a cheaper cost has already replaced it.",
    "For each neighbor, add the road cost to the current cost. If that total is cheaper than the saved cost, update it and add a new heap entry.",
  ];
  lessons[33].hints = [
    "If a[i-1] equals b[j-1], take the answer at table[i-1][j-1] and add 1 for this matching letter.",
    "If they differ, take the larger of the saved answer above and the saved answer to the left.",
  ];
  lessons[56].hints = [
    "Try every road from a place that already has a known cost. See whether it makes the destination cheaper. Repeat whole passes up to n - 1 times for n places.",
    "Check the roads once more. If a route reachable from the start still gets cheaper, there is a reachable negative-cost loop; this task returns [].",
  ];
}
