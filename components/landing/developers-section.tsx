"use client";

import { useEffect, useState, useRef } from "react";
import { Copy, Check } from "lucide-react";

import dynamic from "next/dynamic";

import { site } from "@/lib/site";

const CodeSnippetPanel = dynamic(
  () =>
    import("@/components/landing/code-snippet-panel").then(
      (mod) => mod.CodeSnippetPanel,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[280px] animate-pulse bg-background/5" aria-hidden />
    ),
  },
);

interface DocStep {
  number: string;
  title: string;
  description: string;
  code: string;
}

const docsSteps: DocStep[] = [
  {
    number: "I",
    title: "Create a short link",
    description: "POST /api/v1/url — returns a short URL in JSON.",
    code: `const res = await fetch("${site.apiUrl}/api/v1/url", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    originalUrl: "https://example.com",
  }),
});
const { data } = await res.json();`,
  },
  {
    number: "II",
    title: "Load dashboard analytics",
    description:
      "GET /api/v1/analytics/overview — KPIs, timeline, top links, breakdowns.",
    code: `const res = await fetch(
  "${site.apiUrl}/api/v1/analytics/overview",
  { credentials: "include" }
);
const { data } = await res.json();
// data.summary, data.timeline, data.topLinks, data.breakdowns`,
  },
  {
    number: "III",
    title: "Drill into a single link",
    description:
      "GET /api/v1/analytics/links/:shortCode — per-link stats and breakdowns.",
    code: `const res = await fetch(
  "${site.apiUrl}/api/v1/analytics/links/k9Xm?period=7d",
  { credentials: "include" }
);
const { data } = await res.json();
// data.url, data.summary, data.timeline, data.breakdowns`,
  },
];

export function DevelopersSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const currentStep = docsSteps[activeStep];

  if (!currentStep) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentStep.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    // On mobile, open the code panel when a step is tapped
    setCodeOpen(true);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % docsSteps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="developers"
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-32 bg-foreground text-background overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <DeveloperPattern />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* Section header */}
        <div className="mb-10 sm:mb-14 lg:mb-24">
          <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-background/50 mb-4 sm:mb-6">
            <span className="w-6 sm:w-8 h-px bg-background/30" />
            Developer docs
          </span>
          <h2
            className={`text-3xl sm:text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            APIs built for developer velocity.
            <br />
            <span className="text-background/50">Ship links faster.</span>
          </h2>
        </div>

        {/* ── MOBILE layout: accordion-style steps ── */}
        <div className="lg:hidden space-y-0">
          {docsSteps.map((step, index) => {
            const isActive = activeStep === index;
            const isOpen = isActive && codeOpen;
            return (
              <div
                key={step.number}
                className="border-b border-background/10"
              >
                {/* Step header — always visible */}
                <button
                  type="button"
                  onClick={() => {
                    if (isActive) {
                      setCodeOpen((o) => !o);
                    } else {
                      handleStepClick(index);
                    }
                  }}
                  className={`w-full text-left py-5 sm:py-6 transition-all duration-300 ${
                    isActive ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    <span className="font-display text-2xl sm:text-3xl text-background/30 leading-none mt-1">
                      {step.number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg sm:text-xl font-display">
                          {step.title}
                        </h3>
                        {/* Chevron shows only for active step on mobile */}
                        {isActive && (
                          <span
                            className={`text-background/40 text-xs font-mono transition-transform duration-300 shrink-0 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          >
                            ▾
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-background/60 leading-relaxed mt-1">
                        {step.description}
                      </p>
                      {/* Progress bar */}
                      {isActive && (
                        <div className="mt-3 h-px bg-background/20 overflow-hidden">
                          <div
                            className="h-full bg-background w-0"
                            style={{ animation: "progress 5s linear forwards" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </button>

                {/* Inline code panel — expands on tap */}
                {isOpen && (
                  <div className="pb-5 sm:pb-6">
                    <MobileCodePanel
                      step={step}
                      copied={copied}
                      onCopy={handleCopy}
                    />
                  </div>
                )}
              </div>
            );
          })}

          {/* Mobile: View docs link */}
          <div className="pt-6">
            <a
              href={site.links.analyticsDocs}
              className="text-sm text-background/60 hover:text-background transition underline underline-offset-4"
            >
              View full API docs →
            </a>
          </div>
        </div>

        {/* ── DESKTOP layout: two-column ── */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: step list */}
          <div className="space-y-0">
            {docsSteps.map((step, index) => (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`w-full text-left py-8 border-b border-background/10 transition-all duration-500 group ${
                  activeStep === index
                    ? "opacity-100"
                    : "opacity-40 hover:opacity-70"
                }`}
              >
                <div className="flex items-start gap-6">
                  <span className="font-display text-3xl text-background/30">
                    {step.number}
                  </span>
                  <MotionStepContent
                    step={step}
                    active={activeStep === index}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Right: sticky code panel */}
          <div className="lg:sticky lg:top-32 self-start">
            <div className="border border-background/10 overflow-hidden bg-background/5">
              <div className="px-6 py-4 border-b border-background/10 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-background/20" />
                  <div className="w-3 h-3 rounded-full bg-background/20" />
                  <div className="w-3 h-3 rounded-full bg-background/20" />
                </div>
                <span className="text-xs font-mono text-background/40">
                  linky-api.js
                </span>
              </div>
              {isVisible ? (
                <CodeSnippetPanel
                  code={currentStep.code}
                  panelKey={String(activeStep)}
                />
              ) : (
                <div
                  className="min-h-[280px] animate-pulse bg-background/5"
                  aria-hidden
                />
              )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground hover:bg-background/90 transition"
              >
                {copied ? (
                  <Check className="w-4 h-4 mr-2 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copied ? "Copied" : "Copy snippet"}
              </button>

              <a
                href={site.links.analyticsDocs}
                className="text-background/70 hover:text-background transition"
              >
                View full API docs →
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  );
}

/* ─── Mobile inline code panel ─────────────────────────────── */
function MobileCodePanel({
  step,
  copied,
  onCopy,
}: {
  step: DocStep;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="border border-background/10 overflow-hidden bg-background/5">
      {/* Fake window chrome */}
      <div className="px-4 py-3 border-b border-background/10 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-background/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-background/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-background/20" />
        </div>
        <span className="text-xs font-mono text-background/40">linky-api.js</span>
      </div>

      {/* Code — horizontally scrollable on narrow screens */}
      <div className="overflow-x-auto">
        <CodeSnippetPanel code={step.code} panelKey={`mobile-${step.number}`} />
      </div>

      {/* Copy button */}
      <div className="px-4 py-3 border-t border-background/10 flex items-center justify-between">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-2 text-xs font-medium text-background/70 hover:text-background transition"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          {copied ? "Copied!" : "Copy snippet"}
        </button>
        <span className="text-xs text-background/30 font-mono">{step.number} / III</span>
      </div>
    </div>
  );
}

/* ─── Desktop step content with progress bar ───────────────── */
function MotionStepContent({
  step,
  active,
}: {
  step: DocStep;
  active: boolean;
}) {
  return (
    <div className="flex-1">
      <h3 className="text-2xl lg:text-3xl font-display mb-3 group-hover:translate-x-2 transition-transform duration-300">
        {step.title}
      </h3>
      <p className="text-background/60 leading-relaxed">{step.description}</p>
      {active && (
        <div className="mt-4 h-px bg-background/20 overflow-hidden">
          <div
            className="h-full bg-background w-0"
            style={{ animation: "progress 5s linear forwards" }}
          />
        </div>
      )}
    </div>
  );
}

/* ─── Background texture ────────────────────────────────────── */
function DeveloperPattern() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 40px,
          currentColor 40px,
          currentColor 41px
        )`,
      }}
    />
  );
}