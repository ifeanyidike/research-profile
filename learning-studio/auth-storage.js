// App-owned auth persistence permits device-only logout even when refresh is offline.
export function createAuthStorage(storage, slug) {
  const key = `${slug}-auth`,
    accountKey = `${slug}-last-account`;
  let retired = false;
  return {
    key,
    accountKey,
    getItem: (name) => (retired ? null : storage.getItem(name)),
    setItem: (name, value) => {
      if (!retired) storage.setItem(name, value);
    },
    removeItem: (name) => {
      if (!retired) storage.removeItem(name);
    },
    deactivate() {
      retired = true;
    },
    cachedUser() {
      try {
        const session = JSON.parse(storage.getItem(key)),
          user = session?.user;
        return session &&
          typeof session.access_token === "string" &&
          typeof session.refresh_token === "string" &&
          Number.isFinite(session.expires_at) &&
          user &&
          typeof user.id === "string" &&
          user.id.length > 0 &&
          user.id.length <= 100 &&
          typeof user.email === "string" &&
          user.email.length <= 320
          ? { id: user.id, email: user.email, user_metadata: user.user_metadata && typeof user.user_metadata === "object" ? user.user_metadata : {} }
          : null;
      } catch {
        return null;
      }
    },
    clear() {
      retired = true;
      // Do not clear another studio's session or any learner progress.
      for (const name of [key, `${key}-user`, `${key}-code-verifier`, accountKey]) storage.removeItem(name);
    },
  };
}
