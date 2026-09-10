"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Shuffle, Trophy, RotateCcw } from "lucide-react";
import { topics, allQuestions } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";
import QuestionCard from "@/components/practice/QuestionCard";

export default function PracticeHub() {
  const { progress, hydrated, recordAnswer, reset } = useProgress();
  const [mixed, setMixed] = useState<typeof allQuestions | null>(null);

  const solved = useMemo(
    () => allQuestions.filter((q) => progress.answers[q.id]).length,
    [progress.answers],
  );
  const pct = Math.round((solved / allQuestions.length) * 100);

  const startMix = () => {
    const pool = allQuestions.filter((q) => !progress.answers[q.id]);
    const source = pool.length >= 10 ? pool : allQuestions;
    const shuffled = [...source].sort(() => Math.random() - 0.5).slice(0, 10);
    setMixed(shuffled);
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint-500/15">
              <Trophy className="h-6 w-6 text-mint-400" />
            </span>
            <div>
              <div className="font-mono text-3xl font-semibold text-white">
                {hydrated ? solved : 0}
                <span className="text-lg text-ink-500"> / {allQuestions.length}</span>
              </div>
              <div className="text-sm text-ink-400">questions solved across the whole module</div>
            </div>
          </div>
          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/8">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-mint-500 via-iris-500 to-sun-500"
              animate={{ width: `${hydrated ? pct : 0}%` }}
              transition={{ type: "spring", stiffness: 180, damping: 30 }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              onClick={startMix}
              className="inline-flex items-center gap-2 rounded-xl border border-iris-500/45 bg-iris-500/20 px-4 py-2 text-sm font-semibold text-iris-300 transition hover:bg-iris-500/30"
            >
              <Shuffle className="h-4 w-4" /> Mixed quiz — 10 questions
            </button>
            {hydrated && solved > 0 ? (
              <button
                onClick={() => {
                  reset();
                  setMixed(null);
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-ink-300 transition hover:text-white"
              >
                <RotateCcw className="h-4 w-4" /> Clear my progress
              </button>
            ) : null}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-400">By topic</h2>
          <div className="mt-4 space-y-2">
            {topics.map((t) => {
              const done = t.practice.filter((q) => progress.answers[q.id]).length;
              const p = t.practice.length ? (done / t.practice.length) * 100 : 0;
              return (
                <Link
                  key={t.slug}
                  href={`/topic/${t.slug}/practice`}
                  className="group flex items-center gap-3 rounded-xl px-2.5 py-1.5 transition hover:bg-white/5"
                >
                  <span className="w-6 shrink-0 font-mono text-[11px] text-ink-500">{t.num}</span>
                  <span className="min-w-0 flex-1 truncate text-sm text-ink-200 group-hover:text-white">{t.title}</span>
                  <span className="h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-white/8">
                    <motion.span
                      className="block h-full rounded-full bg-mint-500"
                      animate={{ width: `${hydrated ? p : 0}%` }}
                    />
                  </span>
                  <span className="w-10 shrink-0 text-right font-mono text-[11px] tabular-nums text-ink-400">
                    {hydrated ? done : 0}/{t.practice.length}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {mixed ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">Mixed quiz</h2>
            <button
              onClick={startMix}
              className="inline-flex items-center gap-1.5 text-sm text-ink-300 underline underline-offset-4 hover:text-white"
            >
              <Shuffle className="h-3.5 w-3.5" /> New set of 10
            </button>
          </div>
          {mixed.map((q, i) => (
            <div key={q.id}>
              <div className="mb-1.5 text-[11px] uppercase tracking-[0.14em] text-ink-500">
                Topic {q.topicTitle}
              </div>
              <QuestionCard
                question={q}
                index={i}
                alreadyCorrect={hydrated && Boolean(progress.answers[q.id])}
                onAnswer={recordAnswer}
              />
            </div>
          ))}
        </section>
      ) : null}
    </div>
  );
}
