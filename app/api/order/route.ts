import { Resend } from "resend";
import { orderText, parseOrder } from "@/lib/order";
import { fill, getDict, isLocale, type Locale } from "@/lib/i18n";

// Commande à emporter / sur place. Le restaurant n'a qu'une ligne fixe : la commande part par e-mail (Resend),
// puis par WhatsApp quand il aura donné un portable (data/site.json → whatsapp, bouton côté client).
//  1. notification au restaurant (en français, avec la langue du client) ;
//  2. confirmation au client, dans sa langue, s'il a donné son e-mail.
// Variables Vercel : RESEND_API_KEY, ORDER_NOTIFY_EMAIL (adresse du restaurant), RESEND_FROM (domaine vérifié dans Resend,
// ex. « Berlin Durum <commandes@mondomaine.fr> » ; sans domaine vérifié, Resend n'envoie qu'à l'adresse du compte).
// Sans ces variables, la route répond { notified: false } et le site invite le client à appeler pour confirmer.

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function html(title: string, text: string) {
  const body = escapeHtml(text)
    .split("\n\n")
    .map((p) => `<p style="margin:0 0 18px">${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
  return `<div style="background:#F6F0E4;padding:32px 16px"><div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:6px;border:2px solid #151515;padding:32px 28px;font-family:Helvetica,Arial,sans-serif;color:#151515;font-size:15px;line-height:1.65">
<p style="margin:0 0 6px;font-size:13px;font-weight:bold;letter-spacing:2px;color:#151515;background:#F2B705;display:inline-block;padding:4px 10px">BERLIN DURUM · KEBAB · AMIENS</p>
<h1 style="margin:0 0 24px;font-size:24px">${escapeHtml(title)}</h1>${body}</div></div>`;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const lang: Locale = typeof body.lang === "string" && isLocale(body.lang) ? body.lang : "fr";
  const q = parseOrder(body.order);
  if (!q) return Response.json({ ok: false }, { status: 400 });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFY_EMAIL;
  if (!key || !to) return Response.json({ ok: true, notified: false, confirmed: false });

  const resend = new Resend(key);
  const from = process.env.RESEND_FROM ?? "Berlin Durum <onboarding@resend.dev>";
  const fr = getDict("fr");
  const d = getDict(lang);
  const frText = orderText(q, "fr", fr);
  const text = lang === "fr" ? frText : `${frText}\n\n${fr.order.mail.lang} : ${lang.toUpperCase()}`;

  let notified = false;
  let confirmed = false;
  try {
    const r = await resend.emails.send({ from, to, replyTo: q.email || undefined, subject: `${fr.order.mail.subject} · ${fr.order.modes[q.mode]} · ${q.name} · ${q.day} ${q.time}`, html: html(fr.order.mail.title, text), text });
    notified = !r.error;
  } catch {}

  if (q.email && notified) {
    const m = d.order.mail;
    const msg = `${fill(m.confirmIntro, { name: q.name })}\n\n${orderText(q, lang, d, false)}\n\n${m.confirmOutro}`;
    try {
      const r = await resend.emails.send({ from, to: q.email, replyTo: to, subject: m.confirmSubject, html: html(m.confirmSubject, msg), text: msg });
      confirmed = !r.error;
    } catch {}
  }
  return Response.json({ ok: true, notified, confirmed });
}
