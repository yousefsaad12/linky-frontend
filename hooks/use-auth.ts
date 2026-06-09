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
      if (typeof window !== "undefined") {
        window.location.href = site.auth.signIn;
      }
    }, remaining) as unknown as number;
  };

  const refreshUser = useCallback(async () => {
    try {
      const profile = await getCurrentUser();
      setUser(profile);
      setIsAuthenticated(true);
      return profile;
    } catch (error) {
      if (error instanceof AuthApiError && error.status === 401) {
        setUser(null);
        setIsAuthenticated(false);
      }
      throw error;
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const raw = localStorage.getItem("loginAt");
        if (raw) {
          const at = Number(raw);
          if (!Number.isNaN(at) && Date.now() - at > SESSION_TTL) {
            try {
              await logout();
            } catch {
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
      } catch {
        // ignore localStorage errors
      }

      try {
        await refreshUser();
        try {
          const now = Date.now();
          localStorage.setItem("loginAt", String(now));
          scheduleAutoLogout(now);
        } catch {
          // ignore localStorage errors
        }
      } catch (error) {
        if (error instanceof AuthApiError && error.status === 401) {
          setUser(null);
          setIsAuthenticated(false);
        } else {
          console.error("Auth hydration error:", error);
          setUser(null);
          setIsAuthenticated(false);
        }
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

  return { user, isAuthenticated, loading, refreshUser };
}
