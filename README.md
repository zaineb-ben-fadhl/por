# KeySafe · Portfolio signalétique & plans de sécurité

Portfolio interactif destiné aux prospects de KeySafe Training & Consulting. Il présente les réalisations en quatre expertises, filtrables par client : TESCA, PSC et SOCOHUILE. Les photos du dossier PSC portent le logo PSI (Pétrole Services Industriel) : pour afficher « PSI » partout, changer `"name": "PSC"` dans `js/data.js`.

| | Expertise | Présentation « Galerie » |
|---|---|---|
| 01 | Identification des bureaux | **Le couloir** : défilement horizontal, porte après porte |
| 02 | Identification des locaux techniques | **Fiches techniques** : code LT, site, signalisation |
| 03 | Affiches de risques spécifiques par local | **Local par local** : mur d’affiches filtrable par local |
| 04 | Plans de circulation & d’évacuation | **Plans au choix** : entrepôt, administration et photos des installations, avec ouverture en grand |

Chaque expertise bascule aussi en vue **Magazine** (récit « Le besoin / Notre réponse / Livrables »).

## Médias intégrés le 17 septembre 2026

57 fichiers fournis ont été examinés : 54 visuels distincts, dont 19 PDF consultables. Deux doublons exacts sont regroupés, ainsi que le PNG et le PDF de la même affiche d’entrée SOCOHUILE. Les fichiers d’origine dans `assets/` sont conservés.

- TESCA : bureaux, six plaques de locaux, affiches par risque, sensibilisation et trois plans.
- PSC : huit photos d’installations (logo PSI), classées entre risques, circulation et évacuation.
- SOCOHUILE : huit affiches avec leurs PDF, dont un gabarit pour les contacts d’urgence.
- Six panneaux bilingues sans logo : collection complémentaire dans la vue « Tous les sites », en attente d’attribution.

Livraison du 18 septembre 2026 (TESCA), ajoutée sans rien retirer :

- Bureaux : les sept plaques de services (Direction, Finance, Industrialisation, Qualité, Ressources humaines, Manufacturing & Supply Chain, Achats & Supply Chain). L’image d’ensemble est présentée, puis chaque plaque découpée. Les trois supports d’origine restent à la suite.
- Locaux techniques : huit panneaux illustrés (atelier de retordage, deux laboratoires, local médical, compresseurs, centrale de traitement d’air, déchets dangereux, loge gardien), avant les six plaques d’origine.
- Risques : l’affiche de consignes de l’atelier de retordage. Seule la seconde version est affichée ; la première (`1000021905.jpg`) reste dans `assets/`. Le titre de l’affiche indique « RETARDAGE » : orthographe à vérifier.
- Secours : `liste.png`, « Liste des secouristes · Administration », est intégrée au dossier TESCA → Risques → Secours & urgence et au mode présentation. Le grand format WebP conserve les pixels du visuel fourni pour préserver le QR code.
- `1000021909.jpg` et `1000021910.jpg` reprennent à l’identique « Triez les déchets » et « Économisez l’énergie », déjà présentés : non répétés.

Les aperçus WebP sont dans `assets/photos/`, les PDF classés dans `assets/documents/`. Les galeries montrent les supports entiers ; le dossier propose le zoom, le grand format et le PDF quand il existe. Les gabarits sont nommés explicitement. Les maquettes subsistent uniquement dans les prestations sans contenu fourni.

Le classement fichier par fichier est dans [sources/CLASSEMENT-MEDIAS.md](sources/CLASSEMENT-MEDIAS.md). Pour régénérer les fichiers à partir du classement vérifié : `python scripts/import-client-media.py`, puis `node scripts/register-client-media.mjs`. Modifier d’abord ces scripts pour ajouter une nouvelle livraison.

## Vidéos rattachées à un type

Dans `js/data.js`, une vidéo avec `"chapter"` s’affiche dans la présentation juste après l’ouverture de ce type, avant les travaux, et dans la section du site correspondante :

- Exercice d’évacuation, Ciments Jbel Oust → `plans` (évacuation)
- Simulation d’évacuation, EL KHOMSA – Rose Blanche → `plans` (évacuation)
- Formation lutte contre l’incendie → `risques`
- Safety Day Bondin : sans type, présentée à la fin, dans « Sur le terrain »

Pour ajouter une vidéo : déposer le MP4 dans `assets/video/`, puis ajouter une entrée dans `videos` avec `src`, `poster`, `title`, `context` et `chapter` (`bureaux`, `locaux`, `risques` ou `plans`).

## Ouvrir le portfolio

- **Le plus simple** : double-cliquer sur `index.html` (Chrome, Edge, Firefox, Safari).
- **En réunion ou sur un autre appareil** : `npm run dev`, puis ouvrir http://localhost:5173. L’adresse réseau affichée permet de l’ouvrir sur une tablette ou l’écran de la salle.

## Les idées clés

- **La vitrine de l’accueil** : à droite du titre, nos vrais travaux défilent type par type (onglets 01 à 04), chacun en entier, avec la marque et la légende. Un clic l’ouvre en grand, « Voir le projet » ouvre son dossier ; le défilement s’arrête au survol. La liste des travaux mis en avant est `D.hero`, définie dans `scripts/register-client-media.mjs`. Avec `?site=psc` la vitrine ne montre que ce client, avec `?pour=Nom` elle affiche « Sélection préparée pour Nom ». L’illustration précédente reste dans `assets/hero/`.
- **Le code couleur de la sécurité devient la navigation** : indigo KeySafe (information), bleu (locaux techniques), jaune (avertissement), vert (évacuation), comme les couleurs de sécurité de l’ISO 7010.
- **Le plan d’évacuation est le sommaire** : dans l’en-tête, les itinéraires s’animent et chaque repère ouvre une expertise.
- **Le badge d’accès** : choisir un client ouvre son « dossier » dans toutes les expertises. Le filtre reste accessible en bas de l’écran.
- **Lien personnalisé pour un prospect** : `index.html?pour=Nom%20du%20prospect` affiche « Portfolio préparé pour … » dans l’accueil, la présentation et le formulaire.
- **Lien d’un client** : `index.html?site=tesca` (ou `psc`, `socohuile`), combinable avec `&pour=…` et `&vue=magazine`.
- **Mode présentation** : bouton « Présenter ». Pour chaque type : une ouverture avec le filtre par marque, puis les vidéos de ce type, puis chaque travail en grand avec la bande de tous les exemples du type. Les marques TESCA, PSC et SOCOHUILE se filtrent en haut à droite ou sur l’ouverture de chaque type, et la présentation reprend le filtre du site. Raccourcis : ← → pour parcourir, `1` à `4` pour choisir un type, `M` pour changer de marque, `Entrée` pour voir le travail en taille réelle, `F` pour le plein écran, `Échap` pour quitter.
- **Images entières** : aucun visuel n’est recadré ni plus haut que l’écran. Un clic sur un visuel (dans le dossier ou la présentation) ouvre la **visionneuse** plein écran ; « Taille réelle » affiche l’image pixel pour pixel, à parcourir en la faisant glisser. Raccourcis : ← → pour changer de visuel, `+` et `-` pour la taille réelle, `Échap` pour fermer.
- **Le manifeste** : la citation de la grille d’audit KeySafe s’allume au défilement ; « ce qu’elle risque », « ce qu’elle doit porter » et « par où elle sort » prennent les couleurs jaune, bleu et vert.

## Remplacer les maquettes par vos photos

Tant qu’une photo n’est pas fournie, le site affiche une **maquette** marquée du badge « Maquette ». Il n’y a **aucun code à modifier** :

1. Ouvrir `brief.html` (document interne). Il liste les 33 visuels attendus, le nom de fichier exact, la consigne de prise de vue et l’avancement.
2. Nommer la photo exactement comme indiqué, par exemple `bureaux-01.jpg` (JPG, WEBP ou PNG, 2000 px de large maximum).
3. La déposer dans `assets/photos/tesca/`, `assets/photos/psc/` ou `assets/photos/socohuile/`.
4. Recharger : la photo remplace la maquette et le badge disparaît.

Le même principe s’applique aux éléments facultatifs :

- `assets/photos/<client>/logo.png` (ou `.svg`) remplace le nom écrit sur le badge.
- `assets/photos/<client>/film.mp4` ajoute le film du client en tête de la section « Sur le terrain ».

Les **textes** de chaque projet (titre, besoin, réponse, livrables) se modifient dans `js/data.js`. Ils décrivent le type de prestation et **doivent être validés** avec les informations réelles de chaque mission.

## Avant d’envoyer le portfolio à un client

- [ ] Obtenir l’accord de TESCA, PSC et SOCOHUILE pour être cités et montrés.
- [ ] Confirmer le nom du client photographié : filtre « PSC », logo « PSI » sur les supports.
- [ ] Corriger si besoin le titre de l’affiche TESCA « LOCAL DE RETARDAGE » (le panneau du local indique « Atelier de retordage »).
- [ ] Remplacer les maquettes par des photos réelles (suivre `brief.html`). Passer ensuite `showMockupBadges` à `false` dans `js/data.js` si toutes les photos sont fournies.
- [ ] Vérifier les secteurs et les villes des clients dans `js/data.js`. Le secteur de PSC n’est pas renseigné.
- [ ] Valider les textes « Le besoin », « Notre réponse » et « Livrables » de chaque projet.
- [ ] Confirmer les coordonnées : +216 44 970 980 et commercial@keysafe.tn, relevées sur les visuels des publications LinkedIn KeySafe.

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur local (http://localhost:5173), lecture vidéo avec avance rapide |
| `npm test` | vérifie les données, les fichiers, les filtres, le dossier projet, la présentation et le formulaire |
| `npm run build` | prépare `dist/` à héberger, sans `brief.html` ni les fichiers de travail |
| `npm run package` | `dist/` + `deliverables/KeySafe-Portfolio.zip` |
| `npm run mockups` | régénère les maquettes SVG (`scripts/generate-mockups.mjs`) |
| `npm run media` | régénère logos, extraits vidéo et photos LinkedIn (Python + Pillow + ffmpeg) |

`npm install` n’installe que jsdom, utilisé par les tests. Le site livré n’a aucune dépendance.

## Organisation

```
index.html            le portfolio
brief.html            kit photos & vidéos (interne, non inclus dans dist/)
css/styles.css        charte et mise en page
js/data.js            TOUT le contenu : clients, expertises, projets, vidéos, contact
js/app.js             interactions
assets/brand/         logo KeySafe (couleur, blanc, bouclier, mot-symbole), mascotte, favicon
assets/photos/<client>/  ← vos photos réelles
assets/mockups/       maquettes générées (remplacées automatiquement par vos photos)
assets/terrain/       photos et images extraites des publications LinkedIn KeySafe
assets/video/         vidéos LinkedIn KeySafe, affiches et extraits de survol
assets/ambiance/      visuels d’ambiance (illustrations générées lors de la première version)
sources/              recherches et provenance des contenus (voir sources/ASSETS.md)
_archive/v1/          première version du portfolio, conservée
_raw/                 fichiers bruts téléchargés (photos LinkedIn)
```
#   p o r  
 