import { initialState, validBackup, upgradeState } from "./learning-state.js?v=20261027-course2";
import { ProgressReplica, validDocument } from "./progress-sync.js?v=20261027-course2";
const copy = (x) => JSON.parse(JSON.stringify(x));
export class AccountSync {
  constructor({ client, storage, getState, setState, canApply, onStatus }) {
    Object.assign(this, { client, storage, getState, setState, canApply, onStatus });
    this.loaded = false;
    this.user = null;
    this.replica = null;
    this.dirty = false;
    this.generation = 0;
    this.busy = false;
    this.timer = null;
    this.message = "Sign in to save your progress across devices.";
    this.writer = crypto.randomUUID();
    this.device = storage.getItem("algo-studio-device") || crypto.randomUUID();
    storage.setItem("algo-studio-device", this.device);
  }
  status(message) {
    this.message = message;
    this.onStatus(this);
  }
  async start() {
    this.client.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => this.switchUser(session?.user || null), 0);
    });
    const { data, error } = await this.client.auth.getSession();
    if (error) throw error;
    await this.switchUser(data.session?.user || null);
    this.interval = setInterval(() => this.sync(), 20000);
    window.addEventListener("online", () => this.sync());
    window.addEventListener("focus", () => this.sync());
    document.addEventListener("visibilitychange", () => this.sync());
  }
  async switchUser(user) {
    if (this.initialized && this.user?.id === user?.id) {
      this.user = user;
      this.onStatus(this);
      return;
    }
    this.initialized = true;
    this.loaded = false;
    this.generation++;
    this.user = user;
    this.replica = null;
    this.dirty = false;
    clearTimeout(this.timer);
    if (!user) {
      this.setState(this.readGuest(), true);
      this.status("Progress is saved in this browser. Sign in to use it on other devices.");
      return;
    }
    let cache;
    try {
      cache = JSON.parse(this.storage.getItem(this.key()));
    } catch {}
    const state = validBackup(cache?.state) ? upgradeState(cache.state) : initialState();
    this.replica = new ProgressReplica(`${this.device}:${this.writer}`, state, cache?.document);
    this.dirty = !!cache?.dirty;
    this.setState(state, true);
    this.status("Loading your account’s progress…");
    await this.sync();
  }
  key() {
    return `algo-studio-account:${this.user.id}`;
  }
  readGuest() {
    try {
      const s = JSON.parse(this.storage.getItem("algo-studio-v1"));
      if (validBackup(s)) return upgradeState(s);
    } catch {}
    return initialState();
  }
  hasGuest() {
    const s = this.readGuest();
    return (
      this.user &&
      this.storage.getItem(`${this.key()}:imported-guest`) !== JSON.stringify(s) &&
      (Object.keys(s.done).length > 0 ||
        Object.keys(s.drafts).length > 0 ||
        Object.keys(s.practice).length > 0 ||
        Object.keys(s.systemDesign).length > 0 ||
        Object.keys(s.reasoning).length > 0)
    );
  }
  persist() {
    // Another open tab may have saved offline changes since our last read.
    let cache;
    try {
      cache = JSON.parse(this.storage.getItem(this.key()));
    } catch {}
    if (validDocument(cache?.document) && this.replica.merge(cache.document)) this.dirty = true;
    this.storage.setItem(
      this.key(),
      JSON.stringify({ state: this.replica.state(this.getState()), document: this.replica.document, dirty: this.dirty })
    );
  }
  changed() {
    if (!this.user || !this.replica) return false;
    if (this.replica.observe(this.getState())) this.dirty = true;
    this.persist();
    this.status("Saved on this device. Waiting to sync…");
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.sync(), 1200);
    return true;
  }
  importGuest() {
    if (!this.user || !this.replica) return;
    const guest = this.readGuest(),
      temp = new ProgressReplica(`${this.device}:${this.writer}`);
    temp.observe(guest, Math.max(Date.now(), this.replica.clock + 1));
    this.replica.merge(temp.document);
    this.dirty = true;
    const state = this.replica.state(this.getState());
    this.replica.accept(state);
    this.setState(state, true);
    this.storage.setItem(`${this.key()}:imported-guest`, JSON.stringify(guest));
    this.persist();
    this.sync();
  }
  async sync() {
    if (!this.user || !this.replica || this.busy) return;
    const user = this.user,
      replica = this.replica,
      generation = this.generation;
    const current = () => generation === this.generation;
    this.busy = true;
    this.status("Syncing your progress…");
    try {
      const { data, error } = await this.client.from("learning_progress").select("document").eq("user_id", user.id);
      if (error) throw error;
      if (!current()) return;
      for (const row of data) replica.merge(row.document);
      // Validate the merged state before uploading or replacing a local workspace.
      let merged = replica.state(this.getState());
      this.loaded = true;
      if (this.canApply()) {
        // Rendering can create a starter draft. Keep that new draft observable
        // as a local edit instead of accepting fields absent from the replica.
        replica.accept(merged);
        if (JSON.stringify(merged) !== JSON.stringify(this.getState())) this.setState(merged, false);
      }
      if (this.dirty) {
        const document = copy(replica.document);
        this.dirty = false;
        const { error } = await this.client
          .from("learning_progress")
          .upsert({ user_id: user.id, device_id: this.device, document, updated_at: new Date().toISOString() }, { onConflict: "user_id,device_id" });
        if (!current()) return;
        if (error) {
          this.dirty = true;
          throw error;
        }
      }
      this.persist();
      this.status(
        this.dirty
          ? "Your latest change will sync shortly."
          : this.canApply()
            ? "Progress is synced. You can continue on another device."
            : "Progress is synced. New changes will appear when you leave the editor."
      );
    } catch (error) {
      if (current()) {
        this.dirty = true;
        let kept = true;
        try {
          this.persist();
        } catch {
          kept = false;
        }
        this.status(
          kept
            ? `Your work is kept on this device. Sync couldn’t finish: ${error.message || "Check your connection, then try again."}`
            : "Progress could not be saved. Keep this tab open and export a backup before refreshing."
        );
      }
    } finally {
      this.busy = false;
      if (!current()) this.sync();
    }
  }
  async continueWithGoogle(redirectTo) {
    const userId = this.user?.id;
    const options = { redirectTo, queryParams: { prompt: "select_account" } };
    if (userId) {
      if (this.busy) throw Error("Your progress is syncing. Try again in a moment.");
      await this.sync();
      if (this.user?.id !== userId) throw Error("Your account changed. Open Account & sync and try again.");
      if (!this.loaded || this.dirty || this.busy)
        throw Error("Your progress must finish syncing before connecting Google. Reconnect and try again, or export a backup.");
      const { data, error } = await this.client.auth.getUser();
      if (error) throw error;
      if (data.user?.id !== userId || this.user?.id !== userId) throw Error("Sign in to your learning account again before connecting Google.");
      if (this.dirty || this.busy) throw Error("Your latest change is still syncing. Try connecting Google again in a moment.");
      // Link to the existing user ID, including when the Google email differs.
      // Signing in with OAuth here would instead risk selecting another account.
      const result = await this.client.auth.linkIdentity({ provider: "google", options });
      if (result.error) throw result.error;
    } else {
      const { error } = await this.client.auth.signInWithOAuth({ provider: "google", options });
      if (error) throw error;
    }
  }
  async signOut() {
    if (this.busy) throw Error("Wait for the current sync to finish, then sign out.");
    await this.sync();
    if (this.dirty)
      throw Error("Some progress is still waiting to sync. Reconnect and try again, and try again. You can also export a backup of your work.");
    const { error } = await this.client.auth.signOut({ scope: "local" });
    if (error) throw error;
    await this.switchUser(null);
  }
}
