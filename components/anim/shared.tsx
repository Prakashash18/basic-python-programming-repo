"use client";

import type { ReactNode } from "react";

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-ink-900/50 p-4 sm:p-5 ${className}`}>{children}</div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2.5 font-mono text-[0.7em] uppercase tracking-[0.14em] text-ink-400">{children}</div>
  );
}

export function Chip({
  active,
  onClick,
  children,
  tone = "iris",
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  tone?: "iris" | "mint" | "sun" | "rose";
}) {
  const tones = {
    iris: "border-iris-500/60 bg-iris-500/20 text-iris-300",
    mint: "border-mint-500/60 bg-mint-500/20 text-mint-400",
    sun: "border-sun-500/60 bg-sun-500/20 text-sun-400",
    rose: "border-rose-ember/60 bg-rose-ember/20 text-rose-ember",
  };
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border px-3 py-1.5 font-mono text-[0.82em] transition ${
        active ? tones[tone] : "border-white/10 bg-white/5 text-ink-300 hover:border-white/25 hover:text-ink-100"
      }`}
    >
      {children}
    </button>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="flex items-center gap-3">
      <span className="w-14 shrink-0 font-mono text-[0.78em] text-ink-300">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-iris-500"
      />
      <span className="w-10 shrink-0 rounded-lg border border-white/10 bg-white/5 py-0.5 text-center font-mono text-[0.78em] tabular-nums text-ink-100">
        {value}
      </span>
    </label>
  );
}

export function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 font-mono text-[0.85em] transition ${
        on ? "border-mint-500/60 bg-mint-500/15 text-mint-400" : "border-white/12 bg-white/5 text-ink-400"
      }`}
    >
      <span className="text-ink-300">{label}</span>
      <span
        className={`relative h-5 w-9 rounded-full transition ${on ? "bg-mint-500/60" : "bg-white/15"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${on ? "left-[1.15rem]" : "left-0.5"}`}
        />
      </span>
      <span className="w-10 font-semibold">{on ? "True" : "False"}</span>
    </button>
  );
}
