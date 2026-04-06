// config/routes.config.ts
export const routes = [
  {
    pathFilter: [],
    target: process.env.LARAVEL_SERVICE_URL,
  },
  {
    pathFilter: ["/express/check", "/api/auth"],
    target: process.env.EXPRESS_SERVICE_URL,
  },
];
