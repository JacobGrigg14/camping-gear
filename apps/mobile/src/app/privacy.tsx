import { privacyPolicy } from "@basecamp/shared";
import { LegalScreen } from "@/components/LegalScreen";

export default function PrivacyScreen() {
  return <LegalScreen doc={privacyPolicy} />;
}
