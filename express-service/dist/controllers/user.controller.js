"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const api_response_util_1 = require("../utils/api-response.util");
const user_service_1 = require("../services/user.service");
const user_validation_1 = require("../validations/user.validation");
const app_error_util_1 = require("../utils/app-error.util");
const uuid_util_1 = require("../utils/uuid.util");
const enums_1 = require("../enums");
const pagination_util_1 = require("../utils/pagination.util");
class UserController {
    constructor(userService = new user_service_1.UserService()) {
        this.userService = userService;
        this.createUser = async (req, res, next) => {
            try {
                const userData = user_validation_1.createUserSchema.parse(req.body);
                const user = await this.userService.createUser(userData);
                return api_response_util_1.ApiResponse.send(res, { user }, enums_1.ResponseMessage.USER_CREATED, enums_1.HttpStatusCode.CREATED);
            }
            catch (error) {
                return next(error);
            }
        };
        this.getAllUsers = async (req, res, next) => {
            try {
                const query = user_validation_1.paginationQuerySchema.parse(req.query);
                const { page, per_page, ...filters } = query;
                const { rows: users, count: total } = await this.userService.getAllUsers(page, per_page, filters);
                const paginated = (0, pagination_util_1.getPaginatedResponse)(users, total, page, per_page, req);
                api_response_util_1.ApiResponse.send(res, paginated.data, enums_1.ResponseMessage.USERS_FETCHED, enums_1.HttpStatusCode.OK, paginated.links, paginated.meta);
            }
            catch (error) {
                next(error);
            }
        };
        this.getUserById = async (req, res, next) => {
            try {
                const id = Array.isArray(req.params.id)
                    ? req.params.id[0]
                    : req.params.id;
                if (!(0, uuid_util_1.isValidUUID)(id)) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.BAD_REQUEST, enums_1.ResponseMessage.INVALID_ID_FORMAT));
                }
                const user = await this.userService.getUserById(id);
                return api_response_util_1.ApiResponse.send(res, { user }, enums_1.ResponseMessage.USER_FETCHED);
            }
            catch (error) {
                return next(error);
            }
        };
        this.updateUser = async (req, res, next) => {
            try {
                const id = Array.isArray(req.params.id)
                    ? req.params.id[0]
                    : req.params.id;
                if (!(0, uuid_util_1.isValidUUID)(id)) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.BAD_REQUEST, enums_1.ResponseMessage.INVALID_ID_FORMAT));
                }
                const updateData = user_validation_1.updateUserSchema.parse(req.body);
                const user = await this.userService.updateUser(id, updateData);
                return api_response_util_1.ApiResponse.send(res, { user }, enums_1.ResponseMessage.USER_UPDATED);
            }
            catch (error) {
                return next(error);
            }
        };
        this.deleteUser = async (req, res, next) => {
            try {
                const id = Array.isArray(req.params.id)
                    ? req.params.id[0]
                    : req.params.id;
                if (!(0, uuid_util_1.isValidUUID)(id)) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.BAD_REQUEST, enums_1.ResponseMessage.INVALID_ID_FORMAT));
                }
                await this.userService.deleteUser(id);
                return api_response_util_1.ApiResponse.send(res, null, enums_1.ResponseMessage.USER_DELETED);
            }
            catch (error) {
                return next(error);
            }
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map