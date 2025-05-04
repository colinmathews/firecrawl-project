import { DatabaseError } from "@/lib/errors";
import type { RecordBase } from "./record-base";
import type { CollectionBaseOptions, CreateRecord } from "./types";
import { Airtable, type AirtableFindOptions } from "./airtable";
import omit from "lodash.omit";
import { deserialize } from "./utils/deserialize";

export class CollectionBase<T extends RecordBase> {
  protected readonly db: Airtable;
  protected readonly options: CollectionBaseOptions;

  constructor(options: CollectionBaseOptions) {
    this.db = new Airtable({ tableId: options.tableId });
    this.options = options;
  }

  async findOne(id: string): Promise<T | null> {
    const result = await this.db.get(id);
    if (!result) {
      return null;
    }
    return deserialize<T>(
      {
        ...result.fields,
        id: result.id,
        createdTime: result._rawJson.createdTime,
      },
      {
        deserializer: this.options.deserializer,
      }
    );
  }

  async createOne(record: CreateRecord<T>): Promise<T> {
    const [result] = await this.create([record]);

    if (!result) {
      throw new DatabaseError(
        `Expected insert into ${this.options.tableId} to return a row`
      );
    }

    return result;
  }

  async create(records: CreateRecord<T>[]): Promise<T[]> {
    if (records.length === 0) {
      return [];
    }

    // Transform into db records
    const serialized = await Promise.all(
      records.map((record) => this.options.serializer.parseAsync(record))
    );

    const result = await this.db.create(serialized);

    const created = await Promise.all(
      result.map((one) =>
        deserialize<T>(
          {
            ...one.fields,
            id: one.id,
            createdTime: one._rawJson.createdTime,
          },
          {
            deserializer: this.options.deserializer,
          }
        )
      )
    );

    return created;
  }

  async update(record: T): Promise<T> {
    // Transform into db record
    const serialized = (await this.options.serializer.parseAsync(record)) as T;

    // Run the work
    const result = await this.db.update(
      record.id,
      omit(serialized, ["id", "createdTime"])
    );

    const parsed = await Promise.all(
      [result].map((one) =>
        deserialize<T>(
          {
            ...one.fields,
            id: one.id,
            createdTime: one._rawJson.createdTime,
          },
          {
            deserializer: this.options.deserializer,
          }
        )
      )
    );

    if (parsed.length !== 1) {
      throw new DatabaseError(
        `Expected update of ${this.options.tableId} to return a row`
      );
    }

    return parsed[0];
  }

  async destroy(ids: string[]): Promise<void> {
    if (ids.length === 0) {
      return;
    }
    await this.db.destroy(ids);
  }

  encodeFormulaValue(value: string): string {
    return value.replace(/'/m, "\\'");
  }

  protected async select(options: AirtableFindOptions): Promise<T[]> {
    const result = await this.db.find(options);

    const formattedResult: T[] = await Promise.all(
      result.map((one) => {
        return deserialize<T>(
          {
            ...one.fields,
            id: one.id,
            createdTime: one._rawJson.createdTime,
          },
          {
            deserializer: this.options.deserializer,
          }
        );
      })
    );

    return formattedResult;
  }
}
