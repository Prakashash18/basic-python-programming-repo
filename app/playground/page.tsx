import type { Metadata } from "next";
import Playground from "./Playground";

export const metadata: Metadata = {
  title: "Playground",
  description: "A scratch pad that runs real Python in the browser — no install required.",
};

export default function PlaygroundPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">Playground</h1>
        <p className="mt-2 max-w-2xl text-ink-300">
          Real CPython, compiled to WebAssembly and running inside this tab. Perfect for demonstrating a quick idea
          mid-lesson without switching to IDLE — or for students on a locked-down machine.
        </p>
      </header>
      <Playground />
    </div>
  );
}
