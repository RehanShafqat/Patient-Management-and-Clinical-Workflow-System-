"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseMessage = void 0;
var ResponseMessage;
(function (ResponseMessage) {
    // Auth
    ResponseMessage["LOGIN_SUCCESS"] = "Login successful";
    ResponseMessage["LOGOUT_SUCCESS"] = "Logout successful";
    ResponseMessage["INVALID_CREDENTIALS"] = "Invalid email or password";
    ResponseMessage["ACCOUNT_INACTIVE"] = "User account is inactive";
    ResponseMessage["PASSWORD_MISSING"] = "User password is missing";
    ResponseMessage["ROLE_NOT_ALLOWED"] = "User role is not allowed";
    ResponseMessage["UNAUTHORIZED"] = "Unauthorized";
    ResponseMessage["FORBIDDEN"] = "You are not authorized to perform this action";
    // User
    ResponseMessage["USER_CREATED"] = "User created successfully";
    ResponseMessage["USER_FETCHED"] = "User fetched successfully";
    ResponseMessage["USERS_FETCHED"] = "Users fetched successfully";
    ResponseMessage["USER_UPDATED"] = "User updated successfully";
    ResponseMessage["USER_DELETED"] = "User deleted successfully";
    ResponseMessage["USER_NOT_FOUND"] = "User not found";
    ResponseMessage["USER_ALREADY_EXISTS"] = "User with this email already exists";
    ResponseMessage["EMAIL_UPDATE_FORBIDDEN"] = "Email can not be updated";
    ResponseMessage["DOCTOR_FIELDS_REQUIRED"] = "Specialty, practice location, and license number are required when changing role to Doctor";
    ResponseMessage["FDO_PERMISSIONS_REQUIRED"] = "Permissions are required when changing role to FDO";
    // Patient
    ResponseMessage["PATIENT_CREATED"] = "Patient created successfully";
    ResponseMessage["PATIENT_FETCHED"] = "Patient fetched successfully";
    ResponseMessage["PATIENTS_FETCHED"] = "Patients fetched successfully";
    ResponseMessage["PATIENT_UPDATED"] = "Patient updated successfully";
    ResponseMessage["PATIENT_DELETED"] = "Patient deleted successfully";
    ResponseMessage["PATIENT_NOT_FOUND"] = "Patient not found";
    ResponseMessage["PATIENT_ALREADY_EXISTS"] = "Patient already exists";
    ResponseMessage["PATIENT_CREATION_FAILED"] = "Patient record could not be created";
    // Case
    ResponseMessage["CASE_CREATED"] = "Case created successfully";
    ResponseMessage["CASE_FETCHED"] = "Case fetched successfully";
    ResponseMessage["CASES_FETCHED"] = "Cases fetched successfully";
    ResponseMessage["PATIENT_CASES_FETCHED"] = "Patient cases fetched successfully";
    ResponseMessage["CASE_UPDATED"] = "Case updated successfully";
    ResponseMessage["CASE_DELETED"] = "Case deleted successfully";
    ResponseMessage["CASE_NOT_FOUND"] = "Case not found";
    ResponseMessage["CASE_CREATION_FAILED"] = "Case record could not be created";
    // Specialty
    ResponseMessage["SPECIALTY_CREATED"] = "Specialty Created";
    ResponseMessage["SPECIALTY_NOT_FOUND"] = "Specialty not found";
    ResponseMessage["SPECIALTIES_FETCHED"] = "Specialties fetched successfully";
    ResponseMessage["SPECIALTY_FETCHED"] = "Specialty fetched successfully";
    ResponseMessage["SPECIALTY_UPDATED"] = "Specialty updated successfully";
    ResponseMessage["SPECIALTY_DELETED"] = "Specialty deleted successfully";
    ResponseMessage["SPECIALTY_CREATION_FAILED"] = "Specialty record could not be created";
    // Validation
    ResponseMessage["INVALID_ID_FORMAT"] = "Invalid ID format.";
    ResponseMessage["INVALID_PATIENT_ID"] = "Invalid patient ID";
    ResponseMessage["INVALID_PATIENT_ID_FORMAT"] = "Invalid patient ID format";
    ResponseMessage["INVALID_UUID_FORMAT"] = "Invalid ID format. ID must be a UUID.";
})(ResponseMessage || (exports.ResponseMessage = ResponseMessage = {}));
//# sourceMappingURL=responseMessage.enum.js.map