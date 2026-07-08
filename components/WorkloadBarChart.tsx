import type { ScorecardData } from "@/types";
import { Card } from "@/components/Card";

interface BarRowsProps {
  data: ScorecardData[];
  unit?: string;
  colorFrom?: string;
  colorTo?: string;
}

export function BarRows({ data, unit = "", colorFrom = "#7C3AED", colorTo = "#A855F7" }: BarRowsProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex flex-col gap-4">
      {data.map((d) => {
        const width = unit === "%" ? d.value : (d.value / max) * 100;
        const background = d.color
          ? d.color
          : `linear-gradient(90deg, ${colorFrom}, ${colorTo})`;
        return (
          <div key={d.label}>
            <div className="mb-1.5 flex items-baseline justify-between gap-2">
              <span className="truncate text-sm font-medium text-text-secondary">{d.label}</span>
              <span className="font-display flex-none text-sm font-bold text-text-primary">
                {d.value}
                {unit}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.max(width, 2)}%`, background }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

type WorkloadBarChartProps = BarRowsProps;

export function WorkloadBarChart(props: WorkloadBarChartProps) {
  if (props.data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-border bg-surface text-sm text-text-secondary backdrop-blur-md">
        Sem dados no momento
      </div>
    );
  }

  return (
    <Card>
      <BarRows {...props} />
    </Card>
  );
}
