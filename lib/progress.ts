"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "pyteach.progress.v1";

export type Progress = {
  /** questionId -> correct? */
  answers: Record<string, boolean>;
  /** topicSlug -> furthest slide index reached */
  slides: Record<string, number>;
  /** topicSlug -> marked taught by the teacher */
  taught: string[];
};

const EMPTY: Progress = { answers: {}, slides: {}, taught: [] };

function read(): Progress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      answers: parsed.answers ?? {},
      slides: parsed.slides ?? {},
      taught: parsed.taught ?? [],
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
    write(p);
  }, []);

  const recordSlide = useCallback((slug: string, index: number) => {
    const p = read();
    p.slides[slug] = Math.max(p.slides[slug] ?? 0, index);
    write(p);
  }, []);

  const toggleTaught = useCallback((slug: string) => {
    const p = read();
    p.taught = p.taught.includes(slug) ? p.taught.filter((s) => s !== slug) : [...p.taught, slug];
    write(p);
  }, []);

  const reset = useCallback(() => write({ ...EMPTY, answers: {}, slides: {}, taught: [] }), []);

  return { progress, hydrated, recordAnswer, recordSlide, toggleTaught, reset };
}
