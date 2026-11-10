// Photos du site.
//   npm run media
//
// Prépare pour le web TOUTES les photos de assets/hero, plats, terrasse, facade et galerie dans public/media/<dossier>/
// (next/image sert ensuite AVIF/WebP à la bonne taille) et note leurs dimensions dans data/media-sizes.json.
// Les photos brutes (Google Maps, téléphone…) vont dans assets/raw/ : choisissez-les, renommez-les selon
// assets/A-PHOTOGRAPHIER.md et déposez-les dans le bon dossier. L'illustration de remplacement disparaît d'elle-même.
//
// Génère aussi l'image de partage public/og.jpg (1200 × 630) : la photo du hero si elle existe, sinon le logo.
import { mkdir, readdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const CATS = ["hero", "plats", "terrasse", "facade", "galerie"];
const exists = (f) => access(f).then(() => true, () => false);

const sizes = {};
for (const cat of CATS) {
  const dir = path.join(ROOT, "assets", cat);
  await mkdir(dir, { recursive: true });
  await mkdir(path.join(ROOT, "public/media", cat), { recursive: true });
  for (const f of (await readdir(dir)).filter((f) => /\.(jpe?g|png|webp|heic)$/i.test(f))) {
    const name = f.replace(/\.\w+$/, "").toLowerCase();
    const max = cat === "hero" ? 2400 : 1600;
    const info = await sharp(path.join(dir, f))
      .rotate()
      .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(path.join(ROOT, "public/media", cat, `${name}.jpg`));
    sizes[`/media/${cat}/${name}.jpg`] = [info.width, info.height];
  }
}

// Image de partage : bandeau jaune à gauche (logo carré), photo du hero à droite ou grande broche au trait
const hero = path.join(ROOT, "assets/hero/hero.jpg");
const square = await sharp(path.join(ROOT, "public/logo-carre.svg"), { density: 150 }).resize(630, 630).png().toBuffer();
const right = (await exists(hero))
  ? await sharp(hero).rotate().resize(570, 630, { fit: "cover" }).toBuffer()
  : await sharp(
      Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="570" height="630" viewBox="0 0 570 630">
  <rect width="570" height="630" fill="#F6F0E4"/>
  <text x="56" y="250" font-family="Arial Narrow, Arial, sans-serif" font-weight="700" font-size="60" fill="#151515">Döner berlinois</text>
  <text x="56" y="320" font-family="Arial Narrow, Arial, sans-serif" font-weight="700" font-size="60" fill="#151515">au bord de la Somme</text>
  <rect x="56" y="356" width="90" height="8" fill="#C8322B"/>
  <text x="56" y="430" font-family="Arial, sans-serif" font-size="28" fill="#151515">41 quai Belu · Amiens</text>
  <text x="56" y="474" font-family="Arial, sans-serif" font-size="28" fill="#151515">4,9/5 · plus de 500 avis Google</text>
</svg>`),
    )
      .png()
      .toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#F6F0E4" } })
  .composite([
    { input: square, left: 0, top: 0 },
    { input: right, left: 630, top: 0 },
    { input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect x="628" y="0" width="4" height="630" fill="#151515"/></svg>`), left: 0, top: 0 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.join(ROOT, "public/og.jpg"));

await writeFile(path.join(ROOT, "data/media-sizes.json"), JSON.stringify(sizes, null, 1) + "\n");
console.log(`${Object.keys(sizes).length} photo(s) prête(s), og.jpg généré`);
