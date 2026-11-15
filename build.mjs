// Build all three guides (or one):  node build.mjs [tulum|netanya|abu-dhabi]
import { buildSite } from './_core/build.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const sites = process.argv[2] ? [process.argv[2]] : ['tulum', 'netanya', 'abu-dhabi'];
for (const s of sites) {
  console.log(`Building ${s}…`);
  await buildSite(path.join(here, s));
}
