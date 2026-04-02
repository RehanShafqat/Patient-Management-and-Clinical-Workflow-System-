export interface ServicesConfig {
  laravelServiceUrl: string;
  expressServiceUrl: string;
}

export const getServicesConfig = (): ServicesConfig => ({
  laravelServiceUrl: process.env.LARAVEL_SERVICE_URL!,
  expressServiceUrl: process.env.EXPRESS_SERVICE_URL!,
});
