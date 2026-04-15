"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visit = void 0;
const sequelize_1 = require("sequelize");
const visitStatus_enum_1 = require("../enums/visitStatus.enum");
class Visit extends sequelize_1.Model {
    //INFO: Factory method — creates a Visit from a completed Appointment
    static async createFromAppointment(appointment) {
        const year = new Date().getFullYear();
        const count = await Visit.unscoped().count();
        const sequence = String(count + 1).padStart(6, "0");
        const now = new Date();
        return Visit.create({
            visit_number: `VST-${year}-${sequence}`,
            appointment_id: appointment.id,
            case_id: appointment.case_id,
            patient_id: appointment.patient_id,
            doctor_id: appointment.doctor_id,
            visit_date: now.toISOString().split("T")[0],
            visit_time: now.toTimeString().split(" ")[0],
            visit_status: visitStatus_enum_1.VisitStatus.DRAFT,
        });
    }
    static associate(models) {
        Visit.belongsTo(models.Appointment, {
            foreignKey: "appointment_id",
            as: "appointment",
        });
        Visit.belongsTo(models.PatientCase, {
            foreignKey: "case_id",
            as: "patientCase",
        });
        Visit.belongsTo(models.Patient, {
            foreignKey: "patient_id",
            as: "patient",
        });
        Visit.belongsTo(models.DoctorProfile, {
            foreignKey: "doctor_id",
            as: "doctor",
        });
        Visit.belongsTo(models.Diagnoses, {
            foreignKey: "diagnoses_id",
            as: "diagnoses",
        });
    }
    static initModel(sequelize) {
        Visit.init({
            id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.DataTypes.UUIDV4 },
            visit_number: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            appointment_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
            case_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
            patient_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
            doctor_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
            visit_date: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
            visit_time: { type: sequelize_1.DataTypes.TIME, allowNull: true },
            visit_duration_minutes: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
            diagnoses_id: { type: sequelize_1.DataTypes.UUID, allowNull: true },
            treatment: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
            treatment_plan: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
            prescription: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
            prescription_documents: { type: sequelize_1.DataTypes.JSON, allowNull: true },
            notes: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
            vital_signs: { type: sequelize_1.DataTypes.JSON, allowNull: true },
            symptoms: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
            follow_up_required: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            follow_up_date: { type: sequelize_1.DataTypes.DATEONLY, allowNull: true },
            referral_made: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            referral_to: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            visit_status: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(visitStatus_enum_1.VisitStatus)),
                allowNull: false,
                defaultValue: visitStatus_enum_1.VisitStatus.DRAFT,
            },
            completed_at: { type: sequelize_1.DataTypes.DATE, allowNull: true },
            created_at: sequelize_1.DataTypes.DATE,
            updated_at: sequelize_1.DataTypes.DATE,
            deleted_at: sequelize_1.DataTypes.DATE,
        }, {
            sequelize,
            tableName: "visits",
            timestamps: true,
            paranoid: true,
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
            indexes: [
                //INFO: Visit number is the primary human-readable identifier
                // { unique: true, fields: ['visit_number'] }, // Duplicate: already enforced by visit_number unique:true
                //INFO: One-to-one with appointment — each appointment produces at most one visit
                { unique: true, fields: ["appointment_id"] },
                //INFO: Doctor's visit history by date — used for productivity reports
                { fields: ["doctor_id", "visit_date"] },
                //INFO: Patient's visit history by date — used on patient timeline screen
                { fields: ["patient_id", "visit_date"] },
                //INFO: Visits linked to a case for case timeline views
                { fields: ["case_id"] },
                //INFO: Status filter for visit management (Draft/Completed/Billed)
                { fields: ["visit_status"] },
                //INFO: Diagnosis-based reporting for clinical analytics
                { fields: ["diagnoses_id"] },
                //INFO: Follow-up scheduling — finds visits requiring follow-up by date
                { fields: ["follow_up_required", "follow_up_date"] },
                //INFO: Referral tracking for care coordination reporting
                { fields: ["referral_made"] },
            ],
        });
        return Visit;
    }
}
exports.Visit = Visit;
//# sourceMappingURL=visit.model.js.map