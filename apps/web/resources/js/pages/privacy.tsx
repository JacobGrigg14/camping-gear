import { privacyPolicy } from "@basecamp/shared";
import { LegalPage } from "@/components/legal/LegalPage";

export default function PrivacyPage() {
  return <LegalPage doc={privacyPolicy} canonical="/privacy" />;
}
