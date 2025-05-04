import { z } from "zod";
import { ValidationError } from "../errors";
import { FirecrawlBase } from "./firecrawl-base";
const topStoriesSchema = z.object({
  topStoriesLink: z.string().describe("The link to the top stories page"),
});

const newsSchema = z.array(
  z.object({
    topic: z
      .string()
      .describe("The short summary of the news topic in headline format"),
    thumbnail: z
      .string()
      .url()
      .optional()
      .describe(
        "An image to go along with this news topic if one can be found"
      ),
  })
);

export type NewsTopic = z.infer<typeof newsSchema>[number];

export class GatherTopics extends FirecrawlBase {
  async gatherTopics(): Promise<NewsTopic[]> {
    const topStoriesResult = await this.wrapHandler(async () =>
      this.client.extract(["https://news.google.com"], {
        schema: topStoriesSchema,
        prompt: `Get the link to the top stories`,
      })
    );

    if (!topStoriesResult.success) {
      throw new ValidationError(
        `Failed to find the top stories of the day: ${topStoriesResult.error}`
      );
    }

    const result = await this.wrapHandler(async () =>
      this.client.scrapeUrl(topStoriesResult.data.topStoriesLink, {
        formats: ["json"],
        onlyMainContent: true,
        blockAds: true,
        jsonOptions: {
          schema: newsSchema,
          prompt: `Extract the top 5 news topics of the day.`,
        },
      })
    );

    if (!result.success) {
      throw new ValidationError(`Failed to gather topics: ${result.error}`, {
        data: result,
      });
    }

    if (!result.json) {
      throw new ValidationError(`Expected topics to include json data`, {
        data: result,
      });
    }

    return result.json;
  }
}
