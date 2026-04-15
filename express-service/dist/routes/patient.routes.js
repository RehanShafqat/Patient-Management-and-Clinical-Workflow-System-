"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patient_controller_1 = require("../controllers/patient.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const checkRole_middleware_1 = require("../middlewares/checkRole.middleware");
const enums_1 = require("../enums");
const patientRouter = (0, express_1.Router)();
const patientController = new patient_controller_1.PatientController();
patientRouter.post("/", auth_middleware_1.checkAccessToken, (0, checkRole_middleware_1.checkRoleMiddleware)([enums_1.Role.FDO]), patientController.createPatient);
patientRouter.get("/", auth_middleware_1.checkAccessToken, patientController.getAllPatients);
patientRouter.get("/:id", 
// checkAccessToken,
patientController.getPatientById);
patientRouter.put("/:id", auth_middleware_1.checkAccessToken, patientController.updatePatient);
patientRouter.delete("/:id", auth_middleware_1.checkAccessToken, patientController.deletePatient);
exports.default = patientRouter;
//# sourceMappingURL=patient.routes.js.map