import { cp, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
await mkdir(path.join(dist, 'assets'), { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'data.js', 'LIRE-MOI.txt']) await cp(path.join(root, file), path.join(dist, file));
for (const file of await readdir(path.join(root, 'assets'))) {
  if (/\.(svg|webp|jpg|mp4|woff2|ttf|css|txt)$/i.test(file)) await cp(path.join(root, 'assets', file), path.join(dist, 'assets', file));
}
console.log('Production portfolio built in dist/ (HTML, CSS, JavaScript and local media).');
