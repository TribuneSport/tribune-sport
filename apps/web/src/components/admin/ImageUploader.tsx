"use client";

import { useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({
  value,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState(value);
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);

  async function upload(file: File) {
    try {
      setLoading(true);

      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error();
      }

      const json = await res.json();

      setPreview(json.url);
      onChange(json.url);
    } catch {
      alert("Erreur pendant l'upload.");
    } finally {
      setLoading(false);
    }
  }

  function choose(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    upload(file);
  }

  function drop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();

    setDrag(false);

    const file = e.dataTransfer.files?.[0];

    if (!file) return;

    upload(file);
  }

  return (
    <div className="space-y-5">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={drop}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition

        ${
          drag
            ? "border-blue-600 bg-blue-50"
            : "border-gray-300"
        }`}
      >
        <input
          ref={inputRef}
          hidden
          type="file"
          accept="image/*"
          onChange={choose}
        />

        {loading ? (
          <>
            <p className="text-lg font-semibold">
              Upload...
            </p>

            <p className="text-gray-500">
              Merci de patienter
            </p>
          </>
        ) : (
          <>
            <p className="text-5xl mb-4">
              📷
            </p>

            <p className="font-semibold text-lg">
              Déposez votre image ici
            </p>

            <p className="text-gray-500">
              ou cliquez pour sélectionner un fichier
            </p>
          </>
        )}
      </div>

      {preview && (
        <div className="overflow-hidden rounded-xl border">
          <img
            src={preview}
            alt="Prévisualisation"
            className="w-full max-h-[500px] object-cover"
          />
        </div>
      )}
    </div>
  );
}