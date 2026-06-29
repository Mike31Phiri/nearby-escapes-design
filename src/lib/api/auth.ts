import apiClient from "./client";
import type { User } from "@/types/user";
import type { LoginDto, RegisterDto } from "./dto/auth.dto";

export const login = async (dto: LoginDto): Promise<{ user: User }> => {
  const { data } = await apiClient.post<{ user: User }>("/auth/login", dto);
  return data;
};

export const register = async (dto: RegisterDto): Promise<{ user: User; message: string }> => {
  const { data } = await apiClient.post<{ user: User; message: string }>("/auth/register", dto);
  return data;
};

export const fetchCurrentUser = async (): Promise<User> => {
  const { data } = await apiClient.get<{ user: User }>("/auth/me");
  return data.user;
};

export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const { data } = await apiClient.post<{ message: string }>("/auth/forgot-password", { email });
  return data;
};
