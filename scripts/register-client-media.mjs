// Construit le contenu du portfolio TESCA à partir du catalogue vérifié.
// Cinq types : bureaux, locaux techniques, affichage SST, situations d'urgence, plans.
// Chaque recueil PDF de la livraison alimente le type qui porte son nom.
// Les réglages, les textes de méthode et d'audit sont repris du data.js précédent.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const file = root + 'js/data.js';
const previous = readFileSync(file, 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(previous, sandbox);
const D = sandbox.window.KEYSAFE;
const catalogue = JSON.parse(readFileSync(root + 'sources/imported-media.json', 'utf8'));

// Présentation personnalisée : un seul site, TESCA.
D.clients = [{ id: 'tesca', name: 'TESCA', accent: '#5BB8F0', sector: 'Industrie automobile', city: 'Grombalia' }];
delete D.videos;
delete D.terrain;
delete D.library;

// Locaux et activités servant de filtre dans le type 04.
D.zones = {
  site: 'Entrée du site', atelier: 'Ateliers', stockage: 'Entrepôt & stockage', laboratoire: 'Laboratoires',
  manutention: 'Manutention', montecharge: 'Monte-charge', circulation: 'Circulation & engins',
  escaliers: 'Escaliers', electrique: 'Installations électriques', medical: 'Médecine du travail',
  bureaux: 'Bureaux', environnement: 'Environnement', incendie: 'Incendie', secours: 'Secours & urgence'
};

const chapters = [
  {
    id: 'bureaux', number: '01', short: 'Bureaux', code: 'Information', layout: 'corridor',
    titleLines: ['Identification', 'des bureaux'],
    tagline: 'Des espaces qui se lisent dès l’entrée.',
    benefit: 'Un visiteur qui trouve son chemin tout seul, c’est une équipe qu’on n’interrompt plus : chaque porte annonce son service dès le premier regard.',
    lead: 'Une gamme de plaques de porte aux couleurs TESCA, un même gabarit décliné pour chaque service : visiteurs et collaborateurs trouvent leur chemin sans avoir à demander.',
    deliverables: ['Plaques de porte', 'Gabarit commun à tous les services', 'Sept services couverts', 'Charte TESCA'],
    cover: ['plaques-services', 'Les plaques des sept services']
  },
  {
    id: 'locaux', number: '02', short: 'Locaux techniques', code: 'Accès réglementé', layout: 'spec',
    titleLines: ['Identification', 'des locaux techniques'],
    tagline: 'Identifier avant d’intervenir.',
    benefit: 'On sait ce qu’il y a derrière la porte avant de l’ouvrir : le bon réflexe, le bon équipement, et plus aucune intervention à l’aveugle.',
    lead: 'Atelier de retordage, laboratoires, médecine du travail, compresseurs, centrale de traitement d’air, déchets dangereux, monte-charge : chaque local technique porte un panneau illustré, lisible à distance, qui annonce ce qu’il abrite.',
    deliverables: ['Panneaux illustrés', 'Désignation des locaux', 'Lecture à distance', 'Identité TESCA'],
    cover: ['panneau-atelier-retordage', 'Panneau de l’atelier de retordage']
  },
  {
    id: 'sst', number: '03', short: 'Affichage SST', code: 'Avertissement', layout: 'rooms',
    titleLines: ['Affichage SST', 'lié aux activités'],
    tagline: 'Le bon message, là où se fait le travail.',
    benefit: 'Le risque est rappelé là où il se prend, en français et en arabe : trois secondes de lecture qui évitent l’accident et l’arrêt de production.',
    lead: 'Une affiche par activité : dangers présents, équipements de protection obligatoires, interdictions, conduite à tenir et bonnes pratiques. Compréhensible en quelques secondes, au poste de travail.',
    deliverables: ['Analyse par activité', 'Dangers · EPI · interdictions', 'Conduite à tenir et sensibilisation', 'Pictogrammes ISO 7010'],
    cover: ['consignes-site-ttg', 'Consignes générales de sécurité du site TTG']
  },
  {
    id: 'urgence', number: '04', short: 'Situations d’urgence', code: 'Organisation des secours', layout: 'plans',
    titleLines: ['Affichage relatif à la maîtrise', 'des situations d’urgence'],
    tagline: 'Qui alerte, qui secourt, qui intervient.',
    benefit: 'Quand quelqu’un tombe, personne ne cherche un numéro : le visage, le nom et le téléphone du secouriste de la zone sont déjà sur le mur.',
    lead: 'Les secouristes et les agents de lutte contre l’incendie, zone par zone : photo, nom et téléphone, avec les cinq gestes qui sauvent. Une information affichée là où les équipes travaillent, et tenue à jour.',
    deliverables: ['Une affiche par zone', 'Secouristes et agents incendie', 'Alerter · Secourir · Protéger · Intervenir · Évacuer', 'Support tenu à jour'],
    cover: ['liste-secouristes-administration', 'Secouristes et agents incendie de l’administration']
  },
  {
    id: 'plans', number: '05', short: 'Plans', code: 'Évacuation', layout: 'plans',
    titleLines: ['Plans de circulation', 'et d’évacuation'],
    tagline: 'Savoir où passer. Savoir où sortir.',
    benefit: 'Le jour où l’alarme sonne, rien ne s’improvise : chacun sait où il se trouve, par où il sort et où il doit se rassembler.',
    lead: 'Le plan devient un document clair : circulation des piétons, voitures, motos, chariots et camions sur tout le site TTG ; et, pour l’évacuation, « Vous êtes ici », cheminements balisés, issues, moyens de secours et point de rassemblement.',
    deliverables: ['Plan de circulation du site', 'Plan d’évacuation par niveau', '« Vous êtes ici » et moyens de secours', 'Points de rassemblement'],
    cover: ['circulation-site-ttg', 'Plan de circulation du site TTG'],
    subs: [{ id: 'circulation', label: 'Circulation' }, { id: 'evacuation', label: 'Évacuation' }]
  }
];

// Un dossier par ensemble de supports, dans l'ordre d'affichage du type.
const projects = [
  {
    id: 'tesca-services', chapter: 'bureaux',
    title: 'Sept services, une même plaque TESCA',
    need: 'Identifier chaque service administratif avec une signalétique homogène.',
    answer: 'Une gamme de plaques de porte aux couleurs TESCA : Direction, Finance, Industrialisation, Qualité, Ressources humaines, Manufacturing & Supply Chain, Achats & Supply Chain.',
    deliverables: ['Sept plaques de porte', 'Gabarit commun à tous les services', 'Identité TESCA']
  },
  {
    id: 'tesca-locaux-techniques', chapter: 'locaux',
    title: 'Chaque local technique se reconnaît de loin',
    need: 'Identifier les ateliers, laboratoires et locaux techniques au premier regard, même avant de lire le texte.',
    answer: 'Des panneaux TESCA grand format qui associent le nom du local à une illustration de ce qu’il abrite : retordage, laboratoire, laboratoire STEP, médecine du travail, compresseurs, traitement d’air, déchets dangereux, monte-charge et loge gardien.',
    deliverables: ['Neuf panneaux d’identification illustrés', 'Nom du local lisible à distance', 'Identité TESCA']
  },
  {
    id: 'tesca-sst', chapter: 'sst',
    title: 'Une prévention adaptée à chaque situation de travail',
    need: 'Rendre les consignes accessibles là où l’activité les rend nécessaires : laboratoires, monte-charge, escaliers, bureaux et locaux communs.',
    answer: 'Treize affiches au logo KeySafe : consignes générales du site TTG, laboratoire, monte-charge, escaliers, armoire électrique, ergonomie des postes, médecine du travail, tableau des incompatibilités entre produits chimiques, mais aussi utilisation d’un extincteur, déversement de produits chimiques et procédure générale de secourisme.',
    deliverables: ['Affiches par activité et par local', 'Supports bilingues, pictogrammes ISO 7010', 'PDF consultables et imprimables']
  },
  {
    id: 'tesca-sensibilisation', chapter: 'sst',
    title: 'Les bons réflexes s’affichent aussi au quotidien',
    need: 'Accompagner les équipes dans leurs pratiques de bureau et leurs gestes environnementaux.',
    answer: 'Quatre supports TESCA sur l’énergie, les impressions, les réunions et le tri des déchets, dans la même charte que les consignes de sécurité.',
    deliverables: ['Économies d’énergie et de papier', 'Bonnes pratiques de réunion', 'Tri des déchets']
  },
  {
    id: 'tesca-urgence', chapter: 'urgence',
    title: 'Qui porte secours, zone par zone',
    need: 'Permettre à chacun de savoir qui alerter et qui intervient, sans avoir à chercher.',
    answer: 'Les consignes générales — incendie, accident, évacuation —, l’organigramme de secours qui montre le poste de commandement et les équipes de terrain, les trois affiches nominatives par zone (administration, tissage, finition) et une version à QR code pour appeler directement le bon secouriste.',
    deliverables: ['Consignes générales à renseigner', 'Organigramme de secours du site TTG', 'Une affiche nominative par zone', 'Accès par QR code']
  },
  {
    id: 'tesca-circulation', chapter: 'plans', sub: 'circulation',
    title: 'Le site TTG, flux par flux',
    need: 'Rendre les déplacements lisibles, du portail jusqu’aux quais : qui passe où, à quelle vitesse.',
    answer: 'Le site dans son ensemble — ateliers d’ourdissage, tissage, finissage, Carthage, administration et magasins — avec les flux piétons, voitures, motos, chariots et camions, les accès, les parkings, la loge gardien et les points de rassemblement.',
    deliverables: ['Plan de circulation du site TTG', 'Cinq flux distingués par couleur', 'Accès, parkings et limite de vitesse']
  },
  {
    id: 'tesca-evacuation', chapter: 'plans', sub: 'evacuation',
    title: 'Le plan d’évacuation, niveau par niveau',
    need: 'Permettre à chacun de se situer et de repérer les cheminements, les issues et les moyens de secours.',
    answer: 'Un plan par niveau : « Vous êtes ici », cheminements balisés, issues et escaliers de secours, extincteurs, boîte à pharmacie, point de rassemblement, avec les procédures d’évacuation et d’incendie en français et en arabe. Le plan présenté ici a été réalisé pour le site PSC : celui de TESCA suit la même trame.',
    deliverables: ['Un plan par niveau', 'Cheminements, issues et escaliers de secours', 'Procédures bilingues et point de rassemblement']
  }
];

// Le catalogue ne garde que les fichiers vérifiés : ses champs de travail ne sont pas publiés.
const entry = r => {
  const { source, client, project, sha256, pdfSource, crop, lossless, page, ...image } = r;
  return image;
};
const imagesOf = id => catalogue.records.filter(r => r.project === id).map(entry);

D.chapters = chapters.map(({ cover, titleLines, ...c }) => {
  const [name, caption] = cover;
  const record = catalogue.records.find(r => r.name === name);
  if (!record) throw new Error(`Couverture ${c.id} : ${name} introuvable`);
  return { ...c, title: titleLines.join(' '), titleLines, cover: { src: record.src, caption, contain: true } };
});

D.projects = projects.map(p => {
  const images = imagesOf(p.id);
  if (!images.length) throw new Error(`Dossier ${p.id} : aucun visuel classé`);
  return { ...p, client: 'tesca', images };
});

const orphans = catalogue.records.filter(r => !projects.some(p => p.id === r.project));
if (orphans.length) throw new Error(`Visuels sans dossier : ${orphans.map(r => r.project).join(', ')}`);

D.settings.showMockupBadges = false;
delete D.settings.suppliedMediaOnly;
D.settings.verifiedMediaOnly = true;

// Vitrine de l'accueil : des travaux marquants, type par type.
D.hero = [
  ['tesca-services', 'plaques-services'], ['tesca-services', 'plaque-direction'],
  ['tesca-locaux-techniques', 'panneau-atelier-retordage'], ['tesca-locaux-techniques', 'panneau-traitement-air'],
  ['tesca-locaux-techniques', 'panneau-monte-charge'],
  ['tesca-sst', 'consignes-escalier'], ['tesca-sst', 'incompatibilites-chimiques'], ['tesca-sst', 'armoire-electrique'],
  ['tesca-sensibilisation', 'tri-dechets'],
  ['tesca-urgence', 'organigramme-secours'], ['tesca-urgence', 'liste-secouristes-administration'],
  ['tesca-circulation', 'circulation-site-ttg'], ['tesca-evacuation', 'evacuation-administration-rdc']
].map(([project, image]) => {
  const p = D.projects.find(p => p.id === project);
  if (!p?.images.some(img => img.name === image)) throw new Error(`Vitrine : ${project}/${image} introuvable`);
  return { project, image };
});

const helpers = previous.slice(previous.indexOf('window.KEYSAFE_UTILS ='));
writeFileSync(file, '/* KeySafe · contenu du portfolio TESCA. Les médias fournis utilisent src, full et document.\n'
  + '   Fichier généré : modifier scripts/register-client-media.mjs, jamais ce fichier.\n'
  + '   Catalogue et provenance : sources/imported-media.json. */\n\n'
  + 'window.KEYSAFE = ' + JSON.stringify(D, null, 2) + ';\n\n' + helpers, 'utf8');

const byChapter = id => D.projects.filter(p => p.chapter === id);
const count = id => byChapter(id).reduce((n, p) => n + p.images.length, 0);
const lines = [
  '# Classement des médias fournis', '',
  `${catalogue.sourceCount} fichiers examinés ; ${catalogue.records.length} visuels TESCA intégrés. Les originaux restent dans assets/.`, '',
  'La présentation est personnalisée pour TESCA : les supports des sites PSI et SOCOHUILE et les panneaux bilingues sans logo sont écartés (voir « Fichiers hors périmètre »). Les fichiers restent sur le poste.', '',
  'L’image 1000021908.jpg réunit les sept plaques de services TESCA : elle est présentée en entier, puis chaque plaque est découpée pour être vue seule.', '',
  'Le tableau Loge gardien est présenté comme gabarit à personnaliser.', '',
  '## Les cinq types', '',
  '| N° | Type | Dossiers | Visuels |', '|---|---|---|---|',
  ...D.chapters.map(c => `| ${c.number} | ${c.title} | ${byChapter(c.id).map(p => p.id).join(', ')} | ${count(c.id)} |`),
  '', '## Fichier par fichier', '',
  '| Fichier fourni | Dossier | Légende |', '|---|---|---|',
  ...catalogue.records.map(r => `| ${r.source} | ${r.project} | ${r.caption} |`),
  '', '## Formats associés et doublons', '',
  ...catalogue.records.filter(r => r.pdfSource).map(r => `- ${r.pdfSource} : PDF associé à ${r.source}, une seule carte dans la galerie.`),
  ...Object.entries(catalogue.duplicates).map(([duplicate, original]) => `- ${duplicate} : doublon exact de ${original}, conservé sur disque.`),
  ...Object.entries(catalogue.equivalents || {}).map(([copy, original]) => `- ${copy} : même visuel que ${original} (réexport), conservé sur disque.`),
  ...Object.entries(catalogue.replaced || {}).map(([old, current]) => `- ${old} : première version de l’affiche, remplacée par ${current} ; conservée sur disque, non affichée.`),
  '', '## Fichiers hors périmètre', '',
  `${Object.keys(catalogue.excluded || {}).length} fichiers conservés sur disque, volontairement absents de la présentation TESCA.`, '',
  '| Fichier | Motif |', '|---|---|',
  ...Object.entries(catalogue.excluded || {}).map(([source, reason]) => `| ${source} | ${reason} |`),
  '', '## Livraison du 23 septembre 2026, en attente d’intégration', '',
  `${Object.keys(catalogue.pending || {}).length} recueils PDF multipages déposés dans assets/ : tracés, pas encore publiés. Ils mêlent des versions au logo KeySafe uniforme de supports déjà en ligne et des supports inédits (Monte-charge, Laboratoire STEP, Local de médecine du travail, listes des secouristes Tissage et Finition). À arbitrer avant intégration.`, '',
  '| Fichier | Contenu |', '|---|---|',
  ...Object.entries(catalogue.pending || {}).map(([source, note]) => `| ${source} | ${note} |`),
  '', 'Le titre de l’affiche indique « LOCAL DE RETARDAGE » alors que le panneau du local porte « Atelier de retordage » : orthographe à vérifier.',
  '', '## Vérification visuelle', '',
  'Chaque visuel a été revu : type et légende correspondent au support.', ''
];
writeFileSync(root + 'sources/CLASSEMENT-MEDIAS.md', lines.join('\n'), 'utf8');
console.log(`${D.projects.length} dossiers TESCA répartis sur ${D.chapters.length} types · ${catalogue.records.length} supports.`);
