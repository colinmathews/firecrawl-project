/* eslint-disable @typescript-eslint/no-explicit-any */

import AirtableApi, {
  type Records,
  type FieldSet,
  type Record,
} from "airtable";
import { getRequiredEnvironmentVar } from "../utils/environment";
import type { StringValue } from "ms";
import { cache, keys } from "../cache";

const CACHE_TTL: StringValue = "10s";

export type AirtableFindOptions = {
  filterByFormula?: string;
  maxRecords?: number;
  pageSize?: number;
  offset?: number;
};

export class Airtable {
  private client: AirtableApi;
  private tableId: string;
  private baseId: string;

  constructor({ tableId }: { tableId: string }) {
    this.client = new AirtableApi({
      apiKey: getRequiredEnvironmentVar("AIRTABLE_API_KEY"),
    });
    this.tableId = tableId;
    this.baseId = getRequiredEnvironmentVar("AIRTABLE_BASE_ID");
  }

  async get(id: string): Promise<Record<FieldSet> | null> {
    try {
      const result = await this.client
        .base(this.baseId)
        .table(this.tableId)
        .find(id);
      return result;
    } catch (error) {
      if ((error as any).statusCode === 404) {
        return null; // Record not found
      }
      throw error; // Re-throw other errors
    }
  }

  async find(options: AirtableFindOptions): Promise<Records<FieldSet>> {
    const key = keys.airtableCachedQuery(this.tableId, options);
    const cached = await cache.get("firecrawl-project", key);
    if (cached) {
      return JSON.parse(cached);
    }

    const result = await this.client
      .base(this.baseId)
      .table(this.tableId)
      .select(options)
      .all();

    await cache.set("firecrawl-project", key, JSON.stringify(result), {
      maxAge: CACHE_TTL,
    });

    return result;
  }

  async create(records: any[]): Promise<Records<FieldSet>> {
    const result = await this.client
      .base(this.baseId)
      .table(this.tableId)
      .create(
        records.map((one) => {
          return { fields: one };
        })
      );
    return result;
  }

  async update(id: string, record: any): Promise<Record<FieldSet>> {
    const result = await this.client
      .base(this.baseId)
      .table(this.tableId)
      .update(id, record);
    return result;
  }

  async destroy(ids: string[]): Promise<void> {
    const uniqueIds = [...new Set(ids)];
    await this.client.base(this.baseId).table(this.tableId).destroy(uniqueIds);
  }
}
