import Link from "next/link";
import { ArrowRight, Presentation, Layers, MousePointerClick, Terminal } from "lucide-react";
import CourseMap from "@/components/CourseMap";
import { courseStats, topics } from "@/lib/curriculum";

export default function HomePage() {
  const stats = courseStats();

  const features = [
    {
      Icon: Presentation,
      title: "Built for the front of the room",
      body: "Press Present for a full-screen deck with adjustable type. Arrow keys move one idea at a time — never a wall of bullet points.",
    },
    {
      Icon: Layers,
      title: "One concept per slide",
      body: `Every topic is split into small concepts, and each concept into ${Math.round(stats.cards / stats.concepts)} or so slides. Stop wherever the class needs to stop.`,
    },
    {
      Icon: MousePointerClick,
      title: "Animations you can drive",
      body: "Step an execution trace line by line, watch variables change, and follow a token around a live flowchart while you explain it.",
    },
    {
      Icon: Terminal,
      title: "Python that actually runs",
      body: "Students write code in the browser and get their output checked instantly. No installs, no accounts, nothing leaves the device.",
    },
  ];

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 px-6 py-12 sm:px-10 sm:py-16">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-iris-500/20 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-mint-500/14 blur-[100px]" />

        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-ink-300">
            12 topics · flowcharts to functions
          </span>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl">
            Teach Basic Python
            <span className="block bg-gradient-to-r from-iris-400 via-mint-400 to-sun-400 bg-clip-text text-transparent">
              one idea at a time.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-balance text-lg leading-relaxed text-ink-300">
            A complete, animated companion to the module. Every topic is broken into small concepts you can project,
            step through, and pause on — followed by practice questions that run real Python in the browser.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/topic/${topics[0].slug}`}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-iris-500 to-iris-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-iris-600/25 transition hover:brightness-110"
            >
              Start Topic 1 <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/teach"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-ink-100 transition hover:border-white/30"
            >
              <Presentation className="h-4 w-4" /> How to run a lesson
            </Link>
          </div>

          <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            {[
              { k: "Topics", v: stats.topics },
              { k: "Concepts", v: stats.concepts },
              { k: "Teaching slides", v: stats.cards },
              { k: "Practice questions", v: stats.questions },
            ].map((s) => (
              <div key={s.k}>
                <dt className="text-[11px] uppercase tracking-[0.14em] text-ink-500">{s.k}</dt>
                <dd className="mt-1 font-mono text-3xl font-semibold text-white">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/6">
              <f.Icon className="h-5 w-5 text-iris-300" />
            </span>
            <h3 className="mt-3.5 text-base font-semibold text-white">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{f.body}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">The course map</h2>
            <p className="mt-1 text-sm text-ink-400">
              Roughly {Math.round(stats.minutes / 60)} hours of teaching time. Follow it in order — each topic assumes the one before it.
            </p>
          </div>
          <Link href="/practice" className="text-sm text-iris-300 underline underline-offset-4 hover:text-white">
            Jump to all {stats.questions} practice questions
          </Link>
        </div>
        <CourseMap />
      </section>
    </div>
  );
}
