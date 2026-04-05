import {
    Table, Column, Model, DataType,
    BelongsTo, ForeignKey, UpdatedAt
} from 'sequelize-typescript';
import { User } from './user.model';
import { Permission } from './permission.model';

@Table({
    tableName: 'user_permissions',
    timestamps: false,    // this table only has updated_at not created_at
})
export class UserPermission extends Model {

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    user_id!: number;

    @ForeignKey(() => Permission)
    @Column({ type: DataType.INTEGER, allowNull: false })
    permission_id!: number;

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    is_granted!: boolean;

    @UpdatedAt
    updated_at!: Date;

    // Belongs to an FDO user
    @BelongsTo(() => User)
    user!: User;

    // Belongs to a permission type
    @BelongsTo(() => Permission)
    permission!: Permission;
}