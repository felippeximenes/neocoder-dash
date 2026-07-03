"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { StatusCount } from "@/types";

interface StatusPieChartProps {
  data: StatusCount[];
  colorMap: Record<string, string>;
}

export function StatusPieChart({ data, colorMap }: StatusPieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-border bg-surface text-sm text-text-secondary">
        Sem dados no momento
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={colorMap[entry.name] ?? "#6B7280"} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#111118",
              border: "1px solid #1E1E2E",
              borderRadius: 8,
              color: "#F0F0FF",
            }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#8888AA", fontSize: 13 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="flex h-72 items-center justify-center rounded-2xl border border-border bg-surface">
      <div className="h-48 w-48 animate-pulse rounded-full bg-surface-hover" />
    </div>
  );
}
