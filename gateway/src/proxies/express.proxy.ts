import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "../config";

export const expressProxy = createProxyMiddleware({
  target: config.services.expressServiceUrl,
  changeOrigin: true,
  xfwd: true,
});
