"use client";

import { useEffect, useState, useRef } from "react";

function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
}: {
  end: number | string;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (typeof end !== "number") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, hasAnimated]);

  if (typeof end !== "number") {
    return (
      <div className="text-6xl lg:text-8xl font-display tracking-tight">
        {prefix}
        {end}
        {suffix}
      </div>
    );
  }

  return (
    <div ref={ref} className="text-6xl lg:text-8xl font-display tracking-tight">
      {prefix}
      {count.toLocaleString("en-US")}
      {suffix}
    </div>
  );
}

const metrics = [
  {
    value: 240,
    suffix: "M",
    label: "Daily capacity",
    note: "240 million clicks per day. Every click on every link you create is handled instantly with no limits.",
  },
  {
    value: 20,
    suffix: "ms",
    label: "Redirect speed",
    note: "20ms redirects. People arrive before they even see the redirect — it feels instant.",
  },
  {
    value: 100,
    suffix: "%",
    label: "Reliability",
    note: "100% uptime for every link. Not one person was sent to an error page.",
  },
  {
    value: 5,
    suffix: "yr",
    label: "Link lifetime",
    note: "Every link you create stays alive for 5 years — no surprise expirations, no broken URLs.",
  },
];

export function MetricsSection() {
  const [time, setTime] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let interval: number | undefined;
    if (isVisible) {
      const updateTime = () => setTime(new Date().toLocaleTimeString());
      updateTime();
      interval = window.setInterval(updateTime, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVisible]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="metrics"
      ref={sectionRef}
      className="relative py-24 lg:py-32 border-y border-foreground/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 lg:mb-24">
          <div>
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Matrices
            </span>
            <h2
              className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              Realtime analytics
              <br />
              at production scale.
            </h2>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`bg-background p-8 lg:p-12 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col gap-4">
                <div className="text-sm uppercase tracking-[0.36em] text-muted-foreground">
                  {metric.label}
                </div>
                <AnimatedCounter end={metric.value} suffix={metric.suffix} />
                <div className="mt-4 text-lg leading-7 text-muted-foreground">
                  {metric.note}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
