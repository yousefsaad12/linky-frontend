"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { site } from "@/lib/site";

const plans = [
  {
    name: "Free",
    description: "For personal projects and prototypes",
    price: { monthly: 0, annual: 0 },
    features: [
      "Up to 50 short links",
      "30 days of click history",
      "Google sign-in",
      "Basic per-link analytics",
      "CSV export",
    ],
    cta: "Get started",
    popular: false,
  },
  {
    name: "Pro",
    description: "Production-ready for apps and teams",
    price: { monthly: 12, annual: 10 },
    features: [
      "Unlimited short links",
      "90 days of click history",
      "API keys and scoped access",
      "Webhooks for realtime events",
      "Export CSV / JSON",
      "Priority support",
    ],
    cta: "Start free trial",
    popular: true,
  },
  {
    name: "Team",
    description: "Custom plans for teams and enterprises",
    price: { monthly: null, annual: null },
    features: [
      "Everything in Pro",
      "Team accounts and roles",
      "Custom domains",
      "Higher limits and SLAs",
      "Onboarding & support",
    ],
    cta: "Contact us",
    popular: false,
  },
];

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section
      id="pricing"
      className="relative py-32 lg:py-40 border-t border-foreground/10"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mb-20">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase block mb-6">
            Pricing
          </span>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground mb-6">
            Start free.
            <br />
            <span className="text-stroke">Scale with links.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl">
            Only pay when you want more links or longer history. Shortening
            stays easy.
          </p>
        </div>

        <div className="flex items-center gap-4 mb-16">
          <span
            className={`text-sm transition-colors ${
              !isAnnual ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Monthly
          </span>
          <button
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-14 h-7 bg-foreground/10 rounded-full p-1 transition-colors hover:bg-foreground/20"
          >
            <MotionPricingToggle isAnnual={isAnnual} />
          </button>
          <span
            className={`text-sm transition-colors ${
              isAnnual ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Annual
          </span>
          {isAnnual && (
            <span className="ml-2 px-2 py-1 bg-foreground text-primary-foreground text-xs font-mono">
              Save 17%
            </span>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-foreground/10">
          {plans.map((plan, idx) => (
            <MotionPricingCard
              key={plan.name}
              plan={plan}
              idx={idx}
              isAnnual={isAnnual}
            />
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          Some Pro & Team features are roadmap items — sign in to try core
          functionality for free.
        </p>
      </div>
    </section>
  );
}

function MotionPricingToggle({ isAnnual }: { isAnnual: boolean }) {
  return (
    <div
      className={`w-5 h-5 bg-foreground rounded-full transition-transform duration-300 ${
        isAnnual ? "translate-x-7" : "translate-x-0"
      }`}
    />
  );
}

function MotionPricingCard({
  plan,
  idx,
  isAnnual,
}: {
  plan: (typeof plans)[0];
  idx: number;
  isAnnual: boolean;
}) {
  return (
    <div
      className={`relative p-8 lg:p-12 bg-background ${
        plan.popular
          ? "md:-my-4 md:py-12 lg:py-16 border-2 border-foreground"
          : ""
      }`}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-8 px-3 py-1 bg-foreground text-primary-foreground text-xs font-mono uppercase tracking-widest">
          Most Popular
        </span>
      )}
      <div className="mb-8">
        <span className="font-mono text-xs text-muted-foreground">
          {String(idx + 1).padStart(2, "0")}
        </span>
        <h3 className="font-display text-3xl text-foreground mt-2">
          {plan.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
      </div>
      <div className="mb-8 pb-8 border-b border-foreground/10">
        {plan.price.monthly !== null ? (
          <div className="flex items-baseline gap-2">
            <span className="font-display text-5xl lg:text-6xl text-foreground">
              ${isAnnual ? plan.price.annual : plan.price.monthly}
            </span>
            <span className="text-muted-foreground">/month</span>
          </div>
        ) : (
          <span className="font-display text-4xl text-foreground">Custom</span>
        )}
      </div>
      <ul className="space-y-4 mb-10">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check className="w-4 h-4 text-foreground mt-0.5 shrink-0" />
            <span className="text-sm text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
      <a
        href={site.auth.signIn}
        className={`w-full py-4 flex items-center justify-center gap-2 text-sm font-medium transition-all group ${
          plan.popular
            ? "bg-foreground text-primary-foreground hover:bg-foreground/90"
            : "border border-foreground/20 text-foreground hover:border-foreground hover:bg-foreground/5"
        }`}
      >
        {plan.cta}
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </a>
    </div>
  );
}
