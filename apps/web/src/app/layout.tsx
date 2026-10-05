import type { Metadata } from "next";
import { Bitter, Inter } from "next/font/google";
import { AccountProvider } from "@/components/AccountProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@basecamp/shared";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const bitter = Bitter({ variable: "--font-bitter", subsets: ["latin"], weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${site.name} | ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${bitter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <AccountProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AccountProvider>
      </body>
    </html>
  );
}
