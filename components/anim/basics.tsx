"use client";

import { AnimatePresence, motion } from "motion/react";
import { Fragment, useEffect, useState } from "react";
import { ArrowRight, Cpu, FileCode2, MonitorPlay } from "lucide-react";
import { Panel, Label, Chip } from "./shared";
import { CodeLine } from "@/components/ui/CodeBlock";
import Console from "@/components/ui/Console";
import StepControls, { usePlayer } from "@/components/ui/StepControls";

/* ------------------------------------------------------------------ */
/* print-flow: source → interpreter → console                          */
/* ------------------------------------------------------------------ */

const PARTS = [
  { text: "print", note: "the word print — the name of the built-in function" },
  { text: "(", note: "an opening parenthesis — it hands the data to the function" },
  { text: '"', note: "a quotation mark — text starts here" },
  { text: "Hello, World!", note: "a line of text — this is what will be displayed" },
  { text: '"', note: "another quotation mark — text stops here" },
  { text: ")", note: "a closing parenthesis — the call is complete" },
];

export function PrintFlow({ text = "Hello, World!", dissect = false }: { text?: string; dissect?: boolean }) {
  const stages = dissect ? PARTS.length + 1 : 4;
  const player = usePlayer(stages);
  const s = player.step;

  if (dissect) {
    const revealed = s;
    return (
      <Panel>
        <Label>Anatomy of a statement</Label>
        <div className="flex flex-wrap items-center gap-0.5 rounded-2xl border border-white/10 bg-ink-950/70 px-4 py-6 font-mono text-[1.5em] sm:text-[2em]">
          {PARTS.map((p, i) => (
            <motion.span
              key={i}
              animate={{
                opacity: i < revealed ? 1 : 0.18,
                y: i === revealed - 1 ? -6 : 0,
                scale: i === revealed - 1 ? 1.12 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`rounded-md px-1 ${
                i === revealed - 1 ? "bg-mint-500/20 text-mint-400" : "text-ink-100"
              }`}
            >
              {p.text}
            </motion.span>
          ))}
        </div>

        <div className="mt-4 min-h-[3.5rem]">
          <AnimatePresence mode="wait">
            <motion.p
              key={s}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-xl border border-iris-500/30 bg-iris-600/12 px-4 py-3 text-[0.98em] text-ink-100"
            >
              {s === 0
                ? "Six parts, and every one is required. Step forward to name them."
                : PARTS[s - 1].note}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-4">
          <StepControls
            step={s}
            total={stages}
            playing={player.playing}
            onPlay={player.toggle}
            onPrev={player.prev}
            onNext={player.next}
            onReset={player.reset}
            onScrub={player.setStep}
            speed={player.speed}
            onSpeed={player.setSpeed}
            label="Part"
          />
        </div>
      </Panel>
    );
  }

  const boxes = [
    { Icon: FileCode2, title: "Source code", sub: "hello.py on your disk", tone: "text-iris-300" },
    { Icon: Cpu, title: "Interpreter", sub: "reads line 1, then line 2…", tone: "text-sun-400" },
    { Icon: MonitorPlay, title: "Console", sub: "the output appears here", tone: "text-mint-400" },
  ];

  return (
    <Panel>
      <Label>From what you type to what you see</Label>
      <div className="grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {boxes.map((b, i) => (
          <Fragment key={b.title}>
            <motion.div
              animate={{
                borderColor: s > i ? "rgba(45,212,191,0.5)" : "rgba(255,255,255,0.1)",
                backgroundColor: s > i ? "rgba(45,212,191,0.08)" : "rgba(255,255,255,0.03)",
              }}
              className="flex flex-col items-center gap-2 rounded-2xl border px-4 py-5 text-center"
            >
              <b.Icon className={`h-6 w-6 ${s > i ? b.tone : "text-ink-500"}`} />
              <div className="text-[0.95em] font-semibold text-ink-100">{b.title}</div>
              <div className="text-[0.8em] text-ink-400">{b.sub}</div>
              <div className="mt-1 min-h-[2rem] font-mono text-[0.82em]">
                {i === 0 && s > 0 ? <CodeLine text={`print("${text}")`} /> : null}
                {i === 1 && s > 1 ? <span className="text-sun-400">display the text {text}</span> : null}
                {i === 2 && s > 2 ? (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-mint-400"
                  >
                    {text}
                  </motion.span>
                ) : null}
              </div>
            </motion.div>
            {i < 2 ? (
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ x: s > i + 1 ? [0, 6, 0] : 0, opacity: s > i + 1 ? 1 : 0.25 }}
                  transition={{ duration: 1.1, repeat: s > i + 1 ? Infinity : 0 }}
                >
                  <ArrowRight className={`h-5 w-5 ${s > i + 1 ? "text-mint-400" : "text-ink-600"} rotate-90 sm:rotate-0`} />
                </motion.div>
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>
      <div className="mt-4">
        <StepControls
          step={s}
          total={stages}
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
/* escape-chars                                                        */
/* ------------------------------------------------------------------ */

const ESCAPES = [
  { seq: "\\n", src: 'print("one\\ntwo")', out: "one\ntwo", desc: "newline — the cursor jumps to the start of the next line" },
  { seq: "\\t", src: 'print("a\\tb")', out: "a\tb", desc: "tab — jumps to the next tab stop" },
  { seq: '\\"', src: 'print("I like \\"Python\\"")', out: 'I like "Python"', desc: "a quote character that does not end the string" },
  { seq: "\\\\", src: 'print("C:\\\\Users")', out: "C:\\Users", desc: "one real backslash" },
];

export function EscapeChars() {
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const active = ESCAPES[i];

  useEffect(() => {
    setRevealed(false);
    const t = setTimeout(() => setRevealed(true), 550);
    return () => clearTimeout(t);
  }, [i]);

  return (
    <Panel>
      <div className="mb-4 flex flex-wrap gap-2">
        {ESCAPES.map((e, idx) => (
          <Chip key={e.seq} active={i === idx} onClick={() => setI(idx)} tone="sun">
            {e.seq}
          </Chip>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>What you type</Label>
          <div className="rounded-2xl border border-white/10 bg-ink-950/70 px-4 py-4 font-mono text-[1.05em]">
            <CodeLine text={active.src} />
          </div>
        </div>
        <div>
          <Label>What the console shows</Label>
          <AnimatePresence mode="wait">
            <motion.pre
              key={i + String(revealed)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-h-[5.5rem] whitespace-pre rounded-2xl border border-mint-500/25 bg-black/50 px-4 py-4 font-mono text-[1.05em] text-mint-400"
            >
              {revealed ? active.out : ""}
              {!revealed ? <span className="text-ink-600">…</span> : null}
            </motion.pre>
          </AnimatePresence>
        </div>
      </div>

      <motion.p
        key={active.seq}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 rounded-xl border border-sun-500/30 bg-sun-600/12 px-4 py-3 text-[0.95em] text-ink-100"
      >
        <span className="font-mono font-semibold text-sun-400">{active.seq}</span> — {active.desc}
      </motion.p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* print-args: sep and end                                             */
/* ------------------------------------------------------------------ */

const SEPS = [
  { v: " ", label: "default" },
  { v: "-", label: '"-"' },
  { v: "", label: '""' },
  { v: " | ", label: '" | "' },
];
const ENDS = [
  { v: "\n", label: "default \\n" },
  { v: " ", label: '" "' },
  { v: "", label: '""' },
  { v: " → ", label: '" → "' },
];

export function PrintArgs() {
  const [sep, setSep] = useState(0);
  const [end, setEnd] = useState(0);
  const values = ["My", "name", "is", "Python."];

  const call =
    `print("My", "name", "is", "Python.")`.replace(
      ")",
      `${sep > 0 ? `, sep="${SEPS[sep].v}"` : ""}${end > 0 ? `, end="${ENDS[end].v.replace("\n", "\\n")}"` : ""})`,
    );

  return (
    <Panel>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label>sep — what goes between the values</Label>
            <div className="flex flex-wrap gap-2">
              {SEPS.map((s, i) => (
                <Chip key={s.label} active={sep === i} onClick={() => setSep(i)}>
                  {s.label}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <Label>end — what goes after the last value</Label>
            <div className="flex flex-wrap gap-2">
              {ENDS.map((e, i) => (
                <Chip key={e.label} active={end === i} onClick={() => setEnd(i)} tone="sun">
                  {e.label}
                </Chip>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-ink-950/70 px-4 py-3 font-mono text-[0.92em]">
            <CodeLine text={call} />
            <br />
            <CodeLine text={'print("Next line.")'} />
          </div>
        </div>

        <div>
          <Label>Console</Label>
          <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
            <div className="flex flex-wrap items-center font-mono text-[1.05em] text-mint-400">
              {values.map((v, i) => (
                <span key={i} className="flex items-center">
                  <motion.span layout>{v}</motion.span>
                  {i < values.length - 1 ? (
                    <motion.span
                      layout
                      key={`sep${sep}`}
                      initial={{ backgroundColor: "rgba(124,108,255,0.5)" }}
                      animate={{ backgroundColor: "rgba(124,108,255,0)" }}
                      transition={{ duration: 0.8 }}
                      className="whitespace-pre rounded text-iris-300"
                    >
                      {SEPS[sep].v || "\u200b"}
                    </motion.span>
                  ) : null}
                </span>
              ))}
              <motion.span
                layout
                key={`end${end}`}
                initial={{ backgroundColor: "rgba(255,176,32,0.5)" }}
                animate={{ backgroundColor: "rgba(255,176,32,0)" }}
                transition={{ duration: 0.8 }}
                className="whitespace-pre rounded text-sun-400"
              >
                {ENDS[end].v === "\n" ? "" : ENDS[end].v}
              </motion.span>
              {ENDS[end].v === "\n" ? <div className="w-full" /> : null}
              <motion.span layout>Next line.</motion.span>
            </div>
          </div>
          <p className="mt-3 text-[0.88em] text-ink-300">
            {ENDS[end].v === "\n"
              ? "The default end is a newline, which is why each print() normally starts a fresh line."
              : "With end changed, the next print() carries on along the same line."}
          </p>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* comment-strip                                                       */
/* ------------------------------------------------------------------ */

const COMMENTED = `''' Program: greeting
Written for Topic 4. '''

# First print statement
print("How are You all?")

print("Welcome to Basic Python")  # Third print statement`;

export function CommentStrip() {
  const [stripped, setStripped] = useState(false);

  const isComment = (line: string, insideBlock: boolean) =>
    insideBlock || line.trimStart().startsWith("#") || line.trimStart().startsWith("'''");

  const lines = COMMENTED.split("\n");
  let inBlock = false;
  const flags = lines.map((l) => {
    const t = l.trim();
    const opens = t.startsWith("'''");
    const closes = t.endsWith("'''") && t.length > 3;
    if (inBlock) {
      if (t.endsWith("'''")) {
        inBlock = false;
      }
      return true;
    }
    if (opens && !closes) {
      inBlock = true;
      return true;
    }
    return isComment(l, false);
  });

  return (
    <Panel>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setStripped((v) => !v)}
          className="rounded-xl border border-iris-500/40 bg-iris-500/15 px-4 py-2 text-[0.9em] font-semibold text-iris-300 transition hover:bg-iris-500/25"
        >
          {stripped ? "Show the file as you wrote it" : "Show what Python actually runs"}
        </button>
        <span className="text-[0.85em] text-ink-400">
          {stripped ? "Comments removed — the output is identical." : "Comments are for humans only."}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-white/10 bg-ink-950/70 py-3">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: stripped && flags[i] ? 0.12 : 1,
                filter: stripped && flags[i] ? "blur(1.5px)" : "blur(0px)",
                height: "auto",
              }}
              transition={{ duration: 0.45, delay: stripped ? i * 0.04 : 0 }}
              className="px-4 font-mono text-[0.92em] leading-[1.8]"
            >
              {line.length ? <CodeLine text={line} /> : <>&nbsp;</>}
            </motion.div>
          ))}
        </div>
        <Console text={"How are You all?\nWelcome to Basic Python"} label="Output — unchanged" />
      </div>
    </Panel>
  );
}
