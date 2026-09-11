import type { Topic, Flowchart } from "./types";

const ifChart: Flowchart = {
  width: 420,
  height: 480,
  nodes: [
    { id: "start", kind: "terminal", text: "Start", x: 150, y: 40 },
    { id: "cond", kind: "decision", text: "condition ?", x: 150, y: 175, w: 200, h: 100 },
    { id: "body", kind: "process", text: "block_of_code", x: 150, y: 320, w: 200 },
    { id: "end", kind: "terminal", text: "End", x: 150, y: 430 },
  ],
  edges: [
    { from: "start", to: "cond" },
    { from: "cond", to: "body", label: "True" },
    { from: "body", to: "end" },
    { from: "cond", to: "end", label: "False", fromSide: "right", toSide: "right", points: [[350, 175], [350, 430]] },
  ],
};

const ifElseChart: Flowchart = {
  width: 520,
  height: 470,
  nodes: [
    { id: "start", kind: "terminal", text: "Start", x: 260, y: 40 },
    { id: "cond", kind: "decision", text: "condition ?", x: 260, y: 165, w: 200, h: 100 },
    { id: "yes", kind: "process", text: "if block", x: 110, y: 305, w: 160 },
    { id: "no", kind: "process", text: "else block", x: 410, y: 305, w: 160 },
    { id: "end", kind: "terminal", text: "End", x: 260, y: 415 },
  ],
  edges: [
    { from: "start", to: "cond" },
    { from: "cond", to: "yes", label: "True", fromSide: "left", toSide: "top", points: [[110, 165]] },
    { from: "cond", to: "no", label: "False", fromSide: "right", toSide: "top", points: [[410, 165]] },
    { from: "yes", to: "end", fromSide: "bottom", toSide: "left", points: [[110, 415]] },
    { from: "no", to: "end", fromSide: "bottom", toSide: "right", points: [[410, 415]] },
  ],
};

const gradeChart: Flowchart = {
  width: 620,
  height: 760,
  nodes: [
    { id: "start", kind: "terminal", text: "Start", x: 200, y: 36 },
    { id: "input", kind: "io", text: "Input marks", x: 200, y: 130, w: 180 },
    { id: "d1", kind: "decision", text: "marks < 50 ?", x: 200, y: 245, w: 190, h: 90 },
    { id: "d2", kind: "decision", text: "marks < 60 ?", x: 200, y: 375, w: 190, h: 90 },
    { id: "d3", kind: "decision", text: "marks < 70 ?", x: 200, y: 505, w: 190, h: 90 },
    { id: "d4", kind: "decision", text: "marks < 80 ?", x: 200, y: 635, w: 190, h: 90 },
    { id: "fail", kind: "process", text: 'grade = "Fail"', x: 470, y: 245, w: 160 },
    { id: "gd", kind: "process", text: 'grade = "D"', x: 470, y: 375, w: 160 },
    { id: "gc", kind: "process", text: 'grade = "C"', x: 470, y: 505, w: 160 },
    { id: "gb", kind: "process", text: 'grade = "B"', x: 470, y: 635, w: 160 },
    { id: "ga", kind: "process", text: 'grade = "A"', x: 200, y: 730, w: 160 },
  ],
  edges: [
    { from: "start", to: "input" },
    { from: "input", to: "d1" },
    { from: "d1", to: "fail", label: "True", fromSide: "right", toSide: "left" },
    { from: "d1", to: "d2", label: "False" },
    { from: "d2", to: "gd", label: "True", fromSide: "right", toSide: "left" },
    { from: "d2", to: "d3", label: "False" },
    { from: "d3", to: "gc", label: "True", fromSide: "right", toSide: "left" },
    { from: "d3", to: "d4", label: "False" },
    { from: "d4", to: "gb", label: "True", fromSide: "right", toSide: "left" },
    { from: "d4", to: "ga", label: "False" },
  ],
};

export const topic08: Topic = {
  num: 8,
  slug: "decision-making",
  title: "Decision Making Statements",
  tagline: "if, if..else and if..elif..else — teaching your program to choose.",
  glyph: "◈",
  accent: "iris",
  objectives: [
    "Write an if statement with a correct colon and indented block",
    "Choose between if, if..else and if..elif..else for a given task",
    "Trace which block runs for a given input",
    "Nest decisions and draw the matching flowchart",
  ],
  concepts: [
    {
      id: "if",
      title: "The if statement",
      takeaway: "if runs a block only when its condition is True — and does nothing at all when it is False.",
      minutes: 10,
      cards: [
        {
          kind: "flow",
          title: "Syntax and flowchart",
          lead: "One entry, a diamond, and a block that may be skipped entirely.",
          flow: ifChart,
          steps: [
            { node: "start", note: "Program reaches the if statement." },
            { node: "cond", note: "The condition is evaluated to True or False." },
            { node: "body", note: "True: the indented block runs." },
            { node: "end", note: "False: the block is skipped and the program carries on below the if." },
          ],
        },
        {
          kind: "code",
          title: "The shape of an if statement",
          template: true,
          code: `if condition:
    block_of_code      # runs only when condition is True

next_statement         # runs either way`,
          annotations: [
            { line: 1, label: "Colon is compulsory", tone: "rose" },
            { line: 2, label: "Indentation (4 spaces) marks the block", tone: "iris" },
            { line: 4, label: "Back at the left margin = outside the if", tone: "mint" },
          ],
          callout: {
            tone: "warn",
            text: "Python uses indentation the way other languages use { }. Get the indentation wrong and the meaning of your program changes — or it refuses to run.",
          },
        },
        {
          kind: "trace",
          title: "Trace it: flag is True",
          lead: "Step through and watch the block execute.",
          code: `flag = True
if flag:
    print("The flag is up")
print("Done")`,
          steps: [
            { line: 1, vars: { flag: "True" }, note: "Store the Boolean." },
            { line: 2, vars: { flag: "True" }, note: "Condition evaluates to True, so we enter the block." },
            { line: 3, vars: { flag: "True" }, out: "The flag is up", note: "The indented statement runs." },
            { line: 4, vars: { flag: "True" }, out: "Done", note: "Execution continues below the if." },
          ],
        },
        {
          kind: "trace",
          title: "Trace it: flag is False",
          lead: "Same program, one value changed. Notice line 3 never lights up.",
          code: `flag = False
if flag:
    print("The flag is up")
print("Done")`,
          steps: [
            { line: 1, vars: { flag: "False" }, note: "Store the Boolean." },
            { line: 2, vars: { flag: "False" }, note: "Condition is False — the whole indented block is skipped." },
            { line: 4, vars: { flag: "False" }, out: "Done", note: "Only the unindented line runs. No output at all from inside the if." },
          ],
        },
        {
          kind: "code",
          title: "if without a Boolean variable",
          lead: "Any expression that evaluates to True or False can be the condition.",
          code: `number = int(input("Enter a number: "))
if number < 1000:
    print("Yes, it is less than a thousand!")`,
          output: `Enter a number: 42
Yes, it is less than a thousand!`,
        },
      ],
    },
    {
      id: "if-else",
      title: "if..else",
      takeaway: "else catches every case the if condition did not — exactly one of the two blocks always runs.",
      minutes: 10,
      cards: [
        {
          kind: "flow",
          title: "Syntax and flowchart",
          flow: ifElseChart,
          steps: [
            { node: "start", note: "Reach the decision." },
            { node: "cond", note: "Evaluate the condition once." },
            { node: "yes", note: "True branch: the if block." },
            { node: "no", note: "False branch: the else block." },
            { node: "end", note: "Both paths rejoin. Exactly one block ran." },
          ],
        },
        {
          kind: "trace",
          title: "Odd or even",
          lead: "The classic worked example.",
          code: `num = 8
if num % 2 == 0:
    print(num, "is an even number")
else:
    print(num, "is an odd number")`,
          steps: [
            { line: 1, vars: { num: "8" }, note: "Store the number to test." },
            { line: 2, vars: { num: "8", "num % 2": "0" }, note: "8 % 2 is 0, and 0 == 0 is True." },
            { line: 3, vars: { num: "8" }, out: "8 is an even number", note: "True branch runs." },
            { line: 5, vars: { num: "8" }, note: "The else block is skipped entirely — it is never both." },
          ],
        },
        {
          kind: "checkpoint",
          title: "Check the room",
          ask: "Can an else block ever run at the same time as its if block?",
          answer: "Never. They are two exits from one decision. Exactly one of them runs, every single time.",
        },
      ],
    },
    {
      id: "elif",
      title: "if..elif..else",
      takeaway: "Conditions are tested top to bottom; the FIRST True one wins and the rest are skipped.",
      minutes: 12,
      cards: [
        {
          kind: "code",
          title: "The syntax",
          template: true,
          code: `if condition_1:
    block_of_code_1
elif condition_2:
    block_of_code_2
elif condition_3:
    block_of_code_3
else:
    block_of_code_4`,
          annotations: [
            { line: 3, label: "as many elif blocks as you need", tone: "iris" },
            { line: 7, label: "at most ONE else, and it comes last", tone: "sun" },
          ],
          callout: {
            tone: "note",
            text: "Multiple elif blocks are allowed but only one else block. Only one block_of_code gets executed — the first whose condition is True.",
          },
        },
        {
          kind: "trace",
          title: "Four-digit number check",
          lead: "Watch the conditions being tested in order.",
          code: `num = 4571
if num < 10:
    print("one digit")
elif num < 100:
    print("two digits")
elif num < 1000:
    print("three digits")
else:
    print("four or more digits")`,
          steps: [
            { line: 1, vars: { num: "4571" } },
            { line: 2, vars: { num: "4571" }, note: "4571 < 10 → False. Move to the next test." },
            { line: 4, vars: { num: "4571" }, note: "4571 < 100 → False." },
            { line: 6, vars: { num: "4571" }, note: "4571 < 1000 → False." },
            { line: 8, vars: { num: "4571" }, note: "Everything failed, so the else block catches it." },
            { line: 9, vars: { num: "4571" }, out: "four or more digits" },
          ],
        },
        {
          kind: "flow",
          title: "The grade ladder as a flowchart",
          lead: "Each elif is one more diamond down the left-hand spine.",
          flow: gradeChart,
          steps: [
            { node: "input", note: "Read the marks." },
            { node: "d1", note: "First test — anything below 50 exits immediately as Fail." },
            { node: "d2", note: "Reaching here already means marks >= 50, so the test only needs the upper bound." },
            { node: "d3", note: "Same again for C." },
            { node: "d4", note: "And for B." },
            { node: "ga", note: "The else needs no test at all: everything left over is an A." },
          ],
        },
        {
          kind: "code",
          title: "The grade ladder as code",
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
          output: `Enter the student's marks: 73
The student's grade is: B`,
          annotations: [{ line: 14, label: "f-string: {grade} is replaced by the value", tone: "mint" }],
          callout: {
            tone: "tip",
            text: "Because the ladder is tested in order, you do NOT need to write 50 <= marks < 60. Reaching the second test already guarantees marks >= 50.",
          },
        },
      ],
    },
    {
      id: "nested",
      title: "Nested if..else",
      takeaway: "An if inside another if — the inner test only happens when the outer one passed.",
      minutes: 8,
      cards: [
        {
          kind: "trace",
          title: "Leap year — a decision inside a decision",
          code: `year = 2000
if year % 4 == 0:
    if year % 100 == 0:
        if year % 400 == 0:
            print("Leap year")
        else:
            print("Common year")
    else:
        print("Leap year")
else:
    print("Common year")`,
          steps: [
            { line: 1, vars: { year: "2000" } },
            { line: 2, vars: { year: "2000", "year % 4": "0" }, note: "Divisible by 4 → enter the outer block." },
            { line: 3, vars: { year: "2000", "year % 100": "0" }, note: "Also divisible by 100 → the century rule applies." },
            { line: 4, vars: { year: "2000", "year % 400": "0" }, note: "Divisible by 400 → the exception to the exception." },
            { line: 5, vars: { year: "2000" }, out: "Leap year", note: "2000 was a leap year. 1900 was not." },
          ],
        },
        {
          kind: "compare",
          title: "Nested vs. combined",
          lead: "The same rule written two ways. The second is easier to read.",
          columns: [
            {
              heading: "Nested",
              tone: "neutral",
              code: `if year % 4 == 0:
    if year % 100 != 0:
        print("Leap")`,
              points: ["Shows the logic step by step", "Gets deep quickly"],
            },
            {
              heading: "Combined with and / or",
              tone: "good",
              code: `if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):
    print("Leap")
else:
    print("Common")`,
              points: ["One condition, one decision", "Brackets make the grouping explicit"],
            },
          ],
        },
      ],
    },
  ],
  practice: [
    {
      id: "t8-q1",
      kind: "predict",
      prompt: "What is the exact output?",
      code: `x = 5
if x > 10:
    print("big")
print("done")`,
      answer: "done",
      explain: "The condition is False so the indented block is skipped. The unindented line still runs.",
      difficulty: 1,
    },
    {
      id: "t8-q2",
      kind: "mcq",
      prompt: "What must follow the condition of an if statement?",
      choices: [
        "A semicolon ;",
        "Curly braces { }",
        "The word then",
        "A colon :",
      ],
      answer: 3,
      explain: "Python ends the header line with a colon and then indents the block beneath it.",
      difficulty: 1,
    },
    {
      id: "t8-q3",
      kind: "predict",
      prompt: "What is the exact output?",
      code: `n = 75
if n < 50:
    print("Fail")
elif n < 70:
    print("C")
elif n < 80:
    print("B")
else:
    print("A")`,
      answer: "B",
      explain: "Conditions are tested in order. The first two are False; n < 80 is True, so B is printed and the else never runs.",
      difficulty: 2,
    },
    {
      id: "t8-q4",
      kind: "mcq",
      prompt: "How many else blocks may a single if..elif chain have?",
      choices: [
        "As many as you like",
        "Exactly two",
        "At most one, and it must come last",
        "One per elif",
      ],
      answer: 2,
      explain: "Multiple elif blocks are allowed, but only one else block, and it always comes last.",
      difficulty: 2,
    },
    {
      id: "t8-q5",
      kind: "fill",
      prompt: "Complete the program (2 lines) so it prints the message when A is less than a thousand.",
      template: `A = 950
___ A < 1000___
    print("A is less than a thousand")`,
      blanks: [["if"], [":"]],
      explain: "An if statement needs the keyword, the condition, a colon, and an indented block.",
      difficulty: 1,
    },
    {
      id: "t8-q6",
      kind: "code",
      prompt:
        "Practice 2 from your slides. A secret number is 42. Read a guess from the input and print 'Yes, you got it! :)' if it matches, otherwise 'See you again'.",
      starter: `secret_number = 42
guess = int(input("Guess the secret number: "))
# your code
`,
      stdin: ["42"],
      expected: "Guess the secret number: Yes, you got it! :)",
      solution: `secret_number = 42
guess = int(input("Guess the secret number: "))
if guess == secret_number:
    print("Yes, you got it! :)")
else:
    print("See you again")`,
      explain: "== compares the two values. The else branch covers every guess that is not equal.",
      difficulty: 2,
    },
    {
      id: "t8-q7",
      kind: "code",
      prompt:
        "Practice 3. Read a year and report whether it is a leap year. A leap year is divisible by 4 and not by 100, OR divisible by 400. Print 'Yes, year 2024 is a leap year!' or 'It is a common year'.",
      starter: `year = int(input("Enter a year: "))
# your code
`,
      stdin: ["2024"],
      expected: "Enter a year: Yes, year 2024 is a leap year!",
      solution: `year = int(input("Enter a year: "))
if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):
    print(f"Yes, year {year} is a leap year!")
else:
    print("It is a common year")`,
      explain: "Group each half of the rule in brackets, join them with or, and use an f-string to slot the year into the message.",
      difficulty: 3,
    },
    {
      id: "t8-q8",
      kind: "code",
      prompt:
        "Assignment. Read marks and print the grade: <50 Fail, <60 D, <70 C, <80 B, otherwise A. The test enters 64.",
      starter: `marks = float(input("Enter the student's marks: "))
# your code
`,
      stdin: ["64"],
      expected: "Enter the student's marks: The student's grade is: C",
      solution: `marks = float(input("Enter the student's marks: "))
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
      explain: "Store the answer in a variable inside the ladder, then print once at the end — less repetition than a print in every branch.",
      difficulty: 3,
    },
  ],
  assignment: {
    title: "Grades assignment",
    body: [
      "1. Write code that gets the user to enter marks for a student's grade, using if..elif..else statements to print the respective grade.",
      "2. Draw a flowchart for the same program.",
      "For marks <= 49 print 'Fail'; >49 and <60 print 'D'; >=60 and <70 print 'C'; >=70 and <80 print 'B'; >=80 print 'A'.",
    ],
    solution: `# Get user input for marks
marks = float(input("Enter the student's marks: "))

# Check the grade based on the specified conditions
if marks < 50:
    grade = "Fail"
elif 50 <= marks < 60:
    grade = "D"
elif 60 <= marks < 70:
    grade = "C"
elif 70 <= marks < 80:
    grade = "B"
else:
    grade = "A"

# Print the corresponding grade
print(f"The student's grade is: {grade}")`,
  },
};
