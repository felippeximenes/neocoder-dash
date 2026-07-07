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
  parseYesNoPercent,
  queryDatabase,
} from "./notion";
import type { Cliente, EsteiraItem, EsteiraStatus, Prioridade, Recorrencia, StatusCount } from "@/types";

function parseDiasProducao(text: string): number {
  if (/ainda a fazer/i.test(text)) return 0;
  const match = text.match(/(\d+(?:\.\d+)?)\s*dias?/i);
  return match ? parseFloat(match[1]) : 0;
}

function normalize(page: Awaited<ReturnType<typeof queryDatabase>>[number]): EsteiraItem {
  const properties = page.properties;
  const concluidoTag = getMultiSelect(properties, "(%) Concluido").find((tag) =>
    /^\d+(?:\.\d+)?%$/.test(tag.trim())
  );
  const tempoProducaoDias = parseDiasProducao(getSelect(properties, "Tempo de produção"));
  const escopoEntregueDias = parseDiasProducao(getSelect(properties, "Escopo já Entregue"));
  return {
    id: page.id,
    nomeTarefa: getTitle(properties, "Nome da tarefa"),
    status: (getStatus(properties, "Status") || "Em andamento") as EsteiraStatus,
    responsavel: getPeopleNames(properties, "Responsável"),
    cliente: (getSelect(properties, "Cliente") || null) as Cliente | null,
    recorrencia: (getSelect(properties, "Recorrência") || null) as Recorrencia | null,
    retrabalho: parseLeadingNumber(getRichText(properties, "Retrabalho (%)")),
    percentualConcluido: concluidoTag ? parsePercent(concluidoTag) : 0,
    percentualEscopoConcluido:
      tempoProducaoDias > 0 ? Math.round((escopoEntregueDias / tempoProducaoDias) * 100) : 0,
    percentualAgendado: parseYesNoPercent(getRichText(properties, "Agendamento")),
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
    naoIniciado: items.filter((i) => i.status === "Não iniciado").length,
    emAndamento: items.filter((i) => i.status === "Em andamento").length,
    aprovado: items.filter((i) => i.status === "Aprovado").length,
    concluido: items.filter((i) => i.status === "Concluído").length,
    emAtraso: items.filter((i) => i.diasAtraso > 0 && i.status !== "Concluído").length,
  };
}

export function getEsteiraStatusDistribution(items: EsteiraItem[]): StatusCount[] {
  const statuses: EsteiraStatus[] = ["Não iniciado", "Em andamento", "Aprovado", "Concluído"];
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
