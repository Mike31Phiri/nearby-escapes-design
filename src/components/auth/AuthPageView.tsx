"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Compass,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface AuthPageViewProps {
  defaultTab?: "login" | "register";
}

export function AuthPageView({ defaultTab = "login" }: AuthPageViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab);

  const redirectTarget = searchParams.get("next") || "/";

  // Form Field States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Error States
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");

  const validateEmail = (val: string) => {
    if (!val) {
      setEmailError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (val: string) => {
    if (!val) {
      setPasswordError("Password is required");
      return false;
    }
    if (val.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateName = (val: string) => {
    if (activeTab === "register" && !val) {
      setNameError("Full name is required");
      return false;
    }
    setNameError("");
    return true;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    // Success - Perform Context Login
    login({
      name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
      email: email.toLowerCase(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
    });

    toast.success("Welcome back! You have successfully signed in.", {
      icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
      duration: 4000,
    });

    setTimeout(() => {
      router.push(redirectTarget);
    }, 800);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isNameValid = validateName(fullName);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isNameValid || !isEmailValid || !isPasswordValid) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    if (!agreeTerms) {
      toast.error("You must agree to the Terms and Conditions.");
      return;
    }

    // Success - Perform Context Login
    login({
      name: fullName,
      email: email.toLowerCase(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`,
    });

    toast.success("Account created successfully! Welcome to Nearby Escapes.", {
      icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
      duration: 4000,
    });

    setTimeout(() => {
      router.push(redirectTarget);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] font-sans">
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl bg-white border border-[#e4e4e7] rounded-none shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
          {/* Left panel: high-impact minimal brand side */}
          <div className="hidden md:block md:col-span-5 relative bg-zinc-950 text-white overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80"
              alt="South Luangwa, Zambia"
              className="absolute inset-0 h-full w-full object-cover opacity-35"
            />
            {/* Minimal solid backing */}
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 h-full flex flex-col justify-between p-8">
              <Link href="/" className="flex items-center gap-2 text-white/90">
                <Compass className="h-5 w-5 text-white shrink-0" />
                <span className="text-xs font-black tracking-widest uppercase">Nearby Escapes</span>
              </Link>

              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#a1a1aa]">
                  Zambia Travel Hub
                </span>
                <h2 className="text-3xl font-black tracking-tight leading-tight text-white">
                  Discover Stays, Transport & Hidden Gems.
                </h2>
                <p className="text-sm text-zinc-300 font-medium">
                  Create an account to save your favorite collections, customize booking details,
                  and access premium pricing.
                </p>
              </div>

              <p className="text-[10px] text-zinc-400 font-medium tracking-wide">
                © {new Date().getFullYear()} Nearby Escapes Ltd. All rights reserved.
              </p>
            </div>
          </div>

          {/* Right panel: solid elegant form side */}
          <div className="col-span-1 md:col-span-7 flex flex-col justify-center p-8 lg:p-14">
            {/* Header Tabs */}
            <div className="flex border-b border-[#e4e4e7] mb-8 gap-6">
              <button
                onClick={() => {
                  setActiveTab("login");
                  setEmailError("");
                  setPasswordError("");
                  setNameError("");
                }}
                className={cn(
                  "pb-3 text-sm font-black uppercase tracking-wider border-b-2 transition-all",
                  activeTab === "login"
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-400 hover:text-zinc-600",
                )}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setActiveTab("register");
                  setEmailError("");
                  setPasswordError("");
                  setNameError("");
                }}
                className={cn(
                  "pb-3 text-sm font-black uppercase tracking-wider border-b-2 transition-all",
                  activeTab === "register"
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-400 hover:text-zinc-600",
                )}
              >
                Create Account
              </button>
            </div>

            {/* Login View */}
            {activeTab === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Welcome back</h1>
                  <p className="text-sm text-zinc-500 font-medium">
                    Please enter your details to sign in.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="login-email"
                      className="text-xs font-bold uppercase tracking-wider text-zinc-500"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) validateEmail(e.target.value);
                        }}
                        onBlur={() => validateEmail(email)}
                        className={cn(
                          "pl-9 h-11 rounded-none border-[#e4e4e7] focus-visible:ring-zinc-900 focus-visible:ring-1 focus-visible:border-zinc-900",
                          emailError && "border-destructive focus-visible:ring-destructive",
                        )}
                        required
                      />
                    </div>
                    {emailError && (
                      <p className="text-xs text-destructive font-semibold flex items-center gap-1.5 mt-1 animate-in fade-in duration-100">
                        <AlertCircle className="h-3.5 w-3.5" /> {emailError}
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label
                        htmlFor="login-password"
                        className="text-xs font-bold uppercase tracking-wider text-zinc-500"
                      >
                        Password
                      </Label>
                      <button
                        type="button"
                        onClick={() => {
                          toast.info("Password reset link sent to mock email.");
                        }}
                        className="text-xs font-bold text-zinc-800 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (passwordError) validatePassword(e.target.value);
                        }}
                        onBlur={() => validatePassword(password)}
                        className={cn(
                          "pl-9 pr-9 h-11 rounded-none border-[#e4e4e7] focus-visible:ring-zinc-900 focus-visible:ring-1 focus-visible:border-zinc-900",
                          passwordError && "border-destructive focus-visible:ring-destructive",
                        )}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-xs text-destructive font-semibold flex items-center gap-1.5 mt-1 animate-in fade-in duration-100">
                        <AlertCircle className="h-3.5 w-3.5" /> {passwordError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 py-1">
                  <Checkbox
                    id="login-remember"
                    className="rounded-none border-[#ccc] data-[state=checked]:bg-zinc-900 data-[state=checked]:border-zinc-900"
                  />
                  <Label
                    htmlFor="login-remember"
                    className="text-xs font-semibold text-zinc-600 cursor-pointer select-none"
                  >
                    Keep me signed in on this device
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-none bg-zinc-900 text-white hover:bg-zinc-800 transition-colors font-black uppercase tracking-widest text-xs border border-zinc-900 mt-2"
                >
                  Sign In <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </form>
            )}

            {/* Register View */}
            {activeTab === "register" && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
                    Create your account
                  </h1>
                  <p className="text-sm text-zinc-500 font-medium">
                    Join Nearby Escapes and start exploring Zambia.
                  </p>
                </div>

                <div className="space-y-3.5">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="reg-name"
                      className="text-xs font-bold uppercase tracking-wider text-zinc-500"
                    >
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        id="reg-name"
                        placeholder="Sarah Phiri"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (nameError) validateName(e.target.value);
                        }}
                        onBlur={() => validateName(fullName)}
                        className={cn(
                          "pl-9 h-11 rounded-none border-[#e4e4e7] focus-visible:ring-zinc-900 focus-visible:ring-1 focus-visible:border-zinc-900",
                          nameError && "border-destructive focus-visible:ring-destructive",
                        )}
                        required
                      />
                    </div>
                    {nameError && (
                      <p className="text-xs text-destructive font-semibold flex items-center gap-1.5 mt-1 animate-in fade-in duration-100">
                        <AlertCircle className="h-3.5 w-3.5" /> {nameError}
                      </p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="reg-email"
                      className="text-xs font-bold uppercase tracking-wider text-zinc-500"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="sarah@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) validateEmail(e.target.value);
                        }}
                        onBlur={() => validateEmail(email)}
                        className={cn(
                          "pl-9 h-11 rounded-none border-[#e4e4e7] focus-visible:ring-zinc-900 focus-visible:ring-1 focus-visible:border-zinc-900",
                          emailError && "border-destructive focus-visible:ring-destructive",
                        )}
                        required
                      />
                    </div>
                    {emailError && (
                      <p className="text-xs text-destructive font-semibold flex items-center gap-1.5 mt-1 animate-in fade-in duration-100">
                        <AlertCircle className="h-3.5 w-3.5" /> {emailError}
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="reg-password"
                      className="text-xs font-bold uppercase tracking-wider text-zinc-500"
                    >
                      Password (min 6 characters)
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (passwordError) validatePassword(e.target.value);
                        }}
                        onBlur={() => validatePassword(password)}
                        className={cn(
                          "pl-9 pr-9 h-11 rounded-none border-[#e4e4e7] focus-visible:ring-zinc-900 focus-visible:ring-1 focus-visible:border-zinc-900",
                          passwordError && "border-destructive focus-visible:ring-destructive",
                        )}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-xs text-destructive font-semibold flex items-center gap-1.5 mt-1 animate-in fade-in duration-100">
                        <AlertCircle className="h-3.5 w-3.5" /> {passwordError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 py-1.5">
                  <Checkbox
                    id="reg-terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(!!checked)}
                    className="rounded-none border-[#ccc] data-[state=checked]:bg-zinc-900 data-[state=checked]:border-zinc-900 mt-0.5"
                    required
                  />
                  <Label
                    htmlFor="reg-terms"
                    className="text-xs font-semibold text-zinc-600 cursor-pointer select-none leading-normal"
                  >
                    I agree to the{" "}
                    <Link href="/legal/terms" className="text-zinc-800 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/legal/privacy" className="text-zinc-800 hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-none bg-zinc-900 text-white hover:bg-zinc-800 transition-colors font-black uppercase tracking-widest text-xs border border-zinc-900 mt-1"
                >
                  Create Account <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
