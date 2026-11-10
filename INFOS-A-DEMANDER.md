# Berlin Durum Kebab : infos à demander au restaurant

Tout ce qui manque sur le site est listé ici. Une fois les réponses obtenues, modifier le fichier indiqué puis redéployer (un push sur GitHub suffit).

| # | Information | Où la mettre | État actuel sur le site |
| --- | --- | --- | --- |
| 1 | **Son prénom et l'histoire du concept** : pourquoi Berlin ? Un séjour, de la famille là-bas, un ancien kebab berlinois ? | `locales/fr.json` et `en.json` → `blocks.doner.text` | Texte générique sur le style berlinois, sans histoire personnelle |
| 2 | **La carte complète et les prix** : valider chaque ligne de `CONTENU.md` (prix relevés sur la carte papier publiée sur Google, le 10/11/2026). Le « menu étudiant » de l'ancienne carte existe-t-il encore ? | `data/carte.json` | Carte relevée, à valider |
| 3 | **Les horaires exacts**, et les fermetures prévues (congés, jours fériés) | `data/horaires.json`, `data/annonces.json` | Horaires de la fiche Google |
| 4 | **Un portable pour WhatsApp** (le 09 55 76 18 32 est un fixe) | `data/site.json` → `whatsapp` (format 33612345678) | Bouton WhatsApp masqué |
| 5 | **L'e-mail** qui recevra les commandes | Vercel → variable `ORDER_NOTIFY_EMAIL` (+ `RESEND_API_KEY`, `RESEND_FROM`) et `data/site.json` → `email` | Sans e-mail, le client voit « Dernière étape : un appel » avec son récapitulatif |
| 6 | **Des photos** : plats, terrasse, façade, broche, sauces | `assets/…` puis `npm run media` (voir `assets/A-PHOTOGRAPHIER.md`) | Illustrations au trait à la place |
| 7 | **Le logo** (fichier d'origine, si l'enseigne en a un) | Remplacer `public/logo.svg` puis `npm run logo` pour les favicons | Logo typographique dessiné pour le site |
| 8 | **SIRET**, raison sociale, nom du responsable de publication | `data/site.json` → `legal` | « À remplir » dans les mentions légales |
| 9 | Moyens de paiement acceptés (CB, espèces, tickets resto ?) | FAQ dans `locales/*.json` | « Au comptoir », sans détail |
| 10 | Stationnement conseillé (parking le plus proche) | `infos.accessText` et FAQ | Formulation générale |
| 11 | Viande halal ? (beaucoup de clients le demandent ; ne rien affirmer sans confirmation) | FAQ | Non mentionné |
| 12 | Accord pour citer 3 vrais avis Google (prénom + initiale) | Section avis (`app/[lang]/page.tsx`, emplacement « À REMPLIR ») | Note + thèmes, aucun avis cité |
| 13 | Un Instagram / Facebook ? | `data/site.json` → `instagram` | Pas de lien réseau |
| 14 | Veut-il le paiement en ligne (Stripe) ? | `data/site.json` → `payment.enabled` + `app/api/checkout` | Prévu, désactivé |
