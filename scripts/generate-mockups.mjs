// Generates the design mockups (SVG) shown until the real site photos are delivered.
// Run: node scripts/generate-mockups.mjs
// Each file is a visual stand-in: it carries a client name but is NOT a photo of a real installation.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'mockups');
mkdirSync(OUT, { recursive: true });

const FONT = "Arial, 'Helvetica Neue', Helvetica, sans-serif";
const C = {
  yellow: '#F6B300', red: '#C8102E', blue: '#1B5AA6', green: '#00874A', black: '#1B1B1D',
  indigo: '#312682', paper: '#FBFAF7'
};
const CLIENTS = {
  tesca: { name: 'TESCA', dark: '#1F2A37', accent: '#2B7A9B' },
  psc: { name: 'PSI', dark: '#1D3557', accent: '#E0A21B' },
  socohuile: { name: 'SOCOHUILE', dark: '#34401C', accent: '#C29A2B' }
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const svg = (w, h, body, defs = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs>
<filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000" flood-opacity=".28"/></filter>
<filter id="soft" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000" flood-opacity=".22"/></filter>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .09 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
<filter id="concrete"><feTurbulence type="fractalNoise" baseFrequency=".012 .03" numOctaves="4" seed="7"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .54  0 0 0 0 .51  0 0 0 .35 0"/></filter>
<pattern id="hazard" width="56" height="56" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="56" height="56" fill="${C.yellow}"/><rect width="28" height="56" fill="${C.black}"/></pattern>
${defs}
</defs>
${body}
</svg>`;
const text = (x, y, s, { size = 24, weight = 700, fill = C.black, anchor = 'start', spacing = 0, family = FONT, opacity = 1 } = {}) =>
  `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${spacing}"${opacity < 1 ? ` opacity="${opacity}"` : ''}>${esc(s)}</text>`;

// ------------------------------------------------------------------ pictograms (100 × 100 box)
const figure = (fill, run = false) => run
  ? `<g fill="none" stroke="${fill}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><circle cx="58" cy="22" r="7" fill="${fill}" stroke="none"/><path d="M52 34 44 58M49 40l14 6 8-8M47 44l-12 4-6 10M44 58l14 10 2 18M44 58 34 72H20"/></g>`
  : `<g fill="${fill}"><circle cx="50" cy="22" r="9"/><path d="M36 36h28a6 6 0 0 1 6 6v24h-9v26H39V66h-9V42a6 6 0 0 1 6-6z"/></g>`;

const symbols = {
  electric: f => `<path d="M56 18 30 58h18l-8 28 30-44H52z" fill="${f}"/>`,
  flame: f => `<path d="M50 16c4 16 22 22 22 44a22 22 0 0 1-44 0c0-10 6-16 10-22 0 8 4 12 8 12-2-14 0-24 4-34z" fill="${f}"/>`,
  general: f => `<g fill="${f}"><rect x="44" y="24" width="12" height="38" rx="5"/><circle cx="50" cy="76" r="7"/></g>`,
  hot: f => `<g fill="none" stroke="${f}" stroke-width="6" stroke-linecap="round"><path d="M34 60c-6-8 6-14 0-24M50 60c-6-8 6-14 0-24M66 60c-6-8 6-14 0-24"/><path d="M24 74h52" stroke-width="8"/></g>`,
  forklift: f => `<g fill="${f}"><path d="M22 44h26l8 14v14H22z"/><rect x="58" y="22" width="6" height="52"/><rect x="64" y="66" width="18" height="6"/><circle cx="32" cy="76" r="8"/><circle cx="50" cy="76" r="7"/><path d="M30 32h14v12H30z" opacity=".9"/></g>`,
  chemical: f => `<g fill="${f}"><path d="M38 18h24v6h-4v18l18 30a8 8 0 0 1-7 12H31a8 8 0 0 1-7-12l18-30V24h-4z"/></g>`,
  slip: f => `<g fill="none" stroke="${f}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><circle cx="34" cy="30" r="7" fill="${f}" stroke="none"/><path d="M42 40l16 18 18-4M50 48 36 70M58 58l6 20M22 84h60"/></g>`,
  pressure: f => `<g fill="none" stroke="${f}" stroke-width="7" stroke-linecap="round"><circle cx="50" cy="54" r="26"/><path d="M50 54 64 40"/><path d="M50 22v-6"/></g>`,
  ears: f => `<g fill="${f}"><path d="M24 58a26 26 0 0 1 52 0h-8a18 18 0 0 0-36 0z"/><rect x="18" y="52" width="18" height="30" rx="8"/><rect x="64" y="52" width="18" height="30" rx="8"/></g>`,
  gloves: f => `<path d="M34 86V50l-6-16a5 5 0 0 1 9-3l5 12V20a5 5 0 0 1 10 0v20-24a5 5 0 0 1 10 0v24-18a5 5 0 0 1 10 0v42c0 12-4 20-8 24z" fill="${f}"/>`,
  boots: f => `<path d="M30 16h26v44l22 8a8 8 0 0 1 6 8v10H26V60z" fill="${f}"/>`,
  helmet: f => `<g fill="${f}"><path d="M22 62a28 28 0 0 1 56 0z"/><rect x="14" y="62" width="72" height="10" rx="5"/><rect x="46" y="30" width="8" height="18" rx="3" fill-opacity=".45"/></g>`,
  glasses: f => `<g fill="${f}"><rect x="14" y="38" width="32" height="26" rx="10"/><rect x="54" y="38" width="32" height="26" rx="10"/><rect x="44" y="44" width="12" height="6"/></g>`,
  vest: f => `<path d="M34 16h10l6 12 6-12h10l14 22v48H62V52H38v34H20V38z" fill="${f}"/>`,
  smoking: f => `<g fill="${f}"><rect x="16" y="54" width="54" height="12"/><rect x="72" y="54" width="10" height="12"/><path d="M72 48c-6-8 6-12 0-22" fill="none" stroke="${f}" stroke-width="5" stroke-linecap="round"/></g>`,
  entry: f => figure(f),
  water: f => `<path d="M50 16c10 18 24 32 24 48a24 24 0 0 1-48 0c0-16 14-30 24-48z" fill="${f}"/>`,
  phone: f => `<rect x="34" y="16" width="32" height="68" rx="6" fill="${f}"/>`,
  exit: f => `<g>${figure(f, true)}<path d="M72 18h14v70H72" fill="none" stroke="${f}" stroke-width="6"/></g>`,
  firstaid: f => `<path d="M40 18h20v22h22v20H60v22H40V60H18V40h22z" fill="${f}"/>`,
  extinguisher: f => `<g fill="${f}"><rect x="36" y="32" width="28" height="56" rx="10"/><rect x="44" y="20" width="12" height="14"/><path d="M56 22h18v8H56z"/></g>`,
  alarm: f => `<g fill="none" stroke="${f}" stroke-width="6"><rect x="26" y="26" width="48" height="48" rx="6"/><circle cx="50" cy="50" r="12" fill="${f}"/></g>`,
  assembly: f => `<g fill="${f}"><circle cx="50" cy="50" r="7"/><circle cx="30" cy="34" r="6"/><circle cx="70" cy="34" r="6"/><circle cx="30" cy="66" r="6"/><circle cx="70" cy="66" r="6"/></g><g fill="none" stroke="${f}" stroke-width="5" stroke-linecap="round"><path d="M14 14l10 10M86 14 76 24M14 86l10-10M86 86 76 76"/></g>`
};

// kind: warning | mandatory | prohibition | emergency | fire
function picto(kind, symbol, x, y, size) {
  const s = size / 100;
  let shape;
  if (kind === 'warning') {
    shape = `<path d="M50 6 96 88H4z" fill="${C.yellow}" stroke="${C.black}" stroke-width="7" stroke-linejoin="round"/><g transform="translate(22 36) scale(.56)">${symbols[symbol](C.black)}</g>`;
  } else if (kind === 'mandatory') {
    shape = `<circle cx="50" cy="50" r="48" fill="${C.blue}"/><g transform="translate(15 15) scale(.7)">${symbols[symbol]('#fff')}</g>`;
  } else if (kind === 'prohibition') {
    shape = `<circle cx="50" cy="50" r="44" fill="#fff"/><g transform="translate(18 18) scale(.64)">${symbols[symbol](C.black)}</g><circle cx="50" cy="50" r="42" fill="none" stroke="${C.red}" stroke-width="10"/><path d="M20 20 80 80" stroke="${C.red}" stroke-width="10"/>`;
  } else {
    const bg = kind === 'fire' ? C.red : C.green;
    shape = `<rect x="2" y="2" width="96" height="96" rx="6" fill="${bg}"/><g transform="translate(12 12) scale(.76)">${symbols[symbol]('#fff')}</g>`;
  }
  return `<g transform="translate(${x} ${y}) scale(${s})">${shape}</g>`;
}

// ------------------------------------------------------------------ 1. office door plate
function plaque(client, { level, title, subtitle, number }) {
  const k = CLIENTS[client];
  const lines = title.split('\n');
  const body = `
<rect width="1200" height="1500" fill="#E6E1D8"/>
<rect width="1200" height="1500" filter="url(#grain)" fill="#E6E1D8"/>
<linearGradient id="light" x1="0" x2="1" y1="0" y2=".6"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>
<rect width="1200" height="1500" fill="url(#light)"/>
<rect x="0" y="0" width="330" height="1500" fill="#6B4F3A"/>
<rect x="0" y="0" width="330" height="1500" filter="url(#grain)" fill="#6B4F3A"/>
<rect x="330" y="0" width="34" height="1500" fill="#D8D1C4"/>
<rect x="250" y="720" width="42" height="150" rx="10" fill="#C7C2B8" filter="url(#soft)"/>
<g filter="url(#shadow)">
  <rect x="470" y="470" width="610" height="420" rx="14" fill="#FDFDFB"/>
</g>
<rect x="470" y="470" width="24" height="420" rx="4" fill="${k.accent}"/>
${text(540, 545, level, { size: 22, weight: 700, fill: '#8A8F98', spacing: 4 })}
${lines.map((l, i) => text(540, 640 + i * 66, l, { size: 60, weight: 800, fill: k.dark, spacing: 1 })).join('')}
<rect x="540" y="${660 + (lines.length - 1) * 66}" width="90" height="6" fill="${k.accent}"/>
${text(540, 725 + (lines.length - 1) * 66, subtitle, { size: 26, weight: 400, fill: '#5E6570' })}
${text(540, 858, k.name, { size: 20, weight: 700, fill: k.dark, spacing: 5, opacity: .55 })}
${text(1030, 862, number, { size: 54, weight: 300, fill: '#B5B9BF', anchor: 'end' })}
`;
  return svg(1200, 1500, body);
}

// ------------------------------------------------------------------ 2. wayfinding directory
function directory(client, { building, level, rows }) {
  const k = CLIENTS[client];
  const arrow = (dir, x, y) => {
    const rot = { up: -90, right: 0, down: 90, left: 180 }[dir];
    return `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-22 -6h24v-14l24 20-24 20V6h-24z" fill="#fff"/></g>`;
  };
  const body = `
<rect width="1200" height="1500" fill="#DDD8CF"/>
<rect width="1200" height="1500" filter="url(#grain)" fill="#DDD8CF"/>
<rect y="1290" width="1200" height="210" fill="#B9B2A6"/>
<g filter="url(#shadow)"><rect x="270" y="120" width="660" height="1200" rx="10" fill="${k.dark}"/></g>
<rect x="270" y="120" width="660" height="16" rx="6" fill="${k.accent}"/>
${text(330, 225, k.name, { size: 26, weight: 800, fill: '#fff', spacing: 8, opacity: .65 })}
<rect x="${870 - level.length * 26 - 30}" y="186" width="${level.length * 26 + 30}" height="54" rx="27" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>
${text(870 - (level.length * 26 + 30) / 2, 224, level, { size: 30, weight: 800, fill: '#fff', anchor: 'middle', spacing: 2 })}
${text(330, 318, building, { size: Math.min(58, Math.round(540 / (building.length * 0.56))), weight: 800, fill: '#fff' })}
<rect x="330" y="360" width="540" height="2" fill="#fff" opacity=".25"/>
${rows.map((r, i) => {
    const y = 470 + i * 150;
    return `${arrow(r.dir, 370, y - 12)}${text(430, y - 4, r.label, { size: 40, weight: 700, fill: '#fff' })}${text(430, y + 40, r.detail, { size: 24, weight: 400, fill: '#fff', opacity: .6 })}<rect x="330" y="${y + 78}" width="540" height="1.5" fill="#fff" opacity=".18"/>`;
  }).join('')}
<rect x="582" y="1320" width="36" height="180" fill="#8F877A"/>`;
  return svg(1200, 1500, body);
}

// ------------------------------------------------------------------ 3. technical room door sign
function technicalDoor(client, { code, title, subtitle, pictos }) {
  const k = CLIENTS[client];
  const lines = title.split('\n');
  const n = pictos.length;
  const pSize = 130;
  const gap = 36;
  const startX = 600 - (n * pSize + (n - 1) * gap) / 2;
  const body = `
<rect width="1200" height="1500" fill="#A9A7A1"/>
<rect width="1200" height="1500" filter="url(#concrete)"/>
<rect x="200" y="90" width="800" height="1410" fill="#4A4F55"/>
<linearGradient id="steel" x1="0" x2="1"><stop offset="0" stop-color="#737980"/><stop offset=".5" stop-color="#858B92"/><stop offset="1" stop-color="#6A7077"/></linearGradient>
<rect x="230" y="120" width="740" height="1380" fill="url(#steel)"/>
<rect x="230" y="120" width="740" height="1380" filter="url(#grain)" fill="#7B8188"/>
<rect x="860" y="850" width="70" height="26" rx="12" fill="#2E3237" filter="url(#soft)"/>
<rect x="872" y="820" width="22" height="80" rx="6" fill="#3A3F45"/>
<g filter="url(#shadow)"><rect x="330" y="230" width="540" height="560" rx="10" fill="#fff"/></g>
<rect x="330" y="230" width="540" height="92" rx="10" fill="${k.dark}"/>
<rect x="330" y="300" width="540" height="22" fill="${k.dark}"/>
${text(370, 292, code, { size: 38, weight: 800, fill: '#fff', spacing: 2 })}
${text(830, 290, k.name, { size: 22, weight: 700, fill: '#fff', anchor: 'end', spacing: 5, opacity: .7 })}
${lines.map((l, i) => text(600, 420 + i * 62, l, { size: 58, weight: 800, fill: C.black, anchor: 'middle' })).join('')}
${text(600, 440 + (lines.length - 1) * 62 + 36, subtitle, { size: 25, weight: 400, fill: '#5B6068', anchor: 'middle' })}
${pictos.map((p, i) => picto(p[0], p[1], startX + i * (pSize + gap), 600, pSize)).join('')}
<rect x="230" y="1400" width="740" height="100" fill="url(#hazard)"/>
<rect x="230" y="1400" width="740" height="100" fill="#000" opacity=".08"/>`;
  return svg(1200, 1500, body);
}

// ------------------------------------------------------------------ 4. risk poster per room
function riskPoster(client, { room, reference, dangers, obligations, prohibitions, emergency }) {
  const k = CLIENTS[client];
  const X = 36;
  const W = 880;
  let y = 36;
  const section = (label, color, items, kind) => {
    const top = y;
    const size = 128;
    const cols = items.length;
    const colW = (W - 80) / cols;
    const block = `
${text(X + 40, top + 70, label, { size: 28, weight: 800, fill: color, spacing: 4 })}
<rect x="${X + 40}" y="${top + 86}" width="${W - 80}" height="3" fill="${color}" opacity=".35"/>
${items.map((it, i) => {
      const cx = X + 40 + colW * i + colW / 2;
      return `${picto(kind, it[0], cx - size / 2, top + 118, size)}${text(cx, top + 290, it[1], { size: 23, weight: 700, fill: C.black, anchor: 'middle' })}`;
    }).join('')}`;
    y += 320;
    return block;
  };
  const header = `
<rect x="${X}" y="${y}" width="${W}" height="210" fill="${C.black}"/>
${text(X + 40, y + 70, 'RISQUES SPÉCIFIQUES', { size: 26, weight: 700, fill: C.yellow, spacing: 6 })}
${text(X + 40, y + 150, room.toUpperCase(), { size: room.length > 18 ? 54 : 64, weight: 800, fill: '#fff' })}
<rect x="${X}" y="${y + 210}" width="${W}" height="24" fill="url(#hazard)"/>`;
  y += 250;
  const s1 = section('DANGERS', '#A36B00', dangers, 'warning');
  const s2 = section('OBLIGATIONS', C.blue, obligations, 'mandatory');
  const s3 = section('INTERDICTIONS', C.red, prohibitions, 'prohibition');
  const e = `
<rect x="${X + 40}" y="${y + 10}" width="${W - 80}" height="220" rx="10" fill="${C.green}"/>
${picto('emergency', 'firstaid', X + 70, y + 50, 140)}
${text(X + 240, y + 72, 'EN CAS D’URGENCE', { size: 30, weight: 800, fill: '#fff', spacing: 2 })}
${emergency.map((l, i) => text(X + 240, y + 122 + i * 40, `${i + 1}. ${l}`, { size: 25, weight: 400, fill: '#fff' })).join('')}`;
  y += 250;
  const footer = `
<rect x="${X}" y="${y + 20}" width="${W}" height="2" fill="#000" opacity=".12"/>
${text(X + 40, y + 70, k.name, { size: 24, weight: 800, fill: k.dark, spacing: 5 })}
${text(X + W - 40, y + 70, reference, { size: 20, weight: 400, fill: '#6B7078', anchor: 'end' })}`;
  const height = y + 100;
  const scene = `
<rect width="${W + X * 2}" height="${height + X}" fill="#E4E1DA"/>
<g filter="url(#soft)"><rect x="${X}" y="${X}" width="${W}" height="${height - X}" fill="${C.paper}"/></g>
${[[X + 18, X + 18], [X + W - 18, X + 18], [X + 18, height - 18], [X + W - 18, height - 18]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="7" fill="#BFC2C6"/>`).join('')}`;
  return svg(W + X * 2, height + X, scene + header + s1 + s2 + s3 + e + footer);
}

// ------------------------------------------------------------------ 5. evacuation plan (ISO 23601 spirit)
function evacuationPlan(client, { level, rooms, before = false }) {
  const k = CLIENTS[client];
  const W = 1600;
  const H = 1130;
  // building footprint
  const bx = 70, by = 210, bw = 1030, bh = 760;
  const cy1 = by + 330, cy2 = by + 440; // corridor band
  const wall = before ? '#9A9A96' : '#2D2D2F';
  const wallW = before ? 3 : 9;
  const top = rooms.top; const bottom = rooms.bottom;
  const partitions = (list, y1, y2, labelY) => {
    let x = bx;
    return list.map((r, i) => {
      const w = r.w * bw;
      const door = x + w / 2;
      const out = `
${i > 0 ? `<path d="M${x} ${y1}V${y2}" stroke="${wall}" stroke-width="${wallW}"/>` : ''}
${text(x + w / 2, labelY, r.label.toUpperCase(), { size: before ? 18 : 20, weight: before ? 400 : 700, fill: before ? '#8C8C88' : '#55595F', anchor: 'middle', spacing: 1 })}
<rect x="${door - 26}" y="${(y1 === by ? cy1 : cy2) - wallW}" width="52" height="${wallW * 2}" fill="${before ? '#fff' : C.paper}"/>`;
      x += w;
      return out;
    }).join('');
  };
  const doors = (list, fromY, toY) => {
    let x = bx;
    return list.map(r => {
      const d = x + (r.w * bw) / 2;
      x += r.w * bw;
      return `<path d="M${d} ${fromY}V${toY}" stroke="${C.green}" stroke-width="9" stroke-linecap="round" marker-end="url(#arrowG)"/>`;
    }).join('');
  };
  const plan = `
<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="${before ? '#fff' : '#FFFFFF'}" stroke="${wall}" stroke-width="${wallW + 3}"/>
<path d="M${bx} ${cy1}H${bx + bw}M${bx} ${cy2}H${bx + bw}" stroke="${wall}" stroke-width="${wallW}"/>
${before ? '' : `<rect x="${bx + 6}" y="${cy1 + 6}" width="${bw - 12}" height="${cy2 - cy1 - 12}" fill="#E7F4EC"/>`}
${partitions(top, by, cy1, by + 170)}
${partitions(bottom, cy2, by + bh, cy2 + 170)}
<rect x="${bx - 8}" y="${cy1 + 8}" width="18" height="${cy2 - cy1 - 16}" fill="${before ? '#fff' : C.paper}"/>
<rect x="${bx + bw - 10}" y="${cy1 + 8}" width="18" height="${cy2 - cy1 - 16}" fill="${before ? '#fff' : C.paper}"/>`;
  const mid = (cy1 + cy2) / 2;
  // equipment sits just inside each room, against its left wall, away from the door arrows
  const equipment = (list, y, kinds) => {
    let x = bx;
    return list.map((r, i) => {
      const at = x;
      x += r.w * bw;
      const kind = kinds[i % kinds.length];
      if (!kind) return '';
      return picto(kind === 'firstaid' ? 'emergency' : 'fire', kind, at + 16, y, 54);
    }).join('');
  };
  const here = { x: bx + bw * 0.42, y: mid };
  const overlay = before ? '' : `
${doors(top, by + 230, cy1 + 20)}
${doors(bottom, by + bh - 200, cy2 - 20)}
<path d="M${here.x - 40} ${mid}H${bx + 40}" stroke="${C.green}" stroke-width="14" stroke-linecap="round" marker-end="url(#arrowG)"/>
<path d="M${here.x + 40} ${mid}H${bx + bw - 40}" stroke="${C.green}" stroke-width="14" stroke-linecap="round" marker-end="url(#arrowG)"/>
<path d="M${bx + bw + 25} ${mid + 40}V${by + bh + 50}H${bx + bw - 120}" fill="none" stroke="${C.green}" stroke-width="6" stroke-dasharray="14 10" stroke-linejoin="round"/>
${picto('emergency', 'exit', bx - 60, mid - 110, 70)}
${picto('emergency', 'exit', bx + bw - 10, mid - 110, 70)}
${equipment(top, cy1 - 72, ['extinguisher', 'alarm', null, 'extinguisher'])}
${equipment(bottom, cy2 + 18, ['firstaid', 'alarm', 'extinguisher', null])}
<circle cx="${here.x}" cy="${here.y}" r="34" fill="${C.red}" opacity=".18"/>
<circle cx="${here.x}" cy="${here.y}" r="18" fill="${C.red}" stroke="#fff" stroke-width="5"/>
<rect x="${here.x - 92}" y="${here.y + 30}" width="184" height="40" rx="20" fill="${C.red}"/>
${text(here.x, here.y + 58, 'VOUS ÊTES ICI', { size: 20, weight: 800, fill: '#fff', anchor: 'middle', spacing: 1 })}
<g transform="translate(${bx + bw - 200} ${by + bh + 16})">${picto('emergency', 'assembly', 0, 0, 64)}${text(-16, 44, 'Point de rassemblement', { size: 22, weight: 700, fill: C.green, anchor: 'end' })}</g>`;

  const side = before ? `
<rect x="1150" y="210" width="380" height="760" fill="none" stroke="#C9C9C4" stroke-dasharray="10 8" stroke-width="3"/>
${text(1340, 580, 'Plan architecte', { size: 30, weight: 400, fill: '#9A9A96', anchor: 'middle' })}
${text(1340, 622, 'état existant', { size: 30, weight: 400, fill: '#9A9A96', anchor: 'middle' })}` : `
${text(1150, 250, 'CONSIGNES', { size: 26, weight: 800, fill: C.black, spacing: 4 })}
${['Gardez votre calme', 'Donnez l’alarme', 'Suivez le balisage vert', 'Fermez les portes', 'Rejoignez le point', 'de rassemblement'].map((l, i) => text(i < 5 ? 1150 : 1178, 300 + i * 38, i < 5 ? `${i + 1}. ${l}` : l, { size: 25, weight: 400, fill: '#35383D' })).join('')}
<rect x="1150" y="545" width="380" height="2" fill="#000" opacity=".12"/>
${text(1150, 600, 'LÉGENDE', { size: 26, weight: 800, fill: C.black, spacing: 4 })}
${[['emergency', 'exit', 'Sortie de secours'], ['fire', 'extinguisher', 'Extincteur'], ['fire', 'alarm', 'Déclencheur d’alarme'], ['emergency', 'firstaid', 'Premiers secours'], ['emergency', 'assembly', 'Point de rassemblement']].map((l, i) => `${picto(l[0], l[1], 1150, 630 + i * 62, 46)}${text(1215, 664 + i * 62, l[2], { size: 23, weight: 400, fill: '#35383D' })}`).join('')}
<rect x="1150" y="950" width="380" height="2" fill="#000" opacity=".12"/>
${text(1150, 990, 'Protection civile 198 · SAMU 190', { size: 22, weight: 700, fill: C.red })}`;

  const header = before
    ? `${text(70, 130, 'Plan de niveau · ' + level, { size: 40, weight: 400, fill: '#7C7C78' })}`
    : `<rect width="${W}" height="160" fill="${C.green}"/>
${picto('emergency', 'exit', 70, 30, 100)}
${text(200, 95, 'PLAN D’ÉVACUATION', { size: 58, weight: 800, fill: '#fff', spacing: 2 })}
${text(202, 132, level, { size: 26, weight: 400, fill: '#fff', opacity: .85 })}
${text(1530, 105, k.name, { size: 34, weight: 800, fill: '#fff', anchor: 'end', spacing: 6 })}`;

  const footer = `
${text(70, 1095, before ? 'Document d’origine' : `${k.name} · ${level} · Pictogrammes ISO 7010`, { size: 20, weight: 400, fill: '#80848A' })}
<g transform="translate(1480 1060)"><circle r="30" fill="none" stroke="#80848A" stroke-width="3"/><path d="M0 -24 10 8H-10z" fill="#80848A"/>${text(0, 22, 'N', { size: 16, weight: 800, fill: '#80848A', anchor: 'middle' })}</g>`;

  const defs = `<marker id="arrowG" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto"><path d="M0 0 10 5 0 10z" fill="${C.green}"/></marker>`;
  return svg(W, H, `<rect width="${W}" height="${H}" fill="${before ? '#fff' : C.paper}"/>${header}${plan}${overlay}${side}${footer}`, defs);
}

// ------------------------------------------------------------------ 6. site circulation plan
function circulationPlan(client, { site, buildings, before = false }) {
  const k = CLIENTS[client];
  const W = 1600;
  const H = 1130;
  const road = before ? '#D5D3CD' : '#BFC3C8';
  const ring = 'M150 250H1020V900H150Z';
  const bld = buildings.map(b => `
<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="#fff" stroke="${before ? '#A7A59E' : '#6E6A60'}" stroke-width="${before ? 2 : 3}"/>
${before ? '' : `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="10" fill="${k.accent}"/>`}
${text(b.x + b.w / 2, b.y + b.h / 2 + 8, b.label.toUpperCase(), { size: Math.min(before ? 18 : 21, Math.floor((b.w - 24) / (b.label.length * 0.72))), weight: before ? 400 : 800, fill: before ? '#8C8A84' : '#3A3D42', anchor: 'middle', spacing: 1 })}`).join('');
  const base = `
<rect width="${W}" height="${H}" fill="${before ? '#fff' : '#F2F1EC'}"/>
<rect x="60" y="170" width="1050" height="880" fill="${before ? '#fff' : '#E9E7DF'}" stroke="${before ? '#B6B4AE' : '#9C988C'}" stroke-width="3" stroke-dasharray="${before ? '0' : '18 10'}"/>
<path d="${ring}" fill="none" stroke="${road}" stroke-width="70" stroke-linejoin="round"/>
<path d="M585 900V1050" stroke="${road}" stroke-width="70"/>
${before ? '' : `<path d="${ring}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="26 22"/>`}
${bld}`;
  if (before) {
    return svg(W, H, `${base}${text(70, 120, 'Plan masse · ' + site, { size: 40, weight: 400, fill: '#7C7C78' })}
<rect x="1150" y="210" width="380" height="760" fill="none" stroke="#C9C9C4" stroke-dasharray="10 8" stroke-width="3"/>
${text(1340, 580, 'Plan masse', { size: 30, weight: 400, fill: '#9A9A96', anchor: 'middle' })}
${text(1340, 622, 'sans flux', { size: 30, weight: 400, fill: '#9A9A96', anchor: 'middle' })}`);
  }
  const zebra = (x, y, horizontal) => `<g fill="#fff">${[0, 1, 2, 3, 4].map(i => horizontal
    ? `<rect x="${x - 35}" y="${y - 30 + i * 13}" width="70" height="7"/>`
    : `<rect x="${x - 30 + i * 13}" y="${y - 35}" width="7" height="70"/>`).join('')}</g>`;
  const stubs = buildings.map(b => {
    const cx = b.x + b.w / 2;
    return b.y > 600 ? `M${cx} 842V${b.y + b.h}` : `M${cx} 307V${b.y}`;
  }).join('');
  const walkway = `M555 935V842H217V307H957V842H555${stubs}`;
  const speed = (x, y) => `<g transform="translate(${x} ${y})"><circle r="30" fill="#fff" stroke="${C.red}" stroke-width="8"/>${text(0, 10, '10', { size: 28, weight: 800, fill: C.black, anchor: 'middle' })}</g>`;
  const stop = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-12 -29h24l17 17v24l-17 17h-24l-17-17v-24z" fill="${C.red}" stroke="#fff" stroke-width="3"/>${text(0, 6, 'STOP', { size: 13, weight: 800, fill: '#fff', anchor: 'middle' })}</g>`;
  const flows = `
${[[400, 250, 0], [800, 250, 0], [1020, 450, 90], [1020, 720, 90], [800, 900, 180], [350, 900, 180], [150, 700, 270], [150, 420, 270]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-26 -12h26v-14l30 26-30 26v-14h-26z" fill="${C.indigo}"/></g>`).join('')}
<path d="M585 1040V930" stroke="${C.indigo}" stroke-width="10" marker-end="url(#arrowI)"/>
<path d="M300 1010H555V935" fill="none" stroke="${C.green}" stroke-width="16" stroke-linejoin="round" opacity=".9"/>
<path d="M300 1010H555V935" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="14 12"/>
<path d="${walkway}" fill="none" stroke="${C.green}" stroke-width="16" stroke-linejoin="round" opacity=".9"/>
<path d="${walkway}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="14 12"/>
${zebra(555, 900, true)}
${speed(260, 250)}${speed(1020, 600)}${stop(640, 960)}
<g transform="translate(1040 960)">${picto('emergency', 'assembly', 0, 0, 64)}</g>
<g transform="translate(470 1060)"><circle r="16" fill="${C.red}" stroke="#fff" stroke-width="4"/></g>`;
  const side = `
${text(1150, 250, 'LÉGENDE', { size: 26, weight: 800, fill: C.black, spacing: 4 })}
<path d="M1150 300h70" stroke="${C.indigo}" stroke-width="12"/><path d="M1205 288l20 12-20 12z" fill="${C.indigo}"/>${text(1245, 309, 'Sens de circulation', { size: 23, weight: 400, fill: '#35383D' })}
<path d="M1150 360h70" stroke="${C.green}" stroke-width="16"/><path d="M1150 360h70" stroke="#fff" stroke-width="3" stroke-dasharray="10 8"/>${text(1245, 369, 'Cheminement piéton', { size: 23, weight: 400, fill: '#35383D' })}
<rect x="1150" y="385" width="70" height="70" fill="#BFC3C8"/><g transform="translate(1185 420)">${zebra(0, 0, false)}</g>${text(1245, 429, 'Traversée piétonne', { size: 23, weight: 400, fill: '#35383D' })}
${speed(1185, 490)}${text(1245, 499, 'Vitesse limitée 10 km/h', { size: 23, weight: 400, fill: '#35383D' })}
${stop(1185, 560)}${text(1245, 569, 'Arrêt obligatoire', { size: 23, weight: 400, fill: '#35383D' })}
${picto('emergency', 'assembly', 1155, 600, 60)}${text(1245, 639, 'Point de rassemblement', { size: 23, weight: 400, fill: '#35383D' })}
<circle cx="1185" cy="700" r="16" fill="${C.red}" stroke="#fff" stroke-width="4"/>${text(1245, 709, 'Vous êtes ici', { size: 23, weight: 400, fill: '#35383D' })}
<rect x="1150" y="760" width="380" height="2" fill="#000" opacity=".12"/>
${text(1150, 815, 'RÈGLES DU SITE', { size: 26, weight: 800, fill: C.black, spacing: 4 })}
${['Piétons : balisage vert uniquement', 'Engins : sens unique horaire', 'Gilet obligatoire hors bureaux'].map((l, i) => text(1150, 862 + i * 38, l, { size: 22, weight: 400, fill: '#35383D' })).join('')}`;
  const header = `<rect width="${W}" height="140" fill="${C.indigo}"/>
${text(70, 80, 'PLAN DE CIRCULATION', { size: 52, weight: 800, fill: '#fff', spacing: 2 })}
${text(72, 118, site, { size: 24, weight: 400, fill: '#fff', opacity: .8 })}
${text(1530, 90, k.name, { size: 34, weight: 800, fill: '#fff', anchor: 'end', spacing: 6 })}`;
  const defs = `<marker id="arrowI" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="3" markerHeight="3" orient="auto"><path d="M0 0 10 5 0 10z" fill="${C.indigo}"/></marker>`;
  return svg(W, H, `${base}${header}${flows}${side}
${text(70, 1100, `${k.name} · ${site} · Échelle indicative`, { size: 20, weight: 400, fill: '#80848A' })}`, defs);
}

// ------------------------------------------------------------------ catalogue
const files = {
  // 01 — bureaux
  'tesca-bureaux-01': plaque('tesca', { level: 'NIVEAU 1 · ADMINISTRATION', title: 'DIRECTION\nGÉNÉRALE', subtitle: 'Bureau de direction', number: '101' }),
  'tesca-bureaux-02': directory('tesca', { building: 'Administration', level: 'N1', rows: [{ dir: 'up', label: 'Direction générale', detail: 'Bureaux 101 – 104' }, { dir: 'left', label: 'Ressources humaines', detail: 'Bureau 105' }, { dir: 'right', label: 'Salle de réunion', detail: 'Salle 110' }, { dir: 'right', label: 'Méthodes & qualité', detail: 'Bureaux 111 – 114' }, { dir: 'down', label: 'Accueil · Sortie', detail: 'Rez-de-chaussée' }] }),
  'tesca-bureaux-03': plaque('tesca', { level: 'NIVEAU 1 · ADMINISTRATION', title: 'RESSOURCES\nHUMAINES', subtitle: 'Recrutement & formation', number: '105' }),
  'psc-bureaux-01': plaque('psc', { level: 'BÂTIMENT A · RDC', title: 'SALLE DE\nRÉUNION', subtitle: 'Capacité 12 personnes', number: 'A02' }),
  'psc-bureaux-02': directory('psc', { building: 'Bâtiment A', level: 'RDC', rows: [{ dir: 'right', label: 'Accueil', detail: 'Visiteurs & livraisons' }, { dir: 'up', label: 'Direction', detail: 'Niveau 1' }, { dir: 'left', label: 'Service achats', detail: 'Bureaux A04 – A06' }, { dir: 'left', label: 'Salle de réunion', detail: 'A02' }, { dir: 'down', label: 'Sortie', detail: 'Parking visiteurs' }] }),
  'socohuile-bureaux-01': plaque('socohuile', { level: 'BLOC ADMINISTRATIF', title: 'DIRECTION', subtitle: 'Direction générale', number: '01' }),
  'socohuile-bureaux-02': plaque('socohuile', { level: 'BLOC ADMINISTRATIF', title: 'SERVICE\nCOMMERCIAL', subtitle: 'Ventes & export', number: '04' }),
  'socohuile-bureaux-03': directory('socohuile', { building: 'Bloc administratif', level: 'RDC', rows: [{ dir: 'up', label: 'Direction', detail: 'Bureau 01' }, { dir: 'right', label: 'Service commercial', detail: 'Bureaux 03 – 05' }, { dir: 'left', label: 'Comptabilité', detail: 'Bureau 06' }, { dir: 'left', label: 'Laboratoire qualité', detail: 'Accès production' }, { dir: 'down', label: 'Accueil · Sortie', detail: 'Cour principale' }] }),

  // 02 — locaux techniques
  'tesca-locaux-01': technicalDoor('tesca', { code: 'LT-01', title: 'LOCAL\nÉLECTRIQUE', subtitle: 'TGBT · Tableau général basse tension', pictos: [['warning', 'electric'], ['prohibition', 'entry'], ['prohibition', 'water']] }),
  'tesca-locaux-02': technicalDoor('tesca', { code: 'LT-04', title: 'LOCAL\nCOMPRESSEURS', subtitle: 'Air comprimé · Zone bruyante', pictos: [['warning', 'pressure'], ['mandatory', 'ears'], ['prohibition', 'entry']] }),
  'psc-locaux-01': technicalDoor('psc', { code: 'LT-02', title: 'CHAUFFERIE', subtitle: 'Chaudière gaz · Accès réglementé', pictos: [['warning', 'hot'], ['warning', 'flame'], ['prohibition', 'smoking']] }),
  'psc-locaux-02': technicalDoor('psc', { code: 'LT-05', title: 'GROUPE\nÉLECTROGÈNE', subtitle: 'Secours électrique · Carburant', pictos: [['warning', 'electric'], ['mandatory', 'ears'], ['prohibition', 'smoking']] }),
  'socohuile-locaux-01': technicalDoor('socohuile', { code: 'LT-01', title: 'LOCAL POMPES\nINCENDIE', subtitle: 'Réseau RIA · Surpresseur', pictos: [['fire', 'extinguisher'], ['warning', 'electric'], ['prohibition', 'entry']] }),
  'socohuile-locaux-02': technicalDoor('socohuile', { code: 'LT-03', title: 'CHAUFFERIE', subtitle: 'Production de vapeur', pictos: [['warning', 'hot'], ['warning', 'pressure'], ['mandatory', 'gloves']] }),

  // 03 — risques spécifiques par local
  'tesca-risques-01': riskPoster('tesca', { room: 'Atelier de coupe', reference: 'RS-02 · Rév. 01', dangers: [['general', 'Lames tranchantes'], ['forklift', 'Engins'], ['flame', 'Textiles inflammables']], obligations: [['gloves', 'Gants anti-coupure'], ['boots', 'Chaussures'], ['vest', 'Gilet']], prohibitions: [['smoking', 'Fumer'], ['phone', 'Téléphone'], ['entry', 'Accès non autorisé']], emergency: ['Arrêt d’urgence machine', 'Alerter le chef d’équipe', 'Premiers secours : poste 15'] }),
  'tesca-risques-02': riskPoster('tesca', { room: 'Local compresseurs', reference: 'RS-04 · Rév. 01', dangers: [['pressure', 'Air sous pression'], ['electric', 'Électricité'], ['hot', 'Surfaces chaudes']], obligations: [['ears', 'Protection auditive'], ['glasses', 'Lunettes'], ['gloves', 'Gants']], prohibitions: [['entry', 'Accès non autorisé'], ['smoking', 'Fumer']], emergency: ['Couper l’alimentation', 'Évacuer le local', 'Prévenir la maintenance'] }),
  'psc-risques-01': riskPoster('psc', { room: 'Local électrique', reference: 'RS-01 · Rév. 02', dangers: [['electric', 'Électrocution'], ['flame', 'Incendie'], ['general', 'Arc électrique']], obligations: [['gloves', 'Gants isolants'], ['glasses', 'Écran facial'], ['boots', 'Chaussures isolantes']], prohibitions: [['entry', 'Personnel non habilité'], ['water', 'Eau'], ['smoking', 'Fumer']], emergency: ['Ne pas toucher la victime', 'Couper le courant', 'Appeler le 190'] }),
  'psc-risques-02': riskPoster('psc', { room: 'Atelier maintenance', reference: 'RS-03 · Rév. 01', dangers: [['general', 'Projections'], ['hot', 'Points chauds'], ['slip', 'Glissade']], obligations: [['glasses', 'Lunettes'], ['gloves', 'Gants'], ['boots', 'Chaussures']], prohibitions: [['smoking', 'Fumer'], ['phone', 'Téléphone']], emergency: ['Arrêter la machine', 'Sécuriser la zone', 'Alerter le responsable'] }),
  'socohuile-risques-01': riskPoster('socohuile', { room: 'Stockage d’huile', reference: 'RS-01 · Rév. 01', dangers: [['slip', 'Sol glissant'], ['flame', 'Incendie'], ['forklift', 'Chariots']], obligations: [['boots', 'Chaussures antidérapantes'], ['vest', 'Gilet'], ['gloves', 'Gants']], prohibitions: [['smoking', 'Fumer'], ['flame', 'Flamme nue'], ['water', 'Eau sur feu d’huile']], emergency: ['Isoler la fuite', 'Absorber et baliser', 'Extincteur à poudre'] }),
  'socohuile-risques-02': riskPoster('socohuile', { room: 'Laboratoire qualité', reference: 'RS-05 · Rév. 01', dangers: [['chemical', 'Produits chimiques'], ['hot', 'Plaques chauffantes'], ['general', 'Verrerie']], obligations: [['glasses', 'Lunettes'], ['gloves', 'Gants nitrile'], ['vest', 'Blouse']], prohibitions: [['smoking', 'Fumer'], ['entry', 'Accès non autorisé']], emergency: ['Rincer 15 minutes', 'Consulter la FDS', 'Appeler le 190'] }),
  'socohuile-risques-03': riskPoster('socohuile', { room: 'Chaufferie', reference: 'RS-03 · Rév. 01', dangers: [['hot', 'Vapeur brûlante'], ['pressure', 'Pression'], ['flame', 'Combustible']], obligations: [['gloves', 'Gants thermiques'], ['ears', 'Protection auditive'], ['glasses', 'Lunettes']], prohibitions: [['entry', 'Accès non autorisé'], ['smoking', 'Fumer']], emergency: ['Arrêt chaudière', 'Fermer l’arrivée gaz', 'Évacuer et alerter'] }),

  // 04 — plans de circulation
  'tesca-circulation-01': circulationPlan('tesca', { site: 'Site de production', buildings: [{ x: 250, y: 330, w: 280, h: 200, label: 'Coupe' }, { x: 640, y: 330, w: 290, h: 200, label: 'Couture' }, { x: 250, y: 640, w: 230, h: 180, label: 'Stock tissus' }, { x: 700, y: 640, w: 230, h: 180, label: 'Expédition' }] }),
  'psc-circulation-01': circulationPlan('psc', { site: 'Plateforme logistique', buildings: [{ x: 250, y: 330, w: 680, h: 190, label: 'Entrepôt principal' }, { x: 250, y: 640, w: 240, h: 180, label: 'Atelier' }, { x: 700, y: 640, w: 230, h: 180, label: 'Quai de chargement' }] }),
  'socohuile-circulation-01': circulationPlan('socohuile', { site: 'Usine de conditionnement', buildings: [{ x: 250, y: 330, w: 250, h: 200, label: 'Réception' }, { x: 610, y: 330, w: 320, h: 200, label: 'Cuves de stockage' }, { x: 250, y: 640, w: 300, h: 180, label: 'Conditionnement' }, { x: 700, y: 640, w: 230, h: 180, label: 'Produits finis' }] }),

  // 04 — plans d’évacuation
  'tesca-evacuation-01': evacuationPlan('tesca', { level: 'Bâtiment administratif · Niveau 1', rooms: { top: [{ w: .22, label: 'Direction' }, { w: .2, label: 'RH' }, { w: .3, label: 'Open space' }, { w: .28, label: 'Réunion' }], bottom: [{ w: .25, label: 'Méthodes' }, { w: .25, label: 'Qualité' }, { w: .2, label: 'Archives' }, { w: .3, label: 'Sanitaires' }] } }),
  'psc-evacuation-01': evacuationPlan('psc', { level: 'Bâtiment A · Rez-de-chaussée', rooms: { top: [{ w: .3, label: 'Accueil' }, { w: .2, label: 'Achats' }, { w: .2, label: 'Comptabilité' }, { w: .3, label: 'Direction' }], bottom: [{ w: .35, label: 'Salle de réunion' }, { w: .2, label: 'Archives' }, { w: .45, label: 'Salle de pause' }] } }),
  'socohuile-evacuation-01': evacuationPlan('socohuile', { level: 'Bloc administratif · Rez-de-chaussée', rooms: { top: [{ w: .25, label: 'Direction' }, { w: .25, label: 'Commercial' }, { w: .2, label: 'Comptabilité' }, { w: .3, label: 'Laboratoire' }], bottom: [{ w: .3, label: 'Accueil' }, { w: .3, label: 'Réunion' }, { w: .4, label: 'Vestiaires' }] } })
};

// "before" versions for the before / after comparisons
for (const id of Object.keys(files)) {
  const [client, kind] = id.split('-');
  if (kind === 'circulation') {
    const spec = { tesca: 0, psc: 1, socohuile: 2 }[client];
    const args = [
      { site: 'Site de production', buildings: [{ x: 250, y: 330, w: 280, h: 200, label: 'Coupe' }, { x: 640, y: 330, w: 290, h: 200, label: 'Couture' }, { x: 250, y: 640, w: 230, h: 180, label: 'Stock tissus' }, { x: 700, y: 640, w: 230, h: 180, label: 'Expédition' }] },
      { site: 'Plateforme logistique', buildings: [{ x: 250, y: 330, w: 680, h: 190, label: 'Entrepôt principal' }, { x: 250, y: 640, w: 240, h: 180, label: 'Atelier' }, { x: 700, y: 640, w: 230, h: 180, label: 'Quai de chargement' }] },
      { site: 'Usine de conditionnement', buildings: [{ x: 250, y: 330, w: 250, h: 200, label: 'Réception' }, { x: 610, y: 330, w: 320, h: 200, label: 'Cuves de stockage' }, { x: 250, y: 640, w: 300, h: 180, label: 'Conditionnement' }, { x: 700, y: 640, w: 230, h: 180, label: 'Produits finis' }] }
    ][spec];
    files[`${id}-avant`] = circulationPlan(client, { ...args, before: true });
  }
}
files['tesca-evacuation-01-avant'] = evacuationPlan('tesca', { level: 'Niveau 1', before: true, rooms: { top: [{ w: .22, label: 'Direction' }, { w: .2, label: 'RH' }, { w: .3, label: 'Open space' }, { w: .28, label: 'Réunion' }], bottom: [{ w: .25, label: 'Méthodes' }, { w: .25, label: 'Qualité' }, { w: .2, label: 'Archives' }, { w: .3, label: 'Sanitaires' }] } });
files['psc-evacuation-01-avant'] = evacuationPlan('psc', { level: 'Rez-de-chaussée', before: true, rooms: { top: [{ w: .3, label: 'Accueil' }, { w: .2, label: 'Achats' }, { w: .2, label: 'Comptabilité' }, { w: .3, label: 'Direction' }], bottom: [{ w: .35, label: 'Salle de réunion' }, { w: .2, label: 'Archives' }, { w: .45, label: 'Salle de pause' }] } });
files['socohuile-evacuation-01-avant'] = evacuationPlan('socohuile', { level: 'Rez-de-chaussée', before: true, rooms: { top: [{ w: .25, label: 'Direction' }, { w: .25, label: 'Commercial' }, { w: .2, label: 'Comptabilité' }, { w: .3, label: 'Laboratoire' }], bottom: [{ w: .3, label: 'Accueil' }, { w: .3, label: 'Réunion' }, { w: .4, label: 'Vestiaires' }] } });

for (const [name, content] of Object.entries(files)) writeFileSync(join(OUT, `${name}.svg`), content);
console.log(`${Object.keys(files).length} mockups → assets/mockups/`);
