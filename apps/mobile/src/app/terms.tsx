import { termsOfUse } from "@basecamp/shared";
import { LegalScreen } from "@/components/LegalScreen";

export default function TermsScreen() {
  return <LegalScreen doc={termsOfUse} />;
}
