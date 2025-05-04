import type { NewsArticleRecord } from "@/lib/db/collections/news-article";
import type { SourceLink } from "@/lib/services/analyze-sources";
import { useEffect, useMemo, useState } from "react";
import { useFetcher } from "react-router";
import { Progress } from "~/components/progress";
import { toast } from "~/components/toast/use-toast";

const LOADING_MESSAGES = [
  "Gathering perspectives from different sources...",
  "Analyzing media coverage...",
  "Fact-checking the stories...",
  "Comparing different viewpoints...",
  "Reading between the lines...",
  "Examining news narratives...",
  "Processing media reports...",
  "Investigating news angles...",
];

export default function ArticleLoader({
  topicId,
  topicName,
  onArticlesGenerated,
}: {
  topicId: string;
  topicName: string;
  onArticlesGenerated: (articles: NewsArticleRecord[]) => void;
}) {
  const [progress, setProgress] = useState(4);
  const [sources, setSources] = useState<SourceLink[] | null>(null);
  const [articles, setArticles] = useState<NewsArticleRecord[] | null>(null);
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
  const fetcherGenerateSources = useFetcher<{
    sources?: SourceLink[];
    error?: any;
  }>();
  const fetcherGenerateArticles = useFetcher<{
    articles?: NewsArticleRecord[];
    error?: any;
  }>();

  const hasError = useMemo(() => {
    return (
      fetcherGenerateSources.data?.error ||
      fetcherGenerateArticles.data?.error ||
      (sources && sources.length === 0)
    );
  }, [fetcherGenerateSources.data, fetcherGenerateArticles.data, sources]);

  // Get articles for the topic from this page
  useEffect(() => {
    fetcherGenerateSources.submit(
      {
        topic: topicName,
      },
      {
        method: "POST",
        action: "/api/find-topic-sources",
        encType: "application/x-www-form-urlencoded",
      }
    );
  }, [topicName]);

  // Assign sources when it finishes
  useEffect(() => {
    if (fetcherGenerateSources.state !== "idle") {
      return;
    }

    if (fetcherGenerateSources.data && fetcherGenerateSources.data.error) {
      toast({
        title: "Error",
        description:
          "Failed to generate sources for this topic. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (fetcherGenerateSources.data && fetcherGenerateSources.data.sources) {
      setSources(fetcherGenerateSources.data.sources);
      if (fetcherGenerateSources.data.sources.length === 0) {
        toast({
          title: "No sources found",
          description:
            "No sources were found for this topic. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      setSources(null);
    }
  }, [fetcherGenerateSources.data, fetcherGenerateSources.state]);

  // Generate articles when sources change
  useEffect(() => {
    if (sources && sources.length > 0) {
      fetcherGenerateArticles.submit(
        {
          sources,
          topicId,
        },
        {
          method: "POST",
          action: "/api/articles",
          encType: "application/json",
        }
      );
    }
  }, [sources]);

  useEffect(() => {
    if (fetcherGenerateArticles.state !== "idle") {
      return;
    }

    if (fetcherGenerateArticles.data && fetcherGenerateArticles.data.error) {
      toast({
        title: "Error",
        description:
          "Failed to generate articles for this topic. Please try again.",
        variant: "destructive",
      });
    }

    if (
      fetcherGenerateArticles.data &&
      fetcherGenerateArticles.data.articles &&
      fetcherGenerateArticles.data.articles.length > 0
    ) {
      setArticles(fetcherGenerateArticles.data.articles);
      onArticlesGenerated(fetcherGenerateArticles.data.articles);
    } else {
      setArticles(null);
    }
  }, [fetcherGenerateArticles.data, fetcherGenerateArticles.state]);

  // Update progress over time
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const maxProgress = sources ? 99 : 50;
        const minProgress = sources ? 50 : 0;
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
  }, [sources]);

  return (
    <div className="flex flex-col gap-4 items-center">
      {hasError && (
        <div className="text-center text-red-500">
          {sources && sources.length === 0 ? (
            <>No sources were found for this topic. Please try again.</>
          ) : (
            <>
              There was an error loading articles for this topic. Please try
              again.
            </>
          )}
        </div>
      )}

      {!hasError && (
        <>
          <div className="text-center text-gray-500">{loadingMessage}</div>
          <Progress value={progress} />
        </>
      )}
    </div>
  );
}
