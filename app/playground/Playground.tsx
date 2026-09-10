"use client";

import { useState } from "react";
import RunnableCode from "@/components/ui/RunnableCode";

const SNIPPETS: { label: string; topic: string; code: string; stdin?: string[] }[] = [
  {
    label: "Hello, World!",
    topic: "Topic 3",
    code: 'print("Hello, World!")\nprint("The itsy bitsy spider \\nclimbed up the waterspout.")',
  },
  {
    label: "sep and end",
    topic: "Topic 3",
    code: 'print("My", "name", "is", "Monty", "Python.", sep="-")\nprint("Hello", end=", ")\nprint("World!")',
  },
  {
    label: "Feet and inches",
    topic: "Topic 5",
    code: 'length = 350\nfeet = length // 12\ninches = length % 12\nprint(length, "=", feet, "ft and", inches, "inches")',
  },
  {
    label: "Operator priority",
    topic: "Topic 7",
    code: "print(2 + 3 * 5)\nprint(9 % 6 % 2)\nprint(2 ** 2 ** 3)\nprint(5 / 2, 5 // 2, 5 % 2)",
  },
  {
    label: "Grade ladder",
    topic: "Topic 8",
    code: `marks = float(input("Enter the student's marks: "))

if marks < 50:
    grade = "Fail"
elif marks < 60:
    grade = "D"
elif marks < 70:
    grade = "C"
elif marks < 80:
    grade = "B"
else:
    grade = "A"

print(f"The student's grade is: {grade}")`,
    stdin: ["73"],
  },
  {
    label: "List operations",
    topic: "Topic 9",
    code: `n_list = [1, 2, 3, 4]
n_list.insert(3, 100)
print(n_list)
n_list.append(99)
print(n_list)
n_list.extend([11, 22])
print(n_list)
print(n_list[1:4], n_list[-1])`,
  },
  {
    label: "Multiplication table",
    topic: "Topic 10",
    code: `for i in range(1, 11):
    print("i =", i, ":", end="")
    for j in range(1, 11):
        print("", i * j, end="")
    print()`,
  },
  {
    label: "Countdown with while",
    topic: "Topic 11",
    code: `count = 5
while count != 0:
    print("just count, still in loop!", count)
    count = count - 1
print("Outside loop already!", count)`,
  },
  {
    label: "Functions and defaults",
    topic: "Topic 12",
    code: `def add(num1, num2=1):
    return num1 + num2

print(add(100, 200))
print(add(8))
print(add(100))`,
  },
];

export default function Playground() {
  const [i, setI] = useState(0);
  const snippet = SNIPPETS[i];

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
      <aside className="space-y-1.5">
        <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-ink-500">Load an example</div>
        {SNIPPETS.map((s, idx) => (
          <button
            key={s.label}
            onClick={() => setI(idx)}
            className={`block w-full rounded-xl border px-3 py-2.5 text-left transition ${
              i === idx
                ? "border-iris-500/50 bg-iris-500/12"
                : "border-white/8 hover:border-white/20 hover:bg-white/4"
            }`}
          >
            <span className="block text-sm font-medium text-ink-100">{s.label}</span>
            <span className="mt-0.5 block font-mono text-[11px] text-ink-500">{s.topic}</span>
          </button>
        ))}
      </aside>

      <div className="space-y-4">
        <RunnableCode key={i} initial={snippet.code} stdin={snippet.stdin ?? []} rows={16} />
        <p className="text-sm text-ink-400">
          Anything the program reads with <span className="font-mono text-ink-200">input()</span> comes from the test
          input chips above the console. Add your own by editing the example that already uses input.
        </p>
      </div>
    </div>
  );
}
