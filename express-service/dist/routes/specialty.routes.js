"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { checkAccessToken } from "../Middlewares/auth.middleware";
const specialty_controller_1 = require("../controllers/specialty.controller");
const specialtyRouter = (0, express_1.Router)();
const specialtyController = new specialty_controller_1.SpecialtyController();
specialtyRouter.get("/", 
// checkAccessToken,
specialtyController.getAllSpecialties);
specialtyRouter.post("/", 
// checkAccessToken,
specialtyController.createSpecialty);
specialtyRouter.get("/:id", 
// checkAccessToken,
specialtyController.getSpecialtyById);
specialtyRouter.put("/:id", 
// checkAccessToken,
specialtyController.updateSpecialty);
specialtyRouter.delete("/:id", 
// checkAccessToken,
specialtyController.deleteSpecialty);
exports.default = specialtyRouter;
//# sourceMappingURL=specialty.routes.js.map