export function airtableCachedQuery(tableId: string, query: object): string {
  return `airtable-cache:${tableId}:${JSON.stringify(query)}`;
}
