"use client";

import { motion } from "motion/react";
import { tokenizePython, tokenColor } from "@/lib/highlight";
import type { Annotation } from "@/lib/curriculum/types";

const toneRing: Record<NonNullable<Annotation["tone"]>, string> = {
  iris: "border-iris-500/70 bg-iris-500/10",
  mint: "border-mint-500/70 bg-mint-500/10",
  sun: "border-sun-500/70 bg-sun-500/10",
  rose: "border-rose-ember/70 bg-rose-ember/10",
};

const toneText: Record<NonNullable<Annotation["tone"]>, string> = {
  iris: "text-iris-300 border-iris-500/40 bg-iris-600/15",
  mint: "text-mint-400 border-mint-500/40 bg-mint-600/15",
  sun: "text-sun-400 border-sun-500/40 bg-sun-600/15",
  rose: "text-rose-ember border-rose-ember/40 bg-rose-ember/15",
};

export function CodeLine({ text }: { text: string }) {
  const toks = tokenizePython(text);
  return (
    <>
      {toks.map((tok, i) => (
        <span key={i} className={tokenColor[tok.c]}>
          {tok.t}
        </span>
      ))}
    </>
  );
}

export default function CodeBlock({
  code,
  annotations = [],
  activeLines = [],
  showLineNumbers = true,
  title,
  className = "",
  dense = false,
}: {
  code: string;
  annotations?: Annotation[];
  activeLines?: number[];
  showLineNumbers?: boolean;
  title?: string;
  className?: string;
  dense?: boolean;
}) {
  const lines = code.replace(/\n$/, "").split("\n");
  const annByLine = new Map<number, Annotation>();
  annotations.forEach((a) => annByLine.set(a.line, a));

  return (
    <div className={`overflow-hidden rounded-2xl border border-white/10 bg-ink-950/80 ${className}`}>
      {title ? (
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-ember/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-sun-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-mint-500/70" />
          <span className="ml-2 font-mono text-[0.72em] text-ink-300">{title}</span>
        </div>
      ) : null}
      <div className={dense ? "py-2" : "py-3.5"}>
        {lines.map((line, i) => {
          const n = i + 1;
          const ann = annByLine.get(n);
          const active = activeLines.includes(n);
          return (
            <div key={i} className="relative">
              <div
                className={`flex items-start gap-3 border-l-2 px-4 transition-colors ${
                  active
                    ? "border-mint-500 bg-mint-500/10"
                    : ann
                      ? `${toneRing[ann.tone ?? "iris"]}`
                      : "border-transparent"
                }`}
              >
                {showLineNumbers ? (
                  <span
                    className={`w-6 shrink-0 select-none text-right font-mono text-[0.78em] leading-[1.75] ${
                      active ? "text-mint-400" : "text-ink-500"
                    }`}
                  >
                    {n}
                  </span>
                ) : null}
                <code className="min-w-0 flex-1 whitespace-pre-wrap break-words font-mono text-[0.92em] leading-[1.75]">
                  {line.length ? <CodeLine text={line} /> : " "}
                </code>
                {ann ? (
                  <motion.span
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                    className={`hidden shrink-0 self-center rounded-full border px-2.5 py-0.5 font-sans text-[0.68em] font-medium lg:inline-block ${
                      toneText[ann.tone ?? "iris"]
                    }`}
                  >
                    {ann.label}
                  </motion.span>
                ) : null}
              </div>
              {ann ? (
                <div
                  className={`mx-4 mb-1 rounded-md border px-2 py-1 font-sans text-[0.68em] lg:hidden ${toneText[ann.tone ?? "iris"]}`}
                >
                  {ann.label}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
