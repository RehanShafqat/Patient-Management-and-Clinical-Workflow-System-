// proxies/proxy.ts
import { createProxyMiddleware } from "http-proxy-middleware";
import { routes } from "../config/routes.config";
import { Router } from "express";

const router = Router();

routes.forEach(({ pathFilter, target }) => {
  router.use(
    createProxyMiddleware({
      pathFilter,
      target,
      changeOrigin: true,
      //   xfwd: true,
    }),
  );
});

export default router;
