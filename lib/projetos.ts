import { cache } from "react";
import {
  DATABASE_IDS,
  getDate,
  getFormulaNumber,
  getPeopleNames,
  getSelect,
  getStatus,
  getTitle,
  queryDatabase,
} from "./notion";
import type { Cliente, ProjetoPrioridade, ProjetoStatus, ProjetoTask } from "@/types";

const CLIENT_DBS: { cliente: Cliente; databaseId: string; titleKey: string }[] = [
  { cliente: "KOTAI", databaseId: DATABASE_IDS.kotaiTasks, titleKey: "Item" },
  { cliente: "LIBERPAY", databaseId: DATABASE_IDS.liberpayTasks, titleKey: "Item" },
  { cliente: "NEOCODER", databaseId: DATABASE_IDS.neocoderTasks, titleKey: "Task Name" },
];

function normalize(
  page: Awaited<ReturnType<typeof queryDatabase>>[number],
  cliente: Cliente,
  titleKey: string
): ProjetoTask {
  const properties = page.properties;
  return {
    id: page.id,
    cliente,
    item: getTitle(properties, titleKey),
    status: (getStatus(properties, "Operation Status") || "to do") as ProjetoStatus,
    deadline: getDate(properties, "Deadline"),
    diasAtraso: getFormulaNumber(properties, "Days of Delay"),
    area: getSelect(properties, "Area"),
    responsavel: getPeopleNames(properties, "Person"),
    prioridade: (getSelect(properties, "Priority") || null) as ProjetoPrioridade | null,
  };
}

export const getProjetoTasks = cache(async (): Promise<ProjetoTask[]> => {
  const results = await Promise.all(
    CLIENT_DBS.map(async ({ cliente, databaseId, titleKey }) => {
      const pages = await queryDatabase(databaseId);
      return pages.map((p) => normalize(p, cliente, titleKey)).filter((t) => t.item.trim().length > 0);
    })
  );
  return results.flat();
});

export function getProjetoItemsByCliente(items: ProjetoTask[]): Map<Cliente, ProjetoTask[]> {
  const grouped = new Map<Cliente, ProjetoTask[]>();
  for (const item of items) {
    const list = grouped.get(item.cliente) ?? [];
    list.push(item);
    grouped.set(item.cliente, list);
  }
  return grouped;
}

export function getSituacaoAtraso(item: ProjetoTask): "Atrasado" | "No prazo" | "—" {
  if (!item.deadline) return "—";
  return item.diasAtraso > 0 ? "Atrasado" : "No prazo";
}

export function getProjetoClienteSummary(items: ProjetoTask[]) {
  const ativos = items.filter((i) => i.status !== "Done");
  const emAtraso = ativos.filter((i) => getSituacaoAtraso(i) === "Atrasado").length;
  const bloqueados = ativos.filter((i) => i.status === "Blocked").length;
  return { ativos: ativos.length, emAtraso, bloqueados };
}

export function getProjetoTableRows(items: ProjetoTask[]): ProjetoTask[] {
  return items
    .filter((i) => i.status !== "Done")
    .sort((a, b) => b.diasAtraso - a.diasAtraso);
}
