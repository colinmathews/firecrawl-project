import FirecrawlApp, { FirecrawlError } from "@mendable/firecrawl-js";
import { getRequiredEnvironmentVar } from "../utils/environment";

export abstract class FirecrawlBase {
  protected client: FirecrawlApp;

  constructor() {
    this.client = new FirecrawlApp({
      apiKey: getRequiredEnvironmentVar("FIRECRAWL_API_KEY"),
    });
  }

  protected async wrapHandler<T>(
    handler: () => Promise<T>,
    retriesLeft = 3
  ): Promise<T> {
    try {
      return await handler();
    } catch (error) {
      if (error instanceof FirecrawlError) {
        const fError = error as FirecrawlError;
        if (fError.statusCode === 408 && retriesLeft > 0) {
          console.error({
            message: `Firecrawl request timed out, trying again...`,
            error: fError,
          });
          return await this.wrapHandler(handler, retriesLeft - 1);
        } else if (retriesLeft > 0) {
          console.error({
            message: `Firecrawl error, trying again...`,
            error: fError,
          });
          return await this.wrapHandler(handler, retriesLeft - 1);
        }
      } else {
        console.error(error);
      }
      throw error;
    }
  }
}
