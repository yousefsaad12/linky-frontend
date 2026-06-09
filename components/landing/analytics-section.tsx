"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { AnalyticsPeriodSelector } from "@/components/analytics";
import { site } from "@/lib/site";

const AnalyticsDashboard = dynamic(
  () =>
    import("@/components/analytics/analytics-dashboard").then(
      (mod) => mod.AnalyticsDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-[420px] animate-pulse rounded-lg bg-foreground/[0.03]"
        aria-hidden
      />
    ),
  },
);
import type { AnalyticsPeriod } from "@/lib/analytics/types";
import { landingDummyOverviewData, landingDummyRecentClicks } from "@/lib/analytics/landing-dummy-data";

export function AnalyticsSection() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("7d");
  const [isVisible, setIsVisible] = useState(false);
  const [serverData, setServerData] = useState<any | null>(null);
  const [serverRecent, setServerRecent] = useState<any[] | null>(null);
  const [loadingServer, setLoadingServer] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const data = serverData ? serverData : undefined;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.08 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Use dummy data instead of API calls
    setServerData(landingDummyOverviewData);
    setServerRecent(landingDummyRecentClicks);
    setLoadingServer(false);
  }, [isVisible, period]);

  return (
    <section
      id="analytics"
      ref={sectionRef}
      className="relative py-16 lg:py-20 border-t border-foreground/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Dashboard preview
            </span>
            <h2
              className={`text-3xl lg:text-4xl font-display tracking-tight transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              Analytics your Links
              <span className="text-muted-foreground"> already returns</span>
            </h2>
            <p
              className={`mt-3 text-sm text-muted-foreground transition-all duration-700 delay-100 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              KPIs, timeline, top links, and breakdowns — same shape as{" "}
            </p>
          </div>

          <div
            className={`transition-all duration-700 delay-150 shrink-0 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <AnalyticsPeriodSelector
              period={period}
              onChange={setPeriod}
              dense
            />
          </div>
        </div>

        <div
          className={`transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {isVisible && data ? (
            <AnalyticsDashboard
              data={data}
              recentClicks={serverRecent ?? undefined}
              variant="compact"
              period={period}
              onPeriodChange={setPeriod}
              showPeriodSelector={false}
            />
          ) : isVisible && loadingServer ? (
            <div
              className="min-h-[420px] animate-pulse rounded-lg bg-foreground/[0.03]"
              aria-hidden
            />
          ) : (
            <div
              className="min-h-[420px] animate-pulse rounded-lg bg-foreground/[0.03]"
              aria-hidden
            />
          )}
        </div>

        <p
          className={`mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-muted-foreground font-mono transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <span>Sample preview data</span>
          <Link
            href={site.links.dashboard}
            className="inline-flex items-center gap-1 text-foreground hover:underline underline-offset-4"
          >
            Open full dashboard
            <ArrowRight className="h-3 w-3" />
          </Link>
        </p>
      </div>
    </section>
  );
}
