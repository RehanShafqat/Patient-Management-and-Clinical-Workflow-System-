import z from "zod";
import { Specialty } from "../models/specialty.model";
import { AppError } from "../utils/app-error.util";
import { createSpecialtySchema, updateSpecialtySchema } from "../validations";
import { HttpStatusCode, ResponseMessage } from "../enums";

export class SpecialtyService {
  createSpecialty = async (data: z.infer<typeof createSpecialtySchema>) => {
    const specialty = await Specialty.create(data as any);

    if (!specialty) {
      throw new AppError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        ResponseMessage.SPECIALTY_CREATION_FAILED,
      );
    }

    return specialty;
  };

  getAllSpecialties = async (page: number = 1, limit: number = 15) => {
    const offset = (page - 1) * limit;
    return Specialty.findAndCountAll({
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });
  };

  getSpecialtyById = async (id: string) => {
    const specialty = await Specialty.findByPk(id);

    if (!specialty) {
      throw new AppError(
        HttpStatusCode.NOT_FOUND,
        ResponseMessage.SPECIALTY_NOT_FOUND,
      );
    }

    return specialty;
  };

  updateSpecialty = async (
    id: string,
    data: z.infer<typeof updateSpecialtySchema>,
  ) => {
    const specialty = await Specialty.findByPk(id);

    if (!specialty) {
      throw new AppError(
        HttpStatusCode.NOT_FOUND,
        ResponseMessage.SPECIALTY_NOT_FOUND,
      );
    }

    await specialty.update(data as any);

    return specialty;
  };

  deleteSpecialty = async (id: string) => {
    const specialty = await Specialty.findByPk(id);

    if (!specialty) {
      throw new AppError(
        HttpStatusCode.NOT_FOUND,
        ResponseMessage.SPECIALTY_NOT_FOUND,
      );
    }

    await specialty.destroy();
  };
}
