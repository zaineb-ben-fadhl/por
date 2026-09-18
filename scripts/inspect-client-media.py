"""Read new client uploads, render PDF previews, and inventory exact duplicates."""
from pathlib import Path
import hashlib
import json
import sys
import fitz
from PIL import Image, ImageOps, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'tmp' / 'client-media-review'
OUT.mkdir(parents=True, exist_ok=True)
font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 15)
small = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 12)
items = []
for source in sorted((ROOT / 'assets').iterdir()):
    if not source.is_file() or source.suffix.lower() not in {'.png', '.jpg', '.jpeg', '.pdf'}:
        continue
    item = {'source': source.name, 'sha256': hashlib.sha256(source.read_bytes()).hexdigest()}
    if source.suffix.lower() == '.pdf':
        doc = fitz.open(source)
        item['pages'] = len(doc)
        item['text'] = '\n\n'.join(p.get_text() for p in doc)
        item['previews'] = []
        for index, page in enumerate(doc):
            target = OUT / f'{source.stem}-page-{index+1}.png'
            scale = min(1500 / page.rect.width, 1800 / page.rect.height)
            pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
            pix.save(target)
            item['previews'].append(str(target.relative_to(ROOT)).replace('\\', '/'))
    else:
        with Image.open(source) as im:
            item['dimensions'] = list(im.size)
        item['previews'] = [str(source.relative_to(ROOT)).replace('\\', '/')]
    items.append(item)

(OUT / 'inventory.json').write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding='utf8')
for group, subset in [('images', [i for i in items if 'dimensions' in i]), ('pdfs', [i for i in items if 'pages' in i])]:
    flattened = [(i, p) for i in subset for p in i['previews']]
    for sheet_no, start in enumerate(range(0, len(flattened), 12), 1):
        part = flattened[start:start+12]
        sheet = Image.new('RGB', (1600, ((len(part)+3)//4)*390), '#e7e8e0')
        draw = ImageDraw.Draw(sheet)
        for offset, (item, preview) in enumerate(part):
            x, y = (offset % 4)*400, (offset//4)*390
            with Image.open(ROOT / preview) as raw:
                image = ImageOps.exif_transpose(raw).convert('RGB')
                image.thumbnail((380, 326))
                sheet.paste(image, (x+10+(380-image.width)//2, y+8+(326-image.height)//2))
            title = f'{start+offset+1:02d}. {item["source"]}'
            draw.text((x+10,y+342), title[:48], fill='#202743', font=font)
            draw.text((x+10,y+364), title[48:] if len(title)>48 else str(item.get('dimensions', str(item.get('pages'))+' page(s)')), fill='#4b5446', font=small)
        sheet.save(OUT / f'{group}-sheet-{sheet_no}.jpg', quality=92)

duplicates = {}
for item in items:
    duplicates.setdefault(item['sha256'], []).append(item['source'])
print(json.dumps({'images': sum('dimensions' in i for i in items), 'pdfs': sum('pages' in i for i in items), 'duplicates': [v for v in duplicates.values() if len(v)>1], 'output': str(OUT)}, ensure_ascii=False, indent=2))
for item in items:
    if 'text' in item:
        print('\nPDF:', item['source'], '\n', item['text'][:6000])
