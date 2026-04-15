"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const sequelize_1 = require("sequelize");
const user_model_1 = require("../models/user.model");
const app_error_util_1 = require("../utils/app-error.util");
const enums_1 = require("../enums");
const models_1 = require("../models");
const database_config_1 = __importDefault(require("../config/database.config"));
class UserService {
    constructor() {
        this.createUser = async (userData) => {
            const existingUser = await user_model_1.User.findOne({
                where: { email: userData.email }
            });
            if (existingUser) {
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.BAD_REQUEST, enums_1.ResponseMessage.USER_ALREADY_EXISTS);
            }
            return await database_config_1.default.transaction(async (t) => {
                const user = await user_model_1.User.create(userData, { transaction: t });
                return await this.handleRoleSpecificData(user, userData, t);
            });
        };
        this.getAllUsers = async (page = 1, limit = 15, filters = {}) => {
            const offset = (page - 1) * limit;
            const where = {};
            if (filters.search) {
                const search = `%${filters.search.trim()}%`;
                where[sequelize_1.Op.or] = [
                    { first_name: { [sequelize_1.Op.like]: search } },
                    { last_name: { [sequelize_1.Op.like]: search } },
                    { email: { [sequelize_1.Op.like]: search } },
                    { phone: { [sequelize_1.Op.like]: search } },
                ];
            }
            if (filters.role) {
                where.role = filters.role;
            }
            if (typeof filters.is_active === "boolean") {
                where.is_active = filters.is_active;
            }
            return user_model_1.User.findAndCountAll({
                where,
                limit,
                offset,
                order: [["created_at", "DESC"]],
            });
        };
        this.getUserById = async (id) => {
            const user = await user_model_1.User.findByPk(id);
            if (!user) {
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.NOT_FOUND, enums_1.ResponseMessage.USER_NOT_FOUND);
            }
            return user;
        };
        this.updateUser = async (id, updateData) => {
            return await database_config_1.default.transaction(async (t) => {
                const user = await user_model_1.User.findByPk(id, { transaction: t });
                if (!user) {
                    throw new app_error_util_1.AppError(enums_1.HttpStatusCode.NOT_FOUND, enums_1.ResponseMessage.USER_NOT_FOUND);
                }
                if (updateData.email) {
                    throw new app_error_util_1.AppError(enums_1.HttpStatusCode.BAD_REQUEST, enums_1.ResponseMessage.EMAIL_UPDATE_FORBIDDEN);
                }
                // To Check role changes logic
                if (updateData.role && updateData.role !== user.role) {
                    if (updateData.role === enums_1.Role.DOCTOR) {
                        if (!updateData.specialty_id || !updateData.practice_location_id || !updateData.license_number) {
                            throw new app_error_util_1.AppError(enums_1.HttpStatusCode.BAD_REQUEST, enums_1.ResponseMessage.DOCTOR_FIELDS_REQUIRED);
                        }
                    }
                    else if (updateData.role === enums_1.Role.FDO) {
                        if (!updateData.permissions || updateData.permissions.length === 0) {
                            throw new app_error_util_1.AppError(enums_1.HttpStatusCode.BAD_REQUEST, enums_1.ResponseMessage.FDO_PERMISSIONS_REQUIRED);
                        }
                    }
                }
                await user.update(updateData, { transaction: t });
                return await this.handleRoleSpecificData(user, updateData, t);
            });
        };
        this.deleteUser = async (id) => {
            const user = await user_model_1.User.findByPk(id);
            if (!user) {
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.NOT_FOUND, enums_1.ResponseMessage.USER_NOT_FOUND);
            }
            await user.destroy();
        };
        this.handleRoleSpecificData = async (user, data, transaction) => {
            let result = { ...user.toJSON() };
            const role = data.role;
            if (role === enums_1.Role.FDO) {
                if (data.permissions) {
                    // Destroying existing permissions on update
                    await models_1.UserPermission.destroy({ where: { user_id: user.id }, transaction });
                    const permissionRows = data.permissions.map((permission) => ({
                        user_id: String(user.id),
                        permission_id: permission
                    }));
                    await models_1.UserPermission.bulkCreate(permissionRows, { transaction });
                    result.permissions = permissionRows;
                }
            }
            else if (role === enums_1.Role.DOCTOR) {
                let doctorProfile = await models_1.DoctorProfile.findOne({ where: { user_id: user.id }, transaction });
                const allowedFields = ['specialty_id', 'practice_location_id', 'license_number', 'availability_schedule', 'bio'];
                const profileData = {};
                allowedFields.forEach(field => {
                    if (data[field] !== undefined)
                        profileData[field] = data[field];
                });
                if (doctorProfile) {
                    if (Object.keys(profileData).length > 0) {
                        await doctorProfile.update(profileData, { transaction });
                    }
                }
                else {
                    profileData.user_id = user.id;
                    doctorProfile = await models_1.DoctorProfile.create(profileData, { transaction });
                }
                result.doctorProfile = doctorProfile;
            }
            return result;
        };
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map