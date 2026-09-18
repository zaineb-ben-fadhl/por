// Prépare la version à héberger ou à envoyer : npm run build  →  dist/
// Options : --dry (liste sans copier) · --zip (crée aussi deliverables/KeySafe-Portfolio.zip)
// brief.html et js/brief.js sont internes : ils ne sont pas copiés.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const dry = process.argv.includes('--dry');
const zip = process.argv.includes('--zip');

const include = ['index.html', 'css', 'js', 'assets'];
const skip = [/^js[\\/]brief\.js$/, /^assets[\\/]photos[\\/]LISEZ-MOI\.txt$/i, /^assets[\\/]brand[\\/]keysafe-logo-original\.jpg$/,
  // Les originaux déposés sont conservés dans le projet. Le site utilise les aperçus
  // optimisés dans photos/ et les PDF classés dans documents/, sans double copie.
  /^assets[\\/][^\\/]+\.(?:png|jpe?g|pdf)$/i,
  /^assets[\\/](?:mockups|ambiance)[\\/]/i,
  /^assets[\\/]brand[\\/]mascotte\.png$/i];

const files = [];
const walk = rel => {
  const abs = join(ROOT, rel);
  if (statSync(abs).isDirectory()) readdirSync(abs).forEach(name => walk(join(rel, name)));
  else if (!skip.some(r => r.test(rel))) files.push(rel);
};
include.forEach(walk);

const total = files.reduce((n, f) => n + statSync(join(ROOT, f)).size, 0);
console.log(`${files.length} fichiers · ${(total / 1048576).toFixed(1)} Mo`);
if (dry) process.exit(0);

if (relative(ROOT, DIST) !== 'dist') throw new Error('Dossier de sortie hors du projet');
rmSync(DIST, { recursive: true, force: true });
files.forEach(f => {
  mkdirSync(dirname(join(DIST, f)), { recursive: true });
  cpSync(join(ROOT, f), join(DIST, f));
});
console.log(`→ ${relative(ROOT, DIST)}/`);

if (zip) {
  const out = join(ROOT, 'deliverables', 'KeySafe-Portfolio.zip');
  mkdirSync(dirname(out), { recursive: true });
  if (existsSync(out)) rmSync(out);
  if (process.platform === 'win32') {
    // le tar.exe de Windows 10+ (bsdtar) sait écrire des .zip, contrairement au tar de Git Bash
    const tar = join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe');
    execFileSync(tar, ['-a', '-c', '-f', out, '-C', DIST, '.'], { stdio: 'inherit' });
  } else {
    execFileSync('zip', ['-r', '-q', out, '.'], { cwd: DIST, stdio: 'inherit' });
  }
  console.log(`→ ${relative(ROOT, out)}`);
}
