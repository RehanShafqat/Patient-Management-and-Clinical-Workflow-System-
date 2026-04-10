import { z } from "zod";
import { withRequiredPreprocess } from "./validation.utils";
import { enumToArray } from "../utils/enum.util";
import { UserRole } from "../enums/userRole.enum";

// CREATE USER
export const createUserSchema = z.object({
  role: withRequiredPreprocess(z.enum(enumToArray(UserRole))),

  first_name: withRequiredPreprocess(z.string().min(2).max(50)),

  last_name: withRequiredPreprocess(z.string().min(2).max(50)),

  email: withRequiredPreprocess(z.email("Invalid email format")),

  password: withRequiredPreprocess(
    z.string().min(6, "Password must be at least 6 characters"),
  ),

  phone: withRequiredPreprocess(z.string().max(20).optional()),

  is_active: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.coerce.boolean().optional(),
  ),
});

// UPDATE USER (partial) -- columns are optional
export const updateUserSchema = createUserSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
