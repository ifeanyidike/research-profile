import { unit, problem as p, t, q, using } from "./unit.js?v=20261027-course2";
const power = p(
  "Keep repeated multiplication small",
  "base, exponent, modulus",
  "An integer base, nonnegative integer exponent, and positive integer modulus.",
  "Return base**exponent modulo modulus using binary exponentiation without pow(). For exponent 0 return 1 modulo modulus.",
  `
def solve(base,exponent,modulus):
    base%=modulus;result=1%modulus
    while exponent:
        if exponent%2:result=result*base%modulus
        base=base*base%modulus
        exponent//=2
    return result`,
  [t([3, 5, 7], 5), t([0, 0, 5], 1), t([8, 0, 1], 0)],
  "3⁵ = 243 leaves remainder 5 modulo 7; reducing intermediate products preserves that remainder.",
  [
    "Express the exponent as a sum of powers of two.",
    "Square the base each round and multiply it into the result only when the current exponent bit is 1.",
  ]
);
const sieve = p(
  "Cross out composite numbers once their factors are known",
  "n",
  "A nonnegative integer n, at most 5000.",
  "Return all primes at most n using the Sieve of Eratosthenes.",
  `
def solve(n):
    prime=[True]*(n+1)
    if n>=0:prime[0]=False
    if n>=1:prime[1]=False
    p=2
    while p*p<=n:
        if prime[p]:
            for multiple in range(p*p,n+1,p):prime[multiple]=False
        p+=1
    return [value for value in range(n+1) if prime[value]]`,
  [t([10], [2, 3, 5, 7]), t([1], []), t([2], [2])],
  "Cross out multiples of 2 and then 3; unmarked 2,3,5,7 are prime.",
  [
    "Every composite has a prime factor no larger than its square root.",
    "Begin marking at p² because smaller multiples already have smaller prime factors.",
  ]
);
const choose = p(
  "Count combinations without enumerating them",
  "n, k, modulus",
  "A nonnegative integer n <= 100, any integer k, and a positive integer modulus.",
  "Return the number of k-element subsets of n positions modulo modulus, or 0 for invalid k. Use Pascal-style DP without modular division.",
  `
def solve(n,k,modulus):
    if k<0 or k>n:return 0
    k=min(k,n-k)
    row=[0]*(k+1);row[0]=1%modulus
    for size in range(1,n+1):
        for count in range(min(k,size),0,-1):row[count]=(row[count]+row[count-1])%modulus
    return row[k]`,
  [t([5, 2, 100], 10), t([0, 0, 7], 1), t([3, 4, 5], 0)],
  "Five positions yield 5×4/2 = 10 unordered pairs. The recurrence counts the same choices by whether a subset includes the new position, without requiring modular division.",
  [
    "Every input position is distinguishable even if a story gives positions equal values.",
    "Update counts downward so the new position is not reused within one row.",
  ]
);
const inverse = p(
  "When can division modulo m be legal?",
  "a, modulus",
  "An integer a and integer modulus >= 2.",
  "Return the unique x in [0,modulus) with a*x ≡ 1 modulo modulus, or None when no inverse exists. Use extended Euclid.",
  `
def solve(a,modulus):
    old,r=a%modulus,modulus
    x,next_x=1,0
    while r:
        quotient=old//r
        old,r=r,old-quotient*r
        x,next_x=next_x,x-quotient*next_x
    return x%modulus if old==1 else None`,
  [t([3, 7], 5), t([2, 4], null), t([-3, 7], 2)],
  "3×5 = 15 ≡ 1 mod 7; 2 has no inverse modulo 4 because every multiple remains even.",
  [
    "Extended Euclid expresses the gcd as a linear combination.",
    "An inverse exists exactly when gcd(a,modulus)=1; normalize the coefficient into the requested range.",
  ]
);
export const mathematicsUnits = [
  unit(
    96,
    "Modular exponentiation: compose repeated squaring",
    [14, 38, 59, 67],
    "Reduce each product without changing its final remainder, and process only logarithmically many exponent bits.",
    [
      "Computing a huge power first can create enormous integers even when only its remainder is needed. Modular arithmetic allows reduction after every addition or multiplication because replacing a value by an equal remainder preserves later remainders under those operations.",
      "Write the exponent in binary. For exponent 5, the set bits represent 4+1, so base⁵ = base⁴×base. Repeated squaring supplies base, base², base⁴, and so on; selected bits decide which factors enter the result.",
      "The loop invariant is result × current_base^remaining_exponent ≡ original_base^original_exponent. For an odd remaining exponent, move one factor into result. Squaring the base and halving the remaining exponent then preserves the same product remainder.",
      "Termination leaves remaining exponent 0, so result has the required remainder. The identity is 1 modulo m, which is 0 when m=1. Modular division is different: a denominator cannot simply be cancelled unless it has an inverse, a condition taught later.",
    ],
    [
      [
        "Compute 3⁵ modulo 7.",
        [
          ["Exponent bits", "101₂ = 4+1"],
          ["Result", "1"],
        ],
      ],
      [
        "The low bit is 1, so include 3.",
        [
          ["Result", "3"],
          ["Square base", "9 mod 7 = 2"],
          ["Remaining exponent", "2"],
        ],
      ],
      [
        "Skip the next zero bit and square again.",
        [
          ["Base", "4"],
          ["Remaining exponent", "1"],
        ],
      ],
      ["Include 4 and finish.", [["Result", "3×4 mod 7 = 5"]]],
    ],
    "Modulo reduction works through addition and multiplication, but does not justify ordinary integer division or cancellation.",
    q(
      "What initial result handles exponent 0 correctly even when modulus is 1?",
      ["1 % modulus", "Always 1 without reduction", "Always base"],
      0,
      "The empty product is 1, but its requested remainder is 0 modulo 1."
    ),
    q(
      "Why is the number of exponentiation rounds logarithmic in a positive exponent?",
      [
        "Each round halves the remaining exponent",
        "The modulus removes half the input list",
        "Every multiplication has constant bit cost for arbitrary-sized integers",
      ],
      0,
      "Binary processing removes one exponent bit per round; integer multiplication bit costs are a separate part of a detailed model."
    ),
    [
      "Halve the exponent each round, performing at most a square and one multiply.",
      "Keep a few residues bounded by the modulus plus the remaining exponent.",
      "O(log(exponent+1)) modular multiplications; bit costs depend on modulus size.",
    ],
    [
      ["Congruent", "Two integers have the same remainder modulo the modulus."],
      ["Binary exponentiation", "Compose powers corresponding to the exponent’s set bits."],
    ],
    power,
    p(
      "Sum a huge geometric run modulo m",
      "base, terms, modulus",
      "An integer base, nonnegative term count, and positive modulus.",
      "Return (1 + base + ... + base**(terms-1)) modulo modulus. Return 0 for no terms. Use logarithmic divide-and-conquer without dividing by base-1.",
      `
def solve(base,terms,modulus):
    base%=modulus
    def pair(n):
        if n==0:return (1%modulus,0)
        power,total=pair(n//2)
        doubled_power=power*power%modulus
        doubled_sum=total*(1+power)%modulus
        return (doubled_power*base%modulus,(doubled_sum+doubled_power)%modulus) if n%2 else (doubled_power,doubled_sum)
    return pair(terms)[1]`,
      [t([2, 4, 100], 15), t([1, 5, 3], 2), t([3, 0, 7], 0)],
      "1+2+4+8=15. The paired state stores both a power and its preceding sum.",
      [
        "Split an even run into its first half plus a shifted copy of that half.",
        "Dividing by base-1 modulo a composite can be invalid; use multiplication and addition instead.",
      ]
    ),
    p(
      "Apply a repeated affine update",
      "value, multiplier, addition, steps, modulus",
      "Integers defining x ← multiplier*x+addition modulo a positive modulus, repeated a nonnegative number of steps.",
      "Return the final residue using repeated squaring of the update transformation.",
      `
def solve(value,multiplier,addition,steps,modulus):
    value%=modulus;multiplier%=modulus;addition%=modulus
    while steps:
        if steps%2:value=(multiplier*value+addition)%modulus
        addition=addition*(multiplier+1)%modulus
        multiplier=multiplier*multiplier%modulus
        steps//=2
    return value`,
      [t([1, 2, 1, 3, 100], 15), t([7, 3, 4, 0, 5], 2), t([0, 1, 2, 4, 7], 1)],
      "Starting from 1, three updates x←2x+1 give 3,7,15.",
      ["Two applications compose into x←a²x+b(a+1).", "Exponentiate the transformation’s pair of coefficients, not just the multiplier."]
    )
  ),
  unit(
    97,
    "Prime sieves: reuse divisibility work",
    [59, 66],
    "Every composite has a small prime factor, so mark whole families of multiples together.",
    [
      "Testing each number independently for primality repeats divisions by the same factors. When the task asks for all primes up to a bound, a shared table can reuse that work.",
      "Initially regard every integer from 2 onward as a candidate. For each still-unmarked p, cross out multiples beginning at p². Earlier multiples already have a factor smaller than p and were handled by an earlier prime.",
      "Why stop the outer marking loop at sqrt(n)? If a composite x had both factors greater than sqrt(x), their product would exceed x. Thus every composite at most n has a prime factor no larger than sqrt(n) and is eventually marked.",
      "Zero and one are not prime, so exclude them explicitly. The table uses space proportional to the bound even when few primes are requested. A segmented sieve reduces working memory for large ranges; this lesson uses the clearer full table before that extension.",
    ],
    [
      [
        "Initialize candidates up to 10.",
        [
          ["Excluded", "0 and 1"],
          ["Candidates", "2 through 10"],
        ],
      ],
      ["At p=2, mark 4,6,8,10.", [["First marked multiple", "2² = 4"]]],
      ["At p=3, mark 9.", [["First marked multiple", "3² = 9"]]],
      ["No factor beyond sqrt(10) is needed.", [["Primes", "[2,3,5,7]"]]],
    ],
    "One is not prime. Starting a mark at p itself incorrectly removes the prime you intended to retain.",
    q(
      "Why may marking a prime p begin at p²?",
      ["Smaller multiples already have a smaller prime factor", "All smaller multiples are prime", "The number p never divides itself"],
      0,
      "A multiple p*k with k<p has a prime factor within k that was processed before p."
    ),
    q(
      "Why must a composite x have a factor no larger than sqrt(x)?",
      ["Two larger factors would multiply to more than x", "Every composite is even", "Square roots are always integers"],
      0,
      "The factor-pair product gives the stopping argument even when the square root is not an integer."
    ),
    [
      "Mark multiples of each prime, reusing the table across all candidate numbers.",
      "The boolean table has n+1 entries and the prime output is additional.",
      "O(n log log n) marking time and O(n) space for the ordinary sieve.",
    ],
    [
      ["Prime", "An integer greater than 1 whose only positive divisors are 1 and itself."],
      ["Composite", "An integer greater than 1 with a nontrivial factor."],
    ],
    sieve,
    p(
      "Store the smallest prime factor",
      "n",
      "A nonnegative integer n at most 1000.",
      "Return a table of length n+1 whose entry i is i’s smallest prime factor. Entries 0 and 1 are 0 when present.",
      `
def solve(n):
    factor=list(range(n+1))
    if n>=1:factor[1]=0
    p=2
    while p*p<=n:
        if factor[p]==p:
            for multiple in range(p*p,n+1,p):
                if factor[multiple]==multiple:factor[multiple]=p
        p+=1
    return factor`,
      [t([5], [0, 0, 2, 3, 2, 5]), t([0], [0]), t([1], [0, 0])],
      "The smallest factor of 4 is 2, while a prime such as 5 keeps itself as the factor.",
      ["Do not overwrite an earlier smaller factor.", "The same sieve can store a reason for compositeness instead of only a boolean."]
    ),
    p(
      "Count pairs with a prime combined score",
      "items",
      "A list of nonnegative integers at most 50. Positions are distinct even when values match.",
      "Return the number of index pairs i<j whose values sum to a prime.",
      using(
        sieve,
        `def solve(items):
    primes=set(base(2*max(items,default=0)))
    return sum(items[i]+items[j] in primes for i in range(len(items)) for j in range(i+1,len(items)))`
      ),
      [t([[1, 1, 2]], 3), t([[]], 0), t([[0, 2]], 1)],
      "The two 1s sum to 2, and each 1 paired with 2 sums to 3: three position pairs.",
      ["Precompute primality only up to the largest possible pair sum.", "Equal values at different positions still form distinct pairs."]
    )
  ),
  unit(
    98,
    "Combinatorial counting: split by the final choice",
    [26, 49, 35],
    "Count include/exclude alternatives without listing every subset, and keep modular division assumptions explicit.",
    [
      "Choosing k positions from n produces a combination: order of selection does not create a new subset. There are often far more subsets than an application can enumerate, even when only their count is needed.",
      "Focus on the final position. A size-k subset either excludes it, leaving k choices among n-1 positions, or includes it, leaving k-1 choices among n-1. The cases are disjoint and exhaustive, giving Pascal’s recurrence.",
      "The empty subset contributes C(n,0)=1. Impossible sizes contribute zero. A rolling array updated downward preserves the previous-row meaning, just as once-only knapsack prevents reusing the current item.",
      "Computing modulo an arbitrary positive number is safe through this addition recurrence. A factorial formula divided modulo m needs inverses that may not exist. Also distinguish combinations from permutations: selecting the same positions in a different order is not counted again here.",
    ],
    [
      ["Count 2-element subsets of 5 positions.", [["Question", "C(5,2)"]]],
      [
        "Split by whether the final position is included.",
        [
          ["Exclude it", "C(4,2) = 6"],
          ["Include it", "C(4,1) = 4"],
        ],
      ],
      ["The cases cannot overlap.", [["Total", "6+4 = 10"]]],
      ["The same recurrence works under any positive modulus.", [["Example mod 7", "10 mod 7 = 3"]]],
    ],
    "Downward updates prevent using the new position repeatedly. Modular division is not automatically valid for a composite modulus.",
    q(
      "Why do the include and exclude cases add without subtracting an overlap?",
      [
        "Every subset either contains the final position or does not, never both",
        "Every subset has the same numeric sum",
        "The final position has weight zero",
      ],
      0,
      "Membership of that specific position partitions the set of solutions into two disjoint groups."
    ),
    q(
      "Why is a downward rolling-row update important for once-only combination counting?",
      [
        "The source entry must still describe the previous set of positions",
        "It changes combinations into permutations",
        "It guarantees all moduli are prime",
      ],
      0,
      "An upward pass could immediately reuse an answer already including the new position and count it more than once."
    ),
    [
      "Fill up to k entries per input position, using symmetry to choose min(k,n-k).",
      "The rolling row stores only the retained counts.",
      "O(n·min(k,n-k)) time and O(min(k,n-k)+1) space for valid k.",
    ],
    [
      ["Combination", "A subset of distinct positions, ignoring order of selection."],
      ["Disjoint cases", "Alternatives with no solution counted in more than one."],
    ],
    choose,
    p(
      "Jump to a ranked combination",
      "n, k, rank",
      "0 <= k <= n <= 12 and a nonnegative zero-based rank among lexicographic k-subsets of range(n).",
      "Return the subset at rank, or [] for an out-of-range rank. The one empty subset for k=0 is represented as []. Use branch counts rather than listing every subset.",
      `
from math import comb
def solve(n,k,rank):
    if rank>=comb(n,k):return []
    result=[];start=0
    for left in range(k,0,-1):
        for value in range(start,n-left+1):
            count=comb(n-value-1,left-1)
            if rank>=count:rank-=count
            else:result.append(value);start=value+1;break
    return result`,
      [t([4, 2, 3], [1, 2]), t([3, 1, 3], []), t([0, 0, 0], [])],
      "The 2-subsets are [0,1],[0,2],[0,3],[1,2],[1,3],[2,3], so rank 3 is [1,2].",
      ["Count how many completions share a proposed next value.", "Skip a whole branch by subtracting its completion count from rank."]
    ),
    p(
      "Binary records without neighboring flags",
      "n, k, modulus",
      "A nonnegative length n <= 100, integer k, and positive modulus.",
      "Return the number of binary strings of length n with exactly k ones and no adjacent ones, modulo modulus.",
      using(
        choose,
        `def solve(n,k,modulus):
    if k<0 or k>n:return 0
    return base(n-k+1,k,modulus)`
      ),
      [t([5, 2, 100], 6), t([3, 2, 100], 1), t([0, 0, 7], 1)],
      "For n=5 and k=2, reserving one separator between ones reduces the selection to C(4,2)=6.",
      ["Reserve the mandatory k-1 separating zeros first.", "Compress away those separators to choose k positions from n-k+1 available slots."]
    )
  ),
  unit(
    105,
    "Modular inverses: division needs a witness",
    [96, 59, 67],
    "An inverse exists exactly when the value and modulus have greatest common divisor one.",
    [
      "Addition and multiplication behave predictably modulo m, but division can lose information. Modulo 4, both 1 and 3 become 2 when multiplied by 2. There is no unique operation that undoes that multiplication.",
      "Extended Euclid follows the remainder algorithm while tracking coefficients x and y with a*x + m*y = gcd(a,m). Each quotient update preserves that linear-combination relationship. The coefficients are a witness, not a guess from repeated multiplication.",
      "If the gcd is 1, reducing the equation modulo m gives a*x ≡ 1, so x is an inverse. Normalize it into 0..m-1. If the gcd is larger than one, every a*x shares that factor modulo m, so it cannot be congruent to 1.",
      "This is why a factorial-based modular formula cannot divide by arbitrary denominators under arbitrary moduli. The existence condition is part of the algorithm. For coprime moduli, inverses also combine two remainder requirements constructively through the Chinese remainder theorem.",
    ],
    [
      ["Find an inverse of 3 modulo 7.", [["Desired", "3x ≡ 1 mod 7"]]],
      ["Euclid gives 7=2×3+1.", [["Rearrange", "1 = 7 - 2×3"]]],
      ["The coefficient of 3 is -2.", [["Normalize", "-2 mod 7 = 5"]]],
      [
        "Check the witness.",
        [
          ["Product", "3×5 = 15"],
          ["Remainder", "1"],
        ],
      ],
    ],
    "A nonzero residue need not be invertible when the modulus is composite. Check the gcd rather than dividing anyway.",
    q(
      "Which condition is necessary and sufficient for a to have an inverse modulo m?",
      ["gcd(a,m)=1", "a is merely nonzero modulo m", "m must be larger than a"],
      0,
      "Bézout’s identity supplies an inverse exactly when the gcd is one; a larger shared factor makes a product congruent to one impossible."
    ),
    q(
      "Why does the value 2 have no multiplicative inverse modulo 4?",
      ["Every 2x has even remainder, so it cannot have remainder 1", "2 is smaller than 4", "All positive residues have two inverses"],
      0,
      "The shared gcd 2 obstructs the identity remainder; being nonzero does not solve that obstruction."
    ),
    [
      "Euclid repeatedly replaces the larger remainder by a smaller remainder.",
      "A few remainder and coefficient integers are retained.",
      "O(log m) Euclidean divisions; integer bit costs depend on operand sizes.",
    ],
    [
      ["Bézout identity", "A linear combination of two integers equal to their gcd."],
      ["Inverse", "A residue multiplying the given value to remainder 1."],
    ],
    inverse,
    p(
      "Count solutions to a linear congruence",
      "a, b, modulus",
      "Integers a and b and modulus >= 2. Count residues x in 0..modulus-1.",
      "Return how many residues satisfy a*x ≡ b modulo modulus.",
      `
from math import gcd
def solve(a,b,modulus):
    g=gcd(a,modulus)
    return g if b%g==0 else 0`,
      [t([2, 2, 4], 2), t([2, 1, 4], 0), t([0, 0, 5], 5)],
      "2x ≡ 2 mod 4 has residues x=1 and x=3, so the answer is 2.",
      ["A gcd obstruction determines whether solutions exist.", "When the gcd divides b, there are exactly gcd(a,m) residue solutions."]
    ),
    p(
      "Combine two remainder requirements",
      "a, m, b, n",
      "Integer residues a,b and coprime moduli m,n >= 2.",
      "Return the unique x in [0,m*n) with x ≡ a mod m and x ≡ b mod n.",
      using(
        inverse,
        `def solve(a,m,b,n):
    adjustment=(b-a)*base(m,n)%n
    return (a+m*adjustment)%(m*n)`
      ),
      [t([2, 3, 3, 5], 8), t([0, 2, 1, 3], 4), t([-1, 3, 0, 2], 2)],
      "8 leaves remainder 2 modulo 3 and remainder 3 modulo 5.",
      ["Write x=a+m*t so the first requirement is automatic.", "Solve m*t ≡ b-a modulo n using the inverse guaranteed by coprime moduli."]
    )
  ),
];
