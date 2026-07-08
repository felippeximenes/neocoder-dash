import { Instagram, Linkedin, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  colorClass: string;
  className?: string;
}

export function Badge({ label, colorClass, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        colorClass,
        className
      )}
    >
      {label}
    </span>
  );
}

export const ESTEIRA_STATUS_BADGE: Record<string, string> = {
  "Não iniciado": "bg-brand-gray/15 text-brand-gray",
  "Em andamento": "bg-brand-blue/15 text-brand-blue",
  Aprovado: "bg-brand-purple/15 text-brand-purple",
  Concluído: "bg-brand-green/15 text-brand-green",
};

export const PRIORIDADE_BADGE: Record<string, string> = {
  Alta: "bg-brand-red/15 text-brand-red",
  Média: "bg-brand-yellow/15 text-brand-yellow",
  Baixa: "bg-brand-gray/15 text-brand-gray",
};

export const DESIGN_STATUS_BADGE: Record<string, string> = {
  "Em andamento": "bg-brand-blue/15 text-brand-blue",
  Aprovado: "bg-brand-green/15 text-brand-green",
  "Aguardando aprovação": "bg-brand-yellow/15 text-brand-yellow",
  "Aguardando informações": "bg-brand-purple/15 text-brand-purple",
  "Em Ajuste": "bg-brand-red/15 text-brand-red",
};

export const CLIENTE_BADGE: Record<string, string> = {
  LIBERPAY: "bg-client-liberpay/15 text-client-liberpay",
  NEOCODER: "bg-client-neocoder/15 text-client-neocoder",
  KOTAI: "bg-client-kotai/15 text-client-kotai",
};

export const RISCO_BADGE: Record<string, string> = {
  Baixo: "bg-brand-green/15 text-brand-green",
  Médio: "bg-brand-yellow/15 text-brand-yellow",
  Alto: "bg-brand-red/15 text-brand-red",
};

export const SITUACAO_BADGE: Record<string, string> = {
  Atrasado: "bg-brand-red/15 text-brand-red",
  "No prazo": "bg-brand-green/15 text-brand-green",
};

export const SMM_STATUS_BADGE: Record<string, string> = {
  "Não iniciada": "bg-brand-gray/15 text-brand-gray",
  "Em andamento": "bg-brand-blue/15 text-brand-blue",
  "Em revisão": "bg-brand-purple/15 text-brand-purple",
  "Em agendamento": "bg-brand-yellow/15 text-brand-yellow",
  "Em standby": "bg-brand-gray/15 text-brand-gray",
  Concluído: "bg-brand-green/15 text-brand-green",
};

export const PLATAFORMA_BADGE: Record<string, string> = {
  Instagram: "bg-brand-purple/15 text-brand-purple",
  LinkedIn: "bg-brand-blue/15 text-brand-blue",
  "Twitter/X": "bg-brand-gray/15 text-brand-gray",
};

const PLATAFORMA_ICON = {
  Instagram: Instagram,
  LinkedIn: Linkedin,
  "Twitter/X": Twitter,
} as const;

export function PlatformBadge({ platform }: { platform: keyof typeof PLATAFORMA_ICON | string }) {
  const Icon = PLATAFORMA_ICON[platform as keyof typeof PLATAFORMA_ICON];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        PLATAFORMA_BADGE[platform] ?? "bg-brand-gray/15 text-brand-gray"
      )}
    >
      {Icon && <Icon size={12} strokeWidth={2} />}
      {platform}
    </span>
  );
}
