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

export async function queryDatabase(
  databaseId: string,
  filter?: Record<string, unknown>,
  sorts?: Record<string, unknown>[]
) {
  const results: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
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

export function daysUntil(dateStr: string | null): number {
  if (!dateStr) return 0;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
