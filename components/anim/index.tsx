"use client";

import type { AnimKey } from "@/lib/curriculum/types";
import { PrintFlow, EscapeChars, PrintArgs, CommentStrip } from "./basics";
import { LiteralSorter, NumberBases, VariableBoxes, InputFlow } from "./data";
import { Precedence, ComparisonLab, LogicLab, IdentityMemory, MembershipScan } from "./operators";
import { ListIndex, ListSlice, ListOps, RangeBuilder } from "./lists";
import { CallStack, FlowSymbols } from "./functions";

/* eslint-disable @typescript-eslint/no-explicit-any */
const REGISTRY: Record<AnimKey, (props: any) => React.ReactElement> = {
  "print-flow": PrintFlow,
  "escape-chars": EscapeChars,
  "print-args": PrintArgs,
  "comment-strip": CommentStrip,
  "literal-sorter": LiteralSorter,
  "number-bases": NumberBases,
  "variable-boxes": VariableBoxes,
  "input-flow": InputFlow,
  precedence: Precedence,
  "comparison-lab": ComparisonLab,
  "logic-lab": LogicLab,
  "identity-memory": IdentityMemory,
  "membership-scan": MembershipScan,
  "list-index": ListIndex,
  "list-slice": ListSlice,
  "list-ops": ListOps,
  "range-builder": RangeBuilder,
  "call-stack": CallStack,
  "flow-symbols": FlowSymbols,
};

export default function Animation({ anim, props = {} }: { anim: AnimKey; props?: Record<string, unknown> }) {
  const Component = REGISTRY[anim];
  if (!Component) {
    return (
      <div className="rounded-2xl border border-rose-ember/40 bg-rose-ember/10 px-4 py-3 text-ink-200">
        Missing animation: {anim}
      </div>
    );
  }
  return <Component {...props} />;
}
