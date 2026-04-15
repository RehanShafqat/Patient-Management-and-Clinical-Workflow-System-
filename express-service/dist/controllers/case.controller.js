"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseController = void 0;
const api_response_util_1 = require("../utils/api-response.util");
const case_service_1 = require("../services/case.service");
const case_validation_1 = require("../validations/case.validation");
const app_error_util_1 = require("../utils/app-error.util");
const uuid_util_1 = require("../utils/uuid.util");
const enums_1 = require("../enums");
const checkFdoPermission_util_1 = require("../utils/checkFdoPermission.util");
const pagination_util_1 = require("../utils/pagination.util");
class CaseController {
    constructor(caseService = new case_service_1.CaseService()) {
        this.caseService = caseService;
        this.createCase = async (req, res, next) => {
            try {
                if (req.userRole === enums_1.Role.FDO &&
                    !(0, checkFdoPermission_util_1.checkFdoHasPermission)(req.user, enums_1.FdoPermission.CREATE_CASE)) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.FORBIDDEN, enums_1.ResponseMessage.FORBIDDEN));
                }
                const caseData = case_validation_1.createCaseSchema.parse(req.body);
                const patientCase = await this.caseService.createCase(caseData);
                return api_response_util_1.ApiResponse.send(res, { patientCase }, enums_1.ResponseMessage.CASE_CREATED, enums_1.HttpStatusCode.CREATED);
            }
            catch (error) {
                return next(error);
            }
        };
        this.getAllCases = async (req, res, next) => {
            try {
                if (req.userRole === enums_1.Role.FDO &&
                    !(0, checkFdoPermission_util_1.checkFdoHasPermission)(req.user, enums_1.FdoPermission.VIEW_CASES)) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.FORBIDDEN, enums_1.ResponseMessage.FORBIDDEN));
                }
                const query = case_validation_1.paginationQuerySchema.parse(req.query);
                const { page, per_page, ...filters } = query;
                const { rows: cases, count: total } = await this.caseService.getAllCases(page, per_page, filters);
                const paginated = (0, pagination_util_1.getPaginatedResponse)(cases, total, page, per_page, req);
                api_response_util_1.ApiResponse.send(res, paginated.data, enums_1.ResponseMessage.CASES_FETCHED, enums_1.HttpStatusCode.OK, paginated.links, paginated.meta);
            }
            catch (error) {
                return next(error);
            }
        };
        this.getCaseById = async (req, res, next) => {
            try {
                if (req.userRole === enums_1.Role.FDO &&
                    !(0, checkFdoPermission_util_1.checkFdoHasPermission)(req.user, enums_1.FdoPermission.VIEW_CASES)) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.FORBIDDEN, enums_1.ResponseMessage.FORBIDDEN));
                }
                const id = Array.isArray(req.params.id)
                    ? req.params.id[0]
                    : req.params.id;
                if (!(0, uuid_util_1.isValidUUID)(id)) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.BAD_REQUEST, enums_1.ResponseMessage.INVALID_ID_FORMAT));
                }
                const patientCase = await this.caseService.getCaseById(id);
                return api_response_util_1.ApiResponse.send(res, { patientCase }, enums_1.ResponseMessage.CASE_FETCHED);
            }
            catch (error) {
                return next(error);
            }
        };
        this.getCaseByPatient = async (req, res, next) => {
            try {
                if (req.userRole === enums_1.Role.FDO &&
                    !(0, checkFdoPermission_util_1.checkFdoHasPermission)(req.user, enums_1.FdoPermission.VIEW_CASES)) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.FORBIDDEN, enums_1.ResponseMessage.FORBIDDEN));
                }
                const patientId = Array.isArray(req.params.patient_id)
                    ? req.params.patient_id[0]
                    : req.params.patient_id;
                if (!(0, uuid_util_1.isValidUUID)(patientId)) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.BAD_REQUEST, enums_1.ResponseMessage.INVALID_ID_FORMAT));
                }
                const cases = await this.caseService.getCaseByPatient(patientId);
                return api_response_util_1.ApiResponse.send(res, { cases }, enums_1.ResponseMessage.PATIENT_CASES_FETCHED);
            }
            catch (error) {
                return next(error);
            }
        };
        this.updateCase = async (req, res, next) => {
            try {
                if (req.userRole === enums_1.Role.FDO &&
                    !(0, checkFdoPermission_util_1.checkFdoHasPermission)(req.user, enums_1.FdoPermission.UPDATE_CASE)) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.FORBIDDEN, enums_1.ResponseMessage.FORBIDDEN));
                }
                const id = Array.isArray(req.params.id)
                    ? req.params.id[0]
                    : req.params.id;
                if (!(0, uuid_util_1.isValidUUID)(id)) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.BAD_REQUEST, enums_1.ResponseMessage.INVALID_ID_FORMAT));
                }
                const updateData = case_validation_1.updateCaseSchema.parse(req.body);
                const patientCase = await this.caseService.updateCase(id, updateData);
                return api_response_util_1.ApiResponse.send(res, { patientCase }, enums_1.ResponseMessage.CASE_UPDATED, enums_1.HttpStatusCode.OK);
            }
            catch (error) {
                return next(error);
            }
        };
        this.deleteCase = async (req, res, next) => {
            try {
                const id = Array.isArray(req.params.id)
                    ? req.params.id[0]
                    : req.params.id;
                if (!(0, uuid_util_1.isValidUUID)(id)) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.BAD_REQUEST, enums_1.ResponseMessage.INVALID_UUID_FORMAT));
                }
                await this.caseService.deleteCase(id);
                return api_response_util_1.ApiResponse.send(res, null, enums_1.ResponseMessage.CASE_DELETED, enums_1.HttpStatusCode.OK);
            }
            catch (error) {
                return next(error);
            }
        };
    }
}
exports.CaseController = CaseController;
//# sourceMappingURL=case.controller.js.map