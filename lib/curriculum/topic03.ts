import type { Topic } from "./types";

export const topic03: Topic = {
  num: 3,
  slug: "first-program",
  title: "My First Python Program",
  tagline: "print() — the function you will use in every program you ever write.",
  glyph: "▶",
  accent: "sun",
  objectives: [
    "Break print(\"Hello, World!\") into its six parts and name each one",
    "Use \\n and other escape characters to control line breaks",
    "Pass several values to print() separated by commas",
    "Change the output layout with the sep and end keyword arguments",
  ],
  concepts: [
    {
      id: "anatomy",
      title: "Anatomy of print()",
      takeaway: "print is a built-in function; the round brackets hand it the data to display.",
      minutes: 8,
      cards: [
        {
          kind: "anim",
          title: "Six parts of one statement",
          lead: "Every character earns its place. Step through and name each piece.",
          anim: "print-flow",
          props: { text: "Hello, World!", dissect: true },
        },
        {
          kind: "idea",
          title: "Say it out loud",
          lead: 'print("Hello, World!") consists of:',
          points: [
            "the word print — the name of the function",
            "an opening parenthesis (",
            "a quotation mark \"",
            "a line of text: Hello, World!",
            "another quotation mark \"",
            "a closing parenthesis )",
          ],
          callout: {
            tone: "note",
            text: "print is built into the Python library. Its purpose is to send text to the terminal, and it is the most frequently used built-in function in this module.",
          },
        },
        {
          kind: "code",
          title: "Type it, save it, run it",
          code: 'print("Hello, World!")',
          output: "Hello, World!",
          runnable: true,
          callout: { tone: "tip", text: "The quotes are not printed. They only mark where the text starts and stops." },
        },
        {
          kind: "checkpoint",
          title: "Check the room",
          ask: 'What is different about the output of print("2 + 2") and print(2 + 2)?',
          answer:
            'print("2 + 2") displays the text 2 + 2 exactly as typed, because quotes make it a string. print(2 + 2) does the arithmetic first and displays 4.',
          hint: "What do the quotation marks tell Python?",
        },
      ],
    },
    {
      id: "escape",
      title: "Escape and newline characters",
      takeaway: "Backslash gives the next character a special meaning. \\n means 'new line here'.",
      minutes: 10,
      cards: [
        {
          kind: "anim",
          title: "What \\n really does",
          lead: "Watch the cursor jump when it meets the escape sequence.",
          anim: "escape-chars",
        },
        {
          kind: "code",
          title: "The itsy bitsy spider",
          lead: "Type this, run it, and compare the output with the source.",
          code: `print("The itsy bitsy spider \\nclimbed up the waterspout.")
print()
print("Down came the rain \\nand washed the spider out.")`,
          output: `The itsy bitsy spider 
climbed up the waterspout.

Down came the rain 
and washed the spider out.`,
          runnable: true,
          annotations: [
            { line: 1, label: "\\n splits one string across two lines", tone: "sun" },
            { line: 2, label: "print() with nothing inside prints an empty line", tone: "iris" },
          ],
          callout: {
            tone: "note",
            text: "The backslash \\ has a very special meaning inside strings — it is called the escape character. The letter n after it comes from the word newline.",
          },
        },
        {
          kind: "table",
          title: "Escape sequences worth knowing",
          headers: ["Sequence", "Produces", "Example"],
          rows: [
            ["\\n", "New line", 'print("a\\nb")'],
            ["\\t", "Tab space", 'print("a\\tb")'],
            ["\\\\", "A single backslash", 'print("C:\\\\Users")'],
            ['\\"', "A double quote inside double quotes", 'print("I like \\"Python\\"")'],
            ["\\'", "A single quote inside single quotes", "print('it\\'s fine')"],
          ],
        },
      ],
    },
    {
      id: "commas",
      title: "Printing several values",
      takeaway: "Commas let one print() display several values, and Python inserts a space between them.",
      minutes: 7,
      cards: [
        {
          kind: "compare",
          title: "With and without the comma",
          lead: "Test both and observe what happens.",
          columns: [
            {
              heading: "Commas — three separate values",
              tone: "good",
              code: 'print("The itsy bitsy spider", "climbed up", "the waterspout.")',
              output: "The itsy bitsy spider climbed up the waterspout.",
              points: ["Python adds one space between each value", "Values can be different types: text and numbers together"],
            },
            {
              heading: "No comma — a syntax error",
              tone: "bad",
              code: 'print("The itsy bitsy spider" "climbed up")',
              output: "The itsy bitsy spidercalimbed up  ← no space added",
              points: ["Two strings side by side get glued together", "You must supply your own spaces"],
            },
          ],
        },
        {
          kind: "code",
          title: "Mixing text and numbers",
          code: `age = 20
print("I am", age, "years old")`,
          output: "I am 20 years old",
          runnable: true,
          callout: { tone: "tip", text: "This is why commas matter: you cannot glue text to a number with +, but print() handles it happily with commas." },
        },
      ],
    },
    {
      id: "sep-end",
      title: "The sep and end keyword arguments",
      takeaway: "sep changes what goes BETWEEN values; end changes what goes AFTER the last one.",
      minutes: 10,
      cards: [
        {
          kind: "anim",
          title: "Control the gaps",
          lead: "Drag the controls to see sep and end reshape the same data.",
          anim: "print-args",
        },
        {
          kind: "code",
          title: "end — stop print() from starting a new line",
          code: `print("My name is", "Python.")
print("Monty Python.")

print("My name is", "Python.", end=" ")
print("Monty Python.")`,
          output: `My name is Python.
Monty Python.
My name is Python. Monty Python.`,
          runnable: true,
          annotations: [{ line: 4, label: "end=\" \" replaces the invisible newline with a space", tone: "sun" }],
          callout: { tone: "note", text: "By default end=\"\\n\", which is why each print() normally starts a fresh line." },
        },
        {
          kind: "code",
          title: "sep — change the separator",
          code: `print("My", "name", "is", "Monty", "Python.")
print("My", "name", "is", "Monty", "Python.", sep="-")`,
          output: `My name is Monty Python.
My-name-is-Monty-Python.`,
          runnable: true,
          annotations: [{ line: 2, label: "sep=\"-\" replaces the default single space", tone: "iris" }],
        },
        {
          kind: "checkpoint",
          title: "Check the room",
          ask: 'What exactly does print("a", "b", sep="", end="!") display?',
          answer: 'ab!  — sep="" removes the space between a and b, and end="!" replaces the newline with an exclamation mark, so the next print continues on the same line.',
        },
      ],
    },
  ],
  practice: [
    {
      id: "t3-q1",
      kind: "predict",
      prompt: "What is the exact output?",
      code: 'print("Python", "rocks")',
      answer: "Python rocks",
      explain: "A comma separates two values, and print() joins them with the default separator: a single space.",
      difficulty: 1,
    },
    {
      id: "t3-q2",
      kind: "predict",
      prompt: "What is the exact output?",
      code: 'print("one\\ntwo")',
      answer: "one\ntwo",
      explain: "\\n is the newline escape sequence, so the single string is displayed across two lines.",
      difficulty: 1,
    },
    {
      id: "t3-q3",
      kind: "mcq",
      prompt: "Which call prints A-B-C ?",
      choices: [
        'print("A", "B", "C", sep="-")',
        'print("A", "B", "C", end="-")',
        'print("A" - "B" - "C")',
        'print("A", "B", "C", sep=" ")',
      ],
      answer: 0,
      explain: "sep sets the text placed between the values. end would only affect what comes after C.",
      difficulty: 2,
    },
    {
      id: "t3-q4",
      kind: "predict",
      prompt: "What is the exact output of these two lines?",
      code: `print("Hello", end=", ")
print("World!")`,
      answer: "Hello, World!",
      explain: 'end=", " replaces the newline after Hello, so the second print() continues on the same line.',
      difficulty: 2,
    },
    {
      id: "t3-q5",
      kind: "fill",
      prompt: "Complete the statement so the output is Total:42 with no space.",
      template: 'print("Total:", 42, ___="")',
      blanks: [["sep"]],
      explain: "sep controls the text inserted between values. Setting it to an empty string removes the default space.",
      difficulty: 2,
    },
    {
      id: "t3-q6",
      kind: "code",
      prompt: 'Print the two lines:\nThe itsy bitsy spider\nclimbed up the waterspout.\nusing ONE print() statement.',
      starter: "# one statement only\n",
      expected: "The itsy bitsy spider\nclimbed up the waterspout.",
      solution: 'print("The itsy bitsy spider\\nclimbed up the waterspout.")',
      explain: "Put \\n in the middle of the string to break the line without a second print().",
      difficulty: 2,
    },
    {
      id: "t3-q7",
      kind: "code",
      prompt: 'Print exactly:  I like "Monty Python"  (with the quotation marks visible).',
      starter: "",
      expected: 'I like "Monty Python"',
      solution: 'print(\'I like "Monty Python"\')',
      explain:
        'Either escape the inner quotes with a backslash inside double quotes, or wrap the whole string in single quotes so the double quotes are ordinary characters.',
      difficulty: 3,
    },
  ],
};
