import Image from "next/image";
import Link from "next/link";

type NewsCardProps = {
  id: number;
  title: string;
  category: string;
  summary: string;
  date: string;
  image?: string;
};

export default function NewsCard({
  id,
  title,
  category,
  summary,
  date,
  image,
}: NewsCardProps) {
  return (
    <article className="overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg">
      <Image
        src={image || "/images/default.jpg"}
        alt={title}
        width={600}
        height={350}
        className="h-56 w-full object-cover"
      />

      <div className="p-6">
        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-700">
          {category}
        </span>

        <h3 className="mt-4 text-2xl font-bold leading-tight">
          {title}
        </h3>

        <p className="mt-4 leading-7 text-gray-600">
          {summary}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {date}
          </span>

          <Link
            href={`/article/${id}`}
            className="rounded-lg bg-red-700 px-5 py-3 font-semibold text-white transition hover:bg-red-900"
          >
            Lire →
          </Link>
        </div>
      </div>
    </article>
  );
}