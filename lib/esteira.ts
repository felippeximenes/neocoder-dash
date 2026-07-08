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
import type {
  AlertaItem,
  Cliente,
  EsteiraItem,
  EsteiraStatus,
  Prioridade,
  Recorrencia,
  StatusCount,
} from "@/types";

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

export function getEsteiraAlerts(items: EsteiraItem[]): AlertaItem[] {
  const alerts: AlertaItem[] = [];

  const atrasadas = items
    .filter((i) => i.diasAtraso > 0 && i.status !== "Concluído")
    .sort((a, b) => b.diasAtraso - a.diasAtraso);
  if (atrasadas.length > 0) {
    const pior = atrasadas[0];
    alerts.push({
      tone: "red",
      title: `${atrasadas.length} esteira${atrasadas.length === 1 ? "" : "s"} em atraso`,
      desc: `${pior.nomeTarefa} está ${pior.diasAtraso} dia${pior.diasAtraso === 1 ? "" : "s"} atrasada, prioridade ${pior.prioridade.toLowerCase()}.`,
    });
  }

  const total = items.length;
  const ativas = items.filter((i) => i.status !== "Concluído").length;
  if (total > 0) {
    const pct = Math.round((ativas / total) * 100);
    alerts.push({
      tone: "green",
      title: `${pct}% da esteira ativa`,
      desc: `${ativas} de ${total} esteira${total === 1 ? "" : "s"} em produção neste ciclo.`,
    });
  }

  const comRetrabalho = items.filter((i) => i.retrabalho > 0);
  if (comRetrabalho.length > 0) {
    const maxRetrabalho = Math.max(...comRetrabalho.map((i) => i.retrabalho));
    alerts.push({
      tone: "purple",
      title: "Retrabalho identificado",
      desc: `${comRetrabalho.length} esteira${comRetrabalho.length === 1 ? "" : "s"} com retrabalho, máximo de ${maxRetrabalho}% registrado.`,
    });
  } else if (total > 0) {
    alerts.push({
      tone: "purple",
      title: "Sem retrabalho registrado",
      desc: "Nenhuma esteira com retrabalho neste momento.",
    });
  }

  return alerts;
}
