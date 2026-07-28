export type Language = "en" | "id" | "de" | "es" | "fr" | "ar";

export const languages = {
  get default(): Language {
    return "id" satisfies Language;
  },

  get meta(): Record<
    Language,
    {
      locale: string;
      currency: string;
      decimal: number;
      symbol: string;
    }
  > {
    return {
      en: {
        locale: "en-US",
        currency: "USD",
        decimal: 2,
        symbol: "$",
      },
      id: {
        locale: "id-ID",
        currency: "IDR",
        decimal: 0,
        symbol: "Rp",
      },
      de: {
        locale: "de-DE",
        currency: "EUR",
        decimal: 2,
        symbol: "€",
      },
      es: {
        locale: "es-ES",
        currency: "EUR",
        decimal: 2,
        symbol: "€",
      },
      fr: {
        locale: "fr-FR",
        currency: "EUR",
        decimal: 2,
        symbol: "€",
      },
      ar: {
        locale: "ar-SA",
        currency: "SAR",
        decimal: 2,
        symbol: "ر.س",
      },
    };
  },
};
