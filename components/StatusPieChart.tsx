"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { StatusCount } from "@/types";
import { Card } from "@/components/Card";

interface StatusPieChartProps {
  data: StatusCount[];
  colorMap: Record<string, string>;
}

export function StatusPieChart({ data, colorMap }: StatusPieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-border bg-surface text-sm text-text-secondary backdrop-blur-md">
        Sem dados no momento
      </div>
    );
  }

  return (
    <Card>
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
              <Cell key={entry.name} fill={colorMap[entry.name] ?? "#8A8FA8"} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "rgba(10,11,26,0.95)",
              border: "1px solid rgba(120,90,200,0.3)",
              borderRadius: 8,
              color: "#E7E8F2",
            }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#9498B2", fontSize: 13 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
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
