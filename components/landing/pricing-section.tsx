"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import AuthButton from "@/components/ui/auth-button";

const plans = [
  {
    name: "Free",
    description: "Perfect for personal projects",
    price: { monthly: 0, annual: 0 },
    features: [
      "500 short links",
      "90 days click history",
      "Device + country analytics",
      "Google sign-in",
    ],
    cta: "Get started free",
    popular: false,
    highlight: "No credit card required",
    variant: "outline" as const,
  },
  {
    name: "Pro",
    description: "For growing businesses",
    price: { monthly: 7, annual: 5 },
    features: [
      "Unlimited short links",
      "3 custom domains",
      "1 year click history",
      "City-level + device analytics",
      "API keys + scoped access",
      "Webhooks for realtime events",
      "Priority support",
    ],
    cta: "Start 14-day trial",
    popular: true,
    highlight: "Billed annually · 14-day free trial",
    variant: "solid" as const,
  },
  {
    name: "Team",
    description: "For collaborative teams",
    price: { monthly: 25, annual: 20 },
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "10+ custom domains",
      "Role-based permissions",
      "SSO / SAML",
      "99.9% uptime SLA",
      "Dedicated onboarding",
    ],
    cta: "Contact sales",
    popular: false,
    highlight: "Billed annually · Enterprise features",
    variant: "outline" as const,
  },
];

// The longest plan feature count — used to pad shorter lists
const MAX_FEATURES = Math.max(...plans.map((p) => p.features.length));

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="relative py-32 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 rounded-full text-xs font-mono text-muted-foreground mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Simple, transparent pricing
          </span>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground mb-6">
            Pricing that scales
            <br />
            <span className="text-stroke">with your success.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you're ready. No hidden fees, no surprises.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span
            className={`text-sm font-medium transition-colors ${
              !isAnnual ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Monthly
          </span>
          <button
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-16 h-8 bg-foreground/10 rounded-full p-1 transition-colors hover:bg-foreground/20"
            aria-label="Toggle billing period"
          >
            <div
              className={`w-6 h-6 bg-foreground rounded-full shadow-lg transition-transform duration-300 ${
                isAnnual ? "translate-x-8" : "translate-x-0"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium transition-colors ${
              isAnnual ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Annual
          </span>
          {isAnnual && (
            <span className="ml-2 px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-mono rounded-full">
              Save 28%
            </span>
          )}
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 max-w-6xl mx-auto border border-foreground/10 rounded-2xl overflow-hidden divide-x divide-foreground/10">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} isAnnual={isAnnual} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-20 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            All plans include core features like instant redirects, real-time
            analytics, and API access.
          </p>
          <div className="flex items-center justify-center gap-8 text-xs text-muted-foreground">
            {["Cancel anytime", "No hidden fees", "99.9% uptime"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  plan,
  isAnnual,
}: {
  plan: (typeof plans)[0];
  isAnnual: boolean;
}) {
  const price = isAnnual ? plan.price.annual : plan.price.monthly;

  // Pad features so all cards have the same number of rows
  const paddedFeatures = [
    ...plan.features,
    ...Array(MAX_FEATURES - plan.features.length).fill(null),
  ];

  return (
    <div
      className={`flex flex-col p-8 ${
        plan.popular ? "bg-foreground/5" : "bg-background"
      }`}
    >
      {/* Badge */}
      <div className="h-7 mb-4">
        {plan.popular && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono bg-foreground/10 text-foreground">
            Most popular
          </span>
        )}
      </div>

      {/* Name + description */}
      <h3 className="font-display text-2xl text-foreground">{plan.name}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-6">
        {plan.description}
      </p>

      {/* Price */}
      <div className="mb-2">
        <div className="flex items-baseline gap-1">
          <span className="font-display text-5xl text-foreground">${price}</span>
          <span className="text-muted-foreground text-sm">/month</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-6">{plan.highlight}</p>

      <hr className="border-foreground/10 mb-6" />

      {/* Features — fixed height rows so buttons always align */}
      <ul className="flex-1 space-y-0 mb-8">
        {paddedFeatures.map((feature, i) => (
          <li
            key={i}
            className="flex items-center gap-2 py-2.5 border-b border-foreground/5 last:border-0 text-sm"
          >
            {feature ? (
              <>
                <span className="w-4 h-4 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/60" />
                </span>
                <span className="text-muted-foreground">{feature}</span>
              </>
            ) : (
              <span className="invisible text-sm">—</span>
            )}
          </li>
        ))}
      </ul>

      {/* CTA — always at bottom */}
      <AuthButton
        className={`w-full py-3 flex items-center justify-center gap-2 text-sm font-medium rounded-xl transition-all group ${
          plan.variant === "solid"
            ? "bg-foreground text-background hover:bg-foreground/90"
            : "bg-transparent border border-foreground/20 text-foreground hover:bg-foreground/5"
        }`}
      >
        <>
          {plan.cta}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </>
      </AuthButton>
    </div>
  );
}