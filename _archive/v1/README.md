# KeySafe — portfolio interactif

Portfolio web en français, inspiré des couleurs KeySafe : bleu, vert, blanc cassé. Interface responsive, collection filtrable par client et prestation, mode magazine, galeries, sept diapositives de présentation, carte interactive et quatre vidéos publiques KeySafe enregistrées localement.

## Ouvrir le portfolio

Dans ce dossier, lancer `npm run dev`, puis ouvrir **http://localhost:5173**.

On peut aussi ouvrir directement **index.html** dans un navigateur récent. Les images, vidéos et polices sont locales. L’envoi d’une demande se prépare dans la messagerie du visiteur et les liens LinkedIn nécessitent une connexion Internet.

**sources/keysafe.html est une archive de recherche, pas le portfolio.** Le site KeySafe consulté répondait « Account Suspended ». L’entrée du portfolio développé ici est `index.html`.

## Fonctionnalités

- Cinq prestations : identification des bureaux, identification des locaux techniques, risques spécifiques par local, plans de circulation et plans d’évacuation.
- Trois filtres clients : TESCA, PSC, SOCOHUILE. Chaque client dispose d’un aperçu pour chacune des cinq prestations.
- Filtres combinables et URL partageable, par exemple `?client=tesca&prestation=bureaux&vue=magazine#realisations`.
- Vue galerie ou magazine, quinze aperçus et galeries détaillées.
- Mode présentation : sept diapositives, flèches du clavier, Home/End, plein écran si disponible. Échap ferme la présentation.
- Vidéos HTML5 avec lecture, pause, volume, progression et lien vers la publication originale.
- Carte de site illustrative à cinq points interactifs.
- Formulaire de contact avec validation et brouillon `mailto:`. Aucun message n’est envoyé par le site. Un texte copiable est fourni si aucune messagerie n’est configurée.
- Navigation au clavier, focus visible, dialogues natifs et respect de la préférence de réduction des animations.

## Remplacer les contenus

Les images associées aux clients sont **des illustrations de présentation**, jamais des photos attribuées à une réalisation réelle. Le périmètre exact de chaque mission doit être confirmé avec vos documents. La référence à ces trois clients vient de votre demande.

Tout se configure dans **data.js** :

1. Copier les photos dans `assets/`, avec un nom clair, par exemple `tesca-bureaux-01.webp`.
2. Trouver le projet concerné par son `id`, par exemple `tesca-bureaux`.
3. Remplacer `image` et les chemins dans `gallery`.
4. Adapter le titre et ajouter une propriété `description` décrivant le travail réellement livré.
5. Passer `placeholder` à `false` lorsque les images et l’attribution au client ont été validées. La mention « Aperçu illustratif » disparaît alors de la fiche.

Les libellés généraux « collection de présentation » dans `index.html` et les slides dans `app.js` peuvent ensuite être adaptés pour la version client finale. Les coordonnées sont configurées dans `data.js` et également présentes dans le pied de page HTML.

Les vidéos actuelles concernent des interventions KeySafe identifiées dans les publications publiques, dont EL KHOMSA, BONDIN et Ciments Jbel Oust. Elles ne sont pas attribuées aux trois clients de la collection. Remplacer ou enrichir `videos` avec les films originaux TESCA, PSC et SOCOHUILE lorsqu’ils seront disponibles.

## Visuels à fournir pour la version définitive

- Logo horizontal KeySafe en SVG ou PNG transparent haute résolution ; logos officiels TESCA, PSC et SOCOHUILE. Les noms clients actuels sont des compositions typographiques.
- Pour chaque client : deux à six photos par prestation, idéalement une vue en contexte et un détail lisible.
- Photos des plaques de bureaux et des panneaux des locaux techniques.
- Photos des affiches de risques et des zones où elles sont installées.
- Plans de circulation et d’évacuation approuvés, avec une version dont la diffusion externe est autorisée.
- Films MP4 et correspondance précise client / prestation ; les URL LinkedIn exactes suffisent également si les médias restent accessibles publiquement.
- Pour chaque projet : nom du site, prestation réalisée et deux phrases sur le besoin et la solution. Aucun résultat chiffré ni témoignage n’a été inventé.

## Vérifier et livrer

`npm install` installe seulement jsdom pour les tests de développement. Le portfolio livré n’a aucune dépendance JavaScript externe.

- `npm test` : vérifie les filtres, les URL, les galeries, les états des dialogues, l’attribution vidéo, la présentation, la carte, le menu et l’existence des médias.
- `npm run build` : prépare `dist/`, avec uniquement les fichiers du portfolio et les médias utiles. Les sources de recherche et les fichiers de travail ne sont pas inclus.
- Hébergement : déposer le contenu de `dist/` sur un hébergement statique. Le site n’a pas encore été publié.
- Les tests DOM ne simulent pas la mise en page ni le décodage vidéo d’un navigateur. Aucun navigateur de contrôle n’était connecté à cette session ; une vérification visuelle desktop/mobile reste à effectuer.

Voir **sources/ASSETS.md** pour la provenance des vidéos, des illustrations et des coordonnées.
