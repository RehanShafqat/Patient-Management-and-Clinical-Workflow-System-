"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseService = void 0;
const sequelize_1 = require("sequelize");
const patientCase_model_1 = require("../models/patientCase.model");
const app_error_util_1 = require("../utils/app-error.util");
const enums_1 = require("../enums");
class CaseService {
    constructor() {
        this.createCase = async (caseData) => {
            const patientCase = await patientCase_model_1.PatientCase.create(caseData);
            if (!patientCase) {
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.INTERNAL_SERVER_ERROR, enums_1.ResponseMessage.CASE_CREATION_FAILED);
            }
            return patientCase;
        };
        this.getAllCases = async (page = 1, limit = 15, filters = {}) => {
            const offset = (page - 1) * limit;
            const where = {};
            if (filters.search) {
                const search = `%${filters.search.trim()}%`;
                where[sequelize_1.Op.or] = [
                    { case_number: { [sequelize_1.Op.like]: search } },
                    { purpose_of_visit: { [sequelize_1.Op.like]: search } },
                    { referred_by: { [sequelize_1.Op.like]: search } },
                    { referred_doctor_name: { [sequelize_1.Op.like]: search } },
                ];
            }
            if (filters.case_number) {
                where.case_number = { [sequelize_1.Op.like]: `%${filters.case_number}%` };
            }
            if (filters.patient_id) {
                where.patient_id = filters.patient_id;
            }
            if (filters.practice_location_id) {
                where.practice_location_id = filters.practice_location_id;
            }
            if (filters.insurance_id) {
                where.insurance_id = filters.insurance_id;
            }
            if (filters.firm_id) {
                where.firm_id = filters.firm_id;
            }
            if (filters.category) {
                where.category = filters.category;
            }
            if (filters.case_type) {
                where.case_type = filters.case_type;
            }
            if (filters.priority) {
                where.priority = filters.priority;
            }
            if (filters.case_status) {
                where.case_status = filters.case_status;
            }
            if (filters.opening_date_from || filters.opening_date_to) {
                const openingDateRange = {};
                if (filters.opening_date_from) {
                    openingDateRange[sequelize_1.Op.gte] = filters.opening_date_from;
                }
                if (filters.opening_date_to) {
                    openingDateRange[sequelize_1.Op.lte] = filters.opening_date_to;
                }
                where.opening_date = openingDateRange;
            }
            return patientCase_model_1.PatientCase.findAndCountAll({
                where,
                limit,
                offset,
                order: [["created_at", "DESC"]],
            });
        };
        this.getCaseById = async (id) => {
            const patientCase = await patientCase_model_1.PatientCase.findByPk(id);
            if (!patientCase) {
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.NOT_FOUND, enums_1.ResponseMessage.CASE_NOT_FOUND);
            }
            return patientCase;
        };
        this.getCaseByPatient = async (patientId) => {
            return patientCase_model_1.PatientCase.findAll({
                where: { patient_id: patientId },
            });
        };
        this.updateCase = async (id, updateData) => {
            const patientCase = await patientCase_model_1.PatientCase.findByPk(id);
            if (!patientCase) {
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.NOT_FOUND, enums_1.ResponseMessage.CASE_NOT_FOUND);
            }
            await patientCase.update(updateData);
            return patientCase;
        };
        this.deleteCase = async (id) => {
            const patientCase = await patientCase_model_1.PatientCase.findByPk(id);
            if (!patientCase) {
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.NOT_FOUND, enums_1.ResponseMessage.CASE_NOT_FOUND);
            }
            await patientCase.destroy();
        };
    }
}
exports.CaseService = CaseService;
//# sourceMappingURL=case.service.js.map