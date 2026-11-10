# Photos à prendre sur place

Déposez chaque photo sous le nom indiqué (jpg, png ou heic), puis lancez `npm run media` : l'illustration de remplacement disparaît d'elle-même et l'image de partage (`public/og.jpg`) est refaite avec la photo du hero.
Photos brutes (Google Maps, téléphone) : dans `assets/raw/`, pour tri. Ne pas mettre en avant les visages des clients.

## Priorité 1

| Fichier | Sujet | Conseil |
| --- | --- | --- |
| `hero/hero.jpg` | **Le plus beau Berliner** (fêta ou Gemüse), en très gros plan | Lumière du jour, en terrasse, la Somme floue derrière. Format vertical ou carré |
| `terrasse/terrasse.jpg` | La terrasse au bord de l'eau | En fin de journée, tables dressées, sans clients identifiables |
| `facade/facade.jpg` | La façade et l'enseigne, 41 quai Belu | Bien droite, de face |
| `hero/comptoir.jpg` | La broche de kebab derrière le comptoir | Bloc « Le döner berlinois » |
| `plats/sauces.jpg` | Les sauces maison alignées | Bloc « Frais & maison » |

## Priorité 2 : les plats (un fichier par plat, nom = identifiant)

`plats/berliner-classic.jpg`, `berliner-feta`, `berliner-burrata`, `berliner-chevre-miel`, `berliner-gemuse`, `berliner-vegge`,
`durum-classic`, `durum-chef`, `durum-vegan`, `assiette-classic`, `assiette-berliner`, `assiette-gemuse`,
`burger-classic`, `chicken-burger`, `salade-feta`, `frites-maison`, `baklava`, `tarte-daim`… (liste complète : `data/carte.json` → `items`).

## Tuiles de la carte (facultatif)

`plats/tuile-doner.jpg`, `tuile-durum`, `tuile-assiettes`, `tuile-vege`, `tuile-menus`, `tuile-boissons`, `tuile-desserts` (sinon la photo du plat phare est utilisée).

## Galerie

`galerie/*.jpg` : ambiance, équipe (avec leur accord), quai Belu.
