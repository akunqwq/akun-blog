import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, type PostListItem } from "../../lib/posts";

export const metadata: Metadata = {
  title: "阿鲲 の小窝 - 文章",
  description: "阿鲲的文章列表",
};

export default function ArticlesPage() {
  const articles = getAllPosts();

  return (
    <main className="max-w-5xl mx-auto px-6 pt-24 md:pt-12 pb-12">
      <h1 className="text-4xl font-bold mb-10 tracking-tight dark:text-gray-100">
        文章列表
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {articles.map((a: PostListItem) => (
          <Link
            key={a.slug}
            href={`/articles/${a.slug}`}
            className="
        group block overflow-hidden
        rounded-2xl bg-white/60 backdrop-blur-md
        border border-gray-200/50 shadow-sm
        hover:shadow-xl hover:-translate-y-1
        transition-all duration-300
        dark:bg-gray-800/70 dark:border-gray-700
      "
          >
            {/* 顶部封面 */}
            <div className="h-40 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              {a.cover ? (
                <img
                  src={a.cover}
                  alt={a.title}
                  className="
              w-full h-full object-cover
              group-hover:scale-105
              transition-transform duration-300
            "
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
              )}
            </div>

            {/* 下方内容区：小图 + 文字 */}
            <div className="p-6 flex items-start gap-4">

              {/* 小缩略图（左侧） */}
              <div
                className="
      w-20 h-20 rounded-xl overflow-hidden bg-gray-200
      shrink-0
      md:w-24 md:h-24
      dark:bg-gray-700
    "
              >
                {a.thumbnail ? (
                  <img
                    src={a.thumbnail}
                    alt={a.title}
                    className="w-full h-full object-cover"
                  />
                ) : a.cover ? (
                  <img
                    src={a.cover}
                    alt={a.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 dark:bg-gray-700" />
                )}
              </div>

              {/* 右侧文字区域 */}
              <div className="flex-1 pt-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">{a.date}</div>

                <h2 className="text-xl font-semibold mt-1 leading-snug dark:text-gray-100">
                  {a.title}
                </h2>

                <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 leading-relaxed">
                  {a.summary}
                </p>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
