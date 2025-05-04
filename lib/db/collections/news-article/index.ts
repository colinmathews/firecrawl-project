import { CollectionBase } from "../../collection-base";
import type { NewsArticleRecord } from "./schema";
import {
  NewsArticleSchema,
  SerializerSchema,
  DerializerSchema,
} from "./schema";

export * from "./schema";

export class NewsArticleCollection extends CollectionBase<NewsArticleRecord> {
  constructor() {
    super({
      tableId: "tblwbEYxBAP90SHUY",
      schema: NewsArticleSchema,
      serializer: SerializerSchema,
      deserializer: DerializerSchema,
    });
  }

  async findAllByTopic(topicAutoId: string): Promise<NewsArticleRecord[]> {
    const result = await this.select({
      filterByFormula: `FIND("${this.encodeFormulaValue(
        topicAutoId
      )}", ARRAYJOIN(Topic, ","))`,
    });
    return result;
  }
}
