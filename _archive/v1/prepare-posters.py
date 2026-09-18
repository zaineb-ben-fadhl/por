"""Extract selected poster frames from the downloaded original KeySafe videos.
Run from the project root: python scripts/prepare-posters.py
Requires OpenCV (only for maintenance; not a website dependency).
"""
from pathlib import Path
import cv2

assets = Path(__file__).resolve().parents[1] / 'assets'
for name, seconds in {'incendie': 16, 'evacuation': 77, 'safety-day': 90, 'exercice': 120}.items():
    cap = cv2.VideoCapture(str(assets / f'{name}.mp4'))
    cap.set(cv2.CAP_PROP_POS_MSEC, seconds * 1000)
    success, frame = cap.read()
    cap.release()
    if not success:
        raise RuntimeError(f'Cannot decode {name} at {seconds}s')
    cv2.imwrite(str(assets / f'{name}-poster.jpg'), frame, [cv2.IMWRITE_JPEG_QUALITY, 90])
    print(f'{name}: extracted frame at {seconds}s')
