"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAccessToken = void 0;
const env_config_1 = require("../config/env.config");
const app_error_util_1 = require("../utils/app-error.util");
const jwt_util_1 = require("../utils/jwt.util");
const checkAccessToken = (req, _res, next) => {
    try {
        const accessToken = req.cookies?.accessToken;
        if (!accessToken)
            throw new app_error_util_1.AppError(401, "Access token is required");
        const payload = (0, jwt_util_1.verifyJwtToken)(accessToken, env_config_1.env.JWT_SECRET);
        if (!payload.userId || typeof payload.userId !== "string") {
            throw new app_error_util_1.AppError(401, "Invalid access token");
        }
        req.userId = payload.userId;
        req.userRole = payload.role;
        next();
    }
    catch (error) {
        if (error instanceof app_error_util_1.AppError)
            return next(error);
        return next(new app_error_util_1.AppError(401, "Invalid or expired access token"));
    }
};
exports.checkAccessToken = checkAccessToken;
//# sourceMappingURL=auth.middleware.js.map