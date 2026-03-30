import type { Dictionary } from "./es";

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  es: () => import("./es").then((m) => m.default),
  en: () => import("./en").then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;
export const locales = ["es", "en"] as const;
export const defaultLocale: Locale = "es";

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
