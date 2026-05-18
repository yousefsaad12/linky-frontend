import Link from "next/link";
import { MousePointerClick } from "lucide-react";
import type { AnalyticsRecentClick } from "@/lib/analytics/types";
import { cn } from "@/lib/utils";

interface RecentClicksListProps {
  clicks: AnalyticsRecentClick[];
  limit?: number;
  dense?: boolean;
  showEndpoint?: boolean;
  linkBasePath?: string;
}

export function RecentClicksList({
  clicks,
  limit,
  dense,
  showEndpoint,
  linkBasePath,
}: RecentClicksListProps) {
  const rows = limit ? clicks.slice(0, limit) : clicks;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className={cn("font-display", dense ? "text-sm" : "text-xl")}>
          Recent clicks
        </h3>
        {showEndpoint ? (
          <span className="text-[10px] font-mono text-muted-foreground">
            /analytics/recent-clicks
          </span>
        ) : null}
      </div>
      <ul className="divide-y divide-foreground/5">
        {rows.map((click, i) => (
          <li
            key={`${click.shortCode}-${i}`}
            className={cn(
              "flex items-start gap-3",
              dense ? "py-2.5 first:pt-0" : "py-4 first:pt-0",
            )}
          >
            <div
              className={cn(
                "rounded-lg bg-foreground/5 shrink-0",
                dense ? "p-1.5" : "p-2 mt-0.5",
              )}
            >
              <MousePointerClick
                className={cn(
                  "text-foreground/70",
                  dense ? "w-3 h-3" : "w-4 h-4",
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {linkBasePath ? (
                  <Link
                    href={`${linkBasePath}/${encodeURIComponent(click.shortCode)}`}
                    className={cn(
                      "font-mono hover:underline underline-offset-4",
                      dense ? "text-xs" : "text-sm",
                    )}
                  >
                    {click.shortCode}
                  </Link>
                ) : (
                  <span className={cn("font-mono", dense ? "text-xs" : "text-sm")}>
                    {click.shortCode}
                  </span>
                )}
                <span className="text-[10px] text-muted-foreground">·</span>
                <span className="text-[10px] text-muted-foreground">
                  {click.timeLabel}
                </span>
              </div>
              <p
                className={cn(
                  "text-muted-foreground capitalize",
                  dense ? "mt-0.5 text-xs" : "mt-1 text-sm",
                )}
              >
                {click.deviceType} · {click.browser} · {click.region}
              </p>
              {!dense ? (
                <p className="mt-0.5 text-xs font-mono text-muted-foreground/80 truncate">
                  via {click.referrer}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
