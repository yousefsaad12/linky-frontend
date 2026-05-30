"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { site } from "@/lib/site";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated by making a test API call
    // If it returns 401, redirect to sign in
    const checkAuth = async () => {
      try {
        const res = await fetch(`${site.apiUrl}/api/v1/analytics/overview?period=7d`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (res.status === 401) {
          router.push(site.auth.signIn);
        } else if (res.ok) {
          setIsAuthenticated(true);
        } else {
          // If endpoint doesn't exist (404) or other error, allow access
          // The dashboard will handle API errors gracefully
          setIsAuthenticated(true);
        }
      } catch (error) {
        // If there's a network error, allow access
        // The dashboard will handle API errors gracefully
        setIsAuthenticated(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
