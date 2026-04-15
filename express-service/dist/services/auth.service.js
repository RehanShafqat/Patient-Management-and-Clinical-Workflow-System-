"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const env_config_1 = require("../config/env.config");
const enums_1 = require("../enums");
const models_1 = require("../models");
const app_error_util_1 = require("../utils/app-error.util");
const jwt_util_1 = require("../utils/jwt.util");
const bcrypt_util_1 = require("../utils/bcrypt.util");
class AuthService {
    constructor() {
        this.login = async (data) => {
            const user = await models_1.User.scope("withPassword").findOne({
                where: { email: data.email.trim().toLowerCase() },
            });
            if (!user)
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.UNAUTHORIZED, enums_1.ResponseMessage.INVALID_CREDENTIALS);
            if (!user.is_active)
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.FORBIDDEN, enums_1.ResponseMessage.ACCOUNT_INACTIVE);
            if (!user.password)
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.INTERNAL_SERVER_ERROR, enums_1.ResponseMessage.PASSWORD_MISSING);
            const isPasswordMatched = await (0, bcrypt_util_1.comparePassword)(data.password, user.password);
            if (!isPasswordMatched)
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.UNAUTHORIZED, enums_1.ResponseMessage.INVALID_CREDENTIALS);
            if (!Object.values(enums_1.Role).includes(user.role)) {
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.FORBIDDEN, enums_1.ResponseMessage.ROLE_NOT_ALLOWED);
            }
            const accessToken = (0, jwt_util_1.createJwtToken)(String(user.id), user.role, env_config_1.env.JWT_SECRET, String(env_config_1.env.JWT_EXPIRES_IN));
            //INFO: Base payload it is same for all roles
            const basePayload = {
                accessToken,
                user: {
                    id: String(user.id),
                    role: user.role,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    created_at: user.created_at,
                },
            };
            //INFO: Role-specific additions
            if (user.role === enums_1.Role.DOCTOR) {
                const profile = await models_1.DoctorProfile.findOne({
                    where: { user_id: user.id },
                });
                return { ...basePayload, profile };
            }
            if (user.role === enums_1.Role.FDO) {
                console.log("Hello");
                const userPermissions = await models_1.UserPermission.findAll({
                    where: { user_id: user.id },
                    include: [{ model: models_1.Permission, as: "permission", attributes: ["permission_name"] }],
                });
                const permissions = null;
                // = userPermissions.map(
                //   (up) => up.permission.permission_name,
                // );
                return { ...basePayload, permissions };
            }
            // Admin gets base only
            return basePayload;
        };
        this.getMe = async (userId) => {
            const user = await models_1.User.findByPk(userId);
            if (!user)
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.NOT_FOUND, enums_1.ResponseMessage.USER_NOT_FOUND);
            if (!user.is_active)
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.FORBIDDEN, enums_1.ResponseMessage.ACCOUNT_INACTIVE);
            return {
                id: String(user.id),
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name,
                created_at: user.created_at,
            };
        };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map