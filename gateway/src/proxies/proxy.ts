import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { routes } from "../config/routes.config";
import { Router } from "express";

const router = Router();

routes.forEach(({ pathFilter, target }) => {
  router.use(
    createProxyMiddleware({
      pathFilter,
      target,
      changeOrigin: true,
      on: {
        proxyReq: (proxyReq, req) => {
          // Strip origin header to "hide" target from CORS requirements
          proxyReq.removeHeader("origin");
          fixRequestBody(proxyReq, req);
        },
        proxyRes: (proxyRes) => {
          // Remove any CORS headers returned by the target to avoid conflicts with Gateway CORS
          delete proxyRes.headers["access-control-allow-origin"];
          delete proxyRes.headers["access-control-allow-credentials"];
          delete proxyRes.headers["access-control-allow-methods"];
          delete proxyRes.headers["access-control-allow-headers"];
          delete proxyRes.headers["access-control-expose-headers"];
        },
      },
      //   xfwd: true,
    }),
  );
});

export default router;
