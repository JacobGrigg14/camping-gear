import { router } from "@inertiajs/react";

/**
 * Google Analytics 4, loaded only after the visitor accepts the cookie banner (required in Quebec
 * under Law 25, and fine for the rest of Canada and the US). Nothing loads when
 * VITE_GA_MEASUREMENT_ID isn't set, e.g. locally.
 */
const measurementId: string | undefined = import.meta.env.VITE_GA_MEASUREMENT_ID;
const COOKIE = "analytics_consent";
/** Fired by the footer's "Cookie settings" link to reopen the banner. */
export const OPEN_SETTINGS_EVENT = "open-cookie-settings";

export type Consent = "granted" | "denied";

export const analyticsEnabled = Boolean(measurementId);

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let loaded = false;

export function readConsent(): Consent | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=(granted|denied)`));
  return (match?.[1] as Consent | undefined) ?? null;
}

export function setConsent(consent: Consent) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${consent}; Max-Age=${60 * 60 * 24 * 365}; Path=/; SameSite=Lax${secure}`;
  if (consent === "granted") {
    load();
    trackPageView();
  } else {
    window.gtag?.("consent", "update", { analytics_storage: "denied" });
    clearGaCookies();
  }
}

/** Call once in the browser. Sends a page view on every Inertia navigation, including the first page. */
export function initAnalytics() {
  if (!measurementId || typeof window === "undefined") return;
  // Inertia swaps in the new page's <title> on a short debounce after rendering, so wait a moment.
  router.on("navigate", () => setTimeout(trackPageView, 100));
  if (readConsent() === "granted") load();
}

export function trackEvent(name: string, params: Record<string, string | number> = {}) {
  if (loaded && readConsent() === "granted") window.gtag?.("event", name, params);
}

function trackPageView() {
  trackEvent("page_view", { page_location: location.href, page_title: document.title });
}

function load() {
  if (loaded || !measurementId) return;
  loaded = true;
  window.dataLayer = window.dataLayer ?? [];
  // gtag.js only accepts the `arguments` object, not an array.
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

/** Removes the _ga cookies GA set, on this host and its parent domain. */
function clearGaCookies() {
  const domains = ["", location.hostname, `.${location.hostname.split(".").slice(-2).join(".")}`];
  for (const name of document.cookie.split("; ").map((c) => c.split("=")[0])) {
    if (!name.startsWith("_ga")) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ""}`;
    }
  }
}
