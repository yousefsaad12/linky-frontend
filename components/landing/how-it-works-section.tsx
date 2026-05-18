"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "I",
    title: "Create a short link",
    description:
      "Sign in, paste the page URL, and get a link that’s easy to share.",
  },
  {
    number: "II",
    title: "Share it anywhere",
    description:
      "Give the short link to people and they'll land on your page right away.",
  },
  {
    number: "III",
    title: "Check the clicks",
    description:
      "See how many people clicked your link and where they came from.",
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-foreground text-background overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <MotionDiagonalPatternInner />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-16 lg:mb-24">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-background/50 mb-6">
            <span className="w-8 h-px bg-background/30" />
            How it works
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Three steps.
            <br />
            <span className="text-background/50">Full click visibility.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="space-y-0">
            {steps.map((step, index) => (
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

          <div className="lg:sticky lg:top-32 self-start">
            <div className="border border-background/10 overflow-hidden bg-background/5">
              <div className="px-6 py-4 border-b border-background/10 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-background/20" />
                  <div className="w-3 h-3 rounded-full bg-background/20" />
                  <MotionWindowDot />
                </div>
                <span className="text-xs font-mono text-background/40">
                  url.sh
                </span>
              </div>

              <div className="p-8 min-h-[280px] flex flex-col justify-between gap-8">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-background/40 mb-3">
                    Create your short URL
                  </p>
                  <div className="grid gap-3">
                    <label className="text-sm text-background/60">
                      Long URL
                    </label>
                    <div className="flex gap-3 flex-col sm:flex-row">
                      <input
                        type="text"
                        readOnly
                        value="https://example.com/very/long-link"
                        className="min-w-0 flex-1 rounded-2xl border border-background/10 bg-foreground/5 px-4 py-3 text-sm text-background outline-none"
                      />
                      <button className="rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground hover:bg-background/90 transition">
                        Create short URL
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-background/10 bg-foreground/5 p-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-background/40 mb-3">
                    Short URL preview
                  </p>
                  <div className="rounded-2xl border border-background/10 px-4 py-3 text-sm text-background/80">
                    linky/abc123
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-background/50">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Short links ready in one click.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}

function MotionDiagonalPatternInner() {
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

function MotionStepContent({
  step,
  active,
}: {
  step: (typeof steps)[0];
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

function MotionWindowDot() {
  return <div className="w-3 h-3 rounded-full bg-background/20" />;
}
