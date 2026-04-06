import { DoctorProfile } from "./doctorProfile.model";
import { Patient } from "./patient.model";
import { PatientCase } from "./patientCase.model";
import { Permission } from "./permission.model";
import { User } from "./user.model";
import { UserPermission } from "./userPermission.model";

const models = {
  User,
  DoctorProfile,
  Patient,
  PatientCase,
  Permission,
  UserPermission,
};

export {
  User,
  DoctorProfile,
  Patient,
  PatientCase,
  Permission,
  UserPermission,
};
export default models;
