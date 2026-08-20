import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function LatestNews() {
  const articles = await db.article.findMany({
    where: {
      published: true,
    },
    orderBy: [
      {
        pubDate: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: 5,
  });

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[11px] font-black uppercase tracking-[0.16em] text-red-600">
            Tribune Foot
          </p>

          <h2 className="text-2xl font-black tracking-tight text-slate-950">
            Dernières actualités
          </h2>
        </div>

        <Link
          href="/articles"
          className="shrink-0 text-sm font-bold text-red-600 transition-colors hover:text-red-800"
        >
          Voir les actualités →
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <h3 className="text-lg font-bold text-slate-900">
            Aucune actualité disponible
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Les prochaines publications apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          {articles.map((article) => {
            const articleDate =
              article.pubDate ?? article.createdAt;

            return (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-36 overflow-hidden bg-slate-100 sm:h-40">
                  <Image
                    src={article.image || "/football.jpg"}
                    alt={article.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                <div className="p-3.5">
                  <span className="text-[10px] font-black uppercase tracking-wide text-red-600">
                    {article.category}
                  </span>

                  <h3 className="mt-1.5 line-clamp-3 text-sm font-bold leading-[1.4] text-slate-900 transition-colors group-hover:text-red-600">
                    {article.title}
                  </h3>

                  <p className="mt-2.5 text-[10px] font-medium text-slate-400">
                    {new Date(articleDate).toLocaleDateString(
                      "fr-FR"
                    )}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}