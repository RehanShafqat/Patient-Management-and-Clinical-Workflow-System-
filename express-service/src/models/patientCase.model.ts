import {
    Table, Column, Model, DataType,
    BelongsTo, ForeignKey, BeforeCreate,
    CreatedAt, UpdatedAt, DeletedAt
} from 'sequelize-typescript';
import { Patient } from './patient.model';

@Table({
    tableName: 'patient_cases',
    paranoid: true,    // soft delete
    timestamps: true,
})
export class PatientCase extends Model {

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    case_number!: string;

    @ForeignKey(() => Patient)
    @Column({ type: DataType.INTEGER, allowNull: false })
    patient_id!: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    practice_location_id!: number;

    @Column({
        type: DataType.ENUM(
            'General Medicine', 'Surgery', 'Pediatrics', 'Cardiology',
            'Orthopedics', 'Neurology', 'Dermatology', 'Gynecology',
            'Ophthalmology', 'ENT', 'Dental', 'Psychiatry',
            'Physical Therapy', 'Emergency', 'Other'
        ),
        allowNull: false,
    })
    category!: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    purpose_of_visit!: string;

    @Column({
        type: DataType.ENUM(
            'Initial Consultation', 'Follow-up', 'Emergency',
            'Chronic Care', 'Preventive Care', 'Pre-surgical', 'Post-surgical'
        ),
        allowNull: false,
    })
    case_type!: string;

    @Column({
        type: DataType.ENUM('Low', 'Normal', 'High', 'Urgent'),
        defaultValue: 'Normal',
    })
    priority!: string;

    @Column({
        type: DataType.ENUM('Active', 'On Hold', 'Closed', 'Transferred', 'Cancelled'),
        defaultValue: 'Active',
    })
    case_status!: string;

    @Column({ type: DataType.DATEONLY, allowNull: true })
    date_of_accident!: string;

    @Column({ type: DataType.INTEGER, allowNull: true })
    insurance_id!: number;

    @Column({ type: DataType.INTEGER, allowNull: true })
    firm_id!: number;

    @Column({ type: DataType.STRING, allowNull: true })
    referred_by!: string;

    @Column({ type: DataType.STRING, allowNull: true })
    referred_doctor_name!: string;

    @Column({ type: DataType.DATEONLY, allowNull: false })
    opening_date!: string;

    @Column({ type: DataType.DATEONLY, allowNull: true })
    closing_date!: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    clinical_notes!: string;

    @CreatedAt
    created_at!: Date;

    @UpdatedAt
    updated_at!: Date;

    @DeletedAt
    deleted_at!: Date;

    // Auto-generate case number before insert: CASE-YYYY-XXXXX
    @BeforeCreate
    static async generateCaseNumber(instance: PatientCase) {
        const year = new Date().getFullYear();
        const count = await PatientCase.count();
        const sequence = String(count + 1).padStart(5, '0');
        instance.case_number = `CASE-${year}-${sequence}`;
        instance.opening_date = instance.opening_date || new Date().toISOString().split('T')[0];
    }

    // One case belongs to one patient
    @BelongsTo(() => Patient)
    patient!: Patient;
}