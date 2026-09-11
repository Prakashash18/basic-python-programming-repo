"use client";

import type { Topic } from "@/lib/curriculum/types";
import { useProgress } from "@/lib/progress";
import { nextBadge, solvedIn } from "@/lib/gamification";
import { ObjectiveActive, ObjectiveDone, ObjectiveLocked, StarIcon } from "./Icons";
import ProgressRing from "./ProgressRing";

/**
 * What the mission rail and telemetry become below xl: one strip of topic
 * progress plus a scrollable row of objective chips.
 */
export default function CompactRail({
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
  const { progress, hydrated } = useProgress();
  const badge = hydrated ? nextBadge(progress, topic) : null;

  return (
    <div className="flex flex-col gap-3 xl:hidden">
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.015] p-3.5">
        <ProgressRing percent={percent} size={56} stroke={5} sub="%" />
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="font-mono text-[10px] tracking-[0.1em] text-mint-400">TOPIC {topic.num}</span>
          <span className="text-sm font-semibold text-ink-100">
            {slidesSeen} of {totalSlides} slides
          </span>
          <span className="font-mono text-[11px] text-sun-400">
            {xpToClear > 0 ? `+${xpToClear} XP to clear` : "Topic cleared"}
          </span>
        </div>

        {badge ? (
          <div className="ml-auto flex items-center gap-2.5 rounded-xl border border-sun-500/28 bg-sun-500/10 px-3 py-2">
            <span className="text-sun-500">
              <StarIcon size={15} />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-semibold text-sun-400">{badge.name}</span>
              <span className="font-mono text-[10px] text-ink-400">
                {solvedIn(progress, badge.topic)}/{badge.topic.practice.length} solved
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {topic.concepts.map((c, i) => {
          const state = i < conceptIndex ? "done" : i === conceptIndex ? "active" : "locked";
          return (
            <span
              key={c.id}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs transition-colors ${
                state === "active"
                  ? "border-mint-500 bg-gradient-to-r from-mint-500/20 to-iris-500/10 font-semibold text-white"
                  : state === "done"
                    ? "border-mint-500/25 bg-mint-600/[0.07] text-ink-300"
                    : "border-white/7 text-ink-400"
              }`}
            >
              {state === "done" ? (
                <ObjectiveDone size={14} />
              ) : state === "active" ? (
                <ObjectiveActive size={14} />
              ) : (
                <ObjectiveLocked size={14} />
              )}
              {c.title}
            </span>
          );
        })}
      </div>
    </div>
  );
}
