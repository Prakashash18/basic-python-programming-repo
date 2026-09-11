"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { Check, X, Lightbulb, Eye, RefreshCw } from "lucide-react";
import type { Question } from "@/lib/curriculum/types";
import CodeBlock, { CodeLine } from "@/components/ui/CodeBlock";
import RunnableCode from "@/components/ui/RunnableCode";
import { outputMatches } from "@/lib/python-runner";

const DIFF_LABEL = ["", "Warm-up", "Core", "Stretch"];
const DIFF_TONE = [
  "",
  "text-mint-400 border-mint-500/35 bg-mint-600/10",
  "text-iris-300 border-iris-500/35 bg-iris-600/10",
  "text-sun-400 border-sun-500/35 bg-sun-600/10",
];

function Verdict({ correct, children }: { correct: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div
        className={`mt-4 flex gap-3 rounded-2xl border px-4 py-3 ${
          correct ? "border-mint-500/40 bg-mint-600/12" : "border-sun-500/40 bg-sun-600/12"
        }`}
      >
        {correct ? (
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-mint-400" />
        ) : (
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-sun-400" />
        )}
        <div className="min-w-0 flex-1 text-[0.98em] leading-relaxed text-ink-100">{children}</div>
      </div>
    </motion.div>
  );
}

export default function QuestionCard({
  question,
  index,
  onAnswer,
  alreadyCorrect,
}: {
  question: Question;
  index: number;
  onAnswer?: (id: string, correct: boolean) => void;
  alreadyCorrect?: boolean;
}) {
  const [state, setState] = useState<"open" | "right" | "wrong">("open");
  const [choice, setChoice] = useState<number | null>(null);
  const [typed, setTyped] = useState("");
  const [blanks, setBlanks] = useState<string[]>(question.kind === "fill" ? question.blanks.map(() => "") : []);
  const [revealed, setRevealed] = useState(false);
  const [ranOnce, setRanOnce] = useState(false);

  const settle = (correct: boolean) => {
    setState(correct ? "right" : "wrong");
    onAnswer?.(question.id, correct);
  };

  const reset = () => {
    setState("open");
    setChoice(null);
    setTyped("");
    setBlanks(question.kind === "fill" ? question.blanks.map(() => "") : []);
    setRevealed(false);
    setRanOnce(false);
  };

  const templateParts = useMemo(
    () => (question.kind === "fill" ? question.template.split("___") : []),
    [question],
  );

  const diff = question.difficulty ?? 2;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl border p-5 transition sm:p-6 ${
        state === "right"
          ? "border-mint-500/35 bg-mint-600/[0.06]"
          : state === "wrong"
            ? "border-sun-500/30 bg-sun-600/[0.05]"
            : "border-white/10 bg-white/[0.025]"
      }`}
    >
      <div className="mb-4 flex flex-wrap items-start gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold ${
            state === "right" ? "bg-mint-500/25 text-mint-400" : "bg-white/8 text-ink-300"
          }`}
        >
          {state === "right" ? <Check className="h-4 w-4" /> : index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <p className="whitespace-pre-line text-[1.08em] font-medium leading-snug text-ink-100">{question.prompt}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${DIFF_TONE[diff]}`}>
              {DIFF_LABEL[diff]}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-ink-400">
              {question.kind === "mcq"
                ? "multiple choice"
                : question.kind === "predict"
                  ? "predict the output"
                  : question.kind === "fill"
                    ? "fill the blanks"
                    : "write the code"}
            </span>
            {alreadyCorrect && state === "open" ? (
              <span className="rounded-full border border-mint-500/30 bg-mint-600/10 px-2.5 py-0.5 text-[11px] text-mint-400">
                solved earlier
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {question.kind === "mcq" ? (
        <div className="space-y-3">
          {question.code ? (
            <CodeBlock code={question.code} title="program.py" tryOnline={state !== "open"} />
          ) : null}
          <div className="grid gap-2">
            {question.choices.map((c, i) => {
              const picked = choice === i;
              const isAnswer = i === question.answer;
              const show = state !== "open";
              return (
                <button
                  key={i}
                  disabled={state === "right"}
                  onClick={() => {
                    setChoice(i);
                    settle(i === question.answer);
                  }}
                  className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                    show && isAnswer
                      ? "border-mint-500/55 bg-mint-600/15"
                      : show && picked
                        ? "border-rose-ember/50 bg-rose-ember/12"
                        : "border-white/10 bg-white/[0.03] hover:border-iris-500/45 hover:bg-iris-500/8"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md font-mono text-[11px] ${
                      show && isAnswer
                        ? "bg-mint-500/30 text-mint-400"
                        : show && picked
                          ? "bg-rose-ember/25 text-rose-ember"
                          : "bg-white/8 text-ink-400"
                    }`}
                  >
                    {show && isAnswer ? (
                      <Check className="h-3 w-3" />
                    ) : show && picked ? (
                      <X className="h-3 w-3" />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  <span className="min-w-0 flex-1 font-mono text-[0.95em] text-ink-100">{c}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {question.kind === "predict" ? (
        <div className="space-y-3">
          <CodeBlock code={question.code} title="program.py" tryOnline={state !== "open"} />
          <div>
            <label className="mb-1.5 block font-mono text-[0.72em] uppercase tracking-wider text-ink-400">
              Type exactly what the console will show
            </label>
            <textarea
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              rows={Math.max(question.answer.split("\n").length, 2)}
              spellCheck={false}
              disabled={state === "right"}
              placeholder="one line per line of output"
              className="w-full rounded-2xl border border-white/12 bg-black/40 px-4 py-3 font-mono text-[0.95em] text-mint-400 outline-none transition focus:border-mint-500/60 disabled:opacity-70"
            />
          </div>
          {state !== "right" ? (
            <button
              onClick={() => settle(outputMatches(typed, question.answer))}
              disabled={!typed.trim()}
              className="rounded-xl border border-mint-500/45 bg-mint-500/15 px-5 py-2 text-sm font-semibold text-mint-400 transition hover:bg-mint-500/25 disabled:opacity-35"
            >
              Check my answer
            </button>
          ) : null}
        </div>
      ) : null}

      {question.kind === "fill" ? (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-ink-950/80 px-4 py-3.5">
            <div className="whitespace-pre-wrap font-mono text-[0.95em] leading-[1.9]">
              {templateParts.map((part, i) => (
                <span key={i}>
                  <CodeLine text={part} />
                  {i < templateParts.length - 1 ? (
                    <input
                      value={blanks[i] ?? ""}
                      onChange={(e) => {
                        const next = [...blanks];
                        next[i] = e.target.value;
                        setBlanks(next);
                      }}
                      disabled={state === "right"}
                      size={Math.max((blanks[i] ?? "").length + 1, 5)}
                      spellCheck={false}
                      className={`mx-1 inline-block rounded-md border-b-2 bg-white/5 px-2 py-0.5 text-center font-mono text-[0.95em] outline-none transition ${
                        state === "right"
                          ? "border-mint-500 text-mint-400"
                          : state === "wrong"
                            ? "border-sun-500 text-ink-100"
                            : "border-iris-500/60 text-ink-100 focus:border-mint-500"
                      }`}
                    />
                  ) : null}
                </span>
              ))}
            </div>
          </div>
          {state !== "right" ? (
            <button
              onClick={() =>
                settle(
                  question.blanks.every((accepted, i) =>
                    accepted.some((a) => a.trim().toLowerCase() === (blanks[i] ?? "").trim().toLowerCase()),
                  ),
                )
              }
              disabled={blanks.some((b) => !b.trim())}
              className="rounded-xl border border-mint-500/45 bg-mint-500/15 px-5 py-2 text-sm font-semibold text-mint-400 transition hover:bg-mint-500/25 disabled:opacity-35"
            >
              Check my answer
            </button>
          ) : null}
        </div>
      ) : null}

      {question.kind === "code" ? (
        <div className="space-y-3">
          <RunnableCode
            initial={question.starter}
            stdin={question.stdin}
            onOutput={(out, err) => {
              setRanOnce(true);
              if (!err && question.expected) settle(outputMatches(out, question.expected));
              else if (err) setState("wrong");
            }}
          />
          {question.expected ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="mb-1.5 font-mono text-[0.72em] uppercase tracking-wider text-ink-400">Expected output</div>
              <pre className="whitespace-pre-wrap break-words font-mono text-[0.9em] text-ink-200">
                {question.expected}
              </pre>
            </div>
          ) : null}
          {!ranOnce ? (
            <p className="text-[0.85em] text-ink-400">
              Run your program — it is checked automatically against the expected output.
            </p>
          ) : null}
        </div>
      ) : null}

      <AnimatePresence>
        {state !== "open" ? (
          <Verdict correct={state === "right"}>
            <span className="font-semibold">{state === "right" ? "Correct. " : "Not quite yet. "}</span>
            {question.explain}
            {state === "wrong" && question.kind === "predict" ? (
              <div className="mt-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                <div className="font-mono text-[0.72em] uppercase tracking-wider text-ink-400">The real output</div>
                <pre className="mt-1 whitespace-pre-wrap font-mono text-[0.92em] text-mint-400">{question.answer}</pre>
              </div>
            ) : null}
          </Verdict>
        ) : null}
      </AnimatePresence>

      <div className="mt-4 flex flex-wrap gap-2">
        {state !== "open" ? (
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-[0.85em] text-ink-300 transition hover:text-ink-100"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Try again
          </button>
        ) : null}

        {question.kind !== "mcq" && state !== "right" ? (
          <button
            onClick={() => setRevealed((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-[0.85em] text-ink-300 transition hover:text-ink-100"
          >
            <Eye className="h-3.5 w-3.5" /> {revealed ? "Hide" : "Show"} worked answer
          </button>
        ) : null}
      </div>

      <AnimatePresence>
        {revealed ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3">
              <CodeBlock
                code={
                  question.kind === "code"
                    ? question.solution
                    : question.kind === "fill"
                      ? question.template
                          .split("___")
                          .reduce((acc, part, i) => acc + part + (question.blanks[i]?.[0] ?? ""), "")
                      : question.kind === "predict"
                        ? question.answer
                        : ""
                }
                title={question.kind === "predict" ? "expected output" : "one correct solution"}
                showLineNumbers={question.kind !== "predict"}
                tryOnline={question.kind !== "predict"}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
