"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Phone, MapPin, Loader2, AlertCircle } from "lucide-react";
import { AuthCard } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await register({ email, password, fullName, phone, location });
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard title="Create account" subtitle="Start saving stays and planning trips.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="py-3 px-4 rounded-xl border-destructive/20 bg-destructive/5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs font-semibold ml-2">{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="name" required value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="h-11 pl-9 rounded-xl" placeholder="Jane Phiri" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="h-11 pl-9 rounded-xl" placeholder="you@example.com" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
              className="h-11 pl-9 rounded-xl" placeholder="+260 977 000 000" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="location">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="location" required value={location} onChange={(e) => setLocation(e.target.value)}
              className="h-11 pl-9 rounded-xl" placeholder="Lusaka, Zambia" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="password" type="password" required minLength={8} value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 pl-9 rounded-xl" placeholder="At least 8 characters" />
          </div>
        </div>

        <Button type="submit" disabled={isLoading}
          className="h-11 w-full bg-[image:var(--gradient-hero)] hover:opacity-95 font-black rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
            </div>
          ) : "Create account"}
        </Button>

        <p className="text-center text-sm text-muted-foreground font-medium pt-2">
          Already have an account?{" "}
          <Link href="/login" className="font-black text-primary hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthCard>
  );
}
