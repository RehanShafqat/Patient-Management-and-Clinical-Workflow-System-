import { Router } from "express";
import { PatientController } from "../controllers/patient.controller";
import { checkAccessToken } from "../middlewares/auth.middleware";
import { checkRoleMiddleware } from "../middlewares/checkRole.middleware";
import { Role } from "../enums";
import { checkPrime } from "node:crypto";
const patientRouter = Router();
const patientController = new PatientController();

patientRouter.post(
  "/",
  checkAccessToken,
  checkRoleMiddleware([Role.FDO]),
  patientController.createPatient,
);
patientRouter.get(
  "/",
  checkAccessToken,
  checkRoleMiddleware([Role.FDO, Role.DOCTOR]),
  patientController.getAllPatients,
);
patientRouter.get(
  "/:id",
  // checkAccessToken,
  patientController.getPatientById,
);
patientRouter.put("/:id", checkAccessToken, patientController.updatePatient);
patientRouter.delete("/:id", checkAccessToken, patientController.deletePatient);

export default patientRouter;
