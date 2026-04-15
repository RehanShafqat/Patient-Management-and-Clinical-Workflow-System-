"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const patient_routes_1 = __importDefault(require("./patient.routes"));
const case_routes_1 = __importDefault(require("./case.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const specialty_routes_1 = __importDefault(require("./specialty.routes"));
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
router.use("/patients", patient_routes_1.default);
router.use("/cases", case_routes_1.default);
router.use("/users", user_routes_1.default);
router.use("/specialties", specialty_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map