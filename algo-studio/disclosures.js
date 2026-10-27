// Keep disclosure choices through page updates. Nothing is stored in learner progress.
function entries(root) {
  const occurrences = new Map();
  return [...root.querySelectorAll("details")]
    .filter((d) => d.id !== "solved-example")
    .map((detail) => {
      const path = [];
      for (let node = detail; node && node !== root; node = node.parentElement) {
        if (node.tagName === "DETAILS") {
          const title = node.querySelector(":scope > summary strong") || node.querySelector(":scope > summary");
          path.unshift(node.id || title?.textContent.trim() || "");
        }
      }
      const label = JSON.stringify(path);
      const occurrence = occurrences.get(label) || 0;
      occurrences.set(label, occurrence + 1);
      return [label + ":" + occurrence, detail];
    });
}
export function captureDisclosures(root) {
  return new Map(entries(root).map(([key, detail]) => [key, detail.open]));
}
export function restoreDisclosures(root, saved) {
  if (!saved) return;
  for (const [key, detail] of entries(root)) if (saved.has(key)) detail.open = saved.get(key);
}
