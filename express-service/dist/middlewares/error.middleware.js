"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const app_error_util_1 = require("../utils/app-error.util");
const logger_config_1 = __importDefault(require("../config/logger.config"));
const sequelize_1 = require("sequelize");
const zod_1 = require("zod");
const env_config_1 = require("../config/env.config");
const normalizeFieldPath = (path) => {
    if (path.length === 0)
        return "field";
    return path.map((segment) => String(segment).replace(/_/g, " ")).join(".");
};
const capitalize = (value) => {
    if (!value)
        return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
};
const errorHandler = (err, req, res, _next) => {
    if (err instanceof app_error_util_1.AppError) {
        res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
        });
        return;
    }
    if (err instanceof sequelize_1.UniqueConstraintError) {
        const fields = err.errors.map((e) => e.path).join(", ");
        res.status(409).json({
            success: false,
            message: `${fields} already exists`,
        });
        return;
    }
    if (err instanceof zod_1.ZodError) {
        const normalizedIssues = err.issues.map((issue) => {
            const field = normalizeFieldPath(issue.path);
            const rawMessage = issue.message || "Validation failed";
            const isRequiredIssue = issue.code === "invalid_type" &&
                rawMessage.toLowerCase().includes("received undefined");
            const isGenericTypeMismatchIssue = issue.code === "invalid_type" &&
                /expected\s+\w+\s*,\s*received\s+\w+/i.test(rawMessage);
            return {
                field,
                message: isRequiredIssue
                    ? `${capitalize(field)} is required`
                    : isGenericTypeMismatchIssue
                        ? `${capitalize(field)} has an invalid value`
                        : rawMessage,
                isRequired: isRequiredIssue,
            };
        });
        const fieldsWithRequiredIssue = new Set(normalizedIssues
            .filter((issue) => issue.isRequired)
            .map((issue) => issue.field));
        const filteredMessages = normalizedIssues
            .filter((issue) => {
            if (!issue.isRequired && fieldsWithRequiredIssue.has(issue.field)) {
                return false;
            }
            return true;
        })
            .map((issue) => issue.message)
            .filter(Boolean);
        const message = Array.from(new Set(filteredMessages)).join(", ") || "Validation failed";
        res.status(400).json({
            success: false,
            message,
        });
        return;
    }
    if (err instanceof sequelize_1.ValidationError) {
        const messages = err.errors.map((e) => e.message).join(", ");
        res.status(400).json({
            success: false,
            message: messages,
        });
        return;
    }
    if (err instanceof sequelize_1.ForeignKeyConstraintError) {
        res.status(400).json({
            success: false,
            message: "Referenced record does not exist",
        });
        return;
    }
    if (err instanceof sequelize_1.OptimisticLockError) {
        res.status(400).json({
            success: false,
            message: "The requested resource to update has been updated by someone else please refresh and try again",
        });
    }
    logger_config_1.default.error(`Unexpected Error: ${err.message}\n${err.stack}`);
    res.status(500).json({
        success: false,
        message: env_config_1.env.NODE_ENV === "development" ? err.message : "Internal Server Error",
        ...(env_config_1.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map