import Link from "next/link";
import site from "@/data/site.json";
import { getDict, altOf, fill, isLocale, type Dict, type Locale } from "@/lib/i18n";
import { formatDay } from "@/lib/format";
import { pagePath } from "@/lib/pages";
import { firstImg } from "@/lib/media";
import { homeJsonLd } from "@/lib/jsonld";
import { Reveal } from "@/components/Reveal";
import { OpenStatus } from "@/components/OpenStatus";
import { OrderLink } from "@/components/OrderLink";
import { Tiles } from "@/components/Tiles";
import { Services } from "@/components/Services";
import { MenuTabs } from "@/components/MenuTabs";
import { OrderForm } from "@/components/OrderForm";
import { HoursTable } from "@/components/HoursTable";
import { Photo, type Tint } from "@/components/Photo";
import type { IllusName } from "@/components/Illus";
import { ArrowIcon, PhoneIcon, PinIcon, PlusIcon, StarIcon } from "@/components/icons";

// Le statut « Ouvert » et les créneaux se recalculent côté navigateur ; la page est régénérée chaque heure.
export const revalidate = 3600;

function Rating({ lang, d, className = "" }: { lang: Locale; d: Dict; className?: string }) {
  const value = new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-GB", { minimumFractionDigits: 1 }).format(site.rating.value);
  return (
    <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-6 items-center gap-2 font-bold hover:underline ${className}`} title={fill(d.hero.ratingNote, { date: formatDay(site.rating.checked, lang, { day: "numeric", month: "long", year: "numeric" }) })}>
      <span className="flex text-chili" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <StarIcon key={i} className="h-4 w-4" />
        ))}
      </span>
      <span>
        {fill(d.hero.rating, { value })} · {fill(d.hero.ratingCount, { count: site.rating.count })}
      </span>
    </a>
  );
}

function SectionHead({ eyebrow, title, intro, center = false }: { eyebrow: string; title: string; intro?: string; center?: boolean }) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="sign">{eyebrow}</p>
      <h2 className="display mt-5 text-[3rem] md:text-[4.5rem]">{title}</h2>
      {intro && <p className="lead mt-4">{intro}</p>}
    </Reveal>
  );
}

type Block = { id: string; key: "doner" | "terrace" | "fresh"; paths: string[]; illus: IllusName; tint: Tint; altKey: string };
const BLOCKS: Block[] = [
  { id: "doner-berlinois", key: "doner", paths: ["/media/hero/comptoir.jpg", "/media/galerie/comptoir.jpg"], illus: "spit", tint: "ink", altKey: "comptoir" },
  { id: "terrasse", key: "terrace", paths: ["/media/terrasse/terrasse.jpg"], illus: "terrace", tint: "mustard", altKey: "terrasse" },
  { id: "frais", key: "fresh", paths: ["/media/plats/sauces.jpg", "/media/galerie/sauces.jpg"], illus: "salad", tint: "herb", altKey: "sauces" },
];

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) return null;
  const d = getDict(lang);
  const order = `/${lang}#commander`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd(lang)) }} />

      {/* 1. Hero : le titre en très gros, la plus belle photo à côté, deux boutons, la note et le statut juste dessous */}
      <section className="grid md:min-h-[calc(100svh-7rem)] md:grid-cols-[1.05fr_1fr]">
        <div className="order-2 flex flex-col justify-center px-5 pt-8 pb-12 md:order-1 md:px-10 md:py-14 xl:px-16">
          <p className="sign rise self-start">{d.hero.eyebrow}</p>
          <h1 className="display rise mt-6 text-[3.4rem] !leading-[1.1] sm:text-[4.4rem] lg:text-[5.4rem] xl:text-[6.2rem]" style={{ animationDelay: "0.05s" }}>
            {d.hero.title}
          </h1>
          <p className="lead rise mt-5 max-w-md !text-[1.1875rem] !text-ink" style={{ animationDelay: "0.1s" }}>
            {d.hero.sub}
          </p>
          <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "0.15s" }}>
            <OrderLink href={order} className="btn">
              {d.hero.ctaOrder}
            </OrderLink>
            <a href={`/${lang}#carte`} className="btn-line">
              {d.hero.ctaMenu}
            </a>
          </div>
          <div className="rise mt-7 flex flex-col gap-2 text-[0.9375rem] sm:flex-row sm:flex-wrap sm:gap-x-6" style={{ animationDelay: "0.2s" }}>
            <Rating lang={lang} d={d} />
            <OpenStatus className="font-bold" />
          </div>
        </div>
        <Photo
          paths={["/media/hero/hero.jpg", "/media/plats/berliner-feta.jpg"]}
          alt={d.alt.hero}
          illus="spit"
          tint="mustard"
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="order-1 h-[30svh] border-b-2 border-ink md:order-2 md:h-auto md:border-s-2 md:border-b-0"
          illusClassName="h-3/5 w-3/5 max-h-[26rem] max-w-[26rem]"
        />
      </section>

      {/* 2. Tuiles de catégories, juste après le hero */}
      <section aria-label={d.tiles.title} className="border-t-2 border-ink px-4 pt-8 pb-10 md:px-8 md:pt-10 md:pb-12">
        <h2 className="sr-only">{d.tiles.title}</h2>
        <div className="mx-auto max-w-7xl">
          <Tiles />
        </div>
      </section>

      {/* 3. Bande de services en 4 pictos */}
      <Services d={d} />

      {/* 4. La carte, une seule page à onglets, prix en HTML, ajout direct à la commande */}
      <section id="carte" className="scroll-mt-20 px-4 pt-20 md:px-8 md:pt-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <SectionHead eyebrow={d.carte.eyebrow} title={d.carte.title} intro={d.carte.intro} />
            <Link href={pagePath("carte", lang)} className="link-line shrink-0 self-start font-bold md:self-auto">
              {d.carte.seeFull}
            </Link>
          </div>
          <MenuTabs />
        </div>
      </section>

      {/* 5. Commande à emporter ou sur place */}
      <section id="commander" className="scroll-mt-20 px-4 pt-20 md:px-8 md:pt-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SectionHead eyebrow={d.order.eyebrow} title={d.order.title} intro={d.order.intro} />
            <Reveal delay={0.05} className="mt-8 border-2 border-ink bg-mustard p-6">
              <p className="display text-[1.75rem]">{d.order.callTitle}</p>
              <p className="mt-1 font-medium">{d.order.callText}</p>
              <a href={`tel:${site.phoneIntl}`} className="btn-dark mt-5 w-full sm:w-auto">
                <PhoneIcon className="h-5 w-5" />
                {d.order.callCta} · {site.phone}
              </a>
              <div className="mt-4 text-[0.9375rem] font-bold">
                <OpenStatus />
              </div>
            </Reveal>
          </div>
          <OrderForm />
        </div>
      </section>

      {/* 6. Trois blocs alternés : photo + texte court + un seul bouton */}
      <div className="mt-24 border-t-2 border-ink md:mt-32">
        {BLOCKS.map((b, i) => {
          const t = d.blocks[b.key];
          const cta =
            b.key === "doner" ? (
              <a href={`/${lang}#carte`} className="btn-line">
                {t.cta}
                <ArrowIcon />
              </a>
            ) : b.key === "terrace" ? (
              <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-line">
                <PinIcon className="h-5 w-5" />
                {t.cta}
              </a>
            ) : (
              <OrderLink href={order} className="btn">
                {t.cta}
              </OrderLink>
            );
          return (
            <section key={b.id} id={b.id} className="grid scroll-mt-16 border-b-2 border-ink md:grid-cols-2">
              <Photo paths={b.paths} alt={altOf(d, b.paths[0]) || d.alt[b.altKey as keyof Dict["alt"]]} illus={b.illus} tint={b.tint} sizes="(min-width: 768px) 50vw, 100vw" className={`aspect-[4/3] md:aspect-auto md:min-h-[34rem] ${i % 2 ? "md:order-2 md:border-s-2 md:border-ink" : "md:border-e-2 md:border-ink"}`} illusClassName="h-2/5 w-2/5 max-h-56 max-w-56" />
              <Reveal className="flex flex-col justify-center px-5 py-12 md:px-12 lg:px-20">
                <p className="sign self-start">{t.eyebrow}</p>
                <h2 className="display mt-5 text-[2.75rem] md:text-[3.75rem]">{t.title}</h2>
                <p className="lead mt-4 max-w-md">{t.text}</p>
                <div className="mt-8">{cta}</div>
              </Reveal>
            </section>
          );
        })}
      </div>

      {/* 7. Avis : la note Google et les thèmes qui reviennent. Aucun avis inventé. */}
      <section id="avis" className="bg-ink px-4 py-20 text-cream md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
            <div>
              <p className="sign">{d.reviews.eyebrow}</p>
              <h2 className="display mt-5 text-[3.25rem] md:text-[5rem]">{d.reviews.title}</h2>
            </div>
            <div>
              <p className="text-[1.0625rem] text-cream/80">{d.reviews.intro}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {d.reviews.themes.map((th) => (
                  <li key={th} className="border-2 border-cream/30 px-3 py-1.5 font-bold">
                    {th}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          {/* À REMPLIR avec de vrais avis clients (avec l'accord du restaurant) : data à ajouter, ex. data/avis.json
              [{ "auteur": "Prénom N.", "texte": "…", "date": "AAAA-MM", "note": 5 }], puis afficher ici 3 citations. */}
          <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn mt-10">
            {d.reviews.cta}
            <ArrowIcon />
          </a>
        </div>
      </section>

      {/* 8. Infos pratiques */}
      <section id="infos" className="scroll-mt-20 px-4 pt-20 md:px-8 md:pt-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <SectionHead eyebrow={d.infos.eyebrow} title={d.infos.title} />
          </div>
          <div className="grid border-2 border-ink lg:grid-cols-[1fr_1.15fr]">
            <Reveal className="space-y-7 bg-paper p-6 md:p-9">
              <div className="grid gap-7 sm:grid-cols-2">
                <div>
                  <p className="eyebrow mb-2">{d.infos.address}</p>
                  <address className="text-lg font-bold not-italic">
                    {site.address.street}
                    <br />
                    {site.address.postalCode} {site.address.city}
                  </address>
                </div>
                <div>
                  <p className="eyebrow mb-2">{d.infos.phone}</p>
                  <a href={`tel:${site.phoneIntl}`} className="link-line text-lg font-bold">
                    {site.phone}
                  </a>
                </div>
              </div>
              <div>
                <p className="eyebrow mb-2">{d.infos.hours}</p>
                <HoursTable lang={lang} d={d} />
                <div className="mt-3 font-bold">
                  <OpenStatus />
                </div>
              </div>
              <div>
                <p className="eyebrow mb-2">{d.infos.access}</p>
                <p className="leading-relaxed text-muted">{d.infos.accessText}</p>
                <p className="mt-3 font-bold">{d.infos.services}</p>
              </div>
              <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-line">
                <PinIcon className="h-5 w-5" />
                {d.infos.route}
              </a>
            </Reveal>
            <div className="flex min-h-96 flex-col border-t-2 border-ink lg:border-t-0 lg:border-s-2">
              {/* La façade s'affiche au-dessus du plan dès que assets/facade/facade.jpg existe */}
              {firstImg(["/media/facade/facade.jpg"]) && <Photo paths={["/media/facade/facade.jpg"]} alt={d.alt.facade} illus="facade" sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[16/9] border-b-2 border-ink" />}
              <iframe title={d.infos.mapTitle} src={site.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="min-h-96 w-full flex-1 border-0 grayscale-[35%]" />
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section id="faq" className="px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHead eyebrow={d.faq.eyebrow} title={d.faq.title} />
          <Reveal delay={0.05}>
            <div className="border-t-2 border-ink">
              {d.faq.items.map((f) => (
                <details key={f.q} className="group border-b-2 border-ink">
                  <summary className="flex min-h-16 items-center justify-between gap-6 py-4 text-[1.125rem] font-bold">
                    {f.q}
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-mustard group-open:bg-ink group-open:text-mustard">
                      <PlusIcon className="faq-plus h-4 w-4" />
                    </span>
                  </summary>
                  <p className="pb-6 leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
