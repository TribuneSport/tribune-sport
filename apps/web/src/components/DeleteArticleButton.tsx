"use client";

import { useRouter } from "next/navigation";

interface Props {
  id: number;
}

export default function DeleteArticleButton({ id }: Props) {
  const router = useRouter();

  async function remove() {
    const ok = window.confirm("Supprimer cet article ?");
    if (!ok) return;

    const res = await fetch(`/api/articles/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Impossible de supprimer l'article.");
    }
  }

  return (
    <button
      type="button"
      onClick={remove}
      className="rounded-xl bg-red-600 px-8 py-4 font-bold text-white transition hover:bg-red-700"
    >
      🗑️ Supprimer
    </button>
  );
}