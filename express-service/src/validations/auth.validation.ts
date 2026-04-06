import { z } from "zod";
import { withRequiredPreprocess } from "./validation.utils";

// export const signUpSchema = z.object({
//   firstName: withRequiredPreprocess(
//     z.string().min(1, "First name is required"),
//   ),

//   lastName: withRequiredPreprocess(z.string().min(1, "Last name is required")),

//   email: withRequiredPreprocess(
//     z
//       .string()
//       .min(1, "Email is required")
//       .pipe(z.string().email("Invalid email address")),
//   ),

//   phone: withRequiredPreprocess(
//     z
//       .string()
//       .min(1, "Phone number is required")
//       .pipe(z.string().regex(/^\d{11}$/, "Phone number must be 11 digits")),
//   ),

//   is_active: z.boolean().default(true),

//   password: withRequiredPreprocess(
//     z
//       .string()
//       .min(1, "Password is required")
//       .pipe(z.string().min(6, "Password must be at least 6 characters long")),
//   ),
// });
export const loginSchema = z.object({
  email: withRequiredPreprocess(
    z
      .string()
      .min(1, "Email is required")
      .pipe(z.email("Invalid email address")),
  ),
  password: withRequiredPreprocess(
    z
      .string()
      .min(1, "Password is required")
      .pipe(z.string().min(6, "Password must be at least 6 characters long")),
  ),
});
