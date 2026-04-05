// src/models/User.ts
import {
    Table, Column, Model, DataType,
    HasOne, HasMany, CreatedAt, UpdatedAt, DeletedAt
} from 'sequelize-typescript';
import { DoctorProfile } from './doctorProfile.model';
import { UserPermission } from './userPermission.model';

@Table({
    tableName: 'users',
    paranoid: true,     // enables soft delete using deleted_at automatically
    timestamps: true,
})
export class User extends Model {

    @Column({
        type: DataType.ENUM('admin', 'doctor', 'fdo'),
        allowNull: false,
    })
    role!: 'admin' | 'doctor' | 'fdo';

    @Column({ type: DataType.STRING, allowNull: false })
    first_name!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    last_name!: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    email!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    password!: string;

    @Column({ type: DataType.STRING, allowNull: true })
    phone!: string;

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    is_active!: boolean;

    @(CreatedAt)
    created_at!: Date;

    @(UpdatedAt)
    updated_at!: Date;

    @(DeletedAt)
    deleted_at!: Date;

    // One user (doctor) has one doctor profile
    @HasOne(() => DoctorProfile)
    doctorProfile!: DoctorProfile;

    // One FDO user has many user_permissions rows
    @HasMany(() => UserPermission)
    userPermissions!: UserPermission[];

    // Helper methods — easy to explain in evaluation
    isAdmin(): boolean { return this.role === 'admin'; }
    isDoctor(): boolean { return this.role === 'doctor'; }
    isFdo(): boolean { return this.role === 'fdo'; }
}