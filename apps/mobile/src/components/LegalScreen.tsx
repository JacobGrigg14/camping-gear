import type { LegalDoc } from "@basecamp/shared";
import { ScrollView } from "react-native";
import { T } from "./T";
import { space } from "@/theme";

/** Renders a privacy policy or terms document from packages/shared. */
export function LegalScreen({ doc }: { doc: LegalDoc }) {
  return (
    <ScrollView contentContainerStyle={{ padding: space.xl, gap: space.md }}>
      <T variant="h1">{doc.title}</T>
      <T variant="caption">Last updated {doc.updated}</T>
      {doc.sections.map((section) => [
        <T key={section.heading} variant="h3" style={{ marginTop: space.md }}>
          {section.heading}
        </T>,
        ...section.paragraphs.map((p) => <T key={p}>{p}</T>),
      ])}
    </ScrollView>
  );
}
