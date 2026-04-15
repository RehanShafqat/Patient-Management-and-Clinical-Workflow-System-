"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientCase = void 0;
const sequelize_1 = require("sequelize");
const caseCategory_enum_1 = require("../enums/caseCategory.enum");
const caseType_enum_1 = require("../enums/caseType.enum");
const casePriority_enum_1 = require("../enums/casePriority.enum");
const caseStatus_enum_1 = require("../enums/caseStatus.enum");
class PatientCase extends sequelize_1.Model {
    static associate(models) {
        PatientCase.belongsTo(models.Patient, {
            foreignKey: "patient_id",
            as: "patient",
        });
        PatientCase.belongsTo(models.PracticeLocation, {
            foreignKey: "practice_location_id",
            as: "practiceLocation",
        });
        PatientCase.belongsTo(models.Insurance, {
            foreignKey: "insurance_id",
            as: "insurance",
        });
        PatientCase.belongsTo(models.Firm, { foreignKey: "firm_id", as: "firm" });
        PatientCase.hasMany(models.Appointment, {
            foreignKey: "case_id",
            as: "appointments",
        });
        PatientCase.hasMany(models.Visit, { foreignKey: "case_id", as: "visits" });
    }
    static initModel(sequelize) {
        PatientCase.init({
            id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.DataTypes.UUIDV4 },
            case_number: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
            patient_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
            practice_location_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
            category: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(caseCategory_enum_1.CaseCategory)),
                allowNull: false,
            },
            purpose_of_visit: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
            case_type: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(caseType_enum_1.CaseType)),
                allowNull: false,
            },
            priority: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(casePriority_enum_1.CasePriority)),
                allowNull: false,
                defaultValue: casePriority_enum_1.CasePriority.NORMAL,
            },
            case_status: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(caseStatus_enum_1.CaseStatus)),
                allowNull: false,
                defaultValue: caseStatus_enum_1.CaseStatus.ACTIVE,
            },
            date_of_accident: { type: sequelize_1.DataTypes.DATEONLY, allowNull: true },
            insurance_id: { type: sequelize_1.DataTypes.UUID, allowNull: true },
            firm_id: { type: sequelize_1.DataTypes.UUID, allowNull: true },
            referred_by: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            referred_doctor_name: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            opening_date: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
            closing_date: { type: sequelize_1.DataTypes.DATEONLY, allowNull: true },
            clinical_notes: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
            created_at: sequelize_1.DataTypes.DATE,
            updated_at: sequelize_1.DataTypes.DATE,
            deleted_at: sequelize_1.DataTypes.DATE,
        }, {
            sequelize,
            tableName: "patient_cases",
            timestamps: true,
            paranoid: true,
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
            hooks: {
                //INFO: Auto-generate case_number in CASE-YYYY-NNNNN format before validation
                beforeValidate: async (instance) => {
                    if (!instance.case_number) {
                        const year = new Date().getFullYear();
                        const count = await PatientCase.unscoped().count();
                        const sequence = String(count + 1).padStart(5, "0");
                        instance.case_number = `CASE-${year}-${sequence}`;
                    }
                    if (!instance.opening_date) {
                        instance.opening_date = new Date().toISOString().split("T")[0];
                    }
                },
            },
            indexes: [
                //INFO: Case number is the primary human-readable identifier for all case lookups
                // { unique: true, fields: ['case_number'] }, // Duplicate: already enforced by case_number unique:true
                //INFO: "Show all cases for patient X" — the most frequent case query
                { fields: ["patient_id"] },
                //INFO: "Show active cases for patient X" — case list with status filter
                { fields: ["patient_id", "case_status"] },
                //INFO: Cases filtered by location for location-specific dashboards
                { fields: ["practice_location_id"] },
                //INFO: Status filter on case management views (Active/Closed/On Hold)
                { fields: ["case_status"] },
                //INFO: Priority filter for urgent case triaging and escalation workflows
                { fields: ["priority"] },
                //INFO: Cases linked to a specific insurance for billing/claims queries
                { fields: ["insurance_id"] },
                //INFO: Cases linked to a specific firm for legal case management
                { fields: ["firm_id"] },
                //INFO: Date-range reporting on case openings for analytics
                { fields: ["opening_date"] },
            ],
        });
        return PatientCase;
    }
}
exports.PatientCase = PatientCase;
//# sourceMappingURL=patientCase.model.js.map