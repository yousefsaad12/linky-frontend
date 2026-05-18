"use client";

import { useState } from "react";
import { BreakdownBars } from "@/components/analytics/breakdown-bars";
import { LINK_ANALYTICS_BREAKDOWN_TABS } from "@/lib/analytics/link-breakdown-constants";
import type {
  AnalyticsBreakdownItem,
  LinkAnalyticsBreakdownKey,
} from "@/lib/analytics/types";
import { cn } from "@/lib/utils";

interface LinkBreakdownPanelProps {
  breakdowns: Record<LinkAnalyticsBreakdownKey, AnalyticsBreakdownItem[]>;
  className?: string;
}

export function LinkBreakdownPanel({ breakdowns, className }: LinkBreakdownPanelProps) {
  const [tab, setTab] = useState<LinkAnalyticsBreakdownKey>("deviceTypes");
  const items = breakdowns[tab] ?? [];

  return (
    <div className={className}>
      <h3 className="font-display text-xl mb-4">Breakdowns</h3>
      <div className="flex flex-wrap gap-1 mb-6">
        {LINK_ANALYTICS_BREAKDOWN_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "inline-flex items-center gap-1 font-mono rounded-md px-2.5 py-1.5 text-xs transition-colors",
              tab === t.key
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
            )}
          >
            <t.icon className="w-3 h-3" />
            {t.label}
          </button>
        ))}
      </div>
      {items.length > 0 ? (
        <BreakdownBars items={items} />
      ) : (
        <p className="text-sm text-muted-foreground">No data for this dimension.</p>
      )}
    </div>
  );
}
