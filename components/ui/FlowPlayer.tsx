"use client";

import { AnimatePresence, motion } from "motion/react";
import FlowchartView from "./FlowchartView";
import StepControls, { usePlayer } from "./StepControls";
import type { Flowchart } from "@/lib/curriculum/types";

export default function FlowPlayer({
  flow,
  steps,
}: {
  flow: Flowchart;
  steps?: { node: string; note: string }[];
}) {
  const list = steps ?? [];
  const player = usePlayer(Math.max(list.length, 1));
  const current = list[player.step];
  const visited = list.slice(0, player.step + 1).map((s) => s.node);

  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-ink-900/50 p-4">
        <FlowchartView flow={flow} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-ink-900/50 p-4">
        <FlowchartView flow={flow} activeNode={current?.node} visited={visited} maxHeight={520} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={player.step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="flex gap-3 rounded-2xl border border-mint-500/30 bg-mint-600/12 px-4 py-3"
        >
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint-500/25 font-mono text-[0.7em] font-bold text-mint-400">
            {player.step + 1}
          </span>
          <p className="text-[0.98em] leading-relaxed text-ink-100">{current?.note}</p>
        </motion.div>
      </AnimatePresence>

      <StepControls
        step={player.step}
        total={list.length}
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
  );
}
