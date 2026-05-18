"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LinkDetailView } from "@/components/dashboard/link-detail-view";
import { DashboardError, DashboardLoading } from "@/components/dashboard/dashboard-states";
import { getMockUrlAnalytics } from "@/lib/analytics/mock-service";
import type { AnalyticsPeriod, AnalyticsUrlDetail } from "@/lib/analytics/types";

export default function LinkAnalyticsPage() {
  const params = useParams<{ shortCode: string }>();
  const shortCode = decodeURIComponent(params.shortCode ?? "");

  const [period, setPeriod] = useState<AnalyticsPeriod>("7d");
  const [data, setData] = useState<AnalyticsUrlDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    if (!shortCode) return;
    setLoading(true);
    setError(null);
    try {
      const detail = await getMockUrlAnalytics(shortCode, period);
      setData(detail);
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load link analytics.",
      );
    } finally {
      setLoading(false);
    }
  }, [shortCode, period]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <DashboardShell
      title={shortCode || "Link"}
      subtitle={data?.url.originalUrl ?? "Sample link analytics"}
      period={period}
      onPeriodChange={setPeriod}
      onRefresh={load}
      refreshing={loading}
      lastUpdated={lastUpdated}
    >
      {error ? (
        <DashboardError message={error} onRetry={load} />
      ) : loading && !data ? (
        <DashboardLoading label="Loading link analytics…" />
      ) : data ? (
        <LinkDetailView data={data} period={period} />
      ) : null}
    </DashboardShell>
  );
}
