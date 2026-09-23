# KeySafe × TESCA · Affichage de sécurité et plans du site

Présentation interactive personnalisée pour **TESCA** (Grombalia, industrie automobile), répartie en cinq types. Chaque recueil PDF livré alimente le type qui porte son nom.

| | Type | Supports | Présentation « Galerie » |
|---|---|---|---|
| 01 | Identification des bureaux | 11 | **Le couloir** : défilement horizontal, porte après porte |
| 02 | Identification des locaux techniques | 9 | **Fiches** : panneau illustré, local, équipement signalé |
| 03 | Affichage SST lié aux activités | 17 | **Local par local** : mur d’affiches filtrable par activité |
| 04 | Affichage relatif à la maîtrise des situations d’urgence | 6 | **Affiche au choix** : consignes, organigramme, secouristes |
| 05 | Plans de circulation et d’évacuation | 2 | **Plan au choix** : circulation, évacuation |

Chaque type bascule aussi en vue **Magazine** (récit « Le besoin / Notre réponse / Livrables »).

## Ce que contient la présentation

45 supports TESCA, tous vérifiés visuellement, dont 31 PDF consultables :

- **Bureaux** : les sept plaques de services (l’image d’ensemble puis chaque plaque), la plaque Bureau magasinier, le directoire Direction / Finance / RH et le gabarit d’informations de la loge gardien.
- **Locaux techniques** : neuf panneaux illustrés (atelier de retordage, laboratoire, laboratoire STEP, médecine du travail, compresseurs, centrale de traitement d’air, déchets dangereux, monte-charge, loge gardien).
- **Affichage SST** : treize affiches par activité (consignes générales du site TTG, laboratoire ×3, monte-charge ×2, escaliers, ergonomie, armoire électrique, médecine du travail, tableau des incompatibilités entre produits chimiques — conforme au référentiel SGH/CLP —, extincteur, procédure de secourisme) et quatre supports de sensibilisation (énergie, impressions, réunions, tri des déchets).
- **Situations d’urgence** : les consignes générales (incendie, accident, évacuation), l’organigramme de secours du site TTG, les trois listes nominatives des secouristes et agents de lutte contre l’incendie (administration, tissage, finition) et la version à QR code.
- **Plans** : le plan de circulation du site TTG et un plan d’évacuation par niveau. Le plan d’évacuation présenté a été réalisé pour le site PSC et sert de modèle : la mention figure sur le support.

## Personnalisation TESCA (23 septembre 2026)

La présentation était multi-clients ; elle est désormais **exclusivement TESCA** :

- Les supports **PSI** et **SOCOHUILE** sont retirés définitivement : plus de filtre par client, plus de badges de sites, plus de filtre par marque en mode présentation. Leurs aperçus WebP et PDF générés ont été supprimés (`assets/photos/psc`, `assets/photos/socohuile`, `assets/documents/socohuile`) ; les fichiers d’origine restent sur le poste.
- Les **vidéos** KeySafe (exercices d’évacuation, formation incendie, Safety Day) et les photos LinkedIn d’autres sites sont retirées, ainsi que la section « Sur le terrain » et les six panneaux bilingues sans logo.
- Les quatre expertises sont devenues les **cinq types** du tableau ci-dessus : les plans de circulation et d’évacuation forment leur propre type, et l’identification des zones a été retirée.
- Ne sont publiés que l’identification des bureaux, la livraison du 23 septembre et les trois plans du site : les autres supports des livraisons précédentes (plaques de zones, affiches remplacées, déclinaisons) sont retirés et leurs aperçus supprimés du disque.

Chaque fichier écarté reste tracé, avec son motif, dans [sources/CLASSEMENT-MEDIAS.md](sources/CLASSEMENT-MEDIAS.md).

## Livraison du 23 septembre, intégrée

Cinq recueils PDF déposés dans `assets/`, renommés par type, ont été classés page par page :

| Fichier | Contenu | Effet |
|---|---|---|
| `Identification des locaux techniques.pdf` | 9 panneaux de locaux techniques en haute définition | Remplacent les 8 panneaux précédents ; **Monte-charge** et **Laboratoire STEP** sont inédits |
| `Affichage SST lié aux activités (3).pdf` | 10 affiches SST et sensibilisation au logo uniforme | Remplacent les versions en ligne ; **Local de médecine du travail** est inédit |
| `Affichage SST lié aux activités.pdf` | Déversement, laboratoire, monte-charge | Remplacent les versions en ligne |
| `Affichage SST lié aux activités (2).pdf` | Consignes générales, monte-charge et laboratoire du site TTG, bilingues | Remplacent les versions en ligne |
| `Affichage relatif à la maîtrise des situations d’urgence2.pdf` | Listes des secouristes et agents incendie par zone | Administration mise à jour ; **Tissage** et **Finition** inédits |

Chaque recueil alimente **un seul type**, celui que son nom désigne : les trois PDF « Affichage SST lié aux activités » forment le type 03 (y compris l’extincteur, le déversement et la procédure de secourisme), et le PDF « Affichage relatif à la maîtrise des situations d’urgence » forme à lui seul le type 04. Chaque support garde son PDF téléchargeable, découpé à sa page et ré-encodé à 170 dpi pour rester léger.

Les supports qui ne viennent pas de ces recueils — les onze de l’identification des bureaux et les trois plans — ont vu leurs fichiers d’origine retirés du poste : le pipeline réutilise les aperçus déjà générés.

## Ajouts du 24 septembre

- **Type 03** : le tableau des incompatibilités entre produits chimiques (mention « Conforme au référentiel SGH/CLP »).
- **Type 04** : les consignes générales incendie / accident / évacuation (gabarit à renseigner), l’organigramme de secours du site TTG et l’affiche des secouristes à QR code.
- **Type 05** : il ne garde que deux plans — la circulation du site TTG (TESCA) et le plan d’évacuation donné en modèle. Les trois plans de la première livraison ont été retirés, leurs aperçus supprimés.
- La façade TESCA ouvre le dossier, recadrée au-dessus des personnes.

## Ouvrir la présentation

- **Le plus simple** : double-cliquer sur `index.html` (Chrome, Edge, Firefox, Safari).
- **En réunion ou sur un autre appareil** : `npm run dev`, puis ouvrir http://localhost:5173. L’adresse réseau affichée permet de l’ouvrir sur une tablette ou l’écran de la salle.
- **Lien préparé pour un interlocuteur** : `index.html?pour=Nom%20du%20contact` affiche « Présentation préparée pour … » dans l’accueil, le mode présentation et le formulaire. `&vue=magazine` ouvre les types en mode récit.

## Les idées clés

- **La vitrine de l’accueil** : à droite du titre, les vrais supports défilent type par type (onglets 01 à 05), chacun en entier, avec sa légende. Un clic l’ouvre en grand, « Voir le projet » ouvre son dossier ; le défilement s’arrête au survol. La liste est `D.hero`, définie dans `scripts/register-client-media.mjs`.
- **La photo du site** : la façade TESCA ouvre le dossier, au-dessus des cinq types (l’image d’origine est recadrée au-dessus des personnes).
- **Une phrase d’utilité par type** : chaque type s’ouvre sur ce que ses affiches évitent ou font gagner, repris en tête de la diapositive du mode présentation.
- **Le sommaire des cinq types** : sous l’accueil, cinq cartes donnent le numéro, la promesse et le nombre de supports, et ouvrent le type.
- **Le code couleur de la sécurité devient la navigation** : information (indigo), accès réglementé (bleu), avertissement (jaune), secours (rouge), évacuation (vert), comme les couleurs de sécurité de l’ISO 7010.
- **Mode présentation** : bouton « Présenter ». Une ouverture par type, puis chacun de ses supports en grand avec la bande de tous les autres. Raccourcis : ← → pour parcourir, `1` à `5` pour choisir un type, `Entrée` pour voir le support en taille réelle, `F` pour le plein écran, `Échap` pour quitter.
- **Images entières** : aucun visuel n’est recadré ni plus haut que l’écran. Un clic ouvre la **visionneuse** plein écran ; « Taille réelle » affiche l’image pixel pour pixel, à parcourir en la faisant glisser. Raccourcis : ← → pour changer de visuel, `+` et `-` pour la taille réelle, `Échap` pour fermer.
- **Le manifeste** : la citation de la grille d’audit KeySafe s’allume au défilement ; « ce qu’elle risque », « ce qu’elle doit porter » et « par où elle sort » prennent les couleurs jaune, bleu et vert.

## Ajouter ou modifier des supports

Les visuels ne se modifient **jamais à la main** dans `js/data.js` : ce fichier est généré.

1. Déposer les fichiers fournis dans `assets/`.
2. Les classer dans `scripts/import-client-media.py` : type, dossier, légende, local concerné (`zone`) — un fichier peut aussi être marqué `excluded` (hors périmètre) ou `pending` (en attente d’arbitrage).
3. `python scripts/import-client-media.py` génère les aperçus WebP, les grands formats et les PDF classés.
4. `node scripts/register-client-media.mjs` reconstruit `js/data.js`, la vitrine et `sources/CLASSEMENT-MEDIAS.md`.
5. `npm test` vérifie que tout fichier fourni est classé et que rien d’autre que TESCA n’est publié.

Les **textes** des cinq types et des dossiers (titre, besoin, réponse, livrables) sont dans `scripts/register-client-media.mjs`.

## Avant d’envoyer la présentation

- [ ] Obtenir l’accord de TESCA pour être cité et montré.
- [ ] Le plan d’évacuation du type 05 porte le logo **PSI/PSC** : il est publié comme modèle, avec la mention « Modèle similaire réalisé pour le site PSC ». À remplacer par le plan TESCA dès qu’il est disponible.
- [ ] **Données personnelles** : les trois listes de secouristes affichent des noms et des numéros de téléphone (choix assumé de les publier tels quels). Faire valider cette diffusion par TESCA.
- [ ] Corriger si besoin le titre de l’affiche « LOCAL DE RETARDAGE » (le panneau du local porte « Atelier de retordage »).
- [ ] Valider les textes « Le besoin », « Notre réponse » et « Livrables » de chaque dossier.
- [ ] Confirmer les coordonnées : +216 44 970 980 et commercial@keysafe.tn.

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur local (http://localhost:5173) |
| `npm test` | vérifie les données, les fichiers, les filtres, le dossier, la présentation et le formulaire |
| `npm run build` | prépare `dist/` à héberger (~29 Mo, sans les fichiers de travail) |
| `npm run package` | `dist/` + `deliverables/KeySafe-Portfolio.zip` |
| `npm run mockups` | régénère les maquettes SVG de démonstration (non utilisées par le site) |

`npm install` n’installe que jsdom, utilisé par les tests. Le site livré n’a aucune dépendance. `python scripts/import-client-media.py` demande PyMuPDF et Pillow.

## Organisation

```
index.html            la présentation
brief.html            kit photos (interne, hérité de la version multi-clients, non inclus dans dist/)
css/styles.css        charte et mise en page
js/data.js            contenu généré : types, dossiers, supports, contact
js/app.js             interactions
scripts/import-client-media.py     classement des fichiers fournis → aperçus WebP et PDF
scripts/register-client-media.mjs  cinq types, textes, vitrine → js/data.js
assets/photos/tesca/  aperçus des supports (src) et grands formats (-grand)
assets/documents/tesca/ PDF originaux consultables
assets/terrain/       visuel de la grille d’audit (section Méthode)
sources/              catalogue, classement et provenance des contenus
_archive/v1/          première version du portfolio, conservée
```
