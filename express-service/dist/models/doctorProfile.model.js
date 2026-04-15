"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorProfile = void 0;
const sequelize_1 = require("sequelize");
class DoctorProfile extends sequelize_1.Model {
    static associate(models) {
        DoctorProfile.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
        DoctorProfile.belongsTo(models.Specialty, {
            foreignKey: "specialty_id",
            as: "specialty",
        });
        DoctorProfile.belongsTo(models.PracticeLocation, {
            foreignKey: "practice_location_id",
            as: "practiceLocation",
        });
        DoctorProfile.hasMany(models.Appointment, {
            foreignKey: "doctor_id",
            as: "appointments",
        });
        DoctorProfile.hasMany(models.Visit, {
            foreignKey: "doctor_id",
            as: "visits",
        });
    }
    static initModel(sequelize) {
        DoctorProfile.init({
            id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.DataTypes.UUIDV4 },
            user_id: { type: sequelize_1.DataTypes.UUID, allowNull: false, unique: true },
            specialty_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
            practice_location_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
            license_number: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            availability_schedule: { type: sequelize_1.DataTypes.JSON, allowNull: true },
            bio: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
            created_at: sequelize_1.DataTypes.DATE,
            updated_at: sequelize_1.DataTypes.DATE,
            deleted_at: sequelize_1.DataTypes.DATE,
        }, {
            sequelize,
            tableName: "doctor_profiles",
            timestamps: true,
            paranoid: true,
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
            indexes: [
                //INFO: One-to-one with users — each user has at most one doctor profile
                // { unique: true, fields: ['user_id'] }, // Duplicate: already enforced by user_id unique:true
                //INFO: License verification lookups by regulatory systems
                // { unique: true, fields: ['license_number'] }, // Duplicate: already enforced by license_number unique:true
                //INFO: "Show all doctors in Cardiology" — specialty-based doctor filtering
                { fields: ["specialty_id"] },
                //INFO: "Show all doctors at Location X" — location-based doctor filtering
                { fields: ["practice_location_id"] },
            ],
        });
        return DoctorProfile;
    }
}
exports.DoctorProfile = DoctorProfile;
//# sourceMappingURL=doctorProfile.model.js.map