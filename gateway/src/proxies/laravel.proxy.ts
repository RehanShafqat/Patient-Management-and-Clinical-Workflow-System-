import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "../config";

export const laravelProxy = createProxyMiddleware({
  target: config.services.laravelServiceUrl,
  changeOrigin: true,
  xfwd: true,
});
