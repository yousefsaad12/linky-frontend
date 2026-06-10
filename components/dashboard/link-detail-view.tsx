"use client";

import Link from "next/link";
import { ArrowLeft, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { ClickTimelineChart } from "@/components/analytics/click-timeline-chart";
import { LinkBreakdownPanel } from "@/components/analytics/link-breakdown-panel";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { ClampedHistoryBanner } from "@/components/dashboard/clamped-history-banner";
import { useAuth } from "@/hooks/use-auth";
import { truncateUrl } from "@/lib/analytics/format";
import type { AnalyticsPeriod, AnalyticsUrlDetail } from "@/lib/analytics/types";
import { Button } from "@/components/ui/button";
interface LinkDetailViewProps {
  data: AnalyticsUrlDetail;
  period: AnalyticsPeriod;
}

export function LinkDetailView({ data, period }: LinkDetailViewProps) {
  const { user } = useAuth();
  const [copied, setCopied] = useState<"short" | "dest" | null>(null);

  const copy = async (text: string, which: "short" | "dest") => {
    const fullUrl = which === "short" ? `https://lnqo.vercel.app/${text}` : text;
    await navigator.clipboard.writeText(fullUrl);
    setCopied(which);
    setTimeout(() => setCopied(null), 2000);
  };

  const sharePct =
    data.summary.totalClicks > 0
      ? ((data.summary.clicksInPeriod / data.summary.totalClicks) * 100).toFixed(1)
      : "0";

  return (
    <div className="space-y-px">
      {data.clamped ? (
        <ClampedHistoryBanner
          clickHistoryDays={user?.limits.clickHistoryDays ?? 30}
        />
      ) : null}
      <div className="border border-foreground/10 bg-background p-6 lg:p-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to overview
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
              Link analytics
            </p>
            <h1 className="font-display text-3xl lg:text-4xl tracking-tight font-mono">
              {data.url.shortCode}
            </h1>
            <p
              className="mt-2 text-sm text-muted-foreground truncate max-w-xl"
              title={data.url.originalUrl}
            >
              {truncateUrl(data.url.originalUrl, 64)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <CopyButton
              label="Copy short URL"
              copied={copied === "short"}
              onClick={() => copy(data.url.shortUrl, "short")}
            />
            <CopyButton
              label="Copy destination"
              copied={copied === "dest"}
              onClick={() => copy(data.url.originalUrl, "dest")}
            />
            <Button variant="outline" size="sm" className="rounded-full" asChild>
              <a href={data.url.originalUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                Open
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-px bg-foreground/10 border-x border-b border-foreground/10 grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total clicks"
          numericValue={data.summary.totalClicks}
          delay={0}
        />
        <StatCard
          label={`In ${period}`}
          numericValue={data.summary.clicksInPeriod}
          delay={90}
        />
        <StatCard
          label="Period share"
          numericValue={Number(sharePct)}
          suffix="%"
          hint="of lifetime clicks"
          delay={180}
        />
        <StatCard
          label="Granularity"
          value={period === "24h" ? "Hourly" : "Daily"}
        />
      </div>

      <div className="grid gap-px bg-foreground/10 border border-foreground/10 lg:grid-cols-3">
        <div className="bg-background p-6 lg:p-8 lg:col-span-2">
          <h2 className="font-display text-xl mb-4">Click timeline</h2>
          <ClickTimelineChart
            data={data.timeline}
            height={260}
            gradientId="linkDetailGradient"
          />
        </div>
        <div className="bg-background p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-foreground/10">
          <LinkBreakdownPanel breakdowns={data.breakdowns} />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  numericValue,
  suffix,
  hint,
  delay = 0,
}: {
  label: string;
  value?: string;
  numericValue?: number;
  suffix?: string;
  hint?: string;
  delay?: number;
}) {
  return (
    <div className="bg-background p-5 lg:p-6">
      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </p>
      <p className="font-display text-2xl tabular-nums tracking-tight">
        {numericValue !== undefined ? (
          <AnimatedNumber
            value={numericValue}
            suffix={suffix}
            decimals={suffix === "%" ? 1 : 0}
            delay={delay}
          />
        ) : (
          value
        )}
      </p>
      {hint ? <p className="mt-0.5 text-[10px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function CopyButton({
  label,
  copied,
  onClick,
}: {
  label: string;
  copied: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="rounded-full font-mono text-xs"
      onClick={onClick}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-600" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {copied ? "Copied" : label}
    </Button>
  );
}
