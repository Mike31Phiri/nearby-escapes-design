"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bus, MapPin, Clock, Info, 
  ShieldCheck, ArrowRight, Star,
  Wind, Wifi, Battery, Coffee
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function TransportDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 md:px-6 pt-8 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-none font-bold px-3 py-1">Luxury Coach</Badge>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Lusaka to Livingstone</h1>
                <div className="flex items-center gap-6 text-sm font-bold text-muted-foreground">
                  <div className="flex items-center gap-2"><Bus className="h-4 w-4" /> Mazhandu Family Bus</div>
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> 6h 30m duration</div>
                  <div className="flex items-center gap-2 text-foreground"><Star className="h-4 w-4 fill-accent text-accent" /> 4.8 (2.4k reviews)</div>
                </div>
              </div>

              <div className="relative aspect-[21/9] rounded-3xl overflow-hidden border border-border/50 shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=1200&h=500" 
                  alt="Bus Interior" 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm font-bold uppercase tracking-widest opacity-80">Interior View</p>
                  <p className="text-xl font-bold">Luxury Executive Seating</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-border/50">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold">Departure Details</h3>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full border-2 border-primary bg-background" />
                      <div className="w-[2px] h-12 bg-border my-1" />
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    </div>
                    <div className="space-y-4 -mt-1">
                      <div>
                        <p className="font-extrabold">08:30 AM • Intercity Terminus</p>
                        <p className="text-sm text-muted-foreground">Lusaka, Zambia</p>
                      </div>
                      <div>
                        <p className="font-extrabold">03:00 PM • Livingstone Terminus</p>
                        <p className="text-sm text-muted-foreground">Livingstone, Zambia</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold">In-bus Amenities</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Wind, label: "Air Conditioning" },
                      { icon: Wifi, label: "Free Wi-Fi" },
                      { icon: Battery, label: "Charging Ports" },
                      { icon: Coffee, label: "Snacks/Water" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2 text-muted-foreground">
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold tracking-tight">About the Operator</h3>
                <div className="flex items-start gap-6 bg-muted/30 p-8 rounded-3xl border border-border/40">
                  <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center p-2">
                    <Bus className="h-10 w-10 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">Mazhandu Family Bus Services</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                      With over 20 years of experience, Mazhandu Family is Zambia&apos;s leading luxury coach service. Known for safety, punctuality, and comfort, we connect major cities across the country.
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <Badge variant="outline" className="rounded-full gap-1"><ShieldCheck className="h-3 w-3" /> Verified Operator</Badge>
                      <Badge variant="outline" className="rounded-full gap-1"><Clock className="h-3 w-3" /> 98% Punctual</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-32 border-border/60 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                <CardContent className="p-8">
                  <div className="flex items-end justify-between mb-8">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Price per person</p>
                      <span className="text-3xl font-extrabold text-foreground">ZMW 180</span>
                    </div>
                    <Badge className="bg-emerald-500 text-white border-none rounded-full px-4 py-1.5 font-bold">Instant Booking</Badge>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold uppercase text-muted-foreground px-1">Departure Date</label>
                      <input type="date" className="w-full bg-muted/50 border border-border/60 rounded-xl px-4 py-3 font-bold focus:outline-none" defaultValue="2024-05-15" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold uppercase text-muted-foreground px-1">Passengers</label>
                      <div className="flex items-center justify-between bg-muted/50 border border-border/60 rounded-xl px-4 py-3">
                        <span className="font-bold">1 Adult</span>
                        <div className="flex items-center gap-3">
                          <button className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center font-bold">-</button>
                          <span className="font-bold">1</span>
                          <button className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center font-bold">+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link href="/checkout/summary">
                    <Button className="w-full h-14 rounded-2xl bg-[image:var(--gradient-hero)] hover:opacity-95 shadow-lg font-extrabold text-lg flex items-center justify-center gap-2">
                      Book Transport <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5"><ShieldCheck className="h-3 w-3 text-emerald-600" /></div>
                      <div>
                        <p className="text-xs font-bold">Secure Payment</p>
                        <p className="text-[10px] text-muted-foreground">Your booking is protected by Nearby Escapes Guarantee.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5"><Info className="h-3 w-3 text-blue-600" /></div>
                      <div>
                        <p className="text-xs font-bold">Flexible Cancellation</p>
                        <p className="text-[10px] text-muted-foreground">Cancel up to 24 hours before departure for a full refund.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
