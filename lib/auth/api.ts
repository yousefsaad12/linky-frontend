import { site } from "@/lib/site";
import type {
  ApiKeySummary,
  CreateApiKeyResponse,
  UserProfile,
} from "./types";
import { toast } from "@/hooks/use-toast";

export class AuthApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
  }
}

type ApiEnvelope<T> = {
  status?: string;
  data?: T;
  message?: string;
};

async function authFetch<T>(path: string, init?: RequestInit, options?: { suppressToasts?: boolean }): Promise<T> {
  const url = `${site.apiUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...init?.headers,
    },
  });

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
      throw new AuthApiError(message, res.status);
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
    throw new AuthApiError(message, res.status);
  }

  // Show success toast for successful mutations (POST, PUT, DELETE, PATCH)
  if (res.ok && init?.method && init.method !== "GET" && init.method !== "HEAD" && !options?.suppressToasts) {
    const successMessage = (body as ApiEnvelope<T>).message || "Operation successful";
    toast({
      title: "Success",
      description: successMessage,
    });
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

type PlanLimits = UserProfile["limits"];

function normalizeUserProfile(raw: Record<string, unknown>): UserProfile {
  const limits = (raw.limits as PlanLimits | undefined) ?? {
    maxLinks: 100,
    clickHistoryDays: 30,
  };
  const maxLinks = limits.maxLinks;
  return {
    id: String(raw.id ?? raw._id ?? ""),
    email: String(raw.email ?? ""),
    name: raw.name ? String(raw.name) : undefined,
    avatar: raw.avatar ? String(raw.avatar) : undefined,
    plan: (raw.plan as UserProfile["plan"]) || "free",
    limits: {
      maxLinks:
        maxLinks === null || maxLinks === undefined || !Number.isFinite(maxLinks)
          ? null
          : Number(maxLinks),
      clickHistoryDays: Number(limits.clickHistoryDays) || 30,
    },
    features: (raw.features as UserProfile["features"]) ?? {
      basicAnalytics: true,
      deviceAnalytics: true,
      countryAnalytics: true,
      cityAnalytics: false,
      advancedAnalytics: false,
      apiAccess: false,
    },
    usage: {
      links: Number((raw.usage as { links?: number } | undefined)?.links ?? 0),
    },
  };
}

export async function getCurrentUser(retryCount = 0): Promise<UserProfile> {
  try {
    const raw = await authFetch<Record<string, unknown>>("/api/v1/auth/me", undefined, { suppressToasts: retryCount > 0 });
    return normalizeUserProfile(raw);
  } catch (err) {
    // Retry on 401 with exponential backoff (up to 3 retries)
    // This handles cookie timing issues after OAuth redirect
    if (err instanceof AuthApiError && err.status === 401 && retryCount < 3) {
      const delay = Math.pow(2, retryCount) * 500; // 500ms, 1s, 2s
      await new Promise((resolve) => setTimeout(resolve, delay));
      return getCurrentUser(retryCount + 1);
    }
    throw err;
  }
}

export async function listApiKeys(): Promise<ApiKeySummary[]> {
  const data = await authFetch<Array<Record<string, unknown>>>(
    "/api/v1/auth/api-keys",
  );
  if (!Array.isArray(data)) return [];
  return data.map((key) => ({
    _id: String(key._id ?? key.id ?? ""),
    name: String(key.name ?? "Default"),
    prefix: String(key.prefix ?? ""),
    lastUsedAt: (key.lastUsedAt as string | null) ?? null,
    createdAt: String(key.createdAt ?? ""),
  }));
}

export async function createApiKey(name: string): Promise<CreateApiKeyResponse> {
  return authFetch<CreateApiKeyResponse>("/api/v1/auth/api-keys", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function revokeApiKey(id: string): Promise<void> {
  await authFetch<void>(`/api/v1/auth/api-keys/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function logout(): Promise<void> {
  await authFetch<void>("/api/v1/auth/logout", {
    method: "POST",
  });

  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("loginAt");
    }
  } catch {
    // ignore
  }
}

export function getGoogleAuthUrl(): string {
  return site.auth.signIn;
}
