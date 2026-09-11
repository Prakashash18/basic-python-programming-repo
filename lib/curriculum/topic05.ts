import type { Topic } from "./types";

export const topic05: Topic = {
  num: 5,
  slug: "literals",
  title: "Literals",
  tagline: "Data whose value is determined by the literal itself.",
  glyph: "◆",
  accent: "mint",
  objectives: [
    'Explain why print("2") and print(2) look identical but are stored differently',
    "Recognise integer, float, exponential, string and Boolean literals",
    "Write numbers in decimal, octal, hexadecimal and binary",
    "Use // and % to split a number into whole parts and a remainder",
  ],
  concepts: [
    {
      id: "what-is-literal",
      title: "What is a literal?",
      takeaway: "A literal is data whose value is determined by the literal itself — what you type is what you get.",
      minutes: 6,
      cards: [
        {
          kind: "idea",
          title: "Literal = data written directly in the code",
          points: [
            "42 is an integer literal — no calculation needed to know its value",
            '"hello" is a string literal',
            "3.14 is a float literal",
            "True is a Boolean literal",
            "A variable is NOT a literal; it is a name pointing at one",
          ],
        },
        {
          kind: "compare",
          title: "The famous pair",
          lead: "Both give the same output — but the computer stores them in completely different ways.",
          columns: [
            {
              heading: 'print("2")',
              tone: "neutral",
              code: 'print("2")',
              output: "2",
              points: ["Stored as a string: one text character", "You cannot do arithmetic on it directly"],
            },
            {
              heading: "print(2)",
              tone: "neutral",
              code: "print(2)",
              output: "2",
              points: ["Stored as an integer number", "Ready for arithmetic"],
            },
          ],
        },
        {
          kind: "compare",
          title: "…and where it starts to matter",
          columns: [
            {
              heading: 'print("2+2")',
              tone: "bad",
              code: 'print("2+2")',
              output: "2+2",
              points: ["Quotes make it text, so Python displays it unchanged"],
            },
            {
              heading: "print(2+2)",
              tone: "good",
              code: "print(2+2)",
              output: "4",
              points: ["No quotes, so Python evaluates the arithmetic first"],
            },
          ],
        },
        {
          kind: "anim",
          title: "Sort the literals",
          lead: "Class activity: call out the type before the animation reveals it.",
          anim: "literal-sorter",
        },
      ],
    },
    {
      id: "numbers",
      title: "Integers, floats and exponentials",
      takeaway: "Integers are whole numbers; floats carry a fractional part; e notation writes very large or small numbers compactly.",
      minutes: 10,
      cards: [
        {
          kind: "code",
          title: "Integers — and the two division operators",
          lead: "350 inches converted into feet and inches.",
          code: `length = 350          # whole number
feet = 350 // 12      # a division taking only the whole number
inches = 350 % 12     # a division, taking only the remainder
print(length, "=", feet, "ft and ", inches, " inches")`,
          output: "350 = 29 ft and  2  inches",
          runnable: true,
          annotations: [
            { line: 2, label: "// floor division → 29", tone: "iris" },
            { line: 3, label: "% modulus → 2", tone: "sun" },
          ],
          callout: { tone: "tip", text: "// and % together split any number into 'how many whole groups' and 'what is left over'." },
        },
        {
          kind: "idea",
          title: "Floats",
          lead: "Floats are the numbers that have a fractional part after the decimal point.",
          points: ["2.5", "4.0  — still a float even though the fraction is zero", "-0.4", "Any division with / produces a float, even 4 / 2"],
        },
        {
          kind: "idea",
          title: "Exponential notation",
          lead: "The value 3 × 10⁸ is an exponential.",
          points: ["In Python it is written 3e8", "e means 'times ten to the power of'", "3e8 is a float: 300000000.0", "Useful for very large and very small values: 1.6e-19"],
        },
      ],
    },
    {
      id: "bases",
      title: "Number systems",
      takeaway: "Python understands octal (0o), hexadecimal (0x) and binary (0b) prefixes — all print as ordinary decimal.",
      minutes: 8,
      cards: [
        {
          kind: "anim",
          title: "The same value in four bases",
          lead: "Change the number and watch every base update.",
          anim: "number-bases",
        },
        {
          kind: "code",
          title: "Four ways to write a number",
          code: `print(10)     # decimal representation
print(0o10)   # base 8 representation
print(0x10)   # base 16 representation
print(0b10)   # base 2 representation`,
          output: `10
8
16
2`,
          runnable: true,
          callout: {
            tone: "warn",
            text: "The prefix changes how Python READS the digits, not how it displays them. Output is always decimal unless you ask otherwise.",
          },
        },
      ],
    },
    {
      id: "strings-bools",
      title: "Strings and Booleans",
      takeaway: "Quotes must match; True and False behave like 1 and 0 in arithmetic.",
      minutes: 10,
      cards: [
        {
          kind: "code",
          title: "String literals and quoting",
          code: `print("I like \\"Monty Python\\"")
print('I like "Monty Python" ')
print("7-2")`,
          output: `I like "Monty Python"
I like "Monty Python" 
7-2`,
          runnable: true,
          callout: {
            tone: "warn",
            text: "The single quote ' or double quote \" you open with must be the one you close with. Mixing them is the most common beginner syntax error.",
          },
        },
        {
          kind: "code",
          title: "Boolean literals",
          lead: "True denotes 1 and False denotes 0. Run each line and explain the result.",
          code: `print(1/2 > 0.5)
print(0.500 > 0.4)
print(0.500 > 0.5)
print(True > False)
print(False > True)`,
          output: `False
True
False
True
False`,
          runnable: true,
          annotations: [
            { line: 1, label: "0.5 > 0.5 is False — not greater", tone: "rose" },
            { line: 4, label: "1 > 0 → True", tone: "mint" },
          ],
        },
        {
          kind: "checkpoint",
          title: "Check the room",
          ask: "Why does print(True + True) display 2?",
          answer:
            "True is stored as 1 and False as 0, so Python happily adds them like integers. It is a curiosity, not something to rely on in real code.",
        },
      ],
    },
  ],
  practice: [
    {
      id: "t5-q1",
      kind: "predict",
      prompt: "What is the exact output?",
      code: "print(17 // 5)\nprint(17 % 5)",
      answer: "3\n2",
      explain: "17 ÷ 5 is 3 remainder 2. // gives the whole part, % gives the remainder.",
      difficulty: 1,
    },
    {
      id: "t5-q2",
      kind: "predict",
      prompt: "What is the exact output?",
      code: 'print("3" )\nprint(3)\nprint("1+1")\nprint(1+1)',
      answer: "3\n3\n1+1\n2",
      explain: "Quoted values are strings and are shown exactly as typed. Unquoted arithmetic is evaluated first.",
      difficulty: 2,
    },
    {
      id: "t5-q3",
      kind: "mcq",
      prompt: "Which of these is a float literal?",
      choices: [
        "4",
        "0b100",
        "4.0",
        '"4.0"',
      ],
      answer: 2,
      explain: '4.0 has a decimal point, so it is a float. "4.0" is a string, 4 is an integer, and 0b100 is the integer 4 in binary.',
      difficulty: 1,
    },
    {
      id: "t5-q4",
      kind: "predict",
      prompt: "What is the exact output?",
      code: "print(0x10)\nprint(0b101)\nprint(0o17)",
      answer: "16\n5\n15",
      explain: "0x10 is hexadecimal 10 = 16. 0b101 is binary = 5. 0o17 is octal = 15. All display in decimal.",
      difficulty: 3,
    },
    {
      id: "t5-q5",
      kind: "mcq",
      prompt: "How is the value 3 × 10⁸ written in Python?",
      choices: [
        "3e8",
        "3^8",
        "3**10**8",
        "3x10e8",
      ],
      answer: 0,
      explain: "e notation: the number, the letter e, then the power of ten. 3e8 evaluates to 300000000.0 — a float.",
      difficulty: 2,
    },
    {
      id: "t5-q6",
      kind: "predict",
      prompt: "What is the exact output?",
      code: "print(True > False)\nprint(True + True)",
      answer: "True\n2",
      explain: "True is 1 and False is 0, so 1 > 0 is True and 1 + 1 is 2.",
      difficulty: 3,
    },
    {
      id: "t5-q7",
      kind: "code",
      prompt:
        "A length of 500 inches is given. Print it as feet and inches on one line, exactly like: 500 = 41 ft and 8 inches",
      starter: "length = 500\n",
      expected: "500 = 41 ft and 8 inches",
      solution: `length = 500
feet = length // 12
inches = length % 12
print(length, "=", feet, "ft and", inches, "inches")`,
      explain: "// gives the number of whole feet, % gives the leftover inches. Commas in print() add the spaces for you.",
      difficulty: 3,
    },
  ],
};
