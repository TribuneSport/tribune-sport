"use client";

import { useRouter } from "next/navigation";

interface Props {
  id: number;
}

export default function DeleteArticleButton({
  id,
}: Props) {
  const router = useRouter();

  async function remove() {
    const ok = window.confirm(
      "Supprimer cet article ?"
    );

    if (!ok) return;

    const res = await fetch(`/api/articles/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <button
      onClick={remove}
      className="text-red-600"
      type="button"
    >
      Supprimer
    </button>
  );
}