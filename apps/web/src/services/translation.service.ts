import { franc } from "franc";

const LIBRE_TRANSLATE_URL =
  process.env.LIBRE_TRANSLATE_URL ||
  "http://localhost:5000/translate";

type LanguageMap = Record<string, string>;

const LANGUAGE_MAP: LanguageMap = {
  fra: "fr",
  eng: "en",
  spa: "es",
  ita: "it",
  deu: "de",
  por: "pt",
  nld: "nl",
};

export class TranslationService {
  detect(text: string): string {
    if (!text || text.trim().length < 20) {
      return "auto";
    }

    const detected = franc(text);

    return LANGUAGE_MAP[detected] ?? "auto";
  }

  async translate(text: string): Promise<string> {
    if (!text?.trim()) {
      return text;
    }

    const language = this.detect(text);

    // Article déjà en français
    if (language === "fr") {
      return text;
    }

    // Langue non reconnue
    if (language === "auto") {
      return text;
    }

    try {
      const response = await fetch(LIBRE_TRANSLATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          source: language,
          target: "fr",
          format: "text",
        }),
      });

      if (!response.ok) {
        console.error(
          "Erreur LibreTranslate :",
          response.status,
          response.statusText
        );

        return text;
      }

      const data = await response.json();

      if (
        typeof data?.translatedText !== "string" ||
        !data.translatedText.trim()
      ) {
        return text;
      }

      return data.translatedText;
    } catch (error) {
      console.error(
        "Service de traduction indisponible :",
        error
      );

      // Très important :
      // une panne de traduction ne doit jamais
      // empêcher l'import RSS.
      return text;
    }
  }
}

export const translator = new TranslationService();