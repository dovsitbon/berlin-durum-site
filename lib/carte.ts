import carte from "@/data/carte.json";

export type Tag = "vegan" | "vegetarian";
export type Illus = "berliner" | "durum" | "plate" | "burger" | "salad" | "fries" | "can" | "glass" | "cup" | "dessert";
export type OptionKind = keyof typeof carte.options;
export type Item = {
  price: number | null;
  tags: Tag[];
  sauce: boolean;
  sauceDefault?: string;
  menu: boolean;
  option?: OptionKind;
  photo: string[];
  illus: Illus;
  star?: boolean;
};
export type ItemId = keyof typeof carte.items;
export type BaseCategoryId = "doner" | "durum" | "assiettes" | "burgers" | "menus" | "boissons" | "desserts";
export type CategoryId = BaseCategoryId | "vege";
export type SauceId = "blanche" | "petit-pois" | "ail" | "gribiche" | "tahini" | "cocktail";

export const ITEMS = carte.items as unknown as Record<ItemId, Item>;
export const ITEM_IDS = Object.keys(ITEMS) as ItemId[];
export const SAUCES = carte.sauces as SauceId[];
export const OPTIONS = carte.options as Record<OptionKind, string[]>;
export const FORMULA = carte.formula as { price: number; drink: OptionKind };
export const EXTRAS = carte.extras;
export const BAR = carte.bar as { id: "pression" | "bouteilles" | "vins" | "aperitifs"; sizes?: string[]; rows: (string | number | null)[][] }[];
export const isItem = (v: unknown): v is ItemId => typeof v === "string" && v in ITEMS;

const VEG = new Set<Tag>(["vegan", "vegetarian"]);
export const isVeg = (id: ItemId) => ITEMS[id].tags.some((t) => VEG.has(t));

/** Onglets de la carte, dans l'ordre : döner, durum, assiettes, végétarien (calculé d'après les pastilles), burgers & salades, menus, boissons, desserts. */
export function categories(): { id: CategoryId; items: ItemId[] }[] {
  const base = carte.categories as { id: BaseCategoryId; items: ItemId[] }[];
  const vege = base.filter((c) => c.id !== "boissons" && c.id !== "menus").flatMap((c) => c.items.filter(isVeg));
  const out: { id: CategoryId; items: ItemId[] }[] = [...base];
  out.splice(3, 0, { id: "vege", items: vege });
  return out;
}

/** Plus petit prix d'une catégorie (« dès 9,99 € » sur les tuiles). */
export function fromPrice(id: CategoryId) {
  const c = categories().find((x) => x.id === id);
  const prices = (c?.items ?? []).map((i) => ITEMS[i].price).filter((p): p is number => p !== null);
  return prices.length ? Math.min(...prices) : null;
}

/** Prix d'une ligne de commande (formule comprise) ; null si le prix n'est pas encore connu. */
export function unitPrice(id: ItemId, menu = false) {
  const p = ITEMS[id].price;
  if (p === null) return null;
  return menu && ITEMS[id].menu ? p + FORMULA.price : p;
}

export const checked = carte.checked;
