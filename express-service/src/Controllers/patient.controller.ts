import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/api-response.util";
import { AppError } from "../utils/app-error.util";
import { Patient } from "../models/patient.model";
import { createPatientSchema } from "../validations/patient.validation";

export class PatientController {
  constructor() {}

  createPatient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      const patientData = createPatientSchema.parse(req.body);
      console.log(patientData);

      // Check for duplicate patient (firstName + lastName + dateOfBirth)
      const existing = await Patient.findOne({
        where: {
          first_name: patientData.first_name,
          last_name: patientData.last_name,
          date_of_birth: patientData.date_of_birth,
        },
      });

      if (existing) {
        return next(new AppError(409, "Patient already exists"));
      }

      // Create new patient
      const patient = await Patient.create(patientData);

      ApiResponse.send(res, { patient }, 201);
    } catch (error) {
      return next(error);
    }
  };

  // Get all patients
  getAllPatients = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patients = await Patient.findAll();
      ApiResponse.send(res, { patients }, 200);
    } catch (error) {
      next(error);
    }
  };

  // Get patient by ID
  getPatientById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return next(new AppError(400, "Invalid patient ID"));
      }

      const patient = await Patient.findByPk(id);
      if (!patient) return next(new AppError(404, "Patient not found"));
      ApiResponse.send(res, { patient }, 200);
    } catch (error) {
      next(error);
    }
  };

  // Update patient
  updatePatient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return next(new AppError(400, "Invalid patient ID"));
      }

      const patient = await Patient.findByPk(id);
      if (!patient) return next(new AppError(404, "Patient not found"));

      const updatedData = createPatientSchema.partial().parse(req.body); // allow partial updates
      await patient.update(updatedData);

      ApiResponse.send(res, { patient }, 200);
    } catch (error) {
      next(error);
    }
  };

  // Soft delete patient
  deletePatient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return next(new AppError(400, "Invalid patient ID"));
      }

      const patient = await Patient.findByPk(id);
      if (!patient) return next(new AppError(404, "Patient not found"));

      await patient.destroy(); // soft delete if Sequelize `paranoid: true`
      ApiResponse.send(res, null, 204);
    } catch (error) {
      next(error);
    }
  };
}
