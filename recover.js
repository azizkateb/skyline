// recover.js  →  run with:  node recover.js
const fs = require('fs');
const path = require('path');

const NEXT_DIR = '.next';
const OUT = 'recovered';

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (e.name.endsWith('.map')) files.push(p);
  }
  return files;
}

let count = 0;
for (const mapPath of walk(NEXT_DIR)) {
  let json;
  try { json = JSON.parse(fs.readFileSync(mapPath, 'utf8')); } catch { continue; }
  const { sources, sourcesContent } = json;
  if (!sources || !sourcesContent) continue;
  sources.forEach((src, i) => {
    const content = sourcesContent[i];
    if (!content) return;
    if (src.includes('node_modules') || src.includes('webpack/runtime')) return;
    if (!/\.(tsx?|jsx?|css|mjs)$/.test(src.replace(/\?.*$/, ''))) return;
    const clean = src
      .replace(/^webpack:\/\/[^/]*\//, '')
      .replace(/^[./]+/, '')
      .replace(/\?.*$/, '');
    const dest = path.join(OUT, clean);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, content);
    count++;
  });
}
console.log(`Recovered ${count} files into ${OUT}/`);