import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const PORT = parseInt(process.env.PORT || "3000");
const CLIENT_DIR = join(process.cwd(), "dist/client");

const MIME: Record<string, string> = {
  ".js": "application/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json",
};

const fallbackHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/assets/styles-CDMLsA5N.css"></head><body><script type="module" src="/assets/index-DYIkqkhu.js"></script><script type="module" src="/assets/index-em3rWA79.js"></script></body></html>`;

const server = createServer((req, res) => {
  const url = req.url || "/";
  const filePath = join(CLIENT_DIR, url === "/" ? "" : url);

  if (url !== "/" && existsSync(filePath) && !filePath.endsWith("/")) {
    const ext = extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "text/plain" });
    res.end(readFileSync(filePath));
  } else {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(fallbackHtml);
  }
});

server.listen(PORT, () => {
  console.log(`Started server: http://localhost:${PORT}`);
});
