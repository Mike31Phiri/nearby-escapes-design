"use client";

import Link from "next/link";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 md:p-6 py-12 md:py-20">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          {!submitted ? (
            <Card className="border-border/60 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="space-y-1 text-center pt-8">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">Forgot password?</CardTitle>
                <CardDescription>
                  Enter your email and we&apos;ll send you a reset link
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-2">
                <form onSubmit={handleSubmit} className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="mwine@example.com" className="pl-10 rounded-xl" required />
                    </div>
                  </div>
                  <Button className="w-full h-11 rounded-xl bg-[image:var(--gradient-hero)] hover:opacity-90 shadow-md font-bold transition-all">
                    Send reset link
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 p-8 pt-0 border-t border-border/40 bg-muted/30">
                <Link 
                  href="/auth/login" 
                  className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mt-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </Link>
              </CardFooter>
            </Card>
          ) : (
            <Card className="border-border/60 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight mb-2">Check your inbox</CardTitle>
                <CardDescription className="text-base mb-8">
                  We&apos;ve sent a password reset link to your email address. Please follow the instructions to reset your password.
                </CardDescription>
                <Button variant="outline" className="w-full h-11 rounded-xl font-bold" onClick={() => setSubmitted(false)}>
                  Resend link
                </Button>
                <Link 
                  href="/auth/login" 
                  className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mt-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Helper component for the header lock icon
function Lock({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
