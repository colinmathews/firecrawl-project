import { NewsTopicCollection } from "@/lib/db/collections/news-topic";
import { GatherTopics } from "@/lib/services/gather-topics";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const params = new URL(request.url).searchParams;
    const day = params.get("day");

    const topics = await new NewsTopicCollection().findAllByDay(day as string);
    return { topics };
  } catch (error) {
    console.error(`Failed to load topics`, error);
    return {
      error,
    };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const day = formData.get("day");

    const service = new GatherTopics();
    const rawTopics = await service.gatherTopics();

    const collection = new NewsTopicCollection();
    const topics = await collection.create(
      rawTopics.map((topic) => ({
        DayShortName: day as string,
        Name: topic.topic,
        ThumbnailUrl: topic.thumbnail ?? "",
      }))
    );

    return { topics };
  } catch (error) {
    console.error(`Failed to generate topics`, error);
    return { error };
  }
}
