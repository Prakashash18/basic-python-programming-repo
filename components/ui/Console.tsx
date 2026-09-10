"use client";

import { motion } from "motion/react";
import { Terminal } from "lucide-react";

export default function Console({
  text,
  label = "Console",
  typing = false,
  tone = "normal",
  className = "",
}: {
  text: string;
  label?: string;
  typing?: boolean;
  tone?: "normal" | "error";
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-white/10 bg-black/50 ${className}`}>
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2">
        <Terminal className="h-3.5 w-3.5 text-mint-400" />
        <span className="font-mono text-[0.72em] uppercase tracking-wider text-ink-300">{label}</span>
      </div>
      <motion.pre
        key={text}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        className={`max-h-[45vh] overflow-auto px-4 py-3 font-mono text-[0.92em] leading-[1.7] whitespace-pre-wrap break-words ${
          tone === "error" ? "text-rose-ember" : "text-mint-400"
        } ${typing ? "caret" : ""}`}
      >
        {text || (typing ? "" : <span className="text-ink-500">(no output yet)</span>)}
      </motion.pre>
    </div>
  );
}
