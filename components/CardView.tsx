"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Eye, EyeOff, HelpCircle, Check, X } from "lucide-react";
import type { Card } from "@/lib/curriculum/types";
import CodeBlock from "./ui/CodeBlock";
import Console from "./ui/Console";
import Callout from "./ui/Callout";
import TracePlayer from "./ui/TracePlayer";
import FlowPlayer from "./ui/FlowPlayer";
import RunnableCode from "./ui/RunnableCode";
import TryOnline from "./ui/TryOnline";
import Animation from "./anim";

function Heading({ title, lead }: { title: string; lead?: string }) {
  return (
    <header className="mb-5">
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-balance text-[1.7em] font-semibold leading-tight tracking-tight text-white sm:text-[2em]"
      >
        {title}
      </motion.h3>
      {lead ? (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-2 max-w-3xl text-balance text-[1.05em] leading-relaxed text-ink-300"
        >
          {lead}
        </motion.p>
      ) : null}
    </header>
  );
}

function Bullets({ points }: { points: string[] }) {
  return (
    <ul className="space-y-3">
      {points.map((p, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.07 }}
          className="flex gap-3 text-[1.05em] leading-relaxed text-ink-100"
        >
          <span className="mt-[0.62em] h-1.5 w-1.5 shrink-0 rounded-full bg-iris-500" />
          <span className="text-balance">{p}</span>
        </motion.li>
      ))}
    </ul>
  );
}

function Checkpoint({ ask, answer, hint }: { ask: string; answer: string; hint?: string }) {
  const [shown, setShown] = useState(false);
  const [hintShown, setHintShown] = useState(false);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-sun-500/35 bg-sun-600/10 px-5 py-5">
        <div className="mb-2 flex items-center gap-2 font-mono text-[0.72em] uppercase tracking-[0.14em] text-sun-400">
          <HelpCircle className="h-3.5 w-3.5" /> Ask the room
        </div>
        <p className="text-balance text-[1.25em] leading-snug text-white">{ask}</p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {hint ? (
          <button
            onClick={() => setHintShown((v) => !v)}
            className="rounded-xl border border-white/12 bg-white/5 px-4 py-2 text-[0.9em] text-ink-200 transition hover:border-white/25"
          >
            {hintShown ? "Hide hint" : "Give a hint"}
          </button>
        ) : null}
        <button
          onClick={() => setShown((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl border border-mint-500/45 bg-mint-500/15 px-4 py-2 text-[0.9em] font-semibold text-mint-400 transition hover:bg-mint-500/25"
        >
          {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {shown ? "Hide the answer" : "Reveal the answer"}
        </button>
      </div>

      <AnimatePresence>
        {hintShown && hint ? (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 text-[0.98em] text-ink-200"
          >
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {shown ? (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-mint-500/35 bg-mint-600/10 px-5 py-4 text-[1.05em] leading-relaxed text-ink-100">
              {answer}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function CardView({ card }: { card: Card }) {
  switch (card.kind) {
    case "idea":
      return (
        <div>
          <Heading title={card.title} lead={card.lead} />
          {card.points ? <Bullets points={card.points} /> : null}
          {card.callout ? (
            <div className="mt-5">
              <Callout tone={card.callout.tone} text={card.callout.text} />
            </div>
          ) : null}
        </div>
      );

    case "code":
      return (
        <div>
          <Heading title={card.title} lead={card.lead} />
          {card.runnable ? (
            <RunnableCode initial={card.code} fallbackOutput={card.output} />
          ) : (
            <>
              <div className="grid gap-4 lg:grid-cols-2">
                <CodeBlock
                  code={card.code}
                  annotations={card.annotations}
                  title="program.py"
                  tryOnline={!card.template}
                />
                {card.output ? <Console text={card.output} label="Output" /> : null}
              </div>
              {!card.template ? (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <TryOnline code={card.code} variant="button" />
                  <span className="text-[0.85em] text-ink-400">
                    Opens the OnlineGDB Python compiler with this code on your clipboard — paste and run.
                  </span>
                </div>
              ) : null}
            </>
          )}
          {card.runnable && card.annotations?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {card.annotations.map((a, i) => (
                <span
                  key={i}
                  className="rounded-full border border-iris-500/35 bg-iris-600/12 px-3 py-1 text-[0.82em] text-iris-300"
                >
                  line {a.line}: {a.label}
                </span>
              ))}
            </div>
          ) : null}
          {card.callout ? (
            <div className="mt-5">
              <Callout tone={card.callout.tone} text={card.callout.text} />
            </div>
          ) : null}
        </div>
      );

    case "anim":
      return (
        <div>
          <Heading title={card.title} lead={card.lead} />
          <Animation anim={card.anim} props={card.props} />
        </div>
      );

    case "trace":
      return (
        <div>
          <Heading title={card.title} lead={card.lead} />
          <TracePlayer code={card.code} steps={card.steps} flow={card.flow} />
        </div>
      );

    case "flow":
      return (
        <div>
          <Heading title={card.title} lead={card.lead} />
          <FlowPlayer flow={card.flow} steps={card.steps} />
        </div>
      );

    case "table":
      return (
        <div>
          <Heading title={card.title} lead={card.lead} />
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[34rem] border-collapse text-left">
              <thead className="bg-white/[0.05]">
                <tr>
                  {card.headers.map((h, i) => (
                    <th key={i} className="px-4 py-2.5 text-[0.85em] font-semibold uppercase tracking-wider text-ink-300">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {card.rows.map((row, ri) => (
                  <motion.tr
                    key={ri}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + ri * 0.04 }}
                    className="border-t border-white/8"
                  >
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`px-4 py-2.5 align-top text-[0.98em] ${
                          ci === 0 ? "font-mono text-iris-300" : "text-ink-200"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {card.callout ? (
            <div className="mt-5">
              <Callout tone={card.callout.tone} text={card.callout.text} />
            </div>
          ) : null}
        </div>
      );

    case "compare": {
      const toneRing = {
        good: "border-mint-500/35 bg-mint-600/8",
        bad: "border-rose-ember/35 bg-rose-ember/8",
        neutral: "border-white/12 bg-white/[0.03]",
      } as const;
      const toneIcon = { good: Check, bad: X, neutral: null } as const;
      return (
        <div>
          <Heading title={card.title} lead={card.lead} />
          <div className={`grid gap-4 ${card.columns.length > 2 ? "lg:grid-cols-3" : "md:grid-cols-2"}`}>
            {card.columns.map((col, i) => {
              const tone = col.tone ?? "neutral";
              const Icon = toneIcon[tone];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.1 }}
                  className={`flex flex-col gap-3 rounded-2xl border p-4 ${toneRing[tone]}`}
                >
                  <div className="flex items-start gap-2">
                    {Icon ? (
                      <Icon
                        className={`mt-0.5 h-4 w-4 shrink-0 ${tone === "good" ? "text-mint-400" : "text-rose-ember"}`}
                      />
                    ) : null}
                    <h4 className="text-[1.05em] font-semibold text-ink-100">{col.heading}</h4>
                  </div>
                  {col.code ? <CodeBlock code={col.code} showLineNumbers={false} dense /> : null}
                  {col.output ? <Console text={col.output} label="Output" /> : null}
                  {col.points ? (
                    <ul className="mt-auto space-y-1.5">
                      {col.points.map((p, pi) => (
                        <li key={pi} className="flex gap-2 text-[0.92em] leading-snug text-ink-300">
                          <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-ink-400" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </motion.div>
              );
            })}
          </div>
        </div>
      );
    }

    case "checkpoint":
      return (
        <div>
          <Heading title={card.title} />
          <Checkpoint ask={card.ask} answer={card.answer} hint={card.hint} />
        </div>
      );
  }
}
