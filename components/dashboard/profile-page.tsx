"use client";

import { useEffect, useState } from "react";
import { User, Mail, Calendar, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { site } from "@/lib/site";
import { logout } from "@/lib/auth";
import { AuthApiError } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  totalLinks?: number;
  totalClicks?: number;
}

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${site.apiUrl}/api/v1/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const json = await res.json();
          // Backend may wrap payload in { data: { ... } }
          const payload = json?.data ?? json;

          const mapped: UserProfile = {
            id: payload.id ?? payload._id ?? "",
            email: payload.email ?? "",
            name:
              payload.name ??
              payload.fullName ??
              payload.displayName ??
              undefined,
            createdAt:
              payload.createdAt ??
              payload.created_at ??
              payload.created ??
              new Date().toISOString(),
            totalLinks:
              payload.totalLinks ??
              payload.total_links ??
              payload.stats?.totalLinks ??
              payload.stats?.links ??
              0,
            totalClicks:
              payload.totalClicks ??
              payload.total_clicks ??
              payload.stats?.totalClicks ??
              payload.stats?.clicks ??
              0,
          };

          setProfile(mapped);
        } else if (res.status === 401) {
          // Not authenticated — redirect to sign in
          window.location.href = site.auth.signIn;
        } else {
          // Fallback mock data
          setProfile({
            id: "user-1",
            email: "user@example.com",
            name: "User",
            createdAt: new Date().toISOString(),
            totalLinks: 0,
            totalClicks: 0,
          });
        }
      } catch (error) {
        // On error, use mock data
        setProfile({
          id: "user-1",
          email: "user@example.com",
          name: "User",
          createdAt: new Date().toISOString(),
          totalLinks: 0,
          totalClicks: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
      });
      window.location.href = "/";
    } catch (error) {
      if (error instanceof AuthApiError) {
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sm text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl tracking-tight">Profile</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account settings
          </p>
        </div>
        <div className="flex items-center">
          <a href="/dashboard">
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full font-mono text-xs mr-2"
            >
              Dashboard
            </Button>
          </a>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full font-mono text-xs"
            onClick={handleLogout}
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" />
            Logout
          </Button>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-foreground/10 flex items-center justify-center">
            <User className="h-8 w-8 text-foreground/60" />
          </div>
          <div>
            <h3 className="font-display text-lg">{profile?.name || "User"}</h3>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-foreground/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="px-3 py-4 rounded-md bg-muted/5">
              <div className="text-sm text-muted-foreground">Links</div>
              <div className="text-lg font-semibold">
                {profile?.totalLinks ?? 0}
              </div>
            </div>

            <div className="px-3 py-4 rounded-md bg-muted/5">
              <div className="text-sm text-muted-foreground">Clicks</div>
              <div className="text-lg font-semibold">
                {profile?.totalClicks ?? 0}
              </div>
            </div>

            <div className="px-3 py-4 rounded-md bg-muted/5">
              <div className="text-sm text-muted-foreground">Member since</div>
              <div className="text-lg font-semibold">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-display text-lg mb-4">Account Settings</h3>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start font-mono text-xs"
            disabled
          >
            <Settings className="h-3.5 w-3.5 mr-2" />
            Edit profile (Coming soon)
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start font-mono text-xs"
            disabled
          >
            <Settings className="h-3.5 w-3.5 mr-2" />
            Change password (Coming soon)
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start font-mono text-xs"
            disabled
          >
            <Settings className="h-3.5 w-3.5 mr-2" />
            Delete account (Coming soon)
          </Button>
        </div>
      </Card>
    </div>
  );
}
