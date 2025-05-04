/* eslint-disable react-refresh/only-export-components */
import type { Route } from "./+types/home";
import { type NewsTopicRecord } from "@/lib/db/collections/news-topic";
import { useFetcher } from "react-router";
import { use, useEffect } from "react";
import { toShortISOString } from "@/lib/utils/dates";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const day = toShortISOString(new Date());
  const fetcher = useFetcher<{ topics?: NewsTopicRecord[]; error?: any }>();
  const fetcherGenerate = useFetcher<{
    topics?: NewsTopicRecord[];
    error?: any;
  }>();

  // Fetch topics when day changes
  useEffect(() => {
    const params = new URLSearchParams({
      day,
    });
    fetcher.load(`/api/topics?${params.toString()}`);
  }, [day]);

  // Generate topics if there are none
  useEffect(() => {
    if (fetcher.state !== "idle") {
      return;
    }

    if (
      fetcher?.data &&
      !fetcher.data.error &&
      (fetcher.data.topics || []).length === 0
    ) {
      fetcherGenerate.submit(
        {
          day,
        },
        {
          method: "POST",
          action: "/api/topics",
          encType: "application/x-www-form-urlencoded",
        }
      );
    }
  }, [day, fetcher?.data, fetcher.state]);

  return (
    <div>
      {fetcher.state !== "idle" && <div>fetcher.state = {fetcher.state}</div>}
      {fetcherGenerate.state !== "idle" && (
        <div>fetcherGenerate.state = {fetcherGenerate.state}</div>
      )}
      {fetcher.data && <pre>{JSON.stringify(fetcher.data, null, 2)}</pre>}
      {fetcherGenerate.data && (
        <pre>{JSON.stringify(fetcherGenerate.data, null, 2)}</pre>
      )}
    </div>
  );
}
