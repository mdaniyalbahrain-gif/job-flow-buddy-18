import "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type Env = {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
};

export default {
  async fetch(request: Request, env: Env, ctx: unknown) {
    try {
      const { default: handler } = await import("@tanstack/react-start/server-entry") as any;
      const response = await handler.fetch(request, env, ctx);
      
      // Agar asset request hai aur 404 aaya to ASSETS se try karo
      if (response.status === 404) {
        const assetResponse = await env.ASSETS.fetch(request);
        if (assetResponse.status !== 404) return assetResponse;
      }
      
      return response;
    } catch (error) {
      console.error(error);
      // Fallback: ASSETS se try karo
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
