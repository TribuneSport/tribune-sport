const API_URL = "https://api.football-data.org/v4";

export class FootballApiError extends Error {
  status: number;
  resetSeconds?: number;

  constructor(
    message: string,
    status: number,
    resetSeconds?: number
  ) {
    super(message);
    this.name = "FootballApiError";
    this.status = status;
    this.resetSeconds = resetSeconds;
  }
}

let lastRequestTime = 0;

/**
 * Le plan gratuit de football-data.org autorise
 * environ 10 requêtes par minute.
 *
 * On espace volontairement les requêtes pour éviter
 * les réponses 429.
 */
const MIN_REQUEST_INTERVAL = 6500;

async function waitBeforeRequest() {
  const now = Date.now();
  const elapsed = now - lastRequestTime;

  if (elapsed < MIN_REQUEST_INTERVAL) {
    const wait = MIN_REQUEST_INTERVAL - elapsed;

    console.log(
      `⏳ Attente ${Math.ceil(wait / 1000)}s avant la prochaine requête Football...`
    );

    await new Promise((resolve) => setTimeout(resolve, wait));
  }
}

export async function footballFetch<T>(
  endpoint: string
): Promise<T> {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    throw new Error(
      "FOOTBALL_DATA_API_KEY est absente des variables d'environnement."
    );
  }

  await waitBeforeRequest();

  lastRequestTime = Date.now();

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      headers: {
        "X-Auth-Token": apiKey,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (response.ok) {
    return (await response.json()) as T;
  }

  if (response.status === 429) {
    const resetHeader =
      response.headers.get("X-RequestCounter-Reset");

    const resetSeconds = resetHeader
      ? Number(resetHeader)
      : undefined;

    throw new FootballApiError(
      `Quota football-data.org atteint (429). ${
        resetSeconds
          ? `Nouvelle tentative possible dans environ ${resetSeconds}s.`
          : "Veuillez patienter avant de relancer."
      }`,
      429,
      resetSeconds
    );
  }

  let details = "";

  try {
    const body = await response.text();

    if (body) {
      details = ` - ${body}`;
    }
  } catch {
    // Rien à faire si la réponse ne peut pas être lue.
  }

  throw new FootballApiError(
    `Erreur football-data.org : ${response.status}${details}`,
    response.status
  );
}