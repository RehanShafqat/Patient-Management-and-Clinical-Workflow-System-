import cors from "cors";
import express from "express";
import { env } from "./config";
import { loggerMiddleware } from "./middlewares/logger.middleware";

import { authMiddleware } from "./middlewares/auth.middleware";
import proxy from "./proxies/proxy";
const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL || "http://localhost:4200",
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(loggerMiddleware);
app.use(authMiddleware);
app.use(proxy);

export default app;
