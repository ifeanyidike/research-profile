// Plain explanations are separate from exercise contracts and answer data.
const entries = {};
function explain(id, idea, why, work, memory, notation, words) {
  entries[id] = { idea, why, work, memory, notation, words };
}

explain(
  0,
  "An algorithm is a clear set of steps for finding an answer.",
  "Look at the first item. If it matches the target, return its position. Otherwise, check the next item in the same way. Keep going until you find a match or run out of items. Return -1 only when the whole list has been checked.",
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
  "Set total to 0 before the loop starts. Each time you read a number, add that number to total. After that addition, total should include every number read so far. This rule helps you check the code. For an empty list, the loop does nothing and total stays 0.",
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
  "Suppose you want the largest number in a list. You cannot know which number is largest until you have checked all of them. A longer list therefore needs more checks. Big O gives this growth a name. It describes how the work grows, rather than how many seconds your computer will take.",
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
  "Compare the first letter with the last letter. If they differ, the word cannot read the same backward, so return False. If they match, move both positions one place toward the middle. Compare the next pair in the same way. If the positions meet or cross without a mismatch, return True.",
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
  "Add the numbers in the first group and remember their sum. Now move the group one place to the right. The leftmost number leaves the group, so subtract it. One new number enters on the right, so add it. Compare the new sum with the best sum you have found.",
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
  "Save the total after each number in the list. Also save 0 before the first number, because the sum of no numbers is 0. To find the sum of a section, take the running total at its end. Subtract the running total just before that section starts. The subtraction removes the values you did not want to include.",
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
  "Start with a list that is already sorted. Check its middle value. If the target is larger, every value to the left is too small, so search only the right side. If the target is smaller, search only the left side. After a mismatch, leave the checked middle position out of the next search.",
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
  "Treat the first value as a sorted group of one. Hold the next value aside. Move any larger values in the sorted group one place to the right. Put the held value in the gap. That makes the sorted group one item longer. Repeat with the next value.",
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
  "Look at the next unused value in each list. Take the smaller of those two values and add it to the result. Move forward only in the list you took it from. Repeat until one list runs out. Then add all the values still left in the other list.",
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
  "When you read an opening bracket, put it on the stack. When you read a closing bracket, take one opening bracket off the stack. If there is no opening bracket to take, the brackets are wrong. After reading the whole text, check the stack again. Any opening bracket still there is missing a closing bracket.",
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
  "Put a new item at the back of the queue. Take the next item from the front. This makes the first item added the first item removed. Use a Python deque for these operations. Its append() adds at the back, and its popleft() removes from the front.",
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
  "Start at the head, which is the first node. Read that node’s value. Then use its next link to reach the following node. Keep reading and following links until you reach None. None means there is no node left to visit.",
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
  "Read the next word and look up its count in the dictionary. If the word is not there yet, use a count of 0. Add 1 to that count and save it under the word. When the word appears again, update the same entry. Do not start its count over.",
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
  "Subtract the current number from the target. That tells you which other number you need. Look for that number among the earlier values saved in a dictionary. If you find it, return the two positions. If you do not, save the current number for later. Check before saving so one position cannot be used twice.",
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
  "To calculate factorial(3), the function first needs factorial(2). The call for 3 pauses while the call for 2 works. That call pauses while it asks for factorial(1), and the calls continue down to factorial(0). The answer for 0 is 1. That answer lets each waiting call finish its multiplication and return.",
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
  "Begin at the current node. Read everything in its left branch first. Then add the current node’s value to the answer. Finally, read its right branch. Use this same order at every node. If a branch is empty, there is nothing to read there.",
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
  "Compare the target with the current node’s value. If they match, you have found the target. If the target is smaller, follow the left child. If it is larger, follow the right child. The ordering rule lets you ignore the other branch. If the chosen child is empty, the target is not in the tree.",
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
  "Arrange a copy of the input as a heap. Remove the value at the top to get a smallest value. The heap then repairs its order so another smallest value is ready at the top. Repeat until you have enough answers. Do not read the internal heap list as if the whole list were sorted.",
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
  "Put the starting place in a queue. Visit its direct neighbors first. Put any new neighbors at the back of the queue. Their neighbors will be visited later. In this way, places one move away are reached before places two moves away. Mark a place as seen when adding it, so it is not added again.",
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
  "Keep a stack of places you still need to explore. Take the most recently added place next. Add its unseen neighbors to the stack. Following the newest place can take you far down one trail before you return to another trail. Remember seen places so the search does not go around a loop forever.",
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
  "Put the talks in order of finish time. Take the first talk you can attend. Then take the next talk that starts after the chosen talk ends. Keep going in that order. Finishing earlier leaves at least as much time for later talks as finishing later would. That is why this particular choice is safe.",
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
  "A final move to step 4 can come from step 3 or step 2. These are the only two possibilities because each move is 1 or 2 steps. Add the counts for those two earlier steps. Start with a count of 1 for step 0 and a count of 1 for step 1. Use each pair of counts to calculate the next one.",
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
  "For each amount, try every coin that could be the last coin used. Suppose the amount is 6 and the last coin is 3. You still need to make amount 3. Read the saved answer for 3 and add one coin. Compare this result with the results from the other possible last coins. Keep the smallest count that works.",
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
  "Use breadth-first search to explore the network. When the search first reaches a new place, save the place it came from. Once the destination is reached, follow those saved records backward to the start. Reverse the collected places so the route runs from start to destination.",
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
  "Split the list into two smaller lists. Keep splitting until each piece has at most one value. A piece that small is already sorted. Now combine two sorted pieces by repeatedly taking their smaller next value. Keep combining sorted pieces until the whole list is back together in order.",
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
  "Choose a value called the pivot. Put every smaller value in one group. Put equal values in a second group and larger values in a third group. Sort the smaller and larger groups using the same method. Finally, join the three groups in that order. Equal values do not need another sorting call.",
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
  "For the current item, first explore the answers that leave it out. Then add the item and explore the answers that include it. Remove the item before trying a different choice. After considering every item, save a copy of the chosen group. The copy keeps that answer safe from later changes.",
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
  "Give each letter a step along a path. The word car follows c, then a, then r. To add cart, reuse those three steps and add a step for t. To check a prefix, follow its letters. To check a complete word, also check whether a word ends at the last step.",
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
  "Give each item a parent link. Follow those links until you reach the group leader. When two different groups join, make one leader point to the other. Put the smaller group under the larger group to avoid long chains. When following an old chain, shorten it so future searches reach the leader sooner.",
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
  "Before adding a road, check the group leader at each end. If the leaders differ, the places are not connected yet. The new road joins their groups. If the leaders are the same, a path already connects the two ends. Adding another road between them closes a loop.",
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
  "Save the cheapest cost found so far for each place. Keep possible next visits in a heap, with their costs. Take the cheapest waiting cost next. Follow its roads and check whether any neighbor can now be reached more cheaply. If so, save the better cost and add it to the heap. This method requires every road cost to be zero or positive.",
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
  "For each job, count how many of its prerequisites are still unfinished. A job with a count of 0 is ready. Finish one ready job. Then lower the counts of the jobs that were waiting for it. Whenever a count reaches 0, that job becomes ready too. Use a heap to take the smallest numbered ready job first.",
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
  "Put the roads in order from cheapest to most expensive. Consider each road in that order. If its ends belong to separate groups, keep the road and join those groups. If its ends are already connected, skip the road because it would add a loop. A successful answer connects every place into one group.",
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
  "You may skip letters in either text, but the letters you keep must stay in their original order. Build a table of answers for shorter beginnings of the two texts. If the last two letters match, add 1 to the answer that leaves both letters out. If they do not match, compare skipping the last letter of one text with skipping the last letter of the other. Keep the larger answer.",
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
  "Keep an answer for each number in the list. That answer tells you the longest increasing sequence that can end at that number. A number on its own gives a length of 1. Look at each earlier, smaller number. You can add the current number to a sequence ending there, making its length one larger. Keep the largest length you can make.",
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
  "Keep the best value you can pack for each weight limit. When considering an item, compare two choices: leave it out, or take it once. Taking it leaves less weight available for other items. Add its value to the saved answer for that remaining weight. Check weight limits from high to low. This keeps an answer from already including the same item you are about to add.",
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
  "Write b = a and both names point to the same list. If you append through b, you change the list that a points to as well. To make a separate list, write b = list(a). You can then append to b without adding anything to a. This exercise uses integers, so there are no inner lists to worry about.",
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
  "Start with an empty set. Read each input value and add it to the set. If that value is already there, the set does not keep another copy. After reading all the values, return the number of entries in the set.",
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
  "Start with the number 8. Divide it by 2 to get 4. Divide again to get 2, then again to get 1. That took three halvings. Now try starting with 16. One halving gets you to 8, and you already know the remaining three halvings. The total is four. Use // in Python so division keeps a whole number. For example, 9 // 2 gives 4.",
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
  "If the input is an integer, that integer is the answer. If the input is a list, call the same function for each item inside it. Each call gives you a number to add to the total. The outer call pauses while a smaller call runs. When that smaller call returns, the outer call adds its answer and continues with the next item.",
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
  "Make a separate empty list for each place. That list will hold the places you can go to next. For a road from a to b, put b in the list for a. Do not also put a in the list for b unless the road is allowed in both directions. Keep each road in the order given by the input.",
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
  "A min-heap keeps a smallest value at the top. Each parent must be no larger than its children. Add the new value at the end of a copy of the heap. Compare that value with its parent. If it is smaller, swap the two values. Repeat with its new parent until no swap is needed or the value reaches the top. Only this upward path needs checking because the other parent-child relationships did not change.",
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
  "Add values at the right end until the sum reaches the target. Save the current group’s length as a possible answer. Now try removing values from the left. While the sum is still large enough, save any shorter length you find. Every value in this task is positive. That is why adding a value increases the sum and removing a value decreases it.",
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
  "Use a set to remember the characters in the current stretch of text. Read the next character. If it is already in the set, an older copy is still inside the stretch. Remove characters from the left until that older copy is gone. Then add the new character and check whether the stretch is the longest found so far.",
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
  "Before changing the current node’s link, save the node it leads to. You will need that saved node to keep moving through the original list. Now point the current node back to the previous node. Move forward using the link you saved. Repeat until there is no node left.",
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
  "The list is already sorted. You want the first place where a value is at least the target. Check the middle value. If it is too small, move past it and search the right side. Otherwise, keep looking to its left for an earlier answer. The final position is also where a new copy of the target could be inserted.",
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
  "Compare the new value with the current node. A smaller value goes into the left branch. A larger value goes into the right branch. Follow that branch and repeat. When the next child is empty, put the new node there. If the value already exists, leave the tree unchanged rather than inserting another copy.",
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
  "An empty tree has height 0. For a node that exists, ask for the height of its left branch and its right branch. Take the larger of those two answers. Then add 1 to count the current node. This gives the number of nodes on the longest downward path from this node.",
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
  "Before calculating an answer, check whether it has already been saved. If it has, return that saved answer. If it has not, calculate the smaller answers you need. Combine them and save the new answer before returning it. Another call asking the same question can then reuse the saved result.",
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
  "You can enter a grid cell only from the cell above it or the cell to its left. Count the routes arriving from above. Add the routes arriving from the left. Save that total for the current cell. Fill rows from top to bottom and cells from left to right. This order makes both earlier counts ready before you need them.",
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
  "Give each item its own table row. A cell tells you the best value that fits a weight limit using the items allowed so far. For a new item, compare leaving it out with taking it once. Leaving it out keeps the answer from the row above. Taking it adds its value to an older answer for the weight room left over. Read that older answer from the previous row so the new item cannot be used twice.",
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
  "Keep a stack of positions still waiting for a larger value. Read the next value. If it is larger than the value at the top waiting position, save it as that position’s answer and remove the position. Keep doing this while it can answer another waiting position. Then add the new position to the stack. Any positions left at the end have no larger value after them.",
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
  "Sort the ranges by their starting points. Keep the latest combined range. If the next range starts before that range ends, the two overlap. They also overlap here if the next range starts exactly at the current end. Extend the end when needed. If the next range starts later, keep it as a new separate range.",
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
  "Start the answer at 0 and apply Python’s ^ operator to each number. This operator is called XOR. XORing a number with itself gives 0. XORing a number with 0 leaves the number unchanged. Matching pairs therefore cancel as you process the list. The one value without a pair is left in the answer.",
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
  "Different keys can be sent to the same storage bucket, so check the keys themselves too.",
  "Use the hash rule to choose a bucket for the key. That bucket may already hold a different key. Check the actual keys in the bucket before deciding whether this key has appeared. If it is a different key, keep it too. A shared bucket number does not mean the two keys are equal.",
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
  "Start two positions at the first node. Move the slow one forward by one link. Move the fast one forward by two links. If the trail ends, there is no cycle. If the links form a loop, the fast position eventually catches the slow position inside it. Check for a meeting after they move, because they also start together in a list with no loop.",
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
  "Read a road from a place you already know how to reach. Add its cost to the best cost saved for that place. If the new total is cheaper for the destination, save it. Read all the roads this way, then repeat the pass. Later passes let earlier improvements help routes farther along. After enough passes, one more improvement reveals a reachable loop that can keep lowering the cost.",
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
  "Keep a helper array of sums for selected blocks of items. To answer a prefix question, add the few blocks that cover those first items. When one item changes, update only the blocks containing that item. The code uses i & -i to choose the next block. The worked example below shows the actual block positions and jumps.",
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
  "First make a table for the pattern you want to find. The table records how much of a partly matched pattern can be kept after a mismatch. Now read the text from left to right. When a comparison fails, use the table to keep any matching letters that could begin another attempt. You may compare the current text letter again, but you do not move back to earlier text positions.",
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
  "Divide the first number by the second and keep the remainder. Replace the old pair with the old second number and that remainder. The numbers that divide both numbers stay the same. Repeat until the second number is 0. The first number is then the greatest common divisor. Begin with absolute values so negative signs do not affect the result.",
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
const feedback = {
  0: [
    "The first tea is at position 1. Stop there, even though another tea appears later.",
    "Any unchecked item could still be the target, so a missing target requires checking all 100.",
  ],
  1: [
    "Start at 0. With no values to add, the answer stays 0.",
    "Those four inputs worked. Other inputs may still reveal a bug, so also explain why the steps should work.",
  ],
  2: [
    "For 10 items you make 20 visits; for 20 items you make 40. Work still grows with list length.",
    "You keep one best value whether the input has 10 items or 1000.",
  ],
  3: ["Compare n with n, then o with o: two pairs.", "There are no pairs to disagree, so the empty text passes this rule."],
  4: [
    "Subtract the leaving 4 and add the entering 7: 10 - 4 + 7 = 13.",
    "Most values stay in the group. Reusing their total avoids adding them again.",
  ],
  5: [
    "Positions 0 and 1 contain 3 and 2. Their sum is prefix[2] - prefix[0] = 5 - 0 = 5.",
    "Build the running totals once, then reuse them for many questions.",
  ],
  6: ["Everything on that side is 12 or smaller. None of it can be 19.", "Without sorted order, the discarded half might still contain the answer."],
  7: ["Hold 4 aside. Only 5 is larger, so only 5 moves right.", "Each value is already in the right place, so no earlier values need shifting."],
  8: [
    "The next choices are 8 and 3. Take 3 because it is smaller.",
    "An unsorted list can hide a small value behind a large one. The next-value comparison would miss it.",
  ],
  9: ["c was added last, so it is removed first.", "One opening bracket is still waiting for a closing bracket."],
  10: ["A arrived first, so A leaves first.", "Removing position 0 of a list moves the remaining items left. deque avoids that whole-list shift."],
  11: [
    "Start at the head and follow each next link until the last node.",
    "Without moving current to the next node, the next loop repeats the same visit.",
  ],
  12: [
    "Each appearance adds 1, so three appearances give a count of 3.",
    "The word tells you which entry to update; the saved count tells you its total so far.",
  ],
  13: [
    "One item cannot be used as both members of the pair. You need two positions.",
    "Save earlier values in a dictionary so you do not have to search them from scratch.",
  ],
  14: [
    "The calls keep asking for more calls until Python raises an error. You must provide a stopping case.",
    "The call for 3 waits while the call for 2 works. That call also waits for a smaller call. Python keeps a record for every call still waiting.",
  ],
  15: [
    "Read the left branch, then the current root, then the right branch.",
    "Only the search-tree rule puts all left values below the root and all right values above it.",
  ],
  16: ["4 is smaller than 9, so follow the left child.", "A one-sided chain offers no large branch to skip, so a search may visit every node."],
  17: [
    "No parent is larger than a child, so a smallest value must be at the root.",
    "heapify changes the list you give it and returns None. Keep using that changed list as the heap.",
  ],
  18: [
    "A queue handles earlier discoveries first, before the next layer of places.",
    "Remembering seen places prevents another road from adding the same place again.",
  ],
  19: [
    "A long trail might be explored before a shorter route is tried.",
    "After exploring, this task still asks you to sort the returned names. Count that work too.",
  ],
  20: [
    "An earlier finish leaves at least as much time for later talks.",
    "A choice can look helpful and still block a better complete answer. Explain why your particular choice is safe.",
  ],
  21: [
    "Reach step 6 from step 5 or step 4. Add their counts: 8 + 5 = 13.",
    "The next answer uses only the last two counts. Older counts have no further job here.",
  ],
  22: [
    "3 + 3 uses two coins. No single allowed coin makes 6.",
    "The example 6 with coins [1,3,4] shows the problem: largest-first uses three coins instead of two.",
  ],
  23: [
    "Save the previous place when first discovering each new place. Following those records backward rebuilds the route.",
    "A one-road route may cost 10, while a two-road route costs 2. Counting roads alone cannot compare those costs.",
  ],
  24: [
    "Zero or one value cannot be out of order, so no more sorting is needed.",
    "For 8 values, splitting gives sizes 8 → 4 → 2 → 1. Doubling the size adds one more split level.",
  ],
  25: [
    "Equal values need no further comparison with the pivot. Keep them and sort only the other groups.",
    "The middle position can hold any value. It does not guarantee half the values are smaller and half larger.",
  ],
  26: [
    "Save a separate copy so later additions and removals do not change an earlier answer.",
    "Each added item doubles the number of returned groups. Even writing those answers takes rapidly growing work.",
  ],
  27: [
    "The c → a → r path exists as the beginning of cart.",
    "An end marker says that a whole word stops here, rather than merely continuing through this path.",
  ],
  28: [
    "They were already in the same group, so joining them again changes no group count.",
    "Shorter parent chains mean fewer links to follow when finding the leader later.",
  ],
  29: [
    "Separate groups have no existing path between them. One new road joins them without closing a loop.",
    "Knowing two places are connected in some direction does not tell you whether you can follow arrows around a loop.",
  ],
  30: [
    "Take the smallest best-known waiting cost. The heap keeps that choice ready.",
    "One expensive road can cost more than several cheap roads combined.",
  ],
  31: [
    "Each job waits for the other. Neither can legally start first.",
    "This task requires the smallest numbered ready job. Keeping ready jobs in a heap supports that extra rule.",
  ],
  32: [
    "The ends already have a path between them, so the new edge adds a loop rather than connecting separate groups.",
    "One problem minimizes the total cost of connecting everyone. The other minimizes each route from a chosen start. Those are different goals.",
  ],
  33: ["Skip b and keep a before c. Skipping letters is allowed.", "Empty text contains no letters to share, so its common-sequence count is 0."],
  34: [
    "Each 2 can stand alone, but another equal 2 cannot extend it. The best length is 1.",
    "The entry must mean the best length ending exactly here. That lets a later, larger value extend the right answer.",
  ],
  35: [
    "Read older answers before they include this item, so the item is not taken twice.",
    "With only one available item worth 3, the answer must stay 3. A wrong update order could count the same item twice and return 6.",
  ],
  36: [
    "Both names point to the same list. Appending through b changes that shared list.",
    "A copy creates a separate outer list with its own entries. A second name for the same list does not.",
  ],
  37: [
    "Repeated 2 is kept once, alongside 3: two different values.",
    "A set remembers whether a word appeared. A dictionary can also save its count.",
  ],
  38: [
    "16 → 8 → 4 → 2 → 1 contains four halvings.",
    "32 first becomes 16. From there it follows the same four rounds, so starting at 32 needs five rounds.",
  ],
  39: [
    "An integer is already a complete small answer. Return it without another call.",
    "Each call keeps its own total and remembers where it should resume after its child answers.",
  ],
  40: [
    "The connection starts at 1 and goes to 2, so 2 belongs in 1’s outgoing list.",
    "Make a fresh inner list for each place. Repeating one inner list shares it between all places.",
  ],
  41: [
    "Keeping each parent no larger than its children puts a smallest value at the top.",
    "Only the new value and the parents above it can have lost their order. Other branches are unchanged.",
  ],
  42: [
    "Taking away a positive value reduces the total.",
    "The left position never moves backward. Across the whole run, it can move at most once past each input item.",
  ],
  43: [
    "The two a letters have b between them, so aa is not a consecutive stretch of aba.",
    "The old repeated character may not be the first character. Keep removing until that older copy has left.",
  ],
  44: [
    "Save where the link originally led so you can still reach the remaining nodes after changing it.",
    "The original last node ends up pointing backward along the whole list, making it the new first node.",
  ],
  45: [
    "Both 2 and 4 are below 9. Insert after them, at position 2.",
    "A matching middle value may have another equal value before it. Keep looking left.",
  ],
  46: [
    "6 is larger than 5, so attach it as the right child.",
    "Each larger value goes right again, forming 1 → 2 → 3 → 4 rather than a short branching tree.",
  ],
  47: [
    "The longest path contains that single node, so height is 1.",
    "A single downward path chooses either the left branch or the right branch. It cannot follow both at once.",
  ],
  48: [
    "The same step number asks the same counting question, so save that number’s answer.",
    "A repeated question reads its saved answer instead of calculating the smaller calls all over again.",
  ],
  49: [
    "The final move into a cell comes from above or from the left.",
    "This order calculates the above and left cells before a later cell needs them.",
  ],
  50: [
    "That row contains answers made before the current item was allowed, so taking it now cannot reuse it.",
    "A low-to-high update can read an answer already changed by this same item. High-to-low keeps the older answers available until read.",
  ],
  51: [
    "The next value must be larger. An equal 2 cannot answer the first 2.",
    "Once a position is removed, its answer is finished. It is never added or removed again.",
  ],
  52: [
    "Both ranges include 3, so combine them into [1,4].",
    "With starts in order, only the most recent combined range can still overlap the next one.",
  ],
  53: [
    "Every bit matches itself and becomes 0, so the whole answer is 0.",
    "Two 4s cancel, but a third 4 remains. The promise of matching pairs is essential.",
  ],
  54: [
    "The bucket number only chooses where to look. Different keys can choose that same place.",
    "Spreading keys among buckets prevents long lists of keys that each lookup must check.",
  ],
  55: [
    "Both pointers start there by setup. A later meeting after movement is what shows a loop.",
    "Only the current two positions need to be remembered. A visited set would retain earlier positions too.",
  ],
  56: [
    "A negative road discovered later can make a previously accepted cost cheaper. Ordinary Dijkstra relies on that not happening.",
    "A route from the start cannot use a loop in a completely unreachable part of the graph.",
  ],
  57: [
    "Internal positions start at 1. Position 0 would give a jump of 0 and leave the update stuck.",
    "If values never change, build running totals once and answer each prefix question with a lookup.",
  ],
  58: [
    "ab is both the beginning and the ending of abab. Its length is 2. The full abab does not count as a proper beginning.",
    "The saved reuse lengths preserve useful matched letters, so the text position does not have to restart.",
  ],
  59: [
    "Keep the old second number, 12, and the remainder of 18 divided by 12, which is 6.",
    "Each nonzero remainder is smaller than the divisor that produced it. The second number keeps shrinking until it reaches 0.",
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

export function applyPlainLanguage(lessons) {
  for (const lesson of lessons) {
    const e = entries[lesson.id];
    if (!e) throw Error("Missing plain explanation for lesson " + lesson.id);
    lesson.simpleIdea = e.idea;
    lesson.idea = e.why;
    lesson.simpleCost = e.work;
    lesson.costMemory = e.memory;
    lesson.cost = e.notation;
    lesson.words = e.words;
    if (walks[lesson.id]) lesson.walk = walks[lesson.id];
    for (const [index, field] of ["predict", "reflect"].entries()) lesson[field].why = feedback[lesson.id][index];
    lesson.hints = lesson.hints.map((hint) =>
      hint
        .replaceAll("processed prefix", "items already read")
        .replaceAll("invariant", "rule that stays true")
        .replaceAll("auxiliary", "extra")
        .replaceAll("accumulator", "running total")
    );
  }
  for (const [id, warning] of Object.entries(sentenceWarnings)) lessons[Number(id)].trap = warning;
  const change = (id, field, values) => Object.assign(lessons[id][field], values);
  change(2, "predict", {
    prompt: "You visit every item twice. Which growth label fits?",
    options: ["O(n): work grows with list length", "O(n²): work grows like all pairs", "O(1): work stays bounded"],
  });
  change(2, "reflect", {
    prompt: "You keep only one best value. How does extra memory grow?",
    options: ["O(n): more items need more saved values", "O(1): keep the same number of saved values", "O(n²): save an entry for each pair"],
  });
  change(14, "reflect", {
    options: ["O(1): the same number of waiting calls", "O(n): more input can mean more waiting calls", "O(n²): one array per pair of values"],
  });
  change(19, "reflect", {
    prompt: "After exploring, what extra work does this task require?",
    options: ["Sort the returned names: O(V log V), where V is their count", "No additional work", "Compare every pair of roads: O(E²)"],
  });
  change(20, "reflect", { prompt: "Is a choice guaranteed to give the best total answer just because it looks good now?" });
  change(21, "reflect", {
    prompt: "Why can we stop storing the older stair counts?",
    options: ["They are always 0", "The next count needs only the last two counts", "Every DP problem needs the same number of saved values"],
  });
  change(24, "reflect", {
    prompt: "What happens to the splitting depth when a list doubles from 8 values to 16?",
    options: ["The depth becomes four times larger", "It adds one level: 3 becomes 4", "It adds eight levels"],
  });
  change(25, "reflect", { prompt: "Does choosing the middle position guarantee roughly half the values go into each group?" });
  change(26, "reflect", {
    prompt: "Why does listing every subset quickly become expensive?",
    options: [
      "A dictionary makes the number of answers stay fixed",
      "Each added item doubles the number of answers",
      "A queue removes most possible answers",
    ],
  });
  change(28, "predict", { prompt: "Two items already have the same group leader. Does joining them reduce the group count?" });
  change(29, "predict", { prompt: "Can one road between two previously separate groups immediately close a loop?" });
  change(30, "reflect", { options: ["It counts roads rather than adding their costs", "It cannot handle loops", "It requires alphabetical labels"] });
  change(32, "reflect", {
    prompt: "Is the cheapest way to connect everyone the same problem as cheapest routes from one start?",
    options: ["Yes", "No, they are asking for different things", "Only when there are loops"],
  });
  change(36, "reflect", {
    prompt: "Why does copying a list need more memory than giving that same list a second name?",
    options: ["The copy needs its own list entries", "A second name copies every item", "Copying sorts the values"],
  });
  change(38, "reflect", {
    prompt: "Starting at 16 takes 4 halving rounds. How many rounds does starting at 32 take?",
    options: ["5: one new round, then the same four", "8: twice as many rounds", "32: one round per starting unit"],
  });
  change(41, "reflect", {
    options: ["Only parents above the new value may now be out of order", "Every value must be sorted again", "Every tree connection changed"],
  });
  change(42, "reflect", { prompt: "Why does the inner shrinking loop not make this check every possible pair?" });
  change(50, "reflect", { prompt: "When using only one table row, why check weight limits from high to low?" });
  change(51, "reflect", { prompt: "Why are there at most as many stack removals as input positions?" });
  change(54, "reflect", { prompt: "Why should a growing hash table avoid crowding too many keys into one bucket?" });
  change(55, "reflect", { prompt: "Why does the two-pointer method use less memory than remembering every visited node?" });
  change(56, "predict", {
    prompt: "Why can ordinary Dijkstra give a wrong answer when roads have negative costs?",
    options: ["A later route may make a previously accepted cost cheaper", "Every route becomes a loop", "A heap cannot store negative numbers"],
  });
  change(57, "reflect", { prompt: "When would ordinary running totals be simpler than a Fenwick tree?" });
  change(58, "predict", { prompt: "In abab, what is the longest beginning that is also an ending, without using the whole word?" });
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
