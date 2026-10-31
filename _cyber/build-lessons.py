"""Offline lesson packaging: authored prose only; no model or network calls."""
import json
import sys
import copy
from pathlib import Path
root = Path(__file__).resolve().parents[1]
lessons = {}
for path in sorted((root / '_cyber/content').glob('*.txt')):
    for block in path.read_text(encoding="utf-8").strip().split('\n\n'):
        fields = [x.strip() for x in block.split('\n')]
        if len(fields) != 10:
            raise ValueError((path, fields[0], len(fields)))
        id, concept, mechanism, example, pitfall, question, correct, wrong1, wrong2, feedback = fields
        choices = [correct, wrong1, wrong2]
        answer = sum(map(ord, id)) % 3
        choices.insert(answer, choices.pop(0))
        guide = json.loads((root / '_cyber/guides' / f'{id}.json').read_text(encoding="utf-8"))
        lessons[id] = dict(guide=guide, concept=concept, mechanism=mechanism, example=example, pitfall=pitfall, check=dict(question=question, choices=choices, answer=answer, explanation=feedback))
curriculum_path = root / 'cyber-studio/curriculum.json'
curriculum = json.loads(curriculum_path.read_text(encoding="utf-8"))
saved_curriculum = copy.deepcopy(curriculum)
modules = curriculum['modules']
assert set(lessons) == {m['id'] for m in modules}
for module in modules:
    guide = lessons[module['id']]['guide']
    module['practice'] = guide['exercise']
    module['assessment'] = guide['challenge']
lesson_path = root / 'cyber-studio/lessons.json'
if sys.argv[1:] == ['--check']:
    if json.loads(lesson_path.read_text(encoding="utf-8")) != lessons:
        raise SystemExit('Stale cyber-studio/lessons.json: run python3 _cyber/build-lessons.py')
    if saved_curriculum != curriculum:
        raise SystemExit('Stale derived curriculum fields: run python3 _cyber/build-lessons.py')
    print(f'Checked {len(lessons)} authored lessons and derived curriculum fields.')
elif not sys.argv[1:]:
    curriculum_path.write_text(json.dumps(curriculum, ensure_ascii=False, indent=2) + '\n', encoding="utf-8")
    lesson_path.write_text(json.dumps(lessons, ensure_ascii=False, indent=2) + '\n', encoding="utf-8")
    print(f'Packaged {len(lessons)} authored lessons.')
else:
    raise SystemExit('Usage: python3 _cyber/build-lessons.py [--check]')
