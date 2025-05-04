import type { NewsTopicRecord } from "@/lib/db/collections/news-topic";
import { useEffect, useMemo, useState } from "react";
import { useFetcher } from "react-router";
import { Progress } from "~/components/progress";
import { toast } from "~/components/toast/use-toast";

const LOADING_MESSAGES = [
  "Digging up the news of the day...",
  "Scanning headlines across the globe...",
  "Processing media reports...",
  "Investigating news angles...",
  "Analyzing trending stories...",
  "Filtering through breaking news...",
  "Gathering key developments...",
  "Identifying major headlines...",
  "Curating newsworthy topics...",
  "Sifting through media coverage...",
  "Detecting important updates...",
  "Compiling significant events...",
  "Extracting notable stories...",
  "Synthesizing news reports...",
];

export default function TopicLoader({
  day,
  onTopicsGenerated,
}: {
  day: string;
  onTopicsGenerated: (topics: NewsTopicRecord[]) => void;
}) {
  const [progress, setProgress] = useState(4);
  const [, setTopics] = useState<NewsTopicRecord[] | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const loadingMessage = useMemo(
    () => LOADING_MESSAGES[loadingMessageIndex % LOADING_MESSAGES.length],
    [loadingMessageIndex]
  );

  // Update loading message every X seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingMessageIndex(loadingMessageIndex + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [loadingMessageIndex]);

  // Fetchers
  const fetcherGenerateTopics = useFetcher<{
    topics?: NewsTopicRecord[];
    /* eslint-disable @typescript-eslint/no-explicit-any */
    error?: any;
  }>();

  // Get topics for this day
  useEffect(() => {
    fetcherGenerateTopics.submit(
      {
        day,
      },
      {
        method: "POST",
        action: "/api/topics",
        encType: "application/x-www-form-urlencoded",
      }
    );
  }, [day, fetcherGenerateTopics]);

  // Assign sources when it finishes
  useEffect(() => {
    if (fetcherGenerateTopics.state !== "idle") {
      return;
    }

    if (fetcherGenerateTopics.data && fetcherGenerateTopics.data.error) {
      toast({
        title: "Error",
        description:
          "Failed to generate topics for this day. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (
      fetcherGenerateTopics.data &&
      fetcherGenerateTopics.data.topics &&
      fetcherGenerateTopics.data.topics.length > 0
    ) {
      setTopics(fetcherGenerateTopics.data.topics);
      onTopicsGenerated(fetcherGenerateTopics.data.topics);
    } else {
      setTopics(null);
    }
  }, [
    fetcherGenerateTopics.data,
    fetcherGenerateTopics.state,
    onTopicsGenerated,
  ]);

  // Update progress over time
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const maxProgress = 99;
        const minProgress = 0;
        let increment = Math.random() * 2 + 0.1; // Random value between 0.1 and 2.1

        // Slow down increment when we get past 85
        if (prev > 85) {
          increment = increment * 0.1; // Reduce increment by 90%
        }

        const nextProgress = Math.min(
          Math.max(prev + increment, minProgress),
          maxProgress
        );
        return nextProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="text-center text-gray-500">{loadingMessage}</div>
      <Progress value={progress} />
    </div>
  );
}
