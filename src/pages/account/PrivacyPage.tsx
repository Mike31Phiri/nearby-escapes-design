import { Link } from "@tanstack/react-router";
import { ArrowLeft, Download, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const toggles = [
  { id: "p1", title: "Personalised recommendations", description: "Use your browsing and bookings to tailor results.", on: true },
  { id: "p2", title: "Share insights with hosts", description: "Hosts see anonymised stats from your reviews.", on: true },
  { id: "p3", title: "Marketing analytics", description: "Help us understand how the app is used.", on: false },
  { id: "p4", title: "Third-party cookies", description: "Allow analytics and ad partners to set cookies.", on: false },
];

export function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <Link to="/account" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Account
        </Link>

        <header className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Privacy & data</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">Control your data</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose how your data is used and request a copy or deletion any time.
          </p>
        </header>

        <Card className="mt-8 border-border/60">
          <CardContent className="p-0">
            {toggles.map((t, i) => (
              <div key={t.id}>
                {i > 0 && <Separator />}
                <div className="flex items-start justify-between gap-6 px-5 py-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{t.description}</p>
                  </div>
                  <Switch defaultChecked={t.on} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="mt-6 border-border/60">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-tight">Download your data</p>
              <p className="text-xs text-muted-foreground">A ZIP with bookings, messages and account history.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.success("We'll email you when it's ready")}>
              <Download className="h-4 w-4 mr-1" /> Request export
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-4 border-destructive/40">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold tracking-tight text-destructive">Delete account</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Permanently remove your profile, bookings and reviews. This cannot be undone.
                </p>
              </div>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
