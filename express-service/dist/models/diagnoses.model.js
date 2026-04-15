"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Diagnoses = void 0;
const sequelize_1 = require("sequelize");
class Diagnoses extends sequelize_1.Model {
    static associate(models) {
        Diagnoses.hasMany(models.Visit, {
            foreignKey: "diagnoses_id",
            as: "visits",
        });
    }
    static initModel(sequelize) {
        Diagnoses.init({
            id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.DataTypes.UUIDV4 },
            icd_code: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
            diagnoses_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            description: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
            is_active: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            created_at: sequelize_1.DataTypes.DATE,
            updated_at: sequelize_1.DataTypes.DATE,
        }, {
            sequelize,
            tableName: "diagnoses",
            timestamps: true,
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            indexes: [
                //INFO: ICD code is the international standard identifier — doctors search by it
                // { unique: true, fields: ['icd_code'] }, // Duplicate: already enforced by icd_code unique:true
                //INFO: Diagnoses name search for doctors selecting from the master list
                { fields: ["diagnoses_name"] },
                //INFO: Active filter to hide deprecated ICD codes from the selection UI
                { fields: ["is_active"] },
            ],
        });
        return Diagnoses;
    }
}
exports.Diagnoses = Diagnoses;
//# sourceMappingURL=diagnoses.model.js.map