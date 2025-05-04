/* eslint-disable react-refresh/only-export-components */
import type { Route } from "./+types/index";
import {
  NewsTopicCollection,
  type NewsTopicRecord,
} from "@/lib/db/collections/news-topic";
import { type LoaderFunctionArgs } from "react-router";
import { useState } from "react";
import { toShortISOString } from "@/lib/utils/dates";
import TopicLoader from "./topic-loader";
import TopicCard from "./topic-card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  let day = url.searchParams.get("day") as string;
  if (!day) {
    day = toShortISOString(new Date());
  }

  try {
    const topics = await new NewsTopicCollection().findAllByDay(day as string);
    return { topics: topics.length > 0 ? topics : null, day };
  } catch (error) {
    console.error(`Failed to load topics`, error);
    return {
      error,
      day,
    };
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [topics, setTopics] = useState<NewsTopicRecord[] | null>(
    loaderData?.topics ?? null
  );

  if (loaderData?.error) {
    return (
      <pre className="p-4 bg-gray-100 text-red-600">
        Error: {JSON.stringify(loaderData.error, null, 2)}
      </pre>
    );
  }

  return (
    <div className="flex flex-col gap-16 items-center justify-center mt-12 pb-44">
      {!topics && (
        <div className="mt-12 w-[500px]">
          <TopicLoader day={loaderData.day} onTopicsGenerated={setTopics} />
        </div>
      )}

      {topics && (
        <>
          <div className="text-lg font-bold">Choose a topic to analyze</div>
          <div className="flex flex-col gap-8">
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
