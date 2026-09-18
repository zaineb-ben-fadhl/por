# Provenance des contenus

Recherches du 17 septembre 2026.

## LinkedIn KeySafe

La page fournie (`/company/keysafetn/posts/?feedView=all`) exige une connexion. La page publique de l’entreprise (archive `linkedin.html`) montre les **10 publications les plus récentes**. Aucune ne concerne la signalétique réalisée pour TESCA, PSC ou SOCOHUILE. Pour ces clients, le portfolio affiche donc des maquettes, à remplacer par les photos réelles (voir `brief.html`).

| Publication | Contenu | Utilisation |
|---|---|---|
| [activity 7477275452492095488](https://www.linkedin.com/feed/update/urn:li:activity:7477275452492095488/) | Vidéo · exercice Ciments Jbel Oust | `assets/video/exercice.mp4` ; images `cjo-aerien`, `cjo-rassemblement`, `cjo-rassemblement-aerien`, `cjo-signaletique-medecin` |
| [activity 7484900739761213440](https://www.linkedin.com/feed/update/urn:li:activity:7484900739761213440/) | Vidéo · simulation d’évacuation EL KHOMSA – Rose Blanche | `assets/video/evacuation.mp4` ; images `rose-blanche-atelier`, `rose-blanche-rassemblement` ; mascotte |
| [activity 7479833958659215360](https://www.linkedin.com/feed/update/urn:li:activity:7479833958659215360/) | Vidéo · Safety Day Bondin | `assets/video/safety-day.mp4` ; image `safety-day-equipe` |
| [activity 7493019414590676992](https://www.linkedin.com/feed/update/urn:li:activity:7493019414590676992/) | Vidéo · formation incendie | `assets/video/incendie.mp4` ; image `incendie-terrain` |
| [activity 7501913268865765376](https://www.linkedin.com/feed/update/urn:li:activity:7501913268865765376/) | Grille d’audit « Affichage de sécurité » (55 points, 6 domaines) | citation du manifeste, section Méthode, `audit-affichage-1.webp` |
| [activity 7487442620655370240](https://www.linkedin.com/feed/update/urn:li:activity:7487442620655370240/) | Photos · formation risques en cimenterie, CJO | `cjo-formation-*.webp` |
| [activity 7489953370108215297](https://www.linkedin.com/feed/update/urn:li:activity:7489953370108215297/) | Photos · habilitation caristes, Rose Blanche | `rose-blanche-caristes-*.webp` |
| [activity 7482343089035202560](https://www.linkedin.com/feed/update/urn:li:activity:7482343089035202560/) | Photos · cycle HSE, PSI Tunisia | `psi-hse-*.webp` |
| [activity 7504174011334029312](https://www.linkedin.com/feed/update/urn:li:activity:7504174011334029312/) | Photos · formation PIC, PSI Tunisia | `psi-pic-*.webp` |
| [activity 7495427273383268352](https://www.linkedin.com/feed/update/urn:li:activity:7495427273383268352/) | Photo · formation premiers secours | `premiers-secours-1.webp` |

« PSI Tunisia » (publications LinkedIn) et « PSC » (client du portfolio) sont deux entités distinctes. Les médias PSI ne sont pas attribués à PSC.

Les photos LinkedIn sont recadrées pour retirer le bandeau de contact KeySafe placé en bas de chaque visuel. Ce bandeau a fourni les coordonnées : **+216 44 970 980 · commercial@keysafe.tn**. L’ancienne version utilisait le +216 27 764 657, trouvé dans l’indexation du site keysafe.tn, suspendu lors des recherches.

## Logo et identité

- `assets/brand/keysafe-logo-original.jpg` : logo de la page LinkedIn (200 × 200 px).
- `keysafe-logo*.png`, `keysafe-shield*.png` et `keysafe-wordmark*.png` en sont dérivés : fond transparent et version blanche (`scripts/prepare-media.py`). **Un logo vectoriel officiel (SVG ou PDF) donnera un rendu plus net.**
- Couleurs relevées sur le logo : indigo `#312682`, vert feuille `#2E8540` environ, gris `#A2A2A2`.
- Mascotte : image finale des vidéos KeySafe.

## Clients

- TESCA Tunisie : équipementier automobile (textiles techniques, composants de sièges), implanté à Grombalia ([taa.tn](https://taa.tn/fr/membres/tesca)).
- SOCOHUILE COMPANY : huiles alimentaires, Sfax ([Dun & Bradstreet](https://www.dnb.com/business-directory/company-profiles.societe_socohuile_company.5005a5cc94f9919ad823e086ca0d321f.html)).
- PSC : aucune information publique certaine, secteur à compléter.

Les noms clients sont écrits en typographie, sans reproduire leurs logos. Pour afficher les logos officiels, il faut l’accord de chaque client (voir `README.md`).

## Maquettes

`assets/mockups/*.svg` sont générées par `scripts/generate-mockups.mjs` : plaques de porte, directoires, panneaux de locaux techniques, affiches de risques par local, plans de circulation et d’évacuation (et leurs versions « avant »). Ce sont des **visuels de présentation**, pas des photos d’installations réelles ni des plans de sécurité utilisables. Les pictogrammes sont des dessins simplifiés inspirés de l’ISO 7010.

## Visuels d’ambiance

`assets/ambiance/*.webp` : illustrations générées lors de la première version du portfolio (prompts dans `_archive/v1/PROMPTS-visuels-ambiance.md`). Elles servent de couvertures aux chapitres 01 et 02, avec la mention « Visuel d’ambiance ».

Le hero de l’accueil utilise depuis le 18 septembre 2026 une illustration sur mesure créée avec ImageGen : `assets/hero/keysafe-safety-scene.webp`, avec une version 768 px pour les petits écrans. Elle représente deux professionnels et une signalétique dans un site industriel ; elle est identifiée « Illustration de mise en situation ». L’original et le prompt sont conservés dans [hero/PROMPT.md](hero/PROMPT.md). La carte TESCA superposée utilise le véritable plan fourni et ouvre son dossier.

## Polices

Archivo et Manrope, Google Fonts, licence SIL Open Font License (`assets/fonts/*-OFL.txt`).
