"use client";

import { useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

interface PexelsPhoto {
  id: number;
  url: string;
  thumbnail: string;
  photographer: string;
  photographerUrl: string;
  pexelsUrl: string;
  alt: string;
}

export default function ImageUploader({
  value,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState(value);
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);

  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);

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

  async function searchPexels(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const query = search.trim();

    if (!query) {
      return;
    }

    try {
      setSearching(true);
      setPhotos([]);

      const response = await fetch(
        `/api/pexels/search?query=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Impossible de rechercher les images."
        );
      }

      setPhotos(data.photos ?? []);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Impossible de rechercher les images."
      );
    } finally {
      setSearching(false);
    }
  }

  function selectPexelsImage(photo: PexelsPhoto) {
    setPreview(photo.url);
    onChange(photo.url);
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
              ðŸ“·
            </p>

            <p className="font-semibold text-lg">
              DÃ©posez votre image ici
            </p>

            <p className="text-gray-500">
              ou cliquez pour sÃ©lectionner un fichier
            </p>
          </>
        )}
      </div>

      <div className="rounded-xl border bg-gray-50 p-5">
        <h3 className="mb-3 text-lg font-bold">
          🔎 Rechercher une image sur Pexels
        </h3>

        <form
          onSubmit={searchPexels}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Ex : football, PSG, Marseille..."
            className="flex-1 rounded-lg border bg-white p-3"
          />

          <button
            type="submit"
            disabled={searching || !search.trim()}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {searching
              ? "Recherche..."
              : "Rechercher"}
          </button>
        </form>

        {photos.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() =>
                  selectPexelsImage(photo)
                }
                className="group overflow-hidden rounded-xl border bg-white text-left transition hover:border-blue-600 hover:shadow-lg"
              >
                <img
                  src={photo.thumbnail}
                  alt={photo.alt || "Image Pexels"}
                  className="h-32 w-full object-cover transition group-hover:scale-105"
                />

                <div className="p-2">
                  <p className="text-xs font-medium text-gray-700">
                    Utiliser cette image
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-500">
                    {photo.photographer}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {!searching &&
          search.trim() &&
          photos.length === 0 && (
            <p className="mt-4 text-sm text-gray-500">
              Aucune image trouvÃ©e.
            </p>
          )}

        <p className="mt-4 text-xs text-gray-500">
          Images fournies par Pexels. Pensez Ã  respecter
          les conditions d'utilisation et les crÃ©dits
          demandÃ©s par Pexels.
        </p>
      </div>

      {preview && (
        <div className="overflow-hidden rounded-xl border">
          <img
            src={preview}
            alt="PrÃ©visualisation"
            className="w-full max-h-[500px] object-cover"
          />
        </div>
      )}
    </div>
  );
}