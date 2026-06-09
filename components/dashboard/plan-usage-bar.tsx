"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { PlanLimits, PlanName, PlanUsage } from "@/lib/auth/types";

interface PlanUsageBarProps {
  plan: PlanName;
  usage: PlanUsage;
  limits: PlanLimits;
  className?: string;
}

export function PlanUsageBar({
  plan,
  usage,
  limits,
  className,
}: PlanUsageBarProps) {
  const isPro = plan === "pro";
  const maxLinks = limits.maxLinks;
  const hasFiniteLimit =
    maxLinks !== null && Number.isFinite(maxLinks) && maxLinks > 0;
  const percent = hasFiniteLimit
    ? Math.min(100, Math.round((usage.links / maxLinks) * 100))
    : 0;

  return (
    <div className={cn("flex flex-col gap-1.5 min-w-[120px]", className)}>
      <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-muted-foreground">
        <span>Links</span>
        <span className="text-foreground tabular-nums">
          {isPro || !hasFiniteLimit
            ? `${usage.links} · unlimited`
            : `${usage.links}/${maxLinks}`}
        </span>
      </div>
      {!isPro && hasFiniteLimit ? (
        <Progress value={percent} className="h-1.5" />
      ) : null}
    </div>
  );
}
