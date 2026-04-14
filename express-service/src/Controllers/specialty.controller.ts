import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/api-response.util";
import { SpecialtyService } from "../services/specialty.service";
import {
  createSpecialtySchema,
  updateSpecialtySchema,
} from "../validations/specialty.validation";
import { AppError } from "../utils/app-error.util";
import { isValidUUID } from "../utils/uuid.util";
import { HttpStatusCode, ResponseMessage } from "../enums";
import { isValidSpecialtyId } from "../validations/validation.utils";

export class SpecialtyController {
  constructor(
    private specialtyService: SpecialtyService = new SpecialtyService(),
  ) {}

  createSpecialty = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createSpecialtySchema.parse(req.body);

      const specialty = await this.specialtyService.createSpecialty(data);

      return ApiResponse.send(
        res,
        { specialty },
        ResponseMessage.SPECIALTY_CREATED,
        HttpStatusCode.CREATED,
      );
    } catch (error) {
      return next(error);
    }
  };

  getAllSpecialties = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const specialties = await this.specialtyService.getAllSpecialties();

      return ApiResponse.send(
        res,
        { specialties },
        ResponseMessage.SPECIALTIES_FETCHED,
      );
    } catch (error) {
      return next(error);
    }
  };

  getSpecialtyById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      console.log("Received ID:", id);

      if (!isValidSpecialtyId(id)) {
        return next(
          new AppError(
            HttpStatusCode.BAD_REQUEST,
            ResponseMessage.INVALID_ID_FORMAT,
          ),
        );
      }

      const specialty = await this.specialtyService.getSpecialtyById(id);

      return ApiResponse.send(
        res,
        { specialty },
        ResponseMessage.SPECIALTY_FETCHED,
      );
    } catch (error) {
      return next(error);
    }
  };

  updateSpecialty = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (!isValidSpecialtyId(id)) {
        return next(
          new AppError(
            HttpStatusCode.BAD_REQUEST,
            ResponseMessage.INVALID_ID_FORMAT,
          ),
        );
      }

      const data = updateSpecialtySchema.parse(req.body);

      const specialty = await this.specialtyService.updateSpecialty(id, data);

      return ApiResponse.send(
        res,
        { specialty },
        ResponseMessage.SPECIALTY_UPDATED,
      );
    } catch (error) {
      return next(error);
    }
  };

  deleteSpecialty = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (!isValidSpecialtyId(id)) {
        return next(
          new AppError(
            HttpStatusCode.BAD_REQUEST,
            ResponseMessage.INVALID_ID_FORMAT,
          ),
        );
      }

      await this.specialtyService.deleteSpecialty(id);

      return ApiResponse.send(res, null, ResponseMessage.SPECIALTY_DELETED);
    } catch (error) {
      return next(error);
    }
  };
}
