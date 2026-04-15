"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
const sequelize_1 = require("sequelize");
const appointmentType_enum_1 = require("../enums/appointmentType.enum");
const appointmentStatus_enum_1 = require("../enums/appointmentStatus.enum");
const reminderMethod_enum_1 = require("../enums/reminderMethod.enum");
class Appointment extends sequelize_1.Model {
    //INFO: Virtual field — computed end time from appointment_time + duration_minutes
    get endTime() {
        const [hours, minutes] = this.appointment_time.split(":").map(Number);
        const totalMinutes = hours * 60 + minutes + (this.duration_minutes || 0);
        const endH = String(Math.floor(totalMinutes / 60) % 24).padStart(2, "0");
        const endM = String(totalMinutes % 60).padStart(2, "0");
        return `${endH}:${endM}:00`;
    }
    static associate(models) {
        Appointment.belongsTo(models.PatientCase, {
            foreignKey: "case_id",
            as: "patientCase",
        });
        Appointment.belongsTo(models.Patient, {
            foreignKey: "patient_id",
            as: "patient",
        });
        Appointment.belongsTo(models.DoctorProfile, {
            foreignKey: "doctor_id",
            as: "doctor",
        });
        Appointment.belongsTo(models.Specialty, {
            foreignKey: "specialty_id",
            as: "specialty",
        });
        Appointment.belongsTo(models.PracticeLocation, {
            foreignKey: "practice_location_id",
            as: "practiceLocation",
        });
        Appointment.belongsTo(models.User, {
            foreignKey: "created_by",
            as: "createdBy",
        });
        Appointment.hasOne(models.Visit, {
            foreignKey: "appointment_id",
            as: "visit",
        });
    }
    static initModel(sequelize) {
        Appointment.init({
            id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.DataTypes.UUIDV4 },
            appointment_number: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            case_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
            patient_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
            doctor_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
            appointment_date: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
            appointment_time: { type: sequelize_1.DataTypes.TIME, allowNull: false },
            appointment_type: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(appointmentType_enum_1.AppointmentType)),
                allowNull: false,
            },
            specialty_id: { type: sequelize_1.DataTypes.UUID, allowNull: true },
            practice_location_id: { type: sequelize_1.DataTypes.UUID, allowNull: true },
            duration_minutes: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 30,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(appointmentStatus_enum_1.AppointmentStatus)),
                allowNull: false,
                defaultValue: appointmentStatus_enum_1.AppointmentStatus.SCHEDULED,
            },
            reminder_sent: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            reminder_method: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(reminderMethod_enum_1.ReminderMethod)),
                allowNull: false,
                defaultValue: reminderMethod_enum_1.ReminderMethod.NONE,
            },
            notes: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
            reason_for_visit: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
            created_by: { type: sequelize_1.DataTypes.UUID, allowNull: true },
            created_at: sequelize_1.DataTypes.DATE,
            updated_at: sequelize_1.DataTypes.DATE,
            deleted_at: sequelize_1.DataTypes.DATE,
        }, {
            sequelize,
            tableName: "appointments",
            timestamps: true,
            paranoid: true,
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
            hooks: {
                //INFO: Auto-generate appointment_number in APT-YYYY-NNNNNN format
                beforeValidate: async (instance) => {
                    if (!instance.appointment_number) {
                        const year = new Date().getFullYear();
                        const count = await Appointment.unscoped().count();
                        const sequence = String(count + 1).padStart(6, "0");
                        instance.appointment_number = `APT-${year}-${sequence}`;
                    }
                },
            },
            indexes: [
                // { unique: true, fields: ['appointment_number'] }, // Duplicate: already enforced by appointment_number unique:true
                //INFO: Doctor's daily schedule — the single most critical scheduling query
                { fields: ["doctor_id", "appointment_date"] },
                //INFO: Patient's upcoming appointments — viewed on patient detail screen
                { fields: ["patient_id", "appointment_date"] },
                //INFO: Location schedule — used by front desk to see all appointments at a site
                { fields: ["practice_location_id", "appointment_date"] },
                //INFO: Appointments linked to a case for case timeline views
                { fields: ["case_id"] },
                //INFO: Status filter for appointment management (Scheduled/Confirmed/Completed)
                { fields: ["status"] },
                //INFO: Combined date + status for dashboard queries like "today's pending appointments"
                { fields: ["appointment_date", "status"] },
                //INFO: FDO audit trail — who created this appointment
                { fields: ["created_by"] },
                //INFO: Reminder batch job queries unsent reminders by date
                { fields: ["reminder_sent", "appointment_date"] },
            ],
        });
        return Appointment;
    }
}
exports.Appointment = Appointment;
//# sourceMappingURL=appointment.model.js.map