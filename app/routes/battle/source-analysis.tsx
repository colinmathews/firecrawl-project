import type { NewsArticleRecord } from "@/lib/db/collections/news-article";
import { cn } from "@/lib/utils/cn";

export default function SourceAnalysis({
  article,
}: {
  article: NewsArticleRecord;
}) {
  const biasValue = Math.abs(article["Bias Rating"]) / 100;
  const biasColor =
    article["Bias Rating"] === 0
      ? "#9ca3af"
      : article["Bias Rating"] < 0
      ? "#3b82f6"
      : "#ef4444"; // gray-400 : blue-500 : red-500

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-[500px] shrink-0">
      <h3 className="font-bold text-lg mb-4 text-center">{article.Source}</h3>

      <div className="relative w-48 h-[120px] mx-auto mb-6">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 10 40 A 40 40 0 0 1 90 40"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Colored arc based on bias */}
          <path
            d="M 10 40 A 40 40 0 0 1 90 40"
            fill="none"
            stroke={biasColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${biasValue * 134} 134`}
          />
        </svg>
        <div
          className={cn(
            "absolute bottom-[15px] left-0 w-full flex items-center flex-col leading-tighter",
            {
              "text-blue-500": article["Bias Rating"] < 0,
              "text-red-500": article["Bias Rating"] > 0,
              "text-gray-700": article["Bias Rating"] === 0,
            }
          )}
        >
          <div className={cn("text-2xl font-bold")}>
            {(biasValue * 100).toFixed(0)}
          </div>
          <div>
            <span className="text-sm font-bold">
              {article["Bias Rating"] < 0
                ? "left-leaning"
                : article["Bias Rating"] > 0
                ? "right-leaning"
                : "neutral"}
            </span>
          </div>
        </div>
      </div>

      <div className="text-lg text-center mb-10">{article.Headline}</div>

      <div className="text-xs uppercase font-bold text-gray-500 mb-2">
        Analysis
      </div>
      <p className="text-gray-700 mb-4 text-sm">{article.Analysis}</p>

      <a
        href={article.Url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-app-orange-500 hover:text-app-orange-500/80 hover:underline text-sm"
      >
        Read original article
      </a>
    </div>
  );
}
