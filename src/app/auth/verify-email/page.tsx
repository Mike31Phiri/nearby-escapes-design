"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowRight, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function VerifyEmailPage() {
  const [resending, setResending] = useState(false);

  const handleResend = () => {
    setResending(true);
    setTimeout(() => setResending(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 md:p-6 py-12 md:py-20">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-border/60 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="space-y-1 text-center pt-8">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Verify your email</CardTitle>
              <CardDescription>
                We&apos;ve sent a verification link to your email address
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-2 text-center">
              <div className="bg-muted/50 rounded-2xl p-6 mb-8">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Please click the link in the email to verify your account. If you don&apos;t see the email, check your spam folder.
                </p>
              </div>
              
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full h-11 rounded-xl font-bold flex items-center justify-center gap-2"
                  onClick={handleResend}
                  disabled={resending}
                >
                  <RefreshCcw className={resending ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
                  {resending ? "Resending..." : "Resend verification email"}
                </Button>
                
                <Link href="/auth/login" className="block">
                  <Button variant="ghost" className="w-full text-muted-foreground font-medium">
                    Back to sign in
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
