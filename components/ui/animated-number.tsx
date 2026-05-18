"use client";

import { useEffect, useRef, useState } from "react";
import { formatAnalyticsNumber } from "@/lib/analytics/format";
import { cn } from "@/lib/utils";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  onComplete?: () => void;
}

export function AnimatedNumber({
  value,
  duration = 900,
  delay = 0,
  className,
  decimals = 0,
  suffix = "",
  prefix = "",
  onComplete,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const [calculating, setCalculating] = useState(false);
  const frameRef = useRef<number | null>(null);
  const displayRef = useRef(0);

  useEffect(() => {
    displayRef.current = display;
  }, [display]);

  useEffect(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    const from = displayRef.current;
    const to = value;
    let start: number | null = null;
    let delayDone = false;
    let delayStart: number | null = null;

    setCalculating(true);

    const tick = (now: number) => {
      if (!delayDone) {
        if (delayStart === null) delayStart = now;
        if (now - delayStart < delay) {
          frameRef.current = requestAnimationFrame(tick);
          return;
        }
        delayDone = true;
        start = now;
      }

      if (start === null) start = now;
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const next = from + (to - from) * eased;

      setDisplay(decimals > 0 ? next : Math.round(next));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(to);
        setCalculating(false);
        onComplete?.();
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- animate from last display when value/delay changes
  }, [value, duration, delay, decimals]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : formatAnalyticsNumber(Math.round(display));

  return (
    <span
      className={cn(
        "tabular-nums transition-opacity duration-150",
        calculating && "opacity-90",
        className,
      )}
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
