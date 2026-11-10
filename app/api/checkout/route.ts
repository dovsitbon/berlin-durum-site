import site from "@/data/site.json";
import { orderTotal, parseOrder } from "@/lib/order";

// Paiement en ligne de la commande (Stripe Checkout) : PRÉVU MAIS DÉSACTIVÉ.
// Pour l'activer :
//   1. data/site.json → payment.enabled = true (le bouton « Payer en ligne » apparaît sous le formulaire) ;
//   2. variable Vercel STRIPE_SECRET_KEY (clé du compte Stripe du restaurant) ;
//   3. npm install stripe, puis décommenter le bloc ci-dessous et brancher le bouton du formulaire sur cette route.
// Tant que c'est désactivé, la route répond 404 et le client paie au comptoir.

export async function POST(req: Request) {
  if (!site.payment.enabled || !process.env.STRIPE_SECRET_KEY) return Response.json({ ok: false, reason: "disabled" }, { status: 404 });
  const body = (await req.json().catch(() => null)) as { order?: unknown } | null;
  const q = parseOrder(body?.order);
  if (!q) return Response.json({ ok: false }, { status: 400 });
  const { sum, partial } = orderTotal(q.lines);
  if (partial || sum <= 0) return Response.json({ ok: false, reason: "price" }, { status: 400 });

  // const stripe = new (await import("stripe")).default(process.env.STRIPE_SECRET_KEY);
  // const session = await stripe.checkout.sessions.create({
  //   mode: "payment",
  //   line_items: [{ price_data: { currency: "eur", unit_amount: Math.round(sum * 100), product_data: { name: `Commande ${q.name} · ${q.day} ${q.time}` } }, quantity: 1 }],
  //   success_url: `${site.url}/fr#commander?paid=1`,
  //   cancel_url: `${site.url}/fr#commander`,
  // });
  // return Response.json({ ok: true, url: session.url });
  return Response.json({ ok: false, reason: "not-implemented" }, { status: 501 });
}
