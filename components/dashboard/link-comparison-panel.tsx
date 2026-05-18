"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Crown, GitCompareArrows, TrendingDown, TrendingUp } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { truncateUrl } from "@/lib/analytics/format";
import type { AnalyticsPeriod, LinkComparisonEntry } from "@/lib/analytics/types";
import { cn } from "@/lib/utils";

const MAX_COMPARE = 3;
const METRIC_STAGGER_MS = 70;

interface LinkComparisonPanelProps {
  entries: LinkComparisonEntry[];
  period: AnalyticsPeriod;
  availableCodes: string[];
  selectedCodes: string[];
  onSelectionChange: (codes: string[]) => void;
  recalcKey: string;
}

export function LinkComparisonPanel({
  entries,
  period,
  availableCodes,
  selectedCodes,
  onSelectionChange,
  recalcKey,
}: LinkComparisonPanelProps) {
  const [animEpoch, setAnimEpoch] = useState(0);

  useEffect(() => {
    setAnimEpoch((n) => n + 1);
  }, [recalcKey, selectedCodes.join(",")]);

  const maxPeriodClicks = useMemo(
    () => Math.max(...entries.map((e) => e.periodClicks), 1),
    [entries],
  );

  const toggleCode = (code: string) => {
    const lower = code.toLowerCase();
    const has = selectedCodes.some((c) => c.toLowerCase() === lower);
    if (has) {
      if (selectedCodes.length <= 2) return;
      onSelectionChange(selectedCodes.filter((c) => c.toLowerCase() !== lower));
      return;
    }
    if (selectedCodes.length >= MAX_COMPARE) {
      onSelectionChange([...selectedCodes.slice(1), code]);
      return;
    }
    onSelectionChange([...selectedCodes, code]);
  };

  return (
    <div className="space-y-px">
      <div className="border border-foreground/10 bg-background p-5 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GitCompareArrows className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-display text-xl">Compare links</h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-lg">
              Pick up to {MAX_COMPARE} links — metrics recalculate with a live count-up when
              you change period or selection.
            </p>
          </div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground shrink-0">
            Period · {period}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {availableCodes.map((code) => {
            const active = selectedCodes.some(
              (c) => c.toLowerCase() === code.toLowerCase(),
            );
            return (
              <button
                key={code}
                type="button"
                onClick={() => toggleCode(code)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-mono transition-all duration-300",
                  active
                    ? "bg-foreground text-background scale-100"
                    : "border border-foreground/15 text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                )}
              >
                {code}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={cn(
          "grid gap-px bg-foreground/10 border border-foreground/10 transition-opacity duration-300",
          entries.length === 1 && "grid-cols-1",
          entries.length === 2 && "grid-cols-1 md:grid-cols-2",
          entries.length >= 3 && "grid-cols-1 md:grid-cols-3",
        )}
      >
        {entries.map((entry, columnIndex) => (
          <CompareColumn
            key={`${entry.shortCode}-${animEpoch}`}
            entry={entry}
            period={period}
            columnIndex={columnIndex}
            maxPeriodClicks={maxPeriodClicks}
          />
        ))}
      </div>

      <ComparisonBars
        entries={entries}
        maxPeriodClicks={maxPeriodClicks}
        animEpoch={animEpoch}
      />
    </div>
  );
}

function CompareColumn({
  entry,
  period,
  columnIndex,
  maxPeriodClicks,
}: {
  entry: LinkComparisonEntry;
  period: AnalyticsPeriod;
  columnIndex: number;
  maxPeriodClicks: number;
}) {
  const baseDelay = columnIndex * 120;

  return (
    <div
      className={cn(
        "bg-background p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both",
      )}
      style={{ animationDelay: `${columnIndex * 80}ms` }}
    >
      <div className="flex items-start justify-between gap-2 mb-6">
        <div className="min-w-0">
          <Link
            href={`/dashboard/links/${encodeURIComponent(entry.shortCode)}`}
            className="font-mono text-lg hover:underline underline-offset-4"
          >
            {entry.shortCode}
          </Link>
          <p
            className="mt-1 text-xs text-muted-foreground truncate"
            title={entry.originalUrl}
          >
            {truncateUrl(entry.originalUrl, 32)}
          </p>
        </div>
        {entry.isLeader ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-foreground text-background px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider shrink-0">
            <Crown className="h-3 w-3" />
            Leader
          </span>
        ) : null}
      </div>

      <div className="space-y-5">
        <MetricBlock
          label={`Clicks in ${period}`}
          delay={baseDelay}
        >
          <AnimatedNumber
            value={entry.periodClicks}
            delay={baseDelay}
            className="font-display text-3xl lg:text-4xl tracking-tight"
          />
        </MetricBlock>

        <MetricBlock label="Total clicks" delay={baseDelay + METRIC_STAGGER_MS}>
          <AnimatedNumber
            value={entry.totalClicks}
            delay={baseDelay + METRIC_STAGGER_MS}
            className="font-display text-2xl tracking-tight text-muted-foreground"
          />
        </MetricBlock>

        <MetricBlock label="Share of period" delay={baseDelay + METRIC_STAGGER_MS * 2}>
          <AnimatedNumber
            value={entry.shareOfPeriod}
            decimals={1}
            suffix="%"
            delay={baseDelay + METRIC_STAGGER_MS * 2}
            className="font-display text-2xl tracking-tight"
          />
        </MetricBlock>

        <MetricBlock
          label={period === "24h" ? "Per hour (avg)" : "Per day (avg)"}
          delay={baseDelay + METRIC_STAGGER_MS * 3}
        >
          <AnimatedNumber
            value={entry.avgPerDay}
            delay={baseDelay + METRIC_STAGGER_MS * 3}
            className="font-display text-xl tracking-tight"
          />
        </MetricBlock>

        {!entry.isLeader ? (
          <div className="flex items-center gap-2 pt-2 border-t border-foreground/10">
            <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              <AnimatedNumber
                value={Math.abs(entry.vsLeaderPercent)}
                decimals={1}
                suffix="%"
                delay={baseDelay + METRIC_STAGGER_MS * 4}
                className="font-mono text-foreground"
              />{" "}
              behind leader
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 pt-2 border-t border-foreground/10">
            <TrendingUp className="h-3.5 w-3.5 text-foreground" />
            <span className="text-xs font-mono text-muted-foreground">
              Top performer this period
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 h-1.5 rounded-full bg-foreground/8 overflow-hidden">
        <AnimatedBar
          targetPercent={(entry.periodClicks / maxPeriodClicks) * 100}
          delay={baseDelay + 100}
        />
      </div>
    </div>
  );
}

function MetricBlock({
  label,
  delay,
  children,
}: {
  label: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="animate-in fade-in duration-500 fill-mode-both"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </p>
      {children}
    </div>
  );
}

function AnimatedBar({
  targetPercent,
  delay,
}: {
  targetPercent: number;
  delay: number;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(0);
    const id = window.setTimeout(() => {
      setWidth(targetPercent);
    }, delay);
    return () => clearTimeout(id);
  }, [targetPercent, delay]);

  return (
    <div
      className="h-full rounded-full bg-foreground/75 transition-[width] duration-1000 ease-out"
      style={{ width: `${width}%` }}
    />
  );
}

function ComparisonBars({
  entries,
  maxPeriodClicks,
  animEpoch,
}: {
  entries: LinkComparisonEntry[];
  maxPeriodClicks: number;
  animEpoch: number;
}) {
  return (
    <div className="border border-foreground/10 bg-background p-6 lg:p-8">
      <h3 className="font-display text-lg mb-6">Head-to-head · period clicks</h3>
      <ul className="space-y-4" key={animEpoch}>
        {entries.map((entry, i) => (
          <li key={entry.shortCode}>
            <div className="flex items-center justify-between text-xs mb-2 font-mono">
              <span>{entry.shortCode}</span>
              <span className="text-muted-foreground tabular-nums">
                <AnimatedNumber value={entry.periodClicks} delay={i * 90} />
              </span>
            </div>
            <div className="h-2 rounded-full bg-foreground/8 overflow-hidden">
              <AnimatedBar
                targetPercent={(entry.periodClicks / maxPeriodClicks) * 100}
                delay={150 + i * 100}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

