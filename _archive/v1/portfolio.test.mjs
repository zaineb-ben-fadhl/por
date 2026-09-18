import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { JSDOM, VirtualConsole } from 'jsdom';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const data = await readFile(new URL('../data.js', import.meta.url), 'utf8');
const app = await readFile(new URL('../app.js', import.meta.url), 'utf8');

function setup(query = '') {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', err => errors.push(err));
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost:5173/' + query, pretendToBeVisual: true, virtualConsole });
  const { window } = dom;
  window.Element.prototype.scrollIntoView = function () {};
  window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  window.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); this.dispatchEvent(new window.Event('close')); };
  window.HTMLMediaElement.prototype.play = function () { return Promise.resolve(); };
  window.HTMLMediaElement.prototype.pause = function () {};
  window.HTMLMediaElement.prototype.load = function () {};
  window.eval(data);
  window.eval(app);
  return { dom, window, doc: window.document, errors, click: s => window.document.querySelector(s).click() };
}

test('initialization renders five services, six previews and four video entry points without exceptions', () => {
  const { window, doc, errors } = setup();
  assert.equal(doc.querySelectorAll('.expertise-card').length, 5);
  assert.equal(doc.querySelectorAll('.project-card').length, 6);
  assert.equal(doc.querySelectorAll('.film-item').length, 3);
  assert.match(doc.querySelector('#results-count').textContent, /15 aperçus/);
  assert.equal(doc.querySelectorAll('[data-icon]').length, 0);
  assert.ok(doc.querySelector('.mini-play svg'));
  assert.equal(errors.length, 0);
  window.close();
});

test('brand and service filters intersect; empty combinations are recoverable', () => {
  const { window, doc, click, errors } = setup();
  click('[data-brand="psc"]');
  assert.equal(doc.querySelectorAll('.project-card').length, 5);
  assert.match(window.location.search, /client=psc/);
  const select = doc.querySelector('#service-filter');
  select.value = 'evacuation';
  select.dispatchEvent(new window.Event('change'));
  assert.equal(doc.querySelectorAll('.project-card').length, 1);
  assert.equal(doc.querySelector('.project-image-button').dataset.project, 'psc-evacuation');
  // Future collections may have gaps: exercise the real empty-result UI.
  window.KEYSAFE_DATA.projects.splice(window.KEYSAFE_DATA.projects.findIndex(p => p.id === 'psc-circulation'), 1);
  select.value = 'circulation';
  select.dispatchEvent(new window.Event('change'));
  assert.equal(doc.querySelectorAll('.project-card').length, 0);
  assert.equal(doc.querySelector('#empty-state').hidden, false);
  click('[data-action="reset-filters"]');
  assert.equal(doc.querySelectorAll('.project-card').length, 6);
  assert.equal(doc.querySelector('#empty-state').hidden, true);
  assert.equal(errors.length, 0);
  window.close();
});

test('magazine mode, client links, expertise links and show-more remain functional', () => {
  const { window, doc, click, errors } = setup();
  click('#show-more');
  assert.equal(doc.querySelectorAll('.project-card').length, 15);
  click('[data-view="magazine"]');
  assert.ok(doc.querySelector('#project-grid.magazine'));
  click('[data-brand-link="socohuile"]');
  assert.equal(doc.querySelectorAll('.project-card').length, 5);
  click('[data-service-link="evacuation"]');
  assert.equal(doc.querySelectorAll('.project-card').length, 3);
  assert.equal(doc.querySelector('[data-brand="all"]').getAttribute('aria-pressed'), 'true');
  assert.equal(errors.length, 0);
  window.close();
});

test('shareable query initializes both filters and magazine mode safely', () => {
  const valid = setup('?client=tesca&prestation=bureaux&vue=magazine');
  assert.equal(valid.doc.querySelectorAll('.project-card').length, 1);
  assert.ok(valid.doc.querySelector('#project-grid.magazine'));
  valid.window.close();
  const invalid = setup('?client=%3Cscript%3E&prestation=missing&vue=bad');
  assert.equal(invalid.doc.querySelectorAll('.project-card').length, 6);
  assert.equal(invalid.window.location.search, '');
  invalid.window.close();
});

test('project modal changes gallery images and opens a prefilled service inquiry', () => {
  const { window, doc, click, errors } = setup();
  click('[data-project="tesca-bureaux"]');
  assert.equal(doc.querySelector('#project-dialog').open, true);
  assert.match(doc.querySelector('#project-title').textContent, /chaque porte/);
  assert.match(doc.querySelector('.project-notice').textContent, /illustratif/);
  click('.project-thumbnail:nth-child(2)');
  assert.match(doc.querySelector('#project-main-image').src, /bureaux-detail.svg$/);
  click('[data-contact-service="bureaux"]');
  assert.equal(doc.querySelector('#project-dialog').open, false);
  assert.equal(doc.querySelector('#contact-dialog').open, true);
  assert.equal(doc.querySelector('#contact-service').value, 'Identification des bureaux');
  click('[data-close="contact-dialog"]');
  assert.equal(doc.body.classList.contains('modal-open'), false);
  assert.equal(errors.length, 0);
  window.close();
});

test('video dialog retains real attribution and unloads the video on close', () => {
  const { window, doc, click, errors } = setup();
  click('[data-video="evacuation"]');
  assert.equal(doc.querySelector('#video-dialog').open, true);
  assert.match(doc.querySelector('#video-context').textContent, /EL KHOMSA/);
  assert.match(doc.querySelector('#video-source').href, /7484900739761213440/);
  assert.match(doc.querySelector('#video-player').src, /evacuation.mp4$/);
  click('[data-close="video-dialog"]');
  assert.equal(doc.querySelector('#video-player').hasAttribute('src'), false);
  assert.equal(errors.length, 0);
  window.close();
});

test('presentation supports seven slides, keyboard navigation and bounds', () => {
  const { window, doc, click, errors } = setup();
  click('[data-action="presentation"]');
  assert.equal(doc.querySelector('#presentation-dialog').open, true);
  assert.equal(doc.querySelector('#slide-counter').textContent, '01 / 07');
  assert.equal(doc.querySelector('#previous-slide').disabled, true);
  window.document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight' }));
  assert.equal(doc.querySelector('#slide-counter').textContent, '02 / 07');
  window.document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'End' }));
  assert.equal(doc.querySelector('#next-slide').disabled, true);
  click('[data-slide="3"]');
  assert.equal(doc.querySelector('#slide-counter').textContent, '04 / 07');
  click('[data-close="presentation-dialog"]');
  assert.equal(errors.length, 0);
  window.close();
});

test('interactive map and mobile menu update their accessible states', () => {
  const { window, doc, click, errors } = setup();
  click('[data-point="risques"]');
  assert.match(doc.querySelector('#explorer-detail').textContent, /risques spécifiques/);
  assert.equal(doc.querySelector('[data-point="risques"]').getAttribute('aria-pressed'), 'true');
  assert.equal(doc.querySelector('[data-point="bureaux"]').getAttribute('aria-pressed'), 'false');
  click('.menu-toggle');
  assert.equal(doc.querySelector('.menu-toggle').getAttribute('aria-expanded'), 'true');
  click('#main-nav a');
  assert.equal(doc.querySelector('.menu-toggle').getAttribute('aria-expanded'), 'false');
  assert.equal(errors.length, 0);
  window.close();
});

test('all configured media files exist and every illustrative project is disclosed', async () => {
  const { window, doc } = setup();
  const entries = window.KEYSAFE_DATA;
  const media = new Set([...doc.querySelectorAll('img[src]')].map(i => i.getAttribute('src')));
  for (const s of entries.services) media.add(s.image);
  for (const p of entries.projects) {
    assert.equal(p.placeholder, true);
    assert.ok(entries.brands[p.brand]);
    assert.ok(entries.services.some(s => s.id === p.service));
    p.gallery.forEach(image => media.add(image));
  }
  for (const v of entries.videos) { media.add(v.src); media.add(v.poster); assert.ok(v.source.startsWith('https://www.linkedin.com/')); }
  for (const src of media) await access(new URL('../' + src, import.meta.url));
  window.close();
});
