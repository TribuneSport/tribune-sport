import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("query")?.trim();

    if (!query) {
      return NextResponse.json(
        {
          error: "Le terme de recherche est obligatoire.",
        },
        {
          status: 400,
        }
      );
    }

    const apiKey = process.env.PEXELS_API_KEY;

    if (!apiKey) {
      console.error("PEXELS_API_KEY est absente.");

      return NextResponse.json(
        {
          error: "La clé API Pexels n'est pas configurée.",
        },
        {
          status: 500,
        }
      );
    }

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=12`,
      {
        headers: {
          Authorization: apiKey,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "Erreur Pexels:",
        response.status,
        response.statusText
      );

      return NextResponse.json(
        {
          error: "Impossible de rechercher les images Pexels.",
        },
        {
          status: response.status,
        }
      );
    }

    const data = await response.json();

    const photos = Array.isArray(data.photos)
      ? data.photos.map((photo: any) => ({
          id: photo.id,
          url: photo.src?.large ?? photo.src?.original ?? "",
          thumbnail:
            photo.src?.medium ??
            photo.src?.small ??
            photo.src?.tiny ??
            "",
          photographer: photo.photographer ?? "",
          photographerUrl: photo.photographer_url ?? "",
          pexelsUrl: photo.url ?? "",
          alt: photo.alt ?? "",
        }))
      : [];

    return NextResponse.json({
      photos,
    });
  } catch (error) {
    console.error("GET /api/pexels/search error:", error);

    return NextResponse.json(
      {
        error: "Une erreur est survenue lors de la recherche.",
      },
      {
        status: 500,
      }
    );
  }
}