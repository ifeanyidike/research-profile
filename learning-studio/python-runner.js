// Executes only when the learner presses Run. Each run owns a fresh worker.
export function createPythonRunner({
  makeWorker = () => new Worker(new URL("./python-worker.js?v=20261106-5", import.meta.url), { type: "module" }),
  schedule = setTimeout,
  unschedule = clearTimeout,
  loadTimeout = 60000,
  runTimeout = 5000,
} = {}) {
  let active,
    serial = 0;
  function stop(message = "Execution stopped.") {
    if (!active) return;
    const job = active;
    active = null;
    unschedule(job.timer);
    job.worker.terminate();
    job.reject(new Error(message));
  }
  return {
    stop,
    run(payload, status = () => {}) {
      stop("Stopped because another run started.");
      return new Promise((resolve, reject) => {
        let worker;
        try {
          worker = makeWorker();
        } catch (error) {
          reject(error);
          return;
        }
        const id = ++serial;
        const job = { worker, reject, timer: null };
        active = job;
        const finish = (error, result) => {
          if (active !== job) return;
          active = null;
          unschedule(job.timer);
          worker.terminate();
          if (error) reject(error);
          else resolve(result);
        };
        worker.onmessage = ({ data }) => {
          if (active !== job) return;
          if (!data || typeof data !== "object") return;
          if (data.type === "ready" && !job.ready) {
            job.ready = true;
            unschedule(job.timer);
            job.timer = schedule(() => finish(new Error("Stopped after 5 seconds. Check for a loop that does not finish.")), runTimeout);
            status("Running Python…");
            worker.postMessage({ type: "run", id, ...payload });
          } else if (data.id === id && data.type === "result") {
            const result = data.result;
            if (
              !result ||
              ["output", "setupOutput", "error"].some((key) => typeof result[key] !== "string") ||
              result.output.length > 40000 ||
              result.setupOutput.length > 40000 ||
              result.error.length > 10000
            )
              finish(new Error("Python returned an unsupported result. Try Run again."));
            else finish(null, result);
          } else if (data.type === "error") finish(new Error(String(data.message || "Python could not start.")));
        };
        worker.onerror = () => finish(new Error("Python could not load or its worker stopped. Try Run again."));
        job.timer = schedule(() => finish(new Error("Python could not load in time. Check your connection and try again.")), loadTimeout);
        status("Loading Python. The first run may take a moment…");
        worker.postMessage({ type: "init" });
      });
    },
  };
}
