"use client";

import Link from "next/link";

interface Props {
  id: number;
}

export default function EditArticleButton({ id }: Props) {
  return (
    <Link
      href={`/admin/articles/${id}/edit`}
      className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
    >
      Modifier
    </Link>
  );
}