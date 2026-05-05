"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, TrendingUp, Users, ArrowRight, Zap, CheckCircle2, Star, MapPin } from "lucide-react";
import Link from "next/link";

export default function BecomeHostPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 font-bold">Start Hosting Today</Badge>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
                  Turn your space into a <span className="text-primary">dream escape</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl max-w-xl leading-relaxed">
                  Join thousands of hosts in Zambia who are earning extra income by sharing their homes, vehicles, and unique local experiences.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link href="/host/create-listing" className="w-full sm:w-auto">
                    <Button className="w-full h-14 rounded-2xl px-12 bg-primary font-extrabold text-lg shadow-xl">
                      Start hosting
                    </Button>
                  </Link>
                  <Link href="/contact" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full h-14 rounded-2xl px-12 border-2 font-extrabold text-lg">
                      Learn more
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-white overflow-hidden bg-muted">
                        <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="Host" />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-bold text-muted-foreground">Join 2,000+ Zambian hosts</p>
                </div>
              </div>
              <div className="relative animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="relative rounded-[40px] overflow-hidden shadow-2xl rotate-3 scale-95 border-8 border-white">
                  <img src="https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&fit=crop&w=800&h=600" alt="Beautiful Room" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl border border-border/40 -rotate-3 hidden md:block">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Earnings</p>
                      <p className="font-extrabold text-xl">ZMW 12,500/mo</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium">Average host earnings in Lusaka</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform origin-top-right -z-10" />
        </section>

        {/* Benefits */}
        <section className="py-24 bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Why host on Nearby Escapes?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We provide the tools and support you need to succeed as a host.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: ShieldCheck, title: "Secure Payments", desc: "Get paid on time, every time. We handle all transactions securely and release funds 24 hours after check-in.", color: "text-blue-600", bg: "bg-blue-50" },
                { icon: Zap, title: "Easy Setup", desc: "Create your listing in minutes with our intuitive step-by-step flow. Upload photos and set your prices instantly.", color: "text-primary", bg: "bg-primary/10" },
                { icon: Users, title: "Local Support", desc: "Our Zambian team is here 24/7 to help you manage your bookings and resolve any issues quickly.", color: "text-indigo-600", bg: "bg-indigo-50" },
              ].map((item) => (
                <Card key={item.title} className="border-border/60 shadow-xl rounded-[32px] p-8 bg-card hover:-translate-y-2 transition-all duration-300">
                  <div className={`h-16 w-16 rounded-2xl ${item.bg} flex items-center justify-center mb-8`}>
                    <item.icon className={`h-8 w-8 ${item.color}`} />
                  </div>
                  <h3 className="text-xl font-extrabold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
             <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">How it works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-border -z-10" />
              {[
                { step: 1, title: "Create a listing", desc: "Share your space, vehicle, or experience with high-quality photos and clear descriptions." },
                { step: 2, title: "Manage bookings", desc: "Accept reservation requests and communicate with guests through our secure messaging system." },
                { step: 3, title: "Get paid", desc: "Payments are processed securely and sent directly to your bank account or mobile money." },
              ].map((item) => (
                <div key={item.step} className="text-center space-y-6">
                  <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-black mx-auto shadow-xl">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="bg-[image:var(--gradient-hero)] rounded-[48px] p-12 md:p-24 text-center text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10 space-y-8">
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">Ready to earn?</h2>
                <p className="text-white/80 text-lg md:text-xl max-w-xl mx-auto">Join the Nearby Escapes host community today and start sharing your amazing Zambian escapes.</p>
                <Link href="/host/create-listing">
                  <Button className="h-16 rounded-2xl px-16 bg-white text-primary hover:bg-white/90 font-black text-xl shadow-2xl">
                    Start Hosting Now
                  </Button>
                </Link>
              </div>
              <Star className="absolute top-10 right-10 h-32 w-32 text-white/10 rotate-12" />
              <MapPin className="absolute bottom-10 left-10 h-32 w-32 text-white/10 -rotate-12" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}
