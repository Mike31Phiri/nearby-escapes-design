"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Trees,
  Tent,
  Smartphone,
  MessageSquare,
  LockKeyhole,
  Check,
  BellRing,
  LockKeyholeOpen,
  Backpack,
  Home,
  BellOff,
  Gift,
  Clock,
  EyeOff as EyeOffIcon,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface AuthPageViewProps {
  defaultTab?: "login" | "register" | "otp" | "reset";
}

export function AuthPageView({ defaultTab = "login" }: AuthPageViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const activeTab = defaultTab;

  const redirectTarget = searchParams.get("next") || "/";

  // Form Field States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register States
  const [role, setRole] = useState<"traveller" | "host">("traveller");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [dealsAlerts, setDealsAlerts] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // OTP Verification States
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [secs, setSecs] = useState(522); // 8:42 countdown timer

  // Password Reset States
  const [resetStep, setResetStep] = useState<1 | 2 | 3>(1);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState<string[]>(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Countdown timer effect for OTP screen
  useEffect(() => {
    if (activeTab !== "otp") return;
    const timer = setInterval(() => {
      setSecs((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTab]);

  const formatTimer = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  // Password strength calculation
  const getPasswordStrength = (val: string) => {
    if (!val) return { score: 0, label: "Enter a password", color: "text-gray-400" };
    if (val.length < 6)
      return { score: 1, label: "Too short", color: "text-rose-500", barClass: "bg-rose-500" };
    if (val.length < 8)
      return { score: 2, label: "Weak", color: "text-amber-500", barClass: "bg-amber-500" };
    if (val.length < 12)
      return { score: 3, label: "Good", color: "text-emerald-600", barClass: "bg-emerald-600" };
    return { score: 4, label: "Strong ✓", color: "text-emerald-600", barClass: "bg-emerald-600" };
  };

  // OTP inputs key shifting
  const handleOtpChange = (index: number, val: string, field: "otp" | "resetOtp") => {
    const cleanVal = val.replace(/[^0-9]/g, "").slice(-1);
    const target = field === "otp" ? otp : resetOtp;
    const setTarget = field === "otp" ? setOtp : setResetOtp;

    const next = [...target];
    next[index] = cleanVal;
    setTarget(next);

    if (cleanVal && index < 5) {
      const nextInput = document.getElementById(`${field}-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    field: "otp" | "resetOtp",
  ) => {
    if (e.key === "Backspace") {
      const target = field === "otp" ? otp : resetOtp;
      const setTarget = field === "otp" ? setOtp : setResetOtp;
      if (!target[index] && index > 0) {
        const prevInput = document.getElementById(`${field}-${index - 1}`) as HTMLInputElement;
        prevInput?.focus();
        const next = [...target];
        next[index - 1] = "";
        setTarget(next);
      }
    }
  };

  // Submit Actions
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter email/phone and password.");
      return;
    }

    login({
      name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
      email: email.toLowerCase(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
      role: "host",
    });

    toast.success("Welcome back! You have successfully signed in.");
    setTimeout(() => {
      router.push(redirectTarget);
    }, 800);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !phone.trim()
    ) {
      toast.error("Please fill in all details.");
      return;
    }
    if (!agreeTerms) {
      toast.error("You must agree to the Terms of Service.");
      return;
    }

    toast.success("Details saved! Please verify your phone number to continue.");
    router.push("/auth/otp");
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }

    const name = firstName ? `${firstName} ${lastName}` : "Sarah Phiri";
    login({
      name,
      email: email || "sarah@example.com",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
      role: role === "traveller" ? "guest" : "host",
    });

    toast.success("Verification successful! Logging you in...");
    setTimeout(() => {
      if (role === "host") {
        router.push("/host");
      } else {
        router.push(redirectTarget);
      }
    }, 800);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetStep === 1) {
      if (!resetEmail) {
        toast.error("Please enter your email.");
        return;
      }
      toast.success("Reset link sent! Please check your email.");
      setResetStep(2);
    } else if (resetStep === 2) {
      const code = resetOtp.join("");
      if (code.length < 6) {
        toast.error("Please enter the 6-digit reset code sent to your email.");
        return;
      }
      toast.success("Code verified! You can now set your new password.");
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

      login({
        name: "Thandeka Mwale",
        email: resetEmail,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Thandeka`,
        role: "guest",
      });

      toast.success("Password reset successfully! You are now signed in.");
      setTimeout(() => {
        router.push(redirectTarget);
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        :root {
          --ne-forest: #2A1B3D; --ne-forest-light: #523185;
          --ne-sand: #F5EFE0; --ne-sand-dark: #E8DFC8;
          --ne-amber: #D4881A; --ne-amber-light: #F5A623;
          --r: 12px; --rs: 8px;
        }
        .auth-wrap { width: 100%; flex: 1; display: flex; flex-direction: column; }
        .view { display: flex; flex-direction: column; flex: 1; }
        .brand-logo-hero {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          z-index: 20;
        }
        .brand-text { font-size: 15px; font-weight: 800; color: var(--ne-sand); letter-spacing: -0.02em; }
        .brand-text span { color: var(--ne-amber-light); font-style: italic; font-weight: 400; }
        
        .auth-hero {
          background: var(--ne-forest);
          padding: 4rem 1.25rem 2rem;
          position: relative; overflow: hidden;
          min-height: 260px; display: flex; flex-direction: column; justify-content: flex-end;
          align-items: center;
        }
        .brand-logo-hero {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          z-index: 20;
        }
        .brand-text { font-size: 15px; font-weight: 800; color: var(--ne-sand); letter-spacing: -0.02em; }
        .brand-text span { color: var(--ne-amber-light); font-style: italic; font-weight: 400; }
        
        .auth-eyebrow { font-size: 10px; font-weight: 700; color: var(--ne-amber-light); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 8px; }
        .auth-headline { font-size: 26px; font-weight: 800; color: var(--ne-sand); line-height: 1.25; margin-bottom: 6px; tracking: -0.01em; }
        .auth-headline em { color: var(--ne-amber-light); font-style: normal; }
        .auth-sub { font-size: 13px; color: rgba(245,239,224,0.65); line-height: 1.5; font-weight: 500; }
        
        .auth-hero > .auth-eyebrow, .auth-hero > .auth-headline, .auth-hero > .auth-sub {
          width: 100%; max-width: 480px; text-align: left;
        }
        
        .auth-card {
          background: white;
          border: none;
          padding: 2.5rem 1.5rem;
          flex: 1;
          display: flex; flex-direction: column; align-items: center;
        }
        .auth-card > form {
          width: 100%; max-width: 480px;
        }
        .field { margin-bottom: 16px; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
        .field-label { font-size: 10px; font-weight: 700; color: #555555; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px; }
        .field-input-wrap { position: relative; }
        .field-input {
          width: 100%; padding: 12px 14px;
          border: 1.5px solid var(--ne-sand-dark);
          border-radius: var(--rs);
          font-size: 14px; font-weight: 500;
          color: #1a1a1a;
          background: white;
          outline: none; transition: border-color 0.2s;
        }
        .field-input:focus { border-color: var(--ne-forest); }
        .field-icon {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          font-size: 16px; color: #888888; cursor: pointer;
        }
        .field-hint { font-size: 11px; color: #666666; margin-top: 5px; }
        .phone-row { display: grid; grid-template-columns: 96px 1fr; gap: 8px; }
        .phone-prefix {
          padding: 12px;
          border: 1.5px solid var(--ne-sand-dark);
          border-radius: var(--rs);
          font-size: 14px; font-weight: 600;
          color: #333333;
          background: #FAF8F5;
          display: flex; align-items: center; gap: 6px;
          cursor: pointer;
        }
        
        .pw-strength { margin-top: 8px; }
        .pw-bars { display: flex; gap: 4px; margin-bottom: 4px; }
        .pw-bar { flex: 1; height: 3px; border-radius: 2px; background: #e5e5e5; }
        .pw-label { font-size: 11px; font-weight: 600; }
        
        .role-picker { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
        .role-card {
          padding: 14px 10px; border-radius: var(--rs);
          border: 1.5px solid var(--ne-sand-dark);
          cursor: pointer; text-align: center; transition: all 0.15s;
        }
        .role-card.on { border-color: var(--ne-forest); background: #F0F6F3; }
        .role-card-name { font-size: 13px; font-weight: 700; color: #111111; }
        .role-card-desc { font-size: 11px; color: #666666; margin-top: 2px; }
        
        .checkbox-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 14px; }
        .checkbox-custom {
          width: 18px; height: 18px; border-radius: 4px;
          border: 1.5px solid var(--ne-sand-dark);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; cursor: pointer; margin-top: 2px;
        }
        .checkbox-custom.on { background: var(--ne-forest); border-color: var(--ne-forest); }
        .checkbox-custom-label { font-size: 12px; color: #555555; line-height: 1.5; font-weight: 500; }
        .checkbox-custom-label a { color: var(--ne-forest); font-weight: 700; text-decoration: none; }
        
        .btn-submit {
          width: 100%; padding: 14px;
          background: var(--ne-forest); color: var(--ne-sand);
          border: none; border-radius: var(--rs);
          font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
          cursor: pointer; transition: background 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-bottom: 1.25rem;
        }
        .btn-submit:hover { background: var(--ne-forest-light); }
        .switch-text { text-align: center; font-size: 13px; color: #666666; font-weight: 500; }
        .switch-text a { color: var(--ne-forest); font-weight: 700; cursor: pointer; }
        
        .otp-wrap { text-align: center; padding: 0.5rem 0; }
        .otp-icon { width: 56px; height: 56px; border-radius: 50%; background: #E1F5EE; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; }
        .otp-title { font-size: 18px; font-weight: 700; color: #111111; margin-bottom: 6px; }
        .otp-sub { font-size: 13px; color: #555555; margin-bottom: 1.75rem; line-height: 1.5; }
        .otp-sub strong { color: #111111; }
        .otp-boxes { display: flex; gap: 10px; justify-content: center; margin-bottom: 1.5rem; }
        .otp-box {
          width: 48px; height: 56px; border-radius: var(--rs);
          border: 2px solid var(--ne-sand-dark);
          font-size: 22px; font-weight: 700; text-align: center;
          color: #111111; background: white; outline: none;
          transition: border-color 0.2s;
        }
        .otp-box:focus { border-color: var(--ne-forest); }
        .otp-box.filled { border-color: var(--ne-forest); background: #F0F6F3; }
        .otp-resend { font-size: 13px; color: #555555; margin-bottom: 1.5rem; font-weight: 500; }
        .otp-resend a { color: var(--ne-forest); font-weight: 700; cursor: pointer; }
        .otp-change { font-size: 12px; color: #666666; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; font-weight: 600; margin-top: 1rem; }
        
        .reset-steps { display: flex; align-items: center; gap: 6px; margin-bottom: 1.75rem; }
        .rst-step { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #888888; font-weight: 600; }
        .rst-step.done { color: #0F6E56; }
        .rst-step.active { color: var(--ne-forest); font-weight: 700; }
        .rst-dot { width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid var(--ne-sand-dark); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; }
        .rst-step.done .rst-dot { background: #1D9E75; border-color: #1D9E75; color: white; }
        .rst-step.active .rst-dot { background: var(--ne-forest); border-color: var(--ne-forest); color: var(--ne-sand); }
        .rst-line { flex: 1; height: 1.5px; background: var(--ne-sand-dark); }
        
        .trust-strip { display: flex; justify-content: center; gap: 1.75rem; padding: 1.5rem 1.25rem; background: #FAF8F5; border-top: 1px solid var(--ne-sand-dark); width: 100%; }
        .trust-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #666666; font-weight: 600; }
        .trust-item svg { color: var(--ne-forest); }
      `,
        }}
      />

      <div className="auth-wrap">
        {/* TAB SWITCHER */}
        <div className="page-tabs">
          <div className="page-tabs-inner">
            <div className="page-tab-brand" style={{ gap: "4px" }}>
              <Link
                href="/"
                className="flex items-center gap-1.5 no-underline outline-none focus-visible:outline-none"
              >
                <span className="text-[18px] font-semibold text-white tracking-tight">Nearby</span>
                <span className="font-script text-[#C5A059] font-normal text-[1.3em] leading-none -mt-1">
                  Escapes
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/*  LOGIN  */}
        {activeTab === "login" && (
          <div className="view active">
            <div className="auth-hero">
              <div className="brand-logo-hero">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 no-underline outline-none focus-visible:outline-none"
                >
                  <span className="text-[18px] font-semibold text-white tracking-tight">
                    Nearby
                  </span>
                  <span className="font-script text-[#C5A059] font-normal text-[1.3em] leading-none -mt-1">
                    Escapes
                  </span>
                </Link>
              </div>
              <div className="auth-eyebrow">Welcome back</div>
              <div className="auth-headline">
                Your next <em>escape</em>
                <br />
                is waiting
              </div>
              <div className="auth-sub">
                Sign in to manage your bookings, saved lodges, and upcoming trips.
              </div>
            </div>

            <div className="auth-card">
              <form onSubmit={handleLoginSubmit}>
                <div className="field">
                  <div className="field-label">Email or phone</div>
                  <div className="field-input-wrap">
                    <input
                      className="field-input"
                      type="text"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Mail className="field-icon h-4 w-4" />
                  </div>
                </div>

                <div className="field">
                  <div className="field-label">Password</div>
                  <div className="field-input-wrap">
                    <input
                      className="field-input"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    {showPassword ? (
                      <EyeOff
                        className="field-icon h-4 w-4"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <Eye className="field-icon h-4 w-4" onClick={() => setShowPassword(true)} />
                    )}
                  </div>
                  <div className="field-hint" style={{ textAlign: "right" }}>
                    <span
                      onClick={() => router.push("/auth/reset")}
                      className="text-[12px] font-bold cursor-pointer hover:underline text-[#2A1B3D]"
                    >
                      Forgot password?
                    </span>
                  </div>
                </div>

                <div className="checkbox-row">
                  <Checkbox
                    id="remember-me"
                    className="rounded border-[#E8DFC8] data-[state=checked]:bg-[#1A3C34] data-[state=checked]:border-[#1A3C34]"
                  />
                  <Label
                    htmlFor="remember-me"
                    className="checkbox-custom-label cursor-pointer select-none"
                  >
                    Keep me signed in on this device
                  </Label>
                </div>

                <button type="submit" className="btn-submit">
                  Sign in
                </button>

                <div className="switch-text">
                  New to Nearby Escapes?{" "}
                  <a onClick={() => router.push("/auth/register")}>Create a free account →</a>
                </div>
              </form>
            </div>

            <div className="trust-strip">
              <div className="trust-item">
                <ShieldCheck className="h-4 w-4" /> Secure login
              </div>
              <div className="trust-item">
                <Lock className="h-4 w-4" /> Data protected
              </div>
            </div>
          </div>
        )}

        {/*  REGISTER  */}
        {activeTab === "register" && (
          <div className="view active">
            <div className="auth-hero">
              <div className="brand-logo-hero">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 no-underline outline-none focus-visible:outline-none"
                >
                  <span className="text-[18px] font-semibold text-white tracking-tight">
                    Nearby
                  </span>
                  <span className="font-script text-[#C5A059] font-normal text-[1.3em] leading-none -mt-1">
                    Escapes
                  </span>
                </Link>
              </div>
              <div className="auth-eyebrow">Join free today</div>
              <div className="auth-headline">
                Find your <em>hidden gem</em>
              </div>
              <div className="auth-sub">2,841 Zambians already exploring with Nearby Escapes.</div>
            </div>

            <div className="auth-card">
              <form onSubmit={handleRegisterSubmit}>
                {/* Role Picker */}
                <div className="field-label" style={{ marginBottom: "8px" }}>
                  I am a
                </div>
                <div className="role-picker">
                  <div
                    className={cn("role-card", role === "traveller" && "on")}
                    onClick={() => setRole("traveller")}
                  >
                    <Backpack className="h-6 w-6 text-[#1A3C34] mx-auto mb-1" />
                    <div className="role-card-name">Traveller</div>
                    <div className="role-card-desc">I want to find & book escapes</div>
                  </div>
                  <div
                    className={cn("role-card", role === "host" && "on")}
                    onClick={() => setRole("host")}
                  >
                    <Home className="h-6 w-6 text-[#1A3C34] mx-auto mb-1" />
                    <div className="role-card-name">Local host</div>
                    <div className="role-card-desc">I want to list my property</div>
                  </div>
                </div>

                <div className="field-row">
                  <div>
                    <div className="field-label">First name</div>
                    <input
                      className="field-input"
                      type="text"
                      placeholder="Thandeka"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <div className="field-label">Last name</div>
                    <input
                      className="field-input"
                      type="text"
                      placeholder="Mwale"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <div className="field-label">Email address</div>
                  <div className="field-input-wrap">
                    <input
                      className="field-input"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Mail className="field-icon h-4 w-4" />
                  </div>
                </div>

                <div className="field">
                  <div className="field-label">Phone number</div>
                  <div className="phone-row">
                    <div className="phone-prefix">
                      <span>🇿🇲 +260</span>
                      <ChevronDown className="h-3 w-3 text-gray-500" />
                    </div>
                    <input
                      className="field-input"
                      type="tel"
                      placeholder="97 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="field-hint">We&apos;ll send your booking confirmations here</div>
                </div>

                <div className="field">
                  <div className="field-label">Password</div>
                  <div className="field-input-wrap">
                    <input
                      className="field-input"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    {showPassword ? (
                      <EyeOff
                        className="field-icon h-4 w-4"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <Eye className="field-icon h-4 w-4" onClick={() => setShowPassword(true)} />
                    )}
                  </div>

                  {/* Password strength UI */}
                  {password && (
                    <div className="pw-strength">
                      <div className="pw-bars">
                        {[1, 2, 3, 4].map((barIdx) => {
                          const strength = getPasswordStrength(password);
                          return (
                            <div
                              key={barIdx}
                              className={cn(
                                "pw-bar",
                                barIdx <= strength.score ? strength.barClass : "",
                              )}
                            />
                          );
                        })}
                      </div>
                      <div className={cn("pw-label", getPasswordStrength(password).color)}>
                        {getPasswordStrength(password).label}
                      </div>
                    </div>
                  )}
                </div>

                <div className="checkbox-row">
                  <Checkbox
                    id="agree-terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(!!checked)}
                    className="rounded border-[#E8DFC8] data-[state=checked]:bg-[#1A3C34] data-[state=checked]:border-[#1A3C34] mt-0.5"
                    required
                  />
                  <Label
                    htmlFor="agree-terms"
                    className="checkbox-custom-label cursor-pointer select-none"
                  >
                    I agree to the <Link href="/legal/terms">Terms of Service</Link> and{" "}
                    <Link href="/legal/privacy">Privacy Policy</Link>
                  </Label>
                </div>

                <div className="checkbox-row" style={{ marginTop: "-6px" }}>
                  <Checkbox
                    id="deals-alerts"
                    checked={dealsAlerts}
                    onCheckedChange={(checked) => setDealsAlerts(!!checked)}
                    className="rounded border-[#E8DFC8] data-[state=checked]:bg-[#1A3C34] data-[state=checked]:border-[#1A3C34] mt-0.5"
                  />
                  <Label
                    htmlFor="deals-alerts"
                    className="checkbox-custom-label cursor-pointer select-none"
                  >
                    Send me deals and hidden gem alerts for my area
                  </Label>
                </div>

                <button type="submit" className="btn-submit">
                  Create my account
                </button>

                <div className="switch-text">
                  Already have an account? <a onClick={() => router.push("/auth/login")}>Sign in</a>
                </div>
              </form>
            </div>
          </div>
        )}

        {/*  OTP VERIFY  */}
        {activeTab === "otp" && (
          <div className="view active">
            <div className="auth-hero">
              <div className="brand-logo-hero">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 no-underline outline-none focus-visible:outline-none"
                >
                  <span className="text-[18px] font-semibold text-white tracking-tight">
                    Nearby
                  </span>
                  <span className="font-script text-[#C5A059] font-normal text-[1.3em] leading-none -mt-1">
                    Escapes
                  </span>
                </Link>
              </div>
              <div className="auth-eyebrow">Almost there</div>
              <div className="auth-headline">
                Verify your <em>number</em>
              </div>
            </div>

            <div className="auth-card">
              <form onSubmit={handleOtpSubmit} className="otp-wrap">
                <div className="otp-icon">
                  <MessageSquare className="h-6 w-6 text-[#0F6E56]" />
                </div>
                <div className="otp-title">Check your messages</div>
                <div className="otp-sub">
                  We sent a 6-digit code to <strong>+260 97 ••• ••34</strong>.
                  <br />
                  It expires in 10 minutes.
                </div>

                <div className="otp-boxes">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      className={cn("otp-box", digit && "filled")}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value, "otp")}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e, "otp")}
                      placeholder="·"
                      aria-label={`OTP digit ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="otp-resend">
                  Didn&apos;t get it?{" "}
                  <a onClick={() => toast.info("Verification code re-sent.")}>Resend code</a> ·{" "}
                  <span id="otp-timer" className="color-[#1A3C34] font-bold">
                    {formatTimer(secs)}
                  </span>
                </div>

                <button type="submit" className="btn-submit">
                  Verify & continue
                </button>

                <div className="otp-change" onClick={() => router.push("/auth/register")}>
                  <ArrowLeft className="h-3.5 w-3.5" /> Change number
                </div>
              </form>
            </div>

            <div className="trust-strip">
              <div className="trust-item">
                <ShieldCheck className="h-4 w-4" /> Secure verification
              </div>
              <div className="trust-item">
                <Clock className="h-4 w-4" /> Expires in 10 mins
              </div>
            </div>
          </div>
        )}

        {/*  RESET PASSWORD  */}
        {activeTab === "reset" && (
          <div className="view active">
            <div className="auth-hero">
              <div className="brand-logo-hero">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 no-underline outline-none focus-visible:outline-none"
                >
                  <span className="text-[18px] font-semibold text-white tracking-tight">
                    Nearby
                  </span>
                  <span className="font-script text-[#C5A059] font-normal text-[1.3em] leading-none -mt-1">
                    Escapes
                  </span>
                </Link>
              </div>
              <div className="auth-eyebrow">Account recovery</div>
              <div className="auth-headline">
                Reset your <em>password</em>
              </div>
            </div>

            <div className="auth-card">
              {/* STEP INDICATOR */}
              <div className="reset-steps">
                <div className={cn("rst-step", resetStep > 1 ? "done" : "active")}>
                  <div className="rst-dot">
                    {resetStep > 1 ? <Check className="h-3 w-3 text-white" /> : "1"}
                  </div>
                  <span>Email</span>
                </div>
                <div className="rst-line"></div>
                <div
                  className={cn(
                    "rst-step",
                    resetStep > 2 ? "done" : resetStep === 2 ? "active" : "",
                  )}
                >
                  <div className="rst-dot">
                    {resetStep > 2 ? <Check className="h-3 w-3 text-white" /> : "2"}
                  </div>
                  <span>Verify</span>
                </div>
                <div className="rst-line"></div>
                <div className={cn("rst-step", resetStep === 3 ? "active" : "")}>
                  <div className="rst-dot">3</div>
                  <span>New password</span>
                </div>
              </div>

              <form onSubmit={handleResetSubmit}>
                {resetStep === 1 && (
                  <div className="field">
                    <div className="field-label">Enter your email</div>
                    <div className="field-input-wrap">
                      <input
                        className="field-input"
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
                  <div className="field">
                    <div className="field-label">Verification code</div>
                    <div className="field-hint mb-4 mt-0 text-gray-500">
                      We sent a reset code to <strong>{resetEmail}</strong>.
                    </div>
                    <div
                      className="otp-boxes"
                      style={{ justifyContent: "flex-start", marginBottom: 0 }}
                    >
                      {resetOtp.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`resetOtp-${idx}`}
                          className={cn("otp-box", digit && "filled")}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value, "resetOtp")}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e, "resetOtp")}
                          placeholder="·"
                          aria-label={`Code digit ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {resetStep === 3 && (
                  <>
                    <div className="field" style={{ marginTop: "14px" }}>
                      <div className="field-label">New password</div>
                      <div className="field-input-wrap">
                        <input
                          className="field-input"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Create new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        {showNewPassword ? (
                          <EyeOff
                            className="field-icon h-4 w-4"
                            onClick={() => setShowNewPassword(false)}
                          />
                        ) : (
                          <Eye
                            className="field-icon h-4 w-4"
                            onClick={() => setShowNewPassword(true)}
                          />
                        )}
                      </div>

                      {newPassword && (
                        <div className="pw-strength">
                          <div className="pw-bars">
                            {[1, 2, 3, 4].map((barIdx) => {
                              const strength = getPasswordStrength(newPassword);
                              return (
                                <div
                                  key={barIdx}
                                  className={cn(
                                    "pw-bar",
                                    barIdx <= strength.score ? strength.barClass : "",
                                  )}
                                />
                              );
                            })}
                          </div>
                          <div className={cn("pw-label", getPasswordStrength(newPassword).color)}>
                            {getPasswordStrength(newPassword).label}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="field">
                      <div className="field-label">Confirm new password</div>
                      <div className="field-input-wrap">
                        <input
                          className="field-input"
                          type="password"
                          placeholder="Repeat new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <button type="submit" className="btn-submit" style={{ marginTop: "1rem" }}>
                  {resetStep === 1
                    ? "Send Reset Link"
                    : resetStep === 2
                      ? "Verify Code"
                      : "Set new password"}
                </button>

                <div className="switch-text">
                  Remembered it? <a onClick={() => router.push("/auth/login")}>Back to sign in</a>
                </div>
              </form>
            </div>

            <div className="trust-strip">
              <div className="trust-item">
                <ShieldCheck className="h-4 w-4" /> Encrypted reset
              </div>
              <div className="trust-item">
                <Clock className="h-4 w-4" /> Link expires in 30 mins
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
