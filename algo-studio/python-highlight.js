const keywords = new Set(
  "and as assert async await break case class continue def del elif else except finally for from global if import in is lambda match nonlocal not or pass raise return try while with yield".split(
    " "
  )
);
const builtins = new Set(
  "abs all any bin bool bytearray bytes callable chr classmethod complex dict divmod enumerate filter float format frozenset getattr hasattr hash hex id input int isinstance issubclass iter len list map max min next object oct open ord pow print property range repr reversed round set setattr slice sorted staticmethod str sum super tuple type vars zip".split(
    " "
  )
);
const escape = (text) => text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// A display-only lexer: it preserves the source, including unfinished code.
export function highlightPython(code) {
  const tokens =
    /#[^\n]*|(?:[rRuUbBfF]{1,2})?(?:"""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|"(?:\\[^\n]|[^"\\\n])*(?:"|(?=\n|$))|'(?:\\[^\n]|[^'\\\n])*(?:'|(?=\n|$)))|\b(?:0[xX][\da-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|\d[\d_]*(?:\.[\d_]*)?(?:[eE][+-]?[\d_]+)?j?)\b|\b[A-Za-z_]\w*\b|(?:\*\*|\/\/|:=|==|!=|<=|>=|->|[-+*/%=<>!&|^~@:])/g;
  let result = "",
    cursor = 0,
    previous = "";
  for (const match of code.matchAll(tokens)) {
    const value = match[0],
      at = match.index;
    result += escape(code.slice(cursor, at));
    const kind =
      value[0] === "#"
        ? "comment"
        : /^[rRuUbBfF]{0,2}["']/.test(value)
          ? "string"
          : /^\d/.test(value)
            ? "number"
            : ["True", "False", "None"].includes(value)
              ? "constant"
              : keywords.has(value)
                ? "keyword"
                : builtins.has(value)
                  ? "builtin"
                  : ["def", "class"].includes(previous)
                    ? "function"
                    : /^[A-Za-z_]\w*$/.test(value)
                      ? ""
                      : "operator";
    // Keep spans within individual lines so step-by-step solutions can wrap rows.
    result += kind
      ? value
          .split("\n")
          .map((line) => `<span class="py-${kind}">${escape(line)}</span>`)
          .join("\n")
      : escape(value);
    previous = value;
    cursor = at + value.length;
  }
  return result + escape(code.slice(cursor));
}
