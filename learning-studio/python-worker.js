// Browser Python, not a speech-model runner. The interface owns Stop/timeouts.
let runtime;
self.onmessage = async ({ data }) => {
  try {
    if (data.type === "init") {
      const base = new URL("../algo-studio/runtime/pyodide/", self.location.href).href;
      const { loadPyodide } = await import(base + "pyodide.mjs");
      runtime = await loadPyodide({ indexURL: base });
      self.postMessage({ type: "ready" });
      return;
    }
    if (data.type !== "run" || !runtime) return;
    runtime.FS.mkdirTree("/workspace");
    runtime.FS.chdir("/workspace");
    for (const [name, content] of Object.entries(data.files || {})) {
      if (!/^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/.test(name)) throw Error("Invalid lesson file name.");
      runtime.FS.writeFile(name, content);
    }
    runtime.globals.set("_studio_request", JSON.stringify({ code: data.code, setup: data.setup || "", stdin: data.stdin || "" }));
    const serialized = runtime.runPython(`
import json as _json, sys as _sys, io as _io, contextlib as _contextlib, traceback as _traceback

def _studio_execute(payload):
    class BoundedOutput(_io.TextIOBase):
        def __init__(self):
            self.parts = []
            self.size = 0
        def write(self, text):
            remaining = 20000 - self.size
            if len(text) > remaining:
                self.parts.append(text[:remaining])
                self.size = 20000
                raise RuntimeError('Output limit reached (20,000 characters).')
            self.parts.append(text)
            self.size += len(text)
            return len(text)
        def flush(self):
            pass
        def value(self):
            return ''.join(self.parts)
    namespace = {'__name__': '__main__'}
    old_stdin, old_argv = _sys.stdin, _sys.argv
    _sys.stdin, _sys.argv = _io.StringIO(payload['stdin']), ['example.py']
    result = {'output': '', 'setupOutput': '', 'error': ''}
    try:
        for phase, source, filename in [('setupOutput', payload['setup'], 'lesson-setup.py'), ('output', payload['code'], 'example.py')]:
            stream = BoundedOutput()
            try:
                with _contextlib.redirect_stdout(stream), _contextlib.redirect_stderr(stream):
                    exec(compile(source, filename, 'exec'), namespace)
            except BaseException:
                result['error'] = ('Lesson setup failed.\\n' if phase == 'setupOutput' else '') + _traceback.format_exc(limit=8)[-5000:]
            result[phase] = stream.value()
            if result['error']:
                break
    finally:
        _sys.stdin, _sys.argv = old_stdin, old_argv
    return _json.dumps(result)

_studio_execute(_json.loads(_studio_request))
`);
    self.postMessage({ type: "result", id: data.id, result: JSON.parse(serialized) });
  } catch (error) {
    self.postMessage({ type: "error", id: data.id, message: String(error.message || error).slice(-3000) });
  }
};
