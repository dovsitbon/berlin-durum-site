// Logo typographique (scripts/logo.mjs) : public/logo.svg (broche + « BERLIN DURUM » + « KEBAB · AMIENS »)
// et public/logo-carre.svg. Pour passer au vrai logo du restaurant : remplacez public/logo.svg.

/** Lettrage seul, affiché en masque CSS : il prend la couleur du texte (currentColor). */
export function Logo({ className = "w-40" }: { className?: string }) {
  return (
    <span className={`logo-mark ${className}`} role="img" aria-label="Berlin Durum Kebab Amiens" translate="no">
      <span className="sr-only">Berlin Durum Kebab Amiens</span>
    </span>
  );
}

/** Broche de döner au trait (même dessin que dans le logo). */
export function Spit({ className = "h-10 w-4", strokeWidth = 4.2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 40 100" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 3V97" />
      <path d="M7 15H33L28.5 79H11.5Z" />
      <path d="M8 27 32 22M9 39 31.5 34M10 51 30.5 46M10.8 63 29.6 58M11.4 75 29 70" />
      <path d="M4 86H36" />
    </svg>
  );
}
