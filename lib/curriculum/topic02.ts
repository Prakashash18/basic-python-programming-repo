import type { Topic, Flowchart } from "./types";

const sumThree: Flowchart = {
  width: 460,
  height: 560,
  nodes: [
    { id: "start", kind: "terminal", text: "Start", x: 230, y: 40 },
    { id: "input", kind: "io", text: "Input num1, num2, num3", x: 230, y: 150, w: 260 },
    { id: "calc", kind: "process", text: "total = num1 + num2 + num3", x: 230, y: 270, w: 280 },
    { id: "output", kind: "io", text: "Display total", x: 230, y: 390, w: 200 },
    { id: "end", kind: "terminal", text: "End", x: 230, y: 500 },
  ],
  edges: [
    { from: "start", to: "input" },
    { from: "input", to: "calc" },
    { from: "calc", to: "output" },
    { from: "output", to: "end" },
  ],
};

const sumN: Flowchart = {
  width: 560,
  height: 720,
  nodes: [
    { id: "start", kind: "terminal", text: "Start", x: 250, y: 38 },
    { id: "askn", kind: "io", text: "Input n (how many numbers)", x: 250, y: 140, w: 280 },
    { id: "init", kind: "process", text: "total = 0, count = 0", x: 250, y: 250, w: 240 },
    { id: "check", kind: "decision", text: "count < n ?", x: 250, y: 380, w: 200, h: 100 },
    { id: "read", kind: "io", text: "Input num", x: 250, y: 520, w: 180 },
    { id: "add", kind: "process", text: "total = total + num\ncount = count + 1", x: 250, y: 630, w: 240 },
    { id: "show", kind: "io", text: "Display total", x: 470, y: 520, w: 160 },
    { id: "end", kind: "terminal", text: "End", x: 470, y: 630 },
  ],
  edges: [
    { from: "start", to: "askn" },
    { from: "askn", to: "init" },
    { from: "init", to: "check" },
    { from: "check", to: "read", label: "True" },
    { from: "read", to: "add" },
    { from: "add", to: "check", points: [[80, 630], [80, 380]], fromSide: "left", toSide: "left" },
    { from: "check", to: "show", label: "False", fromSide: "right", toSide: "top" },
    { from: "show", to: "end" },
  ],
};

export const topic02: Topic = {
  num: 2,
  slug: "flowcharts",
  title: "Flowcharts",
  tagline: "Plan the solution before you write a single line of code.",
  glyph: "◇",
  accent: "mint",
  objectives: [
    "Name the five core flowchart symbols and what each one means",
    "Read a flowchart and predict the output it produces",
    "Draw a flowchart for a sequence, a decision, and a loop",
    "Translate a finished flowchart into Python statements",
  ],
  concepts: [
    {
      id: "why-flowchart",
      title: "Why draw before you code",
      takeaway: "A flowchart is a schematic of an algorithm — thinking on paper is cheaper than debugging on screen.",
      minutes: 5,
      cards: [
        {
          kind: "idea",
          title: "What is a flowchart?",
          lead: "A schematic representation of an algorithm — a step-by-step approach to solving a task.",
          points: [
            "Language-independent: the same chart works for Python, Java, or plain English",
            "Forces you to decide the order of steps before syntax gets in the way",
            "Makes the decision points and the repeated parts visible at a glance",
            "It is how you explain your logic to a teammate — or to your instructor",
          ],
          callout: {
            tone: "tip",
            text: "Rule for the module: for every practice task from Topic 8 onwards, sketch the chart first, then write the code.",
          },
        },
      ],
    },
    {
      id: "symbols",
      title: "The five symbols",
      takeaway: "Shape carries meaning: oval = boundary, parallelogram = data in/out, rectangle = work, diamond = choice, arrow = order.",
      minutes: 10,
      cards: [
        {
          kind: "anim",
          title: "Symbol by symbol",
          lead: "Each shape has one job. Step through them and say the job out loud.",
          anim: "flow-symbols",
        },
        {
          kind: "table",
          title: "Reference table",
          headers: ["Symbol", "Name", "Means", "Typical Python"],
          rows: [
            ["Oval", "Start / End", "Where the algorithm begins and finishes", "(top and bottom of your file)"],
            ["Parallelogram", "Input / Output", "Data comes in from the user, or goes out to the screen", "input()  /  print()"],
            ["Rectangle", "Process", "A calculation or an assignment", "total = a + b"],
            ["Diamond", "Decision", "A yes/no question with two exits", "if / elif / else"],
            ["Arrow", "Flowline", "The order steps are carried out in", "(top-to-bottom order)"],
            ["Circle", "Connector", "Joins parts of a chart that run onto another page", "(no code equivalent)"],
          ],
          callout: {
            tone: "warn",
            text: "A diamond always has exactly one arrow in and two arrows out, labelled True and False. If your diamond has one exit, it is not a decision.",
          },
        },
      ],
    },
    {
      id: "sequence-chart",
      title: "Pattern 1 — Sequence",
      takeaway: "Straight line, top to bottom: input, process, output.",
      minutes: 8,
      cards: [
        {
          kind: "flow",
          title: "Total three numbers",
          lead: "Task 1 from your slides. Follow the token down the chart.",
          flow: sumThree,
          steps: [
            { node: "start", note: "Every chart opens with a Start oval." },
            { node: "input", note: "One parallelogram can collect several related values." },
            { node: "calc", note: "The rectangle does the arithmetic and stores it in total." },
            { node: "output", note: "Output is also a parallelogram — data leaving the program." },
            { node: "end", note: "Close with End. One entry, one exit." },
          ],
        },
        {
          kind: "code",
          title: "The same chart as Python",
          lead: "Notice the chart and the code line up one-for-one.",
          code: `num1 = int(input("Enter num1: "))
num2 = int(input("Enter num2: "))
num3 = int(input("Enter num3: "))

total = num1 + num2 + num3

print("The total is", total)`,
          output: `Enter num1: 4
Enter num2: 7
Enter num3: 9
The total is 20`,
          annotations: [
            { line: 1, label: "Input parallelogram", tone: "mint" },
            { line: 5, label: "Process rectangle", tone: "iris" },
            { line: 7, label: "Output parallelogram", tone: "mint" },
          ],
        },
      ],
    },
    {
      id: "loop-chart",
      title: "Pattern 2 — Decision and loop",
      takeaway: "A loop is a decision diamond with an arrow that flows backwards.",
      minutes: 12,
      cards: [
        {
          kind: "flow",
          title: "Add n numbers entered by the user",
          lead: "Task 2 from your slides. Watch the arrow that goes back up — that is the loop.",
          flow: sumN,
          steps: [
            { node: "start", note: "Start." },
            { node: "askn", note: "First ask HOW MANY numbers will be entered." },
            { node: "init", note: "Set up the running total and the counter before the loop. Forgetting this is the classic bug." },
            { node: "check", note: "The decision guards the loop: have we collected enough numbers yet?" },
            { node: "read", note: "True branch: read one more number." },
            { node: "add", note: "Add it on and bump the counter — otherwise the loop never ends." },
            { node: "check", note: "The backwards arrow returns to the same question. This is what makes it a loop." },
            { node: "show", note: "False branch: we are done collecting, so display the total." },
            { node: "end", note: "End." },
          ],
        },
        {
          kind: "checkpoint",
          title: "Check the room",
          ask: "What happens to this chart if we delete 'count = count + 1' from the process box?",
          answer:
            "count stays 0 forever, so 'count < n' is always True and the program asks for numbers endlessly — an infinite loop. Every loop needs something that moves it towards its exit condition.",
          hint: "Look at what the diamond is testing.",
        },
      ],
    },
  ],
  practice: [
    {
      id: "t2-q1",
      kind: "mcq",
      prompt: "Which shape represents a decision?",
      choices: ["Diamond", "Rectangle", "Parallelogram", "Oval"],
      answer: 0,
      explain: "A diamond asks a True/False question and has two labelled exits.",
      difficulty: 1,
    },
    {
      id: "t2-q2",
      kind: "mcq",
      prompt: "A parallelogram in a flowchart most often becomes which Python code?",
      choices: ["input() or print()", "if / else", "a = b + c", "def function()"],
      answer: 0,
      explain: "Parallelogram = Input/Output. Data entering the program (input) or leaving it (print).",
      difficulty: 1,
    },
    {
      id: "t2-q3",
      kind: "mcq",
      prompt: "In a flowchart, what makes a section a loop?",
      choices: [
        "An arrow that flows back to an earlier symbol",
        "Two rectangles stacked together",
        "More than one parallelogram",
        "A connector circle",
      ],
      answer: 0,
      explain: "Repetition is drawn as a backward flowline returning to an earlier point, normally to a decision diamond that can end the repetition.",
      difficulty: 1,
    },
    {
      id: "t2-q4",
      kind: "mcq",
      prompt: "How many arrows must leave a decision diamond?",
      choices: ["Exactly two, labelled True and False", "One", "As many as you like", "Three — True, False and Maybe"],
      answer: 0,
      explain: "A decision has exactly two outcomes. If you need three outcomes, use two diamonds in sequence (that is what elif does).",
      difficulty: 2,
    },
    {
      id: "t2-q5",
      kind: "predict",
      prompt:
        "A chart reads: Start → total = 0 → count = 1 → Decision 'count <= 3?' → True: total = total + count, count = count + 1, back to decision → False: Display total → End. What is displayed?",
      code: `total = 0
count = 1
while count <= 3:
    total = total + count
    count = count + 1
print(total)`,
      answer: "6",
      explain: "The loop adds 1 + 2 + 3. When count becomes 4 the decision is False and 6 is displayed.",
      difficulty: 2,
    },
    {
      id: "t2-q6",
      kind: "code",
      prompt:
        "Turn this chart into code: Start → Input a → Input b → area = a * b → Display area → End. Use the two values already supplied by the test (5 and 4).",
      starter: `a = int(input())
b = int(input())
# your code below
`,
      stdin: ["5", "4"],
      expected: "20",
      solution: `a = int(input())
b = int(input())
area = a * b
print(area)`,
      explain: "Sequence charts translate line for line: two input parallelograms, one process rectangle, one output parallelogram.",
      difficulty: 2,
    },
  ],
  assignment: {
    title: "Sketch and verify",
    body: [
      "Task 1: Given three numbers num1, num2 and num3, total all three and display the result. Sketch the flowchart and show it to your instructor to verify your idea.",
      "Task 2: Prompt the user to enter a value representing how many numbers will be added. The user then keys in each number. Adding stops once that many numbers have been entered, then the total is displayed. Sketch the flowchart and verify it with your instructor.",
    ],
  },
};
