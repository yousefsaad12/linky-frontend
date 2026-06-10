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

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const logoutTimerRef = useRef<number | null>(null);
  const didInit = useRef(false);

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
      setUser(profile);
      setIsAuthenticated(true);
      return profile;
    } catch (err) {
      // Only set unauthenticated if it's a definitive 401 after retries
      // The getCurrentUser function now handles retries internally
      if (err instanceof AuthApiError && err.status === 401) {
        setUser(null);
        setIsAuthenticated(false);
        return null;
      }

      // For other errors, don't permanently set unauthenticated
      // This allows retry on network issues, CORS timing, etc.
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  }, []);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const init = async () => {
      setLoading(true);

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

      // Try to refresh user with retries
      // The getCurrentUser function already has built-in retry logic
      const maxRetries = 1;
      let retryCount = 0;
      let user = null;

      while (retryCount < maxRetries && !user) {
        try {
          user = await refreshUser();
          if (user) break;
        } catch (err) {
          retryCount++;
          if (retryCount < maxRetries) {
            // Exponential backoff: 500ms
            const delay = Math.pow(2, retryCount - 1) * 500;
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }

      setLoading(false);
    };

    init();

    return () => {
      if (logoutTimerRef.current) {
        window.clearTimeout(logoutTimerRef.current);
      }
    };
  }, [refreshUser]);

  return {
    user,
    isAuthenticated,
    loading,
    refreshUser, // ✅ FIXED
  };
}