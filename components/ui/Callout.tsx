import { Info, TriangleAlert, Lightbulb } from "lucide-react";

const map = {
  note: { Icon: Info, ring: "border-iris-500/35 bg-iris-600/12", text: "text-iris-300", label: "Note" },
  warn: { Icon: TriangleAlert, ring: "border-rose-ember/35 bg-rose-ember/12", text: "text-rose-ember", label: "Watch out" },
  tip: { Icon: Lightbulb, ring: "border-sun-500/35 bg-sun-600/12", text: "text-sun-400", label: "Teaching tip" },
} as const;

export default function Callout({ tone, text }: { tone: "note" | "warn" | "tip"; text: string }) {
  const { Icon, ring, text: color, label } = map[tone];
  return (
    <div className={`flex gap-3 rounded-2xl border px-4 py-3 ${ring}`}>
      <Icon className={`mt-0.5 h-[1.15em] w-[1.15em] shrink-0 ${color}`} />
      <div className="min-w-0">
        <div className={`text-[0.72em] font-semibold uppercase tracking-wider ${color}`}>{label}</div>
        <p className="mt-0.5 text-[0.95em] leading-relaxed text-ink-200">{text}</p>
      </div>
    </div>
  );
}
