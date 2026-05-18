import { AnimatedNumber } from "@/components/ui/animated-number";
import type { AnalyticsOverviewData, AnalyticsPeriod } from "@/lib/analytics/types";
import { cn } from "@/lib/utils";

type KpiKey =
  | "totalUrls"
  | "totalClicks"
  | "clicksInPeriod"
  | "clicksToday"
  | "clicksLast7d"
  | "clicksLast30d"
  | "activeLinksInPeriod";

const KPI_DEFS: {
  key: KpiKey;
  label: string | ((period: AnalyticsPeriod) => string);
  hint?: (period: AnalyticsPeriod) => string;
}[] = [
  { key: "totalUrls", label: "Total links" },
  { key: "totalClicks", label: "Total clicks" },
  {
    key: "clicksInPeriod",
    label: (period) => `In ${period}`,
  },
  { key: "clicksToday", label: "Today" },
  { key: "clicksLast7d", label: "Last 7d" },
  { key: "clicksLast30d", label: "Last 30d" },
  {
    key: "activeLinksInPeriod",
    label: "Active links",
    hint: (period) => `in ${period}`,
  },
];

const COMPACT_KPI_KEYS: KpiKey[] = [
  "totalUrls",
  "totalClicks",
  "clicksInPeriod",
  "clicksToday",
];

interface AnalyticsKpiGridProps {
  summary: AnalyticsOverviewData["summary"];
  period: AnalyticsPeriod;
  variant?: "compact" | "full";
}

function KpiCard({
  label,
  value,
  hint,
  dense,
  index = 0,
}: {
  label: string;
  value: number;
  hint?: string;
  dense?: boolean;
  index?: number;
}) {
  return (
    <div
      className={cn(
        "border border-foreground/10 bg-background",
        dense ? "p-3" : "p-5 lg:p-6",
      )}
    >
      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </p>
      <p
        className={cn(
          "font-display tabular-nums tracking-tight",
          dense ? "text-lg" : "text-2xl lg:text-3xl",
        )}
      >
        <AnimatedNumber value={value} delay={index * 55} duration={850} />
      </p>
      {hint ? (
        <p className="mt-0.5 text-[10px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function AnalyticsKpiGrid({
  summary,
  period,
  variant = "full",
}: AnalyticsKpiGridProps) {
  const keys =
    variant === "compact" ? COMPACT_KPI_KEYS : KPI_DEFS.map((d) => d.key);

  const defs = KPI_DEFS.filter((d) => keys.includes(d.key));

  return (
    <div
      className={cn(
        "grid gap-px bg-foreground/10 border border-foreground/10",
        variant === "compact"
          ? "grid-cols-2 sm:grid-cols-4"
          : "grid-cols-2 md:grid-cols-4 lg:grid-cols-7",
      )}
    >
      {defs.map((def, index) => (
        <KpiCard
          key={def.key}
          index={index}
          label={
            typeof def.label === "function" ? def.label(period) : def.label
          }
          value={summary[def.key]}
          hint={def.hint?.(period)}
          dense={variant === "compact"}
        />
      ))}
    </div>
  );
}
