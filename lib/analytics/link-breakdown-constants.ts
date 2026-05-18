import { Cpu, Globe, Link2, MapPin, Monitor, Smartphone } from "lucide-react";
import type { LinkAnalyticsBreakdownKey } from "./types";

export const LINK_ANALYTICS_BREAKDOWN_TABS: {
  key: LinkAnalyticsBreakdownKey;
  label: string;
  icon: typeof Smartphone;
}[] = [
  { key: "deviceTypes", label: "Devices", icon: Smartphone },
  { key: "browsers", label: "Browsers", icon: Monitor },
  { key: "operatingSystems", label: "OS", icon: Cpu },
  { key: "referrers", label: "Referrers", icon: Link2 },
  { key: "regions", label: "Regions", icon: Globe },
  { key: "cities", label: "Cities", icon: MapPin },
];

export const OVERVIEW_BREAKDOWN_CARDS: {
  key: LinkAnalyticsBreakdownKey;
  label: string;
  icon: typeof Smartphone;
}[] = [
  { key: "deviceTypes", label: "Devices", icon: Smartphone },
  { key: "browsers", label: "Browsers", icon: Monitor },
  { key: "referrers", label: "Referrers", icon: Link2 },
  { key: "regions", label: "Regions", icon: Globe },
];
