import { Illus, type IllusName } from "@/components/Illus";
import type { Dict } from "@/lib/i18n";

const ICONS: Record<string, IllusName> = { emporter: "bag", surplace: "table", terrasse: "terrace", telephone: "phone" };

/** Bande de services en 4 pictos au trait : à emporter, sur place, terrasse, téléphone. */
export function Services({ d }: { d: Dict }) {
  return (
    <ul className="grid grid-cols-2 border-y-2 border-ink lg:grid-cols-4" aria-label={d.services.title}>
      {d.services.items.map((s, i) => (
        <li key={s.id} className={`flex flex-col items-center gap-2 px-3 py-7 text-center md:flex-row md:items-center md:gap-4 md:px-6 md:text-start ${i % 2 ? "border-s-2 border-ink" : ""} ${i > 1 ? "border-t-2 border-ink lg:border-t-0" : ""} ${i === 2 ? "lg:border-s-2" : ""}`}>
          <Illus name={ICONS[s.id]} className="h-12 w-12 shrink-0 md:h-14 md:w-14" strokeWidth={4} />
          <div>
            <p className="font-[family-name:var(--font-display)] text-[1.1875rem] leading-tight tracking-[0.02em] uppercase">{s.title}</p>
            <p className="mt-1 text-[0.875rem] leading-snug text-muted">{s.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
