"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardShell, type DashboardTab } from "@/components/dashboard/dashboard-shell";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { LinksTablePanel } from "@/components/dashboard/links-table-panel";
import { LiveClicksFeed } from "@/components/dashboard/live-clicks-feed";
import { LinkComparisonPanel } from "@/components/dashboard/link-comparison-panel";
import { DashboardError, DashboardLoading } from "@/components/dashboard/dashboard-states";
import {
  getMockAnalyticsOverview,
  getMockLinkComparison,
  getMockLinksTable,
  getMockLiveClicks,
  getMockRecentClicks,
} from "@/lib/analytics/mock-service";
import type {
  AnalyticsLinksTableResponse,
  AnalyticsOverviewData,
  AnalyticsPeriod,
  AnalyticsRecentClick,
  LinkComparisonEntry,
} from "@/lib/analytics/types";

function parseTab(value: string | null): DashboardTab {
  if (value === "links" || value === "compare" || value === "live") return value;
  return "overview";
}

function DashboardPageContent() {
  const searchParams = useSearchParams();
  const tab = parseTab(searchParams.get("tab"));

  const [period, setPeriod] = useState<AnalyticsPeriod>("7d");
  const [overview, setOverview] = useState<AnalyticsOverviewData | null>(null);
  const [recentClicks, setRecentClicks] = useState<AnalyticsRecentClick[]>([]);
  const [linksTable, setLinksTable] = useState<AnalyticsLinksTableResponse | null>(null);
  const [linksPage, setLinksPage] = useState(1);
  const [linksSort, setLinksSort] = useState<"clicks" | "createdAt">("clicks");
  const [liveClicks, setLiveClicks] = useState<AnalyticsRecentClick[]>([]);
  const [comparison, setComparison] = useState<LinkComparisonEntry[]>([]);
  const [compareCodes, setCompareCodes] = useState<string[]>([]);
  const [availableCompareCodes, setAvailableCompareCodes] = useState<string[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const [loading, setLoading] = useState(true);
  const [linksLoading, setLinksLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadOverview = useCallback(async () => {
    const [overviewData, recent] = await Promise.all([
      getMockAnalyticsOverview(period, { topLinksLimit: 10 }),
      getMockRecentClicks({ limit: 12 }),
    ]);
    setOverview(overviewData);
    setRecentClicks(recent);
    setLastUpdated(new Date());
  }, [period]);

  const loadLinksTable = useCallback(async () => {
    setLinksLoading(true);
    try {
      const table = await getMockLinksTable({
        page: linksPage,
        limit: 20,
        sort: linksSort,
      });
      setLinksTable(table);
      setLastUpdated(new Date());
    } finally {
      setLinksLoading(false);
    }
  }, [linksPage, linksSort]);

  const loadLiveFeed = useCallback(async () => {
    const clicks = await getMockLiveClicks(30);
    setLiveClicks(clicks);
    setLastUpdated(new Date());
  }, []);

  const loadComparison = useCallback(
    async (codesOverride?: string[]) => {
      const overviewData = await getMockAnalyticsOverview(period, {
        topLinksLimit: 8,
      });
      const codes = overviewData.topLinks.map((l) => l.shortCode);
      setAvailableCompareCodes(codes);

      const selected =
        codesOverride ??
        (compareCodes.length >= 2 ? compareCodes : codes.slice(0, 3));

      if (codesOverride) {
        setCompareCodes(codesOverride);
      } else if (compareCodes.length < 2) {
        setCompareCodes(selected);
      }

      const entries = await getMockLinkComparison(period, selected);
      setComparison(entries);
      setLastUpdated(new Date());
    },
    [period, compareCodes],
  );

  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      if (tab === "overview") {
        await loadOverview();
      } else if (tab === "links") {
        await loadLinksTable();
      } else if (tab === "compare") {
        await loadComparison();
      } else {
        await loadLiveFeed();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [tab, loadOverview, loadLinksTable, loadComparison, loadLiveFeed]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (tab !== "overview") return;
    setLoading(true);
    loadOverview()
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load overview."))
      .finally(() => setLoading(false));
  }, [period, tab, loadOverview]);

  useEffect(() => {
    if (tab !== "links") return;
    loadLinksTable().catch((err) =>
      setError(err instanceof Error ? err.message : "Failed to load links."),
    );
  }, [tab, loadLinksTable]);

  useEffect(() => {
    if (tab !== "compare") return;
    setLoading(true);
    loadComparison()
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load comparison."),
      )
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload on tab/period only
  }, [tab, period]);

  useEffect(() => {
    if (tab !== "live") return;
    loadLiveFeed().catch((err) =>
      setError(err instanceof Error ? err.message : "Failed to load live feed."),
    );
  }, [tab, loadLiveFeed]);

  useEffect(() => {
    if (tab !== "live" || !autoRefresh) return;
    const id = setInterval(() => {
      loadLiveFeed().catch(() => undefined);
    }, 30_000);
    return () => clearInterval(id);
  }, [tab, autoRefresh, loadLiveFeed]);

  return (
    <DashboardShell
      title="Analytics dashboard"
      subtitle="Sample data — same shape as the live API"
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
              setCompareCodes(codes);
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
