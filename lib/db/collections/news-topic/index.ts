import { CollectionBase } from "../../collection-base";
import type { NewsTopicRecord } from "./schema";
import { NewsTopicSchema, SerializerSchema, DerializerSchema } from "./schema";

export * from "./schema";

export class NewsTopicCollection extends CollectionBase<NewsTopicRecord> {
  constructor() {
    super({
      tableId: "tblW7KOjFX33ViUqu",
      schema: NewsTopicSchema,
      serializer: SerializerSchema,
      deserializer: DerializerSchema,
    });
  }

  async findAllByDay(dayShortName: string): Promise<NewsTopicRecord[]> {
    const result = await this.select({
      filterByFormula: `{DayShortName} = '${this.encodeFormulaValue(
        dayShortName
      )}'`,
    });
    return result;
  }
}
