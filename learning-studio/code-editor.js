// Editor presentation; execution and persistence are supplied by the workspace.
import { highlightPython } from "../algo-studio/python-highlight.js";
import { toolbarIndentEdit, newlineEdit } from "../algo-studio/editor.js?v=20261016-algorithms-ui1";
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function renderCode(code, language = "text", editorId = "example") {
  if (language !== "python") return `<pre class="lesson-code" tabindex="0" aria-label="Reference code"><code>${esc(code)}</code></pre>`;
  return `<section class="studio-code-editor" data-code-id="${esc(editorId)}" aria-label="Python example editor"><div class="code-editor-toolbar"><strong>example.py <span>Python</span></strong><div><button type="button" data-code-action="edit" aria-expanded="false">Edit code</button><button type="button" data-code-action="copy">Copy</button><button type="button" data-code-action="download">Download</button></div></div><div class="code-edit-actions" hidden><button type="button" data-code-action="indent">Indent</button><button type="button" data-code-action="outdent">Outdent</button><button type="button" data-code-action="reset">Reset example</button></div><div class="code-editor-body"><pre class="code-gutter" aria-hidden="true"><span>${code
    .split("\n")
    .map((_, i) => i + 1)
    .join(
      "\n"
    )}</span></pre><div class="code-editor-surface"><pre class="code-preview" tabindex="0" aria-label="Python reference code"><code>${highlightPython(code)}\n</code></pre><textarea class="code-input" maxlength="20000" aria-label="Edit Python example" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" hidden>${esc(code)}</textarea></div></div><p class="code-editor-help" hidden>Tab moves to the next control; use Indent / Outdent to adjust lines. Ctrl/⌘+Enter runs the code.</p><div class="code-execution"><details class="code-stdin"><summary>Input for input() (optional)</summary><label>One input per line<textarea class="code-stdin-value" maxlength="8000" aria-label="Python standard input"></textarea></label></details><div class="code-run-bar"><button type="button" data-code-action="run">Run Python</button><button type="button" data-code-action="stop" disabled>Stop</button><span>Fresh run · 5-second limit</span></div><p class="fine-print">Code is saved; generated files and output are temporary. Worked solution snippets include the saved lesson example as setup; practice workspaces start empty.</p><pre class="code-run-output" aria-label="Python output" role="log" hidden></pre><details class="code-setup-output" hidden><summary>Output from lesson setup</summary><pre></pre></details></div><p class="code-save-status" role="status"></p><p class="code-editor-status" role="status"></p></section>`;
}

export function bindCodeEditors(root, { clipboard = navigator.clipboard, download = downloadCode, runner, payload } = {}) {
  for (const panel of root.querySelectorAll(".studio-code-editor")) {
    const input = panel.querySelector(".code-input");
    const preview = panel.querySelector(".code-preview");
    const code = preview.querySelector("code");
    const gutter = panel.querySelector(".code-gutter span");
    const edit = panel.querySelector('[data-code-action="edit"]');
    const status = panel.querySelector(".code-editor-status");
    const original = input.value;
    const runButton = panel.querySelector('[data-code-action="run"]');
    const stopButton = panel.querySelector('[data-code-action="stop"]');
    const output = panel.querySelector(".code-run-output");
    const setupOutput = panel.querySelector(".code-setup-output");
    panel.querySelector(".code-execution").hidden = !runner;
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
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.focus();
    };
    input.addEventListener("input", () => {
      redraw();
      status.textContent = "";
    });
    input.addEventListener("code-refresh", redraw);
    input.addEventListener("scroll", syncScroll);
    preview.addEventListener("scroll", syncScroll);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        if (!runButton.disabled) runButton.click();
        return;
      }
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
          input.dispatchEvent(new Event("input", { bubbles: true }));
          status.textContent = "Original example restored.";
        }
        if (action === "stop") runner?.stop();
        if (action === "run" && runner) {
          const source = input.value;
          runButton.disabled = true;
          stopButton.disabled = false;
          output.hidden = false;
          output.classList.remove("run-error");
          setupOutput.hidden = true;
          try {
            const result = await runner.run(payload(panel.dataset.codeId, source, panel.querySelector(".code-stdin-value").value), (message) => {
              output.textContent = message;
            });
            if (!panel.isConnected) return;
            output.textContent =
              result.output + (result.error ? (result.output ? "\n" : "") + result.error : result.output ? "" : "Finished. No printed output.");
            output.classList.toggle("run-error", !!result.error);
            setupOutput.hidden = !result.setupOutput;
            setupOutput.querySelector("pre").textContent = result.setupOutput;
            if (input.value !== source) output.textContent += "\nCode changed during this run. Run again to check the current version.";
          } catch (error) {
            if (panel.isConnected) {
              output.textContent = error.message;
              output.classList.add("run-error");
            }
          } finally {
            if (panel.isConnected) {
              runButton.disabled = false;
              stopButton.disabled = true;
            }
          }
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
