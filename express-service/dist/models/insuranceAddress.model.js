"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceAddress = void 0;
const sequelize_1 = require("sequelize");
class InsuranceAddress extends sequelize_1.Model {
    static associate(models) {
        InsuranceAddress.belongsTo(models.Insurance, {
            foreignKey: "insurance_id",
            as: "insurance",
        });
    }
    static initModel(sequelize) {
        InsuranceAddress.init({
            id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.DataTypes.UUIDV4 },
            insurance_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
            address: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
            phone: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            is_primary: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            created_at: sequelize_1.DataTypes.DATE,
            updated_at: sequelize_1.DataTypes.DATE,
            deleted_at: sequelize_1.DataTypes.DATE,
        }, {
            sequelize,
            tableName: "insurance_addresses",
            timestamps: true,
            paranoid: true,
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
            indexes: [
                //INFO: All addresses for a given insurance — used in insurance detail view
                { fields: ["insurance_id"] },
                //INFO: Fast primary-address resolution during claims and case creation
                { unique: true, fields: ["insurance_id", "is_primary"] },
            ],
        });
        return InsuranceAddress;
    }
}
exports.InsuranceAddress = InsuranceAddress;
//# sourceMappingURL=insuranceAddress.model.js.map