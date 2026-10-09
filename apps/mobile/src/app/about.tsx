import { amazonDisclosure, site } from "@basecamp/shared";
import { ScrollView } from "react-native";
import { T } from "@/components/T";
import { space } from "@/theme";

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: space.xl, gap: space.md }}>
      <T variant="h1">About {site.name}</T>
      <T>
        {site.name} is a small team of campers, backpackers and weekend warriors who want to help you spend less time
        researching gear and more time outside. Placeholder copy. Replace with your story.
      </T>
      <T variant="h2" style={{ marginTop: space.lg }}>
        Affiliate disclosure
      </T>
      <T>
        {site.name} is reader-supported. Some links in this app are affiliate links. If you tap one and make a purchase,
        we may earn a commission from the retailer at no additional cost to you.
      </T>
      <T>
        We participate in affiliate programs with retailers such as Amazon, MEC, Bass Pro Shops and REI.{" "}
        {amazonDisclosure}
      </T>
      <T>
        Commissions never affect our ratings or which products we recommend. Prices and availability are set by each
        retailer and can change at any time.
      </T>
    </ScrollView>
  );
}
