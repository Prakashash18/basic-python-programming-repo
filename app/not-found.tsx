import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-sm text-rose-ember">NameError: that page is not defined</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Nothing here</h1>
      <p className="mt-2 max-w-md text-ink-400">
        The link may be out of date. Head back to the course map and pick a topic.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-2xl bg-gradient-to-r from-iris-500 to-iris-600 px-5 py-2.5 text-sm font-semibold text-white"
      >
        Back to the course
      </Link>
    </div>
  );
}
