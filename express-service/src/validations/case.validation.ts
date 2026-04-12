import { z } from "zod";
import { withRequiredPreprocess } from "./validation.utils";
import { enumToArray } from "../utils/enum.util";

import { CaseCategory } from "../enums/caseCategory.enum";
import { CasePriority } from "../enums/casePriority.enum";
import { CaseStatus } from "../enums/caseStatus.enum";
import { CaseType } from "../enums/caseType.enum";

export const createCaseSchema = z
  .object({
    patient_id: withRequiredPreprocess(
      z.string().uuid({ message: "Patient ID must be a valid UUID" }),
    ),

    practice_location_id: withRequiredPreprocess(
      z.string().uuid({ message: "Practice location ID must be a valid UUID" }),
    ),

    category: withRequiredPreprocess(z.enum(enumToArray(CaseCategory))),

    purpose_of_visit: withRequiredPreprocess(
      z
        .string()
        .min(5, "Purpose must be at least 5 characters")
        .max(1000, "Purpose too long"),
    ),

    case_type: withRequiredPreprocess(z.enum(enumToArray(CaseType))),

    // Use preprocess to handle null/empty strings for optional enums
    priority: withRequiredPreprocess(
      z.enum(enumToArray(CasePriority)).optional(),
    ),

    case_status: withRequiredPreprocess(
      z.enum(enumToArray(CaseStatus)).optional(),
    ),

    // For Dates: we must handle null before coercion
    date_of_accident: z
      .preprocess(
        (val) => (val === "" || val === null ? undefined : val),
        z.coerce.date().optional(),
      )
      .refine(
        (date) => !date || date <= new Date(),
        "Accident date cannot be in the future",
      ),

    // For Optional UUIDs: convert null/empty to undefined
    insurance_id: z.preprocess(
      (val) => (val === "" || val === null ? undefined : val),
      z.string().uuid({ message: "Insurance ID must be a valid UUID" }).optional(),
    ),

    firm_id: z.preprocess(
      (val) => (val === "" || val === null ? undefined : val),
      z.string().uuid({ message: "Firm ID must be a valid UUID" }).optional(),
    ),

    referred_by: withRequiredPreprocess(z.string().max(100).optional()),

    referred_doctor_name: withRequiredPreprocess(
      z.string().max(100).optional(),
    ),

    opening_date: z.preprocess(
      (val) => (val === "" || val === null ? undefined : val),
      z.coerce.date().optional(),
    ),

    closing_date: z
      .preprocess(
        (val) => (val === "" || val === null ? undefined : val),
        z.coerce.date().optional(),
      )
      .refine(
        (date) => !date || date <= new Date(),
        "Closing date cannot be in the future",
      ),

    clinical_notes: withRequiredPreprocess(z.string().max(2000).optional()),
  })
  .refine(
    (data) => {
      if (data.closing_date && data.opening_date) {
        return data.closing_date >= data.opening_date;
      }
      return true;
    },
    {
      message: "Closing date must be after opening date",
      path: ["closing_date"],
    },
  );

export const updateCaseSchema = z.object({
  ...createCaseSchema
}).partial();