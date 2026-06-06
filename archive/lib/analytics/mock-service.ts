import type {
  AnalyticsLinksTableResponse,
  AnalyticsOverviewData,
  AnalyticsPeriod,
  AnalyticsRecentClick,
  AnalyticsUrlDetail,
  LinkComparisonEntry,
} from "../types";
import {
  MOCK_ANALYTICS_BY_PERIOD,
  MOCK_LINKS_CATALOG,
  MOCK_LIVE_CLICKS,
  MOCK_RECENT_CLICKS,
  MOCK_URL_ANALYTICS,
} from "./mock-data";

const MOCK_DELAY_MS = 280;

function delay(ms = MOCK_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getMockAnalyticsOverview(
  period: AnalyticsPeriod,
  options?: { topLinksLimit?: number },
): Promise<AnalyticsOverviewData> {
  await delay();
  const base = MOCK_ANALYTICS_BY_PERIOD[period];
  const limit = options?.topLinksLimit ?? 10;
  return {
    ...base,
    period,
    topLinks: base.topLinks.slice(0, limit),
  };
}

export async function getMockRecentClicks(options?: {
  limit?: number;
  shortCode?: string;
}): Promise<AnalyticsRecentClick[]> {
  await delay();
  const limit = options?.limit ?? 20;
  let rows = options?.shortCode
    ? MOCK_LIVE_CLICKS.filter((c) => c.shortCode === options.shortCode)
    : MOCK_RECENT_CLICKS;
  return rows.slice(0, limit);
}

export async function getMockLiveClicks(
  limit = 30,
): Promise<AnalyticsRecentClick[]> {
  await delay();
  return MOCK_LIVE_CLICKS.slice(0, limit);
}

export async function getMockLinksTable(options: {
  page?: number;
  limit?: number;
  sort?: "clicks" | "createdAt";
}): Promise<AnalyticsLinksTableResponse> {
  await delay();
  const page = Math.max(options.page ?? 1, 1);
  const limit = Math.min(Math.max(options.limit ?? 20, 1), 100);
  const sort = options.sort ?? "clicks";

  const sorted = [...MOCK_LINKS_CATALOG].sort((a, b) => {
    if (sort === "clicks") return b.clicks - a.clicks;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;

  return {
    page: safePage,
    totalPages,
    total,
    results: Math.min(limit, total - start),
    data: sorted.slice(start, start + limit),
  };
}

export async function getMockUrlAnalytics(
  shortCode: string,
  period: AnalyticsPeriod,
): Promise<AnalyticsUrlDetail> {
  await delay();
  const key = shortCode.toLowerCase();
  const preset = MOCK_URL_ANALYTICS[key]?.[period];

  if (preset) {
    return { ...preset, period };
  }

  const row = MOCK_LINKS_CATALOG.find((l) => l.shortCode.toLowerCase() === key);
  if (!row) {
    throw new Error("Short URL not found");
  }

  const overview = MOCK_ANALYTICS_BY_PERIOD[period];
  const top = overview.topLinks.find((l) => l.shortCode.toLowerCase() === key);
  const clicksInPeriod = top?.clicks ?? Math.round(row.clicks * 0.12);

  return {
    period,
    url: {
      shortCode: row.shortCode,
      originalUrl: row.originalUrl,
      shortUrl: `https://linky.dev/${row.shortCode}`,
      clicks: row.clicks,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    },
    summary: {
      totalClicks: row.clicks,
      clicksInPeriod,
    },
    timeline: overview.timeline.map((p) => ({
      ...p,
      clicks: Math.max(
        1,
        Math.round(
          p.clicks * (clicksInPeriod / overview.summary.clicksInPeriod) * 0.5,
        ),
      ),
    })),
    breakdowns: MOCK_URL_ANALYTICS.k9xm["7d"].breakdowns,
  };
}

export async function getMockLinkComparison(
  period: AnalyticsPeriod,
  shortCodes?: string[],
): Promise<LinkComparisonEntry[]> {
  await delay(320);
  const overview = MOCK_ANALYTICS_BY_PERIOD[period];
  const periodTotal = overview.summary.clicksInPeriod;
  const days = period === "24h" ? 1 : period === "7d" ? 7 : 30;

  const candidates = overview.topLinks.map((link) => {
    const catalog = MOCK_LINKS_CATALOG.find(
      (r) => r.shortCode.toLowerCase() === link.shortCode.toLowerCase(),
    );
    return {
      shortCode: link.shortCode,
      originalUrl: link.originalUrl,
      periodClicks: link.clicks,
      totalClicks: catalog?.clicks ?? link.totalClicks,
    };
  });

  const selected =
    shortCodes && shortCodes.length > 0
      ? shortCodes
          .map((code) =>
            candidates.find(
              (c) => c.shortCode.toLowerCase() === code.toLowerCase(),
            ),
          )
          .filter((c): c is (typeof candidates)[0] => Boolean(c))
      : candidates.slice(0, 3);

  if (selected.length === 0) return [];

  const leaderClicks = Math.max(...selected.map((s) => s.periodClicks), 1);

  return selected.map((link) => {
    const shareOfPeriod =
      periodTotal > 0 ? (link.periodClicks / periodTotal) * 100 : 0;
    const vsLeader =
      leaderClicks > 0
        ? ((link.periodClicks - leaderClicks) / leaderClicks) * 100
        : 0;

    return {
      shortCode: link.shortCode,
      originalUrl: link.originalUrl,
      periodClicks: link.periodClicks,
      totalClicks: link.totalClicks,
      shareOfPeriod,
      avgPerDay: Math.round(link.periodClicks / days),
      vsLeaderPercent: vsLeader,
      isLeader: link.periodClicks >= leaderClicks,
    };
  });
}
