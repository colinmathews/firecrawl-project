

import { CollectionBase } from "../../collection-base";
import type { NewsArticleRecord } from "./schema";
import {
  NewsArticleSchema,
  SerializerSchema,
  DeserializerSchema,
} from "./schema";

export * from "./schema";

const defaultThumbnail = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5QQYECkUw7hMDgAAAB1pVFh0Q29tbWVudAAAAAAAUkdEVY7vX0X/AAElSURBVEjHvZbbTyJRGMdfmd27HWyHJh1LZXRVURGoiboIh6pIyUzFj+LKzMrgQSIMyqQipS4RwWtGf9AMjBAXR8WJNzKESK8UbYCeFYUs5hA1NR2STC2WL0BQFdxl3sx5L7vJzO9858yykVEpf/vLb3K+/p73cS+FuL5pwntpIqWUeiH2UHnDHJeJQT1qEuIqczPT14/zYL/KZJ8zNZQNaIXbCHVWYai9AzTWvzOP/mhAsz0lcDrCEqhSOZHPOSD8g8g+UNoG0+xBXC9xTEHtBDBZ7rkF6xphC9YB0vxbgEXEzD5NFMAu0LqWQ5zFWlrsAq3QGsSG5zFOUuoGtsNaIWRI5jEkfwkYfrhlB9X67gL9afCjzt3luPZ+CAthbw6jUnI/S4dP7F1HMwy41mAdv/jYCxkvgOsJ1XqAOoMagzQ5IUgJyy96XGusS2l0OW5TCfbIFPxrg2hrLF8hAthrcauVOpRdrL9caWwTl3BgH0oGL6Eeghr1MFOVXjFdXuuA9X6HzO/JO2Ool0BUOoQVzEpHck9UbABL1IBeS7LGOkc1C3o2HwWcoFvTcNeCt1QBxaA6H6sV9zrX35ezXfFXUO8GwC+xtXj9VoBNugJxToZlNoBcRhmsA93S/lYQ60Wkep1XrIPO6AOurm0JxomF1HVgmHJ/zrwApfw9iFD6V6sJSPVVnw0JXd1waYD71HuFY+u4UbIcpR8+1IWdfzvUap3AXFfYBvpQwLgAW0rX000elKmtQHtTimx6GqgtzIVhsR8By7G1gHVR3ANGzHueMw/fm+33o1bKjB1zNUsX45C5n32Ux+j9AH/Aa+EJ1pnJsV6wAAAAASUVORK5CYII=';

export class NewsArticleCollection extends CollectionBase<NewsArticleRecord> {
  constructor() {
    super({
      tableId: "tblwbEYxBAP90SHUY",
      schema: NewsArticleSchema,
      serializer: SerializerSchema,
      deserializer: DeserializerSchema,
    });
  }

  async findAllByTopic(topicAutoId: number): Promise<NewsArticleRecord[]> {
    const result = await this.select({
      filterByFormula: `FIND("${this.encodeFormulaValue(
        topicAutoId.toString()
      )}", ARRAYJOIN(Topic, ","))`,
    });
    result.forEach(article => {
      if (!article.ThumbnailUrl) {
        article.ThumbnailUrl = defaultThumbnail;
      }
    });
    return result;
  }
}

