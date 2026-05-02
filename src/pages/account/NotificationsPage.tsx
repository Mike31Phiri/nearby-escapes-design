import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const groups = [
  {
    title: "Trips",
    items: [
      { id: "trip-confirmed", label: "Booking confirmations", description: "When a host confirms or declines.", email: true, push: true, sms: false },
      { id: "trip-reminders", label: "Trip reminders", description: "Check-in, check-out and arrival tips.", email: true, push: true, sms: true },
      { id: "trip-changes", label: "Itinerary changes", description: "If a host updates anything before arrival.", email: true, push: true, sms: false },
    ],
  },
  {
    title: "Messages",
    items: [
      { id: "msg-host", label: "Messages from hosts", description: "Direct conversations about your stay.", email: false, push: true, sms: false },
      { id: "msg-support", label: "Support replies", description: "Updates on tickets you've opened.", email: true, push: true, sms: false },
    ],
  },
  {
    title: "Promotions",
    items: [
      { id: "promo-deals", label: "Deals near you", description: "Hand-picked offers in places you save.", email: true, push: false, sms: false },
      { id: "promo-newsletter", label: "Monthly newsletter", description: "Best of Nearby Escapes once a month.", email: false, push: false, sms: false },
    ],
  },
];

export function NotificationsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <Link
          to="/account"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Account
        </Link>

        <header className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Notifications</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">How we reach you</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose channels per category. Critical security alerts are always sent.
          </p>
        </header>

        <div className="mt-8 space-y-4">
          {groups.map((group) => (
            <Card key={group.title} className="border-border/60">
              <CardContent className="p-0">
                <div className="border-b border-border px-5 py-3 grid grid-cols-[1fr_auto_auto_auto] items-center gap-6">
                  <p className="text-sm font-semibold tracking-tight">{group.title}</p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground w-12 text-center">Email</p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground w-12 text-center">Push</p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground w-12 text-center">SMS</p>
                </div>
                {group.items.map((item, idx) => (
                  <div key={item.id}>
                    {idx > 0 && <Separator />}
                    <div className="px-5 py-4 grid grid-cols-[1fr_auto_auto_auto] items-center gap-6">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="w-12 flex justify-center">
                        <Switch defaultChecked={item.email} />
                      </div>
                      <div className="w-12 flex justify-center">
                        <Switch defaultChecked={item.push} />
                      </div>
                      <div className="w-12 flex justify-center">
                        <Switch defaultChecked={item.sms} />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
