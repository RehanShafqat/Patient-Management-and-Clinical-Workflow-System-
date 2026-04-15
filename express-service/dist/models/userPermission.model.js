"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPermission = void 0;
const sequelize_1 = require("sequelize");
class UserPermission extends sequelize_1.Model {
    static associate(models) {
        UserPermission.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        UserPermission.belongsTo(models.Permission, { foreignKey: 'permission_id', as: 'permission' });
    }
    static initModel(sequelize) {
        UserPermission.init({
            id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.DataTypes.UUIDV4 },
            user_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
            permission_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
            created_at: sequelize_1.DataTypes.DATE,
            updated_at: sequelize_1.DataTypes.DATE,
        }, {
            sequelize,
            tableName: 'user_permissions',
            timestamps: true,
            underscored: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            indexes: [
                //INFO: Prevents duplicate permission assignments to the same user
                { unique: true, fields: ['user_id', 'permission_id'] },
                //INFO: Fast lookup of all permissions for a given user (authorization middleware)
                { fields: ['user_id'] },
                //INFO: Reverse lookup — find all users with a given permission
                { fields: ['permission_id'] },
            ],
        });
        return UserPermission;
    }
}
exports.UserPermission = UserPermission;
//# sourceMappingURL=userPermission.model.js.map