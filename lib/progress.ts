"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "pyteach.progress.v1";

export type Progress = {
  /** questionId -> correct? */
  answers: Record<string, boolean>;
  /** questionId -> how many times it has been attempted (drives accuracy) */
  attempts: Record<string, number>;
  /** topicSlug -> furthest slide index reached */
  slides: Record<string, number>;
  /** topicSlug -> marked taught by the teacher */
  taught: string[];
  /** Consecutive days with any activity */
  streak: { count: number; lastActive: string };
};

const EMPTY: Progress = {
  answers: {},
  attempts: {},
  slides: {},
  taught: [],
  streak: { count: 0, lastActive: "" },
};

/** Local calendar day, so a streak rolls over at the student's midnight. */
function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  if (!ay || !by) return Number.POSITIVE_INFINITY;
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000);
}

/** Bump the streak for today. Same day: no change. Next day: +1. A gap: back to 1. */
function touchStreak(p: Progress): Progress {
  const now = today();
  const last = p.streak?.lastActive ?? "";
  if (last === now) return p;
  const gap = last ? daysBetween(last, now) : Number.POSITIVE_INFINITY;
  p.streak = { count: gap === 1 ? (p.streak?.count ?? 0) + 1 : 1, lastActive: now };
  return p;
}

function read(): Progress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      answers: parsed.answers ?? {},
      attempts: parsed.attempts ?? {},
      slides: parsed.slides ?? {},
      taught: parsed.taught ?? [],
      streak: parsed.streak ?? { count: 0, lastActive: "" },
    };
  } catch {
    return EMPTY;
  }
}

function write(p: Progress) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
    window.dispatchEvent(new CustomEvent("pyteach:progress"));
  } catch {
    /* private browsing, quota, or storage disabled — the site still works */
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(read());
    setHydrated(true);
    const sync = () => setProgress(read());
    window.addEventListener("pyteach:progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("pyteach:progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const recordAnswer = useCallback((id: string, correct: boolean) => {
    const p = read();
    // Once a question is right it stays right; a later slip does not undo it.
    p.answers[id] = p.answers[id] || correct;
    p.attempts[id] = (p.attempts[id] ?? 0) + 1;
    write(touchStreak(p));
  }, []);

  const recordSlide = useCallback((slug: string, index: number) => {
    const p = read();
    const prev = p.slides[slug] ?? -1;
    if (index <= prev) return;
    p.slides[slug] = index;
    write(touchStreak(p));
  }, []);

  const toggleTaught = useCallback((slug: string) => {
    const p = read();
    p.taught = p.taught.includes(slug) ? p.taught.filter((s) => s !== slug) : [...p.taught, slug];
    write(p);
  }, []);

  const reset = useCallback(
    () => write({ answers: {}, attempts: {}, slides: {}, taught: [], streak: { count: 0, lastActive: "" } }),
    [],
  );

  return { progress, hydrated, recordAnswer, recordSlide, toggleTaught, reset };
}
