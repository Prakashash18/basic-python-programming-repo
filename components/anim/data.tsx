"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Keyboard, ArrowDown, Box } from "lucide-react";
import { Panel, Label, Chip, Slider } from "./shared";
import { CodeLine } from "@/components/ui/CodeBlock";

/* ------------------------------------------------------------------ */
/* literal-sorter                                                      */
/* ------------------------------------------------------------------ */

const LITERALS: { text: string; type: string }[] = [
  { text: "42", type: "int" },
  { text: '"42"', type: "str" },
  { text: "3.14", type: "float" },
  { text: "True", type: "bool" },
  { text: "3e8", type: "float" },
  { text: "0b1010", type: "int" },
  { text: "'Monty'", type: "str" },
  { text: "-7", type: "int" },
  { text: "False", type: "bool" },
  { text: "0x1F", type: "int" },
  { text: '"3.14"', type: "str" },
  { text: "2.0", type: "float" },
];

const BUCKETS = [
  { type: "int", label: "Integer", hint: "whole numbers", ring: "border-iris-500/50 bg-iris-600/10", text: "text-iris-300" },
  { type: "float", label: "Float", hint: "a fractional part", ring: "border-mint-500/50 bg-mint-600/10", text: "text-mint-400" },
  { type: "str", label: "String", hint: "inside quotes", ring: "border-sun-500/50 bg-sun-600/10", text: "text-sun-400" },
  { type: "bool", label: "Boolean", hint: "True or False", ring: "border-rose-ember/50 bg-rose-ember/10", text: "text-rose-ember" },
];

export function LiteralSorter() {
  const [sorted, setSorted] = useState<number[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const pending = LITERALS.map((_, i) => i).filter((i) => !sorted.includes(i));
  const current = pending[0];

  const choose = (type: string) => {
    if (current === undefined) return;
    if (LITERALS[current].type === type) {
      setWrong(null);
      setSorted((s) => [...s, current]);
    } else {
      setWrong(type);
      setTimeout(() => setWrong(null), 700);
    }
  };

  return (
    <Panel>
      <Label>Call out the type, then click the bucket</Label>

      <div className="mb-5 flex min-h-[5rem] items-center justify-center rounded-2xl border border-white/10 bg-ink-950/70 px-4 py-5">
        <AnimatePresence mode="wait">
          {current !== undefined ? (
            <motion.span
              key={current}
              initial={{ opacity: 0, y: -18, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.85 }}
              className="font-mono text-[2em] text-ink-100"
            >
              {LITERALS[current].text}
            </motion.span>
          ) : (
            <motion.span
              key="done"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[1.2em] font-semibold text-mint-400"
            >
              All twelve sorted. Nicely done.
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {BUCKETS.map((b) => {
          const items = sorted.filter((i) => LITERALS[i].type === b.type);
          return (
            <motion.button
              key={b.type}
              onClick={() => choose(b.type)}
              animate={wrong === b.type ? { x: [0, -7, 7, -5, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              className={`rounded-2xl border px-3 py-3 text-left transition hover:brightness-125 ${
                wrong === b.type ? "border-rose-ember bg-rose-ember/20" : b.ring
              }`}
            >
              <div className={`text-[0.95em] font-semibold ${b.text}`}>{b.label}</div>
              <div className="text-[0.78em] text-ink-400">{b.hint}</div>
              <div className="mt-2 flex min-h-[3.4rem] flex-wrap content-start gap-1">
                <AnimatePresence>
                  {items.map((i) => (
                    <motion.span
                      key={i}
                      layout
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-md border border-white/12 bg-black/30 px-1.5 py-0.5 font-mono text-[0.76em] text-ink-200"
                    >
                      {LITERALS[i].text}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </div>

      {sorted.length > 0 ? (
        <button
          onClick={() => setSorted([])}
          className="mt-4 text-[0.85em] text-ink-400 underline underline-offset-4 hover:text-ink-200"
        >
          Reset and try again
        </button>
      ) : null}
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* number-bases                                                        */
/* ------------------------------------------------------------------ */

export function NumberBases() {
  const [n, setN] = useState(10);

  const rows = [
    { name: "Decimal (base 10)", prefix: "", value: n.toString(10), code: `print(${n})`, tone: "text-ink-100" },
    { name: "Binary (base 2)", prefix: "0b", value: n.toString(2), code: `print(0b${n.toString(2)})`, tone: "text-mint-400" },
    { name: "Octal (base 8)", prefix: "0o", value: n.toString(8), code: `print(0o${n.toString(8)})`, tone: "text-sun-400" },
    { name: "Hexadecimal (base 16)", prefix: "0x", value: n.toString(16).toUpperCase(), code: `print(0x${n.toString(16).toUpperCase()})`, tone: "text-iris-300" },
  ];

  return (
    <Panel>
      <div className="mb-5">
        <Slider label="value" value={n} min={0} max={255} onChange={setN} />
      </div>

      <div className="grid gap-2.5">
        {rows.map((r) => (
          <div
            key={r.name}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-3"
          >
            <span className="text-[0.88em] text-ink-300">{r.name}</span>
            <div className="flex items-center gap-4">
              <motion.span
                key={r.value}
                initial={{ opacity: 0.3, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`font-mono text-[1.15em] font-semibold ${r.tone}`}
              >
                <span className="text-ink-500">{r.prefix}</span>
                {r.value}
              </motion.span>
              <span className="hidden font-mono text-[0.8em] text-ink-500 sm:inline">→ prints {n}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-xl border border-sun-500/30 bg-sun-600/12 px-4 py-3 text-[0.92em] text-ink-100">
        The prefix changes how Python <em>reads</em> the digits. Whichever form you write, the console always shows{" "}
        <span className="font-mono font-semibold text-sun-400">{n}</span> in decimal.
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* variable-boxes                                                      */
/* ------------------------------------------------------------------ */

const ASSIGN_STEPS = [
  { code: "my_age = 20", box: "my_age", value: "20", type: "int", note: "The value 20 is placed in a box named my_age. Python creates it as an integer." },
  { code: 'my_telephone = "91237783"', box: "my_telephone", value: '"91237783"', type: "str", note: "Quotes make it a string, even though every character is a digit." },
  { code: "my_weight = 60.5", box: "my_weight", value: "60.5", type: "float", note: "A decimal point makes it a float." },
  { code: "my_age = my_age + 1", box: "my_age", value: "21", type: "int", note: "Reading a box does not empty it. The old value is read, 1 is added, and the result replaces it." },
];

export function VariableBoxes() {
  const [i, setI] = useState(0);
  const shown = ASSIGN_STEPS.slice(0, i + 1);
  const boxes = new Map<string, { value: string; type: string; step: number }>();
  shown.forEach((s, idx) => boxes.set(s.box, { value: s.value, type: s.type, step: idx }));

  return (
    <Panel>
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Label>Statements</Label>
          <div className="space-y-1.5">
            {ASSIGN_STEPS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={`block w-full rounded-xl border px-3 py-2 text-left font-mono text-[0.88em] transition ${
                  idx === i
                    ? "border-mint-500/60 bg-mint-500/12"
                    : idx < i
                      ? "border-white/10 bg-white/[0.04] opacity-70"
                      : "border-white/5 bg-transparent opacity-30"
                }`}
              >
                <CodeLine text={s.code} />
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setI((v) => Math.max(0, v - 1))}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[0.85em] text-ink-200 disabled:opacity-30"
              disabled={i === 0}
            >
              Back
            </button>
            <button
              onClick={() => setI((v) => Math.min(ASSIGN_STEPS.length - 1, v + 1))}
              className="rounded-xl border border-iris-500/40 bg-iris-500/15 px-3 py-1.5 text-[0.85em] font-semibold text-iris-300 disabled:opacity-30"
              disabled={i === ASSIGN_STEPS.length - 1}
            >
              Next statement
            </button>
          </div>
        </div>

        <div>
          <Label>Memory</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            <AnimatePresence>
              {[...boxes.entries()].map(([name, info]) => (
                <motion.div
                  key={name}
                  layout
                  initial={{ opacity: 0, scale: 0.85, y: -12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={`rounded-2xl border px-3 py-3 ${
                    info.step === i ? "border-mint-500/60 bg-mint-500/10" : "border-white/12 bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-mono text-[0.8em] text-ink-300">
                    <Box className="h-3.5 w-3.5" />
                    {name}
                  </div>
                  <motion.div
                    key={info.value}
                    initial={{ scale: 1.25, color: "#5eead4" }}
                    animate={{ scale: 1, color: "#e4e8f7" }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="mt-1.5 truncate font-mono text-[1.3em] font-semibold"
                  >
                    {info.value}
                  </motion.div>
                  <div className="mt-1 font-mono text-[0.72em] text-ink-500">{info.type}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-4 rounded-xl border border-iris-500/30 bg-iris-600/12 px-4 py-3 text-[0.92em] text-ink-100"
            >
              {ASSIGN_STEPS[i].note}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* input-flow                                                          */
/* ------------------------------------------------------------------ */

export function InputFlow() {
  const [typed, setTyped] = useState("Aisha");
  const [convert, setConvert] = useState(false);
  const numeric = /^-?\d+$/.test(typed);

  return (
    <Panel>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="text-[0.85em] text-ink-300">The user types:</span>
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          className="w-40 rounded-xl border border-white/12 bg-ink-950/70 px-3 py-1.5 font-mono text-[0.95em] text-ink-100 outline-none focus:border-mint-500/60"
        />
        <Chip active={convert} onClick={() => setConvert((v) => !v)} tone="mint">
          {convert ? "int(input(...))" : "input(...)"}
        </Chip>
      </div>

      <div className="grid items-center gap-3 sm:grid-cols-[auto_1fr]">
        <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5">
          <Keyboard className="h-7 w-7 text-ink-300" />
        </div>
        <div className="space-y-3">
          <motion.div
            key={typed}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-white/10 bg-ink-950/70 px-4 py-3 font-mono text-[0.95em]"
          >
            <CodeLine text={convert ? 'value = int(input("Enter: "))' : 'value = input("Enter: ")'} />
          </motion.div>
          <div className="flex justify-center">
            <ArrowDown className="h-4 w-4 text-ink-500" />
          </div>
          <div
            className={`rounded-2xl border px-4 py-3 ${
              convert && !numeric ? "border-rose-ember/50 bg-rose-ember/10" : "border-mint-500/40 bg-mint-500/10"
            }`}
          >
            {convert && !numeric ? (
              <span className="font-mono text-[0.92em] text-rose-ember">
                ValueError: invalid literal for int() with base 10: &apos;{typed}&apos;
              </span>
            ) : (
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-[0.82em] text-ink-400">value =</span>
                <span className="font-mono text-[1.25em] font-semibold text-mint-400">
                  {convert ? typed : `"${typed}"`}
                </span>
                <span className="rounded-full border border-white/12 bg-white/5 px-2 py-0.5 font-mono text-[0.72em] text-ink-300">
                  {convert ? "int" : "str"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 rounded-xl border border-sun-500/30 bg-sun-600/12 px-4 py-3 text-[0.92em] text-ink-100">
        {convert
          ? "int() converts the typed text into a number, so arithmetic works — but it fails loudly if the text is not a whole number."
          : "input() always hands back a string. Even \"25\" is text until you convert it, which is why \"7\" + \"2\" gives \"72\"."}
      </p>
    </Panel>
  );
}
