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
  const [searchError, setSearchError] = useState("");

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
      alert("Erreur pendant l’upload.");
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

  async function searchPexels() {
    const query = search.trim();

    if (!query || searching) {
      return;
    }

    try {
      setSearching(true);
      setPhotos([]);
      setSearchError("");

      const response = await fetch(
        `/api/pexels/search?query=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      console.log("Réponse Pexels :", data);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Impossible de rechercher les images."
        );
      }

      const rawPhotos = Array.isArray(data?.photos)
        ? data.photos
        : Array.isArray(data?.data?.photos)
          ? data.data.photos
          : Array.isArray(data?.results)
            ? data.results
            : [];

      const normalizedPhotos: PexelsPhoto[] =
        rawPhotos
          .map((photo: any, index: number) => {
            const imageUrl =
              photo?.url ||
              photo?.src?.large2x ||
              photo?.src?.large ||
              photo?.src?.medium ||
              photo?.src?.original ||
              "";

            const thumbnailUrl =
              photo?.thumbnail ||
              photo?.src?.medium ||
              photo?.src?.small ||
              photo?.src?.tiny ||
              imageUrl;

            if (!imageUrl) {
              return null;
            }

            return {
              id: Number(photo?.id) || index,
              url: imageUrl,
              thumbnail: thumbnailUrl,
              photographer:
                photo?.photographer ||
                "Pexels",
              photographerUrl:
                photo?.photographer_url ||
                photo?.photographerUrl ||
                "",
              pexelsUrl:
                photo?.pexels_url ||
                photo?.pexelsUrl ||
                "",
              alt:
                photo?.alt ||
                photo?.alt_description ||
                "Image de football",
            };
          })
          .filter(
            (photo: PexelsPhoto | null): photo is PexelsPhoto =>
              photo !== null
          );

      setPhotos(normalizedPhotos);

      if (normalizedPhotos.length === 0) {
        setSearchError(
          "Aucune image trouvée pour cette recherche."
        );
      }
    } catch (error) {
      console.error(
        "Erreur recherche Pexels :",
        error
      );

      setPhotos([]);

      setSearchError(
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
        className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition ${
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
            <p className="mb-4 text-5xl">
              📷
            </p>

            <p className="text-lg font-semibold">
              Déposez votre image ici
            </p>

            <p className="text-gray-500">
              ou cliquez pour sélectionner un fichier
            </p>
          </>
        )}
      </div>

      <div className="rounded-xl border bg-gray-50 p-5">
        <h3 className="mb-3 text-lg font-bold">
          🔎 Rechercher une image sur Pexels
        </h3>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                searchPexels();
              }
            }}
            placeholder="Ex : football, PSG, Marseille..."
            className="flex-1 rounded-lg border bg-white p-3"
          />

          <button
            type="button"
            onClick={searchPexels}
            disabled={
              searching || !search.trim()
            }
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {searching
              ? "Recherche..."
              : "Rechercher"}
          </button>
        </div>

        {searching && (
          <div className="mt-5 rounded-lg border bg-white p-6 text-center">
            <p className="font-medium">
              Recherche des images...
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Quelques secondes peuvent être nécessaires.
            </p>
          </div>
        )}

        {!searching &&
          photos.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() =>
                    selectPexelsImage(photo)
                  }
                  className={`group overflow-hidden rounded-xl border bg-white text-left transition hover:border-blue-600 hover:shadow-lg ${
                    preview === photo.url
                      ? "border-2 border-blue-600 ring-2 ring-blue-200"
                      : ""
                  }`}
                >
                  <div className="relative h-32 w-full overflow-hidden bg-gray-100">
                    <img
                      src={photo.thumbnail}
                      alt={
                        photo.alt ||
                        "Image Pexels"
                      }
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        const img =
                          e.currentTarget;

                        if (
                          img.src !==
                          photo.url
                        ) {
                          img.src = photo.url;
                        }
                      }}
                    />

                    {preview === photo.url && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
                          ✓ Sélectionnée
                        </span>
                      </div>
                    )}
                  </div>

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
          photos.length === 0 &&
          searchError && (
            <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-600">
                {searchError}
              </p>
            </div>
          )}

        <p className="mt-4 text-xs text-gray-500">
          Images fournies par Pexels. Pensez à respecter
          les conditions d’utilisation et les crédits
          demandés par Pexels.
        </p>
      </div>

      {preview && (
        <div className="overflow-hidden rounded-xl border">
          <img
            src={preview}
            alt="Prévisualisation"
            className="max-h-[500px] w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}