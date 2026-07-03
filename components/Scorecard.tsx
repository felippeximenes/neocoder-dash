import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function Scorecard({ label, value, icon: Icon, accent = "gray" }: ScorecardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border-accent">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium uppercase tracking-wider text-gray-400">
          {label}
        </span>
        {Icon && <Icon size={18} className={cn(ACCENT_MAP[accent])} strokeWidth={1.75} />}
      </div>
      <span className="text-5xl font-black text-white">{value}</span>
    </div>
  );
}

export function ScorecardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6">
      <div className="h-4 w-24 animate-pulse rounded bg-surface-hover" />
      <div className="h-10 w-16 animate-pulse rounded bg-surface-hover" />
    </div>
  );
}
