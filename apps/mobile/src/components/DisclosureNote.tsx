import { disclosureShort } from "@basecamp/shared";
import { Link } from "expo-router";
import { T } from "./T";

export function DisclosureNote() {
  return (
    <T variant="caption">
      {disclosureShort}{" "}
      <Link href="/about" style={{ textDecorationLine: "underline" }}>
        Learn more
      </Link>
    </T>
  );
}
