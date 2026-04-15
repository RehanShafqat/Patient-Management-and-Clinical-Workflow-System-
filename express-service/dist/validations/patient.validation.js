"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationQuerySchema = exports.updatePatientSchema = exports.createPatientSchema = void 0;
const zod_1 = require("zod");
const validation_utils_1 = require("./validation.utils");
const gender_enum_1 = require("../enums/gender.enum");
// phone regex (supports +, country code, dashes, spaces)
const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\d{1,4}[-.\s]?\d{3}[-.\s]?\d{4}$/;
const basePatientSchema = zod_1.z.object({
    first_name: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().min(3).max(50)),
    middle_name: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().max(50).optional()),
    last_name: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().min(3).max(50)),
    date_of_birth: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.coerce.date()),
    gender: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.enum(gender_enum_1.Gender)),
    ssn: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z
        .string()
        .regex(/^\d{3}-\d{2}-\d{4}$/)
        .optional()),
    email: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.email().optional()),
    phone: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().regex(phoneRegex).optional()),
    mobile: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().regex(phoneRegex).optional()),
    address: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().max(100).optional()),
    city: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().max(50).optional()),
    state: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().max(50).optional()),
    zip_code: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z
        .string()
        .regex(/^\d{5}(-\d{4})?$/)
        .optional()),
    country: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().max(50).optional()),
    emergency_contact_name: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().max(50).optional()),
    emergency_contact_phone: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().regex(phoneRegex).optional()),
    primary_physician: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().max(50).optional()),
    insurance_provider: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().max(50).optional()),
    insurance_policy_number: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().max(50).optional()),
    preferred_language: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().max(30).optional()),
    patient_status: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.enum(["active", "inactive", "deceased", "transferred"])),
    registration_date: zod_1.z.coerce.date().optional(),
});
exports.createPatientSchema = basePatientSchema
    .refine((data) => data.date_of_birth <= new Date(), {
    message: "Date of birth cannot be in the future",
    path: ["date_of_birth"],
})
    .refine((data) => {
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 150);
    return data.date_of_birth > minDate;
}, {
    message: "Invalid date of birth",
    path: ["date_of_birth"],
});
exports.updatePatientSchema = zod_1.z
    .object({
    ...basePatientSchema.shape,
})
    .partial();
exports.paginationQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    per_page: zod_1.z.coerce.number().int().min(1).max(100).default(15),
});
//# sourceMappingURL=patient.validation.js.map