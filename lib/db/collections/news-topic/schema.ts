import { z } from "zod";
import {
  RecordBaseSchema,
  RecordBaseDeserializerSchema,
} from "../../record-base";

export const NewsTopicSchema = RecordBaseSchema.extend({
  AutoId: z.number().min(0).optional(),
  Name: z.string().min(1),
  ThumbnailUrl: z.string().url(),
  DayShortName: z.string().min(1),
});

export const SerializerSchema = NewsTopicSchema.omit({
  id: true,
  createdTime: true,
  AutoId: true,
});

export const DerializerSchema = NewsTopicSchema.extend({
  ...RecordBaseDeserializerSchema.shape,
});

export type NewsTopicRecord = z.infer<typeof NewsTopicSchema>;
