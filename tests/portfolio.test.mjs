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

function loadData() {
  const sandbox = { window: {} };
  vm.runInNewContext(read('js/data.js'), sandbox);
  return { D: sandbox.window.KEYSAFE, U: sandbox.window.KEYSAFE_UTILS };
}

test('les données sont cohérentes', () => {
  const { D } = loadData();
  const clients = new Set(D.clients.map(c => c.id));
  const chapters = new Map(D.chapters.map(c => [c.id, c]));
  const ids = D.projects.map(p => p.id);
  assert.equal(new Set(ids).size, ids.length, 'identifiants de projet uniques');
  for (const p of D.projects) {
    assert.ok(clients.has(p.client), `${p.id} : client inconnu`);
    assert.ok(chapters.has(p.chapter), `${p.id} : chapitre inconnu`);
    assert.ok(p.title && p.need && p.answer && p.deliverables.length, `${p.id} : textes manquants`);
    assert.ok(p.images.length, `${p.id} : aucun visuel`);
    const chapter = chapters.get(p.chapter);
    if (chapter.subs) assert.ok(chapter.subs.some(s => s.id === p.sub), `${p.id} : type de plan manquant`);
    const names = p.images.map(i => i.name);
    assert.equal(new Set(names).size, names.length, `${p.id} : noms de visuels en double`);
    for (const img of p.images) {
      assert.ok(D.shotTypes[img.type], `${p.id}/${img.name} : consigne de prise de vue inconnue`);
      if (p.chapter === 'risques') assert.ok(D.zones[img.zone], `${p.id}/${img.name} : local inconnu`);
    }
  }
  for (const c of D.chapters) {
    assert.equal(c.titleLines.join(' '), c.title, `${c.id} : titre sur deux lignes incohérent`);
  }
  for (const c of D.clients) assert.match(c.accent, /^#[0-9a-f]{6}$/i, `${c.id} : couleur de marque manquante`);
  for (const v of D.videos.filter(v => v.chapter)) {
    const chapter = chapters.get(v.chapter);
    assert.ok(chapter, `${v.id} : type inconnu`);
    if (v.sub) assert.ok(chapter.subs.some(s => s.id === v.sub), `${v.id} : sous-type inconnu`);
  }
});

test('tous les médias, aperçus et documents originaux existent', () => {
  const { D, U } = loadData();
  for (const p of [...D.projects, ...(D.library || [])]) {
    for (const img of p.images) {
      assert.ok(exists(img.src || U.mockupPath(p.client, img.name)), `visuel manquant : ${img.name}`);
      if (img.full) assert.ok(exists(img.full), `grand format manquant : ${img.full}`);
      if (img.document) {
        assert.ok(exists(img.document), `PDF manquant : ${img.document}`);
        assert.equal(readFileSync(join(ROOT, img.document)).subarray(0, 5).toString(), '%PDF-');
      }
      if (img.before) assert.ok(exists(U.mockupPath(p.client, img.before)), `maquette « avant » manquante : ${img.before}`);
    }
  }
  const media = [
    ...D.chapters.map(c => c.cover.src),
    ...D.videos.flatMap(v => [v.src, v.preview, v.poster]),
    ...D.terrain.map(t => t.src)
  ];
  media.forEach(f => assert.ok(exists(f), `fichier manquant : ${f}`));
  const html = read('index.html') + read('css/styles.css');
  for (const [, ref] of html.matchAll(/(?:src|href)="((?:assets|css|js)\/[^"#?]+)"/g)) assert.ok(exists(ref), `référence cassée : ${ref}`);
  for (const [, ref] of html.matchAll(/url\('\.\.\/([^']+)'\)/g)) assert.ok(exists(ref), `police manquante : ${ref}`);
});

test('le filtre par client et par chapitre', () => {
  const { D, U } = loadData();
  assert.equal(U.filterProjects(D.projects).length, D.projects.length);
  for (const c of D.clients) {
    const own = U.filterProjects(D.projects, { client: c.id });
    assert.ok(own.length > 0 && own.every(p => p.client === c.id));
    for (const ch of D.chapters) {
      const filtered = U.filterProjects(D.projects, { client: c.id, chapter: ch.id });
      assert.ok(filtered.every(p => p.client === c.id && p.chapter === ch.id && p.images.every(img => img.src)));
    }
  }
  const evac = U.filterProjects(D.projects, { chapter: 'plans', sub: 'evacuation' });
  assert.ok(evac.length && evac.every(p => p.sub === 'evacuation'));
});

test('chaque fichier fourni est classé, associé ou identifié comme doublon', () => {
  const { D } = loadData();
  const catalogue = JSON.parse(read('sources/imported-media.json'));
  const sources = readdirSync(join(ROOT, 'assets')).filter(name => /\.(png|jpe?g|pdf)$/i.test(name));
  // Les fichiers fournis bruts ne sont pas versionnés (.gitignore) : on les vérifie quand ils sont là.
  const hasOriginals = sources.length > 0;
  const classified = new Set(catalogue.records.flatMap(r => [r.source, ...(r.pdfSource ? [r.pdfSource] : [])]));
  for (const [duplicate, original] of Object.entries(catalogue.duplicates)) {
    classified.add(duplicate);
    if (hasOriginals) assert.deepEqual(readFileSync(join(ROOT, 'assets', duplicate)), readFileSync(join(ROOT, 'assets', original)));
  }
  for (const [copy, original] of Object.entries(catalogue.equivalents || {})) {
    classified.add(copy);
    if (hasOriginals) assert.ok(sources.includes(original), `${copy} : original ${original} introuvable`);
  }
  for (const [old, current] of Object.entries(catalogue.replaced || {})) {
    classified.add(old);
    assert.ok(catalogue.records.some(r => r.source === current), `${old} : version corrigée ${current} non classée`);
  }
  if (hasOriginals) assert.deepEqual([...classified].sort(), sources.sort());
  const projects = [...D.projects, ...D.library];
  for (const record of catalogue.records) {
    const project = projects.find(p => p.id === record.project);
    assert.equal(project.client, record.client);
    const image = project.images.find(img => img.name === record.name);
    assert.equal(image.src, record.src);
    assert.equal(image.document, record.document);
  }
  assert.equal(D.projects.find(p => p.id === 'tesca-locaux').images.length, 6);
  assert.equal(D.projects.find(p => p.id === 'tesca-evacuation').images.length, 2);
  assert.equal(D.projects.find(p => p.id === 'psc-risques').images.filter(img => img.kind === 'photo').length, 6);
  assert.equal(D.library[0].images.length, 6, 'panneaux sans marque conservés hors des dossiers clients');
});

test('livraison du 18 septembre : plaques, panneaux de locaux et affiche TESCA', () => {
  const { D } = loadData();
  const ids = chapter => [...D.projects.filter(p => p.chapter === chapter).map(p => p.id)];
  assert.deepEqual(ids('bureaux'), ['tesca-services', 'tesca-bureaux'], 'les nouvelles plaques passent en premier, les anciens supports restent');
  assert.deepEqual(ids('locaux'), ['tesca-panneaux-locaux', 'tesca-locaux'], 'les panneaux illustrés s’ajoutent aux plaques existantes');
  assert.equal(D.projects.find(p => p.id === 'tesca-locaux').images.length, 6);
  const panneaux = D.projects.find(p => p.id === 'tesca-panneaux-locaux').images;
  assert.equal(panneaux.length, 8);
  assert.ok(panneaux.every(i => i.caption.startsWith('Panneau · ') && i.spec));
  const services = D.projects.find(p => p.id === 'tesca-services');
  assert.deepEqual([...services.images.map(i => i.caption.split(' · ').pop())], [
    'Sept services TESCA', 'Direction', 'Finance', 'Industrialisation', 'Qualité',
    'Ressources humaines', 'Manufacturing & Supply Chain', 'Achats & Supply Chain'
  ]);
  assert.equal(D.projects.find(p => p.id === 'tesca-bureaux').images.length, 3, 'identification des bureaux d’origine conservée');
  assert.equal(D.chapters.find(c => c.id === 'bureaux').cover.src, 'assets/photos/tesca/plaques-services.webp');
  const risques = D.projects.find(p => p.id === 'tesca-risques').images;
  assert.equal(risques.find(i => i.name === 'atelier-retordage-consignes').zone, 'atelier');
  assert.ok(!risques.some(i => i.name === 'local-retardage'), 'la première version de l’affiche n’est plus affichée');
  assert.ok(!('crop' in services.images[1]), 'le découpage reste dans le catalogue');
});

test('les PDF et les images fournies sont accessibles sans badge de maquette', async () => {
  const dom = await openPortfolio('?site=tesca');
  const { document } = dom.window;
  try {
    const image = document.querySelector('#risques [data-open="tesca-risques"] img[src$="/laboratoire-deversement.webp"]').closest('[data-open]');
    assert.ok(image.querySelector('img').getAttribute('src').includes('laboratoire-deversement'));
    assert.equal(image.querySelector('.mock-badge'), null);
    image.click();
    assert.match(document.querySelector('[data-stage-img]').src, /laboratoire-deversement-grand\.webp$/);
    const original = document.querySelector('[data-d-original]');
    assert.equal(original.hidden, false);
    assert.match(original.href, /assets\/documents\/tesca\/laboratoire-deversement\.pdf$/);
    assert.equal(document.querySelector('[data-d-note]').hidden, true);
    document.querySelector('[data-stage]').click();
    assert.ok(document.querySelector('[data-viewer]').hasAttribute('open'), 'le visuel s’ouvre en grand');
    assert.equal(document.querySelector('[data-viewer-pdf]').hidden, false);
    assert.match(document.querySelector('[data-viewer-pdf]').href, /laboratoire-deversement\.pdf$/);
    document.querySelector('[data-viewer-close]').click();
    document.querySelector('[data-dossier]').close();

    document.querySelector('.badge[data-set-client="psc"]').click();
    assert.equal(document.querySelector('.supplementary'), null);
    assert.ok([...document.querySelectorAll('#risques .media img')].every(img => img.getAttribute('src').startsWith('assets/photos/psc/')));
    assert.match(document.querySelector('[data-cover="risques"] figcaption').textContent, /^PSC/);
    document.querySelector('.badge[data-set-client="socohuile"]').click();
    assert.equal(document.querySelectorAll('#risques .document-link').length, 8);
    document.querySelector('.badge[data-set-client="all"]').click();
    assert.equal(document.querySelectorAll('.signal-grid .media').length, 6);
  } finally { dom.window.close(); }
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
      window.HTMLMediaElement.prototype.play = () => Promise.resolve();
      window.HTMLMediaElement.prototype.pause = () => {};
      window.HTMLMediaElement.prototype.load = () => {};
      window.Element.prototype.scrollIntoView = () => {};
      window.scrollTo = () => {};
    }
  });
  await new Promise(r => dom.window.addEventListener('load', r));
  return dom;
}

test('le portfolio se construit et réagit aux filtres', async () => {
  const dom = await openPortfolio();
  const { document } = dom.window;
  const { D } = loadData();
  try {
    assert.equal(document.querySelectorAll('.chapter').length, D.chapters.length);
    assert.equal(document.querySelectorAll('.badge').length, D.clients.length + 1);
    assert.equal(document.querySelectorAll('#bureaux .door').length, 11);
    assert.equal(Number(document.querySelector('[data-stat="visuals"]').textContent), [...D.projects, ...D.library].reduce((n, p) => n + p.images.length, 0));

    document.querySelector('.badge[data-set-client="tesca"]').click();
    assert.match(document.querySelector('[data-scope="bureaux"]').textContent, /Dossier TESCA/);
    assert.equal(document.querySelectorAll('#bureaux .door').length, 11);
    assert.ok([...document.querySelectorAll('#bureaux .door-plate small:first-child')].every(s => s.textContent === 'TESCA'));

    document.querySelector('[data-view="magazine"][data-for="locaux"]').click();
    assert.equal(document.querySelectorAll('#locaux .spread').length, 2);

    document.querySelector('[data-zone="laboratoire"]').click();
    assert.equal(document.querySelectorAll('#risques .poster').length, 3);

    document.querySelector('[data-sub="evacuation"]').click();
    assert.match(document.querySelector('#plans .compare-meta small').textContent, /Évacuation/);
    assert.equal(document.querySelector('#plans [data-compare-range]'), null, 'aucun faux avant/après ajouté aux vrais plans');
    assert.equal(document.querySelectorAll('#plans [data-plan]').length, 2, 'les deux plans TESCA sont accessibles');
    document.querySelector('[data-plan="tesca-evacuation/1"]').click();
    assert.match(document.querySelector('#plans .compare > img').src, /evacuation-administration/);

    document.querySelector('[data-dock-sites] [data-set-client="all"]').click();
    assert.equal(document.querySelectorAll('#bureaux .door').length, 11);

    document.querySelector('#bureaux [data-open]').click();
    const dossier = document.querySelector('[data-dossier]');
    assert.ok(dossier.hasAttribute('open'));
    assert.ok(document.querySelector('[data-d-title]').textContent.length > 10);
    assert.equal(document.querySelectorAll('[data-thumb]').length, 8);
    document.querySelector('[data-stage-next]').click();
    assert.equal(document.querySelector('[data-thumb][aria-current="true"]').dataset.thumb, '1');
    dossier.close();

  } finally {
    dom.window.close();
  }
});

test('présentation : chaque type, puis ses vidéos, puis tous ses travaux, filtrables par marque', async () => {
  const dom = await openPortfolio('?site=psc');
  const { document, KeyboardEvent } = dom.window;
  const { D } = loadData();
  const catalogue = JSON.parse(read('sources/imported-media.json'));
  const allowed = new Set([
    ...catalogue.records.flatMap(r => [r.src, r.full]),
    ...D.videos.flatMap(v => [v.poster, v.preview, v.src]),
    'assets/brand/keysafe-logo-white.png', 'assets/brand/keysafe-shield-white.png'
  ]);
  const current = () => document.querySelector('.slide.is-current');
  const deck = document.querySelector('[data-deck]');
  const key = k => deck.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
  const walk = () => {
    const seen = [];
    document.querySelector('[data-deck-home]').click();
    for (;;) {
      const slide = current();
      seen.push({ ...slide.dataset });
      for (const media of slide.querySelectorAll('img[src], video[src]')) {
        assert.ok(allowed.has(media.getAttribute('src')), `média non fourni : ${media.getAttribute('src')}`);
      }
      const next = document.querySelector('[data-deck-next]');
      if (next.disabled) break;
      next.click();
    }
    return seen;
  };
  try {
    document.querySelector('[data-action="present"]').click();
    assert.equal(document.querySelector('[data-deck-brands] [aria-pressed="true"]').dataset.deckBrand, 'psc', 'la présentation reprend le filtre du site');
    let seen = walk();
    let works = seen.filter(s => s.kind === 'work');
    assert.equal(works.length, 8);
    assert.ok(works.every(w => w.project.startsWith('psc-')));
    assert.deepEqual(seen.filter(s => s.kind === 'type').map(s => s.chapter), ['risques', 'plans']);

    document.querySelector('[data-deck-brands] [data-deck-brand="all"]').click();
    seen = walk();
    works = seen.filter(s => s.kind === 'work');
    assert.equal(works.length, catalogue.records.length, 'tous les travaux fournis sont présentés');
    assert.equal(new Set(works.map(w => w.project + '/' + w.image)).size, catalogue.records.length);
    for (const c of D.chapters) {
      const own = seen.map((s, i) => ({ ...s, i })).filter(s => s.chapter === c.id);
      const films = D.videos.filter(v => v.chapter === c.id).length;
      assert.equal(own[0].kind, 'type', `${c.id} commence par son ouverture`);
      assert.deepEqual(own.slice(1, 1 + films).map(s => s.kind), Array(films).fill('video'), `${c.id} : vidéos juste après l’ouverture`);
      assert.ok(own.slice(1 + films).every(s => s.kind === 'work'), `${c.id} : puis les travaux`);
      assert.equal(own[own.length - 1].i - own[0].i + 1, own.length, `${c.id} : diapositives regroupées`);
    }
    assert.equal(seen.filter(s => s.kind === 'terrain').length, 1, 'les vidéos sans type restent à la fin');

    document.querySelector('[data-deck-rail] [data-deck-type="risques"]').click();
    assert.equal(current().dataset.kind, 'type');
    current().querySelector('[data-deck-brand="socohuile"]').click();
    assert.equal(current().dataset.chapter, 'risques');
    assert.equal(document.querySelector('[data-deck-count]').textContent, '2 / 13');
    document.querySelector('[data-deck-next]').click();
    assert.equal(current().dataset.kind, 'video');
    document.querySelector('[data-deck-next]').click();
    assert.equal(current().dataset.project, 'socohuile-risques');
    current().querySelector('[data-deck-work="7"]').click();
    assert.equal(current().dataset.image, 'numeros-urgence');
    document.querySelector('[data-deck-brands] [data-deck-brand="tesca"]').click();
    assert.equal(current().dataset.project, 'tesca-risques', 'changer de marque reste sur le même type');

    key('4');
    assert.deepEqual([current().dataset.kind, current().dataset.chapter], ['type', 'plans']);
    key('m');
    assert.equal(document.querySelector('[data-deck-brands] [aria-pressed="true"]').dataset.deckBrand, 'psc');
    assert.deepEqual([current().dataset.kind, current().dataset.chapter], ['type', 'plans']);
    key('m');
    assert.equal(current().dataset.chapter, 'risques', 'SOCOHUILE sans plan : retour à son type disponible');

    deck.close();
    document.querySelector('.badge[data-set-client="socohuile"]').click();
    assert.equal(document.querySelector('#plans').hidden, true);
    assert.equal(document.querySelector('[data-nav="plans"]').hidden, true);
    document.querySelector('.badge[data-set-client="all"]').click();
    assert.equal(document.querySelector('#plans').hidden, false);
    assert.equal(document.querySelectorAll('#plans .chapter-films .film').length, 2, 'vidéos d’évacuation dans le chapitre des plans');
  } finally { dom.window.close(); }
});

test('images entières : jamais recadrées, et visibles en taille réelle', async () => {
  const css = read('css/styles.css');
  assert.match(css, /\.media img, \.chapter-cover-frame img, \.film img[^{]*\{ object-fit: contain !important;/, 'aucun visuel recadré');
  assert.match(css, /\.reel \.terrain-gallery figure \{ height: auto; overflow: visible;/, 'photos terrain non coupées');
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
    assert.ok(current().querySelector(':scope > .s-strip'), 'bande des travaux sous le visuel, sur une ligne');
  } finally { dom.window.close(); }
});

test('accueil : la vitrine montre nos vrais travaux, type par type, et se personnalise', async () => {
  const { D } = loadData();
  let dom = await openPortfolio();
  let { document } = dom.window;
  const title = () => document.querySelector('[data-hero-title]').textContent;
  try {
    assert.equal(document.querySelector('.hero-scene'), null, 'plus d’illustration générique dans l’accueil');
    const slides = [...document.querySelectorAll('.hero-stage img')];
    assert.equal(slides.length, D.hero.length);
    assert.ok(slides.every(img => img.getAttribute('src').startsWith('assets/photos/')), 'uniquement des travaux fournis');
    assert.ok(slides[0].classList.contains('is-active'));
    assert.deepEqual([...document.querySelectorAll('[data-hero-type]')].map(b => b.textContent.replace(/^\d+/, '')), ['Bureaux', 'Locaux', 'Risques', 'Plans']);
    assert.equal(title(), 'Gamme de plaques · Sept services TESCA');
    document.querySelector('[data-hero-type="plans"]').click();
    assert.equal(title(), 'Plan d’évacuation · Entrepôt');
    assert.equal(document.querySelector('[data-hero-type="plans"]').getAttribute('aria-current'), 'true');
    document.querySelector('[data-hero-stage]').click();
    assert.ok(document.querySelector('[data-viewer]').hasAttribute('open'), 'le travail s’ouvre en grand');
    assert.equal(document.querySelector('[data-viewer-count]').textContent, `10 / ${D.hero.length}`);
    document.querySelector('[data-viewer-next]').click();
    document.querySelector('[data-viewer-close]').click();
    assert.match(title(), /Photo|Atelier n° 1/, 'la vitrine suit la visionneuse');
    document.querySelector('[data-hero-open]').click();
    assert.ok(document.querySelector('[data-dossier]').hasAttribute('open'));
    assert.match(document.querySelector('[data-d-title]').textContent, /atelier n° 1/);
    document.querySelector('[data-dossier]').close();
  } finally { dom.window.close(); }

  dom = await openPortfolio('?site=psc&pour=Soci%C3%A9t%C3%A9%20Demo');
  ({ document } = dom.window);
  try {
    assert.equal(document.querySelector('[data-hero-label]').textContent, 'Sélection préparée pour Société Demo');
    const slides = [...document.querySelectorAll('.hero-stage img')];
    assert.equal(slides.length, 5, 'trois travaux de risques et deux plans PSC');
    assert.ok(slides.every(img => img.getAttribute('src').startsWith('assets/photos/psc/')));
    document.querySelector('.badge[data-set-client="socohuile"]').click();
    assert.ok([...document.querySelectorAll('.hero-stage img')].every(img => img.getAttribute('src').startsWith('assets/photos/socohuile/')), 'la vitrine suit le filtre du site');
  } finally { dom.window.close(); }
});

test('lien personnalisé : site et prospect', async () => {
  const dom = await openPortfolio('?site=psc&pour=Soci%C3%A9t%C3%A9%20%3Cb%3EDemo%3C%2Fb%3E');
  const { document } = dom.window;
  try {
    const chip = document.querySelector('[data-prepared]');
    assert.equal(chip.hidden, false);
    assert.equal(document.querySelector('[data-prepared-name]').textContent, 'Société <b>Demo</b>', 'le nom est affiché comme texte');
    assert.equal(document.querySelector('[data-prepared-name] b'), null);
    assert.equal(document.querySelector('#locaux').hidden, true);
    assert.equal(document.querySelector('#bureaux').hidden, true);
    assert.match(document.querySelector('[data-scope="risques"]').textContent, /Dossier PSC/);
    assert.equal(document.querySelector('#f-company').value, 'Société <b>Demo</b>');
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
