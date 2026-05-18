export type AnalyticsPeriod = "24h" | "7d" | "30d";

export type AnalyticsBreakdownItem = { name: string; count: number };

export type AnalyticsBreakdownKey =
  | "deviceTypes"
  | "browsers"
  | "referrers"
  | "regions";

export type LinkAnalyticsBreakdownKey =
  | AnalyticsBreakdownKey
  | "operatingSystems"
  | "cities";

export type AnalyticsTopLink = {
  shortCode: string;
  clicks: number;
  originalUrl: string;
  totalClicks: number;
  createdAt: string;
};

export type AnalyticsRecentClick = {
  shortCode: string;
  deviceType: string;
  browser: string;
  region: string;
  referrer: string;
  timeLabel: string;
  clickedAt?: string;
};

export type AnalyticsOverviewData = {
  period: AnalyticsPeriod;
  summary: {
    totalUrls: number;
    totalClicks: number;
    clicksInPeriod: number;
    clicksToday: number;
    clicksLast7d: number;
    clicksLast30d: number;
    activeLinksInPeriod: number;
  };
  timeline: { date: string; clicks: number }[];
  topLinks: AnalyticsTopLink[];
  breakdowns: Record<AnalyticsBreakdownKey, AnalyticsBreakdownItem[]>;
};

export type AnalyticsLinkRow = {
  shortCode: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
  updatedAt?: string;
};

export type AnalyticsLinksTableResponse = {
  page: number;
  totalPages: number;
  total: number;
  results: number;
  data: AnalyticsLinkRow[];
};

export type AnalyticsUrlDetail = {
  period: AnalyticsPeriod;
  url: {
    shortCode: string;
    originalUrl: string;
    shortUrl: string;
    clicks: number;
    createdAt: string;
    updatedAt?: string;
  };
  summary: {
    totalClicks: number;
    clicksInPeriod: number;
  };
  timeline: { date: string; clicks: number }[];
  breakdowns: Record<LinkAnalyticsBreakdownKey, AnalyticsBreakdownItem[]>;
};

export type LinkComparisonEntry = {
  shortCode: string;
  originalUrl: string;
  periodClicks: number;
  totalClicks: number;
  shareOfPeriod: number;
  avgPerDay: number;
  vsLeaderPercent: number;
  isLeader: boolean;
};

/** Raw click document from GET /analytics/recent-clicks */
export type ApiClickRecord = {
  shortCode: string;
  deviceType?: string;
  browser?: string;
  region?: string;
  referrer?: string;
  clickedAt: string;
};
