import { AnalyzeSources } from "@/lib/services/analyze-sources";
import type { ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const topic = formData.get("topic");

    const service = new AnalyzeSources();
    const sources = await service.gatherArticles(topic as string);

    return { sources };
  } catch (error) {
    console.error(`Failed to find topic sources`, error);
    return { error };
  }
}
