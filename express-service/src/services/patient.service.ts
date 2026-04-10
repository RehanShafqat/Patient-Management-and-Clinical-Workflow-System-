import { Patient } from "../models/patient.model";
import { AppError } from "../utils/app-error.util";

type CreatePatientInput = {
  first_name: string;
  last_name: string;
  date_of_birth: Date;
} & Record<string, unknown>;

export class PatientService {
  createPatient = async (patientData: CreatePatientInput) => {
    const existing = await Patient.findOne({
      where: {
        first_name: patientData.first_name,
        last_name: patientData.last_name,
        date_of_birth: patientData.date_of_birth,
      },
    });

    if (existing) {
      throw new AppError(409, "Patient already exists");
    }

    const patient = await Patient.create(patientData);

    if (!patient) {
      throw new AppError(500, "Patient record could not be created");
    }

    return patient;
  };

  getAllPatients = async () => {
    return Patient.findAll();
  };

  getPatientById = async (id: string) => {
    const patient = await Patient.findByPk(Number(id));
    if (!patient) {
      throw new AppError(404, "Patient not found");
    }

    return patient;
  };

  updatePatient = async (id: string, updatedData: Record<string, unknown>) => {
    const patient = await Patient.findByPk(Number(id));
    if (!patient) {
      throw new AppError(404, "Patient not found");
    }

    await patient.update(updatedData);

    return patient;
  };

  deletePatient = async (id: string) => {
    const patient = await Patient.findByPk(Number(id));
    if (!patient) {
      throw new AppError(404, "Patient not found");
    }

    await patient.destroy();
  };
}
