import { amazonDisclosure, site } from "@basecamp/shared";
import { Seo } from "@/components/Seo";

export default function DisclosurePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Seo title="Affiliate Disclosure" canonical="/disclosure" />
      <h1 className="text-4xl font-extrabold">Affiliate Disclosure</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-bark-700">
        <p>
          {site.name} is reader-supported. Some links on this site are affiliate links. If you click one and make a
          purchase, we may earn a commission from the retailer at no additional cost to you.
        </p>
        <p>
          We participate in affiliate programs with retailers such as Amazon, MEC, Bass Pro Shops and REI.{" "}
          {amazonDisclosure}
        </p>
        <p>
          Commissions never affect our ratings or which products we recommend. Prices and availability are set by each
          retailer and can change at any time, so please check the retailer&apos;s site for current details.
        </p>
      </div>
    </article>
  );
}
