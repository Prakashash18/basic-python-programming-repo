"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useProgress } from "@/lib/progress";
import { score, formatXp } from "@/lib/gamification";
import { FlameIcon } from "./Icons";
import XpBar from "./XpBar";

/** The persistent player HUD: level, XP, streak. Sits in the site header. */
export default function HudBar({ compact = false }: { compact?: boolean }) {
  const { progress, hydrated } = useProgress();
  const s = score(progress);
  const pct = (s.intoLevel / s.levelSpan) * 100;

  if (!hydrated) {
    // Reserve the space so the header does not jump on hydration.
    return <div className="h-[42px] w-[13rem]" aria-hidden />;
  }

  return (
    <Link
      href="/practice"
      className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 transition hover:border-iris-500/45"
      title={`Level ${s.level} · ${formatXp(s.xp)} XP · ${s.streak} day streak`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-iris-500/50 bg-iris-500/15">
        <div className="flex flex-col items-center leading-none">
          <span className="font-mono text-[8px] tracking-[0.1em] text-iris-300">LV</span>
          <motion.span
            key={s.level}
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            className="text-sm font-bold text-white"
          >
            {s.level}
          </motion.span>
        </div>
      </div>

      {!compact ? (
        <div className="hidden w-32 flex-col gap-1 sm:flex lg:w-44">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">XP</span>
            <span className="font-mono text-[10px] tabular-nums text-ink-300">
              <span className="text-sun-400">{formatXp(s.xp)}</span> / {formatXp(s.nextLevelAt)}
            </span>
          </div>
          <XpBar percent={pct} height={7} />
        </div>
      ) : null}

      {s.streak > 0 ? (
        <span className="flex items-center gap-1.5 rounded-xl border border-sun-500/35 bg-sun-500/10 px-2 py-1">
          <FlameIcon className="hud-flame text-sun-500" size={12} />
          <span className="text-sm font-bold text-sun-400">{s.streak}</span>
        </span>
      ) : null}
    </Link>
  );
}
