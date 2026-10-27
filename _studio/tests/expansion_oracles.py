"""Offline specifications for the added exercises; no network or provider calls."""
import collections
import functools
import itertools
import math

TRANSFER_IDS = {1, 3, 4, 5, 6, 9, 14, 20, 22, 28, 30, 33}

def handles(group, i):
    return i >= 60 or group == 'transfer' and i in TRANSFER_IDS

def stretches(a):
    return [a[i:j] for i in range(len(a)) for j in range(i+1, len(a)+1)]

def oracle(group, i, args):
    a = args[0]
    if i == 60:
        candidates = stretches(a) if group == 'lesson' else [
            [a[(start+k) % len(a)] for k in range(length)]
            for start in range(len(a)) for length in range(1, len(a)+1)]
        return max(map(sum, candidates), default=None)
    if i == 61:
        if group == 'lesson': return sum(sum(s) == args[1] for s in stretches(a))
        return max((len(s) for s in stretches(a) if s.count(0) == s.count(1)), default=0)
    if i == 62:
        if not a: return 0
        if group == 'lesson':
            return next(speed for speed in range(1,max(a)+1) if sum(math.ceil(p / speed) for p in a) <= args[1])
        # Enumerate day cuts, independently of the binary-search/greedy implementation.
        return min(max(map(sum, groups)) for mask in range(1 << (len(a)-1))
                   if len(groups := split(a, mask)) <= args[1])
    if i == 63:
        colors = next((list(c) for c in itertools.product((0,1), repeat=a)
                       if all(c[x] != c[y] for x,y in args[1])), None)
        return colors is not None if group == 'lesson' else colors or []
    if i == 64:
        if group == 'lesson':
            sources = [(r,c) for r,row in enumerate(a) for c,v in enumerate(row) if v == 0]
            return [[min((abs(r-x)+abs(c-y) for x,y in sources), default=-1)
                     for c in range(len(row))] for r,row in enumerate(a)]
        # Synchronous whole-grid updates: sources created this minute spread next minute.
        grid = [row[:] for row in a]
        rows, cols = len(grid), len(grid[0]) if grid else 0
        minutes = 0
        while any(1 in row for row in grid):
            nxt = [row[:] for row in grid]
            for r in range(rows):
                for c in range(cols):
                    if grid[r][c] == 1 and any(0 <= x < rows and 0 <= y < cols and grid[x][y] == 2
                                              for x,y in ((r-1,c),(r+1,c),(r,c-1),(r,c+1))):
                        nxt[r][c] = 2
            if nxt == grid: return -1
            grid = nxt
            minutes += 1
        return minutes
    if i == 65:
        @functools.cache
        def edits(x,y):
            if not x: return len(y)
            if not y: return len(x)
            if x[0] == y[0]: return edits(x[1:],y[1:])
            choices = [edits(x[1:],y), edits(x,y[1:])]
            if group == 'lesson': choices.append(edits(x[1:],y[1:]))
            return 1 + min(choices)
        return edits(a,args[1])
    if i == 1: return [sum(a[:j]) for j in range(1,len(a)+1)]
    if i == 3:
        clean = ''.join(c.lower() for c in a if c in 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
        return clean == clean[::-1]
    if i == 4:
        k, threshold = args[1:]
        return sum(sum(a[j:j+k]) >= k*threshold for j in range(len(a)-k+1)) if 0 < k <= len(a) else 0
    if i == 5: return next((j for j in range(len(a)) if sum(a[:j]) == sum(a[j+1:])), -1)
    if i == 6: return next(x for x in range(len(a)+1) if x not in a)
    if i == 9:
        while True:
            index = next((j for j in range(len(a)-1) if a[j] == a[j+1]), None)
            if index is None: return a
            a = a[:index]+a[index+2:]
    if i == 14: return a ** args[1]
    if i == 20: return max((sum(start <= time < end for start,end in a) for time,_ in a), default=0)
    if i == 22:
        # BFS in amount-space, rather than the production DP recurrence.
        queue = collections.deque([(0,0)])
        seen = {0}
        while queue:
            value,steps = queue.popleft()
            if value == a: return steps
            for square in (x*x for x in range(1,math.isqrt(a)+1)):
                nxt = value+square
                if nxt <= a and nxt not in seen:
                    seen.add(nxt)
                    queue.append((nxt,steps+1))
    if i == 28:
        reach = [[x == y for y in range(a)] for x in range(a)]
        for x,y in args[1]: reach[x][y] = reach[y][x] = True
        for k in range(a):
            for x in range(a):
                for y in range(a): reach[x][y] |= reach[x][k] and reach[k][y]
        return max(map(sum,reach), default=0)
    if i == 30:
        if not a or not a[0]: return 0
        rows,cols = len(a),len(a[0])
        dist = {(0,0):a[0][0]}
        # Repeated relaxation independently checks the heap-based search.
        for _ in range(rows*cols):
            old = dict(dist)
            for r in range(rows):
                for c in range(cols):
                    values = [old[x,y]+a[r][c] for x,y in ((r-1,c),(r+1,c),(r,c-1),(r,c+1)) if (x,y) in old]
                    if values: dist[r,c] = min(dist.get((r,c),math.inf),*values)
        return dist[rows-1,cols-1]
    if i == 33:
        # Direct shortest-supersequence recurrence, rather than deriving from LCS.
        @functools.cache
        def shortest(x,y):
            if not x: return len(y)
            if not y: return len(x)
            if x[0] == y[0]: return 1+shortest(x[1:],y[1:])
            return 1+min(shortest(x[1:],y),shortest(x,y[1:]))
        return shortest(a,args[1])
    raise AssertionError((group,i,args))

def split(a, mask):
    groups = [[]]
    for j,x in enumerate(a):
        groups[-1].append(x)
        if j < len(a)-1 and mask >> j & 1: groups.append([])
    return groups

def generated(group, i, rng):
    a = [rng.randrange(-5,6) for _ in range(rng.randrange(8))]
    text = lambda: ''.join(rng.choices('abABé!01', k=rng.randrange(8)))
    if i == 60: return [a]
    if i == 61: return [a,rng.randrange(-4,5)] if group == 'lesson' else [[rng.randrange(2) for _ in a]]
    if i == 62:
        positive = [abs(x)+1 for x in a]
        return [positive, rng.randrange(max(1,len(a)),max(1,len(a))+7) if group == 'lesson' else rng.randrange(1,7)]
    if i == 63:
        n = rng.randrange(6)
        edges = [[rng.randrange(n),rng.randrange(n)] for _ in range(rng.randrange(9))] if n else []
        return [n,edges]
    if i == 64:
        rows,cols = rng.randrange(5),rng.randrange(5)
        return [[[rng.randrange(2 if group == 'lesson' else 3) for _ in range(cols)] for _ in range(rows)]]
    if i in (65,33): return [text(),text()]
    if i in (1,5): return [a]
    if i in (3,9): return [text()]
    if i == 4: return [a,rng.randrange(-1,10),rng.randrange(-4,5)]
    if i == 6:
        n = rng.randrange(12)
        missing = rng.randrange(n+1)
        return [[x for x in range(n+1) if x != missing]]
    if i == 14: return [rng.randrange(-5,6),rng.randrange(10)]
    if i == 20:
        return [[[start,start+rng.randrange(1,8)] for start in a]]
    if i == 22: return [rng.randrange(60)]
    if i == 28:
        n = rng.randrange(6)
        return [n,[[rng.randrange(n),rng.randrange(n)] for _ in range(rng.randrange(9))] if n else []]
    if i == 30:
        rows, cols = rng.randrange(5), rng.randrange(5)
        return [[[rng.randrange(6) for _ in range(cols)] for _ in range(rows)]]
    raise AssertionError((group,i))
