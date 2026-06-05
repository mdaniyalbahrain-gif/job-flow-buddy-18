import "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type Env = {
    ASSETS: { fetch: (req: Request) => Promise<Response> };
};

// Static asset extensions that should always be served from ASSETS
const STATIC_EXTENSIONS = /\.(js|css|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|map|json|txt|xml|webp|avif)$/i;

export default {
    async fetch(request: Request, env: Env, ctx: unknown) {
          const url = new URL(request.url);
          const pathname = url.pathname;

      // Serve static assets directly from ASSETS binding
      // This covers /assets/* paths and any file with a static extension
      if (pathname.startsWith("/assets/") || STATIC_EXTENSIONS.test(pathname)) {
              try {
                        const assetResponse = await env.ASSETS.fetch(request);
                        if (assetResponse.status !== 404) return assetResponse;
              } catch {
                        // fall through to SSR
              }
      }

      // SSR handler for all other requests
      try {
              const { default: handler } = await import("@tanstack/react-start/server-entry") as any;
              const response = await handler.fetch(request, env, ctx);
              return response;
      } catch (error) {
              console.error(error);
              // Fallback: try ASSETS
            try {
                      return await env.ASSETS.fetch(request);
            } catch {
                      return new Response(renderErrorPage(), {
                                  status: 500,
                                  headers: { "content-type": "text/html; charset=utf-8" },
                      });
            }
      }
    },
};
