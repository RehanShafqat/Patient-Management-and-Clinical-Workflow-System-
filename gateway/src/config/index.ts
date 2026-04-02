import dotenv from "dotenv";
import { getServicesConfig } from "./services";

dotenv.config();

export const env = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  LARAVEL_SERVICE_URL: process.env.LARAVEL_SERVICE_URL,
  EXPRESS_SERVICE_URL: process.env.EXPRESS_SERVICE_URL,
} as const;

const parsePort = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const config = {
  nodeEnv: env.NODE_ENV,
  port: parsePort(env.PORT, 4000),
  services: getServicesConfig(),
};
