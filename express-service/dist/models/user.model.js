"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const bcrypt_util_1 = require("../utils/bcrypt.util");
const enums_1 = require("../enums");
class User extends sequelize_1.Model {
    isAdmin() {
        return this.role === enums_1.Role.ADMIN;
    }
    isDoctor() {
        return this.role === enums_1.Role.DOCTOR;
    }
    isFdo() {
        return this.role === enums_1.Role.FDO;
    }
    isPermissionAllowed(permissions) {
        if (this.isAdmin()) {
            return true;
        }
        if (!this.isFdo() ||
            !this.userPermissions ||
            this.userPermissions.length === 0) {
            return false;
        }
        const userPermissionSet = new Set(this.userPermissions.map((up) => up.permission?.permission_name));
        return permissions.every((p) => userPermissionSet.has(p));
    }
    static associate(models) {
        User.hasOne(models.DoctorProfile, {
            foreignKey: "user_id",
            as: "doctorProfile",
        });
        User.hasMany(models.UserPermission, {
            foreignKey: "user_id",
            as: "userPermissions",
        });
        User.hasMany(models.Appointment, {
            foreignKey: "created_by",
            as: "createdAppointments",
        });
    }
    static initModel(sequelize) {
        User.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                primaryKey: true,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
            },
            role: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(enums_1.Role)),
                allowNull: false,
            },
            first_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            last_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
            password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            phone: { type: sequelize_1.DataTypes.STRING, allowNull: true },
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
            tableName: "users",
            timestamps: true,
            paranoid: true,
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
            hooks: {
                beforeCreate: async (user) => {
                    if (user.password) {
                        user.password = await (0, bcrypt_util_1.hashPassword)(user.password);
                    }
                },
                beforeUpdate: async (user) => {
                    if (user.changed("password")) {
                        user.password = await (0, bcrypt_util_1.hashPassword)(user.password);
                    }
                },
            },
            indexes: [
                //INFO: Login/auth queries always filter by email — unique B-tree handles this
                // { unique: true, fields: ['email'] }, // Duplicate: already enforced by email unique:true
                //INFO: Role-based access control filters by role on nearly every admin query
                { fields: ["role"] },
                //INFO: Dashboard queries filter active users by role (e.g. "all active doctors")
                { fields: ["role", "is_active"] },
            ],
            defaultScope: {
                attributes: { exclude: ["password"] },
            },
            scopes: {
                withPassword: { attributes: { include: ["password"] } },
            },
        });
        return User;
    }
}
exports.User = User;
//# sourceMappingURL=user.model.js.map