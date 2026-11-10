// Logo typographique de Berlin Durum Kebab, en tracés vectoriels (aucune police nécessaire pour l'afficher).
//   npm run logo
//
// Leur carte papier affiche le nom en capitales condensées très grasses (style signalétique) : on reprend ce parti
// avec Anton, une petite broche de döner au trait et « KEBAB · AMIENS » en petit.
// Produit :
//   public/logo.svg        lettrage horizontal (broche + nom + sous-titre), utilisé en masque CSS (prend la couleur du texte)
//   public/logo-carre.svg  version carrée (fond jaune moutarde), pour les réseaux et l'affichette
//   app/icon.svg, app/icon.png, app/apple-icon.png   favicon (broche noire sur jaune)
// Pour remplacer par le vrai logo : remplacez public/logo.svg (en gardant un fond transparent) et relancez npm run logo
// pour les favicons, ou déposez directement vos fichiers.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import opentype from "opentype.js";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const buf = await readFile(path.join(ROOT, "node_modules/@fontsource/anton/files/anton-latin-400-normal.woff"));
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

/** Texte → tracé SVG, avec espacement des lettres (en unités de la taille). */
function textPath(text, size, x, y, tracking = 0) {
  let cx = x;
  const parts = [];
  for (const ch of text) {
    const g = font.charToGlyph(ch);
    parts.push(g.getPath(cx, y, size).toPathData(2));
    cx += (g.advanceWidth / font.unitsPerEm) * size + tracking * size;
  }
  return { d: parts.join(""), width: cx - x - tracking * size };
}

// Broche de döner : tige, cône de viande à tranches obliques, coupelle. Repère 40 × 100.
export const SPIT = [
  "M20 3V97",
  "M7 15H33L28.5 79H11.5Z",
  "M8 27 32 22M9 39 31.5 34M10 51 30.5 46M10.8 63 29.6 58M11.4 75 29 70",
  "M4 86H36",
];
const spit = (x, y, s, stroke = 4.2) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${SPIT.map((d) => `<path d="${d}"/>`).join("")}</g>`;

// ——— Lettrage horizontal ———
const NAME = textPath("BERLIN DURUM", 100, 0, 0, 0.02);
const SUB = textPath("KEBAB · AMIENS", 25, 0, 0, 0.42);
const gap = 22;
const iconW = 40 * 1.02;
const textX = iconW + gap;
const nameTop = 4; // Anton : capitales = 0,86 em au-dessus de la ligne de base
const nameBase = nameTop + 86;
const subBase = nameBase + 33;
const W = Math.ceil(textX + Math.max(NAME.width, SUB.width) + 2);
const H = subBase + 4;
const name = textPath("BERLIN DURUM", 100, textX, nameBase, 0.02);
const sub = textPath("KEBAB · AMIENS", 25, textX + (NAME.width - SUB.width) / 2, subBase, 0.42);

const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" color="#151515">
<title>Berlin Durum Kebab · Amiens</title>
${spit(0, 4, 1.02 * (H - 8) / 100, 4.4)}
<path fill="currentColor" d="${name.d}"/>
<path fill="currentColor" d="${sub.d}"/>
</svg>
`;
await writeFile(path.join(ROOT, "public/logo.svg"), logo);

// ——— Version carrée (jaune moutarde) ———
const sq = 600;
const n2 = textPath("BERLIN", 132, 0, 0, 0.02);
const n3 = textPath("DURUM", 132, 0, 0, 0.02);
const s2 = textPath("KEBAB · AMIENS", 30, 0, 0, 0.3);
const cx = (w) => (sq - w) / 2;
const square = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${sq} ${sq}" width="${sq}" height="${sq}" color="#151515">
<rect width="${sq}" height="${sq}" fill="#F2B705"/>
${spit(sq / 2 - 26, 46, 1.3, 4.4)}
<path fill="#151515" d="${textPath("BERLIN", 132, cx(n2.width), 300, 0.02).d}"/>
<path fill="#151515" d="${textPath("DURUM", 132, cx(n3.width), 430, 0.02).d}"/>
<rect x="${sq / 2 - 120}" y="462" width="240" height="5" fill="#C8322B"/>
<path fill="#151515" d="${textPath("KEBAB · AMIENS", 30, cx(s2.width), 520, 0.3).d}"/>
</svg>
`;
await writeFile(path.join(ROOT, "public/logo-carre.svg"), square);

// ——— Favicon : broche noire sur jaune, coins arrondis ———
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" color="#151515">
<rect width="64" height="64" rx="14" fill="#F2B705"/>
${spit(17, 5, 0.54, 5.4)}
</svg>
`;
await writeFile(path.join(ROOT, "app/icon.svg"), icon);
await sharp(Buffer.from(icon), { density: 600 }).resize(512, 512).png().toFile(path.join(ROOT, "app/icon.png"));
await sharp(Buffer.from(icon.replace('rx="14"', 'rx="0"')), { density: 600 }).resize(180, 180).png().toFile(path.join(ROOT, "app/apple-icon.png"));

console.log(`logo ${W}×${H} prêt`);
