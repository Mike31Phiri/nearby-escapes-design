import apiClient from "./client";
import type { User } from "@/types/user";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth/cookies";
import type {
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  SendOtpDto,
  VerifyOtpDto,
  VerifyEmailDto,
  ResendVerificationDto,
} from "./dto/auth.dto";

export const login = async (
  dto: LoginDto,
): Promise<{ user: User; accessToken?: string; refreshToken?: string }> => {
  const { data } = await apiClient.post<{
    user: User;
    accessToken?: string;
    refreshToken?: string;
  }>("/auth/login", dto);
  if (data.accessToken && typeof window !== "undefined") {
    localStorage.setItem("nearby_access_token", data.accessToken);
    setAuthCookies(data.accessToken);
  }
  return data;
};

export const register = async (
  dto: RegisterDto,
): Promise<{ user: User; message: string; accessToken?: string; refreshToken?: string }> => {
  const { data } = await apiClient.post<{
    user: User;
    message: string;
    accessToken?: string;
    refreshToken?: string;
  }>("/auth/register", dto);
  if (data.accessToken && typeof window !== "undefined") {
    localStorage.setItem("nearby_access_token", data.accessToken);
    setAuthCookies(data.accessToken);
  }
  return data;
};

export const fetchCurrentUser = async (): Promise<User> => {
  const res = await apiClient.get<{ user: User }>("/auth/me");
  if (res.status === 304 || !res.data?.user) {
    const { useAuthStore } = await import("@/lib/store/authStore");
    const existing = useAuthStore.getState().user;
    if (existing) return existing;
  }
  return res.data?.user;
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post("/auth/logout");
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("nearby_access_token");
      localStorage.removeItem("token");
      clearAuthCookies();
    }
  }
};

export const forgotPassword = async (
  email: string,
): Promise<{ success: boolean; message: string; resetToken?: string; devOtp?: string }> => {
  const { data } = await apiClient.post<{
    success: boolean;
    message: string;
    resetToken?: string;
    devOtp?: string;
  }>("/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async (
  dto: ResetPasswordDto,
): Promise<{ success: boolean; message: string }> => {
  const { data } = await apiClient.post<{ success: boolean; message: string }>(
    "/auth/reset-password",
    dto,
  );
  return data;
};

export const sendOtp = async (
  dto: SendOtpDto,
): Promise<{ success: boolean; message: string; devOtp?: string }> => {
  const { data } = await apiClient.post<{ success: boolean; message: string; devOtp?: string }>(
    "/auth/send-otp",
    dto,
  );
  return data;
};

export const verifyOtp = async (
  dto: VerifyOtpDto,
): Promise<{
  success: boolean;
  message: string;
  user?: User;
  accessToken?: string;
}> => {
  const { data } = await apiClient.post<{
    success: boolean;
    message: string;
    user?: User;
    accessToken?: string;
  }>("/auth/verify-otp", dto);
  if (data.accessToken && typeof window !== "undefined") {
    localStorage.setItem("nearby_access_token", data.accessToken);
    setAuthCookies(data.accessToken);
  }
  return data;
};

export const refreshSession = async (): Promise<{ user: User; accessToken: string }> => {
  const { data } = await apiClient.post<{ user: User; accessToken: string }>("/auth/refresh");
  if (data.accessToken && typeof window !== "undefined") {
    localStorage.setItem("nearby_access_token", data.accessToken);
    setAuthCookies(data.accessToken);
  }
  return data;
};

export const verifyEmail = async (
  dto: VerifyEmailDto,
): Promise<{
  success: boolean;
  message: string;
  user?: User;
  accessToken?: string;
}> => {
  const { data } = await apiClient.post<{
    success: boolean;
    message: string;
    user?: User;
    accessToken?: string;
  }>("/auth/verify-email", dto);
  if (data.accessToken && typeof window !== "undefined") {
    localStorage.setItem("nearby_access_token", data.accessToken);
    setAuthCookies(data.accessToken);
  }
  return data;
};

export const resendVerificationEmail = async (
  dto: ResendVerificationDto,
): Promise<{ success: boolean; message: string }> => {
  const { data } = await apiClient.post<{ success: boolean; message: string }>(
    "/auth/resend-verification",
    dto,
  );
  return data;
};

