// Account records live in a dedicated table; Algo Studio's documents are untouched.
import { parseBackup, mergeRecords, sameRecord, sameLessons } from "./model.js?v=20261030-5";
export class Account {
  constructor({ client, ids, switchUser, store, status, changed }) {
    Object.assign(this, { client, ids, switchUser, store, status, changed });
    this.user = null;
    this.generation = 0;
    this.busy = false;
    this.pending = false;
  }
  async start() {
    this.client.auth.onAuthStateChange((_event, session) => setTimeout(() => this.select(session?.user || null), 0));
    const { data, error } = await this.client.auth.getSession();
    if (error) throw error;
    await this.select(data.session?.user || null);
    this.interval = setInterval(() => this.sync(), 30000);
  }
  async select(user) {
    if (this.initialized && this.user?.id === user?.id) return;
    this.initialized = true;
    this.user = user;
    this.generation++;
    this.pending = false;
    this.switchUser(user);
    if (user) await this.sync();
    else this.status("Guest workspace · sign in to sync across devices.");
  }
  queue() {
    if (!this.user) return;
    this.pending = true;
    this.status("Saved on this device · waiting to sync…");
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.sync(), 1200);
  }
  async sync() {
    if (!this.user || this.busy) return;
    const user = this.user,
      generation = this.generation,
      store = this.store();
    const current = () => this.generation === generation;
    const before = store.exportBackup("ifeanyi", "Account").lessons;
    this.busy = true;
    this.status("Syncing your learning workspace…");
    try {
      const { data, error } = await this.client.from("cyber_progress").select("lesson_id,record").eq("user_id", user.id);
      if (error) throw error;
      if (!current()) return;
      const remote = { kind: "cyber-studio-progress", version: 1, profile: { id: "ifeanyi", name: "Account" }, lessons: {} };
      for (const row of data) remote.lessons[row.lesson_id] = row.record;
      parseBackup(JSON.stringify(remote), this.ids);
      store.importBackup("ifeanyi", remote);
      const snapshot = store.exportBackup("ifeanyi", "Account");
      const rows = Object.entries(snapshot.lessons)
        .filter(([id, r]) => !sameRecord(r, remote.lessons[id]))
        .map(([id, record]) => ({ user_id: user.id, lesson_id: id, record }));
      this.pending = false;
      if (rows.length) {
        const result = await this.client.from("cyber_progress").upsert(rows, { onConflict: "user_id,lesson_id" }).select("lesson_id,record");
        if (result.error) throw result.error;
        if (!current()) return;
        // The server merges concurrent field edits atomically. Merge its returned result too.
        const merged = { ...remote, lessons: {} };
        for (const row of result.data) merged.lessons[row.lesson_id] = mergeRecords(store.record("ifeanyi", row.lesson_id), row.record);
        store.importBackup("ifeanyi", merged);
      }
      if (!current()) return;
      this.syncError = false;
      if (!sameLessons(before, store.exportBackup("ifeanyi", "Account").lessons)) this.changed();
      this.status(this.pending ? "Your latest change will sync shortly." : "Progress synced · your workspace is ready on other devices.");
    } catch (error) {
      if (current()) {
        this.syncError = true;
        this.status(
          `Sync paused · ${error.message || "Check your connection and try again."} Your work remains in this workspace; export a backup if needed.`
        );
      }
    } finally {
      this.busy = false;
      if (!current()) this.sync();
    }
  }
  async signOut({ force = false } = {}) {
    if (this.busy && !force) throw Error("Wait for syncing to finish, then sign out.");
    if (!force) await this.sync();
    if (!force && this.syncError && (this.pending || Object.keys(this.store().exportBackup("ifeanyi", "Account").lessons).length))
      throw Error("Progress could not sync. Export a backup, then choose Sign out on this device to leave while keeping cached work.");
    clearTimeout(this.timer);
    const { error } = await this.client.auth.signOut({ scope: "local" });
    if (error) throw error;
    await this.select(null);
  }
}
