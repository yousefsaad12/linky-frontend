import { Globe, Link2, Monitor, Smartphone } from "lucide-react";
import type { AnalyticsBreakdownKey, AnalyticsPeriod } from "./types";

export const ANALYTICS_PERIODS: { key: AnalyticsPeriod; label: string }[] = [
  { key: "24h", label: "24h" },
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
];

export const ANALYTICS_BREAKDOWN_TABS: {
  key: AnalyticsBreakdownKey;
  label: string;
  icon: typeof Smartphone;
}[] = [
  { key: "deviceTypes", label: "Devices", icon: Smartphone },
  { key: "browsers", label: "Browsers", icon: Monitor },
  { key: "referrers", label: "Referrers", icon: Link2 },
  { key: "regions", label: "Regions", icon: Globe },
];
