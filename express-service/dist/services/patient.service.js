"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientService = void 0;
const patient_model_1 = require("../models/patient.model");
const app_error_util_1 = require("../utils/app-error.util");
const enums_1 = require("../enums");
class PatientService {
    constructor() {
        this.createPatient = async (patientData) => {
            const existing = await patient_model_1.Patient.findOne({
                where: {
                    first_name: patientData.first_name,
                    last_name: patientData.last_name,
                    date_of_birth: patientData.date_of_birth,
                },
            });
            if (existing) {
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.CONFLICT, enums_1.ResponseMessage.PATIENT_ALREADY_EXISTS);
            }
            const patient = await patient_model_1.Patient.create({
                ...patientData,
                patient_status: patientData.patient_status,
                date_of_birth: patientData.date_of_birth,
                registration_date: (patientData.registration_date ?? new Date()),
            });
            if (!patient) {
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.INTERNAL_SERVER_ERROR, enums_1.ResponseMessage.PATIENT_CREATION_FAILED);
            }
            return patient;
        };
        this.getAllPatients = async (page = 1, limit = 15) => {
            const offset = (page - 1) * limit;
            return patient_model_1.Patient.findAndCountAll({
                limit,
                offset,
                order: [["created_at", "DESC"]],
            });
        };
        this.getPatientById = async (id) => {
            const patient = await patient_model_1.Patient.findByPk(id);
            if (!patient) {
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.NOT_FOUND, enums_1.ResponseMessage.PATIENT_NOT_FOUND);
            }
            return patient;
        };
        this.updatePatient = async (id, updatedData) => {
            const patient = await patient_model_1.Patient.findByPk(id);
            if (!patient) {
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.NOT_FOUND, enums_1.ResponseMessage.PATIENT_NOT_FOUND);
            }
            await patient.update(updatedData);
            return patient;
        };
        this.deletePatient = async (id) => {
            const patient = await patient_model_1.Patient.findByPk(id);
            if (!patient) {
                throw new app_error_util_1.AppError(enums_1.HttpStatusCode.NOT_FOUND, enums_1.ResponseMessage.PATIENT_NOT_FOUND);
            }
            await patient.destroy();
        };
    }
}
exports.PatientService = PatientService;
//# sourceMappingURL=patient.service.js.map