import type { Locale } from "@/lib/locales";

// Pages secondaires et leurs adresses dans chaque langue (textes dans locales/*.json → pages.<id>).
export const PAGE_IDS = ["carte", "kebab", "doner", "legal"] as const;
export type PageId = (typeof PAGE_IDS)[number];

export const SLUGS: Record<PageId, Record<Locale, string>> = {
  carte: { fr: "carte", en: "menu" },
  kebab: { fr: "kebab-amiens", en: "kebab-amiens" },
  doner: { fr: "doner-berlinois-amiens", en: "berlin-doner-amiens" },
  legal: { fr: "mentions-legales", en: "legal" },
};

export const pagePath = (id: PageId, lang: Locale) => `/${lang}/${SLUGS[id][lang]}`;

export const pageOfSlug = (slug: string, lang: Locale) => PAGE_IDS.find((id) => SLUGS[id][lang] === slug) ?? null;
