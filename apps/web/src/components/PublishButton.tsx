"use client";

import { useRouter } from "next/navigation";

type Props = {
  id: number;
  published: boolean;
};

export default function PublishButton({
  id,
  published,
}: Props) {
  const router = useRouter();

  async function toggle() {
    await fetch("/api/admin/publish", {
      method: "POST",
      body: JSON.stringify({
        id,
      }),
    });

    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      className={
        published
          ? "rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
          : "rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      }
    >
      {published ? "Dépublier" : "Publier"}
    </button>
  );
}