"use client";

import { useEffect, useState, useRef } from "react";
import { site } from "@/lib/site";

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
    code: `const response = await fetch("/api/v1/url", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    url: "https://example.com/very-long-url"
  })
});

const data = await response.json();
console.log(data.shortUrl);`
  },
  {
    number: "II",
    title: "Load dashboard analytics",
    description:
      "GET /api/v1/analytics/overview — KPIs, timeline, top links, breakdowns.",
    code: `const response = await fetch("/api/v1/analytics/overview", {
  headers: {
    "Authorization": "Bearer YOUR_API_KEY"
  }
});

const data = await response.json();
console.log(data.totalClicks, data.activeLinks);`
  },
  {
    number: "III",
    title: "Drill into a single link",
    description:
      "GET /api/v1/analytics/links/:shortCode — per-link stats and breakdowns.",
    code: `const response = await fetch("/api/v1/analytics/links/abc123", {
  headers: {
    "Authorization": "Bearer YOUR_API_KEY"
  }
});

const data = await response.json();
console.log(data.clicksOverTime, data.countries);`
  },
];

export function DevelopersSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const currentStep = docsSteps[activeStep];

  if (!currentStep) return null;

  const handleStepClick = (index: number) => {
    setActiveStep(index);
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
            return (
              <div
                key={step.number}
                className="border-b border-background/10"
              >
                {/* Step header — always visible */}
                <button
                  type="button"
                  onClick={() => handleStepClick(index)}
                  className={`w-full text-left py-5 sm:py-6 transition-all duration-300 ${
                    isActive ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    <span className="font-display text-2xl sm:text-3xl text-background/30 leading-none mt-1">
                      {step.number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-display">
                        {step.title}
                      </h3>
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

          {/* Right: sticky content area */}
          <div className="lg:sticky lg:top-32 self-start">
            <div className="bg-background/5 border border-background/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-background/10">
                <span className="text-xs font-mono text-background/40">Example</span>
              </div>
              <div className="p-4 overflow-x-auto">
                <pre className="text-xs font-mono text-background/80 whitespace-pre leading-relaxed">
                  {currentStep.code}
                </pre>
              </div>
            </div>
            <div className="mt-6">
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