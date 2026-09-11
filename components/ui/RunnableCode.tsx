"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Loader2, RotateCcw, CircleAlert } from "lucide-react";
import { CodeLine } from "./CodeBlock";
import Console from "./Console";
import { loadPython, onPhase, runPython, type LoadPhase } from "@/lib/python-runner";
import TryOnline from "./TryOnline";

export function usePythonPhase() {
  const [phase, setPhase] = useState<LoadPhase>("idle");
  useEffect(() => onPhase(setPhase) as unknown as () => void, []);
  return phase;
}

/** An editable Python cell that really runs, with a graceful fallback. */
export default function RunnableCode({
  initial,
  stdin = [],
  fallbackOutput,
  rows,
  onOutput,
  compact = false,
}: {
  initial: string;
  stdin?: string[];
  /** Shown when the Python runtime cannot be reached */
  fallbackOutput?: string;
  rows?: number;
  onOutput?: (out: string, error: string | null) => void;
  compact?: boolean;
}) {
  const [code, setCode] = useState(initial);
  const [out, setOut] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [ran, setRan] = useState(false);
  const phase = usePythonPhase();
  const areaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => setCode(initial), [initial]);

  const run = async () => {
    setBusy(true);
    setErr(null);
    try {
      const result = await runPython(code, stdin);
      setOut(result.stdout);
      setErr(result.error);
      setRan(true);
      onOutput?.(result.stdout, result.error);
    } catch {
      setOut(fallbackOutput ?? "");
      setErr(
        fallbackOutput
          ? null
          : "The Python runtime could not be downloaded. Check your connection, or run this code in IDLE.",
      );
      setRan(true);
      onOutput?.(fallbackOutput ?? "", null);
    } finally {
      setBusy(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const s = el.selectionStart;
      const next = code.slice(0, s) + "    " + code.slice(el.selectionEnd);
      setCode(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = s + 4;
      });
    }
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      void run();
    }
  };

  const lineCount = code.split("\n").length;
  const height = rows ?? Math.min(Math.max(lineCount, 4), 20);

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-950/80">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2">
          <span className="font-mono text-[0.72em] text-ink-300">editor — Ctrl/⌘ + Enter to run</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCode(initial);
                setOut("");
                setErr(null);
                setRan(false);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1 text-[0.75em] text-ink-300 transition hover:text-ink-100"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
            <TryOnline code={() => code} />
            <button
              onClick={run}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-mint-500/45 bg-mint-500/15 px-3 py-1 text-[0.78em] font-semibold text-mint-400 transition hover:bg-mint-500/25 disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
              {busy ? (phase === "loading" ? "Starting Python…" : "Running…") : "Run"}
            </button>
          </div>
        </div>

        <div className="relative">
          {/* Highlighted layer sits underneath a transparent textarea */}
          <pre
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words px-4 py-3 font-mono text-[0.92em] leading-[1.7]"
          >
            {code.split("\n").map((l, i) => (
              <div key={i}>{l.length ? <CodeLine text={l} /> : <>&nbsp;</>}</div>
            ))}
          </pre>
          <textarea
            ref={areaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKey}
            spellCheck={false}
            rows={height}
            className="relative w-full resize-y bg-transparent px-4 py-3 font-mono text-[0.92em] leading-[1.7] text-transparent caret-mint-400 outline-none"
          />
        </div>
      </div>

      {stdin.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
          <span className="font-mono text-[0.72em] uppercase tracking-wider text-ink-400">test input</span>
          {stdin.map((s, i) => (
            <span key={i} className="rounded-md border border-white/10 bg-black/30 px-2 py-0.5 font-mono text-[0.8em] text-ink-200">
              {s}
            </span>
          ))}
          <span className="text-[0.78em] text-ink-500">fed to input() in order</span>
        </div>
      ) : null}

      {ran ? (
        <>
          <Console text={out} label="Output" tone={err ? "normal" : "normal"} className={compact ? "" : ""} />
          {err ? (
            <div className="flex gap-2.5 rounded-2xl border border-rose-ember/40 bg-rose-ember/10 px-4 py-3">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-ember" />
              <pre className="min-w-0 flex-1 whitespace-pre-wrap break-words font-mono text-[0.85em] text-rose-ember">
                {err}
              </pre>
            </div>
          ) : null}
        </>
      ) : null}

      {phase === "failed" ? (
        <p className="text-[0.8em] text-ink-500">
          The in-browser Python runtime is unavailable here — outputs shown come from the lesson notes.
        </p>
      ) : null}
    </div>
  );
}

/** Warm the runtime up in the background so the first Run feels instant. */
export function PythonPreloader() {
  useEffect(() => {
    const id = setTimeout(() => {
      void loadPython().catch(() => {});
    }, 2500);
    return () => clearTimeout(id);
  }, []);
  return null;
}
