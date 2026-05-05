"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Users,
  ChevronRight,
  Info
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPackage, packages } from "@/lib/mock-data";

export function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pkgId = params.id as string;
  const pkg = getPackage(pkgId) || packages[0];

  const handleBookNow = () => {
    // Navigate to payment page as requested
    router.push("/booking/payment");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFC]">
      <Navbar />
      <main className="flex-1">
        <header className="relative h-[500px] sm:h-[650px] overflow-hidden">
          <img 
            src={pkg.image} 
            alt={pkg.name} 
            className="absolute inset-0 h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="relative mx-auto max-w-7xl h-full px-4 md:px-6 flex flex-col justify-end pb-20 text-white">
            <Link 
              href="/packages" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors text-sm font-black uppercase tracking-widest"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Packages
            </Link>
            
            <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge className="bg-primary text-white font-black uppercase tracking-widest text-[10px] px-4 py-1.5 rounded-full">
                  All-Inclusive
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-md text-white border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full">
                  {pkg.duration}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-8xl font-black tracking-tight font-display leading-[0.95]">
                {pkg.name}
              </h1>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-lg font-bold">{pkg.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-accent fill-accent" />
                  <span className="text-lg font-black">{pkg.rating} <span className="text-white/60 font-medium">({pkg.reviews} reviews)</span></span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
            {/* Main Content */}
            <div className="space-y-16">
              <section className="animate-in fade-in slide-in-from-left-4 duration-500">
                <h2 className="text-3xl font-black tracking-tight mb-6">About this package</h2>
                <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                  {pkg.description}
                </p>
              </section>

              <section className="animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
                <h2 className="text-3xl font-black tracking-tight mb-8">Package Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {pkg.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-start gap-4 p-6 rounded-[24px] bg-white border border-border/40 shadow-sm">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-primary" strokeWidth={3} />
                      </div>
                      <span className="text-lg font-bold">{highlight}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="animate-in fade-in slide-in-from-left-4 duration-500 delay-200">
                <h2 className="text-3xl font-black tracking-tight mb-8">Itinerary</h2>
                <div className="space-y-6">
                  {pkg.itinerary.map((item) => (
                    <div key={item.day} className="flex gap-6 group">
                      <div className="flex flex-col items-center">
                        <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-black text-lg shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                          {item.day}
                        </div>
                        <div className="w-0.5 flex-1 bg-border/40 my-2" />
                      </div>
                      <div className="pb-8">
                        <h4 className="text-xl font-black mb-2 uppercase tracking-tight">{item.title}</h4>
                        <p className="text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar / Booking Card */}
            <aside className="lg:sticky lg:top-28 self-start animate-in fade-in slide-in-from-right-4 duration-700">
              <Card className="border-border/60 shadow-3xl rounded-[40px] overflow-hidden bg-white border-none ring-1 ring-primary/5">
                <CardContent className="p-10">
                  <div className="mb-8">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Package Price</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-primary">${pkg.price}</span>
                      <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">/ person</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/20">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Duration</p>
                        <p className="text-sm font-bold">{pkg.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/20">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Availability</p>
                        <p className="text-sm font-bold">Group & Private</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleBookNow}
                    className="w-full h-16 rounded-[20px] font-black uppercase tracking-[0.2em] text-xs bg-primary shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-[0.98] group"
                  >
                    Confirm Booking
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={3} />
                  </Button>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span>Secure Payment Guarantee</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                      <Info className="h-4 w-4 text-primary" />
                      <span>Free cancellation up to 7 days before</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8 p-8 rounded-[32px] bg-primary/5 border border-primary/10">
                <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-4">Need help?</h4>
                <p className="text-sm text-muted-foreground font-medium mb-6">Our travel experts can customize this package just for you.</p>
                <Button variant="outline" className="w-full rounded-xl font-bold border-primary/20 text-primary hover:bg-primary hover:text-white">
                  Contact Specialist
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
