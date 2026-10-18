import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 4173);
const contentTypes = new Map([
    ['.css', 'text/css; charset=utf-8'],
    ['.html', 'text/html; charset=utf-8'],
    ['.jpeg', 'image/jpeg'],
    ['.jpg', 'image/jpeg'],
    ['.js', 'text/javascript; charset=utf-8'],
    ['.json', 'application/json; charset=utf-8'],
    ['.mpeg', 'audio/mpeg'],
    ['.mjs', 'text/javascript; charset=utf-8'],
    ['.png', 'image/png'],
    ['.svg', 'image/svg+xml'],
    ['.webp', 'image/webp']
]);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`PORT must be an integer between 1 and 65535; received "${process.env.PORT}".`);
}

const server = createServer(async (request, response) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405, { Allow: 'GET, HEAD' });
        response.end('Method not allowed');
        return;
    }

    let pathname;
    try {
        pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch {
        response.writeHead(400);
        response.end('Bad request');
        return;
    }

    if (pathname === '/') pathname = '/index.html';

    const requestedPath = path.resolve(root, `.${pathname.replaceAll('/', path.sep)}`);
    const relativePath = path.relative(root, requestedPath);
    if (relativePath.startsWith(`..${path.sep}`) || relativePath === '..' || path.isAbsolute(relativePath)) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
    }

    try {
        const resolvedPath = await realpath(requestedPath);
        const resolvedRelativePath = path.relative(root, resolvedPath);
        if (resolvedRelativePath.startsWith(`..${path.sep}`) || resolvedRelativePath === '..' || path.isAbsolute(resolvedRelativePath)) {
            response.writeHead(403);
            response.end('Forbidden');
            return;
        }

        const file = await stat(resolvedPath);
        if (!file.isFile()) {
            response.writeHead(404);
            response.end('Not found');
            return;
        }

        response.writeHead(200, {
            'Cache-Control': 'no-cache',
            'Content-Length': file.size,
            'Content-Type': contentTypes.get(path.extname(resolvedPath).toLowerCase()) || 'application/octet-stream',
            'X-Content-Type-Options': 'nosniff'
        });

        if (request.method === 'HEAD') {
            response.end();
            return;
        }

        const stream = createReadStream(resolvedPath);
        stream.on('error', error => {
            console.error(`Unable to stream ${resolvedRelativePath}: ${error.message}`);
            if (response.headersSent) response.destroy(error);
            else {
                response.writeHead(500);
                response.end('Internal server error');
            }
        });
        stream.pipe(response);
    } catch (error) {
        if (error.code === 'ENOENT' || error.code === 'ENOTDIR') {
            response.writeHead(404);
            response.end('Not found');
            return;
        }

        console.error(`Unable to serve ${pathname}: ${error.message}`);
        response.writeHead(500);
        response.end('Internal server error');
    }
});

server.on('error', error => {
    console.error(`Unable to start local server at http://${host}:${port}: ${error.message}`);
    process.exitCode = 1;
});

server.listen(port, host, () => {
    console.log(`Birthday invitation running at http://${host}:${port}`);
    console.log('Press Ctrl+C to stop the server.');
});
