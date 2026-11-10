// Affichette A5 imprimable (PDF) avec QR code vers le site, à poser sur le comptoir, en vitrine ou sur les tables de la terrasse.
//   npm run affichette   →   print/affichette-berlin-durum-a5.pdf (+ aperçu PNG)
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const site = JSON.parse(await readFile(path.join(ROOT, "data/site.json"), "utf8"));
const url = `${site.url}/fr`;

const hex = (h) => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
const CREAM = hex("#F6F0E4");
const INK = hex("#151515");
const MUSTARD = hex("#F2B705");
const CHILI = hex("#C8322B");
const MUTED = hex("#4A453D");

const pdf = await PDFDocument.create();
pdf.setTitle("Berlin Durum Kebab : affichette A5");
pdf.setAuthor("Berlin Durum Kebab");
const W = 419.53;
const H = 595.28;
const page = pdf.addPage([W, H]);
const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
const sans = await pdf.embedFont(StandardFonts.Helvetica);
const center = (text, font, size, y, color = INK) => page.drawText(text, { x: (W - font.widthOfTextAtSize(text, size)) / 2, y, size, font, color });

page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: CREAM });

// En-tête jaune : le logo (rasterisé, pdf-lib ne lit pas le SVG)
const headH = 150;
page.drawRectangle({ x: 0, y: H - headH, width: W, height: headH, color: MUSTARD });
page.drawRectangle({ x: 0, y: H - headH - 3, width: W, height: 3, color: INK });
const logo = await sharp(path.join(ROOT, "public/logo.svg"), { density: 400 }).png().toBuffer();
const logoW = 320;
const logoH = (logoW * 127) / 626;
page.drawImage(await pdf.embedPng(logo), { x: (W - logoW) / 2, y: H - headH / 2 - logoH / 2, width: logoW, height: logoH });

let y = H - headH - 48;
center("COMMANDEZ EN LIGNE", bold, 24, y);
y -= 20;
center("Choisissez l'heure, on lance la broche. Paiement au comptoir.", sans, 11, y, MUTED);

const qrS = 132;
y -= 26 + qrS;
page.drawRectangle({ x: (W - qrS) / 2 - 12, y: y - 12, width: qrS + 24, height: qrS + 24, color: rgb(1, 1, 1), borderColor: INK, borderWidth: 2.5 });
const qrPng = await QRCode.toBuffer(url, { margin: 0, width: 600, color: { dark: "#151515", light: "#FFFFFF" }, errorCorrectionLevel: "M" });
page.drawImage(await pdf.embedPng(qrPng), { x: (W - qrS) / 2, y, width: qrS, height: qrS });
y -= 32;
center(url.replace(/^https?:\/\//, ""), bold, 9.5, y, CHILI);

// Bandeau noir : la carte en bref
y -= 34;
page.drawRectangle({ x: 28, y: y - 42, width: W - 56, height: 56, color: INK });
center("Berliner dès 9,99 €  ·  Durum dès 9,99 €  ·  Assiettes dès 15,99 €", bold, 10, y - 8, MUSTARD);
center("Kebab maison mariné 24 h  ·  Frites et sauces maison  ·  Options végé", sans, 9, y - 26, CREAM);

y -= 72;
center("4,9/5 sur Google  ·  Terrasse au bord de la Somme", bold, 10, y);
y -= 18;
center(`${site.address.street}, ${site.address.postalCode} ${site.address.city}  ·  ${site.phone}`, bold, 9, y);
y -= 14;
center("Tous les jours 11 h 30 – 23 h  ·  Ven. et sam. jusqu'à minuit", sans, 8.5, y, MUTED);

await mkdir(path.join(ROOT, "print"), { recursive: true });
const file = path.join(ROOT, "print/affichette-berlin-durum-a5.pdf");
await writeFile(file, await pdf.save());
console.log("affichette prête :", file, url);
