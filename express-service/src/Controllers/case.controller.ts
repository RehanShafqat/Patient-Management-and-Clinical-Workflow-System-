import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/api-response.util";
import { CaseService } from "../services/case.service";
import {
  createCaseSchema,
  updateCaseSchema,
} from "../validations/case.validation";
import { AppError } from "../utils/app-error.util";

export class CaseController {
  constructor(private caseService: CaseService = new CaseService()) {}

  createCase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const caseData = createCaseSchema.parse(req.body);
      const patientCase = await this.caseService.createCase(caseData);

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
      const cases = await this.caseService.getAllCases();

      return ApiResponse.send(res, { cases }, "Cases fetched successfully");
    } catch (error) {
      return next(error);
    }
  };

  getCaseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (isNaN(Number(id))) {
        return next(
          new AppError(400, "Invalid ID format. ID must be a number."),
        );
      }

      const patientCase = await this.caseService.getCaseById(id);

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
      const patientId = Array.isArray(req.params.patient_id)
        ? req.params.patient_id[0]
        : req.params.patient_id;

      if (isNaN(Number(patientId))) {
        return next(
          new AppError(400, "Invalid ID format. ID must be a number."),
        );
      }

      const cases = await this.caseService.getCaseByPatient(patientId);

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
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (isNaN(Number(id))) {
        return next(
          new AppError(400, "Invalid ID format. ID must be a number."),
        );
      }

      const updateData = updateCaseSchema.parse(req.body);
      const patientCase = await this.caseService.updateCase(id, updateData);

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
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (isNaN(Number(id))) {
        return next(
          new AppError(400, "Invalid ID format. ID must be a number."),
        );
      }

      await this.caseService.deleteCase(id);

      return ApiResponse.send(res, null, "Case deleted successfully");
    } catch (error) {
      return next(error);
    }
  };
}
