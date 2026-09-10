"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Filter, Trophy, RotateCcw } from "lucide-react";
import type { Question } from "@/lib/curriculum/types";
import { useProgress } from "@/lib/progress";
import QuestionCard from "./QuestionCard";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "1", label: "Warm-up" },
  { id: "2", label: "Core" },
  { id: "3", label: "Stretch" },
  { id: "todo", label: "Not yet solved" },
] as const;

export default function PracticeSet({ questions }: { questions: Question[] }) {
  const { progress, hydrated, recordAnswer } = useProgress();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [session, setSession] = useState<Record<string, boolean>>({});

  const solved = useMemo(
    () => questions.filter((q) => progress.answers[q.id]).length,
    [questions, progress.answers],
  );

  const shown = useMemo(
    () =>
      questions.filter((q) => {
        if (filter === "all") return true;
        if (filter === "todo") return !progress.answers[q.id];
        return String(q.difficulty ?? 2) === filter;
      }),
    [questions, filter, progress.answers],
  );

  const pct = questions.length ? Math.round((solved / questions.length) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint-500/15">
            <Trophy className="h-5 w-5 text-mint-400" />
          </span>
          <div>
            <div className="text-sm font-semibold text-ink-100">
              {hydrated ? `${solved} of ${questions.length} solved` : `${questions.length} questions`}
            </div>
            <div className="text-xs text-ink-400">Progress is saved in this browser</div>
          </div>
        </div>

        <div className="min-w-[9rem] flex-1">
          <div className="h-2 overflow-hidden rounded-full bg-white/8">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-mint-500 to-iris-500"
              animate={{ width: `${hydrated ? pct : 0}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="mr-1 h-3.5 w-3.5 text-ink-400" />
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                filter === f.id ? "bg-iris-500/25 text-iris-300" : "text-ink-400 hover:text-ink-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="rounded-3xl border border-mint-500/30 bg-mint-600/8 px-6 py-10 text-center">
          <p className="text-lg font-semibold text-mint-400">Everything in this filter is solved.</p>
          <button
            onClick={() => setFilter("all")}
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-ink-300 underline underline-offset-4 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Show all questions again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {shown.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={questions.indexOf(q)}
              alreadyCorrect={hydrated && Boolean(progress.answers[q.id])}
              onAnswer={(id, correct) => {
                recordAnswer(id, correct);
                setSession((s) => ({ ...s, [id]: correct }));
              }}
            />
          ))}
        </div>
      )}

      {Object.keys(session).length > 0 ? (
        <p className="text-center text-sm text-ink-400">
          This session: {Object.values(session).filter(Boolean).length} correct out of{" "}
          {Object.keys(session).length} attempted.
        </p>
      ) : null}
    </div>
  );
}
