/* Runs on a separate thread. Terminate this worker to interrupt any Python code. */
let pyodide;
let initializing;
async function init() {
  if (pyodide) return;
  if (!initializing)
    initializing = (async () => {
      const { loadPyodide } = await import("./runtime/pyodide/pyodide.mjs");
      pyodide = await loadPyodide({ indexURL: new URL("./runtime/pyodide/", self.location.href).href });
    })();
  await initializing;
}
self.onmessage = async ({ data }) => {
  try {
    await init();
    if (data.type === "init") {
      postMessage({ type: "ready" });
      return;
    }
    pyodide.globals.set("_studio_payload", JSON.stringify(data));
    const serialized = pyodide.runPython(`
import json as _json, sys as _sys, time as _time, io as _io, contextlib as _contextlib, copy as _copy
_payload = _json.loads(_studio_payload)
_results = []
def _matches(actual, expected):
    if isinstance(expected, bool):
        return type(actual) is bool and actual == expected
    if isinstance(expected, int):
        return type(actual) is int and actual == expected
    if isinstance(expected, list):
        return isinstance(actual, list) and len(actual) == len(expected) and all(_matches(a, e) for a, e in zip(actual, expected))
    if isinstance(expected, dict):
        return isinstance(actual, dict) and actual.keys() == expected.keys() and all(_matches(actual[k], expected[k]) for k in expected)
    return type(actual) is type(expected) and actual == expected
_source = compile(_payload['code'], '<student>', 'exec')
for _case in _payload['tests']:
    _steps = [0]
    _ticks = [0]
    _frames = []
    _frame_count = [0]
    def _tick():
        _ticks[0] += 1
    def _trace(frame, event, arg):
        if event == 'line' and frame.f_code.co_filename == '<student>':
            _steps[0] += 1
            if _steps[0] > 100000:
                raise RuntimeError('Step limit reached. Check that your loop moves toward stopping.')
        if _payload.get('walkthrough') and frame.f_code.co_filename == '<student>' and event in ('line', 'return') and not (event == 'return' and frame.f_code.co_name == '<module>'):
            _frame_count[0] += 1
            if len(_frames) < 500:
                _locals = {k: repr(v)[:180] for k, v in frame.f_locals.items()
                           if not k.startswith('__') and not callable(v) and not isinstance(v, type(_sys))}
                _snapshot = {'line': frame.f_lineno, 'function': frame.f_code.co_name,
                             'event': event, 'locals': dict(list(_locals.items())[:10])}
                if event == 'return':
                    _snapshot['value'] = repr(arg)[:1000]
                _frames.append(_snapshot)
        return _trace
    _ns = {'__name__': '__student__', 'tick': _tick}
    _out = _io.StringIO()
    _started = _time.perf_counter()
    try:
        with _contextlib.redirect_stdout(_out), _contextlib.redirect_stderr(_out):
            _sys.settrace(_trace)
            exec(_source, _ns)
            if not callable(_ns.get('solve')):
                raise ValueError('Define a function named solve with the requested arguments.')
            _arguments = _copy.deepcopy(_case['args'])
            _original_nodes = []
            if 'reverseLinkedArg' in _payload:
                _node = _arguments[_payload['reverseLinkedArg']]
                while _node is not None:
                    _original_nodes.append(_node)
                    _node = _node['next']
            _actual = _ns['solve'](*_arguments)
            _sys.settrace(None)
        _elapsed = (_time.perf_counter() - _started) * 1000
        _passed = _matches(_actual, _case['expected'])
        if any(not _matches(_arguments[i], _case['args'][i]) for i in _payload.get('unchangedArgs', [])):
            raise AssertionError('This task requires the original input to remain unchanged.')
        if 'freshResultArg' in _payload and _actual is _arguments[_payload['freshResultArg']]:
            raise AssertionError('Return a new list, not the original input list.')
        if 'reverseLinkedArg' in _payload:
            _node = _actual
            for _original in reversed(_original_nodes):
                if _node is not _original:
                    raise AssertionError('Reverse the original node links in place; do not allocate replacement nodes.')
                _node = _node['next']
            if _node is not None:
                raise AssertionError('The reversed list must end at None.')
        _untraced_ms = None
        if _passed and _payload.get('experiment'):
            _samples = []
            with _contextlib.redirect_stdout(_out), _contextlib.redirect_stderr(_out):
                for _repeat in range(4):
                    _repeat_ns = {'__name__': '__student__', 'tick': _tick}
                    exec(_source, _repeat_ns)
                    _repeat_args = _copy.deepcopy(_case['args'])
                    _before = _time.perf_counter()
                    _repeat_actual = _repeat_ns['solve'](*_repeat_args)
                    _duration = (_time.perf_counter() - _before) * 1000
                    if not _matches(_repeat_actual, _case['expected']):
                        raise AssertionError('The repeated experiment returned an inconsistent result.')
                    if any(not _matches(_repeat_args[i], _case['args'][i]) for i in _payload.get('unchangedArgs', [])):
                        raise AssertionError('The experiment changed an input required to remain unchanged.')
                    if 'freshResultArg' in _payload and _repeat_actual is _repeat_args[_payload['freshResultArg']]:
                        raise AssertionError('The experiment must return a new list.')
                    if _repeat:
                        _samples.append(_duration)
            _untraced_ms = sorted(_samples)[1]
        _result = {'passed': bool(_passed), 'actual': repr(_actual)[:1000], 'steps': _steps[0], 'ticks': _ticks[0], 'ms': _elapsed, 'untracedMs': _untraced_ms, 'output': _out.getvalue()[:2000]}
        if _payload.get('walkthrough'):
            _result.update({'frames': _frames, 'frameCount': _frame_count[0]})
        _results.append(_result)
    except Exception as _error:
        _sys.settrace(None)
        _results.append({'passed': False, 'error': type(_error).__name__ + ': ' + str(_error)[:1000], 'steps': _steps[0], 'ticks': _ticks[0], 'ms': (_time.perf_counter() - _started) * 1000, 'output': _out.getvalue()[:2000]})
_json.dumps(_results)
`);
    postMessage({ type: "result", id: data.id, results: JSON.parse(serialized) });
  } catch (error) {
    postMessage({ type: "error", id: data.id, message: String(error.message || error).slice(-2000) });
  }
};
