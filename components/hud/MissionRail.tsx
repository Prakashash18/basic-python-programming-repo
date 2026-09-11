"use client";

import { motion } from "motion/react";
import type { Topic } from "@/lib/curriculum/types";
import { XP } from "@/lib/gamification";
import { ObjectiveActive, ObjectiveDone, ObjectiveLocked } from "./Icons";
import ProgressRing from "./ProgressRing";

/**
 * The topic's concepts as mission objectives. Done / in-progress / locked is
 * driven by where the deck actually is, so the rail always matches the stage.
 */
export default function MissionRail({
  topic,
  conceptIndex,
  percent,
  slidesSeen,
  totalSlides,
  xpToClear,
}: {
  topic: Topic;
  conceptIndex: number;
  percent: number;
  slidesSeen: number;
  totalSlides: number;
  xpToClear: number;
}) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-500">Mission</span>
        <span className="font-mono text-[11px] text-mint-400">
          {conceptIndex + 1}/{topic.concepts.length}
        </span>
      </div>

      <ol className="flex flex-col gap-2.5">
        {topic.concepts.map((c, i) => {
          const state = i < conceptIndex ? "done" : i === conceptIndex ? "active" : "locked";
          return (
            <motion.li
              key={c.id}
              layout
              className={`flex gap-3 rounded-2xl border px-3.5 py-3 transition-colors ${
                state === "active"
                  ? "border-mint-500 bg-gradient-to-br from-mint-500/16 to-iris-500/10 shadow-[0_10px_26px_-14px_rgba(45,212,191,0.6)]"
                  : state === "done"
                    ? "border-mint-500/25 bg-mint-600/[0.07]"
                    : "border-white/7 bg-white/[0.02]"
              }`}
            >
              <span className="mt-0.5 shrink-0">
                {state === "done" ? <ObjectiveDone /> : state === "active" ? <ObjectiveActive /> : <ObjectiveLocked />}
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <span
                  className={`text-[0.82rem] leading-snug ${
                    state === "active" ? "font-semibold text-ink-100" : state === "done" ? "text-ink-300" : "text-ink-400"
                  }`}
                >
                  {c.title}
                </span>
                {state === "active" ? (
                  <span className="font-mono text-[10px] tracking-[0.06em] text-mint-400">
                    IN PROGRESS · {c.minutes} MIN
                  </span>
                ) : null}
              </span>
            </motion.li>
          );
        })}
      </ol>

      <div className="mt-auto flex items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.015] p-4">
        <ProgressRing percent={percent} size={74} sub="%" />
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
            Topic {topic.num}
          </span>
          <span className="text-sm font-semibold text-ink-100">
            {slidesSeen} of {totalSlides} slides
          </span>
          <span className="font-mono text-[11px] text-sun-400">
            {xpToClear > 0 ? `+${xpToClear} XP to clear` : "Topic cleared"}
          </span>
        </div>
      </div>
    </div>
  );
}
