import { Link } from "@inertiajs/react";
import { disclosureShort } from "@basecamp/shared";

export function DisclosureNote() {
  return (
    <p className="text-xs text-bark-500">
      {disclosureShort}{" "}
      <Link href="/disclosure" className="underline hover:text-ember-600">
        Learn more
      </Link>
      .
    </p>
  );
}
