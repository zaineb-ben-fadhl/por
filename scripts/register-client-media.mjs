// Intègre le catalogue vérifié dans le contenu existant du portfolio.
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

// Libellé PSC demandé pour le filtre (les supports photographiés portent le logo PSI).
// Chaque marque a sa couleur dans la présentation et les filtres.
Object.assign(D.clients.find(c => c.id === 'psc'), { name: 'PSC', sector: '', city: '' });
const accents = { tesca: '#5BB8F0', psc: '#F2715A', socohuile: '#E7B84C' };
D.clients = D.clients.map(({ id, name, accent, ...rest }) => ({ id, name, accent: accents[id], ...rest }));
Object.assign(D.zones, {
  site: 'Entrée du site', circulation: 'Circulation & engins', escaliers: 'Escaliers',
  incendie: 'Incendie', secours: 'Secours & urgence', bureaux: 'Bureaux',
  manutention: 'Manutention', montecharge: 'Monte-charge', environnement: 'Environnement', hygiene: 'Hygiène'
});

const texts = {
  'tesca-services': {
    chapter: 'bureaux', before: 'tesca-bureaux',
    title: 'Sept services, une même plaque TESCA',
    need: 'Identifier chaque service administratif avec une signalétique homogène.',
    answer: 'Une gamme de plaques de porte aux couleurs TESCA : Direction, Finance, Industrialisation, Qualité, Ressources humaines, Manufacturing & Supply Chain, Achats & Supply Chain.',
    deliverables: ['Sept plaques de porte', 'Gabarit commun à tous les services', 'Identité TESCA']
  },
  'tesca-bureaux': {
    title: 'Du bureau magasinier à la direction : des repères cohérents',
    need: 'Nommer les espaces et orienter vers les services administratifs.',
    answer: 'Une plaque Bureau Magasinier, un directoire Direction générale / Finance / Ressources humaines et un gabarit d’informations pour la loge gardien.',
    deliverables: ['Plaque Bureau Magasinier', 'Directoire des services', 'Tableau d’informations, quatre emplacements A4']
  },
  'tesca-panneaux-locaux': {
    chapter: 'locaux', before: 'tesca-locaux',
    title: 'Chaque local se reconnaît de loin',
    need: 'Identifier les ateliers, laboratoires et locaux techniques au premier regard, même avant de lire le texte.',
    answer: 'Des panneaux TESCA grand format qui associent le nom du local à une illustration de ce qu’il abrite : retordage, laboratoires, local médical, compresseurs, traitement d’air, déchets dangereux et loge gardien.',
    deliverables: ['Huit panneaux d’identification illustrés', 'Nom du local lisible à distance', 'Identité TESCA']
  },
  'tesca-locaux': {
    title: 'Six espaces, une même identité visuelle',
    need: 'Repérer les ateliers, les magasins et les espaces de service au premier regard.',
    answer: 'Des plaques TESCA sobres, avec une désignation lisible : maintenance, pièces de rechange, déchets, préparation, produits chimiques et production.',
    deliverables: ['Six plaques d’identification', 'Désignation propre à chaque espace', 'Identité TESCA']
  },
  'tesca-risques': {
    title: 'Une prévention adaptée à chaque situation de travail',
    need: 'Rendre les consignes accessibles dans l’entrepôt, le laboratoire, les ateliers, les bureaux et les zones de manutention.',
    answer: 'Des supports dédiés aux risques, aux EPI et aux gestes à suivre : produits chimiques, électricité, machines en mouvement, monte-charge, secours et incendie.',
    deliverables: ['Affiches par espace et par risque', 'Supports illustrés et bilingues', 'Documents PDF consultables']
  },
  'tesca-sensibilisation': {
    title: 'Les bons réflexes s’affichent aussi au quotidien',
    need: 'Accompagner les équipes dans leurs pratiques de bureau et leurs gestes environnementaux.',
    answer: 'Une collection de supports TESCA sur l’énergie, les impressions, les réunions et le tri des déchets, avec plusieurs déclinaisons graphiques.',
    deliverables: ['Économies d’énergie et de papier', 'Bonnes pratiques de réunion', 'Tri des déchets']
  },
  'tesca-circulation': {
    title: 'L’entrepôt, ses flux et ses règles en une vue',
    need: 'Rendre les déplacements dans l’entrepôt faciles à comprendre.',
    answer: 'Une vue en volume qui montre le sens de circulation, les passages piétons et les consignes associées.',
    deliverables: ['Plan de circulation de l’entrepôt', 'Cheminements et sens de circulation', 'Légende et consignes du site']
  },
  'tesca-evacuation': {
    title: 'De l’entrepôt à l’administration, visualiser les sorties',
    need: 'Permettre de se situer et de repérer les cheminements et les moyens de secours.',
    answer: 'Deux plans distincts : l’entrepôt et l’administration, chacun avec ses repères « Vous êtes ici », sa légende et ses consignes.',
    deliverables: ['Plan de l’entrepôt', 'Plan de l’administration', 'Sorties et moyens de secours']
  },
  'psc-risques': {
    title: 'Les consignes prennent place sur le terrain',
    need: 'Mettre les messages de prévention au contact des équipes et de leur environnement de travail.',
    answer: 'Les photos montrent les supports PSI posés : atelier 1, chariots élévateurs, ergonomie, escaliers, premiers secours et incendie.',
    deliverables: ['Affiches installées', 'Consignes propres aux usages', 'Reportage photographique sur site']
  },
  'psc-circulation': {
    title: 'Le plan de circulation à l’entrée du site',
    need: 'Présenter les déplacements et rappeler les règles du site dans un même espace d’information.',
    answer: 'La photo montre le plan de circulation PSI affiché au-dessus des consignes générales de sécurité.',
    deliverables: ['Plan de circulation affiché', 'Panneau de consignes générales', 'Vue de l’installation']
  },
  'psc-evacuation': {
    title: 'Un plan d’évacuation affiché dans l’atelier n° 1',
    need: 'Donner aux équipes un repère visible pour comprendre l’évacuation de leur atelier.',
    answer: 'Le plan PSI est présenté en situation, dans son cadre, avec les cheminements, la légende et les consignes.',
    deliverables: ['Plan d’évacuation de l’atelier n° 1', 'Support encadré', 'Photo de l’installation']
  },
  'socohuile-risques': {
    title: 'De l’accueil à la production, un langage de prévention commun',
    need: 'Décliner les messages de sécurité et d’hygiène selon les usages du site SOCOHUILE.',
    answer: 'Une série de supports au nom du client : entrée du site, chariots, ergonomie, escaliers, manutention et hygiène. Un gabarit permet de renseigner les contacts d’urgence propres au site.',
    deliverables: ['Consignes générales et affiches par thème', 'Hygiène du personnel et des mains', 'PDF originaux et gabarit de contacts']
  }
};

const entry = r => {
  const { source, client, project, sha256, pdfSource, crop, lossless, ...image } = r;
  return image;
};
for (const [id, { chapter = 'risques', before, ...text }] of Object.entries(texts)) {
  let p = D.projects.find(p => p.id === id);
  if (!p) {
    p = { id, client: 'tesca', chapter };
    const at = before ? D.projects.findIndex(p => p.id === before) : D.projects.findIndex(p => p.id === 'tesca-risques') + 1;
    D.projects.splice(at, 0, p);
  }
  Object.assign(p, text, { images: catalogue.records.filter(r => r.project === id).map(entry) });
}

// Seuls les médias personnellement fournis et classés peuvent être publiés.
const supplied = new Set(catalogue.records.map(r => r.src));
D.projects = D.projects.map(p => ({ ...p, images: p.images.filter(img => supplied.has(img.src)) }))
  .filter(p => p.images.length);
D.settings.showMockupBadges = false;
delete D.settings.suppliedMediaOnly;
D.settings.verifiedMediaOnly = true;
const linkedin = JSON.parse(readFileSync(root + 'sources/linkedin-media.json', 'utf8'));
// Une vidéo rattachée à un type passe juste après l'ouverture de ce type dans la présentation.
const videoTypes = {
  exercice: { chapter: 'plans', sub: 'evacuation' },
  evacuation: { chapter: 'plans', sub: 'evacuation' },
  incendie: { chapter: 'risques', zone: 'incendie' }
};
D.videos = linkedin.videos.map(({ id, ...video }) => ({ id, ...videoTypes[id], ...video }));
D.terrain = catalogue.records.filter(r => r.kind === 'photo').map(r => ({
  src: r.src, caption: `PSC · ${r.caption}`, client: r.client, project: r.project, name: r.name
})).concat(linkedin.terrain);

D.library = [{
  id: 'signaletique-complementaire', client: 'commun', chapter: 'risques',
  title: 'Les messages essentiels, en français et en arabe',
  need: 'Identifier un danger, une interdiction ou un accès à préserver en quelques secondes.',
  answer: 'Six panneaux complémentaires associant pictogrammes et messages bilingues.',
  deliverables: ['Dangers électriques et incendie', 'Accès et issues de secours', 'Chute d’objets'],
  images: catalogue.records.filter(r => r.client === 'commun').map(entry)
}];

// Vitrine de l'accueil : des travaux marquants de chaque type, tous clients confondus.
D.hero = [
  ['tesca-services', 'plaques-services'], ['tesca-bureaux', 'direction-finance-rh'],
  ['tesca-panneaux-locaux', 'panneau-atelier-retordage'], ['tesca-panneaux-locaux', 'panneau-traitement-air'], ['tesca-panneaux-locaux', 'panneau-laboratoire-essais'],
  ['tesca-risques', 'atelier-retordage-consignes'], ['psc-risques', 'atelier-1-pose'], ['socohuile-risques', 'hygiene-personnel'], ['tesca-risques', 'consignes-chariots'],
  ['tesca-evacuation', 'evacuation-entrepot'], ['psc-evacuation', 'evacuation-atelier-1-pose'], ['tesca-circulation', 'circulation-entrepot']
].map(([project, image]) => {
  const p = D.projects.find(p => p.id === project);
  if (!p?.images.some(img => img.name === image)) throw new Error(`Vitrine : ${project}/${image} introuvable`);
  return { project, image };
});

const covers = {
  bureaux: ['tesca', 'plaques-services', 'TESCA · Plaques des sept services'],
  locaux: ['tesca', 'panneau-atelier-retordage', 'TESCA · Panneau Atelier de retordage'],
  risques: ['psc', 'atelier-1-pose', 'PSC · Affiche posée à l’atelier 1'],
  plans: ['tesca', 'evacuation-entrepot', 'TESCA · Plan d’évacuation de l’entrepôt']
};
for (const chapter of D.chapters) {
  const [client, name, caption] = covers[chapter.id];
  const r = catalogue.records.find(r => r.client === client && r.name === name);
  chapter.cover = { src: r.src, caption, contain: true };
}
const locaux = D.chapters.find(c => c.id === 'locaux');
locaux.lead = 'Ateliers, magasins, locaux techniques et espaces de service : chaque zone porte une désignation claire, cohérente avec l’identité du site. Les équipes repèrent rapidement leur destination.';
locaux.deliverables = ['Plaques de porte', 'Désignation des locaux', 'Repérage des espaces', 'Identité du site'];

const helpers = previous.slice(previous.indexOf('window.KEYSAFE_UTILS ='));
writeFileSync(file, '/* KeySafe · contenu du portfolio. Les médias fournis utilisent src, full et document.\n'
  + '   Supports fournis et médias LinkedIn conservés, sans visuels de remplacement.\n'
  + '   Catalogue et provenance : sources/imported-media.json. */\n\n'
  + 'window.KEYSAFE = ' + JSON.stringify(D, null, 2) + ';\n\n' + helpers, 'utf8');

const lines = [
  '# Classement des médias fournis', '',
  `${catalogue.sourceCount} fichiers examinés ; ${catalogue.records.length} visuels distincts intégrés. Les originaux restent dans assets/.`, '',
  'Le filtre PSC reprend le nom demandé pour le dossier. Les photographies portent le logo PSI (Pétrole Services Industriel) : nom à confirmer.', '',
  'L’image 1000021908.jpg réunit les sept plaques de services TESCA : elle est présentée en entier, puis chaque plaque est découpée pour être vue seule.', '',
  'Les six panneaux a4 sans logo restent dans une collection complémentaire sans attribution client.', '',
  'Les tableaux Loge gardien (TESCA) et Contacts d’urgence (SOCOHUILE) sont présentés comme gabarits à personnaliser.', '',
  '| Fichier fourni | Client | Dossier | Légende |', '|---|---|---|---|',
  ...catalogue.records.map(r => `| ${r.source} | ${r.client === 'commun' ? 'Non attribué' : D.clients.find(c => c.id === r.client).name} | ${r.project} | ${r.caption} |`),
  '', '## Formats associés et doublons', '',
  ...catalogue.records.filter(r => r.pdfSource).map(r => `- ${r.pdfSource} : PDF associé à ${r.source}, une seule carte dans la galerie.`),
  ...Object.entries(catalogue.duplicates).map(([duplicate, original]) => `- ${duplicate} : doublon exact de ${original}, conservé sur disque.`),
  ...Object.entries(catalogue.equivalents || {}).map(([copy, original]) => `- ${copy} : même visuel que ${original} (réexport), conservé sur disque.`),
  ...Object.entries(catalogue.replaced || {}).map(([old, current]) => `- ${old} : première version de l’affiche, remplacée par ${current} ; conservée sur disque, non affichée.`),
  '', 'Le titre de l’affiche indique « LOCAL DE RETARDAGE » alors que le panneau du local porte « Atelier de retordage » : orthographe à vérifier.',
  '', '## Vérification visuelle', '',
  'Chaque visuel a été revu : client, type et légende correspondent au support.', '',
  '## Vidéos et types dans la présentation', '',
  ...D.videos.map(v => `- ${v.context} : ${v.chapter ? D.chapters.find(c => c.id === v.chapter).short + (v.sub ? ', ' + v.sub : '') : 'sans type, section « Sur le terrain »'}.`), ''
];
writeFileSync(root + 'sources/CLASSEMENT-MEDIAS.md', lines.join('\n'), 'utf8');
console.log(`${D.projects.length} dossiers clients + ${D.library.length} collection complémentaire mis à jour.`);
