"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { StatusCount } from "@/types";
import { Card } from "@/components/Card";
import { cn } from "@/lib/utils";

interface StatusPieChartProps {
  data: StatusCount[];
  colorMap: Record<string, string>;
  centerLabel?: string;
  className?: string;
}

export function StatusPieChart({
  data,
  colorMap,
  centerLabel = "TOTAL",
  className,
}: StatusPieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-border bg-surface text-sm text-text-secondary backdrop-blur-md">
        Sem dados no momento
      </div>
    );
  }

  return (
    <Card className={cn("flex flex-col justify-center", className)}>
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <div className="relative h-[190px] w-[190px] flex-none">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={85}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={colorMap[entry.name] ?? "#8A8FA8"} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-extrabold text-text-primary">{total}</span>
            <span className="text-[10px] font-semibold tracking-wider text-text-secondary">
              {centerLabel}
            </span>
          </div>
        </div>
        <div className="flex w-full flex-1 flex-col gap-3">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2.5 text-sm">
              <span
                className="h-2.5 w-2.5 flex-none rounded-sm"
                style={{ background: colorMap[d.name] ?? "#8A8FA8" }}
              />
              <span className="min-w-0 flex-1 truncate text-text-secondary">{d.name}</span>
              <span className="font-display flex-none font-bold text-text-primary">
                {total > 0 ? Math.round((d.value / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function ChartSkeleton() {
  return (
    <div className="flex h-72 items-center justify-center rounded-2xl border border-border bg-surface backdrop-blur-md">
      <div className="h-48 w-48 animate-pulse rounded-full bg-surface-hover" />
    </div>
  );
}
