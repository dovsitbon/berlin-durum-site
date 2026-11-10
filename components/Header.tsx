"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import site from "@/data/site.json";
import { Logo } from "@/components/Logo";
import { LangSwitch } from "@/components/LangSwitch";
import { OrderLink } from "@/components/OrderLink";
import { CloseIcon, MenuIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { useCart, useLocale } from "@/components/providers";
import { fill } from "@/lib/i18n";
import { orderTotal } from "@/lib/order";

/** Pastille du nombre d'articles dans la commande ; elle saute à chaque ajout. */
function CartCount({ className = "" }: { className?: string }) {
  const { lines, last } = useCart();
  const { count } = orderTotal(lines);
  if (!count) return null;
  return (
    <span key={last?.key} className={`bump inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-ink px-1.5 font-[family-name:var(--font-body)] text-[0.75rem] font-extrabold tracking-normal text-mustard ${className}`} aria-hidden="true">
      {count}
    </span>
  );
}

function OrderButton({ className = "", onNavigate }: { className?: string; onNavigate?: () => void }) {
  const { lang, d } = useLocale();
  const { lines } = useCart();
  const { count } = orderTotal(lines);
  return (
    <OrderLink href={`/${lang}#commander`} className={className} onNavigate={onNavigate} label={count ? fill(d.nav.cart, { count }) : undefined}>
      {d.nav.orderCta}
      <CartCount />
    </OrderLink>
  );
}

export function Header() {
  const { lang, d } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (menu) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = menu ? "hidden" : "";
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const home = `/${lang}`;
  const links = [
    { href: `${home}#carte`, label: d.nav.carte },
    { href: `${home}#commander`, label: d.nav.order },
    { href: `${home}#terrasse`, label: d.nav.terrace },
    { href: `${home}#infos`, label: d.nav.infos },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 border-b-2 bg-cream/95 backdrop-blur-sm transition-colors duration-300 ${scrolled ? "border-ink" : "border-transparent"}`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-10 focus:bg-cream focus:px-4 focus:py-2">
          {d.nav.skip}
        </a>
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 px-3 md:h-[4.5rem] md:px-6 xl:px-8">
          <div className="flex items-center">
            <button type="button" className="flex h-11 w-11 items-center justify-center lg:hidden" onClick={() => setMenu(true)} aria-label={d.nav.menu} aria-expanded={menu}>
              <MenuIcon className="h-6 w-6" />
            </button>
            <nav className="hidden items-center gap-1 lg:flex" aria-label={d.nav.menu}>
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="px-3 py-2 font-[family-name:var(--font-display)] text-[1.0625rem] tracking-[0.04em] whitespace-nowrap uppercase decoration-mustard decoration-[3px] underline-offset-[6px] hover:underline">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link href={home} aria-label={d.nav.home} className="block py-1">
            <Logo className="w-[9.5rem] md:w-[12rem]" />
          </Link>

          <div className="flex items-center justify-end gap-1 lg:gap-3">
            <LangSwitch lang={lang} label={d.nav.lang} className="hidden font-bold lg:flex" />
            <a href={`tel:${site.phoneIntl}`} className="hidden min-h-11 items-center gap-2 px-2 font-bold whitespace-nowrap hover:underline xl:inline-flex">
              <PhoneIcon className="h-4 w-4" />
              {site.phone}
            </a>
            <a href={`tel:${site.phoneIntl}`} className="flex h-11 w-11 items-center justify-center xl:hidden" aria-label={`${d.nav.call} ${site.phone}`}>
              <PhoneIcon className="h-5 w-5" />
            </a>
            <OrderButton className="btn ms-1 hidden !min-h-11 !px-5 !text-[1.0625rem] whitespace-nowrap md:inline-flex" />
          </div>
        </div>
      </header>

      {menu && (
        <div className="fade-in fixed inset-0 z-[60] flex flex-col overscroll-contain bg-cream text-ink" role="dialog" aria-modal="true" aria-label={d.nav.menu}>
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center border-b-2 border-ink px-3 md:h-[4.5rem] md:px-6">
            <button type="button" className="flex h-11 w-11 items-center justify-center justify-self-start" onClick={() => setMenu(false)} aria-label={d.nav.close}>
              <CloseIcon className="h-6 w-6" />
            </button>
            <Logo className="w-[9.5rem]" />
            <span />
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-1 px-6" aria-label={d.nav.menu}>
            {links.map((l, i) => (
              <div key={l.href} className="rise" style={{ animationDelay: `${0.04 * i}s` }}>
                <Link href={l.href} onClick={() => setMenu(false)} className="display block py-1 text-[3rem]">
                  {l.label}
                </Link>
              </div>
            ))}
          </nav>
          {/* Raccourcis : commander, appeler, itinéraire */}
          <div className="grid grid-cols-3 border-t-2 border-ink">
            <OrderButton className="flex min-h-16 flex-col items-center justify-center gap-1 bg-mustard font-[family-name:var(--font-display)] text-lg tracking-[0.04em] uppercase" onNavigate={() => setMenu(false)} />
            <a href={`tel:${site.phoneIntl}`} className="flex min-h-16 flex-col items-center justify-center gap-1 border-x-2 border-ink font-[family-name:var(--font-display)] text-lg tracking-[0.04em] uppercase">
              <PhoneIcon className="h-5 w-5" />
              {d.nav.call}
            </a>
            <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-16 flex-col items-center justify-center gap-1 font-[family-name:var(--font-display)] text-lg tracking-[0.04em] uppercase">
              <PinIcon className="h-5 w-5" />
              {d.nav.route}
            </a>
          </div>
          <div className="flex items-center justify-center border-t border-line px-4 py-2 font-bold">
            <LangSwitch lang={lang} label={d.nav.lang} />
          </div>
        </div>
      )}
    </>
  );
}

/** Barre fixée en bas de l'écran sur mobile : « Commander » toujours à portée de pouce, l'appel et l'itinéraire. */
export function MobileOrderBar() {
  const { d } = useLocale();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t-2 border-ink bg-cream px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
      <OrderButton className="btn flex-1 !min-h-12 !px-3 !shadow-none" />
      <a href={`tel:${site.phoneIntl}`} className="btn-line !min-h-12 !px-4" aria-label={`${d.nav.call} ${site.phone}`}>
        <PhoneIcon className="h-5 w-5" />
        {d.nav.call}
      </a>
      <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-line !min-h-12 !px-3" aria-label={d.nav.route}>
        <PinIcon className="h-5 w-5" />
      </a>
    </div>
  );
}
