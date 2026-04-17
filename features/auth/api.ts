import { apiClient } from "@/lib/axios";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  User,
} from "./types";

export const authApi = {
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const { data } = await apiClient.post<RegisterResponse>(
      "/auth/register",
      payload
    );
    return data;
  },

  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>(
      "/auth/login",
      payload
    );
    return data;
  },

  me: async (): Promise<User> => {
    const { data } = await apiClient.get<User>("/auth/me");
    return data;
  },
};
