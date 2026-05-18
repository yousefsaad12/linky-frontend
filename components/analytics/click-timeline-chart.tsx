"use client";

import { useMemo, useState } from "react";

interface ClickTimelineChartProps {
  data: { date: string; clicks: number }[];
  height: number;
  gradientId?: string;
}

function buildAreaPath(
  values: number[],
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number },
) {
  if (values.length === 0) return "";

  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const max = Math.max(...values, 1);
  const step = values.length > 1 ? innerW / (values.length - 1) : 0;

  const points = values.map((value, index) => {
    const x = padding.left + index * step;
    const y = padding.top + innerH - (value / max) * innerH;
    return { x, y };
  });

  const baseline = padding.top + innerH;
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  return `${line} L${points[points.length - 1]?.x ?? padding.left},${baseline} L${points[0]?.x ?? padding.left},${baseline} Z`;
}

function buildLinePath(
  values: number[],
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number },
) {
  if (values.length === 0) return "";

  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const max = Math.max(...values, 1);
  const step = values.length > 1 ? innerW / (values.length - 1) : 0;

  return values
    .map((value, index) => {
      const x = padding.left + index * step;
      const y = padding.top + innerH - (value / max) * innerH;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

export function ClickTimelineChart({
  data,
  height,
  gradientId = "clickGradient",
}: ClickTimelineChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const values = useMemo(() => data.map((d) => d.clicks), [data]);
  const width = 640;
  const padding = { top: 8, right: 8, bottom: 24, left: 36 };
  const areaPath = useMemo(
    () => buildAreaPath(values, width, height, padding),
    [values, height],
  );
  const linePath = useMemo(
    () => buildLinePath(values, width, height, padding),
    [values, height],
  );

  const max = Math.max(...values, 1);
  const innerH = height - padding.top - padding.bottom;
  const step =
    values.length > 1
      ? (width - padding.left - padding.right) / (values.length - 1)
      : 0;

  const yTicks = [0, Math.ceil(max / 2), max];
  const labelStride = Math.max(1, Math.ceil(data.length / 6));

  return (
    <div
      className="relative w-full"
      style={{ height }}
      onMouseLeave={() => setHoverIndex(null)}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full text-foreground"
        preserveAspectRatio="none"
        role="img"
        aria-label="Click timeline chart"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity={0.2} />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
          </linearGradient>
        </defs>

        {yTicks.map((tick) => {
          const y = padding.top + innerH - (tick / max) * innerH;
          return (
            <line
              key={tick}
              x1={padding.left}
              x2={width - padding.right}
              y1={y}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeDasharray="3 3"
            />
          );
        })}

        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={linePath} fill="none" stroke="currentColor" strokeWidth={2} />

        {data.map((point, index) => {
          const x = padding.left + index * step;
          const y = padding.top + innerH - (point.clicks / max) * innerH;
          return (
            <g key={`${point.date}-${index}`}>
              <rect
                x={x - step / 2}
                y={padding.top}
                width={Math.max(step, 1)}
                height={innerH}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(index)}
              />
              {hoverIndex === index ? (
                <circle cx={x} cy={y} r={3} fill="currentColor" />
              ) : null}
            </g>
          );
        })}

        {data.map((point, index) => {
          if (index % labelStride !== 0 && index !== data.length - 1) {
            return null;
          }
          const x = padding.left + index * step;
          return (
            <text
              key={`label-${point.date}`}
              x={x}
              y={height - 6}
              textAnchor="middle"
              fontSize={10}
              fill="currentColor"
              opacity={0.5}
            >
              {point.date}
            </text>
          );
        })}

        {yTicks.map((tick) => {
          const y = padding.top + innerH - (tick / max) * innerH;
          return (
            <text
              key={`y-${tick}`}
              x={padding.left - 6}
              y={y + 3}
              textAnchor="end"
              fontSize={10}
              fill="currentColor"
              opacity={0.5}
            >
              {tick}
            </text>
          );
        })}
      </svg>

      {hoverIndex !== null && data[hoverIndex] ? (
        <div
          className="pointer-events-none absolute rounded-lg border border-foreground/12 bg-background px-2 py-1 text-[11px] font-mono shadow-sm"
          style={{
            left: `${((padding.left + hoverIndex * step) / width) * 100}%`,
            top: 8,
            transform: "translateX(-50%)",
          }}
        >
          <span className="text-muted-foreground">{data[hoverIndex].date}</span>
          <span className="ml-2">{data[hoverIndex].clicks} clicks</span>
        </div>
      ) : null}
    </div>
  );
}
