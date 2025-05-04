import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("battle", "routes/battle/index.tsx"),
  route("api/topics", "routes/api/topics.ts"),
  route("api/articles", "routes/api/articles.ts"),
  route("api/find-topic-sources", "routes/api/find-topic-sources.ts"),
] satisfies RouteConfig;
