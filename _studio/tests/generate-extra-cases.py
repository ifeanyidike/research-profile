"""Emit reproducible learner-facing cases from independent specifications.

Reads the exercise inventory as JSON on stdin. No learner/worked code is executed.
The original examples stay first; these add boundaries and varied small inputs.
"""
import copy
import json
import random
import sys

from oracles import generated, oracle


def curated(group, i):
    if i == 68 and group != 'transfer': return [[1 << bit] for bit in range(11)]
    if i == 70 and group == 'lesson': return [[n] for n in range(13)]
    if i == 95 and group != 'transfer': return [[n] for n in range(9)]
    if i == 107 and group in ('lesson', 'check'): return [['b+aa', 'aa'], ['Æa', 'a']]
    if i == 87 and group != 'transfer': return [[6, [[0,1,1],[0,2,1],[1,3,1],[1,4,1],[2,3,1],[3,5,1],[4,5,1]], 0, 5]]
    if i == 83: return [[4, [[0,1],[1,2],[2,3],[3,1]]]]
    if i == 4 and group in ('lesson', 'check'):
        windows = [
            ([5], 1, 5), ([1, 2, 3], 3, 6), ([0, 0, 1, 2], 3, 3),
            ([2, 2, 2], 2, 4), ([-9, -4, -2], 1, -3),
            ([1, 2, 3], 1, 3), ([1, 2, 3], 3, 7),
            ([1, 2, 3], 2, 3), ([], 1, 0), ([1], -1, 0),
            ([1], 0, 0), ([1], 2, 0), ([1, 2, 3], 2, 0),
        ]
        return [[a, k] + ([target] if group == 'check' else []) for a, k, target in windows]
    if i in (3, 8, 37) and group == 'check' or i == 8 and group == 'lesson':
        return [[[], []], [[1], []], [[], [1]], [[1, 1], [1, 1, 1]],
                [[1, 2, 5, 8], [2, 8]], [[1], [2, 3, 4]], [[-3, -1], [-4, -3, -1, 0]]]
    cases = {
        ('lesson', 0): [[[2, 1, 2], 2], [[1, 2, 3], 3]],
        ('lesson', 2): [[[-7, -2, -9]], [[7, 2, 9]], [[4, 4, 4]]],
        ('check', 2): [[[7, 2, 9]], [[-7, -2, -9]], [[4, 4, 4]]],
        ('lesson', 3): [[''], ['abca'], ['Aa'], ['abba'], ['abcba']],
        ('lesson', 5): [[[2, -3, 4], [[0, 0], [2, 2], [0, 2], [1, 2]]]],
        ('check', 5): [[[2, -3, 4], [[0, 0], [2, 2], [0, 2], [1, 2]], 1]],
        ('lesson', 6): [[[1, 3, 7], 1], [[1, 3, 7], 7], [[1, 3, 7], 8]],
        ('lesson', 12): [[['A', 'a', 'A', '']], [[]]],
        ('lesson', 13): [[[3], 6], [[3, 3], 6], [[1, 1, 2], 3]],
        ('check', 13): [[[3], 6], [[3, 3], 6]],
        ('transfer', 13): [[[3, 3, 3, 3], 6], [[0, 0, 0], 0]],
        ('lesson', 14): [[0], [15]],
        ('lesson', 18): [[{}, 'A', 'A'], [{}, 'A', 'B'], [{'A': ['B'], 'B': ['A']}, 'A', 'C']],
        ('check', 18): [[{}, 'A'], [{'A': ['B'], 'B': ['A']}, 'A']],
        ('lesson', 20): [[[[1, 2], [2, 3], [1, 10]]]],
        ('check', 20): [[[[1, 2], [2, 3], [1, 10]]]],
        ('lesson', 21): [[0], [40]],
        ('check', 21): [[0], [25]],
        ('lesson', 22): [[[1, 3, 4], 6], [[], 0], [[], 3], [[2], 3]],
        ('check', 22): [[[1, 2], 3], [[], 0], [[], 3], [[2], 3]],
        ('lesson', 23): [[{}, 'A', 'A'], [{}, 'A', 'B']],
        ('check', 23): [[{}, 'A', 'A', []], [{}, 'A', 'A', ['A']]],
        ('lesson', 27): [[[], ['', 'a']], [['car'], ['ca', 'car', 'cart']]],
        ('check', 27): [[[], ['', 'a']], [['car'], ['ca', 'car', 'cart']], [[''], ['', 'a']]],
        ('lesson', 28): [[0, []], [4, [[0, 0], [0, 1], [0, 1]]]],
        ('check', 28): [[3, [[0, 1]], [[0, 0], [0, 1], [0, 2]]]],
        ('lesson', 29): [[2, [[0, 1], [0, 1]]], [1, [[0, 0]]]],
        ('check', 29): [[2, [[0, 1], [0, 1]]], [1, [[0, 0]]]],
        ('lesson', 30): [[{}, 'A', 'A'], [{'A': [['B', 8], ['C', 1]], 'C': [['B', 1]]}, 'A', 'B']],
        ('check', 30): [[{}, 'A'], [{'A': [['B', 8], ['C', 1]], 'C': [['B', 1]]}, 'A']],
        ('lesson', 31): [[3, []], [2, [[0, 1], [1, 0]]]],
        ('check', 31): [[3, []], [2, [[0, 1], [1, 0]]]],
        ('lesson', 32): [[4, [[0, 1, 2], [2, 3, 3]]]],
        ('check', 32): [[4, [[0, 1, 2], [2, 3, 3]]]],
        ('lesson', 35): [[[2], [3], 4]],
        ('check', 35): [[[2], 4], [[2, 2], 4]],
        ('lesson', 38): [[1], [2], [31], [32], [33]],
        ('check', 38): [[0], [1], [2], [31], [32], [33]],
        ('lesson', 39): [[7], [[]], [[[], [1, [], [2]], 3]]],
        ('check', 39): [[7], [[]], [[[], [1, [], [2]], 3]]],
        ('lesson', 40): [[3, [[0, 1], [0, 1], [1, 1]]]],
        ('check', 40): [[3, [[0, 1], [0, 1], [1, 1]]]],
        ('check', 41): [[[1, 4, 2]], [[2, 1]], [[]]],
        ('lesson', 42): [[[1, 1, 8], 8]],
        ('check', 42): [[[0, 0, 0], 0], [[1, 1, 1], 2]],
        ('lesson', 43): [['abba'], ['dvdf'], ['aA']],
        ('check', 43): [['abc', 0], ['eceba', 2]],
        ('lesson', 45): [[[1, 2, 2, 2, 4], 2], [[1, 2], 3]],
        ('check', 45): [[[1, 2, 2, 2, 4], 2], [[1, 2], 3]],
        ('check', 46): [[{'value': 10, 'left': {'value': 5, 'left': None,
                                          'right': {'value': 12, 'left': None, 'right': None}}, 'right': None}]],
        ('lesson', 48): [[0], [35]],
        ('check', 48): [[[]], [[7]], [[0, 0, 0]]],
        ('lesson', 49): [[0, 3], [3, 0], [1, 5], [5, 1], [15, 15]],
        ('check', 49): [[[]], [[[1]]], [[[0]]], [[[0, 0, 1]]], [[[0, 0, 0]]]],
        ('lesson', 50): [[[2], [3], 4]],
        ('check', 50): [[[1, 1], [2, 2], 1], [[1, 1], [0, 0], 2]],
        ('transfer', 50): [[[1, 1, 1], 2], [[], 0]],
        ('lesson', 51): [[[2, 2, 3]], [[3, 2, 1]]],
        ('check', 51): [[[2, 2, 3]], [[3, 2, 1]]],
        ('transfer', 51): [[[2, 2, 3]], [[3, 2, 1]]],
        ('lesson', 52): [[[[1, 2], [2, 3]]]],
        ('check', 52): [[[[1, 2], [4, 5]], [2, 4]]],
        ('lesson', 54): [[[1, 4, 1, -2], 3]],
        ('check', 54): [[[['put', 1, 7], ['put', 4, 8], ['put', 1, 9], ['get', 1], ['get', 4], ['get', 7]], 3]],
        ('lesson', 55): [[[0], 0], [[None], 0], [[1, 2, 1], 0]],
        ('check', 55): [[[0], 0], [[None], 0], [[1, 2, 1], 0]],
        ('lesson', 56): [[3, [[1, 2, -1], [2, 1, -1]], 0]],
        ('check', 56): [[3, [[1, 2, -1], [2, 1, -1]], 0]],
        ('lesson', 58): [['aaaa', 'aa'], ['abc', '']],
        ('check', 58): [['aaaa', 'aa'], ['aaaab', 'aab']],
        ('lesson', 59): [[0, 0], [-18, 12]],
        ('check', 59): [[0, 0], [-18, 12]],
    }
    return cases.get((group, i), [])


def build(tasks):
    out = {group: {} for group in ('lesson', 'check', 'transfer')}
    for task in tasks:
        group, i = task['group'], task['id']
        rng = random.Random(f'20261019:{group}:{i}')
        seen = {json.dumps(t['args'], sort_keys=True) for t in task['tests']}
        cases = []
        finite = {('lesson', 68): 11, ('check', 68): 11, ('lesson', 70): 13, ('lesson', 95): 9, ('check', 95): 9}
        required = min(12, finite.get((group, i), len(seen) + 12) - len(seen))

        def add(args):
            key = json.dumps(args, sort_keys=True)
            if key in seen:
                return
            seen.add(key)
            cases.append({'args': args, 'expected': oracle(group, i, copy.deepcopy(args))})

        for args in curated(group, i):
            add(args)
        for _ in range(2000):
            if len(cases) >= required:
                break
            add(generated(group, i, rng))
        assert len(cases) >= required, ('Insufficient varied inputs', group, i, len(cases))
        out[group][str(i)] = cases
    return out


if __name__ == '__main__':
    print(json.dumps(build(json.load(sys.stdin)), ensure_ascii=False))
