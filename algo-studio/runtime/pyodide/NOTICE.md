# Bundled runtime

Pyodide 314.0.7 (CPython 3.14.2), downloaded unmodified from the official distribution at https://cdn.jsdelivr.net/pyodide/v314.0.7/full/.

- Pyodide: Mozilla Public License 2.0; see LICENSE. Corresponding source: https://github.com/pyodide/pyodide/tree/314.0.7
- CPython: Python Software Foundation license and bundled component notices; see CPYTHON-LICENSE.txt. Corresponding source: https://github.com/python/cpython/tree/v3.14.2
- Build runtime: Emscripten 5.0.3, whose source and component license notices are available at https://github.com/emscripten-core/emscripten/tree/5.0.3

Algo Studio does not modify these third-party runtime files. The local python-worker.js file is application glue and is not part of Pyodide.
