import { site } from "@/lib/site";
import { toast } from "@/hooks/use-toast";

export class UrlAuthError extends Error {
  constructor() {
    super("Sign in required");
    this.name = "UrlAuthError";
  }
}

export class UrlApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "UrlApiError";
    this.status = status;
  }
}

type ApiEnvelope<T> = {
  status?: string;
  data?: T;
  message?: string;
};

export type CreateUrlRequest = {
  originalUrl: string;
};

export type CreateUrlResponse = {
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
};

export type UrlItem = {
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  updatedAt?: string;
};

export type GetAllUrlsResponse = {
  urls: UrlItem[];
  total: number;
};

async function urlFetch<T>(path: string, init?: RequestInit, options?: { suppressToasts?: boolean }): Promise<T> {
  const url = `${site.apiUrl}${path.startsWith("/") ? path : `/${path}`}`;
  if (process.env.NODE_ENV !== "production") {
    console.debug("Fetching URL:", url);
    console.debug("API URL from site:", site.apiUrl);
  }

  const baseHeaders: Record<string, string> = { Accept: "application/json" };

  // Merge init.headers safely (HeadersInit can be Headers, string[][], or Record)
  if (init?.headers) {
    const headers = new Headers(init.headers as HeadersInit);
    headers.forEach((value, key) => {
      baseHeaders[key] = value;
    });
  }

  // Only set Content-Type when sending a body or when method is not GET
  if ((init?.method && init.method.toUpperCase() !== "GET") || init?.body) {
    baseHeaders["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: baseHeaders,
  });

  if (res.status === 401) {
    throw new UrlAuthError();
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
      throw new UrlApiError(message, res.status);
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
    throw new UrlApiError(message, res.status);
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

type CreateUrlApiData = {
  url: {
    shortCode: string;
    originalUrl: string;
    clicks?: number;
    createdAt: string;
  };
  shortUrl: string;
};

export async function createShortUrl(
  data: CreateUrlRequest,
  options?: { suppressToasts?: boolean },
): Promise<CreateUrlResponse> {
  const raw = await urlFetch<CreateUrlApiData | CreateUrlResponse>(
    "/api/v1/url",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    options,
  );

  if (raw && typeof raw === "object" && "url" in raw && raw.url) {
    return {
      shortCode: raw.url.shortCode,
      originalUrl: raw.url.originalUrl,
      shortUrl: raw.shortUrl,
      clicks: raw.url.clicks ?? 0,
      createdAt: raw.url.createdAt,
    };
  }

  return raw as CreateUrlResponse;
}

export async function getAllUrls(): Promise<GetAllUrlsResponse> {
  const raw = await urlFetch<UrlItem[] | GetAllUrlsResponse>("/api/v1/url");
  const base = site.apiUrl.replace(/\/+$/, "");

  if (Array.isArray(raw)) {
    return {
      urls: raw.map((item) => ({
        shortCode: item.shortCode,
        originalUrl: item.originalUrl,
        shortUrl: item.shortUrl || `${base}/${item.shortCode}`,
        clicks: item.clicks ?? 0,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      total: raw.length,
    };
  }

  return raw;
}

export async function deleteUrl(shortCode: string): Promise<void> {
  await urlFetch<void>(`/api/v1/url/${encodeURIComponent(shortCode)}`, {
    method: "DELETE",
  });
}
