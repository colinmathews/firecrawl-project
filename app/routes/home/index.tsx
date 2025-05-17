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

export function meta() {
  return [
    { title: "Firecrawl project by Colin Mathews" },
    {
      name: "description",
      content: "Firecrawl project by Colin Mathews",
    },
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
  const [viewMode, setViewMode] = useState('Latest'); // 'Last Week' or 'Latest'

  if (loaderData?.error) {
    return (
      <pre className="p-4 bg-gray-100 text-red-600">
        Error: {JSON.stringify(loaderData.error, null, 2)}
      </pre>
    );
  }

  const handleToggleViewMode = () => {
    setViewMode(viewMode === 'Latest' ? 'Last Week' : 'Latest');
  };

  return (
    <div className="flex flex-col gap-16 items-center justify-center mt-12 pb-44">
      <button
        onClick={handleToggleViewMode}
        className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 transition"
      >
        Toggle to {viewMode === 'Latest' ? 'Last Week' : 'Latest'}
      </button>
      {viewMode === 'Latest' && (
        <p className="text-sm text-gray-600">*Latest news may not be fully up to date.</p>
      )}
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