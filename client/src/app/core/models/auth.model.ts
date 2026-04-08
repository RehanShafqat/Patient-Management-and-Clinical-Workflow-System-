interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: AuthUser;
}

interface AuthUser {
  id: number;
  role: 'admin' | 'doctor' | 'fdo';
  first_name: string;
  last_name: string;
  email: string;
  created_at?: string;
}

export type { LoginRequest, LoginResponse, AuthUser };
