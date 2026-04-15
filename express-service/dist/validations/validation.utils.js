"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidSpecialtyId = exports.preprocessOptionalNativeEnum = exports.preprocessOptionalEnum = exports.optionalBooleanQuery = exports.optionalDateQuery = exports.optionalUuidQuery = exports.optionalTrimmedString = exports.normalizeOptionalQueryValue = exports.withRequiredPreprocess = void 0;
const zod_1 = require("zod");
const uuid_util_1 = require("../utils/uuid.util");
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const withRequiredPreprocess = (schema) => zod_1.z.preprocess((value) => {
    // keep Date intact
    if (value instanceof Date)
        return value;
    // trim strings before emptiness check so whitespace-only values become undefined
    if (typeof value === "string") {
        value = value.trim();
    }
    // convert empty values to undefined (NOT "")
    if (value === null || value === undefined || value === "") {
        return undefined;
    }
    return value;
}, schema);
exports.withRequiredPreprocess = withRequiredPreprocess;
const normalizeOptionalQueryValue = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed === "" ? undefined : trimmed;
    }
    return value;
};
exports.normalizeOptionalQueryValue = normalizeOptionalQueryValue;
exports.optionalTrimmedString = zod_1.z.preprocess(exports.normalizeOptionalQueryValue, zod_1.z.string().optional());
exports.optionalUuidQuery = zod_1.z.preprocess(exports.normalizeOptionalQueryValue, zod_1.z.string().uuid().optional());
exports.optionalDateQuery = zod_1.z.preprocess(exports.normalizeOptionalQueryValue, zod_1.z
    .string()
    .regex(DATE_ONLY_REGEX, "Date must be in YYYY-MM-DD format")
    .optional());
exports.optionalBooleanQuery = zod_1.z.preprocess((value) => {
    const normalized = (0, exports.normalizeOptionalQueryValue)(value);
    if (normalized === undefined) {
        return undefined;
    }
    if (typeof normalized === "boolean") {
        return normalized;
    }
    if (typeof normalized === "string") {
        const lowered = normalized.toLowerCase();
        if (lowered === "true" || lowered === "1")
            return true;
        if (lowered === "false" || lowered === "0")
            return false;
    }
    return normalized;
}, zod_1.z.boolean().optional());
const preprocessOptionalEnum = (values) => zod_1.z.preprocess(exports.normalizeOptionalQueryValue, zod_1.z.enum(values).optional());
exports.preprocessOptionalEnum = preprocessOptionalEnum;
const preprocessOptionalNativeEnum = (enumObject) => zod_1.z.preprocess(exports.normalizeOptionalQueryValue, zod_1.z.nativeEnum(enumObject).optional());
exports.preprocessOptionalNativeEnum = preprocessOptionalNativeEnum;
const isValidSpecialtyId = (id) => {
    const numericIdPattern = /^\d+$/;
    return (0, uuid_util_1.isValidUUID)(id) || numericIdPattern.test(id);
};
exports.isValidSpecialtyId = isValidSpecialtyId;
//# sourceMappingURL=validation.utils.js.map