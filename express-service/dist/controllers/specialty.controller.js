"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialtyController = void 0;
const api_response_util_1 = require("../utils/api-response.util");
const specialty_service_1 = require("../services/specialty.service");
const specialty_validation_1 = require("../validations/specialty.validation");
const app_error_util_1 = require("../utils/app-error.util");
const enums_1 = require("../enums");
const pagination_util_1 = require("../utils/pagination.util");
const validation_utils_1 = require("../validations/validation.utils");
class SpecialtyController {
    constructor(specialtyService = new specialty_service_1.SpecialtyService()) {
        this.specialtyService = specialtyService;
        this.createSpecialty = async (req, res, next) => {
            try {
                const data = specialty_validation_1.createSpecialtySchema.parse(req.body);
                const specialty = await this.specialtyService.createSpecialty(data);
                return api_response_util_1.ApiResponse.send(res, { specialty }, enums_1.ResponseMessage.SPECIALTY_CREATED, enums_1.HttpStatusCode.CREATED);
            }
            catch (error) {
                return next(error);
            }
        };
        this.getAllSpecialties = async (req, res, next) => {
            try {
                const query = specialty_validation_1.paginationQuerySchema.parse(req.query);
                const { page, per_page, ...filters } = query;
                const { rows: specialties, count: total } = await this.specialtyService.getAllSpecialties(page, per_page, filters);
                const paginated = (0, pagination_util_1.getPaginatedResponse)(specialties, total, page, per_page, req);
                api_response_util_1.ApiResponse.send(res, paginated.data, enums_1.ResponseMessage.SPECIALTIES_FETCHED, enums_1.HttpStatusCode.OK, paginated.links, paginated.meta);
            }
            catch (error) {
                return next(error);
            }
        };
        this.getSpecialtyById = async (req, res, next) => {
            try {
                const id = Array.isArray(req.params.id)
                    ? req.params.id[0]
                    : req.params.id;
                console.log("Received ID:", id);
                if (!(0, validation_utils_1.isValidSpecialtyId)(id)) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.BAD_REQUEST, enums_1.ResponseMessage.INVALID_ID_FORMAT));
                }
                const specialty = await this.specialtyService.getSpecialtyById(id);
                return api_response_util_1.ApiResponse.send(res, { specialty }, enums_1.ResponseMessage.SPECIALTY_FETCHED);
            }
            catch (error) {
                return next(error);
            }
        };
        this.updateSpecialty = async (req, res, next) => {
            try {
                const id = Array.isArray(req.params.id)
                    ? req.params.id[0]
                    : req.params.id;
                if (!(0, validation_utils_1.isValidSpecialtyId)(id)) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.BAD_REQUEST, enums_1.ResponseMessage.INVALID_ID_FORMAT));
                }
                const data = specialty_validation_1.updateSpecialtySchema.parse(req.body);
                const specialty = await this.specialtyService.updateSpecialty(id, data);
                return api_response_util_1.ApiResponse.send(res, { specialty }, enums_1.ResponseMessage.SPECIALTY_UPDATED);
            }
            catch (error) {
                return next(error);
            }
        };
        this.deleteSpecialty = async (req, res, next) => {
            try {
                const id = Array.isArray(req.params.id)
                    ? req.params.id[0]
                    : req.params.id;
                if (!(0, validation_utils_1.isValidSpecialtyId)(id)) {
                    return next(new app_error_util_1.AppError(enums_1.HttpStatusCode.BAD_REQUEST, enums_1.ResponseMessage.INVALID_ID_FORMAT));
                }
                await this.specialtyService.deleteSpecialty(id);
                return api_response_util_1.ApiResponse.send(res, null, enums_1.ResponseMessage.SPECIALTY_DELETED);
            }
            catch (error) {
                return next(error);
            }
        };
    }
}
exports.SpecialtyController = SpecialtyController;
//# sourceMappingURL=specialty.controller.js.map