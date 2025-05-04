import { NewsTopicCollection } from "@/lib/db/collections/news-topic";
import type { SourceLink } from "@/lib/services/analyze-sources";
import { useEffect, useMemo, useState } from "react";
import { redirect, useFetcher, type LoaderFunctionArgs } from "react-router";
import type { Route } from "./+types/index";
import {
  NewsArticleCollection,
  type NewsArticleRecord,
} from "@/lib/db/collections/news-article";
import ArticleLoader from "./article-loader";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log(`todo: loader`);
  const params = new URL(request.url).searchParams;
  const topicId = params.get("topic");

  if (!topicId) {
    return redirect("/");
  }

  const coll = new NewsTopicCollection();
  const topic = await coll.findOne(topicId);

  if (!topic || !topic.AutoId) {
    return redirect("/");
  }

  // Get the articles to see if we've got 'em
  const articlesColl = new NewsArticleCollection();
  const articles = await articlesColl.findAllByTopic(topic.AutoId);

  return { topic, articles: articles.length > 0 ? articles : null };
}

export function shouldRevalidate() {
  return false;
}

export default function Battle({ loaderData }: Route.ComponentProps) {
  const [articles, setArticles] = useState<NewsArticleRecord[] | null>(
    loaderData?.articles ?? null
  );

  if (!loaderData?.topic?.id) {
    return redirect("/");
  }

  return (
    <>
      {!articles && (
        <ArticleLoader
          topicId={loaderData.topic.id}
          topicName={loaderData.topic.Name}
          onArticlesGenerated={setArticles}
        />
      )}
      {articles && <div>Articles loaded</div>}
    </>
  );
}
