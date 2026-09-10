import type { Topic, Flowchart } from "./types";

const whileChart: Flowchart = {
  width: 520,
  height: 560,
  nodes: [
    { id: "start", kind: "terminal", text: "Start", x: 210, y: 38 },
    { id: "check", kind: "decision", text: "condition ?", x: 210, y: 190, w: 200, h: 100 },
    { id: "body", kind: "process", text: "body of loop", x: 210, y: 350, w: 200 },
    { id: "after", kind: "process", text: "else block\n(optional)", x: 430, y: 350, w: 150 },
    { id: "end", kind: "terminal", text: "End", x: 430, y: 480 },
  ],
  edges: [
    { from: "start", to: "check" },
    { from: "check", to: "body", label: "True" },
    { from: "body", to: "check", points: [[70, 350], [70, 190]], fromSide: "left", toSide: "left" },
    { from: "check", to: "after", label: "False", fromSide: "right", toSide: "top" },
    { from: "after", to: "end" },
  ],
};

export const topic11: Topic = {
  num: 11,
  slug: "while-loop",
  title: "Iteration: The while Loop",
  tagline: "Repeat until a condition returns false — when you do not know how many times.",
  glyph: "∞",
  accent: "rose",
  objectives: [
    "Write a while loop with a correct condition and an update inside the body",
    "Explain the two steps the interpreter repeats on every pass",
    "Recognise and fix an infinite loop",
    "Use nested while loops and the optional else block",
  ],
  concepts: [
    {
      id: "what-is-while",
      title: "What is a while loop?",
      takeaway: "Repeat until a condition returns false. You are not certain how many times it will loop.",
      minutes: 6,
      cards: [
        {
          kind: "idea",
          title: "The defining feature",
          points: [
            "Iterating a set of statements",
            "Repeating until a condition returns false",
            "Not certain the number of times it loops",
            "Perfect for 'keep asking until the user gets it right'",
          ],
          callout: {
            tone: "tip",
            text: "for = a known number of passes. while = an unknown number. Ask the class which one a guessing game needs.",
          },
        },
        {
          kind: "flow",
          title: "The while loop as a flowchart",
          lead: "The condition is checked BEFORE the body — so the body may run zero times.",
          flow: whileChart,
          steps: [
            { node: "start", note: "Arrive at the loop." },
            { node: "check", note: "Step 1: the condition is checked. If it returns false, the loop is terminated." },
            { node: "body", note: "Step 2: if the condition returns true, the statements inside the loop are executed…" },
            { node: "check", note: "…and then control jumps to the beginning of the loop for the next iteration." },
            { node: "after", note: "These two steps repeat while the condition remains true. When it stops being true, the loop ends." },
            { node: "end", note: "Program continues below." },
          ],
        },
      ],
    },
    {
      id: "syntax",
      title: "while syntax and a first trace",
      takeaway: "while condition: — and something inside the body MUST move the condition towards False.",
      minutes: 12,
      cards: [
        {
          kind: "code",
          title: "The shape",
          code: `while condition:
    # body of the whole loop statements`,
          annotations: [
            { line: 1, label: "lower-case while, and a colon", tone: "rose" },
            { line: 2, label: "indented block, exactly like if and for", tone: "iris" },
          ],
          callout: {
            tone: "note",
            text: "1. First the condition is checked; if it returns false, the loop is terminated. 2. If the condition returns true, the statements inside the loop are executed and then control jumps back to the beginning of the loop for the next iteration.",
          },
        },
        {
          kind: "trace",
          title: "Counting up in threes",
          lead: "The loop repeats as long as num < 10 remains true.",
          code: `num = 1
while num < 10:
    print(num)
    num = num + 3`,
          steps: [
            { line: 1, vars: { num: "1" }, note: "Set up the variable the condition depends on." },
            { line: 2, vars: { num: "1" }, note: "1 < 10 is True → enter the body." },
            { line: 3, vars: { num: "1" }, out: "1" },
            { line: 4, vars: { num: "4" }, note: "The update. Without this line the loop would never end." },
            { line: 2, vars: { num: "4" }, note: "Back to the top: 4 < 10 is True." },
            { line: 3, vars: { num: "4" }, out: "4" },
            { line: 4, vars: { num: "7" } },
            { line: 2, vars: { num: "7" }, note: "7 < 10 is True." },
            { line: 3, vars: { num: "7" }, out: "7" },
            { line: 4, vars: { num: "10" } },
            { line: 2, vars: { num: "10" }, note: "10 < 10 is False → the loop terminates. 10 is never printed." },
          ],
        },
        {
          kind: "checkpoint",
          title: "Check the room",
          ask: "Why is 10 not printed even though num reaches 10?",
          answer:
            "The condition is checked BEFORE the body runs. When num becomes 10 the test 10 < 10 is False, so the body is skipped and the loop ends immediately.",
        },
      ],
    },
    {
      id: "infinite",
      title: "Infinite loops",
      takeaway: "If nothing in the body changes the condition, the loop never stops. Ctrl+C is your escape hatch.",
      minutes: 8,
      cards: [
        {
          kind: "compare",
          title: "Two ways to loop forever",
          columns: [
            {
              heading: "Example 1 — a condition that is always True",
              tone: "bad",
              code: `while True:
    print("hello")`,
              output: `hello
hello
hello
...`,
              points: ["True never becomes False", "Sometimes deliberate — combined with break"],
            },
            {
              heading: "Example 2 — the update was forgotten",
              tone: "bad",
              code: `num = 1
while num < 5:
    print(num)`,
              output: `1
1
1
...`,
              points: ["num never changes, so num < 5 stays True forever", "The most common accidental infinite loop"],
            },
          ],
        },
        {
          kind: "idea",
          title: "The three-part checklist for every while loop",
          points: [
            "1. Is the variable in the condition set up BEFORE the loop?",
            "2. Does the body change that variable?",
            "3. Will that change eventually make the condition False?",
            "If you cannot answer yes to all three, you have written an infinite loop.",
          ],
          callout: { tone: "warn", text: "If your program hangs, press Ctrl+C in the shell to interrupt it. Nothing is broken — you just wrote an infinite loop." },
        },
      ],
    },
    {
      id: "nested-while",
      title: "Nested while loops",
      takeaway: "A while inside a while — and beware, the inner condition is not reset automatically.",
      minutes: 10,
      cards: [
        {
          kind: "trace",
          title: "Follow the two counters carefully",
          lead: "This example from your slides has a subtlety worth pausing on.",
          code: `i = 1
j = 5
while i < 4:
    while j < 8:
        print(i, ",", j)
        j = j + 1
    i = i + 1`,
          steps: [
            { line: 1, vars: { i: "1", j: "—" } },
            { line: 2, vars: { i: "1", j: "5" } },
            { line: 3, vars: { i: "1", j: "5" }, note: "Outer: 1 < 4 is True." },
            { line: 4, vars: { i: "1", j: "5" }, note: "Inner: 5 < 8 is True." },
            { line: 5, vars: { i: "1", j: "5" }, out: "1 , 5" },
            { line: 6, vars: { i: "1", j: "6" } },
            { line: 5, vars: { i: "1", j: "6" }, out: "1 , 6" },
            { line: 6, vars: { i: "1", j: "7" } },
            { line: 5, vars: { i: "1", j: "7" }, out: "1 , 7" },
            { line: 6, vars: { i: "1", j: "8" }, note: "Now 8 < 8 is False — the inner loop ends." },
            { line: 7, vars: { i: "2", j: "8" }, note: "Outer counter increases." },
            {
              line: 4,
              vars: { i: "2", j: "8" },
              note: "Key point: j was NOT reset. 8 < 8 is still False, so the inner body never runs again.",
            },
            { line: 7, vars: { i: "3", j: "8" } },
            { line: 7, vars: { i: "4", j: "8" }, note: "4 < 4 is False — the outer loop ends. Total output: three lines." },
          ],
        },
        {
          kind: "checkpoint",
          title: "Check the room",
          ask: "How would you make the inner loop run fully for every value of i?",
          answer:
            "Move  j = 5  inside the outer loop, just before the inner while. Resetting the inner counter each pass is what a nested for loop does automatically.",
        },
      ],
    },
    {
      id: "while-else",
      title: "while with an else block",
      takeaway: "The else block runs once, after the condition finally turns False.",
      minutes: 6,
      cards: [
        {
          kind: "code",
          title: "while..else",
          code: `num = 10
while num > 6:
    print(num)
    num = num - 1
else:
    print("loop is finished")`,
          output: `10
9
8
7
loop is finished`,
          runnable: true,
          annotations: [{ line: 5, label: "else aligns with while", tone: "rose" }],
          callout: { tone: "note", text: "Note 6 is not printed: when num becomes 6 the condition 6 > 6 is False, the loop stops, and the else block runs." },
        },
      ],
    },
  ],
  practice: [
    {
      id: "t11-q1",
      kind: "predict",
      prompt: "What is the exact output?",
      code: `num = 1
while num < 10:
    print(num)
    num = num + 3`,
      answer: "1\n4\n7",
      explain: "num takes the values 1, 4, 7, then 10. Since 10 < 10 is False, the loop stops before printing 10.",
      difficulty: 1,
    },
    {
      id: "t11-q2",
      kind: "mcq",
      prompt: "When is the condition of a while loop checked?",
      choices: [
        "Before every pass, including the first",
        "Only after the body has run once",
        "Only at the very start",
        "After every statement inside the body",
      ],
      answer: 0,
      explain: "The condition is tested first. If it is False from the outset, the body never runs at all.",
      difficulty: 2,
    },
    {
      id: "t11-q3",
      kind: "mcq",
      prompt: "Why does this loop never end?",
      code: `num = 1
while num < 5:
    print(num)`,
      choices: [
        "Nothing in the body changes num, so num < 5 stays True",
        "print() is not allowed inside a while loop",
        "The condition should use <=",
        "num should be a string",
      ],
      answer: 0,
      explain: "Every while loop needs something in the body that moves the condition towards False. Here the update num = num + 1 is missing.",
      difficulty: 2,
    },
    {
      id: "t11-q4",
      kind: "predict",
      prompt: "What is the exact output?",
      code: `num = 10
while num > 6:
    print(num)
    num = num - 1
else:
    print("loop is finished")`,
      answer: "10\n9\n8\n7\nloop is finished",
      explain: "The loop prints 10 down to 7. When num becomes 6 the condition fails and the else block runs once.",
      difficulty: 2,
    },
    {
      id: "t11-q5",
      kind: "fill",
      prompt: "Practice 1. Complete the program so it counts down from 5 while count is not equal to zero.",
      template: `count = 5
while count ___ 0:
    print("just count, still in loop!", count)
    count = count ___ 1
print("Outside loop already!", count)`,
      blanks: [["!=", ">"], ["-"]],
      explain:
        "The condition keeps looping while count is not zero, and the body must decrement count so the condition eventually becomes False.",
      difficulty: 2,
    },
    {
      id: "t11-q6",
      kind: "code",
      prompt:
        "Write the countdown from Practice 1 in full: while count is not zero, print 'just count, still in loop! <count>' and decrement. After the loop print 'Outside loop already! 0'.",
      starter: "count = 5\n",
      expected: `just count, still in loop! 5
just count, still in loop! 4
just count, still in loop! 3
just count, still in loop! 2
just count, still in loop! 1
Outside loop already! 0`,
      solution: `count = 5
while count != 0:
    print("just count, still in loop!", count)
    count = count - 1
print("Outside loop already!", count)`,
      explain: "The final print is outside the loop, so it runs once when count has reached 0.",
      difficulty: 2,
    },
    {
      id: "t11-q7",
      kind: "code",
      prompt:
        "Practice 2. Using while..else, keep asking the user to guess the secret number 7. Print 'You are stuck in Loop, PLEASE enter again. Thank you.' for a wrong guess, and 'Yes, you got the secret number!' once it is right. The test enters 3 then 7.",
      starter: `secret = 7
guess = int(input("Enter your guess: "))
# your code
`,
      stdin: ["3", "7"],
      expected: `Enter your guess: You are stuck in Loop, PLEASE enter again. Thank you.
Enter your guess: Yes, you got the secret number!`,
      solution: `secret = 7
guess = int(input("Enter your guess: "))
while guess != secret:
    print("You are stuck in Loop, PLEASE enter again. Thank you.")
    guess = int(input("Enter your guess: "))
else:
    print("Yes, you got the secret number!")`,
      explain:
        "Read once before the loop, then read again at the end of every failed pass — otherwise the condition never changes and the loop is infinite.",
      difficulty: 3,
    },
  ],
};
