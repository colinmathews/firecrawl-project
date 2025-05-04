import { z } from "zod";
import {
  RecordBaseSchema,
  RecordBaseDeserializerSchema,
} from "../../record-base";
import omit from "lodash.omit";

export const NewsTopicSchema = RecordBaseSchema.extend({
  AutoId: z.number().min(0).optional(),
  Name: z.string().min(1),
  ThumbnailUrl: z.string().url(),
  DayShortName: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const SerializerSchema = NewsTopicSchema.omit({
  id: true,
  createdTime: true,
  AutoId: true,
});

export const DerializerSchema = NewsTopicSchema.extend({
  ...RecordBaseDeserializerSchema.shape,
}).transform((val) => {
  return omit(val, ["AutoId"]);
});

export type NewsTopicRecord = z.infer<typeof NewsTopicSchema>;
