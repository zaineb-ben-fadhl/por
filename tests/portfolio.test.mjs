import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = f => readFileSync(join(ROOT, f), 'utf8');
const exists = f => existsSync(join(ROOT, f));
const CHAPTERS = ['bureaux', 'locaux', 'sst', 'urgence', 'plans'];

function loadData() {
  const sandbox = { window: {} };
  vm.runInNewContext(read('js/data.js'), sandbox);
  return { D: sandbox.window.KEYSAFE, U: sandbox.window.KEYSAFE_UTILS };
}

test('les données sont cohérentes : un seul site, cinq types', () => {
  const { D } = loadData();
  assert.deepEqual([...D.clients].map(c => c.id), ['tesca'], 'présentation personnalisée TESCA');
  assert.deepEqual([...D.chapters].map(c => c.id), CHAPTERS);
  assert.deepEqual([...D.chapters].map(c => c.number), ['01', '02', '03', '04', '05']);
  assert.deepEqual([...D.chapters].map(c => c.title), [
    'Identification des bureaux',
    'Identification des locaux techniques',
    'Affichage SST lié aux activités',
    'Affichage relatif à la maîtrise des situations d’urgence',
    'Plans de circulation et d’évacuation'
  ]);
  assert.ok(!D.videos && !D.terrain && !D.library, 'aucun contenu hors TESCA');

  const chapters = new Map(D.chapters.map(c => [c.id, c]));
  const ids = D.projects.map(p => p.id);
  assert.equal(new Set(ids).size, ids.length, 'identifiants de projet uniques');
  for (const p of D.projects) {
    assert.equal(p.client, 'tesca', `${p.id} : client inattendu`);
    assert.ok(chapters.has(p.chapter), `${p.id} : type inconnu`);
    assert.ok(p.title && p.need && p.answer && p.deliverables.length, `${p.id} : textes manquants`);
    assert.ok(p.images.length, `${p.id} : aucun visuel`);
    const chapter = chapters.get(p.chapter);
    if (chapter.subs) assert.ok(chapter.subs.some(s => s.id === p.sub), `${p.id} : sous-type manquant`);
    const names = p.images.map(i => i.name);
    assert.equal(new Set(names).size, names.length, `${p.id} : noms de visuels en double`);
    for (const img of p.images) {
      assert.ok(D.shotTypes[img.type], `${p.id}/${img.name} : consigne de prise de vue inconnue`);
      assert.ok(img.src, `${p.id}/${img.name} : aucun aperçu`);
      if (p.chapter === 'sst') assert.ok(D.zones[img.zone], `${p.id}/${img.name} : local inconnu`);
    }
  }
  for (const c of D.chapters) {
    assert.equal(c.titleLines.join(' '), c.title, `${c.id} : titre sur deux lignes incohérent`);
    assert.ok(D.projects.some(p => p.chapter === c.id), `${c.id} : aucun dossier`);
    assert.ok(c.benefit && c.benefit.length > 60, `${c.id} : phrase d’utilité manquante`);
  }
  for (const c of D.clients) assert.match(c.accent, /^#[0-9a-f]{6}$/i, `${c.id} : couleur de marque manquante`);
});

test('la répartition des supports TESCA dans les cinq types', () => {
  const { D } = loadData();
  const ids = chapter => [...D.projects].filter(p => p.chapter === chapter).map(p => p.id);
  const project = id => D.projects.find(p => p.id === id);
  assert.deepEqual(ids('bureaux'), ['tesca-services', 'tesca-bureaux']);
  assert.deepEqual(ids('locaux'), ['tesca-locaux-techniques']);
  assert.deepEqual(ids('sst'), ['tesca-sst', 'tesca-sensibilisation']);
  assert.deepEqual(ids('urgence'), ['tesca-urgence']);
  assert.deepEqual(ids('plans'), ['tesca-circulation', 'tesca-evacuation']);

  assert.equal(project('tesca-services').images.length, 8);
  assert.equal(project('tesca-bureaux').images.length, 3);
  assert.equal(project('tesca-locaux-techniques').images.length, 9, 'livraison du 23/09 : neuf panneaux');
  assert.equal(project('tesca-sst').images.length, 13);
  assert.equal(project('tesca-sensibilisation').images.length, 4);
  assert.equal(project('tesca-urgence').images.length, 6);
  assert.equal(project('tesca-evacuation').images.length, 1);
  assert.equal(D.projects.reduce((n, p) => n + p.images.length, 0), 45);
  // seuls la livraison du 23 septembre et les trois plans du site sont publiés
  const catalogue = JSON.parse(read('sources/imported-media.json'));
  // chaque recueil de la livraison alimente le type qui porte son nom
  const parType = {
    'Identification des locaux techniques.pdf': 'locaux',
    'Affichage SST lié aux activités.pdf': 'sst',
    'Affichage SST lié aux activités (2).pdf': 'sst',
    'Affichage SST lié aux activités (3).pdf': 'sst',
    'Affichage relatif à la maîtrise des situations d’urgence2.pdf': 'urgence'
  };
  for (const record of catalogue.records.filter(r => parType[r.source])) {
    const chapter = D.projects.find(p => p.id === record.project).chapter;
    assert.equal(chapter, parType[record.source], `${record.name} : type incohérent avec son recueil`);
  }

  // le plan de circulation est rattaché à la maîtrise des situations d'urgence
  assert.equal(project('tesca-circulation').chapter, 'plans');
  assert.equal(project('tesca-circulation').sub, 'circulation');
  assert.deepEqual([...project('tesca-urgence').images].map(i => i.name),
    ['consignes-generales-urgence', 'organigramme-secours', 'liste-secouristes-administration',
      'liste-secouristes-tissage', 'liste-secouristes-finition', 'liste-secouristes-qr']);
  assert.deepEqual([...project('tesca-evacuation').images].map(i => i.name), ['evacuation-administration-rdc']);
  assert.match(project('tesca-evacuation').images[0].note, /modèle similaire réalisé pour le site PSC/i);
  assert.match(project('tesca-sst').images.find(i => i.name === 'incompatibilites-chimiques').note, /SGH\/CLP/);
  assert.ok(['utilisation-extincteur', 'laboratoire-deversement', 'premiers-secours']
    .every(n => project('tesca-sst').images.some(i => i.name === n)), 'les affiches du recueil SST restent dans le type SST');
  const panneaux = project('tesca-locaux-techniques').images;
  assert.ok(panneaux.every(i => i.caption.startsWith('Panneau · ') && i.spec));
  assert.ok(panneaux.some(i => i.name === 'panneau-monte-charge'), 'panneau inédit intégré');
  assert.ok(project('tesca-sst').images.some(i => i.name === 'medecine-travail'), 'affiche inédite intégrée');
});

test('aucun support d’un autre site n’est publié', () => {
  const { D } = loadData();
  const srcs = [...D.projects.flatMap(p => p.images.flatMap(i => [i.src, i.full, i.document])), ...D.chapters.map(c => c.cover.src)];
  for (const src of srcs.filter(Boolean)) {
    assert.match(src, /^assets\/(photos|documents)\/tesca\//, `média hors TESCA : ${src}`);
  }
  assert.ok(!exists('assets/photos/psc'), 'aperçus PSI supprimés');
  assert.ok(!exists('assets/photos/socohuile'), 'aperçus SOCOHUILE supprimés');
  assert.ok(!exists('assets/documents/socohuile'), 'PDF SOCOHUILE supprimés');
  const html = read('index.html') + read('js/app.js');
  for (const mot of ['psc', 'socohuile', 'PSI']) {
    assert.ok(!html.includes(mot), `« ${mot} » encore présent dans la page`);
  }
});

test('tous les médias, aperçus et documents originaux existent', () => {
  const { D } = loadData();
  for (const p of D.projects) {
    for (const img of p.images) {
      assert.ok(exists(img.src), `visuel manquant : ${img.name}`);
      if (img.full) assert.ok(exists(img.full), `grand format manquant : ${img.full}`);
      if (img.document) {
        assert.ok(exists(img.document), `PDF manquant : ${img.document}`);
        assert.equal(readFileSync(join(ROOT, img.document)).subarray(0, 5).toString(), '%PDF-');
      }
    }
  }
  D.chapters.map(c => c.cover.src).forEach(f => assert.ok(exists(f), `couverture manquante : ${f}`));
  const html = read('index.html') + read('css/styles.css');
  for (const [, ref] of html.matchAll(/(?:src|href)="((?:assets|css|js)\/[^"#?]+)"/g)) assert.ok(exists(ref), `référence cassée : ${ref}`);
  for (const [, ref] of html.matchAll(/url\('\.\.\/([^']+)'\)/g)) assert.ok(exists(ref), `police manquante : ${ref}`);
});

test('le filtre par type et par sous-type', () => {
  const { D, U } = loadData();
  assert.equal(U.filterProjects(D.projects).length, D.projects.length);
  for (const ch of D.chapters) {
    const filtered = U.filterProjects(D.projects, { chapter: ch.id });
    assert.ok(filtered.length && filtered.every(p => p.chapter === ch.id && p.images.every(img => img.src)));
  }
  const evac = U.filterProjects(D.projects, { chapter: 'plans', sub: 'evacuation' });
  assert.deepEqual([...evac].map(p => p.id), ['tesca-evacuation']);
  const circulation = U.filterProjects(D.projects, { chapter: 'plans', sub: 'circulation' });
  assert.deepEqual([...circulation].map(p => p.id), ['tesca-circulation']);
});

test('chaque fichier fourni est classé, écarté ou identifié comme doublon', () => {
  const { D } = loadData();
  const catalogue = JSON.parse(read('sources/imported-media.json'));
  // Les fichiers fournis bruts ne sont pas versionnés (.gitignore) et peuvent être retirés du poste :
  // ce qui compte, c'est qu'aucun fichier présent ne reste sans classement.
  const sources = readdirSync(join(ROOT, 'assets')).filter(name => /\.(png|jpe?g|pdf)$/i.test(name));
  const classified = new Set(catalogue.records.flatMap(r => [r.source, ...(r.pdfSource ? [r.pdfSource] : [])]));
  for (const key of ['duplicates', 'equivalents', 'replaced']) {
    for (const source of Object.keys(catalogue[key] || {})) classified.add(source);
  }
  // Fichiers volontairement écartés (PSI, SOCOHUILE, panneaux bilingues) tant qu'ils sont sur le poste.
  const excluded = Object.entries(catalogue.excluded || {});
  for (const [source, reason] of excluded) {
    classified.add(source);
    assert.match(reason, /hors présentation TESCA/, `${source} : motif manquant`);
    assert.ok(!catalogue.records.some(r => r.source === source), `${source} : écarté mais publié`);
  }
  // Livraison déposée mais pas encore publiée : tracée avec son contenu.
  const pending = Object.entries(catalogue.pending || {});
  for (const [source, note] of pending) {
    classified.add(source);
    assert.ok(note.length > 20, `${source} : contenu non décrit`);
    assert.ok(!catalogue.records.some(r => r.source === source), `${source} : en attente mais publié`);
  }
  for (const source of sources) assert.ok(classified.has(source), `fichier non classé dans assets/ : ${source}`);
  for (const record of catalogue.records) {
    assert.equal(record.client, 'tesca');
    const project = D.projects.find(p => p.id === record.project);
    assert.ok(project, `${record.name} : dossier ${record.project} absent du site`);
    const image = project.images.find(img => img.name === record.name);
    assert.equal(image.src, record.src);
    assert.equal(image.document, record.document);
  }
});

async function openPortfolio(query = '') {
  const url = `file://${join(ROOT, 'index.html').replace(/\\/g, '/')}${query}`;
  const dom = await JSDOM.fromFile(join(ROOT, 'index.html'), {
    url,
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    beforeParse(window) {
      window.matchMedia = q => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} });
      window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
      window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
      window.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); this.dispatchEvent(new window.Event('close')); };
      window.Element.prototype.scrollIntoView = () => {};
      window.scrollTo = () => {};
    }
  });
  await new Promise(r => dom.window.addEventListener('load', r));
  return dom;
}

test('les PDF et les images fournies sont accessibles sans badge de maquette', async () => {
  const dom = await openPortfolio();
  const { document } = dom.window;
  try {
    const image = document.querySelector('#urgence [data-plan]');
    assert.ok(image, 'le type 05 propose ses supports');
    const poster = document.querySelector('#sst [data-open="tesca-sst"] img[src$="/laboratoire-securite.webp"]').closest('[data-open]');
    assert.equal(poster.querySelector('.mock-badge'), null);
    poster.click();
    assert.match(document.querySelector('[data-stage-img]').src, /laboratoire-securite-grand\.webp$/);
    const original = document.querySelector('[data-d-original]');
    assert.equal(original.hidden, false);
    assert.match(original.href, /assets\/documents\/tesca\/laboratoire-securite\.pdf$/);
    assert.equal(document.querySelector('[data-d-note]').hidden, true);
    document.querySelector('[data-stage]').click();
    assert.ok(document.querySelector('[data-viewer]').hasAttribute('open'), 'le visuel s’ouvre en grand');
    assert.equal(document.querySelector('[data-viewer-pdf]').hidden, false);
    document.querySelector('[data-viewer-close]').click();
    document.querySelector('[data-dossier]').close();
    assert.equal(document.querySelector('.supplementary'), null, 'plus de collection complémentaire');
  } finally { dom.window.close(); }
});

test('le portfolio se construit autour des cinq types', async () => {
  const dom = await openPortfolio();
  const { document } = dom.window;
  const { D } = loadData();
  try {
    assert.equal(document.querySelectorAll('.chapter').length, 5);
    assert.equal(document.querySelectorAll('.type-card').length, 5);
    assert.equal(document.querySelectorAll('.chapter-benefit').length, 5, 'une phrase d’utilité par type');
    assert.ok(document.querySelector('.site-shot img').getAttribute('src').endsWith('tesca-facade.webp'), 'photo du site TESCA');
    assert.equal(document.querySelector('[data-set-client]'), null, 'plus de filtre client');
    assert.equal(Number(document.querySelector('[data-stat="visuals"]').textContent),
      D.projects.reduce((n, p) => n + p.images.length, 0));
    assert.equal(Number(document.querySelector('[data-stat="identification"]').textContent), 11 + 9);
    assert.deepEqual([...document.querySelectorAll('[data-dock-chapters] a')].map(a => a.dataset.chapter), CHAPTERS);

    assert.match(document.querySelector('[data-scope="locaux"]').textContent, /Dossier TESCA/);
    assert.equal(document.querySelectorAll('#bureaux .door').length, 11);
    assert.equal(document.querySelectorAll('#locaux .spec').length, 9);
    assert.equal(document.querySelectorAll('#urgence [data-plan]').length, 6, 'consignes, organigramme, listes et QR code');

    document.querySelector('[data-view="magazine"][data-for="sst"]').click();
    assert.equal(document.querySelectorAll('#sst .spread').length, 2);
    document.querySelector('[data-view="gallery"][data-for="sst"]').click();
    document.querySelector('[data-zone="laboratoire"]').click();
    assert.equal(document.querySelectorAll('#sst .poster').length, 3, 'consignes, EPI et déversement du laboratoire');

    // type 05 : circulation par défaut, puis évacuation
    assert.equal(document.querySelectorAll('#plans [data-plan]').length, 1, 'le plan de circulation du site TTG');
    assert.match(document.querySelector('#plans .compare-meta small').textContent, /Circulation/);
    assert.match(document.querySelector('#plans .compare > img').src, /circulation-site-ttg/);
    document.querySelector('#plans [data-sub="evacuation"]').click();
    assert.match(document.querySelector('#plans .compare-meta small').textContent, /Évacuation/);
    assert.equal(document.querySelector('#plans [data-compare-range]'), null, 'aucun faux avant/après ajouté aux vrais plans');
    assert.match(document.querySelector('#plans .compare > img').src, /evacuation-administration-rdc/);

    document.querySelector('#bureaux [data-open]').click();
    const dossier = document.querySelector('[data-dossier]');
    assert.ok(dossier.hasAttribute('open'));
    assert.equal(document.querySelector('[data-d-client]').textContent, 'TESCA · Industrie automobile · Grombalia');
    assert.equal(document.querySelectorAll('[data-thumb]').length, 8);
    document.querySelector('[data-stage-next]').click();
    assert.equal(document.querySelector('[data-thumb][aria-current="true"]').dataset.thumb, '1');
    dossier.close();
  } finally {
    dom.window.close();
  }
});

test('présentation : chaque type, puis tous ses supports', async () => {
  const dom = await openPortfolio();
  const { document, KeyboardEvent } = dom.window;
  const { D } = loadData();
  const catalogue = JSON.parse(read('sources/imported-media.json'));
  const allowed = new Set([
    ...catalogue.records.flatMap(r => [r.src, r.full]),
    'assets/brand/keysafe-logo-white.png', 'assets/brand/keysafe-shield-white.png'
  ]);
  const current = () => document.querySelector('.slide.is-current');
  const deck = document.querySelector('[data-deck]');
  const key = k => deck.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
  try {
    document.querySelector('[data-action="present"]').click();
    assert.equal(document.querySelector('[data-deck-brands]'), null, 'plus de filtre par marque');
    const seen = [];
    document.querySelector('[data-deck-home]').click();
    for (;;) {
      const slide = current();
      seen.push({ ...slide.dataset });
      for (const media of slide.querySelectorAll('img[src]')) {
        assert.ok(allowed.has(media.getAttribute('src')), `média non fourni : ${media.getAttribute('src')}`);
      }
      const next = document.querySelector('[data-deck-next]');
      if (next.disabled) break;
      next.click();
    }
    const works = seen.filter(s => s.kind === 'work');
    assert.equal(works.length, catalogue.records.length, 'tous les supports fournis sont présentés');
    assert.equal(new Set(works.map(w => w.project + '/' + w.image)).size, catalogue.records.length);
    assert.deepEqual(seen.filter(s => s.kind === 'type').map(s => s.chapter), CHAPTERS);
    assert.equal(seen[0].kind, 'cover');
    assert.equal(seen[seen.length - 1].kind, 'contact');
    for (const c of D.chapters) {
      const own = seen.map((s, i) => ({ ...s, i })).filter(s => s.chapter === c.id);
      assert.equal(own[0].kind, 'type', `${c.id} commence par son ouverture`);
      assert.ok(own.slice(1).every(s => s.kind === 'work'), `${c.id} : puis les supports`);
      assert.equal(own[own.length - 1].i - own[0].i + 1, own.length, `${c.id} : diapositives regroupées`);
    }

    key('4');
    assert.deepEqual([current().dataset.kind, current().dataset.chapter], ['type', 'urgence']);
    document.querySelector('[data-deck-next]').click();
    assert.equal(current().dataset.project, 'tesca-urgence', 'les listes de secouristes ouvrent le type 04');
    document.querySelector('[data-deck-rail] [data-deck-type="plans"]').click();
    assert.equal(current().dataset.chapter, 'plans');
    deck.close();
  } finally { dom.window.close(); }
});

test('images entières : jamais recadrées, et visibles en taille réelle', async () => {
  const css = read('css/styles.css');
  assert.match(css, /\.media img, \.chapter-cover-frame img[^{]*\{ object-fit: contain !important;/, 'aucun visuel recadré');
  assert.doesNotMatch(css, /\.s-collage/, 'plus de cartes superposées dans la présentation');
  const dom = await openPortfolio();
  const { document, KeyboardEvent } = dom.window;
  const viewer = document.querySelector('[data-viewer]');
  const count = () => document.querySelector('[data-viewer-count]').textContent;
  try {
    document.querySelector('#bureaux [data-open="tesca-services"][data-index="3"]').click();
    document.querySelector('[data-stage]').click();
    assert.ok(viewer.hasAttribute('open'));
    assert.match(document.querySelector('[data-viewer-img]').src, /plaque-industrialisation-grand\.webp$/);
    assert.equal(count(), '4 / 8');
    document.querySelector('[data-viewer-next]').click();
    assert.match(document.querySelector('[data-viewer-img]').src, /plaque-qualite-grand\.webp$/);
    document.querySelector('[data-viewer-mode]').click();
    assert.ok(viewer.classList.contains('is-real'), 'taille réelle');
    viewer.dispatchEvent(new KeyboardEvent('keydown', { key: '-', bubbles: true }));
    assert.ok(!viewer.classList.contains('is-real'), 'retour à l’écran');
    document.querySelector('[data-viewer-close]').click();
    assert.equal(document.querySelector('[data-d-counter]').textContent, '5 / 8', 'le dossier suit la visionneuse');
    document.querySelector('[data-dossier]').close();

    document.querySelector('[data-action="present"]').click();
    document.querySelector('[data-deck-rail] [data-deck-type="bureaux"]').click();
    const mosaic = document.querySelectorAll('.slide.is-current .s-mosaic button');
    assert.equal(mosaic.length, 6);
    mosaic[1].click();
    const current = () => document.querySelector('.slide.is-current');
    assert.equal(current().dataset.image, 'plaque-finance');
    current().querySelector('.s-real').click();
    assert.ok(viewer.hasAttribute('open'));
    assert.equal(count(), '3 / 11');
    document.querySelector('[data-viewer-next]').click();
    document.querySelector('[data-viewer-close]').click();
    assert.equal(current().dataset.image, 'plaque-industrialisation', 'la présentation suit la visionneuse');
    assert.ok(current().querySelector(':scope > .s-strip'), 'bande des supports sous le visuel, sur une ligne');
  } finally { dom.window.close(); }
});

test('accueil : la vitrine montre les vrais supports TESCA, type par type', async () => {
  const { D } = loadData();
  let dom = await openPortfolio();
  let { document } = dom.window;
  const title = () => document.querySelector('[data-hero-title]').textContent;
  try {
    assert.equal(document.querySelector('.hero-scene'), null, 'plus d’illustration générique dans l’accueil');
    const slides = [...document.querySelectorAll('.hero-stage img')];
    assert.equal(slides.length, D.hero.length);
    assert.ok(slides.every(img => img.getAttribute('src').startsWith('assets/photos/tesca/')), 'uniquement des supports TESCA');
    assert.ok(slides[0].classList.contains('is-active'));
    assert.deepEqual([...document.querySelectorAll('[data-hero-type]')].map(b => b.textContent.replace(/^\d+/, '')),
      ['Bureaux', 'Locaux', 'SST', 'Urgence', 'Plans']);
    assert.equal(title(), 'Gamme de plaques · Sept services TESCA');
    document.querySelector('[data-hero-type="plans"]').click();
    assert.equal(title(), 'Plan de circulation · Site TTG');
    assert.equal(document.querySelector('[data-hero-type="plans"]').getAttribute('aria-current'), 'true');
    document.querySelector('[data-hero-stage]').click();
    assert.ok(document.querySelector('[data-viewer]').hasAttribute('open'), 'le support s’ouvre en grand');
    assert.equal(document.querySelector('[data-viewer-brand]').textContent, 'TESCA');
    document.querySelector('[data-viewer-close]').click();
    document.querySelector('[data-hero-open]').click();
    assert.ok(document.querySelector('[data-dossier]').hasAttribute('open'));
    document.querySelector('[data-dossier]').close();
  } finally { dom.window.close(); }

  dom = await openPortfolio('?pour=Soci%C3%A9t%C3%A9%20Demo');
  ({ document } = dom.window);
  try {
    assert.equal(document.querySelector('[data-hero-label]').textContent, 'Sélection préparée pour Société Demo');
  } finally { dom.window.close(); }
});

test('lien personnalisé pour un prospect', async () => {
  const dom = await openPortfolio('?pour=Soci%C3%A9t%C3%A9%20%3Cb%3EDemo%3C%2Fb%3E');
  const { document } = dom.window;
  try {
    const chip = document.querySelector('[data-prepared]');
    assert.equal(chip.hidden, false);
    assert.equal(document.querySelector('[data-prepared-name]').textContent, 'Société <b>Demo</b>', 'le nom est affiché comme texte');
    assert.equal(document.querySelector('[data-prepared-name] b'), null);
    assert.equal(document.querySelector('#f-company').value, 'Société <b>Demo</b>');
    for (const id of CHAPTERS) assert.equal(document.querySelector(`#${id}`).hidden, false, `${id} affiché`);
  } finally {
    dom.window.close();
  }
});

test('formulaire : validation et demande préparée', async () => {
  const dom = await openPortfolio();
  const { document } = dom.window;
  try {
    const form = document.querySelector('[data-form]');
    form.dispatchEvent(new dom.window.Event('submit', { cancelable: true }));
    assert.equal(document.querySelector('[data-form-error]').hidden, false);
    const set = (name, v) => { form.elements.namedItem(name).value = v; };
    set('name', 'Amel Ben Salah');
    set('company', 'Exemple SA');
    set('email', 'amel@exemple.tn');
    set('message', 'Deux bâtiments, 3 500 m².');
    form.dispatchEvent(new dom.window.Event('submit', { cancelable: true }));
    assert.equal(document.querySelector('[data-form-error]').hidden, true);
    const preview = document.querySelector('[data-form-preview]').value;
    assert.match(preview, /Objet : Demande KeySafe · Exemple SA/);
    assert.match(preview, /Audit de l’affichage de sécurité/);
  } finally {
    dom.window.close();
  }
});
