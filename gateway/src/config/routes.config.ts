// config/routes.config.ts
export const routes = [
  {
    pathFilter: [
      "/api/health",
      "/api/appointments",
      "/api/patients",
      "/api/cases",
      "/api/visits",
    ],
    target: process.env.LARAVEL_SERVICE_URL,
  },
  {
    pathFilter: ["/express/check"],
    target: process.env.EXPRESS_SERVICE_URL,
  },
];
