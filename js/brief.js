/* Kit photos & vidéos : liste les emplacements et vérifie ceux qui sont déjà fournis. */
(() => {
  'use strict';

  const D = window.KEYSAFE;
  const U = window.KEYSAFE_UTILS;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const chapters = Object.fromEntries(D.chapters.map(c => [c.id, c]));

  const probe = url => new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
  const probeVideo = url => new Promise(resolve => {
    const v = document.createElement('video');
    const done = ok => { v.removeAttribute('src'); resolve(ok); };
    v.preload = 'metadata';
    v.onloadedmetadata = () => done(true);
    v.onerror = () => done(false);
    v.src = url;
  });

  async function findPhoto(client, name) {
    for (const ext of D.settings.photoFormats) {
      const url = `${U.photoBase(client, name)}.${ext}`;
      if (await probe(url)) return url;
    }
    return null;
  }

  const slots = [];
  D.clients.forEach(client => {
    D.projects.filter(p => p.client === client.id).forEach(p => {
      p.images.forEach(img => {
        slots.push({ client, project: p, ...img });
        if (img.before) slots.push({ client, project: p, name: img.before, type: 'before', caption: `Plan d’origine · ${img.caption}` });
      });
    });
  });

  const card = s => {
    const c = chapters[s.project.chapter];
    return `<article class="b-card" data-slot="${s.client.id}/${s.name}">
      <img src="${esc(s.src || U.mockupPath(s.client.id, s.name))}" alt="" loading="lazy" style="object-fit:contain">
      <div>
        <div class="b-meta">
          <span class="b-chip chapter"><i style="--c:var(--c-${c.id})"></i>${c.number} · ${esc(c.short)}</span>
          <span class="b-chip b-status ${s.src ? 'ok' : ''}" data-status>${s.src ? 'Support intégré ✓' : 'Maquette'}</span>
        </div>
        <h4>${esc(s.caption)}</h4>
        <div class="b-file"><code title="assets/photos/${s.client.id}/${esc(s.name)}.jpg">${esc(s.name)}.jpg</code><button type="button" data-copy="${esc(s.name)}.jpg">Copier le nom</button></div>
        <p>${esc(s.src ? (s.note || 'Support fourni, classé et intégré au portfolio.') : D.shotTypes[s.type] || '')}</p>
        ${s.document ? `<a class="document-link" href="${esc(s.document)}" target="_blank" rel="noopener">Ouvrir le PDF ↗</a>` : ''}
      </div>
    </article>`;
  };

  const extraCard = (client, file, title, text) => `<article class="b-card" data-extra="${client.id}/${file}">
      <img src="assets/brand/keysafe-shield.png" alt="" style="object-fit:contain;padding:18px">
      <div>
        <div class="b-meta"><span class="b-chip chapter"><i style="--c:var(--leaf)"></i>Identité client</span><span class="b-chip b-status" data-status>Facultatif</span></div>
        <h4>${esc(title)}</h4>
        <div class="b-file"><code title="assets/photos/${client.id}/${esc(file)}">${esc(file)}</code><button type="button" data-copy="${esc(file)}">Copier le nom</button></div>
        <p>${esc(text)}</p>
      </div>
    </article>`;

  document.querySelector('[data-slots]').innerHTML = D.clients.map(client => {
    const own = slots.filter(s => s.client.id === client.id);
    return `<div class="b-client">
      <div class="b-client-head"><h3>${esc(client.name)}</h3><span>${own.length} visuels · dossier <code>assets/photos/${client.id}/</code></span></div>
      <div class="b-grid">
        ${own.map(card).join('')}
        ${extraCard(client, 'logo.png', 'Logo officiel du client', 'PNG transparent ou SVG, avec l’accord du client. Il remplace le nom écrit sur le badge d’accès.')}
        ${extraCard(client, 'film.mp4', 'Film des réalisations', 'MP4 (H.264), 20 à 90 secondes, 1080p maximum. Il apparaît en tête de la section « Sur le terrain ».')}
      </div>
    </div>`;
  }).join('');

  document.addEventListener('click', async e => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = 'Copié ✓'; } catch { b.textContent = b.dataset.copy; }
    setTimeout(() => { b.textContent = 'Copier le nom'; }, 1600);
  });

  (async () => {
    let received = 0;
    await Promise.all(slots.map(async s => {
      const url = s.src || await findPhoto(s.client.id, s.name);
      if (!url) return;
      received += 1;
      const el = document.querySelector(`[data-slot="${s.client.id}/${s.name}"]`);
      el.querySelector('img').src = url;
      const status = el.querySelector('[data-status]');
      status.textContent = s.src ? 'Support intégré ✓' : 'Photo reçue ✓';
      status.classList.add('ok');
      el.querySelector('code').textContent = url.split('/').pop();
    }));
    await Promise.all(D.clients.flatMap(client => [
      (async () => {
        for (const ext of ['svg', 'png', 'webp']) {
          if (await probe(`assets/photos/${client.id}/logo.${ext}`)) {
            const el = document.querySelector(`[data-extra="${client.id}/logo.png"]`);
            el.querySelector('img').src = `assets/photos/${client.id}/logo.${ext}`;
            const st = el.querySelector('[data-status]'); st.textContent = 'Reçu ✓'; st.classList.add('ok');
            return;
          }
        }
      })(),
      probeVideo(`assets/photos/${client.id}/film.mp4`).then(ok => {
        if (!ok) return;
        const st = document.querySelector(`[data-extra="${client.id}/film.mp4"] [data-status]`);
        st.textContent = 'Reçu ✓'; st.classList.add('ok');
      })
    ]));
    document.querySelector('[data-progress]').textContent = `${received} / ${slots.length} supports`;
    document.querySelector('[data-bar]').style.width = `${(received / slots.length) * 100}%`;
  })();
})();
