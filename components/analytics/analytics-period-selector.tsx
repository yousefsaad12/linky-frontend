import { ANALYTICS_PERIODS } from "@/lib/analytics/constants";
import type { AnalyticsPeriod } from "@/lib/analytics/types";
import { cn } from "@/lib/utils";

interface AnalyticsPeriodSelectorProps {
  period: AnalyticsPeriod;
  onChange: (period: AnalyticsPeriod) => void;
  dense?: boolean;
}

export function AnalyticsPeriodSelector({
  period,
  onChange,
  dense,
}: AnalyticsPeriodSelectorProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-0.5 p-0.5 rounded-lg border border-foreground/10 bg-foreground/[0.02]",
        dense && "scale-95 origin-right",
      )}
    >
      {ANALYTICS_PERIODS.map((p) => (
        <button
          key={p.key}
          type="button"
          onClick={() => onChange(p.key)}
          className={cn(
            "font-mono rounded-md transition-all",
            dense ? "px-2.5 py-1 text-xs" : "px-4 py-2 text-sm",
            period === p.key
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
