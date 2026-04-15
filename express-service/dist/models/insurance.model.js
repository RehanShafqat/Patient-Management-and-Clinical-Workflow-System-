"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Insurance = void 0;
const sequelize_1 = require("sequelize");
class Insurance extends sequelize_1.Model {
    static associate(models) {
        Insurance.hasMany(models.InsuranceAddress, {
            foreignKey: "insurance_id",
            as: "addresses",
        });
        Insurance.hasOne(models.InsuranceAddress, {
            foreignKey: "insurance_id",
            as: "primaryAddress",
            scope: { is_primary: true },
        });
        Insurance.hasMany(models.PatientCase, {
            foreignKey: "insurance_id",
            as: "patientCases",
        });
    }
    static initModel(sequelize) {
        Insurance.init({
            id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.DataTypes.UUIDV4 },
            insurance_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            insurance_code: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
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
            tableName: "insurances",
            timestamps: true,
            paranoid: true,
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
            indexes: [
                //INFO: Insurance code is the standard industry identifier used in claims processing
                // { unique: true, fields: ['insurance_code'] }, // Duplicate: already enforced by insurance_code unique:true
                //INFO: Insurance name search when front desk selects a payer
                { fields: ["insurance_name"] },
                //INFO: Active filter on every insurance dropdown in case creation
                { fields: ["is_active"] },
            ],
        });
        return Insurance;
    }
}
exports.Insurance = Insurance;
//# sourceMappingURL=insurance.model.js.map