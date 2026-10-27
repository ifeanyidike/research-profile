import advanced_oracles as _advanced
import expansion_oracles as _expansion
"""Independent small-input specifications, not copies of the worked algorithms."""
import bisect
import collections
import copy
import functools
import itertools
import json
import math
import random
import sys


def linked(values):
    head = None
    for value in reversed(values):
        head = {'value': value, 'next': head}
    return head


def unlinked(head):
    values = []
    while head is not None:
        values.append(head['value'])
        head = head['next']
    return values


def tree_values(root, mode='in', depth=0):
    if root is None:
        return []
    left = tree_values(root['left'], mode, depth+1)
    right = tree_values(root['right'], mode, depth+1)
    current = [(depth, root['value'])] if mode == 'level' else [root['value']]
    return current+left+right if mode in ('pre', 'level') else left+current+right


def bst(values):
    if not values:
        return None
    value, *rest = values
    return {'value': value, 'left': bst([v for v in rest if v < value]),
            'right': bst([v for v in rest if v > value])}


def height(root):
    return max((d+1 for d, _ in tree_values(root, 'level')), default=0)


def flattened(value):
    if isinstance(value, int):
        return [value]
    return list(itertools.chain.from_iterable(map(flattened, value)))


def subsets(items):
    return [list(c) for size in range(len(items)+1) for c in itertools.combinations(items, size)]


def reach(n, edges):
    # Transitive closure gives connectivity independently of union-find/traversal.
    matrix = [[a == b for b in range(n)] for a in range(n)]
    for a, b in edges:
        matrix[a][b] = matrix[b][a] = True
    for k in range(n):
        for a in range(n):
            for b in range(n):
                matrix[a][b] |= matrix[a][k] and matrix[k][b]
    return matrix


def components(n, edges):
    matrix = reach(n, edges)
    return len({tuple(row) for row in matrix})


def first_cycle(n, edges):
    for i, (a, b) in enumerate(edges):
        if reach(n, edges[:i])[a][b]:
            return i
    return -1


def paths(graph, start, goal, blocked=()):
    if start in blocked or goal in blocked:
        return []
    candidates = []
    def visit(path):
        if path[-1] == goal:
            candidates.append(path)
        else:
            for node in graph.get(path[-1], []):
                if node not in path and node not in blocked:
                    visit(path+[node])
    visit([start])
    return min(candidates, key=len, default=[])


def distances(n, edges, start):
    # Floyd-Warshall differs from both production Dijkstra and Bellman-Ford.
    matrix = [[0 if a == b else math.inf for b in range(n)] for a in range(n)]
    for a, b, weight in edges:
        matrix[a][b] = min(matrix[a][b], weight)
    for k in range(n):
        for a in range(n):
            for b in range(n):
                matrix[a][b] = min(matrix[a][b], matrix[a][k]+matrix[k][b])
    if any(matrix[start][k] < math.inf and matrix[k][k] < 0 for k in range(n)):
        return []
    return [None if d == math.inf else d for d in matrix[start]]


def named_distances(graph, start):
    nodes = sorted({start, *graph, *(v for row in graph.values() for v, _ in row)})
    index = {v: i for i, v in enumerate(nodes)}
    values = distances(len(nodes), [(index[a], index[b], w) for a in graph for b, w in graph[a]], index[start])
    return {v: values[i] for i, v in enumerate(nodes) if values[i] is not None}


def forest(n, edges):
    # Enumerate possible spanning forests, allowing disconnected inputs/negative edges.
    count = components(n, [(a, b) for a, b, _ in edges])
    candidates = []
    for selected in itertools.combinations(edges, n-count):
        if components(n, [(a, b) for a, b, _ in selected]) == count:
            candidates.append(sum(w for _, _, w in selected))
    return min(candidates, default=0)


def job_order(n, edges):
    return next((list(p) for p in itertools.permutations(range(n))
                 if all(p.index(a) < p.index(b) for a, b in edges)), [])


def job_rounds(n, edges):
    if n and not job_order(n, edges):
        return -1
    def depth(v):
        return 1+max((depth(a) for a, b in edges if b == v), default=0)
    return max(map(depth, range(n)), default=0)


def compatible(intervals):
    return max((len(s) for s in subsets(intervals)
                if all(a[1] <= b[0] or b[1] <= a[0] for a, b in itertools.combinations(s, 2))), default=0)


def merged(intervals):
    # Repeatedly union any overlapping pair; no production sorted sweep.
    result = copy.deepcopy(intervals)
    while True:
        pair = next(((i, j) for i in range(len(result)) for j in range(i+1, len(result))
                     if max(result[i][0], result[j][0]) <= min(result[i][1], result[j][1])), None)
        if pair is None:
            return sorted(result)
        i, j = pair
        result[i] = [min(result[i][0], result[j][0]), max(result[i][1], result[j][1])]
        result.pop(j)


def kit(weights, values, capacity, indices=False):
    choices = [s for s in subsets(list(range(len(weights)))) if sum(weights[i] for i in s) <= capacity]
    # Lowest numeric inclusion mask skips the highest differing item on ties.
    best = min(choices, key=lambda s: (-sum(values[i] for i in s), sum(1 << i for i in s)))
    return best if indices else sum(values[i] for i in best)


def ways(n, moves):
    @functools.cache
    def count(left):
        return 1 if left == 0 else sum(count(left-m) for m in moves if m <= left)
    return count(n)


def min_coins(coins, amount):
    frontier, visited = {0}, {0}
    for depth in range(amount+1):
        if amount in frontier:
            return depth
        frontier = {value+c for value in frontier for c in coins if value+c <= amount and value+c not in visited}
        visited |= frontier
    return -1


def coin_combinations(coins, amount):
    return sum(sum(c*n for c, n in zip(coins, counts)) == amount
               for counts in itertools.product(*(range(amount//c+1) for c in coins)))


def grid_paths(grid):
    if not grid or not grid[0]:
        return 0
    def count(r, c):
        if r == len(grid) or c == len(grid[0]) or grid[r][c]:
            return 0
        return 1 if (r, c) == (len(grid)-1, len(grid[0])-1) else count(r+1, c)+count(r, c+1)
    return count(0, 0)


def cycle_entry(links, start):
    visited = set()
    while start is not None and start not in visited:
        visited.add(start)
        start = links[start]
    return start


def oracle(group, i, args):
    if i >= 66: return _advanced.oracle(group, i, args)
    if _expansion.handles(group, i): return _expansion.oracle(group, i, args)
    a = args[0]
    if group == 'lesson':
        if i == 0: return a.index(args[1]) if args[1] in a else -1
        if i == 1: return sum(a)
        if i == 2: return max(a, default=None)
        if i == 3: return a == a[::-1]
        if i == 4: return max((sum(a[j:j+args[1]]) for j in range(len(a)-args[1]+1)), default=None) if 0 < args[1] <= len(a) else None
        if i == 5: return [sum(a[l:r+1]) for l, r in args[1]]
        if i == 6: return a.index(args[1]) if args[1] in a else -1
        if i in (7, 24, 25): return sorted(a)
        if i == 8: return sorted(a+args[1])
        if i == 9: return brackets(a)
        if i == 10: return queue(a)
        if i == 11: return unlinked(a)
        if i == 12: return dict(collections.Counter(a))
        if i == 13:
            for j, value in enumerate(a):
                earlier = [k for k in range(j) if a[k]+value == args[1]]
                if earlier: return [earlier[-1], j]
            return []
        if i == 14: return math.factorial(a)
        if i == 15: return tree_values(a)
        if i == 16: return args[1] in tree_values(a)
        if i == 17: return sorted(a)[:args[1]]
        if i == 18:
            path = paths(*args)
            return len(path)-1 if path else -1
        if i == 19: return sorted(v for v in {args[1], *a, *(v for row in a.values() for v in row)} if paths(a, args[1], v))
        if i == 20: return compatible(a)
        if i in (21, 48): return ways(a, (1, 2))
        if i == 22: return min_coins(*args)
        if i == 23: return paths(*args)
        if i == 26: return sorted(subsets(a))
        if i == 27: return [p == '' or any(w.startswith(p) for w in a) for p in args[1]]
        if i == 28: return components(*args)
        if i == 29: return first_cycle(*args) >= 0
        if i == 30: return named_distances(a, args[1]).get(args[2], -1)
        if i == 31: return job_order(*args)
        if i == 32: return forest(*args) if components(a, [(x, y) for x, y, _ in args[1]]) <= 1 else -1
        if i == 33:
            candidates = {''.join(s) for s in subsets(list(a))} & {''.join(s) for s in subsets(list(args[1]))}
            return max(map(len, candidates))
        if i == 34: return max((len(s) for s in subsets(a) if all(x < y for x, y in zip(s, s[1:]))), default=0)
        if i in (35, 50): return kit(*args)
        if i == 36: return a+[args[1]]
        if i == 37: return len(set(a))
        if i == 38: return a.bit_length()-1
        if i == 39: return sum(flattened(a))
        if i == 40: return [[b for x, b in args[1] if x == v] for v in range(a)]
        if i == 41:
            result = a+[args[1]]
            j = len(result)-1
            ancestors = []
            while j:
                j = (j-1)//2
                ancestors.append(j)
            # Replace the ancestor path with its ordered values, preserving other branches.
            positions = list(reversed(ancestors))+[len(result)-1]
            for j, value in zip(positions, sorted(result[j] for j in positions)): result[j] = value
            return result
        if i == 42: return min((r-l for l in range(len(a)) for r in range(l+1, len(a)+1) if sum(a[l:r]) >= args[1]), default=0)
        if i == 43: return max((r-l for l in range(len(a)+1) for r in range(l, len(a)+1) if len(set(a[l:r])) == r-l), default=0)
        if i == 44: return linked(unlinked(a)[::-1])
        if i == 45: return bisect.bisect_left(*args)
        if i == 46: return bst(tree_values(a, 'pre')+[args[1]])
        if i == 47: return height(a)
        if i == 49: return math.comb(a+args[1]-2, a-1) if a and args[1] else 0
        if i == 51: return [next((v for v in a[j+1:] if v > x), None) for j, x in enumerate(a)]
        if i == 52: return merged(a)
        if i == 53: return next(v for v in a if a.count(v) == 1)
        if i == 54: return [[v for j, v in enumerate(a) if v % args[1] == bucket and v not in a[:j]] for bucket in range(args[1])]
        if i == 55: return cycle_entry(*args) is not None
        if i == 56: return distances(*args)
        if i == 57: return fenwick_direct(*args)
        if i == 58: return a.find(args[1])
        if i == 59: return math.gcd(*args)
    if group == 'check':
        if i == 0: return a.count(args[1])
        if i == 1: return math.prod(a)
        if i == 2: return [min(a), max(a)] if a else []
        if i == 3: return sorted(set(a) & set(args[1]))
        if i == 4: return next((j for j in range(len(a)-args[1]+1) if sum(a[j:j+args[1]]) >= args[2]), -1) if 0 < args[1] <= len(a) else -1
        if i == 5: return sum(sum(a[l:r+1]) >= args[2] for l, r in args[1])
        if i == 6: return args[1] in a
        if i == 7: return sorted(a, reverse=True)
        if i == 8: return sorted(set(a+args[1]))
        if i == 9: return brackets(a)
        if i == 10: return queue(*args)
        if i == 11: return next(iter(unlinked(a)[args[1]:args[1]+1]), None)
        if i == 12: return next((w for w in a if a.count(w) == 1), None)
        if i == 13: return any(x+y == args[1] for x, y in itertools.combinations(a, 2))
        if i == 14: return a**args[1]
        if i == 15: return tree_values(a, 'pre')
        if i == 16: return sum(v for v in tree_values(a) if args[1] <= v <= args[2])
        if i == 17: return sorted(a, reverse=True)[:args[1]]
        if i == 18:
            weighted = {v: [(w, 1) for w in row] for v, row in a.items()}
            return named_distances(weighted, args[1])
        if i == 19: return components(*args)
        if i == 20: return len(a)-compatible(a)
        if i == 21: return ways(a, (1, 2, 3))
        if i == 22: return coin_combinations(*args)
        if i == 23: return paths(*args)
        if i == 24: return sum(x > y for x, y in itertools.combinations(a, 2))
        if i == 25: return sorted(a)[args[1]]
        if i == 26: return sorted(sorted(c) for c in itertools.combinations(a, args[1]))
        if i == 27: return [w in a for w in args[1]]
        if i == 28: return [reach(a, args[1])[x][y] for x, y in args[2]]
        if i == 29: return first_cycle(*args)
        if i == 30: return named_distances(*args)
        if i == 31: return job_rounds(*args)
        if i == 32: return forest(*args)
        if i == 33:
            @functools.cache
            def edit(x, y):
                if not x or not y: return len(x)+len(y)
                if x[0] == y[0]: return edit(x[1:], y[1:])
                return 1+min(edit(x[1:], y), edit(x, y[1:]), edit(x[1:], y[1:]))
            return edit(*args)
        if i == 34: return max((len(s) for s in subsets(a) if all(x > y for x, y in zip(s, s[1:]))), default=0)
        if i == 35: return any(sum(s) == args[1] for s in subsets(a))
        if i == 36: return [2*v for v in a]
        if i == 37: return len(set(a) & set(args[1]))
        if i == 38: return sum(1 << k for k in range(a.bit_length()) if 1 << k < a)
        if i == 39: return flattened(a)
        if i == 40: return undirected(*args)
        if i == 41: return all(a[p] <= a[c] for p in range(len(a)) for c in (2*p+1, 2*p+2) if c < len(a))
        if i == 42: return max((r-l for l in range(len(a)+1) for r in range(l, len(a)+1) if sum(a[l:r]) <= args[1]), default=0)
        if i == 43: return max((r-l for l in range(len(a)+1) for r in range(l, len(a)+1) if len(set(a[l:r])) <= args[1]), default=0)
        if i == 44: return linked([v for v in unlinked(a) if v != args[1]])
        if i == 45: return a.count(args[1])
        if i == 46:
            values = tree_values(a)
            return all(x < y for x, y in zip(values, values[1:]))
        if i == 47:
            values = tree_values(a, 'level')
            return [sum(v for depth, v in values if depth == d) for d in range(height(a))]
        if i == 48:
            def costs(i): return [0] if i >= len(a) else [a[i]+v for step in (1, 2) for v in costs(i+step)]
            return min(costs(0)+costs(1))
        if i == 49: return grid_paths(a)
        if i == 50: return kit(*args, indices=True)
        if i == 51: return [j-next((k for k in range(j-1, -1, -1) if a[k] > v), -1) for j, v in enumerate(a)]
        if i == 52: return merged(a+[args[1]])
        if i == 53: return a.bit_count()
        if i == 54:
            stored, out = {}, []
            for op in a:
                if op[0] == 'put': stored[op[1]] = op[2]
                else: out.append(stored.get(op[1]))
            return out
        if i == 55: return cycle_entry(*args)
        if i == 56: return distances(*args) == []
        if i == 57: return fenwick_direct(*args)
        if i == 58: return [j for j in range(len(a)) if a.startswith(args[1], j)]
        if i == 59: return math.lcm(*args)
    if group == 'transfer':
        if i == 0: return max((j for j, v in enumerate(a) if v < args[1]), default=-1)
        if i == 12: return min(set(a), key=lambda v: (-a.count(v), v)) if a else None
        if i == 13: return sum(x+y == args[1] for x, y in itertools.combinations(a, 2))
        if i == 17: return sorted(itertools.chain.from_iterable(a))
        if i == 18:
            if not a or not a[0] or a[0][0] or a[-1][-1]: return -1
            rows, cols = len(a), len(a[0])
            dist = {(0, 0): 0}
            for _ in range(rows*cols):
                old = dict(dist)
                for r in range(rows):
                    for c in range(cols):
                        if not a[r][c]:
                            candidates = [old[p]+1 for p in ((r-1,c),(r+1,c),(r,c-1),(r,c+1)) if p in old]
                            if candidates: dist[r,c] = min(dist.get((r,c), math.inf), *candidates)
            return dist.get((rows-1,cols-1), -1)
        if i == 27: return sorted({w for w in a if w.startswith(args[1])})
        if i == 43: return sum(len(set(a[j:j+args[1]])) == args[1] for j in range(len(a)-args[1]+1)) if 0 < args[1] <= len(a) else 0
        if i == 45: return [sum(low <= v <= high for v in a) for low, high in args[1]]
        if i == 47: return a is None or (abs(height(a['left'])-height(a['right'])) <= 1 and oracle(group, i, [a['left']]) and oracle(group, i, [a['right']]))
        if i == 50: return sum(sum(s) == args[1] for s in subsets(a))
        if i == 51: return [next((k-j for k in range(j+1, len(a)) if a[k] > v), 0) for j, v in enumerate(a)]
        if i == 59: return sum(math.gcd(x, y) == 1 for x, y in itertools.combinations(a, 2))
    raise AssertionError(('Missing oracle', group, i))


def brackets(text):
    while any(p in text for p in ('()', '[]', '{}')):
        for pair in ('()', '[]', '{}'): text = text.replace(pair, '')
    return text == ''


def queue(operations, capacity=math.inf):
    pending, out = [], []
    for op in operations:
        if op[0] == 'add':
            if len(pending) < capacity: pending.append(op[1])
        else: out.append(pending.pop(0) if pending else None)
    return out


def undirected(n, edges):
    result = [[] for _ in range(n)]
    for a, b in edges:
        for source, target in ((a, b), (b, a)): result[source].append(target)
    return result


def fenwick_direct(items, operations):
    items = items[:]
    result = []
    for op in operations:
        if op[0] == 'add': items[op[1]] += op[2]
        elif op[0] == 'prefix': result.append(sum(items[:op[1]]))
        else: result.append(sum(items[op[1]:op[2]+1]))
    return result


def generated(group, i, rng):
    if i >= 66: return _advanced.generated(group, i, rng)
    if _expansion.handles(group, i): return _expansion.generated(group, i, rng)
    a = [rng.randrange(-3, 4) for _ in range(rng.randrange(7))]
    value = rng.randrange(-4, 5)
    text = ''.join(rng.choices('abA', k=rng.randrange(7)))
    words = rng.choices(['', 'a', 'ab', 'b', 'A'], k=rng.randrange(7))
    n = rng.randrange(5)
    edges = [(rng.randrange(n), rng.randrange(n)) for _ in range(rng.randrange(7))] if n else []
    weighted = [(x, y, rng.randrange(-3, 6)) for x, y in edges]
    root = bst(rng.sample(range(-8, 9), rng.randrange(7)))
    graph = {chr(65+j): rng.sample(list('ABCD'), rng.randrange(5)) for j in range(rng.randrange(5))}
    start, goal = rng.choice('ABCD'), rng.choice('ABCD')
    weights, values, capacity = [v+4 for v in a], [abs(v) for v in a], rng.randrange(9)
    intervals = [sorted(rng.sample(range(-4, 6), 2)) for _ in range(rng.randrange(6))]
    ranges = [sorted((rng.randrange(len(a)), rng.randrange(len(a)))) for _ in range(3)] if a else []
    if group == 'transfer':
        if i in (0, 13): return [a, value]
        if i == 12: return [words]
        if i == 17: return [[sorted(a[:2]), sorted(a[2:]), []]]
        if i == 18: return [[[rng.randrange(2) for _ in range(3)] for _ in range(n)]]
        if i == 27: return [[w.lower() for w in words], rng.choice(['', 'a', 'ab', 'z'])]
        if i == 43: return [text, rng.randrange(-1, 9)]
        if i == 45: return [sorted(a), [sorted((value, rng.randrange(-4, 5))) for _ in range(3)]]
        if i == 47: return [root]
        if i == 50: return [weights, capacity]
        if i == 51: return [a]
        if i == 59: return [[abs(v)+1 for v in a]]
    if i in (0, 6, 13, 45):
        if i in (6, 45): a = sorted(set(a)) if group == 'lesson' and i == 6 else sorted(a)
        return [a, value]
    if i in (1, 2, 7, 24, 34, 37, 51):
        return [a, [abs(v) for v in a]] if group == 'check' and i == 37 else [a]
    if i == 3: return [text] if group == 'lesson' else [sorted(a), sorted([value, *a[::2]])]
    if i == 4: return [a, rng.randrange(-1, 9)] + ([value] if group == 'check' else [])
    if i == 5: return [a, ranges]+([value] if group == 'check' else [])
    if i == 8: return [sorted(a), sorted([value, *a[::2]])]
    if i == 9: return [''.join(rng.choices('()' if group == 'lesson' else '()[]{}', k=rng.randrange(10)))]
    if i == 10: return [[['add', rng.randrange(5)] if rng.randrange(2) else ['take'] for _ in range(8)]]+([n] if group == 'check' else [])
    if i == 11: return [linked(a)]+([rng.randrange(9)] if group == 'check' else [])
    if i == 12: return [words]
    if i == 14: return [rng.randrange(16)] if group == 'lesson' else [value, rng.randrange(9)]
    if i in (15, 47): return [root]
    if i == 16: return [root, value]+([value+4] if group == 'check' else [])
    if i == 17: return [a, rng.randrange(len(a)+1)]
    if i in (18, 19, 23):
        if group == 'check' and i == 19: return [n, edges]
        return [graph, start]+([goal] if i in (18, 23) and (group == 'lesson' or i == 23) else [])+([rng.sample(list('ABCD'), n)] if group == 'check' and i == 23 else [])
    if i == 20: return [intervals]
    if i in (21, 48): return [[abs(v) for v in a]] if group == 'check' and i == 48 else [rng.randrange(16)]
    if i == 22: return [rng.sample([1, 2, 3, 4], rng.randrange(5)), rng.randrange(12)]
    if i == 25: return [a or [value], rng.randrange(len(a) or 1)] if group == 'check' else [a]
    if i == 26: return [list(dict.fromkeys(a))]+([rng.randrange(8)] if group == 'check' else [])
    if i == 27: return [[w.lower() for w in words], [rng.choice(['', 'a', 'ab', 'z']) for _ in range(3)]]
    if i in (28, 29, 31, 32, 40): return [n, weighted if i == 32 else edges]+([ranges_for(n, rng)] if i == 28 and group == 'check' else [])
    if i == 30:
        graph = {v: [[w, rng.randrange(6)] for w in row] for v, row in graph.items()}
        return [graph, start]+([goal] if group == 'lesson' else [])
    if i == 33: return [text[:5], ''.join(rng.choices('abA', k=rng.randrange(6)))]
    if i in (35, 50): return [weights, capacity] if group == 'check' and i == 35 else [weights, values, capacity]
    if i == 36: return [a]+([value] if group == 'lesson' else [])
    if i == 38: return [rng.randrange(1 if group == 'lesson' else 0, 257)]
    if i == 39: return [[a[:2], [a[2:], []], value]]
    if i == 41:
        import heapq
        if group == 'lesson': heapq.heapify(a)
        return [a]+([value] if group == 'lesson' else [])
    if i == 42: return [[abs(v)+(group == 'lesson') for v in a], rng.randrange(1 if group == 'lesson' else 0, 12)]
    if i == 43: return [text]+([rng.randrange(5)] if group == 'check' else [])
    if i == 44: return [linked(a)]+([value] if group == 'check' else [])
    if i == 46:
        if group == 'check' and root and root['left'] and rng.randrange(2): root['left']['value'] = root['value']+1
        return [root]+([value] if group == 'lesson' else [])
    if i == 49:
        return [n, rng.randrange(5)] if group == 'lesson' else [[[rng.randrange(2) for _ in range(3)] for _ in range(n)]]
    if i == 52: return [intervals] if group == 'lesson' else [merged(intervals), sorted((value, value+3))]
    if i == 53:
        if group == 'check': return [rng.randrange(4096)]
        pairs = rng.sample(range(-10, 10), n)
        single = next(v for v in range(-11, 12) if v not in pairs)
        result = pairs*2+[single]; rng.shuffle(result); return [result]
    if i == 54: return [a, rng.randrange(1, 5)] if group == 'lesson' else [[['put', v, value] if rng.randrange(2) else ['get', v] for v in a], rng.randrange(1, 5)]
    if i == 55: return [[rng.choice([None, *range(n)]) for _ in range(n)], rng.randrange(n) if n else None]
    if i == 56:
        n = max(n, 1); return [n, weighted, rng.randrange(n)]
    if i == 57:
        ops = [['prefix', rng.randrange(len(a)+1)]] if group == 'lesson' else [['range', *p] for p in ranges]
        if a:
            ops += [['add', 0, value]] + ([['prefix', len(a)]] if group == 'lesson' else [['range', 0, len(a)-1]])
        return [a, ops]
    if i == 58: return [text, rng.choice(['', 'a', 'aba', 'aa', 'A']) or ('a' if group == 'check' else '')]
    if i == 59: return [value, rng.randrange(-20, 21)]
    raise AssertionError(('Missing generator', group, i))


def ranges_for(n, rng):
    return [(rng.randrange(n), rng.randrange(n)) for _ in range(3)] if n else []


def exact(a, b):
    if type(a) is not type(b): return False
    if isinstance(a, list): return len(a) == len(b) and all(exact(x, y) for x, y in zip(a, b))
    if isinstance(a, dict): return a.keys() == b.keys() and all(exact(a[k], b[k]) for k in a)
    return a == b


def main():
    tasks = json.load(sys.stdin)
    rng = random.Random(56019)
    supplied = randomized = 0
    covered = []
    for task in tasks:
        group, i = task['group'], task['id']
        ns = {}; exec(task['solution'], ns)
        for case in task['tests']:
            expected = oracle(group, i, copy.deepcopy(case['args']))
            assert exact(expected, case['expected']), ('Expected-answer error', group, i, case, expected)
            actual = ns['solve'](*copy.deepcopy(case['args']))
            assert exact(actual, expected), ('Worked-solution error', group, i, case, actual, expected)
            supplied += 1
        for _ in range(100):
            args = generated(group, i, rng)
            expected = oracle(group, i, copy.deepcopy(args))
            original = copy.deepcopy(args)
            actual = ns['solve'](*args)
            assert exact(actual, expected), ('Counterexample', group, i, original, actual, expected)
            for j in task.get('unchangedArgs', []): assert exact(args[j], original[j]), (group, i, 'changed input')
            randomized += 1
        covered.append(f'{group}:{i}')
    print(json.dumps({'tasks': len(covered), 'supplied': supplied, 'generated': randomized, 'covered': covered}))


if __name__ == '__main__': main()
