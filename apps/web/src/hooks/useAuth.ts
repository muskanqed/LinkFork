"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi, LoginPayload, SignupPayload, User } from "@/lib/auth-api";
import { ApiError } from "@/lib/api";

export const authKeys = {
  all: ["auth"] as const,
  user: ["auth", "user"] as const,
};

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: async (): Promise<User | null> => {
      try {
        return await authApi.getMe();
      } catch (err: unknown) {
        if (
          (err instanceof ApiError && err.status === 401) ||
          (err instanceof Error &&
            (err.message.includes("Authentication required") ||
              err.message.includes("token")))
        ) {
          return null;
        }
        throw err;
      }
    },
    retry: (failureCount, error: unknown) => {
      if (error instanceof ApiError && error.status === 401) return false;
      return failureCount < 1;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (response) => {
      if (response?.data?.user) {
        queryClient.setQueryData(authKeys.user, response.data.user);
      }
      queryClient.invalidateQueries({ queryKey: authKeys.user });
      router.push("/dashboard");
    },
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: SignupPayload) => authApi.signup(payload),
    onSuccess: (response) => {
      if (response?.data?.user) {
        queryClient.setQueryData(authKeys.user, response.data.user);
      }
      queryClient.invalidateQueries({ queryKey: authKeys.user });
      // Following existing application flow: redirect to /login after successful signup
      router.push("/login");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      queryClient.setQueryData(authKeys.user, null);
      queryClient.removeQueries({ queryKey: authKeys.all });
      router.push("/login");
    },
  });
}
