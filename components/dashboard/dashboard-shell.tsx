"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { AnalyticsPeriodSelector } from "@/components/analytics";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import type { AnalyticsPeriod } from "@/lib/analytics/types";
import { cn } from "@/lib/utils";

export type DashboardTab = "overview" | "links" | "compare" | "live";

const TABS: { id: DashboardTab; label: string; href: string }[] = [
  { id: "overview", label: "Overview", href: "/dashboard" },
  { id: "links", label: "All links", href: "/dashboard?tab=links" },
  { id: "compare", label: "Compare", href: "/dashboard?tab=compare" },
  { id: "live", label: "Live feed", href: "/dashboard?tab=live" },
];

interface DashboardShellProps {
  title: string;
  subtitle?: string;
  period: AnalyticsPeriod;
  onPeriodChange: (period: AnalyticsPeriod) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  lastUpdated?: Date | null;
  activeTab?: DashboardTab;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function DashboardShell({
  title,
  subtitle,
  period,
  onPeriodChange,
  onRefresh,
  refreshing,
  lastUpdated,
  activeTab = "overview",
  children,
  actions,
}: DashboardShellProps) {
  const pathname = usePathname();
  const onLinkDetail = pathname.startsWith("/dashboard/links/");

  return (
    <div className="min-h-screen noise-overlay">
      <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-4 lg:px-12 lg:py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {site.name}
              </Link>
              <span className="hidden sm:block h-4 w-px bg-foreground/15" />
              <div className="min-w-0">
                <h1 className="font-display text-xl lg:text-2xl tracking-tight truncate">
                  {title}
                </h1>
                {subtitle ? (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {actions}
              {onRefresh ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full font-mono text-xs"
                  onClick={onRefresh}
                  disabled={refreshing}
                >
                  <RefreshCw
                    className={cn("h-3.5 w-3.5", refreshing && "animate-spin")}
                  />
                  Refresh
                </Button>
              ) : null}
              <AnalyticsPeriodSelector
                period={period}
                onChange={onPeriodChange}
              />
            </div>
          </div>

          {!onLinkDetail ? (
            <nav className="flex flex-wrap gap-1" aria-label="Dashboard sections">
              {TABS.map((tab) => (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-mono transition-colors",
                    activeTab === tab.id
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
                  )}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          ) : null}

          {lastUpdated ? (
            <p className="text-[10px] font-mono text-muted-foreground">
              Updated {lastUpdated.toLocaleTimeString()}
            </p>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-8 lg:px-12 lg:py-10">
        {children}
      </main>
    </div>
  );
}
