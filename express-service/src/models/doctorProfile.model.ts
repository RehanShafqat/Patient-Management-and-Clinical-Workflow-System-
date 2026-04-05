// src/models/DoctorProfile.ts
import {
    Table, Column, Model, DataType,
    BelongsTo, ForeignKey,
    CreatedAt, UpdatedAt
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({
    tableName: 'doctor_profiles',
    timestamps: true,
})
export class DoctorProfile extends Model {

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false, unique: true })
    user_id!: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    specialty_id!: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    practice_location_id!: number;

    @Column({ type: DataType.STRING, allowNull: false })
    license_number!: string;

    @Column({ type: DataType.JSON, allowNull: true })
    availability_schedule!: object;

    @Column({ type: DataType.STRING, allowNull: true })
    bio!: string;

    @CreatedAt
    created_at!: Date;

    @UpdatedAt
    updated_at!: Date;

    // One doctor profile belongs to one user (one-to-one)
    @BelongsTo(() => User)
    user!: User;
}