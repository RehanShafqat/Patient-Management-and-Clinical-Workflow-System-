import { Router } from "express";
import { PatientController } from "../controllers/patient.controller";
import { checkAccessToken } from "../middlewares/auth.middleware";

const patientRouter = Router();
const patientController = new PatientController();

patientRouter.post(
  "/",
  // checkAccessToken,
  patientController.createPatient,
);
patientRouter.get(
  "/",
  //   checkAccessToken,
  patientController.getAllPatients,
);
patientRouter.get(
  "/:id",
  // checkAccessToken,
  patientController.getPatientById,
);
patientRouter.put(
  "/:id",
  // checkAccessToken,
  patientController.updatePatient,
);
patientRouter.delete(
  "/:id",
  // checkAccessToken,
  patientController.deletePatient,
);

export default patientRouter;
