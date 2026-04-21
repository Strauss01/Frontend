import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "./api";
import { queryKeys } from "@/lib/query-keys";
import { persistToken, clearToken } from "@/lib/utils";
import type { LoginPayload, RegisterPayload } from "./types";

export function useMe() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: authApi.me,
    // Only run if a token exists
    enabled:
      typeof window !== "undefined" &&
      !!localStorage.getItem("access_token"),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.login,

    onSuccess: async (data) => {
      persistToken(data.access_token);

      await queryClient.invalidateQueries({
        queryKey: queryKeys.auth.me(),
      });

      toast.success("Welcome back");
      router.push("/dashboard");
    },

    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Login failed";

      toast.error(message);
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: () => {
      toast.success("Account created — please log in");
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Registration failed");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return () => {
    clearToken();
    queryClient.clear();
    router.push("/login");
  };
}
