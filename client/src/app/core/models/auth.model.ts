// What we send to Node.js login API
export interface LoginRequest {
    email: string;
    password: string;
}

// What Node.js sends back after login
export interface LoginResponse {
    token: string;
    user: AuthUser;
}

// The logged-in user shape stored in localStorage
export interface AuthUser {
    id: number;
    role: 'admin' | 'doctor' | 'fdo';
    first_name: string;
    last_name: string;
    email: string;
}

// // What Admin sends to create a new user
// export interface CreateUserRequest {
//     role: 'admin' | 'doctor' | 'fdo';
//     first_name: string;
//     last_name: string;
//     email: string;
//     password: string;
//     phone?: string;
//     // Doctor-specific — only required when role is doctor
//     specialty_id?: number;
//     practice_location_id?: number;
//     license_number?: string;
// }