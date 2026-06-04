import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const brandDir = path.join(__dirname, '../public/brand');
const src = path.join(brandDir, 'harv-dreams-logo.png');

/** Navbar max ~112px tall; 2× retina ≈ 224px */
const NAV_HEIGHT = 224;
/** Hero / large header ~224px tall display → 448px asset */
const HERO_HEIGHT = 448;

async function writePng(outName, height) {
  const out = path.join(brandDir, outName);
  await sharp(src)
    .resize({ height, withoutEnlargement: true })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(out);
  const meta = await sharp(out).metadata();
  console.log(`${outName}: ${meta.width}x${meta.height}`);
}

await writePng('harv-dreams-logo-nav.png', NAV_HEIGHT);
await writePng('harv-dreams-logo-nav@2x.png', HERO_HEIGHT);
await writePng('harv-dreams-logo-master.png', 598);

console.log('Done.');
