import type { Metadata } from "next";
import PracticeHub from "./PracticeHub";
import { courseStats } from "@/lib/curriculum";

export const metadata: Metadata = {
  title: "Practice",
  description: "Every practice question in the module, with instant marking and a mixed quiz mode.",
};

export default function PracticePage() {
  const stats = courseStats();
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">Practice</h1>
        <p className="mt-2 max-w-2xl text-ink-300">
          {stats.questions} questions across {stats.topics} topics — multiple choice, predict-the-output, fill the
          blanks, and write-the-code exercises marked by running your program in the browser.
        </p>
      </header>
      <PracticeHub />
    </div>
  );
}
