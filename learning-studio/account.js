// Account records live in a dedicated table; Algo Studio's documents are untouched.
export class Account {
  constructor({
    client,
    ids,
    switchUser,
    store,
    status,
    changed,
    table,
    kind,
    model,
    authStorage,
    reload = () => {},
    restartClient,
    confirmed = () => {},
    identity = () => {},
    canSignOut = () => true,
  }) {
    Object.assign(this, {
      client,
      ids,
      switchUser,
      store,
      status,
      changed,
      table,
      kind,
      model,
      authStorage,
      reload,
      restartClient,
      confirmed,
      identity,
      canSignOut,
    });
    this.user = null;
    this.generation = 0;
    this.busy = false;
    this.pending = false;
    this.authEpoch = 0;
    this.readEpoch = 0;
    this.textConfirmed = false;
  }
  async start() {
    const client = this.client,
      epoch = ++this.authEpoch;
    client.auth.onAuthStateChange((event, session) => {
      // getSession owns initial selection; INITIAL_SESSION null may mean refresh is offline.
      if (event === "INITIAL_SESSION" || this.deviceSignedOut || this.authEpoch !== epoch) return;
      if (event === "SIGNED_OUT" && this.authStorage?.cachedUser()) return;
      setTimeout(() => {
        if (!this.deviceSignedOut && this.authEpoch === epoch) this.select(session?.user || null);
      }, 0);
    });
    const cached = this.authStorage?.cachedUser();
    if (cached) await this.select(cached, { offline: true });
    const generation = this.generation;
    try {
      const { data, error } = await client.auth.getSession();
      if (this.authEpoch !== epoch || this.generation !== generation || this.deviceSignedOut) return;
      if (error) {
        if (error.name !== "AuthRetryableFetchError") {
          await this.select(null);
          throw error;
        }
        await this.select(cached, { offline: true });
        this.status(
          cached
            ? "Account connection paused · using this account’s saved workspace locally. Export a backup before clearing browser data."
            : "Account connection paused · guest workspace is local; account work is not merged into it."
        );
      } else await this.select(data.session?.user || null);
    } finally {
      if (this.authEpoch === epoch && !this.interval) this.interval = setInterval(() => this.sync(), 30000);
    }
  }
  async select(user, { offline = false } = {}) {
    if (this.deviceSignedOut && user) return;
    const same = this.initialized && this.user?.id === user?.id;
    if (same && this.offline === offline) {
      this.user = user;
      this.identity(user);
      return;
    }
    this.initialized = true;
    this.offline = offline;
    this.user = user;
    if (user) this.lastUserId = user.id;
    this.generation++;
    this.readEpoch++;
    this.textConfirmed = false;
    this.pending = false;
    if (!same) this.switchUser(user);
    else this.identity(user);
    if (user && !offline) {
      await this.sync({ announce: true });
    } else if (!user && !offline) {
      this.status("Guest workspace · sign in to sync across devices.");
    }
  }
  queue() {
    if (!this.user) return;
    this.pending = true;
    this.status(this.offline ? "Saved locally · account connection is paused." : "Saved on this device · waiting to sync…");
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.sync(), 1200);
  }
  async sync({ announce = false, reconfirm = false } = {}) {
    if (reconfirm) {
      this.textConfirmed = false;
      this.readEpoch++;
    }
    if (this.deviceSignedOut || this.busy) return;
    if (this.offline) {
      const generation = this.generation;
      try {
        const { data, error } = await this.client.auth.getSession();
        if (this.generation !== generation || this.deviceSignedOut) return;
        if (error) return;
        await this.select(data.session?.user || null);
      } catch {
        /* Keep the selected cached workspace until auth can resolve. */
      }
      return;
    }
    if (!this.user) return;
    const user = this.user,
      generation = this.generation,
      store = this.store();
    const current = () => this.generation === generation;
    let remoteChanged = false;
    const recovering = this.syncError,
      queued = this.pending,
      readEpoch = this.readEpoch;
    this.busy = true;
    this.textConfirmed = false;
    if (announce) this.status("Syncing your learning workspace…");
    try {
      const { data, error } = await this.client.from(this.table).select("lesson_id,record").eq("user_id", user.id);
      if (error) throw error;
      if (!current() || readEpoch !== this.readEpoch) return;
      const remote = { kind: this.kind, version: 1, profile: { id: "ifeanyi", name: "Account" }, lessons: {} };
      for (const row of data) remote.lessons[row.lesson_id] = row.record;
      this.model.parseBackup(JSON.stringify(remote), this.ids);
      const beforeRead = store.exportBackup("ifeanyi", "Account").lessons;
      store.importBackup("ifeanyi", remote);
      remoteChanged = !this.model.sameLessons(beforeRead, store.exportBackup("ifeanyi", "Account").lessons);
      this.textConfirmed = true;
      this.confirmed();
      const snapshot = store.exportBackup("ifeanyi", "Account");
      const held = [];
      const rows = Object.entries(snapshot.lessons)
        .map(([id, source]) => {
          const filtered = this.model.syncableRecord(source);
          held.push(...filtered.held.map((field) => `${id}/${field}`));
          return [id, filtered.record];
        })
        .filter(([id, record]) => {
          const saved = remote.lessons[id] || { values: {}, changed: {} };
          return !this.model.sameRecord(this.model.mergeRecords(saved, record), saved);
        })
        .map(([id, record]) => ({ user_id: user.id, lesson_id: id, record }));
      this.pending = false;
      if (rows.length) {
        const result = await this.client.from(this.table).upsert(rows, { onConflict: "user_id,lesson_id" }).select("lesson_id,record");
        if (result.error) throw result.error;
        if (!current()) return;
        // The server merges concurrent field edits atomically. Merge its returned result too.
        const merged = { ...remote, lessons: {} };
        for (const row of result.data) merged.lessons[row.lesson_id] = this.model.mergeRecords(store.record("ifeanyi", row.lesson_id), row.record);
        const beforeWrite = store.exportBackup("ifeanyi", "Account").lessons;
        store.importBackup("ifeanyi", merged);
        remoteChanged ||= !this.model.sameLessons(beforeWrite, store.exportBackup("ifeanyi", "Account").lessons);
      }
      if (!current()) return;
      this.syncError = held.length > 0;
      if (remoteChanged) this.changed();
      if (held.length) {
        this.pending = true;
        this.status(
          `Other progress synced. Text kept on this device: ${held.join(", ")}. Open those fields and remove null or incomplete Unicode characters. Export a backup before leaving.`
        );
      } else if (announce || recovering || queued || rows.length || remoteChanged)
        this.status(this.pending ? "Your latest change will sync shortly." : "Progress synced · your workspace is ready on other devices.");
    } catch (error) {
      if (current()) {
        this.syncError = true;
        this.textConfirmed = false;
        this.status(
          `Sync paused · ${error.message || "Check your connection and try again."} Your work remains in this workspace; export a backup if needed.`
        );
      }
    } finally {
      this.busy = false;
      if (!current() || readEpoch !== this.readEpoch) this.sync();
    }
  }
  async signOut({ force = false, external = false } = {}) {
    if (force && !external && !this.canSignOut())
      throw Error("Copy or resolve this account’s unsaved drafts before signing out. Use the saved text only after keeping any draft you need.");
    if (this.busy && !force) throw Error("Wait for syncing to finish, then sign out.");
    if (!force) await this.sync();
    if (!force && !this.canSignOut()) throw Error("Copy or resolve this account’s unsaved drafts before signing out.");
    if (!force && this.syncError && (this.pending || Object.keys(this.store().exportBackup("ifeanyi", "Account").lessons).length))
      throw Error("Progress could not sync. Export a backup, then choose Sign out on this device to leave while keeping cached work.");
    clearTimeout(this.timer);
    if (force && this.authStorage) {
      // No network dependency: dispose refresh callbacks, clear only this studio's auth,
      // then create a fresh SDK client so cancelled navigation cannot leave a half-signed-out page.
      this.deviceSignedOut = true;
      this.authEpoch++;
      this.generation++;
      this.textConfirmed = false;
      try {
        this.authStorage.deactivate();
        this.authStorage.clear();
      } catch (error) {
        this.deviceSignedOut = false;
        throw Error(
          `Could not clear this device’s sign-in storage: ${error.message}. Close this browser profile or clear this studio’s sign-in data before sharing it.`
        );
      }
      try {
        await this.client.auth.dispose?.();
      } catch {
        /* Retired storage and epoch already isolate the old client. */
      }
      await this.select(null);
      if (this.restartClient) {
        Object.assign(this, this.restartClient());
        this.deviceSignedOut = false;
        await this.start();
      } else this.reload();
      return;
    }
    const { error } = await this.client.auth.signOut({ scope: "local" });
    // SDK can remove the session yet report a failed server revocation.
    if (error && (!this.authStorage || this.authStorage.getItem(this.authStorage.key) !== null)) throw error;
    this.authStorage?.clear();
    await this.select(null);
    if (this.restartClient) {
      this.authEpoch++;
      await this.client.auth.dispose?.();
      Object.assign(this, this.restartClient());
      await this.start();
    }
  }
  async sessionRemoved(event = {}) {
    if ((!this.user && !this.lastUserId) || this.deviceSignedOut) return;
    let removedId = this.lastUserId;
    try {
      removedId = JSON.parse(event.oldValue)?.user?.id || removedId;
    } catch {}
    // Do not erase a different account that signed in after this queued event.
    const next = this.authStorage?.cachedUser();
    if (next && next.id !== removedId && this.restartClient) {
      if (this.user?.id === next.id) return;
      this.authEpoch++;
      this.generation++;
      this.authStorage.deactivate();
      await this.client.auth.dispose?.();
      await this.select(null);
      Object.assign(this, this.restartClient());
      await this.start();
    } else await this.signOut({ force: true, external: true });
  }
}
