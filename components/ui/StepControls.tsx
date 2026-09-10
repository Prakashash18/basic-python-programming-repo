"use client";

import { Play, Pause, SkipBack, SkipForward, RotateCcw, Gauge } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export function usePlayer(total: number, opts: { autoStart?: boolean; defaultSpeed?: number } = {}) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(Boolean(opts.autoStart));
  const [speed, setSpeed] = useState(opts.defaultSpeed ?? 1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  useEffect(() => {
    clear();
    if (!playing) return;
    if (step >= total - 1) {
      setPlaying(false);
      return;
    }
    timer.current = setTimeout(() => setStep((s) => Math.min(s + 1, total - 1)), 1500 / speed);
    return clear;
  }, [playing, step, total, speed]);

  useEffect(() => {
    setStep(0);
    setPlaying(Boolean(opts.autoStart));
    // Resetting when the underlying content changes is the whole point here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const next = useCallback(() => {
    setPlaying(false);
    setStep((s) => Math.min(s + 1, total - 1));
  }, [total]);
  const prev = useCallback(() => {
    setPlaying(false);
    setStep((s) => Math.max(s - 1, 0));
  }, []);
  const reset = useCallback(() => {
    setPlaying(false);
    setStep(0);
  }, []);
  const toggle = useCallback(() => {
    setStep((s) => (s >= total - 1 ? 0 : s));
    setPlaying((p) => !p);
  }, [total]);

  return { step, setStep, playing, next, prev, reset, toggle, speed, setSpeed, atEnd: step >= total - 1 };
}

export default function StepControls({
  step,
  total,
  playing,
  onPlay,
  onPrev,
  onNext,
  onReset,
  onScrub,
  speed,
  onSpeed,
  label = "Step",
}: {
  step: number;
  total: number;
  playing: boolean;
  onPlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  onScrub?: (n: number) => void;
  speed?: number;
  onSpeed?: (n: number) => void;
  label?: string;
}) {
  const btn =
    "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ink-200 transition hover:border-iris-500/50 hover:bg-iris-500/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-35";

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button onClick={onReset} className={btn} title="Back to the start" aria-label="Reset">
        <RotateCcw className="h-4 w-4" />
      </button>
      <button onClick={onPrev} className={btn} disabled={step === 0} title="Previous step" aria-label="Previous step">
        <SkipBack className="h-4 w-4" />
      </button>
      <button
        onClick={onPlay}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-mint-500/40 bg-mint-500/15 px-4 text-sm font-semibold text-mint-400 transition hover:bg-mint-500/25"
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {playing ? "Pause" : step >= total - 1 ? "Replay" : "Play"}
      </button>
      <button
        onClick={onNext}
        className={btn}
        disabled={step >= total - 1}
        title="Next step"
        aria-label="Next step"
      >
        <SkipForward className="h-4 w-4" />
      </button>

      <div className="flex min-w-[8rem] flex-1 items-center gap-3">
        <input
          type="range"
          min={0}
          max={Math.max(total - 1, 0)}
          value={step}
          onChange={(e) => onScrub?.(Number(e.target.value))}
          disabled={!onScrub}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-iris-500"
          aria-label="Scrub steps"
        />
        <span className="shrink-0 font-mono text-xs tabular-nums text-ink-300">
          {label} {step + 1}/{total}
        </span>
      </div>

      {onSpeed ? (
        <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2 py-1.5">
          <Gauge className="h-3.5 w-3.5 text-ink-400" />
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              onClick={() => onSpeed(s)}
              className={`rounded-lg px-1.5 py-0.5 font-mono text-[11px] transition ${
                speed === s ? "bg-iris-500/30 text-iris-300" : "text-ink-400 hover:text-ink-200"
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
