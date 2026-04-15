"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const case_controller_1 = require("../controllers/case.controller");
const caseRouter = (0, express_1.Router)();
const caseController = new case_controller_1.CaseController();
caseRouter.post("/", caseController.createCase);
caseRouter.get("/", caseController.getAllCases);
caseRouter.get("/:id", caseController.getCaseById);
// separate route for patient
caseRouter.get("/patient/:patient_id", caseController.getCaseByPatient);
caseRouter.put("/:id", caseController.updateCase);
caseRouter.delete("/:id", caseController.deleteCase);
exports.default = caseRouter;
//# sourceMappingURL=case.routes.js.map