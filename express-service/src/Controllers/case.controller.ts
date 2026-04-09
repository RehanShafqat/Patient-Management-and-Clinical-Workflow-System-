import { Request, Response, NextFunction } from "express";
import { PatientCase } from "../models/patientCase.model";
import { createCaseSchema } from "../validations/case.validation";
import { ApiResponse } from "../utils/api-response.util";
import { AppError } from "../utils/app-error.util";

export class CaseController {
  createCase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const caseData = createCaseSchema.parse(req.body);

      const patientCase = await PatientCase.create(caseData);

      return ApiResponse.send(
        res,
        { patientCase },
        "Case created successfully",
        201,
      );
    } catch (error) {
      return next(error);
    }
  };

  getAllCases = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cases = await PatientCase.findAll();

      return ApiResponse.send(res, { cases }, "Cases fetched successfully");
    } catch (error) {
      return next(error);
    }
  };

  getCaseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const patientCase = await PatientCase.findByPk(Number(id));

      if (!patientCase) {
        return next(new AppError(404, "Case not found"));
      }

      return ApiResponse.send(
        res,
        { patientCase },
        "Case fetched successfully",
      );
    } catch (error) {
      return next(error);
    }
  };

  getCaseByPatient = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { patient_id } = req.params;

      if (isNaN(Number(patient_id))) {
        return next(
          new AppError(400, "Invalid ID format. ID must be a number."),
        );
      }

      const cases = await PatientCase.findAll({
        where: { patient_id: Number(patient_id) },
      });

      return ApiResponse.send(
        res,
        { cases },
        "Patient cases fetched successfully",
      );
    } catch (error) {
      return next(error);
    }
  };

  updateCase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (isNaN(Number(id))) {
        return next(
          new AppError(400, "Invalid ID format. ID must be a number."),
        );
      }

      const patientCase = await PatientCase.findByPk(Number(id));

      if (!patientCase) {
        return next(new AppError(404, "Case not found"));
      }

      const updateData = createCaseSchema.parse(req.body);

      await patientCase.update(updateData);

      return ApiResponse.send(
        res,
        { patientCase },
        "Case updated successfully",
      );
    } catch (error) {
      return next(error);
    }
  };

  deleteCase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (isNaN(Number(id))) {
        return next(
          new AppError(400, "Invalid ID format. ID must be a number."),
        );
      }

      const patientCase = await PatientCase.findByPk(Number(id));

      if (!patientCase) {
        return next(new AppError(404, "Case not found"));
      }

      await patientCase.destroy(); // soft delete

      return ApiResponse.send(res, null, "Case deleted successfully");
    } catch (error) {
      return next(error);
    }
  };
}
