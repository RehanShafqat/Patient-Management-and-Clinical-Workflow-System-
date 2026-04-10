import { loginSchema } from "./auth.validation";
import { createCaseSchema, updateCaseSchema } from "./case.validation";
import { createPatientSchema, updatePatientSchema } from "./patient.validation";

const validations = {
  loginSchema,
  createPatientSchema,
  updatePatientSchema,
  createCaseSchema,
  updateCaseSchema,
};

export {
  loginSchema,
  createPatientSchema,
  updatePatientSchema,
  createCaseSchema,
  updateCaseSchema,
};
export default validations;
