export interface RegisterPayload {
  email: string;
  password: string;
  tenant_id: number;
  role?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: "bearer";
}

export interface User {
  id: number;
  email: string;
  role: string;
  tenant_id: number;
}

export interface RegisterResponse {
  id: number;
  email: string;
  role: string;
  tenant_id: number;
}
