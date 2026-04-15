"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PracticeLocation = void 0;
const sequelize_1 = require("sequelize");
class PracticeLocation extends sequelize_1.Model {
    static associate(models) {
        PracticeLocation.hasMany(models.PatientCase, {
            foreignKey: "practice_location_id",
            as: "patientCases",
        });
        PracticeLocation.hasMany(models.Appointment, {
            foreignKey: "practice_location_id",
            as: "appointments",
        });
        PracticeLocation.hasMany(models.DoctorProfile, {
            foreignKey: "practice_location_id",
            as: "doctorProfiles",
        });
    }
    static initModel(sequelize) {
        PracticeLocation.init({
            id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.DataTypes.UUIDV4 },
            location_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            address: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
            city: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            state: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            zip: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            phone: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            email: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            is_active: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            created_at: sequelize_1.DataTypes.DATE,
            updated_at: sequelize_1.DataTypes.DATE,
            deleted_at: sequelize_1.DataTypes.DATE,
        }, {
            sequelize,
            tableName: "practice_locations",
            timestamps: true,
            paranoid: true,
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
            indexes: [
                //INFO: Active filter on every location dropdown/list across the application
                { fields: ["is_active"] },
                //INFO: Geographic filtering for multi-location practices and reporting
                { fields: ["city", "state"] },
            ],
        });
        return PracticeLocation;
    }
}
exports.PracticeLocation = PracticeLocation;
//# sourceMappingURL=practiceLocation.model.js.map