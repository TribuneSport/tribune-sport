import Link from "next/link";

type Props = {
  article: {
    id: number;
    title: string;
    summary: string;
    category: string;
    published: boolean;
    createdAt: Date;
  };
};

export default function ArticleCard({
  article,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow">

      <h2 className="text-2xl font-bold">

        {article.title}

      </h2>

      <p className="mt-4 text-gray-600">

        {article.summary}

      </p>

      <div className="mt-6 flex gap-3">

        <Link
          href={`/admin/articles/${article.id}`}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Modifier
        </Link>

        <button className="rounded bg-green-600 px-4 py-2 text-white">
          Publier
        </button>

        <button className="rounded bg-red-600 px-4 py-2 text-white">
          Supprimer
        </button>

      </div>

    </div>
  );
}