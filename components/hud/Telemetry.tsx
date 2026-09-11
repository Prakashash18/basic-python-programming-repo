"use client";

import Link from "next/link";
import type { Topic } from "@/lib/curriculum/types";
import { useProgress } from "@/lib/progress";
import { score, nextBadge, solvedIn, formatXp } from "@/lib/gamification";
import { StarIcon } from "./Icons";
import ProgressRing from "./ProgressRing";
import XpBar from "./XpBar";

/** Right-hand rail on the lesson stage: how the student is actually doing. */
export default function Telemetry({ topic, upNext }: { topic: Topic; upNext?: string }) {
  const { progress, hydrated } = useProgress();
  const s = score(progress);
  const badge = nextBadge(progress, topic);
  const solved = solvedIn(progress, topic);

  if (!hydrated) return <div className="hidden xl:block" aria-hidden />;

  return (
    <div className="flex flex-col gap-3.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-500">Telemetry</span>

      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.015] p-4">
        <ProgressRing
          percent={s.accuracy !== null ? s.accuracy * 100 : 0}
          size={62}
          stroke={6}
          color="#7c6cff"
          label={s.accuracy !== null ? `${Math.round(s.accuracy * 100)}%` : "—"}
        />
        <dl className="flex flex-1 flex-col gap-1.5 text-xs">
          <div className="flex justify-between">
            <dt className="text-ink-500">Accuracy</dt>
            <dd className="font-mono text-iris-300">
              {s.attempted > 0 ? `${s.solved} / ${s.attempted}` : "—"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">This topic</dt>
            <dd className="font-mono text-mint-400">
              {solved} / {topic.practice.length}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">Badges</dt>
            <dd className="font-mono text-ink-200">{s.topicsCleared} / 12</dd>
          </div>
        </dl>
      </div>

      {badge ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-sun-500/28 bg-gradient-to-br from-sun-500/12 to-sun-500/[0.03] p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sun-500/20 text-sun-500">
              <StarIcon size={18} />
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold text-sun-400">{badge.name}</span>
              <span className="text-[11px] text-ink-300">Topic {badge.topic.num} badge</span>
            </div>
          </div>
          <XpBar
            percent={
              badge.topic.practice.length
                ? (solvedIn(progress, badge.topic) / badge.topic.practice.length) * 100
                : 0
            }
            height={6}
          />
          <span className="font-mono text-[11px] text-ink-500">{formatXp(badge.xpAway)} XP AWAY</span>
        </div>
      ) : (
        <div className="rounded-2xl border border-mint-500/30 bg-mint-600/10 p-4 text-sm text-mint-400">
          Every badge earned. That is the whole module.
        </div>
      )}

      {upNext ? (
        <div className="flex flex-grow flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-500">Up next</span>
          <span className="text-sm font-semibold text-ink-100">{upNext}</span>
        </div>
      ) : null}

      <Link
        href={`/topic/${topic.slug}/practice`}
        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm text-ink-200 transition hover:border-mint-500/45 hover:text-white"
      >
        Practice this topic
        <span className="font-mono text-[11px] text-mint-400">+{topic.practice.length * 40} XP</span>
      </Link>

      <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3">
        <span className="hud-live h-1.5 w-1.5 rounded-full bg-mint-400" />
        <span className="font-mono text-[11px] tracking-[0.06em] text-mint-400">PYTHON READY</span>
      </div>
    </div>
  );
}
