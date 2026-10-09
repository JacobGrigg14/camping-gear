import { termsOfUse } from "@basecamp/shared";
import { LegalPage } from "@/components/legal/LegalPage";

export default function TermsPage() {
  return <LegalPage doc={termsOfUse} canonical="/terms" />;
}
