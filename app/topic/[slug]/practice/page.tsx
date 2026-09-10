import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ClipboardList } from "lucide-react";
import { getTopic, topics, topicNeighbours } from "@/lib/curriculum";
import PracticeSet from "@/components/practice/PracticeSet";
import CodeBlock from "@/components/ui/CodeBlock";

export function generateStaticParams() {
  return topics.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return { title: "Topic not found" };
  return { title: `Practice — Topic ${topic.num}: ${topic.title}` };
}

export default async function TopicPracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();
  const { next } = topicNeighbours(slug);

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
        <Link
          href={`/topic/${topic.slug}`}
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-ink-500 transition hover:text-ink-200"
        >
          <ArrowLeft className="h-3 w-3" /> Back to the lesson
        </Link>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Practice — Topic {topic.num}: {topic.title}
        </h1>
        <p className="mt-2 max-w-2xl text-ink-300">
          Work through these in order. Warm-ups check recall, core questions check understanding, and stretch questions
          ask you to write real code that gets run and marked.
        </p>
      </header>

      <PracticeSet questions={topic.practice} />

      {topic.assignment ? (
        <section className="rounded-3xl border border-sun-500/30 bg-sun-600/8 p-6 sm:p-8">
          <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-sun-400">
            <ClipboardList className="h-3.5 w-3.5" /> Assignment
          </div>
          <h2 className="text-xl font-semibold text-white">{topic.assignment.title}</h2>
          <ul className="mt-4 space-y-2.5">
            {topic.assignment.body.map((b, i) => (
              <li key={i} className="flex gap-3 text-[0.98rem] leading-relaxed text-ink-200">
                <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-sun-500" />
                {b}
              </li>
            ))}
          </ul>
          {topic.assignment.solution ? (
            <details className="group mt-5">
              <summary className="inline-flex cursor-pointer select-none items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-4 py-2 text-sm text-ink-200 transition hover:text-white">
                Show the model answer
              </summary>
              <div className="mt-3">
                <CodeBlock code={topic.assignment.solution} title="model_answer.py" />
              </div>
            </details>
          ) : null}
        </section>
      ) : null}

      <nav className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-6">
        <Link
          href={`/topic/${topic.slug}`}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ink-200 transition hover:border-white/25 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Topic {topic.num}
        </Link>
        {next ? (
          <Link
            href={`/topic/${next.slug}`}
            className="inline-flex items-center gap-2 rounded-xl border border-mint-500/40 bg-mint-500/15 px-4 py-2.5 text-sm font-semibold text-mint-400 transition hover:bg-mint-500/25"
          >
            Next topic: {next.title} <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
