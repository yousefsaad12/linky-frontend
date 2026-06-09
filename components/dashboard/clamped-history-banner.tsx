"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ClampedHistoryBannerProps {
  clickHistoryDays?: number;
}

export function ClampedHistoryBanner({
  clickHistoryDays = 30,
}: ClampedHistoryBannerProps) {
  return (
    <Alert className="mb-6 border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-50">
      <AlertTriangle className="text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-900 dark:text-amber-100">
        Click history limited to {clickHistoryDays} days
      </AlertTitle>
      <AlertDescription className="text-amber-800/90 dark:text-amber-100/80">
        Your plan only includes the last {clickHistoryDays} days of analytics.
        Older clicks are hidden from charts and breakdowns.{" "}
        <Link
          href="/#pricing"
          className="font-medium underline underline-offset-2 hover:text-amber-900 dark:hover:text-amber-50"
        >
          Upgrade to Pro
        </Link>{" "}
        for up to 365 days of history.
      </AlertDescription>
    </Alert>
  );
}
