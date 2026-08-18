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

// Password strength
function PasswordStrength({ password }: { password: string }) {
  const getStrength = (val: string) => {
    if (!val)
      return {
        score: 0,
        label: "Enter a password",
        color: "text-black-faint",
        bar: "bg-purple-border",
      };
    if (val.length < 6)
      return { score: 1, label: "Too short", color: "text-red-500", bar: "bg-red-400" };
    if (val.length < 8) return { score: 2, label: "Weak", color: "text-gold", bar: "bg-gold" };
    if (val.length < 12) return { score: 3, label: "Good", color: "text-purple", bar: "bg-purple" };
    return { score: 4, label: "Strong", color: "text-purple", bar: "bg-purple" };
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
              i <= strength.score ? strength.bar : "bg-purple-border",
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
    <div className="flex gap-3 justify-center">
      {value.map((digit, idx) => (
        <input
          key={idx}
          id={`${fieldId}-${idx}`}
          className={cn(
            "w-12 h-14 md:w-14 md:h-16 rounded-2xl border-2 text-center text-xl md:text-2xl font-bold text-black font-sans bg-white outline-none transition-all duration-200",
            digit
              ? "border-purple bg-gold/5"
              : "border-purple-border focus:border-purple focus:ring-2 focus:ring-purple/10",
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
      className="w-full py-3.5 bg-gold hover:bg-gold-hover disabled:opacity-60 disabled:cursor-not-allowed text-black text-[15px] font-bold rounded-full transition-all duration-200 shadow-md flex items-center justify-center gap-2"
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
          "w-full py-3 rounded-xl border border-purple-border bg-white text-[15px] font-medium text-black outline-none transition-all focus:border-purple focus:ring-2 focus:ring-purple/10 placeholder:text-black-faint",
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

// Left brand panel
const heroContent = {
  login: {
    eyebrow: "Welcome back",
    headline: "Your next escape\nis waiting",
    sub: "Sign in to manage your bookings, saved lodges, and upcoming trips.",
  },
  register: {
    eyebrow: "Join free today",
    headline: "Find your\nhidden gem",
    sub: "Create an account and start discovering Zambia's best kept secrets.",
  },
  otp: {
    eyebrow: "Almost there",
    headline: "Verify your\nnumber",
    sub: "Enter the 6-digit code we sent to your phone to continue.",
  },
  reset: {
    eyebrow: "Account recovery",
    headline: "Reset your\npassword",
    sub: "We'll help you get back into your account in just a few steps.",
  },
};

function BrandPanel({ tab }: { tab: "login" | "register" | "otp" | "reset" }) {
  const c = heroContent[tab];
  return (
    <div className="hidden lg:flex lg:w-[44%] xl:w-[40%] bg-purple-deep flex-col justify-between p-10 xl:p-14 relative overflow-hidden shrink-0">
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-purple/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-gold/10 blur-2xl pointer-events-none" />

      <Link href="/" className="flex items-center gap-1.5 no-underline z-10 w-max">
        <span className="text-xl font-semibold text-white tracking-tight">Nearby</span>
        <span className="font-script text-purple text-[1.3em] leading-none">Escapes</span>
      </Link>

      <div className="relative z-10 mt-auto">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gold mb-3">
          {c.eyebrow}
        </p>
        <h1 className="font-sans text-[2.5rem] xl:text-[3rem] font-bold text-white leading-[1.15] tracking-tight whitespace-pre-line">
          {c.headline}
        </h1>
        <p className="text-base text-white/60 mt-3 leading-relaxed max-w-sm">{c.sub}</p>
      </div>

      <div className="relative z-10 mt-10 flex flex-col gap-2.5">
        {["SSL encrypted & secure", "No credit card required", "Cancel anytime"].map((item) => (
          <div key={item} className="flex items-center gap-2.5">
            <div className="h-5 w-5 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
              <Check className="h-3 w-3 text-gold" strokeWidth={2.5} />
            </div>
            <span className="text-sm text-white/70">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Eye toggle
function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="text-black-faint hover:text-black-soft transition-colors"
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
  const redirectTarget = searchParams.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [role, setRole] = useState<"guest" | "host">("guest");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [dealsAlerts, setDealsAlerts] = useState(false);

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [secs, setSecs] = useState(522);

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
    if (val && index < 5) document.getElementById(`${field}-${index + 1}`)?.focus();
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
      toast.success(`Welcome back, ${user.name.split("")[0]}!`);
      const dest = user.roles?.includes("host")
        ? "/host"
        : user.roles?.includes("admin")
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
      setTimeout(() => router.push(role === "host" ? "/host" : "/profile"), 600);
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

  return (
    <div className="min-h-screen flex bg-white font-sans">
      <BrandPanel tab={activeTab} />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile logo bar */}
        <div className="lg:hidden flex items-center px-5 py-4 border-b border-purple-border">
          <Link href="/" className="flex items-center gap-1.5 no-underline">
            <span className="text-[18px] font-semibold text-black tracking-tight">Nearby</span>
            <span className="font-script text-purple font-normal text-[1.3em] leading-none">
              Escapes
            </span>
          </Link>
        </div>

        <div className="flex-1 flex items-start lg:items-center justify-center px-5 md:px-10 py-8 lg:py-10 overflow-y-auto">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-black-faint hover:text-black transition-colors mb-6"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to home
            </Link>

            {/* LOGIN */}
            {activeTab === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-black tracking-tight">Sign in</h2>
                  <p className="text-sm text-black-muted mt-1">Welcome back to Nearby Escapes</p>
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
                  <FieldLabel>Password</FieldLabel>
                  <InputField
                    icon={Lock}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
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
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => router.push("/auth/reset")}
                      className="text-[11px] font-bold text-purple hover:text-purple-hover transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="remember-me"
                    className="rounded border-purple-border data-[state=checked]:bg-gold data-[state=checked]:border-purple"
                  />
                  <Label
                    htmlFor="remember-me"
                    className="text-sm text-black-muted cursor-pointer select-none"
                  >
                    Keep me signed in on this device
                  </Label>
                </div>

                <SubmitButton loading={loading}>Sign in</SubmitButton>

                <p className="text-center text-sm text-black-muted">
                  New to Nearby Escapes?{""}
                  <button
                    type="button"
                    onClick={() => router.push("/auth/register")}
                    className="font-bold text-purple hover:text-purple-hover transition-colors"
                  >
                    Create a free account
                  </button>
                </p>
              </form>
            )}

            {/* REGISTER */}
            {activeTab === "register" && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-black tracking-tight">
                    Create your account
                  </h2>
                  <p className="text-sm text-black-muted mt-1">Join the community of explorers</p>
                </div>

                <div className="space-y-1.5">
                  <FieldLabel>I am a</FieldLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        value: "guest" as const,
                        icon: Backpack,
                        label: "Guest",
                        sub: "Find & book escapes",
                      },
                      {
                        value: "host" as const,
                        icon: Home,
                        label: "Local host",
                        sub: "List your property",
                      },
                    ].map(({ value, icon: Icon, label, sub }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRole(value)}
                        className={cn(
                          "flex flex-col items-center gap-1.5 py-3.5 rounded-2xl border-2 transition-all duration-200",
                          role === value
                            ? "border-purple bg-purple-muted shadow-sm"
                            : "border-purple-border bg-white hover:border-purple/40",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5",
                            role === value ? "text-purple" : "text-black-faint",
                          )}
                        />
                        <span className="text-sm font-bold text-black">{label}</span>
                        <span className="text-[10px] text-black-faint">{sub}</span>
                      </button>
                    ))}
                  </div>
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
                    <div className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl border border-purple-border bg-white text-sm font-semibold text-black-soft shrink-0">
                      🇿🇲 +260
                      <ChevronDown className="h-3 w-3 text-black-faint" />
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
                  <p className="text-xs text-black-faint">
                    We&apos;ll send booking confirmations here
                  </p>
                </div>

                <div className="space-y-1.5">
                  <FieldLabel>Password</FieldLabel>
                  <InputField
                    icon={Lock}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
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

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="agree-terms"
                    checked={agreeTerms}
                    onCheckedChange={(c) => setAgreeTerms(!!c)}
                    className="rounded border-purple-border data-[state=checked]:bg-gold data-[state=checked]:border-purple mt-0.5"
                  />
                  <Label
                    htmlFor="agree-terms"
                    className="text-sm text-black-muted cursor-pointer select-none leading-relaxed"
                  >
                    I agree to the{""}
                    <Link
                      href="/terms"
                      className="font-bold text-purple hover:text-purple-hover transition-colors"
                    >
                      Terms of Service
                    </Link>
                    {""}and{""}
                    <Link
                      href="/privacy"
                      className="font-bold text-purple hover:text-purple-hover transition-colors"
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
                    className="rounded border-purple-border data-[state=checked]:bg-gold data-[state=checked]:border-purple mt-0.5"
                  />
                  <Label
                    htmlFor="deals-alerts"
                    className="text-sm text-black-muted cursor-pointer select-none leading-relaxed"
                  >
                    Send me deals and hidden gem alerts for my area
                  </Label>
                </div>

                <SubmitButton loading={loading}>Create my account</SubmitButton>

                <p className="text-center text-sm text-black-muted">
                  Already have an account?{""}
                  <button
                    type="button"
                    onClick={() => router.push("/auth/login")}
                    className="font-bold text-purple hover:text-purple-hover transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}

            {/* OTP */}
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
                  <div className="h-16 w-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-5">
                    <MessageSquare className="h-7 w-7 text-black" weight="regular" />
                  </div>
                  <h2 className="text-2xl font-bold text-black tracking-tight">
                    Check your messages
                  </h2>
                  <p className="text-sm text-black-muted mt-2 leading-relaxed">
                    We sent a 6-digit code to{""}
                    <strong className="text-black font-bold">+260 {phone || "97 ••• ••34"}</strong>.
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

                <div className="text-sm text-black-muted">
                  Didn&apos;t get it?{""}
                  <button
                    type="button"
                    onClick={() => toast.info("Verification code re-sent.")}
                    className="font-bold text-purple hover:text-purple-hover transition-colors"
                  >
                    Resend code
                  </button>
                  {""}· <span className="font-bold text-black-soft">{formatTimer(secs)}</span>
                </div>

                <SubmitButton loading={false}>Verify &amp; continue</SubmitButton>

                <button
                  type="button"
                  onClick={() => router.push("/auth/register")}
                  className="text-sm text-black-faint hover:text-black-soft font-semibold flex items-center justify-center gap-1.5 transition-colors mx-auto"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Change number
                </button>
              </form>
            )}

            {/* RESET */}
            {activeTab === "reset" && (
              <form onSubmit={handleResetSubmit} className="space-y-6">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-black tracking-tight">Reset password</h2>
                  <p className="text-sm text-black-muted mt-1">We&apos;ll help you regain access</p>
                </div>

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
                          step.done || step.active ? "text-purple" : "text-black-faint",
                        )}
                      >
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all",
                            step.done
                              ? "bg-gold border-purple text-black"
                              : step.active
                                ? "bg-purple border-purple text-white"
                                : "bg-white border-purple-border text-black-faint",
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
                            step.done ? "bg-gold" : "bg-purple-border",
                          )}
                        />
                      )}
                    </Fragment>
                  ))}
                </div>

                {resetStep === 1 && (
                  <div className="space-y-1.5">
                    <FieldLabel>Enter your email</FieldLabel>
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
                    <p className="text-sm text-black-muted">
                      We sent a code to{""}
                      <strong className="text-black font-bold">{resetEmail}</strong>
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
                      {newPassword && <PasswordStrength password={newPassword} />}
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel>Confirm new password</FieldLabel>
                      <InputField
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

                <p className="text-center text-sm text-black-muted">
                  Remembered it?{""}
                  <button
                    type="button"
                    onClick={() => router.push("/auth/login")}
                    className="font-bold text-purple hover:text-purple-hover transition-colors"
                  >
                    Back to sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Trust strip */}
        <div className="flex items-center justify-center px-4 py-3 border-t border-purple-border bg-white-warm text-center">
          <p className="text-[11px] font-medium text-black-faint flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-gold shrink-0" />
            By signing in you agree with our{""}
            <Link href="/terms" className="underline hover:text-black transition-colors ml-1">
              T&apos;s and C&apos;s
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
