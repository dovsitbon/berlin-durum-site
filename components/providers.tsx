"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import site from "@/data/site.json";
import type { Dict, Locale } from "@/lib/i18n";
import { isItem } from "@/lib/carte";
import { sameLine, type OrderLine } from "@/lib/order";

type LocaleCtx = { lang: Locale; d: Dict };
const LocaleContext = createContext<LocaleCtx | null>(null);

export function useLocale() {
  const v = useContext(LocaleContext);
  if (!v) throw new Error("useLocale hors de Providers");
  return v;
}

/** Panier de la commande à emporter, partagé entre la carte (bouton « Ajouter ») et le formulaire. Gardé pour la session. */
type CartCtx = {
  lines: OrderLine[];
  add: (line: OrderLine) => void;
  update: (i: number, patch: Partial<OrderLine>) => void;
  remove: (i: number) => void;
  clear: () => void;
  /** Dernier ajout (nom du plat), pour la petite confirmation « Ajouté » */
  last: { key: number; item: OrderLine["item"] } | null;
};
const CartContext = createContext<CartCtx | null>(null);
const KEY = "bd-cart";

export function useCart() {
  const v = useContext(CartContext);
  if (!v) throw new Error("useCart hors de Providers");
  return v;
}

function merge(lines: OrderLine[]) {
  const out: OrderLine[] = [];
  for (const l of lines) {
    const j = out.findIndex((x) => sameLine(x, l));
    if (j >= 0) out[j] = { ...out[j], qty: Math.min(out[j].qty + l.qty, site.order.maxPerLine) };
    else out.push(l);
  }
  return out;
}

export function Providers({ lang, d, children }: { lang: Locale; d: Dict; children: ReactNode }) {
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [last, setLast] = useState<CartCtx["last"]>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(KEY) ?? "[]") as OrderLine[];
      // eslint-disable-next-line react-hooks/set-state-in-effect -- panier de la session, connu seulement dans le navigateur
      if (Array.isArray(saved)) setLines(saved.filter((l) => isItem(l?.item)));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const add = useCallback((line: OrderLine) => {
    setLines((ls) => merge([...ls, line]));
    setLast({ key: Date.now(), item: line.item });
  }, []);
  const update = useCallback((i: number, patch: Partial<OrderLine>) => setLines((ls) => merge(ls.map((l, j) => (j === i ? { ...l, ...patch } : l)))), []);
  const remove = useCallback((i: number) => setLines((ls) => ls.filter((_, j) => j !== i)), []);
  const clear = useCallback(() => setLines([]), []);
  const cart = useMemo(() => ({ lines, add, update, remove, clear, last }), [lines, add, update, remove, clear, last]);

  return (
    <LocaleContext.Provider value={{ lang, d }}>
      <CartContext.Provider value={cart}>{children}</CartContext.Provider>
    </LocaleContext.Provider>
  );
}
