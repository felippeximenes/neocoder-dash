import { cache } from "react";
import {
  DATABASE_IDS,
  getDate,
  getMultiSelect,
  getPeopleNames,
  getStatus,
  getTitle,
  queryDatabase,
} from "./notion";
import type {
  Plataforma,
  ProximoVencimento,
  ScorecardData,
  SmmItem,
  SmmStatus,
  StatusCount,
} from "@/types";

const SMM_CUTOFF_DATE = "2026-01-01";

const PLATAFORMA_MAP: Record<string, Plataforma> = {
  Instagram: "Instagram",
  Linkedin: "LinkedIn",
  LinkedIn: "LinkedIn",
  X: "Twitter/X",
  Twitter: "Twitter/X",
  "Twitter/X": "Twitter/X",
};

function normalize(page: Awaited<ReturnType<typeof queryDatabase>>[number]): SmmItem {
  const properties = page.properties;
  const [primeiraPlataforma] = getMultiSelect(properties, "Plataforma");
  return {
    id: page.id,
    name: getTitle(properties, "Name"),
    status: (getStatus(properties, "Status 1") || "Não iniciada") as SmmStatus,
    assign: getPeopleNames(properties, "Assign"),
    plataforma: PLATAFORMA_MAP[primeiraPlataforma ?? ""] ?? "Instagram",
    startData: getDate(properties, "Start Data"),
    finalData: getDate(properties, "Final Data"),
  };
}

export const getSmmItems = cache(async (): Promise<SmmItem[]> => {
  const pages = await queryDatabase(DATABASE_IDS.smm);
  return pages.map(normalize);
});

export function getSmmScorecards(items: SmmItem[]) {
  return {
    emAndamento: items.filter((i) => i.status === "Em andamento").length,
    naoIniciada: items.filter((i) => i.status === "Não iniciada").length,
    emAgendamento: items.filter((i) => i.status === "Em agendamento").length,
    emRevisao: items.filter((i) => i.status === "Em revisão").length,
  };
}

export function getSmmStatusDistribution(items: SmmItem[]): StatusCount[] {
  const statuses: SmmStatus[] = [
    "Não iniciada",
    "Em andamento",
    "Em revisão",
    "Em agendamento",
    "Em standby",
  ];
  return statuses.map((status) => ({
    name: status,
    value: items.filter((i) => i.status === status).length,
  }));
}

export function getSmmTableRows(items: SmmItem[]): SmmItem[] {
  return items
    .filter(
      (i) =>
        i.status !== "Concluído" &&
        i.startData !== null &&
        i.startData >= SMM_CUTOFF_DATE
    )
    .sort((a, b) => (a.startData ?? "").localeCompare(b.startData ?? ""));
}

const PLATAFORMA_COLOR: Record<Plataforma, string> = {
  Instagram: "#A855F7",
  LinkedIn: "#6366F1",
  "Twitter/X": "#8A8FA8",
};

export function getSmmPlatformVolume(items: SmmItem[]): ScorecardData[] {
  const counts = new Map<Plataforma, number>();
  for (const item of items) {
    counts.set(item.plataforma, (counts.get(item.plataforma) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value, color: PLATAFORMA_COLOR[label] }))
    .sort((a, b) => b.value - a.value);
}

export function getSmmProximosVencimentos(items: SmmItem[], limit = 3): ProximoVencimento[] {
  return getSmmTableRows(items)
    .slice(0, limit)
    .map((item) => ({ nome: item.name, data: item.finalData ?? item.startData }));
}
