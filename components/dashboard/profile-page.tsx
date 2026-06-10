"use client";

import { useState } from "react";
import Link from "next/link";
import { User, LogOut, Settings, Key, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlanBadge } from "@/components/dashboard/plan-badge";
import { PlanUsageBar } from "@/components/dashboard/plan-usage-bar";
import { QuotaUsageDialog } from "@/components/dashboard/quota-usage-dialog";
import { site } from "@/lib/site";
import { logout } from "@/lib/auth";
import { AuthApiError } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [quotaDialogOpen, setQuotaDialogOpen] = useState(false);

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

  if (authLoading) {
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
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-lg">{user?.name || "User"}</h3>
              {user ? <PlanBadge plan={user.plan} /> : null}
            </div>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        {user ? (
          <div className="space-y-4 pt-4 border-t border-foreground/10">
            <PlanUsageBar
              plan={user.plan}
              usage={user.usage}
              limits={user.limits}
            />
            <Button
              variant="outline"
              className="w-full justify-start font-mono text-xs"
              onClick={() => setQuotaDialogOpen(true)}
            >
              <BarChart3 className="h-3.5 w-3.5 mr-2" />
              View plan details
            </Button>
            {user.plan === "pro" ? (
              <Button
                asChild
                variant="outline"
                className="w-full justify-start font-mono text-xs"
              >
                <Link href="/dashboard/api-keys">
                  <Key className="h-3.5 w-3.5 mr-2" />
                  Manage API keys
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                className="w-full justify-start font-mono text-xs"
              >
                <Link href="/#pricing">Upgrade to Pro for API access</Link>
              </Button>
            )}
          </div>
        ) : null}
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

      {user ? (
        <QuotaUsageDialog
          open={quotaDialogOpen}
          onOpenChange={setQuotaDialogOpen}
          plan={user.plan}
          usage={user.usage}
          limits={user.limits}
          features={user.features}
        />
      ) : null}
    </div>
  );
}
