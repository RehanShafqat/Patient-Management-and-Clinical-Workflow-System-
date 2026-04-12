import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/api-response.util";
import { PatientService } from "../services/patient.service";
import { createPatientSchema, updatePatientSchema } from "../validations/patient.validation";
import { AppError } from "../utils/app-error.util";
import { isValidUUID } from "../utils/uuid.util";
import { HttpStatusCode, ResponseMessage } from "../enums";

export class PatientController {
  constructor(private patientService: PatientService = new PatientService()) {}

  createPatient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patientData = createPatientSchema.parse(req.body);
      const patient = await this.patientService.createPatient(patientData);

      return ApiResponse.send(
        res,
        { patient },
        ResponseMessage.PATIENT_CREATED,
        HttpStatusCode.CREATED,
      );
    } catch (error) {
      return next(error);
    }
  };

  // Get all patients
  getAllPatients = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patients = await this.patientService.getAllPatients();
      ApiResponse.send(res, { patients }, ResponseMessage.PATIENTS_FETCHED, HttpStatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  // Get patient by ID
  getPatientById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (!isValidUUID(id)) {
        return next(new AppError(HttpStatusCode.BAD_REQUEST, ResponseMessage.INVALID_PATIENT_ID));
      }

      const patient = await this.patientService.getPatientById(id);
      ApiResponse.send(res, { patient }, ResponseMessage.PATIENT_FETCHED, HttpStatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  // Update patient
  updatePatient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (!isValidUUID(id)) {
        return next(new AppError(HttpStatusCode.BAD_REQUEST, ResponseMessage.INVALID_PATIENT_ID));
      }

      const updatedData = updatePatientSchema.parse(req.body);
      const patient = await this.patientService.updatePatient(id, updatedData);

      ApiResponse.send(res, { patient }, ResponseMessage.PATIENT_UPDATED, HttpStatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  // Soft delete patient
  deletePatient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (!isValidUUID(id)) {
        return next(new AppError(HttpStatusCode.BAD_REQUEST, ResponseMessage.INVALID_PATIENT_ID_FORMAT));
      }

      await this.patientService.deletePatient(id);
      ApiResponse.send(res, null, ResponseMessage.PATIENT_DELETED, HttpStatusCode.OK);
    } catch (error) {
      next(error);
    }
  };
}
