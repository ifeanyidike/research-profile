"""Offline lesson packaging: authored prose only; no model or network calls."""
import json
from pathlib import Path
root = Path(__file__).resolve().parents[1]
lessons = {}
for path in sorted((root / '_cyber/content').glob('*.txt')):
    for block in path.read_text().strip().split('\n\n'):
        fields = [x.strip() for x in block.split('\n')]
        if len(fields) != 10:
            raise ValueError((path, fields[0], len(fields)))
        id, concept, mechanism, example, pitfall, question, correct, wrong1, wrong2, feedback = fields
        choices = [correct, wrong1, wrong2]
        answer = sum(map(ord, id)) % 3
        choices.insert(answer, choices.pop(0))
        lessons[id] = dict(concept=concept, mechanism=mechanism, example=example, pitfall=pitfall, check=dict(question=question, choices=choices, answer=answer, explanation=feedback))
modules = json.loads((root / 'cyber-studio/curriculum.json').read_text())['modules']
assert set(lessons) == {m['id'] for m in modules}
(root / 'cyber-studio/lessons.json').write_text(json.dumps(lessons, ensure_ascii=False, indent=2) + '\n')
print(f'Packaged {len(lessons)} authored lessons.')
