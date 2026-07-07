"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ScorecardData } from "@/types";
import { Card } from "@/components/Card";

interface WorkloadBarChartProps {
  data: ScorecardData[];
  unit?: string;
}

export function WorkloadBarChart({ data, unit = "" }: WorkloadBarChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-border bg-surface text-sm text-text-secondary backdrop-blur-md">
        Sem dados no momento
      </div>
    );
  }

  return (
    <Card>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 12 }}>
          <CartesianGrid horizontal={false} stroke="rgba(120,90,200,0.12)" />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fill: "#8A8FA8", fontSize: 12 }}
            tickFormatter={(value) => `${value}${unit}`}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={120}
            tick={{ fill: "#8A8FA8", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "rgba(139,92,246,0.08)" }}
            contentStyle={{
              background: "rgba(10,11,26,0.95)",
              border: "1px solid rgba(120,90,200,0.3)",
              borderRadius: 8,
              color: "#E7E8F2",
            }}
            formatter={(value: number) => [`${value}${unit}`, "Valor"]}
          />
          <Bar dataKey="value" fill="#A855F7" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
