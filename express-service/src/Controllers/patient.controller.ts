import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/api-response.util";
import { PatientService } from "../services/patient.service";
import { createPatientSchema } from "../validations/patient.validation";
import { AppError } from "../utils/app-error.util";
import { isValidUUID } from "../utils/uuid.util";

export class PatientController {
  constructor(private patientService: PatientService = new PatientService()) {}

  createPatient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patientData = createPatientSchema.parse(req.body);
      const patient = await this.patientService.createPatient(patientData);

      return ApiResponse.send(
        res,
        { patient },
        "Patient created successfully",
        201,
      );
    } catch (error) {
      return next(error);
    }
  };

  // Get all patients
  getAllPatients = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patients = await this.patientService.getAllPatients();
      ApiResponse.send(res, { patients }, "", 200);
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
        return next(new AppError(400, "Invalid patient ID"));
      }

      const patient = await this.patientService.getPatientById(id);
      ApiResponse.send(res, { patient }, "", 200);
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
        return next(new AppError(400, "Invalid patient ID"));
      }

      const updatedData = createPatientSchema.partial().parse(req.body);
      const patient = await this.patientService.updatePatient(id, updatedData);

      ApiResponse.send(res, { patient }, "", 200);
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

      if (isNaN(Number(id))) {
        return next(new AppError(400, "Invalid patient ID"));
      }

      await this.patientService.deletePatient(id);
      ApiResponse.send(res, null, "", 204);
    } catch (error) {
      next(error);
    }
  };
}
