// Local editing/presentation only. No code execution, model SDK or network I/O.
import { highlightPython } from "../algo-studio/python-highlight.js";
import { toolbarIndentEdit, newlineEdit } from "../algo-studio/editor.js?v=20261016-algorithms-ui1";
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function renderCode(code, language = "text") {
  if (language !== "python") return `<pre class="lesson-code" tabindex="0" aria-label="Reference code"><code>${esc(code)}</code></pre>`;
  return `<section class="studio-code-editor" aria-label="Python example editor"><div class="code-editor-toolbar"><strong>example.py <span>Python</span></strong><div><button type="button" data-code-action="edit" aria-expanded="false">Edit code</button><button type="button" data-code-action="copy">Copy</button><button type="button" data-code-action="download">Download</button></div></div><div class="code-edit-actions" hidden><button type="button" data-code-action="indent">Indent</button><button type="button" data-code-action="outdent">Outdent</button><button type="button" data-code-action="reset">Reset example</button></div><div class="code-editor-body"><pre class="code-gutter" aria-hidden="true"><span>${code
    .split("\n")
    .map((_, i) => i + 1)
    .join(
      "\n"
    )}</span></pre><div class="code-editor-surface"><pre class="code-preview" tabindex="0" aria-label="Python reference code"><code>${highlightPython(code)}\n</code></pre><textarea class="code-input" aria-label="Edit Python example" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" hidden>${esc(code)}</textarea></div></div><p class="code-editor-help" hidden>Temporary scratch edits · download or copy before leaving. Tab moves to the next control; use Indent / Outdent to adjust lines. Run Python in your own editor.</p><p class="code-editor-status" role="status"></p></section>`;
}

export function bindCodeEditors(root, { clipboard = navigator.clipboard, download = downloadCode } = {}) {
  for (const panel of root.querySelectorAll(".studio-code-editor")) {
    const input = panel.querySelector(".code-input");
    const preview = panel.querySelector(".code-preview");
    const code = preview.querySelector("code");
    const gutter = panel.querySelector(".code-gutter span");
    const edit = panel.querySelector('[data-code-action="edit"]');
    const status = panel.querySelector(".code-editor-status");
    const original = input.value;
    let editing = false;
    const redraw = () => {
      code.innerHTML = highlightPython(input.value) + "\n";
      gutter.textContent = input.value
        .split("\n")
        .map((_, i) => i + 1)
        .join("\n");
      panel.querySelector(".code-editor-body").style.height = `${Math.min(18, Math.max(5, input.value.split("\n").length + 1)) * 25 + 32}px`;
      syncScroll();
    };
    function syncScroll() {
      const scroller = editing ? input : preview;
      gutter.style.transform = `translateY(${-scroller.scrollTop}px)`;
      preview.style.transform = editing ? `translate(${-input.scrollLeft}px, ${-input.scrollTop}px)` : "";
    }
    const apply = (change) => {
      input.setRangeText(change.text, change.from, change.to, "preserve");
      input.setSelectionRange(change.start, change.end);
      redraw();
      input.focus();
    };
    input.addEventListener("input", () => {
      redraw();
      status.textContent = "";
    });
    input.addEventListener("scroll", syncScroll);
    preview.addEventListener("scroll", syncScroll);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.isComposing && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        apply(newlineEdit(input.value, input.selectionStart, input.selectionEnd));
      }
    });
    for (const button of panel.querySelectorAll("[data-code-action]"))
      button.addEventListener("click", async () => {
        const action = button.dataset.codeAction;
        if (action === "edit") {
          editing = !editing;
          if (editing) preview.scrollTop = preview.scrollLeft = 0;
          else input.scrollTop = input.scrollLeft = 0;
          panel.classList.toggle("is-editing", editing);
          input.hidden = !editing;
          preview.setAttribute("aria-hidden", String(editing));
          preview.tabIndex = editing ? -1 : 0;
          edit.setAttribute("aria-expanded", String(editing));
          edit.textContent = editing ? "Read code" : "Edit code";
          panel.querySelector(".code-edit-actions").hidden = !editing;
          panel.querySelector(".code-editor-help").hidden = !editing;
          syncScroll();
          if (editing) input.focus();
        }
        if (action === "indent" || action === "outdent")
          apply(toolbarIndentEdit(input.value, input.selectionStart, input.selectionEnd, action === "outdent"));
        if (action === "reset") {
          input.value = original;
          redraw();
          status.textContent = "Original example restored.";
        }
        if (action === "download") {
          download(input.value);
          status.textContent = "Download requested for example.py.";
        }
        if (action === "copy") {
          try {
            await clipboard.writeText(input.value);
            status.textContent = "Code copied.";
          } catch {
            status.textContent = "Copy is unavailable. Select the code or use Download.";
          }
        }
      });
    redraw();
  }
}

function downloadCode(code) {
  const url = URL.createObjectURL(new Blob([code], { type: "text/x-python;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "example.py";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
