import Link from "next/link";
import site from "@/data/site.json";
import { Logo } from "@/components/Logo";
import { HoursTable } from "@/components/HoursTable";
import { PhoneIcon, PinIcon } from "@/components/icons";
import { fill, type Dict, type Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/pages";

export function Footer({ lang, d }: { lang: Locale; d: Dict }) {
  const links = [
    { href: pagePath("carte", lang), label: d.footer.menu },
    { href: pagePath("kebab", lang), label: d.pages.kebab.title },
    { href: pagePath("doner", lang), label: d.pages.doner.title },
    { href: pagePath("legal", lang), label: d.footer.legal },
  ];
  return (
    <footer className="bg-ink pb-24 text-cream md:pb-0">
      <div className="border-b-2 border-cream/15 px-6 py-12 md:px-10">
        <Logo className="mx-auto w-full max-w-3xl text-mustard" />
      </div>
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 md:grid-cols-[1.1fr_1fr_1.2fr] md:px-10">
        <div className="leading-relaxed">
          <p className="max-w-xs text-cream/80">{d.footer.tagline}</p>
          <address className="mt-5 text-lg not-italic">
            {site.address.street}
            <br />
            {site.address.postalCode} {site.address.city}
          </address>
          <div className="mt-3 flex flex-col items-start">
            <a href={`tel:${site.phoneIntl}`} className="inline-flex min-h-11 items-center gap-2 font-bold text-mustard hover:underline">
              <PhoneIcon className="h-4 w-4" />
              {site.phone}
            </a>
            <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-bold text-mustard hover:underline">
              <PinIcon className="h-4 w-4" />
              {d.nav.route}
            </a>
          </div>
        </div>
        <ul className="space-y-1 text-cream/80">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="inline-flex min-h-10 items-center hover:text-cream hover:underline">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center hover:text-cream hover:underline">
              {d.reviewsLink}
            </a>
          </li>
        </ul>
        <div className="[&_.text-muted]:text-cream/60 [&_tr]:border-cream/15">
          <p className="eyebrow mb-3 !text-mustard">{d.infos.hours}</p>
          <HoursTable lang={lang} d={d} compact />
        </div>
      </div>
      <p className="border-t border-cream/15 px-6 py-6 text-center text-sm text-cream/70">{fill(d.footer.rights, { year: new Date().getFullYear() })}</p>
    </footer>
  );
}
