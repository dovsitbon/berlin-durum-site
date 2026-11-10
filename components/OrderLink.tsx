"use client";

import type { ReactNode } from "react";

/** Descend jusqu'au formulaire de commande (#commander). Sur une autre page, le lien fait le reste. */
export function goToOrder() {
  const el = document.getElementById("commander");
  if (!el) return false;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -72 });
  else el.scrollIntoView({ behavior: "smooth" });
  history.replaceState(null, "", "#commander");
  return true;
}

export function OrderLink({ href, className = "", children, label, onNavigate }: { href: string; className?: string; children: ReactNode; label?: string; onNavigate?: () => void }) {
  return (
    <a
      href={href}
      aria-label={label}
      className={className}
      onClick={(e) => {
        onNavigate?.();
        if (goToOrder()) e.preventDefault();
      }}
    >
      {children}
    </a>
  );
}
