"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const api_response_util_1 = require("../utils/api-response.util");
const app_error_util_1 = require("../utils/app-error.util");
const validations_1 = require("../validations");
const enums_1 = require("../enums");
const cookie_util_1 = require("../utils/cookie.util");
class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.login = async (req, res, next) => {
            try {
                validations_1.loginSchema.parse(req.body);
                const result = await this.authService.login(req.body);
                (0, cookie_util_1.setAuthToken)(res, result.accessToken);
                api_response_util_1.ApiResponse.send(res, { user: result.user }, enums_1.ResponseMessage.LOGIN_SUCCESS, enums_1.HttpStatusCode.OK);
            }
            catch (error) {
                return next(error);
            }
        };
        this.getMe = async (req, res, next) => {
            try {
                if (!req.userId)
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.UNAUTHORIZED, enums_1.ResponseMessage.UNAUTHORIZED));
                const user = await this.authService.getMe(req.userId);
                api_response_util_1.ApiResponse.send(res, { user }, enums_1.ResponseMessage.USER_FETCHED, enums_1.HttpStatusCode.OK);
            }
            catch (error) {
                return next(error);
            }
        };
        this.logout = async (req, res, next) => {
            try {
                (0, cookie_util_1.clearAuthToken)(res);
                api_response_util_1.ApiResponse.send(res, null, enums_1.ResponseMessage.LOGOUT_SUCCESS, enums_1.HttpStatusCode.OK);
            }
            catch (error) {
                return next(error);
            }
        };
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map