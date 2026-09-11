"use client";

import { motion } from "motion/react";

export default function ProgressRing({
  percent,
  size = 78,
  stroke = 7,
  color = "#2dd4bf",
  label,
  sub,
}: {
  percent: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
  sub?: string;
}) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - clamped / 100) }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="font-semibold text-white" style={{ fontSize: size * 0.26 }}>
          {label ?? clamped}
        </span>
        {sub ? (
          <span className="text-ink-400" style={{ fontSize: size * 0.13 }}>
            {sub}
          </span>
        ) : null}
      </div>
    </div>
  );
}
