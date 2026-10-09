/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Analytics 4 measurement ID (G-XXXXXXX). Analytics stays off when unset. */
  readonly VITE_GA_MEASUREMENT_ID?: string;
  /** Sentry DSN for browser errors. Error reporting stays off when unset. */
  readonly VITE_SENTRY_DSN?: string;
}
