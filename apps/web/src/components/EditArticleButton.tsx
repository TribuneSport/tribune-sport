"use client";

import Link from "next/link";

type Props = {
  slug: string;
};

export default function EditArticleButton({ slug }: Props) {
  return (
    <Link
      href={`/admin/article/${slug}`}
      className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-white transition hover:bg-amber-600"
    >
      Modifier
    </Link>
  );
}