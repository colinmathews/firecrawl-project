import type { NewsTopicRecord } from "@/lib/db/collections/news-topic";
import { Link } from "react-router";
import { Button } from "~/components/button";

export default function TopicCard({ topic }: { topic: NewsTopicRecord }) {
  return (
    <div className="bg-white border border-gray-200 rounded p-6 shadow-md flex flex-col gap-12 items-center">
      <div className="flex gap-4 w-full">
        <img
          src={topic.ThumbnailUrl}
          alt={topic.Name}
          className="w-[205px] h-auto rounded-md"
        />
        <div className="flex flex-col justify-between items-end flex-1">
          <div className="text-xl max-w-[600px] w-full">{topic.Name}</div>
          <Link to={`/battle?topic=${topic.id}`}>
            <Button>Start Battle</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
