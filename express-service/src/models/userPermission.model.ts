import {
  Model, DataTypes, Sequelize,
  InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute,
} from 'sequelize';
import type { User } from './user.model';
import type { Permission } from './permission.model';

export class UserPermission extends Model<InferAttributes<UserPermission>, InferCreationAttributes<UserPermission>> {
  declare id: CreationOptional<number>;
  declare user_id: ForeignKey<number>;
  declare permission_id: ForeignKey<number>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare user?: NonAttribute<User>;
  declare permission?: NonAttribute<Permission>;

  static associate(models: Record<string, any>): void {
    UserPermission.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    UserPermission.belongsTo(models.Permission, { foreignKey: 'permission_id', as: 'permission' });
  }

  static initModel(sequelize: Sequelize): typeof UserPermission {
    UserPermission.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        permission_id: { type: DataTypes.INTEGER, allowNull: false },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
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
      },
    );
    return UserPermission;
  }
}
