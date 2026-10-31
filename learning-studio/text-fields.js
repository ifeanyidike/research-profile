// A displayed textarea is an editing snapshot, not authority to overwrite a newer field.
export function createTextEditor({
  read,
  write,
  draft,
  base = read(),
  error: initialError = "",
  canSave = () => true,
  waiting: initialWaiting = false,
}) {
  let snapshot = { ...base },
    value = draft ?? base.value,
    error = initialError,
    waiting = initialWaiting;
  const moved = () => {
    const saved = read();
    return saved.changed !== snapshot.changed || saved.value !== snapshot.value;
  };
  return {
    get value() {
      return value;
    },
    get base() {
      return { ...snapshot };
    },
    get saved() {
      return read();
    },
    get error() {
      return error;
    },
    get waiting() {
      return waiting;
    },
    input(next) {
      value = next;
      error = "";
      if (!canSave()) {
        waiting = true;
        error = "Your draft is waiting for an account check. Keep this tab open or copy the text before leaving";
        return false;
      }
      waiting = false;
      if (moved()) return false;
      try {
        write(next);
      } catch (failure) {
        error = failure.message;
        throw failure;
      }
      snapshot = { ...read() };
      return true;
    },
    refresh(displayed = value) {
      if (waiting) {
        value = displayed;
        if (!canSave()) return false;
        waiting = false;
        error = "";
        const saved = read();
        if (saved.value === value) {
          snapshot = { ...saved };
          return true;
        }
        if (moved()) return false;
        return this.input(value);
      }
      if (displayed !== snapshot.value) {
        value = displayed;
        return !moved();
      }
      snapshot = { ...read() };
      value = snapshot.value;
      return true;
    },
    useSaved() {
      snapshot = { ...read() };
      value = snapshot.value;
      error = "";
      waiting = false;
    },
    keepDraft() {
      snapshot = { ...read() };
      return this.input(value);
    },
  };
}

export function createTextFields() {
  const drafts = new Map();
  let bindings = [];
  function paint(binding, conflict = false, error = binding.editor.error) {
    const { el, editor, key, writeHint } = binding;
    if (!conflict && !error) {
      binding.notice?.remove();
      binding.notice = null;
      binding.parts = null;
      drafts.delete(key);
      el.removeAttribute("aria-invalid");
      return;
    }
    drafts.set(key, { draft: editor.value, base: editor.base, error, waiting: editor.waiting });
    el.setAttribute("aria-invalid", "true");
    if (!binding.notice) {
      const doc = el.ownerDocument,
        box = doc.createElement("section"),
        message = doc.createElement("p"),
        details = doc.createElement("details"),
        summary = doc.createElement("summary"),
        saved = doc.createElement("pre"),
        use = doc.createElement("button"),
        keep = doc.createElement("button");
      box.className = "note-conflict callout";
      box.setAttribute("role", "region");
      box.setAttribute("aria-label", "Unsaved draft");
      message.setAttribute("role", "alert");
      summary.textContent = "Review saved text";
      details.append(summary, saved);
      use.type = keep.type = "button";
      use.className = keep.className = "button secondary";
      use.textContent = "Use saved text";
      keep.textContent = "Replace saved text with my draft";
      use.addEventListener("click", () => {
        editor.useSaved();
        el.value = editor.value;
        paint(binding);
        writeHint("Saved text loaded.");
        el.focus();
      });
      keep.addEventListener("click", () => {
        try {
          const ok = editor.keepDraft();
          paint(binding, !ok);
          if (ok) writeHint("Your chosen draft is saved on this device.");
        } catch (failure) {
          paint(binding, false, failure.message);
        }
        el.focus();
      });
      box.append(message, details, use, keep);
      binding.notice = box;
      binding.parts = { message, saved, keep };
      el.insertAdjacentElement("afterend", box);
    }
    const message = error
      ? `Your draft has not been saved: ${error}${/[.!?]$/.test(error) ? "" : "."} Correct it here, or use the saved text.`
      : "This field changed elsewhere. Your draft has not overwritten it. Review the saved text and choose which version to keep.";
    if (binding.parts.message.textContent !== message) binding.parts.message.textContent = message;
    const saved = editor.saved.value || "(empty)";
    if (binding.parts.saved.textContent !== saved) binding.parts.saved.textContent = saved;
    binding.parts.keep.hidden = !conflict || !!error;
    writeHint("Draft needs attention before leaving or exporting.");
  }

  return {
    get hasDrafts() {
      return drafts.size > 0;
    },
    hasDraftsFor(scope) {
      return [...drafts.keys()].some((key) => JSON.parse(key)[0] === scope);
    },
    locationsFor(scope) {
      return [...drafts.keys()]
        .map((key) => JSON.parse(key))
        .filter(([owner]) => owner === scope)
        .map(([, topic, field]) => ({ topic, field }));
    },
    bind(root, { scope, topic, read, write, hint = () => {}, canSave = () => true }) {
      bindings = [];
      for (const el of root.querySelectorAll("[data-field]")) {
        const field = el.dataset.field,
          key = JSON.stringify([scope, topic, field]);
        const prior = drafts.get(key);
        const editor = createTextEditor({ read: () => read(field), write: (value) => write(field, value), canSave, ...prior });
        const binding = { el, editor, key, writeHint: hint };
        bindings.push(binding);
        // Set the DOM value directly; HTML parsing substitutes null characters.
        el.value = editor.value;
        if (prior) {
          try {
            paint(binding, !editor.refresh(el.value));
          } catch (error) {
            paint(binding, false, error.message);
          }
        }
        el.addEventListener("input", () => {
          try {
            const saved = editor.input(el.value);
            paint(binding, !saved);
            if (saved) hint("Saved on this device.");
          } catch (e) {
            paint(binding, false, e.message);
          }
        });
      }
    },
    refresh() {
      for (const b of bindings) {
        if (!b.el.isConnected) continue;
        const focused = b.el.ownerDocument.activeElement === b.el,
          start = b.el.selectionStart,
          end = b.el.selectionEnd;
        try {
          if (b.editor.refresh(b.el.value)) {
            b.el.value = b.editor.value;
            paint(b);
            if (focused) b.el.setSelectionRange(Math.min(start, b.el.value.length), Math.min(end, b.el.value.length));
          } else paint(b, true);
        } catch (error) {
          paint(b, false, error.message);
        }
      }
    },
  };
}

export function draftSummary(items, byId) {
  if (!items.length) return "";
  const esc = (text) => String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const tabs = { notes: "notes", evidence: "practice", assessment: "assess" };
  return `<section class="callout"><h2>Unsaved drafts</h2><p>Open these fields to finish an account check or resolve a conflict. Keep this tab open or copy any text you need before leaving.</p><ul>${items.map(({ topic, field }) => `<li><a href="#lesson/${encodeURIComponent(topic)}/${tabs[field] || "notes"}">${esc(topic)} · ${esc(byId[topic]?.title || topic)} · ${esc(field)}</a></li>`).join("")}</ul></section>`;
}
