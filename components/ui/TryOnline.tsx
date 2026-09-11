"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, Check, Copy } from "lucide-react";

export const ONLINE_GDB_URL = "https://www.onlinegdb.com/online_python_compiler";

/**
 * OnlineGDB has no URL parameter for pre-filling the editor, so the snippet
 * cannot travel in the link. The next best thing is to put it on the clipboard
 * and open the compiler, leaving the student one paste away from running it.
 */
async function copy(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path below */
  }

  // Fallback for insecure contexts and browsers that block the async API.
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export default function TryOnline({
  code,
  variant = "chip",
  className = "",
}: {
  /** Passed as a function when the snippet can change, e.g. a live editor */
  code: string | (() => string);
  variant?: "chip" | "button";
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const launch = useCallback(async () => {
    const text = typeof code === "function" ? code() : code;
    const ok = await copy(text);
    setState(ok ? "copied" : "manual");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 6000);
    window.open(ONLINE_GDB_URL, "_blank", "noopener,noreferrer");
  }, [code]);

  const label =
    state === "copied" ? "Copied — paste it in" : state === "manual" ? "Opened — copy it over" : "Try it on OnlineGDB";

  const Icon = state === "copied" ? Check : state === "manual" ? Copy : ExternalLink;

  if (variant === "button") {
    return (
      <button
        onClick={launch}
        title="Copies this code and opens the OnlineGDB Python compiler in a new tab"
        className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[0.85em] font-semibold transition ${
          state === "copied"
            ? "border-mint-500/50 bg-mint-500/20 text-mint-400"
            : "border-sun-500/40 bg-sun-500/12 text-sun-400 hover:bg-sun-500/22"
        } ${className}`}
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={launch}
      title="Copies this code and opens the OnlineGDB Python compiler in a new tab"
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[0.72em] font-medium transition ${
        state === "copied"
          ? "border-mint-500/50 bg-mint-500/15 text-mint-400"
          : "border-white/12 bg-white/5 text-ink-300 hover:border-sun-500/45 hover:bg-sun-500/12 hover:text-sun-400"
      } ${className}`}
    >
      <Icon className="h-3 w-3" />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}
