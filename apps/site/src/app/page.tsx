import { Hero } from "@/components/landing/hero/Hero";

// hondo.wiki landing page. Matches Figma `400 CONNECT → Landing` (221:411):
// no site navigation — the wordmark opens the page.
//
// The hero renders the workspace in "figma" mode: exported screens inside a
// live React shell. Switch to mode="live" once DocumentView is backed by real
// markdown — nothing else on this page changes.
export default function Home() {
  return (
    <main>
      <Hero mode="figma" />
    </main>
  );
}
