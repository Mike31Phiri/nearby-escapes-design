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
  Backpack,
  Home,
  ChevronDown,
  Loader2,
  Phone,
} from "lucide-react";
import { EnvelopeSimple as MessageSquare } from "@phosphor-icons/react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store/authStore";
import * as authApi from "@/lib/api/auth";
import { cn } from "@/lib/utils";

interface AuthPageViewProps {
  defaultTab?: "login" | "register" | "otp" | "reset";
}

//Shared hero section

function AuthHero({
  eyebrow,
  headline,
  sub,
}: {
  eyebrow: string;
  headline: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
      <Link
        href="/"
        className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-1.5 no-underline z-10"
      >
        <span className="text-xl font-semibold text-white tracking-tight">Nearby</span>
        <span className="font-script text-purple text-[1.3em] leading-none">Escapes</span>
      </Link>
      <div className="max-w-lg">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#D4AF37] mb-2">
          {eyebrow}
        </p>
        <h1 className="font-display text-[1.75rem] md:text-[2.75rem] lg:text-[3rem] font-bold text-white leading-[1.15] tracking-tight">
          {headline}
        </h1>
        {sub && <p className="text-base text-white/60 mt-1.5 leading-relaxed max-w-md">{sub}</p>}
      </div>
    </div>
  );
}

// Password strength

function PasswordStrength({ password }: { password: string }) {
  const getStrength = (val: string) => {
    if (!val)
      return { score: 0, label: "Enter a password", color: "text-gray-400", bar: "bg-gray-200" };
    if (val.length < 6)
      return { score: 1, label: "Too short", color: "text-rose-500", bar: "bg-rose-500" };
    if (val.length < 8)
      return { score: 2, label: "Weak", color: "text-amber-500", bar: "bg-amber-500" };
    if (val.length < 12)
      return { score: 3, label: "Good", color: "text-emerald-600", bar: "bg-emerald-600" };
    return { score: 4, label: "Strong ✓", color: "text-emerald-600", bar: "bg-emerald-600" };
  };
  const strength = getStrength(password);
  return (
    <div className="mt-2.5">
      <div className="flex gap-1.5 mb-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i <= strength.score ? strength.bar : "bg-gray-200",
            )}
          />
        ))}
      </div>
      <p className={cn("text-[11px] font-semibold", strength.color)}>{strength.label}</p>
    </div>
  );
}

//  OTP inputs

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
    <div className="flex gap-3 justify-center">
      {value.map((digit, idx) => (
        <input
          key={idx}
          id={`${fieldId}-${idx}`}
          className={cn(
            "w-12 h-14 md:w-14 md:h-16 rounded-xl border-2 text-center text-xl md:text-2xl font-bold text-[#1A0B2E] font-display bg-white outline-none transition-all duration-200",
            digit
              ? "border-[#D4AF37] bg-[#D4AF37]/5"
              : "border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10",
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

//  Submit button

function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3.5 bg-[#1A0B2E] hover:bg-[#2E154A] disabled:opacity-60 disabled:cursor-not-allowed text-white text-base font-bold uppercase tracking-wider rounded-xl transition-all duration-200 shadow-lg shadow-[#1A0B2E]/20 active:scale-[0.98] flex items-center justify-center gap-2"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

// ─── Main Auth Component ──────────────────────────────────────────────────────

export function AuthPageView({ defaultTab = "login" }: AuthPageViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);

  const activeTab = defaultTab;
  const redirectTarget = searchParams.get("next") || "/";

  // Shared
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Register
  const [role, setRole] = useState<"guest" | "host">("guest");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [dealsAlerts, setDealsAlerts] = useState(false);

  // OTP
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [secs, setSecs] = useState(522);

  // Reset
  const [resetStep, setResetStep] = useState<1 | 2 | 3>(1);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState<string[]>(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (activeTab !== "otp") return;
    const timer = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [activeTab]);

  const formatTimer = (time: number) => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const handleOtpChange = (index: number, val: string, field: "otp" | "resetOtp") => {
    const target = field === "otp" ? otp : resetOtp;
    const setTarget = field === "otp" ? setOtp : setResetOtp;
    const next = [...target];
    next[index] = val;
    setTarget(next);
    if (val && index < 5) {
      document.getElementById(`${field}-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    field: "otp" | "resetOtp",
  ) => {
    const target = field === "otp" ? otp : resetOtp;
    const setTarget = field === "otp" ? setOtp : setResetOtp;
    if (e.key === "Backspace" && !target[index] && index > 0) {
      const next = [...target];
      next[index - 1] = "";
      setTarget(next);
      document.getElementById(`${field}-${index - 1}`)?.focus();
    }
  };

  //  Login

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
      // Route based on role
      const dest =
        user.role === "host"
          ? "/host"
          : user.role === "admin"
            ? "/admin/dashboard"
            : redirectTarget === "/"
              ? "/profile"
              : redirectTarget;
      setTimeout(() => router.push(dest), 600);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Register ───────────────────────────────────────────────────────────────

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
      const { user } = await authApi.register({
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        password,
        phone: `+260${phone.trim().replace(/\s/g, "")}`,
        role,
      });
      setUser(user);
      toast.success("Account created! Welcome to Nearby Escapes.");
      const dest = role === "host" ? "/host" : "/profile";
      setTimeout(() => router.push(dest), 600);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Reset ──────────────────────────────────────────────────────────────────

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
      if (resetOtp.join("").length < 6) {
        toast.error("Please enter the 6-digit code.");
        return;
      }
      toast.success("Code verified! Set your new password.");
      setResetStep(3);
    } else {
      if (!newPassword || newPassword.length < 6) {
        toast.error("Password must be at least 6 characters.");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
      toast.success("Password reset! Please sign in.");
      setTimeout(() => router.push("/auth/login"), 800);
    }
  };

  //  Hero content

  const heroContent = {
    login: {
      eyebrow: "Welcome back",
      headline: (
        <>
          Your next <em className="text-[#D4AF37] not-italic">escape</em> is waiting
        </>
      ),
      sub: "Sign in to manage your bookings, saved lodges, and upcoming trips.",
    },
    register: {
      eyebrow: "Join free today",
      headline: (
        <>
          Find your <em className="text-[#D4AF37] not-italic">hidden gem</em>
        </>
      ),
    },
    otp: {
      eyebrow: "Almost there",
      headline: (
        <>
          Verify your <em className="text-[#D4AF37] not-italic">number</em>
        </>
      ),
    },
    reset: {
      eyebrow: "Account recovery",
      headline: (
        <>
          Reset your <em className="text-[#D4AF37] not-italic">password</em>
        </>
      ),
    },
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans flex flex-col">
      {/* COVER HERO */}
      <div className="relative h-[220px] md:h-[260px] w-full overflow-hidden bg-gradient-to-br from-[#1A0B2E] via-[#2E154A] to-[#3A1A5A]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0B2E] via-[#1A0B2E]/60 to-transparent" />
        <AuthHero {...heroContent[activeTab]} />
      </div>

      {/* FORM PANEL */}
      <div className="flex-1 flex flex-col bg-[#FDFBF7]">
        <div className="flex-1 px-5 md:px-8 py-6 md:py-8">
          <div className="w-full max-w-lg mx-auto">
            {/* ── LOGIN ─────────────────────────────────────────────────── */}
            {activeTab === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-[#1A0B2E] font-display tracking-tight">
                    Sign in
                  </h2>
                  <p className="text-base text-[#64748B] mt-1">Welcome back to Nearby Escapes</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-base font-medium text-[#1A0B2E] font-display outline-none transition-all focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 placeholder:text-gray-400"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-white text-base font-medium text-[#1A0B2E] font-display outline-none transition-all focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 placeholder:text-gray-400"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="text-right mt-1">
                    <button
                      type="button"
                      onClick={() => router.push("/auth/reset")}
                      className="text-[11px] font-bold text-[#1A0B2E] hover:text-[#D4AF37] transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="remember-me"
                    className="rounded border-gray-300 data-[state=checked]:bg-[#1A0B2E] data-[state=checked]:border-[#1A0B2E]"
                  />
                  <Label
                    htmlFor="remember-me"
                    className="text-sm text-gray-600 cursor-pointer select-none"
                  >
                    Keep me signed in on this device
                  </Label>
                </div>

                <SubmitButton loading={loading}>Sign in</SubmitButton>

                <p className="text-center text-base text-[#64748B]">
                  New to Nearby Escapes?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/auth/register")}
                    className="font-bold text-[#1A0B2E] hover:text-[#D4AF37] transition-colors"
                  >
                    Create a free account →
                  </button>
                </p>
              </form>
            )}

            {/* REGISTER */}
            {activeTab === "register" && (
              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-[#1A0B2E] font-display tracking-tight">
                    Create your account
                  </h2>
                  <p className="text-base text-[#64748B] mt-1">Join the community of explorers</p>
                </div>

                {/* Role selector */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                    I am a
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("guest")}
                      className={cn(
                        "flex flex-col items-center gap-1.5 py-3.5 rounded-xl border-2 transition-all duration-200",
                        role === "guest"
                          ? "border-[#D4AF37] bg-[#D4AF37]/5 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300",
                      )}
                    >
                      <Backpack
                        className={cn(
                          "h-5 w-5",
                          role === "guest" ? "text-[#D4AF37]" : "text-gray-400",
                        )}
                      />
                      <span className="text-sm font-bold text-[#1A0B2E] font-display">Guest</span>
                      <span className="text-[9px] text-[#64748B]">Find &amp; book escapes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("host")}
                      className={cn(
                        "flex flex-col items-center gap-1.5 py-3.5 rounded-xl border-2 transition-all duration-200",
                        role === "host"
                          ? "border-[#D4AF37] bg-[#D4AF37]/5 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300",
                      )}
                    >
                      <Home
                        className={cn(
                          "h-5 w-5",
                          role === "host" ? "text-[#D4AF37]" : "text-gray-400",
                        )}
                      />
                      <span className="text-sm font-bold text-[#1A0B2E] font-display">
                        Local host
                      </span>
                      <span className="text-[9px] text-[#64748B]">List your property</span>
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                      First name
                    </Label>
                    <input
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-base font-medium text-[#1A0B2E] font-display outline-none transition-all focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 placeholder:text-gray-400"
                      type="text"
                      placeholder="Thandeka"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                      Last name
                    </Label>
                    <input
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-base font-medium text-[#1A0B2E] font-display outline-none transition-all focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 placeholder:text-gray-400"
                      type="text"
                      placeholder="Mwale"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="family-name"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-base font-medium text-[#1A0B2E] font-display outline-none transition-all focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 placeholder:text-gray-400"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                    Phone number
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl border border-gray-200 bg-white text-base font-semibold text-gray-700 shrink-0">
                      🇿🇲 +260
                      <ChevronDown className="h-3 w-3 text-gray-400" />
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-base font-medium text-[#1A0B2E] font-display outline-none transition-all focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 placeholder:text-gray-400"
                        type="tel"
                        placeholder="97 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        autoComplete="tel"
                        required
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    We&apos;ll send booking confirmations here
                  </p>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-white text-base font-medium text-[#1A0B2E] font-display outline-none transition-all focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 placeholder:text-gray-400"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {password && <PasswordStrength password={password} />}
                </div>

                {/* Agreements */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="agree-terms"
                    checked={agreeTerms}
                    onCheckedChange={(c) => setAgreeTerms(!!c)}
                    className="rounded border-gray-300 data-[state=checked]:bg-[#1A0B2E] data-[state=checked]:border-[#1A0B2E] mt-0.5"
                  />
                  <Label
                    htmlFor="agree-terms"
                    className="text-sm text-gray-600 cursor-pointer select-none leading-relaxed"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="font-bold text-[#1A0B2E] hover:text-[#D4AF37] transition-colors"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="font-bold text-[#1A0B2E] hover:text-[#D4AF37] transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="deals-alerts"
                    checked={dealsAlerts}
                    onCheckedChange={(c) => setDealsAlerts(!!c)}
                    className="rounded border-gray-300 data-[state=checked]:bg-[#1A0B2E] data-[state=checked]:border-[#1A0B2E] mt-0.5"
                  />
                  <Label
                    htmlFor="deals-alerts"
                    className="text-sm text-gray-600 cursor-pointer select-none leading-relaxed"
                  >
                    Send me deals and hidden gem alerts for my area
                  </Label>
                </div>

                <SubmitButton loading={loading}>Create my account</SubmitButton>

                <p className="text-center text-base text-[#64748B]">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/auth/login")}
                    className="font-bold text-[#1A0B2E] hover:text-[#D4AF37] transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}

            {/* ── OTP ───────────────────────────────────────────────────── */}
            {activeTab === "otp" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (otp.join("").length < 6) {
                    toast.error("Please enter the complete 6-digit code.");
                    return;
                  }
                  toast.success("Verification successful! Logging you in...");
                  setTimeout(() => router.push(role === "host" ? "/host" : "/profile"), 800);
                }}
                className="space-y-6 text-center"
              >
                <div>
                  <div className="h-16 w-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-5">
                    <MessageSquare className="h-7 w-7 text-[#D4AF37]" weight="regular" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#1A0B2E] font-display tracking-tight">
                    Check your messages
                  </h2>
                  <p className="text-base text-[#64748B] mt-2 leading-relaxed">
                    We sent a 6-digit code to{" "}
                    <strong className="text-[#1A0B2E] font-display">
                      +260 {phone || "97 ••• ••34"}
                    </strong>
                    .
                    <br />
                    It expires in 10 minutes.
                  </p>
                </div>

                <OtpInputs
                  value={otp}
                  onChange={(i, v) => handleOtpChange(i, v, "otp")}
                  onKeyDown={(i, e) => handleOtpKeyDown(i, e, "otp")}
                  fieldId="otp"
                />

                <div className="text-base text-[#64748B]">
                  Didn&apos;t get it?{" "}
                  <button
                    type="button"
                    onClick={() => toast.info("Verification code re-sent.")}
                    className="font-bold text-[#1A0B2E] hover:text-[#D4AF37] transition-colors"
                  >
                    Resend code
                  </button>{" "}
                  · <span className="font-bold text-gray-700">{formatTimer(secs)}</span>
                </div>

                <SubmitButton loading={false}>Verify &amp; continue</SubmitButton>

                <button
                  type="button"
                  onClick={() => router.push("/auth/register")}
                  className="text-sm text-[#64748B] hover:text-gray-700 font-semibold flex items-center justify-center gap-1.5 transition-colors mx-auto"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Change number
                </button>
              </form>
            )}

            {/* ── RESET PASSWORD ────────────────────────────────────────── */}
            {activeTab === "reset" && (
              <form onSubmit={handleResetSubmit} className="space-y-6">
                <div className="mb-2">
                  <h2 className="text-xl font-bold text-[#1A0B2E] font-display tracking-tight">
                    Reset password
                  </h2>
                  <p className="text-base text-[#64748B] mt-1">We&apos;ll help you regain access</p>
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-2">
                  {[
                    { num: 1, label: "Email", done: resetStep > 1, active: resetStep === 1 },
                    { num: 2, label: "Verify", done: resetStep > 2, active: resetStep === 2 },
                    { num: 3, label: "New password", done: false, active: resetStep === 3 },
                  ].map((step, i) => (
                    <Fragment key={step.num}>
                      <div
                        className={cn(
                          "flex items-center gap-1.5 text-sm font-semibold transition-colors",
                          step.done
                            ? "text-[#D4AF37]"
                            : step.active
                              ? "text-[#1A0B2E]"
                              : "text-gray-400",
                        )}
                      >
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all",
                            step.done
                              ? "bg-[#D4AF37] border-[#D4AF37] text-white"
                              : step.active
                                ? "bg-[#1A0B2E] border-[#1A0B2E] text-white"
                                : "bg-white border-gray-300 text-gray-400",
                          )}
                        >
                          {step.done ? <Check className="h-3 w-3" /> : step.num}
                        </div>
                        <span className="hidden sm:inline">{step.label}</span>
                      </div>
                      {i < 2 && (
                        <div
                          className={cn(
                            "flex-1 h-0.5 rounded transition-colors",
                            step.done ? "bg-[#D4AF37]" : "bg-gray-200",
                          )}
                        />
                      )}
                    </Fragment>
                  ))}
                </div>

                {resetStep === 1 && (
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                      Enter your email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-base font-medium text-[#1A0B2E] font-display outline-none transition-all focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 placeholder:text-gray-400"
                        type="email"
                        placeholder="you@example.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                {resetStep === 2 && (
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                      Verification code
                    </Label>
                    <p className="text-sm text-[#64748B]">
                      We sent a code to{" "}
                      <strong className="text-[#1A0B2E] font-display">{resetEmail}</strong>
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
                  <>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                        New password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-white text-base font-medium text-[#1A0B2E] font-display outline-none transition-all focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 placeholder:text-gray-400"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Create new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          autoComplete="new-password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {newPassword && <PasswordStrength password={newPassword} />}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                        Confirm new password
                      </Label>
                      <input
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-base font-medium text-[#1A0B2E] font-display outline-none transition-all focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 placeholder:text-gray-400"
                        type="password"
                        placeholder="Repeat new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                      />
                    </div>
                  </>
                )}

                <SubmitButton loading={loading}>
                  {resetStep === 1
                    ? "Send Reset Link"
                    : resetStep === 2
                      ? "Verify Code"
                      : "Set new password"}
                </SubmitButton>

                <p className="text-center text-base text-[#64748B]">
                  Remembered it?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/auth/login")}
                    className="font-bold text-[#1A0B2E] hover:text-[#D4AF37] transition-colors"
                  >
                    Back to sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        <AuthTrustStrip />
      </div>
    </div>
  );
}
