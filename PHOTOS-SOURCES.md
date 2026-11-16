# Photos du site : sources et licences

Relevé du 16/11/2026. Les fichiers sources sont dans `assets/`, préparés par `node scripts/fetch-photos.mjs` puis `npm run media` (WebP/AVIF servis par next/image).
Sur le site, chaque photo libre de droits porte un petit badge « Illustration » et son texte alt le précise : aucune n'est présentée comme une photo du restaurant.

## Photos réelles du restaurant (5 photos, 7 fichiers dont 2 recadrages)

Source : fiche Google « Berlin & Durum kebab », onglet **Photos du propriétaire** (publiées par l'établissement). Originaux dans `assets/raw/berlindurum_owner_*.jpg`.
À faire confirmer au restaurant (droit d'usage de ses propres photos sur son site : normalement acquis, mais à mentionner lors de la validation).

| Fichier | Contenu | Original | Utilisation |
| --- | --- | --- | --- |
| `hero/hero.jpg` | Plateau de plats (Berliner, durum, assiettes, frites) sur table en bois | owner_1 (1600×1066) | Hero, image de partage `og.jpg` |
| `plats/assiette-a.jpg` | Recadrage de owner_1 : assiette avec frites et salade | owner_1 | Assiettes (tuile + cartes) |
| `plats/assiette-b.jpg` | Recadrage de owner_1 : Berliner sur assiette en bois | owner_1 | Assiettes |
| `plats/berliner-feta.jpg` | Berliner fêta et frites maison | owner_2 | Berliner fêta, tuile Döner, bloc « Döner berlinois », page Döner |
| `plats/salade-cesar.jpg` | Salade César au poulet pané | owner_4 | Salade César |
| `plats/durum-classic.jpg` | Durum coupé en deux, planche en bois | owner_6 | Durum classic, tuile Durum |
| `plats/salade-burrata.jpg` | Salade burrata (recadrée pour retirer le texte incrusté) | owner_10 | Salade burrata, bloc « Frais & maison » |

Non utilisées : owner_3 et owner_9 (captures d'écran de téléphone), owner_5 et owner_7 (cartes papier, reprises en HTML), owner_8 (texte incrusté sur le plat).
Instagram @berlin_durum consulté : publications surtout en vidéo avec texte incrusté (annonces, noms de plats), rien d'exploitable sans texte.

## Photos libres de droits (28 fichiers, 27 affichés)

### Wikimedia Commons (1)

| Fichier | Sujet | Auteur | Licence | Source |
| --- | --- | --- | --- | --- |
| `terrasse/quai-belu.jpg` | Le quai Belu et la Somme (vue générale du quai, pas la terrasse du restaurant) | Pierre Poschadel | CC BY-SA 4.0 (usage commercial autorisé, attribution requise) | https://commons.wikimedia.org/wiki/File:Amiens_(80),_quai_Belu_2.jpg |

Attribution à conserver (mentions légales du site) : « Quai Belu : Pierre Poschadel, CC BY-SA 4.0, via Wikimedia Commons ».

### Unsplash (27) : licence Unsplash (usage commercial autorisé, sans attribution obligatoire)

| Fichier | Sujet | Photographe | Page |
| --- | --- | --- | --- |
| `plats/stock-berliner.jpg` | Döner en pain pide | @yoadsh | https://unsplash.com/photos/sPmF7MNzdnU |
| `plats/stock-durum-a.jpg` | Wrap viande | @bayuajiabiyu | images.unsplash.com/photo-1719282431565-3b30bb7d2658 |
| `plats/stock-durum-b.jpg` | Wraps coupés | @bayuajiabiyu | images.unsplash.com/photo-1719282431723-9d0f4370d4bc |
| `plats/stock-durum-c.jpg` | Durum et sauce | @orkunorcan | images.unsplash.com/photo-1676300187013-7540d4e9440d |
| `plats/stock-burger-a.jpg` | Burger double | @amir_v_ali | images.unsplash.com/photo-1568901346375-23c9450c58cd |
| `plats/stock-burger-b.jpg` | Burger cheddar | @phototastyfood | images.unsplash.com/photo-1586190848861-99aa4a171e90 |
| `plats/stock-burger-c.jpg` | Burger et frites | @rollelflex_graphy726 | images.unsplash.com/photo-1551782450-a2132b4ba21d |
| `plats/stock-chicken-burger.jpg` | Burger au poulet | @shootdelicious | images.unsplash.com/photo-1606755962773-d324e0a13086 |
| `plats/stock-salade-feta.jpg` | Salade composée | @alphabetania | images.unsplash.com/photo-1607532941433-304659e8198a |
| `plats/stock-salade-bowl.jpg` | Grand bol de salade | @annapelzer | images.unsplash.com/photo-1512621776951-a57141f2eefd |
| `plats/stock-frites.jpg` | Frites en panier | @mitchel3uo | images.unsplash.com/photo-1630384060421-cb20d0e0649d |
| `plats/stock-frites-b.jpg` | Frites (réserve, non affichée) | @pixzolo | images.unsplash.com/photo-1518013431117-eb1465fa5752 |
| `plats/stock-frites-cheddar.jpg` | Frites au fromage | @visionary_imaging | images.unsplash.com/photo-1573080496219-bb080dd4f877 |
| `plats/stock-frites-bacon.jpg` | Frites cheddar bacon | @jaygajjar | images.unsplash.com/photo-1639744210631-209fce3e256c |
| `plats/stock-falafel-a.jpg` | Assiette de falafels | @zoshuacolah | images.unsplash.com/photo-1680990999782-ba7fe26e4d0b |
| `plats/stock-falafel-b.jpg` | Falafels et crudités | @brkbbygt | images.unsplash.com/photo-1701688596783-231b3764ef67 |
| `plats/stock-falafel-c.jpg` | Falafels et salade | @pillepriske | images.unsplash.com/photo-1547058881-aa0edd92aab3 |
| `plats/stock-nuggets.jpg` | Nuggets | @brett_jordan | images.unsplash.com/photo-1619881590738-a111d176d906 |
| `plats/stock-baklava.jpg` | Baklava | @omerhaktan | images.unsplash.com/photo-1617806501553-d3a6a3a7b227 |
| `plats/stock-lokum.jpg` | Loukoums | @enginakyurt | images.unsplash.com/photo-1635847457796-c6d78fa0fbc9 |
| `plats/stock-tarte-chocolat.jpg` | Tarte au chocolat (pour la tarte au Daim) | @razvan_mirel | images.unsplash.com/photo-1616031037011-087000171abe |
| `plats/stock-cappuccino.jpg` | Cappuccinos | @nate_dumlao | images.unsplash.com/photo-1509042239860-f550ce710b93 |
| `plats/stock-espresso.jpg` | Expresso | @jarson | images.unsplash.com/photo-1559496417-e7f25cb247f3 |
| `plats/stock-canette.jpg` | Canette de soda | @picoftasty | images.unsplash.com/photo-1554866585-cd94860890b7 |
| `plats/stock-jus.jpg` | Jus d'orange | @abhishek_hajare | images.unsplash.com/photo-1600271886742-f049cd451bba |
| `plats/stock-eau.jpg` | Bouteille d'eau | @nutnp | images.unsplash.com/photo-1561041695-d2fadf9f318c |
| `plats/stock-ayran.jpg` | Boisson au yaourt (ayran) | @chefmariii | images.unsplash.com/photo-1630409346699-79481a79db52 |

## Remplacer une illustration par une vraie photo

Déposer la photo du plat sous son nom exact (ex. `assets/plats/berliner-gemuse.jpg`, liste des noms dans `data/carte.json`) puis `npm run media` : elle passe automatiquement devant la photo d'illustration, et le badge « Illustration » disparaît.
