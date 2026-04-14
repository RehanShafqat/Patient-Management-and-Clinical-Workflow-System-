import { loginSchema } from "./auth.validation";
import { createCaseSchema, updateCaseSchema } from "./case.validation";
import { createPatientSchema, updatePatientSchema } from "./patient.validation";
import {
  createSpecialtySchema,
  updateSpecialtySchema,
} from "./specialty.validation";
import { createUserSchema, updateUserSchema } from "./user.validation";

const validations = {
  loginSchema,
  createUserSchema,
  updateUserSchema,
  createPatientSchema,
  updatePatientSchema,
  createCaseSchema,
  updateCaseSchema,
  createSpecialtySchema,
  updateSpecialtySchema,
};

export {
  loginSchema,
  createUserSchema,
  updateUserSchema,
  createPatientSchema,
  updatePatientSchema,
  createCaseSchema,
  updateCaseSchema,
  createSpecialtySchema,
  updateSpecialtySchema,
};
export default validations;
