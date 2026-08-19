export const CATEGORY_MAP: Record<string, string> = {
  // France
  "ligue 1": "France",
  "ligue1": "France",
  "l1": "France",
  "france": "France",

  // Europe
  "premier league": "Europe",
  "la liga": "Europe",
  "liga": "Europe",
  "serie a": "Europe",
  "bundesliga": "Europe",
  "eredivisie": "Europe",
  "europe": "Europe",

  // Coupes européennes
  "champions league": "Europe",
  "uefa champions league": "Europe",
  "ligue des champions": "Europe",
  "europa league": "Europe",

  // Mercato
  "mercato": "Mercato",
  "transfer": "Mercato",
  "transfers": "Mercato",
  "transfer news": "Mercato",

  // International
  "world cup": "International",
  "coupe du monde": "International",
  "fifa": "International",
  "euro": "International",
  "nation league": "International",
  "copa america": "International",
  "afcon": "International",
  "can": "International",
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