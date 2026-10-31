// Authored prose and fenced reference code only. Every character is escaped;
// this is not a general Markdown or HTML renderer and never runs examples.
const escape = (text) => String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function renderProse(text) {
  return text
    .split(/(^```[^\n]*\n[\s\S]*?^```[ \t]*$)/m)
    .map((part) => {
      if (/^```[^\n]*\n[\s\S]*\n```[ \t]*$/.test(part)) {
        const code = part.replace(/^```[^\n]*\n/, "").replace(/\n```[ \t]*$/, "");
        return `<pre class="lesson-code" tabindex="0" aria-label="Reference code"><code>${escape(code)}</code></pre>`;
      }
      return part
        .split("\n\n")
        .filter((p) => p.trim())
        .map((p) => `<p>${escape(p)}</p>`)
        .join("");
    })
    .join("");
}
