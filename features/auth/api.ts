import axios from "axios";
import type { LoginPayload, RegisterPayload } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Attach token automatically
client.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Normalize errors so React Query stops showing "Network Error"
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      // THIS is where ERR_CONNECTION_REFUSED was hiding
      throw new Error("Unable to reach server. Check API connection.");
    }

    const message =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      "Request failed";

    throw new Error(message);
  }
);

export const authApi = {
  login: async (payload: LoginPayload) => {
    const res = await client.post("/auth/login", payload);
    return res.data;
  },

  register: async (payload: RegisterPayload) => {
    const res = await client.post("/auth/register", payload);
    return res.data;
  },

  me: async () => {
    const res = await client.get("/auth/me");
    return res.data;
  },
};
