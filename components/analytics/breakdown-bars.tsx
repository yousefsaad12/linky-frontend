import type { AnalyticsBreakdownItem } from "@/lib/analytics/types";
import { formatAnalyticsNumber } from "@/lib/analytics/format";
import { cn } from "@/lib/utils";

interface BreakdownBarsProps {
  items: AnalyticsBreakdownItem[];
  dense?: boolean;
}

export function BreakdownBars({ items, dense }: BreakdownBarsProps) {
  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <ul className={cn(dense ? "space-y-2" : "space-y-3")}>
      {items.map((item) => (
        <li key={item.name}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-mono capitalize text-foreground/80">
              {item.name}
            </span>
            <span className="text-muted-foreground tabular-nums">
              {formatAnalyticsNumber(item.count)}
            </span>
          </div>
          <div className="h-1 rounded-full bg-foreground/8 overflow-hidden">
            <div
              className="h-full rounded-full bg-foreground/70 transition-all duration-700"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
