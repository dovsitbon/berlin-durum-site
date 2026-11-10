import type { Illus as IllusKind } from "@/lib/carte";

// Petites illustrations au trait, dessinées pour Berlin Durum. Elles tiennent la place des photos de plats
// tant que le restaurant n'en a pas fourni (voir assets/A-PHOTOGRAPHIER.md), et servent de pictos.
// viewBox 0 0 120 120, trait = currentColor.

export type IllusName = IllusKind | "spit" | "terrace" | "facade" | "bag" | "table" | "phone" | "bear";

const P: Record<IllusName, string[]> = {
  // Berliner : demi-pain pide vu de côté, garniture qui dépasse entre les deux moitiés
  berliner: [
    "M14 66C18 42 40 30 60 30S102 42 106 66Z",
    "M10 74C22 68 30 80 42 72S60 80 72 72 92 80 110 72",
    "M16 84C26 80 32 88 44 82S62 88 74 82 94 88 104 84",
    "M18 90H102C102 98 96 102 88 102H32C24 102 18 98 18 90Z",
    "M40 44 43 46M58 38 61 40M76 44 79 46",
  ],
  // Durum : galette roulée, coupée en biais
  durum: [
    "M20 92 74 22C80 14 92 16 98 24S102 40 96 46L42 108",
    "M20 92C14 100 30 112 42 108",
    "M74 22C84 30 92 38 96 46",
    "M56 48 66 56M48 62 58 70M40 76 50 84",
    "M82 28C86 26 90 30 88 34",
  ],
  plate: [
    "M10 70C10 92 34 104 60 104S110 92 110 70",
    "M10 70H110",
    "M22 70C24 56 38 50 50 58 54 46 72 44 78 58 88 52 100 58 98 70",
    "M30 82H52M64 84H90",
    "M40 62 44 66M64 56 68 60M84 60 86 64",
  ],
  burger: [
    "M18 56C18 36 38 24 60 24S102 36 102 56Z",
    "M14 66C26 60 34 72 46 66S66 72 78 66 98 72 106 66",
    "M16 76H104",
    "M20 86H100C100 96 92 100 84 100H36C28 100 20 96 20 86Z",
    "M44 38 46 40M60 34 62 36M76 40 78 42",
  ],
  salad: ["M10 60H110C110 86 88 102 60 102S10 86 10 60Z", "M24 60C22 46 34 40 42 48 44 34 62 32 64 46 72 36 90 40 88 54 96 50 102 56 100 60", "M50 52a5 5 0 1 0 0.1 0M74 50a4 4 0 1 0 0.1 0", "M46 102 48 110H72L74 102"],
  fries: ["M28 50H92L84 108H36Z", "M34 50 30 16M46 50 46 12M58 50 60 18M70 50 74 14M82 50 88 22", "M40 72C50 80 70 80 80 72"],
  can: ["M36 24H84V100H36Z", "M36 24C36 18 84 18 84 24M36 100C36 106 84 106 84 100", "M36 46H84M36 78H84", "M54 18V12H66"],
  glass: ["M36 26H84L78 104H42Z", "M38 50H82", "M66 26 78 8H90", "M50 66a4 4 0 1 0 0.1 0M64 80a4 4 0 1 0 0.1 0M54 92a3 3 0 1 0 0.1 0"],
  cup: ["M26 56H86V72C86 90 74 100 56 100S26 90 26 72Z", "M86 62C100 62 100 82 84 82", "M18 104H94", "M46 44C42 36 50 32 46 24M62 44C58 36 66 32 62 24"],
  dessert: ["M14 60 60 30 106 60 60 90Z", "M14 60V74L60 104 106 74V60", "M60 90V104", "M37 45 83 75M60 30 60 90M83 45 37 75"],
  spit: ["M60 6V114", "M38 22H82L74 92H46Z", "M40 36 80 28M42 52 78 44M43 68 77 60M45 84 75 76", "M30 100H90"],
  terrace: ["M8 92C20 86 30 98 42 92S64 86 76 92 98 98 112 92", "M8 106C20 100 30 112 42 106S64 100 76 106 98 112 112 106", "M30 76V30M18 30H42M30 30 14 46M30 30 46 46", "M70 76H104M74 76V58M100 76V58M70 58H104", "M78 50H96"],
  facade: ["M14 106V36H106V106", "M8 36H112L104 18H16Z", "M28 106V60H52V106", "M64 60H94V86H64Z", "M30 46H90"],
  bag: ["M24 40H96L90 108H30Z", "M44 40V30C44 18 76 18 76 30V40", "M44 62C50 70 70 70 76 62"],
  table: ["M14 50H106", "M30 50 22 106M90 50 98 106", "M60 50V40M50 40H70", "M46 30C42 24 48 20 46 14M62 30C58 24 64 20 62 14"],
  phone: ["M38 12H82C86 12 88 14 88 18V102C88 106 86 108 82 108H38C34 108 32 106 32 102V18C32 14 34 12 38 12Z", "M52 22H68", "M54 96H66", "M48 50C52 60 60 68 72 72"],
  bear: ["M30 34a10 10 0 1 0 0.1 0M90 34a10 10 0 1 0 0.1 0", "M24 66C24 42 42 28 60 28S96 42 96 66 80 100 60 100 24 90 24 66Z", "M48 58a3 3 0 1 0 0.1 0M72 58a3 3 0 1 0 0.1 0", "M52 76C56 82 64 82 68 76M60 70V76"],
};

export function Illus({ name, className = "h-24 w-24", strokeWidth = 3 }: { name: IllusName; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
