"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = void 0;
const sequelize_1 = require("sequelize");
class Permission extends sequelize_1.Model {
    static associate(models) {
        Permission.hasMany(models.UserPermission, {
            foreignKey: "permission_id",
            as: "userPermissions",
        });
    }
    static initModel(sequelize) {
        Permission.init({
            id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.DataTypes.UUIDV4 },
            permission_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            description: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            created_at: sequelize_1.DataTypes.DATE,
            updated_at: sequelize_1.DataTypes.DATE,
        }, {
            sequelize,
            tableName: "permissions",
            timestamps: true,
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            indexes: [
            //INFO: Permission lookup by name during authorization checks
            // { unique: true, fields: ['permission_name'] }, // Duplicate: already enforced by permission_name unique:true
            ],
        });
        return Permission;
    }
}
exports.Permission = Permission;
//# sourceMappingURL=permission.model.js.map