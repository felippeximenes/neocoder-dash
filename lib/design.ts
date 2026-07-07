import { cache } from "react";
import {
  DATABASE_IDS,
  getDate,
  getFormulaNumber,
  getRichText,
  getSelect,
  getStatus,
  getTitle,
  parseLeadingNumber,
  queryDatabase,
} from "./notion";
import type {
  Complexidade,
  DesignCliente,
  DesignItem,
  DesignStatus,
  ScorecardData,
  StatusCount,
} from "@/types";

function normalize(page: Awaited<ReturnType<typeof queryDatabase>>[number]): DesignItem {
  const properties = page.properties;
  return {
    id: page.id,
    job: getTitle(properties, "Job"),
    cliente: (getSelect(properties, "Cliente") || "NEOCODER") as DesignCliente,
    status: (getStatus(properties, "Em Ajuste") || "Em andamento") as DesignStatus,
    responsavelExterno: getSelect(properties, "Responsável externo"),
    percentualConclusao: getFormulaNumber(properties, "% Conclusão"),
    alteracoes: parseLeadingNumber(getRichText(properties, "Alterações")),
    complexidade: (getRichText(properties, "Complexidade") || "Baixa") as Complexidade,
    prazo: getDate(properties, "Prazo"),
    entrega: getDate(properties, "Entrega"),
  };
}

export const getDesignItems = cache(async (): Promise<DesignItem[]> => {
  const pages = await queryDatabase(DATABASE_IDS.design);
  return pages.map(normalize);
});

export function getDesignScorecards(items: DesignItem[]) {
  return {
    emAndamento: items.filter((i) => i.status === "Em andamento").length,
    aguardandoAprovacao: items.filter((i) => i.status === "Aguardando aprovação").length,
    aguardandoInformacoes: items.filter((i) => i.status === "Aguardando informações").length,
    aprovado: items.filter((i) => i.status === "Aprovado").length,
    altoRetrabalho: items.filter((i) => i.alteracoes > 3).length,
  };
}

export function getDesignStatusDistribution(items: DesignItem[]): StatusCount[] {
  const statuses: DesignStatus[] = [
    "Em andamento",
    "Aprovado",
    "Aguardando aprovação",
    "Aguardando informações",
    "Em Ajuste",
  ];
  return statuses.map((status) => ({
    name: status,
    value: items.filter((i) => i.status === status).length,
  }));
}

export function getDesignWorkloadByResponsible(items: DesignItem[]): ScorecardData[] {
  const active = items.filter((i) => i.status !== "Aprovado");
  const counts = new Map<string, number>();
  for (const item of active) {
    const name = item.responsavelExterno || "Sem responsável";
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export function getDesignTableRows(items: DesignItem[]): DesignItem[] {
  return items
    .filter((i) => i.status !== "Aprovado")
    .sort((a, b) => {
      if (!a.prazo) return 1;
      if (!b.prazo) return -1;
      return new Date(a.prazo).getTime() - new Date(b.prazo).getTime();
    });
}
