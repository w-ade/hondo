import { InspectHero } from "@/components/landing/inspect/InspectHero";

export const metadata = {
  title: "Inspect — Hondo experiment",
  description: "Think first. Organize later.",
};

// The previous landing: the Hondo card from brianawade.com as a full page, a
// cursor selecting its own text under a dev overlay. Kept here while the new
// landing is built out from the wordmark.
export default function InspectPage() {
  return <InspectHero />;
}
