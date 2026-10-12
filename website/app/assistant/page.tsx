import Link from "next/link";
import { metadata } from "@/lib/site";
import { NativeVoiceStudio } from "@/components/NativeVoiceStudio";

export const dynamic = "force-dynamic";

export const generateMetadata = () => ({
  ...metadata(
    "Property Assistant",
    "Search published Awaaz Estate listings by voice or text in English, Urdu, or Roman Urdu. Ask about buying, renting, financing, or viewings.",
    "/assistant"
  ),
  robots: { index: false, follow: true },
});

export default function AssistantPage() {
  return (
    <section className="section container voice-studio-page-root">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumbs-modern" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="bc-sep">/</span>
        <span className="bc-current">Property assistant</span>
      </nav>

      {/* Modern Studio Hero Header */}
      <div className="voice-studio-hero">
        <div className="hero-eyebrow-pill">
          <span className="hero-eyebrow-dot" aria-hidden="true" />
          <span>Real estate help, in your language</span>
        </div>
        <h1 className="voice-studio-title">
          Tell Awaaz what you&rsquo;re looking for.
        </h1>
        <p className="voice-studio-subtitle">
          Search published listings in English, Urdu, or Roman Urdu. Mention your city, area, budget in PKR, and whether you want to buy or rent. Voice starts only when you choose it.
        </p>
      </div>

      <NativeVoiceStudio />
    </section>
  );
}

