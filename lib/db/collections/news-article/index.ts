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

  async findAllByTopic(topicAutoId: number): Promise<NewsArticleRecord[]> {
    const result = await this.select({
      filterByFormula: `FIND("${this.encodeFormulaValue(
        topicAutoId.toString()
      )}", ARRAYJOIN(Topic, ","))`,
    });
    return result;
  }
}
