"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { Panel, Label, Chip, Toggle } from "./shared";
import { CodeLine } from "@/components/ui/CodeBlock";
import StepControls, { usePlayer } from "@/components/ui/StepControls";

/* ------------------------------------------------------------------ */
/* precedence — collapse an expression one operator at a time          */
/* ------------------------------------------------------------------ */

type Reduction = { expr: string; note: string };

const EXPRESSIONS: Record<string, Reduction[]> = {
  "2 + 3 * 5": [
    { expr: "2 + 3 * 5", note: "Two operators. Which one goes first?" },
    { expr: "2 + 15", note: "* has higher priority than +, so 3 * 5 is evaluated first." },
    { expr: "17", note: "Then the addition. The answer is 17, not 25." },
  ],
  "(2 + 3) * 5": [
    { expr: "(2 + 3) * 5", note: "Brackets have the highest priority of all." },
    { expr: "5 * 5", note: "The bracketed addition happens first." },
    { expr: "25", note: "Use brackets whenever you want to override the default order." },
  ],
  "9 % 6 % 2": [
    { expr: "9 % 6 % 2", note: "Equal priority, side by side — so binding direction decides." },
    { expr: "3 % 2", note: "Left-sided binding: 9 % 6 gives 3." },
    { expr: "1", note: "Then 3 % 2 gives 1. Right-to-left would have caused a division-by-zero error." },
  ],
  "2 ** 2 ** 3": [
    { expr: "2 ** 2 ** 3", note: "Power is the exception: it binds RIGHT to left." },
    { expr: "2 ** 8", note: "So 2 ** 3 = 8 is evaluated first." },
    { expr: "256", note: "2 ** 8 = 256. Left-to-right would have given 4 ** 3 = 64." },
  ],
  "10 - 4 - 3": [
    { expr: "10 - 4 - 3", note: "Ordinary left-to-right binding." },
    { expr: "6 - 3", note: "(10 - 4) happens first." },
    { expr: "3", note: "Right-to-left would have given 10 - (4 - 3) = 9." },
  ],
  "5 + 4 // 3 * 2": [
    { expr: "5 + 4 // 3 * 2", note: "Three operators of two different priorities." },
    { expr: "5 + 1 * 2", note: "// and * outrank +. Left to right, so 4 // 3 = 1 first." },
    { expr: "5 + 2", note: "Then 1 * 2 = 2." },
    { expr: "7", note: "Finally the addition." },
  ],
};

export function Precedence({ expression = "2 + 3 * 5" }: { expression?: string }) {
  const [key, setKey] = useState(expression in EXPRESSIONS ? expression : "2 + 3 * 5");
  const steps = EXPRESSIONS[key];
  const player = usePlayer(steps.length);
  const current = steps[player.step];

  return (
    <Panel>
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.keys(EXPRESSIONS).map((k) => (
          <Chip key={k} active={key === k} onClick={() => setKey(k)}>
            {k}
          </Chip>
        ))}
      </div>

      <div className="flex min-h-[6rem] items-center justify-center rounded-2xl border border-white/10 bg-ink-950/70 px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${key}-${player.step}`}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -10 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="font-mono text-[1.8em] tracking-wide text-ink-100 sm:text-[2.4em]"
          >
            {current.expr}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        {steps.map((_, i) => (
          <motion.span
            key={i}
            animate={{
              width: i === player.step ? 26 : 8,
              backgroundColor: i <= player.step ? "#7c6cff" : "rgba(255,255,255,0.14)",
            }}
            className="h-2 rounded-full"
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={`${key}-${player.step}-note`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="mt-4 rounded-xl border border-iris-500/30 bg-iris-600/12 px-4 py-3 text-center text-[0.98em] text-ink-100"
        >
          {current.note}
        </motion.p>
      </AnimatePresence>

      <div className="mt-4">
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
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* comparison-lab                                                      */
/* ------------------------------------------------------------------ */

const COMPARISONS = [
  { op: "==", fn: (a: number, b: number) => a === b, desc: "the values are equal" },
  { op: "!=", fn: (a: number, b: number) => a !== b, desc: "the values are NOT equal" },
  { op: ">", fn: (a: number, b: number) => a > b, desc: "the left is greater than the right" },
  { op: "<", fn: (a: number, b: number) => a < b, desc: "the left is less than the right" },
  { op: ">=", fn: (a: number, b: number) => a >= b, desc: "the left is greater than or equal to the right" },
  { op: "<=", fn: (a: number, b: number) => a <= b, desc: "the left is less than or equal to the right" },
];

export function ComparisonLab() {
  const [a, setA] = useState(5);
  const [b, setB] = useState(5);

  const num = (v: number, set: (n: number) => void, label: string) => (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[0.85em] text-ink-400">{label}</span>
      <button
        onClick={() => set(v - 1)}
        className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 text-ink-200 hover:border-iris-500/50"
      >
        −
      </button>
      <motion.span
        key={v}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        className="w-12 rounded-lg border border-white/12 bg-ink-950/70 py-1 text-center font-mono text-[1.1em] font-semibold text-ink-100"
      >
        {v}
      </motion.span>
      <button
        onClick={() => set(v + 1)}
        className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 text-ink-200 hover:border-iris-500/50"
      >
        +
      </button>
    </div>
  );

  return (
    <Panel>
      <div className="mb-5 flex flex-wrap items-center justify-center gap-6">
        {num(a, setA, "a =")}
        {num(b, setB, "b =")}
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {COMPARISONS.map((c) => {
          const result = c.fn(a, b);
          return (
            <motion.div
              key={c.op}
              layout
              className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition ${
                result ? "border-mint-500/40 bg-mint-600/10" : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <span className="font-mono text-[1.05em] text-ink-100">
                {a} {c.op} {b}
              </span>
              <motion.span
                key={`${c.op}${result}`}
                initial={{ scale: 1.35, opacity: 0.4 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className={`rounded-lg px-2.5 py-0.5 font-mono text-[0.9em] font-bold ${
                  result ? "bg-mint-500/25 text-mint-400" : "bg-white/8 text-ink-400"
                }`}
              >
                {String(result)}
              </motion.span>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-4 rounded-xl border border-rose-ember/30 bg-rose-ember/10 px-4 py-3 text-[0.92em] text-ink-100">
        <span className="font-mono font-semibold text-rose-ember">=</span> assigns a value.{" "}
        <span className="font-mono font-semibold text-rose-ember">==</span> compares two values. A comparison always
        produces True or False — which is exactly what an <span className="font-mono">if</span> statement needs.
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* logic-lab                                                           */
/* ------------------------------------------------------------------ */

export function LogicLab() {
  const [x, setX] = useState(true);
  const [y, setY] = useState(false);

  const rows = [
    { expr: "x and y", value: x && y, desc: "True only if BOTH operands are true" },
    { expr: "x or y", value: x || y, desc: "True if EITHER operand is true" },
    { expr: "not x", value: !x, desc: "True if the operand is false (it complements the operand)" },
  ];

  return (
    <Panel>
      <div className="mb-5 flex flex-wrap justify-center gap-3">
        <Toggle on={x} onClick={() => setX((v) => !v)} label="x =" />
        <Toggle on={y} onClick={() => setY((v) => !v)} label="y =" />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {rows.map((r) => (
          <div
            key={r.expr}
            className={`rounded-2xl border px-4 py-4 text-center transition ${
              r.value ? "border-mint-500/45 bg-mint-600/12" : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <div className="font-mono text-[1.05em] text-ink-200">{r.expr}</div>
            <motion.div
              key={`${r.expr}${r.value}`}
              initial={{ scale: 1.4, opacity: 0.3 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 17 }}
              className={`my-2 font-mono text-[1.7em] font-bold ${r.value ? "text-mint-400" : "text-ink-500"}`}
            >
              {String(r.value)}
            </motion.div>
            <div className="text-[0.8em] leading-snug text-ink-400">{r.desc}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-center font-mono text-[0.88em]">
          <thead className="bg-white/[0.05] text-ink-300">
            <tr>
              {["x", "y", "x and y", "x or y", "not x"].map((h) => (
                <th key={h} className="px-3 py-2 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              [true, true],
              [true, false],
              [false, true],
              [false, false],
            ].map(([rx, ry]) => {
              const live = rx === x && ry === y;
              return (
                <tr
                  key={`${rx}${ry}`}
                  className={`border-t border-white/8 ${live ? "bg-iris-500/15 text-iris-300" : "text-ink-400"}`}
                >
                  <td className="px-3 py-1.5">{String(rx)}</td>
                  <td className="px-3 py-1.5">{String(ry)}</td>
                  <td className="px-3 py-1.5">{String(rx && ry)}</td>
                  <td className="px-3 py-1.5">{String(rx || ry)}</td>
                  <td className="px-3 py-1.5">{String(!rx)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* identity-memory — == vs is                                          */
/* ------------------------------------------------------------------ */

const IDENTITY_CASES = [
  {
    code: "x1 = 5\ny1 = 5",
    a: "5",
    b: "5",
    shared: true,
    eq: true,
    note: "Small integers are cached by the interpreter, so both names point at the SAME object. x1 is y1 → True.",
  },
  {
    code: "x2 = 'Hello'\ny2 = 'Hello'",
    a: "'Hello'",
    b: "'Hello'",
    shared: true,
    eq: true,
    note: "Short identical strings are also reused, so x2 is y2 → True.",
  },
  {
    code: "x3 = [1,2,3]\ny3 = [1,2,3]",
    a: "[1, 2, 3]",
    b: "[1, 2, 3]",
    shared: false,
    eq: true,
    note: "Lists get a fresh place in memory each time. They are EQUAL but not IDENTICAL — x3 is y3 → False.",
  },
  {
    code: "x4 = [1,2,3]\ny4 = x4",
    a: "[1, 2, 3]",
    b: "→ same object",
    shared: true,
    eq: true,
    note: "Assigning one name to another copies the ARROW, not the list. Now both names reach the same object.",
  },
];

export function IdentityMemory() {
  const [i, setI] = useState(0);
  const c = IDENTITY_CASES[i];

  return (
    <Panel>
      <div className="mb-4 flex flex-wrap gap-2">
        {IDENTITY_CASES.map((cs, idx) => (
          <Chip key={idx} active={i === idx} onClick={() => setI(idx)}>
            {cs.code.split("\n")[0].split(" ")[0]}
          </Chip>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-2xl border border-white/10 bg-ink-950/70 px-4 py-3 font-mono text-[0.95em]">
          {c.code.split("\n").map((l, k) => (
            <div key={k}>
              <CodeLine text={l} />
            </div>
          ))}
        </div>

        <div>
          <Label>Memory</Label>
          <div className="relative rounded-2xl border border-white/10 bg-ink-950/50 px-4 py-5">
            <div className="flex items-center justify-around gap-4">
              {["first", "second"].map((slot, k) => (
                <div key={slot} className="text-center">
                  <div className="font-mono text-[0.8em] text-ink-400">
                    {c.code.split("\n")[k]?.split(" ")[0]}
                  </div>
                  <motion.div
                    layoutId={c.shared ? (k === 0 ? "objA" : "objA") : k === 0 ? "objA" : "objB"}
                    key={`${i}-${k}-${c.shared}`}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`mt-2 rounded-xl border px-4 py-3 font-mono text-[1em] ${
                      c.shared ? "border-mint-500/50 bg-mint-500/12 text-mint-400" : "border-iris-500/45 bg-iris-500/12 text-iris-300"
                    }`}
                  >
                    {k === 0 ? c.a : c.b}
                  </motion.div>
                  <div className="mt-1.5 font-mono text-[0.7em] text-ink-500">
                    {c.shared ? "id: 0x1A2B" : k === 0 ? "id: 0x1A2B" : "id: 0x9F3C"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-center">
              <div className="font-mono text-[0.8em] text-ink-400">==  (equal values?)</div>
              <div className={`font-mono text-[1.2em] font-bold ${c.eq ? "text-mint-400" : "text-rose-ember"}`}>
                {String(c.eq)}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-center">
              <div className="font-mono text-[0.8em] text-ink-400">is  (same object?)</div>
              <div className={`font-mono text-[1.2em] font-bold ${c.shared ? "text-mint-400" : "text-rose-ember"}`}>
                {String(c.shared)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="mt-4 rounded-xl border border-iris-500/30 bg-iris-600/12 px-4 py-3 text-[0.94em] text-ink-100"
        >
          {c.note}
        </motion.p>
      </AnimatePresence>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* membership-scan                                                     */
/* ------------------------------------------------------------------ */

const SEQUENCES = [
  { label: "'Hello world'", items: "Hello world".split(""), kind: "string" as const },
  { label: "[10, 20, 30, 40]", items: ["10", "20", "30", "40"], kind: "list" as const },
  { label: "{1:'a', 2:'b'}", items: ["1", "2"], kind: "dict" as const },
];

export function MembershipScan() {
  const [seqIdx, setSeqIdx] = useState(0);
  const [needle, setNeedle] = useState("H");
  const seq = SEQUENCES[seqIdx];

  const matchIndex = useMemo(() => seq.items.findIndex((it) => it === needle), [seq, needle]);
  const player = usePlayer(seq.items.length + 1);
  const scanned = player.step;
  const found = matchIndex >= 0 && scanned > matchIndex;
  const finished = scanned >= seq.items.length;

  return (
    <Panel>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {SEQUENCES.map((s, i) => (
          <Chip
            key={s.label}
            active={seqIdx === i}
            onClick={() => {
              setSeqIdx(i);
              setNeedle(SEQUENCES[i].items[0]);
              player.reset();
            }}
          >
            {s.label}
          </Chip>
        ))}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.85em] text-ink-400">looking for</span>
          <input
            value={needle}
            onChange={(e) => {
              setNeedle(e.target.value);
              player.reset();
            }}
            className="w-20 rounded-xl border border-white/12 bg-ink-950/70 px-2 py-1 text-center font-mono text-[0.95em] text-ink-100 outline-none focus:border-mint-500/60"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-5">
        <div className="mb-3 font-mono text-[0.85em] text-ink-400">
          {seq.kind === "dict" ? "in searches the KEYS of a dictionary" : `scanning ${seq.label}`}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {seq.items.map((it, i) => {
            const isCurrent = i === scanned - 1;
            const isMatch = it === needle && scanned > i;
            return (
              <motion.span
                key={i}
                animate={{
                  scale: isCurrent ? 1.18 : 1,
                  backgroundColor: isMatch
                    ? "rgba(45,212,191,0.28)"
                    : isCurrent
                      ? "rgba(255,176,32,0.22)"
                      : i < scanned
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(255,255,255,0.02)",
                }}
                className={`flex h-10 min-w-[2.2rem] items-center justify-center rounded-lg border px-1.5 font-mono text-[0.95em] ${
                  isMatch
                    ? "border-mint-500/60 text-mint-400"
                    : isCurrent
                      ? "border-sun-500/60 text-sun-400"
                      : "border-white/10 text-ink-300"
                }`}
              >
                {it === " " ? "␣" : it}
              </motion.span>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div
          className={`rounded-2xl border px-4 py-3 text-center font-mono ${
            found ? "border-mint-500/45 bg-mint-600/12 text-mint-400" : "border-white/10 bg-white/[0.03] text-ink-400"
          }`}
        >
          <div className="text-[0.82em] text-ink-400">&apos;{needle}&apos; in {seq.label}</div>
          <div className="text-[1.3em] font-bold">{finished || found ? String(found) : "…"}</div>
        </div>
        <div
          className={`rounded-2xl border px-4 py-3 text-center font-mono ${
            finished && !found ? "border-mint-500/45 bg-mint-600/12 text-mint-400" : "border-white/10 bg-white/[0.03] text-ink-400"
          }`}
        >
          <div className="text-[0.82em] text-ink-400">&apos;{needle}&apos; not in {seq.label}</div>
          <div className="text-[1.3em] font-bold">{finished || found ? String(!found) : "…"}</div>
        </div>
      </div>

      <div className="mt-4">
        <StepControls
          step={player.step}
          total={seq.items.length + 1}
          playing={player.playing}
          onPlay={player.toggle}
          onPrev={player.prev}
          onNext={player.next}
          onReset={player.reset}
          onScrub={player.setStep}
          speed={player.speed}
          onSpeed={player.setSpeed}
          label="Item"
        />
      </div>
    </Panel>
  );
}
