"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientController = void 0;
const api_response_util_1 = require("../utils/api-response.util");
const patient_service_1 = require("../services/patient.service");
const patient_validation_1 = require("../validations/patient.validation");
const app_error_util_1 = require("../utils/app-error.util");
const uuid_util_1 = require("../utils/uuid.util");
const enums_1 = require("../enums");
const checkFdoPermission_util_1 = require("../utils/checkFdoPermission.util");
const pagination_util_1 = require("../utils/pagination.util");
class PatientController {
    constructor(patientService = new patient_service_1.PatientService()) {
        this.patientService = patientService;
        this.createPatient = async (req, res, next) => {
            try {
                const patientData = patient_validation_1.createPatientSchema.parse(req.body);
                if (!(0, checkFdoPermission_util_1.checkFdoHasPermission)(req.user, enums_1.FdoPermission.CREATE_PATIENT)) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.FORBIDDEN, enums_1.ResponseMessage.FORBIDDEN));
                }
                const patient = await this.patientService.createPatient(patientData);
                return api_response_util_1.ApiResponse.send(res, { patient }, enums_1.ResponseMessage.PATIENT_CREATED, enums_1.HttpStatusCode.CREATED);
            }
            catch (error) {
                return next(error);
            }
        };
        // Get all patients (paginated)
        this.getAllPatients = async (req, res, next) => {
            try {
                if (!(0, checkFdoPermission_util_1.checkFdoHasPermission)(req.user, enums_1.FdoPermission.VIEW_PATIENTS)) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.FORBIDDEN, enums_1.ResponseMessage.FORBIDDEN));
                }
                const { page, per_page } = patient_validation_1.paginationQuerySchema.parse(req.query);
                const { rows: patients, count: total } = await this.patientService.getAllPatients(page, per_page);
                const paginated = (0, pagination_util_1.getPaginatedResponse)(patients, total, page, per_page, req);
                api_response_util_1.ApiResponse.send(res, paginated, enums_1.ResponseMessage.PATIENTS_FETCHED, enums_1.HttpStatusCode.OK);
            }
            catch (error) {
                next(error);
            }
        };
        // Get patient by ID
        this.getPatientById = async (req, res, next) => {
            try {
                if (!(0, checkFdoPermission_util_1.checkFdoHasPermission)(req.user, enums_1.FdoPermission.VIEW_PATIENTS)) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.FORBIDDEN, enums_1.ResponseMessage.FORBIDDEN));
                }
                const id = Array.isArray(req.params.id)
                    ? req.params.id[0]
                    : req.params.id;
                if (!(0, uuid_util_1.isValidUUID)(id)) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.BAD_REQUEST, enums_1.ResponseMessage.INVALID_PATIENT_ID));
                }
                const patient = await this.patientService.getPatientById(id);
                api_response_util_1.ApiResponse.send(res, { patient }, enums_1.ResponseMessage.PATIENT_FETCHED, enums_1.HttpStatusCode.OK);
            }
            catch (error) {
                next(error);
            }
        };
        // Update patient
        this.updatePatient = async (req, res, next) => {
            try {
                if (!(0, checkFdoPermission_util_1.checkFdoHasPermission)(req.user, enums_1.FdoPermission.UPDATE_PATIENT)) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.FORBIDDEN, enums_1.ResponseMessage.FORBIDDEN));
                }
                const id = Array.isArray(req.params.id)
                    ? req.params.id[0]
                    : req.params.id;
                if (!(0, uuid_util_1.isValidUUID)(id)) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.BAD_REQUEST, enums_1.ResponseMessage.INVALID_PATIENT_ID));
                }
                const updatedData = patient_validation_1.updatePatientSchema.parse(req.body);
                const patient = await this.patientService.updatePatient(id, updatedData);
                api_response_util_1.ApiResponse.send(res, { patient }, enums_1.ResponseMessage.PATIENT_UPDATED, enums_1.HttpStatusCode.OK);
            }
            catch (error) {
                next(error);
            }
        };
        // Soft delete patient
        this.deletePatient = async (req, res, next) => {
            try {
                const id = Array.isArray(req.params.id)
                    ? req.params.id[0]
                    : req.params.id;
                if (!(0, uuid_util_1.isValidUUID)(id)) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.BAD_REQUEST, enums_1.ResponseMessage.INVALID_PATIENT_ID_FORMAT));
                }
                await this.patientService.deletePatient(id);
                api_response_util_1.ApiResponse.send(res, null, enums_1.ResponseMessage.PATIENT_DELETED, enums_1.HttpStatusCode.OK);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.PatientController = PatientController;
//# sourceMappingURL=patient.controller.js.map