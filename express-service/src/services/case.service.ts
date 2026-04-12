import z from "zod";
import { PatientCase } from "../models/patientCase.model";
import { AppError } from "../utils/app-error.util";
import { createCaseSchema, updateCaseSchema } from "../validations";

export class CaseService {
  createCase = async (caseData: z.infer<typeof createCaseSchema>) => {
    const patientCase = await PatientCase.create(caseData as any);
    if (!patientCase) {
      throw new AppError(500, "Case record could not be created");
    }
    return patientCase;
  };

  getAllCases = async () => {
    return PatientCase.findAll();
  };

  getCaseById = async (id: string) => {
    const patientCase = await PatientCase.findByPk(id);

    if (!patientCase) {
      throw new AppError(404, "Case not found");
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
      throw new AppError(404, "Case not found");
    }

    await patientCase.update(updateData as any);

    return patientCase;
  };

  deleteCase = async (id: string) => {
    const patientCase = await PatientCase.findByPk(id);
    if (!patientCase) {
      throw new AppError(404, "Case not found");
    }

    await patientCase.destroy();
  };
}
