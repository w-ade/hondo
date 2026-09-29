import { Hero } from "@/components/landing/hero/Hero";

export const metadata = {
  title: "Workspace — Hondo experiment",
  description: "Think first. Organize later.",
};

// The previous landing hero (Figma `400 CONNECT → Landing`, 221:411), kept
// here while the new landing is built around the inspect interaction.
export default function WorkspacePage() {
  return (
    <main>
      <Hero mode="figma" />
    </main>
  );
}
