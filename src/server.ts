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

const server = createServer((req, res) => {
  const url = req.url?.split("?")[0] || "/";
  
  // Try exact file first
  const filePath = join(CLIENT_DIR, url);
  try {
    if (existsSync(filePath) && statSync(filePath).isFile()) {
      const ext = extname(filePath);
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      res.end(readFileSync(filePath));
      return;
    }
  } catch {}

  // Serve index.html for all other routes
  const indexPath = join(CLIENT_DIR, "index.html");
  if (existsSync(indexPath)) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(readFileSync(indexPath));
    return;
  }

  // Fallback: generate HTML from assets
  const files = existsSync(ASSETS_DIR) ? readdirSync(ASSETS_DIR) : [];
  const css = files.filter(f => f.endsWith(".css")).map(f => `<link rel="stylesheet" href="/assets/${f}">`).join("");
  const js = files.filter(f => f.endsWith(".js")).map(f => `<script type="module" src="/assets/${f}"></script>`).join("");
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${css}</head><body>${js}</body></html>`);
});

server.listen(PORT, () => {
  console.log(`Started server: http://localhost:${PORT}`);
});
