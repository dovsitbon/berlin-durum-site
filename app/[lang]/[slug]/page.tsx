import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import site from "@/data/site.json";
import { fill, getDict, isLocale, locales, type Dict, type Locale } from "@/lib/i18n";
import { formatDay } from "@/lib/format";
import { checked } from "@/lib/carte";
import { PAGE_IDS, pageOfSlug, pagePath, SLUGS, type PageId } from "@/lib/pages";
import { pageJsonLd } from "@/lib/jsonld";
import { MenuTabs } from "@/components/MenuTabs";
import { OrderLink } from "@/components/OrderLink";
import { OpenStatus } from "@/components/OpenStatus";
import { HoursTable } from "@/components/HoursTable";
import { Photo } from "@/components/Photo";
import { PhoneIcon, PinIcon } from "@/components/icons";

export function generateStaticParams() {
  return locales.flatMap((lang) => PAGE_IDS.map((id) => ({ lang, slug: SLUGS[id][lang] })));
}
export const dynamicParams = false;

function resolve(lang: string, slug: string): { lang: Locale; id: PageId } | null {
  if (!isLocale(lang)) return null;
  const id = pageOfSlug(slug, lang);
  return id ? { lang, id } : null;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[slug]">): Promise<Metadata> {
  const { lang: l, slug } = await params;
  const r = resolve(l, slug);
  if (!r) return {};
  const d = getDict(r.lang);
  const p = d.pages[r.id];
  const description = "metaDescription" in p ? p.metaDescription : d.meta.description;
  return {
    title: p.metaTitle,
    description,
    alternates: {
      canonical: pagePath(r.id, r.lang),
      languages: { ...Object.fromEntries(locales.map((x) => [x, pagePath(r.id, x)])), "x-default": pagePath(r.id, "fr") },
    },
    openGraph: { title: p.metaTitle, description, url: pagePath(r.id, r.lang), images: [{ url: "/og.jpg", width: 1200, height: 630 }] },
    robots: r.id === "legal" ? { index: false, follow: true } : undefined,
  };
}

function OrderBand({ lang, d }: { lang: Locale; d: Dict }) {
  return (
    <div className="mt-14 flex flex-col items-start gap-5 border-2 border-ink bg-mustard p-6 md:flex-row md:items-center md:justify-between md:p-8">
      <p className="display text-[2rem]">{d.order.title}</p>
      <div className="flex flex-wrap gap-3">
        <OrderLink href={`/${lang}#commander`} className="btn-dark">
          {d.nav.orderCta}
        </OrderLink>
        <a href={`tel:${site.phoneIntl}`} className="btn-line">
          <PhoneIcon className="h-5 w-5" />
          {site.phone}
        </a>
      </div>
    </div>
  );
}

function Carte({ lang, d }: { lang: Locale; d: Dict }) {
  const p = d.pages.carte;
  return (
    <div className="px-4 pt-10 pb-20 md:px-8 md:pt-16 md:pb-28">
      <div className="mx-auto max-w-7xl">
        <header className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <p className="sign">{p.eyebrow}</p>
            <h1 className="display mt-5 text-[3.5rem] md:text-[5.5rem]">{p.title}</h1>
            <p className="lead mt-4 max-w-xl">{p.lead}</p>
          </div>
          <div className="border-2 border-ink bg-paper p-5 md:p-6">
            <HoursTable lang={lang} d={d} compact />
            <div className="mt-3 font-bold">
              <OpenStatus />
            </div>
          </div>
        </header>
        <div className="mt-12">
          <MenuTabs />
        </div>
        <p className="mt-3 text-sm text-muted">{fill(d.carte.checked, { date: formatDay(checked, lang, { day: "numeric", month: "long", year: "numeric" }) })}</p>
        <OrderBand lang={lang} d={d} />
      </div>
    </div>
  );
}

/** Pages « Kebab à Amiens » et « Döner berlinois à Amiens » : texte de fond pour le référencement local. */
function Seo({ lang, d, id }: { lang: Locale; d: Dict; id: "kebab" | "doner" }) {
  const p = d.pages[id];
  const other = id === "kebab" ? "doner" : "kebab";
  return (
    <article className="px-4 pt-10 pb-20 md:px-8 md:pt-16 md:pb-28">
      <div className="mx-auto max-w-5xl">
        <p className="sign">{p.eyebrow}</p>
        <h1 className="display mt-5 text-[3rem] md:text-[5rem]">{p.h1}</h1>
        <p className="lead mt-6 max-w-3xl !text-[1.1875rem] !text-ink">{p.intro}</p>
        <Photo paths={[id === "doner" ? "/media/plats/berliner-gemuse.jpg" : "/media/hero/hero.jpg"]} alt={d.alt.hero} illus={id === "doner" ? "berliner" : "spit"} tint={id === "doner" ? "mustard" : "ink"} sizes="(min-width: 1024px) 64rem, 100vw" className="mt-10 aspect-[21/9] border-2 border-ink" illusClassName="h-3/5 w-3/5 max-h-48 max-w-48" />
        <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {p.sections.map((s) => (
            <section key={s.h}>
              <h2 className="display text-[1.875rem]">{s.h}</h2>
              <p className="mt-3 leading-relaxed text-muted">{s.p}</p>
            </section>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          {id === "kebab" ? (
            <Link href={pagePath("carte", lang)} className="btn">
              {p.cta}
            </Link>
          ) : (
            <OrderLink href={`/${lang}#commander`} className="btn">
              {p.cta}
            </OrderLink>
          )}
          <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-line">
            <PinIcon className="h-5 w-5" />
            {d.nav.route}
          </a>
        </div>
        <p className="mt-10 font-bold">
          <Link href={pagePath(other, lang)} className="link-line">
            {d.pages[other].title}
          </Link>
        </p>
        <OrderBand lang={lang} d={d} />
      </div>
    </article>
  );
}

function Legal({ d }: { d: Dict }) {
  const p = d.pages.legal;
  const pending = <em className="text-muted">{p.toConfirm}</em>;
  const blocks: [string, React.ReactNode][] = [
    [p.editor, <>{site.legal.company || pending}, {site.address.street}, {site.address.postalCode} {site.address.city} · {site.phone}{site.email ? ` · ${site.email}` : ""}</>],
    [p.siret, site.legal.siret || pending],
    [p.director, site.legal.director || pending],
    [p.host, site.legal.host],
    [p.data, p.dataText],
    [p.photos, p.photosText],
  ];
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="display text-[3rem] md:text-[4rem]">{p.title}</h1>
      {blocks.map(([title, body]) => (
        <section key={title} className="mt-9">
          <h2 className="eyebrow">{title}</h2>
          <p className="mt-2 leading-relaxed">{body}</p>
        </section>
      ))}
    </div>
  );
}

export default async function Page({ params }: PageProps<"/[lang]/[slug]">) {
  const { lang: l, slug } = await params;
  const r = resolve(l, slug);
  if (!r) notFound();
  const d = getDict(r.lang);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd(r.lang, r.id)) }} />
      {r.id === "carte" && <Carte lang={r.lang} d={d} />}
      {(r.id === "kebab" || r.id === "doner") && <Seo lang={r.lang} d={d} id={r.id} />}
      {r.id === "legal" && <Legal d={d} />}
    </>
  );
}
