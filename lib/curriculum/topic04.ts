import type { Topic } from "./types";

export const topic04: Topic = {
  num: 4,
  slug: "comments",
  title: "Comments",
  tagline: "Notes for humans. Invisible to Python, priceless to the next reader.",
  glyph: "＃",
  accent: "iris",
  objectives: [
    "Write single-line comments with #",
    "Write multi-line comments with triple quotes",
    "Explain why comments never change the output",
    "Judge when a comment helps and when it is noise",
  ],
  concepts: [
    {
      id: "why-comments",
      title: "Why comments exist",
      takeaway: "Comments do not change the outcome of a program — they improve the readability of the code.",
      minutes: 5,
      cards: [
        {
          kind: "anim",
          title: "What Python actually sees",
          lead: "Watch the interpreter strip the comments away before it runs anything.",
          anim: "comment-strip",
        },
        {
          kind: "idea",
          title: "Two types of comment in Python",
          points: [
            "Single-line comment — use the # special character to start the comment",
            "Multi-line comment — use triple single quotes ''' at the beginning and at the end",
            "Both are ignored by the interpreter",
            "The next reader of your code is usually you, three weeks later",
          ],
          callout: {
            tone: "note",
            text: "Comments do not change the outcome of the program, however they improve the readability of code.",
          },
        },
      ],
    },
    {
      id: "single-line",
      title: "Single-line comments",
      takeaway: "Everything after # on that line is ignored — whether it starts the line or follows code.",
      minutes: 6,
      cards: [
        {
          kind: "code",
          title: "Before the code, or after it",
          code: `# First print statement
print("How are You all?")

print("Welcome to Basic Python Programming")  # Third print statement`,
          output: `How are You all?
Welcome to Basic Python Programming`,
          runnable: true,
          annotations: [
            { line: 1, label: "Whole-line comment", tone: "iris" },
            { line: 4, label: "Trailing comment — code still runs", tone: "mint" },
          ],
        },
        {
          kind: "compare",
          title: "Helpful vs. useless",
          columns: [
            {
              heading: "Useless — repeats the code",
              tone: "bad",
              code: `# add 1 to count
count = count + 1`,
              points: ["Says WHAT, which the code already said"],
            },
            {
              heading: "Helpful — explains the why",
              tone: "good",
              code: `# count how many guesses were used, for the score at the end
count = count + 1`,
              points: ["Says WHY, which the code cannot say"],
            },
          ],
        },
      ],
    },
    {
      id: "multi-line",
      title: "Multi-line comments",
      takeaway: "Triple quotes let you write a paragraph of explanation at the top of a file.",
      minutes: 6,
      cards: [
        {
          kind: "code",
          title: "Triple-quoted block",
          code: `''' We are writing a simple program here.
First print statement.
This is a multiple line comment. '''

print("Hello Guys")`,
          output: "Hello Guys",
          runnable: true,
          annotations: [{ line: 1, label: "''' opens, ''' closes", tone: "sun" }],
          callout: {
            tone: "tip",
            text: "Use a triple-quoted block at the very top of each assignment file: your name, the date, and what the program does. Many instructors give marks for it.",
          },
        },
        {
          kind: "checkpoint",
          title: "Check the room",
          ask: "Does adding twenty lines of comments make a program run more slowly?",
          answer:
            "No. The interpreter skips comments entirely — they cost nothing at run time. Write as many as the reader needs.",
        },
      ],
    },
  ],
  practice: [
    {
      id: "t4-q1",
      kind: "predict",
      prompt: "What is the exact output?",
      code: `# print("A")
print("B")  # print("C")`,
      answer: "B",
      explain: "Both commented parts are ignored. Only print(\"B\") runs.",
      difficulty: 1,
    },
    {
      id: "t4-q2",
      kind: "mcq",
      prompt: "Which character starts a single-line comment in Python?",
      choices: [
        "--",
        "/*",
        "#",
        "//",
      ],
      answer: 2,
      explain: "Python uses #. The others belong to other languages.",
      difficulty: 1,
    },
    {
      id: "t4-q3",
      kind: "mcq",
      prompt: "What is the effect of comments on the output of a program?",
      choices: [
        "They cause a syntax error if too long",
        "None — they only improve readability",
        "They slow the program down",
        "They are printed in grey",
      ],
      answer: 1,
      explain: "Comments do not change the outcome of the program; they exist for the humans reading it.",
      difficulty: 1,
    },
    {
      id: "t4-q4",
      kind: "fill",
      prompt: "Turn the second line into a comment so only Hello is printed.",
      template: `print("Hello")
___ print("Goodbye")`,
      blanks: [["#"]],
      explain: "Placing # in front of a line disables it without deleting it — a technique called commenting out.",
      difficulty: 1,
    },
    {
      id: "t4-q5",
      kind: "code",
      prompt:
        "Write a program with a multi-line comment describing it, then print Basic Python Programming.",
      starter: "",
      expected: "Basic Python Programming",
      solution: `''' Topic 4 practice
This program prints the module name. '''

print("Basic Python Programming")`,
      explain: "The triple-quoted block is ignored, so only the print statement produces output.",
      difficulty: 2,
    },
  ],
};
