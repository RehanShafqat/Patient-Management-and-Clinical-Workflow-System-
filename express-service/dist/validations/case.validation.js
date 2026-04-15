"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationQuerySchema = exports.updateCaseSchema = exports.createCaseSchema = void 0;
const zod_1 = require("zod");
const validation_utils_1 = require("./validation.utils");
const enum_util_1 = require("../utils/enum.util");
const caseCategory_enum_1 = require("../enums/caseCategory.enum");
const casePriority_enum_1 = require("../enums/casePriority.enum");
const caseStatus_enum_1 = require("../enums/caseStatus.enum");
const caseType_enum_1 = require("../enums/caseType.enum");
exports.createCaseSchema = zod_1.z
    .object({
    patient_id: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().uuid({ message: "Patient ID must be a valid UUID" })),
    practice_location_id: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().uuid({ message: "Practice location ID must be a valid UUID" })),
    category: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.enum((0, enum_util_1.enumToArray)(caseCategory_enum_1.CaseCategory))),
    purpose_of_visit: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z
        .string()
        .min(5, "Purpose must be at least 5 characters")
        .max(1000, "Purpose too long")),
    case_type: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.enum((0, enum_util_1.enumToArray)(caseType_enum_1.CaseType))),
    // Use preprocess to handle null/empty strings for optional enums
    priority: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.enum((0, enum_util_1.enumToArray)(casePriority_enum_1.CasePriority)).optional()),
    case_status: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.enum((0, enum_util_1.enumToArray)(caseStatus_enum_1.CaseStatus)).optional()),
    // For Dates: we must handle null before coercion
    date_of_accident: zod_1.z
        .preprocess((val) => (val === "" || val === null ? undefined : val), zod_1.z.coerce.date().optional())
        .refine((date) => !date || date <= new Date(), "Accident date cannot be in the future"),
    // For Optional UUIDs: convert null/empty to undefined
    insurance_id: zod_1.z.preprocess((val) => (val === "" || val === null ? undefined : val), zod_1.z
        .string()
        .uuid({ message: "Insurance ID must be a valid UUID" })
        .optional()),
    firm_id: zod_1.z.preprocess((val) => (val === "" || val === null ? undefined : val), zod_1.z.string().uuid({ message: "Firm ID must be a valid UUID" }).optional()),
    referred_by: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().max(100).optional()),
    referred_doctor_name: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().max(100).optional()),
    opening_date: zod_1.z.preprocess((val) => (val === "" || val === null ? undefined : val), zod_1.z.coerce.date().optional()),
    closing_date: zod_1.z
        .preprocess((val) => (val === "" || val === null ? undefined : val), zod_1.z.coerce.date().optional())
        .refine((date) => !date || date <= new Date(), "Closing date cannot be in the future"),
    clinical_notes: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().max(2000).optional()),
})
    .refine((data) => {
    if (data.closing_date && data.opening_date) {
        return data.closing_date >= data.opening_date;
    }
    return true;
}, {
    message: "Closing date must be after opening date",
    path: ["closing_date"],
});
exports.updateCaseSchema = zod_1.z
    .object({
    ...exports.createCaseSchema,
})
    .partial();
exports.paginationQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    per_page: zod_1.z.coerce.number().int().min(1).max(100).default(15),
    search: validation_utils_1.optionalTrimmedString,
    case_number: validation_utils_1.optionalTrimmedString,
    patient_id: validation_utils_1.optionalUuidQuery,
    practice_location_id: validation_utils_1.optionalUuidQuery,
    insurance_id: validation_utils_1.optionalUuidQuery,
    firm_id: validation_utils_1.optionalUuidQuery,
    category: (0, validation_utils_1.preprocessOptionalEnum)((0, enum_util_1.enumToArray)(caseCategory_enum_1.CaseCategory)),
    case_type: (0, validation_utils_1.preprocessOptionalEnum)((0, enum_util_1.enumToArray)(caseType_enum_1.CaseType)),
    priority: (0, validation_utils_1.preprocessOptionalEnum)((0, enum_util_1.enumToArray)(casePriority_enum_1.CasePriority)),
    case_status: (0, validation_utils_1.preprocessOptionalEnum)((0, enum_util_1.enumToArray)(caseStatus_enum_1.CaseStatus)),
    opening_date_from: validation_utils_1.optionalDateQuery,
    opening_date_to: validation_utils_1.optionalDateQuery,
});
//# sourceMappingURL=case.validation.js.map