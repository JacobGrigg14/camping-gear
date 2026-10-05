import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-4xl font-extrabold">Trail not found</h1>
      <p className="mt-3 text-bark-700">We couldn&apos;t find that page. It may have wandered off.</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md bg-ember-500 px-5 py-3 font-semibold text-white hover:bg-ember-600"
      >
        Back to basecamp
      </Link>
    </div>
  );
}
