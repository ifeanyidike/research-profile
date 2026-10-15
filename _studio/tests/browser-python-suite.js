(async () => {
  const { lessons } = await import("/algo-studio/curriculum.js");
  const { checkpoints, transferTasks } = await import("/algo-studio/practice-bank.js");
  const exercises = [...lessons, ...Object.values(checkpoints), ...Object.values(transferTasks)];
  const worker = new Worker("/algo-studio/python-worker.js", { type: "module" });
  const request = (payload) =>
    new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        worker.terminate();
        reject(Error("Python suite timed out"));
      }, 20000);
      worker.onmessage = ({ data }) => {
        clearTimeout(timer);
        if (data.type === "error") reject(Error(data.message));
        else resolve(data);
      };
      worker.onerror = (e) => {
        clearTimeout(timer);
        reject(Error(e.message));
      };
      worker.postMessage(payload);
    });
  try {
    await request({ type: "init" });
    let cases = 0;
    for (const l of exercises) {
      const result = await request({ type: "run", id: l.id, code: l.solution, tests: l.tests });
      if (!result.results.every((r) => r.passed)) throw Error("Lesson " + l.id + ": " + JSON.stringify(result.results));
      cases += result.results.length;
    }
    return { exercises: exercises.length, cases, passed: true, runtime: "Bundled Pyodide in a browser module worker" };
  } finally {
    worker.terminate();
  }
})();
