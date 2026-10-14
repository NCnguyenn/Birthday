// Optimizes originals in ./images into web-ready files in ./public/images
// + writes a manifest (src/data/photos.json) with dimensions.
// Originals are never modified. Run: npm run optimize-images
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'images');
const outDir = join(root, 'public', 'images');

const files = (await readdir(srcDir))
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort();

await mkdir(outDir, { recursive: true });

const manifest = [];
let i = 0;
for (const file of files) {
  i += 1;
  const id = `photo-${String(i).padStart(2, '0')}`;
  const out = `${id}.webp`;
  const info = await sharp(join(srcDir, file))
    .rotate() // honor EXIF orientation
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(join(outDir, out));
  manifest.push({ id, file: out, width: info.width, height: info.height, original: file });
  console.log(`${file} -> ${out} (${info.width}x${info.height})`);
}

await writeFile(join(root, 'src', 'data', 'photos.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Done: ${manifest.length} photos -> public/images + src/data/photos.json`);
