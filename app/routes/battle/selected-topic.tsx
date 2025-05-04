import type { NewsTopicRecord } from "@/lib/db/collections/news-topic";
import { faXmark } from "@awesome.me/kit-a5b8ddbb94/icons/classic/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router";
import { Button } from "~/components/button";

export default function SelectedTopic({
  topic,
  cancelUrl,
}: {
  topic: NewsTopicRecord;
  cancelUrl: string;
}) {
  return (
    <div className="relative bg-white border border-gray-200 rounded p-6 pt-8 shadow-md">
      <div className="absolute -top-3 left-4">
        <span className="bg-white text-gray-700 text-xs uppercase px-4 py-2 rounded-full border border-gray-300">
          TOPIC
        </span>
      </div>

      <Link to={cancelUrl}>
        <Button
          variant="minimal"
          size="icon"
          className="rounded-full bg-white border border-gray-200 absolute -top-3 -right-3"
        >
          <FontAwesomeIcon icon={faXmark} />
        </Button>
      </Link>

      <div className="flex gap-4 items-center">
        <img
          src={topic.ThumbnailUrl}
          alt={topic.Name}
          className="w-[200px] h-auto rounded border border-gray-200"
        />
        <div className="flex-1">
          <h3 className="text-lg max-w-[300px]">{topic.Name}</h3>
        </div>
      </div>
    </div>
  );
}
