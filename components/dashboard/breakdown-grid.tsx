import { BreakdownBars } from "@/components/analytics/breakdown-bars";
import { OVERVIEW_BREAKDOWN_CARDS } from "@/lib/analytics/link-breakdown-constants";
import type { AnalyticsBreakdownItem, AnalyticsBreakdownKey } from "@/lib/analytics/types";
import { cn } from "@/lib/utils";

interface BreakdownGridProps {
  breakdowns: Record<AnalyticsBreakdownKey, AnalyticsBreakdownItem[]>;
  className?: string;
}

export function BreakdownGrid({ breakdowns, className }: BreakdownGridProps) {
  return (
    <div
      className={cn(
        "grid gap-px bg-foreground/10 border border-foreground/10 grid-cols-1 md:grid-cols-2",
        className,
      )}
    >
      {OVERVIEW_BREAKDOWN_CARDS.map((card) => {
        const Icon = card.icon;
        const items = breakdowns[card.key as AnalyticsBreakdownKey] ?? [];

        return (
          <div key={card.key} className="bg-background p-6 lg:p-8">
            <div className="mb-4 flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-display text-lg">{card.label}</h3>
              <span className="ml-auto text-[10px] font-mono text-muted-foreground">
                {items.length} groups
              </span>
            </div>
            {items.length > 0 ? (
              <BreakdownBars items={items} />
            ) : (
              <p className="text-sm text-muted-foreground">No data in this period.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
