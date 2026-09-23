/* KeySafe · Portfolio — interactions. Le contenu est dans js/data.js. */
(() => {
  'use strict';

  const D = window.KEYSAFE;
  const U = window.KEYSAFE_UTILS;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const icon = id => `<svg aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const pad = n => String(n).padStart(2, '0');
  const plural = (n, one, many) => `${n} ${n > 1 ? many : one}`;

  // Présentation personnalisée : un seul site, TESCA.
  const SITE = D.clients[0];
  const SITE_STYLE = `--b:${SITE.accent || 'var(--leaf-300)'}`;
  const allProjects = D.projects;
  const chapters = Object.fromEntries(D.chapters.map(c => [c.id, c]));
  const CHAPTER_COLORS = D.chapters.map(c => `var(--c-${c.id})`);

  /* ------------------------------------------------------------ state */
  const params = new URLSearchParams(location.search);
  const state = {
    views: Object.fromEntries(D.chapters.map(c => [c.id, params.get('vue') === 'magazine' ? 'magazine' : 'gallery'])),
    // sous-type affiché pour les chapitres qui en ont (type 05 : consignes, circulation, évacuation)
    subs: Object.fromEntries(D.chapters.filter(c => c.subs).map(c => [c.id, c.subs[0].id])),
    planActive: null,
    zone: 'all',
    preparedFor: (params.get('pour') || '').replace(/\s+/g, ' ').trim().slice(0, 60)
  };

  /* ------------------------------------------------------------ médias fournis et classés */
  const slot = (client, name) => client + '/' + name;
  const media = new Map(allProjects.flatMap(p => p.images.map(img => [slot(p.client, img.name), img])));
  const imageSrc = (client, name) => media.get(slot(client, name))?.src || '';
  const isReal = (client, name) => Boolean(media.get(slot(client, name))?.src);
  const mediaKind = img => ({ photo: 'Photo sur site', pdf: 'Document PDF', template: 'Gabarit personnalisable', artwork: 'Support conçu' }[img.kind] || '');

  function mediaButton(project, image, { index = 0, cls = '', badge = true, eager = false } = {}) {
    return `<button type="button" class="media ${image.src ? 'media-document' : ''} ${cls}" data-open="${project.id}" data-index="${index}" aria-label="${esc(`${image.caption} : ouvrir le dossier`)}">
      <img src="${esc(imageSrc(project.client, image.name))}" data-slot="${slot(project.client, image.name)}" alt="${esc(`${image.caption} — ${SITE.name}`)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async">
      
      <span class="open-hint" aria-hidden="true">${icon('expand')}</span>
    </button>`;
  }

  /* ------------------------------------------------------------ helpers */
  const projectsFor = (chapter, extra = {}) => U.filterProjects(D.projects, { chapter, ...extra });
  const imageCount = list => list.reduce((n, p) => n + p.images.length, 0);
  const siteLine = [SITE.name, SITE.sector, SITE.city].filter(Boolean).join(' · ');

  function toast(message) {
    const el = $('[data-toast]');
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('is-visible'), 2600);
  }

  const revealObserver = 'IntersectionObserver' in window && !reducedMotion
    ? new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    : null;
  function observeReveals(root = document) {
    $$('.reveal:not(.in)', root).forEach(el => revealObserver ? revealObserver.observe(el) : el.classList.add('in'));
  }

  /* ------------------------------------------------------------ sommaire des cinq types */
  function renderTypes() {
    const host = $('[data-types]');
    host.innerHTML = D.chapters.map(c => {
      const list = projectsFor(c.id);
      const shots = flatten(list);
      const picks = [0, Math.floor(shots.length / 2), shots.length - 1].filter((v, i, a) => a.indexOf(v) === i);
      return `<li><a class="type-card reveal" href="#${c.id}" style="--c:var(--c-${c.id})">
        <span class="type-card-head"><b>${c.number}</b><span>${esc(c.code)}</span></span>
        <span class="type-card-thumbs">${picks.map(i => `<img src="${esc(shots[i].image.src)}" alt="" loading="lazy" decoding="async">`).join('')}</span>
        <strong>${esc(c.title)}</strong>
        <span class="type-card-lead">${esc(c.tagline)}</span>
        <span class="type-card-foot">${plural(imageCount(list), 'support', 'supports')}<i>${icon('arrow')}</i></span>
      </a></li>`;
    }).join('');
    observeReveals(host);
  }

  function renderDock() {
    $('[data-dock-chapters]').innerHTML = D.chapters
      .map(c => `<li><a href="#${c.id}" data-chapter="${c.id}" style="--c:var(--c-${c.id})" aria-label="${esc(`${c.number} · ${c.title}`)}" title="${esc(c.title)}">${c.number}</a></li>`).join('');
  }

  /* ------------------------------------------------------------ chapters */
  function renderChapters() {
    $('[data-chapters]').innerHTML = D.chapters.map(c => `
      <section class="chapter" id="${c.id}" data-chapter="${c.id}" aria-labelledby="h-${c.id}">
        <div class="wrap">
          <div class="chapter-head">
            <div class="reveal">
              <p class="chapter-sign"><b>${c.number}</b><span>${esc(c.code)}</span></p>
              <h2 id="h-${c.id}">${esc(c.titleLines[0])}<br><em>${esc(c.titleLines[1])}</em></h2>
              <p class="chapter-tagline">${esc(c.tagline)}</p>
              <p class="chapter-lead">${esc(c.lead)}</p>
              <p class="chapter-benefit">${esc(c.benefit)}</p>
              <ul class="deliverables">${c.deliverables.map(d => `<li>${esc(d)}</li>`).join('')}</ul>
            </div>
            <figure class="chapter-cover reveal" data-number="${c.number}" data-cover="${c.id}">
              <div class="chapter-cover-frame ${c.cover.contain ? 'cover-document' : ''}"><img src="${esc(c.cover.src)}" alt="${esc(`${c.title} : ${c.cover.caption}`)}" loading="lazy" decoding="async"></div>
              <span class="chapter-cover-tag">${c.number} · ${esc(c.code)}</span>
              <figcaption>${esc(c.cover.caption)}</figcaption>
            </figure>
          </div>
          <div class="toolbar">
            <p class="scope" data-scope="${c.id}" aria-live="polite"></p>
            <div class="toolbar-controls">
              ${c.subs ? `<div class="toggle toggle-accent" role="group" aria-label="Choisir un sous-type">${c.subs.map(s => `<button type="button" data-sub="${s.id}" aria-pressed="${state.subs[c.id] === s.id}">${esc(s.label)}</button>`).join('')}</div>` : ''}
              <div class="toggle" role="group" aria-label="Mode d’affichage">
                <button type="button" data-view="gallery" data-for="${c.id}" aria-pressed="${state.views[c.id] === 'gallery'}">${icon('grid')}Galerie</button>
                <button type="button" data-view="magazine" data-for="${c.id}" aria-pressed="${state.views[c.id] === 'magazine'}">${icon('magazine')}Magazine</button>
              </div>
            </div>
          </div>
          <div class="chapter-body" data-body="${c.id}"></div>
        </div>
      </section>`).join('');
    D.chapters.forEach(c => renderChapterBody(c.id, { animate: false }));
    observeReveals($('[data-chapters]'));
  }

  function renderChapterBody(id, { animate = true } = {}) {
    const c = chapters[id];
    const body = $(`[data-body="${id}"]`);
    const all = projectsFor(id);
    const available = Boolean(all.length);
    $('#' + id).hidden = !available;
    const nav = $('[data-nav="' + id + '"]');
    if (nav) nav.hidden = !available;
    const dockLink = $('[data-dock-chapters] [data-chapter="' + id + '"]');
    if (dockLink) dockLink.closest('li').hidden = !available;
    if (!available) { body.innerHTML = ''; return; }
    const list = c.subs ? all.filter(p => p.sub === state.subs[id]) : all;

    $(`[data-scope="${id}"]`).innerHTML = `<strong>${esc(`Dossier ${SITE.name}`)}</strong><span>${plural(list.length, 'réalisation', 'réalisations')} · ${plural(imageCount(list), 'visuel', 'visuels')}</span>`;

    if (!list.length) {
      body.innerHTML = '<div class="empty"><h3>Aucun support classé dans cette vue.</h3></div>';
    } else if (state.views[id] === 'magazine') {
      body.innerHTML = renderMagazine(list, c);
    } else {
      body.innerHTML = ({ corridor: layoutCorridor, spec: layoutSpec, rooms: layoutRooms, plans: layoutPlans })[c.layout](list, c);
    }

    if (animate && !reducedMotion) {
      body.classList.remove('is-swapping');
      void body.offsetWidth;
      body.classList.add('is-swapping');
    }
    bindBody(body, c);
    observeReveals(body);
  }

  const flatten = list => list.flatMap(p => p.images.map((image, index) => ({ project: p, image, index })));

  function layoutCorridor(list) {
    return `<div class="corridor">
      <div class="corridor-track" data-track tabindex="0" aria-label="Galerie à faire défiler horizontalement">
        ${flatten(list).map(({ project, image, index }) => `<article class="door">
          ${mediaButton(project, image, { index })}
          <p class="door-plate"><small>${esc(SITE.name)}</small><span>${esc(image.caption)}</span>${image.src ? `<small class="media-kind">${esc(mediaKind(image))}</small>` : ''}</p>
        </article>`).join('')}
      </div>
      <div class="corridor-nav">
        <button type="button" class="round-btn" data-track-prev aria-label="Visuels précédents">${icon('left')}</button>
        <button type="button" class="round-btn" data-track-next aria-label="Visuels suivants">${icon('right')}</button>
        <div class="progress" aria-hidden="true"><span data-track-progress></span></div>
      </div>
    </div>`;
  }

  function layoutSpec(list, c) {
    return `<div class="spec-grid">${flatten(list).map(({ project, image, index }) => {
      const [code, ...rest] = image.caption.split(' · ');
      return `<article class="spec reveal">
        <header class="spec-head"><span class="spec-code">${esc(code)}</span><span class="spec-client">${esc(c.code)}</span></header>
        ${mediaButton(project, image, { index })}
        <div class="spec-body">
          <h3>${esc(rest.join(' · ') || image.caption)}</h3>
          <dl><dt>Support</dt><dd>${esc(mediaKind(image))}</dd><dt>Signalé</dt><dd>${esc(image.spec || 'Désignation et accès')}</dd></dl>
        </div>
      </article>`;
    }).join('')}</div>`;
  }

  function layoutRooms(list) {
    const items = flatten(list);
    const zones = Object.keys(D.zones).filter(z => items.some(i => i.image.zone === z));
    if (state.zone !== 'all' && !zones.includes(state.zone)) state.zone = 'all';
    const shown = state.zone === 'all' ? items : items.filter(i => i.image.zone === state.zone);
    const tilt = [-1.4, 0.9, -0.6, 1.3, -1, 0.5];
    return `<div class="rooms">
      <div class="rooms-list" role="group" aria-label="Filtrer par local">
        <button type="button" data-zone="all" aria-pressed="${state.zone === 'all'}">Tous les locaux<span>${items.length}</span></button>
        ${zones.map(z => `<button type="button" data-zone="${z}" aria-pressed="${state.zone === z}">${esc(D.zones[z])}<span>${items.filter(i => i.image.zone === z).length}</span></button>`).join('')}
      </div>
      <div class="poster-wall">${shown.map(({ project, image, index }, k) => `<figure class="poster" style="--r:${tilt[k % tilt.length]}deg">
          ${mediaButton(project, image, { index })}
          <figcaption class="poster-caption"><strong>${esc(image.caption)}</strong><small>${esc(D.zones[image.zone] || SITE.name)}${image.src ? ` · ${esc(mediaKind(image))}` : ''}</small>${image.document ? `<a class="document-link" href="${esc(image.document)}" target="_blank" rel="noopener">Voir le PDF original ↗</a>` : ''}</figcaption>
        </figure>`).join('')}</div>
    </div>`;
  }

  function layoutPlans(list, c) {
    const items = flatten(list);
    const selected = items.find(item => `${item.project.id}/${item.index}` === state.planActive) || items[0];
    const { project: active, image, index } = selected;
    const sub = c.subs?.find(s => s.id === active.sub);
    const before = image.before;
    return `<div class="plans">
      <div>
        <div class="compare" data-compare style="--pos:${before ? 50 : 100}%">
          <img src="${esc(imageSrc(active.client, image.name))}" data-slot="${slot(active.client, image.name)}" alt="${esc(`${image.caption} — ${SITE.name}`)}" decoding="async">
          ${before ? `<div class="compare-before"><img src="${esc(imageSrc(active.client, before))}" data-slot="${slot(active.client, before)}" alt="${esc(`Plan d’origine — ${SITE.name}`)}" decoding="async"></div>
          <div class="compare-line"></div>
          <div class="compare-knob" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m9 6-5 6 5 6M15 6l5 6-5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
          <input class="compare-range" type="range" min="0" max="100" value="50" data-compare-range aria-label="Comparer le plan d’origine et le plan KeySafe">
          <span class="compare-label before">Avant</span><span class="compare-label after">Après KeySafe</span>` : ''}
          
        </div>
        <div class="compare-meta">
          <div><small>${esc(`${c.number} · ${sub ? sub.label : c.short}`)}</small><h3>${esc(active.title)}</h3></div>
          <button type="button" class="text-link" data-open="${active.id}" data-index="${index}">Voir en grand${icon('expand')}</button>
        </div>
      </div>
      <div class="plan-list" role="group" aria-label="Choisir un plan">
        ${items.map(item => `<button type="button" class="plan-item" data-plan="${item.project.id}/${item.index}" aria-pressed="${item === selected}">
          <img src="${esc(imageSrc(item.project.client, item.image.name))}" data-slot="${slot(item.project.client, item.image.name)}" alt="" loading="lazy">
          <span><small>${esc(mediaKind(item.image))}</small><strong>${esc(item.image.caption)}</strong></span>
        </button>`).join('')}
        <p class="plan-note">${before ? 'Faites glisser le curseur pour comparer les deux versions.' : 'Choisissez un support, puis ouvrez-le en grand pour explorer ses détails.'}</p>
      </div>
    </div>`;
  }

  function renderMagazine(list, c) {
    return `<div class="magazine">${list.map((p, k) => {
      const [main, ...others] = p.images;
      return `<article class="spread reveal" data-chapter="${c.id}">
        <div class="spread-media">
          ${mediaButton(p, main, { index: 0 })}
          ${others.length ? `<div class="spread-thumbs">${others.map((img, i) => mediaButton(p, img, { index: i + 1, badge: false })).join('')}</div>` : ''}
        </div>
        <div class="spread-text">
          <p class="spread-kicker"><span class="spread-issue">N°${pad(k + 1)}</span>${esc(`${c.number} · ${c.short}`)}</p>
          <h3>${esc(p.title)}</h3>
          <div class="spread-cols"><p><strong>Le besoin</strong>${esc(p.need)}</p><p><strong>Notre réponse</strong>${esc(p.answer)}</p></div>
          <ul class="ticks">${p.deliverables.map(d => `<li>${esc(d)}</li>`).join('')}</ul>
          <button type="button" class="text-link" data-open="${p.id}" data-index="0">Ouvrir le dossier${icon('arrow')}</button>
        </div>
      </article>`;
    }).join('')}</div>`;
  }

  function bindBody(body) {
    const track = $('[data-track]', body);
    if (track) bindCorridor(track, body);
    const compare = $('[data-compare]', body);
    if (compare) bindCompare(compare);
  }

  function bindCorridor(track, body) {
    const bar = $('[data-track-progress]', body);
    const prev = $('[data-track-prev]', body);
    const next = $('[data-track-next]', body);
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const ratio = max > 0 ? track.scrollLeft / max : 1;
      bar.style.width = `${Math.max(8, ratio * 100)}%`;
      prev.disabled = track.scrollLeft < 4;
      next.disabled = track.scrollLeft > max - 4;
    };
    const step = () => ($('.door', track)?.getBoundingClientRect().width || 300) + 22;
    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', update, { passive: true });
    track.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: step(), behavior: 'smooth' }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -step(), behavior: 'smooth' }); }
    });

    // drag to scroll with a mouse
    let startX = 0;
    let startLeft = 0;
    let dragging = false;
    let moved = false;
    track.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
    });
    window.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) { moved = true; track.classList.add('is-dragging'); }
      if (moved) track.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', () => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('is-dragging');
    });
    track.addEventListener('click', e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
    requestAnimationFrame(update);
    window.addEventListener('resize', update, { passive: true });
  }

  function bindCompare(compare) {
    const range = $('[data-compare-range]', compare);
    if (!range) return;
    const set = v => { compare.style.setProperty('--pos', `${v}%`); range.value = v; };
    range.addEventListener('input', () => set(range.value));
    if (reducedMotion || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      // a short sweep invites the visitor to drag
      const start = performance.now();
      const frames = t => {
        const k = Math.min(1, (t - start) / 1600);
        const eased = 1 - Math.pow(1 - k, 3);
        set(Math.round(50 + Math.sin(eased * Math.PI * 2) * 28 * (1 - eased)));
        if (k < 1) requestAnimationFrame(frames);
      };
      requestAnimationFrame(frames);
    }, { threshold: 0.6 });
    io.observe(compare);
  }

  /* ------------------------------------------------------------ dialogs */
  function openDialog(dialog) {
    if (dialog.open) return;
    dialog.showModal();
    document.body.classList.add('has-dialog');
  }
  document.addEventListener('close', e => {
    if (e.target.tagName !== 'DIALOG') return;
    if (!$$('dialog').some(d => d.open)) document.body.classList.remove('has-dialog');
  }, true);

  /* ------------------------------------------------------------ visionneuse : le visuel entier, puis en taille réelle */
  const viewer = { el: $('[data-viewer]'), items: [], index: 0, real: false, onClose: null };
  const viewerItem = (project, image) => ({
    src: image.full || imageSrc(project.client, image.name), caption: image.caption, client: project.client, document: image.document
  });

  function openViewer(items, index = 0, onClose = null) {
    if (!items.length) return;
    Object.assign(viewer, { items, index: Number(index) || 0, onClose });
    // En plein écran, seule la présentation est affichée : la visionneuse doit s'y trouver.
    const host = document.fullscreenElement || document.body;
    if (viewer.el.parentElement !== host) host.append(viewer.el);
    showViewerItem();
    openDialog(viewer.el);
  }

  function showViewerItem() {
    const { el, items } = viewer;
    viewer.index = (viewer.index + items.length) % items.length;
    const item = items[viewer.index];
    const img = $('[data-viewer-img]', el);
    setViewerMode(false);
    img.src = item.src;
    img.alt = `${item.caption} — ${SITE.name}`;
    $('[data-viewer-title]', el).textContent = item.caption;
    const brand = $('[data-viewer-brand]', el);
    brand.innerHTML = `<i></i>${esc(SITE.name)}`;
    brand.style.setProperty('--b', SITE.accent || 'var(--leaf-300)');
    $('[data-viewer-count]', el).textContent = items.length > 1 ? `${viewer.index + 1} / ${items.length}` : '';
    $('[data-viewer-prev]', el).hidden = items.length < 2;
    $('[data-viewer-next]', el).hidden = items.length < 2;
    const pdf = $('[data-viewer-pdf]', el);
    pdf.hidden = !item.document;
    pdf.href = item.document || '#';
    const mode = $('[data-viewer-mode]', el);
    const fits = () => {
      const canvas = $('[data-viewer-canvas]', el);
      mode.hidden = img.naturalWidth <= canvas.clientWidth && img.naturalHeight <= canvas.clientHeight;
    };
    if (img.complete && img.naturalWidth) fits();
    else img.addEventListener('load', fits, { once: true });
  }

  // Taille réelle : un pixel de l'image par pixel d'écran, en partant du point visé.
  function setViewerMode(real, point) {
    const { el } = viewer;
    const canvas = $('[data-viewer-canvas]', el);
    const img = $('[data-viewer-img]', el);
    const r = img.getBoundingClientRect();
    const rel = real && point && r.width ? { x: (point.x - r.left) / r.width, y: (point.y - r.top) / r.height } : { x: .5, y: 0 };
    viewer.real = real;
    el.classList.toggle('is-real', real);
    const mode = $('[data-viewer-mode]', el);
    mode.textContent = real ? 'Ajuster à l’écran' : 'Taille réelle';
    mode.setAttribute('aria-pressed', String(real));
    if (real) canvas.scrollTo?.(rel.x * img.offsetWidth - canvas.clientWidth / 2, rel.y * img.offsetHeight - canvas.clientHeight / 2);
    else canvas.scrollTo?.(0, 0);
  }

  function bindViewer() {
    const el = viewer.el;
    const canvas = $('[data-viewer-canvas]', el);
    const step = n => { viewer.index += n; showViewerItem(); };
    $('[data-viewer-prev]', el).addEventListener('click', () => step(-1));
    $('[data-viewer-next]', el).addEventListener('click', () => step(1));
    $('[data-viewer-mode]', el).addEventListener('click', () => setViewerMode(!viewer.real));
    $('[data-viewer-close]', el).addEventListener('click', () => el.close());
    // glisser pour se déplacer dans l'image en taille réelle
    let drag = null;
    canvas.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, y: e.clientY, left: canvas.scrollLeft, top: canvas.scrollTop, moved: false };
    });
    window.addEventListener('pointermove', e => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) > 5) { drag.moved = true; canvas.classList.add('is-dragging'); }
      if (drag.moved && viewer.real) canvas.scrollTo(drag.left - dx, drag.top - dy);
    });
    window.addEventListener('pointerup', () => { if (drag) setTimeout(() => { drag = null; }, 0); canvas.classList.remove('is-dragging'); });
    canvas.addEventListener('click', e => {
      if (drag?.moved) return;
      if (e.target.closest('[data-viewer-img]')) setViewerMode(!viewer.real, { x: e.clientX, y: e.clientY });
      else if (!viewer.real) el.close();
    });
    el.addEventListener('keydown', e => {
      e.stopPropagation();
      if (e.key === 'ArrowRight' && viewer.items.length > 1) { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft' && viewer.items.length > 1) { e.preventDefault(); step(-1); }
      if (['+', '='].includes(e.key)) setViewerMode(true);
      if (['-', '0'].includes(e.key)) setViewerMode(false);
      if (e.key.toLowerCase() === 'f') toggleFullscreen();
    });
    el.addEventListener('close', () => {
      const done = viewer.onClose;
      viewer.onClose = null;
      done?.(viewer.index);
    });
  }

  const dossier = { el: $('[data-dossier]'), project: null, index: 0, mode: 'after' };

  function openDossier(id, index = 0) {
    const p = allProjects.find(x => x.id === id);
    if (!p) return;
    const c = chapters[p.chapter];
    Object.assign(dossier, { project: p, index: Number(index) || 0, mode: 'after' });
    const el = dossier.el;
    const sub = c.subs?.find(s => s.id === p.sub);
    $('[data-d-chapter]', el).innerHTML = `<i style="--c:var(--c-${c.id})"></i>${c.number} · ${esc(sub ? `${c.short} · ${sub.label}` : c.title)}`;
    $('[data-d-client]', el).textContent = siteLine;
    $('[data-d-title]', el).textContent = p.title;
    $('[data-d-need]', el).textContent = p.need;
    $('[data-d-answer]', el).textContent = p.answer;
    $('[data-d-deliverables]', el).innerHTML = p.deliverables.map(d => `<li>${esc(d)}</li>`).join('');
    $('[data-thumbs]', el).innerHTML = p.images.length > 1 ? p.images.map((img, i) => `<button type="button" data-thumb="${i}" aria-label="${esc(img.caption)}"><img src="${esc(imageSrc(p.client, img.name))}" alt=""></button>`).join('') : '';
    $('[data-thumbs]', el).hidden = p.images.length < 2;
    showStage();
    openDialog(el);
  }

  function showStage() {
    const { project: p, el } = dossier;
    const count = p.images.length;
    dossier.index = (dossier.index + count) % count;
    const image = p.images[dossier.index];
    const name = image.before && dossier.mode === 'before' ? image.before : image.name;
    const stage = $('[data-stage]', el);
    const img = $('[data-stage-img]', el);
    img.src = name === image.name && image.full ? image.full : imageSrc(p.client, name);
    img.alt = `${image.caption} — ${SITE.name}${name === image.before ? ', plan d’origine' : ''}`;
    const mock = !isReal(p.client, name);
    $('[data-stage-badge]', el).hidden = !(mock && D.settings.showMockupBadges);
    $('[data-d-note]', el).hidden = !mock;
    $('[data-d-caption]', el).textContent = image.caption;
    $('[data-d-kind]', el).textContent = `${mediaKind(image)}${image.note ? ` · ${image.note}` : ''}`;
    const original = $('[data-d-original]', el);
    original.hidden = !image.full && !image.document;
    original.href = image.document || image.full || '#';
    original.textContent = image.document ? 'Ouvrir le PDF original ↗' : 'Ouvrir l’image en grand ↗';
    $('[data-d-counter]', el).textContent = `${dossier.index + 1} / ${count}`;
    $('[data-stage-prev]', el).hidden = count < 2;
    $('[data-stage-next]', el).hidden = count < 2;
    const compare = $('[data-stage-compare]', el);
    compare.hidden = !image.before;
    $$('[data-compare-mode]', compare).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.compareMode === dossier.mode)));
    $$('[data-thumb]', el).forEach(b => b.setAttribute('aria-current', String(Number(b.dataset.thumb) === dossier.index)));
  }

  function bindDossier() {
    const el = dossier.el;
    const stage = $('[data-stage]', el);
    $('[data-stage-prev]', el).addEventListener('click', e => { e.stopPropagation(); dossier.index -= 1; dossier.mode = 'after'; showStage(); });
    $('[data-stage-next]', el).addEventListener('click', e => { e.stopPropagation(); dossier.index += 1; dossier.mode = 'after'; showStage(); });
    $('[data-thumbs]', el).addEventListener('click', e => {
      const b = e.target.closest('[data-thumb]');
      if (b) { dossier.index = Number(b.dataset.thumb); dossier.mode = 'after'; showStage(); }
    });
    $('[data-stage-compare]', el).addEventListener('click', e => {
      const b = e.target.closest('[data-compare-mode]');
      if (!b) return;
      e.stopPropagation();
      dossier.mode = b.dataset.compareMode;
      showStage();
    });
    // Le visuel s'ouvre en plein écran, puis en taille réelle.
    stage.addEventListener('click', e => {
      if (e.target.closest('button')) return;
      const p = dossier.project;
      openViewer(p.images.map(img => viewerItem(p, img)), dossier.index, index => { dossier.index = index; dossier.mode = 'after'; showStage(); });
    });
    el.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' && dossier.project.images.length > 1) { dossier.index += 1; dossier.mode = 'after'; showStage(); }
      if (e.key === 'ArrowLeft' && dossier.project.images.length > 1) { dossier.index -= 1; dossier.mode = 'after'; showStage(); }
    });
    $('[data-close-to-contact]', el).addEventListener('click', () => el.close());
    el.addEventListener('click', e => { if (e.target === el) el.close(); });
  }

  /* ------------------------------------------------------------ vitrine de l'accueil : nos travaux, type par type */
  const hero = { el: $('[data-hero-showcase]'), items: [], index: 0, timer: null, paused: false, visible: true };
  const HERO_DELAY = 5200;
  const chapterRank = id => D.chapters.findIndex(c => c.id === id);

  function heroItems() {
    return (D.hero || []).map(h => {
      const project = allProjects.find(p => p.id === h.project);
      const index = project ? project.images.findIndex(img => img.name === h.image) : -1;
      return index < 0 ? null : { project, image: project.images[index], index };
    }).filter(Boolean);
  }

  function renderHero() {
    const el = hero.el;
    if (!el) return;
    clearTimeout(hero.timer);
    hero.items = heroItems();
    hero.index = 0;
    const label = state.preparedFor ? `Sélection préparée pour ${state.preparedFor}` : `Les réalisations ${SITE.name}, en direct`;
    $('[data-hero-label]').textContent = label;
    if (!hero.items.length) { el.innerHTML = ''; return; }
    const types = D.chapters.filter(c => hero.items.some(x => x.project.chapter === c.id));
    el.innerHTML = `<div class="hero-tabs" style="--n:${types.length}" role="group" aria-label="Nos expertises">${types.map(c => `<button type="button" data-hero-type="${c.id}" style="--c:var(--c-${c.id})" aria-label="${esc(`${c.number} · ${c.title}`)}"><span><b>${c.number}</b>${esc($(`[data-nav="${c.id}"]`)?.textContent.trim() || c.short)}</span><i><span></span></i></button>`).join('')}</div>
      <button type="button" class="hero-stage" data-hero-stage aria-label="Voir ce travail en grand">${hero.items.map((x, i) => `<img src="${esc(x.image.src)}" alt="${esc(`${x.image.caption} — ${SITE.name}`)}" class="${x.image.kind === 'photo' ? 'is-photo' : ''}" decoding="async"${i ? ' fetchpriority="low"' : ' fetchpriority="high"'}>`).join('')}</button>
      <div class="hero-caption" aria-live="polite">
        <p class="hero-brand" data-hero-brand></p>
        <p class="hero-caption-text"><small data-hero-kind></small><strong data-hero-title></strong></p>
        <button type="button" class="hero-open" data-hero-open>Voir le projet${icon('arrow')}</button>
      </div>`;
    showHeroSlide(0);
  }

  function showHeroSlide(index) {
    const el = hero.el;
    const count = hero.items.length;
    hero.index = (index + count) % count;
    const { project, image } = hero.items[hero.index];
    const c = chapters[project.chapter];
    $$('.hero-stage img', el).forEach((img, i) => img.classList.toggle('is-active', i === hero.index));
    const brand = $('[data-hero-brand]', el);
    brand.innerHTML = `<i></i>${esc(SITE.name)}`;
    brand.style.setProperty('--b', SITE.accent || 'var(--leaf-300)');
    $('[data-hero-kind]', el).textContent = `${c.number} · ${c.short}`;
    $('[data-hero-title]', el).textContent = image.caption;
    // barre de chaque type : travaux déjà vus, puis le travail en cours qui se remplit
    const sameType = hero.items.filter(x => x.project.chapter === c.id);
    const pos = sameType.indexOf(hero.items[hero.index]);
    $$('[data-hero-type]', el).forEach(tab => {
      const rank = chapterRank(tab.dataset.heroType);
      const bar = $('i span', tab);
      tab.setAttribute('aria-current', String(tab.dataset.heroType === c.id));
      bar.style.transition = 'none';
      bar.style.width = rank < chapterRank(c.id) ? '100%' : rank > chapterRank(c.id) ? '0%' : `${(pos / sameType.length) * 100}%`;
      if (tab.dataset.heroType === c.id) {
        void bar.offsetWidth;
        const auto = !reducedMotion && !hero.paused && hero.visible;
        bar.style.transition = auto ? `width ${HERO_DELAY}ms linear` : 'width .4s var(--ease)';
        bar.style.width = `${((pos + 1) / sameType.length) * 100}%`;
      }
    });
    scheduleHero();
  }

  function scheduleHero() {
    clearTimeout(hero.timer);
    if (reducedMotion || hero.paused || !hero.visible || hero.items.length < 2) return;
    hero.timer = setTimeout(() => showHeroSlide(hero.index + 1), HERO_DELAY);
  }

  function bindHero() {
    const el = hero.el;
    if (!el) return;
    el.addEventListener('click', e => {
      const type = e.target.closest('[data-hero-type]');
      if (type) { showHeroSlide(hero.items.findIndex(x => x.project.chapter === type.dataset.heroType)); return; }
      const { project, index } = hero.items[hero.index] || {};
      if (!project) return;
      if (e.target.closest('[data-hero-open]')) { openDossier(project.id, index); return; }
      if (e.target.closest('[data-hero-stage]')) {
        openViewer(hero.items.map(x => viewerItem(x.project, x.image)), hero.index, i => showHeroSlide(i));
      }
    });
    // pause au survol et au clavier : le visiteur regarde un travail
    const pause = on => { hero.paused = on; showHeroSlide(hero.index); };
    el.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') pause(true); });
    el.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') pause(false); });
    el.addEventListener('focusin', () => pause(true));
    el.addEventListener('focusout', e => { if (!el.contains(e.relatedTarget)) pause(false); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        hero.visible = entries[0].isIntersecting;
        if (hero.items.length) showHeroSlide(hero.index);
      }, { threshold: 0.25 }).observe(el);
    }
    document.addEventListener('visibilitychange', () => { hero.visible = !document.hidden; scheduleHero(); });
  }

  /* ------------------------------------------------------------ manifesto, method, stats */
  function wordsHtml(text, highlights) {
    let parts = [{ text, cls: '' }];
    highlights.forEach(h => {
      parts = parts.flatMap(part => {
        const i = part.cls ? -1 : part.text.indexOf(h.text);
        if (i < 0) return [part];
        return [{ text: part.text.slice(0, i), cls: '' }, { text: h.text, cls: h.cls }, { text: part.text.slice(i + h.text.length), cls: '' }];
      });
    });
    return parts.map(p => p.text.split(/(\s+)/).map(tok => (/^\s+$/.test(tok) ? ' ' : tok ? `<span class="w ${p.cls}">${esc(tok)}</span>` : '')).join('')).join('');
  }
  const QUOTE_HIGHLIGHTS = [
    { text: 'ce qu’elle risque', cls: 'hl-risk' },
    { text: 'ce qu’elle doit porter', cls: 'hl-wear' },
    { text: 'par où elle sort', cls: 'hl-exit' }
  ];

  function renderManifesto() {
    const quote = $('[data-manifesto]');
    quote.innerHTML = `« ${wordsHtml(D.audit.quote, QUOTE_HIGHLIGHTS)} »`;
    const words = $$('.w', quote);
    if (reducedMotion) { words.forEach(w => w.classList.add('lit')); return; }
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = quote.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.3)));
      const lit = Math.round(progress * words.length);
      words.forEach((w, i) => w.classList.toggle('lit', i < lit));
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  function renderMethod() {
    $('[data-steps]').innerHTML = D.method.map((s, i) => `<li class="step reveal" style="--c:${CHAPTER_COLORS[i % CHAPTER_COLORS.length]}"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('');
    const max = Math.max(...D.audit.domains.map(d => d.points));
    const colors = { emergency: 'var(--iso-green)', prohibition: 'var(--iso-red)', warning: 'var(--iso-yellow)', fire: 'var(--iso-red)', info: 'var(--iso-blue)', mandatory: 'var(--iso-blue)' };
    $('[data-domains]').innerHTML = D.audit.domains.map(d => `<li class="domain reveal">
      <span class="iso iso-${d.kind}" aria-hidden="true"></span><span>${esc(d.label)}</span>
      <span class="domain-bar" aria-hidden="true"><span style="--w:${(d.points / max) * 100}%;--c:${colors[d.kind]}"></span></span>
      <b>${pad(d.points)}<small>pts</small></b></li>`).join('');
    $('[data-refs]').innerHTML = `Références : ${D.audit.references.map(r => `<span>${esc(r)}</span>`).join('')}`;
  }

  function renderStats() {
    const visuals = allProjects.reduce((n, p) => n + p.images.length, 0);
    $('[data-stat="visuals"]').dataset.count = visuals;
    const identification = imageCount(projectsFor('bureaux')) + imageCount(projectsFor('locaux'));
    $('[data-stat="identification"]').dataset.count = identification;
    const targets = $$('[data-count]');
    targets.forEach(el => { el.textContent = pad(el.dataset.count); });
    if (reducedMotion || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const end = Number(e.target.dataset.count);
      const t0 = performance.now();
      const tick = t => {
        const k = Math.min(1, (t - t0) / 1300);
        e.target.textContent = pad(Math.round(end * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }), { threshold: 0.6 });
    targets.forEach(el => io.observe(el));
  }

  /* ------------------------------------------------------------ présentation : chaque type, puis ses travaux */
  const deck = { el: $('[data-deck]'), slides: [], index: 0 };

  // Travaux d'un type, dans l'ordre de ses sous-types.
  function worksFor(chapterId) {
    const subs = (chapters[chapterId].subs || []).map(s => s.id);
    return flatten(allProjects
      .filter(p => p.chapter === chapterId)
      .sort((a, b) => subs.indexOf(a.sub) - subs.indexOf(b.sub)));
  }

  function buildDeckSlides() {
    const slides = [{ kind: 'cover' }];
    D.chapters.forEach(c => {
      const works = worksFor(c.id);
      if (!works.length) return;
      slides.push({ kind: 'type', chapter: c.id });
      works.forEach((work, pos) => slides.push({ kind: 'work', chapter: c.id, work, pos, total: works.length }));
    });
    slides.push({ kind: 'contact' });
    return slides;
  }

  function slideCover() {
    const total = D.chapters.reduce((n, c) => n + worksFor(c.id).length, 0);
    return `<section class="slide s-cover">
      <div class="s-cover-copy">
        <img class="s-cover-logo" src="assets/brand/keysafe-logo-white.png" alt="KeySafe Training & Consulting">
        ${state.preparedFor ? `<p class="prepared"><span>Présentation préparée pour</span> <strong>${esc(state.preparedFor)}</strong></p>` : ''}
        <h2>${esc(SITE.name)},<em>type par type.</em></h2>
        <p class="s-lead">${plural(total, 'support présenté', 'supports présentés')} · ${esc(siteLine)}. Cinq types : chacun s'ouvre sur sa promesse, puis déroule tous ses supports.</p>
      </div>
      <ol class="s-cover-types">${D.chapters.map(c => {
        const works = worksFor(c.id);
        return `<li><button type="button" class="s-type-card" data-deck-type="${c.id}" style="--c:var(--c-${c.id})"${works.length ? '' : ' disabled'}>
          <span class="s-type-card-num">${c.number}</span>
          <span class="s-type-card-thumbs">${works.slice(0, 3).map(w => `<img src="${esc(w.image.src)}" alt="" loading="lazy">`).join('')}</span>
          <strong>${esc(c.title)}</strong>
          <small>${works.length ? plural(works.length, 'support', 'supports') : 'Aucun support'}</small>
        </button></li>`;
      }).join('')}</ol>
    </section>`;
  }

  function slideType(c) {
    const works = worksFor(c.id);
    // Six exemples répartis sur tout le type, chacun visible en entier et cliquable.
    const count = Math.min(6, works.length);
    const picks = [...new Set(Array.from({ length: count }, (_, i) => Math.round(i * (works.length - 1) / Math.max(1, count - 1))))];
    const perSub = c.subs ? ` · ${c.subs.map(s => `${s.label} : ${works.filter(w => w.project.sub === s.id).length}`).join(' · ')}` : '';
    return `<section class="slide s-type">
      <div class="s-type-copy">
        <p class="s-type-sign"><b>${c.number}</b><span>${esc(c.code)}</span></p>
        <h2>${esc(c.titleLines[0])}<em>${esc(c.titleLines[1])}</em></h2>
        <p class="s-lead">${esc(c.tagline)}</p>
        <p class="s-benefit">${esc(c.benefit)}</p>
        <p class="s-next">À suivre : ${plural(works.length, 'support', 'supports')}${esc(perSub)}</p>
        <button type="button" class="btn btn-leaf" data-deck-step="1"><span>Voir les supports</span>${icon('arrow')}</button>
      </div>
      <div class="s-mosaic" style="--cols:${Math.min(3, picks.length)}" role="group" aria-label="${esc(`Exemples : ${c.short}`)}">${picks.map((pos, i) => {
        const w = works[pos];
        return `<button type="button" data-deck-work="${pos}" data-for-chapter="${c.id}" style="--i:${i};${SITE_STYLE}" aria-label="${esc(w.image.caption)}"><img src="${esc(w.image.src)}" alt="" loading="lazy"><span><i></i>${esc(mediaKind(w.image))}<small>${esc(w.image.caption)}</small></span></button>`;
      }).join('')}</div>
    </section>`;
  }

  function slideWork(c, { work, pos, total }) {
    const { project: p, image: img } = work;
    const sub = c.subs?.find(s => s.id === p.sub);
    return `<section class="slide s-work ${img.kind === 'photo' ? 's-work-photo' : 's-work-artwork'}" style="${SITE_STYLE}" data-project="${p.id}" data-image="${esc(img.name)}">
      <figure class="s-work-stage" data-deck-zoom title="Voir en taille réelle"><img src="${esc(img.full || img.src)}" alt="${esc(`${img.caption} — ${SITE.name}`)}"></figure>
      <aside class="s-work-info">
        <p class="s-kicker"><b>${c.number}</b>${esc(sub ? `${c.short} · ${sub.label}` : c.short)}</p>
        <p class="s-brand"><i></i>${esc(SITE.name)}</p>
        <h3>${esc(img.caption)}</h3>
        <p class="s-kind">${esc(mediaKind(img))}${img.note ? ` · ${esc(img.note)}` : ''}</p>
        <p class="s-project">${esc(p.title)}</p>
        <button type="button" class="s-real" data-deck-zoom>${icon('zoom')}Voir en grand · taille réelle</button>
        <div class="s-links">${img.document ? `<a class="document-link" href="${esc(img.document)}" target="_blank" rel="noopener">PDF original ↗</a>` : ''}${img.full ? `<a class="document-link" href="${esc(img.full)}" target="_blank" rel="noopener">Image HD ↗</a>` : ''}</div>
        <p class="s-pos"><b>${pad(pos + 1)}</b> / ${pad(total)}</p>
      </aside>
      <div class="s-strip" role="group" aria-label="${esc(`Tous les supports : ${c.short}`)}">${worksFor(c.id).map((w, i) => `<button type="button" data-deck-work="${i}" data-for-chapter="${c.id}" style="${SITE_STYLE}" aria-current="${i === pos}" aria-label="${esc(w.image.caption)}"><img src="${esc(w.image.src)}" alt="" loading="lazy"></button>`).join('')}</div>
    </section>`;
  }

  function slideContact() {
    return `<section class="slide slide-contact"><h2>Parlons de votre site.<em>Rendons-le évident.</em></h2><div class="lines"><span>${esc(D.contact.phoneDisplay)}</span><span>${esc(D.contact.email)}</span></div><p class="s-lead">${esc(D.contact.signature)}</p></section>`;
  }

  function slideHtml(s) {
    const c = chapters[s.chapter];
    if (s.kind === 'cover') return slideCover();
    if (s.kind === 'type') return slideType(c);
    if (s.kind === 'work') return slideWork(c, s);
    return slideContact();
  }

  function renderDeckChrome() {
    const current = deck.slides[deck.index];
    $('[data-deck-rail]', deck.el).innerHTML = D.chapters.map(c => {
      const own = deck.slides.map((s, i) => (s.chapter === c.id ? i : -1)).filter(i => i >= 0);
      const progress = !own.length || deck.index < own[0] ? 0 : deck.index > own[own.length - 1] ? 1 : (deck.index - own[0] + 1) / own.length;
      return `<button type="button" data-deck-type="${c.id}" style="--c:var(--c-${c.id});--p:${progress}" aria-current="${current.chapter === c.id}"${own.length ? '' : ' disabled'}><span><b>${c.number}</b>${esc(c.short)}</span><i aria-hidden="true"></i></button>`;
    }).join('');
    $('[data-deck-count]', deck.el).textContent = `${deck.index + 1} / ${deck.slides.length}`;
    $('[data-deck-prev]', deck.el).disabled = deck.index === 0;
    $('[data-deck-next]', deck.el).disabled = deck.index === deck.slides.length - 1;
  }

  function showSlide(index, direction = index >= deck.index ? 1 : -1) {
    if (index < 0 || index >= deck.slides.length) return;
    deck.index = index;
    const stage = $('[data-deck-stage]', deck.el);
    const s = deck.slides[index];
    $$('.slide', stage).forEach(old => {
      old.classList.remove('is-current');
      old.classList.add('is-leaving');
      old.style.setProperty('--dir', direction);
      old.inert = true;
      setTimeout(() => old.remove(), reducedMotion ? 0 : 420);
    });
    const holder = document.createElement('div');
    holder.innerHTML = slideHtml(s);
    const el = holder.firstElementChild;
    el.classList.add('is-current');
    el.dataset.kind = s.kind;
    if (s.chapter) {
      el.dataset.chapter = s.chapter;
      el.style.setProperty('--c', `var(--c-${s.chapter})`);
    }
    el.style.setProperty('--dir', direction);
    stage.append(el);
    renderDeckChrome();

    const strip = $('.s-strip', el);
    const active = strip && $('[aria-current="true"]', strip);
    if (active) {
      strip.scrollTop = active.offsetTop - strip.clientHeight / 2 + active.offsetHeight / 2;
      strip.scrollLeft = active.offsetLeft - strip.clientWidth / 2 + active.offsetWidth / 2;
    }
    [index - 1, index + 1].forEach(i => {
      const next = deck.slides[i];
      if (next?.kind === 'work') new Image().src = next.work.image.full || next.work.image.src;
    });
  }

  function openDeck() {
    deck.slides = buildDeckSlides();
    deck.index = 0;
    $('[data-deck-stage]', deck.el).innerHTML = '';
    openDialog(deck.el);
    showSlide(0, 1);
  }

  function openDeckViewer() {
    const s = deck.slides[deck.index];
    if (s?.kind !== 'work') return;
    const works = worksFor(s.chapter);
    openViewer(works.map(w => viewerItem(w.project, w.image)), s.pos, pos => {
      const target = deck.slides.findIndex(x => x.kind === 'work' && x.chapter === s.chapter && x.pos === pos);
      if (target >= 0 && target !== deck.index) showSlide(target);
    });
  }

  function bindDeck() {
    const el = deck.el;
    const go = step => showSlide(deck.index + step, step);
    const typeSlide = id => deck.slides.findIndex(s => s.kind === 'type' && s.chapter === id);
    $('[data-deck-prev]', el).addEventListener('click', () => go(-1));
    $('[data-deck-next]', el).addEventListener('click', () => go(1));
    $('[data-deck-full]', el).addEventListener('click', toggleFullscreen);
    $('[data-deck-home]', el).addEventListener('click', () => showSlide(0, -1));
    el.addEventListener('click', e => {
      const t = e.target;
      const type = t.closest('[data-deck-type]');
      if (type) { showSlide(typeSlide(type.dataset.deckType)); return; }
      const work = t.closest('[data-deck-work]');
      if (work) {
        showSlide(deck.slides.findIndex(s => s.kind === 'work' && s.chapter === work.dataset.forChapter && s.pos === Number(work.dataset.deckWork)));
        return;
      }
      const step = t.closest('[data-deck-step]');
      if (step) { go(Number(step.dataset.deckStep)); return; }
      if (t.closest('[data-deck-zoom]')) openDeckViewer();
    });
    el.addEventListener('keydown', e => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const key = e.key.toLowerCase();
      if (['arrowright', 'pagedown'].includes(key) || (key === ' ' && !e.target.closest('button, a'))) { e.preventDefault(); go(1); }
      else if (['arrowleft', 'pageup'].includes(key)) { e.preventDefault(); go(-1); }
      else if (key === 'home') showSlide(0, -1);
      else if (key === 'end') showSlide(deck.slides.length - 1, 1);
      else if (/^[1-9]$/.test(key) && D.chapters[Number(key) - 1]) {
        const i = typeSlide(D.chapters[Number(key) - 1].id);
        if (i >= 0) showSlide(i);
      } else if (key === 'enter' && !e.target.closest('button, a')) openDeckViewer();
      else if (key === 'f') toggleFullscreen();
    });
    const stage = $('[data-deck-stage]', el);
    let x0 = null;
    stage.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') x0 = e.clientX; });
    stage.addEventListener('pointerup', e => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 60 && !e.target.closest('.s-strip')) go(dx < 0 ? 1 : -1);
    });
    el.addEventListener('close', () => {
      $('[data-deck-stage]', el).innerHTML = '';
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    });
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else deck.el.requestFullscreen?.().catch(() => {});
  }

  /* ------------------------------------------------------------ contact form */
  function bindForm() {
    const form = $('[data-form]');
    const needs = [...D.chapters.map(c => ({ value: c.title, color: `var(--c-${c.id})` })), { value: 'Audit de l’affichage de sécurité', color: 'var(--leaf)' }];
    $('[data-needs]').innerHTML = needs.map((n, i) => `<label><input type="checkbox" name="needs" value="${esc(n.value)}"${i === needs.length - 1 ? ' checked' : ''}><span style="--c:${n.color}">${esc(n.value)}</span></label>`).join('');
    // form.elements.namedItem avoids the clash between form.name and the "name" input
    const field = name => form.elements.namedItem(name);
    const value = name => field(name).value.trim();
    if (state.preparedFor) field('company').value = state.preparedFor;

    const error = $('[data-form-error]');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const required = ['name', 'company', 'email'];
      const invalid = required.filter(f => !value(f) || (f === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value('email'))));
      required.forEach(f => field(f).setAttribute('aria-invalid', String(invalid.includes(f))));
      if (invalid.length) {
        error.textContent = invalid.length === 1 && invalid[0] === 'email' ? 'Vérifiez votre adresse e-mail.' : 'Merci de renseigner votre nom, votre entreprise et votre e-mail.';
        error.hidden = false;
        field(invalid[0]).focus();
        return;
      }
      error.hidden = true;
      const chosen = $$('input[name="needs"]:checked', form).map(i => `- ${i.value}`);
      const subject = `Demande KeySafe · ${value('company')}`;
      const body = [
        'Bonjour KeySafe,', '',
        `Je souhaite échanger sur la signalétique et les plans de sécurité de notre site.`, '',
        `Nom : ${value('name')}`,
        `Entreprise : ${value('company')}`,
        `E-mail : ${value('email')}`,
        value('phone') ? `Téléphone : ${value('phone')}` : '',
        '', 'Besoins :', ...(chosen.length ? chosen : ['- À définir ensemble']),
        '', value('message') ? `Notre site :\n${value('message')}` : '',
        '', 'Cordialement'
      ].filter((line, i, arr) => !(line === '' && arr[i - 1] === '')).join('\n');
      $('[data-form-preview]').value = `À : ${D.contact.email}\nObjet : ${subject}\n\n${body}`;
      $('[data-form-fallback]').hidden = false;
      window.location.href = `mailto:${D.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
    $('[data-copy]').addEventListener('click', async () => {
      const area = $('[data-form-preview]');
      try {
        await navigator.clipboard.writeText(area.value);
      } catch {
        area.select();
        document.execCommand('copy');
      }
      toast('Demande copiée');
    });
  }

  /* ------------------------------------------------------------ chrome: topbar, menu, dock, scrollspy */
  function bindChrome() {
    const topbar = $('[data-topbar]');
    const dock = $('[data-dock]');
    const sites = $('#sites');
    const contact = $('#contact');
    let ticking = false;
    const onScroll = () => {
      ticking = false;
      topbar.classList.toggle('is-solid', window.scrollY > 30);
      const showDock = sites.getBoundingClientRect().top < -120 && contact.getBoundingClientRect().top > window.innerHeight * 0.55;
      dock.classList.toggle('is-visible', showDock);
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();

    const menu = $('.menu-button');
    const nav = $('#topnav');
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', e => {
      if (!e.target.closest('a')) return;
      menu.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    });

    if (!('IntersectionObserver' in window)) return;
    const spy = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      $$('[data-nav]').forEach(a => a.classList.toggle('is-active', a.dataset.nav === id));
      $$('[data-dock-chapters] a').forEach(a => a.classList.toggle('is-active', a.dataset.chapter === id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    [...D.chapters.map(c => $(`#${c.id}`)), $('#methode')].forEach(s => s && spy.observe(s));
  }

  /* ------------------------------------------------------------ global clicks */
  document.addEventListener('click', e => {
    const t = e.target;
    const open = t.closest('[data-open]');
    if (open) { openDossier(open.dataset.open, open.dataset.index); return; }
    const view = t.closest('[data-view]');
    if (view) {
      state.views[view.dataset.for] = view.dataset.view;
      $$(`[data-view][data-for="${view.dataset.for}"]`).forEach(b => b.setAttribute('aria-pressed', String(b === view)));
      renderChapterBody(view.dataset.for);
      return;
    }
    const chapterOf = node => node.closest('[data-chapter]')?.dataset.chapter;
    const sub = t.closest('[data-sub]');
    if (sub) {
      const id = chapterOf(sub);
      state.subs[id] = sub.dataset.sub;
      state.planActive = null;
      $$('[data-sub]', sub.closest('.toolbar')).forEach(b => b.setAttribute('aria-pressed', String(b === sub)));
      renderChapterBody(id);
      return;
    }
    const plan = t.closest('[data-plan]');
    if (plan) { state.planActive = plan.dataset.plan; renderChapterBody(chapterOf(plan), { animate: false }); return; }
    const zone = t.closest('[data-zone]');
    if (zone) { state.zone = zone.dataset.zone; renderChapterBody(chapterOf(zone), { animate: false }); return; }
    if (t.closest('[data-action="present"]')) { openDeck(); return; }
    const close = t.closest('[data-close]');
    if (close) close.closest('dialog')?.close();
  });

  /* ------------------------------------------------------------ init */
  function init() {
    if (state.preparedFor) {
      const chip = $('[data-prepared]');
      $('[data-prepared-name]', chip).textContent = state.preparedFor;
      chip.hidden = false;
      document.title = `KeySafe · Portfolio préparé pour ${state.preparedFor}`;
    }
    $('[data-year]').textContent = new Date().getFullYear();
    if (reducedMotion) {
      document.documentElement.classList.add('no-motion');

    }
    renderTypes();
    renderDock();
    renderHero();
    bindHero();
    renderChapters();
    renderManifesto();
    renderMethod();
    renderStats();
    bindDossier();
    bindDeck();
    bindViewer();
    bindForm();
    bindChrome();
    observeReveals();
  }

  init();
})();
