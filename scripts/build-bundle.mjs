import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const MODULE_ORDER = [
  'src/emotions.js',
  'src/photo-ascii.js',
  'src/crypto.js',
  'src/ascii-canvas.js',
  'src/scenes.js',
  'src/audio.js',
  'src/app.js',
];

function stripImportsAndExports(source) {
  return source
    .replace(/^\s*import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '')
    .replace(/^\s*export\s+(?=(async\s+function|function|class|const|let|var)\b)/gm, '');
}

const chunks = [];
for (const rel of MODULE_ORDER) {
  const raw = await fs.readFile(path.join(rootDir, rel), 'utf8');
  chunks.push(`// ===== ${rel} =====\n${stripImportsAndExports(raw)}`);
}

const bundle = `// Auto-generated from src/*.js so the app runs cleanly on both http:// and file://\n(function () {\n'use strict';\n${chunks.join('\n\n')}\n})();\n`;

await fs.mkdir(path.join(rootDir, 'dist'), { recursive: true });
await fs.writeFile(path.join(rootDir, 'dist/app.bundle.js'), bundle, 'utf8');
console.log(`Built dist/app.bundle.js (${bundle.length} bytes)`);
