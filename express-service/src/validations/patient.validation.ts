import { z } from "zod";
import { withRequiredPreprocess } from "./validation.utils";
import { Gender } from "../enums/gender.enum";

// phone regex (supports +, country code, dashes, spaces)
const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\d{1,4}[-.\s]?\d{3}[-.\s]?\d{4}$/;

const basePatientSchema = z.object({
  first_name: withRequiredPreprocess(z.string().min(3).max(50)),

  middle_name: z.string().max(50).optional(),

  last_name: withRequiredPreprocess(z.string().min(3).max(50)),

  date_of_birth: z.coerce.date(),

  gender: withRequiredPreprocess(z.enum(Gender)),

  ssn: withRequiredPreprocess(z.string().regex(/^\d{3}-\d{2}-\d{4}$/)),

  email: withRequiredPreprocess(z.email()),

  phone: withRequiredPreprocess(z.string().regex(phoneRegex)),

  mobile: withRequiredPreprocess(z.string().regex(phoneRegex)),

  address: withRequiredPreprocess(z.string().max(100)),

  city: withRequiredPreprocess(z.string().max(50)),

  state: withRequiredPreprocess(z.string().max(50)),

  zip_code: withRequiredPreprocess(z.string().regex(/^\d{5}(-\d{4})?$/)),

  country: withRequiredPreprocess(z.string().max(50)),

  emergency_contact_name: withRequiredPreprocess(z.string().max(50)),

  emergency_contact_phone: withRequiredPreprocess(z.string().regex(phoneRegex)),

  primary_physician: z.string().max(50).optional(),

  insurance_provider: z.string().max(50).optional(),

  insurance_policy_number: z.string().max(50).optional(),

  preferred_language: z.string().max(30).optional(),

  patient_status: withRequiredPreprocess(
    z.enum(["active", "inactive", "deceased", "transferred"]),
  ),

  registration_date: z.coerce.date().optional(),
});

export const createPatientSchema = basePatientSchema
  .refine((data) => data.date_of_birth <= new Date(), {
    message: "Date of birth cannot be in the future",
    path: ["date_of_birth"],
  })
  .refine(
    (data) => {
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 150);
      return data.date_of_birth > minDate;
    },
    {
      message: "Invalid date of birth",
      path: ["date_of_birth"],
    },
  );

export const updatePatientSchema = basePatientSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
