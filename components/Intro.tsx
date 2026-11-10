"use client";

import { useEffect, useState, type CSSProperties } from "react";

const KEY = "bd-intro";
const NAME = "BERLIN DURUM";
const at = (d: number, t?: number) => ({ "--d": `${d}s`, ...(t ? { "--t": `${t}s` } : {}) }) as CSSProperties;
// Petite inclinaison de chaque lettre au départ, pour une chute qui n'a pas l'air mécanique
const TILT = [-8, 5, -3, 7, -6, 4, 0, 6, -5, 3, -7, 5];

/**
 * Ouverture (1,2 s, une fois par session), tout en CSS (globals.css) : sur fond crème, une broche de döner
 * se dessine au trait noir et tourne d'un quart de tour (ses tranches glissent), « BERLIN DURUM » tombe lettre
 * par lettre, puis « KEBAB · AMIENS », et fondu sur le hero. Bouton « Passer » ; ignorée si l'utilisateur
 * préfère réduire les animations.
 */
export function Intro({ skipLabel }: { skipLabel: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      document.documentElement.classList.add("intro-seen");
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  const p = { pathLength: 1, className: "intro-draw" };
  return (
    <div className="intro-curtain flex flex-col items-center justify-center text-ink" aria-hidden="false">
      <svg viewBox="0 0 40 100" className="h-28 w-auto md:h-32" fill="none" stroke="currentColor" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <defs>
          <clipPath id="intro-cone">
            <path d="M7 15H33L28.5 79H11.5Z" />
          </clipPath>
        </defs>
        <path {...p} d="M20 3V97" style={at(0, 0.28)} />
        <path {...p} d="M7 15H33L28.5 79H11.5Z" style={at(0.06, 0.3)} />
        <path {...p} d="M4 86H36" style={at(0.2, 0.12)} />
        {/* Tranches : elles glissent d'un quart d'écart, comme la broche qui tourne d'un quart de tour */}
        <g clipPath="url(#intro-cone)">
          <g className="intro-turn">
            <path d="M0 16 40 8M0 28 40 20M0 40 40 32M0 52 40 44M0 64 40 56M0 76 40 68M0 88 40 80" />
          </g>
        </g>
      </svg>
      <p className="display mt-6 text-[2.75rem] leading-none md:text-[3.5rem]" aria-hidden="true">
        {NAME.split("").map((ch, i) =>
          ch === " " ? (
            <span key={i} className="inline-block w-[0.3em]" />
          ) : (
            <span key={i} className="intro-letter" style={{ ...at(0.3 + i * 0.035), "--r": `${TILT[i]}deg` } as CSSProperties}>
              {ch}
            </span>
          ),
        )}
      </p>
      <p className="intro-sub mt-2 text-[0.8125rem] font-extrabold tracking-[0.42em] uppercase" aria-hidden="true">
        Kebab · Amiens
      </p>
      <button
        type="button"
        onClick={() => {
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
          document.documentElement.classList.add("intro-seen");
          setGone(true);
        }}
        className="absolute end-4 bottom-4 min-h-11 px-4 font-bold text-muted transition-colors hover:text-ink"
      >
        {skipLabel}
      </button>
    </div>
  );
}
