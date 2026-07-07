import { cache } from "react";
import {
  DATABASE_IDS,
  getDate,
  getMultiSelect,
  getNumber,
  getPeopleNames,
  getRichText,
  getSelect,
  getStatus,
  getTitle,
  parseLeadingNumber,
  parsePercent,
  queryDatabase,
} from "./notion";
import type { EsteiraItem, EsteiraStatus, Prioridade, StatusCount } from "@/types";

function normalize(page: Awaited<ReturnType<typeof queryDatabase>>[number]): EsteiraItem {
  const properties = page.properties;
  const concluidoTag = getMultiSelect(properties, "(%) Concluido").find((tag) =>
    /^\d+(?:\.\d+)?%$/.test(tag.trim())
  );
  return {
    id: page.id,
    nomeTarefa: getTitle(properties, "Nome da tarefa"),
    status: (getStatus(properties, "Status") || "Em andamento") as EsteiraStatus,
    responsavel: getPeopleNames(properties, "Responsável"),
    retrabalho: parseLeadingNumber(getRichText(properties, "Retrabalho (%)")),
    percentualConcluido: concluidoTag ? parsePercent(concluidoTag) : 0,
    diasAtraso: getNumber(properties, "Dias de atraso"),
    prioridade: (getSelect(properties, "Prioridade") || "Baixa") as Prioridade,
    dataEntrega: getDate(properties, "Data Entrega"),
  };
}

export const getEsteiraItems = cache(async (): Promise<EsteiraItem[]> => {
  const pages = await queryDatabase(DATABASE_IDS.esteira);
  return pages.map(normalize);
});

export function getEsteiraScorecards(items: EsteiraItem[]) {
  return {
    emAndamento: items.filter((i) => i.status === "Em andamento").length,
    aprovado: items.filter((i) => i.status === "Aprovado").length,
    concluido: items.filter((i) => i.status === "Concluído").length,
    emAtraso: items.filter((i) => i.diasAtraso > 0 && i.status !== "Concluído").length,
  };
}

export function getEsteiraStatusDistribution(items: EsteiraItem[]): StatusCount[] {
  const statuses: EsteiraStatus[] = ["Em andamento", "Aprovado", "Concluído"];
  return statuses.map((status) => ({
    name: status,
    value: items.filter((i) => i.status === status).length,
  }));
}

export function getEsteiraTableRows(items: EsteiraItem[]): EsteiraItem[] {
  return items
    .filter((i) => i.status !== "Concluído")
    .sort((a, b) => b.diasAtraso - a.diasAtraso);
}
