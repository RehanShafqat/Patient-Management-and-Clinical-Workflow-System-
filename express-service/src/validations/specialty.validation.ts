import { z } from "zod";
import { withRequiredPreprocess } from "./validation.utils";

export const createSpecialtySchema = z.object({
  specialty_name: withRequiredPreprocess(
    z
      .string()
      .min(2, "Specialty name must be at least 2 characters")
      .max(100, "Specialty name too long"),
  ),

  description: withRequiredPreprocess(
    z.string().max(500, "Description too long").optional(),
  ),

  is_active: z.boolean().optional(),
});

export const updateSpecialtySchema = z
  .object({
    ...createSpecialtySchema.shape,
  })
  .partial();
