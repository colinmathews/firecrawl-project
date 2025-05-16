

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

    const startTime = Date.now();
    const analyzedArticles = await service.analyzeArticles(sources);
    const endTime = Date.now();
    console.log(`AnalyzeSources API call took ${endTime - startTime}ms`);

    if (analyzedArticles.length === 0) {
      return { error: "No articles could be found for this topic" };
    }

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

