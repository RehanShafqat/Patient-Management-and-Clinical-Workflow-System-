import z from "zod";
import { PatientCase } from "../models/patientCase.model";
import { AppError } from "../utils/app-error.util";
import { createCaseSchema } from "../validations";

export class CaseService {
  createCase = async (caseData: z.infer<typeof createCaseSchema>) => {
    return {};
  };

  getAllCases = async () => {
    return PatientCase.findAll();
  };

  getCaseById = async (id: string) => {
    const patientCase = await PatientCase.findByPk(Number(id));

    if (!patientCase) {
      throw new AppError(404, "Case not found");
    }

    return patientCase;
  };

  getCaseByPatient = async (patientId: string) => {
    return PatientCase.findAll({
      where: { patient_id: Number(patientId) },
    });
  };

  updateCase = async (id: string, updateData: Record<string, unknown>) => {
    const patientCase = await PatientCase.findByPk(Number(id));

    if (!patientCase) {
      throw new AppError(404, "Case not found");
    }

    await patientCase.update(updateData);

    return patientCase;
  };

  deleteCase = async (id: string) => {
    const patientCase = await PatientCase.findByPk(Number(id));
    if (!patientCase) {
      throw new AppError(404, "Case not found");
    }

    await patientCase.destroy();
  };
}
