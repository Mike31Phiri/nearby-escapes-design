"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function PersonalInfoPage() {
  const [saving, setSaving] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Personal info saved");
    }, 600);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Account
        </Link>

        <header className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Personal info
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">Your details</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This information is shared with hosts and shown on your receipts.
          </p>
        </header>

        <Card className="mt-8 border-border/60">
          <CardContent className="p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" defaultValue="Mike" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" defaultValue="Phiri" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="mike@example.com" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+260 977 000 000" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dob">Date of birth</Label>
                  <Input id="dob" type="date" defaultValue="1995-06-12" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="gender">Gender</Label>
                  <Input id="gender" defaultValue="Prefer not to say" />
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="Plot 234, Cairo Road" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" defaultValue="Lusaka" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" defaultValue="Zambia" />
                </div>
              </div>

              <Separator />

              <div className="space-y-1.5">
                <Label htmlFor="bio">About you</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  placeholder="A short bio shown to hosts before they confirm your stay."
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
