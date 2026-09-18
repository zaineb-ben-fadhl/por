"""Prepare the portfolio media from the raw sources.

Run from the project root:  python scripts/prepare-media.py
Needs Pillow and ffmpeg on the PATH. Safe to re-run.
"""
import os
import subprocess
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = lambda *p: os.path.join(ROOT, 'assets', *p)
RAW = lambda *p: os.path.join(ROOT, '_raw', *p)


def ffmpeg(*args):
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *args], check=True)


def white_to_alpha(im, lo=200, hi=250):
    """Turn a white background into transparency, keeping anti-aliased edges."""
    im = im.convert('RGBA')
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, _ = px[x, y]
            light = min(r, g, b)
            if light >= hi:
                px[x, y] = (r, g, b, 0)
            elif light > lo:
                a = int(255 * (hi - light) / (hi - lo))
                px[x, y] = (r, g, b, a)
    return im


def recolor(im, rgb, keep_green=True):
    """Paint every opaque non-green pixel with rgb (for a white logo)."""
    im = im.copy()
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if keep_green and g > r + 25 and g > b + 15:
                continue
            px[x, y] = (*rgb, a)
    return im


def unletterbox(im):
    """Remove the black cinema bars of the Safety Day film."""
    gray = im.convert('L')
    rows = [y for y in range(im.height) if max(gray.crop((0, y, im.width, y + 1)).getdata()) > 40]
    return im.crop((0, rows[0], im.width, rows[-1] + 1))


# ---------------------------------------------------------------- brand
logo = Image.open(A('brand', 'keysafe-logo-original.jpg')).convert('RGB')
logo = logo.resize((logo.width * 3, logo.height * 3), Image.LANCZOS)
logo = white_to_alpha(logo)
# drop faint JPEG speckles left around the edges
px = logo.load()
for y in range(logo.height):
    for x in range(logo.width):
        if px[x, y][3] < 70:
            px[x, y] = (255, 255, 255, 0)
logo = logo.crop(logo.getbbox())
logo.save(A('brand', 'keysafe-logo.png'))
recolor(logo, (255, 255, 255)).save(A('brand', 'keysafe-logo-white.png'))

# shield only (top part of the square logo)
w, h = logo.size
alpha = logo.getchannel('A')
# the shield ends at the first fully transparent row below its middle
gap = next(y for y in range(h // 2, h) if alpha.crop((0, y, w, y + 1)).getbbox() is None)
shield = logo.crop((0, 0, w, gap))
shield = shield.crop(shield.getbbox())
shield.save(A('brand', 'keysafe-shield.png'))
recolor(shield, (255, 255, 255), keep_green=False).save(A('brand', 'keysafe-shield-white.png'))

# wordmark only (KEYSAFE + TRAINING & CONSULTING), for a horizontal lockup
wordmark = logo.crop((0, gap, w, h))
wordmark = wordmark.crop(wordmark.getbbox())
wordmark.save(A('brand', 'keysafe-wordmark.png'))
recolor(wordmark, (255, 255, 255)).save(A('brand', 'keysafe-wordmark-white.png'))

# mascot from the video outro
tmp = RAW('mascotte.png')
os.makedirs(RAW(), exist_ok=True)
ffmpeg('-ss', '92', '-i', A('video', 'evacuation.mp4'), '-frames:v', '1', tmp)
m = white_to_alpha(Image.open(tmp), lo=215, hi=248)
m = m.crop(m.getbbox())
m.save(A('brand', 'mascotte.png'))

# ---------------------------------------------------------------- video stills (KeySafe footage)
stills = {
    'cjo-aerien': ('exercice.mp4', 5),
    'cjo-rassemblement-aerien': ('exercice.mp4', 139),
    'cjo-rassemblement': ('exercice.mp4', 133),
    'cjo-signaletique-medecin': ('exercice.mp4', 88),
    'rose-blanche-atelier': ('evacuation.mp4', 8),
    'rose-blanche-rassemblement': ('evacuation.mp4', 86),
    'incendie-terrain': ('incendie.mp4', 16),
    'safety-day-equipe': ('safety-day.mp4', 90),
}
for name, (video, t) in stills.items():
    png = RAW(f'{name}.png')
    ffmpeg('-ss', str(t), '-i', A('video', video), '-frames:v', '1', png)
    im = Image.open(png).convert('RGB')
    if video == 'safety-day.mp4':
        im = unletterbox(im)
    im.save(A('terrain', f'{name}.webp'), quality=82, method=6)

# better video posters
posters = {'exercice': 5, 'evacuation': 86, 'incendie': 16, 'safety-day': 90}
for v, t in posters.items():
    png = RAW(f'poster-{v}.png')
    ffmpeg('-ss', str(t), '-i', A('video', f'{v}.mp4'), '-frames:v', '1', png)
    im = Image.open(png).convert('RGB')
    if v == 'safety-day':
        im = unletterbox(im)
    im.save(A('video', f'{v}-poster.webp'), quality=80, method=6)
    old = A('video', f'{v}-poster.jpg')
    if os.path.exists(old):
        os.remove(old)

# silent preview loops for hover
previews = {'exercice': 128, 'evacuation': 80, 'incendie': 12, 'safety-day': 60}
for v, t in previews.items():
    crop = 'crop=iw:ih*0.86,' if v == 'safety-day' else ''
    ffmpeg('-ss', str(t), '-t', '6', '-i', A('video', f'{v}.mp4'), '-an',
           '-vf', crop + 'scale=640:-2,fps=24', '-c:v', 'libx264', '-crf', '30', '-preset', 'slow',
           '-pix_fmt', 'yuv420p', '-movflags', '+faststart', A('video', f'{v}-preview.mp4'))

# ---------------------------------------------------------------- LinkedIn photos
# KeySafe frames its photos with a branded footer strip: crop it for the grid.
for f in sorted(os.listdir(RAW('linkedin'))):
    im = Image.open(RAW('linkedin', f)).convert('RGB')
    base = os.path.splitext(f)[0]
    if base.startswith('audit'):
        im.save(A('terrain', f'{base}.webp'), quality=90)
        continue
    if base == 'psi-pic-1':
        box = (0, int(im.height * 0.14), im.width, int(im.height * 0.86))
    elif base == 'psi-pic-2':
        box = (0, int(im.height * 0.08), im.width, int(im.height * 0.93))
    else:
        box = (0, 0, im.width, int(im.height * 0.89))
    im.crop(box).save(A('terrain', f'{base}.webp'), quality=82, method=6)

print('media ready')
