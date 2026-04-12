import { z } from "zod";

export const withRequiredPreprocess = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => {
    // keep Date intact
    if (value instanceof Date) return value;

    // trim strings before emptiness check so whitespace-only values become undefined
    if (typeof value === "string") {
      value = value.trim();
    }

    // convert empty values to undefined (NOT "")
    if (value === null || value === undefined || value === "") {
      return undefined;
    }
    return value;
  }, schema);
