"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = require("zod");
const validation_utils_1 = require("./validation.utils");
exports.loginSchema = zod_1.z.object({
    email: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z
        .string()
        .min(1, "Email is required")
        .pipe(zod_1.z.email("Invalid email address"))),
    password: (0, validation_utils_1.withRequiredPreprocess)(zod_1.z
        .string()
        .min(1, "Password is required")
        .pipe(zod_1.z.string().min(6, "Password must be at least 6 characters long"))),
});
//# sourceMappingURL=auth.validation.js.map