
export const routes = [
  {
    pathFilter: [
      "/api/health",
      "/api/appointments",
      "/api/practice-locations",
      "/api/dashboard",
    ],
    target: process.env.LARAVEL_SERVICE_URL,
  },
  {
    pathFilter: [
      "/express/check",
      "/api/auth",
      "/api/users",
      "/api/patients",
      "/api/cases",
      "/api/specialties",
    ],
    target: process.env.EXPRESS_SERVICE_URL,
  },
];
