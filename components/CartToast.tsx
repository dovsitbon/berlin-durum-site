"use client";

import { useEffect, useState } from "react";
import { useCart, useLocale } from "@/components/providers";
import { OrderLink } from "@/components/OrderLink";
import { CheckIcon } from "@/components/icons";
import { fill } from "@/lib/i18n";

/** Petite confirmation après « Ajouter » : le plat ajouté et un lien vers la commande. Disparaît seule. */
export function CartToast() {
  const { lang, d } = useLocale();
  const { last } = useCart();
  const [shown, setShown] = useState<typeof last>(null);

  useEffect(() => {
    if (!last) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- affiche le dernier ajout puis le retire
    setShown(last);
    const t = setTimeout(() => setShown(null), 3200);
    return () => clearTimeout(t);
  }, [last]);

  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-24 z-50 flex justify-center md:inset-x-auto md:end-6 md:bottom-6" aria-live="polite">
      {shown && (
        <div key={shown.key} className="rise pointer-events-auto flex items-center gap-3 border-2 border-ink bg-paper py-2 ps-4 pe-2 shadow-[4px_4px_0_var(--color-ink)]">
          <CheckIcon className="h-5 w-5 shrink-0 text-herb" />
          <p className="text-[0.9375rem] font-bold">{fill(d.carte.added, { name: d.products[shown.item].name })}</p>
          <OrderLink href={`/${lang}#commander`} className="btn-dark !min-h-10 !px-3 !text-[0.9375rem]">
            {d.carte.viewOrder}
          </OrderLink>
        </div>
      )}
    </div>
  );
}
