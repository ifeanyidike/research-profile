import test from "node:test";
import assert from "node:assert/strict";
import { indentEdit, toolbarIndentEdit, backspaceIndentEdit, newlineEdit } from "../../algo-studio/editor.js";
const apply = (code, edit) => (edit ? code.slice(0, edit.from) + edit.text + code.slice(edit.to) : code);

test("toolbar indentation moves the current line from any cursor position and round-trips with outdent", () => {
  const code = "def solve():\n    return 1";
  for (const caret of [13, 18, code.length]) {
    const indent = toolbarIndentEdit(code, caret, caret);
    const indented = apply(code, indent);
    assert.equal(indented, "def solve():\n        return 1");
    assert.equal(indent.start, caret + 4);
    assert.equal(indent.start, indent.end);
    const outdent = toolbarIndentEdit(indented, indent.start, indent.end, true);
    assert.equal(apply(indented, outdent), code);
    assert.equal(outdent.start, caret);
  }
  assert.equal(apply("", toolbarIndentEdit("", 0, 0)), "    ");
  assert.equal(apply("a\nb", toolbarIndentEdit("a\nb", 0, 3)), "    a\n    b");
});

test("Tab advances to a four-space stop and selected lines indent together", () => {
  assert.equal(apply("  value", indentEdit("  value", 2, 2)), "    value");
  const code = "if ok:\n    first()\n    second()\nafter()";
  const start = code.indexOf("first"),
    end = code.indexOf("after");
  const edit = indentEdit(code, start, end);
  assert.equal(apply(code, edit), "if ok:\n        first()\n        second()\nafter()");
  const indented = apply(code, edit);
  assert.equal(apply(indented, indentEdit(indented, edit.start, edit.end, true)), code);
  assert.equal(apply("word", indentEdit("word", 1, 3)), "    word");
  assert.equal(apply("\nx", indentEdit("\nx", 0, 0)), "    \nx");
});

test("Outdent removes leading whitespace without touching code or negative cursor offsets", () => {
  for (const [code, caret, expected, position] of [
    ["        x", 8, "    x", 4],
    ["  x", 2, "x", 0],
    ["x", 0, "x", 0],
    ["\tx", 1, "x", 0],
    ["\nx", 0, "\nx", 0],
  ]) {
    const edit = indentEdit(code, caret, caret, true);
    assert.equal(apply(code, edit), expected);
    assert.equal(edit.start, position);
  }
});

test("Backspace removes one indentation stop, retaining ordinary character and selection deletion", () => {
  assert.equal(apply("        return x", backspaceIndentEdit("        return x", 8, 8)), "    return x");
  assert.equal(apply("      x", backspaceIndentEdit("      x", 6, 6)), "    x");
  assert.equal(backspaceIndentEdit("    value", 6, 6), null);
  assert.equal(backspaceIndentEdit("    value", 0, 4), null);
  assert.equal(backspaceIndentEdit("\nx", 0, 0), null);
});

test("Enter preserves indentation and opens Python blocks with trailing comments", () => {
  for (const [before, after] of [
    ["def solve(items):", "\n    "],
    ["    if x: # explain why", "\n        "],
    ["    return x", "\n    "],
    ['    x = "a#b" # comment:', "\n    "],
    ['    text = "a:"', "\n    "],
    ["    if text == '#':", "\n        "],
  ]) {
    const edit = newlineEdit(before, before.length, before.length);
    assert.equal(apply(before, edit), before + after);
    assert.equal(edit.start, edit.end);
    assert.equal(edit.start, before.length + after.length);
  }
  assert.equal(apply("abc", newlineEdit("abc", 1, 2)), "a\nc");
  assert.equal(apply("\nx", newlineEdit("\nx", 0, 0)), "\n\nx");
});
