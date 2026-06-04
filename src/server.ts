import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, extname } from "node:path";

const PORT = parseInt(process.env.PORT || "3000");
const CLIENT_DIR = join(process.cwd(), "dist/client");
const ASSETS_DIR = join(CLIENT_DIR, "assets");

const MIME: Record<string, string> = {
  ".js": "application/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function buildFallbackHtml(): string {
  const files = existsSync(ASSETS_DIR) ? readdirSync(ASSETS_DIR) : [];
  const cssFiles = files.filter(f => f.endsWith(".css"));
  const jsFiles = files.filter(f => f.endsWith(".js"));
  const cssLinks = cssFiles.map(f => `<link rel="stylesheet" href="/assets/${f}">`).join("");
  const jsScripts = jsFiles.map(f => `<script type="module" src="/assets/${f}"></script>`).join("");
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${cssLinks}</head><body>${jsScripts}</body></html>`;
}

const fallbackHtml = buildFallbackHtml();

const server = createServer((req, res) => {
  const url = req.url?.split("?")[0] || "/";
  const filePath = join(CLIENT_DIR, url);
  try {
    if (existsSync(filePath) && statSync(filePath).isFile()) {
      const ext = extname(filePath);
      const mime = MIME[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": mime });
      res.end(readFileSync(filePath));
      return;
    }
  } catch {}
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(fallbackHtml);
});

server.listen(PORT, () => {
  console.log(`Started server: http://localhost:${PORT}`);
});
