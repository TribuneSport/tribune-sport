"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  id: number;
  published: boolean;
};

export default function ArticleActions({
  id,
  published,
}: Props) {

  const [loading, setLoading] = useState(false);

  async function publish() {

    setLoading(true);

    const res = await fetch("/api/articles/publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(JSON.stringify(data));
      setLoading(false);
      return;
    }

    window.location.reload();

  }

  async function remove() {

    if (!confirm("Supprimer cet article ?")) return;

    setLoading(true);

    const res = await fetch("/api/articles/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(JSON.stringify(data));
      console.error(data);
      setLoading(false);
      return;
    }

    window.location.reload();

  }

  return (

    <div className="flex gap-2">

      <Link
        href={`/admin/articles/${id}`}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Modifier
      </Link>

      {!published && (
        <button
          onClick={publish}
          disabled={loading}
          className="rounded bg-green-600 px-4 py-2 text-white"
        >
          Publier
        </button>
      )}

      <button
        onClick={remove}
        disabled={loading}
        className="rounded bg-red-600 px-4 py-2 text-white"
      >
        Supprimer
      </button>

    </div>

  );

}