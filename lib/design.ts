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
  Risco,
  ScorecardData,
  SolicitanteArea,
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
    solicitanteArea: (getSelect(properties, "Solicitante (Área)") || null) as SolicitanteArea | null,
    percentualConclusao: getFormulaNumber(properties, "% Conclusão"),
    alteracoes: parseLeadingNumber(getRichText(properties, "Alterações")),
    complexidade: (getRichText(properties, "Complexidade") || "Baixa") as Complexidade,
    risco: (getSelect(properties, "Risco") || null) as Risco | null,
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

export function getDesignOcupacaoPercentual(items: DesignItem[]): ScorecardData[] {
  const active = items.filter((i) => i.status !== "Aprovado");
  const total = active.length;
  return getDesignWorkloadByResponsible(items).map(({ label, value }) => ({
    label,
    value: total > 0 ? Math.round((value / total) * 100) : 0,
  }));
}

export function getDesignItemsByCliente(items: DesignItem[]): Map<DesignCliente, DesignItem[]> {
  const grouped = new Map<DesignCliente, DesignItem[]>();
  for (const item of items) {
    const list = grouped.get(item.cliente) ?? [];
    list.push(item);
    grouped.set(item.cliente, list);
  }
  return grouped;
}

export function getSituacaoPrazo(item: DesignItem): "Atrasado" | "No prazo" | "—" {
  if (!item.prazo) return "—";
  if (item.status === "Aprovado") return "No prazo";
  return new Date(item.prazo).getTime() < Date.now() ? "Atrasado" : "No prazo";
}

export function getDesignClienteSummary(items: DesignItem[]) {
  const ativos = items.filter((i) => i.status !== "Aprovado");
  const concluidoMedio =
    ativos.length > 0
      ? Math.round(ativos.reduce((sum, i) => sum + i.percentualConclusao, 0) / ativos.length)
      : 0;
  const riscoAlto = ativos.filter((i) => i.risco === "Alto").length;
  const emAtraso = ativos.filter((i) => getSituacaoPrazo(i) === "Atrasado").length;
  return { ativos: ativos.length, concluidoMedio, riscoAlto, emAtraso };
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
