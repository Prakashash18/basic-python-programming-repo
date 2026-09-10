import type { Topic, Concept, Question } from "./types";
import { topic01 } from "./topic01";
import { topic02 } from "./topic02";
import { topic03 } from "./topic03";
import { topic04 } from "./topic04";
import { topic05 } from "./topic05";
import { topic06 } from "./topic06";
import { topic07 } from "./topic07";
import { topic08 } from "./topic08";
import { topic09 } from "./topic09";
import { topic10 } from "./topic10";
import { topic11 } from "./topic11";
import { topic12 } from "./topic12";

export const topics: Topic[] = [
  topic01,
  topic02,
  topic03,
  topic04,
  topic05,
  topic06,
  topic07,
  topic08,
  topic09,
  topic10,
  topic11,
  topic12,
];

export function getTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}

export function topicNeighbours(slug: string): { prev?: Topic; next?: Topic } {
  const i = topics.findIndex((t) => t.slug === slug);
  return { prev: i > 0 ? topics[i - 1] : undefined, next: i >= 0 && i < topics.length - 1 ? topics[i + 1] : undefined };
}

/** Flat list of every card in a topic, tagged with the concept it belongs to. */
export function topicSlides(topic: Topic) {
  return topic.concepts.flatMap((concept, ci) =>
    concept.cards.map((card, cardIndex) => ({ concept, conceptIndex: ci, card, cardIndex })),
  );
}

export function totalMinutes(topic: Topic): number {
  return topic.concepts.reduce((sum, c) => sum + c.minutes, 0);
}

export function courseStats() {
  const concepts = topics.reduce((n, t) => n + t.concepts.length, 0);
  const cards = topics.reduce((n, t) => n + t.concepts.reduce((m, c) => m + c.cards.length, 0), 0);
  const questions = topics.reduce((n, t) => n + t.practice.length, 0);
  const minutes = topics.reduce((n, t) => n + totalMinutes(t), 0);
  return { topics: topics.length, concepts, cards, questions, minutes };
}

export const allQuestions: (Question & { topicSlug: string; topicTitle: string })[] = topics.flatMap((t) =>
  t.practice.map((q) => ({ ...q, topicSlug: t.slug, topicTitle: t.title })),
);

export type { Topic, Concept, Question };
export * from "./types";
