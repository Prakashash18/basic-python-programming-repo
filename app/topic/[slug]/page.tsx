import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Clock, Target } from "lucide-react";
import { getTopic, topics, topicNeighbours, totalMinutes } from "@/lib/curriculum";
import Stage from "@/components/Stage";

export function generateStaticParams() {
  return topics.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return { title: "Topic not found" };
  return { title: `Topic ${topic.num}: ${topic.title}`, description: topic.tagline };
}

const ACCENT: Record<string, string> = {
  iris: "text-iris-300",
  mint: "text-mint-400",
  sun: "text-sun-400",
  rose: "text-rose-ember",
};

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const { prev, next } = topicNeighbours(slug);

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-ink-500">
          <Link href="/" className="transition hover:text-ink-200">
            Course
          </Link>
          <span>/</span>
          <span>Topic {topic.num.toString().padStart(2, "0")}</span>
          <span className="inline-flex items-center gap-1 text-ink-400">
            <Clock className="h-3 w-3" /> {totalMinutes(topic)} min
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-2xl">
            <h1 className="flex items-center gap-3 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              <span className={ACCENT[topic.accent]}>{topic.glyph}</span>
              {topic.title}
            </h1>
            <p className="mt-2 text-balance text-lg text-ink-300">{topic.tagline}</p>
          </div>

          <div className="min-w-[16rem] flex-1 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-400">
              <Target className="h-3.5 w-3.5" /> By the end, students can
            </div>
            <ul className="space-y-1.5">
              {topic.objectives.map((o, i) => (
                <li key={i} className="flex gap-2 text-sm leading-snug text-ink-200">
                  <span className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-mint-500" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <Stage topic={topic} nextTopic={next ? { slug: next.slug, title: next.title } : undefined} />

      <nav className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-6">
        {prev ? (
          <Link
            href={`/topic/${prev.slug}`}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ink-200 transition hover:border-white/25 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Topic {prev.num}: {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/topic/${next.slug}`}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ink-200 transition hover:border-white/25 hover:text-white"
          >
            Topic {next.num}: {next.title} <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
