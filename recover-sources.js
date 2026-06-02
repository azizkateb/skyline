const fs = require('fs');
const path = require('path');

const mapFiles = [];
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.map')) mapFiles.push(full);
  }
}
walk('.next');

const recoveredDir = path.join(process.cwd(), 'recovered');
let totalRecovered = 0;
const seen = new Set();

function extractFromMap(map) {
  if (!map) return;
  if (map.sections) {
    for (const section of map.sections) {
      if (section.map) extractFromMap(section.map);
    }
    return;
  }
  if (!map.sources || !map.sourcesContent) return;

  for (let i = 0; i < map.sources.length; i++) {
    let src = map.sources[i];
    const sc = map.sourcesContent[i];
    if (!src || !sc) continue;

    let relPath = src;
    if (relPath.startsWith('file:///')) {
      relPath = relPath.slice('file:///'.length);
      try { relPath = path.relative(process.cwd(), relPath); } catch(e) {}
    }
    relPath = relPath.replace(/\\/g, '/');

    if (!relPath.startsWith('src/') && !relPath.startsWith('public/')) continue;
    if (relPath.includes('node_modules')) continue;

    const ext = path.extname(relPath);
    if (!['.ts', '.tsx', '.js', '.jsx', '.css'].includes(ext)) continue;

    const key = relPath + ':::' + sc.length;
    if (seen.has(key)) continue;
    seen.add(key);

    const outputPath = path.join(recoveredDir, relPath);
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    if (fs.existsSync(outputPath)) {
      const existing = fs.readFileSync(outputPath, 'utf8');
      if (existing === sc) continue;
      if (sc.length <= existing.length) continue;
    }

    fs.writeFileSync(outputPath, sc);
    totalRecovered++;
    console.log('  Recovered:', relPath);
  }
}

console.log('Scanning', mapFiles.length, 'map files...');
for (const mapFile of mapFiles) {
  try {
    const content = fs.readFileSync(mapFile, 'utf8');
    const map = JSON.parse(content);
    extractFromMap(map);
  } catch(e) {
    // skip unparseable
  }
}

console.log('\nTotal files recovered:', totalRecovered);
