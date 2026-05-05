"use client";

import Link from "next/link";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, Lock, Phone, ShieldCheck } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RegisterPage() {
  const [role, setRole] = useState("guest");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 md:p-6 py-12 md:py-20">
        <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-border/60 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="space-y-1 text-center pt-8">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
              <CardDescription>
                Join Nearby Escapes today
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-2">
              <form className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" placeholder="John" className="rounded-xl" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" placeholder="Doe" className="rounded-xl" required />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="john@example.com" className="pl-10 rounded-xl" required />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone number (optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" type="tel" placeholder="+260 97 123 4567" className="pl-10 rounded-xl" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type="password" className="pl-10 rounded-xl" required />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>I want to join as a:</Label>
                  <RadioGroup defaultValue="guest" onValueChange={setRole} className="grid grid-cols-2 gap-4">
                    <div>
                      <RadioGroupItem value="guest" id="guest" className="peer sr-only" />
                      <Label
                        htmlFor="guest"
                        className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                      >
                        <User className="mb-2 h-6 w-6" />
                        <span className="font-bold">Guest</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="host" id="host" className="peer sr-only" />
                      <Label
                        htmlFor="host"
                        className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                      >
                        <ShieldCheck className="mb-2 h-6 w-6" />
                        <span className="font-bold">Host</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" required className="mt-1" />
                  <label
                    htmlFor="terms"
                    className="text-xs leading-relaxed text-muted-foreground"
                  >
                    By creating an account, you agree to our{" "}
                    <Link href="/terms" className="text-primary font-medium hover:underline">Terms of Service</Link> and{" "}
                    <Link href="/privacy" className="text-primary font-medium hover:underline">Privacy Policy</Link>.
                  </label>
                </div>

                <Button className="w-full h-11 rounded-xl bg-[image:var(--gradient-hero)] hover:opacity-90 shadow-md font-bold transition-all">
                  Create account
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 p-8 pt-0 border-t border-border/40 bg-muted/30">
              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-bold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
