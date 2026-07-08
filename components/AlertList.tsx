import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { Card } from "@/components/Card";
import type { AlertaItem } from "@/types";

const TONE_STYLE: Record<AlertaItem["tone"], { bg: string; color: string; icon: typeof AlertTriangle }> = {
  red: { bg: "bg-brand-red/15", color: "text-brand-red", icon: AlertTriangle },
  green: { bg: "bg-brand-green/15", color: "text-brand-green", icon: CheckCircle2 },
  purple: { bg: "bg-brand-purple/15", color: "text-brand-purple", icon: RefreshCw },
};

interface AlertListProps {
  alerts: AlertaItem[];
}

export function AlertList({ alerts }: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <Card className="flex h-full items-center justify-center text-sm text-text-secondary">
        Nenhum destaque no momento.
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-3">
      {alerts.map((alert, i) => {
        const { bg, color, icon: Icon } = TONE_STYLE[alert.tone];
        return (
          <div
            key={i}
            className="flex items-start gap-3.5 rounded-xl border border-border bg-surface-solid/40 p-4"
          >
            <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg ${bg} ${color}`}>
              <Icon size={18} strokeWidth={2} />
            </span>
            <div>
              <div className="font-display text-sm font-semibold text-text-primary">{alert.title}</div>
              <div className="mt-0.5 text-xs leading-relaxed text-text-secondary">{alert.desc}</div>
            </div>
          </div>
        );
      })}
    </Card>
  );
}
