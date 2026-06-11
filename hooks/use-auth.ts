"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import {
  AuthApiError,
  getCurrentUser,
  logout,
  type UserProfile,
} from "@/lib/auth";

export type User = UserProfile;

// Singleton state to share across all hook instances
let globalUser: User | null = null;
let globalIsAuthenticated = false;
let globalLoading = true;
let globalInitPromise: Promise<void> | null = null;
let listeners: Set<(user: User | null, isAuthenticated: boolean, loading: boolean) => void> = new Set();

const notifyListeners = () => {
  listeners.forEach(listener => listener(globalUser, globalIsAuthenticated, globalLoading));
};

// ✅ Safe localStorage helpers — won't crash in Brave or mobile
const safeStorage = {
  get: (key: string) => {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  remove: (key: string) => {
    try { localStorage.removeItem(key); } catch {}
  },
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(globalUser);
  const [isAuthenticated, setIsAuthenticated] = useState(globalIsAuthenticated);
  const [loading, setLoading] = useState(globalLoading);

  const logoutTimerRef = useRef<number | null>(null);
  const SESSION_TTL = 60 * 60 * 1000;

  const scheduleAutoLogout = (loginAt: number) => {
    if (logoutTimerRef.current) {
      window.clearTimeout(logoutTimerRef.current);
    }
    const expiresAt = loginAt + SESSION_TTL;
    const remaining = Math.max(0, expiresAt - Date.now());
    logoutTimerRef.current = window.setTimeout(async () => {
      try {
        await logout();
      } finally {
        window.location.href = site.auth.signIn;
      }
    }, remaining);
  };

  const refreshUser = useCallback(async () => {
    try {
      const profile = await getCurrentUser();
      globalUser = profile;
      globalIsAuthenticated = true;
      globalLoading = false;
      notifyListeners();
      return profile;
    } catch (err) {
      globalUser = null;
      globalIsAuthenticated = false;
      globalLoading = false;
      notifyListeners();
      return null;
    }
  }, []);

  useEffect(() => {
    // Subscribe to global state changes
    const listener = (u: User | null, auth: boolean, load: boolean) => {
      setUser(u);
      setIsAuthenticated(auth);
      setLoading(load);
    };
    listeners.add(listener);

    // Initialize auth only once globally
    if (!globalInitPromise) {
      globalInitPromise = (async () => {
        globalLoading = true;
        notifyListeners();

        // ✅ Safe URL param + localStorage check
        const urlParams = new URLSearchParams(window.location.search);
        const justLoggedIn =
          urlParams.has("login") || safeStorage.get("justLoggedIn") === "true";
        safeStorage.remove("justLoggedIn");

        if (justLoggedIn) {
          // ✅ Retry up to 3 times with 600ms delay instead of fixed 500ms
          for (let i = 0; i < 3; i++) {
            const user = await refreshUser();
            if (user) break;
            await new Promise(r => setTimeout(r, 600));
          }
        } else {
          await refreshUser();
        }

        globalLoading = false;
        notifyListeners();
      })();
    }

    return () => {
      listeners.delete(listener);
      if (logoutTimerRef.current) {
        window.clearTimeout(logoutTimerRef.current);
      }
    };
  }, [refreshUser]);

  return {
    user,
    isAuthenticated,
    loading,
    refreshUser,
  };
}