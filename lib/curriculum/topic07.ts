import type { Topic } from "./types";

export const topic07: Topic = {
  num: 7,
  slug: "operators",
  title: "Operators",
  tagline: "The constructs that manipulate the value of operands.",
  glyph: "±",
  accent: "rose",
  objectives: [
    "Use the seven arithmetic operators and predict integer vs float results",
    "Apply operator priority and left-to-right binding (and the one exception)",
    "Combine comparison and logical operators to form conditions",
    "Distinguish == from is, and use in / not in on sequences",
  ],
  concepts: [
    {
      id: "intro",
      title: "Operands and operators",
      takeaway: "In 4 + 5 = 9, the values 4 and 5 are operands and + is the operator.",
      minutes: 4,
      cards: [
        {
          kind: "idea",
          title: "Six families of operator",
          lead: "Operators are the constructs which can manipulate the value of operands.",
          points: [
            "Arithmetic — + - * / ** // %",
            "Comparison (Relational) — == != > < >= <=",
            "Logical — and, or, not",
            "Assignment — = += -= *= /=",
            "Identity — is, is not",
            "Membership — in, not in",
          ],
        },
      ],
    },
    {
      id: "arithmetic",
      title: "Arithmetic operators",
      takeaway: "/ always gives a float; // and % give the whole part and the remainder; ** is power.",
      minutes: 10,
      cards: [
        {
          kind: "code",
          title: "All seven, on 5 and 2",
          code: `print(5 + 2)    # 5 plus 2         = 7
print(5 - 2)    # 5 minus 2        = 3
print(5 * 2)    # 5 multiplied by 2 = 10
print(5 / 2)    # 5 divided by 2   = 2.5
print(5 ** 2)   # 5 to the power 2 = 25
print(5 // 2)   # floor division   = 2  (quotient)
print(5 % 2)    # modulus division = 1  (remainder)`,
          output: `7
3
10
2.5
25
2
1`,
          runnable: true,
          annotations: [
            { line: 4, label: "/ ALWAYS produces a float", tone: "rose" },
            { line: 5, label: "** left arg is the base, right arg the exponent", tone: "iris" },
          ],
        },
        {
          kind: "code",
          title: "Integer or float? The ** rule",
          lead: "When both ** arguments are integers the result is an integer too. If at least one is a float, the result is a float.",
          code: `print(2 ** 3)
print(2 ** 3.)
print(2. ** 3)
print(2. ** 3.)`,
          output: `8
8.0
8.0
8.0`,
          runnable: true,
          callout: { tone: "note", text: "2. is a valid float literal — a decimal point with nothing after it means 2.0." },
        },
      ],
    },
    {
      id: "precedence",
      title: "Priority and binding",
      takeaway: "Brackets first, then * / % //, then + -. Equal priority binds left to right — except **, which binds right to left.",
      minutes: 12,
      cards: [
        {
          kind: "anim",
          title: "Watch an expression collapse",
          lead: "Step through the evaluation one operator at a time.",
          anim: "precedence",
          props: { expression: "2 + 3 * 5" },
        },
        {
          kind: "table",
          title: "Priority table",
          headers: ["Priority", "Operator"],
          rows: [
            ["1 (highest)", "( )"],
            ["2", "**"],
            ["3", "*, /, %, //"],
            ["4 (lowest)", "+, -"],
          ],
          callout: {
            tone: "note",
            text: "You probably remember from school that multiplications precede additions. 2 + 3 * 5 is 17, not 25 — the multiplication happens first.",
          },
        },
        {
          kind: "trace",
          title: "Left-sided binding",
          lead: "print(9 % 6 % 2) — most Python operators are evaluated from left to right.",
          code: `print(9 % 6 % 2)`,
          steps: [
            { line: 1, note: "Two % operators of equal priority sit side by side.", vars: { expression: "9 % 6 % 2" } },
            { line: 1, note: "Left-sided binding: evaluate 9 % 6 first, which gives 3.", vars: { expression: "3 % 2" } },
            { line: 1, note: "Then 3 % 2 gives 1.", vars: { expression: "1" }, out: "1" },
            {
              line: 1,
              note: "From right to left it would be 6 % 2 = 0, and then 9 % 0 — a fatal division-by-zero error. So the direction genuinely matters.",
              vars: { expression: "1" },
            },
          ],
        },
        {
          kind: "trace",
          title: "The one exception: **",
          lead: "print(2 ** 2 ** 3) gives 256, not 64.",
          code: `print(2 ** 2 ** 3)`,
          steps: [
            { line: 1, note: "Power is the exception — it binds RIGHT to left.", vars: { expression: "2 ** 2 ** 3" } },
            { line: 1, note: "So 2 ** 3 is evaluated first, giving 8.", vars: { expression: "2 ** 8" } },
            { line: 1, note: "Then 2 ** 8 gives 256. Left-to-left would have given 4 ** 3 = 64.", vars: { expression: "256" }, out: "256" },
          ],
        },
        {
          kind: "checkpoint",
          title: "Check the room",
          ask: "What is  10 - 4 - 3 ?  And what would it be with right-to-left binding?",
          answer: "3, because (10 - 4) - 3. Right-to-left would give 10 - (4 - 3) = 9. Minus binds left to right, like almost everything else.",
        },
      ],
    },
    {
      id: "comparison",
      title: "Comparison operators",
      takeaway: "Comparisons always produce True or False — the fuel for every if statement.",
      minutes: 8,
      cards: [
        {
          kind: "anim",
          title: "Comparison lab",
          lead: "Change the operands and watch every comparison re-evaluate.",
          anim: "comparison-lab",
        },
        {
          kind: "table",
          title: "The six comparison operators",
          headers: ["Operator", "Returns True when…", "Example", "Result"],
          rows: [
            ["==", "the two operands are equal", "5 == 5", "True"],
            ["!=", "the two operands are NOT equal", "5 != 5", "False"],
            [">", "the left operand is greater than the right", "7 > 3", "True"],
            ["<", "the left operand is less than the right", "7 < 3", "False"],
            [">=", "the left is greater than OR equal to the right", "3 >= 3", "True"],
            ["<=", "the left is less than OR equal to the right", "4 <= 3", "False"],
          ],
          callout: {
            tone: "warn",
            text: "= assigns a value. == compares two values. Using = inside an if is a SyntaxError — and it is the mistake every class makes in week one.",
          },
        },
      ],
    },
    {
      id: "logical",
      title: "Logical operators",
      takeaway: "and needs both sides True; or needs at least one; not flips the answer.",
      minutes: 8,
      cards: [
        {
          kind: "anim",
          title: "Logic lab",
          lead: "Flip the switches and read the truth table live.",
          anim: "logic-lab",
        },
        {
          kind: "code",
          title: "The classic demonstration",
          code: `x = True
y = False
print('x and y is', x and y)
print('x or y is', x or y)
print('not x is', not x)`,
          output: `x and y is False
x or y is True
not x is False`,
          runnable: true,
        },
        {
          kind: "table",
          title: "Truth table",
          headers: ["x", "y", "x and y", "x or y", "not x"],
          rows: [
            ["True", "True", "True", "True", "False"],
            ["True", "False", "False", "True", "False"],
            ["False", "True", "False", "True", "True"],
            ["False", "False", "False", "False", "True"],
          ],
        },
      ],
    },
    {
      id: "assignment-ops",
      title: "Assignment operators",
      takeaway: "a += 5 is shorthand for a = a + 5.",
      minutes: 5,
      cards: [
        {
          kind: "code",
          title: "Simple and compound",
          code: `a = 5        # simple assignment: put 5 into a
a += 5       # equivalent to a = a + 5
print(a)
a -= 2       # a = a - 2
a *= 3       # a = a * 3
print(a)`,
          output: `10
24`,
          runnable: true,
          callout: { tone: "note", text: "Read a += 5 as 'add 5 onto whatever a already holds, then store it back in a'." },
        },
      ],
    },
    {
      id: "identity",
      title: "Identity operators",
      takeaway: "== asks 'same value?'. is asks 'same object in memory?'. They are not the same question.",
      minutes: 10,
      cards: [
        {
          kind: "anim",
          title: "Two variables, one memory",
          lead: "See when Python reuses an object and when it makes a fresh one.",
          anim: "identity-memory",
        },
        {
          kind: "code",
          title: "Equal but not identical",
          code: `x1 = 5
y1 = 5
x2 = 'Hello'
y2 = 'Hello'
x3 = [1, 2, 3]
y3 = [1, 2, 3]

print(x1 is not y1)   # False
print(x2 is y2)       # True
print(x3 is y3)       # False`,
          output: `False
True
False`,
          runnable: true,
          annotations: [{ line: 10, label: "Lists get their own place in memory each time", tone: "rose" }],
          callout: {
            tone: "warn",
            text: "x3 and y3 are lists. They are equal but not identical, because the interpreter locates them separately in memory although they hold the same values. Two variables that are equal does not imply that they are identical.",
          },
        },
      ],
    },
    {
      id: "membership",
      title: "Membership operators",
      takeaway: "in and not in test whether a value is found inside a sequence.",
      minutes: 8,
      cards: [
        {
          kind: "anim",
          title: "Scanning for a member",
          lead: "Watch Python walk the sequence looking for the value.",
          anim: "membership-scan",
        },
        {
          kind: "code",
          title: "Strings and dictionaries",
          code: `x = 'Hello world'
y = {1: 'a', 2: 'b'}

print('H' in x)          # True
print('hello' not in x)  # True
print(1 in y)            # True
print('a' in y)          # False`,
          output: `True
True
True
False`,
          runnable: true,
          annotations: [
            { line: 5, label: "Case matters: 'hello' with a small h is not in the string", tone: "sun" },
            { line: 7, label: "For a dictionary, in searches the KEYS, not the values", tone: "rose" },
          ],
        },
        {
          kind: "checkpoint",
          title: "Check the room",
          ask: "Why is  print('a' in {1:'a', 2:'b'})  False when 'a' is clearly written there?",
          answer: "Because in searches a dictionary's keys, and the keys are 1 and 2. The values 'a' and 'b' are not searched.",
        },
      ],
    },
  ],
  practice: [
    {
      id: "t7-q1",
      kind: "predict",
      prompt: "What is the exact output?",
      code: "print(2 + 3 * 5)",
      answer: "17",
      explain: "Multiplication has higher priority than addition, so 3 * 5 is evaluated first, then 2 is added.",
      difficulty: 1,
    },
    {
      id: "t7-q2",
      kind: "predict",
      prompt: "What is the exact output?",
      code: "print(2 ** 2 ** 3)",
      answer: "256",
      explain: "** binds right to left, so 2 ** 3 = 8 happens first, then 2 ** 8 = 256.",
      difficulty: 3,
    },
    {
      id: "t7-q3",
      kind: "predict",
      prompt: "What is the exact output?",
      code: "print(9 % 6 % 2)",
      answer: "1",
      explain: "Left-sided binding: 9 % 6 gives 3, then 3 % 2 gives 1.",
      difficulty: 3,
    },
    {
      id: "t7-q4",
      kind: "mcq",
      prompt: "What does print(5 / 2) display?",
      choices: [
        "3",
        "2.5",
        "2",
        "2.0",
      ],
      answer: 1,
      explain: "/ always produces a float. Use // if you want the whole-number quotient 2.",
      difficulty: 1,
    },
    {
      id: "t7-q5",
      kind: "predict",
      prompt: "What is the exact output?",
      code: "print(2 ** 3.)",
      answer: "8.0",
      explain: "When at least one argument of ** is a float, the result is a float too.",
      difficulty: 2,
    },
    {
      id: "t7-q6",
      kind: "mcq",
      prompt: "x = [1,2] and y = [1,2]. What does print(x == y, x is y) display?",
      choices: [
        "True False",
        "True True",
        "False False",
        "False True",
      ],
      answer: 0,
      explain: "The lists hold equal values so == is True, but the interpreter stored them separately in memory so is is False.",
      difficulty: 3,
    },
    {
      id: "t7-q7",
      kind: "predict",
      prompt: "What is the exact output?",
      code: `x = True
y = False
print(x and y, x or y, not x)`,
      answer: "False True False",
      explain: "and needs both True; or needs at least one True; not inverts.",
      difficulty: 2,
    },
    {
      id: "t7-q8",
      kind: "predict",
      prompt: "What is the exact output?",
      code: `x = 'Hello world'
print('H' in x, 'hello' in x)`,
      answer: "True False",
      explain: "Membership is case-sensitive: the capital H is present, the lower-case word 'hello' is not.",
      difficulty: 2,
    },
    {
      id: "t7-q9",
      kind: "fill",
      prompt: "Use a compound assignment operator to add 5 onto a.",
      template: `a = 10
a ___ 5
print(a)   # 15`,
      blanks: [["+="]],
      explain: "a += 5 is exactly equivalent to a = a + 5.",
      difficulty: 1,
    },
    {
      id: "t7-q10",
      kind: "code",
      prompt:
        "A number is stored in n. Print True if n is even AND greater than 10, otherwise False — using one print statement and logical operators.",
      starter: "n = 14\n",
      expected: "True",
      solution: `n = 14
print(n % 2 == 0 and n > 10)`,
      explain: "n % 2 == 0 tests evenness; and combines it with the size test. A comparison already produces True or False, so no if statement is needed.",
      difficulty: 3,
    },
  ],
};
