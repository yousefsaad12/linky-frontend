"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PlanName } from "@/lib/auth/types";

interface PlanBadgeProps {
  plan: PlanName;
  className?: string;
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  const isPro = plan === "pro";

  return (
    <Badge
      variant={isPro ? "default" : "secondary"}
      className={cn(
        "rounded-full font-mono text-[10px] uppercase tracking-wider",
        isPro && "bg-amber-500/15 text-amber-600 border-amber-500/25 hover:bg-amber-500/20",
        className,
      )}
    >
      {isPro ? "Pro" : "Free"}
    </Badge>
  );
}
