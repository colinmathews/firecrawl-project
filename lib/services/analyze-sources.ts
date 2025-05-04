import { z } from "zod";
import { ValidationError } from "../errors";
import { FirecrawlBase } from "./firecrawl-base";

const sourceLinksSchema = z.object({
  sourceLinks: z.array(
    z
      .object({
        originUrl: z.string().describe("The link of the url you were given"),
        url: z.string().describe("The link to the article on the news topic"),
      })
      .describe(
        "A list of article urls for the news topic, broken down by the original url you were given"
      )
  ),
});

const analysisSchema = z.object({
  sources: z
    .array(
      z.object({
        name: z.string().describe("The name of the source"),
        headline: z.string().describe("The headline of the article"),
        url: z
          .string()
          .describe("The original link you were given for this source"),
        biasScore: z
          .number()
          .describe(
            "A score between -100 and 100 indicating the left or right leaning bias of the source. A value of 0 is neutral, -100 is extremely far left, and 100 is extremely far right."
          ),
        analysis: z
          .string()
          .describe("Briefly explain why you gave this particular bias score"),
      })
    )
    .describe(
      "A list of sources for a news topic and the analysis of that sources reporting"
    ),
});

export type SourceLink = z.infer<
  typeof sourceLinksSchema
>["sourceLinks"][number];

export type SourceAnalysis = z.infer<typeof analysisSchema>["sources"][number];

export class AnalyzeSources extends FirecrawlBase {
  async gatherArticles(topic: string): Promise<SourceLink[]> {
    const result = await this.wrapHandler(async () =>
      this.client.extract(
        [
          "https://www.npr.org/sections/news/",
          "https://www.huffpost.com/news/",
          "https://moxie.foxnews.com/google-publisher/latest.xml",
          "https://www.newsmax.com/rss/Newsfront/16/",
          "https://www.reuters.com",
          "https://www.apnews.com",
        ],
        {
          prompt: `Find the article for each of these news sources on the following news topic: "${topic}"`,
          schema: sourceLinksSchema,
        }
      )
    );

    if (!result.success) {
      throw new ValidationError(`Failed to gather topics: ${result.error}`, {
        data: result,
      });
    }

    if (!result.data) {
      throw new ValidationError(`Expected topics to include json data`, {
        data: result,
      });
    }

    return result.data.sourceLinks;
  }

  async analyzeArticles(sources: SourceLink[]): Promise<SourceAnalysis[]> {
    const result = await this.wrapHandler(async () =>
      this.client.extract(
        sources.map((source) => source.url),
        {
          prompt:
            "Provide a brief left-leaning vs right-leaning bias analysis of the content of the article.",
          schema: analysisSchema,
        }
      )
    );

    if (!result.success) {
      throw new ValidationError(`Failed to analyze articles: ${result.error}`, {
        data: result,
      });
    }

    return result.data.sources;
  }
}
