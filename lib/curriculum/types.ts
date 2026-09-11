/**
 * Content model for the course.
 *
 * A Topic is a chapter. Each Topic is broken into Concepts (one idea at a time),
 * and each Concept is a short deck of Cards that a teacher advances one by one.
 */

export type AnimKey =
  | "print-flow"
  | "escape-chars"
  | "print-args"
  | "comment-strip"
  | "literal-sorter"
  | "number-bases"
  | "variable-boxes"
  | "input-flow"
  | "precedence"
  | "comparison-lab"
  | "logic-lab"
  | "identity-memory"
  | "membership-scan"
  | "list-index"
  | "list-slice"
  | "list-ops"
  | "range-builder"
  | "call-stack"
  | "flow-symbols";

export type Annotation = {
  /** 1-based line number in the code block */
  line: number;
  label: string;
  tone?: "iris" | "mint" | "sun" | "rose";
};

export type TraceStep = {
  /** 1-based line(s) currently executing */
  line: number | number[];
  /** Variable state *after* this line runs */
  vars?: Record<string, string>;
  /** Text appended to the console by this line */
  out?: string;
  /** Teacher-facing narration for this step */
  note?: string;
  /** Id of the flowchart node lit up during this step */
  node?: string;
};

export type FlowNode = {
  id: string;
  kind: "terminal" | "io" | "process" | "decision" | "connector";
  text: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
};

export type FlowEdge = {
  from: string;
  to: string;
  label?: string;
  /** Optional waypoints for elbow routing, in diagram coordinates */
  points?: [number, number][];
  /** Which side the edge leaves from — used for decision branches */
  fromSide?: "bottom" | "left" | "right" | "top";
  toSide?: "bottom" | "left" | "right" | "top";
};

export type Flowchart = {
  width: number;
  height: number;
  nodes: FlowNode[];
  edges: FlowEdge[];
};

export type Card =
  | {
      kind: "idea";
      title: string;
      lead?: string;
      points?: string[];
      callout?: { tone: "note" | "warn" | "tip"; text: string };
    }
  | {
      kind: "code";
      title: string;
      lead?: string;
      code: string;
      output?: string;
      annotations?: Annotation[];
      callout?: { tone: "note" | "warn" | "tip"; text: string };
      runnable?: boolean;
      /**
       * A syntax skeleton rather than a real program (placeholders such as
       * `block_of_code`). Suppresses the "run this elsewhere" launchers, which
       * would only hand the student a SyntaxError or a NameError.
       */
      template?: boolean;
    }
  | {
      kind: "anim";
      title: string;
      lead?: string;
      anim: AnimKey;
      props?: Record<string, unknown>;
    }
  | {
      kind: "trace";
      title: string;
      lead?: string;
      code: string;
      steps: TraceStep[];
      flow?: Flowchart;
    }
  | {
      kind: "flow";
      title: string;
      lead?: string;
      flow: Flowchart;
      steps?: { node: string; note: string }[];
    }
  | {
      kind: "table";
      title: string;
      lead?: string;
      headers: string[];
      rows: string[][];
      callout?: { tone: "note" | "warn" | "tip"; text: string };
    }
  | {
      kind: "compare";
      title: string;
      lead?: string;
      columns: { heading: string; code?: string; output?: string; points?: string[]; tone?: "good" | "bad" | "neutral" }[];
    }
  | {
      kind: "checkpoint";
      title: string;
      /** Ask the room. Answer stays hidden until the teacher reveals it. */
      ask: string;
      answer: string;
      hint?: string;
    };

export type Question =
  | {
      id: string;
      kind: "mcq";
      prompt: string;
      code?: string;
      choices: string[];
      answer: number;
      explain: string;
      difficulty?: 1 | 2 | 3;
    }
  | {
      id: string;
      kind: "predict";
      prompt: string;
      code: string;
      answer: string;
      explain: string;
      difficulty?: 1 | 2 | 3;
    }
  | {
      id: string;
      kind: "fill";
      prompt: string;
      /** Use ___ (three underscores) for each blank */
      template: string;
      blanks: string[][];
      explain: string;
      difficulty?: 1 | 2 | 3;
    }
  | {
      id: string;
      kind: "code";
      prompt: string;
      starter: string;
      /** Expected stdout, compared after trimming trailing whitespace per line */
      expected?: string;
      /** Optional stdin lines fed to input() */
      stdin?: string[];
      solution: string;
      explain: string;
      difficulty?: 1 | 2 | 3;
    };

export type Concept = {
  id: string;
  title: string;
  /** One-line "what students walk away with" */
  takeaway: string;
  /** Minutes of teaching time, used for the lesson plan */
  minutes: number;
  cards: Card[];
};

export type Topic = {
  num: number;
  slug: string;
  title: string;
  tagline: string;
  /** Short emoji/glyph used on the course map */
  glyph: string;
  accent: "iris" | "mint" | "sun" | "rose";
  objectives: string[];
  concepts: Concept[];
  practice: Question[];
  /** Optional longer task set from the original slides */
  assignment?: { title: string; body: string[]; solution?: string };
};
