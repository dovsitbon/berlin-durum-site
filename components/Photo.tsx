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
}) {
  const p = firstImg(paths);
  if (p)
    return (
      <div className={`zoom bg-cream-deep ${className}`}>
        <Image src={p.src} alt={alt} width={p.width} height={p.height} sizes={sizes} quality={70} priority={priority} fetchPriority={priority ? "high" : undefined} className={`h-full w-full object-cover ${imgClassName}`} />
      </div>
    );
  return (
    <div className={`relative flex items-center justify-center ${TINTS[tint]} ${className}`} data-photo-slot={paths[0]} role={alt ? "img" : undefined} aria-label={alt || undefined}>
      <Illus name={illus} className={illusClassName} strokeWidth={3.2} />
      {note && <span className="absolute start-3 bottom-3 text-[0.6875rem] font-bold tracking-[0.08em] uppercase opacity-60">{note}</span>}
    </div>
  );
}
