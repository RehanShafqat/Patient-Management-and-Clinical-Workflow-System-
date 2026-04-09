import { Router } from "express";
import { CaseController } from "../Controllers/case.controller";
import { checkAccessToken } from "../Middlewares/auth.middleware";

const caseRouter = Router();
const caseController = new CaseController();

caseRouter.post("/", caseController.createCase);

caseRouter.get("/", caseController.getAllCases);

caseRouter.get("/:id", caseController.getCaseById);

// separate route for patient
caseRouter.get("/patient/:patient_id", caseController.getCaseByPatient);

caseRouter.put("/:id", caseController.updateCase);

caseRouter.delete("/:id", caseController.deleteCase);

export default caseRouter;
