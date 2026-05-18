import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { AnalyticsTopLink } from "@/lib/analytics/types";
import { formatAnalyticsNumber, truncateUrl } from "@/lib/analytics/format";
import { cn } from "@/lib/utils";

interface TopLinksTableProps {
  links: AnalyticsTopLink[];
  limit?: number;
  dense?: boolean;
  showEndpoint?: boolean;
  linkBasePath?: string;
}

export function TopLinksTable({
  links,
  limit,
  dense,
  showEndpoint,
  linkBasePath,
}: TopLinksTableProps) {
  const rows = limit ? links.slice(0, limit) : links;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className={cn("font-display", dense ? "text-sm" : "text-xl")}>
          Top links
        </h3>
        {showEndpoint ? (
          <span className="text-[10px] font-mono text-muted-foreground">
            /analytics/top-links
          </span>
        ) : null}
      </div>
      <div className="overflow-x-auto">
        <table className={cn("w-full", dense ? "text-xs" : "text-sm")}>
          <thead>
            <tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground border-b border-foreground/10">
              <th className="pb-2 pr-3 font-normal">Code</th>
              <th className="pb-2 pr-3 font-normal">Destination</th>
              <th className="pb-2 pr-3 font-normal text-right">Period</th>
              <th className="pb-2 font-normal text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((link) => (
              <tr
                key={link.shortCode}
                className="border-b border-foreground/5 last:border-0"
              >
                <td
                  className={cn(
                    "pr-3 font-mono text-foreground",
                    dense ? "py-2" : "py-3.5",
                  )}
                >
                  {linkBasePath ? (
                    <Link
                      href={`${linkBasePath}/${encodeURIComponent(link.shortCode)}`}
                      className="inline-flex items-center gap-1 hover:underline underline-offset-4"
                    >
                      {link.shortCode}
                      <ExternalLink className="h-3 w-3 opacity-40" />
                    </Link>
                  ) : (
                    link.shortCode
                  )}
                </td>
                <td
                  className={cn(
                    "pr-3 text-muted-foreground max-w-[140px] truncate",
                    dense ? "py-2" : "py-3.5",
                  )}
                  title={link.originalUrl}
                >
                  {truncateUrl(link.originalUrl, dense ? 28 : 36)}
                </td>
                <td
                  className={cn(
                    "pr-3 text-right tabular-nums font-medium",
                    dense ? "py-2" : "py-3.5",
                  )}
                >
                  {formatAnalyticsNumber(link.clicks)}
                </td>
                <td
                  className={cn(
                    "text-right tabular-nums text-muted-foreground",
                    dense ? "py-2" : "py-3.5",
                  )}
                >
                  {formatAnalyticsNumber(link.totalClicks)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
