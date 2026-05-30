"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

export interface User {
  id: string;
  email: string;
  name?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking auth at:", `${site.apiUrl}/api/v1/auth/me`);
        
        const res = await fetch(`${site.apiUrl}/api/v1/auth/me`, {
          method: "GET",
          credentials: "include", // 💡 Crucial: Sends your production JWT cookie with the cross-origin request
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        });

        console.log("Auth response status:", res.status);

        if (res.ok) {
          const json = await res.json();
          
          // Parse out the authentic database values from your controller payload
          const realUser: User = {
            id: json.data.id,
            email: json.data.email,
            name: json.data.name || "Linky User",
          };
          
          console.log("User authenticated successfully:", realUser);
          setUser(realUser);
          setIsAuthenticated(true);
        } else if (res.status === 401) {
          console.log("Not authenticated (401)");
          setUser(null);
          setIsAuthenticated(false);
        } else {
          console.log("Auth check failed with status:", res.status);
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
  }, []);

  return { user, isAuthenticated, loading };
}