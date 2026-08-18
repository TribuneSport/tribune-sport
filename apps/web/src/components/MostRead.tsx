import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function MostRead() {
  const articles = await db.article.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return (
    <aside className="h-full">
      <section className="h-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔥</span>

              <h2 className="text-lg font-black tracking-tight text-slate-950">
                Les plus lus
              </h2>
            </div>

            <span className="text-sm font-bold text-red-600">↗</span>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="px-5 py-8">
            <p className="text-sm leading-6 text-slate-500">
              Les premières actualités apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {articles.map((article, index) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="group flex gap-3 px-5 py-4 transition-colors hover:bg-slate-50"
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                    index === 0
                      ? "bg-red-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {index + 1}
                </div>

                <div className="relative h-[62px] w-[82px] shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <Image
                    src={article.image || "/football.jpg"}
                    alt={article.title}
                    fill
                    sizes="82px"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-3 text-sm font-bold leading-[1.35] text-slate-900 transition-colors group-hover:text-red-600">
                    {article.title}
                  </h3>

                  <p className="mt-1.5 text-[10px] font-medium text-slate-400">
                    {new Date(article.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </aside>
  );
}