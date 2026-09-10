import type { Topic } from "./types";

export const topic01: Topic = {
  num: 1,
  slug: "how-programs-run",
  title: "How a Python Program Runs",
  tagline: "Before the first line of code — what is actually happening inside the machine?",
  glyph: "◍",
  accent: "iris",
  objectives: [
    "Describe a program as an ordered list of instructions",
    "Explain the roles of source code, the interpreter, and the console",
    "Open IDLE, write one statement, save it, and run it",
    "Read an error message without panicking",
  ],
  concepts: [
    {
      id: "what-is-a-program",
      title: "What is a program?",
      takeaway: "A program is an ordered recipe. The computer does exactly what you wrote — nothing more, nothing less.",
      minutes: 6,
      cards: [
        {
          kind: "idea",
          title: "A program is a recipe",
          lead: "The computer is fast, obedient, and completely literal.",
          points: [
            "A program is a list of instructions carried out in order, top to bottom",
            "Each instruction is small: print something, remember a number, compare two values",
            "The computer never guesses what you meant — it runs what you typed",
            "Bugs are usually not the machine failing; they are instructions in the wrong order",
          ],
          callout: {
            tone: "tip",
            text: "Ask the class: describe 'making instant noodles' in 6 steps. Then swap two steps and ask what happens. That is a bug.",
          },
        },
        {
          kind: "idea",
          title: "Why Python?",
          points: [
            "Reads close to English — less punctuation noise between you and the idea",
            "Runs everywhere: laptops, servers, phones, microcontrollers",
            "Batteries included: huge library of ready-made tools",
            "Used for web apps, data analysis, automation, AI, and teaching",
          ],
        },
      ],
    },
    {
      id: "source-to-output",
      title: "From source code to output",
      takeaway: "You write source code → the Python interpreter reads it line by line → results appear in the console.",
      minutes: 7,
      cards: [
        {
          kind: "anim",
          title: "The journey of one line of code",
          lead: "Watch a single statement travel from your editor to the screen.",
          anim: "print-flow",
          props: { text: "Hello, World!" },
        },
        {
          kind: "idea",
          title: "Three words you will hear all module",
          points: [
            "Source code — the text you type into the editor and save as a .py file",
            "Interpreter — the Python program that reads your source code and carries it out, one line at a time",
            "Console / Shell — the black-and-white window where output appears and errors are reported",
          ],
          callout: {
            tone: "note",
            text: "Python is interpreted, not compiled: it starts at line 1 and works down. That is why the first lines can run successfully even when line 10 has a mistake.",
          },
        },
      ],
    },
    {
      id: "idle-workflow",
      title: "Your workflow in IDLE",
      takeaway: "Open IDLE → New File → type → Save As → Run. Every single time.",
      minutes: 8,
      cards: [
        {
          kind: "idea",
          title: "The five-step loop you will repeat all module",
          points: [
            "1. Open the IDLE app — this gives you the Shell window",
            "2. File → New File to get a blank editor (do not type programs into the Shell)",
            "3. Type your statements",
            "4. File → Save As… and give it a name ending in .py",
            "5. Run → Run Module (or press F5) and read the output in the Shell",
          ],
          callout: {
            tone: "warn",
            text: "Python will refuse to run an unsaved file. If nothing happens when you press F5, you almost certainly skipped step 4.",
          },
        },
        {
          kind: "code",
          title: "Your very first file",
          lead: "One line. Save it as hello.py and press F5.",
          code: 'print("Hello, World!")',
          output: "Hello, World!",
          runnable: true,
          annotations: [{ line: 1, label: "A complete Python program", tone: "mint" }],
        },
        {
          kind: "checkpoint",
          title: "Check the room",
          ask: "You typed your program into the Shell window instead of a new file. What is the problem?",
          answer:
            "The Shell runs each line the moment you press Enter and does not keep your work. You cannot save it, re-run it, or hand it in. Always use File → New File.",
          hint: "Think about what happens tomorrow when you want the same program back.",
        },
      ],
    },
    {
      id: "reading-errors",
      title: "Reading an error message",
      takeaway: "Errors are the interpreter telling you where it got stuck. Read the last line first.",
      minutes: 6,
      cards: [
        {
          kind: "compare",
          title: "Two kinds of mistake",
          columns: [
            {
              heading: "Syntax error — Python cannot read it",
              tone: "bad",
              code: 'print("Hello)',
              output: "SyntaxError: unterminated string literal",
              points: ["Nothing runs at all", "Usually a missing quote, bracket, or colon"],
            },
            {
              heading: "Runtime error — it read fine, but broke while running",
              tone: "bad",
              code: "numbers = [1, 2, 3]\nprint(numbers[9])",
              output: "IndexError: list index out of range",
              points: ["Earlier lines already produced output", "The message names the exact problem"],
            },
          ],
        },
        {
          kind: "idea",
          title: "How to read a traceback",
          points: [
            "Start at the BOTTOM line — it names the error type and the reason",
            "The line above tells you the line number in your file",
            "Google the error type plus a few words of the message; you will not be the first",
            "Fix one error at a time, then re-run — one mistake often causes several messages",
          ],
          callout: {
            tone: "tip",
            text: "Normalise errors early. Deliberately break a working program in front of the class and fix it together.",
          },
        },
      ],
    },
  ],
  practice: [
    {
      id: "t1-q1",
      kind: "mcq",
      prompt: "Which statement about the Python interpreter is true?",
      choices: [
        "It reads and runs your instructions one line at a time, from the top",
        "It reads the whole file, checks every line, then runs the file backwards",
        "It fixes small mistakes in your code automatically",
        "It only runs code typed directly into the Shell",
      ],
      answer: 0,
      explain:
        "Python is an interpreted language: it works from line 1 downwards. That is why output from early lines still appears even when a later line crashes.",
      difficulty: 1,
    },
    {
      id: "t1-q2",
      kind: "mcq",
      prompt: "You press F5 in IDLE and nothing happens except a pop-up. What is the most likely cause?",
      choices: [
        "The file has never been saved",
        "Python is not installed",
        "Your computer is out of memory",
        "You need to restart the computer",
      ],
      answer: 0,
      explain: "IDLE must save the file to disk before it can run it. Save as something.py, then press F5 again.",
      difficulty: 1,
    },
    {
      id: "t1-q3",
      kind: "mcq",
      prompt: "Which part of a traceback should you read first?",
      choices: [
        "The last line — it names the error and the reason",
        "The first line — it is always the real cause",
        "The middle, where the file paths are",
        "None of it; just re-run the program",
      ],
      answer: 0,
      explain: "The final line gives the error type and message. Work upwards from there to find the line number in your own file.",
      difficulty: 1,
    },
    {
      id: "t1-q4",
      kind: "code",
      prompt: "Write the classic first program: make Python display exactly Hello, World!",
      starter: "# Type one line below\n",
      expected: "Hello, World!",
      solution: 'print("Hello, World!")',
      explain: "print() sends text to the console. The text goes inside quotes, inside the round brackets.",
      difficulty: 1,
    },
  ],
};
