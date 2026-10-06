import { createInertiaApp } from "@inertiajs/react";
import { site } from "@basecamp/shared";
import SiteLayout from "@/layouts/SiteLayout";

void createInertiaApp({
  title: (title) => (title ? `${title} | ${site.name}` : `${site.name} | ${site.tagline}`),
  layout: () => SiteLayout,
  strictMode: true,
  progress: {
    color: "#c8642a",
  },
});
