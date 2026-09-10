"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import CodeBlock from "./CodeBlock";
import Console from "./Console";
import StepControls, { usePlayer } from "./StepControls";
import FlowchartView from "./FlowchartView";
import type { Flowchart, TraceStep } from "@/lib/curriculum/types";

export default function TracePlayer({
  code,
  steps,
  flow,
  compact = false,
}: {
  code: string;
  steps: TraceStep[];
  flow?: Flowchart;
  compact?: boolean;
}) {
  const player = usePlayer(steps.length);
  const current = steps[player.step];

  const activeLines = useMemo(() => {
    const l = current?.line;
    return Array.isArray(l) ? l : typeof l === "number" ? [l] : [];
  }, [current]);

  const consoleText = useMemo(
    () =>
      steps
        .slice(0, player.step + 1)
        .map((s) => s.out)
        .filter((s): s is string => Boolean(s))
        .join("\n"),
    [steps, player.step],
  );

  const vars = current?.vars ?? {};
  const prevVars = player.step > 0 ? (steps[player.step - 1]?.vars ?? {}) : {};

  const visitedNodes = useMemo(
    () => steps.slice(0, player.step + 1).map((s) => s.node).filter((n): n is string => Boolean(n)),
    [steps, player.step],
  );

  return (
    <div className="space-y-4">
      <div className={`grid gap-4 ${compact ? "" : "lg:grid-cols-[1.15fr_0.85fr]"}`}>
        <div className="space-y-4">
          <CodeBlock code={code} activeLines={activeLines} title="program.py" />
          {flow ? (
            <div className="rounded-2xl border border-white/10 bg-ink-900/50 p-3">
              <FlowchartView flow={flow} activeNode={current?.node} visited={visitedNodes} maxHeight={340} />
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          {Object.keys(vars).length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900/50">
              <div className="border-b border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[0.72em] uppercase tracking-wider text-ink-300">
                Variables
              </div>
              <div className="divide-y divide-white/5">
                <AnimatePresence initial={false}>
                  {Object.entries(vars).map(([name, value]) => {
                    const changed = prevVars[name] !== value;
                    return (
                      <motion.div
                        key={name}
                        layout
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-between gap-3 px-4 py-2.5"
                      >
                        <span className="font-mono text-[0.86em] text-ink-300">{name}</span>
                        <motion.span
                          key={`${name}:${value}`}
                          initial={changed ? { scale: 1.25, color: "#5eead4" } : false}
                          animate={{ scale: 1, color: "#e4e8f7" }}
                          transition={{ type: "spring", stiffness: 300, damping: 18 }}
                          className={`max-w-[62%] truncate rounded-lg border px-2.5 py-1 text-right font-mono text-[0.86em] ${
                            changed ? "border-mint-500/50 bg-mint-500/10" : "border-white/10 bg-white/5"
                          }`}
                          title={value}
                        >
                          {value}
                        </motion.span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ) : null}

          <Console text={consoleText} label="Output" />
        </div>
      </div>

      {current?.note ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={player.step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex gap-3 rounded-2xl border border-iris-500/30 bg-iris-600/12 px-4 py-3"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-iris-500/25 font-mono text-[0.7em] font-bold text-iris-300">
              {player.step + 1}
            </span>
            <p className="text-[0.98em] leading-relaxed text-ink-100">{current.note}</p>
          </motion.div>
        </AnimatePresence>
      ) : null}

      <StepControls
        step={player.step}
        total={steps.length}
        playing={player.playing}
        onPlay={player.toggle}
        onPrev={player.prev}
        onNext={player.next}
        onReset={player.reset}
        onScrub={player.setStep}
        speed={player.speed}
        onSpeed={player.setSpeed}
      />
    </div>
  );
}
