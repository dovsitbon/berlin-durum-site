"use client";

import { useLocale } from "@/components/providers";
import { openTab } from "@/components/MenuTabs";
import { Photo, type Tint } from "@/components/Photo";
import type { IllusName } from "@/components/Illus";
import { fromPrice, type CategoryId } from "@/lib/carte";
import { fill } from "@/lib/i18n";
import { price } from "@/lib/format";

type TileId = "doner" | "durum" | "assiettes" | "vege" | "menus" | "boissons" | "desserts";
type Tile = { id: TileId; paths: string[]; illus: IllusName; tint: Tint };

// Une tuile par catégorie, nom en capitales. La photo remplace l'illustration dès qu'elle existe
// (assets/plats/tuile-<catégorie>.jpg, ou la photo du plat phare).
const TILES: Tile[] = [
  { id: "doner", paths: ["/media/plats/tuile-doner.jpg", "/media/plats/berliner-feta.jpg"], illus: "berliner", tint: "mustard" },
  { id: "durum", paths: ["/media/plats/tuile-durum.jpg", "/media/plats/durum-classic.jpg"], illus: "durum", tint: "ink" },
  { id: "assiettes", paths: ["/media/plats/tuile-assiettes.jpg", "/media/plats/assiette-classic.jpg"], illus: "plate", tint: "soft" },
  { id: "vege", paths: ["/media/plats/tuile-vege.jpg", "/media/plats/berliner-vegge.jpg"], illus: "salad", tint: "herb" },
  { id: "menus", paths: ["/media/plats/tuile-menus.jpg", "/media/plats/frites-maison.jpg"], illus: "fries", tint: "chili" },
  { id: "boissons", paths: ["/media/plats/tuile-boissons.jpg"], illus: "can", tint: "cream" },
  { id: "desserts", paths: ["/media/plats/tuile-desserts.jpg", "/media/plats/baklava.jpg"], illus: "dessert", tint: "soft" },
];

export function Tiles() {
  const { lang, d } = useLocale();
  return (
    <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 lg:grid-cols-7">
      {TILES.map((t) => {
        const from = fromPrice(t.id as CategoryId);
        return (
          <li key={t.id} className="w-[42vw] max-w-52 shrink-0 snap-start md:w-auto md:max-w-none">
            <a
              href={`/${lang}#carte`}
              onClick={(e) => {
                if (openTab(t.id)) e.preventDefault();
              }}
              className="group card relative block aspect-[3/4] outline-offset-4"
            >
              <Photo paths={t.paths} alt="" illus={t.illus} tint={t.tint} sizes="(min-width: 1024px) 14vw, (min-width: 768px) 24vw, 42vw" className="absolute inset-0 h-full w-full" illusClassName="h-[48%] w-[48%] -translate-y-6 transition-transform duration-300 group-hover:-translate-y-8 group-hover:rotate-[-5deg]" />
              <span className="absolute inset-x-0 bottom-0 border-t-[3px] border-ink bg-cream px-3 py-2.5">
                <span className="block font-[family-name:var(--font-display)] text-[1.375rem] leading-none tracking-[0.03em] uppercase">{d.tiles.items[t.id]}</span>
                {from !== null && t.id !== "boissons" && <span className="mt-1 block text-[0.8125rem] font-bold text-muted">{fill(d.tiles.from, { price: price(from, lang) })}</span>}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
