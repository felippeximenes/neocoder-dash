import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const DATABASE_IDS = {
  esteira: "33e0e05d1eff803f941bd7227953cee1",
  design: "33e0e05d1eff80d094ddfca604d79a91",
  smm: "1130e05d1eff8061977af263fa16b90d",
};

const dataSourceIdCache = new Map<string, string>();

async function resolveDataSourceId(databaseId: string): Promise<string> {
  const cached = dataSourceIdCache.get(databaseId);
  if (cached) return cached;

  const database = await notion.databases.retrieve({ database_id: databaseId });
  const dataSourceId = "data_sources" in database ? database.data_sources[0]?.id : undefined;
  if (!dataSourceId) {
    throw new Error(
      `A database ${databaseId} não tem nenhuma data source acessível pela integração. ` +
        `Verifique o compartilhamento no Notion (Connections) dessa database especificamente.`
    );
  }
  dataSourceIdCache.set(databaseId, dataSourceId);
  return dataSourceId;
}

export async function queryDatabase(
  databaseId: string,
  filter?: Record<string, unknown>,
  sorts?: Record<string, unknown>[]
) {
  const dataSourceId = await resolveDataSourceId(databaseId);
  const results: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: filter as never,
      sorts: sorts as never,
      start_cursor: cursor,
    });
    results.push(...(response.results as PageObjectResponse[]));
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return results;
}

type NotionProperties = PageObjectResponse["properties"];

export function getTitle(properties: NotionProperties, key: string): string {
  const prop = properties[key];
  if (prop?.type !== "title") return "";
  return prop.title.map((t) => t.plain_text).join("");
}

export function getSelect(properties: NotionProperties, key: string): string {
  const prop = properties[key];
  if (prop?.type !== "select") return "";
  return prop.select?.name ?? "";
}

export function getNumber(properties: NotionProperties, key: string): number {
  const prop = properties[key];
  if (prop?.type !== "number") return 0;
  return prop.number ?? 0;
}

export function getPeopleNames(properties: NotionProperties, key: string): string {
  const prop = properties[key];
  if (prop?.type !== "people") return "";
  return prop.people.map((p) => ("name" in p ? p.name ?? "" : "")).join(", ");
}

export function getDate(properties: NotionProperties, key: string): string | null {
  const prop = properties[key];
  if (prop?.type !== "date") return null;
  return prop.date?.start ?? null;
}

export function getStatus(properties: NotionProperties, key: string): string {
  const prop = properties[key];
  if (prop?.type !== "status") return "";
  return prop.status?.name ?? "";
}

export function getRichText(properties: NotionProperties, key: string): string {
  const prop = properties[key];
  if (prop?.type !== "rich_text") return "";
  return prop.rich_text.map((t) => t.plain_text).join("");
}

export function getMultiSelect(properties: NotionProperties, key: string): string[] {
  const prop = properties[key];
  if (prop?.type !== "multi_select") return [];
  return prop.multi_select.map((o) => o.name);
}

export function getFormulaNumber(properties: NotionProperties, key: string): number {
  const prop = properties[key];
  if (prop?.type !== "formula" || prop.formula.type !== "number") return 0;
  return prop.formula.number ?? 0;
}

export function parsePercent(text: string): number {
  const match = text.match(/(\d+(?:\.\d+)?)\s*%/);
  return match ? parseFloat(match[1]) : 0;
}

export function parseLeadingNumber(text: string): number {
  const match = text.match(/^\s*(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

export function parseYesNoPercent(text: string): number {
  const percentMatch = text.match(/(\d+(?:\.\d+)?)\s*%/);
  if (percentMatch) return parseFloat(percentMatch[1]);
  if (/ainda não/i.test(text)) return 0;
  if (/(sim|agendad[oa]s?)/i.test(text)) return 100;
  return 0;
}

export function daysUntil(dateStr: string | null): number {
  if (!dateStr) return 0;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
