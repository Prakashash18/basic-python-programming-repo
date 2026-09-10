"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Panel, Label, Chip, Slider } from "./shared";
import { CodeLine } from "@/components/ui/CodeBlock";

/* ------------------------------------------------------------------ */
/* list-index                                                          */
/* ------------------------------------------------------------------ */

export function ListIndex({
  items = ["11", "22", "33", "100", "200", "300"],
  negative = false,
}: {
  items?: string[];
  negative?: boolean;
}) {
  const [sel, setSel] = useState(0);
  const [mode, setMode] = useState<"pos" | "neg">(negative ? "neg" : "pos");
  const index = mode === "pos" ? sel : sel - items.length;
  const outOfRange = sel < 0 || sel >= items.length;

  return (
    <Panel>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Chip active={mode === "pos"} onClick={() => setMode("pos")}>
          positive index
        </Chip>
        <Chip active={mode === "neg"} onClick={() => setMode("neg")} tone="sun">
          negative index
        </Chip>
        <span className="ml-auto font-mono text-[0.82em] text-ink-400">click a cell</span>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max gap-2">
          {items.map((it, i) => {
            const active = i === sel;
            return (
              <button key={i} onClick={() => setSel(i)} className="group text-center">
                <motion.div
                  animate={{
                    scale: active ? 1.09 : 1,
                    borderColor: active ? "rgba(45,212,191,0.7)" : "rgba(255,255,255,0.12)",
                    backgroundColor: active ? "rgba(45,212,191,0.14)" : "rgba(255,255,255,0.03)",
                  }}
                  className="flex h-16 min-w-[4.2rem] items-center justify-center rounded-xl border px-3 font-mono text-[1.05em] text-ink-100"
                >
                  {it}
                </motion.div>
                <div className="mt-1.5 flex flex-col gap-0.5">
                  <span
                    className={`font-mono text-[0.78em] ${
                      mode === "pos" ? (active ? "text-mint-400" : "text-ink-400") : "text-ink-600"
                    }`}
                  >
                    {i}
                  </span>
                  <span
                    className={`font-mono text-[0.78em] ${
                      mode === "neg" ? (active ? "text-sun-400" : "text-ink-400") : "text-ink-600"
                    }`}
                  >
                    {i - items.length}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-ink-950/70 px-4 py-3 font-mono text-[1em]">
          <CodeLine text={`print(my_list[${index}])`} />
        </div>
        <motion.div
          key={`${index}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-mint-500/40 bg-mint-500/10 px-4 py-3 font-mono text-[1em] text-mint-400"
        >
          {outOfRange ? "IndexError: list index out of range" : items[sel]}
        </motion.div>
      </div>

      <p className="mt-4 rounded-xl border border-iris-500/30 bg-iris-600/12 px-4 py-3 text-[0.92em] text-ink-100">
        This list has {items.length} items, so valid positive indexes run 0 to {items.length - 1} and negative indexes run
        −1 to −{items.length}. Anything outside raises an <span className="font-mono">IndexError</span>.
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* list-slice                                                          */
/* ------------------------------------------------------------------ */

export function ListSlice({ items = ["1", "2", "3", "4", "5", "6", "7"] }: { items?: string[] }) {
  const [start, setStart] = useState(1);
  const [stop, setStop] = useState(3);
  const [omitStart, setOmitStart] = useState(false);
  const [omitStop, setOmitStop] = useState(false);

  const s = omitStart ? 0 : start;
  const e = omitStop ? items.length : stop;
  const slice = items.slice(s, e);
  const expr = `n_list[${omitStart ? "" : start}:${omitStop ? "" : stop}]`;

  return (
    <Panel>
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Slider label="start" value={start} min={0} max={items.length} onChange={setStart} />
          <button
            onClick={() => setOmitStart((v) => !v)}
            className={`text-[0.82em] underline underline-offset-4 ${omitStart ? "text-mint-400" : "text-ink-400"}`}
          >
            {omitStart ? "start is omitted — using 0" : "omit start"}
          </button>
        </div>
        <div className="space-y-2">
          <Slider label="stop" value={stop} min={0} max={items.length} onChange={setStop} />
          <button
            onClick={() => setOmitStop((v) => !v)}
            className={`text-[0.82em] underline underline-offset-4 ${omitStop ? "text-mint-400" : "text-ink-400"}`}
          >
            {omitStop ? "stop is omitted — to the end" : "omit stop"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max gap-2">
          {items.map((it, i) => {
            const inSlice = i >= s && i < e;
            return (
              <div key={i} className="text-center">
                <motion.div
                  animate={{
                    borderColor: inSlice ? "rgba(45,212,191,0.7)" : "rgba(255,255,255,0.1)",
                    backgroundColor: inSlice ? "rgba(45,212,191,0.15)" : "rgba(255,255,255,0.02)",
                    y: inSlice ? -4 : 0,
                  }}
                  className="flex h-16 min-w-[3.6rem] items-center justify-center rounded-xl border font-mono text-[1.05em] text-ink-100"
                >
                  {it}
                </motion.div>
                <div className="mt-1.5 font-mono text-[0.78em] text-ink-400">{i}</div>
              </div>
            );
          })}
          <div className="text-center">
            <div className="flex h-16 min-w-[3.6rem] items-center justify-center rounded-xl border border-dashed border-white/10 font-mono text-[0.8em] text-ink-600">
              end
            </div>
            <div className="mt-1.5 font-mono text-[0.78em] text-ink-400">{items.length}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-ink-950/70 px-4 py-3 font-mono text-[1em]">
          <CodeLine text={`print(${expr})`} />
        </div>
        <motion.div
          key={expr}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-mint-500/40 bg-mint-500/10 px-4 py-3 font-mono text-[1em] text-mint-400"
        >
          [{slice.join(", ")}]
        </motion.div>
      </div>

      <p className="mt-4 rounded-xl border border-rose-ember/30 bg-rose-ember/10 px-4 py-3 text-[0.92em] text-ink-100">
        The <span className="font-mono font-semibold">start</span> index is included, the{" "}
        <span className="font-mono font-semibold">stop</span> index is excluded. That is why{" "}
        <span className="font-mono">[1:3]</span> gives you two items, not three.
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* list-ops                                                            */
/* ------------------------------------------------------------------ */

type OpStep = { code: string; result: string[]; note: string; changed: number[] };

const ADD_STEPS: OpStep[] = [
  { code: "n_list = [1, 2, 3, 4]", result: ["1", "2", "3", "4"], note: "The starting list.", changed: [] },
  {
    code: "n_list.insert(3, 100)",
    result: ["1", "2", "3", "100", "4"],
    note: "insert(position, value) puts 100 AT index 3. Everything from there shifts one place right.",
    changed: [3],
  },
  {
    code: "n_list.append(99)",
    result: ["1", "2", "3", "100", "4", "99"],
    note: "append(value) always adds ONE item at the very end.",
    changed: [5],
  },
  {
    code: "n_list.extend([11, 22])",
    result: ["1", "2", "3", "100", "4", "99", "11", "22"],
    note: "extend(list) adds SEVERAL items at the end — the same as n_list + [11, 22].",
    changed: [6, 7],
  },
];

const EDIT_STEPS: OpStep[] = [
  { code: "n_list = [1, 2, 3, 4, 5, 6]", result: ["1", "2", "3", "4", "5", "6"], note: "The starting list.", changed: [] },
  { code: "n_list[2] = 100", result: ["1", "2", "100", "4", "5", "6"], note: "Assigning to an index replaces that one value.", changed: [2] },
  { code: "del n_list[1]", result: ["1", "100", "4", "5", "6"], note: "del removes an item and everything after it shifts left.", changed: [1] },
  { code: "del n_list[2:4]", result: ["1", "100", "6"], note: "del with a slice removes a whole run of items.", changed: [] },
];

export function ListOps({ mode = "add" }: { mode?: "add" | "edit" }) {
  const [which, setWhich] = useState<"add" | "edit">(mode);
  const steps = which === "add" ? ADD_STEPS : EDIT_STEPS;
  const [i, setI] = useState(0);
  const step = steps[Math.min(i, steps.length - 1)];

  return (
    <Panel>
      <div className="mb-4 flex flex-wrap gap-2">
        <Chip
          active={which === "add"}
          onClick={() => {
            setWhich("add");
            setI(0);
          }}
        >
          insert / append / extend
        </Chip>
        <Chip
          active={which === "edit"}
          onClick={() => {
            setWhich("edit");
            setI(0);
          }}
          tone="rose"
        >
          update / delete
        </Chip>
      </div>

      <div className="space-y-1.5">
        {steps.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`block w-full rounded-xl border px-3 py-2 text-left font-mono text-[0.9em] transition ${
              idx === i
                ? "border-mint-500/60 bg-mint-500/12"
                : idx < i
                  ? "border-white/10 bg-white/[0.04] opacity-65"
                  : "border-white/5 opacity-30"
            }`}
          >
            <CodeLine text={s.code} />
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-5">
        <div className="flex min-w-max items-end gap-2">
          <AnimatePresence mode="popLayout">
            {step.result.map((v, idx) => (
              <motion.div
                key={`${v}-${idx}`}
                layout
                initial={{ opacity: 0, scale: 0.5, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="text-center"
              >
                <div
                  className={`flex h-14 min-w-[3.6rem] items-center justify-center rounded-xl border font-mono text-[1.05em] ${
                    step.changed.includes(idx)
                      ? "border-mint-500/70 bg-mint-500/18 text-mint-400"
                      : "border-white/12 bg-white/[0.03] text-ink-100"
                  }`}
                >
                  {v}
                </div>
                <div className="mt-1.5 font-mono text-[0.75em] text-ink-500">{idx}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={`${which}-${i}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="mt-4 rounded-xl border border-iris-500/30 bg-iris-600/12 px-4 py-3 text-[0.94em] text-ink-100"
        >
          {step.note}
        </motion.p>
      </AnimatePresence>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setI((v) => Math.max(0, v - 1))}
          disabled={i === 0}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[0.85em] text-ink-200 disabled:opacity-30"
        >
          Back
        </button>
        <button
          onClick={() => setI((v) => Math.min(steps.length - 1, v + 1))}
          disabled={i >= steps.length - 1}
          className="rounded-xl border border-iris-500/40 bg-iris-500/15 px-3 py-1.5 text-[0.85em] font-semibold text-iris-300 disabled:opacity-30"
        >
          Next operation
        </button>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* range-builder                                                       */
/* ------------------------------------------------------------------ */

export function RangeBuilder() {
  const [form, setForm] = useState<1 | 2 | 3>(1);
  const [start, setStart] = useState(1);
  const [stop, setStop] = useState(8);
  const [step, setStep] = useState(2);

  const s = form === 1 ? 0 : start;
  const st = form === 3 ? step : 1;
  const values: number[] = [];
  if (st > 0) for (let v = s; v < stop; v += st) values.push(v);

  const expr = form === 1 ? `range(${stop})` : form === 2 ? `range(${start}, ${stop})` : `range(${start}, ${stop}, ${step})`;

  return (
    <Panel>
      <div className="mb-4 flex flex-wrap gap-2">
        <Chip active={form === 1} onClick={() => setForm(1)}>
          range(n)
        </Chip>
        <Chip active={form === 2} onClick={() => setForm(2)}>
          range(start, stop)
        </Chip>
        <Chip active={form === 3} onClick={() => setForm(3)}>
          range(start, stop, step)
        </Chip>
      </div>

      <div className="mb-5 space-y-2.5">
        {form > 1 ? <Slider label="start" value={start} min={0} max={20} onChange={setStart} /> : null}
        <Slider label="stop" value={stop} min={0} max={24} onChange={setStop} />
        {form === 3 ? <Slider label="step" value={step} min={1} max={6} onChange={setStep} /> : null}
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink-950/70 px-4 py-3 font-mono text-[1.05em]">
        <CodeLine text={`for i in ${expr}:`} />
      </div>

      <div className="mt-4">
        <Label>i takes these values, in this order</Label>
        <div className="flex min-h-[3.5rem] flex-wrap gap-2">
          <AnimatePresence mode="popLayout">
            {values.map((v, i) => (
              <motion.span
                key={`${v}-${i}`}
                layout
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ delay: i * 0.03, type: "spring", stiffness: 340, damping: 22 }}
                className="flex h-11 min-w-[2.8rem] items-center justify-center rounded-xl border border-mint-500/45 bg-mint-500/12 px-2 font-mono text-[1em] text-mint-400"
              >
                {v}
              </motion.span>
            ))}
          </AnimatePresence>
          {values.length === 0 ? (
            <span className="self-center text-[0.9em] text-ink-500">
              Empty — the loop body would never run.
            </span>
          ) : null}
        </div>
      </div>

      <p className="mt-4 rounded-xl border border-rose-ember/30 bg-rose-ember/10 px-4 py-3 text-[0.92em] text-ink-100">
        <span className="font-mono font-semibold">{stop}</span> is the stop value and is never included. The loop runs{" "}
        <span className="font-mono font-semibold text-rose-ember">{values.length}</span>{" "}
        {values.length === 1 ? "time" : "times"}.
      </p>
    </Panel>
  );
}
