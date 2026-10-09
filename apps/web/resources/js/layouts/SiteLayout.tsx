import { AccountProvider } from "@/components/AccountProvider";
import { ConsentBanner } from "@/components/ConsentBanner";
import { ContactModal } from "@/components/ContactModal";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AccountProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ConsentBanner />
      <ContactModal />
    </AccountProvider>
  );
}
