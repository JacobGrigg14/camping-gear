import { amazonDisclosure, site } from "./site";

/** A legal page as plain sections, rendered by both the website and the app. */
export type LegalDoc = {
  title: string;
  /** Shown as "Last updated …". Change it whenever the text changes. */
  updated: string;
  sections: { heading: string; paragraphs: string[] }[];
};

/**
 * Starting draft written for a US/Canadian audience (PIPEDA, Quebec Law 25, CCPA basics).
 * Have a lawyer or a policy service review it before launch.
 */
export const privacyPolicy: LegalDoc = {
  title: "Privacy Policy",
  updated: "October 8, 2026",
  sections: [
    {
      heading: "Who we are",
      paragraphs: [
        `${site.name} ("we", "us") publishes camping gear recommendations on our website and in our mobile app. This policy explains what personal information we collect, why, and the choices you have. Questions go to ${site.contactEmail}.`,
      ],
    },
    {
      heading: "What we collect",
      paragraphs: [
        "Account details: if you create an account, we store your email address and a securely hashed password. If you sign in with Apple or Google, we receive your email address and an account identifier from them. We never see your Apple or Google password.",
        "Things you save: the gear lists and trip checklists you create, so they show up on both the website and the app.",
        "Usage data: with your consent, Google Analytics records how the website is used (pages viewed, approximate location, device and browser type). We also count clicks on retailer links (which product, which retailer, and whether it came from the website or the app) without storing who clicked.",
        "Technical data: our servers keep short-lived logs (such as IP address and browser) to keep the service secure and working.",
      ],
    },
    {
      heading: "How we use it",
      paragraphs: [
        "To run your account and sync your lists and trips, to send account emails such as password resets, to understand which pages and products are useful so we can improve them, and to protect the service against abuse. We don't sell your personal information and we don't use it for targeted advertising.",
      ],
    },
    {
      heading: "Cookies and analytics",
      paragraphs: [
        "We use essential cookies to keep you signed in and to secure forms. Google Analytics cookies are only set if you choose Accept in our cookie banner; you can change your choice at any time from the Cookie settings link at the bottom of every page.",
        "The app doesn't use advertising identifiers or third-party analytics.",
      ],
    },
    {
      heading: "Affiliate links",
      paragraphs: [
        `Some links to retailers are affiliate links. When you follow one, the retailer (for example Amazon, MEC, Bass Pro Shops or REI) may set its own cookies to credit us with the sale. Those cookies are governed by the retailer's privacy policy. ${amazonDisclosure}`,
      ],
    },
    {
      heading: "Who we share it with",
      paragraphs: [
        "Service providers that help us run the service, under contracts that limit how they use your data: our hosting provider, our email delivery provider, Google (analytics, and sign-in if you choose it) and Apple (sign-in if you choose it). Some of these providers store data outside your province or country, including in the United States. We may also disclose information if the law requires it.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "We keep your account and saved lists until you delete your account. Deleting your account (from the Account page on the website or in the app) permanently removes your account, lists and trips. Server logs are kept for a short period, and analytics data is kept for up to 14 months.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        `Depending on where you live (including under Canada's PIPEDA, Quebec's Law 25 and California's CCPA), you can ask to access, correct or delete your personal information, withdraw consent, or ask how it's handled. Email ${site.contactEmail} and we'll respond within 30 days. If you're not satisfied with our answer, you can contact your local privacy regulator, such as the Office of the Privacy Commissioner of Canada.`,
      ],
    },
    {
      heading: "Children",
      paragraphs: [
        "The service isn't directed to children under 13 and we don't knowingly collect their personal information. If you believe a child has created an account, contact us and we'll delete it.",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "If we change this policy we'll update the date above, and for significant changes we'll let account holders know by email or in the app.",
      ],
    },
  ],
};

/** Starting draft. Have a lawyer or a policy service review it before launch. */
export const termsOfUse: LegalDoc = {
  title: "Terms of Use",
  updated: "October 8, 2026",
  sections: [
    {
      heading: "Using the service",
      paragraphs: [
        `By using the ${site.name} website or app you agree to these terms. If you don't agree, please don't use the service.`,
      ],
    },
    {
      heading: "Recommendations, not guarantees",
      paragraphs: [
        "Our reviews, ratings and checklists are opinions, provided for general information. Outdoor activities carry real risks. Check gear, conditions and safety guidance for yourself, and follow the manufacturer's instructions.",
        "We don't sell products. Purchases happen on retailers' sites under their terms, and prices, availability and specifications are set by the retailer and can change at any time.",
      ],
    },
    {
      heading: "Affiliate links",
      paragraphs: [
        `Some links are affiliate links, which means we may earn a commission when you buy through them, at no extra cost to you. ${amazonDisclosure} See our Affiliate Disclosure for details.`,
      ],
    },
    {
      heading: "Your account",
      paragraphs: [
        "You're responsible for keeping your sign-in details secure and for what happens under your account. Don't misuse the service: no attempts to break, overload or scrape it, and no unlawful use. We may suspend accounts that do. You can delete your account at any time from the Account page.",
      ],
    },
    {
      heading: "Our content",
      paragraphs: [
        "The text, photos and design of the service belong to us or our licensors. You're welcome to share links to it, but don't copy or republish our content without permission.",
      ],
    },
    {
      heading: "Liability",
      paragraphs: [
        "The service is provided \"as is\" without warranties of any kind. To the extent the law allows, we aren't liable for indirect or consequential losses, or for products bought from retailers. Nothing in these terms limits rights you have under consumer protection laws that can't be waived.",
      ],
    },
    {
      heading: "Changes and contact",
      paragraphs: [
        `We may update these terms; the date above shows the latest version, and continuing to use the service means you accept the changes. Questions go to ${site.contactEmail}.`,
      ],
    },
  ],
};
