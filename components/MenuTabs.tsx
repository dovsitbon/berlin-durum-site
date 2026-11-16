"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCart, useLocale } from "@/components/providers";
import { Photo } from "@/components/Photo";
import { PlusIcon } from "@/components/icons";
import { BAR, categories, EXTRAS, FORMULA, ITEMS, SAUCES, type CategoryId, type ItemId } from "@/lib/carte";
import { fill } from "@/lib/i18n";
import { price } from "@/lib/format";
import { firstImg } from "@/lib/media";
import { newLine } from "@/lib/order";

export const TAB_EVENT = "bd:tab";

/** Ouvre un onglet de la carte depuis une tuile, puis descend jusqu'à la carte. */
export function openTab(id: CategoryId) {
  window.dispatchEvent(new CustomEvent<CategoryId>(TAB_EVENT, { detail: id }));
  const el = document.getElementById("carte");
  if (!el) return false;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -72 });
  else el.scrollIntoView({ behavior: "smooth" });
  return true;
}

function Dish({ id }: { id: ItemId }) {
  const { lang, d } = useLocale();
  const { add } = useCart();
  const it = ITEMS[id];
  const p = d.products[id];
  const photo = firstImg(it.photo);

  return (
    <li className={`group flex gap-4 border-b-2 border-line py-5 ${photo ? "flex-col sm:flex-row" : ""}`}>
      <Photo
        paths={it.photo}
        alt={photo ? p.name : ""}
        illus={it.illus}
        tint={it.tags.length ? "herb" : "soft"}
        sizes={photo ? "(min-width: 640px) 160px, 100vw" : "72px"}
        className={photo ? "card aspect-[4/3] w-full shrink-0 sm:aspect-square sm:w-36" : "h-[4.5rem] w-[4.5rem] shrink-0 rounded-[4px]"}
        illusClassName="h-12 w-12"
        stockLabel={d.carte.illustration}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-[family-name:var(--font-display)] text-[1.375rem] leading-tight tracking-[0.01em] uppercase">{p.name}</h3>
          <p className="shrink-0 text-[1.0625rem] font-extrabold tabular-nums">{it.price !== null ? price(it.price, lang) : <span className="text-sm text-muted">{d.carte.priceOnSite}</span>}</p>
        </div>
        {p.desc && <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{p.desc}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {it.tags.map((t) => (
            <span key={t} className={`tag tag-${t}`}>
              {d.tags[t]}
            </span>
          ))}
          <div className="ms-auto flex flex-wrap items-center justify-end gap-2">
            {it.menu && (
              <button type="button" onClick={() => add(newLine(id, true))} className="min-h-10 px-2 text-[0.875rem] font-bold underline decoration-mustard decoration-2 underline-offset-4 hover:decoration-ink" aria-label={`${fill(d.carte.addLabel, { name: p.name })} (${d.order.formulaShort})`}>
                {fill(d.order.formulaToggle, { price: price(FORMULA.price, lang) }).replace(/^(.)/, (c) => c.toUpperCase())}
              </button>
            )}
            <button type="button" onClick={() => add(newLine(id))} className="btn-dark !min-h-10 !gap-1.5 !px-3.5 !text-[0.9375rem]" aria-label={fill(d.carte.addLabel, { name: p.name })}>
              <PlusIcon className="h-4 w-4" />
              {d.carte.add}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

/** Encadré jaune : la formule menu et les sauces maison (döner, durum, assiettes). */
function FormulaBox({ withFormula }: { withFormula: boolean }) {
  const { lang, d } = useLocale();
  return (
    <div className="mb-6 grid gap-5 border-y-[3px] border-ink bg-mustard p-5 md:grid-cols-2 md:p-6">
      {withFormula && (
        <div>
          <p className="display text-[1.375rem]">
            {d.carte.formulaTitle} <span className="font-[family-name:var(--font-body)] text-base font-extrabold normal-case">+ {price(FORMULA.price, lang)}</span>
          </p>
          <p className="mt-1 font-medium">{d.carte.formulaText}</p>
        </div>
      )}
      <div className={withFormula ? "" : "md:col-span-2"}>
        <p className="display text-[1.375rem]">{d.carte.sauceTitle}</p>
        <p className="mt-1 font-medium">{SAUCES.map((s) => d.carte.sauces[s]).join(" · ")}</p>
      </div>
    </div>
  );
}

/** Bières, vins, apéritifs : servis sur place uniquement, sans bouton « Ajouter ». */
function Bar() {
  const { lang, d } = useLocale();
  const eur = (n: number | string | null) => (typeof n === "number" ? price(n, lang) : "–");
  return (
    <section className="mt-12" aria-labelledby="bar-title">
      <h3 id="bar-title" className="sign">
        {d.carte.barTitle}
      </h3>
      <div className="mt-6 grid gap-x-12 gap-y-8 md:grid-cols-2">
        {BAR.map((g) => (
          <div key={g.id}>
            <h4 className="display text-[1.25rem]">{d.carte.bar[g.id]}</h4>
            <table className="mt-2 w-full text-[0.9375rem]">
              {g.sizes && (
                <thead>
                  <tr className="text-muted">
                    <th className="py-1 text-start font-normal">
                      <span className="sr-only">{d.carte.bar[g.id]}</span>
                    </th>
                    {g.sizes.map((s) => (
                      <th key={s} className="py-1 text-end text-[0.8125rem] font-bold whitespace-nowrap">
                        {s}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {g.rows.map(([name, ...prices]) => (
                  <tr key={String(name)} className="border-b border-line last:border-0">
                    <th scope="row" className="py-1.5 pe-3 text-start font-medium">
                      {name}
                    </th>
                    {prices.map((p, i) => (
                      <td key={i} className="py-1.5 ps-3 text-end font-bold whitespace-nowrap tabular-nums">
                        {eur(p)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <p className="mt-6 text-[0.875rem] text-muted">{d.carte.barNote}</p>
    </section>
  );
}

/** La carte, en une seule page avec onglets ; chaque article a son prix en HTML et un bouton « Ajouter ». */
export function MenuTabs({ initial = "doner" }: { initial?: CategoryId }) {
  const { lang, d } = useLocale();
  const cats = categories();
  const [tab, setTab] = useState<CategoryId>(initial);
  const reduce = useReducedMotion();
  const uid = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const on = (e: Event) => setTab((e as CustomEvent<CategoryId>).detail);
    window.addEventListener(TAB_EVENT, on);
    return () => window.removeEventListener(TAB_EVENT, on);
  }, []);

  const current = cats.find((c) => c.id === tab) ?? cats[0];
  const intro = d.carte.tabsIntro[current.id];

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!n) return;
    e.preventDefault();
    const j = (i + n + cats.length) % cats.length;
    setTab(cats[j].id);
    refs.current[j]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label={d.carte.tabsLabel} className="-mx-4 flex gap-1 overflow-x-auto border-b-[3px] border-ink px-4 [scrollbar-width:none] md:mx-0 md:px-0">
        {cats.map((c, i) => (
          <button
            key={c.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${c.id}`}
            aria-selected={tab === c.id}
            aria-controls={`${uid}-panel`}
            tabIndex={tab === c.id ? 0 : -1}
            onClick={() => setTab(c.id)}
            onKeyDown={(e) => onKey(e, i)}
            className="relative min-h-12 shrink-0 px-4 pt-2 font-[family-name:var(--font-display)] text-[1.125rem] tracking-[0.04em] whitespace-nowrap uppercase transition-colors aria-[selected=false]:text-muted aria-[selected=false]:hover:text-ink"
          >
            {tab === c.id && <motion.span layoutId={`${uid}-bar`} className="absolute inset-x-0 bottom-0 top-0 -z-0 bg-mustard" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 40 }} />}
            <span className="relative">{d.carte.tabs[c.id]}</span>
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${current.id}`} className="mt-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={current.id} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -4 }} transition={{ duration: 0.16 }}>
            {intro && <p className="lead mb-6 max-w-2xl !text-ink">{intro}</p>}
            {(current.id === "doner" || current.id === "durum") && <FormulaBox withFormula />}
            {current.id === "assiettes" && <FormulaBox withFormula={false} />}
            {current.id === "menus" && (
              <div className="mb-6 border-y-[3px] border-ink bg-mustard p-5 md:p-6">
                <p className="display text-[1.375rem]">
                  {d.carte.formulaTitle} <span className="font-[family-name:var(--font-body)] text-base font-extrabold normal-case">+ {price(FORMULA.price, lang)}</span>
                </p>
                <p className="mt-1 font-medium">{d.carte.formulaText}</p>
              </div>
            )}
            <ul className="grid gap-x-12 md:grid-cols-2">
              {current.items.map((id) => (
                <Dish key={id} id={id} />
              ))}
            </ul>
            {current.id === "menus" && (
              <div className="mt-10">
                <h3 className="sign">{d.carte.extrasTitle}</h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {EXTRAS.map((x) => (
                    <li key={x.id} className="border-2 border-line bg-paper px-3 py-1.5 font-bold">
                      {d.carte.extras[x.id as keyof typeof d.carte.extras]} <span className="ms-1 tabular-nums text-muted">+ {price(x.price, lang)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[0.9375rem] text-muted">{d.carte.extrasNote}</p>
              </div>
            )}
            {current.id === "boissons" && <Bar />}
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-8 text-[0.9375rem] text-muted">{d.carte.allergens}</p>
      <p className="mt-2 text-[0.875rem] text-muted">{d.carte.photoNote}</p>
    </div>
  );
}
