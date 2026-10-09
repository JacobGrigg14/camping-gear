import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { analyticsEnabled, OPEN_SETTINGS_EVENT, readConsent, setConsent, type Consent } from "@/lib/analytics";

/** Asks before turning on Google Analytics. Shows until the visitor chooses; the footer can reopen it. */
export function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!analyticsEnabled) return;
    // Decided in the browser only, so the server-rendered page never includes the banner.
    if (readConsent() === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
  }, []);

  if (!open) return null;

  const choose = (consent: Consent) => {
    setConsent(consent);
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-4 bottom-4 z-20 mx-auto max-w-2xl rounded-lg border border-canvas-200 bg-white p-4 shadow-xl sm:flex sm:items-center sm:gap-4"
    >
      <p className="text-sm text-bark-700">
        We&apos;d like to use Google Analytics cookies to see which pages and gear are useful. They&apos;re off unless
        you accept.{" "}
        <Link href="/privacy" className="font-semibold text-ember-600 hover:underline">
          Privacy policy
        </Link>
      </p>
      <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
        <button
          type="button"
          onClick={() => choose("denied")}
          className="rounded-md border border-bark-300 px-4 py-2 text-sm font-semibold text-bark-700 hover:bg-canvas-100"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => choose("granted")}
          className="rounded-md bg-forest-700 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-800"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
