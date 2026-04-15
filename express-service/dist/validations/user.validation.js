"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationQuerySchema = exports.updateUserSchema = exports.createUserSchema = exports.fdoSchema = void 0;
const zod_1 = require("zod");
const validation_utils_1 = require("./validation.utils");
const enums_1 = require("../enums");
const baseUser = zod_1.z.object({
    first_name: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z
        .string()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name cannot exceed 50 characters")),
    last_name: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z
        .string()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name cannot exceed 50 characters")),
    email: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.email("Please provide a valid email address")),
    password: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password cannot exceed 100 characters")),
    phone: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().max(20, "Phone number cannot exceed 20 characters")),
    is_active: zod_1.z.boolean(),
});
const doctorSchema = baseUser.extend({
    role: zod_1.z.literal(enums_1.Role.DOCTOR),
    specialty_id: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().min(1, "Specialty is required")),
    practice_location_id: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().min(1, "Practice location is required")),
    license_number: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().min(1, "License number is required")),
    availability_schedule: zod_1.z.json().optional(),
    bio: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().max(500, "Bio cannot exceed 500 characters").optional()),
});
exports.fdoSchema = baseUser.extend({
    role: zod_1.z.literal(enums_1.Role.FDO),
    permissions: zod_1.z
        .array(zod_1.z.string().uuid("Permission ID must be a valid UUID"))
        .min(1, "At least one permission is required"),
});
const userRoleGuardSchema = zod_1.z
    .looseObject({
    role: zod_1.z.unknown().optional(),
})
    .superRefine((data, ctx) => {
    //INFO: if role is missing or empty, add an issue for the role field
    if (typeof data.role !== "string" || data.role.trim() === "") {
        ctx.addIssue({
            code: "custom",
            path: ["role"],
            message: "Role is required",
        });
        return;
    }
    //INFO: if role is not doctor or fdo, add an issue for the role field
    if (![enums_1.Role.DOCTOR, enums_1.Role.FDO].includes(data.role)) {
        ctx.addIssue({
            code: "custom",
            path: ["role"],
            message: "Role must be either doctor or fdo",
        });
    }
});
exports.createUserSchema = userRoleGuardSchema.pipe(zod_1.z.discriminatedUnion("role", [doctorSchema, exports.fdoSchema]));
exports.updateUserSchema = zod_1.z
    .object({
    ...doctorSchema.shape,
    ...exports.fdoSchema.shape,
    role: zod_1.z.enum([enums_1.Role.DOCTOR, enums_1.Role.FDO]).optional(),
})
    .partial();
exports.paginationQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    per_page: zod_1.z.coerce.number().int().min(1).max(100).default(15),
    search: validation_utils_1.optionalTrimmedString,
    role: (0, validation_utils_1.preprocessOptionalNativeEnum)(enums_1.Role),
    is_active: validation_utils_1.optionalBooleanQuery,
});
//# sourceMappingURL=user.validation.js.map