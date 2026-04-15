"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Firm = void 0;
const sequelize_1 = require("sequelize");
const firmType_enum_1 = require("../enums/firmType.enum");
class Firm extends sequelize_1.Model {
    static associate(models) {
        Firm.hasMany(models.PatientCase, { foreignKey: 'firm_id', as: 'patientCases' });
    }
    static initModel(sequelize) {
        Firm.init({
            id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.DataTypes.UUIDV4 },
            firm_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            firm_type: { type: sequelize_1.DataTypes.ENUM(...Object.values(firmType_enum_1.FirmType)), allowNull: false },
            address: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
            phone: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            contact_person: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            is_active: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
            created_at: sequelize_1.DataTypes.DATE,
            updated_at: sequelize_1.DataTypes.DATE,
            deleted_at: sequelize_1.DataTypes.DATE,
        }, {
            sequelize,
            tableName: 'firms',
            timestamps: true,
            paranoid: true,
            underscored: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            indexes: [
                //INFO: Firm name search when linking a case to a law firm or organization
                { fields: ['firm_name'] },
                //INFO: Type filter (legal/corporate/etc.) for categorized firm listings
                { fields: ['firm_type'] },
                //INFO: Active filter on every firm dropdown in case management
                { fields: ['is_active'] },
            ],
        });
        return Firm;
    }
}
exports.Firm = Firm;
//# sourceMappingURL=firm.model.js.map