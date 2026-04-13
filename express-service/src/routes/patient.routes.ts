import { Router } from "express";
import { PatientController } from "../Controllers/patient.controller";
import { checkAccessToken } from "../Middlewares/auth.middleware";

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
