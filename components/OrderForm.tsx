"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import site from "@/data/site.json";
import { CheckIcon, CloseIcon, MinusIcon, PhoneIcon, PlusIcon, WhatsAppIcon } from "@/components/icons";
import { Photo } from "@/components/Photo";
import { useCart, useLocale } from "@/components/providers";
import { fill } from "@/lib/i18n";
import { formatDay, formatTime, isoDay, price } from "@/lib/format";
import { addDays, pickupTimes } from "@/lib/hours";
import { categories, FORMULA, ITEMS, OPTIONS, SAUCES, unitPrice, type ItemId } from "@/lib/carte";
import { isEmail, isPhone, MODES, newLine, orderText, orderTotal, pickupDays, waLink, type Mode, type Order, type OrderLine } from "@/lib/order";

type Errors = Partial<Record<"lines" | "day" | "time" | "name" | "phone" | "email" | "send", string>>;
type Sent = { notified: boolean; confirmed: boolean; text: string; email: string };

const GROUPS = categories().filter((c) => c.id !== "vege");

/**
 * Formulaire de commande : le panier (rempli depuis la carte avec « Ajouter », ou par l'ajout rapide),
 * sur place ou à emporter, jour et heure (aux horaires d'ouverture seulement), coordonnées et remarques.
 * Envoi : /api/order (e-mail au restaurant + confirmation au client via Resend). Paiement en ligne prévu
 * mais désactivé (data/site.json → payment.enabled).
 */
export function OrderForm() {
  const { lang, d } = useLocale();
  const t = d.order;
  const cart = useCart();
  const { lines } = cart;
  const [mode, setMode] = useState<Mode>("emporter");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [quick, setQuick] = useState<ItemId | "">("");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<Sent | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  // Heures recalculées chaque minute : seuls les créneaux encore possibles restent proposés
  useEffect(() => {
     
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const days = useMemo(() => (now ? pickupDays(now) : []), [now]);
  const times = useMemo(() => (now && day ? pickupTimes(day, now) : []), [now, day]);

  useEffect(() => {
    if (!days.length) return;
     
    if (!day || !days.includes(day)) setDay(days[0]);
  }, [days, day]);
  useEffect(() => {
     
    if (time && !times.includes(time)) setTime("");
  }, [times, time]);

  const total = orderTotal(lines);

  function validate(): Errors {
    const e: Errors = {};
    if (!lines.length) e.lines = t.errors.lines;
    if (!day) e.day = t.errors.day;
    if (!time) e.time = t.errors.time;
    if (!name.trim()) e.name = t.errors.name;
    if (!isPhone(phone)) e.phone = t.errors.phone;
    if (email.trim() && !isEmail(email)) e.email = t.errors.email;
    return e;
  }

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.querySelector<HTMLElement>(`[data-err="${Object.keys(e)[0]}"]`)?.focus();
      return;
    }
    const order: Order = { lines, mode, day, time, name: name.trim(), phone: phone.trim(), email: email.trim(), message: message.trim() };
    setSending(true);
    try {
      const res = await fetch("/api/order", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ lang, order }) });
      const json = (await res.json()) as { ok: boolean; notified?: boolean; confirmed?: boolean };
      if (!res.ok || !json.ok) throw new Error("send");
      setSent({ notified: !!json.notified, confirmed: !!json.confirmed, text: orderText(order, lang, d), email: order.email });
      cart.clear();
      document.getElementById("commander")?.scrollIntoView({ block: "start" });
    } catch {
      setErrors({ send: t.errors.send });
    } finally {
      setSending(false);
    }
  }

  const call = (
    <a href={`tel:${site.phoneIntl}`} className="btn">
      <PhoneIcon className="h-5 w-5" />
      {t.callCta} · {site.phone}
    </a>
  );

  if (sent) {
    const wa = waLink(sent.text);
    return (
      <div className="fade-in border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_var(--color-ink)] md:p-10" role="status">
        <span className={`flex h-12 w-12 items-center justify-center border-2 border-ink ${sent.notified ? "bg-herb text-cream" : "bg-mustard text-ink"}`}>{sent.notified ? <CheckIcon className="h-6 w-6" /> : <PhoneIcon className="h-6 w-6" />}</span>
        <h3 className="display mt-5 text-[2.25rem]">{sent.notified ? t.done.title : t.done.pendingTitle}</h3>
        <p className="lead mt-2">{sent.notified ? t.done.text : t.done.pendingText}</p>
        {sent.confirmed && <p className="mt-2 text-muted">{fill(t.done.mail, { email: sent.email })}</p>}
        <pre className="mt-6 bg-cream-deep p-5 font-[family-name:var(--font-body)] text-[0.9375rem] leading-relaxed whitespace-pre-wrap text-ink">{sent.text}</pre>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {call}
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-line">
              <WhatsAppIcon className="h-5 w-5" />
              {t.whatsapp}
            </a>
          )}
          <button
            type="button"
            className="link-line ms-1 min-h-11 font-bold text-muted"
            onClick={() => {
              setSent(null);
              setTime("");
              setMessage("");
            }}
          >
            {t.done.again}
          </button>
        </div>
      </div>
    );
  }

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`err-${k}`} className="mt-2 text-sm font-bold text-chili-ink">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof Errors) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `err-${k}` : undefined, "data-err": k });
  const dayLabel = (x: string) => {
    if (!now) return x;
    const today = isoDay(now);
    return x === today ? t.today : x === addDays(today, 1) ? t.tomorrow : formatDay(x, lang, { weekday: "long", day: "numeric" });
  };
  const legend = (n: number, label: string) => (
    <legend className="display mb-5 flex items-center gap-3 text-[1.75rem]">
      <span className="flex h-9 w-9 items-center justify-center bg-mustard font-[family-name:var(--font-display)] text-[1.125rem]">{n}</span>
      {label}
    </legend>
  );
  const o = d.carte.options as Record<string, string>;

  return (
    <form onSubmit={submit} noValidate className="space-y-10 border-2 border-ink bg-paper p-5 shadow-[6px_6px_0_var(--color-ink)] md:p-8">
      {/* 1. Le panier */}
      <fieldset>
        {legend(1, t.cartTitle)}
        {!lines.length && (
          <div className="border-2 border-dashed border-line p-5" tabIndex={-1} data-err="lines">
            <p className="text-muted">{t.empty}</p>
            <a href={`/${lang}#carte`} className="link-line mt-2 inline-flex min-h-11 items-center font-bold">
              {t.emptyCta}
            </a>
          </div>
        )}
        <ul className="space-y-3">
          {lines.map((l: OrderLine, i) => {
            const it = ITEMS[l.item];
            const unit = unitPrice(l.item, l.menu);
            const pName = d.products[l.item].name;
            return (
              <li key={`${l.item}-${i}`} className="relative bg-cream p-4 md:p-5">
                <div className="flex gap-4 pe-10">
                  <Photo paths={it.photo} alt="" illus={it.illus} tint="soft" sizes="56px" className="hidden h-14 w-14 shrink-0 rounded-[4px] sm:flex" illusClassName="h-10 w-10" />
                  <div className="min-w-0 flex-1">
                    <p className="font-[family-name:var(--font-display)] text-[1.25rem] leading-tight uppercase">{pName}</p>
                    <p className="mt-0.5 text-[0.9375rem] font-bold tabular-nums">{unit !== null ? price(unit * l.qty, lang) : d.carte.priceOnSite}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-end gap-x-5 gap-y-4">
                  <div>
                    <span className="label" id={`qty-${i}`}>
                      {t.quantity}
                    </span>
                    <div className="flex h-12 w-fit items-center border-2 border-line bg-paper" role="group" aria-labelledby={`qty-${i}`}>
                      <button type="button" className="flex h-11 w-11 items-center justify-center hover:bg-cream-deep disabled:opacity-30" onClick={() => cart.update(i, { qty: Math.max(1, l.qty - 1) })} disabled={l.qty <= 1} aria-label={`${t.less}, ${pName}`}>
                        <MinusIcon />
                      </button>
                      <output className="w-8 text-center font-bold" aria-live="polite">
                        {l.qty}
                      </output>
                      <button type="button" className="flex h-11 w-11 items-center justify-center hover:bg-cream-deep disabled:opacity-30" onClick={() => cart.update(i, { qty: Math.min(site.order.maxPerLine, l.qty + 1) })} disabled={l.qty >= site.order.maxPerLine} aria-label={`${t.more}, ${pName}`}>
                        <PlusIcon />
                      </button>
                    </div>
                  </div>
                  {it.sauce && (
                    <label className="block min-w-44 flex-1">
                      <span className="label">{t.sauce}</span>
                      <select className="field" value={l.sauce} onChange={(e) => cart.update(i, { sauce: e.target.value as OrderLine["sauce"] })}>
                        {SAUCES.map((s) => (
                          <option key={s} value={s}>
                            {d.carte.sauces[s]}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  {it.option && (
                    <label className="block min-w-44 flex-1">
                      <span className="label">{d.carte.optionLabels[it.option]}</span>
                      <select className="field" value={l.option} onChange={(e) => cart.update(i, { option: e.target.value })}>
                        {OPTIONS[it.option].map((x) => (
                          <option key={x} value={x}>
                            {o[x] ?? x}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </div>
                {it.menu && (
                  <div className="mt-4 flex flex-wrap items-end gap-x-5 gap-y-3">
                    <label className="chip">
                      <input type="checkbox" className="sr-only" aria-label={`${fill(t.formulaToggle, { price: price(FORMULA.price, lang) })}, ${pName}`} checked={l.menu} onChange={(e) => cart.update(i, { menu: e.target.checked, drink: e.target.checked ? l.drink || OPTIONS[FORMULA.drink][0] : "" })} />
                      {l.menu && <CheckIcon className="h-4 w-4" />}
                      {fill(t.formulaToggle, { price: price(FORMULA.price, lang) })}
                    </label>
                    {l.menu && (
                      <label className="block min-w-44 flex-1">
                        <span className="label">{t.drink}</span>
                        <select className="field" value={l.drink} onChange={(e) => cart.update(i, { drink: e.target.value })}>
                          {OPTIONS[FORMULA.drink].map((x) => (
                            <option key={x} value={x}>
                              {o[x] ?? x}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                  </div>
                )}
                <button type="button" onClick={() => cart.remove(i)} className="absolute end-2 top-2 flex h-11 w-11 items-center justify-center text-muted hover:bg-cream-deep hover:text-ink" aria-label={`${t.remove}, ${pName}`}>
                  <CloseIcon className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
        {/* Ajout rapide, sans repasser par la carte */}
        <div className="mt-4 flex flex-wrap items-end gap-2">
          <label className="block min-w-0 flex-1">
            <span className="label">{t.quickAdd}</span>
            <select className="field" value={quick} onChange={(e) => setQuick(e.target.value as ItemId)}>
              <option value="">—</option>
              {GROUPS.map((g) => (
                <optgroup key={g.id} label={d.carte.tabs[g.id]}>
                  {g.items.map((id) => (
                    <option key={id} value={id}>
                      {d.products[id].name}
                      {ITEMS[id].price !== null ? ` · ${price(ITEMS[id].price!, lang)}` : ""}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="btn-dark !min-h-12"
            disabled={!quick}
            onClick={() => {
              if (!quick) return;
              cart.add(newLine(quick));
              setQuick("");
            }}
          >
            <PlusIcon />
            {d.carte.add}
          </button>
        </div>
        {err("lines")}
      </fieldset>

      {/* 2. Sur place ou à emporter */}
      <fieldset>
        {legend(2, t.modeTitle)}
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <label key={m} className="chip">
              <input type="radio" name="mode" value={m} checked={mode === m} onChange={() => setMode(m)} className="sr-only" />
              {t.modes[m]}
            </label>
          ))}
        </div>
        <p className="mt-3 text-[0.9375rem] text-muted">{t.modeHint[mode]}</p>
      </fieldset>

      {/* 3. Jour et heure : seulement aux heures d'ouverture */}
      <fieldset>
        {legend(3, t.whenTitle)}
        <div role="radiogroup" aria-label={t.whenTitle} aria-describedby={errors.day ? "err-day" : undefined} className="flex flex-wrap gap-2">
          {days.map((x, i) => (
            <label key={x} className="chip">
              <input type="radio" name="day" value={x} checked={day === x} onChange={() => setDay(x)} className="sr-only" {...(i === 0 ? { "data-err": "day" } : {})} />
              <span className="first-letter:uppercase">{dayLabel(x)}</span>
            </label>
          ))}
        </div>
        {err("day")}
        <label className="mt-5 block sm:w-1/2">
          <span className="label">{mode === "surplace" ? t.timeSurplace : t.time}</span>
          <select className="field" value={time} onChange={(e) => setTime(e.target.value)} required {...aria("time")}>
            <option value="">—</option>
            {times.map((x) => (
              <option key={x} value={x}>
                {formatTime(x, lang)}
              </option>
            ))}
          </select>
          {day && now && !times.length && <span className="mt-2 block text-sm text-muted">{t.noSlots}</span>}
          {err("time")}
        </label>
      </fieldset>

      {/* 4. Coordonnées et remarques */}
      <fieldset>
        {legend(4, t.contactTitle)}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label">{t.name}</span>
            <input className="field" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required {...aria("name")} />
            {err("name")}
          </label>
          <label className="block">
            <span className="label">{t.phone}</span>
            <input className="field" name="tel" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required {...aria("phone")} />
            {err("phone")}
          </label>
          <label className="block sm:col-span-2">
            <span className="label">{t.email}</span>
            <input className="field" name="email" type="email" spellCheck={false} inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} {...aria("email")} />
            <span className="mt-1.5 block text-[0.875rem] text-muted">{t.emailHint}</span>
            {err("email")}
          </label>
          <label className="block sm:col-span-2">
            <span className="label">{t.message}</span>
            <textarea name="message" className="field min-h-20 resize-y" maxLength={1000} placeholder={t.messagePh} value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>
        </div>
      </fieldset>

      <div className="border-t-[3px] border-ink pt-6">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-bold">
            {t.total}
            {total.count > 0 && <span className="ms-2 font-normal text-muted">({total.count})</span>}
          </span>
          <span className="display text-[2.25rem] tabular-nums">{price(total.sum, lang)}</span>
        </div>
        {total.partial && <p className="mt-1 text-sm text-muted">{t.totalNote}</p>}
        <button type="submit" className="btn mt-5 w-full !min-h-14 !text-[1.375rem]" disabled={sending}>
          {sending ? t.sending : t.submit}
        </button>
        {/* Paiement en ligne : prévu (route /api/checkout) mais désactivé tant que data/site.json → payment.enabled vaut false */}
        {site.payment.enabled && (
          <button type="button" className="btn-line mt-3 w-full" disabled>
            {t.payOnline}
          </button>
        )}
        <p className="mt-3 text-center text-[0.875rem] text-muted">{t.payNote}</p>
        {errors.send && (
          <div className="mt-5 space-y-4" role="alert">
            <p className="font-bold text-chili-ink">{errors.send}</p>
            {call}
          </div>
        )}
      </div>
    </form>
  );
}
