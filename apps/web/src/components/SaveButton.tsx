"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount } from "./AccountProvider";

/** Heart that saves a product to Favorites. Signed out, it sends the visitor to sign in and back. */
export function SaveButton({ productId, className = "" }: { productId: string; className?: string }) {
  const { user, favorites, lists, setSaved } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState(false);

  const inFavorites = favorites?.productIds.includes(productId) ?? false;
  const inAnyList = lists.some((l) => l.productIds.includes(productId));

  async function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!favorites) return;
    setError(false);
    try {
      await setSaved(favorites.id, productId, !inFavorites);
    } catch {
      setError(true);
    }
  }

  const label = !user ? "Sign in to save" : inFavorites ? "Remove from Favorites" : "Save to Favorites";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={inFavorites}
      aria-label={label}
      title={error ? "Couldn't save. Try again." : label}
      className={`grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm transition hover:scale-105 hover:bg-white ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M12 20.5s-7.5-4.6-9.3-9.2C1.5 8.2 3.4 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.6 0 5.5 3.7 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"
          fill={inAnyList ? "#c8642a" : "none"}
          stroke={error ? "#b91c1c" : inAnyList ? "#c8642a" : "#5c3f2c"}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
