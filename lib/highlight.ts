/**
 * A small Python tokenizer, good enough for teaching slides.
 * Returns spans so the renderer stays a pure function of the source text.
 */

export type Tok = { t: string; c: TokClass };
export type TokClass =
  | "kw"
  | "builtin"
  | "str"
  | "num"
  | "com"
  | "op"
  | "fn"
  | "self"
  | "plain";

const KEYWORDS = new Set([
  "False", "None", "True", "and", "as", "assert", "async", "await", "break",
  "class", "continue", "def", "del", "elif", "else", "except", "finally",
  "for", "from", "global", "if", "import", "in", "is", "lambda", "nonlocal",
  "not", "or", "pass", "raise", "return", "try", "while", "with", "yield",
]);

const BUILTINS = new Set([
  "print", "input", "len", "range", "int", "float", "str", "bool", "list",
  "dict", "tuple", "set", "type", "abs", "sum", "min", "max", "round",
  "sorted", "reversed", "enumerate", "zip", "open", "format",
]);

const OPS = "+-*/%=<>!&|^~:,.()[]{}";

export function tokenizePython(line: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  const push = (t: string, c: TokClass) => {
    if (!t) return;
    const last = out[out.length - 1];
    if (last && last.c === c) last.t += t;
    else out.push({ t, c });
  };

  while (i < line.length) {
    const ch = line[i];

    // Comment runs to end of line
    if (ch === "#") {
      push(line.slice(i), "com");
      break;
    }

    // Triple-quoted fragments and normal strings
    if (ch === '"' || ch === "'") {
      const triple = line.slice(i, i + 3);
      if (triple === '"""' || triple === "'''") {
        const end = line.indexOf(triple, i + 3);
        if (end === -1) {
          push(line.slice(i), "str");
          break;
        }
        push(line.slice(i, end + 3), "str");
        i = end + 3;
        continue;
      }
      let j = i + 1;
      while (j < line.length) {
        if (line[j] === "\\") {
          j += 2;
          continue;
        }
        if (line[j] === ch) {
          j++;
          break;
        }
        j++;
      }
      push(line.slice(i, j), "str");
      i = j;
      continue;
    }

    // Numbers, including 0x / 0b / 0o prefixes, floats and e-notation
    if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(line[i + 1] ?? ""))) {
      let j = i;
      if (ch === "0" && /[xXbBoO]/.test(line[i + 1] ?? "")) {
        j = i + 2;
        while (j < line.length && /[0-9a-fA-F_]/.test(line[j])) j++;
      } else {
        while (j < line.length && /[0-9._]/.test(line[j])) j++;
        if (/[eE]/.test(line[j] ?? "")) {
          j++;
          if (/[+-]/.test(line[j] ?? "")) j++;
          while (j < line.length && /[0-9]/.test(line[j])) j++;
        }
      }
      push(line.slice(i, j), "num");
      i = j;
      continue;
    }

    // Identifiers
    if (/[A-Za-z_]/.test(ch)) {
      let j = i;
      while (j < line.length && /[A-Za-z0-9_]/.test(line[j])) j++;
      const word = line.slice(i, j);
      const isCall = line[j] === "(";
      if (KEYWORDS.has(word)) push(word, "kw");
      else if (BUILTINS.has(word)) push(word, "builtin");
      else if (word === "self") push(word, "self");
      else if (isCall) push(word, "fn");
      else push(word, "plain");
      i = j;
      continue;
    }

    if (OPS.includes(ch)) {
      push(ch, "op");
      i++;
      continue;
    }

    push(ch, "plain");
    i++;
  }

  return out;
}

export const tokenColor: Record<TokClass, string> = {
  kw: "text-[#ff7ab2]",
  builtin: "text-[#7cc6ff]",
  str: "text-[#8ee6a8]",
  num: "text-[#ffc861]",
  com: "text-ink-400 italic",
  op: "text-ink-300",
  fn: "text-[#c4b5ff]",
  self: "text-[#ff9d6b]",
  plain: "text-ink-100",
};
