import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? 'storybook-static');
const types: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.md': 'text/plain',
  '.txt': 'text/plain',
};

http
  .createServer(async (request, response) => {
    const file = path.resolve(
      root,
      `.${decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname).replace(/\/$/, '/index.html')}`,
    );

    if (!file.startsWith(`${root}${path.sep}`)) {
      response.writeHead(403).end();

      return;
    }

    try {
      response.setHeader('Content-Type', types[path.extname(file)] ?? 'application/octet-stream');
      response.end(await readFile(file));
    } catch {
      response.writeHead(404).end();
    }
  })
  .listen(Number(process.argv[3] ?? 16007), '127.0.0.1');
