"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { BoltIcon } from "./Icons";

/**
 * A tiny event bus so any component can throw a "+N XP" toast without the HUD
 * and the practice cards needing to know about each other.
 */
const EVENT = "pyteach:xp";

export function awardToast(amount: number, note?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { amount, note } }));
}

type Toast = { id: number; amount: number; note?: string };

export default function XpToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let n = 0;
    const onXp = (e: Event) => {
      const { amount, note } = (e as CustomEvent<{ amount: number; note?: string }>).detail;
      const id = ++n;
      setToasts((t) => [...t, { id, amount, note }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
    };
    window.addEventListener(EVENT, onXp);
    return () => window.removeEventListener(EVENT, onXp);
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 flex flex-col items-end gap-2 sm:right-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="flex items-center gap-2 rounded-full border border-sun-500/45 bg-sun-500/20 px-4 py-2 shadow-[0_14px_32px_-12px_rgba(255,176,32,0.8)] backdrop-blur"
          >
            <span className="text-sun-400">
              <BoltIcon />
            </span>
            <span className="text-sm font-bold text-sun-400">+{t.amount} XP</span>
            {t.note ? <span className="text-xs text-ink-200">{t.note}</span> : null}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
