"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { AuthCard } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await login(email, password);
      router.push(callbackUrl);
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard title="Sign in" subtitle="Access bookings, saved stays and host tools.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="py-3 px-4 rounded-xl border-destructive/20 bg-destructive/5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs font-semibold ml-2">{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              id="email" 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 pl-9 rounded-xl focus-visible:ring-primary/20" 
              placeholder="you@example.com" 
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
             <Label htmlFor="password">Password</Label>
             <Link href="/forgot-password" title="Coming soon" className="text-[11px] font-bold text-primary hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              id="password" 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 pl-9 rounded-xl focus-visible:ring-primary/20" 
              placeholder="••••••••" 
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full bg-[image:var(--gradient-hero)] hover:opacity-95 font-black rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </div>
          ) : (
            "Sign in"
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground font-medium pt-2">
          Don't have an account?{" "}
          <Link href="/register" className="font-black text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
