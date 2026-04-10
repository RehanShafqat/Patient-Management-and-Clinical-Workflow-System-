import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  BeforeValidate,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from "sequelize-typescript";
import { Patient } from "./patient.model";

import { CaseCategory } from "../enums/caseCategory.enum";
import { CaseType } from "../enums/caseType.enum";
import { CasePriority } from "../enums/casePriority.enum";
import { CaseStatus } from "../enums/caseStatus.enum";

@Table({
  tableName: "patient_cases",
  paranoid: true, // soft delete
  timestamps: true,
})
export class PatientCase extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  case_number!: string;

  @ForeignKey(() => Patient)
  @Column({ type: DataType.INTEGER, allowNull: false })
  patient_id!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  practice_location_id!: number;

  @Column({
    type: DataType.ENUM(...Object.values(CaseCategory)),
    allowNull: false,
  })
  category!: CaseCategory;

  @Column({ type: DataType.TEXT, allowNull: false })
  purpose_of_visit!: string;

  @Column({
    type: DataType.ENUM(...Object.values(CaseType)),
    allowNull: false,
  })
  case_type!: CaseType;

  @Column({
    type: DataType.ENUM(...Object.values(CasePriority)),
    defaultValue: CasePriority.NORMAL,
  })
  priority!: CasePriority;

  @Column({
    type: DataType.ENUM(...Object.values(CaseStatus)),
    defaultValue: CaseStatus.ACTIVE,
  })
  case_status!: CaseStatus;

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

  // Auto-generate case number before validation so required case_number passes
  @BeforeValidate
  static async generateCaseNumber(instance: PatientCase) {
    console.log("HOOK RUNNING: Generating case number...");

    // Generate the number
    const year = new Date().getFullYear();

    // Using 'unscoped' ensures we count deleted items too,
    // preventing duplicate case numbers if you use paranoid mode
    const count = await PatientCase.unscoped().count();

    const sequence = String(count + 1).padStart(5, "0");

    // ASSIGN IT TO THE INSTANCE
    instance.case_number = `CASE-${year}-${sequence}`;

    // Handle opening_date
    if (!instance.opening_date) {
      instance.opening_date = new Date().toISOString().split("T")[0];
    }
  }

  // One case belongs to one patient
  @BelongsTo(() => Patient)
  patient!: Patient;
}
