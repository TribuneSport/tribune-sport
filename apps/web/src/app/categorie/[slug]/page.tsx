import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

function slugToCategory(slug: string) {
  const map: Record<string, string> = {
    "ligue-1": "Ligue 1",
    mercato: "Mercato",
    europe: "Europe",
    international: "International",
    psg: "PSG",
    om: "OM",
    ol: "OL",
    lens: "Lens",
    football: "Football",
  };

  return map[slug] ?? slug.replace(/-/g, " ");
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const category = slugToCategory(slug);

  const articles = await prisma.article.findMany({
    where: {
      published: true,
      category,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (articles.length === 0) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100">

      <div className="mx-auto max-w-7xl py-10">

        <Link
          href="/"
          className="mb-8 inline-flex rounded-xl bg-white px-5 py-3 shadow hover:bg-gray-100"
        >
          ← Accueil
        </Link>

        <h1 className="mb-10 text-5xl font-extrabold">
          {category}
        </h1>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {articles.map((article) => (

            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="overflow-hidden rounded-2xl bg-white shadow transition hover:-translate-y-1 hover:shadow-xl"
            >

              <Image
                src={article.image || "/placeholder.jpg"}
                alt={article.title}
                width={600}
                height={350}
                className="h-56 w-full object-cover"
              />

              <div className="p-6">

                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                  {article.category}
                </span>

                <h2 className="mt-4 text-2xl font-bold">
                  {article.title}
                </h2>

                <p className="mt-4 line-clamp-3 text-gray-600">
                  {article.summary}
                </p>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </main>
  );
}