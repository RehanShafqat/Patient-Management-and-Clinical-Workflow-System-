"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationQuerySchema = exports.updateSpecialtySchema = exports.createSpecialtySchema = void 0;
const zod_1 = require("zod");
const validation_utils_1 = require("./validation.utils");
exports.createSpecialtySchema = zod_1.z.object({
    specialty_name: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z
        .string()
        .min(2, "Specialty name must be at least 2 characters")
        .max(100, "Specialty name too long")),
    description: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z.string().max(500, "Description too long").optional()),
    is_active: zod_1.z.boolean().optional(),
});
exports.updateSpecialtySchema = zod_1.z
    .object({
    ...exports.createSpecialtySchema.shape,
})
    .partial();
exports.paginationQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    per_page: zod_1.z.coerce.number().int().min(1).max(100).default(15),
    search: validation_utils_1.optionalTrimmedString,
    is_active: validation_utils_1.optionalBooleanQuery,
});
//# sourceMappingURL=specialty.validation.js.map