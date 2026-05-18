"use client";

import Link from "next/link";
import { MousePointerClick, Radio } from "lucide-react";
import type { AnalyticsRecentClick } from "@/lib/analytics/types";
import { cn } from "@/lib/utils";

interface LiveClicksFeedProps {
  clicks: AnalyticsRecentClick[];
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
}

export function LiveClicksFeed({
  clicks,
  autoRefresh,
  onToggleAutoRefresh,
}: LiveClicksFeedProps) {
  return (
    <div className="space-y-px">
      <div className="flex flex-wrap items-center justify-between gap-4 border border-foreground/10 bg-background p-4 lg:p-5">
        <div>
          <h2 className="font-display text-xl flex items-center gap-2">
            <Radio className="h-4 w-4 text-green-600" />
            Live click feed
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Latest events across all your links
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleAutoRefresh}
          className={cn(
            "rounded-full px-4 py-2 text-xs font-mono border transition-colors",
            autoRefresh
              ? "bg-foreground text-background border-foreground"
              : "border-foreground/15 text-muted-foreground hover:text-foreground",
          )}
        >
          Auto-refresh {autoRefresh ? "on" : "off"}
        </button>
      </div>

      <ul className="divide-y divide-foreground/5 border border-foreground/10 bg-background">
        {clicks.length === 0 ? (
          <li className="p-12 text-center text-sm text-muted-foreground">
            Waiting for clicks…
          </li>
        ) : (
          clicks.map((click, i) => (
            <li
              key={`${click.shortCode}-${click.clickedAt ?? i}`}
              className="flex items-start gap-4 p-5 lg:p-6 hover:bg-foreground/[0.02] transition-colors"
            >
              <div className="rounded-lg bg-foreground/5 p-2 shrink-0">
                <MousePointerClick className="h-4 w-4 text-foreground/70" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/dashboard/links/${encodeURIComponent(click.shortCode)}`}
                    className="font-mono text-sm hover:underline underline-offset-4"
                  >
                    {click.shortCode}
                  </Link>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {click.timeLabel}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground capitalize">
                  {click.deviceType} · {click.browser} · {click.region}
                </p>
                <p className="mt-0.5 text-xs font-mono text-muted-foreground/80 truncate">
                  via {click.referrer}
                </p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
