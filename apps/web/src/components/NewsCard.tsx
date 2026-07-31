type NewsCardProps = {
  title: string;
  category: string;
  summary: string;
  date: string;
};

export default function NewsCard({
  title,
  category,
  summary,
  date,
}: NewsCardProps) {
  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition">

      <div className="h-48 bg-gradient-to-r from-red-900 to-red-600"></div>

      <div className="p-6">

        <span className="text-sm font-bold text-red-700">
          {category}
        </span>

        <h3 className="mt-3 text-2xl font-bold">
          {title}
        </h3>

        <p className="mt-4 text-gray-600">
          {summary}
        </p>

        <div className="mt-6 flex items-center justify-between">

          <span className="text-sm text-gray-500">
            {date}
          </span>

          <button className="rounded-lg bg-red-900 px-4 py-2 text-white hover:bg-red-700">
            Lire l'article →
          </button>

        </div>

      </div>

    </article>
  );
}