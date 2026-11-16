// Range les photos du site dans assets/ (une seule fois ; ensuite : npm run media).
//   node scripts/fetch-photos.mjs
//
// 1. Photos RÉELLES : publiées par le propriétaire sur la fiche Google « Berlin & Durum kebab »
//    (assets/raw/berlindurum_owner_*.jpg), recadrées pour retirer le texte incrusté si besoin.
// 2. Photos LIBRES DE DROITS (Unsplash, licence Unsplash ; Wikimedia Commons, CC BY-SA) pour ce qui manque.
//    Elles illustrent un plat ou le quartier, jamais « notre restaurant ». Détail : PHOTOS-SOURCES.md.
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const RAW = path.join(ROOT, "assets/raw");
const exists = (f) => access(f).then(() => true, () => false);

// [fichier source, destination, recadrage (fractions gauche, haut, largeur, hauteur)]
const OWNER = [
  ["berlindurum_owner_1.jpg", "hero/hero.jpg"],
  ["berlindurum_owner_1.jpg", "plats/assiette-a.jpg", [0, 0.25, 0.36, 0.75]],
  ["berlindurum_owner_1.jpg", "plats/assiette-b.jpg", [0.62, 0.3, 0.38, 0.7]],
  ["berlindurum_owner_2.jpg", "plats/berliner-feta.jpg"],
  ["berlindurum_owner_4.jpg", "plats/salade-cesar.jpg"],
  ["berlindurum_owner_6.jpg", "plats/durum-classic.jpg"],
  ["berlindurum_owner_10.jpg", "plats/salade-burrata.jpg", [0.18, 0, 0.64, 0.62]],
];

// [id Unsplash, destination]
const UNSPLASH = [
  ["1699728088614-7d1d4277414b", "plats/stock-berliner.jpg"],
  ["1719282431565-3b30bb7d2658", "plats/stock-durum-a.jpg"],
  ["1719282431723-9d0f4370d4bc", "plats/stock-durum-b.jpg"],
  ["1676300187013-7540d4e9440d", "plats/stock-durum-c.jpg"],
  ["1568901346375-23c9450c58cd", "plats/stock-burger-a.jpg"],
  ["1586190848861-99aa4a171e90", "plats/stock-burger-b.jpg"],
  ["1551782450-a2132b4ba21d", "plats/stock-burger-c.jpg"],
  ["1606755962773-d324e0a13086", "plats/stock-chicken-burger.jpg"],
  ["1607532941433-304659e8198a", "plats/stock-salade-feta.jpg"],
  ["1512621776951-a57141f2eefd", "plats/stock-salade-bowl.jpg"],
  ["1630384060421-cb20d0e0649d", "plats/stock-frites.jpg"],
  ["1518013431117-eb1465fa5752", "plats/stock-frites-b.jpg"],
  ["1573080496219-bb080dd4f877", "plats/stock-frites-cheddar.jpg"],
  ["1639744210631-209fce3e256c", "plats/stock-frites-bacon.jpg"],
  ["1680990999782-ba7fe26e4d0b", "plats/stock-falafel-a.jpg"],
  ["1701688596783-231b3764ef67", "plats/stock-falafel-b.jpg"],
  ["1547058881-aa0edd92aab3", "plats/stock-falafel-c.jpg"],
  ["1619881590738-a111d176d906", "plats/stock-nuggets.jpg"],
  ["1617806501553-d3a6a3a7b227", "plats/stock-baklava.jpg"],
  ["1635847457796-c6d78fa0fbc9", "plats/stock-lokum.jpg"],
  ["1616031037011-087000171abe", "plats/stock-tarte-chocolat.jpg"],
  ["1509042239860-f550ce710b93", "plats/stock-cappuccino.jpg"],
  ["1559496417-e7f25cb247f3", "plats/stock-espresso.jpg"],
  ["1554866585-cd94860890b7", "plats/stock-canette.jpg"],
  ["1600271886742-f049cd451bba", "plats/stock-jus.jpg"],
  ["1561041695-d2fadf9f318c", "plats/stock-eau.jpg"],
  ["1630409346699-79481a79db52", "plats/stock-ayran.jpg"],
];

// Wikimedia Commons : « Amiens (80), quai Belu 2 », Pierre Poschadel, CC BY-SA 4.0
const COMMONS = [["https://commons.wikimedia.org/wiki/Special:FilePath/Amiens_(80),_quai_Belu_2.jpg?width=2000", "terrasse/quai-belu.jpg"]];

async function save(buf, dest, crop) {
  const out = path.join(ROOT, "assets", dest);
  await mkdir(path.dirname(out), { recursive: true });
  const { data, info } = await sharp(buf).rotate().toBuffer({ resolveWithObject: true });
  let img = sharp(data);
  if (crop) {
    const [l, t, w, h] = crop;
    const left = Math.round(l * info.width);
    const top = Math.round(t * info.height);
    img = img.extract({ left, top, width: Math.min(Math.round(w * info.width), info.width - left), height: Math.min(Math.round(h * info.height), info.height - top) });
  }
  await img.jpeg({ quality: 92 }).toFile(out);
  console.log("ok", dest);
}

for (const [src, dest, crop] of OWNER) {
  if (await exists(path.join(ROOT, "assets", dest))) continue;
  await save(path.join(RAW, src), dest, crop);
}
const UA = { "user-agent": "BerlinDurumSite/1.0 (site build)" };
for (const [id, dest] of UNSPLASH) {
  if (await exists(path.join(ROOT, "assets", dest))) continue;
  const r = await fetch(`https://images.unsplash.com/photo-${id}?w=1400&q=82&fm=jpg`, { headers: UA });
  if (!r.ok) throw new Error(`${id} ${r.status}`);
  await save(Buffer.from(await r.arrayBuffer()), dest);
}
for (const [url, dest] of COMMONS) {
  if (await exists(path.join(ROOT, "assets", dest))) continue;
  const r = await fetch(url, { headers: UA });
  if (!r.ok) throw new Error(`${url} ${r.status}`);
  await save(Buffer.from(await r.arrayBuffer()), dest);
}
await writeFile(path.join(ROOT, "assets/.fetched"), new Date().toISOString());
