"use client";

import { useState } from "react";
import { ANALYTICS_BREAKDOWN_TABS } from "@/lib/analytics/constants";
import type {
  AnalyticsBreakdownKey,
  AnalyticsOverviewData,
} from "@/lib/analytics/types";
import { BreakdownBars } from "@/components/analytics/breakdown-bars";
import { cn } from "@/lib/utils";

interface AnalyticsBreakdownPanelProps {
  breakdowns: AnalyticsOverviewData["breakdowns"];
  dense?: boolean;
  breakdownTab?: AnalyticsBreakdownKey;
  onBreakdownTabChange?: (tab: AnalyticsBreakdownKey) => void;
}

export function AnalyticsBreakdownPanel({
  breakdowns,
  dense,
  breakdownTab: controlledTab,
  onBreakdownTabChange,
}: AnalyticsBreakdownPanelProps) {
  const [internalTab, setInternalTab] =
    useState<AnalyticsBreakdownKey>("deviceTypes");

  const tab = controlledTab ?? internalTab;
  const setTab = onBreakdownTabChange ?? setInternalTab;

  return (
    <div>
      <h3
        className={cn(
          "font-display mb-3",
          dense ? "text-sm" : "text-xl mb-4",
        )}
      >
        Breakdowns
      </h3>
      <div className={cn("flex flex-wrap gap-1", dense ? "mb-3" : "mb-6")}>
        {ANALYTICS_BREAKDOWN_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "inline-flex items-center gap-1 font-mono rounded-md transition-colors",
              dense ? "px-2 py-1 text-[10px]" : "px-2.5 py-1.5 text-xs",
              tab === t.key
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
            )}
          >
            <t.icon className={dense ? "w-2.5 h-2.5" : "w-3 h-3"} />
            {t.label}
          </button>
        ))}
      </div>
      <BreakdownBars items={breakdowns[tab]} dense={dense} />
    </div>
  );
}
