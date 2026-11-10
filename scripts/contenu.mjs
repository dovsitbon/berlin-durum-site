// Génère CONTENU.md : la carte avec les prix et tous les textes du site en français et en anglais, pour validation par le restaurant.
//   npm run contenu
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const read = async (f) => JSON.parse(await readFile(path.join(ROOT, f), "utf8"));
const fr = await read("locales/fr.json");
const en = await read("locales/en.json");
const carte = await read("data/carte.json");
const site = await read("data/site.json");
const horaires = await read("data/horaires.json");
const annonces = await read("data/annonces.json");

const euro = (n) => (n === null || n === undefined ? "–" : `${Number(n).toFixed(2).replace(".", ",")} €`);
const out = [];
const p = (s = "") => out.push(s);

p("# Berlin Durum Kebab : contenu du site (à valider)");
p();
p("Généré depuis `locales/fr.json`, `locales/en.json` et `data/*.json`. Pour modifier un texte ou un prix, modifiez ces fichiers puis relancez `npm run contenu`. Les informations manquantes sont dans `INFOS-A-DEMANDER.md`.");
p();
p("## À valider en priorité");
p();
p(`- **Prix** : relevés le ${carte.checked.split("-").reverse().join("/")} sur la carte papier la plus récente (photos publiées sur la fiche Google). Merci de vérifier chaque ligne ci-dessous.`);
p("- **Horaires** : relevés sur la fiche Google (voir plus bas). Ils pilotent le statut « Ouvert / Fermé » et les heures de retrait proposées.");
p("- **Recette du kebab** : « veau et dinde marinés 24 heures, confits 3 heures sur la broche, montée à la main chaque jour » (repris de leur carte).");
p("- **Avis** : aucun avis n'est inventé. La section affiche la note (4,9/5, 511 avis au 10/11/2026) et les thèmes qui reviennent. Avec votre accord, on pourra y citer 3 vrais avis Google.");
p("- **FAQ** : paiement (« au comptoir »), stationnement et délai (20 minutes minimum) à confirmer.");
p();
p("## Titre de l'accueil : 3 options");
p();
p(`1. **${fr.hero.title}** (retenu, il contient « döner » et « Amiens » pour Google)`);
p("2. Berlin, au bord de la Somme.");
p("3. Frais, généreux, fait minute.");
p();
p("## Coordonnées et réglages");
p();
p(`- Adresse : ${site.address.street}, ${site.address.postalCode} ${site.address.city}`);
p(`- Téléphone : ${site.phone} (fixe : pas de WhatsApp tant qu'aucun portable n'est donné)`);
p(`- E-mail de réception des commandes : ${site.email || "**à remplir**"}`);
p(`- Note Google : ${site.rating.value}/5, ${site.rating.count} avis (relevé du ${site.rating.checked})`);
p(`- Paiement en ligne : ${site.payment.enabled ? "activé" : "prévu mais désactivé"}`);
p();
p("## Horaires");
p();
const days = fr.infos.days;
for (let i = 1; i <= 7; i++) {
  const s = horaires.week[String(i)] ?? [];
  p(`- ${days[i - 1]} : ${s.length ? s.map(([a, b]) => `${a} – ${b === "24:00" ? "minuit" : b}`).join(" et ") : "fermé"}`);
}
p();
p("## Bandeau d'infos");
p();
p(`- Par défaut : ${annonces.default.fr} / ${annonces.default.en}`);
for (const a of annonces.items) p(`- ${a.from} → ${a.to} : ${a.fr}`);
p();
p("## La carte");
p();
for (const c of carte.categories) {
  p(`### ${fr.carte.tabs[c.id]}`);
  p();
  if (fr.carte.tabsIntro[c.id]) {
    p(`_${fr.carte.tabsIntro[c.id]}_`);
    p();
  }
  p("| Article | Composition | Prix |");
  p("| --- | --- | --- |");
  for (const id of c.items) {
    const it = carte.items[id];
    const tags = it.tags.map((t) => fr.tags[t]).join(", ");
    p(`| ${fr.products[id].name}${tags ? ` (${tags})` : ""} | ${fr.products[id].desc || "–"} | ${euro(it.price)}${it.menu ? ` (menu + ${euro(carte.formula.price)})` : ""} |`);
  }
  p();
}
p(`**Sauces maison** : ${carte.sauces.map((s) => fr.carte.sauces[s]).join(", ")}`);
p();
p(`**Suppléments** : ${carte.extras.map((x) => `${fr.carte.extras[x.id]} ${euro(x.price)}`).join(", ")}`);
p();
p("### Au bar (sur place uniquement)");
p();
for (const g of carte.bar) {
  p(`**${fr.carte.bar[g.id]}**${g.sizes ? ` (${g.sizes.join(" / ")})` : ""}`);
  p();
  for (const [name, ...prices] of g.rows) p(`- ${name} : ${prices.map(euro).join(" / ")}`);
  p();
}

// Tous les autres textes, français puis anglais
const SKIP = new Set(["products", "carte", "alt", "pages"]);
function dump(obj, other, prefix = "") {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    const o = other?.[k];
    if (typeof v === "string") p(`- \`${key}\` : ${v}${typeof o === "string" ? `  \n  _EN : ${o}_` : ""}`);
    else if (Array.isArray(v)) v.forEach((x, i) => (typeof x === "string" ? p(`- \`${key}[${i}]\` : ${x}${o?.[i] ? `  \n  _EN : ${o[i]}_` : ""}`) : dump(x, o?.[i], `${key}[${i}]`)));
    else if (v && typeof v === "object") dump(v, o, key);
  }
}
p("## Textes du site (FR, avec l'anglais en dessous)");
p();
for (const [k, v] of Object.entries(fr)) {
  if (SKIP.has(k) || typeof v !== "object") continue;
  p(`### ${k}`);
  p();
  dump(v, en[k], k);
  p();
}
p("## Pages « Kebab à Amiens » et « Döner berlinois à Amiens »");
p();
for (const id of ["kebab", "doner"]) {
  const pg = fr.pages[id];
  p(`### ${pg.h1}`);
  p();
  p(`_Titre Google : ${pg.metaTitle}_  \n_Description : ${pg.metaDescription}_`);
  p();
  p(pg.intro);
  p();
  for (const s of pg.sections) {
    p(`**${s.h}** ${s.p}`);
    p();
  }
}

await writeFile(path.join(ROOT, "CONTENU.md"), out.join("\n"));
console.log("CONTENU.md prêt");
