import { unit, problem as p, t, q, using } from "./unit.js?v=20261027-course2";
const counts = p(
  "Sort a small integer universe",
  "items",
  "Integers in the inclusive range 0 through 50; empty input is allowed.",
  "Return the values in ascending order using counting sort, without sorted() or list.sort().",
  `
def solve(items):
    counts=[0]*51
    for x in items:counts[x]+=1
    result=[]
    for x,count in enumerate(counts):
        result.extend([x]*count)
    return result`,
  [t([[3, 1, 3, 0]], [0, 1, 3, 3]), t([[]], []), t([[50, 0]], [0, 50])],
  "The bucket for 3 records two occurrences; output buckets in numeric order.",
  ["Use values as bucket addresses.", "The cost includes scanning the universe even when the input is short."]
);
const radix = p(
  "Sort one digit at a time",
  "items",
  "Nonnegative integers at most 9999; input may be empty.",
  "Return ascending values using stable least-significant-digit radix sorting in base 10. Do not call sorting functions.",
  `
def solve(items):
    result=list(items)
    place=1
    maximum=max(result,default=0)
    while maximum//place:
        buckets=[[] for _ in range(10)]
        for x in result:buckets[(x//place)%10].append(x)
        result=[x for bucket in buckets for x in bucket]
        place*=10
    return result`,
  [t([[21, 3, 12, 1]], [1, 3, 12, 21]), t([[]], []), t([[0, 10, 0]], [0, 0, 10])],
  "Ones sort as [21,1,12,3]; a stable tens pass produces [1,3,12,21].",
  ["A later digit pass must preserve the order of equal digits.", "Append to digit buckets in current order, then concatenate buckets from 0 to 9."]
);
const select = p(
  "Select without sorting everything",
  "items, k",
  "A nonempty integer list and valid zero-based rank k, with duplicates counting separately.",
  "Return the value at rank k in ascending order using three-way quickselect. Leave the input unchanged.",
  `
def solve(items,k):
    values=list(items)
    while True:
        pivot=values[len(values)//2]
        low=[x for x in values if x<pivot]
        equal=[x for x in values if x==pivot]
        high=[x for x in values if x>pivot]
        if k<len(low):values=low
        elif k<len(low)+len(equal):return pivot
        else:
            k-=len(low)+len(equal)
            values=high`,
  [t([[4, 1, 3, 3], 2], 3), t([[7], 0], 7), t([[-1, 5, -2], 0], -2)],
  "Sorted order would be [1,3,3,4], so zero-based rank 2 contains 3. Partitioning can find that value without sorting every position.",
  ["Count how many values fall below and equal the pivot.", "Recurse into only the part containing k; subtract discarded positions when going right."]
);
const stable = p(
  "Keep ties in their original order",
  "records",
  "Records [integer_key, label] with string labels. The same key can occur repeatedly.",
  "Return records sorted by key using stable insertion sort. Equal-key records keep their input order.",
  `
def solve(records):
    result=[list(row) for row in records]
    for i in range(1,len(result)):
        held=result[i]
        j=i-1
        while j>=0 and result[j][0]>held[0]:
            result[j+1]=result[j]
            j-=1
        result[j+1]=held
    return result`,
  [
    t(
      [
        [
          [2, "a"],
          [1, "x"],
          [2, "b"],
        ],
      ],
      [
        [1, "x"],
        [2, "a"],
        [2, "b"],
      ]
    ),
    t([[]], []),
    t(
      [
        [
          [1, "a"],
          [1, "b"],
        ],
      ],
      [
        [1, "a"],
        [1, "b"],
      ]
    ),
  ],
  "The key-2 records a and b remain in that order after the key-1 record moves ahead.",
  ["Move only strictly larger keys past the held record.", "Using >= would move equal keys across one another and break stability."]
);
const randomSelect = p(
  "Randomize the pivot, not the answer",
  "items, k, seed",
  "A nonempty integer list, a valid zero-based rank k, and an integer random seed.",
  "Return the value at ascending rank k using a seeded random pivot on each quickselect round. The seed changes the work path, not the required answer.",
  `
import random
def solve(items,k,seed):
    rng=random.Random(seed)
    values=list(items)
    while True:
        pivot=values[rng.randrange(len(values))]
        low=[x for x in values if x<pivot]
        equal=[x for x in values if x==pivot]
        high=[x for x in values if x>pivot]
        if k<len(low):values=low
        elif k<len(low)+len(equal):return pivot
        else:
            k-=len(low)+len(equal)
            values=high`,
  [t([[8, 1, 4, 4], 2, 7], 4), t([[3], 0, 0], 3), t([[5, -1, 2], 0, 99], -1)],
  "For any seed, sorting these values would put 4 at rank 2. A poor pivot can add work but cannot change correctness.",
  ["Use a local seeded generator so other calls cannot change its state.", "Only the pivot selection changes; the rank invariant remains the same."]
);
export const sortingUnits = [
  unit(
    71,
    "Counting sort: use the key range",
    [70, 12],
    "A small integer universe lets us count positions instead of comparing every pair.",
    [
      "If a classroom records scores from 0 through 50, we know every possible key before reading any score. A general comparison sort ignores that extra information. Counting sort gives each possible key its own counter.",
      "Read [3,1,3,0]. Increment bucket 3, bucket 1, bucket 3 again, and bucket 0. We now know how many copies of each value belong in the output, without making pairwise comparisons between input values.",
      "Scan the buckets in increasing key order and emit each value its recorded number of times. The result is [0,1,3,3]. Every input contributes to exactly one counter, so the output has exactly the original multiplicities.",
      "The useful bound is O(n+K), where K is the key universe size. A billion possible keys can make this a poor choice for ten records. Sorting records by key also needs stable placement of the original records; counting values alone loses their labels.",
    ],
    [
      [
        "Read the score list.",
        [
          ["Input", "[3,1,3,0]"],
          ["Counters", "all zero"],
        ],
      ],
      ["Count each arrival.", [["Nonzero counters", "0:1, 1:1, 3:2"]]],
      ["Visit keys in increasing order.", [["Emitted so far", "[0,1]"]]],
      [
        "Emit both copies of 3.",
        [
          ["Returned values", "[0,1,3,3]"],
          ["Duplicates", "preserved"],
        ],
      ],
    ],
    "Linear in n alone is misleading when the key range K is large. Also distinguish sorting values from preserving full records.",
    q(
      "For ten integer keys spread across a billion possible values, what is the main cost concern?",
      ["Allocating and scanning the key universe", "Ten comparisons are impossible", "Duplicates make counting incorrect"],
      0,
      "Counting sort pays for K buckets as well as n arrivals, so a sparse huge universe can dominate."
    ),
    q(
      "Why does emitting bucket counts in key order produce a sorted permutation?",
      [
        "The buckets preserve multiplicities and their scan order is numeric",
        "The input has already been sorted",
        "Every bucket contains one value at most",
      ],
      0,
      "Counting accounts for every occurrence, and increasing bucket indices place all smaller keys before larger keys."
    ),
    [
      "Count n arrivals, scan K possible values, and write n outputs.",
      "Keep K counters and an n-value result.",
      "O(n+K) time and O(n+K) space including output; here K=51.",
    ],
    [
      ["Universe", "The set of allowed key values."],
      ["Multiplicity", "How many occurrences of a value must be preserved."],
    ],
    counts,
    p(
      "Allow negative keys in a bounded range",
      "items",
      "Integer values in [-20,20], possibly empty.",
      "Return sorted values using offset buckets rather than a sorting function.",
      `
def solve(items):
    buckets=[0]*41
    for x in items:buckets[x+20]+=1
    return [i-20 for i,count in enumerate(buckets) for _ in range(count)]`,
      [t([[-2, 1, -2, 0]], [-2, -2, 0, 1]), t([[]], []), t([[-20, 20]], [-20, 20])],
      "Offset -2 by 20 to address bucket 18; subtract the offset when emitting.",
      ["Negative integers need a nonnegative bucket address.", "Use x - minimum as the index and add minimum when returning values."]
    ),
    p(
      "Build the frequency report",
      "items",
      "Integers in [0,50], possibly repeated.",
      "Return [value,count] rows in ascending value order, omitting keys with zero occurrences.",
      `
def solve(items):
    counts=[0]*51
    for x in items:counts[x]+=1
    return [[x,c] for x,c in enumerate(counts) if c]`,
      [
        t(
          [[3, 1, 3]],
          [
            [1, 1],
            [3, 2],
          ]
        ),
        t([[]], []),
        t([[0, 0]], [[0, 2]]),
      ],
      "One 1 and two 3s become rows [1,1] and [3,2].",
      ["The output is a compressed report rather than every occurrence.", "Scan the fixed universe and emit only positive counts."]
    )
  ),
  unit(
    72,
    "Radix sort: let stable passes accumulate order",
    [71, 74],
    "Sorting a later digit works only when ties preserve the order established by earlier digits.",
    [
      "When numbers have several digits, a single bucket per complete value may require too much space. Radix sorting uses a small set of digit buckets repeatedly. This lesson processes digits from least significant to most significant.",
      "For [21,3,12,1], group by ones digits while preserving arrival order inside each bucket. This gives [21,1,12,3]. Now group that result by tens digits, treating a missing tens digit as zero.",
      "The tens-zero group keeps [1,3]; the tens-one group contains [12]; the tens-two group contains [21]. Concatenating gives [1,3,12,21]. Equal tens retain the earlier ones ordering because the pass is stable.",
      "Inductively, after d passes the result is ordered by its lowest d digits. Stability preserves that promise when one more digit is added. The cost is O(d(n+b)) for base b and d digits. Negative numbers need a separate representation strategy; they are outside this exercise.",
    ],
    [
      ["Begin with the unsorted values.", [["Input", "[21,3,12,1]"]]],
      [
        "Stable ones pass.",
        [
          ["Buckets 1 / 2 / 3", "[21,1] / [12] / [3]"],
          ["Result", "[21,1,12,3]"],
        ],
      ],
      ["Stable tens pass.", [["Buckets 0 / 1 / 2", "[1,3] / [12] / [21]"]]],
      ["Two digits now establish complete order.", [["Output", "[1,3,12,21]"]]],
    ],
    "An unstable digit pass can destroy the order of lower digits. Negative values do not fit this unsigned digit contract.",
    q(
      "After sorting the ones digit, what must a tens-digit pass do with equal tens digits?",
      ["Keep their current order", "Reverse every equal-tens group", "Discard lower digits permanently"],
      0,
      "Current order already encodes the ones digit; preserving ties carries that information into the combined order."
    ),
    q(
      "Which bound includes both input length and the number of digit passes?",
      ["O(d(n+b)) for d digits and base b", "O(log n) regardless of key length", "O(n!) because buckets are compared"],
      0,
      "Each stable pass reads the n records and handles b buckets, and d such passes are required."
    ),
    [
      "Each digit pass distributes all n values and concatenates the buckets.",
      "Keep a new ordering of n values plus a fixed number of bucket lists.",
      "O(d(n+b)) time and O(n+b) extra space.",
    ],
    [
      ["Stable pass", "A pass retaining the incoming order of equal digit keys."],
      ["Radix", "The number base used to split values into digits."],
    ],
    radix,
    p(
      "Perform only one digit pass",
      "items, place",
      "Nonnegative integers and place equal to a positive power of ten.",
      "Return one stable ordering by the digit (x//place)%10. Do not fully sort the numbers.",
      `
def solve(items,place):
    buckets=[[] for _ in range(10)]
    for x in items:buckets[(x//place)%10].append(x)
    return [x for bucket in buckets for x in bucket]`,
      [t([[21, 3, 12, 1], 1], [21, 1, 12, 3]), t([[], 10], []), t([[12, 11, 10], 10], [12, 11, 10])],
      "Here place=1 asks for the ones digit. Values 21 and 1 share digit 1 and keep that arrival order, followed by 12 with digit 2 and 3 with digit 3.",
      ["The requested ordering ignores every other digit.", "Preserve ties rather than sorting whole values inside a bucket."]
    ),
    p(
      "Order fixed-width labels",
      "words",
      "Lowercase a–z strings of equal width, at most 5 characters; the list may be empty.",
      "Return strings in lexicographic order using stable right-to-left character passes.",
      `
def solve(words):
    result=list(words)
    width=len(result[0]) if result else 0
    for position in range(width-1,-1,-1):
        buckets=[[] for _ in range(26)]
        for word in result:buckets[ord(word[position])-97].append(word)
        result=[word for bucket in buckets for word in bucket]
    return result`,
      [t([["ba", "ab", "aa"]], ["aa", "ab", "ba"]), t([[]], []), t([["", ""]], ["", ""])],
      "Sort by the final character, then stably by the first character.",
      [
        "All labels have the same width, so each has every requested character.",
        "A stable pass on an earlier character preserves later-character order within ties.",
      ]
    )
  ),
  unit(
    73,
    "Quickselect: keep only the part containing the rank",
    [25, 66],
    "Partitioning can answer an order-statistic question without sorting both sides.",
    [
      "Suppose you need the third smallest reading, not a fully sorted report. Sorting everything gives the answer but solves many other ordering questions you never asked. A partition tells us which part contains the rank.",
      "Choose a pivot and split values into smaller, equal, and larger groups. If there are a smaller values and b equal values, ranks a through a+b-1 all have the pivot value. Ranks below a lie in the smaller group.",
      "For a larger rank, discard both smaller and equal groups and subtract their sizes from the requested rank. Continue only in the larger group. Every round keeps the desired order statistic, even though discarded values never become fully sorted.",
      "The expected linear-time claim needs a suitable pivot policy, such as independent random selection. A fixed middle-position pivot is reproducible but can be adversarially bad, with quadratic work. Three-way partitioning ensures duplicates do not cause a failure to shrink.",
    ],
    [
      [
        "Find rank 2 in [4,1,3,3].",
        [
          ["Zero-based rank", "2"],
          ["Pivot", "3"],
        ],
      ],
      [
        "Partition around 3.",
        [
          ["Smaller", "[1]"],
          ["Equal", "[3,3]"],
          ["Larger", "[4]"],
        ],
      ],
      [
        "Locate the rank among group sizes.",
        [
          ["Pivot ranks", "1 through 2"],
          ["Wanted", "2"],
        ],
      ],
      [
        "The wanted rank is in the equal group.",
        [
          ["Answer", "3"],
          ["No need to sort", "either other group"],
        ],
      ],
    ],
    "Ranks count duplicates separately. Fixed pivot position is not a guarantee of balanced partitions.",
    q(
      "A pivot has two smaller values and three equal values. Which zero-based ranks equal the pivot?",
      ["2, 3, and 4", "0, 1, and 2", "Only rank 2"],
      0,
      "The two smaller entries occupy ranks 0 and 1; the next three positions contain the pivot value."
    ),
    q(
      "Why does quickselect usually do less work than quicksort?",
      ["It continues into only the group containing the desired rank", "It never examines input values", "Every pivot divides exactly in half"],
      0,
      "Partitioning discards entire irrelevant rank ranges; it does not recursively sort both remaining groups."
    ),
    [
      "Each round scans the remaining values. Good splits shrink this work geometrically; bad splits can remove just one.",
      "This clear three-list version uses linear peak extra memory, not an in-place partition.",
      "O(n²) worst-case time; O(n) expected with random pivots. O(n) extra space in this version.",
    ],
    [
      ["Order statistic", "The value at a specified sorted rank."],
      ["Rank", "Here, a zero-based position counting duplicates separately."],
    ],
    select,
    p(
      "Select from the large end",
      "items, k",
      "A nonempty integer list and one-based rank k from 1 to its length.",
      "Return the kth largest value using selection; duplicates count as separate ranks.",
      using(
        select,
        `def solve(items,k):
    return base(items,len(items)-k)`
      ),
      [t([[4, 1, 3, 3], 2], 3), t([[7], 1], 7), t([[-1, 5], 2], -1)],
      "The second largest occupies ascending zero-based rank n-2.",
      ["Convert the requested rank before partitioning.", "A one-based rank from the large end maps to len(items)-k."]
    ),
    p(
      "A robust middle reading",
      "items",
      "A nonempty integer list, not necessarily sorted.",
      "Return the lower median: sorted rank (len(items)-1)//2. Use selection, not a full sort.",
      using(
        select,
        `def solve(items):
    return base(items,(len(items)-1)//2)`
      ),
      [t([[9, 1, 4, 7]], 4), t([[2]], 2), t([[3, 3, 1]], 3)],
      "For four values, the lower of the two middle sorted values is 4.",
      ["Define the tie convention for even input length first.", "Only one rank is required, so both sides need not be sorted."]
    )
  ),
  unit(
    74,
    "Stable sorting: preserve the meaning of ties",
    [7, 66],
    "Sorting a key should not silently scramble the order of records that tie on that key.",
    [
      "Two records can have the same priority while representing different people or events. If equal priorities should keep arrival order, returning the same numeric keys in sorted order is not sufficient. The full records and their order matter.",
      "Insertion sort can be stable. Hold one record aside and shift only records with strictly larger keys. When an equal key is reached, leave it before the new record. The original order among equals survives.",
      "For [(2,a),(1,x),(2,b)], moving x before a changes key order but leaves a before b. If the shift condition used greater-than-or-equal, b could cross a, breaking the arrival-order promise.",
      "Stability also supports sorting multiple keys with repeated passes: stably sort the less important key first, then the more important key. Within equal primary keys, the secondary order remains. State the desired tie rule rather than assuming every sorting algorithm preserves it.",
    ],
    [
      ["The records have identity as well as a key.", [["Input", "[(2,a),(1,x),(2,b)]"]]],
      ["Insert the key-1 record.", [["Result", "[(1,x),(2,a),(2,b)]"]]],
      ["Insert b without passing equal key 2.", [["Tie order", "a before b"]]],
      ["The sorted output preserves key and arrival promises.", [["Output", "[(1,x),(2,a),(2,b)]"]]],
    ],
    "Comparing full records lexicographically adds an unintended label tie-breaker. Compare only the specified key.",
    q(
      "Which insertion-sort shift condition preserves the order of equal keys?",
      ["previous_key > held_key", "previous_key >= held_key", "label order, regardless of keys"],
      0,
      "Moving strictly larger keys leaves earlier equals ahead of the held record."
    ),
    q(
      "To sort by primary key then secondary key using stable passes, which pass comes first?",
      ["Secondary key, then primary key", "Primary key, then an unstable secondary pass", "Either order is always equivalent"],
      0,
      "The final primary pass groups primary keys while preserving the secondary ordering already established inside ties."
    ),
    [
      "Insertion sort may shift every earlier record for each new record.",
      "The reference copies the record list so the input is retained.",
      "O(n²) worst-case time and O(n) extra space here; an in-place variant needs O(1) working variables.",
    ],
    [
      ["Stable", "Equal-key records retain their incoming relative order."],
      ["Tie rule", "The specified ordering when primary keys compare equal."],
    ],
    stable,
    p(
      "Descending keys, stable arrivals",
      "records",
      "Records [integer_key,label] in arrival order.",
      "Return records in descending key order, retaining input order within equal keys.",
      `
def solve(records):
    result=[list(row) for row in records]
    for i in range(1,len(result)):
        held=result[i]
        j=i-1
        while j>=0 and result[j][0]<held[0]:
            result[j+1]=result[j]
            j-=1
        result[j+1]=held
    return result`,
      [
        t(
          [
            [
              [1, "a"],
              [2, "x"],
              [1, "b"],
            ],
          ],
          [
            [2, "x"],
            [1, "a"],
            [1, "b"],
          ]
        ),
        t([[]], []),
        t([[[0, "z"]]], [[0, "z"]]),
      ],
      "Descending key order changes which strict comparison shifts records, not the tie promise.",
      ["Do not sort ascending and reverse the whole result; that reverses ties too.", "Move only strictly smaller keys past the held record."]
    ),
    p(
      "Order a two-key register",
      "records",
      "Rows [primary_integer,secondary_integer,label] in input order.",
      "Return rows ordered by primary then secondary, retaining input order on exact key ties. Use two stable passes.",
      `
def solve(records):
    result=[list(row) for row in records]
    for key in (1,0):
        result.sort(key=lambda row:row[key])
    return result`,
      [
        t(
          [
            [
              [2, 1, "a"],
              [1, 2, "x"],
              [1, 1, "b"],
            ],
          ],
          [
            [1, 1, "b"],
            [1, 2, "x"],
            [2, 1, "a"],
          ]
        ),
        t([[]], []),
        t(
          [
            [
              [1, 1, "z"],
              [1, 1, "a"],
            ],
          ],
          [
            [1, 1, "z"],
            [1, 1, "a"],
          ]
        ),
      ],
      "Sort the secondary field first, then stably group primary keys.",
      [
        "Python’s key-based sort is stable; use that promise deliberately.",
        "Exact key ties keep arrival order even when labels would compare differently.",
      ]
    )
  ),
  unit(
    99,
    "Randomization: separate correctness from expected work",
    [73, 68],
    "Random choices can change running time while every allowed choice still gives a correct answer.",
    [
      "An adversary can arrange values to make a predictable pivot rule repeatedly choose a bad split. Choosing a pivot uniformly at random prevents the input arrangement from predetermining every pivot rank, provided the randomness is independent of that arrangement.",
      "The partition argument remains deterministic: regardless of which pivot was chosen, the requested rank stays in the one retained group. Randomness changes the amount of discarded work, not the meaning of the returned answer. This is a Las Vegas algorithm: always correct, with random running time.",
      "A constant fraction of pivot ranks discard a substantial part of the current values. This leads to expected linear selection work, even though a long sequence of poor choices is still possible. Expected time is an average over the algorithm’s random choices for a fixed input, not a promise about each run.",
      "A fixed seed makes examples repeatable but is not fresh unpredictable randomness or a worst-case guarantee. Here the seed belongs to a local generator so other code cannot change the exercise’s random stream. Analyze correctness for every pivot choice and expected work under the actual random policy separately.",
    ],
    [
      [
        "The requested rank is fixed before choosing a pivot.",
        [
          ["Input", "[8,1,4,4]"],
          ["Rank", "2"],
        ],
      ],
      ["Any chosen pivot produces exhaustive groups.", [["If pivot is 4", "[1] / [4,4] / [8]"]]],
      ["A different pivot may need another round.", [["If pivot is 8", "keep [1,4,4] for rank 2"]]],
      [
        "Every terminating pivot path gives the same answer.",
        [
          ["Answer", "4"],
          ["Random quantity", "work, not the answer"],
        ],
      ],
    ],
    "A seeded example does not prove an expected-time bound. A fixed public seed can be anticipated by an adversarial input.",
    q(
      "What is random in a Las Vegas selection algorithm with a fixed target rank?",
      ["Its running time; its answer must always be correct", "Its correctness; any wrong answer is acceptable", "The definition of the target rank"],
      0,
      "The partition invariant proves every pivot path correct; the probability analysis concerns how much work it takes."
    ),
    q(
      "Does expected O(n) selection imply every seed finishes in O(n) work?",
      ["No; rare bad pivot sequences can still be quadratic", "Yes; expectation is a worst-case bound", "Only duplicate inputs can be correct"],
      0,
      "Expectation averages random choices under stated assumptions and does not rule out an expensive individual path."
    ),
    [
      "Each round partitions the current values. Random pivot ranks give expected geometric progress.",
      "This copy-based implementation uses linear extra storage; the local random generator has bounded additional state.",
      "Expected O(n) time, O(n²) worst case, and O(n) extra space.",
    ],
    [
      ["Las Vegas", "Random running time with a correctness guarantee for every outcome."],
      ["Expectation", "A probability-weighted average under a stated random process."],
    ],
    randomSelect,
    p(
      "Shuffle without biased swaps",
      "items, seed",
      "An integer list and an integer seed.",
      "Return a Fisher–Yates shuffle using a local random.Random(seed). For i from n-1 down to 1, swap i with rng.randrange(i+1). Leave input unchanged.",
      `
import random
def solve(items,seed):
    result=list(items)
    rng=random.Random(seed)
    for i in range(len(result)-1,0,-1):
        j=rng.randrange(i+1)
        result[i],result[j]=result[j],result[i]
    return result`,
      [t([[], 0], []), t([[1], 2], [1]), t([[1, 2], 0], [1, 2])],
      "An empty input has no positions to swap and returns an empty list. On nonempty inputs, each final position chooses uniformly among the remaining positions; a fixed seed makes the sample reproducible.",
      [
        "Swapping each slot with any slot in the whole array is a different, generally biased algorithm.",
        "At slot i, choose only from positions 0 through i inclusive.",
      ]
    ),
    p(
      "Pick the value at a percentile rank",
      "items, percent, seed",
      "A nonempty integer list, integer percent from 0 through 100, and a seed.",
      "Return the value at ascending rank (len(items)-1)*percent//100, using randomized selection.",
      using(
        randomSelect,
        `def solve(items,percent,seed):
    return base(items,(len(items)-1)*percent//100,seed)`
      ),
      [t([[9, 1, 5, 3], 50, 7], 3), t([[2], 100, 0], 2), t([[1, 4], 0, 2], 1)],
      "With four values, this contract maps 50 percent to rank 1, whose value is 3.",
      ["Percentile definitions differ; follow this explicit integer-rank rule.", "Compute the rank first, then preserve it through each partition."]
    )
  ),
];
