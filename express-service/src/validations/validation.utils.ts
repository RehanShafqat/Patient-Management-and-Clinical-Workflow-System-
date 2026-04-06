import { z } from "zod";

export const withRequiredPreprocess = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    (value) => (value === undefined || value === null ? "" : value),
    schema,
  );
