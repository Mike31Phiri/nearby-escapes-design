import Link from "next/link";
import { CheckCircle2, Download, Share2, MapPin, Calendar, Users, MessageCircle, Plane } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useBooking } from "@/hooks/useBooking";

export function ConfirmationPage() {
  const { draft, total, nights } = useBooking();
  const ref = `NE-${Math.floor(100000 + Math.random() * 900000)}`;
  const stayName = draft?.stayName ?? "Mosi-oa-Tunya Lodge";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 md:px-6 md:py-14">
        <div className="text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary">Booking confirmed</p>
          <h1 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">Your trip to {stayName.split("·")[0].trim()} is set</h1>
          <p className="mt-2 text-sm text-muted-foreground">Reference <span className="font-mono font-medium text-foreground">{ref}</span> · We've emailed your itinerary.</p>
        </div>

        <Card className="mt-8 border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{stayName}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> Livingstone, Zambia</p>
              </div>
              <Badge variant="secondary" className="text-[11px]">Confirmed</Badge>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-4 sm:grid-cols-3">
              <Detail icon={Calendar} label="Check in" value={draft?.checkIn ?? "—"} />
              <Detail icon={Calendar} label="Check out" value={draft?.checkOut ?? "—"} />
              <Detail icon={Users} label="Guests" value={`${draft?.guests ?? 2} · ${nights || 3} nights`} />
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total paid</span>
              <span className="font-bold text-lg">${total || 705}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4 border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11"><AvatarFallback className="bg-primary text-primary-foreground font-bold">CK</AvatarFallback></Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">Your host, Chanda</p>
                <p className="text-xs text-muted-foreground">Replies in under 30 minutes</p>
              </div>
              <Button asChild size="sm"><Link href="/inbox"><MessageCircle className="h-4 w-4 mr-1" /> Message</Link></Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-6">
              "Thank you for booking! Check-in is from 14:00. If you arrive earlier, message me — we can usually arrange storage."
            </p>
          </CardContent>
        </Card>

        <Card className="mt-4 border-border/60">
          <CardContent className="p-6">
            <h2 className="text-sm font-semibold tracking-tight">Next steps</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Step icon={Plane} title="Plan your travel" body="Add airport pickup and tours to your trip." />
              <Step icon={Download} title="Save your receipt" body="Keep a PDF copy for your records." />
              <Step icon={Share2} title="Invite friends" body="Share the itinerary with your group." />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
              <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Receipt</Button>
              <Button variant="outline" size="sm"><Share2 className="h-4 w-4 mr-1" /> Share</Button>
              <Button asChild size="sm"><Link href="/">Back home</Link></Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1"><Icon className="h-3 w-3" /> {label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function Step({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary"><Icon className="h-4 w-4" /></div>
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{body}</p>
    </div>
  );
}
