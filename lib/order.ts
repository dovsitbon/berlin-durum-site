import site from "@/data/site.json";
import type { Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { formatDay, formatTime, isoDay, price } from "@/lib/format";
import { FORMULA, isItem, ITEMS, OPTIONS, SAUCES, unitPrice, type ItemId, type SauceId } from "@/lib/carte";
import { addDays, pickupTimes } from "@/lib/hours";

export const MODES = ["emporter", "surplace"] as const;
export type Mode = (typeof MODES)[number];

/**
 * Une ligne du panier : le plat, la quantité, la formule (+ frites maison et canette), la sauce maison,
 * l'option (fromage au choix, parfum de la boisson…) et la boisson de la formule.
 */
export type OrderLine = { item: ItemId; qty: number; menu: boolean; sauce: SauceId | ""; option: string; drink: string };
export type Order = { lines: OrderLine[]; mode: Mode; day: string; time: string; name: string; phone: string; email: string; message: string };

export function newLine(item: ItemId, menu = false): OrderLine {
  const it = ITEMS[item];
  return {
    item,
    qty: 1,
    menu: menu && it.menu,
    sauce: it.sauce ? ((it.sauceDefault as SauceId) ?? SAUCES[0]) : "",
    option: it.option ? OPTIONS[it.option][0] : "",
    drink: menu && it.menu ? OPTIONS[FORMULA.drink][0] : "",
  };
}

/** Deux lignes identiques (même plat, mêmes choix) se cumulent dans le panier. */
export const sameLine = (a: OrderLine, b: OrderLine) => a.item === b.item && a.menu === b.menu && a.sauce === b.sauce && a.option === b.option && a.drink === b.drink;

export const isPhone = (v: string) => /^[+\d][\d\s\-().]{7,19}$/.test(v.trim());
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/** Jours de retrait proposés : aujourd'hui et les jours suivants qui ont encore un créneau. */
export function pickupDays(now: Date) {
  const today = isoDay(now);
  return Array.from({ length: site.order.daysAhead + 1 }, (_, i) => addDays(today, i)).filter((day) => pickupTimes(day, now).length > 0);
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Nettoie une commande reçue côté serveur : null si elle est incomplète ou hors des heures d'ouverture. */
export function parseOrder(v: unknown, now = new Date()): Order | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const lines = (Array.isArray(o.lines) ? o.lines : []).slice(0, 30).flatMap((l): OrderLine[] => {
    if (!l || typeof l !== "object") return [];
    const x = l as Record<string, unknown>;
    if (!isItem(x.item)) return [];
    const it = ITEMS[x.item];
    const qty = Math.min(Math.max(Math.round(Number(x.qty) || 1), 1), site.order.maxPerLine);
    const menu = it.menu && x.menu === true;
    const sauce = it.sauce && SAUCES.includes(x.sauce as SauceId) ? (x.sauce as SauceId) : "";
    const option = it.option && OPTIONS[it.option].includes(x.option as string) ? (x.option as string) : it.option ? OPTIONS[it.option][0] : "";
    const drink = menu ? (OPTIONS[FORMULA.drink].includes(x.drink as string) ? (x.drink as string) : OPTIONS[FORMULA.drink][0]) : "";
    return [{ item: x.item, qty, menu, sauce, option, drink }];
  });
  const day = ISO.test(str(o.day, 10)) ? str(o.day, 10) : "";
  const q: Order = {
    lines,
    mode: MODES.includes(o.mode as Mode) ? (o.mode as Mode) : "emporter",
    day,
    time: str(o.time, 5),
    name: str(o.name, 120),
    phone: str(o.phone, 30),
    email: str(o.email, 160),
    message: str(o.message, 1000),
  };
  // Marge de 10 minutes : le client a pu choisir son heure juste avant qu'elle ne sorte de la liste
  const graceNow = new Date(now.getTime() - 10 * 60_000);
  if (!q.lines.length || !day || !pickupTimes(day, graceNow).includes(q.time) || !q.name || !isPhone(q.phone)) return null;
  if (q.email && !isEmail(q.email)) q.email = "";
  return q;
}

/** Total estimé ; « partial » si un des articles n'a pas encore de prix. */
export function orderTotal(lines: OrderLine[]) {
  let sum = 0;
  let count = 0;
  let partial = false;
  for (const l of lines) {
    count += l.qty;
    const p = unitPrice(l.item, l.menu);
    if (p === null) partial = true;
    else sum += p * l.qty;
  }
  return { sum: Math.round(sum * 100) / 100, count, partial };
}

/** Les choix d'une ligne en clair : « menu (Coca-Cola), sauce blanche, fêta ». */
export function lineDetails(l: OrderLine, d: Dict) {
  const o = d.carte.options as Record<string, string>;
  return [
    l.menu ? `${d.order.formulaShort}${l.drink ? ` (${o[l.drink] ?? l.drink})` : ""}` : "",
    l.sauce ? d.carte.sauces[l.sauce] : "",
    l.option ? (o[l.option] ?? l.option) : "",
  ].filter(Boolean);
}

/** Une ligne en clair : « 2 × Berliner fêta (menu (Coca-Cola), sauce blanche) ». */
export function lineLabel(l: OrderLine, d: Dict) {
  const extra = lineDetails(l, d);
  return `${l.qty} × ${d.products[l.item].name}${extra.length ? ` (${extra.join(", ")})` : ""}`;
}

/** Récapitulatif texte de la commande (e-mail, WhatsApp). */
export function orderText(q: Order, lang: Locale, d: Dict, withContact = true) {
  const m = d.order.mail;
  const c = lang === "fr" ? " :" : ":";
  const { sum, partial } = orderTotal(q.lines);
  const blocks = [
    [`${m.lines}${c}`, ...q.lines.map((l) => `– ${lineLabel(l, d)}${unitPrice(l.item, l.menu) !== null ? ` · ${price(unitPrice(l.item, l.menu)! * l.qty, lang)}` : ""}`)].join("\n"),
    `${m.mode}${c} ${d.order.modes[q.mode]}`,
    `${q.mode === "surplace" ? m.arrival : m.pickup}${c} ${formatDay(q.day, lang, { weekday: "long", day: "numeric", month: "long" })}, ${formatTime(q.time, lang)}`,
    `${m.total}${c} ${price(sum, lang)}${partial ? ` + ${d.carte.priceOnSite.toLowerCase()}` : ""}`,
    withContact ? [`${m.name}${c} ${q.name}`, `${m.phone}${c} ${q.phone}`, q.email ? `${m.email}${c} ${q.email}` : ""].filter(Boolean).join("\n") : "",
    q.message ? `${m.message}${c}\n${q.message}` : "",
  ];
  return blocks.filter(Boolean).join("\n\n");
}

/** Lien WhatsApp (vide tant que le restaurant n'a pas donné de portable : data/site.json → whatsapp). */
export const waLink = (text: string) => (site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}` : "");
