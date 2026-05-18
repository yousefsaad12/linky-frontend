"use client";

import { AnalyticsKpiGrid } from "@/components/analytics/analytics-kpi-grid";
import { ClickTimelineChart } from "@/components/analytics/click-timeline-chart";
import { RecentClicksList } from "@/components/analytics/recent-clicks-list";
import { TopLinksTable } from "@/components/analytics/top-links-table";
import { BreakdownGrid } from "@/components/dashboard/breakdown-grid";
import type {
  AnalyticsOverviewData,
  AnalyticsPeriod,
  AnalyticsRecentClick,
} from "@/lib/analytics/types";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { formatAnalyticsNumber } from "@/lib/analytics/format";

interface DashboardOverviewProps {
  data: AnalyticsOverviewData;
  recentClicks: AnalyticsRecentClick[];
  period: AnalyticsPeriod;
}

export function DashboardOverview({
  data,
  recentClicks,
  period,
}: DashboardOverviewProps) {
  const periodClicks = data.summary.clicksInPeriod;
  const avgPerDay =
    period === "24h"
      ? periodClicks
      : Math.round(periodClicks / (period === "7d" ? 7 : 30));

  return (
    <div className="space-y-px">
      <AnalyticsKpiGrid summary={data.summary} period={period} variant="full" />

      <div className="grid gap-px bg-foreground/10 border-x border-b border-foreground/10 lg:grid-cols-3">
        <div className="bg-background p-6 lg:p-8 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl">Click timeline</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {period === "24h" ? "Hourly buckets" : "Daily buckets"} · avg{" "}
                <span className="font-mono text-foreground">
                  {formatAnalyticsNumber(avgPerDay)}
                </span>
                /{period === "24h" ? "hr" : "day"}
              </p>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              {data.timeline.length} points
            </span>
          </div>
          <ClickTimelineChart
            data={data.timeline}
            height={280}
            gradientId="dashboardClickGradient"
          />
        </div>

        <div className="bg-background p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-foreground/10">
          <h2 className="font-display text-xl mb-4">Period snapshot</h2>
          <dl className="space-y-4 text-sm">
            <SnapshotRow
              label="Clicks in period"
              numericValue={data.summary.clicksInPeriod}
              delay={0}
            />
            <SnapshotRow
              label="Active links"
              numericValue={data.summary.activeLinksInPeriod}
              delay={80}
            />
            <SnapshotRow
              label="Click-through"
              value={
                data.summary.totalUrls > 0
                  ? `${((data.summary.clicksInPeriod / data.summary.totalUrls) * 100).toFixed(1)}%`
                  : "—"
              }
              hint="clicks per link (period)"
            />
            <SnapshotRow
              label="Share of all-time"
              value={
                data.summary.totalClicks > 0
                  ? `${((data.summary.clicksInPeriod / data.summary.totalClicks) * 100).toFixed(1)}%`
                  : "—"
              }
              hint="of lifetime clicks"
            />
          </dl>
        </div>
      </div>

      <BreakdownGrid breakdowns={data.breakdowns} />

      <div className="grid gap-px bg-foreground/10 border border-foreground/10 lg:grid-cols-5">
        <div className="bg-background p-6 lg:p-8 lg:col-span-3">
          <TopLinksTable
            links={data.topLinks}
            linkBasePath="/dashboard/links"
          />
        </div>
        <div className="bg-background p-6 lg:p-8 lg:col-span-2 border-t lg:border-t-0 lg:border-l border-foreground/10">
          <RecentClicksList
            clicks={recentClicks}
            linkBasePath="/dashboard/links"
          />
        </div>
      </div>
    </div>
  );
}

function SnapshotRow({
  label,
  value,
  numericValue,
  hint,
  delay = 0,
}: {
  label: string;
  value?: string;
  numericValue?: number;
  hint?: string;
  delay?: number;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-foreground/5 pb-4 last:border-0 last:pb-0">
      <dt className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd className="text-right">
        {numericValue !== undefined ? (
          <AnimatedNumber
            value={numericValue}
            delay={delay}
            className="font-display text-lg"
          />
        ) : (
          <span className="font-display text-lg tabular-nums">{value}</span>
        )}
        {hint ? (
          <p className="text-[10px] text-muted-foreground mt-0.5">{hint}</p>
        ) : null}
      </dd>
    </div>
  );
}
