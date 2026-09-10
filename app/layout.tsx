import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { PythonPreloader } from "@/components/ui/RunnableCode";
import { BookOpen, Code2, GraduationCap, Presentation } from "lucide-react";

export const metadata: Metadata = {
  title: {
    default: "Basic Python Programming — Teach & Practice",
    template: "%s · Basic Python Programming",
  },
  description:
    "An animated, concept-by-concept teaching platform for Basic Python Programming. Twelve topics, step-by-step execution traces, live flowcharts and runnable practice questions.",
  keywords: ["Python", "teaching", "flowchart", "loops", "functions", "beginner programming"],
  openGraph: {
    title: "Basic Python Programming — Teach & Practice",
    description:
      "Animated, concept-by-concept lessons and runnable practice for a twelve-topic introductory Python module.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#070a16",
  width: "device-width",
  initialScale: 1,
};

const NAV = [
  { href: "/", label: "Course", Icon: BookOpen },
  { href: "/teach", label: "Teacher guide", Icon: Presentation },
  { href: "/practice", label: "Practice", Icon: GraduationCap },
  { href: "/playground", label: "Playground", Icon: Code2 },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        <PythonPreloader />

        <header className="sticky top-0 z-40 border-b border-white/8 bg-ink-950/80 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6">
            <Link href="/" className="group flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-iris-500 to-mint-500 font-mono text-base font-bold text-ink-950">
                Py
              </span>
              <span className="hidden leading-tight sm:block">
                <span className="block text-sm font-semibold text-white">Basic Python Programming</span>
                <span className="block text-[11px] text-ink-400">Teach it. Practise it.</span>
              </span>
            </Link>

            <div className="ml-auto flex items-center gap-1">
              {NAV.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-ink-300 transition hover:bg-white/6 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10">{children}</main>

        <footer className="mt-16 border-t border-white/8 py-8">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 text-xs text-ink-500 sm:px-6">
            <span>Basic Python Programming — 12 topics, built for classroom teaching and self-study practice.</span>
            <span>Python runs in your browser. Nothing you write leaves this device.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
