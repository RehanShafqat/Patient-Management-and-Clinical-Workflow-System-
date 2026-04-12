import z from "zod";
import { PatientCase } from "../models/patientCase.model";
import { AppError } from "../utils/app-error.util";
import { createCaseSchema, updateCaseSchema } from "../validations";
import { HttpStatusCode, ResponseMessage } from "../enums";

export class CaseService {
  createCase = async (caseData: z.infer<typeof createCaseSchema>) => {
    const patientCase = await PatientCase.create(caseData as any);
    if (!patientCase) {
      throw new AppError(HttpStatusCode.INTERNAL_SERVER_ERROR, ResponseMessage.CASE_CREATION_FAILED);
    }
    return patientCase;
  };

  getAllCases = async () => {
    return PatientCase.findAll();
  };

  getCaseById = async (id: string) => {
    const patientCase = await PatientCase.findByPk(id);

    if (!patientCase) {
      throw new AppError(HttpStatusCode.NOT_FOUND, ResponseMessage.CASE_NOT_FOUND);
    }

    return patientCase;
  };

  getCaseByPatient = async (patientId: string) => {
    return PatientCase.findAll({
      where: { patient_id: patientId },
    });
  };

  updateCase = async (id: string, updateData: z.infer<typeof updateCaseSchema>) => {
    const patientCase = await PatientCase.findByPk(id);

    if (!patientCase) {
      throw new AppError(HttpStatusCode.NOT_FOUND, ResponseMessage.CASE_NOT_FOUND);
    }

    await patientCase.update(updateData as any);

    return patientCase;
  };

  deleteCase = async (id: string) => {
    const patientCase = await PatientCase.findByPk(id);
    if (!patientCase) {
      throw new AppError(HttpStatusCode.NOT_FOUND, ResponseMessage.CASE_NOT_FOUND);
    }

    await patientCase.destroy();
  };
}
