"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Specialty = void 0;
const sequelize_1 = require("sequelize");
class Specialty extends sequelize_1.Model {
    static associate(models) {
        Specialty.hasMany(models.DoctorProfile, {
            foreignKey: "specialty_id",
            as: "doctorProfiles",
        });
        Specialty.hasMany(models.Appointment, {
            foreignKey: "specialty_id",
            as: "appointments",
        });
    }
    static initModel(sequelize) {
        Specialty.init({
            id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.DataTypes.UUIDV4 },
            specialty_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            description: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
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
            tableName: "specialties",
            timestamps: true,
            paranoid: true,
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
            indexes: [
                //INFO: Specialty name is queried for dropdowns and used as a natural key
                // { unique: true, fields: ['specialty_name'] }, // Duplicate: already enforced by specialty_name unique:true
                //INFO: Active filter on every specialty dropdown/list in the UI
                { fields: ["is_active"] },
            ],
        });
        return Specialty;
    }
}
exports.Specialty = Specialty;
//# sourceMappingURL=specialty.model.js.map