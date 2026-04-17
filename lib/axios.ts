import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { env } from "./env";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
});

// ─── Request interceptor: attach JWT from localStorage ───────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor: normalize errors, handle 401 ──────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear stale token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        // Use cookie as well for middleware
        document.cookie =
          "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.location.href = "/login";
      }
    }
    return Promise.reject(normalizeError(error));
  }
);

export function normalizeError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    // FastAPI validation errors come as { detail: string | array }
    if (data?.detail) {
      if (typeof data.detail === "string") return new Error(data.detail);
      if (Array.isArray(data.detail)) {
        const messages = data.detail
          .map((d: { msg?: string }) => d.msg ?? JSON.stringify(d))
          .join(", ");
        return new Error(messages);
      }
    }
    return new Error(error.message ?? "An unexpected error occurred");
  }
  if (error instanceof Error) return error;
  return new Error("An unexpected error occurred");
}
