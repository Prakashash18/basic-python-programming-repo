"use client";

import { motion } from "motion/react";
import type { Flowchart, FlowNode, FlowEdge } from "@/lib/curriculum/types";

const DEFAULT_W = 150;
const DEFAULT_H = 64;
const STUB = 18;

function size(n: FlowNode) {
  const w = n.w ?? (n.kind === "terminal" ? 120 : DEFAULT_W);
  const h = n.h ?? (n.kind === "terminal" ? 52 : DEFAULT_H);
  return { w, h };
}

type Side = "top" | "bottom" | "left" | "right";

function anchor(n: FlowNode, side: Side): [number, number] {
  const { w, h } = size(n);
  switch (side) {
    case "top":
      return [n.x, n.y - h / 2];
    case "bottom":
      return [n.x, n.y + h / 2];
    case "left":
      return [n.x - w / 2, n.y];
    case "right":
      return [n.x + w / 2, n.y];
  }
}

function stubPoint([x, y]: [number, number], side: Side, inward: boolean): [number, number] {
  const d = inward ? -STUB : STUB;
  switch (side) {
    case "top":
      return [x, y - d];
    case "bottom":
      return [x, y + d];
    case "left":
      return [x - d, y];
    case "right":
      return [x + d, y];
  }
}

function routeEdge(edge: FlowEdge, from: FlowNode, to: FlowNode): [number, number][] {
  const fromSide: Side = edge.fromSide ?? "bottom";
  const toSide: Side = edge.toSide ?? "top";

  const a = anchor(from, fromSide);
  const b = anchor(to, toSide);
  const a1 = stubPoint(a, fromSide, false);
  const b1 = stubPoint(b, toSide, false);

  const pts: [number, number][] = [a, a1];

  if (edge.points?.length) {
    pts.push(...edge.points);
  } else {
    const exitVertical = fromSide === "top" || fromSide === "bottom";
    if (exitVertical) {
      if (Math.abs(a1[0] - b1[0]) > 1) pts.push([a1[0], b1[1]]);
    } else if (Math.abs(a1[1] - b1[1]) > 1) {
      pts.push([b1[0], a1[1]]);
    }
  }

  pts.push(b1, b);

  // Drop consecutive duplicates so the polyline stays clean
  return pts.filter((p, i) => i === 0 || p[0] !== pts[i - 1][0] || p[1] !== pts[i - 1][1]);
}

function pathFrom(pts: [number, number][], radius = 12) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[i + 1];
    const inLen = Math.hypot(cx - px, cy - py);
    const outLen = Math.hypot(nx - cx, ny - cy);
    const r = Math.min(radius, inLen / 2, outLen / 2);
    if (r < 2) {
      d += ` L ${cx} ${cy}`;
      continue;
    }
    const i1 = [cx + ((px - cx) / inLen) * r, cy + ((py - cy) / inLen) * r];
    const o1 = [cx + ((nx - cx) / outLen) * r, cy + ((ny - cy) / outLen) * r];
    d += ` L ${i1[0]} ${i1[1]} Q ${cx} ${cy} ${o1[0]} ${o1[1]}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last[0]} ${last[1]}`;
  return d;
}

function NodeShape({ node, active, visited }: { node: FlowNode; active: boolean; visited: boolean }) {
  const { w, h } = size(node);
  const x = node.x - w / 2;
  const y = node.y - h / 2;

  const stroke = active ? "#2dd4bf" : visited ? "#7c6cff" : "rgba(255,255,255,0.28)";
  const fill = active ? "rgba(45,212,191,0.18)" : visited ? "rgba(124,108,255,0.14)" : "rgba(255,255,255,0.04)";
  const sw = active ? 2.6 : 1.6;

  const common = { fill, stroke, strokeWidth: sw, vectorEffect: "non-scaling-stroke" as const };

  let shape: React.ReactNode;
  switch (node.kind) {
    case "terminal":
      shape = <rect x={x} y={y} width={w} height={h} rx={h / 2} {...common} />;
      break;
    case "io":
      shape = (
        <polygon
          points={`${x + 18},${y} ${x + w},${y} ${x + w - 18},${y + h} ${x},${y + h}`}
          {...common}
        />
      );
      break;
    case "decision":
      shape = (
        <polygon points={`${node.x},${y} ${x + w},${node.y} ${node.x},${y + h} ${x},${node.y}`} {...common} />
      );
      break;
    case "connector":
      shape = <circle cx={node.x} cy={node.y} r={Math.min(w, h) / 2} {...common} />;
      break;
    default:
      shape = <rect x={x} y={y} width={w} height={h} rx={10} {...common} />;
  }

  const lines = node.text.split("\n");

  return (
    <motion.g
      animate={active ? { scale: 1.045 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      style={{ originX: `${node.x}px`, originY: `${node.y}px` }}
    >
      {active ? (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.55, 0.15, 0.55] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {node.kind === "decision" ? (
            <polygon
              points={`${node.x},${y - 8} ${x + w + 8},${node.y} ${node.x},${y + h + 8} ${x - 8},${node.y}`}
              fill="none"
              stroke="#2dd4bf"
              strokeWidth={1.2}
            />
          ) : (
            <rect
              x={x - 7}
              y={y - 7}
              width={w + 14}
              height={h + 14}
              rx={node.kind === "terminal" ? (h + 14) / 2 : 14}
              fill="none"
              stroke="#2dd4bf"
              strokeWidth={1.2}
            />
          )}
        </motion.g>
      ) : null}
      {shape}
      <text
        x={node.x}
        y={node.y - (lines.length - 1) * 8}
        textAnchor="middle"
        dominantBaseline="middle"
        className="select-none"
        fill={active ? "#e4e8f7" : "#c3cae6"}
        fontSize={13}
        fontFamily="var(--font-sans)"
        fontWeight={active ? 600 : 500}
      >
        {lines.map((l, i) => (
          <tspan key={i} x={node.x} dy={i === 0 ? 0 : 16}>
            {l}
          </tspan>
        ))}
      </text>
    </motion.g>
  );
}

export default function FlowchartView({
  flow,
  activeNode,
  visited = [],
  className = "",
  maxHeight = 520,
}: {
  flow: Flowchart;
  activeNode?: string;
  visited?: string[];
  className?: string;
  maxHeight?: number;
}) {
  const byId = new Map(flow.nodes.map((n) => [n.id, n]));

  return (
    <div className={`w-full overflow-auto ${className}`}>
      <svg
        viewBox={`0 0 ${flow.width} ${flow.height}`}
        className="mx-auto block h-auto w-full"
        style={{ maxHeight, maxWidth: flow.width }}
        role="img"
        aria-label="Program flowchart"
      >
        <defs>
          <marker id="fc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.45)" />
          </marker>
          <marker id="fc-arrow-live" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#2dd4bf" />
          </marker>
        </defs>

        {flow.edges.map((edge, i) => {
          const from = byId.get(edge.from);
          const to = byId.get(edge.to);
          if (!from || !to) return null;
          const pts = routeEdge(edge, from, to);
          const d = pathFrom(pts);
          const live = activeNode === edge.to && visited.includes(edge.from);
          const [lx, ly] = pts[1] ?? pts[0];
          const horizontalExit = edge.fromSide === "left" || edge.fromSide === "right";

          return (
            <g key={i}>
              <path
                d={d}
                fill="none"
                stroke={live ? "#2dd4bf" : "rgba(255,255,255,0.28)"}
                strokeWidth={live ? 2.4 : 1.6}
                markerEnd={live ? "url(#fc-arrow-live)" : "url(#fc-arrow)"}
              />
              {live ? (
                <motion.path
                  d={d}
                  fill="none"
                  stroke="#5eead4"
                  strokeWidth={3}
                  strokeDasharray="10 14"
                  initial={{ strokeDashoffset: 48 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                  opacity={0.85}
                />
              ) : null}
              {edge.label ? (
                <text
                  x={horizontalExit ? lx : lx + 12}
                  y={horizontalExit ? ly - 10 : ly + 4}
                  textAnchor={horizontalExit ? "middle" : "start"}
                  fill={live ? "#5eead4" : "#98a3cd"}
                  fontSize={12}
                  fontFamily="var(--font-mono)"
                  fontWeight={600}
                >
                  {edge.label}
                </text>
              ) : null}
            </g>
          );
        })}

        {flow.nodes.map((n) => (
          <NodeShape key={n.id} node={n} active={activeNode === n.id} visited={visited.includes(n.id)} />
        ))}
      </svg>
    </div>
  );
}
