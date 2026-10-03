"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  ChevronDown,
  Loader2,
  Phone,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  RefreshCw,
  MailCheck,
} from "lucide-react";
import { EnvelopeSimple as MessageSquare } from "@phosphor-icons/react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store/authStore";
import * as authApi from "@/lib/api/auth";
import { cn } from "@/lib/utils";

interface AuthPageViewProps {
  defaultTab?: "login" | "register" | "otp" | "reset" | "verify-email";
}

// Password strength
function PasswordStrength({ password }: { password: string }) {
  const getStrength = (val: string) => {
    if (!val)
      return {
        score: 0,
        label: "Enter a password",
        color: "text-black-faint",
        bar: "bg-black/[0.08]",
      };
    if (val.length < 6)
      return { score: 1, label: "Too short", color: "text-red-500", bar: "bg-red-400" };
    if (val.length < 8)
      return { score: 2, label: "Weak", color: "text-amber-500", bar: "bg-amber-400" };
    if (val.length < 12) return { score: 3, label: "Good", color: "text-purple", bar: "bg-purple" };
    return { score: 4, label: "Strong", color: "text-emerald-600", bar: "bg-emerald-500" };
  };
  const strength = getStrength(password);
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i <= strength.score ? strength.bar : "bg-black/[0.08]",
            )}
          />
        ))}
      </div>
      <p className={cn("text-[11px] font-semibold", strength.color)}>{strength.label}</p>
    </div>
  );
}

// OTP inputs
function OtpInputs({
  value,
  onChange,
  onKeyDown,
  fieldId,
}: {
  value: string[];
  onChange: (index: number, val: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  fieldId: string;
}) {
  return (
    <div className="flex gap-2.5 sm:gap-3 justify-center">
      {value.map((digit, idx) => (
        <input
          key={idx}
          id={`${fieldId}-${idx}`}
          className={cn(
            "w-11 h-13 sm:w-13 sm:h-15 rounded-2xl border-2 text-center text-xl sm:text-2xl font-bold text-black font-sans bg-white outline-none transition-all duration-200",
            digit
              ? "border-purple bg-purple/[0.03]"
              : "border-black/[0.1] focus:border-purple focus:ring-2 focus:ring-purple/10",
          )}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => {
            const clean = e.target.value.replace(/[^0-9]/g, "").slice(-1);
            onChange(idx, clean);
          }}
          onKeyDown={(e) => onKeyDown(idx, e)}
          placeholder="·"
          aria-label={`Digit ${idx + 1}`}
        />
      ))}
    </div>
  );
}

// Submit button
function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3.5 bg-[var(--color-yellow,#ffca28)] hover:brightness-95 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-black text-[15px] font-bold rounded-2xl transition-all duration-200 shadow-md shadow-black/[0.04] flex items-center justify-center gap-2"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

// Reusable input
function InputField({
  icon: Icon,
  rightSlot,
  className,
  ...props
}: {
  icon?: React.ElementType;
  rightSlot?: React.ReactNode;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black-faint" />
      )}
      <input
        className={cn(
          "w-full py-3 rounded-xl border border-black/[0.12] bg-white text-[15px] font-medium text-black outline-none transition-all focus:border-purple focus:ring-2 focus:ring-purple/10 placeholder:text-black-faint/60",
          Icon ? "pl-10" : "pl-4",
          rightSlot ? "pr-11" : "pr-4",
          className,
        )}
        {...props}
      />
      {rightSlot && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightSlot}</div>}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label className="text-[10px] font-bold uppercase tracking-widest text-black-faint">
      {children}
    </Label>
  );
}

// Eye toggle
function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="text-black-faint hover:text-black transition-colors p-1"
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
}

// Main component
export function AuthPageView({ defaultTab = "login" }: AuthPageViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);

  const activeTab = defaultTab;
  // Where to send the user after auth: the page they came from, else home.
  // Only allow internal paths (blocks open-redirects) and never loop back into /auth.
  const redirectTarget = (() => {
    const raw = searchParams.get("next") || searchParams.get("redirect") || "";
    if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/auth")) return "/";
    return raw;
  })();
  const nextQuery = redirectTarget !== "/" ? `?next=${encodeURIComponent(redirectTarget)}` : "";

  // Role-based landing page after sign-in:
  //   admin → admin home, host → host home, guest → last page (or home)
  const destinationFor = (user?: { role?: string; roles?: string[] } | null) => {
    const roles = user?.roles ?? (user?.role ? [user.role] : []);
    if (roles.includes("admin")) return "/admin";
    if (roles.includes("host")) return "/host";
    return redirectTarget;
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [secs, setSecs] = useState(59);

  // Reset state
  const [resetStep, setResetStep] = useState(1);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Email verification state
  const queryEmail = searchParams.get("email") || "";
  const queryToken = searchParams.get("token") || "";
  const queryCode = searchParams.get("code") || "";
  const [verifyEmailAddress, setVerifyEmailAddress] = useState(queryEmail);
  const [verifyOtp, setVerifyOtp] = useState(["", "", "", "", "", ""]);
  const [verifySecs, setVerifySecs] = useState(59);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailEditValue, setEmailEditValue] = useState(queryEmail);

  useEffect(() => {
    if (queryEmail) {
      setVerifyEmailAddress(queryEmail);
      setEmailEditValue(queryEmail);
    }
  }, [queryEmail]);

  useEffect(() => {
    if (activeTab === "otp" && secs > 0) {
      const timer = setInterval(() => setSecs((s) => s - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [activeTab, secs]);

  useEffect(() => {
    if (activeTab === "verify-email" && verifySecs > 0) {
      const timer = setInterval(() => setVerifySecs((s) => s - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [activeTab, verifySecs]);

  // Auto-verify if token or 6-digit code is provided in query params
  useEffect(() => {
    if (activeTab === "verify-email") {
      if (queryToken) {
        handleVerifyEmailSubmit(undefined, queryToken);
      } else if (queryCode && queryCode.length === 6) {
        setVerifyOtp(queryCode.split(""));
        handleVerifyEmailSubmit(undefined, undefined, queryCode);
      }
    }
  }, [activeTab, queryToken, queryCode]);

  const handleOtpChange = (index: number, val: string, fieldId: string) => {
    if (fieldId === "verifyEmail") {
      const current = [...verifyOtp];
      current[index] = val;
      setVerifyOtp(current);
      // Auto submit when 6th digit entered
      if (val && index === 5 && current.every((d) => d !== "")) {
        setTimeout(() => {
          handleVerifyEmailSubmit(undefined, undefined, current.join(""));
        }, 150);
      }
    } else if (fieldId === "otp") {
      const current = [...otp];
      current[index] = val;
      setOtp(current);
    } else {
      const current = [...resetOtp];
      current[index] = val;
      setResetOtp(current);
    }

    if (val && index < 5) {
      const nextInput = document.getElementById(`${fieldId}-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    fieldId: string,
  ) => {
    const current =
      fieldId === "verifyEmail"
        ? verifyOtp
        : fieldId === "otp"
          ? otp
          : resetOtp;

    if (e.key === "Backspace" && !current[index] && index > 0) {
      const prevInput = document.getElementById(`${fieldId}-${index - 1}`);
      prevInput?.focus();
    }
  };

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem < 10 ? "0" : ""}${rem}`;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const { user } = await authApi.login({ email, password });
      setUser(user);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      router.replace(destinationFor(user));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Please enter your first and last name.");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }
    if (!password.trim() || password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (!agreeTerms) {
      toast.error("You must agree to the Terms of Service.");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.register({
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        password,
        phone: `+260${phone.trim().replace(/\s/g, "")}`,
      });
      if (res.user) {
        setUser(res.user);
      }
      toast.success("Account created! Please verify your email.");
      const nextParam = redirectTarget !== "/" ? `&next=${encodeURIComponent(redirectTarget)}` : "";
      router.push(`/auth/verify-email?email=${encodeURIComponent(email.trim())}${nextParam}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetStep === 1) {
      if (!resetEmail) {
        toast.error("Please enter your email.");
        return;
      }
      setLoading(true);
      try {
        await authApi.forgotPassword(resetEmail);
        toast.success("Reset link sent! Check your inbox.");
        setResetStep(2);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    } else if (resetStep === 2) {
      const code = resetOtp.join("");
      if (code.length < 6) {
        toast.error("Please enter the 6-digit code.");
        return;
      }
      setLoading(true);
      try {
        await authApi.verifyOtp({ email: resetEmail, otp: code });
        toast.success("Code verified! Set your new password.");
        setResetStep(3);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Invalid or expired code.");
      } finally {
        setLoading(false);
      }
    } else {
      if (!newPassword || newPassword.length < 6) {
        toast.error("Password must be at least 6 characters.");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
      setLoading(true);
      try {
        await authApi.resetPassword({
          email: resetEmail,
          otp: resetOtp.join(""),
          newPassword,
        });
        toast.success("Password reset! Please sign in.");
        setTimeout(() => router.push(`/auth/login${nextQuery}`), 800);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to reset password.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyEmailSubmit = async (
    e?: React.FormEvent,
    customToken?: string,
    customCode?: string,
  ) => {
    if (e) e.preventDefault();
    const tokenToUse = customToken || searchParams.get("token") || undefined;
    const codeToUse = customCode || verifyOtp.join("") || undefined;

    if (!tokenToUse && (!codeToUse || codeToUse.length < 6)) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }
    if (!verifyEmailAddress.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.verifyEmail({
        email: verifyEmailAddress.trim(),
        code: codeToUse,
        token: tokenToUse,
      });

      if (res.user) {
        setUser(res.user);
      }
      toast.success("Email verified successfully! Welcome to Nearby Escapes.");
      router.replace(destinationFor(res.user));
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Verification failed. The code may be invalid or expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!verifyEmailAddress.trim()) {
      toast.error("Please provide an email address.");
      return;
    }
    try {
      await authApi.resendVerificationEmail({ email: verifyEmailAddress.trim() });
      setVerifySecs(59);
      toast.success("Verification code re-sent! Please check your inbox.");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Could not resend verification code. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbfafc] font-sans relative overflow-hidden">
      {/* Subtle modern ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#6b2bb8]/5 via-[#ffca28]/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-0 w-[400px] h-[400px] bg-[#6b2bb8]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-center">
        <Link href="/" className="flex items-center gap-1.5 no-underline group">
          <span className="text-2xl font-bold text-neutral-900 tracking-tight">Nearby</span>
          <span className="font-script text-[#6b2bb8] text-[1.45em] leading-none transition-transform group-hover:scale-105">
            Escapes
          </span>
        </Link>
      </header>

      {/* Centered Unified Card Container (No Desktop Split) */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-6 md:py-10">
        <div className="w-full max-w-[480px]">
          {/* Main Card */}
          <div className="bg-white rounded-3xl border border-black/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-7 sm:p-9">
            {/* Quick Segment Switcher (Login / Register) */}
            {(activeTab === "login" || activeTab === "register") && (
              <div className="grid grid-cols-2 p-1 bg-black/[0.04] rounded-2xl mb-7">
                <button
                  type="button"
                  onClick={() => router.push(`/auth/login${nextQuery}`)}
                  className={cn(
                    "py-2 text-sm font-bold rounded-xl transition-all duration-200",
                    activeTab === "login"
                      ? "bg-white text-black shadow-sm"
                      : "text-neutral-500 hover:text-neutral-900",
                  )}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/auth/register${nextQuery}`)}
                  className={cn(
                    "py-2 text-sm font-bold rounded-xl transition-all duration-200",
                    activeTab === "register"
                      ? "bg-white text-black shadow-sm"
                      : "text-neutral-500 hover:text-neutral-900",
                  )}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* 1. LOGIN TAB */}
            {activeTab === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                    Welcome back
                  </h1>
                  <p className="text-sm text-neutral-500 mt-1">
                    Sign in to manage your bookings and saved escapes
                  </p>
                </div>

                <div className="space-y-1.5">
                  <FieldLabel>Email address</FieldLabel>
                  <InputField
                    icon={Mail}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <FieldLabel>Password</FieldLabel>
                    <Link
                      href="/auth/reset"
                      className="text-xs font-semibold text-[#6b2bb8] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <InputField
                    icon={Lock}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    rightSlot={
                      <EyeToggle
                        show={showPassword}
                        onToggle={() => setShowPassword(!showPassword)}
                      />
                    }
                  />
                </div>

                <div className="pt-2">
                  <SubmitButton loading={loading}>Sign In</SubmitButton>
                </div>

                <div className="pt-2 text-center text-xs text-neutral-500">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push(`/auth/register${nextQuery}`)}
                    className="font-bold text-[#6b2bb8] hover:underline"
                  >
                    Sign up now
                  </button>
                </div>
              </form>
            )}

            {/* 2. REGISTER TAB */}
            {activeTab === "register" && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="mb-5">
                  <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                    Join Nearby Escapes
                  </h1>
                  <p className="text-sm text-neutral-500 mt-1">
                    Create an account to book stays, tours & transfers across Zambia
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <FieldLabel>First name</FieldLabel>
                    <InputField
                      type="text"
                      placeholder="Thandeka"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel>Last name</FieldLabel>
                    <InputField
                      type="text"
                      placeholder="Mwale"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="family-name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <FieldLabel>Email address</FieldLabel>
                  <InputField
                    icon={Mail}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <FieldLabel>Phone number</FieldLabel>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 px-3 py-3 rounded-xl border border-black/[0.12] bg-neutral-50 text-xs font-bold text-neutral-700 shrink-0">
                      🇿🇲 +260
                    </div>
                    <InputField
                      icon={Phone}
                      type="tel"
                      placeholder="97 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <FieldLabel>Create password</FieldLabel>
                  <InputField
                    icon={Lock}
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    rightSlot={
                      <EyeToggle
                        show={showPassword}
                        onToggle={() => setShowPassword(!showPassword)}
                      />
                    }
                  />
                  {password && <PasswordStrength password={password} />}
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(v) => setAgreeTerms(!!v)}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="terms"
                    className="text-xs text-neutral-500 font-normal leading-relaxed cursor-pointer"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#6b2bb8] underline font-medium">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#6b2bb8] underline font-medium">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <div className="pt-2">
                  <SubmitButton loading={loading}>Create Account</SubmitButton>
                </div>

                <div className="pt-1 text-center text-xs text-neutral-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push(`/auth/login${nextQuery}`)}
                    className="font-bold text-[#6b2bb8] hover:underline"
                  >
                    Sign in
                  </button>
                </div>

                <div className="pt-3 text-center text-xs text-neutral-500 border-t border-black/[0.06] mt-2">
                  Looking to list your property, tour, or transfer?{" "}
                  <Link
                    href="/become-host"
                    className="font-bold text-[#6b2bb8] hover:underline inline-flex items-center gap-0.5"
                  >
                    Become a Host
                  </Link>
                </div>
              </form>
            )}

            {/* 3. OTP TAB */}
            {activeTab === "otp" && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const code = otp.join("");
                  if (code.length < 6) {
                    toast.error("Please enter the complete 6-digit code.");
                    return;
                  }
                  setLoading(true);
                  try {
                    const fullPhone = phone.startsWith("+260") ? phone : `+260${phone.replace(/\s/g, "")}`;
                    const res = await authApi.verifyOtp({ phone: fullPhone, otp: code });
                    if (res.user) {
                      setUser(res.user);
                    }
                    toast.success("Verification successful! Logging you in...");
                    router.replace(destinationFor(res.user));
                  } catch (err: any) {
                    toast.error(err.response?.data?.message || "Invalid or expired verification code.");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="space-y-6 text-center"
              >
                <div>
                  <div className="h-14 w-14 rounded-2xl bg-[#6b2bb8]/10 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-6 w-6 text-[#6b2bb8]" weight="regular" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                    Verify phone number
                  </h2>
                  <p className="text-xs text-neutral-500 mt-2 leading-relaxed max-w-xs mx-auto">
                    We sent a 6-digit code to{" "}
                    <strong className="text-neutral-900 font-bold">
                      +260 {phone || "97 ••• ••34"}
                    </strong>
                    . Expires in 10 minutes.
                  </p>
                </div>

                <OtpInputs
                  value={otp}
                  onChange={(i, v) => handleOtpChange(i, v, "otp")}
                  onKeyDown={(i, e) => handleOtpKeyDown(i, e, "otp")}
                  fieldId="otp"
                />

                <div className="text-xs text-neutral-500">
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const fullPhone = phone.startsWith("+260") ? phone : `+260${phone.replace(/\s/g, "")}`;
                        await authApi.sendOtp({ phone: fullPhone });
                        setSecs(59);
                        toast.success("Verification code re-sent.");
                      } catch {
                        toast.error("Could not resend code. Please try again.");
                      }
                    }}
                    className="font-bold text-[#6b2bb8] hover:underline cursor-pointer"
                  >
                    Resend code
                  </button>{" "}
                  · <span className="font-bold text-neutral-700">{formatTimer(secs)}</span>
                </div>

                <SubmitButton loading={loading}>Verify & Continue</SubmitButton>

                <button
                  type="button"
                  onClick={() => router.push(`/auth/register${nextQuery}`)}
                  className="text-xs text-neutral-500 hover:text-neutral-900 font-semibold flex items-center justify-center gap-1 mx-auto transition-colors"
                >
                  <ArrowLeft className="h-3 w-3" /> Change phone number
                </button>
              </form>
            )}

            {/* 4. RESET TAB */}
            {activeTab === "reset" && (
              <form onSubmit={handleResetSubmit} className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                    Reset password
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Follow the steps below to regain access to your account
                  </p>
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-2">
                  {[
                    { num: 1, label: "Email", done: resetStep > 1, active: resetStep === 1 },
                    { num: 2, label: "Verify", done: resetStep > 2, active: resetStep === 2 },
                    { num: 3, label: "New pass", done: false, active: resetStep === 3 },
                  ].map((step, i) => (
                    <Fragment key={step.num}>
                      <div
                        className={cn(
                          "flex items-center gap-1.5 text-xs font-semibold transition-colors",
                          step.done || step.active ? "text-[#6b2bb8]" : "text-neutral-400",
                        )}
                      >
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all",
                            step.done
                              ? "bg-[#6b2bb8] border-[#6b2bb8] text-white"
                              : step.active
                                ? "bg-[#ffca28] border-[#ffca28] text-black"
                                : "bg-white border-neutral-200 text-neutral-400",
                          )}
                        >
                          {step.done ? <Check className="h-3 w-3" /> : step.num}
                        </div>
                        <span>{step.label}</span>
                      </div>
                      {i < 2 && (
                        <div
                          className={cn(
                            "flex-1 h-0.5 rounded transition-colors",
                            step.done ? "bg-[#6b2bb8]" : "bg-neutral-200",
                          )}
                        />
                      )}
                    </Fragment>
                  ))}
                </div>

                {resetStep === 1 && (
                  <div className="space-y-1.5">
                    <FieldLabel>Enter your registered email</FieldLabel>
                    <InputField
                      icon={Mail}
                      type="email"
                      placeholder="you@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                )}

                {resetStep === 2 && (
                  <div className="space-y-3">
                    <FieldLabel>Verification code</FieldLabel>
                    <p className="text-xs text-neutral-500">
                      We sent a 6-digit code to{" "}
                      <strong className="text-neutral-900">{resetEmail}</strong>
                    </p>
                    <OtpInputs
                      value={resetOtp}
                      onChange={(i, v) => handleOtpChange(i, v, "resetOtp")}
                      onKeyDown={(i, e) => handleOtpKeyDown(i, e, "resetOtp")}
                      fieldId="resetOtp"
                    />
                  </div>
                )}

                {resetStep === 3 && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <FieldLabel>New password</FieldLabel>
                      <InputField
                        icon={Lock}
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Create new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                        rightSlot={
                          <EyeToggle
                            show={showNewPassword}
                            onToggle={() => setShowNewPassword(!showNewPassword)}
                          />
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel>Confirm new password</FieldLabel>
                      <InputField
                        icon={Lock}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                        rightSlot={
                          <EyeToggle
                            show={showConfirmPassword}
                            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                          />
                        }
                      />
                    </div>
                  </div>
                )}

                <SubmitButton loading={loading}>
                  {resetStep === 1
                    ? "Send Reset Code"
                    : resetStep === 2
                      ? "Verify Code"
                      : "Save New Password"}
                </SubmitButton>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => router.push(`/auth/login${nextQuery}`)}
                    className="text-xs text-neutral-500 hover:text-neutral-900 font-semibold inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="h-3 w-3" /> Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {/* 5. VERIFY EMAIL TAB */}
            {activeTab === "verify-email" && (
              <form onSubmit={handleVerifyEmailSubmit} className="space-y-6 text-center">
                <div>
                  <div className="h-16 w-16 rounded-2xl bg-[#6b2bb8]/10 text-[#6b2bb8] flex items-center justify-center mx-auto mb-4 relative shadow-sm">
                    <MailCheck className="h-8 w-8" />
                  </div>
                  <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                    Verify your email
                  </h1>
                  <p className="text-xs text-neutral-500 mt-2 leading-relaxed max-w-sm mx-auto">
                    We sent a 6-digit confirmation code to:
                  </p>
                  
                  {isEditingEmail ? (
                    <div className="mt-3 flex items-center gap-2 max-w-xs mx-auto">
                      <InputField
                        type="email"
                        value={emailEditValue}
                        onChange={(e) => setEmailEditValue(e.target.value)}
                        placeholder="you@example.com"
                        className="text-xs py-2"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (emailEditValue.trim()) {
                            setVerifyEmailAddress(emailEditValue.trim());
                            setIsEditingEmail(false);
                            toast.success("Email updated.");
                          }
                        }}
                        className="px-3 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold shrink-0 hover:bg-neutral-800 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center justify-center gap-2">
                      <span className="font-semibold text-neutral-900 text-sm bg-neutral-100 px-3 py-1 rounded-full">
                        {verifyEmailAddress || "your email"}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsEditingEmail(true)}
                        className="text-[11px] font-bold text-[#6b2bb8] hover:underline"
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <FieldLabel>Enter 6-digit code</FieldLabel>
                  <OtpInputs
                    value={verifyOtp}
                    onChange={(i, v) => handleOtpChange(i, v, "verifyEmail")}
                    onKeyDown={(i, e) => handleOtpKeyDown(i, e, "verifyEmail")}
                    fieldId="verifyEmail"
                  />
                </div>

                <div className="text-xs text-neutral-500">
                  Didn&apos;t receive the code?{" "}
                  {verifySecs > 0 ? (
                    <span className="font-semibold text-neutral-600">
                      Resend in <span className="font-bold text-neutral-900">{formatTimer(verifySecs)}</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      className="font-bold text-[#6b2bb8] hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3" /> Resend code
                    </button>
                  )}
                </div>

                <SubmitButton loading={loading}>Verify Email</SubmitButton>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => router.push(`/auth/login${nextQuery}`)}
                    className="text-xs text-neutral-500 hover:text-neutral-900 font-semibold inline-flex items-center justify-center gap-1 transition-colors"
                  >
                    <ArrowLeft className="h-3 w-3" /> Return to Sign In
                  </button>
                  <p className="text-[11px] text-neutral-400">
                    Need help?{" "}
                    <Link href="/help" className="text-[#6b2bb8] hover:underline">
                      Contact Support
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Global Bottom Footer */}
      <footer className="relative z-10 w-full py-6 text-center text-xs text-neutral-400">
        <div className="flex items-center justify-center gap-5 mb-2 font-medium">
          <Link href="/terms" className="hover:text-neutral-700 transition-colors">
            Terms of Service
          </Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-neutral-700 transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/help" className="hover:text-neutral-700 transition-colors">
            Help Center
          </Link>
        </div>
        <p>© 2026 Nearby Escapes Zambia. All rights reserved.</p>
      </footer>
    </div>
  );
}
