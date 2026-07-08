import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/Card";

interface ScorecardProps {
  label: string;
  value: number;
  icon?: LucideIcon;
  accent?: "blue" | "green" | "yellow" | "red" | "purple" | "gray";
}

const ACCENT_MAP: Record<NonNullable<ScorecardProps["accent"]>, string> = {
  blue: "text-brand-blue",
  green: "text-brand-green",
  yellow: "text-brand-yellow",
  red: "text-brand-red",
  purple: "text-brand-purple",
  gray: "text-brand-gray",
};

const STRIP_MAP: Record<NonNullable<ScorecardProps["accent"]>, string> = {
  blue: "bg-brand-blue",
  green: "bg-brand-green",
  yellow: "bg-brand-yellow",
  red: "bg-brand-red",
  purple: "bg-brand-purple",
  gray: "bg-brand-gray",
};

export function Scorecard({ label, value, icon: Icon, accent = "gray" }: ScorecardProps) {
  return (
    <Card className="flex flex-col gap-2" stripColor={STRIP_MAP[accent]}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {label}
        </span>
        {Icon && <Icon size={18} className={cn(ACCENT_MAP[accent])} strokeWidth={1.75} />}
      </div>
      <span className="font-display text-5xl font-extrabold text-text-primary">{value}</span>
    </Card>
  );
}

export function ScorecardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6 backdrop-blur-md">
      <div className="h-4 w-24 animate-pulse rounded bg-surface-hover" />
      <div className="h-10 w-16 animate-pulse rounded bg-surface-hover" />
    </div>
  );
}
