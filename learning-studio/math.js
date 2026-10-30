// Typeset only authored lesson/source content. Notebook inputs remain plain text.
const hasMath = (node) => /\\(?:\(|\[)/.test(node.textContent || "");

export function createTypesetter(loadEngine) {
  let engine;
  let queue = Promise.resolve();
  return {
    clear(root) {
      engine?.typesetClear([root]);
    },
    typeset(roots) {
      const targets = roots.filter(hasMath);
      if (!targets.length) return Promise.resolve();
      // MathJax requires serialized asynchronous calls. Each target belongs to
      // one render, so navigation can discard it without touching the new view.
      queue = queue
        .catch(() => {})
        .then(async () => {
          let live = targets.filter((node) => node.isConnected);
          if (!live.length) return;
          engine = await loadEngine();
          live = live.filter((node) => node.isConnected);
          if (!live.length) return;
          try {
            await engine.typesetPromise(live);
            for (const root of live.filter((node) => node.isConnected)) {
              root.querySelectorAll?.('mjx-container[display="true"]').forEach((equation) => {
                equation.tabIndex = 0; // Keyboard access to horizontally scrolling equations.
              });
            }
          } finally {
            const removed = live.filter((node) => !node.isConnected);
            if (removed.length) engine.typesetClear(removed);
          }
        });
      return queue;
    },
  };
}

let loading;
function loadEngine() {
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const base = new URL("./vendor/mathjax-3.2.2/", import.meta.url).href;
    window.MathJax = {
      loader: { paths: { mathjax: base }, load: ["a11y/assistive-mml"] },
      tex: {
        packages: ["base", "ams"],
        inlineMath: [["\\(", "\\)"]],
        displayMath: [["\\[", "\\]"]],
        processEscapes: true,
        processEnvironments: false,
        processRefs: false,
      },
      svg: { fontCache: "local" },
      options: { enableMenu: false, skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"] },
      startup: { typeset: false },
    };
    const script = document.createElement("script");
    script.src = new URL("tex-svg.js", base).href;
    script.async = true;
    script.onload = () => window.MathJax.startup.promise.then(() => resolve(window.MathJax), reject);
    script.onerror = () => {
      script.remove();
      reject(Error("The local equation renderer could not load."));
    };
    document.head.append(script);
  }).catch((error) => {
    loading = null;
    throw error;
  });
  return loading;
}
export const math = createTypesetter(loadEngine);
