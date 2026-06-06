"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { DashboardShell, type DashboardTab } from "@/components/dashboard/dashboard-shell";
import { DashboardError, DashboardLoading } from "@/components/dashboard/dashboard-states";
import { useDashboardData } from "@/features/dashboard";
import type { AnalyticsPeriod } from "@/lib/analytics/types";

// Lazy load heavy dashboard components
const DashboardOverview = dynamic(() => import("@/components/dashboard/dashboard-overview").then(mod => ({ default: mod.DashboardOverview })), { ssr: true });
const LinksTablePanel = dynamic(() => import("@/components/dashboard/links-table-panel").then(mod => ({ default: mod.LinksTablePanel })), { ssr: true });
const LiveClicksFeed = dynamic(() => import("@/components/dashboard/live-clicks-feed").then(mod => ({ default: mod.LiveClicksFeed })), { ssr: true });
const LinkComparisonPanel = dynamic(() => import("@/components/dashboard/link-comparison-panel").then(mod => ({ default: mod.LinkComparisonPanel })), { ssr: true });

function parseTab(value: string | null): DashboardTab {
  if (value === "links" || value === "compare" || value === "live") return value;
  return "overview";
}

function DashboardPageContent() {
  const searchParams = useSearchParams();
  const tab = parseTab(searchParams.get("tab"));

  const [period, setPeriod] = useState<AnalyticsPeriod>("7d");
  const [linksPage, setLinksPage] = useState(1);
  const [linksSort, setLinksSort] = useState<"clicks" | "createdAt">("clicks");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const {
    overview,
    recentClicks,
    linksTable,
    liveClicks,
    comparison,
    compareCodes,
    availableCompareCodes,
    loading,
    linksLoading,
    error,
    lastUpdated,
    loadLinksTable,
    loadComparison,
    refresh,
    setCompareCodes: setCompareCodesFromHook,
  } = useDashboardData(tab, period);

  // Load links table when page/sort changes
  useEffect(() => {
    if (tab !== "links") return;
    loadLinksTable(linksPage, linksSort).catch((err) =>
      console.error("Failed to load links:", err),
    );
  }, [tab, linksPage, linksSort, loadLinksTable]);

  // Auto-refresh live feed - only when visible
  useEffect(() => {
    if (tab !== "live" || !autoRefresh) return;
    
    // Check if page is visible before refreshing
    const refreshIfVisible = () => {
      if (document.visibilityState === 'visible') {
        refresh().catch(() => undefined);
      }
    };
    
    const id = setInterval(refreshIfVisible, 60_000);
    
    // Also refresh when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && autoRefresh) {
        refresh().catch(() => undefined);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [tab, autoRefresh, refresh]);

  return (
    <DashboardShell
      title="Analytics dashboard"
      subtitle="Real-time analytics from your backend"
      period={period}
      onPeriodChange={setPeriod}
      onRefresh={refresh}
      refreshing={loading || linksLoading}
      lastUpdated={lastUpdated}
      activeTab={tab}
    >
      {error ? (
        <DashboardError message={error} onRetry={refresh} />
      ) : loading && tab === "overview" && !overview ? (
        <DashboardLoading />
      ) : tab === "overview" && overview ? (
        <DashboardOverview
          data={overview}
          recentClicks={recentClicks}
          period={period}
        />
      ) : tab === "links" ? (
        linksTable ? (
          <LinksTablePanel
            table={linksTable}
            sort={linksSort}
            onSortChange={(sort) => {
              setLinksSort(sort);
              setLinksPage(1);
            }}
            onPageChange={setLinksPage}
            loading={linksLoading}
          />
        ) : (
          <DashboardLoading label="Loading links…" />
        )
      ) : tab === "compare" ? (
        comparison.length > 0 ? (
          <LinkComparisonPanel
            entries={comparison}
            period={period}
            availableCodes={availableCompareCodes}
            selectedCodes={compareCodes}
            onSelectionChange={(codes) => {
              setCompareCodesFromHook(codes);
              loadComparison(codes).catch(() => undefined);
            }}
            recalcKey={`${period}-${compareCodes.join(",")}`}
          />
        ) : (
          <DashboardLoading label="Calculating comparison…" />
        )
      ) : liveClicks.length > 0 || !loading ? (
        <LiveClicksFeed
          clicks={liveClicks}
          autoRefresh={autoRefresh}
          onToggleAutoRefresh={() => setAutoRefresh((v) => !v)}
        />
      ) : (
        <DashboardLoading label="Loading live feed…" />
      )}
    </DashboardShell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardPageContent />
    </Suspense>
  );
}
