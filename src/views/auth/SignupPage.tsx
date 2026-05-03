import Link from "next/link";
import { Mail, Lock, User } from "lucide-react";
import { AuthCard } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupPage() {
  return (
    <AuthCard title="Create account" subtitle="Start saving stays and planning trips.">
      <form className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="name" className="h-11 pl-9" placeholder="Jane Phiri" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" type="email" className="h-11 pl-9" placeholder="you@example.com" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              className="h-11 pl-9"
              placeholder="At least 8 characters"
            />
          </div>
        </div>
        <Button
          type="button"
          className="h-11 w-full bg-[image:var(--gradient-hero)] hover:opacity-95"
        >
          Create account
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Already have an account?
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
