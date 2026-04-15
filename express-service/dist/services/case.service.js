"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseService = void 0;
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
        this.getAllCases = async (page = 1, limit = 15) => {
            const offset = (page - 1) * limit;
            return patientCase_model_1.PatientCase.findAndCountAll({
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