import type { Topic } from "./types";

export const topic06: Topic = {
  num: 6,
  slug: "variables",
  title: "Assigning Variables",
  tagline: "Special boxes for storing results so you can use them again.",
  glyph: "▣",
  accent: "sun",
  objectives: [
    "Explain why a program needs variables",
    "Apply the naming rules and avoid Python's reserved words",
    "Predict the type Python gives a variable from its assigned value",
    "Collect data from the user with input() and store it",
  ],
  concepts: [
    {
      id: "why-variables",
      title: "Why assign variables?",
      takeaway: "Variables let you store the result of an operation and use it again to produce later results.",
      minutes: 6,
      cards: [
        {
          kind: "anim",
          title: "Values in boxes",
          lead: "Watch a value being placed in a named box, then reused.",
          anim: "variable-boxes",
        },
        {
          kind: "idea",
          title: "The idea",
          lead: 'Python offers special "boxes" (containers) for that purpose, and these boxes are called variables.',
          points: [
            "We can store the results of operations and use them again to produce subsequent results",
            "A variable has a name (chosen by you) and a value (assigned with =)",
            "= means 'put this value into this box' — it is NOT the equals of mathematics",
            "Reading a variable does not empty it; you can use it as many times as you like",
          ],
        },
        {
          kind: "code",
          title: "Store once, use many times",
          code: `price = 12
quantity = 3
total = price * quantity
print("Total:", total)
print("With delivery:", total + 5)`,
          output: `Total: 36
With delivery: 41`,
          runnable: true,
        },
      ],
    },
    {
      id: "naming-rules",
      title: "Naming rules",
      takeaway: "Letters, digits and underscore only; must begin with a letter; case matters; never a keyword.",
      minutes: 8,
      cards: [
        {
          kind: "idea",
          title: "Strict rules for variable names",
          points: [
            "Composed of upper-case or lower-case letters, digits, and the character _ (underscore)",
            "Must begin with a letter",
            "The underscore character counts as a letter",
            "Upper- and lower-case letters are treated as different: age and Age are two variables",
            "Must not be any of Python's reserved words",
          ],
        },
        {
          kind: "table",
          title: "Python keywords — never use these as names",
          headers: ["", "", "", "", ""],
          rows: [
            ["False", "None", "True", "and", "as"],
            ["assert", "break", "class", "continue", "def"],
            ["del", "elif", "else", "except", "finally"],
            ["for", "from", "global", "if", "import"],
            ["in", "is", "lambda", "nonlocal", "not"],
            ["or", "pass", "raise", "return", "try"],
            ["while", "with", "yield", "", ""],
          ],
          callout: { tone: "warn", text: "Your editor colours keywords differently. If your variable name changes colour as you type it, pick another name." },
        },
        {
          kind: "compare",
          title: "Legal or not?",
          columns: [
            {
              heading: "Legal",
              tone: "good",
              code: `my_age = 20
_total = 5
score2 = 88
studentName = "Ali"`,
              points: ["Starts with a letter or underscore", "No spaces, no punctuation"],
            },
            {
              heading: "Illegal",
              tone: "bad",
              code: `2score = 88     # starts with a digit
my age = 20     # contains a space
class = "3A"    # reserved word
total-sum = 4   # - is the minus operator`,
              points: ["Each of these is a SyntaxError"],
            },
          ],
        },
      ],
    },
    {
      id: "types-from-values",
      title: "The value decides the type",
      takeaway: "You never declare a type in Python — the assigned value sets it automatically.",
      minutes: 7,
      cards: [
        {
          kind: "code",
          title: "Three variables, three types",
          code: `my_age = 20
my_telephone = "91237783"
my_weight = 60.5

print(type(my_age))
print(type(my_telephone))
print(type(my_weight))`,
          output: `<class 'int'>
<class 'str'>
<class 'float'>`,
          runnable: true,
          annotations: [
            { line: 1, label: "automatically created as an integer", tone: "iris" },
            { line: 2, label: "quotes → string, even though it looks numeric", tone: "sun" },
            { line: 3, label: "decimal point → float", tone: "mint" },
          ],
          callout: {
            tone: "tip",
            text: "Phone numbers, ID numbers and postcodes are stored as strings, not numbers. You never add two phone numbers together — and leading zeros must survive.",
          },
        },
        {
          kind: "checkpoint",
          title: "Check the room",
          ask: "After  x = 5  then  x = \"five\"  — what type is x?",
          answer: "str. The second assignment replaces both the value and the type. Python variables can be re-pointed at anything.",
        },
      ],
    },
    {
      id: "input",
      title: "Getting input from the user",
      takeaway: "input() pauses the program, waits for typing, and hands back a STRING every time.",
      minutes: 10,
      cards: [
        {
          kind: "anim",
          title: "How input() works",
          lead: "Follow the value from the keyboard into the variable.",
          anim: "input-flow",
        },
        {
          kind: "code",
          title: "Reading text",
          code: `# Get String Input from User
stri = input("Enter any name: ")
print(stri)`,
          output: `Enter any name: Aisha
Aisha`,
          annotations: [{ line: 2, label: "The prompt is displayed, then the program waits", tone: "mint" }],
          callout: { tone: "note", text: "The value received at the input is automatically assigned to the variable stri." },
        },
        {
          kind: "compare",
          title: "The trap every class falls into",
          columns: [
            {
              heading: "Without int() — string concatenation",
              tone: "bad",
              code: `a = input("First: ")   # user types 5
b = input("Second: ")  # user types 3
print(a + b)`,
              output: "53",
              points: ["input() always returns a string", '"5" + "3" glues the text together'],
            },
            {
              heading: "With int() — real arithmetic",
              tone: "good",
              code: `a = int(input("First: "))
b = int(input("Second: "))
print(a + b)`,
              output: "8",
              points: ["int() converts the text to a number", "Use float() when decimals are expected"],
            },
          ],
        },
      ],
    },
  ],
  practice: [
    {
      id: "t6-q1",
      kind: "mcq",
      prompt: "Which of these is a legal Python variable name?",
      choices: ["_total2", "2total", "my total", "class"],
      answer: 0,
      explain: "Names may contain letters, digits and underscores, and must not start with a digit or be a reserved word. Spaces are never allowed.",
      difficulty: 1,
    },
    {
      id: "t6-q2",
      kind: "predict",
      prompt: "What is the exact output?",
      code: `age = 20
Age = 30
print(age, Age)`,
      answer: "20 30",
      explain: "Upper- and lower-case letters are treated as different, so age and Age are two separate variables.",
      difficulty: 2,
    },
    {
      id: "t6-q3",
      kind: "mcq",
      prompt: "What type does input() always return?",
      choices: ["str", "int", "float", "It depends on what the user types"],
      answer: 0,
      explain: "input() always hands back a string. Wrap it in int() or float() when you need a number.",
      difficulty: 2,
    },
    {
      id: "t6-q4",
      kind: "predict",
      prompt: "The user types 7 then 2. What is the exact output?",
      code: `a = input()
b = input()
print(a + b)`,
      answer: "72",
      explain: 'Both values are strings, so + joins them: "7" + "2" is "72", not 9.',
      difficulty: 2,
    },
    {
      id: "t6-q5",
      kind: "fill",
      prompt: "Fix the program so it prints 9 when the user types 7 and 2.",
      template: `a = ___(input())
b = ___(input())
print(a + b)`,
      blanks: [["int"], ["int"]],
      explain: "int() converts each string into a whole number so + performs arithmetic instead of concatenation.",
      difficulty: 2,
    },
    {
      id: "t6-q6",
      kind: "code",
      prompt:
        "Read a name and an age from the test input, then print exactly:  Hello Sam, next year you will be 16",
      starter: "",
      stdin: ["Sam", "15"],
      expected: "Hello Sam, next year you will be 16",
      solution: `name = input()
age = int(input())
print("Hello " + name + ", next year you will be", age + 1)`,
      explain: "Read the name as a string, convert the age with int() so you can add 1 to it.",
      difficulty: 3,
    },
  ],
};
