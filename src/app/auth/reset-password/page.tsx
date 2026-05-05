"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 md:p-6 py-12 md:py-20">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          {!isSuccess ? (
            <Card className="border-border/60 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="space-y-1 text-center pt-8">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">Reset password</CardTitle>
                <CardDescription>
                  Enter your new password below
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-2">
                <form onSubmit={handleSubmit} className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="password" type="password" className="pl-10 rounded-xl" required />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="confirm-password" type="password" className="pl-10 rounded-xl" required />
                    </div>
                  </div>
                  <Button className="w-full h-11 rounded-xl bg-[image:var(--gradient-hero)] hover:opacity-90 shadow-md font-bold transition-all">
                    Reset password
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/60 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight mb-2">Password reset successful</CardTitle>
                <CardDescription className="text-base mb-8">
                  Your password has been reset successfully. You can now sign in with your new password.
                </CardDescription>
                <Link href="/auth/login" className="w-full">
                  <Button className="w-full h-11 rounded-xl bg-[image:var(--gradient-hero)] font-bold transition-all">
                    Sign in
                  </Button>
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
