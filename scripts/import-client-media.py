"""Prépare des aperçus web sans modifier les fichiers fournis dans assets/.

Classement établi après lecture visuelle de chaque image et de chaque PDF.
La présentation est personnalisée pour TESCA : les supports d'autres sites
(PSI et SOCOHUILE) et les panneaux bilingues sans logo sont écartés, mais
restent tracés dans « excluded » avec leur motif.

Sont publiés : l'identification des bureaux, la livraison du 23 septembre 2026
(cinq recueils PDF) et les trois plans du site. Chaque recueil alimente le type
qui porte son nom : ses pages ne sont jamais réparties dans un autre type.

Les supports TESCA sont répartis en cinq types :
  tesca-services, tesca-bureaux  identification des bureaux
  tesca-locaux-techniques ...... identification des locaux techniques
  tesca-sst, tesca-sensibilisation  affichage SST lié aux activités
  tesca-urgence ................ maîtrise des situations d'urgence
  tesca-circulation, tesca-evacuation  plans de circulation et d'évacuation
"""
from pathlib import Path
import hashlib
import io
import json
import shutil
import sys
import fitz
from PIL import Image, ImageOps

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path(__file__).resolve().parents[1]
records = []


def add(source, client, project, name, caption, type='poster', zone=None, kind='artwork', **extra):
    records.append(dict(source=source, client=client, project=project, name=name,
                        caption=caption, type=type, kind=kind, **({'zone': zone} if zone else {}), **extra))


def tesca(number, project, name, caption, **kwargs):
    add(f'tesca_{number:02d}.png', 'tesca', f'tesca-{project}', name, caption, **kwargs)


# --------------------------------------------------------------- 01 · bureaux
# Supports de septembre : leurs originaux ont été retirés du poste, les aperçus font foi.
# Sept plaques de services sur une même image : l'ensemble, puis chaque plaque découpée.
PLATES = '1000021908.jpg'
add(PLATES, 'tesca', 'tesca-services', 'plaques-services', 'Gamme de plaques · Sept services TESCA', type='plaque')
for name, caption, box in [
    ('plaque-direction', 'Direction', (44, 60, 704, 270)),
    ('plaque-finance', 'Finance', (744, 60, 1409, 270)),
    ('plaque-industrialisation', 'Industrialisation', (45, 314, 704, 523)),
    ('plaque-qualite', 'Qualité', (745, 314, 1410, 523)),
    ('plaque-ressources-humaines', 'Ressources humaines', (45, 567, 704, 777)),
    ('plaque-manufacturing', 'Manufacturing & Supply Chain', (744, 567, 1410, 777)),
    ('plaque-achats', 'Achats & Supply Chain', (376, 815, 1074, 1028)),
]:
    add(PLATES, 'tesca', 'tesca-services', name, f'Plaque de porte · {caption}', type='plaque', crop=box)


# ------------------------------------------------------- 02 · locaux techniques
# Livraison du 23 septembre 2026 : neuf panneaux en haute définition, au logo KeySafe
# uniforme. Ils remplacent les huit panneaux précédents, dont les aperçus restent sur le poste.
LOCAUX = 'Identification des locaux techniques.pdf'
for page, name, caption, spec in [
    (3, 'panneau-atelier-retordage', 'Atelier de retordage', 'Machines de retordage'),
    (0, 'panneau-laboratoire', 'Laboratoire', 'Analyses et contrôles'),
    (5, 'panneau-laboratoire-step', 'Laboratoire STEP', 'Contrôles de la station de traitement'),
    (6, 'panneau-medecine-travail', 'Local médecine du travail', 'Suivi médical et premiers soins'),
    (4, 'panneau-compresseurs', 'Local compresseurs', 'Production d’air comprimé'),
    (7, 'panneau-traitement-air', 'Centrale de traitement d’air', 'Ventilation et climatisation'),
    (1, 'panneau-dechets-dangereux', 'Local déchets dangereux', 'Stockage des déchets dangereux'),
    (8, 'panneau-monte-charge', 'Monte-charge', 'Transport de charges entre niveaux'),
    (2, 'panneau-loge-gardien', 'Loge gardien', 'Accueil et contrôle des accès'),
]:
    add(LOCAUX, 'tesca', 'tesca-locaux-techniques', name, f'Panneau · {caption}', type='door', spec=spec, page=page)

# ------------------------------------ 05 · plans de circulation et d'évacuation
add('tesca plan 3.pdf', 'tesca', 'tesca-circulation', 'circulation-site-ttg',
    'Plan de circulation · Site TTG', type='circulation')
# Plan d'évacuation présenté comme modèle : il a été réalisé pour le site PSC, la trame est la même.
add('PE Admin RDC.pdf', 'tesca', 'tesca-evacuation', 'evacuation-administration-rdc',
    'Plan d’évacuation · Administration RDC', type='evacuation',
    note='Modèle similaire réalisé pour le site PSC.')

# 04 · ce qu'il faut faire, puis qui commande, avant les listes nominatives (déposés le 24 septembre 2026).
add('tesca-consignes-generales-urgence.jpg', 'tesca', 'tesca-urgence', 'consignes-generales-urgence',
    'Consignes générales · Incendie, accident, évacuation', zone='secours', kind='template',
    note='Gabarit à renseigner : numéros d’alerte et point de rassemblement.')
add('tesca-organigramme-secours.jpg', 'tesca', 'tesca-urgence', 'organigramme-secours',
    'Organigramme de secours · Chaîne de commandement', zone='secours')

# -------------------------------------- 03 · affichage SST lié aux activités
# Les trois recueils « Affichage SST lié aux activités » forment ce type, page par page.
AFFICHES = 'Affichage SST lié aux activités (3).pdf'
CONSIGNES = 'Affichage SST lié aux activités.pdf'
TTG = 'Affichage SST lié aux activités (2).pdf'
SECOURISTES = 'Affichage relatif à la maîtrise des situations d’urgence2.pdf'
for source, page, project, name, caption, zone in [
    (AFFICHES, 6, 'sst', 'consignes-escalier', 'Escaliers · Tenir la rampe', 'escaliers'),
    (AFFICHES, 2, 'sst', 'ergonomie-bureau', 'Bureaux · Ergonomie du poste de travail', 'bureaux'),
    (AFFICHES, 8, 'sst', 'armoire-electrique', 'Armoire électrique · Danger d’électrocution', 'electrique'),
    (AFFICHES, 7, 'sst', 'medecine-travail', 'Médecine du travail · Consignes du local', 'medical'),
    (CONSIGNES, 1, 'sst', 'laboratoire-securite', 'Laboratoire · Consignes de sécurité', 'laboratoire'),
    (CONSIGNES, 2, 'sst', 'monte-charge-utilisation', 'Monte-charge · Consignes d’exploitation', 'montecharge'),
    (TTG, 0, 'sst', 'consignes-site-ttg', 'Site TTG · Consignes générales de sécurité', 'site'),
    (TTG, 1, 'sst', 'monte-charge-securite', 'Monte-charge · Consignes du site TTG', 'montecharge'),
    (TTG, 2, 'sst', 'laboratoire-epi', 'Laboratoire · Accès, EPI et risques', 'laboratoire'),
    (AFFICHES, 9, 'sst', 'utilisation-extincteur', 'Incendie · Utilisation d’un extincteur', 'incendie'),
    (CONSIGNES, 0, 'sst', 'laboratoire-deversement', 'Laboratoire · Déversement de produits chimiques', 'laboratoire'),
    (AFFICHES, 0, 'sst', 'premiers-secours', 'Premiers secours · Procédure générale de secourisme', 'secours'),
    # 04 · le recueil des secouristes forme à lui seul le type « situations d'urgence »
    (SECOURISTES, 2, 'urgence', 'liste-secouristes-administration', 'Secouristes & agents incendie · Administration', 'secours'),
    (SECOURISTES, 0, 'urgence', 'liste-secouristes-tissage', 'Secouristes & agents incendie · Tissage', 'secours'),
    (SECOURISTES, 1, 'urgence', 'liste-secouristes-finition', 'Secouristes & agents incendie · Finition', 'secours'),
]:
    add(source, 'tesca', f'tesca-{project}', name, caption, zone=zone, page=page)
for page, name, caption, zone in [
    (5, 'energie-bureaux', 'Énergie · Économiser la consommation', 'environnement'),
    (4, 'impressions-responsables', 'Bureaux · Des impressions responsables', 'environnement'),
    (3, 'reunion-bonnes-pratiques', 'Réunions · Les bonnes pratiques', 'bureaux'),
    (1, 'tri-dechets', 'Environnement · Trier les déchets', 'environnement'),
]:
    add(AFFICHES, 'tesca', 'tesca-sensibilisation', name, caption, zone=zone, page=page)

# Visuel déposé le 24 septembre 2026 pour le type 03.
add('tesca-incompatibilites-chimiques.jpg', 'tesca', 'tesca-sst', 'incompatibilites-chimiques',
    'Produits chimiques · Tableau des incompatibilités', zone='stockage',
    note='Conforme au référentiel SGH/CLP.')
# Le QR code ferme le type 04, après les listes nominatives.
add('tesca-liste-secouristes-qr.jpg', 'tesca', 'tesca-urgence', 'liste-secouristes-qr',
    'Secouristes & incendie · Administration, accès par QR code', zone='secours',
    lossless=True, note='Scanner le QR code pour appeler. Ouvrir en grand pour le lire.')

# ------------------------------------------------------------ hors périmètre
# Fichiers conservés sur disque, volontairement absents de la présentation TESCA.
PSI = 'Photographies du site PSI : hors présentation TESCA.'
SOCOHUILE = 'Supports du site SOCOHUILE : hors présentation TESCA.'
BILINGUE = 'Panneau bilingue sans logo, non attribué : hors présentation TESCA.'
excluded = {}
for stamp in ['10.33.37', '10.33.38', '10.33.40', '10.33.41 (1)', '10.33.41', '10.33.42',
              '10.34.39', '10.34.40', '10.34.40 (1)']:
    excluded[f'WhatsApp Image 2026-09-17 at {stamp}.jpeg'] = PSI
for source in ['a0_01.png', 'Affiche de sécurité entrée principale A0 x1.pdf', 'Chariot elevateur A1 x1.pdf',
               'ergonomie bureautique A3 x2.pdf', 'Escalier A3 x8 1.pdf', 'hygiene du personnel A3 x5.pdf',
               'Lavage des mains A3 x5.pdf', 'manutention manuelle A3 x 3.pdf', 'Numeros durgence A3 x3.pdf']:
    excluded[source] = SOCOHUILE
for number in range(1, 7):
    excluded[f'a4_{number:02d}.png'] = BILINGUE

# Livraison du 23 septembre 2026 : recueils PDF multipages, tracés en attendant l'arbitrage
# (versions au logo KeySafe uniforme de supports déjà publiés + supports inédits).
pending = {}

duplicates = {'TESCA_Page_003 (1).pdf': 'TESCA_Page_003.pdf'}

# Même visuel réexporté (fichiers différents, image identique à l'œil) : non répété dans la galerie.
equivalents = {
    '1000021909.jpg': 'ChatGPT Image 17 sept. 2026, 14_19_22 (5).png',
    '1000021910.jpg': 'ChatGPT Image 17 sept. 2026, 14_19_21 (1).png'
}
# Première version d'un support, remplacée par la version corrigée : non affichée.
replaced = {'1000021905.jpg': 'ChatGPT Image 18 sept. 2026, 11_31_25.png'}

# Un fichier seulement tracé (doublon, réexport, version remplacée, hors périmètre, en attente)
# peut avoir été retiré du poste : on ne le réclame pas, on signale simplement sa disparition.
gone = []
for table in (duplicates, equivalents, replaced, excluded, pending):
    for source in list(table):
        if not (ROOT/'assets'/source).exists():
            gone.append(source)
            del table[source]

for duplicate, original in duplicates.items():
    assert (ROOT/'assets'/duplicate).read_bytes() == (ROOT/'assets'/original).read_bytes(), duplicate

for copy, original in equivalents.items():
    with Image.open(ROOT/'assets'/copy) as a, Image.open(ROOT/'assets'/original) as b:
        small = [ImageOps.exif_transpose(x).convert('L').resize((300, 212)) for x in (a, b)]
    diff = sum(abs(p - q) for p, q in zip(small[0].tobytes(), small[1].tobytes())) / (300 * 212)
    assert diff < 2, f'{copy} diffère de {original} ({diff:.2f})'

kept = []
for rec in records:
    source = ROOT / 'assets' / rec['source']
    if not source.exists():
        # Original retiré du poste : les aperçus déjà générés font foi.
        folder = ROOT / 'assets' / 'photos' / rec['client']
        preview, big = folder / f'{rec["name"]}.webp', folder / f'{rec["name"]}-grand.webp'
        assert preview.exists(), f'Original absent et aperçu introuvable : {rec["source"]} → {rec["name"]}'
        rec['src'] = preview.relative_to(ROOT).as_posix()
        if big.exists():
            rec['full'] = big.relative_to(ROOT).as_posix()
        with Image.open(big if big.exists() else preview) as im:
            rec['width'], rec['height'] = im.size
        document = ROOT / 'assets' / 'documents' / rec['client'] / f'{rec["name"]}.pdf'
        if document.exists():
            rec['document'] = document.relative_to(ROOT).as_posix()
        kept.append(rec['source'])
        continue
    if source.suffix.lower() == '.pdf':
        with fitz.open(source) as doc:
            assert rec.get('page', 0) < len(doc), f'Page absente : {source.name}'
            page = doc[rec.get('page', 0)]
            scale = min(2800 / page.rect.width, 2800 / page.rect.height)
            pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
            im = Image.frombytes('RGB', [pix.width, pix.height], pix.samples)
    else:
        with Image.open(source) as raw:
            im = ImageOps.exif_transpose(raw).convert('RGB')
    if rec.get('crop'):
        left, top, right, bottom = rec['crop']
        pad = 22
        im = im.crop((max(0, left - pad), max(0, top - pad), min(im.width, right + pad), min(im.height, bottom + pad)))
    rec['width'], rec['height'] = im.size
    folder = ROOT / 'assets' / 'photos' / rec['client']
    folder.mkdir(parents=True, exist_ok=True)
    for size, suffix, key, quality in [(1120, '', 'src', 88), (2800, '-grand', 'full', 94)]:
        resized = im.copy()
        resized.thumbnail((size, size), Image.Resampling.LANCZOS)
        target = folder / f'{rec["name"]}{suffix}.webp'
        # Les affiches avec QR code gardent un export sans perte, notamment en grand format.
        resized.save(target, 'WEBP', quality=quality, method=6, lossless=rec.get('lossless', False))
        rec[key] = target.relative_to(ROOT).as_posix()
    pdf_name = rec.get('pdfSource') or (rec['source'] if source.suffix.lower() == '.pdf' else None)
    if pdf_name:
        target = ROOT / 'assets' / 'documents' / rec['client'] / f'{rec["name"]}.pdf'
        target.parent.mkdir(parents=True, exist_ok=True)
        if 'page' in rec:
            # Recueil multipage : chaque support reçoit sa page, ré-encodée pour l'impression
            # (170 dpi) afin que le document reste raisonnable à télécharger.
            with fitz.open(ROOT / 'assets' / pdf_name) as src:
                sheet_size = src[rec['page']].rect
                shot = src[rec['page']].get_pixmap(dpi=170)
                buffer = io.BytesIO()
                Image.frombytes('RGB', [shot.width, shot.height], shot.samples).save(buffer, 'JPEG', quality=82)
            with fitz.open() as one:
                sheet = one.new_page(width=sheet_size.width, height=sheet_size.height)
                sheet.insert_image(sheet.rect, stream=buffer.getvalue())
                one.save(target, garbage=4, deflate=True)
        else:
            shutil.copy2(ROOT / 'assets' / pdf_name, target)
        rec['document'] = target.relative_to(ROOT).as_posix()
    rec['sha256'] = hashlib.sha256(source.read_bytes()).hexdigest()

provided = {p.name for p in (ROOT/'assets').iterdir() if p.suffix.lower() in {'.png', '.jpg', '.jpeg', '.pdf'} and p.is_file()}
covered = ({r['source'] for r in records} | {r['pdfSource'] for r in records if 'pdfSource' in r}
           | set(duplicates) | set(equivalents) | set(replaced) | set(excluded) | set(pending))
assert provided <= covered, f'Fichiers non classés : {provided-covered}'
catalogue = {'records': records, 'duplicates': duplicates, 'equivalents': equivalents, 'replaced': replaced,
             'excluded': excluded, 'pending': pending, 'sourceCount': len(provided)}
(ROOT/'sources'/'imported-media.json').write_text(json.dumps(catalogue, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(f'{len(provided)} fichiers examinés → {len(records)} visuels TESCA, '
      f'{sum("document" in r for r in records)} PDF accessibles, {len(excluded)} fichiers hors périmètre, '
      f'{len(pending)} recueils en attente d’intégration, '
      f'{len(duplicates) + len(equivalents)} doublons et {len(replaced)} version remplacée conservés sur disque.')
if gone:
    print(f'{len(gone)} fichiers seulement tracés ont disparu du poste : retirés du catalogue.')
if kept:
    print(f'{len(set(kept))} originaux retirés du poste : leurs aperçus déjà générés sont conservés tels quels.')
