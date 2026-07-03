import { cache } from "react";
import {
  DATABASE_IDS,
  getDate,
  getPeopleNames,
  getSelect,
  getTitle,
  queryDatabase,
} from "./notion";
import type { Plataforma, SmmItem, SmmStatus, StatusCount } from "@/types";

const SMM_CUTOFF_DATE = "2026-01-01";

function normalize(page: Awaited<ReturnType<typeof queryDatabase>>[number]): SmmItem {
  const properties = page.properties;
  return {
    id: page.id,
    name: getTitle(properties, "Name"),
    status: (getSelect(properties, "Status 1") || "Não iniciada") as SmmStatus,
    assign: getPeopleNames(properties, "Assign"),
    plataforma: (getSelect(properties, "Plataforma") || "Instagram") as Plataforma,
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
