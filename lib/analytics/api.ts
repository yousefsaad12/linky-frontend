import { site } from "@/lib/site";
import type {
  AnalyticsLinksTableResponse,
  AnalyticsOverviewData,
  AnalyticsPeriod,
  AnalyticsRecentClick,
  AnalyticsTopLink,
  AnalyticsUrlDetail,
  ApiClickRecord,
} from "./types";
import { normalizeRecentClick, normalizeTopLink } from "./normalize";
import { toast } from "@/hooks/use-toast";

export class AnalyticsAuthError extends Error {
  constructor() {
    super("Sign in required");
    this.name = "AnalyticsAuthError";
  }
}

export class AnalyticsApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AnalyticsApiError";
    this.status = status;
  }
}

type ApiEnvelope<T> = {
  status?: string;
  data?: T;
  message?: string;
};

async function analyticsFetch<T>(path: string, init?: RequestInit, options?: { suppressToasts?: boolean }): Promise<T> {
  // Use relative URLs when running in the browser so requests remain same-origin
  // (this allows a Next.js rewrite/proxy to forward them to the real API and
  // keeps cookies/auth working). On the server, use the configured API URL.

  const url = `${site.apiUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });

  if (res.status === 401) {
    throw new AnalyticsAuthError();
  }

  let body: ApiEnvelope<T> & T = {} as ApiEnvelope<T> & T;
  try {
    body = await res.json();
  } catch {
    if (!res.ok) {
      const message = res.statusText || "Request failed";
      if (!options?.suppressToasts) {
        toast({
          variant: "destructive",
          title: `Error ${res.status}`,
          description: message,
        });
      }
      throw new AnalyticsApiError(message, res.status);
    }
  }

  if (!res.ok) {
    const message = (body as ApiEnvelope<T>).message || res.statusText || "Request failed";
    if (!options?.suppressToasts) {
      toast({
        variant: "destructive",
        title: `Error ${res.status}`,
        description: message,
      });
    }
    throw new AnalyticsApiError(message, res.status);
  }

  if (
    body &&
    typeof body === "object" &&
    "data" in body &&
    body.data !== undefined
  ) {
    return body.data as T;
  }

  return body as T;
}

function periodQuery(
  period: AnalyticsPeriod,
  extra?: Record<string, string | number>,
) {
  const params = new URLSearchParams({ period });
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      params.set(key, String(value));
    }
  }
  return `?${params.toString()}`;
}

export async function fetchAnalyticsOverview(
  period: AnalyticsPeriod,
  options?: { topLinksLimit?: number },
): Promise<AnalyticsOverviewData> {
  const data = await analyticsFetch<AnalyticsOverviewData>(
    `/api/v1/analytics/overview${periodQuery(period, {
      limit: options?.topLinksLimit ?? 10,
    })}`,
  );

  return {
    ...data,
    period: data.period ?? period,
    clamped: data.clamped,
    topLinks: (data.topLinks ?? []).map(normalizeTopLink),
    breakdowns: {
      deviceTypes: data.breakdowns?.deviceTypes ?? [],
      browsers: data.breakdowns?.browsers ?? [],
      referrers: data.breakdowns?.referrers ?? [],
      regions: data.breakdowns?.regions ?? [],
    },
  };
}

export async function fetchTopLinks(
  period: AnalyticsPeriod,
  limit = 10,
): Promise<AnalyticsTopLink[]> {
  const data = await analyticsFetch<AnalyticsTopLink[]>(
    `/api/v1/analytics/top-links${periodQuery(period, { limit })}`,
  );
  return (Array.isArray(data) ? data : []).map(normalizeTopLink);
}

export async function fetchRecentClicks(options?: {
  limit?: number;
  shortCode?: string;
}): Promise<AnalyticsRecentClick[]> {
  const params = new URLSearchParams();
  params.set("limit", String(options?.limit ?? 20));
  if (options?.shortCode) params.set("shortCode", options.shortCode);

  const data = await analyticsFetch<ApiClickRecord[]>(
    `/api/v1/analytics/recent-clicks?${params.toString()}`,
  );

  return (Array.isArray(data) ? data : []).map(normalizeRecentClick);
}

export async function fetchLinksTable(options: {
  page?: number;
  limit?: number;
  sort?: "clicks" | "createdAt";
}): Promise<AnalyticsLinksTableResponse> {
  const params = new URLSearchParams();
  params.set("page", String(options.page ?? 1));
  params.set("limit", String(options.limit ?? 20));
  if (options.sort) params.set("sort", options.sort);

  // Try /api/v1/url first (URL management endpoint)
  let envelope = await fetch(`${site.apiUrl}/api/v1/url?${params.toString()}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  // If that fails with 404, try /api/v1/analytics/links
  if (envelope.status === 404) {
    envelope = await fetch(
      `${site.apiUrl}/api/v1/analytics/links?${params.toString()}`,
      { credentials: "include", headers: { Accept: "application/json" } },
    );
  }

  if (envelope.status === 401) throw new AnalyticsAuthError();
  if (!envelope.ok) {
    throw new AnalyticsApiError(envelope.statusText, envelope.status);
  }

  const json = await envelope.json();

  // Transform URL list response to links table format
  const urls = json.data || json.urls || [];
  return {
    page: json.page ?? 1,
    totalPages: json.totalPages ?? 1,
    total: json.total ?? urls.length,
    results: json.results ?? urls.length,
    data: urls.map((url: any) => ({
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      clicks: url.clicks || 0,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    })),
  };
}

export async function fetchUrlAnalytics(
  shortCode: string,
  period: AnalyticsPeriod,
): Promise<AnalyticsUrlDetail> {
  const data = await analyticsFetch<AnalyticsUrlDetail>(
    `/api/v1/analytics/links/${encodeURIComponent(shortCode)}${periodQuery(period)}`,
  );

  return {
    ...data,
    period: data.period ?? period,
    clamped: data.clamped,
    breakdowns: {
      deviceTypes: data.breakdowns?.deviceTypes ?? [],
      browsers: data.breakdowns?.browsers ?? [],
      referrers: data.breakdowns?.referrers ?? [],
      regions: data.breakdowns?.regions ?? [],
      operatingSystems: data.breakdowns?.operatingSystems ?? [],
      cities: data.breakdowns?.cities ?? [],
    },
  };
}
