import type { Progress } from "./progress";
import { topics, topicSlides, type Topic } from "./curriculum";

/**
 * The XP economy.
 *
 * Everything except the streak is DERIVED from progress that is already stored
 * (slides reached, questions solved). Nothing is banked, so XP cannot be
 * double-awarded, and clearing progress clears the score with it.
 */
export const XP = {
  /** Reaching a slide for the first time */
  step: 15,
  /** Solving a practice question for the first time */
  question: 40,
  /** Every practice question in a topic solved */
  topicClear: 240,
} as const;

/** XP per level. Flat, so "how far to the next level" is always legible. */
export const LEVEL_STEP = 500;

/** Correct answers in a row before the combo doubles the XP of each answer. */
export const COMBO_DOUBLE_AT = 5;

export type Score = {
  xp: number;
  level: number;
  /** XP earned inside the current level */
  intoLevel: number;
  /** XP the current level spans */
  levelSpan: number;
  /** Total XP at which the next level starts */
  nextLevelAt: number;
  solved: number;
  totalQuestions: number;
  attempted: number;
  /** Solved / attempted, or null before anything is attempted */
  accuracy: number | null;
  slidesSeen: number;
  totalSlides: number;
  topicsCleared: number;
  streak: number;
};

export function slideCount(topic: Topic): number {
  return topic.concepts.reduce((n, c) => n + c.cards.length, 0);
}

/** Slides reached in a topic — the stored index is 0-based. */
export function slidesSeenIn(progress: Progress, topic: Topic): number {
  const furthest = progress.slides[topic.slug];
  if (furthest === undefined) return 0;
  return Math.min(furthest + 1, slideCount(topic));
}

export function solvedIn(progress: Progress, topic: Topic): number {
  return topic.practice.filter((q) => progress.answers[q.id]).length;
}

export function isCleared(progress: Progress, topic: Topic): boolean {
  return topic.practice.length > 0 && solvedIn(progress, topic) === topic.practice.length;
}

export function xpFor(progress: Progress, topic: Topic): number {
  return (
    slidesSeenIn(progress, topic) * XP.step +
    solvedIn(progress, topic) * XP.question +
    (isCleared(progress, topic) ? XP.topicClear : 0)
  );
}

export function score(progress: Progress): Score {
  let xp = 0;
  let solved = 0;
  let slidesSeen = 0;
  let totalSlides = 0;
  let totalQuestions = 0;
  let topicsCleared = 0;

  for (const t of topics) {
    xp += xpFor(progress, t);
    solved += solvedIn(progress, t);
    slidesSeen += slidesSeenIn(progress, t);
    totalSlides += slideCount(t);
    totalQuestions += t.practice.length;
    if (isCleared(progress, t)) topicsCleared += 1;
  }

  const attempted = Object.keys(progress.attempts ?? {}).length;
  const level = Math.floor(xp / LEVEL_STEP) + 1;

  return {
    xp,
    level,
    intoLevel: xp % LEVEL_STEP,
    levelSpan: LEVEL_STEP,
    nextLevelAt: level * LEVEL_STEP,
    solved,
    totalQuestions,
    attempted,
    accuracy: attempted > 0 ? solved / attempted : null,
    slidesSeen,
    totalSlides,
    topicsCleared,
    streak: progress.streak?.count ?? 0,
  };
}

export type Badge = { topic: Topic; name: string; earned: boolean; xpAway: number };

/** One badge per topic, named for what the topic teaches. */
const BADGE_NAMES: Record<string, string> = {
  "how-programs-run": "First Run",
  flowcharts: "Chart Reader",
  "first-program": "Hello, World",
  comments: "Note Taker",
  literals: "Type Spotter",
  variables: "Box Keeper",
  operators: "Operator",
  "decision-making": "Decision Maker",
  lists: "List Handler",
  "for-loop": "Loop Runner",
  "while-loop": "Loop Breaker",
  functions: "Function Builder",
};

export function badgeName(topic: Topic): string {
  return BADGE_NAMES[topic.slug] ?? topic.title;
}

/** The next badge the student can realistically earn: furthest along, not yet cleared. */
export function nextBadge(progress: Progress, prefer?: Topic): Badge | null {
  // While a student is inside a topic, that topic's badge is the one in reach.
  if (prefer && !isCleared(progress, prefer) && prefer.practice.length > 0) {
    const remaining = prefer.practice.length - solvedIn(progress, prefer);
    return {
      topic: prefer,
      name: badgeName(prefer),
      earned: false,
      xpAway: remaining * XP.question + XP.topicClear,
    };
  }

  const open = topics
    .filter((t) => !isCleared(progress, t) && t.practice.length > 0)
    .map((t) => {
      const remaining = t.practice.length - solvedIn(progress, t);
      return {
        topic: t,
        name: badgeName(t),
        earned: false,
        xpAway: remaining * XP.question + XP.topicClear,
        remaining,
      };
    })
    .sort((a, b) => a.remaining - b.remaining || a.topic.num - b.topic.num);

  return open[0] ?? null;
}

/** Which concept a slide index falls in, and how far through the topic it is. */
export function conceptAt(topic: Topic, slideIndex: number) {
  const slides = topicSlides(topic);
  const entry = slides[Math.min(slideIndex, slides.length - 1)];
  return {
    conceptIndex: entry?.conceptIndex ?? 0,
    concept: entry?.concept ?? topic.concepts[0],
    total: topic.concepts.length,
    percent: slides.length ? Math.round(((slideIndex + 1) / slides.length) * 100) : 0,
  };
}

/** XP for one practice answer, including the combo bonus. */
export function answerXp(combo: number): number {
  return combo >= COMBO_DOUBLE_AT ? XP.question * 2 : XP.question;
}

export function formatXp(n: number): string {
  return n.toLocaleString("en-US");
}
