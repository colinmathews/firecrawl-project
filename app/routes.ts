import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home/index.tsx"),
    route("battle", "routes/battle/index.tsx"),
  ]),
  route("api/topics", "routes/api/topics.ts"),
  route("api/articles", "routes/api/articles.ts"),
  route("api/find-topic-sources", "routes/api/find-topic-sources.ts"),
] satisfies RouteConfig;
