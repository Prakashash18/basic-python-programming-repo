"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Panel, Label, Chip } from "./shared";
import { CodeLine } from "@/components/ui/CodeBlock";
import StepControls, { usePlayer } from "@/components/ui/StepControls";
import FlowchartView from "@/components/ui/FlowchartView";
import type { Flowchart } from "@/lib/curriculum/types";

/* ------------------------------------------------------------------ */
/* call-stack                                                          */
/* ------------------------------------------------------------------ */

const CALL_STEPS = [
  {
    line: 1,
    note: "def only DEFINES the function. Python remembers the name and the body — it does not run it yet.",
    frame: null as null | { params: Record<string, string>; returning?: string },
    caller: { sum1: "—" },
  },
  {
    line: 4,
    note: "The call. Python pauses the main program and jumps into the function.",
    frame: { params: {} },
    caller: { sum1: "—" },
  },
  {
    line: 4,
    note: "The arguments bind to the parameters BY POSITION: 100 → num1, 200 → num2.",
    frame: { params: { num1: "100", num2: "200" } },
    caller: { sum1: "—" },
  },
  {
    line: 2,
    note: "The body runs inside its own workspace. num1 and num2 exist only here.",
    frame: { params: { num1: "100", num2: "200" }, returning: "300" },
    caller: { sum1: "—" },
  },
  {
    line: 4,
    note: "return hands 300 back to the caller, and the function's workspace disappears.",
    frame: null,
    caller: { sum1: "300" },
  },
  {
    line: 6,
    note: "Back in the main program, sum1 now holds the returned value and can be printed.",
    frame: null,
    caller: { sum1: "300" },
  },
];

const CALL_CODE = `def add(num1, num2):
    return num1 + num2

sum1 = add(100, 200)

print(sum1)`;

export function CallStack() {
  const player = usePlayer(CALL_STEPS.length);
  const step = CALL_STEPS[player.step];
  const lines = CALL_CODE.split("\n");

  return (
    <Panel>
      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl border border-white/10 bg-ink-950/70 py-3">
          {lines.map((l, i) => (
            <div
              key={i}
              className={`flex gap-3 border-l-2 px-4 font-mono text-[0.92em] leading-[1.8] transition-colors ${
                step.line === i + 1 ? "border-mint-500 bg-mint-500/10" : "border-transparent"
              }`}
            >
              <span className={`w-4 select-none text-right text-[0.85em] ${step.line === i + 1 ? "text-mint-400" : "text-ink-500"}`}>
                {i + 1}
              </span>
              <span>{l.length ? <CodeLine text={l} /> : <>&nbsp;</>}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div>
            <Label>Main program</Label>
            <div className="rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-3">
              {Object.entries(step.caller).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between font-mono text-[0.92em]">
                  <span className="text-ink-300">{k}</span>
                  <motion.span
                    key={v}
                    initial={{ scale: 1.3, color: "#5eead4" }}
                    animate={{ scale: 1, color: v === "—" ? "#6b78ac" : "#e4e8f7" }}
                    className="rounded-lg border border-white/10 bg-black/25 px-2.5 py-0.5"
                  >
                    {v}
                  </motion.span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Function workspace (its own frame)</Label>
            <div className="min-h-[7.5rem] rounded-2xl border border-dashed border-white/12 px-4 py-3">
              <AnimatePresence mode="wait">
                {step.frame ? (
                  <motion.div
                    key="frame"
                    initial={{ opacity: 0, y: 16, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="rounded-xl border border-iris-500/45 bg-iris-600/12 px-3 py-2.5"
                  >
                    <div className="mb-2 font-mono text-[0.78em] text-iris-300">add(num1, num2)</div>
                    {Object.keys(step.frame.params).length === 0 ? (
                      <div className="font-mono text-[0.85em] text-ink-500">binding arguments…</div>
                    ) : (
                      Object.entries(step.frame.params).map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between font-mono text-[0.9em]">
                          <span className="text-ink-300">{k}</span>
                          <span className="rounded-lg border border-white/10 bg-black/25 px-2.5 py-0.5 text-ink-100">{v}</span>
                        </div>
                      ))
                    )}
                    {step.frame.returning ? (
                      <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mt-2 rounded-lg border border-mint-500/45 bg-mint-500/12 px-2.5 py-1 text-center font-mono text-[0.9em] text-mint-400"
                      >
                        return {step.frame.returning} ↑
                      </motion.div>
                    ) : null}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex h-full items-center justify-center py-6 text-center text-[0.85em] text-ink-500"
                  >
                    No function is running right now.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={player.step}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="mt-4 rounded-xl border border-iris-500/30 bg-iris-600/12 px-4 py-3 text-[0.95em] text-ink-100"
        >
          {step.note}
        </motion.p>
      </AnimatePresence>

      <div className="mt-4">
        <StepControls
          step={player.step}
          total={CALL_STEPS.length}
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
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* flow-symbols                                                        */
/* ------------------------------------------------------------------ */

const SYMBOLS: {
  id: string;
  name: string;
  meaning: string;
  python: string;
  flow: Flowchart;
}[] = [
  {
    id: "terminal",
    name: "Start / End",
    meaning: "An oval marks where the algorithm begins and where it finishes. Every chart has exactly one of each.",
    python: "(the top and bottom of your file)",
    flow: {
      width: 260,
      height: 120,
      nodes: [{ id: "n", kind: "terminal", text: "Start", x: 130, y: 60, w: 150, h: 60 }],
      edges: [],
    },
  },
  {
    id: "io",
    name: "Input / Output",
    meaning: "A parallelogram is data crossing the boundary of the program — coming in from the user, or going out to the screen.",
    python: "input()   /   print()",
    flow: {
      width: 260,
      height: 120,
      nodes: [{ id: "n", kind: "io", text: "Input num", x: 130, y: 60, w: 180, h: 62 }],
      edges: [],
    },
  },
  {
    id: "process",
    name: "Process",
    meaning: "A rectangle is work being done: a calculation, or storing a result in a variable.",
    python: "total = a + b",
    flow: {
      width: 260,
      height: 120,
      nodes: [{ id: "n", kind: "process", text: "total = a + b", x: 130, y: 60, w: 190, h: 62 }],
      edges: [],
    },
  },
  {
    id: "decision",
    name: "Decision",
    meaning: "A diamond asks a True/False question. It always has one arrow in and exactly two labelled arrows out.",
    python: "if / elif / else",
    flow: {
      width: 300,
      height: 170,
      nodes: [
        { id: "n", kind: "decision", text: "num > 10 ?", x: 150, y: 60, w: 180, h: 90 },
        { id: "t", kind: "process", text: "yes", x: 60, y: 145, w: 80, h: 40 },
        { id: "f", kind: "process", text: "no", x: 250, y: 145, w: 80, h: 40 },
      ],
      edges: [
        { from: "n", to: "t", label: "True", fromSide: "left", toSide: "top", points: [[60, 60]] },
        { from: "n", to: "f", label: "False", fromSide: "right", toSide: "top", points: [[250, 60]] },
      ],
    },
  },
  {
    id: "flowline",
    name: "Flowline",
    meaning: "An arrow shows the order the steps are carried out in. An arrow that goes backwards creates a loop.",
    python: "(top-to-bottom order)",
    flow: {
      width: 260,
      height: 190,
      nodes: [
        { id: "a", kind: "process", text: "step 1", x: 130, y: 40, w: 130, h: 50 },
        { id: "b", kind: "process", text: "step 2", x: 130, y: 150, w: 130, h: 50 },
      ],
      edges: [{ from: "a", to: "b" }],
    },
  },
  {
    id: "connector",
    name: "Connector",
    meaning: "A small circle joins parts of a chart that will not fit on one page. It has no code equivalent.",
    python: "(none)",
    flow: {
      width: 260,
      height: 120,
      nodes: [{ id: "n", kind: "connector", text: "A", x: 130, y: 60, w: 56, h: 56 }],
      edges: [],
    },
  },
];

export function FlowSymbols() {
  const [i, setI] = useState(0);
  const sym = SYMBOLS[i];

  return (
    <Panel>
      <div className="mb-4 flex flex-wrap gap-2">
        {SYMBOLS.map((s, idx) => (
          <Chip key={s.id} active={i === idx} onClick={() => setI(idx)} tone="mint">
            {s.name}
          </Chip>
        ))}
      </div>

      <div className="grid items-center gap-5 md:grid-cols-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={sym.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="rounded-2xl border border-white/10 bg-ink-950/60 p-4"
          >
            <FlowchartView flow={sym.flow} activeNode="n" maxHeight={200} />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${sym.id}-text`}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            className="space-y-3"
          >
            <h4 className="text-[1.35em] font-semibold text-ink-100">{sym.name}</h4>
            <p className="text-[0.98em] leading-relaxed text-ink-200">{sym.meaning}</p>
            <div className="rounded-xl border border-mint-500/30 bg-mint-600/10 px-4 py-2.5">
              <div className="font-mono text-[0.7em] uppercase tracking-wider text-mint-400">In Python</div>
              <div className="mt-0.5 font-mono text-[0.98em] text-ink-100">{sym.python}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Panel>
  );
}
