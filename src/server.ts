export default {
  async fetch(request: Request, env: { ASSETS: { fetch: typeof fetch } }) {
    const url = new URL(request.url);
    
    // Serve static assets directly
    if (url.pathname.startsWith("/assets/") || 
        url.pathname.endsWith(".png") || 
        url.pathname.endsWith(".ico") ||
        url.pathname.endsWith(".svg")) {
      return env.ASSETS.fetch(request);
    }
    
    // For all other routes, use SSR
    try {
      const { default: handler } = await import("@tanstack/react-start/server-entry") as any;
      return handler.fetch(request, env, {});
    } catch {
      return env.ASSETS.fetch(request);
    }
  }
};
