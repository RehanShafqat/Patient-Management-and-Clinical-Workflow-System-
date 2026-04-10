// config/routes.config.ts
export const routes = [
  {
    pathFilter: ["/api/health"],
    target: process.env.LARAVEL_SERVICE_URL,
  },
  {
    pathFilter: ["/express/check", "/api/auth", "/api/users"],
    target: process.env.EXPRESS_SERVICE_URL,
  },
];
