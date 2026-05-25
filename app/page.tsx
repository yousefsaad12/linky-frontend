import dynamic from "next/dynamic";
import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";

// Lazy load heavy sections below the fold
const FeaturesSection = dynamic(() => import("@/components/landing/features-section").then(mod => ({ default: mod.FeaturesSection })), { loading: () => <div className="h-screen" /> });
const HowItWorksSection = dynamic(() => import("@/components/landing/how-it-works-section").then(mod => ({ default: mod.HowItWorksSection })), { loading: () => <div className="h-screen" /> });
const MetricsSection = dynamic(() => import("@/components/landing/metrics-section").then(mod => ({ default: mod.MetricsSection })), { loading: () => <div className="h-screen" /> });
const SecuritySection = dynamic(() => import("@/components/landing/security-section").then(mod => ({ default: mod.SecuritySection })), { loading: () => <div className="h-screen" /> });
const AnalyticsSection = dynamic(() => import("@/components/landing/analytics-section").then(mod => ({ default: mod.AnalyticsSection })), { loading: () => <div className="h-screen" /> });
const DevelopersSection = dynamic(() => import("@/components/landing/developers-section").then(mod => ({ default: mod.DevelopersSection })), { loading: () => <div className="h-screen" /> });
const PricingSection = dynamic(() => import("@/components/landing/pricing-section").then(mod => ({ default: mod.PricingSection })), { loading: () => <div className="h-screen" /> });
const CtaSection = dynamic(() => import("@/components/landing/cta-section").then(mod => ({ default: mod.CtaSection })), { loading: () => <div className="h-screen" /> });
const FooterSection = dynamic(() => import("@/components/landing/footer-section").then(mod => ({ default: mod.FooterSection })), { loading: () => <div className="h-screen" /> });

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <MetricsSection />
      <AnalyticsSection />
      <SecuritySection />
      <DevelopersSection />
      <PricingSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
