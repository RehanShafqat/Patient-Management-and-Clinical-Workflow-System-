"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidSpecialtyId = exports.withRequiredPreprocess = void 0;
const zod_1 = require("zod");
const uuid_util_1 = require("../utils/uuid.util");
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
const isValidSpecialtyId = (id) => {
    const numericIdPattern = /^\d+$/;
    return (0, uuid_util_1.isValidUUID)(id) || numericIdPattern.test(id);
};
exports.isValidSpecialtyId = isValidSpecialtyId;
//# sourceMappingURL=validation.utils.js.map