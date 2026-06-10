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

  // ✅ THIS is what your component was missing
  const refreshUser = useCallback(async () => {
    try {
      const profile = await getCurrentUser();
      globalUser = profile;
      globalIsAuthenticated = true;
      globalLoading = false;
      notifyListeners();
      return profile;
    } catch (err) {
      // Only set unauthenticated if it's a definitive 401 after retries
      // The getCurrentUser function now handles retries internally
      if (err instanceof AuthApiError && err.status === 401) {
        globalUser = null;
        globalIsAuthenticated = false;
        globalLoading = false;
        notifyListeners();
        return null;
      }

      // For other errors, don't permanently set unauthenticated
      // This allows retry on network issues, CORS timing, etc.
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

        // Check if we just came from OAuth redirect
        const urlParams = new URLSearchParams(window.location.search);
        const justLoggedIn = urlParams.has('login') || localStorage.getItem('justLoggedIn') === 'true';

        // Clear the flag if it exists
        if (localStorage.getItem('justLoggedIn') === 'true') {
          localStorage.removeItem('justLoggedIn');
        }

        // If just logged in via OAuth, wait a bit for cookie to be available
        if (justLoggedIn) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Try to refresh user - getCurrentUser handles retries internally
        try {
          const user = await refreshUser();
          // Success - user is authenticated
        } catch (err) {
          // Error - user is not authenticated, no need to retry
          // getCurrentUser already handles retries for 401
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