"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Diagnoses = exports.Specialty = exports.PracticeLocation = exports.InsuranceAddress = exports.Insurance = exports.Firm = exports.Visit = exports.Appointment = exports.UserPermission = exports.Permission = exports.DoctorProfile = exports.PatientCase = exports.Patient = exports.User = void 0;
exports.initModels = initModels;
const user_model_1 = require("./user.model");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_model_1.User; } });
const patient_model_1 = require("./patient.model");
Object.defineProperty(exports, "Patient", { enumerable: true, get: function () { return patient_model_1.Patient; } });
const patientCase_model_1 = require("./patientCase.model");
Object.defineProperty(exports, "PatientCase", { enumerable: true, get: function () { return patientCase_model_1.PatientCase; } });
const doctorProfile_model_1 = require("./doctorProfile.model");
Object.defineProperty(exports, "DoctorProfile", { enumerable: true, get: function () { return doctorProfile_model_1.DoctorProfile; } });
const permission_model_1 = require("./permission.model");
Object.defineProperty(exports, "Permission", { enumerable: true, get: function () { return permission_model_1.Permission; } });
const userPermission_model_1 = require("./userPermission.model");
Object.defineProperty(exports, "UserPermission", { enumerable: true, get: function () { return userPermission_model_1.UserPermission; } });
const appointment_model_1 = require("./appointment.model");
Object.defineProperty(exports, "Appointment", { enumerable: true, get: function () { return appointment_model_1.Appointment; } });
const visit_model_1 = require("./visit.model");
Object.defineProperty(exports, "Visit", { enumerable: true, get: function () { return visit_model_1.Visit; } });
const firm_model_1 = require("./firm.model");
Object.defineProperty(exports, "Firm", { enumerable: true, get: function () { return firm_model_1.Firm; } });
const insurance_model_1 = require("./insurance.model");
Object.defineProperty(exports, "Insurance", { enumerable: true, get: function () { return insurance_model_1.Insurance; } });
const insuranceAddress_model_1 = require("./insuranceAddress.model");
Object.defineProperty(exports, "InsuranceAddress", { enumerable: true, get: function () { return insuranceAddress_model_1.InsuranceAddress; } });
const practiceLocation_model_1 = require("./practiceLocation.model");
Object.defineProperty(exports, "PracticeLocation", { enumerable: true, get: function () { return practiceLocation_model_1.PracticeLocation; } });
const specialty_model_1 = require("./specialty.model");
Object.defineProperty(exports, "Specialty", { enumerable: true, get: function () { return specialty_model_1.Specialty; } });
const diagnoses_model_1 = require("./diagnoses.model");
Object.defineProperty(exports, "Diagnoses", { enumerable: true, get: function () { return diagnoses_model_1.Diagnoses; } });
const models = {
    User: user_model_1.User,
    Patient: patient_model_1.Patient,
    PatientCase: patientCase_model_1.PatientCase,
    DoctorProfile: doctorProfile_model_1.DoctorProfile,
    Permission: permission_model_1.Permission,
    UserPermission: userPermission_model_1.UserPermission,
    Appointment: appointment_model_1.Appointment,
    Visit: visit_model_1.Visit,
    Firm: firm_model_1.Firm,
    Insurance: insurance_model_1.Insurance,
    InsuranceAddress: insuranceAddress_model_1.InsuranceAddress,
    PracticeLocation: practiceLocation_model_1.PracticeLocation,
    Specialty: specialty_model_1.Specialty,
    Diagnoses: diagnoses_model_1.Diagnoses,
};
//INFO: Initializing every model's schema definition against the provided Sequelize instance
function initModels(sequelize) {
    user_model_1.User.initModel(sequelize);
    permission_model_1.Permission.initModel(sequelize);
    specialty_model_1.Specialty.initModel(sequelize);
    practiceLocation_model_1.PracticeLocation.initModel(sequelize);
    firm_model_1.Firm.initModel(sequelize);
    insurance_model_1.Insurance.initModel(sequelize);
    insuranceAddress_model_1.InsuranceAddress.initModel(sequelize);
    diagnoses_model_1.Diagnoses.initModel(sequelize);
    patient_model_1.Patient.initModel(sequelize);
    doctorProfile_model_1.DoctorProfile.initModel(sequelize);
    userPermission_model_1.UserPermission.initModel(sequelize);
    patientCase_model_1.PatientCase.initModel(sequelize);
    appointment_model_1.Appointment.initModel(sequelize);
    visit_model_1.Visit.initModel(sequelize);
    //INFO: Registering all belongsTo/hasMany/hasOne relationships after every model is initialized
    Object.values(models).forEach((model) => {
        if (typeof model.associate === "function") {
            model.associate(models);
        }
    });
    return models;
}
exports.default = models;
//# sourceMappingURL=index.js.map