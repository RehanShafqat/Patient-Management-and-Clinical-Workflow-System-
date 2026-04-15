"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRoleMiddleware = void 0;
const enums_1 = require("../enums");
const app_error_util_1 = require("../utils/app-error.util");
const models_1 = require("../models");
const checkRoleMiddleware = (roles) => {
    return async (req, _res, next) => {
        try {
            if (req.userRole === enums_1.Role.ADMIN) {
                next();
                return;
            }
            if (!roles.includes(req.userRole)) {
                return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.UNAUTHORIZED, enums_1.ResponseMessage.UNAUTHORIZED));
            }
            if (req.userRole === enums_1.Role.FDO) {
                const user = await models_1.User.findByPk(req.userId, {
                    include: [
                        {
                            model: models_1.UserPermission,
                            as: "userPermissions",
                            include: [
                                {
                                    model: models_1.Permission,
                                    as: "permission",
                                    attributes: ["permission_name"],
                                },
                            ],
                        },
                    ],
                });
                if (!user) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.NOT_FOUND, enums_1.ResponseMessage.USER_NOT_FOUND));
                }
                req.user = user;
            }
            next();
            return;
        }
        catch (error) {
            return next(error);
        }
    };
};
exports.checkRoleMiddleware = checkRoleMiddleware;
//# sourceMappingURL=checkRole.middleware.js.map