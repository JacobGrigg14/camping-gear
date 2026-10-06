import { Link } from "@inertiajs/react";
import { Seo } from "@/components/Seo";

/** 404 and other error pages (see bootstrap/app.php). */
export default function ErrorPage({ status }: { status: number }) {
  const notFound = status === 404;
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <Seo title={notFound ? "Trail not found" : "Something went wrong"} noindex />
      <h1 className="text-4xl font-extrabold">{notFound ? "Trail not found" : "Something went wrong"}</h1>
      <p className="mt-3 text-bark-700">
        {notFound
          ? "We couldn't find that page. It may have wandered off."
          : "We hit a snag on our end. Please try again in a moment."}
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md bg-ember-500 px-5 py-3 font-semibold text-white hover:bg-ember-600"
      >
        Back to basecamp
      </Link>
    </div>
  );
}
