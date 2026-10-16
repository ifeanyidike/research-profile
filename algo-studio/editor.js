const spaces = "    ";

export function indentEdit(code, start, end, outdent = false) {
  const from = start === 0 ? 0 : code.lastIndexOf("\n", start - 1) + 1;
  if (start === end && !outdent) {
    const text = spaces.slice((start - from) % 4);
    return { from: start, to: end, text, start: start + text.length, end: start + text.length };
  }
  // A selection ending at the next line's beginning leaves that line alone.
  const last = end > start && code[end - 1] === "\n" ? end - 1 : end;
  const newline = code.indexOf("\n", last),
    to = newline < 0 ? code.length : newline;
  const lines = code.slice(from, to).split("\n"),
    changes = [];
  let offset = from;
  const text = lines
    .map((line) => {
      const remove = outdent ? (line.startsWith("\t") ? 1 : Math.min(4, line.match(/^ */)[0].length)) : 0;
      const insert = outdent ? "" : spaces;
      changes.push({ at: offset, remove, insert: insert.length });
      offset += line.length + 1;
      return insert + line.slice(remove);
    })
    .join("\n");
  const moved = (pos) => pos + changes.reduce((delta, c) => delta + (pos >= c.at ? c.insert - Math.min(c.remove, pos - c.at) : 0), 0);
  return { from, to, text, start: moved(start), end: moved(end) };
}

export function toolbarIndentEdit(code, start, end, outdent = false) {
  if (outdent || start !== end) return indentEdit(code, start, end, outdent);
  const from = start === 0 ? 0 : code.lastIndexOf("\n", start - 1) + 1;
  return { from, to: from, text: spaces, start: start + spaces.length, end: end + spaces.length };
}

export function backspaceIndentEdit(code, start, end) {
  if (start !== end) return null;
  const from = start === 0 ? 0 : code.lastIndexOf("\n", start - 1) + 1,
    before = code.slice(from, start);
  if (!before || !/^[ ]+$/.test(before)) return null;
  const count = before.length % 4 || 4;
  return { from: start - count, to: start, text: "", start: start - count, end: start - count };
}

export function newlineEdit(code, start, end) {
  const before = code.slice(start === 0 ? 0 : code.lastIndexOf("\n", start - 1) + 1, start);
  let quote = "",
    escaped = false,
    statement = "";
  for (const char of before) {
    if (!quote && char === "#") break;
    statement += char;
    if (escaped) {
      escaped = false;
      continue;
    }
    if (quote && char === "\\") {
      escaped = true;
      continue;
    }
    if (quote === char) quote = "";
    else if (!quote && (char === '"' || char === "'")) quote = char;
  }
  const indent = before.match(/^[ \t]*/)[0] + (!quote && statement.trimEnd().endsWith(":") ? spaces : "");
  const text = "\n" + indent;
  return { from: start, to: end, text, start: start + text.length, end: start + text.length };
}
