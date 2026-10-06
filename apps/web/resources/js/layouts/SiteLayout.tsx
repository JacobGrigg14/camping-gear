import { AccountProvider } from "@/components/AccountProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AccountProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </AccountProvider>
  );
}
