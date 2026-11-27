import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');
const PORT = Number(process.env.PORT || 3456);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon',
};

const ASSET_EXTENSIONS = new Set(['.js', '.mjs', '.css', '.png', '.svg', '.jpg', '.woff2', '.woff', '.json', '.ico', '.map']);

const server = http.createServer(async (req, res) => {
  try {
    const reqUrl = new URL(req.url || '/', `http://localhost:${PORT}`);
    let relPath = decodeURIComponent(reqUrl.pathname);
    if (relPath === '/') relPath = '/index.html';

    const filePath = path.resolve(distDir, `.${relPath}`);
    if (!filePath.startsWith(distDir + path.sep) && filePath !== path.join(distDir, 'index.html')) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      const reqUrl = new URL(req.url || '/', `http://localhost:${PORT}`);
      const ext = path.extname(reqUrl.pathname);
      if (ASSET_EXTENSIONS.has(ext)) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      try {
        const html404 = await fs.readFile(path.join(distDir, '404.html'));
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html404);
      } catch {
        res.writeHead(404);
        res.end('Not found');
      }
    } else {
      res.writeHead(500);
      res.end('Internal server error');
    }
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Seal Note running at http://127.0.0.1:${PORT}`);
});
