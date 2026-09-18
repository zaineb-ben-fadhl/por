(() => {
  'use strict';
  const { services, projects, videos, brands, contact } = globalThis.KEYSAFE_DATA;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escape = (value = '') => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const iconPaths = {
    'arrow-up-right': '<path d="M6 18 18 6M6 6h12v12"/>',
    'arrow-down-right': '<path d="m6 6 12 12M6 18h12V6"/>',
    'arrow-down': '<path d="M12 4v16m-6-6 6 6 6-6"/>',
    'arrow-right': '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    'arrow-left': '<path d="M20 12H4m6-6-6 6 6 6"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    play: '<path d="m9 5 11 7-11 7Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="m6 6 12 12M18 6 6 18"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    columns: '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M12 3v18M6 7h3M6 11h3M15 7h3M15 11h3M15 15h3"/>',
    filter: '<path d="M4 7h16M7 12h10M10 17h4"/>',
    door: '<path d="M4 21h16M6 21V3h12v18M6 3l9 3v15M11 12h.01"/>',
    settings: '<path d="m9 3-1 3-3 1-2 4 2 3 1 3 4 2 3-1 3-1 2-4-1-3-1-3-4-2Z"/><circle cx="11" cy="11" r="3"/><path d="m17 17 4 4"/>',
    warning: '<path d="m12 3 10 18H2Z"/><path d="M12 9v5m0 3v.1"/>',
    route: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M5 8v7a4 4 0 0 0 4 4h2a4 4 0 0 0 4-4V8a3 3 0 0 1 3-3h3m-3-3 3 3-3 3"/>',
    exit: '<path d="M12 3H3v18h9M9 12h12m-4-4 4 4-4 4"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6Z"/>',
    'mouse-pointer': '<path d="m4 3 5 18 4-7 7-4Z"/>',
    maximize: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5"/>',
    search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
    copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 5V3H3v13h2"/>'
  };
  const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths['arrow-up-right']}</svg>`;
  const hydrateIcons = (root = document) => $$('[data-icon]', root).forEach(node => {
    node.innerHTML = icon(node.dataset.icon);
    node.removeAttribute('data-icon');
  });
  const serviceOf = project => services.find(s => s.id === project.service);
  const params = new URLSearchParams(location.search);
  const state = {
    brand: Object.hasOwn(brands, params.get('client')) ? params.get('client') : 'all',
    service: services.some(s => s.id === params.get('prestation')) ? params.get('prestation') : 'all',
    view: params.get('vue') === 'magazine' ? 'magazine' : 'gallery',
    expanded: false,
    slide: 0
  };

  $('#expertise-grid').innerHTML = services.map(s => `<button class="expertise-card" data-service-link="${s.id}"><span class="expertise-card-top">${icon(s.icon)}<span>${s.number}</span></span><h3>${escape(s.title)}</h3><p>${escape(s.description)}</p><span class="expertise-link">Explorer ${icon('arrow-up-right')}</span></button>`).join('');
  services.forEach(s => {
    $('#service-filter').add(new Option(s.title, s.id));
    $('#contact-service').add(new Option(s.title, s.title));
  });

  function updateURL() {
    const url = new URL(location.href);
    for (const [key, value, defaultValue] of [['client', state.brand, 'all'], ['prestation', state.service, 'all'], ['vue', state.view, 'gallery']]) {
      if (value === defaultValue) url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    }
    try { history.replaceState(null, '', url); } catch { /* file:// remains usable */ }
  }

  function renderProjects() {
    const filtered = globalThis.KEYSAFE_FILTER(projects, state.brand, state.service);
    const shown = state.expanded ? filtered : filtered.slice(0, 6);
    $('#results-count').textContent = `${String(filtered.length).padStart(2, '0')} ${filtered.length > 1 ? 'aperçus' : 'aperçu'}${state.brand !== 'all' ? ' · ' + brands[state.brand] : ''}`;
    $('#project-grid').className = `project-grid${state.view === 'magazine' ? ' magazine' : ''}`;
    $('#project-grid').innerHTML = shown.map((p, index) => `<article class="project-card" style="animation-delay:${index * 35}ms"><button class="project-image-button" data-project="${p.id}" data-service="${p.service}" aria-label="Découvrir ${escape(p.title)} — ${brands[p.brand]}"><img src="${p.image}" alt="${p.placeholder ? 'Illustration : ' : ''}${escape(p.subtitle)}" loading="lazy" width="600" height="500"><span class="project-brand">${brands[p.brand]}</span>${p.placeholder ? '<span class="project-type">Aperçu illustratif</span>' : ''}<span class="project-open">${icon('arrow-up-right')}</span></button><div class="project-card-info"><p>${escape(p.subtitle)} <span aria-hidden="true">/</span> ${brands[p.brand]}</p><button class="project-card-title" data-project="${p.id}">${escape(p.title)}</button><p class="project-card-description">${escape(serviceOf(p).description)}</p></div></article>`).join('');
    $('#empty-state').hidden = filtered.length > 0;
    $('#show-more').hidden = filtered.length <= 6;
    $('#show-more').innerHTML = `${state.expanded ? 'Réduire la collection' : `Voir toute la collection (${filtered.length})`} ${icon(state.expanded ? 'arrow-up-right' : 'plus')}`;
    $$('[data-brand]').forEach(b => {
      const active = b.dataset.brand === state.brand;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    $$('[data-view]').forEach(b => {
      const active = b.dataset.view === state.view;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    $('#service-filter').value = state.service;
    updateURL();
  }

  function setFilter(brand, service, scroll = false) {
    state.brand = brand;
    state.service = service;
    state.expanded = false;
    renderProjects();
    if (scroll) $('#realisations').scrollIntoView({ behavior: 'smooth' });
  }

  const dialogOpeners = new Map();
  function openDialog(id) {
    const dialog = $('#' + id);
    if (dialog.open) return;
    dialogOpeners.set(id, document.activeElement);
    dialog.showModal();
    document.body.classList.add('modal-open');
  }
  function closeDialog(id) {
    const dialog = $('#' + id);
    if (dialog.open) dialog.close();
  }
  $$('dialog').forEach(dialog => {
    dialog.addEventListener('click', e => {
      const r = dialog.getBoundingClientRect();
      if (e.target === dialog && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) closeDialog(dialog.id);
    });
    dialog.addEventListener('close', () => {
      if (dialog.id === 'video-dialog') {
        const player = $('#video-player');
        player.pause();
        player.removeAttribute('src');
        player.load();
      }
      if (dialog.id === 'presentation-dialog' && document.fullscreenElement) document.exitFullscreen().catch(() => {});
      if (!$$('dialog[open]').length) document.body.classList.remove('modal-open');
      const opener = dialogOpeners.get(dialog.id);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    });
  });

  function openProject(id) {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    const service = serviceOf(project);
    $('#project-detail').innerHTML = `<div class="project-detail-layout"><div class="project-gallery"><img class="project-main-image" id="project-main-image" src="${project.gallery[0]}" alt="${project.placeholder ? 'Illustration : ' : ''}${escape(project.subtitle)}"><div class="project-thumbnails" role="group" aria-label="Images du projet">${project.gallery.map((src, i) => `<button class="project-thumbnail${i === 0 ? ' active' : ''}" data-gallery-src="${src}" aria-pressed="${i === 0}" aria-label="Voir l’image ${i + 1}"><img src="${src}" alt=""></button>`).join('')}</div><p class="gallery-caption">${project.gallery.length} VISUELS · ${project.placeholder ? 'ILLUSTRATIONS DE PRÉSENTATION' : 'GALERIE DU PROJET'}</p></div><div class="project-text"><p class="eyebrow">${brands[project.brand]} <span>/</span> ${escape(service.short).toUpperCase()}</p><h2 id="project-title">${escape(project.title)}</h2><p>${escape(project.description || service.detail)}</p><div class="project-tags">${service.tags.map(tag => `<span>${escape(tag)}</span>`).join('')}</div>${project.placeholder ? '<div class="project-notice">Aperçu illustratif de la prestation. Les photos du projet et le périmètre réalisé pour ce client restent à renseigner.</div>' : ''}<button class="button" data-contact-service="${service.id}">Imaginer cette solution pour mon site ${icon('arrow-up-right')}</button></div></div>`;
    openDialog('project-dialog');
  }

  const durations = { incendie: 25, evacuation: 101, 'safety-day': 182, exercice: 152 };
  const formatDuration = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  $$('[data-duration]').forEach(el => el.textContent = formatDuration(durations[el.dataset.duration]));
  $('#film-list').innerHTML = videos.slice(1).map(v => `<button class="film-item" data-video="${v.id}"><span class="film-item-image"><img src="${v.poster}" alt="${escape(v.category)} — ${escape(v.client)}" loading="lazy" width="240" height="180"><span>${icon('play')}</span></span><span><small>${escape(v.category).toUpperCase()} · ${formatDuration(durations[v.id])}</small><strong>${escape(v.title)}</strong><p>${escape(v.client)}</p></span></button>`).join('');
  function openVideo(id) {
    const video = videos.find(v => v.id === id);
    if (!video) return;
    $('#video-title').textContent = video.title;
    $('#video-context').textContent = video.client;
    $('#video-source').href = video.source;
    $('#video-error').hidden = true;
    const player = $('#video-player');
    player.src = video.src;
    player.poster = video.poster;
    openDialog('video-dialog');
    player.play().catch(() => { /* Native controls remain available if autoplay is restricted. */ });
  }
  $('#video-player').addEventListener('error', () => { if ($('#video-player').hasAttribute('src')) $('#video-error').hidden = false; });

  function setPoint(id) {
    const service = services.find(s => s.id === id);
    if (!service) return;
    $$('[data-point]').forEach(p => {
      p.classList.toggle('active', p.dataset.point === id);
      p.setAttribute('aria-pressed', String(p.dataset.point === id));
    });
    $('#explorer-detail').innerHTML = `<strong><span>${service.number}</span>${escape(service.title)}</strong><p>${escape(service.description)}</p><button class="text-button" data-service-link="${service.id}">Explorer cette prestation ${icon('arrow-up-right')}</button>`;
  }

  const slides = [
    { label: 'KEYSAFE / LE PORTFOLIO', title: 'La sécurité,<br>en toute <em>évidence.</em>', text: 'Des espaces qui se lisent. Des risques qui s’anticipent. Des équipes qui avancent en confiance.', image: 'assets/industry-hero.webp', tags: ['Signalétique', 'Circulation', 'Évacuation'] },
    ...services.map(s => ({ label: `${s.number} / ${s.title.toUpperCase()}`, title: escape(s.heading), text: s.detail, image: s.image, tags: s.tags })),
    { label: 'ÉCRIVONS LA SUITE ENSEMBLE', title: 'Votre site.<br><em>Notre prochaine histoire.</em>', text: 'Construisons une solution adaptée à vos espaces, à vos équipes et à votre activité.', image: 'assets/bureaux.webp', tags: [contact.email, contact.displayPhone] }
  ];
  function renderSlide() {
    const s = slides[state.slide];
    $('#presentation-slide').innerHTML = `<article class="slide"><div class="slide-copy"><p class="eyebrow"><span class="green-dot"></span>${escape(s.label)}</p><h2 id="slide-title">${s.title}</h2><p>${escape(s.text)}</p><div class="project-tags">${s.tags.map(tag => `<span>${escape(tag)}</span>`).join('')}</div><p class="slide-footer-text">KEYSAFE · TRAINING & CONSULTING</p></div><div class="slide-image"><img src="${s.image}" alt="Illustration de la prestation présentée"><span>Visuel illustratif</span></div></article>`;
    $('#slide-counter').textContent = `${String(state.slide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    $('#slide-dots').innerHTML = slides.map((_, i) => `<button class="slide-dot${i === state.slide ? ' active' : ''}" data-slide="${i}" aria-label="Aller à la diapositive ${i + 1}"${i === state.slide ? ' aria-current="step"' : ''}></button>`).join('');
    $('#previous-slide').disabled = state.slide === 0;
    $('#next-slide').disabled = state.slide === slides.length - 1;
  }
  function changeSlide(delta) { state.slide = Math.max(0, Math.min(slides.length - 1, state.slide + delta)); renderSlide(); }
  $('#previous-slide').addEventListener('click', () => changeSlide(-1));
  $('#next-slide').addEventListener('click', () => changeSlide(1));
  $('#fullscreen-button').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await $('#presentation-dialog').requestFullscreen();
    } catch { toast('Le plein écran n’est pas disponible dans ce navigateur.'); }
  });
  document.addEventListener('keydown', e => {
    if (!$('#presentation-dialog').open) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); changeSlide(1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); changeSlide(-1); }
    if (e.key === 'Home') { e.preventDefault(); state.slide = 0; renderSlide(); }
    if (e.key === 'End') { e.preventDefault(); state.slide = slides.length - 1; renderSlide(); }
  });

  function openContact(serviceId) {
    const s = services.find(s => s.id === serviceId);
    if (s) $('#contact-service').value = s.title;
    closeDialog('project-dialog');
    openDialog('contact-dialog');
  }
  $('#contact-form').addEventListener('submit', e => {
    e.preventDefault();
    const fields = new FormData(e.currentTarget);
    const body = `Bonjour KeySafe,\n\nJe souhaite échanger avec vous au sujet de : ${fields.get('service')}.\n\nEntreprise : ${fields.get('company')}\nNom : ${fields.get('name')}\nE-mail : ${fields.get('email')}\n\nMon projet :\n${fields.get('message')}\n\nÀ bientôt,\n${fields.get('name')}`;
    $('#email-preview').value = body;
    $('#contact-fallback').hidden = false;
    $('#copy-status').textContent = '';
    location.href = `mailto:${contact.email}?subject=${encodeURIComponent('Projet ' + fields.get('service') + ' — ' + fields.get('company'))}&body=${encodeURIComponent(body)}`;
  });
  $('#copy-email').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($('#email-preview').value);
      $('#copy-status').textContent = 'Demande copiée.';
    } catch {
      $('#email-preview').focus();
      $('#email-preview').select();
      $('#copy-status').textContent = 'Texte sélectionné : utilisez Ctrl+C.';
    }
  });

  document.addEventListener('click', e => {
    const target = e.target.closest('button, a');
    if (!target) return;
    const d = target.dataset;
    if (d.brand) setFilter(d.brand, state.service);
    if (d.brandLink) { e.preventDefault(); setFilter(d.brandLink, 'all', true); }
    if (d.serviceLink) { e.preventDefault(); setFilter('all', d.serviceLink, true); }
    if (d.view) { state.view = d.view; renderProjects(); }
    if (d.project) openProject(d.project);
    if (d.video) openVideo(d.video);
    if (d.close) closeDialog(d.close);
    if (d.point) setPoint(d.point);
    if (d.contactService) openContact(d.contactService);
    if (d.gallerySrc) {
      $('#project-main-image').src = d.gallerySrc;
      $$('[data-gallery-src]').forEach(b => {
        b.classList.toggle('active', b === target);
        b.setAttribute('aria-pressed', String(b === target));
      });
    }
    if (d.slide !== undefined) { state.slide = Number(d.slide); renderSlide(); }
    if (d.action === 'presentation') { state.slide = 0; renderSlide(); openDialog('presentation-dialog'); }
    if (d.action === 'contact') openContact();
    if (d.action === 'reset-filters') setFilter('all', 'all');
    if (target.closest('#main-nav')) {
      $('#main-nav').classList.remove('open');
      $('.menu-toggle').setAttribute('aria-expanded', 'false');
    }
  });
  $('#service-filter').addEventListener('change', e => setFilter(state.brand, e.target.value));
  $('#show-more').addEventListener('click', () => {
    state.expanded = !state.expanded;
    renderProjects();
    if (!state.expanded) $('#realisations').scrollIntoView({ behavior: 'smooth' });
  });
  $('.menu-toggle').addEventListener('click', e => {
    const expanded = $('#main-nav').classList.toggle('open');
    e.currentTarget.setAttribute('aria-expanded', String(expanded));
    e.currentTarget.setAttribute('aria-label', expanded ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  let toastTimer;
  function toast(message) {
    clearTimeout(toastTimer);
    $('#toast').textContent = message;
    $('#toast').classList.add('visible');
    toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 4000);
  }
  let scrollQueued = false;
  window.addEventListener('scroll', () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      $('.reading-progress').style.width = `${max > 0 ? window.scrollY / max * 100 : 0}%`;
      scrollQueued = false;
    });
  }, { passive: true });
  window.addEventListener('popstate', () => {
    const query = new URLSearchParams(location.search);
    state.brand = Object.hasOwn(brands, query.get('client')) ? query.get('client') : 'all';
    state.service = services.some(s => s.id === query.get('prestation')) ? query.get('prestation') : 'all';
    state.view = query.get('vue') === 'magazine' ? 'magazine' : 'gallery';
    state.expanded = false;
    renderProjects();
  });
  $('#year').textContent = new Date().getFullYear();
  hydrateIcons();
  setPoint('bureaux');
  renderProjects();
})();
