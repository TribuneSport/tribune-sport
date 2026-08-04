export const CATEGORY_MAP: Record<string, string> = {
  // France
  "ligue 1": "Ligue 1",
  "ligue1": "Ligue 1",
  "l1": "Ligue 1",
  "france": "Ligue 1",

  // Europe
  "premier league": "Europe",
  "la liga": "Europe",
  "liga": "Europe",
  "serie a": "Europe",
  "bundesliga": "Europe",
  "eredivisie": "Europe",
  "europe": "Europe",

  // Coupes
  "champions league": "Ligue des Champions",
  "uefa champions league": "Ligue des Champions",
  "ligue des champions": "Ligue des Champions",
  "europa league": "Europe",

  // Mercato
  "mercato": "Mercato",
  "transfer": "Mercato",
  "transfers": "Mercato",
  "transfer news": "Mercato",

  // International
  "world cup": "International",
  "euro": "International",
  "international": "International",

  // Classements
  "standings": "Classements",
  "ranking": "Classements",
  "classement": "Classements",
};

export function normalizeCategory(value?: string | null): string {
  if (!value) return "Football";

  const key = value.trim().toLowerCase();

  return CATEGORY_MAP[key] ?? value.trim();
}