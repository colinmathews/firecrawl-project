/* eslint-disable react-refresh/only-export-components */

import { NewsTopicCollection } from "@/lib/db/collections/news-topic";
import { useState } from "react";
import { redirect, type LoaderFunctionArgs } from "react-router";
import type { Route } from "./+types/index";
import {
  NewsArticleCollection,
  type NewsArticleRecord,
} from "@/lib/db/collections/news-article";
import ArticleLoader from "./article-loader";
import SelectedTopic from "./selected-topic";
import SourceAnalysis from "./source-analysis";
import { cn } from "@/lib/utils/cn";

export async function loader({ request }: LoaderFunctionArgs) {
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

  const cancelParams = new URLSearchParams({
    day: loaderData.topic.DayShortName,
  });

  return (
    <div className="flex flex-col gap-16 items-center justify-center mt-12 pb-44">
      <SelectedTopic
        topic={loaderData.topic}
        cancelUrl={`/?${cancelParams.toString()}`}
      />

      {!articles && (
        <div className="mt-12 w-[500px]">
          <ArticleLoader
            topicId={loaderData.topic.id}
            topicName={loaderData.topic.Name}
            onArticlesGenerated={setArticles}
          />
        </div>
      )}

      {articles && (
        <div
          className={cn(
            "grid gap-4 mx-auto",
            articles.length === 1 ? "grid-cols-1" : "grid-cols-2"
          )}
        >
          {articles.map((article) => (
            <SourceAnalysis key={article.AutoId} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
