"""Prépare des aperçus web sans modifier les fichiers fournis dans assets/.

Classement établi après lecture visuelle de chaque image et de chaque PDF.
Les deux doublons et les deux formats de l'affiche SOCOHUILE restent tracés.
Livraison du 18 septembre 2026 : les sept plaques de services TESCA (une image
d'ensemble découpée en plaques), huit panneaux illustrés de locaux TESCA et
l'affiche de consignes de l'atelier de retordage (seconde version retenue).
"""
from pathlib import Path
import hashlib
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

tesca(7, 'bureaux', 'bureau-magasinier', 'Plaque de porte · Bureau magasinier', type='plaque')
tesca(11, 'bureaux', 'direction-finance-rh', 'Directoire · Direction générale, Finance et Ressources humaines', type='directory')
add('TESCA_Page_002.pdf', 'tesca', 'tesca-bureaux', 'loge-gardien', 'Tableau d’informations · Loge gardien',
    type='directory', kind='template', note='Gabarit de tableau avec quatre emplacements pour documents A4.')

for number, name, caption, spec in [
    (4, 'atelier-maintenance', 'Atelier maintenance', 'Identification de l’atelier'),
    (5, 'magasin-pdr', 'Magasin PDR', 'Identification du magasin de pièces de rechange'),
    (6, 'local-dechets', 'Local déchets', 'Repérage de la zone de collecte'),
    (8, 'cuisine-preparation', 'Cuisine de préparation', 'Identification de l’espace de préparation'),
    (9, 'magasin-produits-chimiques', 'Magasin produits chimiques', 'Identification du stockage des produits chimiques'),
    (10, 'production', 'Production', 'Repérage de la zone de production'),
]:
    tesca(number, 'locaux', name, f'Plaque · {caption}', type='door', spec=spec)

# Panneaux illustrés : le nom du local et l'équipement qu'il abrite.
for source, name, caption, spec in [
    ('ChatGPT Image 18 sept. 2026, 11_26_14.png', 'panneau-atelier-retordage', 'Atelier de retordage', 'Machines de retordage'),
    ('TESCA_Page_005.jpg', 'panneau-laboratoire-analyses', 'Laboratoire (analyses)', 'Laboratoire d’analyses'),
    ('TESCA_Page_022.jpg', 'panneau-laboratoire-essais', 'Laboratoire (essais textiles)', 'Essais qualité des textiles'),
    ('TESCA_Page_002.jpg', 'panneau-local-medical', 'Local médical', 'Premiers soins'),
    ('TESCA_Page_009.jpg', 'panneau-compresseurs', 'Local compresseurs', 'Production d’air comprimé'),
    ('TESCA_Page_016.jpg', 'panneau-traitement-air', 'Centrale de traitement d’air', 'Ventilation et climatisation'),
    ('TESCA_Page_020.jpg', 'panneau-dechets-dangereux', 'Local déchets dangereux', 'Stockage des déchets dangereux'),
    ('TESCA_Page_021.jpg', 'panneau-loge-gardien', 'Loge gardien', 'Accueil et contrôle des accès'),
]:
    add(source, 'tesca', 'tesca-panneaux-locaux', name, f'Panneau · {caption}', type='door', spec=spec)

tesca(1, 'circulation', 'circulation-entrepot', 'Plan de circulation · Entrepôt', type='circulation')
tesca(2, 'evacuation', 'evacuation-entrepot', 'Plan d’évacuation · Entrepôt', type='evacuation')
tesca(3, 'evacuation', 'evacuation-administration', 'Plan d’évacuation · Administration', type='evacuation')

for number, name, caption, zone in [
    (12, 'consignes-escalier', 'Escaliers · Tenir la rampe', 'escaliers'),
    (13, 'consignes-chariots', 'Chariots élévateurs · Règles de conduite', 'circulation'),
    (14, 'utilisation-extincteur', 'Incendie · Utilisation d’un extincteur', 'incendie'),
    (15, 'consignes-entrepot', 'Entrepôt · Dangers, interdictions et EPI', 'stockage'),
]:
    tesca(number, 'risques', name, caption, zone=zone)
# Seconde version de l'affiche (machine de retordage) ; la première reste sur disque.
add('ChatGPT Image 18 sept. 2026, 11_31_25.png', 'tesca', 'tesca-risques', 'atelier-retordage-consignes',
    'Atelier de retordage · Risques mécaniques', zone='atelier')

for number, name, caption, zone in [
    (1, 'consignes-site-ttg', 'Site TTG · Consignes générales de sécurité', 'site'),
    (3, 'laboratoire-deversement', 'Laboratoire · Déversement de produits chimiques', 'laboratoire'),
    (4, 'laboratoire-securite', 'Laboratoire · Consignes de sécurité', 'laboratoire'),
    (5, 'manutention-manuelle', 'Manutention · Technique de levage', 'manutention'),
    (6, 'armoire-electrique', 'Armoire électrique · Danger d’électrocution', 'electrique'),
    (7, 'premiers-secours', 'Premiers secours · Conduite à tenir', 'secours'),
    (8, 'laboratoire-epi', 'Laboratoire · Équipements de protection', 'laboratoire'),
    (11, 'ergonomie-bureau', 'Bureaux · Ergonomie du poste de travail', 'bureaux'),
    (12, 'monte-charge-utilisation', 'Monte-charge · Consignes d’utilisation', 'montecharge'),
    (13, 'monte-charge-securite', 'Monte-charge · Dangers et obligations', 'montecharge'),
]:
    add(f'TESCA_Page_{number:03d}.pdf', 'tesca', 'tesca-risques', name, caption, zone=zone, kind='pdf')
    if name == 'premiers-secours':
        add('liste.png', 'tesca', 'tesca-risques', 'liste-secouristes-administration',
            'Liste des secouristes · Administration · QR code', zone='secours', lossless=True,
            note='Affiche de l’administration avec QR code. Ouvrir en grand pour le scanner.')

for source, name, caption, zone in [
    ('ChatGPT Image 17 sept. 2026, 14_19_21 (1).png', 'energie-paysage', 'Énergie · Économiser au quotidien, format paysage', 'environnement'),
    ('ChatGPT Image 17 sept. 2026, 14_19_21 (2).png', 'impressions-responsables', 'Bureaux · Des impressions responsables', 'environnement'),
    ('ChatGPT Image 17 sept. 2026, 14_19_21 (3).png', 'energie-bureaux', 'Bureaux · Réduire la consommation d’énergie', 'environnement'),
    ('ChatGPT Image 17 sept. 2026, 14_19_22 (4).png', 'reunion-bonnes-pratiques', 'Réunions · Les bonnes pratiques', 'bureaux'),
    ('ChatGPT Image 17 sept. 2026, 14_19_22 (5).png', 'tri-dechets', 'Environnement · Trier les déchets', 'environnement'),
    ('WhatsApp Image 2026-09-17 at 12.31.52.jpeg', 'reunion-variante', 'Réunions · Variante du support', 'bureaux'),
]:
    add(source, 'tesca', 'tesca-sensibilisation', name, caption, zone=zone)

# Identifiant historique psc conservé pour les liens existants ; les supports portent PSI.
for stamp, project, name, caption, type, zone in [
    ('10.33.37', 'risques', 'secours-pose', 'Premiers secours · Affiche posée', 'poster', 'secours'),
    ('10.33.38', 'risques', 'chariots-pose', 'Chariots élévateurs · Affiche posée', 'poster', 'circulation'),
    ('10.33.40', 'risques', 'securite-incendie-pose', 'Consignes générales et extincteurs · Affiches posées', 'poster', 'incendie'),
    ('10.33.41 (1)', 'circulation', 'circulation-site-pose', 'Plan de circulation et consignes du site · Panneaux posés', 'circulation', None),
    ('10.33.41', 'evacuation', 'evacuation-atelier-1-pose', 'Plan d’évacuation · Atelier n° 1', 'evacuation', None),
    ('10.33.42', 'risques', 'atelier-1-pose', 'Atelier 1 · Dangers, interdictions et EPI', 'poster', 'atelier'),
    ('10.34.39', 'risques', 'ergonomie-pose', 'Bureaux · Affiche d’ergonomie posée', 'poster', 'bureaux'),
    ('10.34.40', 'risques', 'escalier-pose', 'Escaliers · Affiche posée', 'poster', 'escaliers'),
]:
    add(f'WhatsApp Image 2026-09-17 at {stamp}.jpeg', 'psc', f'psc-{project}', name, caption, type=type, zone=zone, kind='photo')

add('a0_01.png', 'socohuile', 'socohuile-risques', 'consignes-site', 'Entrée du site · Consignes générales de sécurité',
    zone='site', pdfSource='Affiche de sécurité entrée principale A0 x1.pdf')
for source, name, caption, zone, kind in [
    ('Chariot elevateur A1 x1.pdf', 'chariots-elevateurs', 'Chariots élévateurs · Règles de conduite', 'circulation', 'pdf'),
    ('ergonomie bureautique A3 x2.pdf', 'ergonomie-bureaux', 'Bureaux · Ergonomie du poste', 'bureaux', 'pdf'),
    ('Escalier A3 x8 1.pdf', 'consignes-escalier', 'Escaliers · Tenir la rampe', 'escaliers', 'pdf'),
    ('hygiene du personnel A3 x5.pdf', 'hygiene-personnel', 'Production · Hygiène du personnel', 'hygiene', 'pdf'),
    ('Lavage des mains A3 x5.pdf', 'lavage-mains', 'Hygiène · Lavage des mains', 'hygiene', 'pdf'),
    ('manutention manuelle A3 x 3.pdf', 'manutention-manuelle', 'Manutention · Technique de levage', 'manutention', 'pdf'),
    ('Numeros durgence A3 x3.pdf', 'numeros-urgence', 'Urgence · Consignes et contacts du site', 'secours', 'template'),
]:
    add(source, 'socohuile', 'socohuile-risques', name, caption, zone=zone, kind=kind,
        **({'note': 'Gabarit personnalisable : numéros d’urgence et point de rassemblement à renseigner.'} if kind == 'template' else {}))

for number, name, caption, zone in [
    (1, 'danger-electrique', 'Danger électrique', 'electrique'),
    (2, 'matieres-inflammables', 'Matériaux combustibles et inflammables', 'stockage'),
    (3, 'issues-secours-degagees', 'Issues de secours · Stockage interdit', 'secours'),
    (4, 'interdiction-fumer', 'Interdiction de fumer', 'incendie'),
    (5, 'acces-reserve', 'Accès interdit au personnel non autorisé', 'site'),
    (6, 'chute-objets', 'Danger · Chute d’objets', 'stockage'),
]:
    add(f'a4_{number:02d}.png', 'commun', 'signaletique-complementaire', name, caption, zone=zone)

duplicates = {
    'TESCA_Page_003 (1).pdf': 'TESCA_Page_003.pdf',
    'WhatsApp Image 2026-09-17 at 10.34.40 (1).jpeg': 'WhatsApp Image 2026-09-17 at 10.33.37.jpeg'
}
for duplicate, original in duplicates.items():
    assert (ROOT/'assets'/duplicate).read_bytes() == (ROOT/'assets'/original).read_bytes(), duplicate

# Même visuel réexporté (fichiers différents, image identique à l'œil) : non répété dans la galerie.
equivalents = {
    '1000021909.jpg': 'ChatGPT Image 17 sept. 2026, 14_19_22 (5).png',
    '1000021910.jpg': 'ChatGPT Image 17 sept. 2026, 14_19_21 (1).png'
}
# Première version d'un support, remplacée par la version corrigée : non affichée.
replaced = {'1000021905.jpg': 'ChatGPT Image 18 sept. 2026, 11_31_25.png'}

for copy, original in equivalents.items():
    with Image.open(ROOT/'assets'/copy) as a, Image.open(ROOT/'assets'/original) as b:
        small = [ImageOps.exif_transpose(x).convert('L').resize((300, 212)) for x in (a, b)]
    diff = sum(abs(p - q) for p, q in zip(small[0].tobytes(), small[1].tobytes())) / (300 * 212)
    assert diff < 2, f'{copy} diffère de {original} ({diff:.2f})'

for rec in records:
    source = ROOT / 'assets' / rec['source']
    if source.suffix.lower() == '.pdf':
        with fitz.open(source) as doc:
            assert len(doc) == 1, f'Multipage à traiter : {source.name}'
            page = doc[0]
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
        shutil.copy2(ROOT / 'assets' / pdf_name, target)
        rec['document'] = target.relative_to(ROOT).as_posix()
    rec['sha256'] = hashlib.sha256(source.read_bytes()).hexdigest()

provided = {p.name for p in (ROOT/'assets').iterdir() if p.suffix.lower() in {'.png', '.jpg', '.jpeg', '.pdf'} and p.is_file()}
covered = {r['source'] for r in records} | {r['pdfSource'] for r in records if 'pdfSource' in r} | set(duplicates) | set(equivalents) | set(replaced)
assert provided == covered, f'Fichiers non classés : {provided-covered}; absents : {covered-provided}'
catalogue = {'records': records, 'duplicates': duplicates, 'equivalents': equivalents, 'replaced': replaced, 'sourceCount': len(provided)}
(ROOT/'sources'/'imported-media.json').write_text(json.dumps(catalogue, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(f'{len(provided)} fichiers examinés → {len(records)} visuels, {sum("document" in r for r in records)} PDF accessibles, {len(duplicates) + len(equivalents)} doublons et {len(replaced)} version remplacée conservés mais non répétés.')
