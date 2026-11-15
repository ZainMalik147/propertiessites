// node _core/import-research.mjs <site> '<json image map>'  → writes <site>/content/developers.json from research.json
import fs from 'node:fs';
const [site, mapJson] = process.argv.slice(2);
const r = JSON.parse(fs.readFileSync(`${site}/research.json`, 'utf8').replace(/^﻿/, ''));
const map = JSON.parse(mapJson || '{}');
r.developers.forEach((d, i) => {
  d.order = i + 1; d.published = true; d.listingType = 'editorial';
  if (map[d.slug]) d.images = map[d.slug].map(f => 'assets/img/' + f);
});
fs.writeFileSync(`${site}/content/developers.json`, JSON.stringify({ developers: r.developers, images: r.images }, null, 2));
console.log('wrote', `${site}/content/developers.json`);
