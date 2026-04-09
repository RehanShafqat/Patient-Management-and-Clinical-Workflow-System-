import { z } from "zod";
import { withRequiredPreprocess } from "./validation.utils";

// phone regex (supports +, country code, dashes, spaces)
const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\d{1,4}[-.\s]?\d{3}[-.\s]?\d{4}$/;

export const createPatientSchema = z.object({
  first_name: withRequiredPreprocess(
    z.string().min(3, "First name must be at least 3 characters long").max(50),
  ),

  middle_name: z
    .string()
    .max(50, "Middle name must be at most 50 characters long")
    .optional(),

  last_name: withRequiredPreprocess(
    z.string().min(3, "Last name must be at least 3 characters long").max(50),
  ),

  date_of_birth: z.coerce
    .date()
    .refine(
      (date) => date <= new Date(),
      "Date of birth cannot be in the future",
    )
    .refine((date) => {
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 150);
      return date > minDate;
    }, "Please enter a valid date of birth"),

  gender: withRequiredPreprocess(
    z.enum(["male", "female", "other", "prefer not to say"]),
  ),

  ssn: withRequiredPreprocess(
    z.string().regex(/^\d{3}-\d{2}-\d{4}$/, "Invalid SSN format"),
  ),

  email: withRequiredPreprocess(z.string().email("Invalid email address")),

  phone: withRequiredPreprocess(
    z.string().regex(phoneRegex, "Invalid phone number format"),
  ),

  mobile: withRequiredPreprocess(
    z.string().regex(phoneRegex, "Invalid mobile number format"),
  ),

  address: withRequiredPreprocess(
    z.string().max(100, "Address must be at most 100 characters long"),
  ),

  city: withRequiredPreprocess(
    z.string().max(50, "City must be at most 50 characters long"),
  ),

  state: withRequiredPreprocess(
    z.string().max(50, "State must be at most 50 characters long"),
  ),

  zip_code: withRequiredPreprocess(
    z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid zip code format"),
  ),

  country: withRequiredPreprocess(
    z.string().max(50, "Country must be at most 50 characters long"),
  ),

  emergency_contact_name: withRequiredPreprocess(
    z
      .string()
      .max(50, "Emergency contact name must be at most 50 characters long"),
  ),

  emergency_contact_phone: withRequiredPreprocess(
    z.string().regex(phoneRegex, "Invalid emergency contact phone number"),
  ),

  primary_physician: z
    .string()
    .max(50, "Primary physician must be at most 50 characters long")
    .optional(),

  insurance_provider: z
    .string()
    .max(50, "Insurance provider must be at most 50 characters long")
    .optional(),

  insurance_policy_number: z
    .string()
    .max(50, "Insurance policy number must be at most 50 characters long")
    .optional(),

  preferred_language: z
    .string()
    .max(30, "Preferred language must be at most 30 characters long")
    .optional(),

  patient_status: withRequiredPreprocess(
    z.enum(["active", "inactive", "deceased", "transferred"]),
  ),

  registration_date: z.coerce.date().optional(),
});
