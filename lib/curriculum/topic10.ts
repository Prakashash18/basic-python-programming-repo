import type { Topic, Flowchart } from "./types";

const forChart: Flowchart = {
  width: 520,
  height: 620,
  nodes: [
    { id: "start", kind: "terminal", text: "Start", x: 200, y: 38 },
    { id: "init", kind: "process", text: "Take next item\nfrom the sequence", x: 200, y: 160, w: 220 },
    { id: "check", kind: "decision", text: "Any item left ?", x: 200, y: 300, w: 210, h: 100 },
    { id: "body", kind: "process", text: "body_of_loop", x: 200, y: 450, w: 200 },
    { id: "after", kind: "process", text: "else block\n(optional)", x: 430, y: 450, w: 150 },
    { id: "end", kind: "terminal", text: "End", x: 430, y: 560 },
  ],
  edges: [
    { from: "start", to: "init" },
    { from: "init", to: "check" },
    { from: "check", to: "body", label: "True" },
    { from: "body", to: "init", points: [[60, 450], [60, 160]], fromSide: "left", toSide: "left" },
    { from: "check", to: "after", label: "False", fromSide: "right", toSide: "top" },
    { from: "after", to: "end" },
  ],
};

export const topic10: Topic = {
  num: 10,
  slug: "for-loop",
  title: "Iteration: The for Loop",
  tagline: "Repeat a set of statements once for every item in a sequence.",
  glyph: "↻",
  accent: "sun",
  objectives: [
    "Write a for loop over a list and over a string",
    "Generate number sequences with range() in all three forms",
    "Explain when the optional else block of a loop runs",
    "Trace a nested for loop and predict its full output",
  ],
  concepts: [
    {
      id: "what-is-loop",
      title: "What is a loop?",
      takeaway: "Iterating a set of statements — repeating within a fixed limit or until a condition happens.",
      minutes: 5,
      cards: [
        {
          kind: "idea",
          title: "Two kinds of repetition",
          points: [
            "Iterating a set of statements — running the same block again and again",
            "Repeating within a fixed limit, or until a condition happens",
            "FOR — use it when you know the collection or how many times",
            "WHILE — use it when you only know the stopping condition",
          ],
          callout: {
            tone: "tip",
            text: "Rule of thumb for the class: 'for each of these…' becomes a for loop. 'keep going until…' becomes a while loop.",
          },
        },
        {
          kind: "flow",
          title: "The for loop as a flowchart",
          lead: "The backwards arrow is what makes it a loop.",
          flow: forChart,
          steps: [
            { node: "start", note: "Arrive at the loop." },
            { node: "init", note: "Take the next item from the sequence and put it in the loop variable." },
            { node: "check", note: "Is there an item left to process?" },
            { node: "body", note: "True: run the body once for that item." },
            { node: "init", note: "Then loop back for the next item — automatically." },
            { node: "after", note: "False: the sequence is exhausted. Any else block runs here." },
            { node: "end", note: "Carry on with the rest of the program." },
          ],
        },
      ],
    },
    {
      id: "syntax",
      title: "for loop syntax",
      takeaway: "for <variable> in <sequence>: — the variable is refilled automatically on every pass.",
      minutes: 10,
      cards: [
        {
          kind: "code",
          title: "The shape",
          template: true,
          code: `for <variable> in <sequence>:
    # body_of_loop that has set of
    # statements which requires
    # repeated execution`,
          annotations: [
            { line: 1, label: "colon, then an indented block — just like if", tone: "rose" },
            { line: 2, label: "everything indented runs once per item", tone: "iris" },
          ],
        },
        {
          kind: "trace",
          title: "Squares of every number in a list",
          lead: "Step through all six passes and watch sq change.",
          code: `numbers = [1, 2, 4, 6, 11, 20]
sq = 0
for val in numbers:
    sq = val * val
    print(sq)`,
          steps: [
            { line: 1, vars: { numbers: "[1, 2, 4, 6, 11, 20]" }, note: "The sequence we will walk through." },
            { line: 2, vars: { numbers: "[1, 2, 4, 6, 11, 20]", sq: "0" }, note: "A variable to hold each square temporarily." },
            { line: 3, vars: { val: "1", sq: "0" }, note: "Pass 1: val takes the first item." },
            { line: 4, vars: { val: "1", sq: "1" } },
            { line: 5, vars: { val: "1", sq: "1" }, out: "1" },
            { line: 3, vars: { val: "2", sq: "1" }, note: "Pass 2: val is refilled automatically — you never write val = val + 1." },
            { line: 4, vars: { val: "2", sq: "4" } },
            { line: 5, vars: { val: "2", sq: "4" }, out: "4" },
            { line: 3, vars: { val: "4", sq: "4" }, note: "Pass 3." },
            { line: 5, vars: { val: "4", sq: "16" }, out: "16" },
            { line: 3, vars: { val: "6", sq: "16" }, note: "Pass 4." },
            { line: 5, vars: { val: "6", sq: "36" }, out: "36" },
            { line: 3, vars: { val: "11", sq: "36" }, note: "Pass 5." },
            { line: 5, vars: { val: "11", sq: "121" }, out: "121" },
            { line: 3, vars: { val: "20", sq: "121" }, note: "Pass 6 — the last item." },
            { line: 5, vars: { val: "20", sq: "400" }, out: "400" },
            { line: 5, vars: { val: "20", sq: "400" }, note: "No items left, so the loop finishes and the program moves on." },
          ],
        },
        {
          kind: "code",
          title: "Looping over a string",
          lead: "A string is a sequence of characters, so for works on it directly.",
          code: `for letter in "hello":
    print(letter)`,
          output: `h
e
l
l
o`,
          runnable: true,
        },
      ],
    },
    {
      id: "range",
      title: "The range() function",
      takeaway: "range(stop), range(start, stop), range(start, stop, step) — stop is always excluded.",
      minutes: 12,
      cards: [
        {
          kind: "anim",
          title: "Build a range",
          lead: "Change start, stop and step and watch the sequence appear.",
          anim: "range-builder",
        },
        {
          kind: "table",
          title: "Three forms",
          headers: ["Form", "Generates", "Example", "Equivalent to"],
          rows: [
            ["range(n)", "whole numbers from 0 to n-1", "range(8)", "[0,1,2,3,4,5,6,7]"],
            ["range(start, stop)", "whole numbers from start to stop-1", "range(5, 9)", "[5,6,7,8]"],
            ["range(start, stop, step)", "numbers from start, in jumps of step, stopping before stop", "range(1, 10, 2)", "[1,3,5,7,9]"],
          ],
          callout: {
            tone: "warn",
            text: "stop is never included. range(1, 5) gives 1,2,3,4. If you want 1 to 5 inclusive, write range(1, 6).",
          },
        },
        {
          kind: "trace",
          title: "Sum of the first 5 natural numbers",
          code: `sum = 0
for val in range(1, 6):
    sum = sum + val
print(sum)`,
          steps: [
            { line: 1, vars: { sum: "0" }, note: "The accumulator starts at zero — this line is essential." },
            { line: 2, vars: { val: "1", sum: "0" }, note: "range(1, 6) yields 1,2,3,4,5. The 6 is excluded." },
            { line: 3, vars: { val: "1", sum: "1" } },
            { line: 2, vars: { val: "2", sum: "1" } },
            { line: 3, vars: { val: "2", sum: "3" } },
            { line: 2, vars: { val: "3", sum: "3" } },
            { line: 3, vars: { val: "3", sum: "6" } },
            { line: 2, vars: { val: "4", sum: "6" } },
            { line: 3, vars: { val: "4", sum: "10" } },
            { line: 2, vars: { val: "5", sum: "10" }, note: "Last value from the range." },
            { line: 3, vars: { val: "5", sum: "15" } },
            { line: 4, vars: { val: "5", sum: "15" }, out: "15", note: "print is OUTSIDE the loop, so it runs once at the end." },
          ],
        },
        {
          kind: "checkpoint",
          title: "Check the room",
          ask: "What changes if we move print(sum) inside the loop (indented)?",
          answer: "It prints the running total on every pass: 1, 3, 6, 10, 15 — five lines instead of one. Indentation decides how often a statement runs.",
        },
      ],
    },
    {
      id: "for-else",
      title: "for with an else block",
      takeaway: "The else block runs once, after the loop has completed all its iterations.",
      minutes: 6,
      cards: [
        {
          kind: "code",
          title: "for..else",
          code: `for val in range(5):
    print(val)
else:
    print("The loop has completed execution")`,
          output: `0
1
2
3
4
The loop has completed execution`,
          runnable: true,
          annotations: [{ line: 3, label: "else lines up with for, not with the body", tone: "sun" }],
          callout: {
            tone: "note",
            text: "The else block executes only when the loop has completed all the iterations. It is skipped if the loop is cut short with break.",
          },
        },
      ],
    },
    {
      id: "nested-for",
      title: "Nested for loops",
      takeaway: "The inner loop runs completely for every single pass of the outer loop.",
      minutes: 12,
      cards: [
        {
          kind: "trace",
          title: "A for loop inside another for loop",
          lead: "Watch how many times the print runs: 3 outer passes × 4 inner passes = 12 lines.",
          code: `for num1 in range(3):
    for num2 in range(10, 14):
        print(num1, ",", num2)`,
          steps: [
            { line: 1, vars: { num1: "0" }, note: "Outer pass 1 begins." },
            { line: 2, vars: { num1: "0", num2: "10" }, note: "The inner loop starts from scratch." },
            { line: 3, vars: { num1: "0", num2: "10" }, out: "0 , 10" },
            { line: 3, vars: { num1: "0", num2: "11" }, out: "0 , 11" },
            { line: 3, vars: { num1: "0", num2: "12" }, out: "0 , 12" },
            { line: 3, vars: { num1: "0", num2: "13" }, out: "0 , 13", note: "Inner loop exhausted." },
            { line: 1, vars: { num1: "1" }, note: "Outer pass 2 — and the inner range restarts at 10." },
            { line: 3, vars: { num1: "1", num2: "10" }, out: "1 , 10" },
            { line: 3, vars: { num1: "1", num2: "11" }, out: "1 , 11" },
            { line: 3, vars: { num1: "1", num2: "12" }, out: "1 , 12" },
            { line: 3, vars: { num1: "1", num2: "13" }, out: "1 , 13" },
            { line: 1, vars: { num1: "2" }, note: "Outer pass 3." },
            { line: 3, vars: { num1: "2", num2: "10" }, out: "2 , 10" },
            { line: 3, vars: { num1: "2", num2: "11" }, out: "2 , 11" },
            { line: 3, vars: { num1: "2", num2: "12" }, out: "2 , 12" },
            { line: 3, vars: { num1: "2", num2: "13" }, out: "2 , 13", note: "Both loops finished: 12 lines of output in total." },
          ],
        },
        {
          kind: "code",
          title: "Multiplication table — the classic nested task",
          code: `for i in range(1, 11):
    print("i =", i, ":", end=" ")
    for j in range(1, 11):
        print(i * j, end=" ")
    print()`,
          output: `i = 1 : 1 2 3 4 5 6 7 8 9 10 
i = 2 : 2 4 6 8 10 12 14 16 18 20 
i = 3 : 3 6 9 12 15 18 21 24 27 30 
...
i = 10 : 10 20 30 40 50 60 70 80 90 100 `,
          runnable: true,
          annotations: [
            { line: 4, label: 'end=" " keeps the row on one line', tone: "sun" },
            { line: 5, label: "an empty print() ends the row", tone: "mint" },
          ],
        },
      ],
    },
  ],
  practice: [
    {
      id: "t10-q1",
      kind: "predict",
      prompt: "What is the exact output?",
      code: `for val in range(3):
    print(val)`,
      answer: "0\n1\n2",
      explain: "range(3) generates 0, 1, 2 — it starts at 0 and stops before 3.",
      difficulty: 1,
    },
    {
      id: "t10-q2",
      kind: "mcq",
      prompt: "What does range(5, 9) generate?",
      choices: [
        "5, 9",
        "5, 6, 7, 8",
        "5, 6, 7, 8, 9",
        "0, 1, 2, 3, 4",
      ],
      answer: 1,
      explain: "range(start, stop) runs from start up to stop-1. The stop value is always excluded.",
      difficulty: 1,
    },
    {
      id: "t10-q3",
      kind: "predict",
      prompt: "What is the exact output?",
      code: `for n in range(1, 10, 2):
    print(n, end=" ")`,
      answer: "1 3 5 7 9",
      explain: "The third argument is the step size, so the numbers jump by 2 starting at 1.",
      difficulty: 2,
    },
    {
      id: "t10-q4",
      kind: "predict",
      prompt: "What is the exact output?",
      code: `sum = 0
for val in range(1, 6):
    sum = sum + val
print(sum)`,
      answer: "15",
      explain: "1+2+3+4+5 = 15. print is outside the loop, so it runs once at the end.",
      difficulty: 2,
    },
    {
      id: "t10-q5",
      kind: "mcq",
      prompt: "How many lines does this nested loop print?",
      code: `for a in range(3):
    for b in range(4):
        print(a, b)`,
      choices: [
        "3",
        "4",
        "12",
        "7",
      ],
      answer: 2,
      explain: "The inner loop runs completely for each outer pass: 3 × 4 = 12.",
      difficulty: 2,
    },
    {
      id: "t10-q6",
      kind: "code",
      prompt: "Practice 1. Write a two-line program using a for statement to print each individual letter of \"hello\" on its own line.",
      starter: "",
      expected: "h\ne\nl\nl\no",
      solution: `for letter in "hello":
    print(letter)`,
      explain: "A string is a sequence, so a for loop walks through it one character at a time.",
      difficulty: 2,
    },
    {
      id: "t10-q7",
      kind: "code",
      prompt:
        "Practice 2. Fill in a for..else program that prints -1, 0, 1, 2 (each on its own line) and then prints the final value of num.",
      starter: `n = range(4)
# your code
`,
      expected: "-1\n0\n1\n2\n3",
      solution: `n = range(4)
for num in n:
    print(num - 1)
else:
    print(num)`,
      explain:
        "The loop body prints num - 1 for 0,1,2,3 giving -1,0,1,2. After the loop finishes, num still holds its last value 3, which the else block prints.",
      difficulty: 3,
    },
    {
      id: "t10-q8",
      kind: "code",
      prompt:
        "Practice 3. Use a nested for loop to print the multiplication tables for 1 to 10, one row per table, formatted as:  i = 1 : 1 2 3 4 5 6 7 8 9 10",
      starter: "",
      expected: `i = 1 : 1 2 3 4 5 6 7 8 9 10
i = 2 : 2 4 6 8 10 12 14 16 18 20
i = 3 : 3 6 9 12 15 18 21 24 27 30
i = 4 : 4 8 12 16 20 24 28 32 36 40
i = 5 : 5 10 15 20 25 30 35 40 45 50
i = 6 : 6 12 18 24 30 36 42 48 54 60
i = 7 : 7 14 21 28 35 42 49 56 63 70
i = 8 : 8 16 24 32 40 48 56 64 72 80
i = 9 : 9 18 27 36 45 54 63 72 81 90
i = 10 : 10 20 30 40 50 60 70 80 90 100`,
      solution: `for i in range(1, 11):
    print("i =", i, ":", end="")
    for j in range(1, 11):
        print("", i * j, end="")
    print()`,
      explain:
        "The outer loop chooses the table, the inner loop prints the ten products. end=\"\" keeps a row on one line, and the bare print() at the end of each outer pass starts the next row.",
      difficulty: 3,
    },
  ],
};
