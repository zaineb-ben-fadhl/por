// Dependency-free ZIP (stored entries: MP4 and WebP are already compressed).
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'deliverables');
await mkdir(output, { recursive: true });
const crcTable = Array.from({ length: 256 }, (_, value) => {
  for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
async function filesAt(directory, prefix = '') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = prefix + entry.name;
    if (entry.isDirectory()) files.push(...await filesAt(path.join(directory, entry.name), relative + '/'));
    else if (entry.isFile()) files.push(relative);
  }
  return files;
}
const files = ['index.html', 'styles.css', 'app.js', 'data.js', 'LIRE-MOI.txt'];
for (const name of await readdir(path.join(root, 'assets'))) {
  if (/\.(svg|webp|jpg|mp4|woff2|ttf|css|txt)$/i.test(name)) files.push('assets/' + name);
}
const locals = [], directory = [];
let offset = 0;
const now = new Date();
const date = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
const time = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
for (const name of files) {
  const nameBytes = Buffer.from(name);
  const bytes = await readFile(path.join(root, name));
  const checksum = crc32(bytes);
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x800, 6);
  local.writeUInt16LE(time, 10); local.writeUInt16LE(date, 12); local.writeUInt32LE(checksum, 14);
  local.writeUInt32LE(bytes.length, 18); local.writeUInt32LE(bytes.length, 22); local.writeUInt16LE(nameBytes.length, 26);
  locals.push(local, nameBytes, bytes);
  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6); central.writeUInt16LE(0x800, 8);
  central.writeUInt16LE(time, 12); central.writeUInt16LE(date, 14); central.writeUInt32LE(checksum, 16);
  central.writeUInt32LE(bytes.length, 20); central.writeUInt32LE(bytes.length, 24); central.writeUInt16LE(nameBytes.length, 28);
  central.writeUInt32LE(offset, 42);
  directory.push(central, nameBytes);
  offset += local.length + nameBytes.length + bytes.length;
}
const central = Buffer.concat(directory);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10);
end.writeUInt32LE(central.length, 12); end.writeUInt32LE(offset, 16);
const file = path.join(output, 'KeySafe-Portfolio.zip');
await writeFile(file, Buffer.concat([...locals, central, end]));
console.log(`Packaged ${files.length} files: ${file}`);
