"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Check, Clock, Play, Sparkles } from "lucide-react";
import { topics, totalMinutes } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";

const ACCENT = {
  iris: { ring: "hover:border-iris-500/55", glow: "from-iris-500/22", chip: "bg-iris-500/15 text-iris-300", bar: "from-iris-500 to-iris-400" },
  mint: { ring: "hover:border-mint-500/55", glow: "from-mint-500/22", chip: "bg-mint-500/15 text-mint-400", bar: "from-mint-500 to-mint-400" },
  sun: { ring: "hover:border-sun-500/55", glow: "from-sun-500/22", chip: "bg-sun-500/15 text-sun-400", bar: "from-sun-500 to-sun-400" },
  rose: { ring: "hover:border-rose-ember/55", glow: "from-rose-ember/22", chip: "bg-rose-ember/15 text-rose-ember", bar: "from-rose-ember to-sun-500" },
} as const;

export default function CourseMap() {
  const { progress, hydrated } = useProgress();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {topics.map((t, i) => {
        const a = ACCENT[t.accent];
        const slideCount = t.concepts.reduce((n, c) => n + c.cards.length, 0);
        const solved = t.practice.filter((q) => progress.answers[q.id]).length;
        const seen = progress.slides[t.slug] ?? 0;
        const seenPct = hydrated ? Math.min(100, Math.round(((seen + 1) / slideCount) * 100)) : 0;
        const complete = hydrated && solved === t.practice.length && t.practice.length > 0;

        return (
          <motion.div
            key={t.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.045, 0.4), ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={`/topic/${t.slug}`}
              className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-5 transition ${a.ring}`}
            >
              <div
                className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${a.glow} to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
              />

              <div className="mb-3 flex items-start justify-between gap-3">
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl ${a.chip}`}>
                  {t.glyph}
                </span>
                <div className="flex items-center gap-2">
                  {complete ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-mint-500/40 bg-mint-600/12 px-2 py-0.5 text-[11px] font-medium text-mint-400">
                      <Check className="h-3 w-3" /> done
                    </span>
                  ) : null}
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-500">
                    Topic {t.num.toString().padStart(2, "0")}
                  </span>
                </div>
              </div>

              <h3 className="text-balance text-lg font-semibold leading-snug text-white">{t.title}</h3>
              <p className="mt-1.5 flex-1 text-balance text-sm leading-relaxed text-ink-400">{t.tagline}</p>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-ink-400">
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> {t.concepts.length} concepts
                </span>
                <span>{slideCount} slides</span>
                <span>{t.practice.length} questions</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {totalMinutes(t)} min
                </span>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${a.bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${seenPct}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-200 transition group-hover:text-white">
                  <Play className="h-3.5 w-3.5" /> Teach this topic
                </span>
                <ArrowRight className="h-4 w-4 text-ink-500 transition group-hover:translate-x-1 group-hover:text-white" />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
