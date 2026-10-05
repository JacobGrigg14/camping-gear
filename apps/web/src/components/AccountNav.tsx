"use client";

import Link from "next/link";
import { useAccount } from "./AccountProvider";

/** Header links: My Gear / Trips / Account when signed in, otherwise Sign in. */
export function AccountNav({ stacked = false }: { stacked?: boolean }) {
  const { ready, user } = useAccount();
  const linkClass = stacked ? "block py-1 hover:text-ember-500" : "hover:text-ember-500";

  // Same width placeholder while the session loads, to avoid a layout jump.
  if (!ready) return <span className={stacked ? "block h-7" : "inline-block w-14"} aria-hidden="true" />;

  if (!user) {
    return (
      <Link
        href="/login"
        className={
          stacked
            ? linkClass
            : "rounded-md bg-ember-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-ember-600"
        }
      >
        Sign in
      </Link>
    );
  }

  return (
    <nav aria-label="Your account" className={stacked ? "" : "flex items-center gap-4 text-sm font-medium"}>
      <Link href="/my-gear" className={linkClass}>
        My Gear
      </Link>
      <Link href="/trips" className={linkClass}>
        Trips
      </Link>
      <Link href="/account" className={linkClass}>
        Account
      </Link>
    </nav>
  );
}
