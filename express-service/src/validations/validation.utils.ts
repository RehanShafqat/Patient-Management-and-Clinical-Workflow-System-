import { z } from "zod";

export const withRequiredPreprocess = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => {
    // keep Date intact
    if (value instanceof Date) return value;

    // convert empty values to undefined (NOT "")
    if (value === null || value === undefined || value === "") {
      return undefined;
    }

    // trim strings
    if (typeof value === "string") {
      return value.trim();
    }

    return value;
  }, schema);
