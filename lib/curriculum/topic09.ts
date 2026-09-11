import type { Topic } from "./types";

export const topic09: Topic = {
  num: 9,
  slug: "lists",
  title: "Data Types: List",
  tagline: "One name, many values — the compound data type you will use everywhere.",
  glyph: "▤",
  accent: "mint",
  objectives: [
    "Create a list and access items by positive and negative index",
    "Explain IndexError and TypeError when indexing goes wrong",
    "Slice a list to obtain a sublist",
    "Add, update and delete elements with insert, append, extend and del",
  ],
  concepts: [
    {
      id: "what-is-list",
      title: "What is a list?",
      takeaway: "A list is a compound data type: one variable holding many items, in order, inside square brackets.",
      minutes: 6,
      cards: [
        {
          kind: "idea",
          title: "A datatype that can store various types of data",
          points: [
            "A list is a compound data type — it holds other values",
            "Examples of datatypes in a list are integer, float and string items",
            "Items are placed inside a square bracket [ ] separated by a comma ,",
            "The order you write them in is the order they keep",
          ],
        },
        {
          kind: "code",
          title: "Creating lists",
          code: `numbers = [11, 22, 33, 100, 200, 300]
names = ["hello", "world", "hi", "bye"]
mixed = [1, "two", 3.0, True]
empty = []

print(numbers)
print(mixed)
print(len(numbers))`,
          output: `[11, 22, 33, 100, 200, 300]
[1, 'two', 3.0, True]
6`,
          runnable: true,
          callout: { tone: "tip", text: "len() tells you how many items a list holds. It is the fastest way to check your list is what you think it is." },
        },
      ],
    },
    {
      id: "indexing",
      title: "Accessing items by index",
      takeaway: "Counting starts at 0. The last valid index is always len(list) - 1.",
      minutes: 12,
      cards: [
        {
          kind: "anim",
          title: "The index ruler",
          lead: "Click any cell — or step through — to see which index reaches it.",
          anim: "list-index",
          props: { items: ["11", "22", "33", "100", "200", "300"] },
        },
        {
          kind: "code",
          title: "list_name[index]",
          code: `numbers = [11, 22, 33, 100, 200, 300]

print(numbers[0])   # prints 11
print(numbers[5])   # prints 300
print(numbers[1])   # prints 22`,
          output: `11
300
22`,
          runnable: true,
          annotations: [{ line: 3, label: "The FIRST item is at index 0, not 1", tone: "rose" }],
        },
        {
          kind: "compare",
          title: "Two ways indexing goes wrong",
          columns: [
            {
              heading: "Index cannot be a float",
              tone: "bad",
              code: `numbers = [11, 22, 33, 100, 200, 300]
print(numbers[1.0])`,
              output: "TypeError: list indices must be integers or slices, not float",
              points: ["1.0 is a float even though it looks whole", "Use int() if the value came from a calculation"],
            },
            {
              heading: "Index must be within range",
              tone: "bad",
              code: `numbers = [11, 22, 33, 100, 200, 300]
print(numbers[6])`,
              output: "IndexError: list index out of range",
              points: ["6 items → valid indexes are 0 to 5", "A list with 10 elements has the range 0~9"],
            },
          ],
        },
        {
          kind: "anim",
          title: "Negative index — counting from the end",
          lead: "-1 accesses the last item, -2 the second last, -3 the third last.",
          anim: "list-index",
          props: { items: ["hello", "world", "hi", "bye"], negative: true },
        },
        {
          kind: "code",
          title: "Negative indexing in code",
          code: `my_list = ["hello", "world", "hi", "bye"]

print(my_list[-1])   # prints "bye"
print(my_list[-3])   # prints "world"
print(my_list[-4])   # prints "hello"`,
          output: `bye
world
hello`,
          runnable: true,
          callout: { tone: "tip", text: "my_list[-1] is the standard way to reach the last item without knowing how long the list is." },
        },
        {
          kind: "checkpoint",
          title: "Check the room",
          ask: "A list has 10 elements. What is the largest positive index, and the most negative index that still works?",
          answer: "9 and -10. Positive indexes run 0 to 9; negative indexes run -1 to -10. Anything outside gives IndexError.",
        },
      ],
    },
    {
      id: "slicing",
      title: "Slicing — getting a sublist",
      takeaway: "list[start:stop] includes start and excludes stop. Leave either side out to mean 'the whole way'.",
      minutes: 12,
      cards: [
        {
          kind: "anim",
          title: "Move the slice handles",
          lead: "Drag start and stop and watch the sublist change.",
          anim: "list-slice",
          props: { items: ["1", "2", "3", "4", "5", "6", "7"] },
        },
        {
          kind: "code",
          title: "Four common slices",
          code: `n_list = [1, 2, 3, 4, 5, 6, 7]

print(n_list[1:3])   # items from 2nd to 3rd
print(n_list[:3])    # from the beginning to the 3rd
print(n_list[3:])    # from the 4th to the end
print(n_list[:])     # the whole list`,
          output: `[2, 3]
[1, 2, 3]
[4, 5, 6, 7]
[1, 2, 3, 4, 5, 6, 7]`,
          runnable: true,
          annotations: [{ line: 3, label: "stop is EXCLUDED: index 3 is not taken", tone: "rose" }],
          callout: {
            tone: "note",
            text: "A slice always returns a NEW list. The original list is untouched — which is why n_list[:] is a quick way to copy one.",
          },
        },
      ],
    },
    {
      id: "adding",
      title: "List operations — adding",
      takeaway: "insert() puts one item at a position, append() adds one at the end, extend() adds many at the end.",
      minutes: 12,
      cards: [
        {
          kind: "anim",
          title: "insert, append, extend",
          lead: "Watch the list grow with each operation.",
          anim: "list-ops",
          props: { mode: "add" },
        },
        {
          kind: "trace",
          title: "All three, step by step",
          code: `n_list = [1, 2, 3, 4]

n_list.insert(3, 100)
print(n_list)

n_list.append(99)
print(n_list)

n_list.extend([11, 22])
print(n_list)`,
          steps: [
            { line: 1, vars: { n_list: "[1, 2, 3, 4]" }, note: "Starting list." },
            { line: 3, vars: { n_list: "[1, 2, 3, 100, 4]" }, note: "insert(3, 100) puts 100 AT index 3, shifting 4 to the right." },
            { line: 4, vars: { n_list: "[1, 2, 3, 100, 4]" }, out: "[1, 2, 3, 100, 4]" },
            { line: 6, vars: { n_list: "[1, 2, 3, 100, 4, 99]" }, note: "append(99) always adds a single item at the very end." },
            { line: 7, vars: { n_list: "[1, 2, 3, 100, 4, 99]" }, out: "[1, 2, 3, 100, 4, 99]" },
            {
              line: 9,
              vars: { n_list: "[1, 2, 3, 100, 4, 99, 11, 22]" },
              note: "extend([11, 22]) adds SEVERAL items. It is equivalent to n_list = n_list + [11, 22].",
            },
            { line: 10, vars: { n_list: "[1, 2, 3, 100, 4, 99, 11, 22]" }, out: "[1, 2, 3, 100, 4, 99, 11, 22]" },
          ],
        },
        {
          kind: "compare",
          title: "append vs extend — the classic confusion",
          columns: [
            {
              heading: "append adds ONE item",
              tone: "neutral",
              code: `a = [1, 2]
a.append([3, 4])
print(a)`,
              output: "[1, 2, [3, 4]]",
              points: ["The whole list became a single item inside the list"],
            },
            {
              heading: "extend adds EACH item",
              tone: "good",
              code: `a = [1, 2]
a.extend([3, 4])
print(a)`,
              output: "[1, 2, 3, 4]",
              points: ["The items were unpacked and added one by one"],
            },
          ],
        },
      ],
    },
    {
      id: "update-delete",
      title: "Updating and deleting",
      takeaway: "Assign to an index to change one item, to a slice to replace a run; del removes items or the whole list.",
      minutes: 10,
      cards: [
        {
          kind: "trace",
          title: "Changing values",
          code: `n_list = [1, 2, 3, 4]

n_list[2] = 100
print(n_list)

n_list[1:3] = [11, 22, 33]
print(n_list)`,
          steps: [
            { line: 1, vars: { n_list: "[1, 2, 3, 4]" } },
            { line: 3, vars: { n_list: "[1, 2, 100, 4]" }, note: "Index 2 is the 3rd item — its value is replaced." },
            { line: 4, vars: { n_list: "[1, 2, 100, 4]" }, out: "[1, 2, 100, 4]" },
            {
              line: 6,
              vars: { n_list: "[1, 11, 22, 33, 4]" },
              note: "Slice assignment replaces items 1 and 2 with THREE new items — the list can change length.",
            },
            { line: 7, vars: { n_list: "[1, 11, 22, 33, 4]" }, out: "[1, 11, 22, 33, 4]" },
          ],
        },
        {
          kind: "trace",
          title: "Deleting with del",
          code: `n_list = [1, 2, 3, 4, 5, 6]

del n_list[1]
print(n_list)

del n_list[2:4]
print(n_list)

del n_list
print(n_list)`,
          steps: [
            { line: 1, vars: { n_list: "[1, 2, 3, 4, 5, 6]" } },
            { line: 3, vars: { n_list: "[1, 3, 4, 5, 6]" }, note: "Deleting the 2nd element. Everything after it shifts left." },
            { line: 4, vars: { n_list: "[1, 3, 4, 5, 6]" }, out: "[1, 3, 4, 5, 6]" },
            { line: 6, vars: { n_list: "[1, 3, 6]" }, note: "del with a slice removes a run of elements — indexes 2 and 3." },
            { line: 7, vars: { n_list: "[1, 3, 6]" }, out: "[1, 3, 6]" },
            { line: 9, vars: { n_list: "(deleted)" }, note: "del on the name itself removes the whole variable." },
            { line: 10, vars: { n_list: "(deleted)" }, out: "NameError: name 'n_list' is not defined", note: "Referring to it now is an error — the box no longer exists." },
          ],
        },
        {
          kind: "checkpoint",
          title: "Check the room",
          ask: "After  del n_list[1]  on [1,2,3,4], which index now holds the value 3?",
          answer: "Index 1. Deleting shifts every later item left by one, so indexes you worked out earlier are no longer valid.",
        },
      ],
    },
  ],
  practice: [
    {
      id: "t9-q1",
      kind: "predict",
      prompt: "What is the exact output?",
      code: `numbers = [11, 22, 33, 100, 200, 300]
print(numbers[0])
print(numbers[5])`,
      answer: "11\n300",
      explain: "Index 0 is the first item; index 5 is the sixth and last of a six-item list.",
      difficulty: 1,
    },
    {
      id: "t9-q2",
      kind: "mcq",
      prompt: "numbers = [11, 22, 33, 100, 200, 300]. What does print(numbers[6]) do?",
      choices: [
        "TypeError",
        "IndexError: list index out of range",
        "Prints 300",
        "Prints None",
      ],
      answer: 1,
      explain: "Six items means valid indexes 0 to 5. Index 6 is beyond the end.",
      difficulty: 1,
    },
    {
      id: "t9-q3",
      kind: "mcq",
      prompt: "What error does print(numbers[1.0]) produce?",
      choices: [
        "TypeError: list indices must be integers or slices, not float",
        "IndexError: list index out of range",
        "SyntaxError",
        "No error — it prints the second item",
      ],
      answer: 0,
      explain: "An index must be a whole number. 1.0 is a float, so Python refuses.",
      difficulty: 2,
    },
    {
      id: "t9-q4",
      kind: "predict",
      prompt: "What is the exact output?",
      code: `my_list = ["hello", "world", "hi", "bye"]
print(my_list[-1])
print(my_list[-3])`,
      answer: "bye\nworld",
      explain: "-1 is the last item and -3 is the third from the end.",
      difficulty: 2,
    },
    {
      id: "t9-q5",
      kind: "predict",
      prompt: "What is the exact output?",
      code: `n_list = [1, 2, 3, 4, 5, 6, 7]
print(n_list[1:3])
print(n_list[3:])`,
      answer: "[2, 3]\n[4, 5, 6, 7]",
      explain: "Slicing includes start and excludes stop. Omitting stop means 'to the end'.",
      difficulty: 2,
    },
    {
      id: "t9-q6",
      kind: "predict",
      prompt: "What is the exact output?",
      code: `a = [1, 2]
a.append([3, 4])
print(a)`,
      answer: "[1, 2, [3, 4]]",
      explain: "append adds its argument as ONE item, so the inner list becomes a single nested element. extend would have given [1, 2, 3, 4].",
      difficulty: 3,
    },
    {
      id: "t9-q7",
      kind: "fill",
      prompt: "Add 100 at index 3 of the list, then add 99 at the very end.",
      template: `n_list = [1, 2, 3, 4]
n_list.___(3, 100)
n_list.___(99)`,
      blanks: [["insert"], ["append"]],
      explain: "insert(position, value) places an item at a chosen index; append(value) always adds to the end.",
      difficulty: 2,
    },
    {
      id: "t9-q8",
      kind: "code",
      prompt: "Practice 1. Combine the two lists into one and print the combined list.",
      starter: `lst_1 = [1, 2, 3]
lst_2 = [4, 5, 6]
# your code
`,
      expected: "[1, 2, 3, 4, 5, 6]",
      solution: `lst_1 = [1, 2, 3]
lst_2 = [4, 5, 6]
combined = lst_1 + lst_2
print(combined)`,
      explain: "The + operator joins two lists into a new one. lst_1.extend(lst_2) achieves the same result by modifying lst_1.",
      difficulty: 2,
    },
    {
      id: "t9-q9",
      kind: "code",
      prompt:
        "Practice 2. Create an empty list, prompt the user to enter a number, store the entered number in the list, and print the list. The test enters 7.",
      starter: "",
      stdin: ["7"],
      expected: "Enter a number: [7]",
      solution: `my_list = []
num = int(input("Enter a number: "))
my_list.append(num)
print(my_list)`,
      explain: "[] creates an empty list, int() converts the typed text to a number, and append() puts it in.",
      difficulty: 3,
    },
  ],
};
