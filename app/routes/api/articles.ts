import { NewsArticleCollection } from "@/lib/db/collections/news-article";
import {
  AnalyzeSources,
  type SourceLink,
} from "@/lib/services/analyze-sources";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const params = new URL(request.url).searchParams;
    const topic = params.get("topicId");

    const articles = await new NewsArticleCollection().findAllByTopic(
      +(topic as string)
    );
    return { articles };
  } catch (error) {
    console.error(`Failed to load articles`, error);
    return {
      error,
    };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const data = await request.json();
    const sources = data.sources as SourceLink[];

    const service = new AnalyzeSources();
    const analyzedArticles = await service.analyzeArticles(sources);

    console.log(
      `todo: analyzed articles: ${JSON.stringify(analyzedArticles, null, 2)}`
    );

    // Save articles to db
    const articlesColl = new NewsArticleCollection();
    const articles = await articlesColl.create(
      analyzedArticles.map((one) => ({
        Topic: data.topicId,
        Source: one.name,
        Headline: one.headline,
        Url: one.url,
        "Bias Rating": one.biasScore,
        Analysis: one.analysis,
      }))
    );

    return { articles };
  } catch (error) {
    console.error(`Failed to analyze articles`, error);
    return { error };
  }
}
