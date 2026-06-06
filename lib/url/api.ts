import { site } from "@/lib/site";

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

async function urlFetch<T>(path: string, init?: RequestInit): Promise<T> {
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
      throw new UrlApiError(res.statusText || "Request failed", res.status);
    }
  }

  if (!res.ok) {
    throw new UrlApiError(
      (body as ApiEnvelope<T>).message || res.statusText || "Request failed",
      res.status,
    );
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

export async function createShortUrl(
  data: CreateUrlRequest,
): Promise<CreateUrlResponse> {
  return urlFetch<CreateUrlResponse>("/api/v1/url", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAllUrls(): Promise<GetAllUrlsResponse> {
  return urlFetch<GetAllUrlsResponse>("/api/v1/url");
}

export async function deleteUrl(shortCode: string): Promise<void> {
  await urlFetch<void>(`/api/v1/url/${encodeURIComponent(shortCode)}`, {
    method: "DELETE",
  });
}
