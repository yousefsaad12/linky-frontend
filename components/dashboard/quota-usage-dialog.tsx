"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlanName, PlanLimits, PlanFeatures, PlanUsage } from "@/lib/auth/types";

interface QuotaUsageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: PlanName;
  usage: PlanUsage;
  limits: PlanLimits;
  features: PlanFeatures;
}

export function QuotaUsageDialog({
  open,
  onOpenChange,
  plan,
  usage,
  limits,
  features,
}: QuotaUsageDialogProps) {
  const isPro = plan === "pro";
  const maxLinks = limits.maxLinks;
  const hasFiniteLimit =
    maxLinks !== null && Number.isFinite(maxLinks) && maxLinks > 0;
  const percent = hasFiniteLimit
    ? Math.min(100, Math.round((usage.links / maxLinks) * 100))
    : 0;

  const featureList = [
    { key: "basicAnalytics", label: "Basic Analytics" },
    { key: "deviceAnalytics", label: "Device Analytics" },
    { key: "countryAnalytics", label: "Country Analytics" },
    { key: "cityAnalytics", label: "City Analytics" },
    { key: "advancedAnalytics", label: "Advanced Analytics" },
    { key: "apiAccess", label: "API Access" },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge
              variant={isPro ? "default" : "secondary"}
              className={cn(
                "rounded-full font-mono text-[10px] uppercase tracking-wider",
                isPro && "bg-amber-500/15 text-amber-600 border-amber-500/25",
              )}
            >
              {isPro ? "Pro" : "Free"}
            </Badge>
            Plan Details
          </DialogTitle>
          <DialogDescription>
            View your current plan limits and usage
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Links Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Links Created</span>
              <span className="font-mono font-medium">
                {isPro || !hasFiniteLimit
                  ? `${usage.links} · unlimited`
                  : `${usage.links}/${maxLinks}`}
              </span>
            </div>
            {!isPro && hasFiniteLimit ? (
              <Progress value={percent} className="h-2" />
            ) : null}
          </div>

          {/* Click History */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Click History</span>
            <span className="font-mono font-medium">
              {limits.clickHistoryDays} days
            </span>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Features</h4>
            <div className="space-y-2">
              {featureList.map(({ key, label }) => {
                const isEnabled = features[key];
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{label}</span>
                    {isEnabled ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground/50" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upgrade CTA for Free users */}
          {!isPro && (
            <div className="pt-4 border-t">
              <a
                href="/#pricing"
                className="block w-full text-center text-sm font-medium text-amber-600 hover:text-amber-700"
              >
                Upgrade to Pro for unlimited links and API access →
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
