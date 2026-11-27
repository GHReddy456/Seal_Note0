import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const fontsDir = path.join(distDir, 'fonts');

await fs.rm(fontsDir, { recursive: true, force: true });
await fs.mkdir(fontsDir, { recursive: true });

// 1. Copy local variable Geist & Geist Mono woff2 fonts into dist/fonts
const fontPackages = [
  path.join(rootDir, 'node_modules/@fontsource-variable/geist'),
  path.join(rootDir, 'node_modules/@fontsource-variable/geist-mono'),
];

const fontCssChunks = [];
for (const pkgDir of fontPackages) {
  const filesSrc = path.join(pkgDir, 'files');
  const entries = await fs.readdir(filesSrc);
  for (const entry of entries) {
    if (entry.endsWith('-normal.woff2')) {
      await fs.copyFile(path.join(filesSrc, entry), path.join(fontsDir, entry));
    }
  }
  const wghtCss = await fs.readFile(path.join(pkgDir, 'wght.css'), 'utf8');
  fontCssChunks.push(wghtCss.replace(/\.\/files\//g, './fonts/'));
}

// 2. Compile Tailwind CSS v4 from src/input.css -> dist/styles.css
const tailwindBin = path.join(
  rootDir,
  'node_modules/.bin',
  process.platform === 'win32' ? 'tailwindcss.cmd' : 'tailwindcss'
);
const rawCssPath = path.join(distDir, 'styles.raw.css');

await execFileAsync(tailwindBin, [
  '-i',
  path.join(rootDir, 'src/input.css'),
  '-o',
  rawCssPath,
  '--minify',
]);

const compiledCss = await fs.readFile(rawCssPath, 'utf8');
await fs.rm(rawCssPath, { force: true });

const finalCss = `${fontCssChunks.join('\n')}\n${compiledCss}`;
await fs.writeFile(path.join(distDir, 'styles.css'), finalCss, 'utf8');
await fs.copyFile(
  path.join(rootDir, 'src/assets/orange-wood-tiles.svg'),
  path.join(distDir, 'orange-wood-tiles.svg')
);

// 3. Bundle React + Motion + Phosphor + TTY//FEEL core modules via esbuild
const outJs = path.join(distDir, 'app.bundle.js');
await esbuild.build({
  entryPoints: [path.join(rootDir, 'src/main.jsx')],
  bundle: true,
  minify: true,
  format: 'iife',
  jsx: 'automatic',
  target: ['es2020'],
  outfile: outJs,
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});

const jsStat = await fs.stat(outJs);
const cssStat = await fs.stat(path.join(distDir, 'styles.css'));

// 4. Copy index.html & 404.html into standalone dist/ output directory for Vercel static hosting
for (const htmlFile of ['index.html', '404.html']) {
  const rawHtml = await fs.readFile(path.join(rootDir, htmlFile), 'utf8');
  const distHtml = rawHtml.replace(/\.\/dist\//g, './');
  await fs.writeFile(path.join(distDir, htmlFile), distHtml, 'utf8');
}

console.log(`Built dist/app.bundle.js (${jsStat.size} bytes) and dist/styles.css (${cssStat.size} bytes)`);
