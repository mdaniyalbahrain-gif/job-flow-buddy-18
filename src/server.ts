import "./lib/error-capture";
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

const server = createServer((req, res) => {
  const url = req.url || "/";
  const filePath = join(CLIENT_DIR, url === "/" ? "index.html" : url);

  if (existsSync(filePath) && !filePath.endsWith("/")) {
    const ext = extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "text/plain" });
    res.end(readFileSync(filePath));
  } else {
    const index = join(CLIENT_DIR, "index.html");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(readFileSync(index));
  }
});

server.listen(PORT, () => {
  console.log(`Started server: http://localhost:${PORT}`);
});
