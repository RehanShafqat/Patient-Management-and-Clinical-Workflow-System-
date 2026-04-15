"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Patient = void 0;
const sequelize_1 = require("sequelize");
const crypto = __importStar(require("crypto"));
const gender_enum_1 = require("../enums/gender.enum");
const patientStatus_enum_1 = require("../enums/patientStatus.enum");
class Patient extends sequelize_1.Model {
    //INFO: Virtual field — computed from date_of_birth, never persisted
    get age() {
        const today = new Date();
        const birth = new Date(this.date_of_birth);
        let years = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birth.getDate())) {
            years--;
        }
        return years;
    }
    static encryptSSN(ssn) {
        const secret = process.env.SSN_ENCRYPTION_KEY;
        if (!secret) {
            throw new Error("SSN_ENCRYPTION_KEY is missing in .env");
        }
        const key = Buffer.from(secret, "hex");
        if (key.length !== 32) {
            throw new Error("SSN_ENCRYPTION_KEY must be 64 hex characters (32 bytes)");
        }
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
        const encrypted = Buffer.concat([
            cipher.update(ssn, "utf8"),
            cipher.final(),
        ]);
        return iv.toString("hex") + ":" + encrypted.toString("hex");
    }
    static decryptSSN(encrypted) {
        const secret = process.env.SSN_ENCRYPTION_KEY;
        if (!secret) {
            throw new Error("SSN_ENCRYPTION_KEY is missing in .env");
        }
        if (!encrypted.includes(":")) {
            return encrypted;
        }
        const key = Buffer.from(secret, "hex");
        const [ivHex, encryptedHex] = encrypted.split(":");
        const iv = Buffer.from(ivHex, "hex");
        const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(encryptedHex, "hex")),
            decipher.final(),
        ]);
        return decrypted.toString("utf8");
    }
    static associate(models) {
        Patient.hasMany(models.PatientCase, {
            foreignKey: "patient_id",
            as: "cases",
        });
        Patient.hasMany(models.Appointment, {
            foreignKey: "patient_id",
            as: "appointments",
        });
        Patient.hasMany(models.Visit, { foreignKey: "patient_id", as: "visits" });
    }
    static initModel(sequelize) {
        Patient.init({
            id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.DataTypes.UUIDV4 },
            first_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            middle_name: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            last_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            date_of_birth: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
            gender: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(gender_enum_1.Gender)),
                allowNull: false,
            },
            ssn: { type: sequelize_1.DataTypes.STRING, allowNull: true, unique: true },
            email: { type: sequelize_1.DataTypes.STRING, allowNull: true, unique: true },
            phone: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            mobile: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            address: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
            city: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            state: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            zip_code: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            country: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            emergency_contact_name: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            emergency_contact_phone: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            primary_physician: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            insurance_provider: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            insurance_policy_number: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            preferred_language: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                defaultValue: "English",
            },
            patient_status: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(patientStatus_enum_1.PatientStatus)),
                allowNull: false,
                defaultValue: patientStatus_enum_1.PatientStatus.ACTIVE,
            },
            registration_date: { type: sequelize_1.DataTypes.DATE, allowNull: false },
            created_at: sequelize_1.DataTypes.DATE,
            updated_at: sequelize_1.DataTypes.DATE,
            deleted_at: sequelize_1.DataTypes.DATE,
        }, {
            sequelize,
            tableName: "patients",
            timestamps: true,
            paranoid: true,
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
            hooks: {
                beforeCreate: (patient) => {
                    if (patient.ssn && !patient.ssn.includes(":")) {
                        patient.ssn = Patient.encryptSSN(patient.ssn);
                    }
                    if (!patient.registration_date) {
                        patient.registration_date = new Date();
                    }
                },
                beforeUpdate: (patient) => {
                    if (patient.changed("ssn") &&
                        patient.ssn &&
                        !patient.ssn.includes(":")) {
                        patient.ssn = Patient.encryptSSN(patient.ssn);
                    }
                },
            },
            defaultScope: {
                //INFO: SSN is never exposed in API responses by default
                attributes: { exclude: ["ssn"] },
            },
            scopes: {
                withSSN: { attributes: { include: ["ssn"] } },
            },
            indexes: [
                //INFO: Prevent duplicate patient records with same first/last name and DOB
                {
                    unique: true,
                    fields: ["first_name", "last_name", "date_of_birth"],
                    name: "unique_patient",
                },
                //INFO: Patient search by name — the most common front-desk operation
                { fields: ["last_name", "first_name"] },
                //INFO: Unique patient email for communication and portal login
                // { unique: true, fields: ['email'] }, // Duplicate: already enforced by email unique:true
                //INFO: Unique encrypted SSN for identity verification
                // { unique: true, fields: ['ssn'] }, // Duplicate: already enforced by ssn unique:true
                //INFO: DOB used in age-range reports and patient identification
                { fields: ["date_of_birth"] },
                //INFO: Status filter on every patient list view (Active/Inactive/etc.)
                { fields: ["patient_status"] },
                //INFO: Phone lookup when patients call in for appointment scheduling
                { fields: ["phone"] },
                //INFO: Date-range queries for registration reports and analytics
                { fields: ["registration_date"] },
            ],
        });
        return Patient;
    }
}
exports.Patient = Patient;
//# sourceMappingURL=patient.model.js.map