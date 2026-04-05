import {
    Table, Column, Model, DataType,
    HasMany, CreatedAt, UpdatedAt
} from 'sequelize-typescript';
import { UserPermission } from './userPermission.model';

@Table({
    tableName: 'permissions',
    timestamps: true,
})
export class Permission extends Model {

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    permission_name!: string;

    @Column({ type: DataType.STRING, allowNull: true })
    description!: string;

    @CreatedAt
    created_at!: Date;

    @UpdatedAt
    updated_at!: Date;

    // One permission type is assigned to many FDO users
    @HasMany(() => UserPermission)
    userPermissions!: UserPermission[];
}