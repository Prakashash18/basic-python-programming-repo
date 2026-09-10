"use client";

/**
 * Runs Python in the browser via Pyodide (WebAssembly CPython).
 *
 * Loading is lazy and shared: the first component that needs Python pulls the
 * runtime down, everyone else reuses it. If the CDN is unreachable the rest of
 * the site keeps working — callers fall back to comparing against the
 * expected output stored with each question.
 */

export type RunResult = {
  stdout: string;
  error: string | null;
  /** True when the program asked for more input than was supplied */
  starvedInput: boolean;
};

type PyodideApi = {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
  setStdin: (opts: { stdin: () => string | null; isatty?: boolean }) => void;
};

const CDN_VERSIONS = ["v0.26.4", "v0.27.2", "v0.25.1"];

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideApi>;
    __pyodide__?: PyodideApi;
  }
}

let loadPromise: Promise<PyodideApi> | null = null;

export type LoadPhase = "idle" | "loading" | "ready" | "failed";

const listeners = new Set<(p: LoadPhase, detail?: string) => void>();
let phase: LoadPhase = "idle";

export function onPhase(fn: (p: LoadPhase, detail?: string) => void) {
  listeners.add(fn);
  fn(phase);
  return () => listeners.delete(fn);
}

function setPhase(p: LoadPhase, detail?: string) {
  phase = p;
  listeners.forEach((fn) => fn(p, detail));
}

function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-pyodide="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("script error")));
      if (window.loadPyodide) resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.dataset.pyodide = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Could not load ${src}`));
    document.head.appendChild(s);
  });
}

export function loadPython(): Promise<PyodideApi> {
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    setPhase("loading");
    let lastError: unknown = null;

    for (const version of CDN_VERSIONS) {
      const indexURL = `https://cdn.jsdelivr.net/pyodide/${version}/full/`;
      try {
        await injectScript(`${indexURL}pyodide.js`);
        if (!window.loadPyodide) throw new Error("loadPyodide missing");
        const py = await window.loadPyodide({ indexURL });
        window.__pyodide__ = py;
        setPhase("ready");
        return py;
      } catch (err) {
        lastError = err;
      }
    }

    setPhase("failed", lastError instanceof Error ? lastError.message : "unknown error");
    throw lastError instanceof Error ? lastError : new Error("Pyodide failed to load");
  })();

  return loadPromise;
}

export function pythonPhase(): LoadPhase {
  return phase;
}

/** Strip a traceback down to something a beginner can act on. */
function friendlyError(raw: string): string {
  const lines = raw.trimEnd().split("\n");
  const last = lines[lines.length - 1] ?? raw;
  const fileLine = [...lines].reverse().find((l) => l.includes('File "<exec>"') || l.includes('File "<string>"'));
  const lineNo = fileLine?.match(/line (\d+)/)?.[1];
  return lineNo ? `${last}\n  (line ${lineNo} of your program)` : last;
}

export async function runPython(code: string, stdin: string[] = []): Promise<RunResult> {
  const py = await loadPython();

  let out = "";
  let starved = false;
  const queue = [...stdin];

  py.setStdout({ batched: (s) => (out += s) });
  py.setStderr({ batched: (s) => (out += s) });
  py.setStdin({
    stdin: () => {
      if (queue.length === 0) {
        starved = true;
        return null;
      }
      return queue.shift()! + "\n";
    },
    isatty: false,
  });

  try {
    // Fresh globals each run so one exercise cannot leak into the next.
    await py.runPythonAsync(
      `import sys\nglobals().clear()\n__builtins__ = __import__("builtins")\n`,
    );
    await py.runPythonAsync(code);
    return { stdout: out, error: null, starvedInput: starved };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (starved && /EOF|StopIteration|input/i.test(message)) {
      return {
        stdout: out,
        error: "Your program asked for more input than this exercise provides.",
        starvedInput: true,
      };
    }
    return { stdout: out, error: friendlyError(message), starvedInput: starved };
  }
}

/** Compare student output with the expected output, ignoring trailing spaces. */
export function outputMatches(actual: string, expected: string): boolean {
  const norm = (s: string) =>
    s
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((l) => l.replace(/\s+$/, ""))
      .join("\n")
      .replace(/\n+$/, "");
  return norm(actual) === norm(expected);
}
