import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BeforeCreate,
  BeforeUpdate,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from "sequelize-typescript";
import { PatientCase } from "./patientCase.model";
import * as crypto from "crypto";
import { Gender } from "../enums/gender.enum";

@Table({
  tableName: "patients",
  paranoid: true, // soft delete
  timestamps: true,
})
export class Patient extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  first_name!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  middle_name!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  last_name!: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  date_of_birth!: string;

  @Column({
    type: DataType.ENUM(...Object.values(Gender)), // Spreads the values: ["male", "female", ...]
    allowNull: false,
  })
  gender!: Gender;

  @Column({ type: DataType.STRING, allowNull: true, unique: true })
  ssn!: string; // stored encrypted

  @Column({ type: DataType.STRING, allowNull: true, unique: true })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  phone!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  mobile!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  address!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  city!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  state!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  zip_code!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  country!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  emergency_contact_name!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  emergency_contact_phone!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  primary_physician!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  insurance_provider!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  insurance_policy_number!: string;

  @Column({ type: DataType.STRING, defaultValue: "English" })
  preferred_language!: string;

  @Column({
    type: DataType.ENUM("Active", "Inactive", "Deceased", "Transferred"),
    defaultValue: "Active",
  })
  patient_status!: string;

  @Column({ type: DataType.DATE, allowNull: false })
  registration_date!: Date;

  @CreatedAt
  created_at!: Date;

  @UpdatedAt
  updated_at!: Date;

  @DeletedAt
  deleted_at!: Date;

  // Computed age — never stored in DB
  get age(): number {
    const today = new Date();
    const birth = new Date(this.date_of_birth);
    return today.getFullYear() - birth.getFullYear();
  }

  // Encrypt SSN automatically before insert
  @BeforeCreate
  static encryptSsnOnCreate(instance: Patient) {
    if (instance.ssn) {
      instance.ssn = Patient.encryptSSN(instance.ssn);
    }
    // Set registration_date automatically on creation
    instance.registration_date = new Date();
  }

  // Encrypt SSN automatically before update
  @BeforeUpdate
  static encryptSsnOnUpdate(instance: Patient) {
    // Only encrypt if SSN was changed and is not already encrypted
    if (instance.ssn && !instance.ssn.includes(":")) {
      instance.ssn = Patient.encryptSSN(instance.ssn);
    }
  }

  static encryptSSN(ssn: string): string {
  const secret = process.env.SSN_ENCRYPTION_KEY;

  if (!secret) {
    throw new Error("SSN_ENCRYPTION_KEY is missing in .env");
  }

  const key = Buffer.from(secret, "hex");

  if (key.length !== 32) {
    throw new Error("SSN_ENCRYPTION_KEY must be 64 hex characters (32 bytes)");
  }

  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  const encrypted = Buffer.concat([
    cipher.update(ssn, "utf8"),
    cipher.final(),
  ]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

  static decryptSSN(encrypted: string): string {
  const secret = process.env.SSN_ENCRYPTION_KEY;

  if (!secret) {
    throw new Error("SSN_ENCRYPTION_KEY is missing in .env");
  }

  if (!encrypted.includes(":")) {
    return encrypted;
  }

  const key = Buffer.from(secret, "hex");

  const [ivHex, encryptedHex] = encrypted.split(":");

  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

  // One patient has many cases
  @HasMany(() => PatientCase)
  cases!: PatientCase[];
}
