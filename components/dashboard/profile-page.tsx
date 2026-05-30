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
          },
        });

        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          // If profile endpoint doesn't exist, use mock data
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
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Email:</span>
            <span className="font-mono">{profile?.email}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Member since:</span>
            <span className="font-mono">
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Total links:</span>
            <span className="font-mono">{profile?.totalLinks ?? 0}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Total clicks:</span>
            <span className="font-mono">{profile?.totalClicks ?? 0}</span>
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
