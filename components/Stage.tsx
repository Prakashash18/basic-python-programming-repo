"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  List,
  X,
  Type,
  ArrowRight,
  GraduationCap,
  Clock,
} from "lucide-react";
import type { Topic } from "@/lib/curriculum/types";
import { topicSlides } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";
import { XP, slideCount, slidesSeenIn, solvedIn, isCleared } from "@/lib/gamification";
import MissionRail from "./hud/MissionRail";
import CompactRail from "./hud/CompactRail";
import Telemetry from "./hud/Telemetry";
import { awardToast } from "./hud/XpToast";
import CardView from "./CardView";

const accentBar: Record<Topic["accent"], string> = {
  iris: "from-iris-500 to-iris-400",
  mint: "from-mint-500 to-mint-400",
  sun: "from-sun-500 to-sun-400",
  rose: "from-rose-ember to-sun-500",
};

const KIND_LABEL: Record<string, string> = {
  idea: "Concept",
  code: "Code",
  anim: "Animation",
  trace: "Run it step by step",
  flow: "Flowchart",
  table: "Reference",
  compare: "Compare",
  checkpoint: "Check understanding",
};

export default function Stage({ topic, nextTopic }: { topic: Topic; nextTopic?: { slug: string; title: string } }) {
  const slides = topicSlides(topic);
  const [index, setIndex] = useState(0);
  const [present, setPresent] = useState(false);
  const [outline, setOutline] = useState(false);
  const [scale, setScale] = useState(1);
  const { recordSlide, progress, hydrated } = useProgress();
  const awardedTo = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const current = slides[index];
  const total = slides.length;

  const go = useCallback(
    (delta: number) => setIndex((i) => Math.min(Math.max(i + delta, 0), total - 1)),
    [total],
  );

  useEffect(() => {
    // Award once per slide the student has never reached before — the stored
    // furthest index is the source of truth, so a re-read earns nothing.
    if (hydrated) {
      if (awardedTo.current === null) awardedTo.current = progress.slides[topic.slug] ?? -1;
      if (index > awardedTo.current) {
        awardedTo.current = index;
        awardToast(XP.step);
      }
    }
    recordSlide(topic.slug, index);
    // `progress` is read through a ref-guarded branch; re-running on every
    // progress write would re-award.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, topic.slug, recordSlide, hydrated]);

  // Keep the slide in view when advancing, so the teacher never has to scroll.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.45) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [index]);

  // Restore reading position within a topic
  useEffect(() => {
    setIndex(0);
    awardedTo.current = null;
  }, [topic.slug]);

  const toggleFullscreen = useCallback(async () => {
    const el = stageRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
        setPresent(true);
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setPresent((p) => !p);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) setPresent(false);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;

      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
          e.preventDefault();
          go(1);
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          go(-1);
          break;
        case " ":
          e.preventDefault();
          go(e.shiftKey ? -1 : 1);
          break;
        case "Home":
          setIndex(0);
          break;
        case "End":
          setIndex(total - 1);
          break;
        case "f":
        case "F":
          void toggleFullscreen();
          break;
        case "o":
        case "O":
          setOutline((v) => !v);
          break;
        case "Escape":
          setOutline(false);
          break;
        case "+":
        case "=":
          setScale((s) => Math.min(s + 0.1, 1.9));
          break;
        case "-":
          setScale((s) => Math.max(s - 0.1, 0.85));
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, total, toggleFullscreen]);

  const seenInTopic = Math.max(hydrated ? slidesSeenIn(progress, topic) : 0, index + 1);

  const nextConceptTitle = topic.concepts[current.conceptIndex + 1]?.title ?? nextTopic?.title;

  const xpToClear = hydrated
    ? (slideCount(topic) - slidesSeenIn(progress, topic)) * XP.step +
      (topic.practice.length - solvedIn(progress, topic)) * XP.question +
      (isCleared(progress, topic) ? 0 : XP.topicClear)
    : slideCount(topic) * XP.step + topic.practice.length * XP.question + XP.topicClear;

  const conceptStarts = new Map<number, number>();
  slides.forEach((s, i) => {
    if (!conceptStarts.has(s.conceptIndex)) conceptStarts.set(s.conceptIndex, i);
  });

  return (
    <div
      ref={stageRef}
      className={`stage scroll-mt-20 ${present ? "fixed inset-0 z-50 overflow-auto bg-ink-950" : ""}`}
      style={{ ["--stage-scale" as string]: present ? String(scale * 1.45) : String(scale) }}
    >
      <div className={present ? "mx-auto max-w-[1500px] px-6 py-6" : ""}>
        {/* Top bar */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setOutline(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-ink-200 transition hover:border-iris-500/50 hover:text-white"
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Outline</span>
          </button>

          <div className="min-w-0 flex-1">
            <div className="truncate text-[0.78em] uppercase tracking-[0.16em] text-ink-400">
              Topic {topic.num} · {current.concept.title}
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[0.68em] uppercase tracking-wider text-ink-300">
                {KIND_LABEL[current.card.kind] ?? current.card.kind}
              </span>
              <span className="whitespace-nowrap font-mono text-[0.72em] tabular-nums text-ink-400">
                {index + 1} / {total}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2 py-1.5">
            <Type className="h-3.5 w-3.5 text-ink-400" />
            <button
              onClick={() => setScale((s) => Math.max(s - 0.1, 0.85))}
              className="px-1.5 text-sm text-ink-300 hover:text-white"
              aria-label="Smaller text"
            >
              −
            </button>
            <span className="w-9 text-center font-mono text-[11px] tabular-nums text-ink-400">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale((s) => Math.min(s + 0.1, 1.9))}
              className="px-1.5 text-sm text-ink-300 hover:text-white"
              aria-label="Larger text"
            >
              +
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-2 rounded-xl border border-mint-500/40 bg-mint-500/15 px-3 py-2 text-sm font-semibold text-mint-400 transition hover:bg-mint-500/25"
          >
            {present ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            <span className="hidden sm:inline">{present ? "Exit" : "Present"}</span>
          </button>
        </div>

        {/* Progress rail */}
        <div className="mb-6 flex gap-1">
          {topic.concepts.map((c, ci) => {
            const startAt = conceptStarts.get(ci) ?? 0;
            const count = c.cards.length;
            const done = Math.min(Math.max(index - startAt + 1, 0), count);
            return (
              <button
                key={c.id}
                onClick={() => setIndex(startAt)}
                title={c.title}
                className="group relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/8"
              >
                <motion.span
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${accentBar[topic.accent]}`}
                  animate={{ width: `${(done / count) * 100}%` }}
                  transition={{ type: "spring", stiffness: 240, damping: 30 }}
                />
              </button>
            );
          })}
        </div>

        {!present ? (
          <div className="mb-6">
            <CompactRail
              topic={topic}
              conceptIndex={current.conceptIndex}
              percent={Math.round((seenInTopic / total) * 100)}
              slidesSeen={seenInTopic}
              totalSlides={total}
              xpToClear={xpToClear}
            />
          </div>
        ) : null}

        {/* Stage — rails flank the slide on a laptop, fold into the strip above
            below xl, and disappear in present mode where the room only needs
            the content. */}
        <div className={present ? "" : "grid gap-6 xl:grid-cols-[16rem_minmax(0,1fr)_18rem]"}>
          {!present ? (
            <aside className="hidden xl:flex xl:flex-col">
              <MissionRail
                topic={topic}
                conceptIndex={current.conceptIndex}
                percent={Math.round((seenInTopic / total) * 100)}
                slidesSeen={seenInTopic}
                totalSlides={total}
                xpToClear={xpToClear}
              />
            </aside>
          ) : null}

          <div className="min-h-[52vh] min-w-0">
            <AnimatePresence mode="wait">
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <CardView card={current.card} />
              </motion.section>
            </AnimatePresence>
          </div>

          {!present ? (
            <aside className="hidden xl:block">
              <Telemetry topic={topic} upNext={nextConceptTitle} />
            </aside>
          ) : null}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/8 pt-5">
          <button
            onClick={() => go(-1)}
            disabled={index === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ink-200 transition hover:border-white/25 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          {index < total - 1 ? (
            <button
              onClick={() => go(1)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-iris-500/45 bg-iris-500/20 px-5 py-2.5 text-sm font-semibold text-iris-300 transition hover:bg-iris-500/30"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <Link
              href={`/topic/${topic.slug}/practice`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-mint-500/45 bg-mint-500/20 px-5 py-2.5 text-sm font-semibold text-mint-400 transition hover:bg-mint-500/30"
            >
              <GraduationCap className="h-4 w-4" /> Go to practice ({topic.practice.length})
            </Link>
          )}

          <div className="ml-auto hidden items-center gap-3 text-[11px] text-ink-500 lg:flex">
            <kbd className="rounded border border-white/12 px-1.5 py-0.5 font-mono">←</kbd>
            <kbd className="rounded border border-white/12 px-1.5 py-0.5 font-mono">→</kbd>
            <span>navigate</span>
            <kbd className="rounded border border-white/12 px-1.5 py-0.5 font-mono">F</kbd>
            <span>present</span>
            <kbd className="rounded border border-white/12 px-1.5 py-0.5 font-mono">O</kbd>
            <span>outline</span>
          </div>
        </div>
      </div>

      {/* Outline drawer */}
      <AnimatePresence>
        {outline ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOutline(false)}
              className="fixed inset-0 z-[60] bg-ink-950/75 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-[61] w-[min(24rem,88vw)] overflow-y-auto border-r border-white/10 bg-ink-900 p-5"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.16em] text-ink-400">Topic {topic.num}</div>
                  <h2 className="mt-1 text-lg font-semibold text-white">{topic.title}</h2>
                </div>
                <button
                  onClick={() => setOutline(false)}
                  className="rounded-lg border border-white/10 p-1.5 text-ink-300 hover:text-white"
                  aria-label="Close outline"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {topic.concepts.map((c, ci) => {
                  const startAt = conceptStarts.get(ci) ?? 0;
                  const active = current.conceptIndex === ci;
                  return (
                    <div key={c.id}>
                      <button
                        onClick={() => {
                          setIndex(startAt);
                          setOutline(false);
                        }}
                        className={`flex w-full items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left transition ${
                          active ? "border-iris-500/50 bg-iris-500/12" : "border-white/8 hover:border-white/20"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md font-mono text-[10px] ${
                            active ? "bg-iris-500/30 text-iris-300" : "bg-white/8 text-ink-400"
                          }`}
                        >
                          {ci + 1}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-ink-100">{c.title}</span>
                          <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-ink-400">
                            <Clock className="h-3 w-3" /> {c.minutes} min · {c.cards.length} slides
                          </span>
                        </span>
                      </button>

                      {active ? (
                        <div className="mt-1.5 space-y-0.5 pl-9">
                          {c.cards.map((card, cardI) => {
                            const slideIndex = startAt + cardI;
                            const isNow = slideIndex === index;
                            const title = "title" in card ? card.title : "";
                            return (
                              <button
                                key={cardI}
                                onClick={() => {
                                  setIndex(slideIndex);
                                  setOutline(false);
                                }}
                                className={`block w-full truncate rounded-lg px-2 py-1 text-left text-[12px] transition ${
                                  isNow ? "bg-white/10 text-white" : "text-ink-400 hover:text-ink-200"
                                }`}
                              >
                                {title}
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <Link
                href={`/topic/${topic.slug}/practice`}
                className="mt-5 flex items-center justify-between rounded-xl border border-mint-500/35 bg-mint-600/10 px-3 py-2.5 text-sm font-medium text-mint-400"
              >
                Practice questions
                <ArrowRight className="h-4 w-4" />
              </Link>

              {nextTopic ? (
                <Link
                  href={`/topic/${nextTopic.slug}`}
                  className="mt-2 flex items-center justify-between rounded-xl border border-white/10 px-3 py-2.5 text-sm text-ink-300 hover:text-white"
                >
                  Next: {nextTopic.title}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
