"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSpecialtySchema = exports.createSpecialtySchema = exports.updateCaseSchema = exports.createCaseSchema = exports.updatePatientSchema = exports.createPatientSchema = exports.updateUserSchema = exports.createUserSchema = exports.loginSchema = void 0;
const auth_validation_1 = require("./auth.validation");
Object.defineProperty(exports, "loginSchema", { enumerable: true, get: function () { return auth_validation_1.loginSchema; } });
const case_validation_1 = require("./case.validation");
Object.defineProperty(exports, "createCaseSchema", { enumerable: true, get: function () { return case_validation_1.createCaseSchema; } });
Object.defineProperty(exports, "updateCaseSchema", { enumerable: true, get: function () { return case_validation_1.updateCaseSchema; } });
const patient_validation_1 = require("./patient.validation");
Object.defineProperty(exports, "createPatientSchema", { enumerable: true, get: function () { return patient_validation_1.createPatientSchema; } });
Object.defineProperty(exports, "updatePatientSchema", { enumerable: true, get: function () { return patient_validation_1.updatePatientSchema; } });
const specialty_validation_1 = require("./specialty.validation");
Object.defineProperty(exports, "createSpecialtySchema", { enumerable: true, get: function () { return specialty_validation_1.createSpecialtySchema; } });
Object.defineProperty(exports, "updateSpecialtySchema", { enumerable: true, get: function () { return specialty_validation_1.updateSpecialtySchema; } });
const user_validation_1 = require("./user.validation");
Object.defineProperty(exports, "createUserSchema", { enumerable: true, get: function () { return user_validation_1.createUserSchema; } });
Object.defineProperty(exports, "updateUserSchema", { enumerable: true, get: function () { return user_validation_1.updateUserSchema; } });
const validations = {
    loginSchema: auth_validation_1.loginSchema,
    createUserSchema: user_validation_1.createUserSchema,
    updateUserSchema: user_validation_1.updateUserSchema,
    createPatientSchema: patient_validation_1.createPatientSchema,
    updatePatientSchema: patient_validation_1.updatePatientSchema,
    createCaseSchema: case_validation_1.createCaseSchema,
    updateCaseSchema: case_validation_1.updateCaseSchema,
    createSpecialtySchema: specialty_validation_1.createSpecialtySchema,
    updateSpecialtySchema: specialty_validation_1.updateSpecialtySchema,
};
exports.default = validations;
//# sourceMappingURL=index.js.map