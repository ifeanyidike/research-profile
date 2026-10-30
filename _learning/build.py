"""Offline packaging only: no third-party imports, network or model calls."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / '_learning'

def parse(path):
    blocks = {}
    current = None
    field = None
    for line in path.read_text().splitlines():
        if line.startswith('ID:: '):
            id = line[5:].strip()
            assert id not in blocks, 'Duplicate authored lesson: ' + id
            current = {}; blocks[id] = current; field = None
        elif ':: ' in line and line.split(':: ', 1)[0].isupper():
            key, value = line.split(':: ', 1); field = key.lower()
            assert field not in current, 'Duplicate field: ' + field
            current[field] = value
        elif field:
            current[field] += '\n' + line
        elif line.strip():
            raise ValueError('Text before field: ' + line)
    return {id: {k: v.strip() for k, v in lesson.items()} for id, lesson in blocks.items()}

def resource_lines(items):
    lines = []
    def clock(seconds):
        hours, remainder = divmod(seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        return (f'{hours}:{minutes:02}:' if hours else f'{minutes}:') + f'{seconds:02}'
    for r in items:
        lines.append('  ' + ('Optional: ' if r.get('optional') else '') + r['label'] + ' — ' + r['url'])
        if r.get('assignment'): lines.append('    Assignment: ' + r['assignment'])
        for segment in r.get('segments', []):
            lines.append('    Watch ' + clock(segment['start']) + '–' + clock(segment['end']) + ': ' + segment['label'])
        if r.get('accessNote'): lines.append('    Access: ' + r['accessNote'])
        if r.get('contentReview'):
            review = r['contentReview']
            lines.append('    Content evidence (' + review['method'] + '): ' + review['note'])
            lines += ['      ' + source['label'] + ': ' + source['url'] for source in review['sources']]
    return lines

def build(check=False):
    maps = json.loads((SOURCE / 'maps.json').read_text())
    for subject in ('voice', 'child'):
        data = maps[subject]
        dest = ROOT / data['slug']
        authored = parse(SOURCE / (subject + '.txt'))
        modules = data['modules']
        assert len({m['id'] for m in modules}) == len(modules), 'Duplicate module IDs'
        assert len({m['pass_criteria'] for m in modules}) == len(modules), 'Topic-specific criteria required'
        assert set(authored) == {m['id'] for m in modules}, subject
        seen = set()
        lessons = {}
        for m in modules:
            assert all(p in seen for p in m['prerequisites']), m['id']
            seen.add(m['id'])
            assert len(m['outcomes']) == 3 and all(isinstance(x, str) and x.strip() for x in m['outcomes']), m['id']
            assert m['study_focus'].strip(), m['id']
            a = authored[m['id']]
            fields = ['bridge', 'concept', 'mechanism', 'teaching', 'example', 'explanation', 'pitfall', 'exercise', 'solution', 'challenge', 'challenge_solution', 'question', 'correct', 'wrong1', 'wrong2', 'feedback']
            assert all(a.get(f) for f in fields), m['id']
            guide = {f: a[f] for f in ['bridge', 'teaching', 'example', 'explanation', 'exercise', 'solution', 'challenge', 'challenge_solution']}
            guide['example_format'] = a.get('example_format', 'text')
            assert guide['example_format'] in ('math', 'text'), m['id']
            # Rotate choices so correct answers have no positional pattern.
            choices = [a['correct'], a['wrong1'], a['wrong2']]
            rotate = len(lessons) % 3
            choices = choices[rotate:] + choices[:rotate]
            lessons[m['id']] = {k: a[k] for k in ['concept', 'mechanism', 'example', 'pitfall']}
            lessons[m['id']].update(guide=guide, check={'question': a['question'], 'choices': choices, 'answer': choices.index(a['correct']), 'explanation': a['feedback']})
            m.update(practice=a['exercise'], assessment=a['challenge'], practice_links=m.get('practice_links', []))
        if subject == 'child':
            lookup = {m['id']:m for m in modules}
            for track in ('caregiver', 'professional'):
                for m in modules:
                    if track in m['tracks']:
                        assert all(track in lookup[p]['tracks'] for p in m['prerequisites']), (track,m['id'])
        curriculum = {'reviewed':'30 October 2026', 'modules':modules}
        for name, expected in [('curriculum.json', curriculum), ('lessons.json', lessons)]:
            if check:
                assert json.loads((dest/name).read_text()) == expected, name + ' is stale; run python3 _learning/build.py'
            else:
                (dest/name).write_text(json.dumps(expected, ensure_ascii=False, indent=2)+'\n')
        lines=[data['name'], '='*len(data['name']), '', 'Source map reviewed 30 October 2026. Original lessons and fictional exercises; external providers own their materials.', '']
        for m in modules:
            lines += [m['id']+' — '+m['title'], 'Prerequisites: '+(', '.join(m['prerequisites']) or 'None'), 'Path: '+m.get('audienceLabel','All learners'), 'Study assignment: '+m['study_focus'], 'Video coverage/access: '+m['videoNote'], 'Videos:']
            lines += resource_lines(m['videos'])
            if not m['videos']: lines += ['  No video assigned; follow the coverage note above.']
            lines += ['Readings:']+resource_lines(m['readings'])
            lines += ['Additional practical materials:']+resource_lines(m['practice_links']) if m['practice_links'] else []
            lines += ['Practical: '+m['practice'], 'Independent assessment: '+m['assessment'], 'Pass criteria: '+m['pass_criteria'], 'Source notes: '+m['note'], '']
        if check:
            assert (dest/'source-map.txt').read_text() == '\n'.join(lines), 'Source map is stale'
        else:
            (dest/'source-map.txt').write_text('\n'.join(lines))
        print(subject, len(modules), 'complete lessons packaged')

if __name__ == '__main__':
    build(check='--check' in sys.argv)
