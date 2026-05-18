"use client";

import { useState } from "react";
import type {
  AnalyticsBreakdownKey,
  AnalyticsOverviewData,
  AnalyticsPeriod,
  AnalyticsRecentClick,
} from "@/lib/analytics/types";
import { AnalyticsKpiGrid } from "@/components/analytics/analytics-kpi-grid";
import { AnalyticsPeriodSelector } from "@/components/analytics/analytics-period-selector";
import { AnalyticsBreakdownPanel } from "@/components/analytics/analytics-breakdown-panel";
import { ClickTimelineChart } from "@/components/analytics/click-timeline-chart";
import { TopLinksTable } from "@/components/analytics/top-links-table";
import { RecentClicksList } from "@/components/analytics/recent-clicks-list";
import { cn } from "@/lib/utils";

export type AnalyticsDashboardVariant = "compact" | "full";

interface AnalyticsDashboardProps {
  data: AnalyticsOverviewData;
  recentClicks?: AnalyticsRecentClick[];
  variant?: AnalyticsDashboardVariant;
  period?: AnalyticsPeriod;
  onPeriodChange?: (period: AnalyticsPeriod) => void;
  showPeriodSelector?: boolean;
  showEndpointHints?: boolean;
  className?: string;
}

export function AnalyticsDashboard({
  data,
  recentClicks,
  variant = "full",
  period: controlledPeriod,
  onPeriodChange,
  showPeriodSelector = true,
  showEndpointHints = false,
  className,
}: AnalyticsDashboardProps) {
  const [internalPeriod, setInternalPeriod] = useState<AnalyticsPeriod>(
    data.period,
  );
  const period = controlledPeriod ?? internalPeriod;
  const setPeriod = onPeriodChange ?? setInternalPeriod;

  const dense = variant === "compact";
  const chartHeight = dense ? 140 : 220;
  const panelPadding = dense ? "p-4" : "p-6 lg:p-8";
  const topLinksLimit = dense ? 3 : undefined;
  const recentLimit = dense ? 2 : undefined;

  return (
    <div className={cn("space-y-px", className)}>
      {showPeriodSelector ? (
        <div
          className={cn(
            "flex justify-end",
            dense ? "mb-3" : "mb-4",
          )}
        >
          <AnalyticsPeriodSelector
            period={period}
            onChange={setPeriod}
            dense={dense}
          />
        </div>
      ) : null}

      <AnalyticsKpiGrid
        summary={data.summary}
        period={period}
        variant={variant}
      />

      <div
        className={cn(
          "grid gap-px bg-foreground/10 border-x border-b border-foreground/10",
          dense ? "grid-cols-1 lg:grid-cols-5" : "grid-cols-1 lg:grid-cols-3",
        )}
      >
        <div
          className={cn(
            "bg-background border-foreground/10",
            panelPadding,
            dense ? "lg:col-span-3" : "lg:col-span-2",
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className={cn("font-display", dense ? "text-sm" : "text-xl")}>
              Click timeline
            </h3>
            <span className="text-[10px] font-mono text-muted-foreground">
              {period === "24h" ? "hourly" : "daily"}
            </span>
          </div>
          <ClickTimelineChart
            data={data.timeline}
            height={chartHeight}
            gradientId={dense ? "clickGradientCompact" : "clickGradient"}
          />
        </div>

        <div className={cn("bg-background", panelPadding, dense && "lg:col-span-2")}>
          <AnalyticsBreakdownPanel breakdowns={data.breakdowns} dense={dense} />
        </div>
      </div>

      {(recentClicks?.length ?? 0) > 0 || data.topLinks.length > 0 ? (
        <div
          className={cn(
            "grid gap-px bg-foreground/10 border border-foreground/10",
            dense ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2",
          )}
        >
          <div className={cn("bg-background", panelPadding)}>
            <TopLinksTable
              links={data.topLinks}
              limit={topLinksLimit}
              dense={dense}
              showEndpoint={showEndpointHints}
            />
          </div>

          {recentClicks && recentClicks.length > 0 ? (
            <div className={cn("bg-background", panelPadding)}>
              <RecentClicksList
                clicks={recentClicks}
                limit={recentLimit}
                dense={dense}
                showEndpoint={showEndpointHints}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
