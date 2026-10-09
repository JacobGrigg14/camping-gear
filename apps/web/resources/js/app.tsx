import { createInertiaApp } from "@inertiajs/react";
import { site } from "@basecamp/shared";
import SiteLayout from "@/layouts/SiteLayout";
import { initAnalytics } from "@/lib/analytics";
import { initErrorReporting } from "@/lib/errors";

initErrorReporting();
initAnalytics();

void createInertiaApp({
  title: (title) => (title ? `${title} | ${site.name}` : `${site.name} | ${site.tagline}`),
  layout: () => SiteLayout,
  strictMode: true,
  progress: {
    color: "#c8642a",
  },
});
