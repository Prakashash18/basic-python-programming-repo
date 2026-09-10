import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Keyboard, Lightbulb, Presentation, Route, Users } from "lucide-react";
import { topics, totalMinutes, courseStats } from "@/lib/curriculum";

export const metadata: Metadata = {
  title: "Teacher guide",
  description: "How to run a lesson with this platform: presentation controls, pacing, and a per-topic lesson plan.",
};

const KEYS = [
  { k: "→  /  Space", d: "Next slide" },
  { k: "←  /  Shift+Space", d: "Previous slide" },
  { k: "F", d: "Full-screen presentation mode" },
  { k: "O", d: "Open the topic outline to jump anywhere" },
  { k: "+  /  −", d: "Scale the text for the back of the room" },
  { k: "Home / End", d: "First or last slide of the topic" },
  { k: "Esc", d: "Close the outline or leave full screen" },
];

const RHYTHM = [
  {
    Icon: Presentation,
    title: "1 · Project the concept",
    body: "Open the topic and press F. Each slide holds one idea — read the heading aloud, then talk to the bullets. Resist the urge to skip ahead; the deck is already the short version.",
  },
  {
    Icon: Route,
    title: "2 · Drive the animation",
    body: "On trace and flowchart slides, step forward manually rather than pressing Play. Narrate each step and ask the class to predict the next line before you advance.",
  },
  {
    Icon: Users,
    title: "3 · Ask the room",
    body: "Every concept ends with a 'Check understanding' slide. Ask it cold, take two or three answers, and only then click Reveal. This is where the misconceptions surface.",
  },
  {
    Icon: Lightbulb,
    title: "4 · Set them running",
    body: "Send students to the practice page for the topic. Code questions are marked automatically, so you are free to circulate rather than checking output over shoulders.",
  },
];

export default function TeachPage() {
  const stats = courseStats();

  return (
    <div className="space-y-12">
      <header className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-ink-300">
          For the educator
        </span>
        <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          How to run a lesson
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-ink-300">
          The whole platform is built around one loop: show a concept, animate it, ask the room, then set practice.
          Everything below is optional — but this is the rhythm the material was written for.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {RHYTHM.map((r) => (
          <div key={r.title} className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-iris-500/15">
              <r.Icon className="h-5 w-5 text-iris-300" />
            </span>
            <h2 className="mt-3.5 text-base font-semibold text-white">{r.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{r.body}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
          <div className="mb-4 flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-mint-400" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-300">Presentation controls</h2>
          </div>
          <dl className="space-y-2.5">
            {KEYS.map((k) => (
              <div key={k.k} className="flex items-baseline justify-between gap-4">
                <dt>
                  <kbd className="rounded-lg border border-white/12 bg-white/5 px-2 py-1 font-mono text-[12px] text-ink-100">
                    {k.k}
                  </kbd>
                </dt>
                <dd className="flex-1 text-right text-sm text-ink-400">{k.d}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 rounded-xl border border-sun-500/30 bg-sun-600/10 px-4 py-3 text-sm text-ink-200">
            On a shared classroom machine, remember student progress is stored per browser. Ask students to use their
            own device, or their own browser profile, if you want the tick marks to mean anything.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-mint-400" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-300">
              Suggested pacing — {Math.round(stats.minutes / 60)} hours of delivery
            </h2>
          </div>
          <div className="space-y-1">
            {topics.map((t) => (
              <Link
                key={t.slug}
                href={`/topic/${t.slug}`}
                className="group flex items-center gap-3 rounded-xl px-2.5 py-2 transition hover:bg-white/5"
              >
                <span className="w-6 shrink-0 font-mono text-[11px] text-ink-500">{t.num}</span>
                <span className="min-w-0 flex-1 truncate text-sm text-ink-200 group-hover:text-white">{t.title}</span>
                <span className="shrink-0 font-mono text-[11px] text-ink-500">{t.concepts.length} concepts</span>
                <span className="w-16 shrink-0 text-right font-mono text-[11px] tabular-nums text-mint-400">
                  {totalMinutes(t)} min
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-2xl font-semibold tracking-tight text-white">Lesson plans</h2>
        <p className="mb-6 text-sm text-ink-400">
          Every concept with its takeaway — the single sentence you want students repeating back to you.
        </p>

        <div className="space-y-4">
          {topics.map((t) => (
            <details key={t.slug} className="group rounded-3xl border border-white/10 bg-white/[0.02] p-5">
              <summary className="flex cursor-pointer select-none flex-wrap items-center gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-500">
                  Topic {t.num.toString().padStart(2, "0")}
                </span>
                <span className="text-base font-semibold text-white">{t.title}</span>
                <span className="ml-auto font-mono text-[11px] text-ink-500">
                  {totalMinutes(t)} min · {t.practice.length} questions
                </span>
              </summary>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <div className="mb-2 text-[11px] uppercase tracking-[0.14em] text-ink-400">Learning objectives</div>
                  <ul className="space-y-1.5">
                    {t.objectives.map((o, i) => (
                      <li key={i} className="flex gap-2 text-sm text-ink-200">
                        <span className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-mint-500" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>

                <ol className="space-y-2.5">
                  {t.concepts.map((c, i) => (
                    <li key={c.id} className="flex gap-3 rounded-2xl border border-white/8 px-4 py-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/8 font-mono text-[11px] text-ink-300">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium text-ink-100">{c.title}</span>
                          <span className="font-mono text-[11px] text-ink-500">
                            {c.minutes} min · {c.cards.length} slides
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-ink-400">{c.takeaway}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="flex flex-wrap gap-2.5">
                  <Link
                    href={`/topic/${t.slug}`}
                    className="rounded-xl border border-iris-500/45 bg-iris-500/15 px-4 py-2 text-sm font-semibold text-iris-300 transition hover:bg-iris-500/25"
                  >
                    Teach Topic {t.num}
                  </Link>
                  <Link
                    href={`/topic/${t.slug}/practice`}
                    className="rounded-xl border border-white/12 bg-white/5 px-4 py-2 text-sm text-ink-200 transition hover:border-white/25"
                  >
                    Practice set
                  </Link>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
