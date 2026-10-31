// Coalesce another tab's import/sync writes before reading the active workspace.
export function storageListener(prefix, refresh, schedule = (callback) => setTimeout(callback, 50)) {
  let pending = false;
  return (event) => {
    if (!event.key?.startsWith(prefix()) || pending) return;
    pending = true;
    schedule(() => {
      pending = false;
      refresh();
    });
  };
}
