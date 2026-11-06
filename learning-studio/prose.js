import { renderCode } from "./code-editor.js?v=20261106-4";
// Authored prose and fenced reference code only. Every character is escaped;
// this is not a general Markdown or HTML renderer and never runs examples.
const escape = (text) => String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function renderProse(text, { headingLevel = 3 } = {}) {
  const heading = headingLevel === 2 ? "h2" : "h3";
  return text
    .split(/(^```[^\n]*\n[\s\S]*?^```[ \t]*$)/m)
    .map((part) => {
      if (/^```[^\n]*\n[\s\S]*\n```[ \t]*$/.test(part)) {
        const code = part.replace(/^```[^\n]*\n/, "").replace(/\n```[ \t]*$/, "");
        const header = part
          .match(/^```([^\n]*)/)[1]
          .trim()
          .split(/\s+/);
        const language = header[0].toLowerCase();
        const id = header.find((value) => /^id=[a-z][a-z0-9-]{0,47}$/.test(value))?.slice(3);
        // Only a named workspace has execution/persistence wiring. Unnamed
        // references (including Cyber examples) must not show inert Run controls.
        return renderCode(code, language === "python" && !id ? "text" : language, id || "");
      }
      return part
        .split(/\n\s*\n/)
        .filter((p) => p.trim())
        .map((block) => {
          // Deliberately small authored syntax. Everything remains escaped,
          // including links/HTML; TeX and fenced reference code keep their text.
          const lines = block.split("\n");
          if (lines.length === 1 && /^###\s+\S/.test(block)) return `<${heading} class="prose-heading">${escape(block.slice(4))}</${heading}>`;
          if (lines.every((line) => /^-\s+\S/.test(line)))
            return `<ul>${lines.map((line) => `<li>${escape(line.replace(/^-\s+/, ""))}</li>`).join("")}</ul>`;
          if (lines.every((line) => /^\d+\.\s+\S/.test(line)))
            return `<ol>${lines.map((line) => `<li>${escape(line.replace(/^\d+\.\s+/, ""))}</li>`).join("")}</ol>`;
          return `<p>${escape(block)}</p>`;
        })
        .join("");
    })
    .join("");
}
