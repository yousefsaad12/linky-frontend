"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { site } from "@/lib/site";
import {
  AuthApiError,
  getCurrentUser,
  logout,
  type UserProfile,
} from "@/lib/auth";

export type User = UserProfile;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const logoutTimerRef = useRef<number | null>(null);
  const didInitRef = useRef(false);

  const SESSION_TTL = 60 * 60 * 1000; // 1 hour

  const scheduleAutoLogout = (loginAtMs: number) => {
    if (typeof window === "undefined") return;

    if (logoutTimerRef.current) {
      window.clearTimeout(logoutTimerRef.current);
    }

    const expiresAt = loginAtMs + SESSION_TTL;
    const remaining = Math.max(0, expiresAt - Date.now());

    logoutTimerRef.current = window.setTimeout(async () => {
      try {
        await logout();
      } catch {
        // ignore
      }

      window.location.href = site.auth.signIn;
    }, remaining) as unknown as number;
  };

  const refreshUser = useCallback(async () => {
    try {
      const profile = await getCurrentUser();

      setUser(profile);
      setIsAuthenticated(true);

      return profile;
    } catch (error: any) {
      // ❗ 401 = NOT LOGGED IN (NOT AN ERROR)
      if (error instanceof AuthApiError && error.status === 401) {
        setUser(null);
        setIsAuthenticated(false);
        return null;
      }

      console.error("Auth error:", error);
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  }, []);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    const checkAuth = async () => {
      try {
        // 1. Check local session timestamp
        const raw = localStorage.getItem("loginAt");

        if (raw) {
          const at = Number(raw);

          if (!Number.isNaN(at)) {
            const expired = Date.now() - at > SESSION_TTL;

            if (expired) {
              await logout();
              localStorage.removeItem("loginAt");

              setUser(null);
              setIsAuthenticated(false);
              setLoading(false);

              window.location.href = site.auth.signIn;
              return;
            }

            scheduleAutoLogout(at);
          }
        }

        // 2. Fetch user session from backend
        await refreshUser();

        // 3. Save login timestamp only if authenticated
        if (user) {
          const now = Date.now();
          localStorage.setItem("loginAt", String(now));
          scheduleAutoLogout(now);
        }
      } catch {
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
  }, [refreshUser]);

  return { user, isAuthenticated, loading };
}