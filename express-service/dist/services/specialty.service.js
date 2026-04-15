"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialtyService = void 0;
const sequelize_1 = require("sequelize");
const specialty_model_1 = require("../models/specialty.model");
const app_error_util_1 = require("../utils/app-error.util");
const enums_1 = require("../enums");
class SpecialtyService {
    constructor() {
        this.createSpecialty = async (data) => {
            const specialty = await specialty_model_1.Specialty.create(data);
            if (!specialty) {
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.INTERNAL_SERVER_ERROR, enums_1.ResponseMessage.SPECIALTY_CREATION_FAILED);
            }
            return specialty;
        };
        this.getAllSpecialties = async (page = 1, limit = 15, filters = {}) => {
            const offset = (page - 1) * limit;
            const where = {};
            if (filters.search) {
                const search = `%${filters.search.trim()}%`;
                where[sequelize_1.Op.or] = [
                    { specialty_name: { [sequelize_1.Op.like]: search } },
                    { description: { [sequelize_1.Op.like]: search } },
                ];
            }
            if (typeof filters.is_active === "boolean") {
                where.is_active = filters.is_active;
            }
            return specialty_model_1.Specialty.findAndCountAll({
                where,
                limit,
                offset,
                order: [["created_at", "DESC"]],
            });
        };
        this.getSpecialtyById = async (id) => {
            const specialty = await specialty_model_1.Specialty.findByPk(id);
            if (!specialty) {
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.NOT_FOUND, enums_1.ResponseMessage.SPECIALTY_NOT_FOUND);
            }
            return specialty;
        };
        this.updateSpecialty = async (id, data) => {
            const specialty = await specialty_model_1.Specialty.findByPk(id);
            if (!specialty) {
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.NOT_FOUND, enums_1.ResponseMessage.SPECIALTY_NOT_FOUND);
            }
            await specialty.update(data);
            return specialty;
        };
        this.deleteSpecialty = async (id) => {
            const specialty = await specialty_model_1.Specialty.findByPk(id);
            if (!specialty) {
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.NOT_FOUND, enums_1.ResponseMessage.SPECIALTY_NOT_FOUND);
            }
            await specialty.destroy();
        };
    }
}
exports.SpecialtyService = SpecialtyService;
//# sourceMappingURL=specialty.service.js.map