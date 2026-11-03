// Defer a changing view while the learner is using it; one listener owns the wait.
export function createViewRefresh(root, render, blocked = () => false, schedule = (fn) => setTimeout(fn, 0)) {
  let dirty = false,
    scheduled = false;
  function flush() {
    const focused = root.ownerDocument.activeElement;
    if (!dirty || blocked() || (focused !== root && root.contains(focused))) return;
    dirty = false;
    render();
  }
  function later() {
    if (scheduled) return;
    scheduled = true;
    schedule(() => {
      scheduled = false;
      flush();
    });
  }
  root.addEventListener("focusout", later);
  root.ownerDocument.addEventListener("close", later, true);
  return {
    request() {
      dirty = true;
      flush();
    },
    reset() {
      dirty = false;
    },
  };
}
