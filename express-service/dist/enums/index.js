"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseStatus = exports.CaseType = exports.CasePriority = exports.CaseCategory = exports.Gender = exports.VisitStatus = exports.FdoPermission = exports.Role = exports.ResponseMessage = exports.ReminderMethod = exports.PatientStatus = exports.HttpStatusCode = exports.FirmType = exports.AppointmentType = exports.AppointmentStatus = void 0;
const caseCategory_enum_1 = require("./caseCategory.enum");
Object.defineProperty(exports, "CaseCategory", { enumerable: true, get: function () { return caseCategory_enum_1.CaseCategory; } });
const casePriority_enum_1 = require("./casePriority.enum");
Object.defineProperty(exports, "CasePriority", { enumerable: true, get: function () { return casePriority_enum_1.CasePriority; } });
const caseStatus_enum_1 = require("./caseStatus.enum");
Object.defineProperty(exports, "CaseStatus", { enumerable: true, get: function () { return caseStatus_enum_1.CaseStatus; } });
const caseType_enum_1 = require("./caseType.enum");
Object.defineProperty(exports, "CaseType", { enumerable: true, get: function () { return caseType_enum_1.CaseType; } });
const gender_enum_1 = require("./gender.enum");
Object.defineProperty(exports, "Gender", { enumerable: true, get: function () { return gender_enum_1.Gender; } });
const appointmentStatus_enum_1 = require("./appointmentStatus.enum");
Object.defineProperty(exports, "AppointmentStatus", { enumerable: true, get: function () { return appointmentStatus_enum_1.AppointmentStatus; } });
const appointmentType_enum_1 = require("./appointmentType.enum");
Object.defineProperty(exports, "AppointmentType", { enumerable: true, get: function () { return appointmentType_enum_1.AppointmentType; } });
const firmType_enum_1 = require("./firmType.enum");
Object.defineProperty(exports, "FirmType", { enumerable: true, get: function () { return firmType_enum_1.FirmType; } });
const httpStatusCode_enum_1 = require("./httpStatusCode.enum");
Object.defineProperty(exports, "HttpStatusCode", { enumerable: true, get: function () { return httpStatusCode_enum_1.HttpStatusCode; } });
const patientStatus_enum_1 = require("./patientStatus.enum");
Object.defineProperty(exports, "PatientStatus", { enumerable: true, get: function () { return patientStatus_enum_1.PatientStatus; } });
const reminderMethod_enum_1 = require("./reminderMethod.enum");
Object.defineProperty(exports, "ReminderMethod", { enumerable: true, get: function () { return reminderMethod_enum_1.ReminderMethod; } });
const responseMessage_enum_1 = require("./responseMessage.enum");
Object.defineProperty(exports, "ResponseMessage", { enumerable: true, get: function () { return responseMessage_enum_1.ResponseMessage; } });
const role_enum_1 = require("./role.enum");
Object.defineProperty(exports, "Role", { enumerable: true, get: function () { return role_enum_1.Role; } });
const fdoPermission_enum_1 = require("./fdoPermission.enum");
Object.defineProperty(exports, "FdoPermission", { enumerable: true, get: function () { return fdoPermission_enum_1.FdoPermission; } });
const visitStatus_enum_1 = require("./visitStatus.enum");
Object.defineProperty(exports, "VisitStatus", { enumerable: true, get: function () { return visitStatus_enum_1.VisitStatus; } });
const enums = {
    AppointmentStatus: appointmentStatus_enum_1.AppointmentStatus,
    AppointmentType: appointmentType_enum_1.AppointmentType,
    FirmType: firmType_enum_1.FirmType,
    HttpStatusCode: httpStatusCode_enum_1.HttpStatusCode,
    PatientStatus: patientStatus_enum_1.PatientStatus,
    ReminderMethod: reminderMethod_enum_1.ReminderMethod,
    ResponseMessage: responseMessage_enum_1.ResponseMessage,
    Role: role_enum_1.Role,
    FdoPermission: fdoPermission_enum_1.FdoPermission,
    VisitStatus: visitStatus_enum_1.VisitStatus,
    Gender: gender_enum_1.Gender,
    CaseCategory: caseCategory_enum_1.CaseCategory,
    CasePriority: casePriority_enum_1.CasePriority,
    CaseType: caseType_enum_1.CaseType,
    CaseStatus: caseStatus_enum_1.CaseStatus,
};
exports.default = enums;
//# sourceMappingURL=index.js.map