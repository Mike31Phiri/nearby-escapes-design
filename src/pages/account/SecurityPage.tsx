import Link from "next/link";
import { ArrowLeft, ShieldCheck, Smartphone, Monitor, MapPin, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const sessions = [
  { id: "s1", device: "MacBook Pro · Chrome", location: "Lusaka, ZM", lastActive: "Active now", current: true, icon: Monitor },
  { id: "s2", device: "iPhone 15 · Safari", location: "Lusaka, ZM", lastActive: "2 hours ago", current: false, icon: Smartphone },
  { id: "s3", device: "Pixel · Chrome", location: "Livingstone, ZM", lastActive: "Yesterday", current: false, icon: Smartphone },
];

export function SecurityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <Link href="/account" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Account
        </Link>

        <header className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Login & security</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">Keep your account safe</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Update your password, enable two-step verification and review active sessions.
          </p>
        </header>

        <Card className="mt-8 border-border/60">
          <CardContent className="p-6">
            <h2 className="text-sm font-semibold tracking-tight">Password</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="cur">Current password</Label>
                <Input id="cur" type="password" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm">Confirm new password</Label>
                <Input id="confirm" type="password" />
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end">
              <Button onClick={() => toast.success("Password updated")}>Update password</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 border-border/60">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold tracking-tight">Two-step verification</h2>
                  <Badge variant="secondary" className="text-[11px]">Off</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add a code from your phone to every login for extra protection.
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 border-border/60">
          <CardContent className="p-0">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight">Active sessions</h2>
              <Button size="sm" variant="ghost" onClick={() => toast.success("Signed out from other devices")}>
                Sign out all
              </Button>
            </div>
            {sessions.map((s, i) => (
              <div key={s.id}>
                {i > 0 && <Separator />}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{s.device}</p>
                      {s.current && <Badge variant="secondary" className="text-[11px]">This device</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {s.location} · {s.lastActive}
                    </p>
                  </div>
                  {!s.current && (
                    <Button size="sm" variant="ghost">Sign out</Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/5 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive shrink-0" />
          <div className="text-sm text-muted-foreground">
            See something unfamiliar? <button className="font-medium text-destructive hover:underline">Report a security issue</button>.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
