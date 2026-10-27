import { unit, problem as p, t, q, using } from "./unit.js?v=20261027-course2";
const node = (value, left = null, right = null) => ({ value, left, right });
const deletion = p(
  "Remove a key without losing the tree",
  "root, value",
  "A distinct-key BST with value/left/right nodes, or None, and an integer key to remove.",
  "Return the BST root after deleting value if present. For a node with two children, replace its value with the smallest value in its right subtree, then remove that successor.",
  `
def solve(root,value):
    if root is None:return None
    if value<root['value']:root['left']=solve(root['left'],value)
    elif value>root['value']:root['right']=solve(root['right'],value)
    else:
        if root['left'] is None:return root['right']
        if root['right'] is None:return root['left']
        successor=root['right']
        while successor['left'] is not None:successor=successor['left']
        root['value']=successor['value']
        root['right']=solve(root['right'],successor['value'])
    return root`,
  [t([node(5, node(2), node(8, node(6))), 5], node(6, node(2), node(8))), t([null, 3], null), t([node(1), 1], null)],
  "For root 5 with right-subtree minimum 6, use 6 as the replacement and remove its old occurrence.",
  ["Separate the zero-child, one-child, and two-child cases.", "A two-child replacement must satisfy every left and right descendant bound."]
);
const avlCode = `
def solve(values):
    def h(node):return node['height'] if node else 0
    def update(node):node['height']=1+max(h(node['left']),h(node['right']))
    def right(y):
        x=y['left']
        y['left']=x['right']
        x['right']=y
        update(y);update(x)
        return x
    def left(x):
        y=x['right']
        x['right']=y['left']
        y['left']=x
        update(x);update(y)
        return y
    def insert(node,value):
        if node is None:return {'value':value,'left':None,'right':None,'height':1}
        if value<node['value']:node['left']=insert(node['left'],value)
        elif value>node['value']:node['right']=insert(node['right'],value)
        else:return node
        update(node)
        balance=h(node['left'])-h(node['right'])
        if balance>1:
            if value>node['left']['value']:node['left']=left(node['left'])
            return right(node)
        if balance < -1:
            if value<node['right']['value']:node['right']=right(node['right'])
            return left(node)
        return node
    root=None
    for value in values:root=insert(root,value)
    def clean(node):
        return None if node is None else {'value':node['value'],'left':clean(node['left']),'right':clean(node['right'])}
    return clean(root)`;
const avl = p(
  "Insert while maintaining AVL balance",
  "values",
  "Integer keys in insertion order, with duplicates ignored.",
  "Return the AVL tree after inserting all keys. Nodes in the returned tree have only value/left/right. Repair the first unbalanced ancestors using standard single or double rotations.",
  avlCode,
  [t([[3, 2, 1]], node(2, node(1), node(3))), t([[]], null), t([[3, 1, 2]], node(2, node(1), node(3)))],
  "Inserting 3,2,1 makes a left-left chain. A right rotation places 2 above 1 and 3.",
  [
    "Recompute heights while returning from insertion.",
    "Use the child direction to choose single versus double rotation; update the lower node before its new parent.",
  ]
);
const orderPrelude = `
def prepare(node):
    if node is None:return None
    left,right=prepare(node['left']),prepare(node['right'])
    return {'value':node['value'],'left':left,'right':right,'size':1+size(left)+size(right)}
def size(node):return node['size'] if node else 0
def choose(node,k):
    if k<0 or k>=size(node):return None
    while node:
        count=size(node['left'])
        if k<count:node=node['left']
        elif k==count:return node['value']
        else:
            k-=count+1
            node=node['right']
`;
const order = p(
  "Ask for a rank with subtree sizes",
  "root, k",
  "A distinct-key BST with value/left/right nodes and an integer zero-based rank.",
  "Annotate a separate tree with subtree sizes, then return the kth smallest value, or None if k is outside the valid ranks.",
  orderPrelude +
    `
def solve(root,k):
    return choose(prepare(root),k)`,
  [t([node(4, node(2, node(1), node(3)), node(6)), 2], 3), t([null, 0], null), t([node(1), -1], null)],
  "The left subtree of 4 has three values, so rank 2 stays left rather than scanning the whole inorder output.",
  ["Define size as 1 plus both child sizes.", "Compare k with the left size; when going right, subtract that size plus the current node."]
);
const lca = p(
  "Find the deepest shared ancestor",
  "root, a, b",
  "A binary tree of distinct integer values and two target values; the tree need not be a BST.",
  "Return the value of the lowest common ancestor of a and b, including a node as its own ancestor. Return None if either target is absent.",
  `
def solve(root,a,b):
    def path(node,target):
        if node is None:return []
        if node['value']==target:return [node['value']]
        for side in ('left','right'):
            rest=path(node[side],target)
            if rest:return [node['value']]+rest
        return []
    first,second=path(root,a),path(root,b)
    if not first or not second:return None
    answer=None
    for x,y in zip(first,second):
        if x!=y:break
        answer=x
    return answer`,
  [t([node(4, node(2, node(1), node(3)), node(6)), 1, 3], 2), t([node(1), 1, 1], 1), t([node(1), 1, 9], null)],
  "Paths [4,2,1] and [4,2,3] share 4 then 2. Their last shared node is 2.",
  ["Compare root-to-target paths or combine presence information bottom up.", "Do not return a candidate before checking both targets exist."]
);
const segmentCode = `
def solve(items,operations):
    size=1
    while size<len(items):size*=2
    tree=[0]*(2*size)
    tree[size:size+len(items)]=items
    for i in range(size-1,0,-1):tree[i]=tree[2*i]+tree[2*i+1]
    result=[]
    for op in operations:
        if op[0]=='set':
            i=size+op[1]
            tree[i]=op[2]
            i//=2
            while i:
                tree[i]=tree[2*i]+tree[2*i+1]
                i//=2
        else:
            left,right=op[1]+size,op[2]+size+1
            total=0
            while left<right:
                if left%2:total+=tree[left];left+=1
                if right%2:right-=1;total+=tree[right]
                left//=2;right//=2
            result.append(total)
    return result`;
const segment = p(
  "Range answers from a tree of summaries",
  "items, operations",
  'Integers and valid operations ["set",index,value] or ["sum",left,right], with inclusive nonempty ranges. Empty input permits no operations.',
  "Return each range sum after applying prior assignments. Use a segment tree.",
  segmentCode,
  [
    t(
      [
        [2, 1, 3, 4],
        [
          ["sum", 1, 3],
          ["set", 2, 8],
          ["sum", 1, 3],
        ],
      ],
      [8, 13]
    ),
    t([[], []], []),
    t(
      [
        [1],
        [
          ["set", 0, -2],
          ["sum", 0, 0],
        ],
      ],
      [-2]
    ),
  ],
  "The first range totals 1+3+4=8. Assigning index 2 to 8 makes the later total 1+8+4=13.",
  [
    "A parent stores the sum of its two child intervals.",
    "An assignment repairs only ancestors; a query joins a disjoint cover of the requested interval.",
  ]
);
export const treeUnits = [
  unit(
    75,
    "Delete from a search tree",
    [46, 66],
    "Reconnect the surviving branches, and choose a replacement that respects every descendant bound.",
    [
      "Search-tree insertion only fills an empty link. Deletion can remove a node that already has children. Dropping that whole node would also drop values that must stay in the tree.",
      "Find the key using ordinary search. With no child, return an empty link. With one child, return that child as the replacement subtree. Its descendants already satisfy all ancestor bounds inherited by the deleted node.",
      "With two children, choose the smallest value in the right subtree, called the inorder successor. It is greater than every left-subtree value and no greater than the remaining right-subtree values. Copy its value into the target node, then delete the old successor occurrence.",
      "The recursive return value is the new root of each changed subtree, so callers must reattach it. Deleting the overall root is not a special failure: the caller receives its replacement. The successor choice makes the exercise output deterministic; a predecessor policy could also be valid under a different contract.",
    ],
    [
      [
        "Delete 5 from this BST.",
        [
          ["Root", "5"],
          ["Left / right", "2 / 8 (left child 6)"],
        ],
      ],
      ["Both children exist, so inspect the right-subtree minimum.", [["Successor", "6"]]],
      [
        "Replace 5 by 6 and remove the old 6 link.",
        [
          ["New root", "6"],
          ["Right child", "8 with empty left"],
        ],
      ],
      ["Every retained key occurs once in sorted inorder.", [["Inorder", "[2,6,8]"]]],
    ],
    "Changing a local node without returning and reattaching the new subtree root loses root deletions and one-child replacements.",
    q(
      "Why is the minimum of the right subtree a safe two-child replacement?",
      [
        "It lies above all left values and below the remaining right values",
        "It is always a leaf on the left of the whole tree",
        "Its numeric distance from the deleted value is smallest",
      ],
      0,
      "Search-tree ordering concerns relative bounds over whole subtrees, which the inorder successor satisfies."
    ),
    q(
      "What should deleting a root with only a right child return?",
      ["That right child as the new root", "None regardless of the child", "The deleted node unchanged"],
      0,
      "Promoting the surviving child retains every remaining key and respects the inherited bounds."
    ),
    [
      "Search down one path and, when needed, follow a successor path.",
      "Recursion remembers ancestors along a tree path.",
      "O(h) time and O(h) call space; h may be n without balancing.",
    ],
    [
      ["Successor", "The next larger key in inorder order."],
      ["Subtree root", "The node a parent must point to after an edit."],
    ],
    deletion,
    p(
      "Apply several removals",
      "root, values",
      "A distinct-key BST and a list of integer keys to remove in order.",
      "Return the final BST after deleting each requested key with the successor policy. Missing keys leave it unchanged.",
      using(
        deletion,
        `def solve(root,values):
    for value in values:root=base(root,value)
    return root`
      ),
      [t([node(2, node(1), node(3)), [2, 9]], node(3, node(1))), t([null, [1]], null), t([node(1), [1, 1]], null)],
      "Removing 2 promotes successor 3; a later missing key 9 changes nothing.",
      ["Keep the returned root after every deletion.", "Deleting the same key twice is safe after the first removal."]
    ),
    p(
      "Report keys outside a rejected band",
      "root, low, high",
      "A distinct-key BST and inclusive integer band low <= high.",
      "Return the sorted keys strictly outside [low,high]. Do not modify the tree.",
      `
def solve(root,low,high):
    result=[]
    def visit(node):
        if node is None:return
        visit(node['left'])
        if not low<=node['value']<=high:result.append(node['value'])
        visit(node['right'])
    visit(root)
    return result`,
      [t([node(3, node(1), node(5)), 2, 4], [1, 5]), t([null, 0, 1], []), t([node(2), 2, 2], [])],
      "Inorder keeps sorted output, while the band decides which keys are retained.",
      ["Separate traversal order from inclusion rules.", "Inclusive rejection means equality at either boundary is removed."]
    )
  ),
  unit(
    76,
    "AVL trees: repair height with rotations",
    [75, 47, 67],
    "Rotate a short local structure while preserving the entire search-tree order.",
    [
      "A plain BST built from sorted arrivals becomes a chain. Its correct search rule then takes linear time. An AVL tree additionally requires the left and right child heights of every node to differ by at most one.",
      "Insert as in a BST, then recompute heights on the return path. If a node becomes too left-heavy, inspect whether the new value entered its left child’s left branch or right branch. A left-left shape needs one right rotation; a left-right shape needs a left rotation of the child followed by a right rotation.",
      "A rotation changes who is the local root, but transfers the middle subtree to the only position satisfying its value bounds. The inorder sequence stays unchanged. The right-heavy cases are mirror images. Update the old lower root’s height before updating its new parent.",
      "For AVL height h, the fewest possible nodes obey a Fibonacci-like recurrence because child heights must be at least h-1 and h-2. That forces logarithmic height. Balanced search, insertion, and deletion are therefore logarithmic, though this exercise implements insertion only; deletion has additional repair cases.",
    ],
    [
      [
        "Insert 3 then 2.",
        [
          ["Shape", "3 → left 2"],
          ["Heights", "2 and 1"],
        ],
      ],
      [
        "Insert 1 below 2.",
        [
          ["Shape", "3 → left 2 → left 1"],
          ["Root balance", "2: too left-heavy"],
        ],
      ],
      [
        "Rotate right around 3; move 2 up.",
        [
          ["New local root", "2"],
          ["Children", "1 and 3"],
        ],
      ],
      [
        "Recompute heights from lower nodes upward.",
        [
          ["Child heights", "1 and 1"],
          ["Root height", "2"],
        ],
      ],
    ],
    "A rotation must reconnect the middle subtree and return its new root. A generic swap of node values is not a rotation.",
    q(
      "In a left-right imbalance, why is a single right rotation insufficient?",
      [
        "The heavy child leans toward the middle; rotate that child first",
        "The search-tree ordering must be abandoned",
        "Every insertion requires exactly two rotations",
      ],
      0,
      "The first rotation converts the zigzag into a left-left shape that a second rotation can repair."
    ),
    q(
      "What property remains unchanged by a correctly wired search-tree rotation?",
      ["The inorder key sequence", "Every node’s old depth", "The identity of the root"],
      0,
      "The transferred middle subtree stays between the same bounding keys, preserving sorted inorder order."
    ),
    [
      "Each insertion follows a logarithmic path and performs bounded local repair work.",
      "The tree stores one node and cached height per distinct key; recursive insertion uses logarithmic stack space.",
      "O(n log n) time to build n keys and O(n) storage, plus O(log n) stack.",
    ],
    [
      ["Balance factor", "Left child height minus right child height."],
      ["Rotation", "A local rewiring preserving inorder key order."],
    ],
    avl,
    p(
      "Measure the balanced result",
      "values",
      "Integer keys in insertion order; duplicates are ignored.",
      "Return the height in nodes of the AVL tree built by standard insertion rotations.",
      using(
        avl,
        `def solve(values):
    def height(node):return 0 if node is None else 1+max(height(node['left']),height(node['right']))
    return height(base(values))`
      ),
      [t([[1, 2, 3]], 2), t([[]], 0), t([[2, 2]], 1)],
      "Three increasing arrivals rotate into a height-2 tree instead of a height-3 chain.",
      ["Build the same AVL structure, then measure it.", "Empty height is zero, so a leaf height is one."]
    ),
    p(
      "Check both promises at once",
      "root",
      "A binary tree with integer value/left/right nodes, possibly empty or invalid as a BST.",
      "Return True exactly when keys satisfy strict BST ancestor bounds and every node has AVL height balance.",
      `
def solve(root):
    def check(node,low,high):
        if node is None:return 0
        value=node['value']
        if not low<value<high:return -1
        left=check(node['left'],low,value)
        right=check(node['right'],value,high)
        if left<0 or right<0 or abs(left-right)>1:return -1
        return 1+max(left,right)
    return check(root,float('-inf'),float('inf'))>=0`,
      [t([node(2, node(1), node(3))], true), t([node(2, node(3), node(4))], false), t([null], true)],
      "The root 2 has smaller left key 1 and larger right key 3. Both children have height 1, so the root is balanced and the whole tree satisfies both promises; return True.",
      ["Return height and failure information together.", "Ancestor bounds must propagate; comparing only parents and children is too weak."]
    )
  ),
  unit(
    77,
    "Augment a tree: sizes turn search into selection",
    [76, 66],
    "Store a summary that lets you skip a whole subtree while preserving a precise rank.",
    [
      "A BST answers membership quickly when it is short, but ordinary nodes do not say how many values lie on either side. To find the kth key without visiting all earlier keys, add a subtree-size summary.",
      "Each node’s size is 1 plus its left and right sizes. If the left size is L, the root occupies zero-based rank L. Smaller ranks go left unchanged; larger ranks go right after subtracting L+1.",
      "For root 4 with left keys [1,2,3], a request for rank 2 stays left. If instead the request were rank 4, the right subtree would receive rank 0. An invariant says the new local rank refers to the same original key after discarded positions are accounted for.",
      "Queries cost O(h) once the metadata exists. This exercise first builds metadata in O(n), so a single whole call is not magically logarithmic. Dynamic insertion, deletion, and rotations must also update sizes, otherwise later queries can silently choose the wrong branch.",
    ],
    [
      [
        "Compute child summaries before their parent.",
        [
          ["Root", "4"],
          ["Left keys", "[1,2,3]"],
          ["Left size", "3"],
        ],
      ],
      ["Request ascending rank 2.", [["Comparison", "2 < 3 → left"]]],
      ["At key 2, its left size is 1.", [["Local rank", "2 > 1 → right rank 0"]]],
      [
        "The right child is key 3 with empty left subtree.",
        [
          ["Local rank", "0"],
          ["Answer", "3"],
        ],
      ],
    ],
    "Cached sizes must be repaired after every structural change. Count preprocessing separately from query work.",
    q(
      "At a node with left size 3, what local right-subtree rank corresponds to original rank 5?",
      ["1", "2", "5"],
      0,
      "Three left keys and the root account for four earlier positions, leaving rank 5-4=1."
    ),
    q(
      "Why is a single query on an unannotated tree O(n+h) in this exercise?",
      [
        "It first visits n nodes to build sizes, then follows a height-h query path",
        "All balanced trees are always linear to search",
        "Metadata can be assumed free",
      ],
      0,
      "The metadata is useful only after its construction cost has been paid or maintained by prior updates."
    ),
    [
      "One preparation traversal builds sizes, then each rank question follows one tree path.",
      "The prepared copy holds n nodes and recursion follows the tree height.",
      "One call O(n+h) time/O(n+h) space; prepared queries O(h), logarithmic on balanced trees.",
    ],
    [
      ["Augmentation", "An extra summary stored alongside the original structure."],
      ["Subtree size", "The number of nodes at or below a particular node."],
    ],
    order,
    p(
      "Count smaller keys",
      "root, target",
      "A distinct-key BST and an integer target, which may be absent.",
      "Using prepared subtree sizes, return how many keys are strictly smaller than target.",
      orderPrelude +
        `
def solve(root,target):
    node=prepare(root)
    total=0
    while node:
        if target<=node['value']:node=node['left']
        else:
            total+=size(node['left'])+1
            node=node['right']
    return total`,
      [t([node(4, node(2), node(6)), 5], 2), t([null, 1], 0), t([node(1), 1], 0)],
      "Keys 2 and 4 are smaller than 5 even though 5 is absent.",
      ["A rightward move can count the entire left subtree and the current node.", "Equality must go left because the count is strict."]
    ),
    p(
      "Answer a batch of rank requests",
      "root, ranks",
      "A distinct-key BST and integer ranks; invalid ranks are allowed.",
      "Prepare subtree sizes once and return the selected value for each rank, using None for invalid requests.",
      orderPrelude +
        `
def solve(root,ranks):
    prepared=prepare(root)
    return [choose(prepared,k) for k in ranks]`,
      [t([node(2, node(1), node(3)), [2, 0, 3]], [3, 1, null]), t([null, [0]], [null]), t([node(1), []], [])],
      "Preparing once lets several requests share the same summaries.",
      ["Do not rebuild the metadata for every rank.", "Keep each query’s local rank separate from other queries."]
    )
  ),
  unit(
    78,
    "Lowest common ancestors: compare two paths",
    [15, 67],
    "The last shared position on two root paths is their deepest common ancestor.",
    [
      "A folder tree can tell us where two files’ histories last share a directory. In a general binary tree, values do not indicate which branch contains a target, so ordinary BST comparisons are not available.",
      "Find the path from the root to each target. If either path is missing, no answer exists under this contract. The paths have a shared beginning and then diverge; once they diverge they cannot meet again in a tree.",
      "The final node in that shared beginning is the lowest common ancestor. A target can be its own ancestor, so asking about the same node twice should return that node when present. Do not discard that boundary case.",
      "Path comparison is easy to inspect. A postorder method can combine target-presence information in one traversal, and many-query settings can preprocess parent jumps or Euler tours. Choose the method based on whether this is one question or a long query sequence, and state whether targets are guaranteed to exist.",
    ],
    [
      ["Find ancestors of values 1 and 3.", [["Tree", "4 → left 2 → children 1,3"]]],
      [
        "Read the two root paths.",
        [
          ["Path to 1", "[4,2,1]"],
          ["Path to 3", "[4,2,3]"],
        ],
      ],
      [
        "Compare the shared beginning.",
        [
          ["Shared", "4, then 2"],
          ["Divergence", "1 versus 3"],
        ],
      ],
      ["Return the last common value.", [["Answer", "2"]]],
    ],
    "A routine that returns the one found target without checking the other may report an ancestor when one target is absent.",
    q(
      "If both requested targets are the same existing node, what is their lowest common ancestor?",
      ["That node itself", "Always the root", "No ancestor exists"],
      0,
      "The ancestor relation includes the node itself, so its root path is identical to itself."
    ),
    q(
      "Why must arbitrary-tree LCA not choose a branch by comparing target values?",
      ["An arbitrary binary tree has no BST value-order promise", "Tree values can never be compared", "LCA always requires a heap"],
      0,
      "Branch choice based on numeric order is justified only when the tree contract supplies search-tree ordering."
    ),
    [
      "Find two root paths, then compare them. List concatenation in this simple implementation can add up along deep paths.",
      "The two paths and recursive traversal state follow tree height.",
      "O(nh) time in the shown copying-path version, O(h) peak space; an append/pop path search can achieve O(n) time.",
    ],
    [
      ["Ancestor", "A node on the root-to-node path, including the node itself."],
      ["Lowest", "Deepest from the root among the shared ancestors."],
    ],
    lca,
    p(
      "Distance inside the hierarchy",
      "root, a, b",
      "A binary tree of distinct integer values and two targets.",
      "Return the edge distance between the targets, or -1 when either target is absent.",
      `
def solve(root,a,b):
    def path(node,target):
        if node is None:return []
        if node['value']==target:return [node['value']]
        for side in ('left','right'):
            rest=path(node[side],target)
            if rest:return [node['value']]+rest
        return []
    first,second=path(root,a),path(root,b)
    if not first or not second:return -1
    shared=0
    for x,y in zip(first,second):
        if x!=y:break
        shared+=1
    return len(first)+len(second)-2*shared`,
      [t([node(2, node(1), node(3)), 1, 3], 2), t([node(1), 1, 1], 0), t([null, 1, 2], -1)],
      "Travel one edge up from 1 to 2 and one down to 3.",
      ["Remove the common prefix lengths from both paths.", "Count edges after the common ancestor rather than counting that ancestor twice."]
    ),
    p(
      "A shared folder for several targets",
      "root, targets",
      "A distinct-valued binary tree and a list of target values, possibly empty.",
      "Return the lowest common ancestor value of all targets, or None for no targets or any missing target.",
      using(
        lca,
        `def solve(root,targets):
    if not targets:return None
    answer=targets[0]
    if base(root,answer,answer) is None:return None
    for target in targets[1:]:
        answer=base(root,answer,target)
        if answer is None:return None
    return answer`
      ),
      [t([node(4, node(2, node(1), node(3)), node(6)), [1, 3, 6]], 4), t([node(1), []], null), t([node(1), [1, 8]], null)],
      "The common ancestor of 1 and 3 is 2; adding 6 moves the shared ancestor up to 4.",
      ["Combine LCA answers incrementally.", "Validate a single target too; otherwise an absent one-item request could slip through."]
    )
  ),
  unit(
    79,
    "Segment trees: compose range summaries",
    [57, 77],
    "Store summaries of disjoint intervals so a query can reuse only the pieces it needs.",
    [
      "Prefix sums are excellent while values stay fixed. A Fenwick tree handles additive updates and prefix totals well. A segment tree makes the interval-combination idea explicit and also works for summaries such as minimum, where subtraction cannot undo a prefix.",
      "Place input values at leaves. Each parent summarizes its two child intervals: for sums, add them. A point assignment changes one leaf and only the ancestors containing that leaf, so other branches remain valid.",
      "A range query chooses a disjoint collection of tree intervals whose union is exactly the requested range. Add those stored summaries. In the iterative representation, convert inclusive [left,right] to half-open [left,right+1), then include boundary nodes before moving upward.",
      "Combining summaries must be associative, and unused pieces need an identity value such as 0 for sum or infinity for minimum. The operation need not have an inverse. Building the tree takes linear work; point edits and range queries need logarithmically many nodes.",
    ],
    [
      [
        "Build summaries for [2,1,3,4].",
        [
          ["Leaves", "2,1,3,4"],
          ["Pair sums", "3 and 7"],
          ["Root sum", "10"],
        ],
      ],
      [
        "Query positions 1 through 3.",
        [
          ["Disjoint pieces", "[1,1] and [2,3]"],
          ["Sum", "1+7 = 8"],
        ],
      ],
      [
        "Assign position 2 to 8.",
        [
          ["Changed leaf", "3 → 8"],
          ["Repaired right pair / root", "12 / 15"],
        ],
      ],
      ["Repeat the same range query.", [["Sum", "1+12 = 13"]]],
    ],
    "Assignments replace a value; they are not increments. Mixing inclusive input ranges with half-open internal ranges causes off-by-one errors.",
    q(
      "Why can a segment tree answer range minima even though prefix subtraction cannot?",
      [
        "Its query combines disjoint interval summaries without needing an inverse",
        "Minimum has the same inverse as addition",
        "It sorts each range before querying",
      ],
      0,
      "Associative composition over a disjoint cover is enough; unlike prefix differences, it does not require undoing a previous summary."
    ),
    q(
      "Which summaries need repair after assigning one leaf?",
      ["Only that leaf and its ancestors", "Every node in the tree", "Only the root, regardless of intermediate nodes"],
      0,
      "An interval summary changes exactly when its represented interval contains the edited position."
    ),
    [
      "Build all summaries once, then follow logarithmic ancestor/query paths for each operation.",
      "The next power-of-two leaf capacity is below twice the nonempty input size, so storage remains linear.",
      "O(n + q log n) time and O(n) extra space for q operations.",
    ],
    [
      ["Associative", "Grouping combinations differently does not change the result."],
      ["Identity", "A neutral summary, such as 0 for addition."],
    ],
    segment,
    p(
      "Changing range minima",
      "items, operations",
      'Integers with valid ["set",index,value] and ["min",left,right] operations; ranges are inclusive and nonempty.',
      "Return each range minimum using a segment tree.",
      segmentCode
        .replaceAll("tree=[0]", "tree=[float('inf')]")
        .replaceAll("tree[2*i]+tree[2*i+1]", "min(tree[2*i],tree[2*i+1])")
        .replace("total=0", "total=float('inf')")
        .replace("total+=tree[left]", "total=min(total,tree[left])")
        .replace("total+=tree[right]", "total=min(total,tree[right])"),
      [
        t(
          [
            [2, 1, 3],
            [
              ["min", 0, 2],
              ["set", 1, 9],
              ["min", 0, 2],
            ],
          ],
          [1, 2]
        ),
        t([[], []], []),
        t([[-2], [["min", 0, 0]]], [-2]),
      ],
      "Replacing the only 1 by 9 raises the whole-range minimum to 2.",
      ["Use infinity as the neutral summary.", "Every parent and query combination must use min; changing only the root operation is insufficient."]
    ),
    p(
      "Find the first capacity boundary",
      "items, operations",
      'Nonnegative integers with valid assignments ["set",index,value] and queries ["first",positive_target].',
      "For each first query, return the first index whose inclusive prefix sum reaches target, or -1 if the total is too small. Use a sum tree to descend directly.",
      `
def solve(items,operations):
    size=1
    while size<len(items):size*=2
    tree=[0]*(2*size)
    tree[size:size+len(items)]=items
    for i in range(size-1,0,-1):tree[i]=tree[2*i]+tree[2*i+1]
    result=[]
    for op in operations:
        if op[0]=='set':
            i=size+op[1];tree[i]=op[2];i//=2
            while i:tree[i]=tree[2*i]+tree[2*i+1];i//=2
        else:
            target=op[1]
            if tree[1]<target:result.append(-1);continue
            i=1
            while i<size:
                if tree[2*i]>=target:i*=2
                else:target-=tree[2*i];i=2*i+1
            result.append(i-size)
    return result`,
      [
        t(
          [
            [2, 0, 3],
            [
              ["first", 3],
              ["set", 0, 4],
              ["first", 3],
            ],
          ],
          [2, 0]
        ),
        t([[], [["first", 1]]], [-1]),
        t([[0], [["first", 1]]], [-1]),
      ],
      "The first prefix reaching 3 is initially at index 2; raising the first value to 4 moves it to index 0.",
      ["Nonnegative values make prefix sums monotone.", "Compare target with the left-child sum, subtracting that sum only when descending right."]
    )
  ),
];
