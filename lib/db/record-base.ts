import { z } from "zod";

export const RecordBaseSchema = z.object({
  id: z.string(),
  createdTime: z.string(),
});

export const RecordBaseDeserializerSchema = RecordBaseSchema;

export type RecordBase = z.infer<typeof RecordBaseSchema>;
