import { z } from "zod";
import {
  RecordBaseSchema,
  RecordBaseDeserializerSchema,
} from "../../record-base";
import omit from "lodash.omit";

export const NewsArticleSchema = RecordBaseSchema.extend({
  AutoId: z.number().min(0).optional(),
  Topic: z.string(),
  /**
   * A field that lets us find topics since we can't search by record id.
   */
  "Topic AutoId": z.string().min(1).optional(),
  Source: z.string().min(1),
  Headline: z.string().min(1),
  Url: z.string().url(),
  BiasRating: z.number().min(-100).max(100),
  Analysis: z.string(),
});

export const SerializerSchema = NewsArticleSchema.omit({
  id: true,
  createdTime: true,
  AutoId: true,
  Headline: true,
  Source: true,
  Url: true,
  BiasRating: true,
  Analysis: true,
  "Topic AutoId": true,
})
  .extend({
    Topic: NewsArticleSchema.shape.Topic.transform((val) => (val ? [val] : [])),
  })
  .transform((val) => {
    return omit(val, ["Topic AutoId"]);
  });

export const DerializerSchema = NewsArticleSchema.extend({
  ...RecordBaseDeserializerSchema.shape,
  Topic: z
    .array(z.string())
    .optional()
    .transform((val) => (val ? val[0] : undefined)),
  "Topic AutoId": z.array(z.string()).transform((val) => val[0]),
});

export type NewsArticleRecord = z.infer<typeof NewsArticleSchema>;
