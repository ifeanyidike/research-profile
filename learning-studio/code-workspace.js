import { renderCode } from "./code-editor.js?v=20261106-4";
import { createModel } from "./model.js?v=20261106-4";
import { Account } from "./account.js?v=20261106-4";
import { createTextFields } from "./text-fields.js?v=20261106-4";
import { createPythonRunner } from "./python-runner.js?v=20261106-4";
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function createCodeWorkspace({ storage, definitions, parentAccount, changed = () => {}, clock = Date.now, runner = createPythonRunner() }) {
  const model = createModel("voice-ai-studio", { codeOnly: true });
  const ids = new Set(Object.keys(definitions.editors));
  const fields = createTextFields();
  const getBase = model.workspaceStores(storage, ids, clock, (ok) => {
    durable = ok;
    paintStatus();
  });
  const wrappers = new Map(),
    historyMemory = new Map();
  let current,
    owner = "guest",
    profile = "ifeanyi",
    user = null,
    root,
    topic,
    durable = true,
    message = "",
    exported = false;
  const historyKey = (scope, learner, id) => `${model.PREFIX}${scope}:${learner}:${id}:history`;
  function history(scope, learner, id) {
    const key = historyKey(scope, learner, id);
    if (historyMemory.has(key)) return historyMemory.get(key);
    try {
      const rows = JSON.parse(storage.getItem(key) || "[]");
      const valid = Array.isArray(rows)
        ? rows.filter((r) => typeof r.code === "string" && r.code.length <= 20000 && Number.isSafeInteger(r.changed)).slice(0, 3)
        : [];
      historyMemory.set(key, valid);
      return valid;
    } catch {
      return [];
    }
  }
  function remember(scope, learner, id, record) {
    if (record.values.code === undefined) return;
    const row = { code: record.values.code, changed: record.changed.code };
    const rows = [row, ...history(scope, learner, id).filter((r) => r.code !== row.code)].slice(0, 3);
    const key = historyKey(scope, learner, id);
    historyMemory.set(key, rows);
    try {
      storage.setItem(key, JSON.stringify(rows));
    } catch {
      durable = false;
    }
  }
  function getStore(scope) {
    if (!wrappers.has(scope)) {
      const base = getBase(scope);
      wrappers.set(scope, {
        ...base,
        importBackup(learner, backup) {
          // Keep the previous local code if a newer remote/backup version replaces it.
          const plan = base.backupPlan(learner, backup);
          for (const [id, incoming] of Object.entries(plan.checked.lessons)) {
            const old = base.record(learner, id),
              next = model.mergeRecords(old, incoming);
            if (old.values.code !== next.values.code) remember(scope, learner, id, old);
          }
          return base.importBackup(learner, backup);
        },
      });
    }
    return wrappers.get(scope);
  }
  const sync = new Account({
    client: null,
    ids,
    table: "voice_ai_code",
    kind: "voice-ai-studio-python-code",
    model,
    switchUser: () => {},
    store: () => current,
    status: (text) => {
      message = text
        .replace(/Progress/g, "Python work")
        .replace(/progress/g, "Python work")
        .replace(/learning workspace/g, "Python workspace");
      paintStatus();
    },
    confirmed: () => fields.refresh(),
    changed: () => {
      fields.refresh();
      changed();
    },
  });
  function paintStatus() {
    if (!root?.isConnected) return;
    const text = !durable
      ? "Code is only kept in this open tab. Browser storage is unavailable or full; download your work before leaving."
      : message || (user ? "Python code saved on this device." : "Saved on this device · sign in to sync Python code across devices.");
    for (const el of root.querySelectorAll(".code-save-status")) el.textContent = text;
  }
  function select(next, learner) {
    const scope = next ? `account:${next.id}` : "guest";
    if (scope === owner && learner === profile && current) return;
    runner.stop("Stopped because the learner changed.");
    owner = scope;
    profile = learner;
    user = next;
    current = getStore(scope);
    message = "";
    exported = false;
    const parent = parentAccount();
    sync.client = parent?.client;
    // The progress account owns auth. This second store never subscribes to or changes auth.
    sync.select(next, { offline: !!parent?.offline }).catch((error) => {
      message = "Python sync paused: " + error.message;
      paintStatus();
    });
  }
  function reconfirm() {
    const parent = parentAccount();
    if (!parent || !current || !user || parent.user?.id !== user.id) return;
    sync.client = parent.client;
    sync.offline = !!parent.offline;
    sync.sync({ reconfirm: true });
  }
  async function flush() {
    if (!user) return;
    const scope = owner,
      deadline = Date.now() + 15000;
    while (sync.busy && Date.now() < deadline) await new Promise((resolve) => setTimeout(resolve, 50));
    if (owner !== scope) throw Error("The learner changed while Python work was syncing.");
    if (sync.busy) throw Error("Python work is still syncing. Wait, or download a Python backup in My notebook.");
    const parent = parentAccount();
    sync.client = parent.client;
    await sync.sync({ announce: true });
    if (sync.syncError || sync.pending)
      throw Error("Python work could not finish syncing. Download a Python backup in My notebook before signing out on this device.");
  }
  function bind(host, lesson) {
    root = host;
    topic = lesson;
    const boundStore = current,
      boundOwner = owner,
      boundProfile = profile;
    for (const panel of host.querySelectorAll(".studio-code-editor[data-code-id]")) {
      const id = `${lesson}:${panel.dataset.codeId}`;
      if (!ids.has(id)) continue;
      const input = panel.querySelector(".code-input");
      input.dataset.codeField = panel.dataset.codeId;
      for (const row of history(boundOwner, boundProfile, id)) {
        const box = document.createElement("details");
        box.className = "code-recovery";
        const summary = document.createElement("summary");
        summary.textContent = "Recover earlier local code";
        const pre = document.createElement("pre");
        pre.textContent = row.code;
        const restore = document.createElement("button");
        restore.type = "button";
        restore.textContent = "Use this earlier code";
        restore.addEventListener("click", () => {
          input.value = row.code;
          input.dispatchEvent(new Event("input", { bubbles: true }));
        });
        box.append(summary, pre, restore);
        panel.append(box);
      }
    }
    fields.bind(host, {
      scope: `${boundOwner}:${boundProfile}`,
      topic: lesson,
      selector: "[data-code-field]",
      dataKey: "codeField",
      protectFocused: true,
      read: (field) => {
        const r = boundStore.record(boundProfile, `${lesson}:${field}`);
        return { value: r.values.code ?? definitions.editors[`${lesson}:${field}`].code, changed: r.changed.code };
      },
      write: (field, value) => {
        boundStore.update(boundProfile, `${lesson}:${field}`, { code: value });
        exported = false;
        if (boundOwner === owner && boundProfile === profile) {
          message = "";
          sync.queue();
        }
      },
      updated: (input) => input.dispatchEvent(new Event("code-refresh")),
      anchor: (input) => input.closest(".studio-code-editor"),
      hint: () => paintStatus(),
    });
    paintStatus();
  }
  function payload(editor, code, stdin = "") {
    const main = `${topic}:example`;
    const setup =
      editor !== "example" && editor !== "practice" && definitions.editors[main]
        ? (current.record(profile, main).values.code ?? definitions.editors[main].code)
        : "";
    return { code, setup, stdin, files: definitions.files[topic] || {} };
  }
  function notebook() {
    const saved = [...ids].filter((id) => current.record(profile, id).values.code !== undefined);
    const drafts = fields.locationsFor(`${owner}:${profile}`);
    return `<section class="notebook-entry"><h2>Your saved Python work</h2><p class="code-save-status" role="status"></p><p>Code is kept separately for this learner. Guest work stays on this browser; signed-in work syncs when connected.</p><ul>${saved
      .map((id) => {
        const d = definitions.editors[id];
        return `<li><a href="#lesson/${d.lesson}/${d.tab}/${d.editor}">${esc(d.lesson)} · ${esc(d.label)}</a></li>`;
      })
      .join(
        ""
      )}</ul>${saved.length ? "" : "<p>No saved code yet. Edit a lesson example or open a Python workspace in Practise. You can also restore a Python backup below.</p>"}${drafts.length ? '<p role="alert">Some Python drafts need attention. Open their lesson to copy or resolve them before leaving.</p>' : ""}<details><summary>Python backups</summary><button type="button" id="export-python">Download all Python work</button><label>Restore a Python backup<input id="import-python" type="file" accept=".json,application/json" /></label><div id="python-import-preview"></div></details></section>`;
  }
  function bindNotebook(host, name) {
    host.querySelector("#export-python")?.addEventListener("click", () => {
      const url = URL.createObjectURL(new Blob([JSON.stringify(current.exportBackup(profile, name), null, 2)], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "voice-ai-python-work.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      exported = true;
    });
    host.querySelector("#import-python")?.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      event.target.value = "";
      if (!file) return;
      const target = current,
        learner = profile,
        scope = owner,
        preview = host.querySelector("#python-import-preview");
      try {
        if (file.size > 32000000) throw Error("Choose a backup smaller than 32 MB.");
        const data = model.parseBackup(await file.text(), ids, { fromFile: true });
        if (target !== current || learner !== profile || scope !== owner || !preview.isConnected) return;
        target.backupPlan(learner, data);
        preview.replaceChildren();
        const p = document.createElement("p");
        p.textContent = `Ready to merge ${Object.keys(data.lessons).length} saved editors into ${name}'s Python work. Newer existing versions are kept.`;
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Import into this learner";
        button.addEventListener("click", () => {
          if (target !== current || learner !== profile || scope !== owner) return;
          target.importBackup(learner, data);
          sync.queue();
          changed();
        });
        preview.append(p, button);
      } catch (error) {
        if (preview.isConnected) preview.textContent = error.message;
      }
    });
  }
  return {
    runner,
    select,
    bind,
    payload,
    notebook,
    practiceMarkup(lesson) {
      const d = definitions.editors[`${lesson}:practice`];
      return d
        ? `<details class="python-practice-workspace"><summary>Open a Python workspace for this exercise</summary>${renderCode(d.code, "python", "practice")}</details>`
        : "";
    },
    bindNotebook,
    reconfirm,
    flush,
    refresh: () => fields.refresh(),
    hasUnsaved: () => fields.hasDrafts || (!durable && !exported),
    canSignOut: () => !fields.hasDraftsFor(`${owner}:${profile}`) && (durable || exported),
    storageEvent(event) {
      if (event.key?.startsWith(`${model.PREFIX}${owner}:`)) {
        fields.refresh();
        reconfirm();
      }
    },
    stop: () => runner.stop("Stopped because you left this editor."),
  };
}
