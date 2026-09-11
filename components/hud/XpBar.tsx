"use client";

import { motion } from "motion/react";

export default function XpBar({ percent, height = 9 }: { percent: number; height?: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="relative overflow-hidden rounded-full bg-white/8" style={{ height }}>
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-iris-500 to-mint-500"
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
      <span className="hud-beam absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
    </div>
  );
}
