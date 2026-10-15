import test from "node:test";
import assert from "node:assert/strict";
import { highlightPython } from "../../algo-studio/python-highlight.js";
import { lessons } from "../../algo-studio/curriculum.js";
import { checkpoints, transferTasks } from "../../algo-studio/practice-bank.js";
const text = (html) =>
  html
    .replace(/<\/?span[^>]*>/g, "")
    .replace(/&(amp|lt|gt|quot|#39);/g, (_, entity) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" })[entity]);

test("Highlighting preserves every source character in all 132 reference solutions", () => {
  for (const problem of [...lessons, ...Object.values(checkpoints), ...Object.values(transferTasks)])
    assert.equal(text(highlightPython(problem.solution)), problem.solution);
});

test("Python keywords, definitions, builtins, literals and comments receive separate colours", () => {
  const html = highlightPython("def solve(items):\n    # Count items\n    return len(items) + 12 if True else None");
  for (const kind of ["keyword", "function", "builtin", "number", "constant", "comment", "operator"])
    assert.ok(html.includes(`class="py-${kind}"`), kind);
  assert.ok(html.includes('class="py-function">solve</span>'));
  const literal = highlightPython('message = "return # not a comment"');
  assert.ok(literal.includes('class="py-string"'));
  assert.ok(!literal.includes("py-comment"));
});

test("Strings and incomplete code remain safe, including multiline strings and markup", () => {
  for (const code of [
    'text = "unfinished',
    'text = """first\nsecond # string\n"""',
    'x = r"a\\b"',
    "x = f'{value}'",
    'text = "<img src=x onerror=alert(1)> &"',
    "'escaped \\' quote'",
    "if x < 2:\n    ",
  ]) {
    const html = highlightPython(code);
    assert.equal(text(html), code);
    assert.ok(!html.includes("<img"));
    for (const line of html.split("\n")) assert.equal((line.match(/<span/g) || []).length, (line.match(/<\/span>/g) || []).length);
  }
});
