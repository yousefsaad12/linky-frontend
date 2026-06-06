"use client";

import { useEffect, useState, useRef } from "react";
import { site } from "@/lib/site";
import { logout } from "@/lib/auth";

export interface User {
  id: string;
  email: string;
  name?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const logoutTimerRef = useRef<number | null>(null);

  const SESSION_TTL = 60 * 60 * 1000; // 1 hour

  const scheduleAutoLogout = (loginAtMs: number) => {
    if (typeof window === "undefined") return;
    // Clear existing timer
    if (logoutTimerRef.current) {
      window.clearTimeout(logoutTimerRef.current);
    }

    const expiresAt = loginAtMs + SESSION_TTL;
    const remaining = Math.max(0, expiresAt - Date.now());

    logoutTimerRef.current = window.setTimeout(async () => {
      try {
        await logout();
      } catch (e) {
        // ignore
      }
      // After logout, redirect to sign-in to force login again
      if (typeof window !== "undefined") {
        window.location.href = site.auth.signIn;
      }
    }, remaining) as unknown as number;
  };

  useEffect(() => {
    const checkAuth = async () => {
      // If we already have a stored login timestamp, check expiry first
      try {
        const raw = localStorage.getItem("loginAt");
        if (raw) {
          const at = Number(raw);
          if (!Number.isNaN(at) && Date.now() - at > SESSION_TTL) {
            // Session expired on the client — perform logout and redirect
            try {
              await logout();
            } catch (e) {
              // ignore
            }
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            window.location.href = site.auth.signIn;
            return;
          } else if (!Number.isNaN(at)) {
            scheduleAutoLogout(at);
          }
        }
      } catch (e) {
        // ignore localStorage errors
      }

      try {
        if (process.env.NODE_ENV !== "production") {
          console.debug("Checking auth at:", `${site.apiUrl}/api/v1/auth/me`);
        }

        const res = await fetch(`${site.apiUrl}/api/v1/auth/me`, {
          method: "GET",
          credentials: "include", // 💡 Crucial: Sends your production JWT cookie with the cross-origin request
          headers: {
            Accept: "application/json",
          },
        });

        if (process.env.NODE_ENV !== "production") {
          console.debug("Auth response status:", res.status);
        }

        if (res.ok) {
          const json = await res.json();

          // Normalize controller payload: APIs may return { data: {...} },
          // { user: {...} } or the user object directly.
          let payload: any = null;
          if (json && typeof json === "object") {
            payload = "data" in json ? json.data : json;
          }

          // Some backends nest the user under `user`.
          const userPayload =
            payload && typeof payload === "object"
              ? (payload.user ?? payload)
              : null;

          // Guard against missing payload
          if (!userPayload || (!userPayload.id && !userPayload._id)) {
            console.warn("Auth response missing user data:", payload);
            setUser(null);
            setIsAuthenticated(false);
          } else {
            const realUser: User = {
              id: String(userPayload.id ?? userPayload._id ?? ""),
              email: String(userPayload.email ?? ""),
              name: userPayload.name ?? userPayload.fullName ?? "lnqo User",
            };

            if (process.env.NODE_ENV !== "production") {
              console.debug("User authenticated successfully:", realUser);
            }
            setUser(realUser);
            setIsAuthenticated(true);
            try {
              const now = Date.now();
              localStorage.setItem("loginAt", String(now));
              scheduleAutoLogout(now);
            } catch (e) {
              // ignore localStorage errors
            }
          }
        } else if (res.status === 401) {
          console.warn("Not authenticated (401)");
          setUser(null);
          setIsAuthenticated(false);
        } else {
          console.error("Auth check failed with status:", res.status);
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth hydration error:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    return () => {
      if (logoutTimerRef.current) {
        window.clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);

  return { user, isAuthenticated, loading };
}
