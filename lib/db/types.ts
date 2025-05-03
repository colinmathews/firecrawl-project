import type { SomeZodObject } from "zod";
import type { RecordBase } from "./record-base";

export type CollectionBaseOptions<T extends RecordBase> = {
  tableId: string;
  schema: Pick<SomeZodObject, "shape">;
  serializer: Pick<SomeZodObject, "parseAsync">;
  deserializer: Pick<SomeZodObject, "parseAsync">;
};

export type CreateRecord<T extends RecordBase> = Omit<T, "id" | "createdTime">;

export type PagedRecords<T extends RecordBase> = {
  records: T[];
  hasMore: boolean;
  totalCount: number;
  page: number;
  pageSize: number;
};

export type PagingOptions = {
  page: number;
  pageSize: number;
};
