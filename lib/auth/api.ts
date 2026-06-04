import { site } from "@/lib/site";

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

async function authFetch<T>(path: string, init?: RequestInit): Promise<T> {
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
      throw new AuthApiError(res.statusText || "Request failed", res.status);
    }
  }

  if (!res.ok) {
    throw new AuthApiError(
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

export async function logout(): Promise<void> {
  await authFetch<void>("/api/v1/auth/logout", {
    method: "POST",
  });

  // Clear client-side login timestamp so the frontend won't consider the
  // user authenticated after server logout. `localStorage` is only
  // available in the browser.
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
