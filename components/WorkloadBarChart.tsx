"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ScorecardData } from "@/types";

interface WorkloadBarChartProps {
  data: ScorecardData[];
  unit?: string;
}

export function WorkloadBarChart({ data, unit = "" }: WorkloadBarChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-border bg-surface text-sm text-text-secondary">
        Sem dados no momento
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 12 }}>
          <CartesianGrid horizontal={false} stroke="#1E1E2E" />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fill: "#8888AA", fontSize: 12 }}
            tickFormatter={(value) => `${value}${unit}`}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={120}
            tick={{ fill: "#8888AA", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "#1A1A24" }}
            contentStyle={{
              background: "#111118",
              border: "1px solid #1E1E2E",
              borderRadius: 8,
              color: "#F0F0FF",
            }}
            formatter={(value: number) => [`${value}${unit}`, "Valor"]}
          />
          <Bar dataKey="value" fill="#4F8EF7" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
