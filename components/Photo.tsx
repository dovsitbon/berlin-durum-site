import Image from "next/image";
import { firstImg } from "@/lib/media";
import { Illus, type IllusName } from "@/components/Illus";

const TINTS = {
  mustard: "bg-mustard text-ink",
  soft: "bg-mustard-soft text-ink",
  ink: "bg-ink text-mustard",
  cream: "bg-cream-deep text-ink",
  herb: "bg-herb-soft text-herb-ink",
  chili: "bg-chili text-cream",
} as const;
export type Tint = keyof typeof TINTS;

/** Photo libre de droits (Unsplash, Wikimedia) : jamais présentée comme une photo du restaurant. */
export const isStock = (src: string) => src.includes("/stock-") || src.includes("/terrasse/quai-belu");

/**
 * Emplacement photo (plat, terrasse, façade…). Tant que la photo n'existe pas dans public/media,
 * une illustration au trait sur fond de couleur la remplace, avec une petite mention discrète si « note » est donné.
 * Pour la photo : la déposer dans assets/<dossier>/ sous le nom attendu (voir assets/A-PHOTOGRAPHIER.md), puis npm run media.
 */
export function Photo({
  paths,
  alt,
  illus,
  tint = "soft",
  sizes,
  className = "",
  imgClassName = "",
  priority = false,
  illusClassName = "h-1/2 w-1/2 max-h-40 max-w-40",
  note,
  stockLabel,
}: {
  paths: readonly string[];
  alt: string;
  illus: IllusName;
  tint?: Tint;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  illusClassName?: string;
  note?: string;
  /** Texte du petit badge posé sur les photos libres de droits (fichiers « stock-* », photos du quartier) */
  stockLabel?: string;
}) {
  const p = firstImg(paths);
  if (p) {
    const stock = isStock(p.src);
    return (
      <div className={`zoom bg-cream-deep ${className}`}>
        <Image src={p.src} alt={stock && stockLabel && alt ? `${alt} (${stockLabel.toLowerCase()})` : alt} width={p.width} height={p.height} sizes={sizes} quality={70} priority={priority} fetchPriority={priority ? "high" : undefined} className={`h-full w-full object-cover ${imgClassName}`} />
        {stock && stockLabel && <span className="pointer-events-none absolute end-1.5 top-1.5 bg-ink/75 px-1.5 py-0.5 text-[0.625rem] leading-tight font-semibold text-cream">{stockLabel}</span>}
      </div>
    );
  }
  return (
    <div className={`relative flex items-center justify-center ${TINTS[tint]} ${className}`} data-photo-slot={paths[0]} role={alt ? "img" : undefined} aria-label={alt || undefined}>
      <Illus name={illus} className={illusClassName} strokeWidth={3.2} />
      {note && <span className="absolute start-3 bottom-3 text-[0.6875rem] font-bold tracking-[0.08em] uppercase opacity-60">{note}</span>}
    </div>
  );
}
