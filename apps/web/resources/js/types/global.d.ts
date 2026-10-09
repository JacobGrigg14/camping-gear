import type { GearList } from "@basecamp/shared";

declare module "@inertiajs/core" {
  export interface InertiaConfig {
    sharedPageProps: {
      auth: { user: { id: number; name: string; email: string } | null };
      /** Header and footer navigation. */
      categories: { slug: string; name: string }[];
      /** The signed-in user's lists, so hearts on product cards know what's saved. */
      lists: GearList[];
      siteUrl: string;
      [key: string]: unknown;
    };
  }
}
