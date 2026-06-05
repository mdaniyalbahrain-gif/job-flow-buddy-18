import "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type Env = {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
};

type ServerEntry = {
  fetch: (request: Request, env: Env, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

export default {
  async fetch(request: Request, env: Env, ctx: unknown) {
    const url = new URL(request.url);
    
    // Static assets serve karo directly
    if (url.pathname.startsWith("/assets/") ||
        url.pathname.match(/\.(png|jpg|jpeg|svg|ico|webp|woff|woff2)$/)) {
      return env.ASSETS.fetch(request);
    }
    
    // SSR ke liye TanStack Start use karo
    try {
      const handler = await getServerEntry();
      return await handler.fetch(request, env, ctx);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
