export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token?: string;
  email?: string;
  otp?: string;
  newPassword: string;
}

export interface SendOtpDto {
  phone?: string;
  email?: string;
}

export interface VerifyOtpDto {
  phone?: string;
  email?: string;
  otp: string;
}

export interface VerifyEmailDto {
  email: string;
  code: string;
}

export interface ResendVerificationDto {
  email: string;
}

