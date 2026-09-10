import type { Topic } from "./types";

export const topic12: Topic = {
  num: 12,
  slug: "functions",
  title: "Functions",
  tagline: "Write it once, name it, and call it whenever you need it.",
  glyph: "ƒ",
  accent: "iris",
  objectives: [
    "Explain the four benefits of writing functions",
    "Distinguish built-in functions from user-defined ones",
    "Define a function with def, parameters and a return value",
    "Use default arguments to make a parameter optional",
  ],
  concepts: [
    {
      id: "what-is-function",
      title: "What is a function?",
      takeaway: "A named block of code that performs a specific task — write it once, call it many times.",
      minutes: 6,
      cards: [
        {
          kind: "idea",
          title: "Why functions exist",
          lead: "A block of code that contains one or more Python statements, used for performing a specific task.",
          points: [
            "Code re-usability — write the logic once and call it from anywhere",
            "Improves readability — a good name explains a whole block at a glance",
            "Avoids redundancy — no copy-paste duplicates to keep in sync",
            "Isolates a task so you can test it on its own",
          ],
          callout: {
            tone: "tip",
            text: "Ask the class: if you copy five lines to three places and then find a bug, how many places do you fix? A function makes the answer 'one'.",
          },
        },
        {
          kind: "compare",
          title: "Two kinds of function",
          columns: [
            {
              heading: "Built-in functions",
              tone: "neutral",
              code: `print("hi")
len([1, 2, 3])
int("42")
input("Name: ")
range(5)`,
              points: [
                "Predefined in Python — you need not declare them before calling",
                "Freely invoke them as and when needed",
              ],
            },
            {
              heading: "User-defined functions",
              tone: "good",
              code: `def add(num1, num2):
    return num1 + num2

add(100, 200)`,
              points: ["The functions which we create in our code", "Must be defined before they are called"],
            },
          ],
        },
      ],
    },
    {
      id: "declaring",
      title: "Declaring and calling",
      takeaway: "def name(parameters): defines it. name(arguments) runs it. return hands a value back.",
      minutes: 12,
      cards: [
        {
          kind: "code",
          title: "The shape of a function",
          code: `def function_name(function_parameters):
    function_body        # set of Python statements
    return               # optional return statement`,
          annotations: [
            { line: 1, label: "def keyword, name, brackets, colon", tone: "iris" },
            { line: 2, label: "indented body — the same rule as if and for", tone: "mint" },
            { line: 3, label: "return is optional", tone: "sun" },
          ],
        },
        {
          kind: "code",
          title: "Two ways to call it",
          code: `# when the function doesn't return anything
function_name(parameters)

# when the function returns something,
# a variable is used to store the returned value
variable = function_name(parameters)`,
        },
        {
          kind: "anim",
          title: "Inside a function call",
          lead: "Watch the arguments bind to the parameters and the value travel back.",
          anim: "call-stack",
        },
        {
          kind: "trace",
          title: "The add() function, step by step",
          code: `def add(num1, num2):
    return num1 + num2

sum1 = add(100, 200)
sum2 = add(8, 9)
print(sum1)
print(sum2)`,
          steps: [
            { line: 1, vars: { add: "<function>" }, note: "def only DEFINES the function. Nothing inside it runs yet." },
            { line: 4, vars: { add: "<function>" }, note: "The call. 100 binds to num1 and 200 binds to num2 — by position." },
            { line: 2, vars: { num1: "100", num2: "200" }, note: "Inside the function: the body runs and computes 300." },
            { line: 4, vars: { sum1: "300" }, note: "return sends 300 back, and it is stored in sum1." },
            { line: 5, vars: { sum1: "300" }, note: "Second call with different arguments." },
            { line: 2, vars: { num1: "8", num2: "9" }, note: "Same code, new values. This is re-usability." },
            { line: 5, vars: { sum1: "300", sum2: "17" } },
            { line: 6, vars: { sum1: "300", sum2: "17" }, out: "300" },
            { line: 7, vars: { sum1: "300", sum2: "17" }, out: "17" },
          ],
        },
        {
          kind: "checkpoint",
          title: "Check the room",
          ask: "What is the difference between print(x) inside a function and return x?",
          answer:
            "print shows the value to the human and gives nothing back to the program. return hands the value to the caller so it can be stored and used. A function that only prints cannot be reused in a calculation.",
        },
      ],
    },
    {
      id: "default-args",
      title: "Default arguments",
      takeaway: "A parameter with a default value becomes optional — the default is used when no argument is supplied.",
      minutes: 10,
      cards: [
        {
          kind: "code",
          title: "num2 becomes optional",
          lead: "By using default arguments we can avoid the errors that may arise while calling a function without passing all the parameters.",
          code: `def add(num1, num2=1):
    return num1 + num2

sum1 = add(100, 200)
sum2 = add(8)
sum3 = add(100)

print(sum1)
print(sum2)
print(sum3)`,
          output: `300
9
101`,
          runnable: true,
          annotations: [
            { line: 1, label: "num2 defaults to 1 if not supplied", tone: "sun" },
            { line: 4, label: "both given → 100 + 200", tone: "mint" },
            { line: 5, label: "only one given → 8 + 1", tone: "iris" },
          ],
        },
        {
          kind: "compare",
          title: "Without a default, this is an error",
          columns: [
            {
              heading: "No default",
              tone: "bad",
              code: `def add(num1, num2):
    return num1 + num2

print(add(8))`,
              output: "TypeError: add() missing 1 required positional argument: 'num2'",
              points: ["Every parameter must be filled"],
            },
            {
              heading: "With a default",
              tone: "good",
              code: `def add(num1, num2=1):
    return num1 + num2

print(add(8))`,
              output: "9",
              points: ["The default fills the gap"],
            },
          ],
        },
        {
          kind: "idea",
          title: "One rule to remember",
          points: [
            "Parameters WITH defaults must come after parameters without them",
            "def f(a, b=2) is legal",
            "def f(a=1, b) is a SyntaxError",
            "Otherwise Python could not tell which argument you meant",
          ],
          callout: {
            tone: "warn",
            text: "Watch capitalisation too. In the slide example, writing Sum3 = add(100) but then print(sum3) gives a NameError — Python treats Sum3 and sum3 as different variables.",
          },
        },
      ],
    },
  ],
  practice: [
    {
      id: "t12-q1",
      kind: "mcq",
      prompt: "Which keyword defines a function in Python?",
      choices: ["def", "function", "func", "define"],
      answer: 0,
      explain: "def name(parameters): followed by an indented body.",
      difficulty: 1,
    },
    {
      id: "t12-q2",
      kind: "predict",
      prompt: "What is the exact output?",
      code: `def add(num1, num2):
    return num1 + num2

print(add(100, 200))
print(add(8, 9))`,
      answer: "300\n17",
      explain: "The same function body runs twice with different arguments — that is code re-usability.",
      difficulty: 1,
    },
    {
      id: "t12-q3",
      kind: "predict",
      prompt: "What is the exact output?",
      code: `def add(num1, num2=1):
    return num1 + num2

print(add(100, 200))
print(add(8))
print(add(100))`,
      answer: "300\n9\n101",
      explain: "When the second argument is omitted the default value 1 is used, so add(8) is 8 + 1 and add(100) is 100 + 1.",
      difficulty: 2,
    },
    {
      id: "t12-q4",
      kind: "mcq",
      prompt: "What happens when a function has no return statement?",
      choices: [
        "It returns None",
        "It returns 0",
        "It causes a SyntaxError",
        "It returns the last value calculated",
      ],
      answer: 0,
      explain: "return is optional. A function without one still runs its body but hands back None.",
      difficulty: 2,
    },
    {
      id: "t12-q5",
      kind: "mcq",
      prompt: "Which of these is a built-in function?",
      choices: ["print", "add", "calculate_total", "greet"],
      answer: 0,
      explain: "print is predefined in Python and needs no declaration. The others would have to be user-defined with def.",
      difficulty: 1,
    },
    {
      id: "t12-q6",
      kind: "fill",
      prompt: "Complete the function definition so it returns the product of two numbers.",
      template: `___ multiply(a, b):
    ___ a * b

print(multiply(4, 5))   # 20`,
      blanks: [["def"], ["return"]],
      explain: "def opens the definition; return hands the computed value back to the caller.",
      difficulty: 2,
    },
    {
      id: "t12-q7",
      kind: "code",
      prompt:
        "Write a function greet(name, greeting=\"Hello\") that returns the greeting followed by the name. Then print greet(\"Sam\") and greet(\"Sam\", \"Good morning\").",
      starter: "",
      expected: "Hello Sam\nGood morning Sam",
      solution: `def greet(name, greeting="Hello"):
    return greeting + " " + name

print(greet("Sam"))
print(greet("Sam", "Good morning"))`,
      explain: "The default value makes greeting optional. Supplying a second argument overrides the default.",
      difficulty: 3,
    },
    {
      id: "t12-q8",
      kind: "code",
      prompt:
        "Write a function is_even(n) that returns True or False, then use it in a for loop to print only the even numbers from 1 to 10, separated by spaces.",
      starter: "",
      expected: "2 4 6 8 10",
      solution: `def is_even(n):
    return n % 2 == 0

for n in range(1, 11):
    if is_even(n):
        print(n, end=" ")`,
      explain:
        "The comparison n % 2 == 0 already produces True or False, so it can be returned directly and used as an if condition.",
      difficulty: 3,
    },
  ],
};
