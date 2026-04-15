"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientService = void 0;
const sequelize_1 = require("sequelize");
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
        this.getAllPatients = async (page = 1, limit = 15, filters = {}) => {
            const offset = (page - 1) * limit;
            const where = {};
            if (filters.search) {
                const search = `%${filters.search.trim()}%`;
                where[sequelize_1.Op.or] = [
                    { first_name: { [sequelize_1.Op.like]: search } },
                    { last_name: { [sequelize_1.Op.like]: search } },
                    { email: { [sequelize_1.Op.like]: search } },
                    { phone: { [sequelize_1.Op.like]: search } },
                    { mobile: { [sequelize_1.Op.like]: search } },
                ];
            }
            if (filters.gender) {
                where.gender = filters.gender;
            }
            if (filters.patient_status) {
                where.patient_status = filters.patient_status;
            }
            if (filters.city) {
                where.city = { [sequelize_1.Op.like]: `%${filters.city}%` };
            }
            if (filters.state) {
                where.state = { [sequelize_1.Op.like]: `%${filters.state}%` };
            }
            if (filters.country) {
                where.country = { [sequelize_1.Op.like]: `%${filters.country}%` };
            }
            if (filters.registration_date_from || filters.registration_date_to) {
                const registrationDateRange = {};
                if (filters.registration_date_from) {
                    registrationDateRange[sequelize_1.Op.gte] = filters.registration_date_from;
                }
                if (filters.registration_date_to) {
                    registrationDateRange[sequelize_1.Op.lte] = filters.registration_date_to;
                }
                where.registration_date = registrationDateRange;
            }
            return patient_model_1.Patient.findAndCountAll({
                where,
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