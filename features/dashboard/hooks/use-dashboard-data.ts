import { useCallback, useEffect, useState } from "react";
import type {
  AnalyticsLinksTableResponse,
  AnalyticsOverviewData,
  AnalyticsPeriod,
  AnalyticsRecentClick,
  LinkComparisonEntry,
} from "@/lib/analytics/types";
import {
  getMockAnalyticsOverview,
  getMockLinkComparison,
  getMockLinksTable,
  getMockLiveClicks,
  getMockRecentClicks,
} from "@/lib/analytics/mock-service";

export function useDashboardData(tab: string, period: AnalyticsPeriod) {
  const [overview, setOverview] = useState<AnalyticsOverviewData | null>(null);
  const [recentClicks, setRecentClicks] = useState<AnalyticsRecentClick[]>([]);
  const [linksTable, setLinksTable] = useState<AnalyticsLinksTableResponse | null>(null);
  const [liveClicks, setLiveClicks] = useState<AnalyticsRecentClick[]>([]);
  const [comparison, setComparison] = useState<LinkComparisonEntry[]>([]);
  const [compareCodes, setCompareCodes] = useState<string[]>([]);
  const [availableCompareCodes, setAvailableCompareCodes] = useState<string[]>([]);
  
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

  const loadLinksTable = useCallback(
    async (page: number, sort: "clicks" | "createdAt") => {
      setLinksLoading(true);
      try {
        const table = await getMockLinksTable({
          page,
          limit: 20,
          sort,
        });
        setLinksTable(table);
        setLastUpdated(new Date());
      } finally {
        setLinksLoading(false);
      }
    },
    []
  );

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
    [period, compareCodes]
  );

  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      if (tab === "overview") {
        await loadOverview();
      } else if (tab === "links") {
        // Links table needs page/sort params, handled by caller
        setLoading(false);
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
  }, [tab, loadOverview, loadComparison, loadLiveFeed]);

  // Initial load
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Reload on period change for overview
  useEffect(() => {
    if (tab !== "overview") return;
    setLoading(true);
    loadOverview()
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load overview."))
      .finally(() => setLoading(false));
  }, [period, tab, loadOverview]);

  // Reload on tab change for live feed
  useEffect(() => {
    if (tab !== "live") return;
    loadLiveFeed().catch((err) =>
      setError(err instanceof Error ? err.message : "Failed to load live feed.")
    );
  }, [tab, loadLiveFeed]);

  // Reload on tab/period change for comparison
  useEffect(() => {
    if (tab !== "compare") return;
    setLoading(true);
    loadComparison()
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load comparison.")
      )
      .finally(() => setLoading(false));
  }, [tab, period, loadComparison]);

  return {
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
    setCompareCodes,
  };
}
