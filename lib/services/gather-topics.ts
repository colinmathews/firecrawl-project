import { z } from "zod";
import { ValidationError } from "../errors";
import { FirecrawlBase } from "./firecrawl-base";
import imageToBase64 from "image-to-base64";

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
          prompt: `Extract the top 5 news topics of the day. This site groups related articles together, so make sure to only pick the main headline from each group. We don't want to pick the same topic twice.`,
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

    const thumbnailUrls = await Promise.all(
      result.json.map((topic) =>
        topic.thumbnail ? this.getThumbnail(topic.thumbnail) : this.generatePlaceholderImage()
      )
    );

    return result.json.map((one, index) => ({
      ...one,
      thumbnail: thumbnailUrls[index],
    }));
  }

  private async getThumbnail(thumbnailUrl: string): Promise<string> {
    try {
      const base64Image = await imageToBase64(thumbnailUrl);
      const mime = this.guessMimeType(base64Image);
      return `data:${mime};base64,${base64Image}`;
    } catch {
      // Return a placeholder image if the URL fetch fails
      return this.generatePlaceholderImage();
    }
  }

  private generatePlaceholderImage(): string {
    // Placeholder could be a blank or a stock photo represented in base64
    const placeholderImage = "default-placeholder-image-in-base64-format";
    return `data:image/png;base64,${placeholderImage}`;
  }

  private guessMimeType(base64: string): string {
    if (base64.startsWith("/9j/")) return "image/jpeg";
    if (base64.startsWith("iVBOR")) return "image/png";
    if (base64.startsWith("R0lGOD")) return "image/gif";
    if (base64.startsWith("Qk")) return "image/bmp";
    return "application/octet-stream"; // fallback
  }
}
