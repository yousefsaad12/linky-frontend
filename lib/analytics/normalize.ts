import type {
  AnalyticsRecentClick,
  AnalyticsTopLink,
  ApiClickRecord,
} from "./types";

export function formatClickTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function normalizeRecentClick(click: ApiClickRecord): AnalyticsRecentClick {
  return {
    shortCode: click.shortCode,
    deviceType: click.deviceType || "unknown",
    browser: click.browser || "unknown",
    region: click.region || "—",
    referrer: click.referrer || "direct",
    timeLabel: formatClickTime(click.clickedAt),
    clickedAt: click.clickedAt,
  };
}

export function normalizeTopLink(link: Partial<AnalyticsTopLink> & { shortCode: string }): AnalyticsTopLink {
  return {
    shortCode: link.shortCode,
    clicks: link.clicks ?? 0,
    originalUrl: link.originalUrl ?? "",
    totalClicks: link.totalClicks ?? link.clicks ?? 0,
    createdAt: link.createdAt ?? new Date().toISOString(),
  };
}
