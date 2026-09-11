"use client";

import { AnimatePresence, motion } from "motion/react";
import { COMBO_DOUBLE_AT } from "@/lib/gamification";

/** Consecutive correct answers. Resets to zero the moment one is wrong. */
export default function ComboMeter({
  combo,
  best,
  correct,
  attempted,
  earned,
}: {
  combo: number;
  best: number;
  correct: number;
  attempted: number;
  earned: number;
}) {
  const doubled = combo >= COMBO_DOUBLE_AT;

  return (
    <div className="flex flex-col gap-3.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-500">This run</span>

      <AnimatePresence mode="wait">
        <motion.div
          key={combo}
          initial={{ scale: 0.78, opacity: 0, rotate: -4 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className={`flex flex-col items-center gap-2 rounded-3xl border p-5 ${
            combo > 0
              ? "border-mint-500/40 bg-gradient-to-br from-mint-500/20 to-iris-500/8 shadow-[0_18px_44px_-22px_rgba(45,212,191,0.9)]"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <span className={`text-[11px] font-bold uppercase tracking-[0.22em] ${combo > 0 ? "text-mint-400" : "text-ink-500"}`}>
            Combo
          </span>
          <div className="flex items-baseline gap-0.5">
            <span className={`text-xl font-semibold ${combo > 0 ? "text-mint-400" : "text-ink-500"}`}>×</span>
            <span className="text-5xl font-bold leading-none tracking-tight text-white">{combo}</span>
          </div>
          <span className="text-xs text-ink-300">
            {combo === 0 ? "Get one right to start a combo" : `${combo} correct in a row`}
          </span>
          <div className="mt-1 flex gap-1.5">
            {Array.from({ length: COMBO_DOUBLE_AT }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-7 rounded-full transition-colors ${i < combo ? "bg-mint-500" : "bg-white/14"}`}
              />
            ))}
          </div>
          <span className={`font-mono text-[11px] ${doubled ? "text-sun-400" : "text-ink-500"}`}>
            {doubled ? "XP DOUBLED" : `×${COMBO_DOUBLE_AT} DOUBLES YOUR XP`}
          </span>
        </motion.div>
      </AnimatePresence>

      <dl className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.015] p-4 text-xs">
        <div className="flex justify-between">
          <dt className="text-ink-500">Correct</dt>
          <dd className="font-mono text-mint-400">
            {correct} / {attempted}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-500">Best combo</dt>
          <dd className="font-mono text-ink-200">×{best}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-500">Earned</dt>
          <dd className="font-mono text-sun-400">+{earned} XP</dd>
        </div>
      </dl>
    </div>
  );
}
